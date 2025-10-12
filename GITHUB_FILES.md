# Файли та директорії для GitHub репозиторію

## Клієнтська частина (Frontend)
Ці файли потрібно завантажити на Netlify:
- index.html
- login.html
- registration.html
- profile.html
- styles.css
- app/
  - config.js
  - auth/
    - auth.component.js
  - profile.component.js
  - services/
    - storage.service.js
- db.json (необов'язково, для початкового заповнення)

## Серверна частина (Backend)
Ці файли потрібно завантажити в окремий репозиторій для сервера:
- backend.js
- package.json
- package-lock.json

## Документація
- README.md
- DEPLOY_INSTRUCTIONS.md

## Інші файли
- .gitignore (створити окремо, щоб не завантажувати зайві файли)

## Важливо:
1. Не завантажуйте директорію node_modules на GitHub
2. Не завантажуйте файл db.json з реальними даними користувачів
3. Клієнтську частину (для Netlify) краще тримати в окремому репозиторії
4. Серверну частину (для Render/Heroku) - в окремому репозиторії

## Приклад .gitignore файлу:
node_modules/
.env
db.json
npm-debug.log*
coverage/
*.local