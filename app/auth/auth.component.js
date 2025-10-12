class AuthComponent {
    constructor() {
        this.init();
    }

    init() {
        const registrationForm = document.getElementById('registrationForm');
        const loginForm = document.getElementById('loginForm');

        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    async handleRegistration(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            if (CONFIG.USE_LOCAL_AUTH) {
                // Use local authentication
                const result = await AuthManager.register({ username, email, password });
                
                if (result.success) {
                    this.showToast('Ви успішно зареєстровані! Будь ласка, увійдіть.', 'success');
                    window.location.href = 'login.html';
                } else {
                    this.showToast(result.error || 'Помилка реєстрації', 'error');
                }
            } else {
                // Use server API
                const response = await fetch(getApiUrl('/api/register'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    this.showToast('Ви успішно зареєстровані! Будь ласка, увійдіть.', 'success');
                    window.location.href = 'login.html';
                } else {
                    this.showToast(data.error || 'Помилка реєстрації', 'error');
                }
            }
        } catch (error) {
            console.error('Помилка реєстрації:', error);
            this.showToast('Сталася помилка під час реєстрації', 'error');
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            if (CONFIG.USE_LOCAL_AUTH) {
                // Use local authentication
                const result = await AuthManager.login({ username, password });
                
                if (result.success) {
                    // Зберігаємо дані користувача в сесії
                    sessionStorage.setItem('userId', result.user.id);
                    sessionStorage.setItem('username', result.user.username);
                    
                    this.showToast('Ви успішно увійшли!', 'success');
                    window.location.href = 'profile.html';
                } else {
                    this.showToast(result.error || 'Неправильний логін або пароль!', 'error');
                }
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
                    // Зберігаємо дані користувача в сесії
                    sessionStorage.setItem('userId', data.user.id);
                    sessionStorage.setItem('username', data.user.username);
                    
                    this.showToast('Ви успішно увійшли!', 'success');
                    window.location.href = 'profile.html';
                } else {
                    this.showToast(data.error || 'Неправильний логін або пароль!', 'error');
                }
            }
        } catch (error) {
            console.error('Помилка входу:', error);
            this.showToast('Сталася помилка під час входу', 'error');
        }
    }

    async logout() {
        if (CONFIG.USE_LOCAL_AUTH) {
            // Use local auth manager
            AuthManager.logout();
        } else {
            // For server auth, just clear session
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('username');
        }
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        if (CONFIG.USE_LOCAL_AUTH) {
            // Use local auth manager to get current user
            return AuthManager.getCurrentUser();
        } else {
            // Use session storage for server auth
            const userId = sessionStorage.getItem('userId');
            const username = sessionStorage.getItem('username');
            return userId ? { id: userId, username } : null;
        }
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.removeToast(toast);
        
        toast.appendChild(content);
        toast.appendChild(closeBtn);
        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeToast(toast);
        }, 5000);
    }
    
    // Remove toast notification
    removeToast(toast) {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Ініціалізація компонента, якщо сторінка завантажена
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('registrationForm') || document.getElementById('loginForm')) {
        window.authComponent = new AuthComponent();
    }
});