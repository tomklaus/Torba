// Configuration for local authentication and storage
const CONFIG = {
  // Use server API for authentication and storage
  // To make this work, you need to deploy the backend.js file to a hosting service
  // such as Heroku, Render, Railway, or other Node.js hosting platforms
  USE_LOCAL_AUTH: false, // Set to false to use server API
  API_BASE_URL: 'https://torba.onrender.com' // Your deployed backend URL
};

// Helper functions for local authentication
const AuthManager = {
  // Register a new user using localStorage
  async register(userData) {
    try {
      const users = this.getUsers();
      const existingUser = users.find(user => user.username === userData.username || user.email === userData.email);
      
      if (existingUser) {
        throw new Error('Користувач з таким ім\'ям або електронною поштою вже існує');
      }
      
      // Create new user with hashed password (in a real app, you'd use a proper hashing algorithm)
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: this.hashPassword(userData.password), // Simple hash for client side
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      this.saveUsers(users);
      
      return { success: true, user: { ...newUser, password: undefined } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login user using localStorage
  async login(credentials) {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.username === credentials.username && u.password === this.hashPassword(credentials.password));
      
      if (!user) {
        throw new Error('Неправильне ім\'я користувача або пароль');
      }
      
      // Store current user in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify({ 
        id: user.id, 
        username: user.username,
        email: user.email 
      }));
      
      return { success: true, user: { id: user.id, username: user.username, email: user.email } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Logout user
  logout() {
    sessionStorage.removeItem('currentUser');
  },

  // Get all users from localStorage
  getUsers() {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
  },

  // Save users to localStorage
  saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  },

  // Simple password hash (in a real app use proper security)
  hashPassword(password) {
    // This is a simple client-side "hashing" for demonstration purposes only
    // In a real production app, you shouldn't hash passwords on the client side
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }
};

// Profile management using localStorage
const ProfileManager = {
  // Get profiles for current user
  async getUserProfiles(userId) {
    try {
      const profiles = this.getProfiles();
      const userProfiles = profiles.filter(profile => profile.userId == userId);
      
      return { success: true, profiles: userProfiles };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Save a new profile or update existing one
  async saveProfile(profile) {
    try {
      const profiles = this.getProfiles();
      const existingProfileIndex = profiles.findIndex(p => p.userId == profile.userId);
      
      let updatedProfile;
      if (existingProfileIndex !== -1) {
        // Update existing profile
        profiles[existingProfileIndex] = {
          ...profiles[existingProfileIndex],
          ...profile,
          updatedAt: new Date().toISOString()
        };
        updatedProfile = profiles[existingProfileIndex];
      } else {
        // Create new profile
        updatedProfile = {
          id: Date.now().toString(),
          ...profile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        profiles.push(updatedProfile);
      }
      
      this.saveProfiles(profiles);
      return { success: true, profile: updatedProfile };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all profiles from localStorage
  getProfiles() {
    const profilesStr = localStorage.getItem('profiles');
    return profilesStr ? JSON.parse(profilesStr) : [];
  },

  // Save profiles to localStorage
  saveProfiles(profiles) {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }
};

// Helper functions for API endpoints (when USE_LOCAL_AUTH is false)
function getApiUrl(endpoint) {
  if (!CONFIG.USE_LOCAL_AUTH && CONFIG.API_BASE_URL) {
    // If using server API, combine base URL with endpoint
    const base = CONFIG.API_BASE_URL.endsWith('/') ? CONFIG.API_BASE_URL.slice(0, -1) : CONFIG.API_BASE_URL;
    const ep = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return base + ep;
  }
  return endpoint; // For local auth, this won't be used
}

// Export for use in other modules
window.CONFIG = CONFIG;
window.AuthManager = AuthManager;
window.ProfileManager = ProfileManager;
window.getApiUrl = getApiUrl;