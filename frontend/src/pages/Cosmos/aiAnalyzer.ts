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

// xAI Grok uses the OpenAI-compatible chat completions endpoint
const GROK_URL = 'https://api.x.ai/v1/chat/completions'
const GROK_MODEL = 'grok-3'

const SYSTEM_PROMPT = `You are a deep personality analyst for EthosLife — a Human Operating System.
Your role: extract a rich semantic knowledge graph from the user's answer. This graph will render as an interactive Obsidian-style constellation map showing who this person truly is.

Extract 10-14 nodes representing different facets visible in the answer:
- Core values and beliefs hidden in word choices
- Personality traits and archetypes
- Emotional patterns and inner drives
- Life themes that keep recurring
- Behavioral tendencies (how they act, not just what they say)
- Shadow patterns: fears, avoidances, things to overcome
- Aspirations and desires, even implicit ones
- Social orientation: how they relate to others
- Identity markers: how they see themselves
- Growth edges: where they're being called to grow

RULES:
1. Each node must have: id (short unique string), label (2-4 words max), weight (0.1-1.0 — higher = more central), clusterId (ego|social|goal|shadow), description (one revealing sentence)
2. ego = identity/values/self-image. social = relationships/others/world. goal = aspirations/desires/direction. shadow = fears/avoidances/patterns to release
3. Create 12-18 edges connecting related nodes: source, target, weight (0.1-1.0), type (strong|weak|tension)
4. strong (>0.6) = direct meaningful link. weak (<0.4) = thematic resonance. tension = contradiction or opposing force
5. Return ONLY raw JSON — no markdown, no code fences, no explanation whatsoever

JSON schema (no deviations):
{"nodes":[{"id":"string","label":"2-4 words","weight":0.1-1.0,"clusterId":"ego|social|goal|shadow","description":"one sentence"}],"edges":[{"source":"id","target":"id","weight":0.1-1.0,"type":"strong|weak|tension"}],"insight":"2-sentence deep psychological observation"}`

