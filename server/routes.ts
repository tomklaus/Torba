import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema } from "@shared/schema";
import { uploadPhoto } from "./upload";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/check", async (req, res) => {
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
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        // User exists - check if profile is complete
        const profile = await storage.getProfileByUserId(user.id);
        return res.json({
          exists: true,
          userId: user.id,
          profileComplete: profile?.isComplete || false,
        });
      }

      // User doesn't exist - create new user
      const newUser = await storage.createUser({ email });
      return res.json({
        exists: false,
        userId: newUser.id,
        profileComplete: false,
      });
    } catch (error: any) {
      console.error("Auth check error:", error);
      return res.status(500).json({ message: "Помилка сервера" });
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
      return res.status(500).json({ message: "Помилка створення профілю" });
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
      return res.status(500).json({ message: "Помилка отримання профілю" });
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

      // Validate update data (partial profile schema)
      const updateProfileSchema = insertProfileSchema.partial();
      
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
      return res.status(500).json({ message: "Помилка оновлення профілю" });
    }
  });

  // Photo upload endpoint with compression, imgbb upload, and NSFW moderation
  const upload = multer({ storage: multer.memoryStorage() });
  
  app.post("/api/upload", upload.array("photos", 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "Файли не надіслано" });
      }

      // Upload each file and collect URLs
      const uploadPromises = req.files.map(async (file) => {
        const { buffer, mimetype } = file;

        // Validate file type
        if (!mimetype.startsWith("image/")) {
          throw new Error("Тільки зображення дозволені");
        }

        // Upload with compression, imgbb storage, and NSFW moderation
        const photoData = await uploadPhoto(buffer, mimetype);
        return photoData.url;
      });

      const urls = await Promise.all(uploadPromises);

      console.log(`[API] Upload successful: ${urls.length} photos`);
      return res.json({ urls });
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
