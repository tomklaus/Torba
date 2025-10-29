import express from "express";
import request from "supertest";
import path from "path";
import {
  registerPwaAssetRoutes,
  registerServiceWorkerAssetRoutes,
} from "../../server/pwaAssets";

async function verifyManifest() {
  const app = express();
  const projectRoot = path.resolve(import.meta.dirname, "..", "..");

  registerServiceWorkerAssetRoutes(app, { rootDir: projectRoot });
  registerPwaAssetRoutes(app, { rootDir: projectRoot });

  const response = await request(app).get("/manifest.json").expect(200);

  const contentType = response.headers["content-type"] ?? "";
  if (!contentType.includes("application/manifest+json")) {
    throw new Error(
      `Manifest served with unexpected content-type: ${contentType || "<missing>"}`,
    );
  }

  const manifestText = response.text;
  if (manifestText.startsWith("\ufeff")) {
    throw new Error("Manifest response contains a UTF-8 BOM prefix");
  }

  try {
    JSON.parse(manifestText);
  } catch (error) {
    throw new Error(`Manifest JSON is invalid: ${(error as Error).message}`);
  }

  console.log("✅ Manifest JSON is valid and served with the expected content-type.");
}

verifyManifest().catch((error) => {
  console.error("❌ Manifest verification failed:", error);
  process.exitCode = 1;
});
