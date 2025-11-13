import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema, updateProfileSchema } from "@shared/schema";
import { uploadPhoto } from "./upload";
import { z } from "zod";
import { pool } from "./db";
import { mapApiError } from "./apiError";
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength, 
  validateAge, 
  registrationSchema, 
  loginSchema,
  getCurrentAgreementVersion,
  loginThrottleManager,
} from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Потрібна авторизація" });
    }
    next();
  };

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
      // Validate request body - email and optional username
      const authSchema = z.object({
        email: z.string().email("Невірний формат email"),
        username: z.string().min(3).max(255).optional(),
      });
      
      const validation = authSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }

      const { email, username } = validation.data;
      
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
        newUser = await storage.createUser({ email, username });
      } catch (dbError: any) {
        console.error("[Auth Check] DB error creating user:", dbError?.message || dbError);
        
        // Handle username conflict specifically
        if (dbError?.message?.includes('username')) {
          return res.status(409).json({ 
            message: "Ім'я користувача вже зайняте. Спробуйте інше." 
          });
        }
        
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

  // POST /api/auth/register - Register new user with password
  app.post("/api/auth/register", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    try {
      // Validate request body
      const validation = registrationSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMessage = validation.error.errors[0]?.message || "Невірні дані реєстрації";
        return res.status(400).json({ message: errorMessage });
      }

      const { email, password, birthDate, termsAccepted } = validation.data;

      // Validate age
      const ageValidation = validateAge(birthDate);
      if (!ageValidation.isValid) {
        return res.status(400).json({ message: ageValidation.error });
      }

      // Validate password strength
      const passwordStrength = validatePasswordStrength(password);
      if (!passwordStrength.isValid) {
        return res.status(400).json({ message: passwordStrength.errors[0] });
      }

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Цей email вже використовується" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user with password
      const newUser = await storage.createUser({
        email,
        username: undefined, // Will be auto-generated
      });

      // Update user with password hash and terms acceptance
      const updatedUser = await storage.updateUser(newUser.id, {
        passwordHash,
        termsAcceptedAt: new Date(),
        lastLoginAt: new Date(),
        loginAttempts: 0,
      } as any);

      // Record registration agreement
      const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
      const userAgent = req.headers['user-agent'];
      await storage.recordRegistrationAgreement(
        newUser.id,
        getCurrentAgreementVersion(),
        ipAddress,
        userAgent,
      );

      // Set session
      (req as any).session.userId = newUser.id;
      (req as any).session.userEmail = email;

      return res.status(201).json({
        success: true,
        userId: newUser.id,
        email: newUser.email,
        username: newUser.username,
      });
    } catch (error: any) {
      console.error("[Auth Register] Error:", error?.message || error);
      const { status, message } = mapApiError(error, "Помилка реєстрації");
      return res.status(status).json({ message });
    }
  });

  // POST /api/auth/login - Login with email and password
  app.post("/api/auth/login", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    try {
      // Validate request body
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0]?.message || "Невірні дані" });
      }

      const { email, password } = validation.data;

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Невірна електронна адреса або пароль" });
      }

      // Check if throttled
      if (loginThrottleManager.isThrottled(user.id)) {
        const secondsUntilReset = loginThrottleManager.getSecondsUntilReset(user.id);
        return res.status(429).json({
          message: `Занадто багато невдалих спроб входу. Спробуйте через ${secondsUntilReset} секунд.`,
        });
      }

      // Check if user has password set
      if (!user.passwordHash) {
        return res.status(401).json({ message: "Невірна електронна адреса або пароль" });
      }

      // Verify password
      const passwordMatch = await verifyPassword(password, user.passwordHash);
      if (!passwordMatch) {
        loginThrottleManager.recordAttempt(user.id);
        return res.status(401).json({ message: "Невірна електронна адреса або пароль" });
      }

      // Reset login attempts and update last login
      loginThrottleManager.resetAttempts(user.id);
      await storage.updateUser(user.id, {
        lastLoginAt: new Date(),
        loginAttempts: 0,
      } as any);

      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.userEmail = email;

      return res.json({
        success: true,
        userId: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (error: any) {
      console.error("[Auth Login] Error:", error?.message || error);
      const { status, message } = mapApiError(error, "Помилка входу");
      return res.status(status).json({ message });
    }
  });

  // GET /api/auth/session - Check if user is logged in
  app.get("/api/auth/session", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    try {
      const userId = (req as any).session?.userId;
      const userEmail = (req as any).session?.userEmail;

      if (!userId) {
        return res.json({ authenticated: false });
      }

      // Verify user still exists
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.json({ authenticated: false });
      }

      return res.json({
        authenticated: true,
        userId: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (error: any) {
      console.error("[Auth Session] Error:", error?.message || error);
      return res.json({ authenticated: false });
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
  app.get("/api/users", requireAuth, async (req, res) => {
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
  app.post("/api/profiles", requireAuth, async (req, res) => {
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

      // Verify user is creating their own profile
      const sessionUserId = (req as any).session?.userId;
      if (sessionUserId !== userId) {
        return res.status(403).json({ message: "Немає доступу до цього профілю" });
      }

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

  app.get("/api/profiles/:userId", requireAuth, async (req, res) => {
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

  app.patch("/api/profiles/:userId", requireAuth, async (req, res) => {
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
