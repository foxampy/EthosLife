# Planner + PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить полноценную систему планирования задач/напоминаний с PWA push-уведомлениями поверх Cosmos-созвездия EthosLife.

**Architecture:** Supabase хранит reminders/tasks/push_subscriptions/notifications. Frontend — страница `/planner` + свайп-панель поверх Cosmos. Edge Function `send-push` срабатывает по cron каждую минуту, отправляет Web Push через VAPID. Service Worker показывает интерактивные уведомления с AI-сообщениями и кнопками «Выполнено» / «+15 мин».

**Tech Stack:** React 18, TypeScript, Zustand, Framer Motion, Supabase JS v2, Web Push API (native), date-fns, lucide-react

---

## File Map

| Файл | Действие | Назначение |
|------|----------|-----------|
| `supabase/migrations/20260529_planner.sql` | Create | 4 таблицы + RLS |
| `frontend/public/manifest.json` | Create | PWA-манифест |
| `frontend/public/sw.js` | Create | Service Worker |
| `frontend/src/hooks/usePWA.ts` | Create | Регистрация SW + push-подписка |
| `frontend/src/hooks/useSwipePanel.ts` | Create | Детектор свайпа |
| `frontend/src/pages/Planner/plannerTypes.ts` | Create | Все типы планировщика |
| `frontend/src/pages/Planner/plannerStore.ts` | Create | Zustand стор |
| `frontend/src/pages/Planner/usePlanner.ts` | Create | CRUD + AI-хуки |
| `frontend/src/pages/Planner/RepeatRuleEditor.tsx` | Create | Редактор повторений |
| `frontend/src/pages/Planner/ReminderEditor.tsx` | Create | Форма напоминания |
| `frontend/src/pages/Planner/TaskEditor.tsx` | Create | Форма задачи |
| `frontend/src/pages/Planner/widgets/DayViewWidget.tsx` | Create | Почасовое расписание |
| `frontend/src/pages/Planner/widgets/WeekViewWidget.tsx` | Create | Недельный вид |
| `frontend/src/pages/Planner/widgets/CircularWidget.tsx` | Create | Циферблат 24ч |
| `frontend/src/pages/Planner/widgets/TimelineWidget.tsx` | Create | Вертикальная лента |
| `frontend/src/pages/Planner/PlannerPage.tsx` | Create | Страница /planner |
| `frontend/src/pages/Planner/PlannerSidePanel.tsx` | Create | Боковая свайп-панель |
| `frontend/src/pages/Planner/NotificationsPage.tsx` | Create | История уведомлений |
| `frontend/src/routes/AppRoutes.tsx` | Modify | Добавить /planner, /notifications |
| `frontend/src/pages/Cosmos/CosmosPage.tsx` | Modify | Добавить кнопку 📋 + PlannerSidePanel |
| `supabase/functions/send-push/index.ts` | Create | Edge Function cron |

---

## Task 1: Supabase Migration — 4 таблицы

**Files:**
- Create: `supabase/migrations/20260529_planner.sql`

- [ ] **Step 1: Создать файл миграции**

```sql
-- supabase/migrations/20260529_planner.sql

-- ───────────────── reminders ─────────────────
CREATE TABLE IF NOT EXISTS public.reminders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        text NOT NULL,
  title          text NOT NULL,
  description    text,
  category       text NOT NULL DEFAULT 'custom',
  emoji          text,
  scheduled_at   timestamptz,
  repeat_rule    jsonb NOT NULL DEFAULT '{"type":"none","interval":1,"days_of_week":[],"days_of_month":[],"times_per_day":1,"times":[],"every_n_hours":null,"working_days_only":false,"end_date":null,"max_occurrences":null}'::jsonb,
  ai_message     text,
  is_active      boolean NOT NULL DEFAULT true,
  color          text,
  linked_goal_id uuid,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reminders_user" ON public.reminders
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ───────────────── tasks ─────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        text NOT NULL,
  title          text NOT NULL,
  description    text,
  category       text,
  priority       int NOT NULL DEFAULT 2,
  status         text NOT NULL DEFAULT 'active',
  due_date       date,
  reminder_id    uuid REFERENCES public.reminders(id) ON DELETE SET NULL,
  linked_goal_id uuid,
  sort_order     int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_user" ON public.tasks
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ───────────────── push_subscriptions ─────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text NOT NULL,
  endpoint   text NOT NULL UNIQUE,
  p256dh     text NOT NULL,
  auth       text NOT NULL,
  ua_hint    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "push_subs_user" ON public.push_subscriptions
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- ───────────────── notifications ─────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       text NOT NULL,
  reminder_id   uuid REFERENCES public.reminders(id) ON DELETE SET NULL,
  title         text,
  body          text,
  ai_message    text,
  action_url    text,
  snoozed_until timestamptz,
  done_at       timestamptz,
  read_at       timestamptz,
  sent_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_user" ON public.notifications
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
```

- [ ] **Step 2: Применить миграцию в Supabase**

Открыть Supabase Dashboard → SQL Editor → вставить и выполнить содержимое файла. Убедиться что 4 таблицы появились во вкладке Table Editor.

---

## Task 2: PWA — manifest.json + sw.js

**Files:**
- Create: `frontend/public/manifest.json`
- Create: `frontend/public/sw.js`

- [ ] **Step 1: Создать manifest.json**

```json
{
  "name": "EthosLife",
  "short_name": "EthosLife",
  "description": "Human Operating System",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0a0a0f",
  "theme_color": "#d2af50",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 2: Создать иконки PWA**

Создать папку `frontend/public/icons/`. Туда положить два PNG-файла `icon-192.png` и `icon-512.png` (логотип EthosLife). Можно взять любое PNG и переименовать — браузер примет любой квадрат.

- [ ] **Step 3: Добавить manifest в index.html**

В `frontend/public/index.html` внутри `<head>` добавить:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#d2af50" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

- [ ] **Step 4: Создать sw.js**

```js
// frontend/public/sw.js
const CACHE = 'ethoslife-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) =>
  e.waitUntil(self.clients.claim())
)

// ── Push handler ──────────────────────────────────────────────
self.addEventListener('push', (e) => {
  if (!e.data) return
  const payload = e.data.json()
  const { title, body, ai_message, action_url, chat_url, notification_id } = payload

  e.waitUntil(
    self.registration.showNotification(title, {
      body: ai_message || body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: notification_id,
      requireInteraction: true,
      data: { action_url, chat_url, notification_id },
      actions: [
        { action: 'done', title: '✓ Выполнено' },
        { action: 'snooze', title: '+15 мин' }
      ]
    })
  )
})

// ── Notification click ─────────────────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const { action_url, chat_url, notification_id } = e.notification.data || {}

  if (e.action === 'done') {
    e.waitUntil(
      fetch('/api/notifications/done', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id })
      }).catch(() => {})
    )
    return
  }

  if (e.action === 'snooze') {
    e.waitUntil(
      fetch('/api/notifications/snooze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id, minutes: 15 })
      }).catch(() => {})
    )
    return
  }

  // Default click — open app
  const url = e.notification.data?.action_url || '/notifications'
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin))
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})

self.addEventListener('notificationclose', () => {
  // Dismissal logged server-side if needed
})
```

---

## Task 3: VAPID ключи

**Files:** `.env` (Vercel env vars)

- [ ] **Step 1: Сгенерировать VAPID ключи**

Выполнить в терминале (нужен Node.js):
```bash
npx web-push generate-vapid-keys
```

Вывод будет примерно таким:
```
Public Key: BNxxx...
Private Key: xxx...
```

- [ ] **Step 2: Добавить в env Vercel**

В Vercel Dashboard → Project → Settings → Environment Variables добавить:
- `VITE_VAPID_PUBLIC_KEY` = значение Public Key (доступно в браузере)
- `VAPID_PRIVATE_KEY` = значение Private Key (только сервер, НЕ с префиксом VITE_)

Также добавить в локальный `frontend/.env.local` для разработки:
```
VITE_VAPID_PUBLIC_KEY=BNxxx...
```

---

## Task 4: plannerTypes.ts

**Files:**
- Create: `frontend/src/pages/Planner/plannerTypes.ts`

- [ ] **Step 1: Создать файл типов**

```typescript
// frontend/src/pages/Planner/plannerTypes.ts

