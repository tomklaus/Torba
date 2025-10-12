class ProfileComponent {
    constructor() {
        this.authComponent = window.authComponent || new AuthComponent();
        this.init();
    }

    init() {
        this.displayUsername();
        this.loadProfile();
        this.setupEventListeners();
    }

    displayUsername() {
        const currentUser = this.authComponent.getCurrentUser();
        if (currentUser) {
            document.getElementById('usernameDisplay').textContent = currentUser.username;
        } else {
            window.location.href = 'login.html';
        }
    }

    setupEventListeners() {
        const profileForm = document.getElementById('profileForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleSaveProfile(e));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.authComponent.logout());
        }
    }

    async loadProfile() {
        const currentUser = this.authComponent.getCurrentUser();
        if (!currentUser) return;

        try {
            if (CONFIG.USE_LOCAL_AUTH) {
                // Use local profile manager
                const result = await ProfileManager.getUserProfiles(currentUser.id);
                
                if (result.success && result.profiles.length > 0) {
                    // Отримуємо останній збережений профіль користувача
                    const latestProfile = result.profiles[result.profiles.length - 1];
                    document.getElementById('question1').value = latestProfile.question1 || '';
                    document.getElementById('question2').value = latestProfile.question2 || '';
                    document.getElementById('question3').value = latestProfile.question3 || '';
                }
            } else {
                // Use server API
                const response = await fetch(getApiUrl(`/api/profiles/${currentUser.id}`));
                const data = await response.json();

                if (response.ok && data.profiles.length > 0) {
                    // Отримуємо останній збережений профіль користувача
                    const latestProfile = data.profiles[data.profiles.length - 1];
                    document.getElementById('question1').value = latestProfile.question1 || '';
                    document.getElementById('question2').value = latestProfile.question2 || '';
                    document.getElementById('question3').value = latestProfile.question3 || '';
                }
            }
        } catch (error) {
            console.error('Помилка завантаження профілю:', error);
        }
    }

    async handleSaveProfile(event) {
        event.preventDefault();
        
        const currentUser = this.authComponent.getCurrentUser();
        if (!currentUser) {
            this.showToast('Спочатку увійдіть в систему', 'error');
            return;
        }

        const profile = {
            userId: currentUser.id,
            question1: document.getElementById('question1').value,
            question2: document.getElementById('question2').value,
            question3: document.getElementById('question3').value
        };

        try {
            if (CONFIG.USE_LOCAL_AUTH) {
                // Use local profile manager
                const result = await ProfileManager.saveProfile(profile);
                
                if (result.success) {
                    this.showToast('Відповіді успішно збережені!', 'success');
                } else {
                    this.showToast(result.error || 'Помилка збереження', 'error');
                }
            } else {
                // Use server API
                // Перевіряємо, чи вже існує профіль для цього користувача
                const response = await fetch(getApiUrl(`/api/profiles/${currentUser.id}`));
                const data = await response.json();
                const hasExistingProfile = data.profiles && data.profiles.length > 0;

                let apiResponse;
                if (hasExistingProfile) {
                    // Якщо профіль існує, оновлюємо останній
                    const latestProfile = data.profiles[data.profiles.length - 1];
                    apiResponse = await fetch(getApiUrl(`/api/profiles/${latestProfile.id}`), {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(profile)
                    });
                } else {
                    // Якщо профілю немає, створюємо новий
                    apiResponse = await fetch(getApiUrl('/api/profiles'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(profile)
                    });
                }

                const result = await apiResponse.json();

                if (apiResponse.ok) {
                    this.showToast('Відповіді успішно збережені!', 'success');
                } else {
                    this.showToast(result.error || 'Помилка збереження', 'error');
                }
            }
        } catch (error) {
            console.error('Помилка збереження профілю:', error);
            this.authComponent.showToast('Сталася помилка під час збереження', 'error');
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
    if (document.querySelector('.container')) {
        window.profileComponent = new ProfileComponent();
    }
});