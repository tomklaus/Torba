import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema } from "@shared/schema";
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

      // Create profile
      const profile = await storage.createProfile({
        userId,
        ...profileData,
        isComplete: true,
        currentStep: 7,
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

      // Validate update data (partial profile schema, excluding immutable fields)
      const updateProfileSchema = insertProfileSchema
        .omit({ 
          userId: true, // Cannot change user relationship
        })
        .partial();
      
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

  // Photo upload endpoint (mock for now - real implementation in future)
  app.post("/api/upload", async (req, res) => {
    try {
      // TODO: Implement real file upload with multer + cloud storage
      // For now, return mock URLs
      const { type } = req.body; // "public" or "private"
      const timestamp = Date.now();
      const mockUrl = `/uploads/${type}/${timestamp}_mock.jpg`;
      
      return res.json({ url: mockUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Помилка завантаження фото" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