export type PlannerCategory = 'habit' | 'goal' | 'social' | 'health' | 'custom'
export type WidgetType = 'day' | 'week' | 'circular' | 'timeline'
export type TaskStatus = 'active' | 'done' | 'cancelled'
export type TaskPriority = 1 | 2 | 3

export interface RepeatRule {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom'
  interval: number
  days_of_week: number[]        // 0=Вс, 1=Пн … 6=Сб
  days_of_month: number[]       // 1..31
  times_per_day: number
  times: string[]               // ['08:00','20:00']
  every_n_hours: number | null
  working_days_only: boolean
  end_date: string | null       // ISO date 'YYYY-MM-DD'
  max_occurrences: number | null
}

export const DEFAULT_REPEAT_RULE: RepeatRule = {
  type: 'none',
  interval: 1,
  days_of_week: [],
  days_of_month: [],
  times_per_day: 1,
  times: [],
  every_n_hours: null,
  working_days_only: false,
  end_date: null,
  max_occurrences: null,
}

export interface Reminder {
  id: string
  user_id: string
  title: string
  description: string | null
  category: PlannerCategory
  emoji: string | null
  scheduled_at: string | null   // ISO timestamptz
  repeat_rule: RepeatRule
  ai_message: string | null
  is_active: boolean
  color: string | null
  linked_goal_id: string | null
  created_at: string
}

export interface PlannerTask {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string | null
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null       // ISO date
  reminder_id: string | null
  linked_goal_id: string | null
  sort_order: number
  created_at: string
}

export interface PlannerNotification {
  id: string
  user_id: string
  reminder_id: string | null
  title: string | null
  body: string | null
  ai_message: string | null
  action_url: string | null
  snoozed_until: string | null
  done_at: string | null
  read_at: string | null
  sent_at: string
}

// Category palette — amber/pearl/silver/sage, no blue
export const CATEGORY_COLORS: Record<PlannerCategory, string> = {
  habit:  'rgba(210,175,80,0.88)',   // amber
  goal:   'rgba(235,225,205,0.85)',  // pearl
  social: 'rgba(175,190,200,0.75)',  // silver
  health: 'rgba(140,180,150,0.75)',  // sage
  custom: 'rgba(200,195,185,0.70)',  // warm grey
}

export const CATEGORY_LABELS: Record<PlannerCategory, string> = {
  habit:  'Привычка',
  goal:   'Цель',
  social: 'Социальное',
  health: 'Здоровье',
  custom: 'Другое',
}

export const CATEGORY_EMOJIS: Record<PlannerCategory, string> = {
  habit:  '⚡',
  goal:   '✦',
  social: '◈',
  health: '◉',
  custom: '◆',
}
```

---

## Task 5: plannerStore.ts

**Files:**
- Create: `frontend/src/pages/Planner/plannerStore.ts`

- [ ] **Step 1: Создать Zustand стор**

```typescript
// frontend/src/pages/Planner/plannerStore.ts
import { create } from 'zustand'
import type { Reminder, PlannerTask, PlannerNotification, WidgetType } from './plannerTypes'

interface PlannerState {
  reminders: Reminder[]
  tasks: PlannerTask[]
  notifications: PlannerNotification[]
  activeWidget: WidgetType
  isLoading: boolean
  editingReminder: Reminder | null
  editingTask: PlannerTask | null
  showReminderEditor: boolean
  showTaskEditor: boolean
}

interface PlannerActions {
  setReminders: (reminders: Reminder[]) => void
  addReminder: (r: Reminder) => void
  updateReminder: (r: Reminder) => void
  removeReminder: (id: string) => void
  setTasks: (tasks: PlannerTask[]) => void
  addTask: (t: PlannerTask) => void
  updateTask: (t: PlannerTask) => void
  removeTask: (id: string) => void
  setNotifications: (n: PlannerNotification[]) => void
  markNotificationRead: (id: string) => void
  setActiveWidget: (w: WidgetType) => void
  setIsLoading: (v: boolean) => void
  openReminderEditor: (r?: Reminder) => void
  closeReminderEditor: () => void
  openTaskEditor: (t?: PlannerTask) => void
  closeTaskEditor: () => void
}

const WIDGET_KEY = 'ethoslife_planner_widget'

function loadWidget(): WidgetType {
  try {
    const v = localStorage.getItem(WIDGET_KEY)
    if (v === 'day' || v === 'week' || v === 'circular' || v === 'timeline') return v
  } catch { /* ignore */ }
  return 'day'
}

export const usePlannerStore = create<PlannerState & PlannerActions>((set) => ({
  reminders: [],
  tasks: [],
  notifications: [],
  activeWidget: loadWidget(),
  isLoading: false,
  editingReminder: null,
  editingTask: null,
  showReminderEditor: false,
  showTaskEditor: false,

  setReminders: (reminders) => set({ reminders }),
  addReminder: (r) => set((s) => ({ reminders: [...s.reminders, r] })),
  updateReminder: (r) => set((s) => ({ reminders: s.reminders.map((x) => x.id === r.id ? r : x) })),
  removeReminder: (id) => set((s) => ({ reminders: s.reminders.filter((x) => x.id !== id) })),

  setTasks: (tasks) => set({ tasks }),
  addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
  updateTask: (t) => set((s) => ({ tasks: s.tasks.map((x) => x.id === t.id ? t : x) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id) })),

  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) =>
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    )
  })),

  setActiveWidget: (activeWidget) => {
    try { localStorage.setItem(WIDGET_KEY, activeWidget) } catch { /* ignore */ }
    set({ activeWidget })
  },

  setIsLoading: (isLoading) => set({ isLoading }),

  openReminderEditor: (r) => set({ editingReminder: r ?? null, showReminderEditor: true }),
  closeReminderEditor: () => set({ editingReminder: null, showReminderEditor: false }),

  openTaskEditor: (t) => set({ editingTask: t ?? null, showTaskEditor: true }),
  closeTaskEditor: () => set({ editingTask: null, showTaskEditor: false }),
}))
```

---

## Task 6: usePlanner.ts — CRUD + AI хук

**Files:**
- Create: `frontend/src/pages/Planner/usePlanner.ts`

- [ ] **Step 1: Создать хук**

```typescript
// frontend/src/pages/Planner/usePlanner.ts
import { useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { usePlannerStore } from './plannerStore'
import type { Reminder, PlannerTask, PlannerNotification, RepeatRule } from './plannerTypes'
import { DEFAULT_REPEAT_RULE } from './plannerTypes'
import { addDays, addMinutes, setHours, setMinutes, parseISO, isAfter } from 'date-fns'

// ── Next scheduled_at calculator ──────────────────────────────────────────────
export function calcNextScheduledAt(rule: RepeatRule, from: Date): Date | null {
  if (rule.type === 'none') return null

  if (rule.type === 'daily') {
    const next = addDays(from, rule.interval)
    if (rule.times.length > 0) {
      const [h, m] = rule.times[0].split(':').map(Number)
      return setMinutes(setHours(next, h), m)
    }
    return next
  }

  if (rule.type === 'weekly') {
    let cursor = addDays(from, 1)
    for (let i = 0; i < 14; i++) {
      const dow = cursor.getDay()
      if (rule.days_of_week.includes(dow)) {
        if (rule.times.length > 0) {
          const [h, m] = rule.times[0].split(':').map(Number)
          return setMinutes(setHours(cursor, h), m)
        }
        return cursor
      }
      cursor = addDays(cursor, 1)
    }
    return null
  }

  if (rule.type === 'monthly') {
    let cursor = addDays(from, 1)
    for (let i = 0; i < 62; i++) {
      if (rule.days_of_month.includes(cursor.getDate())) {
        if (rule.times.length > 0) {
          const [h, m] = rule.times[0].split(':').map(Number)
          return setMinutes(setHours(cursor, h), m)
        }
        return cursor
      }
      cursor = addDays(cursor, 1)
    }
    return null
  }

  if (rule.every_n_hours) {
    return addMinutes(from, rule.every_n_hours * 60)
  }

  return null
}

// ── AI message generation ──────────────────────────────────────────────────────
export async function generateAiMessage(title: string, category: string): Promise<string> {
  try {
    const res = await fetch('/api/grok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: 'Ты персональный наставник в EthosLife. Пиши короткие (1-2 предложения) вдохновляющие напоминания на русском. Никаких клише. Говори как мудрый друг.'
          },
          {
            role: 'user',
            content: `Напоминание: "${title}" (категория: ${category}). Дай персональный совет или мотивацию.`
          }
        ],
        max_tokens: 120,
        temperature: 0.8,
      })
    })
    if (!res.ok) return ''
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? ''
  } catch {
    return ''
  }
}

