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
