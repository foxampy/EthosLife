import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MagicMomentProps {
  personalityInsight: string
  onStepChange: (step: number) => void
  onComplete: () => void
}

export const MagicMoment: React.FC<MagicMomentProps> = ({
  personalityInsight,
  onStepChange,
  onComplete,
}) => {
  const [flashAlpha, setFlashAlpha] = useState(0)
  const [showInsight, setShowInsight] = useState(false)
  const startTime = useRef(Date.now())
  const rafId = useRef<number>()

  useEffect(() => {
    onStepChange(0)

    const t1 = setTimeout(() => onStepChange(2), 800)
    const t2 = setTimeout(() => onStepChange(3), 1200)
    const t3 = setTimeout(() => onStepChange(4), 2400)
    const t4 = setTimeout(() => { onStepChange(5); setShowInsight(true) }, 3200)
    const t5 = setTimeout(onComplete, 4000)

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const tick = (now: number) => {
      const elapsed = now - startTime.current

      if (elapsed >= 800 && elapsed < 1000) {
        setFlashAlpha((elapsed - 800) / 200)
      } else if (elapsed >= 1000 && elapsed < 1200) {
        setFlashAlpha(1 - (elapsed - 1000) / 200)
      } else if (elapsed >= 1200) {
        setFlashAlpha(0)
        return
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [])

  return (
    <>
      {flashAlpha > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(255, 255, 255, ${flashAlpha})`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      <AnimatePresence>
        {showInsight && personalityInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(420px, calc(100vw - 48px))',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <div style={{
              fontSize: '14px',
              lineHeight: '1.7',
              color: 'rgba(232, 226, 215, 0.82)',
              letterSpacing: '0.02em',
              fontStyle: 'italic',
              padding: '18px 22px',
              background: 'rgba(10, 10, 14, 0.88)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}>
              {personalityInsight}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MagicMoment
