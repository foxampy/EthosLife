# 🔄 План восстановления функциональности EthosLife

**Дата:** 6 марта 2026  
**На основе:** MISSING_COMPONENTS_ANALYSIS.md  
**Цель:** Восстановить 52 страницы, 32 таблицы БД, 33 компонента

---

## 📊 СВОДКА

| Что упущено | Количество | Часов на восстановление |
|-------------|------------|------------------------|
| Страниц Frontend | 52 | ~350ч |
| Таблиц БД | 32 | ~80ч |
| API Endpoints | 12 | ~100ч |
| UI компонентов | 33 | ~150ч |
| Store модулей | 7 | ~50ч |
| Интеграций | 4 | ~40ч |
| **ИТОГО** | **140** | **~770ч** |

---

## 🎯 РЕКОМЕНДУЕМЫЙ ПЛАН (16 недель)

### ФАЗА 0: ВОССТАНОВЛЕНИЕ (4 недели)

#### Неделя 1: База Данных

**Цель:** Создать 32 отсутствующие таблицы

```sql
-- 1. Health Core (4 таблицы)
✅ daily_health_snapshots
✅ health_correlations  
✅ health_notifications
✅ health_profiles (обновить)

-- 2. Nutrition Module (4 таблицы)
✅ nutrition_meals
✅ nutrition_food_items
✅ nutrition_water
✅ nutrition_goals

-- 3. Movement Module (3 таблицы)
✅ movement_workouts
✅ movement_exercises
✅ movement_daily_activity

-- 4. Sleep Module (2 таблицы)
✅ sleep_sessions
✅ sleep_goals

-- 5. Psychology Module (4 таблицы)
✅ psychology_mood
✅ psychology_journal
✅ psychology_meditation
✅ psychology_assessments

-- 6. Medicine Module (3 таблицы)
✅ medicine_documents
✅ medicine_metrics
✅ medicine_medications

-- 7. Relationships Module (2 таблицы)
✅ relationships_connections
✅ relationships_activities

-- 8. Habits Module (2 таблицы)
✅ habits
✅ habit_completions

-- 9. Social Network (5 таблиц)
✅ posts
✅ post_likes
✅ post_comments
✅ follows
✅ stories

-- 10. Unity Tokenomics (7 таблиц)
✅ unity_exchange_rates
✅ token_transactions
✅ token_rewards
✅ payouts
✅ commission_settings
✅ subscription_plans
✅ payments
```

**Чеклист недели 1:**
- [ ] F0.1 Создать миграцию health_core.sql
- [ ] F0.2 Создать миграцию nutrition_module.sql
- [ ] F0.3 Создать миграцию movement_module.sql
- [ ] F0.4 Создать миграцию sleep_module.sql
- [ ] F0.5 Создать миграцию psychology_module.sql
- [ ] F0.6 Создать миграцию medicine_module.sql
- [ ] F0.7 Создать миграцию relationships_module.sql
- [ ] F0.8 Создать миграцию habits_module.sql
- [ ] F0.9 Создать миграцию social_network.sql
- [ ] F0.10 Создать миграцию unity_tokenomics.sql
- [ ] F0.11 Настроить foreign keys и индексы
- [ ] F0.12 Создать seed данные (тестовые)

**Результат:** 32 таблицы БД готовы

---

#### Неделя 2: Backend API

**Цель:** Восстановить 12 API endpoints

```typescript
// 1. Health Modules API
POST   /api/health/nutrition/meals
GET    /api/health/nutrition/daily
POST   /api/health/movement/workouts
GET    /api/health/sleep/sessions
POST   /api/health/psychology/mood
GET    /api/health/medicine/medications
POST   /api/health/habits/track

// 2. Social API
GET    /api/social/feed
POST   /api/social/posts
POST   /api/social/posts/:id/like
POST   /api/social/posts/:id/comment

// 3. Unity API
GET    /api/unity/rewards
POST   /api/unity/stake
GET    /api/unity/exchange-rate
```

