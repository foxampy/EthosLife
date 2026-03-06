# 🚀 EthoLife — План доработки до релиза v1.0

**Дата создания:** 25 февраля 2026  
**Текущий статус:** Backend готов на 70%, Frontend готов на 60%, Интеграции — требуют настройки

---

## 📊 АУДИТ ТЕКУЩЕГО СОСТОЯНИЯ

### ✅ РЕАЛЬНО ГОТОВО (Работает сейчас)

#### 1. Инфраструктура и База Данных
| Компонент | Статус | Примечание |
|-----------|--------|------------|
| PostgreSQL | ✅ Готово | Прямое подключение через pg |
| Таблицы users | ✅ Готово | Регистрация, авторизация |
| Таблицы user_profiles | ✅ Готово | Профили с расширенными полями |
| Таблицы health_metrics | ✅ Готово | Метрики здоровья |
| Таблицы goals | ✅ Готово | Цели пользователей |
| Таблицы daily_plans | ✅ Готово | Ежедневные планы |
| Таблицы documents | ✅ Готово | Медицинские документы |
| Таблицы user_tokens | ✅ Готово | Unity токен (офчейн) |
| Таблицы telegram_settings | ✅ Готово | Настройки бота |
| Health directions | ✅ Готово | 5 направлений здоровья |
| Dashboard settings | ✅ Готово | Настройки дашборда |

#### 2. Backend API (Vercel Serverless)
| API | Статус | Путь |
|-----|--------|------|
| Auth API | ✅ Готово | `/api/auth/*` — JWT + Telegram |
| Users API | ✅ Готово | `/api/users/:id/*` — профили, метрики |
| Telegram Bot | ✅ Готово | Вебхуки, команды, напоминания |
| Database | ✅ Готово | Полный CRUD через pg |

#### 3. Frontend (Клиент)
| Страница | Статус | Примечание |
|----------|--------|------------|
| LandingV2 | ✅ Готово | Новый лендинг |
| Login/Register | ✅ Готово | Работает с реальным API |
| DashboardV2 | ✅ Готово | Подключен к API |
| User Profile | ✅ Готово | Просмотр/редактирование |
| Onboarding | ✅ Готово | Пошаговая настройка |
| Health Modules | ✅ Готово | 5 модулей с вводом данных |
| Documents | ✅ Готово | Загрузка и просмотр |
| Telegram Auth | ✅ Готово | Подключение бота |

#### 4. Telegram Бот
| Функция | Статус |
|---------|--------|
| Авторизация | ✅ Готово |
| Напоминания | ✅ Готово |
| Ввод метрик | ✅ Готово |
| Просмотр планов | ✅ Готово |

---

### 🟡 ЧАСТИЧНО ГОТОВО (Требует доработки)

#### 1. AI Чат
| Компонент | Статус | Что нужно |
|-----------|--------|-----------|
| UI интерфейс | ✅ Готово | Компоненты есть |
| Qwen API | 🟡 Частично | Интеграция есть, нужен API key |
| История чатов | 🟡 Частично | Таблица есть, не везде используется |
| Rate limiting | 🟡 Частично | Работает через middleware |
| Fallback | ✅ Готово | Работает без API key |

#### 2. Платежная система
| Компонент | Статус | Что нужно |
|-----------|--------|-----------|
| Unity токен | ✅ Готово | Офчейн работает |
| Крипто-платежи | 🟡 Код готов | Нужен NOWPayments API key |
| Подписки | 🟡 Код готов | Таблицы есть, не протестировано |
| Webhooks | 🟡 Код готов | Нужна настройка |

#### 3. Социальная сеть
| Компонент | Статус | Что нужно |
|-----------|--------|-----------|
| UI компоненты | ✅ Готово | Есть страницы |
| API routes | 🟡 Частично | Код есть, но использует Supabase вместо pg |
| Таблицы БД | ❌ Нет | Нужны posts, follows, likes, comments |
| Загрузка медиа | ❌ Нет | Нужен S3/Supabase Storage |

---

### ❌ НЕ ГОТОВО (Требует разработки)

#### 1. Таблицы БД (Нужно создать)
```sql
-- Социальная сеть
posts, post_likes, post_comments, follows, post_saves

-- Специалисты
specialists, specialist_reviews, specialist_connections

-- Центры и бронирование  
centers, center_employees, bookings, services

-- Платежи и подписки
subscription_plans, user_subscriptions, payments

-- AI
ai_chat_history, ai_usage

-- Полные модули здоровья
sleep_sessions, movement_daily_activity, nutrition_meals
psychology_mood, medicine_analyses
```

