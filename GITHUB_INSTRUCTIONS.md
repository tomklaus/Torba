# Інструкція по завантаженню проекту до GitHub

## Поділ на два репозиторії

Цей проект складається з двох частин, які краще тримати в окремих репозиторіях:

### 1. Frontend репозиторій (для Netlify)
**Файли для клієнтської частини:**
```
├── index.html
├── login.html
├── registration.html
├── profile.html
├── styles.css
├── app/
│   ├── config.js
│   ├── auth/
│   │   └── auth.component.js
│   ├── profile.component.js
│   └── services/
│       └── storage.service.js
├── README.md
├── .gitignore
└── DEPLOY_INSTRUCTIONS.md
```

### 2. Backend репозиторій (для Render/Heroku)
**Файли для серверної частини:**
```
├── backend.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
└── DEPLOY_INSTRUCTIONS.md
```

## Кроки для створення репозиторію на GitHub

### Для Frontend (клієнтська частина):

1. Створіть новий репозиторій на GitHub (наприклад, `profile-app-frontend`)

2. Відкрийте командний рядок у директорії проекту

3. Виконайте наступні команди:
```bash
# Ініціалізуйте локальний репозиторій
git init

# Додайте всі файли до коміту
git add index.html login.html registration.html profile.html styles.css app/ README.md .gitignore DEPLOY_INSTRUCTIONS.md

# Зробіть перший коміт
git commit -m "Initial commit: Frontend application files"

# Додайте віддалений репозиторій GitHub
git remote add origin https://github.com/ВАШ_АКАУНТ/profile-app-frontend.git

# Завантажте код до GitHub
git branch -M main
git push -u origin main
```

### Для Backend (серверна частина):

1. Створіть ще один репозиторій на GitHub (наприклад, `profile-app-backend`)

2. У новій директорії створіть backend репозиторій:
```bash
mkdir profile-app-backend
cd profile-app-backend

# Ініціалізуйте локальний репозиторій
git init

# Створіть або скопіюйте необхідні файли:
# - backend.js
# - package.json
# - package-lock.json
# - README.md
# - .gitignore

# Додайте всі файли до коміту
git add .

# Зробіть коміт
git commit -m "Initial commit: Backend API server"

# Додайте віддалений репозиторій GitHub
git remote add origin https://github.com/ВАШ_АКАУНТ/profile-app-backend.git

# Завантажте код до GitHub
git branch -M main
git push -u origin main
```

## Налаштування Netlify для Frontend

Після завантаження frontend на GitHub:

1. Увійдіть до [Netlify](https://netlify.com)
2. Натисніть "Add new site"
3. Оберіть "Import an existing project"
4. Виберіть ваш GitHub аккаунт і репозиторій
5. У налаштуваннях змініть шлях до конфігурації, якщо потрібно

## Налаштування Render для Backend

Після завантаження backend на GitHub:

1. Увійдіть до [Render](https://render.com)
2. Натисніть "New +" -> "Web Service"
3. Виберіть "Build and deploy from a Git repository"
4. Додайте посилання на ваш GitHub репозиторій
5. Вкажіть команду запуску: `npm run backend`

## Завершення налаштування

Після деплою обох частин:

1. Скопіюйте URL вашого backend додатку (наприклад, `https://your-app.onrender.com`)

2. Оновіть `app/config.js` у frontend репозиторії:
```javascript
API_BASE_URL: 'https://your-app.onrender.com' // ваш реальний URL
```

3. Передеплойте frontend на Netlify з оновленою конфігурацією

## Готово! 🎉

Ваші додатки будуть працювати разом:
- Frontend на Netlify: https://your-site.netlify.app
- Backend на Render: https://your-app.onrender.com
- Користувачі реєструються і отримують доступ до даних через спільну базу даних