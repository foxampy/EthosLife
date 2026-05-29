// frontend/src/pages/Planner/widgets/DayViewWidget.tsx
import React, { useMemo } from 'react'
import { format, parseISO, isSameDay } from 'date-fns'
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
      const h = 9
      if (!map[h]) map[h] = []
      map[h].push(t)
    })
    return map
  }, [tasks, date])

  return (
    <div style={{ background: 'rgba(10,10,14,0.94)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(210,175,80,0.9)' }}>
          {format(date, 'd MMMM, EEEE', { locale: ru })}
        </span>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 520 }}>
        {HOURS.map((h) => {
          const isNow = Math.floor(currentHour) === h && isSameDay(date, now)
          const items = [...(remindersByHour[h] ?? []), ...(tasksByHour[h] ?? [])]
          return (
            <div key={h} style={{
              display: 'flex', minHeight: 48, borderBottom: '1px solid rgba(255,255,255,0.04)',
              position: 'relative', background: isNow ? 'rgba(210,175,80,0.04)' : 'transparent',
            }}>
              <div style={{ width: 44, padding: '8px 6px 8px 14px', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: isNow ? 'rgba(210,175,80,0.7)' : 'rgba(255,255,255,0.2)' }}>
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>
              {isNow && (
                <div style={{
                  position: 'absolute', top: `${((currentHour % 1) * 48)}px`,
                  left: 44, right: 0, height: 1, background: 'rgba(210,175,80,0.5)',
                }}>
                  <div style={{ position: 'absolute', left: -4, top: -3, width: 7, height: 7, borderRadius: '50%', background: 'rgba(210,175,80,0.8)' }} />
                </div>
              )}
              <div style={{ flex: 1, padding: '4px 10px 4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map((item, i) => {
                  const isTask = 'status' in item
                  const cat = item.category as keyof typeof CATEGORY_COLORS
                  const color = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.custom
                  return (
                    <div key={i} style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 12,
                      background: color.replace(/[\d.]+\)$/, '0.12)'),
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
