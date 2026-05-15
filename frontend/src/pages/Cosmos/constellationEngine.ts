import type { Node, Edge, BackgroundStar } from './types'

// ─── Physics constants ────────────────────────────────────────────────────────

const DAMPING          = 0.82   // high damping → settles fast, doesn't oscillate
const REPULSION        = 180    // node-to-node repulsion (was 800 — that's why they flew apart)
const REPULSION_RADIUS = 130    // only repel nodes within this distance
const CLUSTER_GRAVITY  = 0.022  // pull toward cluster center every frame
const EDGE_SPRING      = 0.055  // spring along graph edges
const EDGE_REST_LEN    = 70     // rest length in px for strong edge; weak = 1.5×
const MAX_VELOCITY     = 3.5
const BACKGROUND_STAR_COUNT = 160

// ─── Public State ─────────────────────────────────────────────────────────────

export interface PhysicsState {
  nodes: Node[]
  edges: Edge[]
  backgroundStars: BackgroundStar[]
  frame: number
  width: number
  height: number
}

// ─── Cluster target positions ─────────────────────────────────────────────────
// Ego = screen center, goal = above, shadow = lower-right, social = ring around ego.

function getClusterTargets(
  width: number,
  height: number,
  socialCount: number,
  socialNodeIds: string[],
): Record<string, { x: number; y: number }> {
  const cx = width / 2
  const cy = height / 2
  const ringR = Math.min(width, height) * 0.19  // social ring radius

  const targets: Record<string, { x: number; y: number }> = {
    ego:    { x: cx,            y: cy },
    goal:   { x: cx,            y: cy - Math.min(height * 0.25, 160) },
    shadow: { x: cx + width * 0.22, y: cy + height * 0.20 },
  }

  // Each social node gets its own angle slot on the ring around ego
  const total = Math.max(socialCount, 1)
  socialNodeIds.forEach((id, idx) => {
    const angle = (2 * Math.PI * idx) / total - Math.PI / 2  // start from top
    targets[`social_${id}`] = {
      x: cx + Math.cos(angle) * ringR,
      y: cy + Math.sin(angle) * ringR,
    }
  })

  return targets
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

// ─── Background Stars ─────────────────────────────────────────────────────────

export function initBackgroundStars(width: number, height: number): BackgroundStar[] {
  return Array.from({ length: BACKGROUND_STAR_COUNT }, (): BackgroundStar => ({
    x: rand(0, width),
    y: rand(0, height),
    radius: rand(0.25, 1.1),
    opacity: rand(0.08, 0.32),
    vx: rand(-0.04, 0.04),
    vy: rand(-0.04, 0.04),
  }))
}

// ─── Node initialisation ──────────────────────────────────────────────────────
// New nodes spawn near their cluster center, not random screen position.

export function initNodePositions(nodes: Node[], width: number, height: number): Node[] {
  const cx = width / 2
  const cy = height / 2

  const clusterSeed: Record<string, { x: number; y: number }> = {
    ego:    { x: cx,                      y: cy },
    goal:   { x: cx,                      y: cy - height * 0.22 },
    shadow: { x: cx + width * 0.22,       y: cy + height * 0.18 },
    social: { x: cx,                      y: cy },  // will spread via ring force
  }

  return nodes.map((node): Node => {
    const seed = clusterSeed[node.clusterId] ?? { x: cx, y: cy }
    // Spawn within 60px of cluster center so they settle quickly
    return {
      ...node,
      x: seed.x + rand(-60, 60),
      y: seed.y + rand(-60, 60),
      vx: rand(-0.5, 0.5),
      vy: rand(-0.5, 0.5),
    }
  })
}

// ─── Physics Tick ─────────────────────────────────────────────────────────────

export function tickPhysics(state: PhysicsState): PhysicsState {
  const { nodes, edges, backgroundStars, width, height } = state
  const frame = state.frame + 1
  const margin = 40

  // Build lookup maps
  const nodeMap: Record<string, Node> = {}
  for (const node of nodes) nodeMap[node.id] = node

  // Gather social node IDs (sorted for stable angle assignment)
  const socialIds = nodes
    .filter((n) => n.clusterId === 'social')
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((n) => n.id)

  const clusterTargets = getClusterTargets(width, height, socialIds.length, socialIds)

  // ── Opacity fade-in ─────────────────────────────────────────────────────────
  for (const node of nodes) {
    node.opacity      = Math.min(1, node.opacity + 0.02)
    node.labelOpacity = Math.max(0, Math.min(1, node.opacity - 0.4))
  }

  // ── Cluster gravity ─────────────────────────────────────────────────────────
  for (const node of nodes) {
    // Social nodes use per-node ring target; others use cluster center
    const targetKey = node.clusterId === 'social'
      ? `social_${node.id}`
      : node.clusterId
    const target = clusterTargets[targetKey] ?? clusterTargets[node.clusterId]
    if (!target) continue

    const dx = target.x - node.x
    const dy = target.y - node.y
    node.vx += dx * CLUSTER_GRAVITY
    node.vy += dy * CLUSTER_GRAVITY
  }

  // ── Short-range repulsion (skip if too far — prevents flying apart) ─────────
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distSq = dx * dx + dy * dy
      const dist = Math.sqrt(distSq) || 0.01

      // Only repel nodes that are actually close to each other
      if (dist > REPULSION_RADIUS) continue

      const force = REPULSION / (distSq + 1)
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx -= fx; a.vy -= fy
      b.vx += fx; b.vy += fy
    }
  }

  // ── Edge spring attraction ──────────────────────────────────────────────────
  for (const edge of edges) {
    const src = nodeMap[edge.source]
    const tgt = nodeMap[edge.target]
    if (!src || !tgt) continue

    const dx = tgt.x - src.x
    const dy = tgt.y - src.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const restLen = edge.type === 'strong' ? EDGE_REST_LEN : EDGE_REST_LEN * 1.6
    const displacement = dist - restLen
    const strength = EDGE_SPRING * edge.weight * (edge.type === 'tension' ? 0.4 : 1)
    const force = strength * displacement
    const fx = (dx / dist) * force
    const fy = (dy / dist) * force
    src.vx += fx; src.vy += fy
    tgt.vx -= fx; tgt.vy -= fy
  }

  // ── Integrate & clamp ───────────────────────────────────────────────────────
  for (const node of nodes) {
    node.vx *= DAMPING
    node.vy *= DAMPING

    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
    if (speed > MAX_VELOCITY) {
      node.vx = (node.vx / speed) * MAX_VELOCITY
      node.vy = (node.vy / speed) * MAX_VELOCITY
    }

    node.x += node.vx
    node.y += node.vy

    // Soft boundary — push back gently instead of hard bounce
    if (node.x < margin) { node.x = margin; node.vx = Math.abs(node.vx) * 0.5 }
    if (node.x > width  - margin) { node.x = width  - margin; node.vx = -Math.abs(node.vx) * 0.5 }
    if (node.y < margin) { node.y = margin; node.vy = Math.abs(node.vy) * 0.5 }
    if (node.y > height - margin) { node.y = height - margin; node.vy = -Math.abs(node.vy) * 0.5 }
  }

  // ── Background star drift ───────────────────────────────────────────────────
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

