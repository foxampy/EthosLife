# EthosLife - Детальный план разработки MVP

## 📋 Общая информация

**Платформа:** EthosLife - Human Operating System (H.O.S.)  
**Цель:** Полноценный MVP с 3 модулями для презентации инвесторам  
**Сроки:** 12-14 недель (3-3.5 месяца)  
**Технологии:** Node.js, React/Vue, PostgreSQL, Qwen AI API, WebSockets  
**Auth:** Google OAuth, Telegram Auth, JWT

---

## 🗓️ Этапы разработки

### ЭТАП 1: Инфраструктура + Auth (Неделя 1-2)
**Ответственные:** Backend + Frontend

#### 1.1 Аутентификация и авторизация
- [ ] **Google OAuth 2.0**
  - Настройка Google Cloud Console
  - Endpoint `/auth/google`
  - Обработка callback
  - Создание/обновление пользователя в БД
  
- [ ] **Telegram Auth**
  - Bot command `/login`
  - Widget авторизации
  - Проверка hash signature
  - Связка Telegram ID с аккаунтом
  
- [ ] **JWT система**
  - Access token (15 мин)
  - Refresh token (7 дней)
  - Middleware проверки
  - Logout/refresh endpoints

- [ ] **Модель пользователя**
  ```sql
  users:
    - id (UUID)
    - email (unique)
    - google_id
    - telegram_id
    - full_name
    - avatar_url
    - created_at
    - updated_at
    - last_login
    - is_active
    - role (user, specialist, admin)
  ```

#### 1.2 Базовая инфраструктура
- [ ] Настройка Docker Compose (dev)
- [ ] Структура папок frontend
- [ ] API client с interceptors
- [ ] Error handling middleware
- [ ] Logging (Winston/Pino)
- [ ] Rate limiting

---

### ЭТАП 2: Health Module - Центр здоровья (Неделя 3-6)

#### 2.1 Архитектура данных

**Таблица health_profiles:**
```sql
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Базовые метрики
  birth_date DATE,
  gender VARCHAR(10),
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  blood_type VARCHAR(5),
  
  -- Lifestyle
  activity_level VARCHAR(20), -- sedentary, light, moderate, active
  sleep_hours_avg DECIMAL(3,1),
  smoking_status VARCHAR(20),
  alcohol_frequency VARCHAR(20),
  
  -- Медицинская история (JSONB)
  conditions JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  medications JSONB DEFAULT '[]',
  surgeries JSONB DEFAULT '[]',
  family_history JSONB DEFAULT '[]',
  
  -- Цели
  goals JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица health_metrics (временные ряды):**
```sql
CREATE TABLE health_metrics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50), -- weight, sleep, bp, hr, etc.
  metric_type VARCHAR(50), -- systolic, diastolic, weight, etc.
  value DECIMAL(10,3),
  unit VARCHAR(20),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(20), -- manual, device, import
  notes TEXT,
  
  -- Индексы для быстрой выборки
  CONSTRAINT idx_metrics_user_time UNIQUE (user_id, category, metric_type, recorded_at)
);