**Чеклист недели 2:**
- [ ] F0.13 Nutrition API (CRUD)
- [ ] F0.14 Movement API (CRUD)
- [ ] F0.15 Sleep API (CRUD)
- [ ] F0.16 Psychology API (CRUD)
- [ ] F0.17 Medicine API (CRUD)
- [ ] F0.18 Relationships API (CRUD)
- [ ] F0.19 Habits API (CRUD)
- [ ] F0.20 Health Score алгоритм
- [ ] F0.21 Posts API (social feed)
- [ ] F0.22 Comments & Likes API
- [ ] F0.23 Unity rewards system
- [ ] F0.24 Unity staking API

**Результат:** 12 API endpoints работают

---

#### Неделя 3: Frontend — Health Modules

**Цель:** Восстановить 7 страниц модулей здоровья

```tsx
// Страницы для восстановления:
<HealthDashboard />      // Главный хаб
<NutritionModule />      // Питание
<MovementModule />       // Движение
<SleepModule />          // Сон
<PsychologyModule />     // Психология
<MedicineModule />       // Медицина
<HabitsModule />         // Привычки
<RelationshipsModule />  // Отношения
```

**Чеклист недели 3:**
- [ ] F0.25 HealthDashboard (hub)
- [ ] F0.26 NutritionModule page
- [ ] F0.27 MovementModule page
- [ ] F0.28 SleepModule page
- [ ] F0.29 PsychologyModule page
- [ ] F0.30 MedicineModule page
- [ ] F0.31 HabitsModule page
- [ ] F0.32 RelationshipsModule page
- [ ] F0.33 Создать healthStore (Zustand)
- [ ] F0.34 Создать 7 module stores

**Результат:** 7 модулей здоровья на frontend

---

#### Неделя 4: UI Компоненты и Store

**Цель:** Создать 33 компонента и 7 stores

**Health Components (11):**
- [ ] F0.35 ModuleCard
- [ ] F0.36 DailyScoreRing
- [ ] F0.37 AIInsightCard
- [ ] F0.38 MoodCheckIn
- [ ] F0.39 TechniquePlayer
- [ ] F0.40 SleepTimeline
- [ ] F0.41 WorkoutLogger
- [ ] F0.42 MedicationSchedule
- [ ] F0.43 ContactCard
- [ ] F0.44 InteractionLogger
- [ ] F0.45 HabitTracker

**Common Components (12):**
- [ ] F0.46 Button (атомарный)
- [ ] F0.47 Input
- [ ] F0.48 Modal
- [ ] F0.49 Card
- [ ] F0.50 Loading
- [ ] F0.51 Badge
- [ ] F0.52 Avatar
- [ ] F0.53 Dropdown
- [ ] F0.54 Tabs
- [ ] F0.55 Dialog
- [ ] F0.56 Skeleton
- [ ] F0.57 Toast

**Store Modules (7):**
- [ ] F0.58 healthStore (единый)
- [ ] F0.59 nutritionStore
- [ ] F0.60 movementStore
- [ ] F0.61 sleepStore
- [ ] F0.62 psychologyStore
- [ ] F0.63 medicineStore
- [ ] F0.64 relationshipsStore
- [ ] F0.65 socialStore

**Результат:** 33 компонента + 7 stores

---

### ФАЗА 1: ФУНДАМЕНТ (Недели 5-6)

#### Неделя 5: Интеграции

**PWA (Progressive Web App):**
- [ ] F1.1 Установить vite-plugin-pwa
- [ ] F1.2 Настроить vite.config.ts
- [ ] F1.3 Создать manifest.json
- [ ] F1.4 Service Worker с кэшированием
- [ ] F1.5 PWAInstallPrompt компонент
- [ ] F1.6 Offline mode

**Telegram Bot:**
- [ ] F1.7 Восстановить telegram-bot.ts
- [ ] F1.8 Команды /start, /menu
- [ ] F1.9 Интеграция с БД
- [ ] F1.10 Webhook для авторизации

**AI Мультипровайдеры:**
- [ ] F1.11 Groq API integration
- [ ] F1.12 Gemini API integration
- [ ] F1.13 Qwen API integration
- [ ] F1.14 Failover логика

**Результат:** PWA, Telegram, AI работают

---

#### Неделя 6: Токеномика и Payments

**Unity Tokenomics:**
- [ ] F1.15 Unity exchange rates
- [ ] F1.16 Rewards за активность
- [ ] F1.17 Staking (15-25% APY)
- [ ] F1.18 Token transactions
- [ ] F1.19 Burn механизмы
- [ ] F1.20 DAO governance (базово)

