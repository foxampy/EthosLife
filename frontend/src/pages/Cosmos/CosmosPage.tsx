/**
 * CosmosPage — EthosLife
 *
 * Main orchestrator for the Cosmos experience:
 *   GREETING → ONBOARDING → MAGIC_MOMENT → COSMOS_HOME
 *
 * Fullscreen, no PageLayout wrapper. Fixed-position, touches every edge.
 */

import React, { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Star, Target, Users, EyeOff } from 'lucide-react'

import { useCosmosStore, CLUSTER_GLOW_COLORS } from './cosmosStore'
import { CosmosCanvas } from './CosmosCanvas'
import { OnboardingFlow } from './OnboardingFlow'
import { MagicMoment } from './MagicMoment'
import { BottomPanel } from './BottomPanel'
import { BurgerMenuPanel } from '../../components/ElLayout/BurgerMenuPanel'
import { analyzeAnswer, finalizeOnboarding } from './aiAnalyzer'
import type { OnboardingAnswer, Node, ClusterId } from './types'

// ─── Greeting copy ────────────────────────────────────────────────────────────

const GREETING_LINES: Array<{ text: string; delay: number; style?: 'accent' }> = [
  { text: 'Каждый человек — отдельная вселенная.', delay: 0.5 },
  { text: 'Мы создадим карту твоей.', delay: 1.8 },
  { text: 'ИИ · Квантовые паттерны · Ты.', delay: 3.2, style: 'accent' },
]

// ─── Local question registry (mirrors OnboardingFlow QUESTIONS) ───────────────
// Used only to resolve questionText in handleAnswer. Source of truth for
// display UI remains OnboardingFlow so both stay in sync automatically.

const QUESTIONS = [
  { index: 0, text: 'Выбери или напиши цитату, которая тебя вдохновляет' },
  { index: 1, text: 'С каким персонажем из какой вселенной ты себя ассоциируешь?' },
  { index: 2, text: 'От чего ты хочешь отказаться?' },
  { index: 3, text: 'Чего ты хочешь добиться?' },
  { index: 4, text: 'Расскажи о своей работе и типичном дне' },
  { index: 5, text: 'Кто рядом с тобой? Как ты чувствуешь себя среди людей?' },
] as const

const TOTAL_QUESTIONS = QUESTIONS.length // 6, index 0-5

// ─── Component ────────────────────────────────────────────────────────────────