// ── AI Plan generation ────────────────────────────────────────────────────────
export async function generateAiPlan(
  cosmosNodes: Array<{ label: string; clusterId: string; weight: number }>
): Promise<Array<Omit<PlannerTask, 'id' | 'user_id' | 'created_at'>>> {
  const topNodes = cosmosNodes
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8)
    .map((n) => `${n.label} (${n.clusterId})`)
    .join(', ')

  try {
    const res = await fetch('/api/grok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: 'Ты планировщик-наставник EthosLife. Создай 7 задач на неделю на русском языке. Верни ТОЛЬКО JSON-массив объектов с полями: title (string), description (string), category ("habit"|"goal"|"social"|"health"|"custom"), priority (1|2|3), due_date (ISO date YYYY-MM-DD от сегодня), sort_order (0..6). Никакого лишнего текста.'
          },
          {
            role: 'user',
            content: `Созвездие пользователя: ${topNodes}. Составь реалистичный план развития на 7 дней.`
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      })
    })
    if (!res.ok) return []
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? ''
    // Extract JSON from response
    const match = content.match(/\[[\s\S]*\]/)
    if (!match) return []
    const parsed = JSON.parse(match[0])
    return parsed.map((t: Record<string, unknown>, i: number) => ({
      title: String(t.title ?? ''),
      description: t.description ? String(t.description) : null,
      category: t.category ?? 'custom',
      priority: (t.priority as 1 | 2 | 3) ?? 2,
      status: 'active' as const,
      due_date: t.due_date ? String(t.due_date) : null,
      reminder_id: null,
      linked_goal_id: null,
      sort_order: i,
    }))
  } catch {
    return []
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function usePlanner(userId: string | null) {
  const store = usePlannerStore()

  // Load data
  const loadAll = useCallback(async () => {
    if (!userId) return
    store.setIsLoading(true)
    try {
      const [{ data: reminders }, { data: tasks }, { data: notifications }] = await Promise.all([
        supabase.from('reminders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('notifications').select('*').eq('user_id', userId).order('sent_at', { ascending: false }).limit(50),
      ])
      if (reminders) store.setReminders(reminders as Reminder[])
      if (tasks) store.setTasks(tasks as PlannerTask[])
      if (notifications) store.setNotifications(notifications as PlannerNotification[])
    } finally {
      store.setIsLoading(false)
    }
  }, [userId])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Reminder CRUD ────────────────────────────────────────────────────────────
  const createReminder = useCallback(async (
    data: Omit<Reminder, 'id' | 'user_id' | 'created_at'>
  ): Promise<Reminder | null> => {
    if (!userId) return null
    const { data: row, error } = await supabase
      .from('reminders')
      .insert({ ...data, user_id: userId })
      .select()
      .single()
    if (error || !row) return null
    store.addReminder(row as Reminder)
    return row as Reminder
  }, [userId])

  const updateReminder = useCallback(async (id: string, data: Partial<Reminder>) => {
    const { data: row } = await supabase
      .from('reminders')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (row) store.updateReminder(row as Reminder)
  }, [])

  const deleteReminder = useCallback(async (id: string) => {
    await supabase.from('reminders').delete().eq('id', id)
    store.removeReminder(id)
  }, [])

  // ── Task CRUD ────────────────────────────────────────────────────────────────
  const createTask = useCallback(async (
    data: Omit<PlannerTask, 'id' | 'user_id' | 'created_at'>
  ): Promise<PlannerTask | null> => {
    if (!userId) return null
    const { data: row } = await supabase
      .from('tasks')
      .insert({ ...data, user_id: userId })
      .select()
      .single()
    if (row) store.addTask(row as PlannerTask)
    return row as PlannerTask | null
  }, [userId])

  const updateTask = useCallback(async (id: string, data: Partial<PlannerTask>) => {
    const { data: row } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (row) store.updateTask(row as PlannerTask)
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    store.removeTask(id)
  }, [])

  const markTaskDone = useCallback(async (id: string) => {
    await updateTask(id, { status: 'done' })
  }, [updateTask])

  return {
    reminders: store.reminders,
    tasks: store.tasks,
    notifications: store.notifications,
    isLoading: store.isLoading,
    loadAll,
    createReminder,
    updateReminder,
    deleteReminder,
    createTask,
    updateTask,
    deleteTask,
    markTaskDone,
  }
}
```

---

## Task 7: RepeatRuleEditor.tsx

**Files:**
- Create: `frontend/src/pages/Planner/RepeatRuleEditor.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/RepeatRuleEditor.tsx
import React from 'react'
import type { RepeatRule } from './plannerTypes'

const S = {
  section: { marginTop: 12 } as React.CSSProperties,
  label: { fontSize: 11, color: 'rgba(210,175,80,0.7)', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 },
  select: {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(232,226,215,0.9)', fontSize: 14, outline: 'none',
  },
  input: {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(232,226,215,0.9)', fontSize: 14, outline: 'none',
  },
  dayBtn: (active: boolean): React.CSSProperties => ({
    width: 32, height: 32, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 12,
    background: active ? 'rgba(210,175,80,0.85)' : 'rgba(255,255,255,0.07)',
    color: active ? 'rgba(20,16,10,0.95)' : 'rgba(232,226,215,0.7)',
    fontWeight: active ? 700 : 400,
  }),
  row: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginTop: 6 },
  toggle: (active: boolean): React.CSSProperties => ({
    padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
    background: active ? 'rgba(210,175,80,0.2)' : 'rgba(255,255,255,0.06)',
    color: active ? 'rgba(210,175,80,0.9)' : 'rgba(232,226,215,0.6)',
  }),
}

const DOW_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

interface Props {
  value: RepeatRule
  onChange: (rule: RepeatRule) => void
}

export function RepeatRuleEditor({ value, onChange }: Props) {
  const upd = (patch: Partial<RepeatRule>) => onChange({ ...value, ...patch })

  return (
    <div>
      <div style={S.section}>
        <div style={S.label}>Повторение</div>
        <select style={S.select} value={value.type} onChange={(e) => upd({ type: e.target.value as RepeatRule['type'] })}>
          <option value="none">Не повторять</option>
          <option value="daily">Каждый день</option>
          <option value="weekly">По дням недели</option>
          <option value="monthly">По числам месяца</option>
          <option value="custom">Каждые N часов</option>
        </select>
      </div>

      {value.type === 'daily' && (
        <div style={S.section}>
          <div style={S.label}>Каждые N дней</div>
          <input style={S.input} type="number" min={1} max={30} value={value.interval}
            onChange={(e) => upd({ interval: Number(e.target.value) })} />
        </div>
      )}

      {value.type === 'weekly' && (
        <div style={S.section}>
          <div style={S.label}>Дни недели</div>
          <div style={S.row}>
            {DOW_LABELS.map((lbl, i) => (
              <button key={i} style={S.dayBtn(value.days_of_week.includes(i))} onClick={() => {
                const days = value.days_of_week.includes(i)
                  ? value.days_of_week.filter((d) => d !== i)
                  : [...value.days_of_week, i]
                upd({ days_of_week: days })
              }}>{lbl}</button>
            ))}
          </div>
        </div>
      )}

      {value.type === 'monthly' && (
        <div style={S.section}>
          <div style={S.label}>Числа месяца (через запятую)</div>
          <input style={S.input} type="text" placeholder="1, 15"
            value={value.days_of_month.join(', ')}
            onChange={(e) => {
              const days = e.target.value.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n >= 1 && n <= 31)
              upd({ days_of_month: days })
            }} />
        </div>
      )}

      {value.type === 'custom' && (
        <div style={S.section}>
          <div style={S.label}>Каждые N часов</div>
          <input style={S.input} type="number" min={1} max={24} value={value.every_n_hours ?? 4}
            onChange={(e) => upd({ every_n_hours: Number(e.target.value) })} />
        </div>
      )}

      {value.type !== 'none' && (
        <>
          <div style={S.section}>
            <div style={S.label}>Время срабатывания (через запятую)</div>
            <input style={S.input} type="text" placeholder="08:00, 20:00"
              value={value.times.join(', ')}
              onChange={(e) => {
                const times = e.target.value.split(',').map((s) => s.trim()).filter((s) => /^\d{1,2}:\d{2}$/.test(s))
                upd({ times })
              }} />
          </div>

          <div style={S.section}>
            <div style={S.row}>
              <button style={S.toggle(value.working_days_only)}
                onClick={() => upd({ working_days_only: !value.working_days_only })}>
                Только рабочие дни
              </button>
            </div>
          </div>

          <div style={S.section}>
            <div style={S.label}>Дата окончания (необязательно)</div>
            <input style={S.input} type="date" value={value.end_date ?? ''}
              onChange={(e) => upd({ end_date: e.target.value || null })} />
          </div>

          <div style={S.section}>
            <div style={S.label}>Макс. срабатываний (необязательно)</div>
            <input style={S.input} type="number" min={1} placeholder="∞"
              value={value.max_occurrences ?? ''}
              onChange={(e) => upd({ max_occurrences: e.target.value ? Number(e.target.value) : null })} />
          </div>
        </>
      )}
    </div>
  )
}
```

---

## Task 8: ReminderEditor.tsx

**Files:**
- Create: `frontend/src/pages/Planner/ReminderEditor.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/ReminderEditor.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { RepeatRuleEditor } from './RepeatRuleEditor'
import { generateAiMessage } from './usePlanner'
import { usePlannerStore } from './plannerStore'
import type { Reminder, PlannerCategory, RepeatRule } from './plannerTypes'
import { DEFAULT_REPEAT_RULE, CATEGORY_LABELS } from './plannerTypes'

