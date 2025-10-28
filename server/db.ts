import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

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
    host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
  if (!isLocal && sslmode !== "disable") {
    ssl = { rejectUnauthorized: false };
  }
} catch {
  // ignore parsing errors; fallback to default
}

export const pool = new Pool({ connectionString, ssl: ssl || undefined });

// Non-fatal health probe at boot
(async () => {
  try {
    await Promise.race([
      pool.query("select 1"),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
    ]);
    console.log("[DB] Postgres TCP connectivity check: OK");
  } catch (err: any) {
    console.warn("[DB] Connectivity check failed (non-fatal):", err?.message || err);
  }
})();

export const db = drizzle(pool, { schema });
