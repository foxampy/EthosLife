import React, { useRef, useEffect, useCallback } from 'react'
import { useCosmosStore } from './cosmosStore'
import {
  tickPhysics,
  initBackgroundStars,
  initNodePositions,
  type PhysicsState,
} from './constellationEngine'
import type { Node, Edge, BackgroundStar } from './types'

// ─── Camera ──────────────────────────────────────────────────────────────────

interface Camera {
  x: number   // pan offset X (canvas space)
  y: number   // pan offset Y (canvas space)
  scale: number
}

const ZOOM_MIN = 0.15
const ZOOM_MAX = 6

// ─── Props ────────────────────────────────────────────────────────────────────

interface CosmosCanvasProps {
  phase: 'ONBOARDING' | 'MAGIC_MOMENT' | 'COSMOS_HOME'
  magicStep?: number
  onNodeSelect?: (node: Node | null) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CosmosCanvas: React.FC<CosmosCanvasProps> = ({
  phase,
  magicStep = 0,
  onNodeSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const physicsRef = useRef<PhysicsState | null>(null)
  const rafRef = useRef<number>(0)
  const mountedRef = useRef<boolean>(false)

  // Camera: pan + zoom, stored in ref to avoid React re-renders every frame
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 1 })

  // Interaction state
  const isDraggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const pinchRef = useRef({ active: false, dist: 0 })
  const draggedNodeRef = useRef<Node | null>(null)
  const hasDraggedRef = useRef(false)  // distinguish tap vs drag

  const nodes = useCosmosStore((s) => s.nodes)
  const edges = useCosmosStore((s) => s.edges)

