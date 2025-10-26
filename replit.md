# PWA для гей-знакомств в Україні

## Огляд проекту
Progressive Web Application для LGBTQ+ спільноти України з фокусом на гей-знакомства. Додаток об'єднує функціонал популярних платформ (Grindr, Hornet) з безкоштовним доступом до преміум функцій.

## Поточний стан
**Етап:** MVP Development - Task 1 completed (Schema & Frontend)
**Дата останнього оновлення:** 26 жовтня 2025

## Технічний стек

### Frontend
- React 18 з TypeScript
- Wouter для роутингу
- Tailwind CSS + shadcn/ui компоненти
- React Hook Form + Zod валідація
- TanStack Query для state management
- PWA (manifest.json, service worker ready)

### Backend
- Node.js + Express
- PostgreSQL (Neon) база даних
- Drizzle ORM
- Express Session для сесій

### Особливості
- Темна тема за замовчуванням
- Повністю українською мовою
- Адаптивний дизайн (mobile-first)
- PWA з можливістю установки

## Структура проекту

### Database Schema
- **users** - авторизація користувачів (email)
- **profiles** - повна інформація профілю (7 кроків реєстрації)

### Frontend Pages
1. `/` - Авторізація (тільки email)
2. `/register` - 7-крокова реєстрація
   - Крок 1: Обов'язкові поля (ім'я, дата народження, місто, параметри)
   - Крок 2: Налаштування комерції
   - Кроки 3-6: Комерційні блоки (якщо обрано)
   - Крок 7: Завантаження фото (публічна/приватна галерея)
3. `/profile` - Сторінка профілю після реєстрації

### Key Features Implemented (Task 1)
- ✅ Простий login через email (без пароля - тестовий режим)
- ✅ Повна 7-крокова реєстрація з усіма полями
- ✅ Умовна логіка для комерційних налаштувань (кроки 3-6 показуються тільки якщо commerceType = "yes" або "commerce_only")
- ✅ Завантаження фото з preview (mock URLs для демонстрації, справжнє завантаження в Task 2)
- ✅ Валідація форм через Zod (з z.coerce.number() для правильної конвертації)
- ✅ PWA manifest, іконки та service worker (реєструється тільки в production builds)
- ✅ Темна тема Material Design
- ✅ Український інтерфейс
- ✅ data-testid на всіх interactive елементах
- ✅ Всі емоджі замінені на Lucide іконки
- ✅ Database schema з правильними defaults для JSONB масивів

## Наступні кроки (Task 2 - Backend)
- [ ] Створити server/db.ts для підключення до PostgreSQL
- [ ] Оновити server/storage.ts на DatabaseStorage
- [ ] Реалізувати API endpoints:
  - POST /api/auth/check - перевірка email
  - POST /api/profiles - створення профілю
  - GET /api/profiles/:id - отримання профілю
  - POST /api/upload - завантаження фото
- [ ] Виконати `npm run db:push` для міграції схеми

## Методологія розробки
Розробка ведеться **строго поетапно та послідовно**:
1. Кожна функція розробляється повністю (backend + frontend + тестування)
2. Не починати нову функцію поки попередня не завершена
3. Тестувати одразу після написання
4. Показувати прогрес після кожного етапу

## Дизайн-система
Дотримуємось `design_guidelines.md`:
- Material Design 3 принципи
- Roboto шрифт
- Градієнти purple-to-blue для акцентів
- Темна тема (background: `hsl(240 6% 8%)`)
- Spacing: 8px базова сітка
- Border radius: 6px (md)

## Запуск проекту
```bash
npm run dev  # Запуск frontend + backend
```

## База даних
PostgreSQL database вже налаштована через Replit.
Environment variables:
- DATABASE_URL
- PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

## User Flow
1. User вводить email → перевірка в БД
2. Якщо email існує → вхід до профілю
3. Якщо немає → реєстрація (7 кроків)
4. Після реєстрації → перегляд профілю

## Важливі нотатки
- Авторизація без пароля (тестовий режим)
- Комерційні поля показуються умовно (commerceType)
- Мінімум 1 публічне фото обов'язкове
- Максимум 6 фото в кожній галереї
