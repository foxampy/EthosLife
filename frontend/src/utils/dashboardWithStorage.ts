// Dashboard utilities with temporary storage support
// Uses tempStorage for guest users, real data for authenticated users

import type {
  DashboardState,
  HealthScore,
  ChecklistItem,
  ActivityData,
  NutritionSummary,
  SleepSummary,
  MoodData,
  HabitStreak,
  UpcomingEvent,
  AIInsight,
  SocialActivity,
  Challenge,
  BodyMetrics,
  GamificationData,
} from '../types/dashboard';

import { tempStorage } from '../services/tempStorage';

// Helper to get today's date formatted
export const getTodayFormatted = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Default empty state (no demo data)
export const getEmptyDashboardState = (): DashboardState => ({
  healthScore: {
    overall: 0,
    breakdown: {
      nutrition: 0,
      fitness: 0,
      sleep: 0,
      mental: 0,
      medical: 0,
      body: 0,
      environment: 0,
    },
    trend: 'stable',
    lastWeekScore: 0,
  },
  todayProgress: {
    checklist: [],
    completionRate: 0,
  },
  widgets: {
    activity: {
      move: { current: 0, goal: 600, color: '#ef4444' },
      exercise: { current: 0, goal: 30, color: '#22c55e' },
      stand: { current: 0, goal: 12, color: '#3b82f6' },
      steps: { current: 0, goal: 10000 },
      calories: 0,
      activeMinutes: 0,
    },
    nutrition: {
      caloriesConsumed: 0,
      caloriesGoal: 2200,
      protein: { current: 0, goal: 140 },
      carbs: { current: 0, goal: 250 },
      fats: { current: 0, goal: 73 },
      lastMeal: null,
      waterIntake: 0,
      waterGoal: 3000,
    },
    sleep: {
      score: 0,
      duration: '0h 0m',
      durationMinutes: 0,
      bedTime: '',
      wakeTime: '',
      quality: 'unknown',
      sleepDebt: 0,
    },
    mood: {
      todayMood: 0,
      todayEmoji: '😐',
      weekData: [],
      stressLevel: 0,
    },
    habits: [],
    events: [],
  },
  aiInsights: [],
  social: {
    activities: [],
    challenges: [],
    unreadMessages: 0,
  },
  bodyMetrics: {
    weight: {
      current: 0,
      trend: [],
      unit: 'kg',
    },
    bmi: { value: 0, category: 'Unknown' },
    measurements: { chest: 0, waist: 0, hips: 0 },
    goalProgress: 0,
  },
  gamification: {
    level: 1,
    xp: 0,
    xpToNext: 500,
    recentBadges: [],
    dailyChallenge: { title: 'Начните с малого', progress: 0, total: 1 },
    weeklyChallenge: { title: 'Первая неделя', progress: 0, total: 7 },
    leaderboardPosition: 0,
  },
});

// Get dashboard state from temp storage or return empty state
export const getDashboardState = (): DashboardState => {
  // Try to get from temp storage first
  const stored = tempStorage.get(tempStorage.DATA_TYPES.DASHBOARD);
  
  if (stored) {
    return stored as DashboardState;
  }
  
  // Return empty state (user needs to input their data)
  return getEmptyDashboardState();
};

// Save dashboard state to temp storage
export const saveDashboardState = (state: Partial<DashboardState>): boolean => {
  const current = getDashboardState();
  const merged = { ...current, ...state };
  return tempStorage.save(tempStorage.DATA_TYPES.DASHBOARD, merged);
};

// Checklist operations
export const addChecklistItem = (item: Omit<ChecklistItem, 'id'>): boolean => {
  const state = getDashboardState();
  const newItem: ChecklistItem = {
    ...item,
    id: `item_${Date.now()}`,
  };
  return saveDashboardState({
    todayProgress: {
      checklist: [...state.todayProgress.checklist, newItem],
      completionRate: calculateCompletionRate([...state.todayProgress.checklist, newItem]),
    },
  });
};

export const toggleChecklistItem = (id: string): boolean => {
  const state = getDashboardState();
  const updated = state.todayProgress.checklist.map(item =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );
  return saveDashboardState({
    todayProgress: {
      checklist: updated,
      completionRate: calculateCompletionRate(updated),
    },
  });
};

export const removeChecklistItem = (id: string): boolean => {
  const state = getDashboardState();
  const updated = state.todayProgress.checklist.filter(item => item.id !== id);
  return saveDashboardState({
    todayProgress: {
      checklist: updated,
      completionRate: calculateCompletionRate(updated),
    },
  });
};

