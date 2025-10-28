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

  // Determine SSL configuration with sensible defaults for Railway
  let ssl: false | { rejectUnauthorized: boolean } = false;
  let reason = "default";
  try {
    const u = new URL(connectionString);
    const host = u.hostname;
    const sslmodeParam = (u.searchParams.get("sslmode") || "").toLowerCase();
    const envPgSslMode = (process.env.PGSSLMODE || "").toLowerCase();
    const envDbSsl = (process.env.DATABASE_SSL || "").toLowerCase();

    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local");

    // Environment overrides take precedence
    if (envPgSslMode) {
      if (envPgSslMode === "disable") {
        ssl = false;
        reason = "PGSSLMODE=disable";
      } else if (["require", "allow", "prefer"].includes(envPgSslMode)) {
        ssl = { rejectUnauthorized: false };
        reason = `PGSSLMODE=${envPgSslMode}`;
      } else if (["verify-ca", "verifyfull", "verify-full"].includes(envPgSslMode)) {
        ssl = { rejectUnauthorized: true };
        reason = `PGSSLMODE=${envPgSslMode}`;
      }
    } else if (envDbSsl) {
      if (["0", "false", "off", "disable", "no"].includes(envDbSsl)) {
        ssl = false;
        reason = "DATABASE_SSL=disable";
      } else {
        // treat any truthy value as require
        ssl = { rejectUnauthorized: false };
        reason = `DATABASE_SSL=${envDbSsl}`;
      }
    } else {
      // Auto-detect based on host/connection string
      if (isLocal || sslmodeParam === "disable") {
        ssl = false;
        reason = isLocal ? "local host" : "sslmode=disable";
      } else {
        // Managed PG providers (e.g., Railway) typically require TLS with self-signed certs
        ssl = { rejectUnauthorized: false };
        reason = "non-local host";
      }
    }

    if (ssl) {
      console.log(
        `[DB] SSL enabled for host ${host} (${reason}); rejectUnauthorized=${String(
          (ssl as any).rejectUnauthorized,
        )}`,
      );
    } else {
      console.log(`[DB] SSL disabled for host ${host} (${reason})`);
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
