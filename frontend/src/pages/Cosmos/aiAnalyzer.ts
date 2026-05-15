/**
 * AI Analyzer module for CosmosPage — EthosLife
 *
 * Layer 1: Deterministic MVP parser (works with no API key)
 * Layer 2: Grok (xAI) integration (activated when VITE_GROK_API_KEY is set)
 */

import type {
  ClusterId,
  EdgeType,
  OnboardingAnswer,
  AnswerAnalysis,
  FinalAnalysis,
  DayPlanItem,
} from './types'

// ─── Inline narrow types that match AnswerAnalysis shape from types.ts ────────

type NodeInput = AnswerAnalysis['nodes'][number]
type EdgeInput = AnswerAnalysis['edges'][number]

// ─── Constants ────────────────────────────────────────────────────────────────

const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY as string | undefined

const GROK_URL = 'https://api.x.ai/v1/responses'
const GROK_MODEL = 'grok-3'

const SYSTEM_PROMPT = `You are a personality graph builder for EthosLife — a Human Operating System.
Your task: analyze user's onboarding answer and return a structured JSON graph.

Rules:
1. Extract 4-8 semantic "nodes" (key concepts, themes, emotions, values)
2. Each node: id (string), label (1-3 words), weight (0.1-1.0), clusterId ('ego'|'social'|'goal'|'shadow'), description (one phrase)
3. Create edges: source (node id), target (node id), weight (0.1-1.0), type ('strong'|'weak'|'tension')
4. Strong edge (>0.6): direct semantic link
5. Weak edge (<0.4): thematic resonance
6. Tension edge: contradictory values
7. clusterId: ego=identity/values/traits, social=relationships/society, goal=aspirations, shadow=things to release/fears
8. Return ONLY valid JSON, no markdown, no explanation

JSON format:
{"nodes":[{"id":"n1","label":"Freedom","weight":0.9,"clusterId":"ego","description":"Core drive"}],"edges":[{"source":"n1","target":"n2","weight":0.8,"type":"strong"}],"insight":"One sentence insight"}`

const FINAL_SYSTEM_PROMPT = `You are finalizing a personality constellation map for EthosLife.
Given all nodes from 6 onboarding answers, determine the final layout and create a 30-day plan.

Return ONLY valid JSON:
{"egoCenter":["nodeId1"],"socialRing":["nodeId2"],"goalSatellite":["nodeId3"],"shadowCluster":["nodeId4"],"dayPlan":[{"day":1,"action":"...","category":"habit"}],"personalityInsight":"2-3 sentence summary"}`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeId(prefix: string, suffix: string): string {
  return `${prefix}_${suffix.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 24)}`
}

function hasKeywordOverlap(a: string, b: string): boolean {
  const aWords = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3))
  const bLower = b.toLowerCase()
  for (const word of aWords) {
    if (bLower.includes(word)) return true
  }
  return false
}

function buildWeakEdgesAcrossQuestions(nodes: NodeInput[]): EdgeInput[] {
  const edges: EdgeInput[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      if (a.questionIndex === b.questionIndex) continue
      if (hasKeywordOverlap(a.label, b.label) || hasKeywordOverlap(b.label, a.label)) {
        edges.push({ source: a.id, target: b.id, weight: 0.25, type: 'weak' as EdgeType })
      }
    }
  }
  return edges
}

// ─── PART 1: Deterministic Parser ────────────────────────────────────────────

