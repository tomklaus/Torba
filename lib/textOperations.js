import connectDB from './db';

// Initialize the table if it doesn't exist
export async function initializeTable() {
  try {
    const client = await connectDB();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS text_entries (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(createTableQuery);
    console.log('Database table initialized');
  } catch (error) {
    console.error('Error initializing database table:', error.message);
    // Don't throw error to allow local development without database
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

// Save text to the database
export async function saveText(content) {
  try {
    const client = await connectDB();
    
    const insertQuery = `
      INSERT INTO text_entries (content) 
      VALUES ($1) 
      RETURNING id, content, created_at;
    `;
    
    const result = await client.query(insertQuery, [content]);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving text:', error.message);
    // Don't throw error to allow local development without database
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return null;
  }
}

// Get all text entries from the database
export async function getTextEntries() {
  try {
    const client = await connectDB();
    
    const selectQuery = `
      SELECT id, content, created_at 
      FROM text_entries 
      ORDER BY created_at DESC;
    `;
    
    const result = await client.query(selectQuery);
    return result.rows;
  } catch (error) {
    console.error('Error getting text entries:', error.message);
    // Don't throw error to allow local development without database
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    return [];
  }
}
