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
      email text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT NOW()
    );
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

  // Optional: performance: ensure an index exists on email
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'users_email_idx' AND n.nspname = 'public'
      ) THEN
        CREATE INDEX users_email_idx ON users(email);
      END IF;
    END$$;
  `);
}
