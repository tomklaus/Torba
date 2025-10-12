// Simple routing module
class SimpleRouter {
  constructor() {
    this.routes = {};
    this.currentRoute = '';
  }

  addRoute(path, component) {
    this.routes[path] = component;
  }

  navigateTo(path) {
    this.currentRoute = path;
    window.location.hash = path;
  }

  init() {
    window.addEventListener('hashchange', () => {
      this.loadRoute();
    });
    
    // Load initial route
    this.loadRoute();
  }

  loadRoute() {
    const path = window.location.hash.slice(1) || '/auth';
    const routeComponent = this.routes[path];
    
    if (routeComponent) {
      // Update the view with the component
      document.querySelector('app-root').innerHTML = `
        <div class="container">
          <h1>Profile Management App</h1>
          <div id="router-outlet"></div>
        </div>
      `;
      
      const outlet = document.getElementById('router-outlet');
      if (outlet) {
        // Create instance of the component and render it
        const componentInstance = new routeComponent(window.storageService);
        // For simplicity, we'll render differently based on component type
        if (path === '/auth') {
          outlet.innerHTML = this.renderAuthComponent(componentInstance);
        } else if (path === '/profile') {
          outlet.innerHTML = this.renderProfileComponent(componentInstance);
        }
      }
    }
  }

  renderAuthComponent(component) {
    let disabled = !(component.profile.field1 && component.profile.field2 && component.profile.field3);
    
    return `
      <div class="auth-form">
        <h2>Create Your Profile</h2>
        <p>Please answer the following questions to create your profile:</p>
        
        <div>
          <div class="form-group">
            <label for="field1">What is your name?</label>
            <input 
              type="text" 
              id="field1" 
              value="${component.profile.field1}"
              oninput="window.updateField('field1', event)"
              required
              placeholder="Enter your name">
          </div>
          
          <div class="form-group">
            <label for="field2">What is your favorite hobby?</label>
            <input 
              type="text" 
              id="field2" 
              value="${component.profile.field2}"
              oninput="window.updateField('field2', event)"
              required
              placeholder="Enter your favorite hobby">
          </div>
          
          <div class="form-group">
            <label for="field3">What is your profession?</label>
            <input 
              type="text" 
              id="field3" 
              value="${component.profile.field3}"
              oninput="window.updateField('field3', event)"
              required
              placeholder="Enter your profession">
          </div>
          
          <button type="button" 
                  onclick="window.submitProfile()"
                  ${disabled ? 'disabled' : ''}>
            Create Profile
          </button>
        </div>
      </div>
    `;
  }

  renderProfileComponent(component) {
    if (!component.profile) {
      // Redirect to auth page if no profile
      window.location.hash = '#/auth';
      return '';
    }
    
    return `
      <div>
        <div class="welcome-message">
          <h2>Welcome to Your Profile!</h2>
        </div>
        
        <div class="profile-view">
          <div class="profile-field">
            <strong>Your Name:</strong> ${component.profile.field1}
          </div>
          
          <div class="profile-field">
            <strong>Your Favorite Hobby:</strong> ${component.profile.field2}
          </div>
          
          <div class="profile-field">
            <strong>Your Profession:</strong> ${component.profile.field3}
          </div>
        </div>
        
        <button class="logout-btn" onclick="window.logout()">Logout</button>
      </div>
    `;
  }
}

// Initialize the router
window.router = new SimpleRouter();
window.router.addRoute('/auth', window.AuthComponent);
window.router.addRoute('/profile', window.ProfileComponent);

// Set up global functions for form handling
window.profiles = { field1: '', field2: '', field3: '' };
window.storageService = new window.StorageService();

window.updateField = function(field, event) {
  window.profiles[field] = event.target.value;
  
  // Update the create profile button state
  const button = document.querySelector('button[type="button"]');
  const allFilled = window.profiles.field1 && window.profiles.field2 && window.profiles.field3;
  
  if (button) {
    button.disabled = !allFilled;
  }
};

window.submitProfile = function() {
  if (window.profiles.field1 && window.profiles.field2 && window.profiles.field3) {
    window.storageService.saveProfile(window.profiles);
    window.location.hash = '#/profile';
  }
};

window.logout = function() {
  window.storageService.clearProfile();
  window.location.hash = '#/auth';
};

// Initialize the router when the application loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    window.router.init();
  }, 100);
});