export const CosmosPage: React.FC = () => {
  const {
    phase,
    currentQuestion,
    answers,
    nodes,
    isAiAnalyzing,
    aiMessages,
    dayPlan,
    personalityInsight,
    setPhase,
    setCurrentQuestion,
    addAnswer,
    addNodes,
    addEdges,
    setIsAiAnalyzing,
    addAiMessage,
    setDayPlan,
    setPersonalityInsight,
    setMagicMomentComplete,
    completeTodayItem,
    setFinalAnalysis,
  } = useCosmosStore()

  const [magicStep, setMagicStep] = useState(0)
  const [showGreeting, setShowGreeting] = useState(phase === 'GREETING')
  const [burgerOpen, setBurgerOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // ── Mount effect: drive GREETING → ONBOARDING transition ──────────────────
  useEffect(() => {
    // Already past greeting (e.g. returning user) — nothing to do
    if (phase !== 'GREETING') {
      setShowGreeting(false)
      return
    }

    // Hide the greeting overlay after the text has fully appeared + pause
    const dismissTimer = setTimeout(() => {
      setShowGreeting(false)
    }, 4200) // start exit fade before the 4800ms phase switch

    // Switch phase after exit animation completes (~4200 + 600ms fade)
    const phaseTimer = setTimeout(() => {
      setPhase('ONBOARDING')
    }, 4800)

    return () => {
      clearTimeout(dismissTimer)
      clearTimeout(phaseTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only on mount

  // ── MAGIC_MOMENT: run finalizeOnboarding once ──────────────────────────────
  useEffect(() => {
    if (phase !== 'MAGIC_MOMENT') return

    let cancelled = false

    finalizeOnboarding(nodes, answers)
      .then((analysis) => {
        if (cancelled) return
        setFinalAnalysis(analysis)
        setDayPlan(analysis.dayPlan)
        setPersonalityInsight(analysis.personalityInsight)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[CosmosPage] finalizeOnboarding error:', err)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ── Answer handler (ONBOARDING) ────────────────────────────────────────────
  const handleAnswer = useCallback(
    async (answerText: string, chips?: string[]) => {
      const question = QUESTIONS[currentQuestion as 0 | 1 | 2 | 3 | 4 | 5]

      const answer: OnboardingAnswer = {
        questionIndex: currentQuestion,
        questionText: question.text,
        answer: answerText,
        chips,
        timestamp: Date.now(),
      }

      addAnswer(answer)
      setIsAiAnalyzing(true)

      try {
        const analysis = await analyzeAnswer(answer, answers)

        // Enrich partial nodes with physics defaults before handing to store.
        // Note: addNodes in the store further sets radius & glowColor, but we
        // set defaults here so TypeScript is satisfied for the full Node shape.
        const enrichedNodes = analysis.nodes.map((n) => ({
          ...n,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 1.8 + n.weight * 4.5,   // smaller, more premium (2–6 px)
          glowColor: CLUSTER_GLOW_COLORS[n.clusterId],
          opacity: 0,
          labelOpacity: 0,
          phase: Math.random() * Math.PI * 2,  // unique breathing phase per node
        }))

        // Assign stable IDs to edges so canvas can deduplicate
        const enrichedEdges = analysis.edges.map((e, i) => ({
          ...e,
          id: `e_${currentQuestion}_${i}`,
        }))

        addNodes(enrichedNodes)
        addEdges(enrichedEdges)
      } catch (err) {
        console.error('[CosmosPage] analyzeAnswer error:', err)
      } finally {
        setIsAiAnalyzing(false)
      }

      // Advance: last question (index TOTAL_QUESTIONS - 1) triggers MAGIC_MOMENT
      if (currentQuestion >= TOTAL_QUESTIONS - 1) {
        setTimeout(() => setPhase('MAGIC_MOMENT'), 600)
      } else {
        setCurrentQuestion(currentQuestion + 1)
      }
    },
    [
      currentQuestion,
      answers,
      addAnswer,
      setIsAiAnalyzing,
      addNodes,
      addEdges,
      setCurrentQuestion,
      setPhase,
    ],
  )

  // ── Magic moment complete ──────────────────────────────────────────────────
  const handleMagicComplete = useCallback(() => {
    setMagicMomentComplete(true)
    setPhase('COSMOS_HOME')
  }, [setMagicMomentComplete, setPhase])

  // ── AI chat handler (COSMOS_HOME) ──────────────────────────────────────────
  const handleAiMessage = useCallback(
    async (text: string) => {
      const userMsg = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: text,
        timestamp: Date.now(),
      }
      addAiMessage(userMsg)
      setIsAiAnalyzing(true)

      try {
        // Build a slim personality context to personalise AI replies
        const goalLabels = nodes
          .filter((n) => n.clusterId === 'goal')
          .map((n) => n.label)
          .join(', ')
        const context = `User personality: ${personalityInsight || 'unknown'}. Goals: ${goalLabels || 'not yet set'}.`

        const systemPrompt = 'You are a personal AI coach inside EthosLife — a Human Operating System. Be warm, concise, and specific to the user\'s goals. Max 3 sentences. Respond in the same language as the user message.'
        const userPrompt = `Context about this user: ${context}\n\nUser message: ${text}`

        const response = await fetch('/api/grok', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'grok-3',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
        })

        if (!response.ok) throw new Error(`Grok API error: ${response.status}`)

        const data = await response.json() as {
          choices?: Array<{ message?: { content?: string } }>
        }
        const reply: string = data.choices?.[0]?.message?.content ?? 'Подумаю об этом...'

        addAiMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        })
      } catch {
        addAiMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Что-то пошло не так. Попробуй снова.',
          timestamp: Date.now(),
        })
      } finally {
        setIsAiAnalyzing(false)
      }
    },
    [personalityInsight, nodes, addAiMessage, setIsAiAnalyzing],
  )

  // ── Derived canvas phase (GREETING uses same canvas as ONBOARDING) ─────────
  const canvasPhase: 'ONBOARDING' | 'MAGIC_MOMENT' | 'COSMOS_HOME' =
    phase === 'GREETING' || phase === 'ONBOARDING'
      ? 'ONBOARDING'
      : phase === 'MAGIC_MOMENT'
      ? 'MAGIC_MOMENT'
      : 'COSMOS_HOME'

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0f',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* ── Canvas — always rendered beneath all overlays ───────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // Reserve space for BottomPanel in COSMOS_HOME
          bottom: phase === 'COSMOS_HOME' ? 104 : 0,
        }}
      >
        <CosmosCanvas
          phase={canvasPhase}
          magicStep={magicStep}
          onNodeSelect={setSelectedNode}
        />
      </div>

      {/* ── GREETING overlay ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'GREETING' && showGreeting && (
          <motion.div
            key="greeting"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            {GREETING_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: line.delay, duration: 1.0, ease: 'easeOut' }}
                style={{
                  fontSize: line.style === 'accent' ? '14px' : '22px',
                  fontWeight: line.style === 'accent' ? 400 : 300,
                  color:
                    line.style === 'accent'
                      ? 'rgba(100,140,255,0.75)'
                      : 'rgba(220,230,255,0.85)',
                  letterSpacing: line.style === 'accent' ? '0.15em' : '0.02em',
                  textAlign: 'center',
                  margin: '6px 0',
                  padding: '0 32px',
                  fontStyle: line.style !== 'accent' ? 'italic' : 'normal',
                  maxWidth: 420,
                }}
              >
                {line.text}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ONBOARDING question bubbles ───────────────────────────────────────── */}
      {phase === 'ONBOARDING' && (
        <OnboardingFlow
          currentQuestion={currentQuestion}
          isAnalyzing={isAiAnalyzing}
          onAnswer={handleAnswer}
        />
      )}

      {/* ── MAGIC MOMENT overlay ──────────────────────────────────────────────── */}
      {phase === 'MAGIC_MOMENT' && (
        <MagicMoment
          personalityInsight={personalityInsight}
          onStepChange={setMagicStep}
          onComplete={handleMagicComplete}
        />
      )}

      {/* ── COSMOS HOME bottom panel ──────────────────────────────────────────── */}
      {phase === 'COSMOS_HOME' && (
        <BottomPanel
          dayPlan={dayPlan}
          aiMessages={aiMessages}
          isVisible={true}
          onSendMessage={handleAiMessage}
          onCompleteItem={completeTodayItem}
          isAiThinking={isAiAnalyzing}
        />
      )}

      {/* ── Node detail panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: phase === 'COSMOS_HOME' ? 120 : 32,
              zIndex: 40,
              background: 'rgba(18, 18, 24, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              padding: '20px 20px 18px',
            }}
          >
            <NodeDetailPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Burger menu button (always top-right) ────────────────────────────── */}
      <button
        onClick={() => setBurgerOpen(true)}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 50,
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(200,210,255,0.85)',
          cursor: 'pointer',
        }}
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      {/* ── Burger menu panel ─────────────────────────────────────────────────── */}
      {burgerOpen && <BurgerMenuPanel onClose={() => setBurgerOpen(false)} />}
    </div>
  )
}