const calculateCompletionRate = (checklist: ChecklistItem[]): number => {
  if (checklist.length === 0) return 0;
  return Math.round((checklist.filter(i => i.completed).length / checklist.length) * 100);
};

// Activity operations
export const updateActivity = (activity: Partial<ActivityData>): boolean => {
  const state = getDashboardState();
  return saveDashboardState({
    widgets: {
      ...state.widgets,
      activity: { ...state.widgets.activity, ...activity },
    },
  });
};

// Nutrition operations
export const updateNutrition = (nutrition: Partial<NutritionSummary>): boolean => {
  const state = getDashboardState();
  return saveDashboardState({
    widgets: {
      ...state.widgets,
      nutrition: { ...state.widgets.nutrition, ...nutrition },
    },
  });
};

// Sleep operations
export const updateSleep = (sleep: Partial<SleepSummary>): boolean => {
  const state = getDashboardState();
  return saveDashboardState({
    widgets: {
      ...state.widgets,
      sleep: { ...state.widgets.sleep, ...sleep },
    },
  });
};

// Mood operations
export const updateMood = (mood: number, stressLevel?: number): boolean => {
  const state = getDashboardState();
  const emojis = ['😢', '😔', '😐', '🙂', '😊', '🤩'];
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const newWeekData = [...state.widgets.mood.weekData];
  
  // Remove today's entry if exists
  const todayIndex = newWeekData.findIndex(d => d.date === today);
  if (todayIndex >= 0) {
    newWeekData[todayIndex] = { date: today, mood, emoji: emojis[mood] || '😐' };
  } else {
    newWeekData.push({ date: today, mood, emoji: emojis[mood] || '😐' });
  }
  
  // Keep only last 7 days
  if (newWeekData.length > 7) {
    newWeekData.shift();
  }
  
  return saveDashboardState({
    widgets: {
      ...state.widgets,
      mood: {
        ...state.widgets.mood,
        todayMood: mood,
        todayEmoji: emojis[mood] || '😐',
        weekData: newWeekData,
        stressLevel: stressLevel ?? state.widgets.mood.stressLevel,
      },
    },
  });
};

// Body metrics operations
export const updateBodyMetrics = (metrics: Partial<BodyMetrics>): boolean => {
  const state = getDashboardState();
  return saveDashboardState({
    bodyMetrics: { ...state.bodyMetrics, ...metrics },
  });
};

// Utility functions
export const calculateRingProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

export const getMoodEmoji = (mood: number): string => {
  const emojis = ['😢', '😔', '😐', '🙂', '😊', '🤩'];
  return emojis[mood] || '😐';
};

export const getQualityColor = (quality: string): string => {
  const colors: Record<string, string> = {
    excellent: '#22c55e',
    good: '#84cc16',
    fair: '#eab308',
    poor: '#ef4444',
    unknown: '#84cc16',
  };
  return colors[quality] || '#84cc16';
};

export const getInsightIcon = (type: string): string => {
  const icons: Record<string, string> = {
    tip: '💡',
    pattern: '📊',
    goal: '🎯',
    fact: '🧠',
    recommendation: '✨',
  };
  return icons[type] || '💡';
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Health score calculation based on available data
export const calculateHealthScore = (state: DashboardState): number => {
  const scores: number[] = [];
  
  // Activity score
  if (state.widgets.activity.steps.current > 0) {
    const stepProgress = calculateRingProgress(state.widgets.activity.steps.current, state.widgets.activity.steps.goal);
    scores.push(stepProgress * 0.3);
  }
  
  // Nutrition score
  if (state.widgets.nutrition.caloriesConsumed > 0) {
    const calorieProgress = calculateRingProgress(
      state.widgets.nutrition.caloriesConsumed,
      state.widgets.nutrition.caloriesGoal
    );
    scores.push(calorieProgress * 0.2);
  }
  
  // Sleep score
  if (state.widgets.sleep.durationMinutes > 0) {
    const sleepScore = state.widgets.sleep.score || 50;
    scores.push(sleepScore * 0.25);
  }
  
  // Mood score
  if (state.widgets.mood.todayMood > 0) {
    const moodScore = (state.widgets.mood.todayMood / 5) * 100;
    scores.push(moodScore * 0.25);
  }
  
  if (scores.length === 0) return 0;
  
  const total = scores.reduce((a, b) => a + b, 0);
  return Math.round(total / scores.length * scores.length / (scores.length * 0.25));
};
