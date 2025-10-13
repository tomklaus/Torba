import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default async function connectDB() {
  if (!client.connection) {
    await client.connect();
  }
  return client;
}
