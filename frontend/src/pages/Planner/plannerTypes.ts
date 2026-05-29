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
