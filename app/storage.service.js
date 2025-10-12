// Storage service to handle local storage operations for multiple profiles
class StorageService {
  constructor() {
    this.ALL_PROFILES_KEY = 'allProfiles';
    this.CURRENT_USER_KEY = 'currentUser';
  }

  // Save a user profile
  saveProfile(profile) {
    // Generate a simple ID based on the profile data
    const profileId = this.generateProfileId(profile);
    
    // Get existing profiles
    let allProfiles = this.getAllProfiles();
    
    // Add or update the profile
    allProfiles[profileId] = {
      ...profile,
      id: profileId,
      lastLogin: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem(this.ALL_PROFILES_KEY, JSON.stringify(allProfiles));
    
    // Set as current user
    localStorage.setItem(this.CURRENT_USER_KEY, profileId);
    
    return profileId;
  }

  // Get a specific profile by ID
  getProfile(profileId) {
    const allProfiles = this.getAllProfiles();
    return allProfiles[profileId] || null;
  }

  // Get all profiles
  getAllProfiles() {
    const profilesData = localStorage.getItem(this.ALL_PROFILES_KEY);
    return profilesData ? JSON.parse(profilesData) : {};
  }

  // Get current user profile
  getCurrentUser() {
    const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY);
    if (currentUserId) {
      return this.getProfile(currentUserId);
    }
    return null;
  }

  // Set current user
  setCurrentUser(profileId) {
    localStorage.setItem(this.CURRENT_USER_KEY, profileId);
  }

  // Clear current user (but keep profile in storage)
  clearCurrentUser() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Check if any user is currently logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Generate a unique ID for a profile based on its content
  generateProfileId(profile) {
    // Create a simple hash based on the profile fields
    const str = profile.field1 + profile.field2 + profile.field3;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  // Delete a profile
  deleteProfile(profileId) {
    const allProfiles = this.getAllProfiles();
    delete allProfiles[profileId];
    localStorage.setItem(this.ALL_PROFILES_KEY, JSON.stringify(allProfiles));
    
    // If this was the current user, clear current user
    if (localStorage.getItem(this.CURRENT_USER_KEY) === profileId) {
      this.clearCurrentUser();
    }
  }
}

// Create a global instance
window.storageService = new StorageService();