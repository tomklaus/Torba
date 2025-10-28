import path from "path";
import { fileURLToPath } from "url";
import { NsfwSpy } from "@nsfwspy/node";

// Reduce TensorFlow native logging unless explicitly overridden
if (!process.env.TF_CPP_MIN_LOG_LEVEL) {
  process.env.TF_CPP_MIN_LOG_LEVEL = "2"; // only errors
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tfPromise: Promise<typeof import("@tensorflow/tfjs-node")> | null = null;
let nsfwModel: NsfwSpy | null = null;
let nsfwInitPromise: Promise<NsfwSpy> | null = null;

export async function getTf() {
  if (!tfPromise) {
    tfPromise = import("@tensorflow/tfjs-node").then((mod) => {
      console.log("[TFJS] @tensorflow/tfjs-node backend initialized");
      return mod;
    });
  }
  return tfPromise;
}

export async function getNsfwModel(): Promise<NsfwSpy> {
  if (nsfwModel) return nsfwModel;
  if (nsfwInitPromise) return nsfwInitPromise;

  nsfwInitPromise = (async () => {
    console.log("[NSFW] Loading NsfwSpy model...");
    const modelPath = path.join(__dirname, "../models/nsfwspy/model.json");
    const model = new NsfwSpy(`file://${modelPath}`);
    await model.load();
    nsfwModel = model;
    console.log("[NSFW] NsfwSpy model loaded successfully (singleton)");
    return model;
  })();

  return nsfwInitPromise;
}

export async function initializeTFAndModel() {
  await getTf();
  await getNsfwModel();
}
