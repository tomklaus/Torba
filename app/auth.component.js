// Authentication component - handles both registration and login
class AuthComponent {
  constructor() {
    this.profile = {
      field1: '',
      field2: '',
      field3: ''
    };
    this.allProfiles = window.storageService.getAllProfiles();
    this.render();
  }

  render() {
    const outlet = document.getElementById('router-outlet');
    
    // Get existing profiles
    this.allProfiles = window.storageService.getAllProfiles();
    const profileList = Object.values(this.allProfiles);
    
    let profileListHtml = '';
    if (profileList.length > 0) {
      profileListHtml = `
        <div class="existing-profiles">
          <h3>Existing Profiles:</h3>
          <ul>
            ${profileList.map(profile => `
              <li class="profile-item">
                <span><strong>${profile.field1}</strong> - ${profile.field2}, ${profile.field3}</span>
                <button class="login-btn" onclick="authComponent.loginToProfile('${profile.id}')">Login</button>
                <button class="delete-btn" onclick="authComponent.deleteProfile('${profile.id}')">Delete</button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }
    
    outlet.innerHTML = `
      <div class="auth-form">
        <h2>Profile Management</h2>
        <p>${profileList.length > 0 ? 'Select an existing profile or create a new one:' : 'Create your profile:'}</p>
        
        ${profileListHtml}
        
        <div class="create-profile-section">
          <h3>Create New Profile:</h3>
          <div class="form-group">
            <label for="field1">What is your name?</label>
            <input 
              type="text" 
              id="field1" 
              value="${this.profile.field1}"
              oninput="authComponent.handleInputChange('field1', event)"
              required
              placeholder="Enter your name">
          </div>
          
          <div class="form-group">
            <label for="field2">What is your favorite hobby?</label>
            <input 
              type="text" 
              id="field2" 
              value="${this.profile.field2}"
              oninput="authComponent.handleInputChange('field2', event)"
              required
              placeholder="Enter your favorite hobby">
          </div>
          
          <div class="form-group">
            <label for="field3">What is your profession?</label>
            <input 
              type="text" 
              id="field3" 
              value="${this.profile.field3}"
              oninput="authComponent.handleInputChange('field3', event)"
              required
              placeholder="Enter your profession">
          </div>
          
          <button type="button" 
                  onclick="authComponent.handleSubmit()"
                  id="submit-btn"
                  ${!(this.profile.field1 && this.profile.field2 && this.profile.field3) ? 'disabled' : ''}>
            Create Profile
          </button>
        </div>
      </div>
    `;
  }

  handleInputChange(field, event) {
    this.profile[field] = event.target.value;
    this.updateSubmitButton();
  }

  updateSubmitButton() {
    const submitBtn = document.getElementById('submit-btn');
    const allFilled = this.profile.field1 && this.profile.field2 && this.profile.field3;
    submitBtn.disabled = !allFilled;
  }

  handleSubmit() {
    if (this.profile.field1 && this.profile.field2 && this.profile.field3) {
      // Save the profile to localStorage
      const profileId = window.storageService.saveProfile(this.profile);
      // Navigate to profile page
      window.router.navigateTo('/profile');
    }
  }
  
  loginToProfile(profileId) {
    // Set this profile as the current user
    window.storageService.setCurrentUser(profileId);
    // Navigate to profile page
    window.router.navigateTo('/profile');
  }
  
  deleteProfile(profileId) {
    if (confirm('Are you sure you want to delete this profile?')) {
      window.storageService.deleteProfile(profileId);
      this.render(); // Refresh the UI
    }
  }
}

// Create global instance
window.authComponent = new AuthComponent();