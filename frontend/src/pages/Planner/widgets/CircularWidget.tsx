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
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={24} />
        {Array.from({ length: 24 }, (_, h) => {
          const a = hourToAngle(h)
          const inner = polarToXY(a, R - 14)
          const outer = polarToXY(a, R - 6)
          return (
            <line key={h} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.12)" strokeWidth={h % 6 === 0 ? 2 : 1} />
          )
        })}
        {[0, 6, 12, 18].map((h) => {
          const pos = polarToXY(hourToAngle(h), R - 28)
          return (
            <text key={h} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.3)" fontSize={10}>{String(h).padStart(2, '0')}</text>
          )
        })}
        {todayReminders.map((r) => {
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
        <circle cx={cx} cy={cy} r={4} fill="rgba(210,175,80,0.8)" />
        <text x={cx} y={cy + 30} textAnchor="middle" fill="rgba(232,226,215,0.5)" fontSize={11}>
          {now.getHours().toString().padStart(2,'0')}:{now.getMinutes().toString().padStart(2,'0')}
        </text>
      </svg>
    </div>
  )
}
