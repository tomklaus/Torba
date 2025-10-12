// Profile component
const { Component } = ng.core;
const { StorageService } = window;

class ProfileComponent {
  constructor(storageService) {
    this.storageService = storageService;
    this.profile = storageService.getProfile();
    
    if (!this.profile) {
      // If no profile exists, redirect to auth - in a real app you'd use router
      window.location.hash = '#/auth';
    }
  }

  onLogout() {
    this.storageService.clearProfile();
    // Redirect to auth page
    window.location.hash = '#/auth';
  }
}

ProfileComponent.annotations = [
  new Component({
    selector: 'app-profile',
    template: `
      <div *ngIf="profile">
        <div class="welcome-message">
          <h2>Welcome to Your Profile!</h2>
        </div>
        
        <div class="profile-view">
          <div class="profile-field">
            <strong>Your Name:</strong> {{profile.field1}}
          </div>
          
          <div class="profile-field">
            <strong>Your Favorite Hobby:</strong> {{profile.field2}}
          </div>
          
          <div class="profile-field">
            <strong>Your Profession:</strong> {{profile.field3}}
          </div>
        </div>
        
        <button class="logout-btn" (click)="onLogout()">Logout</button>
      </div>
    `,
    styles: [`
      .profile-view {
        margin-top: 20px;
      }
      
      .profile-field {
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      
      .logout-btn {
        background-color: #dc3545;
      }
      
      .logout-btn:hover {
        background-color: #c82333;
      }
    `]
  })
];

// Export for use in other modules
window.ProfileComponent = ProfileComponent;