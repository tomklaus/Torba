import { Client } from 'pg';

let client;

export default async function connectDB() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const connectionString = process.env.DATABASE_URL;

    // Enable SSL in hosted environments (e.g., Railway) while keeping local dev simple
    const useSSL =
      process.env.PGSSLMODE === 'require' ||
      process.env.NODE_ENV === 'production' ||
      /sslmode=require|true/i.test(connectionString);

    client = new Client({
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
    });

    await client.connect();
  }

  return client;
}
