# Cosmos Page — Design Spec
**Date:** 2026-05-15  
**Project:** EthosLife — Human Operating System  
**Feature:** CosmosPage — главный экран с онбордингом, mind-map созвездием и AI-анализом

---

## 1. Концепция

Главный экран приложения — живое космическое пространство. Графитово-чёрный фон (#0a0a0f). Верхние 3/4 экрана заняты интерактивным графом созвездий (Obsidian Graph View style, но живее и премиальнее). Нижняя 1/4 — полупрозрачная панель с планом дня и AI-чатом.

При первом входе — пустой тёмный экран → онбординг из 6 вопросов → магический момент → постоянный космос-дом.

---

## 2. Маршрутизация

- `/cosmos` — новый главный экран авторизованного пользователя
- `/` редирект: если onboarding завершён → `/cosmos`, иначе → `/cosmos` (онбординг запускается внутри)
- Лендинг остаётся на `/landing`
- `AppRoutes.tsx`: добавить `<Route path="/cosmos" element={<CosmosPage />} />`
- CosmosPage — fullscreen, без `PageLayout` wrapper (своя обёртка без BottomNav)

---

## 3. Структура файлов

```
frontend/src/pages/Cosmos/
├── CosmosPage.tsx           — оркестратор, state machine
├── CosmosCanvas.tsx         — canvas движок (RAF loop, render pipeline)
├── OnboardingFlow.tsx       — пузырьки вопросов поверх canvas
├── MagicMoment.tsx          — анимация коллапс → вспышка → разлёт
├── BottomPanel.tsx          — план дня + AI окно (коллапсируемое)
├── constellationEngine.ts   — физика частиц, drift, кластеры, силы
├── aiAnalyzer.ts            — AI API вызов + парсинг → Node[], Edge[]
├── cosmosStore.ts           — Zustand: состояние, nodes, edges, answers
└── types.ts                 — Node, Edge, Cluster, Answer, CosmosState
```

---

## 4. Визуальный дизайн

### Цветовая палитра
- Фон: `#0a0a0f` (графитово-чёрный)
- Узлы (звёзды): `rgba(255,255,255,0.9)` с glow `rgba(150,180,255,0.6)`
- Нити (слабые связи): `rgba(100,140,255,0.15)` толщина 0.5px
- Нити (сильные связи): `rgba(150,200,255,0.4)` толщина 1.2px
- Кластер Эго (центр): узлы с glow `rgba(255,220,100,0.8)` — золотое свечение
- Кластер Социум (окружность): узлы с glow `rgba(100,220,255,0.7)` — голубое свечение
- Фоновые звёздочки (декор): `rgba(255,255,255,0.3)` 1px, медленный drift
- Пузырьки вопросов: `rgba(15,15,25,0.85)` backdrop-blur-xl, border `rgba(100,140,255,0.3)`

### Canvas Render Pipeline
```
1. clearRect (fill #0a0a0f)
2. Рисуем фоновые звёзды (200 точек, случайный медленный drift)
3. Рисуем edges (линии между узлами)
   - globalAlpha по силе связи (0.1–0.4)
   - strokeStyle по типу связи
   - lineWidth 0.5–1.5
4. Рисуем nodes
   - arc() для круга
   - shadowBlur = 15–40 для glow
   - shadowColor по кластеру
5. Рисуем labels (ctx.fillText, маленький шрифт, fade-in)
6. requestAnimationFrame → loop
```

### Физика (constellationEngine.ts)
- Каждый узел: `{x, y, vx, vy, mass, clusterId}`
- Drift: лёгкое случайное ускорение каждые N кадров (±0.02)
- Repulsion: узлы одного кластера отталкиваются (сохраняют форму)
- Attraction: связанные узлы притягиваются по силе edge.weight
- Damping: 0.95 (плавное торможение)
- Boundary: bounce от краёв canvas с затуханием

---

## 5. State Machine (CosmosPage)

```typescript
type CosmosPhase = 
  | 'GREETING'        // приветствие 3 сек
  | 'ONBOARDING'      // вопросы 1-6
  | 'MAGIC_MOMENT'    // анимация трансформации
  | 'COSMOS_HOME'     // постоянный дом
```

Zustand store `cosmosStore.ts`:
```typescript
interface CosmosState {
  phase: CosmosPhase
  currentQuestion: number           // 0-5
  answers: OnboardingAnswer[]       // ответы пользователя
  nodes: Node[]                     // все узлы графа
  edges: Edge[]                     // все связи
  clusters: Cluster[]               // кластеры (эго + социум)
  isAiAnalyzing: boolean
  dayPlan: DayPlanItem[]
  aiMessages: AiMessage[]
}
```

Persistence: `localStorage` key `ethoslife_cosmos` → JSON.stringify/parse при mount.
После логина: sync в Supabase таблицу `cosmos_profiles`.

---

## 6. Онбординг — 6 вопросов

Каждый пузырёк: title + textarea/input + варианты ответа (optional chips) + кнопка Submit.  
После Submit → `aiAnalyzer.analyzeAnswer(question, answer)` → получаем `Node[]` + `Edge[]` → добавляем в canvas.

### Вопросы
```
Q1: "Выбери или напиши цитату, которая тебя вдохновляет"
    chips: [предложить 3 популярных] + free text
    
Q2: "С каким персонажем из какой вселенной ты себя ассоциируешь?"
    chips: [Sherlock Holmes, Tony Stark, Hermione, Batman, ...] + free text
    
Q3: "От чего ты хочешь отказаться? (привычки, зависимости, паттерны)"
    chips: [соцсети, алкоголь, прокрастинация, сахар, ...] + free text
    
Q4: "Чего ты хочешь добиться? Твоя главная цель"
    chips: [финансовая свобода, здоровье, карьера, ...] + free text

Q5: "Расскажи о своей работе и типичном дне"
    textarea (только free text, развёрнутый ответ)
    
Q6: "Опиши свой круг — кто рядом? Как ты чувствуешь себя среди людей?"
    textarea (только free text)
```

### Появление пузырьков
- Анимация: `translateY(100px, 0)` + `opacity(0→1)` через Framer Motion
- Disposition: появляется снизу центра, чуть выше BottomPanel
- После ответа: пузырёк улетает вниз (`translateY(0, 100px)`) пока canvas заполняется
- Задержка 800ms между исчезновением и появлением следующего

---

## 7. AI Анализ ответов → Граф

### Стратегия (без API — мок → с API)

**Фаза 1 (MVP):** Детерминированный парсер в `aiAnalyzer.ts` — regex + keyword matching.  
Это работает с самого начала без API ключей.

**Фаза 2:** Подключение LLM. Рекомендуемые бесплатные варианты:

| Провайдер | Модель | Бесплатно | Лимит |
|-----------|--------|-----------|-------|
| **Google AI Studio** | Gemini 1.5 Flash | ✅ Да | 15 req/min, 1M tokens/day |
| **Groq** | Llama-3.1-8b | ✅ Да | 14,400 req/day |
| **Cohere** | Command-R | ✅ Да | 1000 req/month |
| **OpenRouter** | Mistral 7B | ✅ Free tier | pay-per-use |

**Рекомендация:** Google Gemini 1.5 Flash через `@google/generative-ai` SDK — самый щедрый бесплатный тир, быстрый, качественный.  
Ключ получить: https://aistudio.google.com/app/apikey (бесплатно, без карты)

### Промт для анализа онбординга

```
SYSTEM PROMPT (единый для всего онбординга):
---
You are a personality graph builder for EthosLife — a Human Operating System.
Your task: analyze user's onboarding answer and return a structured JSON graph.

Rules:
1. Extract 4-8 semantic "nodes" (key concepts, themes, emotions, values)
2. Each node has: id, label (1-3 words), weight (0.1-1.0), clusterId ('ego'|'social'|'goal'|'shadow')
3. Create edges between nodes: source, target, weight (0.1-1.0), type ('strong'|'weak'|'tension')
4. Strong edge (>0.6): direct semantic link ("freedom" ↔ "entrepreneurship")
5. Weak edge (<0.4): thematic resonance ("coffee" ↔ "focus")
6. Tension edge: contradictory values ("social approval" ↔ "individuality")
7. clusterId mapping:
   - 'ego': personal identity, values, character traits
   - 'social': relationships, society, how others perceive them
   - 'goal': aspirations, desired future
   - 'shadow': things to give up, fears, blockers
8. Return ONLY valid JSON, no explanations.
---

USER PROMPT per question:
Question: {questionText}
User's answer: {userAnswer}
Context (previous answers summary): {contextSummary}

Return JSON:
{
  "nodes": [
    {"id": "n1", "label": "Freedom", "weight": 0.9, "clusterId": "ego", "description": "Core drive"},
    ...
  ],
  "edges": [
    {"source": "n1", "target": "n2", "weight": 0.8, "type": "strong"},
    ...
  ],
  "insight": "One-sentence psychological insight about this answer"
}
```

### Промт для Magic Moment (финальная компоновка)

```
SYSTEM: You are finalizing the personality constellation map.
Given all 6 answers and their nodes/edges, determine:
1. The 3-5 most central EGO nodes (highest centrality score) → form the center cluster
2. The social nodes → arrange in outer ring
3. The goal nodes → satellite cluster near ego center
4. The shadow nodes → distant dim cluster
5. Generate a 30-day goal plan (daily actions) based on the main goal + ego nodes + shadow removals

Return JSON:
{
  "egoCenter": ["nodeId1", "nodeId2", ...],
  "socialRing": ["nodeId7", "nodeId8", ...],
  "goalSatellite": [...],
  "shadowCluster": [...],
  "dayPlan": [
    {"day": 1, "action": "...", "category": "habit|goal|social|health"},
    ...30 items
  ],
  "personalityInsight": "2-3 sentence summary of this person"
}
```

### Промт для постоянного AI-чата (окошко внизу)

```
SYSTEM: You are the personal AI of {userName} inside EthosLife.
You know their full personality map:
- Core identity: {egoSummary}
- Main goal: {mainGoal}
- Things to release: {shadowItems}
- Social profile: {socialSummary}

Your role: be a wise, concise companion. Answer questions, suggest daily actions,
track progress toward the goal. Speak in the user's language. Be direct, warm, not generic.
Reference their specific nodes when relevant ("Given your drive for freedom...").
```

---

## 8. Magic Moment — Анимационная Последовательность

```
Шаг 1 (0–800ms):   Все узлы начинают двигаться к центру (target: canvas center)
                    velocity увеличивается, edges становятся ярче
                    
Шаг 2 (800–1200ms): Узлы сливаются в одну точку, начинают пульсировать
                    glow radius растёт: 5px → 60px → 120px
                    цвет: rgba(255,220,100,1.0) — золотое солнце
                    
Шаг 3 (1200–1600ms): ВСПЫШКА — белый overlay opacity 0→1→0 за 400ms
                    canvas fillRect(white) с globalAlpha animation
                    
Шаг 4 (1600–2400ms): Узлы "разлетаются" от центра к финальным позициям
                    эго-кластер → centre (r=0–150px)
                    социум → ring (r=250–350px)
                    фоновые декор-звёзды fade-in
                    
Шаг 5 (2400–3200ms): Labels fade-in на узлах
                    Подписи кластеров появляются
                    
Шаг 6 (3200–4000ms): BottomPanel slide-up (Framer Motion translateY)
                    план дня + AI окошко проявляются
```

---

## 9. Bottom Panel

```
┌─────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░ ПЛАН НА СЕГОДНЯ ░░░░░░░░░░░░░░░░░░░░░░ │  ← 48px, backdrop-blur
│  [✓ 9:00 Медитация 15мин] [○ 12:00 Задача X] [○ ...] │
├─────────────────────────────────────────────────────────┤
│  ✦ Спроси своего AI...                      [Expand ↑] │  ← 52px, collapsed
└─────────────────────────────────────────────────────────┘
```

- Фон: `rgba(10,10,20,0.75)` + `backdrop-filter: blur(20px)`
- Border-top: `rgba(100,140,255,0.2)`
- AI окно по клику разворачивается вверх (Framer Motion height animation)
- Высота развёрнутого AI: 40vh, показывает историю сообщений + input

---

## 10. Supabase Schema

```sql
-- Профиль космоса пользователя
CREATE TABLE cosmos_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phase TEXT DEFAULT 'GREETING',
  answers JSONB DEFAULT '[]',
  nodes JSONB DEFAULT '[]',
  edges JSONB DEFAULT '[]',
  clusters JSONB DEFAULT '[]',
  day_plan JSONB DEFAULT '[]',
  personality_insight TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: только сам пользователь
ALTER TABLE cosmos_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their cosmos" ON cosmos_profiles
  FOR ALL USING (auth.uid() = user_id);
```

Supabase MCP подключается при реализации — создаём проект, применяем миграцию.

---

## 11. Бесплатный AI API — Пошаговая Инструкция

1. **Google AI Studio** → https://aistudio.google.com/app/apikey
   - Войти Google аккаунтом → Create API Key → копировать
   - `VITE_GEMINI_API_KEY=AIza...` в `.env`
   - SDK: `npm install @google/generative-ai`
   - Лимиты: 15 req/min, 1M tokens/day — для онбординга более чем достаточно

2. **Fallback (если Gemini недоступен):** Groq
   - https://console.groq.com → API Keys → Create
   - `VITE_GROQ_API_KEY=gsk_...`
   - SDK: REST fetch (нет npm пакета)

3. **Хранение ключей:**
   - `.env` (gitignore) для local dev
   - Vercel/Render environment variables для prod

---

## 12. Зависимости к установке

```bash
npm install @google/generative-ai  # Gemini AI SDK
# Supabase уже должен быть или:
npm install @supabase/supabase-js
```

---

## 13. Порядок реализации (для плана)

1. `types.ts` — все типы
2. `cosmosStore.ts` — Zustand store + localStorage persistence
3. `constellationEngine.ts` — физика частиц
4. `CosmosCanvas.tsx` — canvas рендер движок
5. `aiAnalyzer.ts` — детерминированный MVP парсер (без API)
6. `OnboardingFlow.tsx` — 6 пузырьков вопросов
7. `MagicMoment.tsx` — анимация коллапса и вспышки
8. `BottomPanel.tsx` — план + AI окошко
9. `CosmosPage.tsx` — оркестратор
10. Маршрутизация: добавить в `AppRoutes.tsx`
11. Supabase: MCP → создать проект → миграция → sync
12. Gemini API: подключить `aiAnalyzer.ts` → заменить mock на реальный AI

---

## 14. Критерии качества

- [ ] 60 FPS на canvas при 100+ узлах
- [ ] Плавные Framer Motion переходы (нет janky)
- [ ] Онбординг работает без API (детерминированный парсер)
- [ ] Magic moment длится 4 секунды ровно
- [ ] localStorage сохраняет состояние между сессиями
- [ ] AI-чат отвечает с учётом личности пользователя
- [ ] Мобильная адаптация (canvas ресайзится по viewport)
- [ ] BottomPanel коллапс/экспанд плавный
