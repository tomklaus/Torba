import { Client } from 'pg';

let client;

export default async function connectDB() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
  }
  
  return client;
}
