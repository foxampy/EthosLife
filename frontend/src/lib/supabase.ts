import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ehftgqroqzggfhwgmjgj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZnRncXJvcXpnZ2Zod2dtamdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTEyMTQsImV4cCI6MjA5NDI4NzIxNH0.r8gI58CM7RbQvnEeIEzzMBttSGmijNma3aUggI8fToI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function syncCosmosToSupabase(userId: string, data: {
  phase: string
  answers: unknown[]
  nodes: unknown[]
  edges: unknown[]
  clusters: unknown[]
  finalAnalysis: unknown | null
  dayPlan: unknown[]
  personalityInsight: string
  magicMomentComplete: boolean
  aiMessages: unknown[]
}) {
  const { error } = await supabase
    .from('cosmos_profiles')
    .upsert({
      user_id: userId,
      phase: data.phase,
      answers: data.answers,
      nodes: data.nodes,
      edges: data.edges,
      clusters: data.clusters,
      final_analysis: data.finalAnalysis,
      day_plan: data.dayPlan,
      personality_insight: data.personalityInsight,
      magic_moment_complete: data.magicMomentComplete,
      ai_messages: data.aiMessages,
    }, { onConflict: 'user_id' })

  if (error) console.error('Supabase sync error:', error)
}

export async function loadCosmosFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('cosmos_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}