// ─── Cluster center helper (for canvas labels) ────────────────────────────────

export function computeClusterCenters(
  nodes: Node[],
): Record<string, { x: number; y: number }> {
  const sums: Record<string, { x: number; y: number; count: number }> = {}
  for (const node of nodes) {
    if (!sums[node.clusterId]) sums[node.clusterId] = { x: 0, y: 0, count: 0 }
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

// ─── Magic moment arrangement ─────────────────────────────────────────────────

export function arrangeForMagicMoment(
  nodes: Node[],
  phase: 'collapse' | 'explode',
  targetCenters: Record<string, { x: number; y: number }>,
  centerX: number,
  centerY: number,
  progress: number,
): Node[] {
  const t = Math.min(1, Math.max(0, progress))
  return nodes.map((node): Node => {
    if (phase === 'collapse') {
      return { ...node, x: node.x + (centerX - node.x) * t, y: node.y + (centerY - node.y) * t }
    }
    const target = targetCenters[node.clusterId]
    if (!target) return { ...node }
    return { ...node, x: node.x + (target.x - node.x) * t, y: node.y + (target.y - node.y) * t }
  })
}

export function getFinalClusterPositions(
  width: number,
  height: number,
): Record<string, { x: number; y: number }> {
  const cx = width / 2
  const cy = height / 2
  return {
    ego:    { x: cx,            y: cy },
    goal:   { x: cx,            y: cy - height * 0.25 },
    shadow: { x: cx + width * 0.25, y: cy + height * 0.2 },
    social: { x: cx + width * 0.2,  y: cy },
  }
}
