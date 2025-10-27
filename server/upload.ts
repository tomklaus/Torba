import sharp from "sharp";
import FormData from "form-data";
import { fetch } from "undici";
import * as tf from "@tensorflow/tfjs-node";
import { createRequire } from "module";
import type { PhotoWithNsfw } from "@shared/schema";

// Use createRequire for nsfwjs (CommonJS module in ESM context)
const require = createRequire(import.meta.url);
const nsfwjs = require("nsfwjs");

// NSFW model instance
let nsfwModel: any | null = null;

async function loadNsfwModel() {
  if (!nsfwModel) {
    console.log("[NSFW] Loading model...");
    nsfwModel = await nsfwjs.load();
    console.log("[NSFW] Model loaded successfully");
  }
  return nsfwModel;
}

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

// Moderate image with NSFW detection
async function moderateImage(buffer: Buffer, mimeType: string): Promise<Omit<PhotoWithNsfw, "url">> {
  // Skip NSFW moderation for GIFs (animated GIFs have multiple frames which causes issues)
  if (mimeType === "image/gif") {
    console.log("[NSFW] Skipping moderation for GIF, returning neutral scores");
    return {
      drawingScore: 0,
      hentaiScore: 0,
      neutralScore: 1,
      pornScore: 0,
      sexyScore: 0,
    };
  }

  const model = await loadNsfwModel();
  
  // Convert buffer to tensor
  let image = await tf.node.decodeImage(buffer, 3);
  
  // NSFW.js expects Tensor3D, but decodeImage might return Tensor4D
  // If it's a batch (4D), squeeze to 3D
  if (image.shape.length === 4) {
    image = tf.squeeze(image, [0]) as tf.Tensor3D;
  }
  
  const predictions = await model.classify(image as tf.Tensor3D);
  image.dispose();

  // Convert predictions array to scores object
  const scores: Record<string, number> = {};
  for (const pred of predictions) {
    scores[pred.className] = pred.probability;
  }

  console.log("[NSFW] Moderation results:", scores);

  return {
    drawingScore: scores.Drawing || 0,
    hentaiScore: scores.Hentai || 0,
    neutralScore: scores.Neutral || 0,
    pornScore: scores.Porn || 0,
    sexyScore: scores.Sexy || 0,
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

// Initialize upload module (preload NSFW model)
export async function initializeUpload() {
  try {
    await loadNsfwModel();
    console.log("[Upload] Module initialized with NSFW moderation");
  } catch (error) {
    console.error("[Upload] Failed to initialize:", error);
    throw error;
  }
}
