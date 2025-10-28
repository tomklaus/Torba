#!/usr/bin/env node
/**
 * Dangerous DB reset script
 * - Drops application tables and recreates them to the latest schema
 * - Prompts for confirmation unless CI=true or --yes is provided
 *
 * Usage: npm run db:reset [-- --yes]
 */

import readline from "node:readline";
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

async function confirmDanger(): Promise<boolean> {
  if (process.env.CI === "true" || process.argv.includes("--yes")) return true;

  console.log("\n⚠️  You are about to DROP and RECREATE database tables!\n");
  console.log("This will permanently delete data in tables: profiles, users (and text_entries if present).\n");
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Type "RESET" to confirm: ', (answer) => {
      rl.close();
      resolve(answer.trim().toUpperCase() === "RESET");
    });
  });
}

async function main() {
  if (!(await confirmDanger())) {
    console.log("Aborted.");
    process.exit(1);
  }

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
    await client.query("BEGIN");

    // Drop tables (order is safe with CASCADE, but drop children first for clarity)
    await client.query("DROP TABLE IF EXISTS profiles CASCADE;");
    await client.query("DROP TABLE IF EXISTS users CASCADE;");
    // Drop legacy/other table if present (from earlier app versions)
    await client.query("DROP TABLE IF EXISTS text_entries CASCADE;");

    await ensureExtensions(client as any);
    await ensureTables(client as any);

    await client.query("COMMIT");
    console.log("✓ Reset complete (tables recreated)");
  } catch (err: any) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("Reset failed:", err?.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