-- Гипертаблица TimescaleDB (если используем)
-- SELECT create_hypertable('health_metrics', 'recorded_at');
```

#### 2.2 Dashboard виджеты

**Виджет 1: Общее состояние здоровья (Health Score)**
```javascript
// Алгоритм расчета
// - Вес: BMI (0-25)
// - Сон: 7-9 часов (0-25)
// - Активность: шаги/упражнения (0-25)
// - Другие метрики (0-25)
// Итого: 0-100 баллов
```
- [ ] Визуализация круговым прогресс-баром
- [ ] История изменений (график)
- [ ] Рекомендации на основе score

**Виджет 2: Вес и композиция тела**
- [ ] График веса (линейный)
- [ ] BMI калькулятор
- [ ] Целевой вес с прогрессом
- [ ] Процент жира/мышц (ручной ввод)

**Виджет 3: Сон**
- [ ] График часов сна
- [ ] Качество сна (оценка 1-10)
- [ ] Sleep debt калькулятор
- [ ] Рекомендации по гигиене сна

**Виджет 4: Активность**
- [ ] Шаги (вручную или интеграция)
- [ ] Тренировки (длительность, тип)
- [ ] Калории
- [ ] Heart rate (если есть данные)

**Виджет 5: Питание (базовый)**
- [ ] Приёмы пищи (завтрак, обед, ужин, перекусы)
- [ ] Калории примерно
- [ ] Вода (стаканы/мл)

**Виджет 6: Медицинские данные**
- [ ] Давление (систолическое/диастолическое)
- [ ] Пульс
- [ ] Уровень сахара
- [ ] Температура тела

#### 2.3 Страницы направлений здоровья

**2.3.1 Nutrition (Питание)**
- [ ] Дневник питания (календарь)
- [ ] Добавление приёма пищи:
  - Время
  - Тип (завтрак/обед/ужин/перекус)
  - Описание/фото
  - Калории (оценка)
  - Макросы (Б/Ж/У)
- [ ] Шаблоны блюд
- [ ] Цели по питанию
- [ ] Рекомендации AI

**2.3.2 Fitness (Фитнес/Движение)**
- [ ] Трекер тренировок
  - Тип (кардио, силовая, йога, и т.д.)
  - Длительность
  - Интенсивность
  - Калории
  - Заметки
- [ ] План тренировок
- [ ] Цели (шаги, тренировки/неделю)
- [ ] Интеграция (Apple Health, Google Fit) - позже

**2.3.3 Sleep (Сон)**
- [ ] Трекер сна
  - Время отхода ко сну
  - Время пробуждения
  - Качество (1-10)
  - Проблемы (бессонница, пробуждения)
- [ ] Sleep hygiene чеклист
- [ ] Рекомендации по распорядку

**2.3.4 Mental Health (Ментальное здоровье)**
- [ ] Mood tracker (ежедневная оценка настроения 1-10)
- [ ] Stress level (1-10)
- [ ] Energy level (1-10)
- [ ] Journal (ежедневные записи)
- [ ] Meditation tracker
- [ ] Тесты (PHQ-9, GAD-7) - упрощённые

**2.3.5 Medical (Медицина)**
- [ ] История болезней
- [ ] Аллергии
- [ ] Принимаемые препараты
- [ ] Визиты к врачам (календарь)
- [ ] Анализы и результаты (загрузка файлов)
- [ ] Иммунизация

**2.3.6 Body Composition (Телосложение)**
- [ ] Измерения (талия, бёдра, грудь, и т.д.)
- [ ] Фото прогресс (сравнение)
- [ ] BMI, BMR расчёт

**2.3.7 Environment (Среда)**
- [ ] Качество воздуха (ручной ввод локации)
- [ ] Экспозиция солнцу
- [ ] Рабочая среда (сидячая/активная)

#### 2.4 Система целей и планов

**Таблица goals:**
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50), -- weight, sleep, fitness, nutrition
  title VARCHAR(255),
  description TEXT,
  target_type VARCHAR(20), -- numeric, boolean, habit
  target_value DECIMAL(10,3),
  current_value DECIMAL(10,3),
  unit VARCHAR(20),
  start_date DATE,
  deadline DATE,
  status VARCHAR(20), -- active, completed, cancelled
  reminder_frequency VARCHAR(20), -- daily, weekly
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица plans (персональные планы):**
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  category VARCHAR(50),
  description TEXT,
  schedule JSONB, -- {monday: [...], tuesday: [...]}
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR(20), -- user, ai, specialist
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.5 Жалобы и симптомы

**Таблица symptoms:**
```sql
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symptom VARCHAR(100),
  severity INTEGER, -- 1-10
  body_part VARCHAR(50),
  description TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  related_factors JSONB, -- food, activity, stress, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### ЭТАП 3: Social Module (Неделя 7-9)

#### 3.1 Профили пользователей

**Таблица user_profiles (расширение):**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Публичная информация
  bio TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  
  -- Privacy settings
  is_profile_public BOOLEAN DEFAULT true,
  show_health_data BOOLEAN DEFAULT false,
  allow_messages_from VARCHAR(20), -- everyone, friends, nobody
  
  -- Интересы/теги
  interests JSONB DEFAULT '[]',
  
  -- Stats
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2 Система подписок

**Таблица follows:**
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(follower_id, following_id)
);

-- Индексы
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

#### 3.3 Лента активности

**Таблица posts:**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  media_urls JSONB DEFAULT '[]',
  post_type VARCHAR(20), -- text, achievement, progress, question
  related_goal_id UUID REFERENCES goals(id),
  
  -- Stats
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  privacy VARCHAR(20) DEFAULT 'public', -- public, friends, private
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица post_likes:**
```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(post_id, user_id)
);
```