#### 2. API Routes (Нужно переписать под pg)
- `/api/social/*` — использует Supabase, нужно под pg
- `/api/specialists/*` — использует Supabase
- `/api/bookings/*` — использует Supabase
- `/api/center/*` — использует Supabase
- `/api/payments/*` — использует Supabase

#### 3. Интеграции (Нужны API ключи)
- Qwen AI API (Hugging Face/DashScope)
- NOWPayments (криптоплатежи)
- Google OAuth
- Apple HealthKit/Google Fit

#### 4. Функции
- Видео/аудио звонки
- Push-уведомления (кроме Telegram)
- PWA (service worker не настроен)
- Экспорт данных (PDF, CSV)

---

## 🎯 ПЛАН ДОРАБОТКИ ДО MVP РЕЛИЗА

### ЭТАП 1: База Данных — Дополнительные таблицы (Неделя 1)

**Приоритет: Критический**

```sql
-- Социальная сеть
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[], -- массив URL
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);

-- Специалисты
CREATE TABLE specialists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  specializations TEXT[], -- ['nutrition', 'fitness']
  hourly_rate INTEGER, -- в центах
  rating REAL DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  experience_years INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Платежи
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- 'basic', 'premium'
  description TEXT,
  price_monthly INTEGER, -- в центах
  price_yearly INTEGER,
  unity_price_monthly INTEGER,
  unity_price_yearly INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  billing_interval TEXT, -- 'monthly', 'yearly'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Файлы для изменения:**
- `api/lib/database.ts` — добавить таблицы в initDatabase()

---

### ЭТАП 2: Унификация API (Неделя 1-2)

**Проблема:** API routes используют Supabase client, но основная БД перешла на pg

**Решение:** Переписать все API на использование pg

| API | Статус | Действие |
|-----|--------|----------|
| `/api/social/*` | ❌ Переписать | Использовать database.ts |
| `/api/specialists/*` | ❌ Переписать | Использовать database.ts |
| `/api/bookings/*` | ❌ Переписать | Использовать database.ts |
| `/api/center/*` | ❌ Переписать | Использовать database.ts |
| `/api/dashboard/*` | 🟡 Проверить | Убедиться что работает с pg |
| `/api/payments/*` | 🟡 Проверить | Убедиться что работает с pg |
| `/api/ai/*` | 🟡 Проверить | Убедиться что работает с pg |

**Файлы для изменения:**
- `server/api/social.ts`
- `server/api/specialists.ts`
- `server/api/bookings.ts`
- `server/api/center.ts`
- `server/routes/*.ts` (проверить)

---

### ЭТАП 3: Интеграции и API Keys (Неделя 2)

#### 3.1 AI — Qwen API
```bash
# Нужно получить:
QWEN_API_KEY=sk-...

# Опции бесплатного хостинга:
1. Hugging Face Inference API (бесплатный тир)
2. Hetzner CX11 (€3.79/мес) + vLLM
3. Использовать fallback для MVP
```

#### 3.2 Криптоплатежи — NOWPayments
```bash
# Нужно получить:
NOWPAYMENTS_API_KEY=

# Для тестирования:
1. Регистрация на nowpayments.io
2. Создать API key (sandbox для тестов)
3. Настроить webhooks
```

#### 3.3 OAuth — Google
```bash
# Нужно получить:
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Настройка:
1. Google Cloud Console
2. OAuth 2.0 credentials
3. Добавить redirect URLs
```

**Файлы:**
- `.env` — добавить переменные
- `server/routes/auth.ts` — добавить Google OAuth
- `server/services/qwenService.ts` — настроить Qwen

---

### ЭТАП 4: Социальная сеть — Полная реализация (Неделя 3)

**Компоненты:**

1. **Бэкенд**
   - [ ] CRUD для posts
   - [ ] Система лайков
   - [ ] Система комментариев
   - [ ] Подписки/отписки
   - [ ] Лента (feed) — алгоритм

2. **Фронтенд**
   - [ ] UserProfile.tsx — доделать загрузку данных
   - [ ] CreatePost.tsx — создание постов
   - [ ] SocialFeed.tsx — лента
   - [ ] Комментарии (модальное окно)

**Файлы:**
- `client/src/pages/UserProfile.tsx`
- `client/src/pages/CreatePost.tsx`
- `client/src/pages/social/*`

---

### ЭТАП 5: Специалисты и бронирование (Неделя 3-4)

**Компоненты:**

1. **Бэкенд**
   - [ ] API каталога специалистов
   - [ ] API профиля специалиста
   - [ ] Система бронирования
   - [ ] Уведомления (email/Telegram)

2. **Фронтенд**
   - [ ] SpecialistsCatalog.tsx
   - [ ] SpecialistProfile.tsx
   - [ ] Booking.tsx — календарь, выбор времени
   - [ ] Чат с специалистом

**Файлы:**
- `client/src/pages/SpecialistsCatalog.tsx`
- `client/src/pages/SpecialistProfile.tsx`
- `client/src/pages/Booking.tsx`

---

### ЭТАП 6: Тарифы и платежи (Неделя 4)

**Компоненты:**

1. **Бэкенд**
   - [ ] Seed данные для subscription_plans
   - [ ] Интеграция NOWPayments
   - [ ] Webhook обработчики
   - [ ] Unity токен — начисление/списание

2. **Фронтенд**
   - [ ] Pricing.tsx — обновить с реальными данными
   - [ ] Checkout.tsx — процесс оплаты
   - [ ] Wallet.tsx — управление токенами

**Файлы:**
- `client/src/pages/Pricing.tsx`
- `client/src/pages/Checkout.tsx`
- `client/src/pages/Wallet.tsx`
- `client/src/pages/CryptoPayment.tsx`

---

### ЭТАП 7: Профиль специалиста и центра (Неделя 4-5)

**Страницы для реализации:**
- `/specialist-offer` — лендинг для специалистов
- `/center-offer` — лендинг для центров
- `/specialist-profile/:id` — профиль специалиста
- `/center-crm` — CRM для центров

**Файлы:**
- `client/src/pages/SpecialistOffer.tsx`
- `client/src/pages/CenterOffer.tsx`
- `client/src/pages/CenterCRM.tsx`

---

### ЭТАП 8: Полировка и тестирование (Неделя 5-6)

**Задачи:**
- [ ] Убрать ВСЕ demo-данные
- [ ] Убрать console.log
- [ ] Обработка ошибок во всех API
- [ ] Loading states на всех страницах
- [ ] SEO мета-теги
- [ ] PWA manifest
- [ ] Service worker для офлайн
- [ ] Тестирование на мобильных
- [ ] Тестирование всех user flows
- [ ] Написание help/docs

**Баги которые нужно исправить:**
- [ ] iframe embedding (в процессе)
- [ ] Auth redirect после входа
- [ ] Mobile navigation
- [ ] Image upload (сейчас не работает)

---

## 📋 ЧЕКЛИСТ ПЕРЕД РЕЛИЗОМ

### Функциональность
- [ ] Регистрация/вход работает
- [ ] Профиль создается и редактируется
- [ ] Telegram бот подключается
- [ ] Health metrics сохраняются
- [ ] Goals работают
- [ ] Daily plans работают
- [ ] Documents загружаются
- [ ] AI чат отвечает (даже fallback)
- [ ] Социальная сеть — посты, лайки, комментарии
- [ ] Специалисты отображаются
- [ ] Бронирование работает
- [ ] Тарифы отображаются
- [ ] Оплата криптой работает
- [ ] Unity токен работает

### Безопасность
- [ ] JWT токены проверяются
- [ ] API защищены auth middleware
- [ ] SQL injection защита (pg parameterized queries)
- [ ] CORS настроен правильно
- [ ] Rate limiting на API

### Деплой
- [ ] Vercel production URL работает
- [ ] Render API работает (или unified server)
- [ ] PostgreSQL подключена
- [ ] Telegram webhook настроен
- [ ] Environment variables установлены
- [ ] iframe embedding работает (foxampy.vercel.app)

---

## 🎯 ИТОГОВАЯ ОЦЕНКА

| Компонент | Готово | Осталось | Срок |
|-----------|--------|----------|------|
| База данных | 60% | 40% | 1 неделя |
| Backend API | 70% | 30% | 1-2 недели |
| Frontend | 60% | 40% | 2-3 недели |
| Интеграции | 30% | 70% | 1-2 недели |
| **ИТОГО** | **55%** | **45%** | **6 недель** |

**Рекомендуемый срок до MVP:** 4-6 недель при работе full-time

**Минимальный MVP (без соцсети и специалистов):** 2-3 недели
