// Storage service to handle local or server-based storage operations
class StorageService {
  constructor() {
    // This service will handle both local storage and API calls based on configuration
  }

  // Методи для роботи з користувачами
  async createUser(user) {
    try {
      if (CONFIG.USE_LOCAL_AUTH) {
        // Use local authentication manager
        return await AuthManager.register(user);
      } else {
        // Use server API
        const response = await fetch(getApiUrl('/api/register'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, user: data.user };
        } else {
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Помилка реєстрації користувача:', error);
      return { success: false, error: 'Помилка мережі' };
    }
  }

  async authenticateUser(username, password) {
    try {
      if (CONFIG.USE_LOCAL_AUTH) {
        // Use local authentication manager
        return await AuthManager.login({ username, password });
      } else {
        // Use server API
        const response = await fetch(getApiUrl('/api/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, user: data.user };
        } else {
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Помилка аутентифікації:', error);
      return { success: false, error: 'Помилка мережі' };
    }
  }

  // Методи для роботи з профілями
  async getUserProfiles(userId) {
    try {
      if (CONFIG.USE_LOCAL_AUTH) {
        // Use local profile manager
        return await ProfileManager.getUserProfiles(userId);
      } else {
        // Use server API
        const response = await fetch(getApiUrl(`/api/profiles/${userId}`));
        const data = await response.json();

        if (response.ok) {
          return { success: true, profiles: data.profiles };
        } else {
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Помилка отримання профілів:', error);
      return { success: false, error: 'Помилка мережі' };
    }
  }

  async saveProfile(profile) {
    try {
      if (CONFIG.USE_LOCAL_AUTH) {
        // Use local profile manager
        return await ProfileManager.saveProfile(profile);
      } else {
        // Use server API
        // Перевіряємо, чи вже існує профіль для цього користувача
        const profilesResponse = await this.getUserProfiles(profile.userId);
        
        let response;
        if (profilesResponse.success && profilesResponse.profiles.length > 0) {
          // Якщо профіль існує, оновлюємо останній
          const latestProfile = profilesResponse.profiles[profilesResponse.profiles.length - 1];
          response = await fetch(getApiUrl(`/api/profiles/${latestProfile.id}`), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
          });
        } else {
          // Якщо профілю немає, створюємо новий
          response = await fetch(getApiUrl('/api/profiles'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
          });
        }

        const data = await response.json();

        if (response.ok) {
          return { success: true, profile: data.profile };
        } else {
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Помилка збереження профілю:', error);
      return { success: false, error: 'Помилка мережі' };
    }
  }

  async updateProfile(profileId, profile) {
    try {
      if (CONFIG.USE_LOCAL_AUTH) {
        // For local auth, we'll save the profile which will update if one exists
        return await ProfileManager.saveProfile(profile);
      } else {
        // Use server API
        const response = await fetch(getApiUrl(`/api/profiles/${profileId}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profile)
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, profile: data.profile };
        } else {
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
      return { success: false, error: 'Помилка мережі' };
    }
  }

  async deleteProfile(id) {
    try {
      if (CONFIG.USE_LOCAL_AUTH) {
        // Local auth doesn't support delete yet, we can implement it if needed
        // For now, just return success
        console.warn('Delete profile not implemented for local auth');
        return { success: true };
      } else {
        // Use server API
        const response = await fetch(getApiUrl(`/api/profiles/${id}`), {
          method: 'DELETE'
        });

        if (response.ok) {
          return { success: true };
        } else {
          const data = await response.json();
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Помилка видалення профілю:', error);
      return { success: false, error: 'Помилка мережі' };
    }
  }
}

// Export for use in other modules
window.StorageService = StorageService;