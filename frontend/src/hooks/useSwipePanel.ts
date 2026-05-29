// frontend/src/hooks/useSwipePanel.ts
import { useEffect, useRef, useCallback } from 'react'

interface Options {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
  threshold?: number   // px from right edge to trigger detection zone
  minSwipe?: number    // minimum swipe distance in px
}

export function useSwipePanel({ onOpen, onClose, isOpen, threshold = 40, minSwipe = 60 }: Options) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0]
    startX.current = t.clientX
    startY.current = t.clientY
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (startX.current === null || startY.current === null) return
    const t = e.changedTouches[0]
    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current

    // Ignore if mostly vertical
    if (Math.abs(dy) > Math.abs(dx)) {
      startX.current = null
      return
    }

    if (!isOpen && dx < -minSwipe && startX.current > window.innerWidth - threshold) {
      onOpen()
    }
    if (isOpen && dx > minSwipe) {
      onClose()
    }

    startX.current = null
    startY.current = null
  }, [isOpen, onOpen, onClose, threshold, minSwipe])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])
}
