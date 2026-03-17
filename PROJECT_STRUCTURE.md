# EthosLife Platform - Полная Документация Проекта

**Версия:** 2.0.0  
**Дата обновления:** Март 2026  
**Статус:** Production Ready

---

## 📋 Содержание

1. [Общая Архитектура](#общая-архитектура)
2. [Страницы и Маршруты](#страницы-и-маршруты)
3. [Библиотеки и Зависимости](#библиотеки-и-зависимости)
4. [Компоненты и Модули](#компоненты-и-модули)
5. [API и Бэкенд](#api-и-бэкенд)
6. [База Данных](#база-данных)
7. [Связи и Зависимости](#связи-и-зависимости)

---

## 🏗️ Общая Архитектура

```
EthosLife Platform/
├── Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── contexts/       # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Zustand store
│   │   ├── services/       # API сервисы
│   │   ├── routes/         # Маршрутизация
│   │   ├── i18n/           # Интернационализация
│   │   ├── web3/           # Web3 интеграции
│   │   └── utils/          # Утилиты
│   └── public/
│
├── Backend (Node.js + Express)
│   ├── controllers/        # Бизнес-логика
│   ├── routes/             # API маршруты
│   ├── services/           # Сервисы
│   ├── middleware/         # Middleware
│   ├── webhooks/           # Webhook обработчики
│   └── migrations/         # Миграции БД
│
└── Database (PostgreSQL)
```

---

## 📄 Страницы и Маршруты

### V2 Основные Страницы (Production)

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/` | `LandingV2` / `UnifiedHomePage` | Главная страница / Лендинг | ✅ Active |
| `/dashboard` | `DashboardV2` | Панель управления | ✅ Active |
| `/v2` | `InvestorDemo` | Демо для инвесторов | ✅ Active |
| `/login` | `Login` | Страница входа | ✅ Active |
| `/register` | `Register` | Страница регистрации | ✅ Active |

### Health Модули (V2)

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/health/nutrition` | `Nutrition2` / `NutritionUnified` | Питание | ✅ Active |
| `/health/movement` | `Movement2` / `MovementUnified` | Движение/Фитнес | ✅ Active |
| `/health/sleep` | `Sleep2` / `SleepUnified` | Сон | ✅ Active |
| `/health/psychology` | `Psychology2` / `PsychologyUnified` | Психология | ✅ Active |
| `/health/medicine` | `Medicine2` / `MedicineUnified` | Медицина | ✅ Active |
| `/health/relationships` | `Relationships2` / `RelationshipsUnified` | Отношения | ✅ Active |
| `/health/habits` | `Habits2` / `HabitsUnified` | Привычки | ✅ Active |

### Social Модули (V2)

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/social` | `SocialFeed2` / `SocialFeedUnified` | Лента | ✅ Active |
| `/social/messages` | `MessagesUnified` | Сообщения | ✅ Active |
| `/social/groups` | `GroupsUnified` | Группы | ✅ Active |
| `/social/challenges` | `ChallengesUnified` | Челленджи | ✅ Active |

### AI & Analytics

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/ai-chat` | `AIChatUnified` | Унифицированный чат (ИИ + Общий) | ✅ Active |
| `/analytics` | `Analytics2` / `AnalyticsUnified` | Аналитика | ✅ Active |
| `/gamification` | `Gamification2` / `GamificationUnified` | Геймификация | ✅ Active |

### Specialists & Centers

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/specialists` | `Specialists2` / `SpecialistsUnified` | Специалисты | ✅ Active |
| `/centers` | `Centers2` / `CentersUnified` | Центры здоровья | ✅ Active |

### User & Settings

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/profile` | `Profile2` / `ProfileUnified` | Профиль | ✅ Active |
| `/settings` | `Settings2` / `SettingsUnified` | Настройки | ✅ Active |
| `/wallet` | `WalletV1` / `WalletUnified` | Кошелёк | ✅ Active |

### Landing Pages

| Путь | Компонент | Описание | Статус |
|------|-----------|----------|--------|
| `/features` | `FeaturesV2` | Возможности | ✅ Active |
| `/pricing` | `PricingV2` | Тарифы | ✅ Active |
| `/team` | `TeamV2` | Команда | ✅ Active |
| `/roadmap` | `RoadmapV2` | Дорожная карта | ✅ Active |
| `/faq` | `FAQV2` | FAQ | ✅ Active |
| `/blog` | `BlogV2` | Блог | ✅ Active |

### V1 Legacy (Доступны из меню)

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/tokenomics` | `TokenomicsV1` | Токеномика |
| `/friends` | `FriendsV1` | Друзья |
| `/leaders` | `LeadersV1` | Лидеры |
| `/health/fitness` | `FitnessV1` | Фитнес |
| `/health/nutrition/diary` | `FoodDiaryV1` | Дневник питания |
| `/health/nutrition/meal-plan` | `MealPlannerV1` | План питания |
| `/health/nutrition/recipes` | `RecipesV1` | Рецепты |
| `/health/nutrition/products` | `ProductsDBV1` | База продуктов |
| `/health/fitness/exercises` | `ExerciseLibraryV1` | Упражнения |
| `/health/fitness/workout` | `WorkoutLoggerV1` | Тренировки |
| `/health/sleep/analysis` | `SleepAnalysisV1` | Анализ сна |
| `/health/mental/mood` | `MoodTrackerV1` | Трекер настроения |
| `/health/medical/medications` | `MedicationsV1` | Лекарства |
| `/notifications` | `NotificationsV1` | Уведомления |
| `/activity` | `ActivityV1` | Активность |
| `/search` | `SearchV1` | Поиск |

### Design & Static

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/design-system` | `DesignSystemDemo` | Дизайн-система |
| `/whitepaper` | `Whitepaper` | Whitepaper |
| `/privacy` | `Privacy` | Политика конфиденциальности |
| `/terms` | `Terms` | Условия использования |
| `/disclaimer` | `Disclaimer` | Отказ от ответственности |
| `*` | `NotFound404` | 404 страница |

---

## 📚 Библиотеки и Зависимости

### Frontend Dependencies

#### Core
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `react` | ^18.2.0 | UI фреймворк |
| `react-dom` | ^18.2.0 | DOM рендеринг |
| `react-router-dom` | ^6.20.0 | Маршрутизация |
| `typescript` | ^5.2.2 | Типизация |

#### State Management
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `zustand` | ^4.4.7 | Глобальное состояние |
| `@tanstack/react-query` | ^5.8.0 | Server state management |

#### Styling & Animation
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `tailwindcss` | ^3.3.6 | Utility-first CSS |
| `framer-motion` | ^12.35.0 | Анимации |
| `clsx` | ^2.0.0 | Conditional classes |
| `tailwind-merge` | ^2.0.0 | Tailwind class merging |

#### Icons
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `lucide-react` | ^0.294.0 | Иконки |
| `@heroicons/react` | ^2.2.0 | Иконки |

#### i18n
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `i18next` | ^25.8.14 | Интернационализация |
| `react-i18next` | ^16.5.5 | React интеграция |
| `i18next-browser-languagedetector` | ^8.2.1 | Определение языка |
| `i18next-http-backend` | ^3.0.2 | HTTP загрузчик |

#### Web3
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `ethers` | ^6.9.0 | Ethereum библиотека |

#### Forms & Validation
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `react-hook-form` | ^7.71.2 | Управление формами |

#### HTTP & API
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `axios` | ^1.13.6 | HTTP клиент |

#### Charts & Data Viz
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `recharts` | ^2.10.0 | Графики |

#### Markdown
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `react-markdown` | ^10.1.0 | Markdown рендеринг |

#### Utilities
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `date-fns` | ^2.30.0 | Работа с датами |
| `react-hot-toast` | ^2.6.0 | Toast уведомления |

#### Build Tools
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `vite` | ^5.0.0 | Сборщик |
| `@vitejs/plugin-react` | ^4.2.0 | Vite плагин для React |
| `autoprefixer` | ^10.4.16 | CSS autoprefixer |
| `postcss` | ^8.4.32 | PostCSS |

### Backend Dependencies

#### Core
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `express` | ^4.18.2 | Web фреймворк |
| `cors` | ^2.8.5 | CORS middleware |
| `body-parser` | ^1.20.2 | Парсинг тела запросов |
| `dotenv` | ^16.3.1 | Переменные окружения |

#### Database
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `pg` | ^8.11.3 | PostgreSQL клиент |

#### Authentication & Security
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `jsonwebtoken` | ^9.0.2 | JWT токены |
| `bcrypt` | ^5.1.1 | Хеширование паролей |
| `google-auth-library` | ^9.0.0 | Google OAuth |

#### Bot & Notifications
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `node-telegram-bot-api` | ^0.64.0 | Telegram бот |
| `nodemailer` | ^6.9.7 | Email рассылка |

#### Payments
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `stripe` | ^14.0.0 | Платежи Stripe |

#### Utilities
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `uuid` | ^9.0.1 | Генерация UUID |
| `node-cron` | ^3.0.3 | Cron задачи |
| `fs-extra` | ^11.2.0 | Работа с файлами |

#### Development
| Пакет | Версия | Назначение |
|-------|--------|------------|
| `nodemon` | ^3.0.2 | Hot reload |

---

## 🧩 Компоненты и Модули

### Компоненты (components/)

#### Auth Components
| Компонент | Описание |
|-----------|----------|
| `GuestAccessRoute` | Маршрут для гостей |
| `Login` | Форма входа |
| `Register` | Форма регистрации |

#### Layout Components
| Компонент | Описание |
|-----------|----------|
| `Layout` | Основной layout с навигацией |
| `ElLayout` | Unified layout |
| `VersionToggle` | Переключатель версий V1/V2 |

#### ElCore (Design System)
| Компонент | Описание |
|-----------|----------|
| `ElCard` | Карточка с вариантами |
| `ElButton` | Кнопка с вариантами |
| `ElInput` | Поле ввода |
| `ElBadge` | Бейдж |
| `ElAvatar` | Аватар |
| `ElModal` | Модальное окно |

#### ElGadgets / ElWidgets
| Компонент | Описание |
|-----------|----------|
| Виджеты здоровья | Питание, фитнес, сон |
| Гаджеты | Метрики, трекеры |

#### WidgetSystem
| Компонент | Описание |
|-----------|----------|
| `WidgetRenderer` | Рендеринг виджетов |
| `WidgetGrid` | Сетка виджетов |

#### Web3 Components
| Компонент | Описание |
|-----------|----------|
| `WalletConnect` | Подключение кошелька |
| `TokenBalance` | Баланс токенов |

### Контексты (contexts/)

| Контекст | Описание |
|----------|----------|
| `VersionContext` | Управление версией V1/V2 |
| `GuestDataContext` | Данные гостя (temp storage) |

### Store (store/)

| Store | Описание |
|-------|----------|
| `authStore` | Состояние аутентификации (Zustand) |
| `widgetStore` | Состояние виджетов (Zustand) |

### Services (services/)

| Сервис | Описание |
|--------|----------|
| `api` | Axios HTTP клиент |
| `tempStorage` | Временное хранение для гостей |

### i18n (i18n/)

| Язык | Код |
|------|-----|
| English | en |
| Spanish | es |
| Chinese (Simplified) | zh |
| Hindi | hi |
| Arabic | ar |
| French | fr |
| German | de |
| Japanese | ja |
| Portuguese | pt |
| Russian | ru |
| Korean | ko |
| Italian | it |
| Turkish | tr |
| Dutch | nl |
| Polish | pl |
| Vietnamese | vi |
| Thai | th |
| Indonesian | id |
| Ukrainian | uk |
| Romanian | ro |
| Czech | cs |
| Greek | el |
| Hebrew | he |
| Swedish | sv |
| Hungarian | hu |

---

## 🔌 API и Бэкенд

### API Endpoints

#### Auth Routes (`/api/auth`)
| Метод | Путь | Описание | Controller |
|-------|------|----------|------------|
| POST | `/register` | Регистрация | `authController` |
| POST | `/login` | Вход | `authController` |
| POST | `/google` | Google OAuth | `authController` |
| POST | `/logout` | Выход | `authController` |
| GET | `/me` | Текущий пользователь | `authController` |

#### Health Routes (`/api/health`)
| Метод | Путь | Описание | Controller |
|-------|------|----------|------------|
| GET | `/profile` | Получить профиль здоровья | `healthController` |
| POST | `/profile` | Обновить профиль | `healthController` |
| GET | `/metrics` | Получить метрики | `healthController` |
| POST | `/metrics` | Добавить метрику | `healthController` |
| GET | `/goals` | Получить цели | `healthController` |
| POST | `/goals` | Создать цель | `healthController` |

#### AI Routes (`/api/ai`)
| Метод | Путь | Описание | Controller |
|-------|------|----------|------------|
| GET | `/conversations` | Список чатов | `aiController` |
| POST | `/conversations` | Создать чат | `aiController` |
| GET | `/conversations/:id/messages` | Сообщения чата | `aiController` |
| POST | `/conversations/:id/messages` | Отправить сообщение | `aiController` |
| POST | `/ask` | Быстрый вопрос | `aiController` |

#### Subscription Routes (`/api/subscriptions`)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Получить подписки |
| POST | `/` | Создать подписку |
| DELETE | `/:id` | Отменить подписку |

#### Referral Routes (`/api`)
| Метод | Путь | Описание | Service |
|-------|------|----------|---------|
| GET | `/referrals` | Получить рефералов | `referralService` |
| POST | `/referrals` | Создать реферала | `referralService` |

#### Cashback Routes (`/api`)
| Метод | Путь | Описание | Service |
|-------|------|----------|---------|
| GET | `/cashback` | Получить cashback | `cashbackService` |
| POST | `/cashback` | Начислить cashback | `cashbackService` |

#### Product Routes (`/api/products`)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Список продуктов |
| GET | `/:id` | Продукт по ID |
| POST | `/` | Создать продукт |

#### Cart Routes (`/api/cart`)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Получить корзину |
| POST | `/items` | Добавить в корзину |
| DELETE | `/items/:id` | Удалить из корзины |

#### Order Routes (`/api/orders`)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Список заказов |
| POST | `/` | Создать заказ |
| GET | `/:id` | Заказ по ID |

#### Specialists Routes (`/api/specialists`)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Список специалистов |
| GET | `/:id` | Специалист по ID |
| POST | `/appointment` | Записаться |

#### Centers Routes (`/api/centers`)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Список центров |
| GET | `/:id` | Центр по ID |

#### Stripe Webhook
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/webhooks/stripe` | Stripe webhook |

---

## 🗄️ База Данных

### Таблицы PostgreSQL

#### Users
```sql
- id (UUID, PK)
- full_name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- phone (VARCHAR)
- wallet_address (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Health Profiles
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- gender (VARCHAR)
- height_cm (DECIMAL)
- weight_kg (DECIMAL)
- activity_level (VARCHAR)
- sleep_hours_avg (DECIMAL)
- created_at (TIMESTAMP)
```

#### Health Metrics
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- category (VARCHAR)
- metric_type (VARCHAR)
- value (DECIMAL)
- unit (VARCHAR)
- recorded_at (TIMESTAMP)
```

#### Goals
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- category (VARCHAR)
- title (VARCHAR)
- current_value (DECIMAL)
- target_value (DECIMAL)
- unit (VARCHAR)
- status (VARCHAR)
- created_at (TIMESTAMP)
```

#### AI Conversations
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- title (VARCHAR)
- message_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### AI Messages
```sql
- id (UUID, PK)
- conversation_id (UUID, FK)
- role (VARCHAR)
- content (TEXT)
- model (VARCHAR)
- tokens_used (INTEGER)
- response_time_ms (INTEGER)
- created_at (TIMESTAMP)
```

#### AI Usage
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- request_type (VARCHAR)
- model (VARCHAR)
- tokens_input (INTEGER)
- tokens_output (INTEGER)
- created_at (TIMESTAMP)
```

#### Subscriptions
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- plan_type (VARCHAR)
- status (VARCHAR)
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### Referrals
```sql
- id (UUID, PK)
- referrer_id (UUID, FK)
- referred_id (UUID, FK)
- code (VARCHAR)
- created_at (TIMESTAMP)
```

#### Products
```sql
- id (UUID, PK)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- category (VARCHAR)
- created_at (TIMESTAMP)
```

#### Orders
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- total_amount (DECIMAL)
- status (VARCHAR)
- created_at (TIMESTAMP)
```

#### Cart Items
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- product_id (UUID, FK)
- quantity (INTEGER)
- created_at (TIMESTAMP)
```

#### Knowledge Chunks (RAG)
```sql
- id (UUID, PK)
- category (VARCHAR)
- title (VARCHAR)
- content (TEXT)
- embedding (VECTOR)
- created_at (TIMESTAMP)
```

---

## 🔗 Связи и Зависимости

### Frontend → Backend

```
App.tsx (Frontend)
    ↓
API Service (axios)
    ↓
Express Routes (Backend)
    ↓
Controllers
    ↓
Services
    ↓
Database (PostgreSQL)
```

### Компонентные Зависимости

```
Layout
├── Navigation
│   └── VersionToggle
│       └── VersionContext
├── Header
│   └── Logo
└── Footer

Pages
├── LandingV2
│   ├── Hero
│   ├── Features
│   └── CTA
├── DashboardV2
│   ├── WidgetGrid
│   │   └── widgetStore
│   └── HealthSummary
└── AIChatUnified
    ├── MessageList
    ├── InputArea
    └── Sidebar
        └── HealthContextPanel
```

### State Management Flow

```
User Action
    ↓
Component
    ↓
Zustand Store (authStore, widgetStore)
    ↓
API Call
    ↓
Backend Controller
    ↓
Database
```

### i18n Flow

```
App Initialization
    ↓
i18n/config.ts
    ↓
Language Detection (localStorage/navigator)
    ↓
Load Translation JSON
    ↓
React Components (useTranslation)
```

### Web3 Integration

```
WalletConnect Component
    ↓
ethers.js
    ↓
Smart Contract (Unity Token)
    ↓
Backend (wallet_address storage)
```

---

## 🎨 Design System

### Цветовая Палитра

```
Bone/Ivory:
- #dcd3c6 (Base background)
- #e4dfd5 (Cards, surfaces)
- #d4ccb8 (Secondary surfaces)
- #c9b8a6 (Borders, accents)

Text:
- #2d2418 (Primary text - Ink)
- #5c5243 (Secondary text - Ink light)
- #7a6e5d (Tertiary text - Stamp)

Accent:
- #10b981 (Emerald - Success)
- #06b6d4 (Cyan - Technology/AI)
- #f59e0b (Amber - Premium)
- #f43f5e (Rose - Health/Alerts)
```

### Neumorphism Styles

```css
.convex - Выпуклая поверхность
.concave - Вогнутая поверхность
.flat - Плоская поверхность
.pressed - Нажатое состояние
```

---

## 📊 Производительность

### Code Splitting
- Lazy loading всех страниц
- Динамические импорты через `React.lazy()`
- Suspense fallback для загрузки

### Оптимизация
- Vite build с minification
- Asset hashing для cache busting
- Source maps для отладки

---

## 🚀 Деплой

### Frontend
- Vercel / Netlify
- Build: `npm run build`
- Output: `frontend/dist`

### Backend
- Node.js сервер
- Start: `npm start`
- Dev: `npm run dev`

### Database
- PostgreSQL (production)
- In-memory fallback (development)

---

## 📝 Примечания

1. **V2 - Основная версия**: Все новые функции реализуются в V2
2. **V1 Legacy**: Старые компоненты сохраняются для обратной совместимости
3. **Guest Mode**: Гости могут использовать все функции с временным хранением данных
4. **i18n**: 25 языков с поддержкой RTL
5. **Web3**: Интеграция с Ethereum для токенов UNITY

---

*Документ сгенерирован автоматически. Актуальная версия всегда в репозитории.*
