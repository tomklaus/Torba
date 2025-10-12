const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from root folder

// DB setup
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [], profiles: [] });

// Initialize the database with default data
const initializeDB = async () => {
  await db.read();
  if (db.data === null) {
    db.data = { users: [], profiles: [] };
  }
  await db.write();
};

initializeDB();

// Authentication routes
// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    await db.read();
    
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    // Check if user already exists
    const existingUser = db.data.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'Користувач з таким ім\'ям вже існує' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    db.data.users.push(newUser);
    await db.write();
    
    // Return user without password
    const userResponse = { ...newUser };
    delete userResponse.password;
    
    res.status(201).json({ user: userResponse, message: 'Користувач успішно зареєстрований' });
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    res.status(500).json({ error: 'Помилка сервера під час реєстрації' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    await db.read();
    
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    // Find user by username
    const user = db.data.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Неправильне ім\'я користувача або пароль' });
    }
    
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
    await db.read();
    
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID користувача обов\'язковий' });
    }
    
    const userProfiles = db.data.profiles.filter(profile => profile.userId == userId);
    
    res.json({ profiles: userProfiles });
  } catch (error) {
    console.error('Помилка отримання профілів:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Create a new profile
app.post('/api/profiles', async (req, res) => {
  try {
    await db.read();
    
    const { userId, question1, question2, question3 } = req.body;
    
    if (!userId || !question1 || !question2 || !question3) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    const newProfile = {
      id: Date.now().toString(),
      userId: userId,
      question1,
      question2,
      question3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.data.profiles.push(newProfile);
    await db.write();
    
    res.status(201).json({ profile: newProfile, message: 'Профіль успішно збережено' });
  } catch (error) {
    console.error('Помилка збереження профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Update a profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    await db.read();
    
    const profileId = req.params.id;
    const { userId, question1, question2, question3 } = req.body;
    
    if (!profileId || !userId || !question1 || !question2 || !question3) {
      return res.status(400).json({ error: 'Всі поля обов\'язкові для заповнення' });
    }
    
    const profileIndex = db.data.profiles.findIndex(p => p.id == profileId);
    
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Профіль не знайдено' });
    }
    
    // Update the profile
    db.data.profiles[profileIndex] = {
      ...db.data.profiles[profileIndex],
      userId,
      question1,
      question2,
      question3,
      updatedAt: new Date().toISOString()
    };
    
    await db.write();
    
    res.json({ profile: db.data.profiles[profileIndex], message: 'Профіль успішно оновлено' });
  } catch (error) {
    console.error('Помилка оновлення профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Delete a profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    await db.read();
    
    const profileIndex = db.data.profiles.findIndex(p => p.id === req.params.id);
    
    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Профіль не знайдено' });
    }
    
    db.data.profiles.splice(profileIndex, 1);
    await db.write();
    
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Помилка видалення профілю:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});