require('dotenv').config();
const { Pool } = require('pg');

// Log the DATABASE_URL to debug
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Exists' : 'Missing');
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL contains:', process.env.DATABASE_URL.substring(0, 30) + '...');
}

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // SSL only for production
});

// Add error handling for when DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please set the DATABASE_URL environment variable to your Railway PostgreSQL connection string.');
}

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Function to initialize the database tables
const initializeDB = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create profiles table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        question1 TEXT NOT NULL,
        question2 TEXT NOT NULL,
        question3 TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initializeDB
};
