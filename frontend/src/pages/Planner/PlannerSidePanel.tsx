// frontend/src/pages/Planner/PlannerSidePanel.tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlannerStore } from './plannerStore'
import { TimelineWidget } from './widgets/TimelineWidget'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function PlannerSidePanel({ isOpen, onClose }: Props) {
  const { reminders, tasks } = usePlannerStore()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 41,
              width: Math.min(340, window.innerWidth * 0.88),
              background: 'rgba(10,10,14,0.97)', borderLeft: '1px solid rgba(255,255,255,0.09)',
              display: 'flex', flexDirection: 'column',
            }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 12px' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(232,226,215,0.9)' }}>📋 Планировщик</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Widget */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
              <TimelineWidget reminders={reminders} tasks={tasks} />
            </div>

            {/* Open full planner */}
            <div style={{ padding: '12px 16px 32px' }}>
              <button onClick={() => { navigate('/planner'); onClose() }} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: 'rgba(210,175,80,0.88)', color: 'rgba(20,16,10,0.95)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Calendar size={16} /> Открыть планировщик
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
