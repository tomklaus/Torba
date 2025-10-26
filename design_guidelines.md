# Дизайн-гайдлайни для PWA додатку знакомств

## Дизайн-підхід

**Система**: Material Design 3 (Material-UI/MUI) як основа
**Референси**: Grindr (grid layouts, profile cards), Hornet (social feed), Tinder (swipe interactions), Instagram (photo galleries)

**Філософія**: Створити сучасний, візуально привабливий інтерфейс знакомств з акцентом на фото профілів, швидку навігацію та інтуїтивність. Темна тема як пріоритет для комфортного використання в будь-який час доби.

## Типографія

**Шрифт**: Roboto (Material Design standard) або Montserrat для заголовків
- **Display**: 32px/40px bold - екрани привітання, заголовки сторінок
- **H1**: 24px/32px semibold - основні заголовки
- **H2**: 20px/28px semibold - підзаголовки секцій
- **H3**: 18px/24px medium - заголовки карток
- **Body Large**: 16px/24px regular - основний текст форм
- **Body**: 14px/20px regular - описи, допоміжний текст
- **Caption**: 12px/16px regular - мітки, підписи

**Емоджі**: Використовувати щедро в тексті для створення дружньої атмосфери (🎂✨😈🤔💲🔐📸)

## Layout System

**Spacing Units**: Tailwind-подібна система - базуємось на 4px grid
- **Основні spacing**: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- **Компоненти**: `gap-4` між елементами, `gap-6` між секціями
- **Екрани**: `py-8` padding для мобільних, `py-12` для desktop

**Container Widths**:
- Mobile: повна ширина з `px-4` padding
- Desktop: `max-w-md` (448px) для форм реєстрації (центровані)
- Desktop: `max-w-6xl` для grid-based сторінок (профілі, пошук)
- Desktop: `max-w-4xl` для чатів та feed

**Grid Patterns**:
- Профілі (пошук): `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`
- Галереї фото: `grid-cols-3 gap-2` (компактна мозаїка)

## Компоненти

### Авторизація/Реєстрація
- **Layout**: Центрована карточка на повний екран з gradient background
- **Форма**: Single-column, max-width 400px, білі поля на темному фоні
- **Прогрес**: Stepper component (Material-UI) на топі для 7 кроків
- **Кнопки**: Full-width primary buttons для "Далі", text buttons для "Назад"

### Карточки профілів
- **Структура**: Image-first (aspect ratio 3:4), overlay з ім'ям та основною інфо
- **Hover/Active**: Легкий scale-up (1.02), shadow збільшення
- **Значки**: Маленькі badges для 💲 (комерція), 🔥 (онлайн), ⭐ (верифікований)
- **Distance**: Показувати в правому нижньому куті з location icon

### Галереї фото
- **Публічна**: Masonry grid або рівномірна сітка 2x3, перше фото - primary
- **Приватна**: Blur effect + lock icon overlay, розблоковується кліком
- **Upload**: Drag-and-drop зона з превью, progress indicators
- **Compression**: Показувати original size → compressed size

### Форми
- **Input Fields**: Material-UI outlined з українськими labels
- **Select/Dropdown**: Native Material-UI Select з піктограмами
- **Checkboxes**: Material-UI Checkbox з readable labels (16px text)
- **Radio Buttons**: Material-UI Radio groups з емоджі для візуальності
- **Date Picker**: Material-UI DatePicker з українською локалізацією

### Навігація
- **Mobile**: Bottom Navigation (5 іконок) - Пошук, Активність, Додати, Чати, Профіль
- **Desktop**: Sidebar (240px) зліва, завжди видима
- **Tabs**: Material-UI Tabs для вкладок (Всі/Твій город/Избранные)

### Модальні вікна
- **Профіль**: Fullscreen на мобільних, centered Dialog на desktop (max-w-4xl)
- **Фото**: Lightbox з swipe navigation
- **Форми запитів**: Small Dialog (max-w-sm) з кнопками підтвердження

## Кольорова стратегія

**Увага**: Кольори будуть визначені пізніше, але підготувати структуру для:
- Primary color (акцентний для кнопок, links)
- Background layers (3 рівні для depth)
- Surface colors для карточок
- Success/Warning/Error states
- Online indicators (зелений)
- Commercial badge (золотистий для 💲)

## Анімації та інтеракції

**Мінімалістичний підхід** - лише функціональні анімації:
- **Transitions**: 200ms ease-in-out для hover states
- **Page transitions**: Простий fade або slide (300ms)
- **Loading**: Material-UI Skeleton screens для content, CircularProgress для actions
- **Swipe gestures**: Для галерей фото та можливо профілів (optional Tinder-like)

**Заборонені**: Надмірні scroll-triggered animations, fancy hero animations

## Адаптивність

### Mobile-First (320px - 767px)
- Single column layouts
- Full-width buttons
- Bottom navigation
- Swipeable tabs
- Touch-friendly tap targets (min 48px)

### Desktop (768px+)
- Multi-column grids для профілів
- Sidebar navigation
- Hover states
- Larger imagery
- Використання всієї площі екрану (no wasted space)

## Особливості UX

**Онбординг (7 кроків)**:
- Прогрес-бар на кожному кроці
- "Зберегти та продовжити пізніше" option
- Валідація в реальному часі
- Helpful tooltips для складних полів

**Комерційні профілі**:
- Чітка візуальна індикація (💲 badge)
- Окремі кольорові маркери
- Structured information display

**Безпека та приватність**:
- Blur для NSFW контенту з розблокуванням
- Приватні галереї з request system
- Візуальні індикатори запитів доступу

## Іконки

**Бібліотека**: Material Icons (Material-UI integrated)
- Використовувати Outlined variant для консистентності
- Розмір: 24px для navigation, 20px для inline, 16px для badges

## Images

**Відсутність hero images**: Це utility-focused app, фокус на user-generated content (профільні фото)

**Placeholder images**:
- Default avatar (gradient або pattern)
- Empty state illustrations для порожніх галерей
- Onboarding illustrations (опціонально) для кроків реєстрації

**Photo handling**:
- Lazy loading з blur-up placeholder
- Progressive JPEG
- WebP з fallback
- Max 720p compression

---

**Підсумок**: Створити чистий, сучасний dating app interface базуючись на Material Design з натхненням від Grindr/Hornet - фокус на фото, швидкій навігації та інтуїтивності. Темна тема, український інтерфейс, повна адаптивність.