**Payments:**
- [ ] F1.21 NOWPayments integration
- [ ] F1.22 Crypto webhook обработка
- [ ] F1.23 Подписки (Free/Pro/Premium)
- [ ] F1.24 Checkout страница

**Результат:** Токеномика и платежи работают

---

### ФАЗА 2: SOCIAL & SPECIALISTS (Недели 7-8)

#### Неделя 7: Социальная сеть

**Frontend:**
- [ ] F2.1 SocialFeed страница
- [ ] F2.2 PostDetail страница
- [ ] F2.3 Groups страница
- [ ] F2.4 Challenges страница
- [ ] F2.5 Leaders страница
- [ ] F2.6 Messages (чат)

**Backend:**
- [ ] F2.7 Feed algorithm
- [ ] F2.8 Real-time WebSocket
- [ ] F2.9 Notifications service

**Результат:** Социальная сеть готова

---

#### Неделя 8: Специалисты и Центры

**Frontend:**
- [ ] F2.10 SpecialistOffer страница
- [ ] F2.11 CenterOffer страница
- [ ] F2.12 CenterCRM страница
- [ ] F2.13 SpecialistDirectory
- [ ] F2.14 SpecialistProfile
- [ ] F2.15 Booking страница

**Backend:**
- [ ] F2.16 Specialists API
- [ ] F2.17 Centers API
- [ ] F2.18 Commission система
- [ ] F2.19 Booking API

**Результат:** Специалисты и центры готовы

---

### ФАЗА 3: SMART FEATURES (Недели 9-10)

#### Неделя 9: AI Smart Trackers

**Food Recognition:**
- [ ] F3.1 SmartTracker компонент
- [ ] F3.2 Food Recognition AI
- [ ] F3.3 Photo → БЖУ конвертация
- [ ] F3.4 AI рекомендации по питанию

**Document OCR:**
- [ ] F3.5 Medical document scanning
- [ ] F3.6 Lab results extraction
- [ ] F3.7 AI расшифровка анализов

**Результат:** Smart Trackers работают

---

#### Неделя 10: RAG Knowledge Base

**База знаний:**
- [ ] F3.8 42 документа (Приоритет 1)
- [ ] F3.9 Чанкование контента
- [ ] F3.10 Генерация embedding (1536 dim)
- [ ] F3.11 Векторный поиск (pgvector)
- [ ] F3.12 RAG для AI-коуча

**Результат:** RAG поиск готов

---

### ФАЗА 4: MOBILE & DEPLOY (Недели 11-16)

#### Недели 11-14: Mobile App (React Native)

**Неделя 11:**
- [ ] M1 React Native setup
- [ ] M2 Auth screens
- [ ] M3 Navigation

**Неделя 12:**
- [ ] M4 Dashboard
- [ ] M5 Health tracking
- [ ] M6 Native modules

**Неделя 13:**
- [ ] M7 Push notifications
- [ ] M8 Offline mode
- [ ] M9 HealthKit integration

**Неделя 14:**
- [ ] M10 Google Fit integration
- [ ] M11 App Store deploy
- [ ] M12 Google Play deploy

**Результат:** iOS и Android приложения

---

#### Недели 15-16: Testing & Production

**Тестирование:**
- [ ] F5.1 Unit Tests (Backend)
- [ ] F5.2 Integration Tests
- [ ] F5.3 E2E Tests (Playwright)
- [ ] F5.4 Load Testing (k6)
- [ ] F5.5 Security Audit

**Deploy:**
- [ ] F5.6 CI/CD Pipeline
- [ ] F5.7 Production deployment
- [ ] F5.8 Monitoring (Sentry)

**Результат:** Production готов

---

## 📊 ОБНОВЛЁННАЯ ДОРОЖНАЯ КАРТА

