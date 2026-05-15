export type ClusterId = 'ego' | 'social' | 'goal' | 'shadow'

export type EdgeType = 'strong' | 'weak' | 'tension'

export type CosmosPhase = 'GREETING' | 'ONBOARDING' | 'MAGIC_MOMENT' | 'COSMOS_HOME'

export interface Node {
  id: string
  label: string
  description?: string
  weight: number
  clusterId: ClusterId
  questionIndex: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  glowColor: string
  opacity: number
  labelOpacity: number
  phase: number  // per-node random phase offset for 3D breathing oscillation
}

export interface Edge {
  id: string
  source: string
  target: string
  weight: number
  type: EdgeType
}

export interface Cluster {
  id: ClusterId
  label: string
  nodes: string[]
  centerX: number
  centerY: number
}

export interface OnboardingAnswer {
  questionIndex: number
  questionText: string
  answer: string
  chips?: string[]
  timestamp: number
}

export interface AnswerAnalysis {
  nodes: Omit<Node, 'x' | 'y' | 'vx' | 'vy' | 'radius' | 'glowColor' | 'opacity' | 'labelOpacity' | 'phase'>[]
  edges: Omit<Edge, 'id'>[]
  insight: string
}

export interface FinalAnalysis {
  egoCenter: string[]
  socialRing: string[]
  goalSatellite: string[]
  shadowCluster: string[]
  dayPlan: DayPlanItem[]
  personalityInsight: string
}

export interface DayPlanItem {
  day: number
  action: string
  category: 'habit' | 'goal' | 'social' | 'health'
  completed?: boolean
  isToday?: boolean
}

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface BackgroundStar {
  x: number
  y: number
  radius: number
  opacity: number
  vx: number
  vy: number
}
