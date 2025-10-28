#!/usr/bin/env node
/**
 * Safe DB migration script
 * - Ensures required extensions and tables exist
 * - Does not drop data
 *
 * Usage: npm run db:migrate
 */

import { Client } from "pg";
import { ensureExtensions, ensureTables } from "../../lib/db/migrations";

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

async function main() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("DATABASE_URL must be set");
    process.exit(1);
  }

  const connectionString = withSslmodeRequire(rawUrl);
  const client = new Client({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    await ensureExtensions(client as any);
    await ensureTables(client as any);
    console.log("✓ Migration complete (extensions/tables ensured)");
  } catch (err: any) {
    console.error("Migration failed:", err?.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
