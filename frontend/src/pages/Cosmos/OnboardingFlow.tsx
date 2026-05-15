import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type QuestionType = 'text' | 'multi' | 'textarea'

interface Question {
  index: number
  text: string
  subtitle?: string
  placeholder: string
  chips: string[]
  type: QuestionType
}

const QUESTIONS: Question[] = [
  {
    index: 0,
    text: 'Выбери или напиши цитату, которая тебя вдохновляет',
    placeholder: '«Быть или не быть» — Гамлет, или своё...',
    chips: [
      '«Стать тем, кем ты мог бы быть» — Маслоу',
      '«Будь собой» — Оскар Уайльд',
      '«Дорогу осилит идущий»',
    ],
    type: 'text',
  },
  {
    index: 1,
    text: 'С каким персонажем из какой вселенной ты себя ассоциируешь?',
    placeholder: 'Шерлок Холмс, Тони Старк, Гермиона...',
    chips: [
      'Шерлок Холмс',
      'Тони Старк',
      'Гермиона Грейнджер',
      'Брюс Уэйн',
      'Уолтер Уайт',
      'Дейенерис',
    ],
    type: 'text',
  },
  {
    index: 2,
    text: 'От чего ты хочешь отказаться?',
    subtitle: 'Привычки, зависимости, паттерны поведения',
    placeholder: 'Напиши или выбери...',
    chips: [
      'Соцсети',
      'Алкоголь',
      'Прокрастинация',
      'Сахар',
      'Негативные мысли',
      'Курение',
      'Переедание',
    ],
    type: 'multi',
  },
  {
    index: 3,
    text: 'Чего ты хочешь добиться?',
    subtitle: 'Твоя главная цель — смелее!',
    placeholder: 'Финансовая свобода, здоровье, своё дело...',
    chips: [
      'Финансовая свобода',
      'Крепкое здоровье',
      'Своё дело',
      'Любимая работа',
      'Счастливые отношения',
    ],
    type: 'text',
  },
  {
    index: 4,
    text: 'Расскажи о своей работе и типичном дне',
    placeholder:
      'Чем занимаешься? Как проходит обычный день с утра до вечера?',
    chips: [],
    type: 'textarea',
  },
  {
    index: 5,
    text: 'Кто рядом с тобой? Как ты чувствуешь себя среди людей?',
    subtitle: 'Расскажи о близких, друзьях, коллегах — своём окружении',
    placeholder:
      'Опиши свой круг общения, как ты себя ощущаешь в компании людей...',
    chips: [],
    type: 'textarea',
  },
]

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const BUBBLE_BG = 'rgba(8, 8, 20, 0.88)'
const BUBBLE_BORDER = '1px solid rgba(100, 140, 255, 0.25)'
const BUBBLE_SHADOW =
  '0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(80,100,255,0.08)'

const INPUT_BG = 'rgba(255,255,255,0.04)'
const INPUT_BORDER_IDLE = '1px solid rgba(100,140,255,0.2)'
const INPUT_BORDER_FOCUS = '1px solid rgba(100,140,255,0.5)'
const INPUT_SHADOW_FOCUS = '0 0 0 3px rgba(80,100,255,0.12)'

const CHIP_BG_IDLE = 'rgba(30,35,60,0.8)'
const CHIP_BORDER_IDLE = '1px solid rgba(100,140,255,0.4)'
const CHIP_TEXT_IDLE = 'rgba(160,180,220,0.8)'

const CHIP_BG_SELECTED = 'rgba(80,100,255,0.3)'
const CHIP_BORDER_SELECTED = '1px solid rgba(120,160,255,0.7)'
const CHIP_SHADOW_SELECTED = '0 0 8px rgba(80,100,255,0.35)'

const BTN_BG =
  'linear-gradient(135deg, rgba(80,100,255,0.9), rgba(120,80,255,0.9))'
const BTN_SHADOW = '0 4px 20px rgba(80,100,255,0.4)'

// ---------------------------------------------------------------------------
// Dot loader (analyzing state)
// ---------------------------------------------------------------------------