  // ── Canvas size ───────────────────────────────────────────────────────────

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.parentElement?.clientWidth ?? window.innerWidth
    const h = canvas.parentElement?.clientHeight ?? window.innerHeight

    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.width = w * dpr
    canvas.height = h * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)

    if (physicsRef.current) {
      physicsRef.current.width = w
      physicsRef.current.height = h
    }
  }, [])

  // ── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true
    const canvas = canvasRef.current
    if (!canvas) return

    resizeCanvas()

    const w = canvas.parentElement?.clientWidth ?? window.innerWidth
    const h = canvas.parentElement?.clientHeight ?? window.innerHeight

    // Camera at (0,0,1): world coords map directly to screen coords.
    // Nodes spawn around (w/2, h/2) in world space → appear centered on screen.
    cameraRef.current = { x: 0, y: 0, scale: 1 }

    const positionedNodes = initNodePositions(nodes, w, h)
    physicsRef.current = {
      nodes: positionedNodes,
      edges: [...edges],
      backgroundStars: initBackgroundStars(w, h),
      frame: 0,
      width: w,
      height: h,
    }

    const ro = new ResizeObserver(resizeCanvas)
    ro.observe(document.documentElement)

    return () => {
      mountedRef.current = false
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sync new nodes from store ─────────────────────────────────────────────

  useEffect(() => {
    if (!physicsRef.current) return
    const existing = physicsRef.current.nodes
    const existingIds = new Set(existing.map((n) => n.id))
    const newNodes = nodes.filter((n) => !existingIds.has(n.id))

    if (newNodes.length === 0) {
      physicsRef.current.edges = [...edges]
      return
    }

    const { width, height } = physicsRef.current
    const positioned = initNodePositions(newNodes, width, height)
    physicsRef.current.nodes = [...existing, ...positioned]
    physicsRef.current.edges = [...edges]
  }, [nodes.length, edges.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── World ↔ screen coordinate helpers ─────────────────────────────────────

  const screenToWorld = useCallback((sx: number, sy: number) => {
    const cam = cameraRef.current
    return {
      x: (sx - cam.x) / cam.scale,
      y: (sy - cam.y) / cam.scale,
    }
  }, [])

  const hitTestNode = useCallback((sx: number, sy: number): Node | null => {
    const state = physicsRef.current
    if (!state) return null
    const w = screenToWorld(sx, sy)
    let best: Node | null = null
    let bestDist = Infinity
    for (const node of state.nodes) {
      if (node.opacity < 0.1) continue
      const dx = w.x - node.x
      const dy = w.y - node.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const hitRadius = node.radius / cameraRef.current.scale + 14
      if (dist < hitRadius && dist < bestDist) {
        best = node
        bestDist = dist
      }
    }
    return best
  }, [screenToWorld])

  // ── Zoom utility ──────────────────────────────────────────────────────────

  const applyZoom = useCallback((delta: number, focusX: number, focusY: number) => {
    const cam = cameraRef.current
    const factor = Math.exp(delta * 0.001)
    const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, cam.scale * factor))
    const ratio = newScale / cam.scale
    // Zoom toward focus point
    cameraRef.current = {
      scale: newScale,
      x: focusX + (cam.x - focusX) * ratio,
      y: focusY + (cam.y - focusY) * ratio,
    }
  }, [])

  // ── Mouse events ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      applyZoom(-e.deltaY, e.clientX - rect.left, e.clientY - rect.top)
    }

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      const hit = hitTestNode(sx, sy)
      if (hit) {
        draggedNodeRef.current = hit
      } else {
        isDraggingRef.current = true
      }
      hasDraggedRef.current = false
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPointerRef.current.x
      const dy = e.clientY - lastPointerRef.current.y
      lastPointerRef.current = { x: e.clientX, y: e.clientY }

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDraggedRef.current = true

      if (draggedNodeRef.current) {
        // Drag node in world space
        const cam = cameraRef.current
        draggedNodeRef.current.x += dx / cam.scale
        draggedNodeRef.current.y += dy / cam.scale
        draggedNodeRef.current.vx = 0
        draggedNodeRef.current.vy = 0
      } else if (isDraggingRef.current) {
        cameraRef.current = {
          ...cameraRef.current,
          x: cameraRef.current.x + dx,
          y: cameraRef.current.y + dy,
        }
      }
    }

    const onMouseUp = (e: MouseEvent) => {
      if (!hasDraggedRef.current) {
        const rect = canvas.getBoundingClientRect()
        const sx = e.clientX - rect.left
        const sy = e.clientY - rect.top
        const hit = hitTestNode(sx, sy)
        onNodeSelect?.(hit)
      }
      isDraggingRef.current = false
      draggedNodeRef.current = null
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [applyZoom, hitTestNode, onNodeSelect])

  // ── Touch events ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getTouchDist = (t: TouchList) => {
      const dx = t[0].clientX - t[1].clientX
      const dy = t[0].clientY - t[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchRef.current = { active: true, dist: getTouchDist(e.touches) }
        isDraggingRef.current = false
        draggedNodeRef.current = null
      } else if (e.touches.length === 1) {
        const t = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        const sx = t.clientX - rect.left
        const sy = t.clientY - rect.top
        const hit = hitTestNode(sx, sy)
        if (hit) {
          draggedNodeRef.current = hit
        } else {
          isDraggingRef.current = true
        }
        hasDraggedRef.current = false
        lastPointerRef.current = { x: t.clientX, y: t.clientY }
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 2 && pinchRef.current.active) {
        const newDist = getTouchDist(e.touches)
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
        const rect = canvas.getBoundingClientRect()
        applyZoom((newDist - pinchRef.current.dist) * 3, midX - rect.left, midY - rect.top)
        pinchRef.current.dist = newDist
      } else if (e.touches.length === 1) {
        const t = e.touches[0]
        const dx = t.clientX - lastPointerRef.current.x
        const dy = t.clientY - lastPointerRef.current.y
        lastPointerRef.current = { x: t.clientX, y: t.clientY }
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDraggedRef.current = true

        if (draggedNodeRef.current) {
          const cam = cameraRef.current
          draggedNodeRef.current.x += dx / cam.scale
          draggedNodeRef.current.y += dy / cam.scale
          draggedNodeRef.current.vx = 0
          draggedNodeRef.current.vy = 0
        } else if (isDraggingRef.current) {
          cameraRef.current = {
            ...cameraRef.current,
            x: cameraRef.current.x + dx,
            y: cameraRef.current.y + dy,
          }
        }
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        if (!hasDraggedRef.current && !pinchRef.current.active) {
          const t = e.changedTouches[0]
          const rect = canvas.getBoundingClientRect()
          const sx = t.clientX - rect.left
          const sy = t.clientY - rect.top
          const hit = hitTestNode(sx, sy)
          onNodeSelect?.(hit)
        }
        pinchRef.current.active = false
        isDraggingRef.current = false
        draggedNodeRef.current = null
      } else if (e.touches.length === 1) {
        pinchRef.current.active = false
      }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [applyZoom, hitTestNode, onNodeSelect])

  // ── Draw loop ─────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    if (!mountedRef.current) return
    const canvas = canvasRef.current
    const state = physicsRef.current
    if (!canvas || !state) { rafRef.current = requestAnimationFrame(draw); return }

    const ctx = canvas.getContext('2d')
    if (!ctx) { rafRef.current = requestAnimationFrame(draw); return }

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    tickPhysics(state)

    // ── Clear & background
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, w, h)

    // ── Background stars (no camera transform — they're the fixed backdrop)
    drawBackgroundStars(ctx, state.backgroundStars)

    // ── Build node map
    const nodeMap: Record<string, Node> = {}
    for (const node of state.nodes) nodeMap[node.id] = node

    // ── Apply camera transform for graph elements
    const cam = cameraRef.current
    ctx.save()
    ctx.translate(cam.x, cam.y)
    ctx.scale(cam.scale, cam.scale)

    drawEdges(ctx, state.edges, nodeMap)
    if (phase === 'MAGIC_MOMENT') drawMagicOverlay(ctx, state.width, state.height, magicStep)
    drawNodes(ctx, state.nodes)
    drawLabels(ctx, state.nodes, cam.scale)

    ctx.restore()

    rafRef.current = requestAnimationFrame(draw)
  }, [phase, magicStep])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        touchAction: 'none',
        cursor: 'grab',
      }}
    />
  )
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawBackgroundStars(ctx: CanvasRenderingContext2D, stars: BackgroundStar[]): void {
  for (const star of stars) {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 252, 245, ${star.opacity})`
    ctx.fill()
  }
}

function drawEdges(ctx: CanvasRenderingContext2D, edges: Edge[], nodeMap: Record<string, Node>): void {
  for (const edge of edges) {
    const src = nodeMap[edge.source]
    const tgt = nodeMap[edge.target]
    if (!src || !tgt) continue
    if (src.opacity < 0.05 || tgt.opacity < 0.05) continue

    const visAlpha = Math.min(src.opacity, tgt.opacity)
    const alpha = edge.type === 'strong'
      ? edge.weight * 0.55 * visAlpha
      : edge.weight * 0.22 * visAlpha

    const color = edge.type === 'tension'
      ? `rgba(160, 80, 72, ${alpha})`      // muted rust for tension
      : `rgba(175, 178, 185, ${alpha})`    // platinum silver

    ctx.beginPath()
    ctx.moveTo(src.x, src.y)
    ctx.lineTo(tgt.x, tgt.y)
    ctx.strokeStyle = color
    ctx.lineWidth = edge.type === 'strong' ? 1.0 : 0.45
    ctx.stroke()
  }
}

function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[]): void {
  for (const node of nodes) {
    if (node.opacity <= 0.02) continue

    const r = node.radius

    // Outer glow — uses cluster color
    ctx.shadowBlur = (16 + node.weight * 22) / (window.devicePixelRatio || 1)
    ctx.shadowColor = node.glowColor

    // Halo ring
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 252, 245, ${node.opacity * 0.85})`
    ctx.fill()

    // Bright inner core
    ctx.shadowBlur = 0
    ctx.beginPath()
    ctx.arc(node.x, node.y, r * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`
    ctx.fill()
  }
  ctx.shadowBlur = 0
}

function drawLabels(ctx: CanvasRenderingContext2D, nodes: Node[], camScale: number): void {
  ctx.textAlign = 'center'
  // Scale font inversely so labels stay readable at all zoom levels
  const baseFontSize = Math.max(9, Math.min(14, 11 / camScale))

  for (const node of nodes) {
    if (node.labelOpacity <= 0.05) continue
    const fontSize = baseFontSize + node.weight * 2
    ctx.font = `${fontSize}px -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif`
    ctx.fillStyle = `rgba(235, 230, 218, ${node.labelOpacity * 0.9})`
    ctx.fillText(node.label, node.x, node.y + node.radius + 14)
  }
}

function drawMagicOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  step: number,
): void {
  const cx = 0  // in world coords, origin is 0,0 (camera handles offset)
  const cy = 0

  if (step <= 1) {
    // Golden collapse glow
    const progress = Math.min(step, 1)
    const glowR = progress * 50
    if (glowR > 0) {
      ctx.save()
      ctx.shadowBlur = 60 * progress
      ctx.shadowColor = 'rgba(210, 175, 80, 0.9)'
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
      grad.addColorStop(0, `rgba(240, 220, 160, ${progress})`)
      grad.addColorStop(0.5, `rgba(210, 175, 80, ${progress * 0.6})`)
      grad.addColorStop(1, 'rgba(200, 160, 50, 0)')
      ctx.beginPath()
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()
    }
  }

  if (step === 2) {
    // White flash — need to cover full world visible area (large rect)
    const flashAlpha = 0.85
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`
    ctx.fillRect(-w * 5, -h * 5, w * 10, h * 10)
  }
}

export default CosmosCanvas
