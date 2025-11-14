# dionis.plus — Платформа знайомств LGBTQ+ України

## Огляд проекту
Progressive Web Application (PWA) для LGBTQ+ спільноти України. Платформа dionis.plus об'єднує функціонал популярних додатків для знайомств з безкоштовним доступом до преміум функцій, створюючи інклюзивний простір для української LGBTQ+ спільноти.

## Поточний стан
**Етап:** MVP Development - ✅ Full 10-Step Registration Complete with Real Photo Upload
**Дата останнього оновлення:** 27 жовтня 2025

**Completed Features:**
- ✅ Email-only authentication (creates user in DB)
- ✅ 10-step registration with all fields from specification
  - Крок 1: Обов'язкові поля (ім'я, дата, місто, параметри, роль, цілі)
  - Крок 2: Налаштування комерції
  - Кроки 3-6: Комерційні налаштування (4 блоки, умовні)
  - Крок 7: Фото галереї (публічні/приватні з локальним preview + batch upload на submit)
  - Крок 8: Додаткові поля (про себе, інтереси, ВІЛ-статус, мови тощо) - опціонально
  - Крок 9: Контактна інформація (соцмережі, email, phone) - опціонально
  - Крок 10: Сексуальний профіль (13 блоків полів згідно специфікації) - опціонально
- ✅ **NEW: Real photo upload system**:
  - Local preview with File objects (deletable before upload)
  - Batch upload to ImgBB.com on registration completion
  - Sharp compression (800px max, skips GIFs)
  - NsfwSpy.js moderation (96% accuracy, MobileNetV2, 537k images dataset)
  - GIF support (extracts middle frame for NSFW analysis)
- ✅ Full API integration (auth/check, profiles CRUD, upload)
- ✅ Data persistence to PostgreSQL with all 10 steps
- ✅ Error handling and loading states throughout
- ✅ PWA manifest and service worker
- ✅ Responsive design (mobile + desktop)
- ✅ Optional steps with "Пропустити" button (Steps 8-10)

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
- ✅ PWA manifest, іконки та service worker (працює в dev mode через Express middleware fix)
- ✅ Темна тема Material Design
- ✅ Український інтерфейс
- ✅ data-testid на всіх interactive елементах
- ✅ Всі емоджі замінені на Lucide іконки
- ✅ Database schema з правильними defaults для JSONB масивів

## Implemented Features

### Backend (✅ Complete)
- ✅ PostgreSQL database via Neon with Drizzle ORM
- ✅ DatabaseStorage with full CRUD operations
- ✅ API Endpoints:
  - POST /api/auth/check - Email verification + user creation
  - POST /api/profiles - Create profile (with full Zod validation)
  - GET /api/profiles/:userId - Get profile
  - PATCH /api/profiles/:userId - Update profile (userId immutable)
  - POST /api/upload - Mock photo upload endpoint
- ✅ Zod validation on all endpoints
- ✅ Database schema migrated via `npm run db:push`

### Frontend (✅ Complete)
- ✅ LoginPage connected to POST /api/auth/check
- ✅ RegistrationFlow connected to POST /api/profiles
- ✅ Proper async flow (awaits API before navigation)
- ✅ Full error handling with UI display
- ✅ Loading states with spinners
- ✅ localStorage for userId/email persistence
- ✅ Success page after registration

### Testing (✅ Complete)
- ✅ End-to-end playwright tests passing
- ✅ Full user flow verified (login → register → profile)
- ✅ Database persistence confirmed
- ✅ Commerce logic tested (commerceType = "no" skips steps 3-6)

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

Перед стартом встановіть залежності для розробки:

```bash
npm install
```

Для production деплойментів використовуйте сучасну команду без deprecated `npm config set production`:

```bash
npm install --omit=dev
```

Після цього запускайте локальне середовище:

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

### Schema Alignment
- Frontend uses `registrationSchema` in RegistrationFlow.tsx for client-side validation
- Backend will use `step1Schema`...`step7Schema` from shared/schema.ts for API validation
- Schemas are aligned but duplicated (by design - client validation separate from API validation)
- Integration happens in Task 2

### Service Worker Setup
- Development: sw-dev.js served via Express middleware (server/index.ts) with correct MIME type
- Production: service-worker.js with full offline caching
- Registration happens in client/src/main.tsx
- Browser logs confirm successful registration: "[SW] Service Worker registered successfully"

## Step 10: Сексуальний профіль (13 блоків полів)
**Всі поля опціональні**. Повністю відповідає документу "Шоста сторінка - Сексуальний профіль":

1. **Досвід** (single select): Початківець, Середній, Досвідчений, Експерт
2. **Ставлення до презервативів** (single select): Завжди, Зазвичай, Іноді, Ніколи
3. **Обрізання** (single select): Обрізаний, Необрізаний
4. **Улюблені пози** (multi select): Місіонерська, Ззаду, Наїзник, На боці, Стоячи
5. **Бажана частота сексу** (single select): Щоденно, Кілька разів на тиждень, Раз на тиждень, Кілька разів на місяць, Раз на місяць, Кілька разів на рік, Залежить від партнера, Зараз неактуально/Утримання
6. **Груповий секс** (single select): Люблю, Іноді, Ні, Хочу але ще не робив, Спостерігач
7. **Ставлення до речовин у сексі** (single select): Ні (тверезий), Іноді (легкі поперси), Так (сильніші)
8. **Улюблені активності** (multi select): 10 варіантів (Оральний, Анальний, Лизання ануса, 69, Фістинг, Масаж простати, Стимуляція сосків, Ручна стимуляція, Секс з іграшками, Легке зв'язування)
9. **Іграшки/Аксесуари** (multi select): 10 варіантів (Вібратори, Анальні пробки, Наручники, Мотузки, Підвіс, Анальні намиста, Фалоімітатори, Масажери простати, Кільця для пеніса, Маски/Пов'язки)
10. **Місце зустрічі** (multi select): Дома, Готель, Сауна/Клуб, Природа
11. **Після сексу** (multi select): Обійми/Розмова, Швидкий душ, Ніч разом, Нічого
12. **Фетиші/вподобання** (multi select): 15 варіантів (Bears, Leather, Uniform, Sportswear, Daddies, Jocks, Twinks, BDSM, Cruising, Foot Fetish, Group Sex, Latex/Rubber, Underwear Fetish, Voyeurism, Exhibitionism)
13. **Роль у BDSM** (multi select): 9 варіантів (Dom, Master, Sadist, Sub, Slave, Masochist, Switch, Kinky/Experimental, Curious/Learning)

**Database schema**: Всі поля додані до `profiles` table (TEXT для single select, JSONB для multi select).

## Known Limitations (MVP)
- Photo upload uses mock URLs (real file storage in future)
- Profile page shows placeholder UI (full profile view in future)
- No user session management yet (localStorage only)
- No profile editing after creation (PATCH endpoint ready, UI pending)

## Next Steps (Future)
- [ ] Real photo upload with file storage
- [ ] Full profile view and editing
- [ ] User discovery/search functionality
- [ ] Messaging system
- [ ] Match/like system
- [ ] Production deployment configuration
