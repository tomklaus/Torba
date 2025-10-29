import type { Express } from "express";
import fs from "fs";
import path from "path";

const DEFAULT_PWA_ASSETS = [
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/favicon.png",
];

const DEFAULT_SERVICE_WORKER_ASSETS = [
  "/sw-dev.js",
  "/service-worker.js",
];

type RegisterOptions = {
  rootDir?: string;
  assetRoots?: string[];
};

function getCandidateRoots(rootDir: string, override?: string[]) {
  const resolvedRoots = override ?? [
    path.join(rootDir, "dist", "public"),
    path.join(rootDir, "public"),
    path.join(rootDir, "client", "public"),
  ];

  const uniqueRoots = new Set<string>();
  for (const entry of resolvedRoots) {
    uniqueRoots.add(path.resolve(entry));
  }

  return Array.from(uniqueRoots);
}

function resolveAssetPath(filename: string, roots: string[]) {
  for (const root of roots) {
    const candidate = path.join(root, filename);
    if (!fs.existsSync(candidate)) {
      continue;
    }

    try {
      if (fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function safeFilename(requestPath: string) {
  const sanitized = requestPath.startsWith("/")
    ? requestPath.slice(1)
    : requestPath;

  if (sanitized.includes("..")) {
    throw new Error(`Invalid asset path request: ${requestPath}`);
  }

  return sanitized;
}

export function registerPwaAssetRoutes(app: Express, options: RegisterOptions = {}) {
  const rootDir = options.rootDir ?? process.cwd();
  const assetRoots = getCandidateRoots(rootDir, options.assetRoots);

  app.get(DEFAULT_PWA_ASSETS, (req, res, next) => {
    let filename: string;
    try {
      filename = safeFilename(req.path);
    } catch (error) {
      return next(error);
    }

    const assetPath = resolveAssetPath(filename, assetRoots);
    if (!assetPath) {
      return next();
    }

    const ext = path.extname(filename);
    const contentType = ext === ".json" ? "application/manifest+json" : "image/png";

    res.setHeader("Content-Type", contentType);
    res.sendFile(assetPath, (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

export function registerServiceWorkerAssetRoutes(
  app: Express,
  options: RegisterOptions = {},
) {
  const rootDir = options.rootDir ?? process.cwd();
  const assetRoots = getCandidateRoots(rootDir, options.assetRoots);

  app.get(DEFAULT_SERVICE_WORKER_ASSETS, (req, res, next) => {
    let filename: string;
    try {
      filename = safeFilename(req.path);
    } catch (error) {
      return next(error);
    }

    const assetPath = resolveAssetPath(filename, assetRoots);
    if (!assetPath) {
      return next();
    }

    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Service-Worker-Allowed", "/");

    res.sendFile(assetPath, (err) => {
      if (err) {
        next(err);
      }
    });
  });
}
