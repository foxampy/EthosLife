import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayPlanItem {
  day: number
  action: string
  category: 'habit' | 'goal' | 'social' | 'health'
  completed?: boolean
  isToday?: boolean
}

interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface BottomPanelProps {
  dayPlan: DayPlanItem[]
  aiMessages: AiMessage[]
  isVisible: boolean
  onSendMessage: (text: string) => void
  onCompleteItem: (day: number) => void
  isAiThinking: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<DayPlanItem['category'], string> = {
  habit:  'rgba(255,200,80,0.8)',
  goal:   'rgba(180,100,255,0.8)',
  social: 'rgba(80,200,255,0.8)',
  health: 'rgba(80,255,140,0.8)',
}

// ─── Thinking dots ────────────────────────────────────────────────────────────

const ThinkingDots: React.FC = () => (
  <div className="flex items-center gap-1.5 px-1 py-0.5">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{ fontSize: 8, color: 'rgba(100,140,255,0.8)', display: 'block' }}
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut',
        }}
      >
        ⬤
      </motion.span>
    ))}
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

export const BottomPanel: React.FC<BottomPanelProps> = ({
  dayPlan,
  aiMessages,
  isVisible,
  onSendMessage,
  onCompleteItem,
  isAiThinking,
}) => {
  const [isExpanded, setIsExpanded]             = useState(false)
  const [inputText, setInputText]               = useState('')
  const [optimisticDone, setOptimisticDone]     = useState<Set<number>>(new Set())
  const [keyboardOffset, setKeyboardOffset]     = useState(0)

  const messagesEndRef  = useRef<HTMLDivElement>(null)
  const inputRef        = useRef<HTMLInputElement>(null)
  const planRowRef      = useRef<HTMLDivElement>(null)

  // ── Today's item index ─────────────────────────────────────────────────────

  const todayIdx = dayPlan.findIndex((i) => i.isToday)
  const todayItem = todayIdx >= 0 ? dayPlan[todayIdx] : dayPlan[dayPlan.length - 1]

  // visible slice: today ± 2
  const visiblePlan = (() => {
    if (!dayPlan.length) return []
    const center = todayIdx >= 0 ? todayIdx : 0
    const start  = Math.max(0, center - 2)
    const end    = Math.min(dayPlan.length, center + 3)
    return dayPlan.slice(start, end)
  })()

  // ── Auto-scroll messages ───────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages.length, isAiThinking])

  // ── Scroll plan row to today ───────────────────────────────────────────────

  useEffect(() => {
    if (isVisible && planRowRef.current) {
      const todayEl = planRowRef.current.querySelector('[data-today="true"]') as HTMLElement | null
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [isVisible])

  // ── Visual viewport / keyboard handling ────────────────────────────────────

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const handler = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop
      setKeyboardOffset(Math.max(0, offset))
    }

    vv.addEventListener('resize', handler)
    vv.addEventListener('scroll', handler)
    return () => {
      vv.removeEventListener('resize', handler)
      vv.removeEventListener('scroll', handler)
    }
  }, [])

  // ── Expanded height ────────────────────────────────────────────────────────

  const expandedHeight =
    typeof window !== 'undefined'
      ? window.innerWidth < 768
        ? Math.min(window.innerHeight * 0.5, 360)
        : window.innerHeight * 0.4
      : 360

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text) return
    onSendMessage(text)
    setInputText('')
  }, [inputText, onSendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleItemClick = useCallback(
    (item: DayPlanItem) => {
      setOptimisticDone((prev) => {
        const next = new Set(prev)
        if (next.has(item.day)) next.delete(item.day)
        else next.add(item.day)
        return next
      })
      onCompleteItem(item.day)
    },
    [onCompleteItem],
  )

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  const handleCollapse = useCallback(() => {
    setIsExpanded(false)
    inputRef.current?.blur()
  }, [])

  // ── Item helpers ───────────────────────────────────────────────────────────

  const isItemDone = (item: DayPlanItem) =>
    optimisticDone.has(item.day) ? !item.completed : !!item.completed

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="bottom-panel"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 200, delay: 0.3 }}
          style={{
            position: 'absolute',
            bottom: keyboardOffset,
            left: 0,
            right: 0,
            background: 'rgba(6,6,16,0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(80,100,255,0.18)',
            zIndex: 50,
          }}
        >
          {/* ── Section 1: Day Plan Row ─────────────────────────────────── */}
          <div
            style={{
              height: 52,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 16px',
              gap: 4,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: 'rgba(100,140,255,0.5)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  lineHeight: 1,
                }}
              >
                СЕГОДНЯ
              </span>
              {todayItem && (
                <span
                  style={{
                    color: 'rgba(100,140,255,0.5)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    lineHeight: 1,
                  }}
                >
                  День {todayItem.day}
                </span>
              )}
            </div>

            {/* Scrollable pills */}
            {dayPlan.length === 0 ? (
              <span style={{ color: 'rgba(120,140,200,0.4)', fontSize: 12 }}>
                Онбординг завершается — план строится...
              </span>
            ) : (
              <div
                ref={planRowRef}
                style={{
                  display: 'flex',
                  gap: 8,
                  overflowX: 'auto',
                  flexShrink: 0,
                  // hide scrollbar cross-browser
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                className="no-scrollbar"
              >
                {visiblePlan.map((item) => {
                  const done     = isItemDone(item)
                  const isToday  = item.isToday || item.day === todayItem?.day
                  const dotColor = CATEGORY_COLORS[item.category]

                  return (
                    <button
                      key={item.day}
                      data-today={isToday ? 'true' : undefined}
                      onClick={() => handleItemClick(item)}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: done
                          ? 'rgba(80,255,140,0.12)'
                          : 'rgba(255,255,255,0.04)',
                        border: done
                          ? '1px solid rgba(80,255,140,0.35)'
                          : '1px solid rgba(100,140,255,0.2)',
                        borderRadius: 20,
                        padding: '6px 14px',
                        fontSize: 13,
                        color: done
                          ? 'rgba(80,255,140,0.9)'
                          : 'rgba(200,220,255,0.8)',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        outline: isToday ? '1px solid rgba(100,140,255,0.35)' : 'none',
                        outlineOffset: 1,
                        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                      }}
                    >
                      {/* Category dot */}
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: dotColor,
                          flexShrink: 0,
                          display: 'inline-block',
                        }}
                      />
                      {item.action}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Section 2: AI Chat ──────────────────────────────────────── */}
          <motion.div
            animate={{ height: isExpanded ? expandedHeight : 52 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(80,100,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Expanded: messages area */}
            {isExpanded && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '12px 16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                className="no-scrollbar"
              >
                {aiMessages.length === 0 && !isAiThinking && (
                  <p
                    style={{
                      color: 'rgba(120,140,200,0.4)',
                      fontSize: 13,
                      textAlign: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    Задай вопрос своему AI-наставнику
                  </p>
                )}

                {aiMessages.map((msg) => {
                  const isAssistant = msg.role === 'assistant'
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAssistant ? 'flex-start' : 'flex-end',
                        gap: 3,
                      }}
                    >
                      {isAssistant && (
                        <span
                          style={{
                            color: 'rgba(120,160,255,0.7)',
                            fontSize: 11,
                            paddingLeft: 2,
                          }}
                        >
                          ✦ AI
                        </span>
                      )}
                      <div
                        style={{
                          maxWidth: '80%',
                          background: isAssistant
                            ? 'rgba(20,25,50,0.9)'
                            : 'rgba(60,80,200,0.35)',
                          border: isAssistant
                            ? '1px solid rgba(100,140,255,0.2)'
                            : '1px solid rgba(100,140,255,0.3)',
                          borderRadius: 16,
                          padding: '10px 14px',
                          fontSize: 14,
                          lineHeight: 1.5,
                          color: 'rgba(220,230,255,0.92)',
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )
                })}

                {/* Thinking indicator */}
                {isAiThinking && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(120,160,255,0.7)',
                        fontSize: 11,
                        paddingLeft: 2,
                      }}
                    >
                      ✦ AI
                    </span>
                    <div
                      style={{
                        background: 'rgba(20,25,50,0.9)',
                        border: '1px solid rgba(100,140,255,0.2)',
                        borderRadius: 16,
                        padding: '10px 14px',
                      }}
                    >
                      <ThinkingDots />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input row (always visible within section 2) */}
            <div
              style={{
                height: 52,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 16px',
                cursor: isExpanded ? 'default' : 'pointer',
              }}
              onClick={!isExpanded ? handleExpand : undefined}
            >
              {/* Sparkle icon */}
              <span
                style={{
                  color: 'rgba(100,140,255,0.6)',
                  fontSize: 16,
                  flexShrink: 0,
                  userSelect: 'none',
                }}
              >
                ✦
              </span>

              {/* Input field */}
              {isExpanded ? (
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Спроси своего AI..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(100,140,255,0.2)',
                    borderRadius: 14,
                    color: 'rgba(220,230,255,0.9)',
                    fontSize: 15,
                    padding: '10px 14px',
                    outline: 'none',
                    caretColor: 'rgba(100,140,255,0.9)',
                  }}
                />
              ) : (
                <span
                  style={{
                    flex: 1,
                    color: 'rgba(120,140,180,0.5)',
                    fontSize: 15,
                    userSelect: 'none',
                  }}
                >
                  Спроси своего AI...
                </span>
              )}

              {/* Send button (expanded) / Expand icon (collapsed) */}
              {isExpanded ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Send */}
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    style={{
                      width: 40,
                      height: 40,
                      background: inputText.trim()
                        ? 'rgba(80,100,255,0.8)'
                        : 'rgba(80,100,255,0.25)',
                      border: 'none',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputText.trim() ? 'pointer' : 'default',
                      flexShrink: 0,
                      transition: 'background 0.2s',
                      outline: 'none',
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 9H15M15 9L10 4M15 9L10 14"
                        stroke="rgba(220,230,255,0.95)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Collapse */}
                  <button
                    onClick={handleCollapse}
                    style={{
                      width: 32,
                      height: 32,
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(100,140,255,0.5)',
                      fontSize: 18,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      outline: 'none',
                      padding: 0,
                    }}
                    aria-label="Свернуть"
                  >
                    ↓
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    color: 'rgba(100,140,255,0.5)',
                    fontSize: 18,
                    userSelect: 'none',
                    flexShrink: 0,
                  }}
                >
                  ↑
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BottomPanel