export default CosmosPage

// ─── Node Detail Panel ────────────────────────────────────────────────────────

const CLUSTER_LABELS: Record<ClusterId, string> = {
  ego: 'Личность',
  social: 'Отношения',
  goal: 'Цели',
  shadow: 'Тени',
}

const CLUSTER_ICONS: Record<ClusterId, React.FC<{ size: number }>> = {
  ego: ({ size }) => <Star size={size} />,
  social: ({ size }) => <Users size={size} />,
  goal: ({ size }) => <Target size={size} />,
  shadow: ({ size }) => <EyeOff size={size} />,
}

function NodeDetailPanel({ node, onClose }: { node: Node; onClose: () => void }) {
  const glowColor = CLUSTER_GLOW_COLORS[node.clusterId as ClusterId] ?? 'rgba(200,200,200,0.6)'
  const Icon = CLUSTER_ICONS[node.clusterId as ClusterId] ?? Star

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${glowColor.replace('0.', '0.')}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: glowColor.replace('rgba(', '').replace(/,\s*[\d.]+\)/, '').split(',').map((v) => parseInt(v)).join(', '),
            boxShadow: `0 0 12px ${glowColor}`,
          }}>
            <Icon size={15} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'rgba(240,235,225,0.95)', letterSpacing: '-0.01em' }}>
              {node.label}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(170,165,155,0.7)', marginTop: 1 }}>
              {CLUSTER_LABELS[node.clusterId as ClusterId] ?? node.clusterId}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'rgba(180,175,165,0.6)', cursor: 'pointer', padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      {node.description && (
        <p style={{ fontSize: 13, color: 'rgba(210,205,195,0.8)', lineHeight: 1.6, margin: '0 0 14px' }}>
          {node.description}
        </p>
      )}

      {/* Weight bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(150,145,138,0.65)' }}>Значимость</span>
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.round(node.weight * 100)}%`,
            height: '100%',
            background: glowColor,
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(150,145,138,0.65)' }}>{Math.round(node.weight * 100)}%</span>
      </div>
    </div>
  )
}
