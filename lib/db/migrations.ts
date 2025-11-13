// Lightweight, idempotent schema bootstrap for PostgreSQL
// - ensureExtensions: installs pgcrypto for gen_random_uuid()
// - ensureTables: creates required tables if they don't exist
//
// This module only relies on a minimal "client" contract: any object with a
// `query(sql: string)` method (e.g. pg.Client, pg.Pool, Neon Pool) can be used.

export type QueryClient = {
  query: (sql: string) => Promise<any>;
};

export async function ensureExtensions(client: QueryClient) {
  // gen_random_uuid() lives in the pgcrypto extension on Postgres >= 9.4
  // Safe and idempotent
  await client.query(
    `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
  );
}

export async function ensureTables(client: QueryClient) {
  // users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      username varchar(255) UNIQUE NOT NULL,
      email text UNIQUE,
      password_hash varchar,
      terms_accepted_at timestamptz,
      last_login_at timestamptz,
      login_attempts integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT NOW()
    );
  `);
  
  // Add username column if it doesn't exist (for existing databases)
  await client.query(`
    DO $
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
      ) THEN
        ALTER TABLE users ADD COLUMN username varchar(255) UNIQUE NOT NULL DEFAULT 'guest_' || gen_random_uuid()::text;
      END IF;
    END$;
  `);
  
  // Make email nullable if it's not (for schema migration)
  await client.query(`
    DO $
    BEGIN
      ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
    EXCEPTION
      WHEN others THEN NULL;
    END$;
  `);

  // Add new auth columns if they don't exist
  await client.query(`
    DO $
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
      ) THEN
        ALTER TABLE users ADD COLUMN password_hash varchar;
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'terms_accepted_at'
      ) THEN
        ALTER TABLE users ADD COLUMN terms_accepted_at timestamptz;
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_login_at'
      ) THEN
        ALTER TABLE users ADD COLUMN last_login_at timestamptz;
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'login_attempts'
      ) THEN
        ALTER TABLE users ADD COLUMN login_attempts integer NOT NULL DEFAULT 0;
      END IF;
    END$;
  `);

  // registration_agreements table
  await client.query(`
    CREATE TABLE IF NOT EXISTS registration_agreements (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      version varchar(50) NOT NULL,
      accepted_at timestamptz NOT NULL DEFAULT NOW(),
      ip_address varchar,
      user_agent text
    );
  `);

  // Create index on user_id for registration_agreements
  await client.query(`
    DO $
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'registration_agreements_user_id_idx' AND n.nspname = 'public'
      ) THEN
        CREATE INDEX registration_agreements_user_id_idx ON registration_agreements(user_id);
      END IF;
    END$;
  `);

  // profiles table
  // Mirrors the schema defined in shared/schema.ts
  await client.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,

      name varchar(50) NOT NULL,
      birth_date date NOT NULL,
      city text NOT NULL,
      custom_city text,
      height integer NOT NULL,
      weight integer NOT NULL,
      penis_size integer NOT NULL,
      sex_role text NOT NULL,
      dating_goals jsonb NOT NULL,

      commerce_type text NOT NULL,

      service_formats jsonb NOT NULL DEFAULT '[]',
      commerce_sex_role text,

      location_formats jsonb NOT NULL DEFAULT '[]',
      travel_geography jsonb NOT NULL DEFAULT '[]',
      availability jsonb NOT NULL DEFAULT '[]',
      min_notice text,
      min_duration text,
      custom_duration text,

      meeting_conditions jsonb NOT NULL DEFAULT '[]',
      health_safety jsonb NOT NULL DEFAULT '[]',
      last_std_test text,
      photo_video_consent text,
      my_limits text,
      comfort_conditions text,

      rate_1h integer,
      rate_2h integer,
      rate_night integer,
      travel_fee integer,
      cancellation_fee integer,
      payment_methods jsonb NOT NULL DEFAULT '[]',
      transport_costs text,

      public_photos jsonb NOT NULL DEFAULT '[]',
      private_photos jsonb NOT NULL DEFAULT '[]',

      about_me text,
      looking_for text,
      body_type text,
      relationship_status text,
      interests jsonb NOT NULL DEFAULT '[]',
      hiv_status text,
      alcohol_use text,
      smoking text,
      languages jsonb NOT NULL DEFAULT '[]',

      instagram text,
      spotify text,
      tiktok text,
      telegram text,
      twitter text,
      contact_email text,
      phone_number text,

      sex_experience text,
      condom_attitude text,
      circumcision text,
      favorite_positions jsonb NOT NULL DEFAULT '[]',
      sex_frequency text,
      group_sex text,
      substances_attitude text,
      favorite_activities jsonb NOT NULL DEFAULT '[]',
      toys_accessories jsonb NOT NULL DEFAULT '[]',
      meeting_places jsonb NOT NULL DEFAULT '[]',
      after_sex jsonb NOT NULL DEFAULT '[]',
      fetishes jsonb NOT NULL DEFAULT '[]',
      bdsm_roles jsonb NOT NULL DEFAULT '[]',

      is_complete boolean NOT NULL DEFAULT false,
      current_step integer NOT NULL DEFAULT 1,
      updated_at timestamptz NOT NULL DEFAULT NOW()
    );
  `);

  // Optional: performance: ensure indexes exist
  await client.query(`
    DO $
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'users_email_idx' AND n.nspname = 'public'
      ) THEN
        CREATE INDEX users_email_idx ON users(email);
      END IF;
    END$;
  `);
  
  await client.query(`
    DO $
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'users_username_idx' AND n.nspname = 'public'
      ) THEN
        CREATE INDEX users_username_idx ON users(username);
      END IF;
    END$;
  `);
}

export async function validateSchema(client: QueryClient) {
  // List all tables in public schema
  const tablesResult = await client.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  
  const tables = tablesResult.rows?.map((r: any) => r.tablename) || [];
  console.log(`[DB] Existing tables: ${tables.join(', ') || '(none)'}`);
  
  // Check users table structure
  if (tables.includes('users')) {
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('[DB] users table columns:', 
      columnsResult.rows?.map((r: any) => 
        `${r.column_name}(${r.data_type}, ${r.is_nullable === 'YES' ? 'nullable' : 'not null'})`
      ).join(', ') || '(none)'
    );
  }
  
  // Count records in key tables
  for (const table of ['users', 'profiles', 'registration_agreements']) {
    if (tables.includes(table)) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = countResult.rows?.[0]?.count || 0;
        console.log(`[DB] ${table}: ${count} record(s)`);
      } catch (err) {
        console.warn(`[DB] Could not count ${table}:`, err);
      }
    }
  }
}
