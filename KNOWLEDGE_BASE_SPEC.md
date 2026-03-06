# 🧠 EthosLife Knowledge Base Specification

**Версия:** 1.0  
**Дата:** Март 2026  
**Статус:** Ready for Implementation  
**Проект:** EthosLife Human Operating System (H.O.S.)

---

## 📋 СОДЕРЖАНИЕ

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Иерархическая структура](#иерархическая-структура)
3. [SQL схема базы данных](#sql-схема-базы-данных)
4. [API Endpoints](#api-endpoints)
5. [Критический минимум контента](#критический-минимум-контента)
6. [Научные источники](#научные-источники)
7. [Интеграция с AI-коучем](#интеграция-s-ai-коучем)

---

## 🏗️ ОБЗОР АРХИТЕКТУРЫ

### 4-уровневая иерархия знаний

```
┌─────────────────────────────────────────────────────────────────┐
│                    УРОВЕНЬ 1: МОДУЛИ (7)                        │
│  Nutrition │ Fitness │ Sleep │ Mental │ Medical │ Genetics │ Env│
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  УРОВЕНЬ 2: ВЕКТОРЫ ЗДОРОВЬЯ (~30)              │
│  Макро │ Микро │ Диеты │ Сон │ Стресс │ Кардио │ Сила │ ...    │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  УРОВЕНЬ 3: ТИПЫ ДОКУМЕНТОВ (5)                 │
│  Протоколы │ Программы │ Чек-листы │ Гайды │ Исследования      │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   УРОВЕНЬ 4: ЧАНКИ (235+ документов)            │
│  Контент с векторными embedding для RAG поиска                  │
└─────────────────────────────────────────────────────────────────┘
```

### Ключевые компоненты системы

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **PostgreSQL** | Primary DB | Хранение документов, метаданных |
| **pgvector** | Vector Extension | Векторные embedding для semantic search |
| **RAG System** | Retrieval Augmented Generation | AI-коуч с контекстом из БД |
| **Knowledge Mining** | Student/Professor workflow | Верификация контента |
| **Multi-language** | 10 языков | i18n поддержка (JSONB) |

---

## 📊 ИЕРАРХИЧЕСКАЯ СТРУКТУРА

### Уровень 1: 7 Модулей Здоровья

| Код | Название | Векторы | Документов |
|-----|----------|---------|------------|
| **NUTR** | 🍎 Nutrition (Питание) | 6 | 41 |
| **FIT** | 💪 Fitness (Фитнес) | 4 | 41 |
| **SLEEP** | 😴 Sleep (Сон) | 4 | 34 |
| **MENTAL** | 🧠 Mental Health (Ментальное) | 4 | 34 |
| **MED** | 🏥 Medicine (Медицина) | 5 | 29 |
| **GENE** | 🧬 Genetics/Biochemistry | 5 | 28 |
| **ENV** | 🌍 Environment (Среда) | 5 | 28 |

### Уровень 2: Векторы здоровья (пример для Nutrition)

```
NUTR (Nutrition)
├── NUTR.MACRO — Макронутриенты (белки, жиры, углеводы)
├── NUTR.MICRO — Микронутриенты (витамины, минералы)
├── NUTR.DIET — Паттерны питания (диеты, протоколы)
├── NUTR.TIMING — Время приёмов пищи (интервальное голодание)
├── NUTR.SUPP — Добавки (evidence-based)
└── NUTR.HYDR — Гидратация (вода, электролиты)
```

### Уровень 3: Типы документов

| Тип | Описание | Пример |
|-----|----------|--------|
| **protocol** | Научно обоснованный протокол | «Протокол средиземноморской диеты» |
| **program** | Пошаговая программа с длительностью | «4-недельная программа похудения» |
| **checklist** | Практический чек-лист | «Утренний чек-лист питания» |
| **guideline** | Образовательный гайд | «Гайд по макронутриентам» |
| **research** | Научное исследование/мета-анализ | «PREDIMED Study (2013)» |

---

## 💾 SQL СХЕМА БАЗЫ ДАННЫХ

### Основные таблицы

#### 1. knowledge_categories (Уровни 1-2)

```sql
CREATE TABLE knowledge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES knowledge_categories(id),
    level INTEGER CHECK (level IN (1, 2)),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_i18n JSONB NOT NULL,  -- {"en": "Nutrition", "ru": "Питание", ...}
    description_i18n JSONB,
    icon VARCHAR(50),
    color_hex VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    documents_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_categories_parent ON knowledge_categories(parent_id);
CREATE INDEX idx_categories_level ON knowledge_categories(level);
CREATE INDEX idx_categories_code ON knowledge_categories(code);
```

#### 2. knowledge_documents (Уровень 3)

```sql
CREATE TYPE document_type AS ENUM (
    'protocol', 'program', 'checklist', 'guideline', 
    'research', 'meta_analysis', 'review', 'faq'
);

CREATE TYPE evidence_grade AS ENUM ('A', 'B', 'C', 'D');

CREATE TYPE verification_status AS ENUM (
    'draft', 'student_created', 'peer_review', 
    'professor_verified', 'published', 'archived'
);

CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES knowledge_categories(id),
    document_type document_type NOT NULL,
    version INTEGER DEFAULT 1,
    is_latest_version BOOLEAN DEFAULT true,
    
    -- Контент (мультиязычность)
    title_i18n JSONB NOT NULL,
    summary_i18n JSONB,
    content_i18n JSONB,
    
    -- Метаданные
    source_url VARCHAR(500),
    source_doi VARCHAR(100),
    publication_date DATE,
    evidence_grade evidence_grade DEFAULT 'C',
    
    -- Контекст использования
    tags TEXT[],
    target_goals TEXT[],  -- [weight_loss, muscle_gain, sleep_improvement]
    contraindications TEXT[],  -- [diabetes, hypertension, pregnancy]
    audience_levels TEXT[],  -- [beginner, intermediate, advanced]
    
    -- Статус и верификация
    status verification_status DEFAULT 'draft',
    created_by UUID,  -- student
    verified_by UUID,  -- professor
    verified_at TIMESTAMP,
    
    -- Статистика
    views_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_documents_category ON knowledge_documents(category_id);
CREATE INDEX idx_documents_type ON knowledge_documents(document_type);
CREATE INDEX idx_documents_status ON knowledge_documents(status);
CREATE INDEX idx_documents_goals ON knowledge_documents USING GIN (target_goals);
CREATE INDEX idx_documents_tags ON knowledge_documents USING GIN (tags);
```

#### 3. knowledge_chunks (Уровень 4 + RAG)

```sql
-- Требуется расширение pgvector
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    
    -- Контент
    title_i18n JSONB,
    content_i18n JSONB NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    
    -- Векторное embedding для semantic search
    embedding vector(1536) NOT NULL,
    embedding_model VARCHAR(50) DEFAULT 'text-embedding-ada-002',
    
    -- Метаданные
    word_count INTEGER,
    entities JSONB,  -- {"diseases": [], "nutrients": [], "exercises": []}
    cross_refs UUID[],  -- ссылки на другие чанки
    
    -- Статистика RAG
    retrieval_count INTEGER DEFAULT 0,
    last_retrieved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_chunk_document_index UNIQUE (document_id, chunk_index)
);

-- Векторный индекс для быстрого semantic search
CREATE INDEX idx_chunks_embedding_cosine 
ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_chunks_document ON knowledge_chunks(document_id);
```

#### 4. knowledge_relationships (Связи)

```sql
CREATE TYPE relationship_type AS ENUM (
    'cites', 'cited_by', 'extends', 'contradicts', 
    'supports', 'prerequisite', 'related', 'version_of'
);

CREATE TABLE knowledge_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(20) CHECK (source_type IN ('document', 'chunk')),
    source_id UUID NOT NULL,
    target_type VARCHAR(20) CHECK (target_type IN ('document', 'chunk')),
    target_id UUID NOT NULL,
    relationship_type relationship_type NOT NULL,
    strength DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_relationship UNIQUE 
        (source_type, source_id, target_type, target_id, relationship_type)
);

CREATE INDEX idx_relationships_source 
    ON knowledge_relationships(source_type, source_id);
CREATE INDEX idx_relationships_target 
    ON knowledge_relationships(target_type, target_id);
```

#### 5. knowledge_verification_log (Аудит верификации)

```sql
CREATE TYPE verification_action AS ENUM (
    'submit_for_review', 'peer_review_start', 'peer_review_complete',
    'professor_review_start', 'professor_review_complete',
    'request_changes', 'approve', 'reject', 'publish'
);

CREATE TABLE knowledge_verification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES knowledge_documents(id),
    action verification_action NOT NULL,
    user_id UUID NOT NULL,
    user_role VARCHAR(20) NOT NULL,  -- student, professor, admin
    comment TEXT,
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10),
    quality_feedback TEXT,
    changes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_document 
    ON knowledge_verification_log(document_id);
CREATE INDEX idx_verification_user 
    ON knowledge_verification_log(user_id);
```

---

## 🔌 API ENDPOINTS

### Категории

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/knowledge/categories` | Все категории с иерархией |
| GET | `/api/knowledge/categories/tree` | Дерево категорий |
| GET | `/api/knowledge/categories/:code` | Конкретная категория |

### Документы

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/knowledge/documents` | Поиск с фильтрами |
| GET | `/api/knowledge/documents/:id` | Документ с контентом |
| POST | `/api/knowledge/documents` | Создать (студент) |
| PUT | `/api/knowledge/documents/:id/verify` | Верификация (профессор) |

### RAG Поиск

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/knowledge/search` | Semantic search с векторами |
| GET | `/api/knowledge/chunks/:id/cross-refs` | Cross-references чанка |
| POST | `/api/knowledge/chunks/:id/vote` | Голосование за полезность |

### Верификация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/knowledge/verification/queue` | Очередь на ревью |
| GET | `/api/knowledge/verification/history/:documentId` | История верификации |
| POST | `/api/knowledge/reviewers/assign` | Назначить ревьюверов |

---

## 📚 КРИТИЧЕСКИЙ МИНИМУМ КОНТЕНТА

### Общая статистика

| Тип | Количество | Описание |
|-----|------------|----------|
| **Протоколы** | 41 | Научно обоснованные протоколы |
| **Программы** | 41 | Пошаговые программы с длительностью |
| **Чек-листы** | 28 | Практические чек-листы |
| **Гайды** | 41 | Образовательные материалы |
| **Исследования** | 84 | Научные исследования и мета-анализы |
| **ИТОГО** | **235** | Документов для MVP |

### Распределение по модулям

| Модуль | Протоколы | Программы | Чек-листы | Гайды | Исследования | Итого |
|--------|-----------|-----------|-----------|-------|--------------|-------|
| 🍎 Питание | 7 | 7 | 5 | 7 | 15 | **41** |
| 💪 Фитнес | 7 | 7 | 5 | 7 | 15 | **41** |
| 😴 Сон | 6 | 6 | 4 | 6 | 12 | **34** |
| 🧠 Ментальное | 6 | 6 | 4 | 6 | 12 | **34** |
| 🏥 Медицина | 5 | 5 | 4 | 5 | 10 | **29** |
| 🧬 Генетика | 5 | 5 | 3 | 5 | 10 | **28** |
| 🌍 Среда | 5 | 5 | 3 | 5 | 10 | **28** |

### Приоритеты наполнения

#### Приоритет 1: Запуск (Недели 1-4) — 42 документа
Самые популярные цели пользователей:
- Похудение, набор массы
- Улучшение сна
- Снижение стресса
- Базовое здоровье

#### Приоритет 2: Расширение (Недели 5-8) — 98 документов
Полное покрытие основных потребностей

#### Приоритет 3: Полная база (Недели 9-12) — 235 документов
Критический минимум для полноценного MVP

---

## 🔬 НАУЧНЫЕ ИСТОЧНИКИ

### Приоритет 1: Открытые базы данных

| Источник | URL | Модули | Статус |
|----------|-----|--------|--------|
| **PubMed** | pubmed.ncbi.nlm.nih.gov | Все | ✅ Открытый |
| **PubMed Central** | ncbi.nlm.nih.gov/pmc | Все | ✅ Открытый |
| **USDA FoodData** | fdc.nal.usda.gov | Питание | ✅ Открытый |
| **Cochrane Library** | cochranelibrary.com | Все | ⚠️ Частично |
| **ClinicalTrials.gov** | clinicaltrials.gov | Все | ✅ Открытый |

### Приоритет 2: Специализированные

| Источник | URL | Модули | Статус |
|----------|-----|--------|--------|
| **bioRxiv/medRxiv** | biorxiv.org | Генетика, Медицина | ✅ Открытый |
| **NCBI Gene** | ncbi.nlm.nih.gov/gene | Генетика | ✅ Открытый |
| **ACSM** | acsm.org | Фитнес | ⚠️ Частично |
| **AASM** | aasm.org | Сон | ⚠️ Частично |
| **EPA** | epa.gov | Среда | ✅ Открытый |

### Приоритет 3: Требуют подписки

- Scopus, Web of Science — для углублённого анализа
- PsycINFO — для ментального здоровья

---

## 🤖 ИНТЕГРАЦИЯ С AI-КОУЧЕМ

### RAG Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     USER QUERY                                │
│         "Как улучшить сон при сменной работе?"               │
└──────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  EMBEDDING SERVICE                            │
│        Конвертация запроса в вектор (1536 dim)               │
└──────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              VECTOR SIMILARITY SEARCH                         │
│   Поиск в knowledge_chunks через cosine similarity           │
│   Фильтры: module=sleep, audience=shift_workers              │
└──────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  RERANKING ENGINE                             │
│  similarity + evidence_grade + helpful_votes                 │
└──────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   CONTEXT BUILDING                            │
│  Топ-10 чанков → контекст для Qwen API                       │
└──────────────────────────────────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   QWEN AI RESPONSE                            │
│  Персонализированный ответ с ссылками на источники           │
└──────────────────────────────────────────────────────────────┘
```

### Пример RAG запроса

```javascript
POST /api/knowledge/search

{
  "query": "Как улучшить сон при сменной работе?",
  "category_codes": ["SLEEP", "SLEEP.CYCLE"],
  "target_goals": ["sleep_improvement"],
  "audience_level": "intermediate",
  "language": "ru",
  "limit": 10
}

// Возвращает:
{
  "query": "Как улучшить сон при сменной работе?",
  "results": [
    {
      "chunk_id": "uuid-1",
      "document_id": "uuid-doc-1",
      "document_title": "Протокол для сменных рабочих",
      "category_name": "Сон",
      "evidence_grade": "A",
      "similarity_score": 0.89,
      "content": "Мелатонин 0.5-3мг после смены, чёрные шторы..."
    },
    // ... ещё 9 результатов
  ],
  "rag_context": [
    // Контекст для отправки в Qwen API
  ]
}
```

### AI Prompt Template

```
Ты — EthosLife AI Health Coach, эксперт по сну и циркадным ритмам.

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
- Профиль: сменный работник (ночные смены)
- Цель: Улучшение качества сна
- Ограничения: нет

РЕЛЕВАНТНЫЕ ЗНАНИЯ ИЗ БАЗЫ:
{rag_context}

ИНСТРУКЦИИ:
1. Дай персонализированную рекомендацию на основе контекста
2. Ссылайся на конкретные протоколы/исследования
3. Учти противопоказания и уровень пользователя
4. Будь поддерживающим и практичным
5. Предложи следующие шаги

ОТВЕТ (на русском):
```

---

## 🎯 ROADMAP РЕАЛИЗАЦИИ

### Фаза 1: Инфраструктура (Недели 1-2)
- [ ] Установка PostgreSQL с pgvector
- [ ] Создание SQL схемы
- [ ] Настройка API endpoints
- [ ] Интеграция с Qwen API

### Фаза 2: Контент Приоритет 1 (Недели 3-4)
- [ ] 42 документа базового приоритета
- [ ] Чанкование контента (200-500 слов)
- [ ] Генерация векторных embedding
- [ ] Верификация профессорами

### Фаза 3: Контент Приоритет 2 (Недели 5-8)
- [ ] 98 документов расширенного приоритета
- [ ] Мультиязычные переводы (10 языков)
- [ ] Cross-references между документами
- [ ] Интеграция с AI-коучем

### Фаза 4: Полный запуск (Недели 9-12)
- [ ] 235 документов критического минимума
- [ ] Knowledge Mining workflow (студенты/профессора)
- [ ] RAG оптимизация с reranking
- [ ] Мониторинг и аналитика использования

---

## 📈 МЕТРИКИ УСПЕХА

| Метрика | Цель | Измерение |
|---------|------|-----------|
| **Документов в базе** | 235+ | COUNT(knowledge_documents) |
| **Точность RAG поиска** | >85% | helpful_votes / total_votes |
| **Время ответа API** | <200ms | p95 latency |
| **Покрытие языков** | 10 | COUNT(knowledge_languages) |
| **Верифицировано** | >90% | verified / published |

---

## 📝 ПРИЛОЖЕНИЯ

### A. Пример документа в БД

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "category_id": "nutr-diet-uuid",
  "document_type": "protocol",
  "version": 1,
  "is_latest_version": true,
  "title_i18n": {
    "en": "Calorie Deficit Protocol for Weight Loss",
    "ru": "Протокол дефицита калорий для похудения"
  },
  "summary_i18n": {
    "en": "Evidence-based approach to sustainable weight loss",
    "ru": "Доказательный подход к устойчивому похудению"
  },
  "evidence_grade": "A",
  "tags": ["weight_loss", "calorie_deficit", "metabolism"],
  "target_goals": ["weight_loss", "fat_loss"],
  "contraindications": ["diabetes_type_1", "eating_disorders"],
  "audience_levels": ["beginner", "intermediate"],
  "status": "published",
  "views_count": 1250,
  "helpful_count": 98
}
```

### B. Пример чанка с embedding

```json
{
  "id": "chunk-uuid-1",
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "chunk_index": 0,
  "title_i18n": {
    "en": "Understanding Calorie Deficit",
    "ru": "Понимание дефицита калорий"
  },
  "content_i18n": {
    "en": "A calorie deficit occurs when you consume fewer calories than your body expends. This is the fundamental principle behind weight loss. Research shows that a deficit of 500-750 calories per day leads to sustainable weight loss of 0.5-1 kg per week..."
  },
  "language_code": "en",
  "embedding": [0.0123, -0.0456, 0.0789, ...],  // 1536 dimensions
  "word_count": 250,
  "entities": {
    "concepts": ["calorie_deficit", "energy_balance"],
    "metrics": ["TDEE", "BMR"]
  },
  "retrieval_count": 45
}
```

### C. SQL для первоначального наполнения

```sql
-- Вставка 7 модулей уровня 1
INSERT INTO knowledge_categories (level, code, name_i18n, icon, color_hex, is_core) VALUES
(1, 'NUTR', '{"en": "Nutrition", "ru": "Питание"}'::jsonb, '🍎', '#E74C3C', true),
(1, 'FIT', '{"en": "Fitness", "ru": "Фитнес"}'::jsonb, '💪', '#27AE60', true),
(1, 'SLEEP', '{"en": "Sleep", "ru": "Сон"}'::jsonb, '😴', '#8E44AD', true),
(1, 'MENTAL', '{"en": "Mental Health", "ru": "Ментальное здоровье"}'::jsonb, '🧠', '#9B59B6', true),
(1, 'MED', '{"en": "Medicine", "ru": "Медицина"}'::jsonb, '🏥', '#C0392B', true),
(1, 'GENE', '{"en": "Genetics", "ru": "Генетика"}'::jsonb, '🧬', '#E67E22', true),
(1, 'ENV', '{"en": "Environment", "ru": "Среда"}'::jsonb, '🌍', '#1ABC9C', true);
```

---

## 👥 КОМАНДА РАЗРАБОТКИ

### Subagents, которые работали над спецификацией

| Агент | Задача | Результат |
|-------|--------|-----------|
| **Research Agent** | Поиск научных источников | 36 авторитетных источников |
| **Architecture Agent** | Проектирование БД | Полная SQL схема с индексами |
| **Content Agent** | Критический минимум | 235 документов для MVP |

---

**© 2026 EthosLife Inc.**  
*Здоровье — это ежедневная привычка.*

---

## 📞 КОНТАКТЫ

- **Website:** https://ethoslife.onrender.com/
- **Email:** investors@ethoslife.com
- **Telegram:** @foxampy