**Таблица comments:**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id), -- для replies
  content TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.4 Чат real-time

**WebSockets архитектура:**
```javascript
// Socket events
- connection
- join_room (chat_id)
- leave_room
- send_message
- typing
- mark_read
- disconnect
```

**Таблица conversations:**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20), -- direct, group
  title VARCHAR(255), -- для групп
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица conversation_participants:**
```sql
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP,
  is_admin BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(conversation_id, user_id)
);
```

**Таблица messages:**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, file
  media_url VARCHAR(500),
  reply_to_id UUID REFERENCES messages(id),
  
  -- Status
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрой пагинации
CREATE INDEX idx_messages_conversation_created 
  ON messages(conversation_id, created_at DESC);
```

#### 3.5 Группы/Сообщества

**Таблица groups:**
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  description TEXT,
  avatar_url VARCHAR(500),
  cover_url VARCHAR(500),
  category VARCHAR(50), -- weight_loss, fitness, diabetes, etc.
  
  -- Settings
  is_public BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  
  -- Stats
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица group_members:**
```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- member, moderator, admin
  status VARCHAR(20) DEFAULT 'active', -- pending, active, banned
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(group_id, user_id)
);
```

---

### ЭТАП 4: AI Module с Qwen (Неделя 10-12)

#### 4.1 Интеграция Qwen API

**Конфигурация:**
```javascript
// Qwen API (Alibaba Cloud)
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_API_KEY = process.env.QWEN_API_KEY;

// Models
- qwen-turbo (быстрый, дешёвый)
- qwen-plus (баланс)
- qwen-max (максимальное качество)
```

**Таблица ai_conversations:**
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  context_summary TEXT, -- для долгой памяти
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица ai_messages:**
```sql
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20), -- user, assistant, system
  content TEXT,
  model VARCHAR(50),
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2 RAG система (Retrieval Augmented Generation)

**База знаний:**

**Таблица knowledge_chunks:**
```sql
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50), -- nutrition, fitness, sleep, mental, medical
  title VARCHAR(255),
  content TEXT,
  source VARCHAR(255),
  embedding VECTOR(1536), -- pgvector для поиска
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для similarity search
CREATE INDEX idx_knowledge_embedding ON knowledge_chunks 
  USING ivfflat (embedding vector_cosine_ops);
```

**Персональный контекст пользователя:**
```javascript
// Формирование контекста для AI
async function buildUserContext(userId) {
  const user = await getUserWithProfile(userId);
  const recentMetrics = await getRecentMetrics(userId, days = 7);
  const activeGoals = await getActiveGoals(userId);
  const recentSymptoms = await getRecentSymptoms(userId);
  
  return {
    demographics: {
      age: calculateAge(user.birth_date),
      gender: user.gender,
      bmi: calculateBMI(user.weight, user.height)
    },
    recent_metrics: recentMetrics,
    goals: activeGoals,
    symptoms: recentSymptoms,
    preferences: user.preferences
  };
}
```

#### 4.3 Функции AI

**Функция 1: Health Coach**
- [ ] Анализ текущих метрик
- [ ] Рекомендации по питанию
- [ ] Рекомендации по тренировкам
- [ ] Sleep hygiene советы
- [ ] Стресс-менеджмент

**Функция 2: Составление планов**
- [ ] Персонализированные планы питания
- [ ] Планы тренировок
- [ ] Sleep schedule
- [ ] Meal prep идеи

**Функция 3: Анализ симптомов**
- [ ] Первичная оценка симптомов
- [ ] Рекомендации когда обратиться к врачу
- [ ] Отслеживание паттернов

**Функция 4: Мотивация и поддержка**
- [ ] Ежедневная мотивация
- [ ] Празднование достижений
- [ ] Работа с неудачами
- [ ] Accountability partner

**Функция 5: Образовательный контент**
- [ ] Объяснение медицинских терминов
- [ ] Научные исследования (упрощённые)
- [ ] Советы по здоровью

#### 4.4 Интерфейс чата

**Функционал:**
- [ ] История диалогов (список слева)
- [ ] Новый чат
- [ ] Markdown поддержка
- [ ] Код блоки
- [ ] Таблицы
- [ ] Quick replies (предложенные ответы)
- [ ] Голосовой ввод (Web Speech API)
- [ ] Экспорт диалога

