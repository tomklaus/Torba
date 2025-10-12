class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Перевіряємо хеш URL або використовуємо за замовчуванням
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        const hash = window.location.hash.replace('#', '') || '/';
        
        if (this.routes[hash]) {
            this.routes[hash]();
            this.currentRoute = hash;
        }
    }

    // Перевірка автентифікації користувача
    isAuthenticated() {
        const userId = sessionStorage.getItem('userId');
        return userId !== null;
    }

    // Перенаправлення на сторінку входу, якщо не авторизований
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Ініціалізація роутера
window.router = new Router();