const BG = 'rgba(10,10,14,0.97)'
const BORDER = '1px solid rgba(255,255,255,0.09)'
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(232,226,215,0.9)', fontSize: 14, outline: 'none',
}
const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'rgba(210,175,80,0.65)', textTransform: 'uppercase',
  letterSpacing: 1, marginBottom: 5, display: 'block',
}

interface Props {
  onSave: (data: Omit<Reminder, 'id' | 'user_id' | 'created_at'>) => Promise<void>
}

export function ReminderEditor({ onSave }: Props) {
  const { editingReminder, closeReminderEditor } = usePlannerStore()
  const r = editingReminder

  const [title, setTitle] = useState(r?.title ?? '')
  const [description, setDescription] = useState(r?.description ?? '')
  const [emoji, setEmoji] = useState(r?.emoji ?? '⚡')
  const [category, setCategory] = useState<PlannerCategory>(r?.category ?? 'habit')
  const [color, setColor] = useState(r?.color ?? 'rgba(210,175,80,0.88)')
  const [scheduledAt, setScheduledAt] = useState(r?.scheduled_at ? r.scheduled_at.slice(0, 16) : '')
  const [repeatRule, setRepeatRule] = useState<RepeatRule>(r?.repeat_rule ?? DEFAULT_REPEAT_RULE)
  const [aiMessage, setAiMessage] = useState(r?.ai_message ?? '')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleGenerateAi = async () => {
    if (!title) return
    setAiLoading(true)
    const msg = await generateAiMessage(title, category)
    setAiMessage(msg)
    setAiLoading(false)
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      description: description || null,
      emoji: emoji || null,
      category,
      color: color || null,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      repeat_rule: repeatRule,
      ai_message: aiMessage || null,
      is_active: true,
      linked_goal_id: null,
    })
    setSaving(false)
    closeReminderEditor()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: BG, border: BORDER, borderRadius: '20px 20px 0 0',
        padding: '20px 20px 40px', maxHeight: '90vh', overflowY: 'auto',
      }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(232,226,215,0.9)' }}>
          {r ? 'Редактировать' : 'Новое напоминание'}
        </span>
        <button onClick={closeReminderEditor} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Emoji + Title */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2}
          style={{ ...inputStyle, width: 52, textAlign: 'center', fontSize: 22, padding: '8px 4px' }} />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название напоминания"
          style={{ ...inputStyle, flex: 1 }} />
      </div>

      {/* Category */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Категория</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.keys(CATEGORY_LABELS) as PlannerCategory[]).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
              background: category === cat ? 'rgba(210,175,80,0.2)' : 'rgba(255,255,255,0.06)',
              color: category === cat ? 'rgba(210,175,80,0.9)' : 'rgba(232,226,215,0.6)',
            }}>{CATEGORY_LABELS[cat]}</button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Заметки..." rows={2}
          style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'inherit' }} />
      </div>

      {/* Scheduled at */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Первое срабатывание</label>
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
          style={inputStyle} />
      </div>

      {/* Repeat rule */}
      <RepeatRuleEditor value={repeatRule} onChange={setRepeatRule} />

      {/* AI message */}
      <div style={{ marginTop: 16 }}>
        <label style={labelStyle}>AI-сообщение</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <textarea value={aiMessage} onChange={(e) => setAiMessage(e.target.value)}
            placeholder="Персональный совет от ИИ..." rows={2}
            style={{ ...inputStyle, flex: 1, resize: 'none', fontFamily: 'inherit' }} />
          <button onClick={handleGenerateAi} disabled={aiLoading || !title}
            style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(210,175,80,0.3)',
              background: 'rgba(210,175,80,0.1)', color: 'rgba(210,175,80,0.9)',
              cursor: aiLoading ? 'wait' : 'pointer', fontSize: 13, whiteSpace: 'nowrap',
            }}>
            <Sparkles size={14} style={{ marginBottom: -2, marginRight: 4 }} />
            {aiLoading ? '...' : 'ИИ'}
          </button>
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving || !title.trim()} style={{
        marginTop: 20, width: '100%', padding: '14px', borderRadius: 12, border: 'none',
        background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)',
        fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
      }}>
        {saving ? 'Сохранение...' : 'Сохранить напоминание'}
      </button>
    </motion.div>
  )
}
```

---

## Task 9: TaskEditor.tsx

**Files:**
- Create: `frontend/src/pages/Planner/TaskEditor.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/TaskEditor.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePlannerStore } from './plannerStore'
import type { PlannerTask, PlannerCategory, TaskPriority } from './plannerTypes'
import { CATEGORY_LABELS } from './plannerTypes'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(232,226,215,0.9)', fontSize: 14, outline: 'none',
}
const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'rgba(210,175,80,0.65)', textTransform: 'uppercase',
  letterSpacing: 1, marginBottom: 5, display: 'block',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = { 1: 'Низкий', 2: 'Средний', 3: 'Высокий' }
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  1: 'rgba(175,190,200,0.7)',
  2: 'rgba(210,175,80,0.8)',
  3: 'rgba(200,100,80,0.8)',
}

interface Props {
  onSave: (data: Omit<PlannerTask, 'id' | 'user_id' | 'created_at'>) => Promise<void>
}

export function TaskEditor({ onSave }: Props) {
  const { editingTask, closeTaskEditor, tasks } = usePlannerStore()
  const t = editingTask

  const [title, setTitle] = useState(t?.title ?? '')
  const [description, setDescription] = useState(t?.description ?? '')
  const [category, setCategory] = useState<PlannerCategory>((t?.category as PlannerCategory) ?? 'habit')
  const [priority, setPriority] = useState<TaskPriority>(t?.priority ?? 2)
  const [dueDate, setDueDate] = useState(t?.due_date ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      description: description || null,
      category: category || null,
      priority,
      status: 'active',
      due_date: dueDate || null,
      reminder_id: null,
      linked_goal_id: null,
      sort_order: tasks.length,
    })
    setSaving(false)
    closeTaskEditor()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: 'rgba(10,10,14,0.97)', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '20px 20px 0 0', padding: '20px 20px 40px', maxHeight: '80vh', overflowY: 'auto',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(232,226,215,0.9)' }}>
          {t ? 'Редактировать задачу' : 'Новая задача'}
        </span>
        <button onClick={closeTaskEditor} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название задачи" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Категория</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.keys(CATEGORY_LABELS) as PlannerCategory[]).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
              background: category === cat ? 'rgba(210,175,80,0.2)' : 'rgba(255,255,255,0.06)',
              color: category === cat ? 'rgba(210,175,80,0.9)' : 'rgba(232,226,215,0.6)',
            }}>{CATEGORY_LABELS[cat]}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Приоритет</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {([1, 2, 3] as TaskPriority[]).map((p) => (
            <button key={p} onClick={() => setPriority(p)} style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
              background: priority === p ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: priority === p ? PRIORITY_COLORS[p] : 'rgba(232,226,215,0.5)',
              fontWeight: priority === p ? 600 : 400,
            }}>{PRIORITY_LABELS[p]}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Срок выполнения</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Детали задачи..." rows={2}
          style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
      </div>

      <button onClick={handleSave} disabled={saving || !title.trim()} style={{
        width: '100%', padding: '14px', borderRadius: 12, border: 'none',
        background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)',
        fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
      }}>
        {saving ? 'Сохранение...' : 'Сохранить задачу'}
      </button>
    </motion.div>
  )
}
```

---

## Task 10: DayViewWidget.tsx

**Files:**
- Create: `frontend/src/pages/Planner/widgets/DayViewWidget.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/widgets/DayViewWidget.tsx
import React, { useMemo } from 'react'
import { format, parseISO, startOfDay, addHours, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Reminder, PlannerTask } from '../plannerTypes'
import { CATEGORY_COLORS } from '../plannerTypes'

