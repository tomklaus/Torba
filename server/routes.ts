import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema, updateProfileSchema } from "@shared/schema";
import { uploadPhoto } from "./upload";
import { z } from "zod";
import { pool } from "./db";
import { mapApiError } from "./apiError";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", async (_req, res) => {
    const node = process.version;
    let db: "connected" | "unavailable" = "unavailable";
    try {
      const timeoutMs = 2000;
      await Promise.race([
        pool.query("select 1"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeoutMs)),
      ]);
      db = "connected";
    } catch (_err) {
      db = "unavailable";
    }
    res.json({ status: "ok", node, db });
  });

  // Auth endpoints
  // GET /api/auth/check - returns authentication status without modifying state
  app.get("/api/auth/check", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    let timeoutId: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise((_, reject) => {
      const error = new Error("database connectivity timeout");
      (error as any).code = "ETIMEDOUT";
      timeoutId = setTimeout(() => reject(error), 2_000);
    });

    try {
      await Promise.race([pool.query("select 1"), timeoutPromise]);

      return res.json({
        authenticated: false,
        message: "Використовуйте POST запит з email для авторизації",
      });
    } catch (error: any) {
      const { status, message } = mapApiError(error, "Сервіс тимчасово недоступний");

      if (status === 503) {
        console.warn("[Auth Check GET] Database unavailable:", error?.message || error);
        res.setHeader("Retry-After", "5");
        return res.status(503).json({
          authenticated: false,
          status: "degraded",
          reason: "database_unavailable",
          message,
        });
      }

      console.error("[Auth Check GET] Unexpected error:", error?.message || error);
      return res.status(status).json({
        authenticated: false,
        message,
      });
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  });

  // POST /api/auth/check - validates email and creates/fetches user
  app.post("/api/auth/check", async (req, res) => {
    // Set response headers for no caching
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    try {
      // Validate request body
      const authSchema = z.object({
        email: z.string().email("Невірний формат email"),
      });
      
      const validation = authSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }

      const { email } = validation.data;
      
      // Wrap DB operations in try/catch to ensure resilience
      let user;
      try {
        user = await storage.getUserByEmail(email);
      } catch (dbError: any) {
        console.error("[Auth Check] DB error fetching user:", dbError?.message || dbError);
        const { status, message } = mapApiError(dbError, "База даних недоступна");
        return res.status(status).json({ message });
      }
      
      if (user) {
        // User exists - check if profile is complete
        let profile;
        try {
          profile = await storage.getProfileByUserId(user.id);
        } catch (dbError: any) {
          console.error("[Auth Check] DB error fetching profile:", dbError?.message || dbError);
          // If profile fetch fails, assume profile is incomplete
          return res.json({
            exists: true,
            userId: user.id,
            profileComplete: false,
          });
        }
        
        return res.json({
          exists: true,
          userId: user.id,
          profileComplete: profile?.isComplete || false,
        });
      }

      // User doesn't exist - create new user
      let newUser;
      try {
        newUser = await storage.createUser({ email });
      } catch (dbError: any) {
        console.error("[Auth Check] DB error creating user:", dbError?.message || dbError);
        const { status, message } = mapApiError(dbError, "Помилка створення користувача");
        return res.status(status).json({ message });
      }
      
      return res.json({
        exists: false,
        userId: newUser.id,
        profileComplete: false,
      });
    } catch (error: any) {
      // Catch-all for any unexpected errors
      console.error("[Auth Check] Unexpected error:", error?.message || error, error?.stack);
      // Return 500 for unexpected non-DB errors
      return res.status(500).json({ 
        message: "Тимчасова помилка сервера. Спробуйте ще раз." 
      });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Destroy session if exists
      if ((req as any).session) {
        (req as any).session.destroy((err: any) => {
          if (err) {
            console.error("Session destroy error:", err);
          }
        });
      }
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Помилка виходу" });
    }
  });

  // Users endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const excludeUserId = req.query.excludeUserId as string | undefined;
      const users = await storage.getAllUsersWithProfiles(excludeUserId);
      return res.json(users);
    } catch (error: any) {
      console.error("Users fetch error:", error);
      const { status, message } = mapApiError(error, "Помилка отримання користувачів");
      return res.status(status).json({ message });
    }
  });

  // Profile endpoints
  app.post("/api/profiles", async (req, res) => {
    try {
      // Validate request body with insertProfileSchema + userId
      const createProfileSchema = insertProfileSchema.extend({
        userId: z.string().uuid("userId має бути UUID"),
      });
      
      const validation = createProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Невірні дані профілю",
          errors: validation.error.errors,
        });
      }

      const { userId, ...profileData } = validation.data;

      // Validate user exists
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "Користувача не знайдено" });
      }

      // Create profile (isComplete and currentStep have defaults in schema)
      const profile = await storage.createProfile({
        userId,
        ...profileData,
      });

      return res.status(201).json(profile);
    } catch (error: any) {
      console.error("Profile creation error:", error);
      const { status, message } = mapApiError(error, "Помилка створення профілю");
      return res.status(status).json({ message });
    }
  });

  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({ message: "Профіль не знайдено" });
      }

      return res.json(profile);
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      const { status, message } = mapApiError(error, "Помилка отримання профілю");
      return res.status(status).json({ message });
    }
  });

  app.patch("/api/profiles/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Validate UUID format
      const uuidSchema = z.string().uuid();
      const uuidValidation = uuidSchema.safeParse(userId);
      if (!uuidValidation.success) {
        return res.status(400).json({ message: "Невірний формат userId" });
      }

      // Validate update data using updateProfileSchema from shared/schema.ts
      const validation = updateProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Невірні дані оновлення",
          errors: validation.error.errors,
        });
      }

      const updatedProfile = await storage.updateProfile(userId, validation.data);

      if (!updatedProfile) {
        return res.status(404).json({ message: "Профіль не знайдено" });
      }

      return res.json(updatedProfile);
    } catch (error: any) {
      console.error("Profile update error:", error);
      const { status, message } = mapApiError(error, "Помилка оновлення профілю");
      return res.status(status).json({ message });
    }
  });

  // Photo upload endpoint with compression, imgbb upload, and NSFW moderation
  const upload = multer({ storage: multer.memoryStorage() });
  
  app.post("/api/upload", upload.single("photo"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Файл не надіслано" });
      }

      const { buffer, mimetype } = req.file;

      // Validate file type
      if (!mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Тільки зображення дозволені" });
      }

      // Upload with compression, imgbb storage, and NSFW moderation
      const photoData = await uploadPhoto(buffer, mimetype);

      console.log(`[API] Upload successful: ${photoData.url}`);
      return res.json(photoData);
    } catch (error: any) {
      console.error("[API] Upload error:", error);
      return res.status(500).json({ 
        message: error.message || "Помилка завантаження фото" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
