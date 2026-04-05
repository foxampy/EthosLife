# EthosLife Platform — Полный Аудит и Спецификация

> Дата: 5 апреля 2026
> Версия: 3.0.0
> Статус: 🔄 Активная разработка

---

# ЧАСТЬ 1: ОПИСАНИЕ ПЛАТФОРМЫ

## 1.1 Что такое EthosLife

**EthosLife** — это платформа здоровья и благополучия, объединяющая 7 модулей здоровья, социальную сеть, ИИ-коучинг и маркетплейс специалистов в едином интерфейсе.

**Основная идея:** Вместо переключения между 10+ приложениями — всё здоровье, от питания до социальных связей, в одном месте с ИИ-помощником.

**Слоган:** "Health is a Daily Habit"

**Целевая аудитория:**
- Люди, следящие за здоровьем (25-55 лет)
- Специалисты в области здоровья и медицины
- Центры здоровья, клиники, залы
- Научные исследователи

---

## 1.2 Архитектура

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (Vite)                │
│  React 18 + TypeScript + Tailwind CSS           │
│  Framer Motion + Lucide Icons + Zustand         │
│  i18next (25 языков)                             │
│  react-router-dom (55+ маршрутов)                │
└─────────────────────┬───────────────────────────┘
                      │ REST API
