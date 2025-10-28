#!/usr/bin/env node
/**
 * Database seed script
 * - Creates a test user for development/testing
 * 
 * Usage: npm run db:seed
 */

import pg from "pg";

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

    // Check if test user already exists
    const existingUser = await client.query(
      "SELECT id, username, email FROM users WHERE username = $1",
      ["test_user"]
    );

    if (existingUser.rows && existingUser.rows.length > 0) {
      console.log("✓ Test user already exists:", existingUser.rows[0]);
      return;
    }

    // Create test user
    const result = await client.query(
      `INSERT INTO users (username, email) 
       VALUES ($1, $2) 
       RETURNING id, username, email, created_at`,
      ["test_user", "test@example.com"]
    );

    console.log("✓ Test user created:", result.rows[0]);
    console.log("\nYou can now use this user for testing:");
    console.log("  Email: test@example.com");
    console.log("  Username: test_user");
  } catch (err: any) {
    console.error("Seed failed:", err?.message || err);
    if (err?.code === '23505') {
      console.log("Note: User might already exist with that email");
    }
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
