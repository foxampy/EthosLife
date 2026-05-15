import { create } from 'zustand'
import type {
  CosmosPhase,
  OnboardingAnswer,
  Node,
  Edge,
  Cluster,
  FinalAnalysis,
  DayPlanItem,
  AiMessage,
  ClusterId,
} from './types'

const STORAGE_KEY = 'ethoslife_cosmos'

// Premium graphite palette — warm amber / cool silver / pearl / rust. No blue.
export const CLUSTER_GLOW_COLORS: Record<ClusterId, string> = {
  ego: 'rgba(210, 175, 80, 0.8)',       // warm amber gold
  social: 'rgba(175, 190, 200, 0.65)',  // cool platinum silver
  goal: 'rgba(235, 225, 205, 0.75)',    // warm pearl
  shadow: 'rgba(155, 80, 75, 0.55)',    // muted rust
}

export function computeNodeRadius(weight: number): number {
  return 3 + weight * 8
}

interface PersistedCosmosState {
  phase: CosmosPhase
  currentQuestion: number
  answers: OnboardingAnswer[]
  nodes: Node[]
  edges: Edge[]
  clusters: Cluster[]
  finalAnalysis: FinalAnalysis | null
  dayPlan: DayPlanItem[]
  personalityInsight: string
  aiMessages: AiMessage[]
  magicMomentComplete: boolean
}

interface CosmosState extends PersistedCosmosState {
  isAiAnalyzing: boolean
  isPanelExpanded: boolean
}

interface CosmosActions {
  setPhase: (phase: CosmosPhase) => void
  setCurrentQuestion: (index: number) => void
  addAnswer: (answer: OnboardingAnswer) => void
  addNodes: (nodes: Node[]) => void
  addEdges: (edges: Edge[]) => void
  setClusters: (clusters: Cluster[]) => void
  setFinalAnalysis: (analysis: FinalAnalysis) => void
  setDayPlan: (plan: DayPlanItem[]) => void
  setPersonalityInsight: (text: string) => void
  setIsAiAnalyzing: (v: boolean) => void
  addAiMessage: (msg: AiMessage) => void
  togglePanel: () => void
  setMagicMomentComplete: (v: boolean) => void
  completeTodayItem: (day: number) => void
  resetCosmos: () => void
  syncToSupabase: () => Promise<void>
}

const DEFAULT_PERSISTED: PersistedCosmosState = {
  phase: 'GREETING',
  currentQuestion: 0,
  answers: [],
  nodes: [],
  edges: [],
  clusters: [],
  finalAnalysis: null,
  dayPlan: [],
  personalityInsight: '',
  aiMessages: [],
  magicMomentComplete: false,
}

function saveToLocalStorage(state: PersistedCosmosState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

function loadFromLocalStorage(): PersistedCosmosState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PERSISTED
    return { ...DEFAULT_PERSISTED, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PERSISTED
  }
}

const hydrated = loadFromLocalStorage()

export const useCosmosStore = create<CosmosState & CosmosActions>((set, get) => ({
  ...hydrated,
  isAiAnalyzing: false,
  isPanelExpanded: false,

  setPhase: (phase) => {
    set({ phase })
    saveToLocalStorage({ ...extractPersisted(get()), phase })
  },

  setCurrentQuestion: (currentQuestion) => {
    set({ currentQuestion })
    saveToLocalStorage({ ...extractPersisted(get()), currentQuestion })
  },

  addAnswer: (answer) => {
    const answers = [...get().answers, answer]
    set({ answers })
    saveToLocalStorage({ ...extractPersisted(get()), answers })
  },

  addNodes: (incoming) => {
    const enriched = incoming.map((n) => ({
      ...n,
      radius: computeNodeRadius(n.weight),
      glowColor: CLUSTER_GLOW_COLORS[n.clusterId],
    }))
    const nodes = [...get().nodes, ...enriched]
    set({ nodes })
    saveToLocalStorage({ ...extractPersisted(get()), nodes })
  },

  addEdges: (incoming) => {
    const edges = [...get().edges, ...incoming]
    set({ edges })
    saveToLocalStorage({ ...extractPersisted(get()), edges })
  },

  setClusters: (clusters) => {
    set({ clusters })
    saveToLocalStorage({ ...extractPersisted(get()), clusters })
  },

  setFinalAnalysis: (finalAnalysis) => {
    set({ finalAnalysis })
    saveToLocalStorage({ ...extractPersisted(get()), finalAnalysis })
  },

  setDayPlan: (dayPlan) => {
    set({ dayPlan })
    saveToLocalStorage({ ...extractPersisted(get()), dayPlan })
  },

  setPersonalityInsight: (personalityInsight) => {
    set({ personalityInsight })
    saveToLocalStorage({ ...extractPersisted(get()), personalityInsight })
  },

  setIsAiAnalyzing: (isAiAnalyzing) => {
    set({ isAiAnalyzing })
  },

  addAiMessage: (msg) => {
    const aiMessages = [...get().aiMessages, msg]
    set({ aiMessages })
    saveToLocalStorage({ ...extractPersisted(get()), aiMessages })
  },

  togglePanel: () => {
    set((s) => ({ isPanelExpanded: !s.isPanelExpanded }))
  },

  setMagicMomentComplete: (magicMomentComplete) => {
    set({ magicMomentComplete })
    saveToLocalStorage({ ...extractPersisted(get()), magicMomentComplete })
  },

  completeTodayItem: (day) => {
    const dayPlan = get().dayPlan.map((item) =>
      item.day === day ? { ...item, completed: true } : item
    )
    set({ dayPlan })
    saveToLocalStorage({ ...extractPersisted(get()), dayPlan })
  },

  resetCosmos: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ ...DEFAULT_PERSISTED, isAiAnalyzing: false, isPanelExpanded: false })
  },

  syncToSupabase: async () => {
    // TODO: sync to Supabase
    console.log('TODO: sync to Supabase')
  },
}))

function extractPersisted(state: CosmosState): PersistedCosmosState {
  return {
    phase: state.phase,
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    nodes: state.nodes,
    edges: state.edges,
    clusters: state.clusters,
    finalAnalysis: state.finalAnalysis,
    dayPlan: state.dayPlan,
    personalityInsight: state.personalityInsight,
    aiMessages: state.aiMessages,
    magicMomentComplete: state.magicMomentComplete,
  }
}