```
2026
├── Март
│   ├── Недели 1-4:  ФАЗА 0 — Восстановление 🔴
│   │   ├── 32 таблицы БД
│   │   ├── 12 API endpoints
│   │   ├── 7 Health страниц
│   │   └── 33 компонента + 7 stores
│   │
│   └── Недели 5-6:  ФАЗА 1 — Интеграции 🟠
│       ├── PWA + Telegram
│       ├── AI мультипровайдеры
│       └── Unity токеномика
│
├── Апрель
│   ├── Недели 7-8:  ФАЗА 2 — Social 🟢
│   │   ├── Социальная сеть
│   │   └── Специалисты и центры
│   │
│   └── Недели 9-10: ФАЗА 3 — Smart 🔵
│       ├── AI Smart Trackers
│       └── RAG Knowledge Base
│
└── Май
    ├── Недели 11-14: ФАЗА 4 — Mobile 📱
    │   ├── iOS приложение
    │   └── Android приложение
    │
    └── Недели 15-16: ФАЗА 5 — Deploy 🚀
        ├── Тестирование
        └── Production
```

---

## 💰 ОБНОВЛЁННАЯ ОЦЕНКА

### Время

| Фаза | Недель | Часов | Итого |
|------|--------|-------|-------|
| Фаза 0: Восстановление | 4 | ~350ч | 350ч |
| Фаза 1: Интеграции | 2 | ~120ч | 470ч |
| Фаза 2: Social | 2 | ~150ч | 620ч |
| Фаза 3: Smart | 2 | ~100ч | 720ч |
| Фаза 4: Mobile | 4 | ~200ч | 920ч |
| Фаза 5: Deploy | 2 | ~76ч | **996ч** |

**Итого:** ~1000 часов (vs 608ч в оригинальном плане)

### Стоимость

| Роль | Часов | Ставка | Стоимость |
|------|-------|--------|-----------|
| Backend | 400ч | $50/ч | $20,000 |
| Frontend | 400ч | $50/ч | $20,000 |
| Mobile | 200ч | $50/ч | $10,000 |
| **ИТОГО** | **1000ч** | | **~$50,000** |

---

## 🎯 КРИТЕРИИ ГОТОВНОСТИ

### MVP (после Фазы 2, неделя 8)

- ✅ 7 модулей здоровья работают
- ✅ AI-коуч с контекстом
- ✅ Социальная сеть (базово)
- ✅ Unity токеномика (базово)
- ✅ PWA работает
- ✅ Telegram бот

**Готово для:** Seed раунда, beta тестирования

### Production (после Фазы 5, неделя 16)

- ✅ Все 59 страниц
- ✅ Все 47 таблиц БД
- ✅ Mobile приложения
- ✅ Smart Trackers
- ✅ RAG Knowledge Base
- ✅ Полная токеномика

**Готово для:** Публичного запуска, Series A

---

## 📋 ЕЖЕНЕДЕЛЬНЫЕ ЧЕКЛИСТЫ

### Неделя 1 (БД)

```
Понедельник:
☐ F0.1 health_core migration
☐ F0.2 nutrition migration
☐ F0.3 movement migration

Вторник:
☐ F0.4 sleep migration
☐ F0.5 psychology migration
☐ F0.6 medicine migration

Среда:
☐ F0.7 relationships migration
☐ F0.8 habits migration
☐ F0.9 social migration

Четверг:
☐ F0.10 unity migration
☐ F0.11 foreign keys
☐ F0.12 indexes

Пятница:
☐ F0.13 seed data
☐ F0.14 тестирование БД
☐ F0.15 документация
```

### Неделя 2 (Backend API)

```
Понедельник:
☐ F0.16 Nutrition API
☐ F0.17 Movement API

Вторник:
☐ F0.18 Sleep API
☐ F0.19 Psychology API

Среда:
☐ F0.20 Medicine API
☐ F0.21 Habits API

Четверг:
☐ F0.22 Health Score
☐ F0.23 Social API

Пятница:
☐ F0.24 Unity API
☐ F0.25 тестирование API
☐ F0.26 документация
```

---

## 🔗 СВЯЗАННЫЕ ДОКУМЕНТЫ

1. [MISSING_COMPONENTS_ANALYSIS.md](./MISSING_COMPONENTS_ANALYSIS.md) — Полный анализ упущенного
2. [FULL_DEVELOPMENT_PLAN.md](./FULL_DEVELOPMENT_PLAN.md) — Оригинальный план (12 недель)
3. [TODO.md](./TODO.md) — Интерактивный список задач
4. [KNOWLEDGE_BASE_SPEC.md](./KNOWLEDGE_BASE_SPEC.md) — Спецификация БД знаний

---

**© 2026 EthosLife Inc.**  
*Восстановление и развитие функциональности*