---

### ЭТАП 5: Интеграция и полировка (Неделя 13-14)

#### 5.1 Интеграция модулей
- [ ] Связь Health data с AI контекстом
- [ ] Share achievements в Social
- [ ] AI Coach в Social groups
- [ ] Notifications система

#### 5.2 Notifications
**Таблица notifications:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50), -- like, comment, follow, reminder, achievement
  title VARCHAR(255),
  content TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] Push notifications (OneSignal/Firebase)
- [ ] Email notifications (SendGrid)
- [ ] Telegram notifications
- [ ] In-app notification center

#### 5.3 Тестирование
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Performance testing
- [ ] Security audit

#### 5.4 Деплой и DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Production deployment
- [ ] Monitoring (Sentry)
- [ ] Analytics (Mixpanel/Amplitude)

---

## 📊 API Endpoints Overview

### Auth
```
POST /api/auth/google
POST /api/auth/telegram
POST /api/auth/refresh
POST /api/auth/logout
```

### User
```
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/settings
PUT    /api/user/settings
```

### Health
```
GET    /api/health/dashboard
GET    /api/health/metrics
POST   /api/health/metrics
GET    /api/health/metrics/:category/history
GET    /api/health/goals
POST   /api/health/goals
PUT    /api/health/goals/:id
GET    /api/health/symptoms
POST   /api/health/symptoms
```

### Social
```
GET    /api/social/feed
POST   /api/social/posts
GET    /api/social/posts/:id
POST   /api/social/posts/:id/like
POST   /api/social/posts/:id/comments
GET    /api/social/users/:id/profile
POST   /api/social/users/:id/follow
GET    /api/social/conversations
POST   /api/social/conversations
GET    /api/social/conversations/:id/messages
POST   /api/social/conversations/:id/messages
GET    /api/social/groups
POST   /api/social/groups/:id/join
```

### AI
```
GET    /api/ai/conversations
POST   /api/ai/conversations
GET    /api/ai/conversations/:id/messages
POST   /api/ai/conversations/:id/messages
POST   /api/ai/ask (one-off question)
```

---

## 🎨 UI/UX Дизайн система

### Цвета (Neumorphism)
```css
--bone: #e4dfd5;
--bone-dark: #c2b8a9;
--ink: #2d2418;
--ink-light: #4a3e32;
--sand: #dcd3c6;
--clay: #8c7a6b;
--stone: #5c5243;

--success: #27ae60;
--warning: #f39c12;
--error: #c0392b;
--info: #3498db;
```

### Компоненты
- [ ] Neumorphic cards
- [ ] Custom inputs
- [ ] Charts (Recharts/D3)
- [ ] Calendar (react-big-calendar)
- [ ] Modals
- [ ] Toast notifications
- [ ] Loading states

---

## 📝 Чеклист перед релизом

### Функциональность
- [ ] Регистрация/вход работает
- [ ] Health данные сохраняются
- [ ] Графики отображаются
- [ ] AI отвечает корректно
- [ ] Social функции работают
- [ ] Чат real-time
- [ ] Уведомления приходят

### Безопасность
- [ ] HTTPS везде
- [ ] JWT безопасность
- [ ] SQL injection защита
- [ ] XSS защита
- [ ] Rate limiting
- [ ] Input sanitization

### Производительность
- [ ] API response < 200ms
- [ ] Страница загружается < 3s
- [ ] Images оптимизированы
- [ ] DB индексы настроены
- [ ] Кеширование работает

### Документация
- [ ] API docs (Swagger/OpenAPI)
- [ ] User guide
- [ ] Admin guide
- [ ] README обновлён

---

## 🚀 Запуск параллельной разработки

### Subagent 1: Backend Infrastructure
**Задачи:**
1. Auth system (Google + Telegram)
2. Database migrations
3. API endpoints
4. WebSockets

### Subagent 2: Frontend Core
**Задачи:**
1. React/Vue setup
2. Auth pages
3. Dashboard layout
4. Components library

### Subagent 3: Health Module
**Задачи:**
1. Health data forms
2. Charts visualization
3. Goals system
4. 7 direction pages

### Subagent 4: Social + AI
**Задачи:**
1. Social feed
2. Chat interface
3. Qwen integration
4. RAG system

**Все subagents работают параллельно, синхронизируются через API contracts.**

---

**Старт разработки:** Немедленно после подтверждения плана.
