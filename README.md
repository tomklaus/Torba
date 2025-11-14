# dionis.plus

Платформа знайомств для LGBTQ+ спільноти в Україні. Цей монорепозиторій містить React PWA (Progressive Web App) клієнт, побудований з Vite, та Express сервер з підтримкою REST API, автентифікації, управління профілями та завантаження зображень з NSFW модерацією.

**Ключові технології:** Express, React 18, Drizzle ORM (PostgreSQL), pg (TCP), Sharp, @tensorflow/tfjs-node, NsfwSpy, Tailwind CSS v4, Framer Motion.

## Архітектура проєкту

Проєкт організований як монорепозиторій із трьома основними папками:

- **`client/`** — React SPA з PWA функціоналом, побудований з Vite
- **`server/`** — Express API сервер з роутами, middleware та бізнес-логікою
- **`shared/`** — Спільна Drizzle схема бази даних і типи TypeScript

Детальніше про архітектуру та потік даних читайте в [`docs/architecture.md`](./docs/architecture.md).

## Встановлення

Встановіть залежності локально командою:

```bash
npm install
```

Для продакшн-збірки (Railway, CI/CD тощо), пропустіть dev залежності:

```bash
npm install --omit=dev
```

Це замінює застарілий підхід `npm config set production` та усуває попередження `npm WARN config production` під час встановлення.

## Деплой на Railway

Railway запускає ваш сервер у стандартному Node.js середовищі. PostgreSQL доступний через TCP — не WebSocket. Цей проєкт налаштований виключно на використання драйвера `pg`.

- **База даних:** `pg` Pool через TCP
- **ORM:** Drizzle (`drizzle-orm/node-postgres`)
- **Runtime:** Node.js (Express сервер; без Edge runtime)

### Встановлення залежностей

Використовуйте `npm install --omit=dev` у кроках збірки Railway для встановлення лише runtime залежностей без застарілого флагу `npm config set production`.

### Змінні оточення

Скопіюйте `.env.example` у `.env` та налаштуйте:

- **`DATABASE_URL`** — рядок підключення до PostgreSQL.
  - **Важливо:** НЕ додавайте параметри `?sslmode=`. Сервер керує SSL конфігурацією автоматично.
  - Для продакшну (Railway) сервер автоматично вмикає SSL з підтримкою самопідписаних сертифікатів.
  - SSL конфігурація: `{ rejectUnauthorized: false, checkServerIdentity: () => undefined }` для не-локальних хостів.
  - Для локальної розробки SSL автоматично вимкнений.
  
- **`SESSION_SECRET`** — секретний ключ для Express сесій.
  - Згенеруйте випадковий рядок мінімум 32 символи для продакшну.
  - Приклад генерації: `openssl rand -base64 32`
  
- **`CLIENT_ORIGIN`** — URL клієнтського додатка для CORS.
  - Локально: `http://localhost:5173`
  - Railway: `https://your-app-name.up.railway.app`
  
- **`SOCKET_ORIGIN`** — URL для WebSocket з'єднань (зазвичай співпадає з `CLIENT_ORIGIN`).
  
- **`MAP_PROVIDER_KEY`** — API ключ для провайдера карт (Google Maps, Mapbox тощо).
  - Необхідний для функціоналу геолокації та відображення карт.
  
- **`IMGBB_API_KEY`** — API ключ для ImgBB хостингу зображень.

- **`TF_CPP_MIN_LOG_LEVEL`** (опціонально) — встановіть на `2` щоб зменшити логи TensorFlow.

### Health and diagnostics

- `GET /api/health` — returns `{ status, node, db }` where `db` is `connected` or `unavailable`.
- On boot, the server performs a non-fatal Postgres `SELECT 1` health probe and logs the result.

### Error handling

All API routes wrap DB operations with defensive error handling. If the database is unavailable, endpoints return HTTP 503 with a JSON body:

```json
{ "message": "База даних недоступна" }
```