interface Props {
  reminders: Reminder[]
  tasks: PlannerTask[]
  date?: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function DayViewWidget({ reminders, tasks, date = new Date() }: Props) {
  const now = new Date()
  const currentHour = now.getHours() + now.getMinutes() / 60

  // Map reminders to hour slots
  const remindersByHour = useMemo(() => {
    const map: Record<number, Reminder[]> = {}
    reminders.filter((r) => r.scheduled_at && isSameDay(parseISO(r.scheduled_at), date)).forEach((r) => {
      const h = parseISO(r.scheduled_at!).getHours()
      if (!map[h]) map[h] = []
      map[h].push(r)
    })
    return map
  }, [reminders, date])

  const tasksByHour = useMemo(() => {
    const map: Record<number, PlannerTask[]> = {}
    tasks.filter((t) => t.due_date && isSameDay(parseISO(t.due_date), date) && t.status === 'active').forEach((t) => {
      const h = 9 // default morning slot for tasks without time
      if (!map[h]) map[h] = []
      map[h].push(t)
    })
    return map
  }, [tasks, date])

  return (
    <div style={{ background: 'rgba(10,10,14,0.94)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Date header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(210,175,80,0.9)' }}>
          {format(date, 'd MMMM, EEEE', { locale: ru })}
        </span>
      </div>

      {/* Hours grid */}
      <div style={{ overflowY: 'auto', maxHeight: 520 }}>
        {HOURS.map((h) => {
          const isNow = Math.floor(currentHour) === h && isSameDay(date, now)
          const items = [...(remindersByHour[h] ?? []), ...(tasksByHour[h] ?? [])]

          return (
            <div key={h} style={{
              display: 'flex', minHeight: 48, borderBottom: '1px solid rgba(255,255,255,0.04)',
              position: 'relative', background: isNow ? 'rgba(210,175,80,0.04)' : 'transparent',
            }}>
              {/* Time label */}
              <div style={{ width: 44, padding: '8px 6px 8px 14px', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: isNow ? 'rgba(210,175,80,0.7)' : 'rgba(255,255,255,0.2)' }}>
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>

              {/* Current time indicator */}
              {isNow && (
                <div style={{
                  position: 'absolute', top: `${((currentHour % 1) * 48)}px`,
                  left: 44, right: 0, height: 1,
                  background: 'rgba(210,175,80,0.5)',
                }}>
                  <div style={{ position: 'absolute', left: -4, top: -3, width: 7, height: 7, borderRadius: '50%', background: 'rgba(210,175,80,0.8)' }} />
                </div>
              )}

              {/* Events */}
              <div style={{ flex: 1, padding: '4px 10px 4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map((item, i) => {
                  const isTask = 'status' in item
                  const cat = item.category as keyof typeof CATEGORY_COLORS
                  const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.custom
                  return (
                    <div key={i} style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 12,
                      background: `${color.replace('0.88', '0.12')}`,
                      borderLeft: `2px solid ${color}`,
                      color: 'rgba(232,226,215,0.85)',
                    }}>
                      {!isTask && (item as Reminder).emoji} {item.title}
                      {isTask && <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 10 }}>задача</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Task 11: WeekViewWidget.tsx

**Files:**
- Create: `frontend/src/pages/Planner/widgets/WeekViewWidget.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/widgets/WeekViewWidget.tsx
import React, { useMemo } from 'react'
import { startOfWeek, addDays, format, parseISO, isSameDay, isToday } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Reminder, PlannerTask } from '../plannerTypes'
import { CATEGORY_COLORS } from '../plannerTypes'

interface Props { reminders: Reminder[]; tasks: PlannerTask[] }

export function WeekViewWidget({ reminders, tasks }: Props) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const byDay = useMemo(() => {
    const map: Record<string, Array<Reminder | PlannerTask>> = {}
    days.forEach((d) => { map[format(d, 'yyyy-MM-dd')] = [] })

    reminders.forEach((r) => {
      if (!r.scheduled_at) return
      const key = format(parseISO(r.scheduled_at), 'yyyy-MM-dd')
      if (map[key]) map[key].push(r)
    })
    tasks.filter((t) => t.status === 'active').forEach((t) => {
      if (!t.due_date) return
      const key = t.due_date
      if (map[key]) map[key].push(t)
    })
    return map
  }, [reminders, tasks])

  return (
    <div style={{ background: 'rgba(10,10,14,0.94)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const items = byDay[key] ?? []
          const today = isToday(d)
          return (
            <div key={key} style={{
              minWidth: 110, flex: '1 0 110px', borderRight: '1px solid rgba(255,255,255,0.05)',
              background: today ? 'rgba(210,175,80,0.04)' : 'transparent',
            }}>
              {/* Day header */}
              <div style={{ padding: '10px 8px 8px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, color: today ? 'rgba(210,175,80,0.8)' : 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {format(d, 'EEE', { locale: ru })}
                </div>
                <div style={{
                  fontSize: 20, fontWeight: today ? 700 : 400,
                  color: today ? 'rgba(210,175,80,0.9)' : 'rgba(232,226,215,0.7)',
                }}>
                  {format(d, 'd')}
                </div>
              </div>

              {/* Events */}
              <div style={{ padding: '6px 6px', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 120 }}>
                {items.slice(0, 4).map((item, i) => {
                  const isTask = 'status' in item
                  const cat = item.category as keyof typeof CATEGORY_COLORS
                  const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.custom
                  return (
                    <div key={i} style={{
                      padding: '3px 6px', borderRadius: 5, fontSize: 11, lineHeight: 1.3,
                      background: color.replace('0.88', '0.13'),
                      color: 'rgba(232,226,215,0.8)',
                      borderLeft: `2px solid ${color}`,
                    }}>
                      {!isTask && (item as Reminder).emoji} {item.title.slice(0, 18)}
                    </div>
                  )
                })}
                {items.length > 4 && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', paddingLeft: 4 }}>+{items.length - 4}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## Task 12: CircularWidget.tsx

**Files:**
- Create: `frontend/src/pages/Planner/widgets/CircularWidget.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/widgets/CircularWidget.tsx
import React, { useMemo } from 'react'
import { parseISO, isSameDay } from 'date-fns'
import type { Reminder } from '../plannerTypes'
import { CATEGORY_COLORS } from '../plannerTypes'

interface Props { reminders: Reminder[]; size?: number }

export function CircularWidget({ reminders, size = 300 }: Props) {
  const cx = size / 2, cy = size / 2
  const R = size * 0.38
  const now = new Date()
  const currentAngle = ((now.getHours() + now.getMinutes() / 60) / 24) * 360 - 90

  const todayReminders = useMemo(() =>
    reminders.filter((r) => r.scheduled_at && isSameDay(parseISO(r.scheduled_at), now)),
    [reminders]
  )

  function hourToAngle(h: number, m = 0) {
    return ((h + m / 60) / 24) * 360 - 90
  }

  function polarToXY(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  return (
    <div style={{ background: 'rgba(10,10,14,0.94)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', padding: 16, display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size}>
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={24} />

        {/* Hour ticks */}
        {Array.from({ length: 24 }, (_, h) => {
          const a = hourToAngle(h)
          const inner = polarToXY(a, R - 14)
          const outer = polarToXY(a, R - 6)
          return (
            <line key={h} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.12)" strokeWidth={h % 6 === 0 ? 2 : 1} />
          )
        })}

        {/* Hour labels (every 6h) */}
        {[0, 6, 12, 18].map((h) => {
          const pos = polarToXY(hourToAngle(h), R - 28)
          return (
            <text key={h} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.3)" fontSize={10}>{String(h).padStart(2, '0')}</text>
          )
        })}

        {/* Reminder arcs */}
        {todayReminders.map((r, i) => {
          const dt = parseISO(r.scheduled_at!)
          const a = hourToAngle(dt.getHours(), dt.getMinutes())
          const pos = polarToXY(a, R)
          const cat = r.category as keyof typeof CATEGORY_COLORS
          const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.custom
          return (
            <g key={r.id}>
              <circle cx={pos.x} cy={pos.y} r={6} fill={color} opacity={0.9} />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize={9}>{r.emoji ?? '⚡'}</text>
            </g>
          )
        })}

        {/* Current time needle */}
        {(() => {
          const tip = polarToXY(currentAngle, R - 4)
          const base1 = polarToXY(currentAngle + 90, 6)
          const base2 = polarToXY(currentAngle - 90, 6)
          return (
            <polygon
              points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${base2.x},${base2.y}`}
              fill="rgba(210,175,80,0.9)" opacity={0.8}
            />
          )
        })()}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={4} fill="rgba(210,175,80,0.8)" />

        {/* Time display */}
        <text x={cx} y={cy + 30} textAnchor="middle" fill="rgba(232,226,215,0.5)" fontSize={11}>
          {now.getHours().toString().padStart(2,'0')}:{now.getMinutes().toString().padStart(2,'0')}
        </text>
      </svg>
    </div>
  )
}
```

---

## Task 13: TimelineWidget.tsx

**Files:**
- Create: `frontend/src/pages/Planner/widgets/TimelineWidget.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/widgets/TimelineWidget.tsx
import React, { useMemo } from 'react'
import { format, parseISO, isToday, isFuture, isTomorrow } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Reminder, PlannerTask } from '../plannerTypes'
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../plannerTypes'

interface TimelineItem {
  id: string
  type: 'reminder' | 'task'
  title: string
  emoji: string
  category: string
  datetime: Date
  isToday: boolean
  isTomorrow: boolean
}

interface Props { reminders: Reminder[]; tasks: PlannerTask[] }

export function TimelineWidget({ reminders, tasks }: Props) {
  const items: TimelineItem[] = useMemo(() => {
    const arr: TimelineItem[] = []

    reminders.filter((r) => r.scheduled_at && r.is_active).forEach((r) => {
      const dt = parseISO(r.scheduled_at!)
      if (!isFuture(dt) && !isToday(dt)) return
      arr.push({
        id: r.id, type: 'reminder', title: r.title,
        emoji: r.emoji ?? CATEGORY_EMOJIS[r.category] ?? '⚡',
        category: r.category, datetime: dt,
        isToday: isToday(dt), isTomorrow: isTomorrow(dt),
      })
    })

    tasks.filter((t) => t.due_date && t.status === 'active').forEach((t) => {
      const dt = parseISO(t.due_date!)
      if (!isFuture(dt) && !isToday(dt)) return
      arr.push({
        id: t.id, type: 'task', title: t.title,
        emoji: CATEGORY_EMOJIS[(t.category as keyof typeof CATEGORY_EMOJIS)] ?? '◆',
        category: t.category ?? 'custom', datetime: dt,
        isToday: isToday(dt), isTomorrow: isTomorrow(dt),
      })
    })

    return arr.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()).slice(0, 20)
  }, [reminders, tasks])

  if (items.length === 0) {
    return (
      <div style={{ background: 'rgba(10,10,14,0.94)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Нет предстоящих событий</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(10,10,14,0.94)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      {items.map((item, idx) => {
        const cat = item.category as keyof typeof CATEGORY_COLORS
        const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.custom
        const showDate = idx === 0 || !isSameDay(item.datetime, items[idx - 1].datetime)

        return (
          <React.Fragment key={item.id}>
            {showDate && (
              <div style={{ padding: '10px 16px 4px', fontSize: 11, color: 'rgba(210,175,80,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.isToday ? 'Сегодня' : item.isTomorrow ? 'Завтра' : format(item.datetime, 'd MMMM', { locale: ru })}
              </div>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              gap: 12,
            }}>
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {idx < items.length - 1 && (
                  <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', marginTop: 2 }} />
                )}
              </div>

              {/* Time */}
              <div style={{ width: 40, flexShrink: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                {format(item.datetime, 'HH:mm')}
              </div>

              {/* Emoji */}
              <span style={{ fontSize: 18 }}>{item.emoji}</span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: 'rgba(232,226,215,0.88)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </div>
                <div style={{
                  display: 'inline-block', marginTop: 2, padding: '1px 8px', borderRadius: 4, fontSize: 10,
                  background: color.replace(/[\d.]+\)$/, '0.12)'),
                  color: color.replace(/[\d.]+\)$/, '0.8)'),
                }}>
                  {item.type === 'task' ? 'задача' : 'напоминание'}
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
```

---

## Task 14: useSwipePanel.ts

**Files:**
- Create: `frontend/src/hooks/useSwipePanel.ts`

- [ ] **Step 1: Создать хук**

```typescript
// frontend/src/hooks/useSwipePanel.ts
import { useEffect, useRef, useCallback } from 'react'

interface Options {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
  threshold?: number   // px from right edge to trigger detection zone
  minSwipe?: number    // minimum swipe distance in px
}

export function useSwipePanel({ onOpen, onClose, isOpen, threshold = 40, minSwipe = 60 }: Options) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0]
    startX.current = t.clientX
    startY.current = t.clientY
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (startX.current === null || startY.current === null) return
    const t = e.changedTouches[0]
    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current

    // Ignore if mostly vertical
    if (Math.abs(dy) > Math.abs(dx)) {
      startX.current = null
      return
    }

    if (!isOpen && dx < -minSwipe && startX.current > window.innerWidth - threshold) {
      onOpen()
    }
    if (isOpen && dx > minSwipe) {
      onClose()
    }

    startX.current = null
    startY.current = null
  }, [isOpen, onOpen, onClose, threshold, minSwipe])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])
}
```

---

## Task 15: PlannerSidePanel.tsx

**Files:**
- Create: `frontend/src/pages/Planner/PlannerSidePanel.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
// frontend/src/pages/Planner/PlannerSidePanel.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlannerStore } from './plannerStore'
import { TimelineWidget } from './widgets/TimelineWidget'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function PlannerSidePanel({ isOpen, onClose }: Props) {
  const { reminders, tasks } = usePlannerStore()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 41,
              width: Math.min(340, window.innerWidth * 0.88),
              background: 'rgba(10,10,14,0.97)', borderLeft: '1px solid rgba(255,255,255,0.09)',
              display: 'flex', flexDirection: 'column',
            }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 12px' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(232,226,215,0.9)' }}>📋 Планировщик</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Widget */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
              <TimelineWidget reminders={reminders} tasks={tasks} />
            </div>

            {/* Open full planner */}
            <div style={{ padding: '12px 16px 32px' }}>
              <button onClick={() => { navigate('/planner'); onClose() }} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Calendar size={16} /> Открыть планировщик
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## Task 16: PlannerPage.tsx

**Files:**
- Create: `frontend/src/pages/Planner/PlannerPage.tsx`

- [ ] **Step 1: Создать страницу планировщика**

```tsx
// frontend/src/pages/Planner/PlannerPage.tsx
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Sparkles, Bell, LayoutGrid } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePlanner, generateAiPlan } from './usePlanner'
import { usePlannerStore } from './plannerStore'
import { ReminderEditor } from './ReminderEditor'
import { TaskEditor } from './TaskEditor'
import { DayViewWidget } from './widgets/DayViewWidget'
import { WeekViewWidget } from './widgets/WeekViewWidget'
import { CircularWidget } from './widgets/CircularWidget'
import { TimelineWidget } from './widgets/TimelineWidget'
import { useCosmosStore } from '../Cosmos/cosmosStore'
import type { WidgetType } from './plannerTypes'

const WIDGET_ICONS: Record<WidgetType, string> = {
  day: '◷', week: '▦', circular: '◎', timeline: '≡'
}
const WIDGET_LABELS: Record<WidgetType, string> = {
  day: 'День', week: 'Неделя', circular: 'Круг', timeline: 'Лента'
}

export default function PlannerPage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [aiPlanLoading, setAiPlanLoading] = useState(false)
  const [aiPreview, setAiPreview] = useState<Array<{ title: string; description: string | null; category: string; priority: number; due_date: string | null }>>([])

  const { nodes } = useCosmosStore()
  const store = usePlannerStore()
  const planner = usePlanner(userId)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [])

  const handleGenerateAiPlan = async () => {
    setAiPlanLoading(true)
    const tasks = await generateAiPlan(nodes)
    setAiPreview(tasks as typeof aiPreview)
    setAiPlanLoading(false)
  }

  const handleAcceptAiPlan = async () => {
    for (const t of aiPreview) {
      await planner.createTask({
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority as 1 | 2 | 3,
        status: 'active',
        due_date: t.due_date,
        reminder_id: null,
        linked_goal_id: null,
        sort_order: planner.tasks.length,
      })
    }
    setAiPreview([])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'rgba(232,226,215,0.9)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button onClick={() => navigate('/cosmos')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 22 }}>←</button>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(210,175,80,0.9)', letterSpacing: 0.5 }}>Планировщик</span>
          <button onClick={() => navigate('/notifications')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <Bell size={20} />
          </button>
        </div>

        {/* Widget switcher */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {(['day', 'week', 'circular', 'timeline'] as WidgetType[]).map((w) => (
            <button key={w} onClick={() => store.setActiveWidget(w)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
              background: store.activeWidget === w ? 'rgba(210,175,80,0.2)' : 'rgba(255,255,255,0.06)',
              color: store.activeWidget === w ? 'rgba(210,175,80,0.9)' : 'rgba(232,226,215,0.5)',
              fontWeight: store.activeWidget === w ? 600 : 400,
            }}>
              {WIDGET_ICONS[w]} {WIDGET_LABELS[w]}
            </button>
          ))}
        </div>
      </div>

      {/* Widget area */}
      <div style={{ padding: '16px 12px' }}>
        {store.activeWidget === 'day' && <DayViewWidget reminders={planner.reminders} tasks={planner.tasks} />}
        {store.activeWidget === 'week' && <WeekViewWidget reminders={planner.reminders} tasks={planner.tasks} />}
        {store.activeWidget === 'circular' && <CircularWidget reminders={planner.reminders} />}
        {store.activeWidget === 'timeline' && <TimelineWidget reminders={planner.reminders} tasks={planner.tasks} />}
      </div>

      {/* Tasks list (active) */}
      {store.activeWidget === 'day' && (
        <div style={{ padding: '0 12px' }}>
          <div style={{ fontSize: 12, color: 'rgba(210,175,80,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Задачи</div>
          {planner.tasks.filter((t) => t.status === 'active').slice(0, 10).map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 6, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => planner.markTaskDone(t.id)} style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(210,175,80,0.4)', background: 'none', cursor: 'pointer', flexShrink: 0 }} />
              <span style={{ fontSize: 14, flex: 1 }}>{t.title}</span>
              {t.due_date && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{t.due_date.slice(5)}</span>}
            </div>
          ))}
        </div>
      )}

      {/* AI plan preview */}
      <AnimatePresence>
        {aiPreview.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ margin: '16px 12px', background: 'rgba(210,175,80,0.06)', border: '1px solid rgba(210,175,80,0.2)', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(210,175,80,0.9)', marginBottom: 12 }}>✦ ИИ-план готов</div>
            {aiPreview.map((t, i) => (
              <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13, color: 'rgba(232,226,215,0.8)' }}>
                {t.title} {t.due_date && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>— {t.due_date.slice(5)}</span>}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleAcceptAiPlan} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)', fontWeight: 700, cursor: 'pointer' }}>
                Принять план
              </button>
              <button onClick={() => setAiPreview([])} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                Отклонить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editors */}
      <AnimatePresence>
        {store.showReminderEditor && (
          <ReminderEditor onSave={async (data) => { await planner.createReminder(data) }} />
        )}
        {store.showTaskEditor && (
          <TaskEditor onSave={async (data) => { await planner.createTask(data) }} />
        )}
      </AnimatePresence>

      {/* FABs */}
      <div style={{ position: 'fixed', bottom: 24, right: 16, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 30 }}>
        <button onClick={handleGenerateAiPlan} disabled={aiPlanLoading} style={{
          width: 48, height: 48, borderRadius: 24, border: '1px solid rgba(210,175,80,0.3)',
          background: 'rgba(10,10,14,0.95)', color: 'rgba(210,175,80,0.8)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={18} />
        </button>
        <button onClick={() => store.openTaskEditor()} style={{
          width: 48, height: 48, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(10,10,14,0.95)', color: 'rgba(232,226,215,0.7)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
        }}>
          T+
        </button>
        <button onClick={() => store.openReminderEditor()} style={{
          width: 56, height: 56, borderRadius: 28, border: 'none',
          background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(210,175,80,0.3)',
        }}>
          <Plus size={24} />
        </button>
      </div>
    </div>
  )
}
```

---

## Task 17: NotificationsPage.tsx

**Files:**
- Create: `frontend/src/pages/Planner/NotificationsPage.tsx`

- [ ] **Step 1: Создать страницу уведомлений**

```tsx
// frontend/src/pages/Planner/NotificationsPage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { usePlannerStore } from './plannerStore'
import type { PlannerNotification } from './plannerTypes'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, setNotifications, markNotificationRead } = usePlannerStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) { setLoading(false); return }
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('sent_at', { ascending: false })
        .limit(50)
      if (data) setNotifications(data as PlannerNotification[])
      setLoading(false)
    }
    load()
  }, [])

  const handleMarkDone = async (n: PlannerNotification) => {
    await supabase.from('notifications').update({ done_at: new Date().toISOString(), read_at: new Date().toISOString() }).eq('id', n.id)
    markNotificationRead(n.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'rgba(232,226,215,0.9)', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 22 }}>←</button>
        <span style={{ fontSize: 17, fontWeight: 700, color: 'rgba(210,175,80,0.9)' }}>Уведомления</span>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Загрузка...</div>
      )}

