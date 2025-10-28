import sharp from "sharp";
import type { PhotoWithNsfw } from "@shared/schema";
import { getTf, getNsfwModel, initializeTFAndModel } from "./nsfw";

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

  console.log(`[ImgBB] Uploading image, buffer size: ${buffer.length} bytes, mimeType: ${mimeType}`);

  // ImgBB accepts base64 string in the "image" parameter
  const base64Image = buffer.toString("base64");

  // Use URLSearchParams for application/x-www-form-urlencoded
  const params = new URLSearchParams();
  params.append("image", base64Image);
  
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[ImgBB] Upload failed:", errorText);
    throw new Error(`ImgBB upload failed: ${response.statusText}`);
  }

  const data = await response.json() as any;
  
  if (!data.success || !data.data?.url) {
    console.error("[ImgBB] Invalid response:", data);
    throw new Error("ImgBB response invalid");
  }

  console.log("[ImgBB] Upload successful:", data.data.url);
  return data.data.url;
}

// Moderate image with NSFW detection using NsfwSpy
async function moderateImage(buffer: Buffer, mimeType: string): Promise<Omit<PhotoWithNsfw, "url">> {
  const model = await getNsfwModel();
  const tf = await getTf();
  
  // For GIFs, extract middle frame first
  let processBuffer = buffer;
  
  if (mimeType === "image/gif") {
    const image = await tf.node.decodeImage(buffer, 3);
    
    if (image.shape.length === 4) {
      const numFrames = image.shape[0];
      const middleFrame = Math.floor(numFrames / 2);
      
      console.log(`[NSFW] GIF detected with ${numFrames} frames, extracting frame ${middleFrame} for moderation`);
      
      // Extract single frame
      const singleFrame = image.slice([middleFrame, 0, 0, 0], [1, -1, -1, -1]);
      const frame3D = tf.squeeze(singleFrame, [0]) as any;
      
      // Convert tensor back to buffer (JPEG format for NsfwSpy)
      const encodedImage = await tf.node.encodeJpeg(frame3D);
      processBuffer = Buffer.from(encodedImage.buffer);
      
      image.dispose();
      singleFrame.dispose();
      frame3D.dispose();
    } else {
      image.dispose();
    }
  }
  
  // Classify using NsfwSpy (returns: { pornography, sexy, hentai, neutral })
  const result = await model.classifyImageFromByteArray(processBuffer);

  console.log("[NSFW] NsfwSpy moderation results:", result);

  // Map NsfwSpy categories to our schema (NsfwSpy doesn't have "Drawing" category)
  return {
    drawingScore: 0, // NsfwSpy doesn't classify drawings separately
    hentaiScore: result.hentai || 0,
    neutralScore: result.neutral || 0,
    pornScore: result.pornography || 0,
    sexyScore: result.sexy || 0,
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

  // Step 3: NSFW moderation (use original buffer for GIFs to get all frames)
  const nsfwScores = await moderateImage(mimeType === "image/gif" ? buffer : compressedBuffer, mimeType);

  return {
    url,
    ...nsfwScores,
  };
}

// Initialize upload module (preload NSFW model)
export async function initializeUpload() {
  try {
    await initializeTFAndModel();
    console.log("[Upload] Module initialized with NSFW moderation");
  } catch (error) {
    console.error("[Upload] Failed to initialize:", error);
    throw error;
  }
}
