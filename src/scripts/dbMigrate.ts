#!/usr/bin/env node
/**
 * Safe DB migration script
 * - Ensures required extensions and tables exist
 * - Does not drop data
 *
 * Usage: npm run db:migrate
 */

import pg from "pg";
import { ensureExtensions, ensureTables } from "../../lib/db/migrations";

const { Client } = pg;

// Strip any sslmode params from DATABASE_URL to prevent conflicts
// with our explicit ssl config object
function stripSslmodeParam(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("sslmode");
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

  // Strip conflicting sslmode params to ensure our explicit ssl config takes precedence
  const connectionString = stripSslmodeParam(rawUrl);
  
  // Determine SSL config based on hostname
  let ssl: false | { rejectUnauthorized: boolean; checkServerIdentity?: () => undefined } = false;
  try {
    const u = new URL(connectionString);
    const isLocal = 
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "::1" ||
      u.hostname.endsWith(".local");
    
    if (!isLocal) {
      ssl = { 
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined
      };
    }
  } catch {
    // If URL parsing fails, fallback to env check
    ssl = process.env.NODE_ENV === "production" ? { 
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined
    } : false;
  }

  const client = new Client({
    connectionString,
    ssl: ssl || undefined,
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
