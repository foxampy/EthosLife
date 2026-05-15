import React, { useRef, useEffect, useCallback } from 'react'
import { useCosmosStore } from './cosmosStore'
import {
  tickPhysics,
  initBackgroundStars,
  initNodePositions,
  type PhysicsState,
} from './constellationEngine'
import type { Node, Edge, BackgroundStar } from './types'

// ─── Props ────────────────────────────────────────────────────────────────────
interface CosmosCanvasProps {
  phase: 'ONBOARDING' | 'MAGIC_MOMENT' | 'COSMOS_HOME'
  magicProgress?: number   // 0-1 during magic moment
  magicStep?: number       // 0-5 (steps of magic moment)
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────
export const CosmosCanvas: React.FC<CosmosCanvasProps> = ({
  phase,
  magicProgress = 0,
  magicStep = 0,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const physicsRef = useRef<PhysicsState | null>(null)
  const rafRef = useRef<number>(0)
  const mountedRef = useRef<boolean>(false)

  // Read store state (non-reactive read to avoid re-renders in the draw loop)
  const nodes = useCosmosStore((s) => s.nodes)
  const edges = useCosmosStore((s) => s.edges)

  // ── Canvas resize helper ──────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = Math.floor(window.innerHeight * 0.75)

    // Set logical resolution (CSS pixels)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    // Set physical resolution (device pixels) for crispness
    canvas.width = w * dpr
    canvas.height = h * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)

    // Keep physics state dimensions in sync
    if (physicsRef.current) {
      physicsRef.current.width = w
      physicsRef.current.height = h
    }
  }, [])

  // ── Initialise physics on mount ───────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.style.touchAction = 'none'

    // Size canvas before creating physics state
    resizeCanvas()

    const w = window.innerWidth
    const h = Math.floor(window.innerHeight * 0.75)

    const positionedNodes = initNodePositions(nodes, w, h)
    physicsRef.current = {
      nodes: positionedNodes,
      edges: [...edges],
      backgroundStars: initBackgroundStars(w, h),
      frame: 0,
      width: w,
      height: h,
    }

    // Resize observer
    const ro = new ResizeObserver(() => resizeCanvas())
    ro.observe(document.documentElement)

    return () => {
      mountedRef.current = false
      ro.disconnect()
    }
    // We intentionally run this once only — node sync handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sync new nodes from store (preserve existing positions) ──────────────
  useEffect(() => {
    if (!physicsRef.current) return

    const existing = physicsRef.current.nodes
    const existingIds = new Set(existing.map((n) => n.id))

    const newNodes = nodes.filter((n) => !existingIds.has(n.id))
    if (newNodes.length === 0) {
      // Update edge list in case edges were added
      physicsRef.current.edges = [...edges]
      return
    }

    const { width, height } = physicsRef.current
    const positioned = initNodePositions(newNodes, width, height)
    physicsRef.current.nodes = [...existing, ...positioned]
    physicsRef.current.edges = [...edges]
  }, [nodes.length, edges.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Draw loop ─────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    if (!mountedRef.current) return

    const canvas = canvasRef.current
    const state = physicsRef.current
    if (!canvas || !state) {
      rafRef.current = requestAnimationFrame(draw)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      rafRef.current = requestAnimationFrame(draw)
      return
    }

    // Logical (CSS) dimensions — the ctx is already scaled for DPR
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    // Advance physics
    tickPhysics(state)

    // ── Clear
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, w, h)

    // ── Background stars
    drawBackgroundStars(ctx, state.backgroundStars)

    // ── Build node map for edge drawing
    const nodeMap: Record<string, Node> = {}
    for (const node of state.nodes) nodeMap[node.id] = node

    // ── Edges
    drawEdges(ctx, state.edges, nodeMap)

    // ── Magic moment overlay
    if (phase === 'MAGIC_MOMENT') {
      drawMagicMoment(ctx, w, h, magicProgress, magicStep)
    }

    // ── Nodes
    drawNodes(ctx, state.nodes)

    // ── Labels (COSMOS_HOME only)
    if (phase === 'COSMOS_HOME') {
      drawLabels(ctx, state.nodes)
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [phase, magicProgress, magicStep])

  // ── Start / stop RAF loop ─────────────────────────────────────────────────
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        willChange: 'transform',
        touchAction: 'none',
      }}
    />
  )
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawBackgroundStars(
  ctx: CanvasRenderingContext2D,
  stars: BackgroundStar[],
): void {
  for (const star of stars) {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
    ctx.fill()
  }
}

function drawEdges(
  ctx: CanvasRenderingContext2D,
  edges: Edge[],
  nodeMap: Record<string, Node>,
): void {
  for (const edge of edges) {
    const src = nodeMap[edge.source]
    const tgt = nodeMap[edge.target]
    if (!src || !tgt) continue

    const alpha =
      edge.type === 'strong' ? edge.weight * 0.45 : edge.weight * 0.18
    const lineWidth = edge.type === 'strong' ? 1.2 : 0.5
    const color =
      edge.type === 'tension'
        ? `rgba(255, 100, 100, ${alpha})`
        : `rgba(120, 160, 255, ${alpha})`

    ctx.beginPath()
    ctx.moveTo(src.x, src.y)
    ctx.lineTo(tgt.x, tgt.y)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }
}

function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[]): void {
  for (const node of nodes) {
    if (node.opacity <= 0) continue

    // Outer glow
    ctx.shadowBlur = 20 + node.weight * 25
    ctx.shadowColor = node.glowColor

    // Node circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.9})`
    ctx.fill()

    // Inner bright core — reset shadow first for crispness
    ctx.shadowBlur = 0
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`
    ctx.fill()
  }

  // Always reset shadow blur so subsequent calls are not affected
  ctx.shadowBlur = 0
}

function drawLabels(ctx: CanvasRenderingContext2D, nodes: Node[]): void {
  ctx.textAlign = 'center'
  for (const node of nodes) {
    if (node.labelOpacity <= 0) continue
    const fontSize = Math.max(10, 11 + node.weight * 2)
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`
    ctx.fillStyle = `rgba(200, 220, 255, ${node.labelOpacity * 0.85})`
    ctx.fillText(node.label, node.x, node.y + node.radius + 14)
  }
}

function drawMagicMoment(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  magicProgress: number,
  magicStep: number,
): void {
  const centerX = w / 2
  const centerY = h / 2

  if (magicStep <= 1) {
    // ── Collapse phase: growing golden glow at center
    const glowRadius = magicProgress * 60
    if (glowRadius > 0) {
      ctx.save()
      ctx.shadowBlur = 40 + magicProgress * 100
      ctx.shadowColor = 'rgba(255, 220, 80, 0.9)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
      // Radial gradient for the core
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, glowRadius,
      )
      gradient.addColorStop(0, `rgba(255, 240, 180, ${magicProgress})`)
      gradient.addColorStop(0.5, `rgba(255, 200, 80, ${magicProgress * 0.7})`)
      gradient.addColorStop(1, `rgba(255, 160, 40, 0)`)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.restore()
    }
  } else if (magicStep === 2) {
    // ── Flash phase: white overlay
    const flashAlpha = magicProgress <= 0.5
      ? magicProgress * 2           // fade in
      : (1 - magicProgress) * 2     // fade out
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`
    ctx.fillRect(0, 0, w, h)
  }
  // Steps 3-5: normal rendering — nodes animate to final positions externally
}

export default CosmosCanvas
