// frontend/src/pages/Planner/PlannerPage.tsx
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Sparkles, Bell } from 'lucide-react'
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
  const [aiPreview, setAiPreview] = useState<Array<{
    title: string
    description: string | null
    category: string
    priority: number
    due_date: string | null
    status: 'active'
    reminder_id: null
    linked_goal_id: null
    sort_order: number
  }>>([])

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

      {/* Active tasks list (shown in day view) */}
      {store.activeWidget === 'day' && (
        <div style={{ padding: '0 12px' }}>
          <div style={{ fontSize: 12, color: 'rgba(210,175,80,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Задачи</div>
          {planner.tasks.filter((t) => t.status === 'active').slice(0, 10).map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 6, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => planner.markTaskDone(t.id)}
                style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(210,175,80,0.4)', background: 'none', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: 14, flex: 1 }}>{t.title}</span>
              {t.due_date && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{t.due_date.slice(5)}</span>}
            </div>
          ))}
        </div>
      )}

      {/* AI plan preview */}
      <AnimatePresence>
        {aiPreview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ margin: '16px 12px', background: 'rgba(210,175,80,0.06)', border: '1px solid rgba(210,175,80,0.2)', borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(210,175,80,0.9)', marginBottom: 12 }}>✦ ИИ-план готов</div>
            {aiPreview.map((t, i) => (
              <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13, color: 'rgba(232,226,215,0.8)' }}>
                {t.title} {t.due_date && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>— {t.due_date.slice(5)}</span>}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleAcceptAiPlan} style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)', fontWeight: 700, cursor: 'pointer'
              }}>
                Принять план
              </button>
              <button onClick={() => setAiPreview([])} style={{
                padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                background: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer'
              }}>
                Отклонить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editors (bottom sheets) */}
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
        <button
          onClick={handleGenerateAiPlan}
          disabled={aiPlanLoading}
          title="ИИ-план"
          style={{
            width: 48, height: 48, borderRadius: 24, border: '1px solid rgba(210,175,80,0.3)',
            background: 'rgba(10,10,14,0.95)', color: 'rgba(210,175,80,0.8)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <Sparkles size={18} />
        </button>
        <button
          onClick={() => store.openTaskEditor()}
          title="Новая задача"
          style={{
            width: 48, height: 48, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(10,10,14,0.95)', color: 'rgba(232,226,215,0.7)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
          }}>
          T+
        </button>
        <button
          onClick={() => store.openReminderEditor()}
          title="Новое напоминание"
          style={{
            width: 56, height: 56, borderRadius: 28, border: 'none',
            background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(210,175,80,0.3)',
          }}>
          <Plus size={24} />
        </button>
      </div>
    </div>
  )
}
