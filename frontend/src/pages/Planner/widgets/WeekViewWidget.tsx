// frontend/src/pages/Planner/widgets/WeekViewWidget.tsx
import React, { useMemo } from 'react'
import { startOfWeek, addDays, format, parseISO, isToday } from 'date-fns'
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
              <div style={{ padding: '6px 6px', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 120 }}>
                {items.slice(0, 4).map((item, i) => {
                  const isTask = 'status' in item
                  const cat = item.category as keyof typeof CATEGORY_COLORS
                  const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.custom
                  return (
                    <div key={i} style={{
                      padding: '3px 6px', borderRadius: 5, fontSize: 11, lineHeight: 1.3,
                      background: color.replace(/[\d.]+\)$/, '0.13)'),
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
