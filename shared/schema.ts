import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Type для фото з NSFW модерацією
export type PhotoWithNsfw = {
  url: string;
  drawingScore: number;
  hentaiScore: number;
  neutralScore: number;
  pornScore: number;
  sexyScore: number;
};

// Users table - для авторізації
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Profiles table - вся інформація профілю з 7 кроків реєстрації
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Крок 1: Обов'язкові поля
  name: varchar("name", { length: 50 }).notNull(),
  birthDate: date("birth_date").notNull(),
  city: text("city").notNull(),
  customCity: text("custom_city"), // Якщо не знайшов у довіднику
  height: integer("height").notNull(), // в см
  weight: integer("weight").notNull(), // в кг
  penisSize: integer("penis_size").notNull(), // в см
  sexRole: text("sex_role").notNull(), // Актив, Уні-актив, Універсал, Уні-пасив, Пасив, Тільки орал, Секс не цікавить
  datingGoals: jsonb("dating_goals").notNull().$type<string[]>(), // Масив цілей
  
  // Крок 2: Комерція
  commerceType: text("commerce_type").notNull(), // "no" | "yes" | "commerce_only"
  
  // Кроки 3-6: Комерційні налаштування (якщо commerceType = "yes" або "commerce_only")
  // Блок 1: Формати послуг та роль
  serviceFormats: jsonb("service_formats").notNull().default(sql`'[]'`).$type<string[]>(),
  commerceSexRole: text("commerce_sex_role"),
  
  // Блок 2: Локація та графік
  locationFormats: jsonb("location_formats").notNull().default(sql`'[]'`).$type<string[]>(),
  travelGeography: jsonb("travel_geography").notNull().default(sql`'[]'`).$type<string[]>(),
  availability: jsonb("availability").notNull().default(sql`'[]'`).$type<string[]>(),
  minNotice: text("min_notice"),
  minDuration: text("min_duration"),
  customDuration: text("custom_duration"),
  
  // Блок 3: Безпека, межі та умови
  meetingConditions: jsonb("meeting_conditions").notNull().default(sql`'[]'`).$type<string[]>(),
  healthSafety: jsonb("health_safety").notNull().default(sql`'[]'`).$type<string[]>(),
  lastStdTest: text("last_std_test"),
  photoVideoConsent: text("photo_video_consent"),
  myLimits: text("my_limits"),
  comfortConditions: text("comfort_conditions"),
  
  // Блок 4: Фінансові умови
  rate1h: integer("rate_1h"),
  rate2h: integer("rate_2h"),
  rateNight: integer("rate_night"),
  travelFee: integer("travel_fee"),
  cancellationFee: integer("cancellation_fee"),
  paymentMethods: jsonb("payment_methods").notNull().default(sql`'[]'`).$type<string[]>(),
  transportCosts: text("transport_costs"),
  
  // Крок 7: Фото галереї (URLs + NSFW теги)
  publicPhotos: jsonb("public_photos").notNull().default(sql`'[]'`).$type<PhotoWithNsfw[]>(),
  privatePhotos: jsonb("private_photos").notNull().default(sql`'[]'`).$type<PhotoWithNsfw[]>(),
  
  // Додаткові поля
  isComplete: boolean("is_complete").notNull().default(false), // Чи завершена реєстрація
  currentStep: integer("current_step").notNull().default(1), // Поточний крок реєстрації
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas для валідації
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  updatedAt: true,
  isComplete: true,
  currentStep: true,
});

// Schemas для кроків реєстрації
export const step1Schema = z.object({
  name: z.string().min(1, "Ім'я обов'язкове").max(50, "Максимум 50 символів"),
  birthDate: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18 && age <= 100;
  }, "Вік має бути від 18 до 100 років"),
  city: z.string().min(1, "Оберіть місто"),
  customCity: z.string().optional(),
  height: z.coerce.number().min(100, "Мінімум 100 см").max(250, "Максимум 250 см"),
  weight: z.coerce.number().min(30, "Мінімум 30 кг").max(300, "Максимум 300 кг"),
  penisSize: z.coerce.number().min(1, "Вкажіть розмір").max(50, "Максимум 50 см"),
  sexRole: z.string().min(1, "Оберіть роль"),
  datingGoals: z.array(z.string()).min(1, "Оберіть хоча б одну ціль"),
});

export const step2Schema = z.object({
  commerceType: z.enum(["no", "yes", "commerce_only"]),
});

export const step3Schema = z.object({
  serviceFormats: z.array(z.string()).optional(),
  commerceSexRole: z.string().optional(),
});

export const step4Schema = z.object({
  locationFormats: z.array(z.string()).optional(),
  travelGeography: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
  minNotice: z.string().optional(),
  minDuration: z.string().optional(),
  customDuration: z.string().optional(),
});

export const step5Schema = z.object({
  meetingConditions: z.array(z.string()).optional(),
  healthSafety: z.array(z.string()).optional(),
  lastStdTest: z.string().optional(),
  photoVideoConsent: z.string().optional(),
  myLimits: z.string().optional(),
  comfortConditions: z.string().optional(),
});

export const step6Schema = z.object({
  rate1h: z.coerce.number().optional(),
  rate2h: z.coerce.number().optional(),
  rateNight: z.coerce.number().optional(),
  travelFee: z.coerce.number().optional(),
  cancellationFee: z.coerce.number().optional(),
  paymentMethods: z.array(z.string()).optional(),
  transportCosts: z.string().optional(),
});

export const step7Schema = z.object({
  publicPhotos: z.array(z.string()).min(1, "Додайте хоча б 1 фото"),
  privatePhotos: z.array(z.string()).default([]),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