┌─────────────────────┴───────────────────────────┐
│               BACKEND (Express.js)              │
│  Node.js + PostgreSQL                           │
│  JWT Auth + bcrypt + Stripe                     │
│  Telegram Bot + Google Auth                     │
│  Qwen AI Integration                            │
└─────────────────────────────────────────────────┘
```

**Хостинг:**
- Frontend → Vercel
- API → Render
- Database → PostgreSQL (Render)

---

# ЧАСТЬ 2: ПОЛНЫЙ СПИСОК СТРАНИЦ

## 2.1 Лендинги (7 страниц)

### `/` — Главная Landing (Landing.tsx)
**Описание:** Основной лендинг для новых пользователей
**Секции:**
- Hero с CTA кнопками ("Начать бесплатно", "Смотреть демо")
- Сетка возможностей (9 карточек)
- Статистика (100K+ Users, 4.9 Rating, 35% Health Improvement, 24/7 AI)
- Отзывы (карусель, 3 отзыва)
- Pricing teaser (3 плана)
- CTA баннер
**Переводы:** ✅ Частично (t() для заголовков, хардкод для отзывов)
**API:** Нет (статичная)

### `/landing2` — Landing V2 (Landing2.tsx)
**Описание:** Альтернативная версия лендинга с акцентом на DAO и токеномику
**Секции:**
- Hero: "Здоровье. Сообщество. Токены. DAO."
- Статистика (4 метрики)
- 7 модулей здоровья (сетка)
- Возможности (AI, Social, DAO, Token, Cashback, Subscriptions)
- Токеномика (4 карточки)
- Roadmap (Q1-Q4 2026, Q1-Q2 2027)
- CTA
**Переводы:** ❌ Нет (весь текст на русском, хардкод)
**API:** Нет

### `/landing3` — Landing V3 (Landing3.tsx)
**Описание:** Расширенный лендинг с детальным описанием экосистемы
**Секции:**
- Hero: "Health DAO Ecosystem"
- 7 модулей здоровья с метриками
- 4 столпа экосистемы (Health, Social, DAO, Tokenomics)
- Token Utility (4 карточки)
- 4 механики заработка
- Партнёрская сеть
- Инвестиционные раунды
- CTA
**Переводы:** ❌ Нет (русский/английский хардкод)
**API:** Нет

### `/features` — Возможности
**Описание:** Детальное описание 7 модулей + 6 продвинутых фич
**Секции:**
- 7 модулей здоровья (подробные карточки)
- 6 Advanced Features (AI-Coach, Predictive Analytics, Gamification, Community, Wearables, Privacy)
- R&D статистика (12 проектов, 30K участников, 9 публикаций, 60+ патентов)
- Hardware (Posture CV, Posture Wearables $79-129, Smart Camera $299-399)
- CTA
**Переводы:** ❌ Нет
**API:** Нет

### `/pricing` — Ценообразование
**Описание:** 3 тарифных плана
**Секции:**
- Billing toggle (месяц/год)
- Free ($0), Premium ($9.99/мес), Pro ($19.99/мес)
- Таблица сравнения
- FAQ (5 вопросов)
- B2B CTA
**Переводы:** ❌ Нет
**API:** Нет

### `/team` — Команда
**Описание:** Информация о команде, инвесторах и советниках
**Секции:**
- Статистика команды (50+ лет опыта, 20+ публикаций, 3 exits, 10+ стран)
- 6 членов команды (CEO, CTO, CPO, CMO, Head AI, Head Growth)
- 4 советника
- Инвесторы (5 Angels, 3 Funds, 4 Partners)
- 4 ценности
**Переводы:** ❌ Нет
**API:** Нет

### `/roadmap` — Дорожная карта
**Описание:** Таймлайн развития продукта
**Секции:**
- 4 ключевые метрики
- 6 фаз (Q2 2026 - Q4 2027)
- Проекция выручки (2026-2030)
- 3 ключевых веха (MVP, Wearables, IPO)
**Переводы:** ❌ Нет
**API:** Нет

### `/faq` — Частые вопросы
**Описание:** FAQ с поиском и категориями
**Секции:**
- Поиск
- 6 категорий (General, Features, Subscriptions, Privacy, Community, Devices)
- 4 вопроса в каждой категории (раскрывающиеся)
**Переводы:** ⚠️ Частично
**API:** Нет

### `/blog` — Блог
**Описание:** Блог с категориями и избранными постами
**Секции:**
- Поиск, фильтры (6 категорий)
- 2 избранных поста
- 4 обычных поста
- Newsletter CTA
**Переводы:** ❌ Нет
**API:** Нет (навигация на `/blog/:id` — маршрут не существует)

---

## 2.2 Аутентификация (2 страницы)

### `/login` — Вход
**Описание:** Форма входа
**Секции:**
- Email, Password (show/hide)
- Remember me, Forgot password
- Social login (Google, Apple)
- Регистрация
**Переводы:** ✅ Да
**API:** POST `/auth/login`, `/auth/google`

### `/register` — Регистрация
**Описание:** 3-шаговая регистрация
**Секции:**
- Step 1: Full Name, Email
- Step 2: Password, Confirm, Strength meter
- Step 3: Terms agreement
**Переводы:** ✅ Да
**API:** POST `/auth/register`

---

## 2.3 Dashboard (3 страницы)

### `/dashboard` — Dashboard V1 (legacy)
**Описание:** Старая версия панели с боковым меню
**API:** Нет (моковые данные)

### `/dashboard-v2` — Dashboard V2
**Описание:** Полная панель здоровья с 3 колонками
**Секции:**
- Левая колонка: HealthScore, DailyChecklist, HabitHeatmap
- Центр: DailyRings, StepsCounter, ActivityWidget, NutritionWidget, SleepWidget, MoodWidget, BodyMetricsWidget
- Правая колонка: WaterTracker, GamificationWidget, AIInsightsWidget, UpcomingEvents, QuickActionsWidget
**Переводы:** ⚠️ Частично
**API:** Нет (моковые данные, симуляция в реальном времени)

### `/dashboard-preview` — Предпросмотр Dashboard
**Описание:** Статичный превью дизайна
**API:** Нет

---

## 2.4 Здоровье — V2 (7 страниц, основные)

### `/health/nutrition` — Питание
**Описание:** Трекинг питания и гидратации
**Секции:**
- Calorie Ring (SVG), Macro Rings (Protein/Carbs/Fat)
- Water 3D Glass with bubbles
- Meal Timeline (Breakfast/Lunch/Dinner/Snack)
- Food Entry Modal (Search/Quick Add/AI Scan)
- Recipe Cards (6 рецептов)
- AI Insights, Weekly Calorie Chart
**Переводы:** ✅ Да (t() для UI, хардкод для контента)
**API:** Нет

### `/health/movement` — Активность
**Описание:** Трекинг физической активности
**Секции:**
- Activity Rings (Move/Exercise/Stand)
- Workout Player (Warm Up/Active/Cool Down)
- Rest Timer, Exercise Library (5 категорий)
- Recovery Score, Muscle Fatigue Map
- GPS Tracker, Stats (Steps, Calories, Distance, Active Min, Floors, Heart Rate)
- Personal Records, Workout Programs
**Переводы:** ✅ Да
**API:** Нет

### `/health/sleep` — Сон
**Описание:** Анализ и оптимизация сна
**Секции:**
- Sleep Clock (circular phase chart)
- Sleep Score, Sleep Debt Visualizer
- Smart Alarm, Sleep Timeline (hypnogram)
- Sleep Trends (weekly chart)
- Environment Monitor (temp, humidity, noise, light)
- Chronotype Test (Lion/Bear/Wolf/Dolphin)
- Sleep Hygiene Tips
**Переводы:** ✅ Да
**API:** Нет

### `/health/psychology` — Психология
**Описание:** Ментальное здоровье
**Секции:**
- Mood Orb (анимированный)
- Daily Check-in (mood 1-10, energy, stress)
- Breathing Guide (4-7-8 technique)
- Mood Timeline
- CBT Tools (Thought Record, ABC Worksheet, Behavioral Activation, Worry Tree)
- Meditation Player (4 трека)
- Gratitude Journal
- Crisis Resources
**Переводы:** ⚠️ Частично
**API:** Нет

### `/health/medicine` — Медицина
**Описание:** Управление лекарствами и здоровьем
**Секции:**
- Medication Cards (5 лекарств с take/skip)
- Today's Schedule (morning/afternoon/evening/night)
- Symptom Tracker (type, body location, severity)
- Health Timeline, Lab Results, Health Documents
- Appointments, Vital Signs (BP, HR, Weight, Temp, Glucose, SpO2)
**Переводы:** ✅ Да
**API:** Нет

### `/health/relationships` — Отношения
**Описание:** Социальные связи и коммуникация
**Секции:**
- Social Score Card
- Connections list (10 контактов)
- Contact Log, Goals tracker
- Activity Ideas (16 идей), Conversation Starters
- Gratitude Prompts, Listening Tips
- Assessment Results
**Переводы:** ❌ Нет (весь текст на английском)
**API:** Нет

### `/health/habits` — Привычки
**Описание:** Формирование и отслеживание привычек
**Секции:**
- Habit Cards (6 привычек с weekly progress)
- Streak Counter, Calendar Heatmap
- Achievement Badges (5 бейджей)
- AI Coach panel (3 подсказки)
- Habit Creation Modal (4 шага)
**Переводы:** ❌ Нет
**API:** Нет

---

## 2.5 Здоровье — V1 Legacy (11 страниц)

| Маршрут | Страница | Описание |
|---|---|---|
| `/health/fitness` | FitnessV1 | Фитнес трекер |
| `/health/nutrition/diary` | FoodDiaryV1 | Дневник питания |
| `/health/nutrition/meal-plan` | MealPlannerV1 | Планировщик питания |
| `/health/nutrition/recipes` | RecipesV1 | Рецепты |
| `/health/nutrition/products` | ProductsDBV1 | База продуктов |
| `/health/fitness/exercises` | ExerciseLibraryV1 | Библиотека упражнений |
| `/health/fitness/workout` | WorkoutLoggerV1 | Дневник тренировок |
| `/health/sleep/analysis` | SleepAnalysisV1 | Анализ сна |
| `/health/mental/mood` | MoodTrackerV1 | Трекер настроения |
| `/health/medical/medications` | MedicationsV1 | Лекарства |

---

## 2.6 Социальная сеть (6 страниц)

### `/social` — Social Feed (V2)
**Описание:** Лента постов о здоровье
**Секции:**
- Filters (All/Fitness/Nutrition/Mindfulness/Achievements)
- Create Post (textarea, image/video/emoji, Post button)
- Post Cards (4 моковых поста)
**Переводы:** ❌ Нет

### V1 Social (5 страниц):
| Маршрут | Страница | Описание |
|---|---|---|
| `/challenges` | ChallengesV1 | Челленджи |
| `/friends` | FriendsV1 | Друзья |
| `/groups` | GroupsV1 | Группы |
| `/messages` | MessagesV1 | Сообщения |
| `/leaders` | LeadersV1 | Таблица лидеров |

---

## 2.7 ИИ-коуч (1 страница)

### `/ai-chat` — AI Coach
**Описание:** Чат с ИИ-коучем здоровья
**Секции:**
- Mode Toggle (AI/General)
- Persona Selector (6 персон)
- Chat History sidebar
- Quick Prompts (6 промптов)
- Message Bubbles (markdown, attachments, action cards)
- Health Context Panel
- Chat Settings
**Переводы:** ❌ Нет
**API:** Нет (моковые ответы)

---

## 2.8 Аналитика (1 страница)

### `/analytics` — Аналитика
**Описание:** Детальная аналитика здоровья
**Секции:**
- Overview: Health Score Trend, Radar Health Chart, Weekly Summary, Goal Progress, Key Metrics
- Trends: multi-line charts, date range
- Correlations: scatter plots, heatmap
- AI Insights: insight cards with confidence
- Reports: weekly/monthly reports
- Export options
**Переводы:** ❌ Нет
**API:** Нет

---

## 2.9 Геймификация (1 страница)

### `/gamification` — Достижения
**Описание:** Система достижений, уровней и наград
**Секции:**
- Level Progress (level number, XP bar)
- Stat Cards (Total XP, Badges, Challenges, Streak)
- Streak Card (week view)
- Token Wallet (UNITY tokens)
- Badge Collection (18 бейджей)
- Challenges (6 челленджей)
- Daily Quests (5 квестов)
- Leaderboard (4 категории)
- Rewards Shop (8 наград)
**Переводы:** ❌ Нет
**API:** Нет

---

## 2.10 Специалисты (1 страница)

### `/specialists` — Специалисты
**Описание:** Каталог специалистов здоровья
**Секции:**
- Search, filters (9 специальностей)
- Filters (price, rating, languages, experience, verified)
- Specialist Cards (6 специалистов)
- Detail Modal (about/services/reviews, booking flow)
**Переводы:** ❌ Нет
**API:** Нет

---

## 2.11 Центры здоровья (1 страница)

### `/centers` — Центры здоровья
**Описание:** Каталог центров здоровья
**Секции:**
- Search, Center Type filters (9 типов)
- Center Cards (6 центров)
- Detail Modal (overview/services/reviews/staff)
- Membership options, Reviews, Saved centers
**Переводы:** ❌ Нет
**API:** Нет

---

## 2.12 Профиль и настройки (2 страницы)

### `/profile` — Профиль
**Описание:** Профиль пользователя
**Секции:**
- Overview: Profile card, 4 Quick Stats, Health Score Trend
- Health Data: Personal info, Body Metrics, Allergies, Conditions, Medications, Emergency Contacts
- Goals: 6 целей по категориям
- Achievements: 8 достижений
- Integrations: 7 интеграций (Apple Health, Google Fit, Fitbit, Garmin, MyFitnessPal, Strava, Spotify)
**Переводы:** ❌ Нет
**API:** Нет

### `/settings` — Настройки
**Описание:** Полные настройки платформы (3400 строк)
**Секции:**
- Account, Notifications, Privacy, Health Data, Preferences, Devices, Subscription, Reminders, Social, Danger Zone
**Переводы:** ❌ Нет
**API:** Нет

---

## 2.13 Web3 / Токеномика (3 страницы)

### `/tokenomics` — Tokenomics V1
**Описание:** Описание токена UNITY
**Переводы:** ❌ Нет

### `/token-sale` — Продажа токенов
**Описание:** Покупка токенов UNITY
**Секции:**
- Vesting Progress
- 3 Round cards (Seed/Private/Public)
- Purchase Form (USDC/USDT)
- Purchase History
- Vesting Schedule info
**Переводы:** ❌ Нет
**API/Web3:** `useWeb3()`, `useTokenSale()`

### `/staking` — Стейкинг
**Описание:** Стейкинг токенов UNITY
**Секции:**
- Staking form, Active stakes
**Переводы:** ❌ Нет
**API/Web3:** `useWeb3()`, `useStaking()`

---

## 2.14 Магазин и корзина (4 страницы)

| Маршрут | Страница | Описание |
|---|---|---|
| `/shop` | ProductsPage | Каталог продуктов |
| `/shop/:id` | ProductDetailPage | Детали продукта |
| `/cart` | CartPage | Корзина |
| `/checkout` | CheckoutPage | Оформление заказа |

---

## 2.15 Подписки (2 страницы)

| Маршрут | Страница | Описание |
|---|---|---|
| `/subscriptions/pricing` | Pricing | Сравнение планов |
| `/subscriptions/checkout` | Checkout | Оформление подписки |

---

## 2.16 Unified страницы (20 страниц)

Не подключены к роутингу. Дубликаты основных страниц в едином стиле:
- UnifiedHomePage, NutritionUnified, MovementUnified, SleepUnified
- PsychologyUnified, MedicineUnified, RelationshipsUnified, HabitsUnified
- SocialFeedUnified, ChallengesUnified, GroupsUnified, MessagesUnified
- SpecialistsUnified, CentersUnified, AnalyticsUnified
- GamificationUnified, ProfileUnified, SettingsUnified, WalletUnified
- DesignSystemDemo

---

## 2.17 Утилиты (3 страницы)

| Маршрут | Страница | Описание |
|---|---|---|
| `/v2` | InvestorDemo | Демо для инвесторов |
| `/design-system` | DesignSystemDemo | Дизайн-система |
| `/design` | DesignSystemDemo | Алиас |
| `*` | NotFound404 | 404 страница |

---

# ЧАСТЬ 3: КОМПОНЕНТЫ

## 3.1 ElCore (дизайн-система)
- **ElButton** — кнопка (gradient, elevated, flat)
- **ElCard** — карточка (elevated, glass)
- **ElInput** — инпут с иконками

## 3.2 ElLayout
- **ElLayout** — обёртка с сайдбаром
- **ElHeader** — хедер с burger-меню
- **ElLanguageSelector** — переключатель языков (25 языков)

## 3.3 Neumorphism
- NeuCard, NeuButton, NeuInput, NeuGauge, NeuOrb, NeuProgress, NeuSlider, NeuToggle

## 3.4 Widgets (14 шт.)
ActivityWidget, AIInsightsWidget, BodyMetricsWidget, DailyRingsWidget, GamificationWidget, HabitHeatmapWidget, HealthScoreWidget, MoodTrackerWidget, NutritionWidget, QuickActionsWidget, SleepPhasesWidget, SocialWidget, StepsCounterWidget, WaterTrackerWidget

## 3.5 WidgetSystem (4 шт.)
WidgetGrid, WidgetLibrary, WidgetSettingsPopup + 7 виджетов

## 3.6 Monetization
- **CashbackWidget** — кэшбек
- **ReferralWidget** — реферальная программа
- **SubscriptionStatus** — текущая подписка

## 3.7 Web3
- ActiveStakes, StakingCard, WalletConnectButton

## 3.8 Layout
- Layout, PageLayout, VersionToggle

## 3.9 Auth
- ProtectedRoute, GuestAccessRoute

## 3.10 Upsell
- SubscriptionUpsell

---

# ЧАСТЬ 4: STORES (Zustand)

| Store | Файл | Состояние | Сохранение | API |
|---|---|---|---|---|
| authStore | store/authStore.jsx | user, token, isAuthenticated | localStorage | /auth/login, /auth/register |
| widgetStore | store/widgetStore.ts | 24 типа виджетов | localStorage | Нет |
| healthStore | store/healthStore.ts | metrics, goals, profile | Частично | /health/metrics, /health/goals |
| cartStore | store/cartStore.ts | items, isOpen | localStorage | Нет |
| uiStore | store/uiStore.ts | sidebar, theme, notifications | Нет | Нет |
| productsStore | store/productsStore.ts | products, categories | Да | Нет |

---

# ЧАСТЬ 5: i18n — ПЕРЕВОДЫ

**25 языков:** en, es, zh, hi, ar, fr, de, ja, pt, ru, ko, it, tr, nl, pl, vi, th, id, uk, ro, cs, el, he, sv, hu

**Статус переводов:**
- ✅ Landing, Login, Register, Health V2 модули (UI элементы)
- ❌ Landing2, Landing3, Features, Pricing, Team, Roadmap, Blog, FAQ
- ❌ Dashboard2, Nutrition2, Movement2, Sleep2, Psychology2, Medicine2
- ❌ SocialFeed2, AIChatUnified, Analytics2, Gamification2, Specialists2, Centers2
- ❌ Profile2, Settings2, ALL Unified, ALL Web3, ALL Shop

---

# ЧАСТЬ 6: WEB3 / ТОКЕНОМИКА — ТЕКУЩЕЕ СОСТОЯНИЕ

## 6.1 UNITY Token

**Контракты:** Ethereum, Polygon, BSC, Sepolia, Mumbai, Hardhat
**Токен:** 1,000,000,000 UNITY (1 миллиард), 18 decimals

## 6.2 Текущие механики заработка (ТРЕБУЮТ ИЗМЕНЕНИЙ ⚠️)

| Механика | Текущее состояние | Проблема |
|---|---|---|
| **Move-to-Earn** | 10,000 шагов = 5 UNITY/день | ❌ УДАЛИТЬ — вознаграждение за шаги/спорт запрещено |
| **Learn-to-Earn** | Курс по питанию = 50 UNITY | ⚠️ Оставить только для курсов о платформе |
| **Social-to-Earn** | Реферал = 10% от покупок | ✅ Оставить |
| **Stake-to-Earn** | 10,000 UNITY = 12-25% APY | ✅ Оставить |

## 6.3 Staking

| Параметр | Значение |
|---|---|
| MIN_STAKE | 1,000 UNITY |
| APY 6 месяцев | 25% |
| APY 12 месяцев | 35% |
| MIN_STAKE | 1,000 UNITY |
| Вестинг | 6 месяцев cliff, линейный вестинг, полный доступ через 12 месяцев |

## 6.4 Token Sale

| Раунд | Цена | Аллокация |
|---|---|---|
| Seed/Private | $0.01-0.025 | Ранний доступ |
| Public | $0.05 | ICO/IDO |

## 6.5 Gamification2 — Token References

| Место | Описание |
|---|---|
| Token Wallet | unityTokens: 1250 (MOCK_USER) |
| Challenges | tokenReward: 8-200 за челлендж |
| Rewards Shop | prices: 300-5000 токенов |

---

# ЧАСТЬ 7: ТО, ЧТО НУЖНО ИЗМЕНИТЬ В ТОКЕНОМИКЕ

## 7.1 УДАЛИТЬ (вознаграждения за шаги/спорт/физическую активность)

| Файл | Строки | Что удалить/изменить |
|---|---|---|
| **Landing3.tsx** | 79-82 | Move-to-Earn блок: "Зарабатывайте токены за шаги и тренировки", "10,000 шагов = 5 $UNITY/день" |
| **Gamification2.tsx** | Все | Challenges с tokenReward за физическую активность |
| **web3/config.ts** | SALE_CONSTANTS | Убрать упоминания Move-to-Earn если есть |
| **Landing2.tsx** | Все | "Зарабатывайте токены за активность" |
| **FAQ.tsx** | — | Упоминания UNITY tokens в челленджах |
| **Features.tsx** | — | UNITY tokens в gamification feature |

## 7.2 ДОБАВИТЬ (новые источники токенов)

| Источник | Описание |
|---|---|
| **Продвижение платформы** | Токены за создание контента: посты, обзоры, рекомендации |
| **Приглашение друзей** | Реферальная система: 10% от покупок приглашённых |
| **Покупка токенов** | Прямая покупка через Token Sale (Seed, Private, Public раунды) |
| **Научные исследования** | Выплаты за создание и верификацию научных работ, программ, разработок |
| **Создание программ** | Токены за разработку wellness-программ, курсов, методик |
| **Верификация контента** | Эксперты получают токены за верификацию медицинского контента |
| **Стейкинг** | Пассивный доход: 25% APY (6 мес), 35% APY (12 мес) |

---

# ЧАСТЬ 8: API ENDPOINTS (Backend)

| Метод | Endpoint | Описание |
|---|---|---|
| POST | /auth/login | Вход |
| POST | /auth/register | Регистрация |
| POST | /auth/google | Вход через Google |
| POST | /auth/refresh | Обновление токена |
| GET/POST | /health/metrics | Метрики здоровья |
| GET/POST/PUT | /health/goals | Цели здоровья |
| GET/PUT | /health/profile | Профиль здоровья |
| GET | /health/score | Score здоровья |

---

# ЧАСТЬ 9: КОНТЕКСТЫ

### VersionContext
Управление переключением V1/V2. Сохранение в localStorage как `appVersion`. По умолчанию: `v2`.

### GuestDataContext
Гостевой доступ ко всем функциям без регистрации. Данные сохраняются в `tempStorage`. Upsell через 30 секунд активности.

---

# ЧАСТЬ 10: КЛЮЧЕВЫЕ ЗАМЕЧАНИЯ

## 10.1 Критичные проблемы
1. **Нет реального бэкенда** — все страницы используют моковые данные
2. **Большинство страниц без переводов** — хардкод на русском/английском
3. **Unified страницы не подключены** к роутингу (20 страниц)
4. **Нет маршрутов** для /whitepaper, /research, /b2b, /blog/:id, /forgot-password, /devices
5. **3 дизайн-системы** сосуществуют (Neumorphism, ElCore, Tailwind)

## 10.2 Статистика проекта
- **Файлов:** ~300+ в frontend/src
- **Компонентов:** ~60
- **Страниц:** ~80
- **Маршрутов:** 55
- **Языков:** 25
- **Строк кода:** ~50,000+

## 10.3 Хостинг
- **Frontend:** Vercel (auto-deploy из main)
- **API:** Render
- **Database:** PostgreSQL (Render)