In particular, `POST /api/auth/check` will no longer return a 500 on transient DB failures; it returns 503 and logs the root cause. Other validation and not-found cases return appropriate 4xx statuses.

### NSFW model and TensorFlow

TensorFlow is initialized exactly once using a singleton initializer (`server/nsfw.ts`). The NSFW model (NsfwSpy) is also loaded once and reused.

- `TF_CPP_MIN_LOG_LEVEL=2` reduces TensorFlow native logs.
- The upload pipeline compresses images, uploads to ImgBB, and classifies them with the NSFW model.

## Розробка

### Скрипти для розробки

- **`npm run dev`** — запуск Express з Vite у режимі middleware (розробка).
  - Сервер доступний на `http://localhost:5000`
  - Vite dev server інтегрований для hot-reload клієнта
  
- **`npm run build`** — збірка клієнта та сервера для продакшну.
  - Клієнт збирається у `dist/public/` (статичні файли)
  - Сервер збирається у `dist/` (Node.js bundle)
  
- **`npm start`** — запуск зібраного сервера у продакшн-режимі.
  - Сервер роздає статичні файли з `dist/public/`
  - Railway використовує цю команду для запуску додатка

### Локальна розробка

1. Створіть `.env` файл на основі `.env.example`
2. Запустіть PostgreSQL локально або використовуйте хмарну БД
3. Виконайте міграції: `npm run db:migrate`
4. (Опціонально) Додайте тестові дані: `npm run db:seed`
5. Запустіть dev сервер: `npm run dev`
6. Відкрийте браузер на `http://localhost:5000`

## Утиліти бази даних

Легкі хелпери для міграцій гарантують, що необхідні розширення та таблиці існують (ідемпотентні):

- **`npm run db:migrate`** — гарантує існування розширень/таблиць
- **`npm run db:reset`** — видаляє та пересоздає таблиці (деструктивно; запитує підтвердження)
- **`npm run db:seed`** — створює тестового користувача для розробки (username: `test_user`, email: `test@example.com`)
- **`npm run check`** — перевірка типів TypeScript

### Схема бази даних

База даних містить дві основні таблиці:

**users** (користувачі):
- `id` (varchar, UUID primary key)
- `username` (varchar(255), unique, not null) — автогенерується як `guest_<randomId>` якщо не вказано
- `email` (text, unique, nullable)
- `created_at` (timestamp)

**profiles** (профілі):
- Містить всю інформацію профілю користувача з 10-крокової реєстрації
- Foreign key до `users(id)` з CASCADE delete
- Включає поля для особистої інформації, налаштувань комерції, фото, контактів та сексуального профілю

При першому запуску сервер автоматично:
1. Створює необхідні PostgreSQL розширення (pgcrypto для генерації UUID)
2. Створює таблиці якщо вони не існують
3. Мігрує існуючі схеми (додає відсутні колонки, коригує обмеження)
4. Валідує та логує стан бази даних

Логи валідації схеми показують:
- Список існуючих таблиць
- Структуру колонок таблиці users
- Кількість записів для users та profiles

## Структура проєкту

```
dionis-plus/
├── client/              # React PWA клієнт
│   ├── src/            # Вихідний код React компонентів
│   └── index.html      # HTML точка входу
├── server/             # Express API сервер
│   ├── index.ts        # Точка входу сервера
│   ├── routes.ts       # API роути
│   ├── db.ts          # Підключення до БД
│   ├── upload.ts       # Логіка завантаження зображень
│   └── nsfw.ts         # NSFW модерація
├── shared/             # Спільний код (схема БД, типи)
│   └── schema.ts       # Drizzle ORM схема
├── lib/                # Утиліти та хелпери
├── public/             # Статичні ресурси (PWA маніфест, іконки)
├── dist/               # Вихідні файли збірки
│   ├── public/         # Зібраний клієнт (статика)
│   └── index.js        # Зібраний сервер
└── docs/               # Документація
    └── architecture.md # Деталі архітектури
```

Детальніше про архітектуру див. [`docs/architecture.md`](./docs/architecture.md).