      {!loading && notifications.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
          <div style={{ color: 'rgba(255,255,255,0.3)' }}>Уведомлений пока нет</div>
        </div>
      )}

      {notifications.map((n) => {
        const isUnread = !n.read_at
        const isDone = !!n.done_at
        return (
          <div key={n.id} style={{
            padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: isUnread && !isDone ? 'rgba(210,175,80,0.04)' : 'transparent',
            opacity: isDone ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: isUnread ? 600 : 400, color: 'rgba(232,226,215,0.9)' }}>
                {isUnread && !isDone && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'rgba(210,175,80,0.9)', marginRight: 6, marginBottom: 1, verticalAlign: 'middle' }} />}
                {n.title ?? 'Напоминание'}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                {format(parseISO(n.sent_at), 'd MMM HH:mm', { locale: ru })}
              </span>
            </div>

            {n.ai_message && (
              <div style={{ fontSize: 13, color: 'rgba(210,175,80,0.7)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.4 }}>
                «{n.ai_message}»
              </div>
            )}

            {!isDone && (
              <button onClick={() => handleMarkDone(n)} style={{
                padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(210,175,80,0.3)',
                background: 'none', color: 'rgba(210,175,80,0.7)', fontSize: 12, cursor: 'pointer',
              }}>
                ✓ Выполнено
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

---

## Task 18: usePWA.ts

**Files:**
- Create: `frontend/src/hooks/usePWA.ts`

- [ ] **Step 1: Создать хук**

```typescript
// frontend/src/hooks/usePWA.ts
import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function usePWA(userId: string | null) {
  const registered = useRef(false)

  useEffect(() => {
    if (!userId || registered.current) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (!VAPID_PUBLIC_KEY) return

    registered.current = true

    const setup = async () => {
      try {
        // Register SW
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        await navigator.serviceWorker.ready

        // Request permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        // Subscribe to push
        const existing = await registration.pushManager.getSubscription()
        const subscription = existing ?? await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })

        const { endpoint, keys } = subscription.toJSON() as {
          endpoint: string
          keys: { p256dh: string; auth: string }
        }

        // Save to Supabase
        await supabase.from('push_subscriptions').upsert({
          user_id: userId,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          ua_hint: navigator.userAgent.slice(0, 200),
        }, { onConflict: 'endpoint' })
      } catch (err) {
        console.warn('PWA setup error:', err)
      }
    }

    setup()
  }, [userId])
}
```

---

## Task 19: Подключить PWA в CosmosPage + добавить кнопку 📋

**Files:**
- Modify: `frontend/src/pages/Cosmos/CosmosPage.tsx`

- [ ] **Step 1: Добавить PlannerSidePanel + usePWA + кнопку 📋**

В `CosmosPage.tsx` добавить импорты:
```typescript
import { PlannerSidePanel } from '../Planner/PlannerSidePanel'
import { usePWA } from '../../hooks/usePWA'
import { useSwipePanel } from '../../hooks/useSwipePanel'
```

В тело компонента добавить:
```typescript
const [plannerOpen, setPlannerOpen] = useState(false)
usePWA(userId)
useSwipePanel({ onOpen: () => setPlannerOpen(true), onClose: () => setPlannerOpen(false), isOpen: plannerOpen })
```

Рядом с бургер-меню (или в хедер Cosmos) добавить кнопку:
```tsx
<button
  onClick={() => setPlannerOpen(true)}
  style={{
    position: 'fixed', top: 16, right: 56, zIndex: 35,
    width: 36, height: 36, borderRadius: 18, border: 'none',
    background: 'rgba(10,10,14,0.8)', color: 'rgba(210,175,80,0.8)',
    cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}
>
  📋
</button>

<PlannerSidePanel isOpen={plannerOpen} onClose={() => setPlannerOpen(false)} />
```

---

## Task 20: AppRoutes.tsx — добавить маршруты

**Files:**
- Modify: `frontend/src/routes/AppRoutes.tsx`

- [ ] **Step 1: Добавить lazy-imports**

В секцию импортов AppRoutes.tsx добавить:
```typescript
const PlannerPage = React.lazy(() => import('../pages/Planner/PlannerPage'))
const NotificationsPage = React.lazy(() => import('../pages/Planner/NotificationsPage'))
```

- [ ] **Step 2: Добавить маршруты**

В блок `<Routes>` добавить перед закрывающим `</Routes>`:
```tsx
<Route path="/planner" element={
  <Suspense fallback={<PageLoader />}>
    <PlannerPage />
  </Suspense>
} />
<Route path="/notifications" element={
  <Suspense fallback={<PageLoader />}>
    <NotificationsPage />
  </Suspense>
} />
```

---

## Task 21: Supabase Edge Function — send-push

**Files:**
- Create: `supabase/functions/send-push/index.ts`

- [ ] **Step 1: Создать Edge Function**

```typescript
// supabase/functions/send-push/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @deno-types="https://esm.sh/web-push@3.6.7/src/index.d.ts"
import webpush from 'https://esm.sh/web-push@3.6.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const VAPID_PUBLIC_KEY = Deno.env.get('VITE_VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_EMAIL = Deno.env.get('VAPID_EMAIL') ?? 'mailto:admin@ethoslife.app'

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

function calcNextScheduledAt(rule: Record<string, unknown>, from: Date): string | null {
  const type = rule.type as string
  if (type === 'none') return null

  const next = new Date(from)
  if (type === 'daily') {
    next.setDate(next.getDate() + ((rule.interval as number) ?? 1))
    if ((rule.times as string[])?.length > 0) {
      const [h, m] = (rule.times as string[])[0].split(':').map(Number)
      next.setHours(h, m, 0, 0)
    }
    return next.toISOString()
  }
  if (type === 'custom' && rule.every_n_hours) {
    next.setTime(next.getTime() + (rule.every_n_hours as number) * 3600000)
    return next.toISOString()
  }
  // weekly / monthly — simplified: add 1 day and let next cron recalculate
  next.setDate(next.getDate() + 1)
  return next.toISOString()
}

Deno.serve(async (_req) => {
  try {
    const now = new Date()
    const oneMinuteLater = new Date(now.getTime() + 60000)

    // Get due reminders
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_active', true)
      .lte('scheduled_at', oneMinuteLater.toISOString())
      .not('scheduled_at', 'is', null)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    if (!reminders?.length) return new Response('no reminders due', { status: 200 })

    for (const reminder of reminders) {
      // Get push subscriptions for this user
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', reminder.user_id)

      if (!subs?.length) continue

      const payload = JSON.stringify({
        notification_id: crypto.randomUUID(),
        title: `${reminder.emoji ?? '⚡'} ${reminder.title}`,
        body: `${reminder.category}`,
        ai_message: reminder.ai_message ?? '',
        action_url: '/notifications',
        chat_url: '/cosmos',
      })

      // Send to all devices
      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
        } catch (err: unknown) {
          // Remove expired subscriptions
          if ((err as { statusCode?: number }).statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }

      // Log notification
      await supabase.from('notifications').insert({
        user_id: reminder.user_id,
        reminder_id: reminder.id,
        title: reminder.title,
        body: reminder.category,
        ai_message: reminder.ai_message,
        action_url: '/notifications',
      })

      // Update next scheduled_at
      const nextAt = calcNextScheduledAt(reminder.repeat_rule, new Date(reminder.scheduled_at))
      if (nextAt) {
        await supabase.from('reminders').update({ scheduled_at: nextAt }).eq('id', reminder.id)
      } else {
        await supabase.from('reminders').update({ is_active: false }).eq('id', reminder.id)
      }
    }

    return new Response(JSON.stringify({ sent: reminders.length }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
```

- [ ] **Step 2: Задеплоить Edge Function**

```bash
# В терминале из корня проекта:
npx supabase functions deploy send-push --project-ref ehftgqroqzggfhwgmjgj
```

- [ ] **Step 3: Настроить cron в Supabase**

В Supabase Dashboard → SQL Editor:
```sql
SELECT cron.schedule(
  'send-push-every-minute',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://ehftgqroqzggfhwgmjgj.supabase.co/functions/v1/send-push',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);
```

Или через Supabase Dashboard → Edge Functions → send-push → Cron Jobs → добавить `* * * * *`.

- [ ] **Step 4: Добавить env переменные в Edge Function**

В Supabase Dashboard → Settings → Edge Functions добавить:
- `VITE_VAPID_PUBLIC_KEY` = публичный VAPID ключ
- `VAPID_PRIVATE_KEY` = приватный VAPID ключ
- `VAPID_EMAIL` = `mailto:timursama96@gmail.com`

---

## Task 22: Commit и деплой

- [ ] **Step 1: Добавить файлы в git**

```bash
git add frontend/public/manifest.json frontend/public/sw.js \
        frontend/src/hooks/usePWA.ts frontend/src/hooks/useSwipePanel.ts \
        frontend/src/pages/Planner/ \
        frontend/src/routes/AppRoutes.tsx \
        supabase/migrations/20260529_planner.sql \
        supabase/functions/send-push/
```

- [ ] **Step 2: Коммит**

```bash
git commit -m "feat: Planner + PWA push notifications system

- 4 Supabase tables: reminders, tasks, push_subscriptions, notifications
- PWA manifest + service worker with interactive push notifications
- Planner page /planner with 4 widgets: Day/Week/Circular/Timeline
- Reminder editor with full repeat rule customization
- Task editor with priority/category/due date
- PlannerSidePanel (swipe from right edge on Cosmos)
- NotificationsPage /notifications with AI messages
- usePWA hook for SW registration + VAPID push subscription
- Supabase Edge Function send-push with cron every minute
- AI message generation per reminder (via /api/grok)
- AI plan generation from Cosmos constellation nodes"
```

- [ ] **Step 3: Push**

```bash
git push origin main
```

---

## Проверка после деплоя

- [ ] Открыть `/planner` — страница загружается, виджеты переключаются
- [ ] Создать напоминание через FAB → сохраняется в Supabase → отображается в виджетах
- [ ] Нажать «Генерировать AI-сообщение» → Grok возвращает текст
- [ ] Нажать «✦ ИИ-план» → превью 7 задач → принять → задачи появляются
- [ ] Свайп справа налево на Cosmos → открывается PlannerSidePanel
- [ ] Открыть Chrome DevTools → Application → Service Workers → sw.js зарегистрирован
- [ ] Разрешить уведомления → Chrome → Application → Push subscriptions есть запись
- [ ] `/notifications` — страница работает
