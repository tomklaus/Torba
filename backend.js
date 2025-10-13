const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000; // Use environment port for deployment

// Middleware
app.use(cors({
  origin: '*' // Allow all origins - configure this more restrictively in production
}));
app.use(bodyParser.json());

// Initialize the database with default data
db.initializeDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    // Check if user already exists
    const existingUserCheck = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2', 
      [username, email]
    );
    
    if (existingUserCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Користувач з таким ім\'ям або електронною поштою вже існує' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    
    const newUser = result.rows[0];
    
    res.status(201).json({ user: newUser, message: 'Користувач успішно зареєстрований' });
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    res.status(500).json({ error: 'Помилка сервера під час реєстрації' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    // Find user by username
    const userResult = await db.query(
      'SELECT id, username, email, password, created_at FROM users WHERE username = $1',
      [username]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Неправильне ім\'я користувача або пароль' });
    }
    
    const user = userResult.rows[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неправильне ім\'я користувача або пароль' });
    }
    
    // Return user without password
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({ user: userResponse, message: 'Успішний вхід' });
  } catch (error) {
    console.error('Помилка входу:', error);
    res.status(500).json({ error: 'Помилка сервера під час входу' });
  }
});

// Profile routes
// Get all profiles for a user
app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID користувача обов\'язковий' });
    }
    
    const result = await db.query(
      'SELECT id, user_id, question1, question2, question3, created_at, updated_at FROM profiles WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ profiles: result.rows });
  } catch (error) {
    console.error('Помилка отримання профілів:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Create a new profile
app.post('/api/profiles', async (req, res) => {
  try {
    const { userId, question1, question2, question3 } = req.body;
    
    if (!userId || !question1 || !question2 || !question3) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    const result = await db.query(
      'INSERT INTO profiles (user_id, question1, question2, question3) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, question1, question2, question3]
    );
    
    res.status(201).json({ profile: result.rows[0], message: 'Профіль успішно збережено' });
 } catch (error) {
    console.error('Помилка збереження профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Update a profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const { userId, question1, question2, question3 } = req.body;
    
    if (!profileId || !userId || !question1 || !question2 || !question3) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    const result = await db.query(
      'UPDATE profiles SET user_id = $1, question1 = $2, question2 = $3, question3 = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [userId, question1, question2, question3, profileId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Профіль не знайдено' });
    }
    
    res.json({ profile: result.rows[0], message: 'Профіль успішно оновлено' });
  } catch (error) {
    console.error('Помилка оновлення профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Delete a profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    
    const result = await db.query(
      'DELETE FROM profiles WHERE id = $1 RETURNING id',
      [profileId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Профіль не знайдено' });
    }
    
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Помилка видалення профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Profile API Server is running!', version: '1.0' });
});

app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
  console.log(`Доступні endpoints:`);
  console.log(`  POST   /api/register - реєстрація користувача`);
  console.log(`  POST   /api/login - вхід користувача`);
  console.log(`  GET    /api/profiles/:userId - отримання профілів користувача`);
  console.log(`  POST   /api/profiles - створення профілю`);
  console.log(`  PUT    /api/profiles/:id - оновлення профілю`);
  console.log(`  DELETE /api/profiles/:id - видалення профілю`);
});

module.exports = app;
