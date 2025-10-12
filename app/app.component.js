class AppComponent {
    constructor() {
        this.storageService = new StorageService();
        this.authComponent = new AuthComponent();
        this.init();
    }

    init() {
        // Перевіряємо, чи користувач ввійшов в систему
        const currentUser = this.authComponent.getCurrentUser();
        
        if (currentUser) {
            // Якщо користувач ввійшов, перенаправляємо на сторінку профілю
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                window.location.href = 'profile.html';
            }
        } else {
            // Якщо не ввійшов, перенаправляємо на сторінку входу
            if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('registration.html')) {
                window.location.href = 'login.html';
            }
        }
    }
}

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('registration.html') &&
        !window.location.pathname.includes('profile.html')) {
        new AppComponent();
    }
});