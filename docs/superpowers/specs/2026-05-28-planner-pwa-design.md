# Система планирования + PWA уведомления — EthosLife

**Дата:** 2026-05-28  
**Статус:** Approved  
**Область:** Cosmos — Planner + PWA Push Notifications

---

## 1. Цель

Добавить полноценную систему планирования задач и напоминаний поверх Cosmos-созвездия. Пользователь может создавать задачи вручную или генерировать план через ИИ. Каждое напоминание имеет полностью настраиваемое расписание повторений. Приложение устанавливается как PWA и отправляет интерактивные push-уведомления с персонализированными AI-сообщениями.

---

## 2. Архитектура — три слоя

### Слой 1: Данные (Supabase)

**`reminders`** — напоминания
```sql
id            uuid PK
user_id       text NOT NULL
title         text NOT NULL
description   text
category      text  -- habit | goal | social | health | custom
emoji         text  -- пользовательский эмодзи
scheduled_at  timestamptz  -- следующее срабатывание
repeat_rule   jsonb  -- полная конфигурация повторений (см. ниже)
ai_message    text   -- AI-сообщение, генерируется при создании
is_active     boolean DEFAULT true
color         text   -- пользовательский цвет
linked_goal_id uuid  -- FK → goals.id (опционально)
created_at    timestamptz DEFAULT now()
```

**`repeat_rule` JSONB-схема:**
```json
{
  "type": "none|daily|weekly|monthly|custom",
  "interval": 1,
  "days_of_week": [1,3,5],
  "days_of_month": [1,15],
  "times_per_day": 2,
  "times": ["08:00","20:00"],
  "every_n_hours": null,
  "working_days_only": false,
  "end_date": null,
  "max_occurrences": null
}
```

**`tasks`** — задачи
```sql
id            uuid PK
user_id       text NOT NULL
title         text NOT NULL
description   text
category      text
priority      int DEFAULT 2  -- 1=low 2=medium 3=high
status        text DEFAULT 'active'  -- active|done|cancelled
due_date      date
reminder_id   uuid FK → reminders.id
linked_goal_id uuid FK → goals.id
sort_order    int
created_at    timestamptz DEFAULT now()
```

**`push_subscriptions`** — PWA-устройства
```sql
id        uuid PK
user_id   text NOT NULL
endpoint  text NOT NULL UNIQUE
p256dh    text NOT NULL
auth      text NOT NULL
ua_hint   text  -- user agent для отладки
created_at timestamptz DEFAULT now()
```

**`notifications`** — история уведомлений
```sql
id            uuid PK
user_id       text NOT NULL
reminder_id   uuid FK → reminders.id
title         text
body          text
ai_message    text
action_url    text  -- /planner | /cosmos
snoozed_until timestamptz
done_at       timestamptz
read_at       timestamptz
sent_at       timestamptz DEFAULT now()
```

---

### Слой 2: Frontend

#### Структура файлов
```
frontend/src/pages/Planner/
  PlannerPage.tsx          — страница /planner
  PlannerSidePanel.tsx     — свайп-панель поверх Cosmos
  widgets/
    DayViewWidget.tsx      — почасовое расписание дня
    WeekViewWidget.tsx     — неделя по колонкам
    CircularWidget.tsx     — циферблат с событиями по кругу
    TimelineWidget.tsx     — вертикальная временная лента
  ReminderEditor.tsx       — создание/редактирование напоминания
  TaskEditor.tsx           — создание/редактирование задачи
  RepeatRuleEditor.tsx     — полный редактор повторений
  NotificationsPage.tsx    — история уведомлений + AI-сообщения
  plannerStore.ts          — Zustand стор планировщика
  plannerTypes.ts          — типы
  usePlanner.ts            — хук CRUD + AI-генерация
frontend/src/hooks/
  usePWA.ts               — регистрация SW, подписка на push
  useSwipePanel.ts        — свайп-детектор для боковой панели
frontend/public/
  manifest.json           — PWA-манифест
  sw.js                   — service worker
  icons/                  — иконки 192x192, 512x512
```

#### PlannerSidePanel
- Вызывается: свайп справа налево от правого края экрана (порог 40px) ИЛИ кнопка-иконка (📋) рядом с бургер-меню
- Поведение: слайдится с правого края, затемняет фон, созвездие остаётся видно
- Содержит: активный виджет + кнопка «Открыть планировщик» для перехода на `/planner`

#### PlannerPage (`/planner`)
- Шапка: переключатель виджетов (4 иконки), кнопка «+ Задача», кнопка «✦ ИИ-план»
- Основная область: выбранный виджет (Day / Week / Circular / Timeline)
- FAB снизу: «+ Напоминание»
- Настройки виджета: цветовая схема, плотность, показывать/скрывать категории

#### Виджеты (переключаемые, стиль сохраняется в localStorage)
1. **DayView** — почасовая сетка текущего дня, события блоками
2. **WeekView** — 7 колонок, события по дням, скролл по горизонтали
3. **CircularWidget** — циферблат 24ч, события по кругу, Obsidian-стиль
4. **TimelineWidget** — вертикальная лента, события с иконками и цветными бейджами

