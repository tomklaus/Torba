import { type User, type InsertUser, type Profile, type InsertProfile, users, profiles } from "@shared/schema";
import { db } from "./db";
import { eq, ne } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsersWithProfiles(excludeUserId?: string): Promise<Array<User & { profile: Profile | null }>>;
  
  // Profile methods
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: Omit<InsertProfile, "id">): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getAllUsersWithProfiles(excludeUserId?: string): Promise<Array<User & { profile: Profile | null }>> {
    const query = db
      .select({
        user: users,
        profile: profiles,
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId));

    const results = excludeUserId 
      ? await query.where(ne(users.id, excludeUserId))
      : await query;

    return results.map((row) => ({
      ...row.user,
      profile: row.profile,
    }));
  }

  // Profile methods
  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }

  async createProfile(profile: Omit<InsertProfile, "id">): Promise<Profile> {
    const result = await db.insert(profiles).values(profile as any).returning();
    return result[0];
  }

  async updateProfile(userId: string, profileUpdate: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles)
      .set({ ...profileUpdate, updatedAt: new Date() } as any)
      .where(eq(profiles.userId, userId))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
