// frontend/src/pages/Planner/TaskEditor.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePlannerStore } from './plannerStore'
import type { PlannerTask, PlannerCategory, TaskPriority } from './plannerTypes'
import { CATEGORY_LABELS } from './plannerTypes'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(232,226,215,0.9)', fontSize: 14, outline: 'none',
}
const labelStyle: React.CSSProperties = {
  fontSize: 11, color: 'rgba(210,175,80,0.65)', textTransform: 'uppercase',
  letterSpacing: 1, marginBottom: 5, display: 'block',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = { 1: 'Низкий', 2: 'Средний', 3: 'Высокий' }
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  1: 'rgba(175,190,200,0.7)',
  2: 'rgba(210,175,80,0.8)',
  3: 'rgba(200,100,80,0.8)',
}

interface Props {
  onSave: (data: Omit<PlannerTask, 'id' | 'user_id' | 'created_at'>) => Promise<void>
}

export function TaskEditor({ onSave }: Props) {
  const { editingTask, closeTaskEditor, tasks } = usePlannerStore()
  const t = editingTask

  const [title, setTitle] = useState(t?.title ?? '')
  const [description, setDescription] = useState(t?.description ?? '')
  const [category, setCategory] = useState<PlannerCategory>((t?.category as PlannerCategory) ?? 'habit')
  const [priority, setPriority] = useState<TaskPriority>(t?.priority ?? 2)
  const [dueDate, setDueDate] = useState(t?.due_date ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      description: description || null,
      category: category || null,
      priority,
      status: 'active',
      due_date: dueDate || null,
      reminder_id: null,
      linked_goal_id: null,
      sort_order: tasks.length,
    })
    setSaving(false)
    closeTaskEditor()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: 'rgba(10,10,14,0.97)', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '20px 20px 0 0', padding: '20px 20px 40px', maxHeight: '80vh', overflowY: 'auto',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(232,226,215,0.9)' }}>
          {t ? 'Редактировать задачу' : 'Новая задача'}
        </span>
        <button onClick={closeTaskEditor} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название задачи" style={inputStyle} />
      </div>

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

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Приоритет</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {([1, 2, 3] as TaskPriority[]).map((p) => (
            <button key={p} onClick={() => setPriority(p)} style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
              background: priority === p ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: priority === p ? PRIORITY_COLORS[p] : 'rgba(232,226,215,0.5)',
              fontWeight: priority === p ? 600 : 400,
            }}>{PRIORITY_LABELS[p]}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Срок выполнения</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Детали задачи..." rows={2}
          style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }} />
      </div>

      <button onClick={handleSave} disabled={saving || !title.trim()} style={{
        width: '100%', padding: '14px', borderRadius: 12, border: 'none',
        background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)',
        fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
      }}>
        {saving ? 'Сохранение...' : 'Сохранить задачу'}
      </button>
    </motion.div>
  )
}