export function parseAnswerDeterministic(answer: OnboardingAnswer): AnswerAnalysis {
  const { questionIndex, answer: text, chips } = answer
  const qi = questionIndex

  const nodes: NodeInput[] = []
  const edges: EdgeInput[] = []

  switch (qi) {
    case 0: {
      // Quote question
      const raw = text.trim()

      // Try to extract quoted text
      const quoteMatch = raw.match(/["""](.*?)["""]/s)
      const quoteText = quoteMatch ? quoteMatch[1].trim() : raw

      // Try to detect author (everything after " — " or " - " or " by ")
      const authorMatch = raw.match(/(?:—|-|by)\s+([A-Z][a-zA-Z\s.]{2,30})$/)
      const author = authorMatch ? authorMatch[1].trim() : ''

      // Mood keywords
      const moodMap: Record<string, string> = {
        inspiring: 'inspiring',
        dark: 'dark',
        motivational: 'motivational',
        peaceful: 'peaceful',
        powerful: 'motivational',
        serene: 'peaceful',
        gloomy: 'dark',
        hope: 'inspiring',
        fight: 'motivational',
        struggle: 'dark',
        calm: 'peaceful',
        rise: 'inspiring',
        fire: 'motivational',
      }
      const lowerRaw = raw.toLowerCase()
      const detectedMood =
        Object.keys(moodMap).find((k) => lowerRaw.includes(k)) ?? 'inspiring'

      const n1: NodeInput = {
        id: makeId('q0', 'quote_essence'),
        label: quoteText.slice(0, 30),
        description: 'Core quote that resonates',
        weight: 0.9,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      const n2: NodeInput = {
        id: makeId('q0', 'mood'),
        label: moodMap[detectedMood] ?? 'inspiring',
        description: 'Emotional tone of chosen quote',
        weight: 0.6,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      nodes.push(n1, n2)

      if (author) {
        const n3: NodeInput = {
          id: makeId('q0', 'author_vibe'),
          label: author.slice(0, 20),
          description: 'Author or source of wisdom',
          weight: 0.5,
          clusterId: 'ego' as ClusterId,
          questionIndex: qi,
        }
        nodes.push(n3)
        edges.push({ source: n1.id, target: n3.id, weight: 0.4, type: 'weak' as EdgeType })
        edges.push({ source: n2.id, target: n3.id, weight: 0.3, type: 'weak' as EdgeType })
      }

      edges.push({ source: n1.id, target: n2.id, weight: 0.7, type: 'strong' as EdgeType })
      break
    }

    case 1: {
      // Character question
      const raw = text.trim()

      // Detect universe/fandom keywords
      const universeKeywords: string[] = [
        'marvel', 'dc', 'star wars', 'harry potter', 'lord of the rings',
        'game of thrones', 'anime', 'manga', 'disney', 'pixar',
        'netflix', 'tolkien', 'comic', 'superhero',
      ]
      const lowerRaw = raw.toLowerCase()
      const detectedUniverse =
        universeKeywords.find((u) => lowerRaw.includes(u)) ?? 'fiction'

      // Detect core trait
      const traitMap: Record<string, string> = {
        brave: 'brave',
        courage: 'brave',
        smart: 'smart',
        intelligent: 'smart',
        clever: 'smart',
        rebel: 'rebel',
        outsider: 'rebel',
        leader: 'leader',
        king: 'leader',
        queen: 'leader',
        hero: 'brave',
        wizard: 'smart',
        warrior: 'brave',
        trickster: 'rebel',
      }
      const detectedTrait =
        Object.keys(traitMap).find((k) => lowerRaw.includes(k)) ?? 'bold'

      const n1: NodeInput = {
        id: makeId('q1', 'character_name'),
        label: raw.slice(0, 25),
        description: 'Chosen character archetype',
        weight: 0.9,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      const n2: NodeInput = {
        id: makeId('q1', 'core_trait'),
        label: traitMap[detectedTrait] ?? detectedTrait,
        description: 'Dominant personality trait',
        weight: 0.8,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      const n3: NodeInput = {
        id: makeId('q1', 'universe'),
        label: detectedUniverse,
        description: 'World this character inhabits',
        weight: 0.5,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      nodes.push(n1, n2, n3)
      edges.push({ source: n1.id, target: n2.id, weight: 0.85, type: 'strong' as EdgeType })
      edges.push({ source: n1.id, target: n3.id, weight: 0.4, type: 'weak' as EdgeType })
      edges.push({ source: n2.id, target: n3.id, weight: 0.3, type: 'weak' as EdgeType })
      break
    }

    case 2: {
      // "Give up" question — shadow nodes
      const sources: string[] = chips && chips.length > 0
        ? chips
        : text.split(/[,،;]/).map((s) => s.trim()).filter(Boolean)

      sources.forEach((item, idx) => {
        const weight = Math.max(0.9 - idx * 0.15, 0.3)
        const n: NodeInput = {
          id: makeId('q2', item),
          label: item.slice(0, 25),
          description: 'Pattern or habit to release',
          weight,
          clusterId: 'shadow' as ClusterId,
          questionIndex: qi,
        }
        nodes.push(n)
      })

      // Connect shadow nodes weakly
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({ source: nodes[i].id, target: nodes[i + 1].id, weight: 0.3, type: 'weak' as EdgeType })
      }
      break
    }

    case 3: {
      // Goal question
      const raw = text.trim()

      // Split into up to 3 sub-goals using common separators
      const subGoals = raw
        .split(/[,،;.]|and\s+|also\s+/i)
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
        .slice(0, 3)

      if (subGoals.length === 0) subGoals.push(raw)

      subGoals.forEach((goal, idx) => {
        const weight = idx === 0 ? 0.9 : Math.max(0.7 - idx * 0.1, 0.4)
        const n: NodeInput = {
          id: makeId('q3', goal),
          label: goal.slice(0, 25),
          description: idx === 0 ? 'Primary goal' : 'Supporting goal',
          weight,
          clusterId: 'goal' as ClusterId,
          questionIndex: qi,
        }
        nodes.push(n)
      })

      // Connect goals strongly (main → sub)
      for (let i = 1; i < nodes.length; i++) {
        edges.push({ source: nodes[0].id, target: nodes[i].id, weight: 0.65, type: 'strong' as EdgeType })
      }
      break
    }

    case 4: {
      // Work/day question — ego + social mix
      const raw = text.trim()
      const lowerRaw = raw.toLowerCase()

      const workTypeMap: Record<string, string> = {
        freelance: 'freelance',
        remote: 'freelance',
        office: 'office',
        corporate: 'office',
        creative: 'creative',
        design: 'creative',
        art: 'creative',
        technical: 'technical',
        engineer: 'technical',
        dev: 'technical',
        code: 'technical',
        manage: 'leader',
        lead: 'leader',
        teach: 'social',
        coach: 'social',
      }
      const routineMap: Record<string, string> = {
        morning: 'morning person',
        early: 'morning person',
        night: 'night owl',
        late: 'night owl',
        busy: 'busy',
        hectic: 'busy',
        calm: 'calm',
        slow: 'calm',
        flexible: 'flexible',
      }

      const detectedWork =
        Object.keys(workTypeMap).find((k) => lowerRaw.includes(k)) ?? 'general'
      const detectedRoutine =
        Object.keys(routineMap).find((k) => lowerRaw.includes(k)) ?? 'balanced'

      const n1: NodeInput = {
        id: makeId('q4', 'work_type'),
        label: workTypeMap[detectedWork] ?? 'general work',
        description: 'Primary work style',
        weight: 0.75,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      const n2: NodeInput = {
        id: makeId('q4', 'routine'),
        label: routineMap[detectedRoutine] ?? 'balanced',
        description: 'Daily rhythm pattern',
        weight: 0.6,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      const n3: NodeInput = {
        id: makeId('q4', 'social_work'),
        label: lowerRaw.includes('team') || lowerRaw.includes('people')
          ? 'collaborative'
          : 'independent',
        description: 'Social dimension of work',
        weight: 0.55,
        clusterId: 'social' as ClusterId,
        questionIndex: qi,
      }
      nodes.push(n1, n2, n3)
      edges.push({ source: n1.id, target: n2.id, weight: 0.6, type: 'strong' as EdgeType })
      edges.push({ source: n1.id, target: n3.id, weight: 0.45, type: 'weak' as EdgeType })
      edges.push({ source: n2.id, target: n3.id, weight: 0.35, type: 'weak' as EdgeType })
      break
    }

    case 5: {
      // Social circle question
      const raw = text.trim()
      const lowerRaw = raw.toLowerCase()

      const introExtro = lowerRaw.includes('introvert') || lowerRaw.includes('alone') || lowerRaw.includes('solo')
        ? 'introvert'
        : lowerRaw.includes('extrovert') || lowerRaw.includes('social') || lowerRaw.includes('party')
          ? 'extrovert'
          : 'selective'

      const relationKeywords: string[] = ['family', 'friends', 'colleagues', 'partner', 'mentor', 'community']
      const foundRelations = relationKeywords.filter((k) => lowerRaw.includes(k))
      const primaryRelation = foundRelations[0] ?? 'close circle'

      const n1: NodeInput = {
        id: makeId('q5', 'social_style'),
        label: introExtro,
        description: 'Core social orientation',
        weight: 0.85,
        clusterId: 'social' as ClusterId,
        questionIndex: qi,
      }
      const n2: NodeInput = {
        id: makeId('q5', 'relation_type'),
        label: primaryRelation,
        description: 'Primary relationship sphere',
        weight: 0.7,
        clusterId: 'social' as ClusterId,
        questionIndex: qi,
      }
      nodes.push(n1, n2)

      if (foundRelations.length > 1) {
        const n3: NodeInput = {
          id: makeId('q5', 'secondary_relation'),
          label: foundRelations[1],
          description: 'Secondary relationship sphere',
          weight: 0.5,
          clusterId: 'social' as ClusterId,
          questionIndex: qi,
        }
        nodes.push(n3)
        edges.push({ source: n2.id, target: n3.id, weight: 0.4, type: 'weak' as EdgeType })
        edges.push({ source: n1.id, target: n3.id, weight: 0.35, type: 'weak' as EdgeType })
      }

      edges.push({ source: n1.id, target: n2.id, weight: 0.75, type: 'strong' as EdgeType })
      break
    }

    default: {
      // Generic fallback for unknown question indices
      const fallbackNode: NodeInput = {
        id: makeId(`q${qi}`, text.slice(0, 15)),
        label: text.slice(0, 20),
        description: 'User response',
        weight: 0.5,
        clusterId: 'ego' as ClusterId,
        questionIndex: qi,
      }
      nodes.push(fallbackNode)
      break
    }
  }

  // Add cross-question weak edges based on keyword overlap
  const crossEdges = buildWeakEdgesAcrossQuestions(nodes)
  edges.push(...crossEdges)

  const insight = buildDeterministicInsight(answer, nodes)

  return { nodes, edges, insight }
}

function buildDeterministicInsight(answer: OnboardingAnswer, nodes: NodeInput[]): string {
  const topNode = [...nodes].sort((a, b) => b.weight - a.weight)[0]
  const clusterLabel: Record<ClusterId, string> = {
    ego: 'identity',
    social: 'relationships',
    goal: 'aspirations',
    shadow: 'patterns to release',
  }
  if (!topNode) return `Your answer reveals depth in your ${clusterLabel['ego']}.`
  return `Your answer centers on "${topNode.label}", a key element of your ${clusterLabel[topNode.clusterId]}.`
}

// ─── PART 2: Grok (xAI) Integration ─────────────────────────────────────────

export function buildContextSummary(answers: OnboardingAnswer[]): string {
  if (answers.length === 0) return ''
  return answers
    .map((a) => `Q${a.questionIndex}: ${a.questionText} → ${a.answer}${a.chips?.length ? ` [${a.chips.join(', ')}]` : ''}`)
    .join(' | ')
}

async function callGrok(prompt: string): Promise<string> {
  if (!GROK_API_KEY) throw new Error('No Grok API key')

  const res = await fetch(GROK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      input: prompt,
    }),
  })

  if (!res.ok) {
    throw new Error(`Grok API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as {
    output?: Array<{ content?: Array<{ text?: string }> }>
    choices?: Array<{ message?: { content?: string } }>
  }

  // Responses API format: data.output[0].content[0].text
  const text =
    data.output?.[0]?.content?.[0]?.text ??
    // OpenAI-compat fallback
    data.choices?.[0]?.message?.content

  if (!text) throw new Error('Empty Grok response')
  return text
}

async function analyzeWithGrok(
  answer: OnboardingAnswer,
  context: string,
): Promise<AnswerAnalysis> {
  const prompt =
    SYSTEM_PROMPT +
    `\n\nQuestion: ${answer.questionText}\nAnswer: ${answer.answer}${answer.chips?.length ? `\nSelected chips: ${answer.chips.join(', ')}` : ''}\nContext: ${context}`

  const rawText = await callGrok(prompt)

  // Strip potential markdown code fences
  const cleaned = rawText.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()

  const parsed = JSON.parse(cleaned) as {
    nodes: Array<{
      id: string
      label: string
      weight: number
      clusterId: ClusterId
      description?: string
    }>
    edges: Array<{
      source: string
      target: string
      weight: number
      type: EdgeType
    }>
    insight: string
  }

  // Attach questionIndex to each node (Grok won't include this)
  const nodes: NodeInput[] = (parsed.nodes ?? []).map((n) => ({
    id: n.id,
    label: n.label,
    description: n.description,
    weight: Math.min(1, Math.max(0.1, n.weight)),
    clusterId: (['ego', 'social', 'goal', 'shadow'] as ClusterId[]).includes(n.clusterId)
      ? n.clusterId
      : 'ego',
    questionIndex: answer.questionIndex,
  }))

  const edges: EdgeInput[] = (parsed.edges ?? []).map((e) => ({
    source: e.source,
    target: e.target,
    weight: Math.min(1, Math.max(0.1, e.weight)),
    type: (['strong', 'weak', 'tension'] as EdgeType[]).includes(e.type) ? e.type : 'weak',
  }))

  return { nodes, edges, insight: parsed.insight ?? '' }
}

async function finalizeWithGrok(
  allNodes: NodeInput[],
  allAnswers: OnboardingAnswer[],
): Promise<FinalAnalysis> {
  const nodesSummary = allNodes
    .map((n) => `{id:"${n.id}",label:"${n.label}",clusterId:"${n.clusterId}",weight:${n.weight}}`)
    .join(', ')
  const answersSummary = buildContextSummary(allAnswers)

  const prompt =
    FINAL_SYSTEM_PROMPT +
    `\n\nAll nodes: [${nodesSummary}]\n\nAll answers context: ${answersSummary}`

  const rawText = await callGrok(prompt)
  const cleaned = rawText.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()

  const parsed = JSON.parse(cleaned) as {
    egoCenter: string[]
    socialRing: string[]
    goalSatellite: string[]
    shadowCluster: string[]
    dayPlan: Array<{ day: number; action: string; category: DayPlanItem['category'] }>
    personalityInsight: string
  }

  const validCategories: DayPlanItem['category'][] = ['habit', 'goal', 'social', 'health']

  return {
    egoCenter: parsed.egoCenter ?? [],
    socialRing: parsed.socialRing ?? [],
    goalSatellite: parsed.goalSatellite ?? [],
    shadowCluster: parsed.shadowCluster ?? [],
    dayPlan: (parsed.dayPlan ?? []).map((item) => ({
      day: item.day,
      action: item.action,
      category: validCategories.includes(item.category) ? item.category : 'habit',
    })),
    personalityInsight: parsed.personalityInsight ?? '',
  }
}

// ─── Deterministic finalize fallback ─────────────────────────────────────────

function generateDayPlanDeterministic(goalNodes: NodeInput[]): DayPlanItem[] {
  const categories: DayPlanItem['category'][] = ['habit', 'goal', 'social', 'health']
  const actionTemplates = [
    (label: string) => `Morning reflection on "${label}"`,
    (label: string) => `Write 3 intentions related to "${label}"`,
    (label: string) => `Take one small step toward "${label}"`,
    (label: string) => `Share your "${label}" journey with someone`,
    (label: string) => `Evening review: how does "${label}" feel today?`,
    (_label: string) => 'Shadow release: write one thing to let go of',
    (label: string) => `Weekly milestone check for "${label}"`,
    (_label: string) => 'Social connection: reach out to a close friend',
    (label: string) => `Visualize success in "${label}" for 5 minutes`,
    (_label: string) => 'Health boost: 20-minute walk or movement',
  ]

  const fallbackLabels = goalNodes.length > 0
    ? goalNodes.map((n) => n.label)
    : ['your goals']

  const days: DayPlanItem[] = []
  for (let day = 1; day <= 30; day++) {
    const labelIdx = (day - 1) % fallbackLabels.length
    const templateIdx = (day - 1) % actionTemplates.length
    const categoryIdx = (day - 1) % categories.length

    days.push({
      day,
      action: actionTemplates[templateIdx](fallbackLabels[labelIdx]),
      category: categories[categoryIdx],
    })
  }
  return days
}

function finalizeDeterministic(
  allNodes: NodeInput[],
  _allAnswers: OnboardingAnswer[],
): FinalAnalysis {
  const byCluster = (c: ClusterId): string[] =>
    allNodes
      .filter((n) => n.clusterId === c)
      .sort((a, b) => b.weight - a.weight)
      .map((n) => n.id)

  const egoNodes = allNodes.filter((n) => n.clusterId === 'ego').sort((a, b) => b.weight - a.weight).slice(0, 5)
  const goalNodes = allNodes.filter((n) => n.clusterId === 'goal').sort((a, b) => b.weight - a.weight)
  const egoLabels = egoNodes.map((n) => n.label)

  const personalityInsight =
    egoLabels.length > 0
      ? `You are defined by ${egoLabels.slice(0, 3).join(', ')}. These core values shape how you navigate the world and relate to others.`
      : 'Your personality constellation is unique and still emerging. Keep exploring.'

  return {
    egoCenter: byCluster('ego').slice(0, 5),
    socialRing: byCluster('social'),
    goalSatellite: byCluster('goal'),
    shadowCluster: byCluster('shadow'),
    dayPlan: generateDayPlanDeterministic(goalNodes),
    personalityInsight,
  }
}

// ─── PART 3: Public API ───────────────────────────────────────────────────────

export function isAiAvailable(): boolean {
  return Boolean(GROK_API_KEY && GROK_API_KEY.trim().length > 0)
}

export async function analyzeAnswer(
  answer: OnboardingAnswer,
  previousAnswers: OnboardingAnswer[],
): Promise<AnswerAnalysis> {
  if (isAiAvailable()) {
    try {
      const context = buildContextSummary(previousAnswers)
      return await analyzeWithGrok(answer, context)
    } catch (err) {
      console.warn('[aiAnalyzer] Grok failed, falling back to deterministic parser:', err)
    }
  }

  return parseAnswerDeterministic(answer)
}

export async function finalizeOnboarding(
  allNodes: NodeInput[],
  allAnswers: OnboardingAnswer[],
): Promise<FinalAnalysis> {
  if (isAiAvailable()) {
    try {
      return await finalizeWithGrok(allNodes, allAnswers)
    } catch (err) {
      console.warn('[aiAnalyzer] Grok finalize failed, falling back to deterministic:', err)
    }
  }

  return finalizeDeterministic(allNodes, allAnswers)
}
