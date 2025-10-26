import sharp from "sharp";
import FormData from "form-data";
import { fetch } from "undici";
import type { PhotoWithNsfw } from "@shared/schema";

// TODO: Enable NSFW moderation when nsfwjs ESM issue is resolved
// For now, returning placeholder scores
const NSFW_ENABLED = false;

// Compress image to max 800px on longest side
async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  // Skip compression for GIFs
  if (mimeType === "image/gif") {
    console.log("[Compress] Skipping GIF compression");
    return buffer;
  }

  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error("Cannot read image dimensions");
  }

  const maxDimension = Math.max(metadata.width, metadata.height);
  
  // Only compress if larger than 800px
  if (maxDimension > 800) {
    const scale = 800 / maxDimension;
    const newWidth = Math.round(metadata.width * scale);
    const newHeight = Math.round(metadata.height * scale);
    
    console.log(`[Compress] Resizing from ${metadata.width}x${metadata.height} to ${newWidth}x${newHeight}`);
    
    return await image
      .resize(newWidth, newHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 }) // High quality JPEG
      .toBuffer();
  }

  console.log(`[Compress] Image already small enough (${metadata.width}x${metadata.height})`);
  return buffer;
}

// Upload to imgbb.com
async function uploadToImgbb(buffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY not configured");
  }

  const formData = new FormData();
  formData.append("image", buffer.toString("base64"));
  
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[ImgBB] Upload failed:", errorText);
    throw new Error(`ImgBB upload failed: ${response.statusText}`);
  }

  const data = await response.json() as any;
  
  if (!data.success || !data.data?.url) {
    throw new Error("ImgBB response invalid");
  }

  console.log("[ImgBB] Upload successful:", data.data.url);
  return data.data.url;
}

// Moderate image with NSFW detection
async function moderateImage(buffer: Buffer): Promise<Omit<PhotoWithNsfw, "url">> {
  if (!NSFW_ENABLED) {
    // Return placeholder scores until NSFW moderation is enabled
    console.log("[NSFW] Moderation disabled - returning placeholder scores");
    return {
      drawingScore: 0,
      hentaiScore: 0,
      neutralScore: 1.0, // Assume neutral by default
      pornScore: 0,
      sexyScore: 0,
    };
  }

  // TODO: Implement NSFW detection when nsfwjs ESM compatibility is fixed
  // Original implementation:
  // 1. Load nsfwjs model
  // 2. Decode buffer to tensor
  // 3. Classify with model.classify()
  // 4. Return scores
  
  return {
    drawingScore: 0,
    hentaiScore: 0,
    neutralScore: 1.0,
    pornScore: 0,
    sexyScore: 0,
  };
}

// Main upload function
export async function uploadPhoto(
  buffer: Buffer,
  mimeType: string
): Promise<PhotoWithNsfw> {
  console.log(`[Upload] Processing image (${mimeType}, ${buffer.length} bytes)`);

  // Step 1: Compress if needed
  const compressedBuffer = await compressImage(buffer, mimeType);

  // Step 2: Upload to ImgBB
  const url = await uploadToImgbb(compressedBuffer, mimeType);

  // Step 3: NSFW moderation
  const nsfwScores = await moderateImage(compressedBuffer);

  return {
    url,
    ...nsfwScores,
  };
}

// Initialize upload module
export async function initializeUpload() {
  if (NSFW_ENABLED) {
    console.log("[Upload] NSFW moderation will be enabled");
    // TODO: Preload NSFW model when implemented
  } else {
    console.log("[Upload] NSFW moderation disabled - using placeholder scores");
  }
  console.log("[Upload] Module initialized");
}
