// frontend/src/pages/Planner/ReminderEditor.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