const FINAL_SYSTEM_PROMPT = `You are synthesizing a complete personality constellation for EthosLife.
Given all extracted nodes from 6 onboarding answers, create the final map and a personalized 30-day plan.

dayPlan actions must be specific, actionable, personal to this person based on their nodes.
personalityInsight must be a profound 2-3 sentence portrait of who this person is.

Return ONLY raw JSON:
{"egoCenter":["nodeId1"],"socialRing":["nodeId2"],"goalSatellite":["nodeId3"],"shadowCluster":["nodeId4"],"dayPlan":[{"day":1,"action":"specific personalized action","category":"habit|goal|social|health"}],"personalityInsight":"profound 2-3 sentence personality portrait"}`

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
      // Quote — reveals inner values, philosophy, emotional orientation
      const raw = text.trim()
      const lowerRaw = raw.toLowerCase()
      const quoteMatch = raw.match(/["""](.*?)["""]/s)
      const quoteText = (quoteMatch ? quoteMatch[1] : raw).trim()
      const authorMatch = raw.match(/(?:—|-|by)\s+([A-Za-zА-Яа-я\s.]{2,30})$/)
      const author = authorMatch ? authorMatch[1].trim() : ''

      const moodMap: Record<string, { label: string; cluster: ClusterId }> = {
        свобод: { label: 'Свобода', cluster: 'ego' },
        борь: { label: 'Борьба', cluster: 'shadow' },
        вдохновен: { label: 'Вдохновение', cluster: 'goal' },
        спокой: { label: 'Спокойствие', cluster: 'ego' },
        рост: { label: 'Рост', cluster: 'goal' },
        сил: { label: 'Сила', cluster: 'ego' },
        люб: { label: 'Любовь', cluster: 'social' },
        мечт: { label: 'Мечта', cluster: 'goal' },
        страх: { label: 'Преодоление страха', cluster: 'shadow' },
        смысл: { label: 'Поиск смысла', cluster: 'ego' },
        courage: { label: 'Courage', cluster: 'ego' },
        freedom: { label: 'Freedom', cluster: 'ego' },
        growth: { label: 'Growth', cluster: 'goal' },
        love: { label: 'Love', cluster: 'social' },
        fear: { label: 'Facing Fear', cluster: 'shadow' },
      }

      const n_core: NodeInput = { id: makeId('q0', 'quote_core'), label: quoteText.slice(0, 28), description: 'Цитата, которую выбрал человек — окно в его ценности', weight: 0.95, clusterId: 'ego', questionIndex: qi }
      const n_wisdom: NodeInput = { id: makeId('q0', 'wisdom'), label: 'Стремление к мудрости', description: 'Выбор цитаты говорит о рефлексивности и глубине', weight: 0.7, clusterId: 'ego', questionIndex: qi }
      const n_inspire: NodeInput = { id: makeId('q0', 'inspiration'), label: 'Источник силы', description: 'Слова как якорь и источник внутренней энергии', weight: 0.65, clusterId: 'goal', questionIndex: qi }
      const n_identity: NodeInput = { id: makeId('q0', 'identity'), label: 'Идентичность через слова', description: 'Цитата как зеркало внутреннего «Я»', weight: 0.75, clusterId: 'ego', questionIndex: qi }
      const n_aspire: NodeInput = { id: makeId('q0', 'aspiration'), label: 'Устремлённость', description: 'Желание стать тем, о чём говорит цитата', weight: 0.6, clusterId: 'goal', questionIndex: qi }
      nodes.push(n_core, n_wisdom, n_inspire, n_identity, n_aspire)

      // Detect mood/theme
      const foundMood = Object.entries(moodMap).find(([k]) => lowerRaw.includes(k))
      if (foundMood) {
        const n_mood: NodeInput = { id: makeId('q0', 'mood'), label: foundMood[1].label, description: 'Эмоциональный тон цитаты', weight: 0.8, clusterId: foundMood[1].cluster, questionIndex: qi }
        nodes.push(n_mood)
        edges.push({ source: n_core.id, target: n_mood.id, weight: 0.85, type: 'strong' })
        edges.push({ source: n_mood.id, target: n_aspire.id, weight: 0.55, type: 'weak' })
      }

      if (author) {
        const n_author: NodeInput = { id: makeId('q0', 'author'), label: author.slice(0, 22), description: 'Ориентир — авторитет или герой', weight: 0.55, clusterId: 'ego', questionIndex: qi }
        nodes.push(n_author)
        edges.push({ source: n_core.id, target: n_author.id, weight: 0.5, type: 'weak' })
      }

      const n_depth: NodeInput = { id: makeId('q0', 'depth'), label: 'Глубина мышления', description: 'Цитата говорит об интеллектуальной чувствительности', weight: 0.6, clusterId: 'ego', questionIndex: qi }
      const n_change: NodeInput = { id: makeId('q0', 'change'), label: 'Желание перемен', description: 'Вдохновляющий текст часто указывает на запрос трансформации', weight: 0.5, clusterId: 'goal', questionIndex: qi }
      nodes.push(n_depth, n_change)

      edges.push({ source: n_core.id, target: n_wisdom.id, weight: 0.75, type: 'strong' })
      edges.push({ source: n_core.id, target: n_identity.id, weight: 0.8, type: 'strong' })
      edges.push({ source: n_wisdom.id, target: n_inspire.id, weight: 0.6, type: 'strong' })
      edges.push({ source: n_identity.id, target: n_aspire.id, weight: 0.6, type: 'weak' })
      edges.push({ source: n_inspire.id, target: n_change.id, weight: 0.55, type: 'weak' })
      edges.push({ source: n_wisdom.id, target: n_depth.id, weight: 0.65, type: 'strong' })
      break
    }

    case 1: {
      // Character/archetype — reveals self-image, shadow projection, role in the world
      const raw = text.trim()
      const lowerRaw = raw.toLowerCase()

      const universeMap: Record<string, string> = { 'marvel': 'Marvel', 'dc': 'DC', 'star wars': 'Star Wars', 'гарри': 'Harry Potter', 'harry potter': 'Harry Potter', 'толкин': 'Tolkien', 'властелин': 'Tolkien', 'игра престолов': 'GoT', 'game of thrones': 'GoT', 'аниме': 'Аниме', 'anime': 'Аниме', 'дисней': 'Disney', 'pixar': 'Pixar' }
      const traitMap: Record<string, { label: string; shadow: string }> = {
        'герой': { label: 'Героизм', shadow: 'Страх не справиться' }, 'hero': { label: 'Героizm', shadow: 'Fear of failure' },
        'бунтар': { label: 'Бунт', shadow: 'Отчуждение' }, 'rebel': { label: 'Бунт', shadow: 'Isolation' },
        'мудр': { label: 'Мудрость', shadow: 'Холодность' }, 'wizard': { label: 'Мудрость', shadow: 'Coldness' },
        'лидер': { label: 'Лидерство', shadow: 'Одиночество' }, 'leader': { label: 'Лидерство', shadow: 'Loneliness' },
        'воин': { label: 'Воля', shadow: 'Гнев' }, 'warrior': { label: 'Воля', shadow: 'Anger' },
        'детектив': { label: 'Проницательность', shadow: 'Недоверие' }, 'detective': { label: 'Проницательность', shadow: 'Distrust' },
      }

      const n_char: NodeInput = { id: makeId('q1', 'character'), label: raw.slice(0, 26), description: 'Выбранный архетип как зеркало самовосприятия', weight: 0.95, clusterId: 'ego', questionIndex: qi }
      const n_archetype: NodeInput = { id: makeId('q1', 'archetype'), label: 'Архетип героя', description: 'Роль, которую человек хочет играть в жизни', weight: 0.85, clusterId: 'ego', questionIndex: qi }
      const n_selfimage: NodeInput = { id: makeId('q1', 'self_image'), label: 'Образ себя', description: 'Идеализированное «Я» через фантастический образ', weight: 0.8, clusterId: 'ego', questionIndex: qi }
      const n_projection: NodeInput = { id: makeId('q1', 'projection'), label: 'Ролевая проекция', description: 'Качества персонажа как желаемые качества', weight: 0.7, clusterId: 'goal', questionIndex: qi }
      const n_myth: NodeInput = { id: makeId('q1', 'mythology'), label: 'Мифологичность', description: 'Стремление жить в большом нарративе', weight: 0.55, clusterId: 'ego', questionIndex: qi }
      nodes.push(n_char, n_archetype, n_selfimage, n_projection, n_myth)

      const foundTrait = Object.entries(traitMap).find(([k]) => lowerRaw.includes(k))
      if (foundTrait) {
        const [, { label, shadow }] = foundTrait
        const n_trait: NodeInput = { id: makeId('q1', 'core_trait'), label, description: 'Доминирующая черта персонажа', weight: 0.85, clusterId: 'ego', questionIndex: qi }
        const n_shadow: NodeInput = { id: makeId('q1', 'shadow_trait'), label: shadow, description: 'Тень архетипа — то, с чем работает', weight: 0.65, clusterId: 'shadow', questionIndex: qi }
        nodes.push(n_trait, n_shadow)
        edges.push({ source: n_char.id, target: n_trait.id, weight: 0.9, type: 'strong' })
        edges.push({ source: n_trait.id, target: n_shadow.id, weight: 0.45, type: 'tension' })
      }

      const foundUniverse = Object.entries(universeMap).find(([k]) => lowerRaw.includes(k))
      if (foundUniverse) {
        const n_universe: NodeInput = { id: makeId('q1', 'universe'), label: foundUniverse[1], description: 'Мир, который резонирует с мировоззрением', weight: 0.5, clusterId: 'ego', questionIndex: qi }
        nodes.push(n_universe)
        edges.push({ source: n_char.id, target: n_universe.id, weight: 0.5, type: 'weak' })
      }

      const n_purpose: NodeInput = { id: makeId('q1', 'purpose'), label: 'Ощущение предназначения', description: 'Идентификация с героем указывает на поиск миссии', weight: 0.7, clusterId: 'goal', questionIndex: qi }
      const n_values: NodeInput = { id: makeId('q1', 'values'), label: 'Ценностный ориентир', description: 'Персонаж воплощает то, что ценно', weight: 0.65, clusterId: 'ego', questionIndex: qi }
      nodes.push(n_purpose, n_values)

      edges.push({ source: n_char.id, target: n_archetype.id, weight: 0.85, type: 'strong' })
      edges.push({ source: n_archetype.id, target: n_selfimage.id, weight: 0.75, type: 'strong' })
      edges.push({ source: n_selfimage.id, target: n_projection.id, weight: 0.65, type: 'weak' })
      edges.push({ source: n_projection.id, target: n_purpose.id, weight: 0.6, type: 'strong' })
      edges.push({ source: n_archetype.id, target: n_values.id, weight: 0.7, type: 'strong' })
      edges.push({ source: n_myth.id, target: n_purpose.id, weight: 0.5, type: 'weak' })
      break
    }

    case 2: {
      // What to give up — shadow clusters, blockages, patterns
      const sources: string[] = chips && chips.length > 0
        ? chips
        : text.split(/[,،;.\n]/).map((s) => s.trim()).filter((s) => s.length > 1)

      // Each stated item + its deeper implications
      sources.slice(0, 6).forEach((item, idx) => {
        const weight = Math.max(0.92 - idx * 0.12, 0.45)
        const n_item: NodeInput = { id: makeId('q2', item + idx), label: item.slice(0, 26), description: 'Паттерн или привычка для освобождения', weight, clusterId: 'shadow', questionIndex: qi }
        nodes.push(n_item)
        if (idx > 0) edges.push({ source: nodes[0].id, target: n_item.id, weight: 0.35, type: 'weak' })
      })

      // Derived nodes about letting go
      const n_release: NodeInput = { id: makeId('q2', 'release'), label: 'Запрос на освобождение', description: 'Осознанное желание перемен и отпускания', weight: 0.8, clusterId: 'goal', questionIndex: qi }
      const n_block: NodeInput = { id: makeId('q2', 'blockage'), label: 'Внутренние блоки', description: 'То, что мешает двигаться вперёд', weight: 0.75, clusterId: 'shadow', questionIndex: qi }
      const n_courage: NodeInput = { id: makeId('q2', 'courage'), label: 'Смелость признать', description: 'Способность честно назвать проблему', weight: 0.7, clusterId: 'ego', questionIndex: qi }
      const n_growth: NodeInput = { id: makeId('q2', 'growth_desire'), label: 'Желание роста', description: 'Отказ от старого ради нового', weight: 0.65, clusterId: 'goal', questionIndex: qi }
      const n_aware: NodeInput = { id: makeId('q2', 'self_awareness'), label: 'Самосознание', description: 'Человек видит собственные паттерны', weight: 0.72, clusterId: 'ego', questionIndex: qi }
      nodes.push(n_release, n_block, n_courage, n_growth, n_aware)

      if (nodes.length > 0) {
        edges.push({ source: nodes[0].id, target: n_block.id, weight: 0.7, type: 'strong' })
        edges.push({ source: n_block.id, target: n_release.id, weight: 0.75, type: 'tension' })
        edges.push({ source: n_release.id, target: n_growth.id, weight: 0.8, type: 'strong' })
        edges.push({ source: n_aware.id, target: n_block.id, weight: 0.6, type: 'strong' })
        edges.push({ source: n_courage.id, target: n_release.id, weight: 0.65, type: 'strong' })
      }
      break
    }

    case 3: {
      // Goals — aspirations, direction, deeper motivations behind goals
      const raw = text.trim()
      const subGoals = raw.split(/[,،;.\n]|и\s+|также\s+/i).map((s) => s.trim()).filter((s) => s.length > 2).slice(0, 5)
      if (subGoals.length === 0) subGoals.push(raw)

      subGoals.forEach((goal, idx) => {
        const weight = idx === 0 ? 0.92 : Math.max(0.75 - idx * 0.1, 0.45)
        nodes.push({ id: makeId('q3', goal + idx), label: goal.slice(0, 26), description: idx === 0 ? 'Главная цель' : 'Поддерживающая цель', weight, clusterId: 'goal', questionIndex: qi })
      })

      // Deeper psychological meaning of goals
      const n_direction: NodeInput = { id: makeId('q3', 'direction'), label: 'Направление жизни', description: 'Куда движется человек в глобальном смысле', weight: 0.85, clusterId: 'goal', questionIndex: qi }
      const n_drive: NodeInput = { id: makeId('q3', 'inner_drive'), label: 'Внутренний драйв', description: 'Энергия, стоящая за целями', weight: 0.8, clusterId: 'ego', questionIndex: qi }
      const n_impact: NodeInput = { id: makeId('q3', 'impact'), label: 'Стремление к влиянию', description: 'Желание оставить след или изменить что-то', weight: 0.7, clusterId: 'goal', questionIndex: qi }
      const n_commitment: NodeInput = { id: makeId('q3', 'commitment'), label: 'Приверженность', description: 'Степень серьёзности намерений', weight: 0.65, clusterId: 'ego', questionIndex: qi }
      const n_fear_fail: NodeInput = { id: makeId('q3', 'fear_failure'), label: 'Страх не достичь', description: 'Тень амбиций — страх неудачи', weight: 0.5, clusterId: 'shadow', questionIndex: qi }
      nodes.push(n_direction, n_drive, n_impact, n_commitment, n_fear_fail)

      if (nodes.length > 0) {
        edges.push({ source: nodes[0].id, target: n_direction.id, weight: 0.85, type: 'strong' })
        edges.push({ source: n_direction.id, target: n_drive.id, weight: 0.7, type: 'strong' })
        edges.push({ source: n_drive.id, target: n_impact.id, weight: 0.65, type: 'weak' })
        edges.push({ source: n_commitment.id, target: n_direction.id, weight: 0.6, type: 'strong' })
        edges.push({ source: n_drive.id, target: n_fear_fail.id, weight: 0.4, type: 'tension' })
        for (let i = 1; i < Math.min(nodes.length - 5, 5); i++) {
          edges.push({ source: nodes[0].id, target: nodes[i].id, weight: 0.6, type: 'strong' })
        }
      }
      break
    }

    case 4: {
      // Work & daily life — energy type, rhythms, professional identity
      const raw = text.trim()
      const lowerRaw = raw.toLowerCase()

      const workTypeMap: Record<string, { label: string; cluster: ClusterId }> = {
        фриланс: { label: 'Фриланс', cluster: 'ego' }, freelance: { label: 'Freelance', cluster: 'ego' },
        удалённ: { label: 'Удалёнка', cluster: 'ego' }, remote: { label: 'Remote', cluster: 'ego' },
        офис: { label: 'Офис', cluster: 'social' }, office: { label: 'Office', cluster: 'social' },
        творч: { label: 'Творчество', cluster: 'goal' }, creative: { label: 'Creative', cluster: 'goal' },
        дизайн: { label: 'Дизайн', cluster: 'goal' }, design: { label: 'Design', cluster: 'goal' },
        техн: { label: 'Технологии', cluster: 'ego' }, engineer: { label: 'Engineering', cluster: 'ego' },
        код: { label: 'Программирование', cluster: 'ego' }, code: { label: 'Coding', cluster: 'ego' },
        управля: { label: 'Управление', cluster: 'social' }, manage: { label: 'Management', cluster: 'social' },
        учу: { label: 'Обучение других', cluster: 'social' }, teach: { label: 'Teaching', cluster: 'social' },
      }
      const found = Object.entries(workTypeMap).find(([k]) => lowerRaw.includes(k))

      const n_work: NodeInput = { id: makeId('q4', 'work_core'), label: found ? found[1].label : 'Профессиональная жизнь', description: 'Основная профессиональная сфера', weight: 0.85, clusterId: found ? found[1].cluster : 'ego', questionIndex: qi }
      const n_rhythm: NodeInput = { id: makeId('q4', 'rhythm'), label: lowerRaw.includes('утр') || lowerRaw.includes('morn') ? 'Жаворонок' : lowerRaw.includes('ноч') || lowerRaw.includes('night') ? 'Сова' : 'Гибкий ритм', description: 'Биологический и жизненный ритм', weight: 0.7, clusterId: 'ego', questionIndex: qi }
      const n_energy: NodeInput = { id: makeId('q4', 'energy'), label: lowerRaw.includes('команд') || lowerRaw.includes('team') ? 'Командная энергия' : 'Сольная энергия', description: 'Откуда черпает силы — из команды или одиночества', weight: 0.75, clusterId: 'social', questionIndex: qi }
      const n_focus: NodeInput = { id: makeId('q4', 'focus'), label: 'Фокус внимания', description: 'Способность концентрироваться и продуктивность', weight: 0.65, clusterId: 'ego', questionIndex: qi }
      const n_purpose_work: NodeInput = { id: makeId('q4', 'work_purpose'), label: 'Смысл в работе', description: 'Насколько работа связана с призванием', weight: 0.7, clusterId: 'goal', questionIndex: qi }
      const n_routine: NodeInput = { id: makeId('q4', 'routine_quality'), label: 'Качество дня', description: 'Удовлетворённость ежедневной рутиной', weight: 0.6, clusterId: 'ego', questionIndex: qi }
      const n_stress: NodeInput = { id: makeId('q4', 'stress'), label: 'Рабочий стресс', description: 'Напряжения и давления в профессиональной жизни', weight: 0.55, clusterId: 'shadow', questionIndex: qi }
      const n_identity_work: NodeInput = { id: makeId('q4', 'identity_work'), label: 'Профессиональная идентичность', description: 'Насколько работа определяет личность', weight: 0.72, clusterId: 'ego', questionIndex: qi }
      nodes.push(n_work, n_rhythm, n_energy, n_focus, n_purpose_work, n_routine, n_stress, n_identity_work)

      edges.push({ source: n_work.id, target: n_rhythm.id, weight: 0.65, type: 'strong' })
      edges.push({ source: n_work.id, target: n_energy.id, weight: 0.7, type: 'strong' })
      edges.push({ source: n_work.id, target: n_identity_work.id, weight: 0.75, type: 'strong' })
      edges.push({ source: n_rhythm.id, target: n_focus.id, weight: 0.6, type: 'weak' })
      edges.push({ source: n_purpose_work.id, target: n_work.id, weight: 0.65, type: 'weak' })
      edges.push({ source: n_stress.id, target: n_focus.id, weight: 0.45, type: 'tension' })
      edges.push({ source: n_routine.id, target: n_stress.id, weight: 0.4, type: 'weak' })
      break
    }

    case 5: {
      // Social world — relationships, belonging, intimacy, loneliness
      const raw = text.trim()
      const lowerRaw = raw.toLowerCase()

      const orientMap: Record<string, string> = {
        интроверт: 'Интроверт', introvert: 'Интроверт', один: 'Интроверт', alone: 'Интроверт',
        экстраверт: 'Экстраверт', extrovert: 'Экстраверт', общительн: 'Экстраверт', social: 'Экстраверт',
        амбиверт: 'Амбиверт',
      }
      const orientation = Object.entries(orientMap).find(([k]) => lowerRaw.includes(k))?.[1] ?? 'Амбиверт'

      const relKeywords: Array<{ key: string; label: string }> = [
        { key: 'семь', label: 'Семья' }, { key: 'family', label: 'Семья' },
        { key: 'друз', label: 'Друзья' }, { key: 'friend', label: 'Друзья' },
        { key: 'партнёр', label: 'Партнёр' }, { key: 'partner', label: 'Партнёр' }, { key: 'любим', label: 'Партнёр' },
        { key: 'коллег', label: 'Коллеги' }, { key: 'colleague', label: 'Коллеги' },
        { key: 'ментор', label: 'Наставник' }, { key: 'mentor', label: 'Наставник' },
        { key: 'сообществ', label: 'Сообщество' }, { key: 'community', label: 'Сообщество' },
      ]
      const foundRelations = relKeywords.filter(({ key }) => lowerRaw.includes(key))

      const n_orient: NodeInput = { id: makeId('q5', 'orientation'), label: orientation, description: 'Базовая социальная ориентация', weight: 0.9, clusterId: 'social', questionIndex: qi }
      const n_belonging: NodeInput = { id: makeId('q5', 'belonging'), label: 'Принадлежность', description: 'Потребность в ощущении «своих»', weight: 0.8, clusterId: 'social', questionIndex: qi }
      const n_trust: NodeInput = { id: makeId('q5', 'trust'), label: 'Доверие', description: 'Способность и желание доверять', weight: 0.75, clusterId: 'social', questionIndex: qi }
      const n_depth_rel: NodeInput = { id: makeId('q5', 'depth'), label: 'Глубина связей', description: 'Предпочтение глубоких vs поверхностных отношений', weight: 0.7, clusterId: 'social', questionIndex: qi }
      const n_lonely: NodeInput = { id: makeId('q5', 'loneliness'), label: 'Одиночество', description: 'Опыт изоляции или желание уединения', weight: 0.55, clusterId: 'shadow', questionIndex: qi }
      const n_impact_social: NodeInput = { id: makeId('q5', 'social_impact'), label: 'Влияние на людей', description: 'Желание оказывать влияние или поддержку', weight: 0.65, clusterId: 'goal', questionIndex: qi }
      nodes.push(n_orient, n_belonging, n_trust, n_depth_rel, n_lonely, n_impact_social)

      foundRelations.slice(0, 4).forEach(({ label }, idx) => {
        const n: NodeInput = { id: makeId('q5', 'rel_' + idx), label, description: 'Ключевая сфера отношений', weight: 0.7 - idx * 0.1, clusterId: 'social', questionIndex: qi }
        nodes.push(n)
        edges.push({ source: n_belonging.id, target: n.id, weight: 0.65, type: 'strong' })
      })

      edges.push({ source: n_orient.id, target: n_belonging.id, weight: 0.8, type: 'strong' })
      edges.push({ source: n_belonging.id, target: n_trust.id, weight: 0.75, type: 'strong' })
      edges.push({ source: n_trust.id, target: n_depth_rel.id, weight: 0.7, type: 'strong' })
      edges.push({ source: n_orient.id, target: n_lonely.id, weight: 0.4, type: 'tension' })
      edges.push({ source: n_depth_rel.id, target: n_impact_social.id, weight: 0.55, type: 'weak' })
      break
    }

    default: {
      const fallbackNode: NodeInput = { id: makeId(`q${qi}`, text.slice(0, 15)), label: text.slice(0, 22), description: 'Ответ пользователя', weight: 0.6, clusterId: 'ego', questionIndex: qi }
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

async function callGrok(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!GROK_API_KEY) throw new Error('No Grok API key')

  const res = await fetch(GROK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`Grok API error: ${res.status} ${res.statusText} — ${errBody}`)
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty Grok response')
  return text
}

async function analyzeWithGrok(
  answer: OnboardingAnswer,
  context: string,
): Promise<AnswerAnalysis> {
  const userPrompt =
    `Question: ${answer.questionText}\nAnswer: ${answer.answer}${answer.chips?.length ? `\nSelected chips: ${answer.chips.join(', ')}` : ''}${context ? `\n\nPrevious context about this person: ${context}` : ''}`

  const rawText = await callGrok(SYSTEM_PROMPT, userPrompt)

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

  const userPrompt =
    `All personality nodes extracted so far: [${nodesSummary}]\n\nAll 6 answers: ${answersSummary}`

  const rawText = await callGrok(FINAL_SYSTEM_PROMPT, userPrompt)
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
