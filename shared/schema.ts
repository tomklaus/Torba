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
  
  // Крок 8: Додаткові опціональні поля (Четверта сторінка)
  aboutMe: text("about_me"), // До 500 символів
  lookingFor: text("looking_for"), // До 500 символів
  bodyType: text("body_type"), // Худий, Стрункий, Спортивний, Мускулистий, Середній, Кремезний, Повний
  relationshipStatus: text("relationship_status"), // Вільний, У стосунках, У вільних стосунках, У шлюбі, Розлучений
  interests: jsonb("interests").notNull().default(sql`'[]'`).$type<string[]>(), // Масив тегів інтересів
  hivStatus: text("hiv_status"), // Негативний, Негативний (на PrEP), Позитивний (U=U), Позитивний, Не знаю
  alcoholUse: text("alcohol_use"), // Зовсім не вживаю, Соціально, Лише по вихідних, Часто
  smoking: text("smoking"), // Не курю і не люблю дим, Не курю але нейтрально, Іноді в компанії, Курю регулярно, Вейп/IQOS, Тільки кальян, 420 friendly, Кидаю курити
  languages: jsonb("languages").notNull().default(sql`'[]'`).$type<string[]>(), // Українська, Англійська, Польська, Німецька, тощо
  
  // Крок 9: Контактна інформація (П'ята сторінка)
  instagram: text("instagram"),
  spotify: text("spotify"),
  tiktok: text("tiktok"),
  telegram: text("telegram"),
  twitter: text("twitter"),
  contactEmail: text("contact_email"), // Не та що для реєстрації
  phoneNumber: text("phone_number"),
  
  // Крок 10: Сексуальний профіль (Шоста сторінка)
  sexExperience: text("sex_experience"), // Початківець, Середній, Досвідчений, Експерт
  condomAttitude: text("condom_attitude"), // Завжди, Зазвичай, Іноді, Ніколи
  circumcision: text("circumcision"), // Обрізаний, Необрізаний
  favoritePositions: jsonb("favorite_positions").notNull().default(sql`'[]'`).$type<string[]>(), // Місіонерська, Ззаду, Наїзник, На боці, Стоячи
  sexFrequency: text("sex_frequency"), // Щоденно, Кілька разів на тиждень, тощо
  groupSex: text("group_sex"), // Люблю, Іноді, Ні, Хочу але ще не робив, Спостерігач
  substancesAttitude: text("substances_attitude"), // Ні (тверезий секс), Іноді (легкі поперси), Так (сильніші речовини)
  favoriteActivities: jsonb("favorite_activities").notNull().default(sql`'[]'`).$type<string[]>(), // Масив активностей
  toysAccessories: jsonb("toys_accessories").notNull().default(sql`'[]'`).$type<string[]>(), // Вібратори, Анальні пробки, тощо
  meetingPlaces: jsonb("meeting_places").notNull().default(sql`'[]'`).$type<string[]>(), // Дома, Готель, Сауна/Клуб, Природа
  afterSex: jsonb("after_sex").notNull().default(sql`'[]'`).$type<string[]>(), // Обійми/Розмова, Швидкий душ, Ніч разом, Нічого
  fetishes: jsonb("fetishes").notNull().default(sql`'[]'`).$type<string[]>(), // Ведмеді, Шкіра, Уніформа, тощо
  bdsmRoles: jsonb("bdsm_roles").notNull().default(sql`'[]'`).$type<string[]>(), // Домінант, Сабмісив, Світч, тощо
  
  // Системні поля
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

export const updateProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
  updatedAt: true,
}).partial();

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

export const step8Schema = z.object({
  aboutMe: z.string().max(500, "Максимум 500 символів").optional(),
  lookingFor: z.string().max(500, "Максимум 500 символів").optional(),
  bodyType: z.string().optional(),
  relationshipStatus: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hivStatus: z.string().optional(),
  alcoholUse: z.string().optional(),
  smoking: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export const step9Schema = z.object({
  instagram: z.string().optional(),
  spotify: z.string().optional(),
  tiktok: z.string().optional(),
  telegram: z.string().optional(),
  twitter: z.string().optional(),
  contactEmail: z.string().email("Невірний формат email").or(z.literal("")).optional(),
  phoneNumber: z.string().optional(),
});

export const step10Schema = z.object({
  sexExperience: z.string().optional(),
  condomAttitude: z.string().optional(),
  circumcision: z.string().optional(),
  favoritePositions: z.array(z.string()).optional(),
  sexFrequency: z.string().optional(),
  groupSex: z.string().optional(),
  substancesAttitude: z.string().optional(),
  favoriteActivities: z.array(z.string()).optional(),
  toysAccessories: z.array(z.string()).optional(),
  meetingPlaces: z.array(z.string()).optional(),
  afterSex: z.array(z.string()).optional(),
  fetishes: z.array(z.string()).optional(),
  bdsmRoles: z.array(z.string()).optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step8Data = z.infer<typeof step8Schema>;
export type Step9Data = z.infer<typeof step9Schema>;
export type Step10Data = z.infer<typeof step10Schema>;
