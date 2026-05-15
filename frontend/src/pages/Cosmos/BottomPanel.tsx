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

// ─── Premium graphite palette ─────────────────────────────────────────────────

// No blue anywhere. Warm amber / silver / sage / pearl accents only.
const CAT_COLOR: Record<DayPlanItem['category'], string> = {
  habit:  'rgba(210,175,80,0.9)',    // warm amber
  goal:   'rgba(225,220,205,0.85)',  // warm pearl
  social: 'rgba(175,190,200,0.85)',  // cool silver
  health: 'rgba(145,190,155,0.85)',  // muted sage
}
const CAT_LABEL: Record<DayPlanItem['category'], string> = {
  habit:  'привычка',
  goal:   'цель',
  social: 'связи',
  health: 'здоровье',
}
const CAT_BG: Record<DayPlanItem['category'], string> = {
  habit:  'rgba(210,175,80,0.1)',
  goal:   'rgba(225,220,205,0.07)',
  social: 'rgba(175,190,200,0.08)',
  health: 'rgba(145,190,155,0.08)',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Russian short weekday names
const RU_WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const RU_MONTHS   = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']

function addDays(base: Date, n: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  return d
}

function fmtShortDate(d: Date): string {
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}`
}

// ─── Thinking dots ────────────────────────────────────────────────────────────

const ThinkingDots: React.FC = () => (
  <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(200,195,185,0.5)', display: 'block' }}
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
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
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [chatOpen,     setChatOpen]     = useState(false)
  const [inputText,    setInputText]    = useState('')
  const [doneDays,     setDoneDays]     = useState<Set<number>>(new Set())
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // Base date = today (day 1 of plan)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Today item = day 1 (or first uncompleted)
  const todayItem = dayPlan[0] ?? null
  const isItemDone = (item: DayPlanItem) =>
    doneDays.has(item.day) ? !item.completed : !!item.completed

  // Next 14 days slice for calendar
  const calendarSlice = dayPlan.slice(0, 14)

  // ── Keyboard handling ──────────────────────────────────────────────────────
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const handler = () => setKeyboardOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    vv.addEventListener('resize', handler)
    vv.addEventListener('scroll', handler)
    return () => { vv.removeEventListener('resize', handler); vv.removeEventListener('scroll', handler) }
  }, [])

  // ── Auto-scroll messages ───────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages.length, isAiThinking])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text) return
    onSendMessage(text)
    setInputText('')
  }, [inputText, onSendMessage])

  const handleItemToggle = useCallback((item: DayPlanItem) => {
    setDoneDays((prev) => {
      const next = new Set(prev)
      next.has(item.day) ? next.delete(item.day) : next.add(item.day)
      return next
    })
    onCompleteItem(item.day)
  }, [onCompleteItem])

  const expandedChatHeight =
    typeof window !== 'undefined'
      ? window.innerWidth < 768 ? Math.min(window.innerHeight * 0.52, 380) : 340
      : 340

  // ── Panel background ───────────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    background: 'rgba(9,9,14,0.92)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  }

  const dividerStyle: React.CSSProperties = {
    borderTop: '1px solid rgba(255,255,255,0.055)',
  }

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
          style={{ position: 'absolute', bottom: keyboardOffset, left: 0, right: 0, zIndex: 30, ...panelStyle }}
        >

          {/* ── Section 1: Today's plan ──────────────────────────────────── */}
          <div style={{ padding: '10px 16px 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(160,155,145,0.55)', textTransform: 'uppercase' }}>
                  план
                </span>
                <span style={{ fontSize: 10, color: 'rgba(130,125,118,0.45)', letterSpacing: '0.05em' }}>
                  {fmtShortDate(today)}
                </span>
              </div>
              {dayPlan.length > 0 && (
                <button
                  onClick={() => setCalendarOpen((v) => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 11, color: 'rgba(155,150,140,0.55)',
                    display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0',
                    letterSpacing: '0.04em',
                  }}
                >
                  {calendarOpen ? 'свернуть' : '14 дней ↑'}
                </button>
              )}
            </div>

            {/* Today's card */}
            {todayItem ? (
              <button
                onClick={() => handleItemToggle(todayItem)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: isItemDone(todayItem) ? 'rgba(145,190,155,0.07)' : CAT_BG[todayItem.category],
                  border: `1px solid ${isItemDone(todayItem) ? 'rgba(145,190,155,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginBottom: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${isItemDone(todayItem) ? 'rgba(145,190,155,0.7)' : 'rgba(200,195,185,0.25)'}`,
                  background: isItemDone(todayItem) ? 'rgba(145,190,155,0.25)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isItemDone(todayItem) && <span style={{ fontSize: 10, color: 'rgba(145,190,155,0.9)' }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, color: isItemDone(todayItem) ? 'rgba(155,150,140,0.5)' : 'rgba(232,226,215,0.92)',
                    lineHeight: 1.35, textDecoration: isItemDone(todayItem) ? 'line-through' : 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {todayItem.action}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, color: CAT_COLOR[todayItem.category], flexShrink: 0,
                  background: CAT_BG[todayItem.category], borderRadius: 6, padding: '2px 7px',
                }}>
                  {CAT_LABEL[todayItem.category]}
                </span>
              </button>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(130,125,115,0.45)', marginBottom: 10, textAlign: 'center' }}>
                Завершите онбординг — план формируется...
              </p>
            )}
          </div>

          {/* ── Section 1b: Calendar (animated) ─────────────────────────── */}
          <AnimatePresence>
            {calendarOpen && calendarSlice.length > 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 32, stiffness: 280 }}
                style={{ overflow: 'hidden', ...dividerStyle }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 4,
                    padding: '10px 12px 12px',
                    overflowX: 'auto',
                  }}
                >
                  {calendarSlice.map((item, idx) => {
                    const date = addDays(today, idx)
                    const isToday = idx === 0
                    const done = isItemDone(item)
                    return (
                      <button
                        key={item.day}
                        onClick={() => handleItemToggle(item)}
                        title={item.action}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: 3, padding: '7px 2px 8px',
                          background: isToday
                            ? 'rgba(210,175,80,0.1)'
                            : done ? 'rgba(145,190,155,0.06)' : 'rgba(255,255,255,0.025)',
                          border: isToday
                            ? '1px solid rgba(210,175,80,0.28)'
                            : '1px solid rgba(255,255,255,0.045)',
                          borderRadius: 10, cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: 9, color: 'rgba(140,135,125,0.5)', letterSpacing: '0.03em' }}>
                          {RU_WEEKDAYS[date.getDay()]}
                        </span>
                        <span style={{
                          fontSize: 13, fontWeight: isToday ? 600 : 400,
                          color: isToday ? 'rgba(210,175,80,0.9)' : done ? 'rgba(145,190,155,0.6)' : 'rgba(215,208,196,0.75)',
                        }}>
                          {date.getDate()}
                        </span>
                        {/* Category dot */}
                        <span style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: done ? 'rgba(145,190,155,0.6)' : CAT_COLOR[item.category],
                          display: 'block',
                          opacity: done ? 0.5 : 0.85,
                        }} />
                      </button>
                    )
                  })}
                </div>
                {/* Selected day task preview */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Section 2: AI Chat ──────────────────────────────────────── */}
          <div style={dividerStyle}>
            <motion.div
              animate={{ height: chatOpen ? expandedChatHeight : 52 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Messages area */}
              {chatOpen && (
                <div
                  style={{
                    flex: 1, overflowY: 'auto', padding: '12px 16px 6px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    scrollbarWidth: 'none', msOverflowStyle: 'none',
                  }}
                  className="no-scrollbar"
                >
                  {aiMessages.length === 0 && !isAiThinking && (
                    <p style={{ color: 'rgba(130,125,115,0.4)', fontSize: 13, textAlign: 'center', marginTop: 'auto' }}>
                      Задай вопрос своему AI-наставнику
                    </p>
                  )}

                  {aiMessages.map((msg) => {
                    const isAI = msg.role === 'assistant'
                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isAI ? 'flex-start' : 'flex-end', gap: 2 }}>
                        {isAI && (
                          <span style={{ fontSize: 10, color: 'rgba(175,170,160,0.5)', paddingLeft: 2, letterSpacing: '0.06em' }}>
                            ✦ наставник
                          </span>
                        )}
                        <div style={{
                          maxWidth: '82%',
                          background: isAI ? 'rgba(22,20,18,0.95)' : 'rgba(40,38,34,0.9)',
                          border: isAI ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(210,175,80,0.18)',
                          borderRadius: isAI ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                          padding: '10px 14px',
                          fontSize: 14, lineHeight: 1.55,
                          color: 'rgba(228,222,210,0.92)',
                          wordBreak: 'break-word',
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    )
                  })}

                  {isAiThinking && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'rgba(175,170,160,0.5)', paddingLeft: 2, letterSpacing: '0.06em' }}>
                        ✦ наставник
                      </span>
                      <div style={{
                        background: 'rgba(22,20,18,0.95)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '14px 14px 14px 4px',
                        padding: '10px 14px',
                      }}>
                        <ThinkingDots />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input row */}
              <div
                style={{
                  height: 52, flexShrink: 0, display: 'flex', alignItems: 'center',
                  gap: 10, padding: '0 14px',
                  cursor: chatOpen ? 'default' : 'pointer',
                }}
                onClick={!chatOpen ? () => { setChatOpen(true); setTimeout(() => inputRef.current?.focus(), 300) } : undefined}
              >
                <span style={{ fontSize: 15, color: 'rgba(175,170,158,0.45)', flexShrink: 0, userSelect: 'none' }}>✦</span>

                {chatOpen ? (
                  <input
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Спроси наставника..."
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 12,
                      color: 'rgba(228,222,210,0.92)',
                      fontSize: 15, padding: '9px 13px',
                      outline: 'none',
                      caretColor: 'rgba(210,175,80,0.8)',
                    }}
                  />
                ) : (
                  <span style={{ flex: 1, color: 'rgba(140,135,125,0.45)', fontSize: 15, userSelect: 'none' }}>
                    Спроси наставника...
                  </span>
                )}

                {chatOpen ? (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      style={{
                        width: 38, height: 38, borderRadius: 11, border: 'none',
                        background: inputText.trim() ? 'rgba(210,175,80,0.85)' : 'rgba(210,175,80,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: inputText.trim() ? 'pointer' : 'default',
                        transition: 'background 0.2s', flexShrink: 0,
                      }}
                    >
                      <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                        <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="rgba(20,16,10,0.9)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => { setChatOpen(false); inputRef.current?.blur() }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,145,135,0.5)', fontSize: 18, flexShrink: 0, padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      ↓
                    </button>
                  </div>
                ) : (
                  <span style={{ color: 'rgba(150,145,135,0.45)', fontSize: 16, userSelect: 'none', flexShrink: 0 }}>↑</span>
                )}
              </div>
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BottomPanel
