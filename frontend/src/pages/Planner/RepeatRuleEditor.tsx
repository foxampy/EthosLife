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
