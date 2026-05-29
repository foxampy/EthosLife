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

function isSameDayLocal(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

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
        const showDate = idx === 0 || !isSameDayLocal(item.datetime, items[idx - 1].datetime)
        return (
          <React.Fragment key={item.id}>
            {showDate && (
              <div style={{ padding: '10px 16px 4px', fontSize: 11, color: 'rgba(210,175,80,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {item.isToday ? 'Сегодня' : item.isTomorrow ? 'Завтра' : format(item.datetime, 'd MMMM', { locale: ru })}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {idx < items.length - 1 && (
                  <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', marginTop: 2 }} />
                )}
              </div>
              <div style={{ width: 40, flexShrink: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                {format(item.datetime, 'HH:mm')}
              </div>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
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
