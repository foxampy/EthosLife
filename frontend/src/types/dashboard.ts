// Dashboard v2 Types

export interface HealthScore {
  overall: number;
  breakdown: Record<string, number>;
  trend: 'up' | 'down' | 'stable';
  lastWeekScore: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  type: 'morning' | 'medication' | 'water' | 'sleep' | 'mood';
  time?: string;
}

export interface ActivityData {
  move: { current: number; goal: number; color: string };
  exercise: { current: number; goal: number; color: string };
  stand: { current: number; goal: number; color: string };
  steps: { current: number; goal: number };
  calories: number;
  activeMinutes: number;
}

export interface NutritionSummary {
  caloriesConsumed: number;
  caloriesGoal: number;
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fats: { current: number; goal: number };
  lastMeal: { name: string; time: string; calories: number };
  waterIntake: number;
  waterGoal: number;
}

export interface SleepSummary {
  score: number;
  duration: string;
  durationMinutes: number;
  bedTime: string;
  wakeTime: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  sleepDebt: number;
}

export interface MoodEntry {
  date: string;
  mood: number;
  emoji: string;
}

export interface MoodData {
  todayMood: number;
  todayEmoji: string;
  weekData: MoodEntry[];
  stressLevel: number;
}

export interface HabitStreak {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  icon: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  type: 'medication' | 'appointment' | 'workout' | 'social';
  time: string;
  description?: string;
  completed?: boolean;
}

export interface AIInsight {
  id: string;
  type: 'tip' | 'pattern' | 'goal' | 'fact' | 'recommendation';
  title: string;
  description: string;
  timestamp: string;
  actionable: boolean;
  actionText?: string;
}

export interface SocialActivity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

export interface Challenge {
  id: string;
  name: string;
  progress: number;
  total: number;
  participants: number;
}

export interface BodyMetrics {
  weight: { current: number; trend: number[]; unit: string };
  bmi: { value: number; category: string };
  measurements: Record<string, number>;
  goalProgress: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GamificationData {
  level: number;
  xp: number;
  xpToNext: number;
  recentBadges: Achievement[];
  dailyChallenge: { title: string; progress: number; total: number };
  weeklyChallenge: { title: string; progress: number; total: number };
  leaderboardPosition: number;
}

export interface DashboardState {
  healthScore: HealthScore;
  todayProgress: {
    checklist: ChecklistItem[];
    completionRate: number;
  };
  widgets: {
    activity: ActivityData;
    nutrition: NutritionSummary;
    sleep: SleepSummary;
    mood: MoodData;
    habits: HabitStreak[];
    events: UpcomingEvent[];
  };
  aiInsights: AIInsight[];
  social: {
    activities: SocialActivity[];
    challenges: Challenge[];
    unreadMessages: number;
  };
  bodyMetrics: BodyMetrics;
  gamification: GamificationData;
}
