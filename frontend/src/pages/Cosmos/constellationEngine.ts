import type { Node, Edge, BackgroundStar } from './types'

// ─── Constants ────────────────────────────────────────────────────────────────
const DAMPING = 0.95
const REPULSION_STRENGTH = 800
const ATTRACTION_STRENGTH = 0.03
const DRIFT_INTERVAL = 60        // frames between random drift impulse
const MAX_VELOCITY = 2.5
const BACKGROUND_STAR_COUNT = 180

// ─── Public State Shape ───────────────────────────────────────────────────────
export interface PhysicsState {
  nodes: Node[]
  edges: Edge[]
  backgroundStars: BackgroundStar[]
  frame: number
  width: number
  height: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// ─── Background Stars ─────────────────────────────────────────────────────────
export function initBackgroundStars(width: number, height: number): BackgroundStar[] {
  return Array.from({ length: BACKGROUND_STAR_COUNT }, (): BackgroundStar => ({
    x: rand(0, width),
    y: rand(0, height),
    radius: rand(0.3, 1.2),
    opacity: rand(0.1, 0.4),
    vx: rand(-0.05, 0.05),
    vy: rand(-0.05, 0.05),
  }))
}

// ─── Node Initialisation ──────────────────────────────────────────────────────
export function initNodePositions(nodes: Node[], width: number, height: number): Node[] {
  const centerX = width / 2
  const centerY = height / 2
  // Keep nodes within 28% of center — all visible on screen at default zoom
  const spreadX = width * 0.28
  const spreadY = height * 0.28

  return nodes.map((node): Node => ({
    ...node,
    x: centerX + rand(-spreadX, spreadX),
    y: centerY + rand(-spreadY, spreadY),
    vx: 0,
    vy: 0,
  }))
}

// ─── Physics Tick ─────────────────────────────────────────────────────────────
export function tickPhysics(state: PhysicsState): PhysicsState {
  const { nodes, edges, backgroundStars, width, height } = state
  const frame = state.frame + 1
  const margin = 30

  // ── Random drift impulse every DRIFT_INTERVAL frames
  if (frame % DRIFT_INTERVAL === 0) {
    for (const node of nodes) {
      node.vx += rand(-0.015, 0.015)
      node.vy += rand(-0.015, 0.015)
    }
  }

  // ── Repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distSq = dx * dx + dy * dy
      if (distSq < 1) continue
      const dist = Math.sqrt(distSq)
      const force = REPULSION_STRENGTH / distSq
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx -= fx
      a.vy -= fy
      b.vx += fx
      b.vy += fy
    }
  }

  // ── Attraction along edges
  // Build a quick lookup for node positions
  const nodeMap: Record<string, Node> = {}
  for (const node of nodes) nodeMap[node.id] = node

  for (const edge of edges) {
    const src = nodeMap[edge.source]
    const tgt = nodeMap[edge.target]
    if (!src || !tgt) continue

    const dx = tgt.x - src.x
    const dy = tgt.y - src.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const restLength = 80 + (1 - edge.weight) * 60
    const displacement = dist - restLength
    const force = ATTRACTION_STRENGTH * edge.weight * displacement
    const fx = (dx / dist) * force
    const fy = (dy / dist) * force
    src.vx += fx
    src.vy += fy
    tgt.vx -= fx
    tgt.vy -= fy
  }

  // ── Integrate positions, dampen, clamp, bounce
  for (const node of nodes) {
    // Fade in opacity so nodes become visible after spawning
    node.opacity = Math.min(1, node.opacity + 0.018)
    node.labelOpacity = Math.max(0, Math.min(1, node.opacity - 0.35))

    // Damping
    node.vx *= DAMPING
    node.vy *= DAMPING

    // Clamp velocity
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
    if (speed > MAX_VELOCITY) {
      const scale = MAX_VELOCITY / speed
      node.vx *= scale
      node.vy *= scale
    }

    // Integrate
    node.x += node.vx
    node.y += node.vy

    // Bounce off boundaries
    if (node.x < margin) { node.x = margin; node.vx = Math.abs(node.vx) }
    if (node.x > width - margin) { node.x = width - margin; node.vx = -Math.abs(node.vx) }
    if (node.y < margin) { node.y = margin; node.vy = Math.abs(node.vy) }
    if (node.y > height - margin) { node.y = height - margin; node.vy = -Math.abs(node.vy) }
  }

  // ── Update background stars (wrap, not bounce)
  for (const star of backgroundStars) {
    star.x += star.vx
    star.y += star.vy
    if (star.x < 0) star.x += width
    if (star.x > width) star.x -= width
    if (star.y < 0) star.y += height
    if (star.y > height) star.y -= height
  }

  state.frame = frame
  return state
}

// ─── Cluster Centers ──────────────────────────────────────────────────────────
export function computeClusterCenters(
  nodes: Node[],
): Record<string, { x: number; y: number }> {
  const sums: Record<string, { x: number; y: number; count: number }> = {}

  for (const node of nodes) {
    if (!sums[node.clusterId]) {
      sums[node.clusterId] = { x: 0, y: 0, count: 0 }
    }
    sums[node.clusterId].x += node.x
    sums[node.clusterId].y += node.y
    sums[node.clusterId].count += 1
  }

  const result: Record<string, { x: number; y: number }> = {}
  for (const [id, { x, y, count }] of Object.entries(sums)) {
    result[id] = { x: x / count, y: y / count }
  }
  return result
}

// ─── Magic Moment Arrangement ─────────────────────────────────────────────────
export function arrangeForMagicMoment(
  nodes: Node[],
  phase: 'collapse' | 'explode',
  targetCenters: Record<string, { x: number; y: number }>,
  centerX: number,
  centerY: number,
  progress: number,
): Node[] {
  const t = clamp(progress, 0, 1)

  return nodes.map((node): Node => {
    if (phase === 'collapse') {
      return {
        ...node,
        x: lerp(node.x, centerX, t),
        y: lerp(node.y, centerY, t),
      }
    }

    // explode — send each node toward its cluster center
    const target = targetCenters[node.clusterId]
    if (!target) return { ...node }

    return {
      ...node,
      x: lerp(node.x, target.x, t),
      y: lerp(node.y, target.y, t),
    }
  })
}

// ─── Final Cluster Positions ──────────────────────────────────────────────────
export function getFinalClusterPositions(
  width: number,
  height: number,
): Record<string, { x: number; y: number }> {
  const egoCenterX = width / 2
  const egoCenterY = height * 0.42
  const socialRadius = 200

  // Four quadrant positions around ego center for social nodes
  const socialAngles = [
    Math.PI * 0.25,   // top-right  (NE)
    Math.PI * 0.75,   // top-left   (NW)
    Math.PI * 1.25,   // bottom-left(SW)
    Math.PI * 1.75,   // bottom-right(SE)
  ]

  const social: Record<string, { x: number; y: number }> = {}
  socialAngles.forEach((angle, i) => {
    social[`social_${i}`] = {
      x: egoCenterX + Math.cos(angle) * socialRadius,
      y: egoCenterY + Math.sin(angle) * socialRadius,
    }
  })

  return {
    ego: { x: egoCenterX, y: egoCenterY },
    goal: { x: width / 2, y: height * 0.28 },
    shadow: { x: width * 0.25, y: height * 0.62 },
    // Social nodes are distributed in a ring; the ring center is the ego center.
    // We expose one canonical "social" center for clusters that request it.
    social: { x: egoCenterX + socialRadius * 0.7, y: egoCenterY },
    ...social,
  }
}
