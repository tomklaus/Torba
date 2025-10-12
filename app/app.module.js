// Main application module
const { NgModule } = ng.core;

class AppModule {}

AppModule.annotations = [
  new NgModule({
    declarations: [
      window.AppComponent,
      window.AuthComponent,
      window.ProfileComponent
    ],
    imports: [
    ],
    providers: [
      window.StorageService
    ],
    bootstrap: [window.AppComponent]
  })
];

// Bootstrap the application
function bootstrap() {
  // Initialize the app after all components are loaded
  setTimeout(() => {
    if (window.StorageService && window.AuthComponent && window.ProfileComponent) {
      // Check if user is already logged in
      const storageService = new window.StorageService();
      if (storageService.isLoggedIn()) {
        window.location.hash = '#/profile';
      } else {
        window.location.hash = '#/auth';
      }
    }
  }, 500);
}

// Start the application
document.addEventListener('DOMContentLoaded', bootstrap);