#### ReminderEditor
Поля: название, emoji, категория, цвет, описание, дата/время первого срабатывания, RepeatRuleEditor, связать с целью, AI-сообщение (автогенерация + ручное редактирование)

#### RepeatRuleEditor
Опции:
- Не повторять
- Каждый день (каждые N дней)
- По дням недели (мультиселект пн-вс)
- По числам месяца
- N раз в день (с выбором времён)
- Каждые N часов
- Только рабочие дни
- Дата окончания / максимум N срабатываний

---

### Слой 3: PWA + Push

#### manifest.json
```json
{
  "name": "EthosLife",
  "short_name": "EthosLife",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#d2af50",
  "icons": [192px, 512px]
}
```

#### sw.js (Service Worker)
Обрабатывает события:
- `push` — показывает уведомление с кнопками «Выполнено» / «+15 мин»
- `notificationclick` — навигация на `/notifications` или `/cosmos`
- `notificationclose` — логирует dismissal

Push-payload формат:
```json
{
  "notification_id": "uuid",
  "title": "Время тренировки",
  "body": "08:00 · здоровье",
  "ai_message": "Сегодня твоя воля особенно сильна — созвездие говорит о прорыве",
  "action_url": "/notifications",
  "chat_url": "/cosmos"
}
```

Уведомление показывает:
- Заголовок + время + категория
- AI-сообщение (тело уведомления)
- Кнопки: `[✓ Выполнено]` `[+15 мин]`
- Клик на уведомление → `/notifications`
- Клик на AI-сообщение → `/cosmos` (с открытым чатом)

#### VAPID-ключи
- Генерируются один раз через `web-push generate-vapid-keys`
- Публичный ключ → `VITE_VAPID_PUBLIC_KEY` (Vercel env)
- Приватный ключ → `VAPID_PRIVATE_KEY` (только Supabase Edge Function, не в браузере)

#### usePWA hook
- Регистрирует sw.js при монтировании
- Запрашивает разрешение на уведомления
- Подписывается на push через `PushManager.subscribe`
- Сохраняет subscription в `push_subscriptions` через Supabase

#### Supabase Edge Function: `send-push`
- Триггер: cron каждую минуту (`0 * * * * *`)
- Логика:
  1. Выбирает напоминания где `scheduled_at <= now() + 1 min` и `is_active = true`
  2. Для каждого — находит push_subscriptions пользователя
  3. Формирует payload с AI-сообщением
  4. Отправляет через `web-push` npm пакет
  5. Создаёт запись в `notifications`
  6. Обновляет `scheduled_at` для следующего срабатывания согласно `repeat_rule`

---

## 3. UX-флоу

### Создание напоминания
1. Нажать FAB «+ Напоминание» или «+ Задача»
2. Заполнить форму в ReminderEditor
3. Нажать «Генерировать AI-сообщение» → вызов `/api/grok` → персональный совет сохраняется
4. Сохранить → запись в Supabase → виджет обновляется

### Получение уведомления (пользователь офлайн)
1. Edge Function срабатывает по cron
2. Отправляет push на устройство
3. Service Worker показывает уведомление с AI-текстом и кнопками
4. Пользователь нажимает «Выполнено» → SW отправляет POST в Supabase, отмечает выполненным
5. Пользователь нажимает на AI-текст → открывается `/cosmos` с чатом

### Генерация плана через ИИ
1. В PlannerPage нажать «✦ ИИ-план»
2. Grok получает созвездие пользователя (top nodes) и генерирует план на 7/30 дней
3. Показывается превью — пользователь редактирует или принимает
4. Принятые задачи создаются в Supabase с напоминаниями

---

## 4. Палитра и стиль

Всё в графитовой премиальной теме:
- Фон виджетов: `rgba(10,10,14,0.94)`
- Акцент: `rgba(210,175,80,0.88)` (янтарный)
- Категории: habit=янтарный, goal=жемчуг, social=серебро, health=шалфей
- Никакого синего
- Переходы: Framer Motion spring

---

## 5. Порядок реализации

1. Supabase миграции (reminders, tasks, push_subscriptions, notifications)
2. VAPID-ключи, manifest.json, sw.js, usePWA hook
3. plannerTypes.ts + plannerStore.ts + usePlanner.ts
4. RepeatRuleEditor → ReminderEditor → TaskEditor
5. Виджеты: DayView → WeekView → CircularWidget → TimelineWidget
6. PlannerPage + PlannerSidePanel + useSwipePanel
7. NotificationsPage
8. Supabase Edge Function send-push
9. AI-генерация сообщений при создании + AI-план

---

## 6. Технические зависимости

```json
"web-push": "^3.6.x"          // только в Edge Function (Node)
"workbox-window": "^7.x"       // опционально для SW-регистрации
```
Новых npm-зависимостей во frontend нет — используем native Push API + fetch.
