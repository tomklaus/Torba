import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeUpload } from "./upload";
import fs from "fs";
import path from "path";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Middleware to serve Service Worker files with correct MIME type
app.get(['/sw-dev.js', '/service-worker.js'], (req, res, next) => {
  const filename = req.path.substring(1); // Remove leading slash
  const filepath = path.join(process.cwd(), 'public', filename);
  
  if (fs.existsSync(filepath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    fs.createReadStream(filepath).pipe(res);
  } else {
    next();
  }
});

// Middleware to serve PWA assets (manifest, icons) from public folder
app.get(['/manifest.json', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'], (req, res, next) => {
  const filename = req.path.substring(1); // Remove leading slash
  const filepath = path.join(process.cwd(), 'public', filename);
  
  if (fs.existsSync(filepath)) {
    const contentTypes: Record<string, string> = {
      '.json': 'application/manifest+json; charset=utf-8',
      '.png': 'image/png',
    };
    const ext = path.extname(filename);
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    fs.createReadStream(filepath).pipe(res);
  } else {
    next();
  }
});

(async () => {
  // Initialize upload module (preload NSFW model)
  initializeUpload().catch(err => {
    console.error("[Init] Failed to initialize upload module:", err);
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