const AnalyzingDots: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '12px 24px',
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(120,160,255,0.8)',
        }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.18,
          ease: 'easeInOut',
        }}
      />
    ))}
    <span
      style={{
        marginLeft: 8,
        color: 'rgba(120,160,255,0.8)',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      Анализирую...
    </span>
  </div>
)

// ---------------------------------------------------------------------------
// Chip component
// ---------------------------------------------------------------------------

interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

const Chip: React.FC<ChipProps> = ({ label, selected, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.96 }}
    animate={{ scale: selected ? 1.05 : 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    style={{
      cursor: 'pointer',
      padding: '6px 12px',
      borderRadius: 9999,
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.4,
      background: selected ? CHIP_BG_SELECTED : CHIP_BG_IDLE,
      border: selected ? CHIP_BORDER_SELECTED : CHIP_BORDER_IDLE,
      color: selected ? '#fff' : CHIP_TEXT_IDLE,
      boxShadow: selected ? CHIP_SHADOW_SELECTED : 'none',
      outline: 'none',
      transition: 'background 0.15s, border 0.15s, color 0.15s, box-shadow 0.15s',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </motion.button>
)

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface OnboardingFlowProps {
  currentQuestion: number
  isAnalyzing: boolean
  onAnswer: (answer: string, chips?: string[]) => void
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  currentQuestion,
  isAnalyzing,
  onAnswer,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [inputFocused, setInputFocused] = useState(false)
  const [bubbleBottom, setBubbleBottom] = useState(120)

  // Reset local state whenever the question changes
  useEffect(() => {
    setInputValue('')
    setSelectedChips([])
    setInputFocused(false)
  }, [currentQuestion])

  // Mobile keyboard handling via visualViewport
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport
        setBubbleBottom(window.innerHeight - viewport.height + 16)
      }
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  const question = QUESTIONS[currentQuestion]
  if (!question) return null

  // Chip click handler
  const handleChipClick = (chip: string) => {
    if (question.type === 'multi') {
      setSelectedChips((prev) =>
        prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
      )
    } else {
      // text / textarea: single select, also populate input
      const alreadySelected = selectedChips.includes(chip)
      setSelectedChips(alreadySelected ? [] : [chip])
      setInputValue(alreadySelected ? '' : chip)
    }
  }

  // Submit handler
  const handleSubmit = useCallback(() => {
    const finalAnswer = inputValue.trim() || selectedChips.join(', ')
    if (!finalAnswer) return
    onAnswer(finalAnswer, selectedChips)
    setInputValue('')
    setSelectedChips([])
  }, [inputValue, selectedChips, onAnswer])

  // Keyboard shortcut: Ctrl/Cmd+Enter submits
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (question.type !== 'textarea' && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isSubmitDisabled =
    !isAnalyzing && !inputValue.trim() && selectedChips.length === 0

  const questionLabel = `${String(question.index + 1).padStart(2, '0')} / ${String(QUESTIONS.length).padStart(2, '0')}`

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: bubbleBottom,
        paddingLeft: 16,
        paddingRight: 16,
        zIndex: 10,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          variants={{
            enter: {
              y: 120,
              opacity: 0,
              scale: 0.92,
            },
            visible: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', damping: 22, stiffness: 180 },
            },
            exit: {
              y: 80,
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.35, ease: 'easeIn' },
            },
          }}
          initial="enter"
          animate="visible"
          exit="exit"
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 'min(480px, calc(100vw - 32px))',
            background: BUBBLE_BG,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: BUBBLE_BORDER,
            borderRadius: 24,
            padding: 24,
            boxShadow: BUBBLE_SHADOW,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Question number indicator */}
          <div
            style={{
              color: 'rgba(100,140,255,0.6)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {questionLabel}
          </div>

          {/* Question text */}
          <div
            style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {question.text}
          </div>

          {/* Subtitle (optional) */}
          {question.subtitle && (
            <div
              style={{
                color: 'rgba(160,180,220,0.7)',
                fontSize: 13,
                lineHeight: 1.4,
                marginTop: -6,
              }}
            >
              {question.subtitle}
            </div>
          )}

          {/* Chips */}
          {question.chips.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {question.chips.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  selected={selectedChips.includes(chip)}
                  onClick={() => handleChipClick(chip)}
                />
              ))}
            </div>
          )}

          {/* Input / Textarea */}
          {question.type === 'textarea' ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={question.placeholder}
              rows={3}
              style={{
                background: INPUT_BG,
                border: inputFocused ? INPUT_BORDER_FOCUS : INPUT_BORDER_IDLE,
                borderRadius: 14,
                color: 'rgba(220,230,255,0.9)',
                fontSize: 15,
                padding: '12px 16px',
                resize: 'none',
                outline: 'none',
                boxShadow: inputFocused ? INPUT_SHADOW_FOCUS : 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                transition: 'border 0.15s, box-shadow 0.15s',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={question.placeholder}
              style={{
                background: INPUT_BG,
                border: inputFocused ? INPUT_BORDER_FOCUS : INPUT_BORDER_IDLE,
                borderRadius: 14,
                color: 'rgba(220,230,255,0.9)',
                fontSize: 15,
                padding: '12px 16px',
                outline: 'none',
                boxShadow: inputFocused ? INPUT_SHADOW_FOCUS : 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                transition: 'border 0.15s, box-shadow 0.15s',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          )}

          {/* Submit / Analyzing */}
          {isAnalyzing ? (
            <AnalyzingDots />
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              whileTap={isSubmitDisabled ? {} : { scale: 0.97 }}
              whileHover={isSubmitDisabled ? {} : { scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                background: isSubmitDisabled
                  ? 'rgba(60,70,120,0.5)'
                  : BTN_BG,
                borderRadius: 14,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: 15,
                color: isSubmitDisabled ? 'rgba(160,180,220,0.4)' : '#ffffff',
                boxShadow: isSubmitDisabled ? 'none' : BTN_SHADOW,
                border: 'none',
                cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                width: '100%',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
              }}
            >
              Продолжить
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default OnboardingFlow
