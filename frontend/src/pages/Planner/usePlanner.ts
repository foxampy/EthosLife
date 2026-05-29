// frontend/src/pages/Planner/usePlanner.ts
import { useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { usePlannerStore } from './plannerStore'
import type { Reminder, PlannerTask, PlannerNotification, RepeatRule } from './plannerTypes'
import { addDays, addMinutes, setHours, setMinutes } from 'date-fns'

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
