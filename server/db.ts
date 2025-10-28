import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

type GlobalWithDb = typeof globalThis & {
  __dbPool?: InstanceType<typeof Pool>;
};

const globalForDb = globalThis as GlobalWithDb;

function withSslmodeRequire(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("sslmode")) {
      u.searchParams.set("sslmode", "require");
    }
    return u.toString();
  } catch {
    return url;
  }
}

function createPool(): InstanceType<typeof Pool> {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  const connectionString = withSslmodeRequire(rawUrl);

  // Configure SSL automatically for non-local hosts
  let ssl: false | { rejectUnauthorized: boolean } = false;
  try {
    const u = new URL(connectionString);
    const host = u.hostname;
    const sslmode = u.searchParams.get("sslmode");
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local");
    if (!isLocal && sslmode !== "disable") {
      ssl = { rejectUnauthorized: false };
    }
  } catch {
    // ignore parsing errors; fallback to default
  }

  const pool = new Pool({ connectionString, ssl: ssl || undefined });

  // Non-fatal health probe at boot
  void (async () => {
    try {
      await Promise.race([
        pool.query("select 1"),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 3000),
        ),
      ]);
      console.log("[DB] Postgres TCP connectivity check: OK");
    } catch (err: any) {
      console.warn(
        "[DB] Connectivity check failed (non-fatal):",
        err?.message || err,
      );
    }
  })();

  return pool;
}

if (!globalForDb.__dbPool) {
  globalForDb.__dbPool = createPool();
}

export const pool = globalForDb.__dbPool!;
export const db = drizzle(pool, { schema });
