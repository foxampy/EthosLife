// Dashboard utilities and mock data

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

// Helper to get today's date formatted
export const getTodayFormatted = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Mock Health Score
export const mockHealthScore: HealthScore = {
  overall: 87,
  breakdown: {
    nutrition: 85,
    fitness: 92,
    sleep: 78,
    mental: 88,
    medical: 95,
    body: 82,
    environment: 90,
  },
  trend: 'up',
  lastWeekScore: 82,
};

// Mock Checklist Items
export const mockChecklist: ChecklistItem[] = [
  { id: '1', title: 'Morning Stretch', completed: true, type: 'morning', time: '7:00 AM' },
  { id: '2', title: 'Hydrate (500ml)', completed: true, type: 'water', time: '7:30 AM' },
  { id: '3', title: 'Vitamin D & Omega-3', completed: false, type: 'medication', time: '8:00 AM' },
  { id: '4', title: 'Probiotic', completed: false, type: 'medication', time: '9:00 AM' },
  { id: '5', title: 'Log Last Night Sleep', completed: true, type: 'sleep', time: '7:15 AM' },
  { id: '6', title: 'Mood Check-in', completed: false, type: 'mood', time: '10:00 AM' },
  { id: '7', title: 'Evening Meditation', completed: false, type: 'mood', time: '9:00 PM' },
];

// Mock Activity Data
export const mockActivity: ActivityData = {
  move: { current: 420, goal: 600, color: '#ef4444' },
  exercise: { current: 25, goal: 30, color: '#22c55e' },
  stand: { current: 10, goal: 12, color: '#3b82f6' },
  steps: { current: 8432, goal: 10000 },
  calories: 420,
  activeMinutes: 25,
};

// Mock Nutrition Data
export const mockNutrition: NutritionSummary = {
  caloriesConsumed: 1450,
  caloriesGoal: 2200,
  protein: { current: 98, goal: 140 },
  carbs: { current: 145, goal: 250 },
  fats: { current: 52, goal: 73 },
  lastMeal: { name: 'Grilled Salmon Salad', time: '1:30 PM', calories: 485 },
  waterIntake: 1750,
  waterGoal: 3000,
};

// Mock Sleep Data
export const mockSleep: SleepSummary = {
  score: 76,
  duration: '7h 12m',
  durationMinutes: 432,
  bedTime: '11:15 PM',
  wakeTime: '6:27 AM',
  quality: 'good',
  sleepDebt: 28,
};

// Mock Mood Data
export const mockMood: MoodData = {
  todayMood: 4,
  todayEmoji: '😊',
  weekData: [
    { date: 'Mon', mood: 3, emoji: '🙂' },
    { date: 'Tue', mood: 4, emoji: '😊' },
    { date: 'Wed', mood: 2, emoji: '😔' },
    { date: 'Thu', mood: 4, emoji: '😊' },
    { date: 'Fri', mood: 5, emoji: '🤩' },
    { date: 'Sat', mood: 4, emoji: '😊' },
    { date: 'Sun', mood: 4, emoji: '😊' },
  ],
  stressLevel: 3,
};

// Mock Habits
export const mockHabits: HabitStreak[] = [
  { id: '1', name: 'Morning Run', streak: 12, completedToday: true, icon: '🏃' },
  { id: '2', name: 'Read 30 min', streak: 8, completedToday: true, icon: '📚' },
  { id: '3', name: 'No Sugar', streak: 5, completedToday: false, icon: '🍭' },
];

// Mock Events
export const mockEvents: UpcomingEvent[] = [
  { id: '1', title: 'Vitamin D', type: 'medication', time: '2:00 PM', description: '1 capsule with food' },
  { id: '2', title: 'Dr. Smith Checkup', type: 'appointment', time: '4:30 PM', description: 'Annual physical' },
  { id: '3', title: 'HIIT Workout', type: 'workout', time: '6:00 PM', description: '45 minutes' },
  { id: '4', title: 'Birthday Dinner', type: 'social', time: '8:00 PM', description: "Sarah's birthday" },
];

// Mock AI Insights
export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'pattern',
    title: 'Sleep Pattern Detected',
    description: 'Your sleep quality improves by 23% when you exercise before 6 PM.',
    timestamp: '2 hours ago',
    actionable: true,
    actionText: 'View Details',
  },
  {
    id: '2',
    type: 'tip',
    title: 'Hydration Reminder',
    description: "You're 750ml behind your daily water goal. Try drinking a glass now!",
    timestamp: '30 mins ago',
    actionable: true,
    actionText: 'Log Water',
  },
  {
    id: '3',
    type: 'goal',
    title: 'Weekly Goal Progress',
    description: "You've completed 4/5 workouts this week. One more to hit your goal!",
    timestamp: '1 hour ago',
    actionable: true,
    actionText: 'Plan Workout',
  },
  {
    id: '4',
    type: 'fact',
    title: 'Did You Know?',
    description: 'Consistent 7-8 hours of sleep can improve memory retention by 40%.',
    timestamp: '3 hours ago',
    actionable: false,
  },
];

// Mock Social Activity
export const mockSocialActivities: SocialActivity[] = [
  { id: '1', user: 'Alex M.', avatar: '👨', action: 'completed', target: '10K Steps Challenge', time: '5 mins ago' },
  { id: '2', user: 'Lisa K.', avatar: '👩', action: 'achieved', target: 'Early Bird Badge', time: '15 mins ago' },
  { id: '3', user: 'Mike R.', avatar: '🧑', action: 'joined', target: 'Morning Yoga Group', time: '1 hour ago' },
];

// Mock Challenges
export const mockChallenges: Challenge[] = [
  { id: '1', name: 'March Marathon', progress: 45, total: 100, participants: 1234 },
  { id: '2', name: 'Hydration Hero', progress: 7, total: 30, participants: 892 },
];

// Mock Body Metrics
export const mockBodyMetrics: BodyMetrics = {
  weight: {
    current: 78.5,
    trend: [79.2, 79.0, 78.8, 78.7, 78.6, 78.5, 78.5],
    unit: 'kg',
  },
  bmi: { value: 23.4, category: 'Normal' },
  measurements: { chest: 98, waist: 82, hips: 96 },
  goalProgress: 65,
};

// Mock Gamification Data
export const mockGamification: GamificationData = {
  level: 12,
  xp: 3450,
  xpToNext: 4000,
  recentBadges: [
    { id: '1', name: 'Step Master', description: '10,000 steps for 7 days', icon: '👟', earnedAt: '2024-03-05', rarity: 'rare' },
    { id: '2', name: 'Sleep Guru', description: 'Perfect sleep score 5 times', icon: '😴', earnedAt: '2024-03-03', rarity: 'epic' },
    { id: '3', name: 'Hydration Hero', description: 'Met water goal for 30 days', icon: '💧', earnedAt: '2024-03-01', rarity: 'common' },
  ],
  dailyChallenge: { title: 'Log 3 Meals', progress: 2, total: 3 },
  weeklyChallenge: { title: '5 Workouts', progress: 4, total: 5 },
  leaderboardPosition: 23,
};

// Complete Dashboard State
export const getMockDashboardState = (): DashboardState => ({
  healthScore: mockHealthScore,
  todayProgress: {
    checklist: mockChecklist,
    completionRate: Math.round((mockChecklist.filter(i => i.completed).length / mockChecklist.length) * 100),
  },
  widgets: {
    activity: mockActivity,
    nutrition: mockNutrition,
    sleep: mockSleep,
    mood: mockMood,
    habits: mockHabits,
    events: mockEvents,
  },
  aiInsights: mockAIInsights,
  social: {
    activities: mockSocialActivities,
    challenges: mockChallenges,
    unreadMessages: 3,
  },
  bodyMetrics: mockBodyMetrics,
  gamification: mockGamification,
});

// Utility functions
export const calculateRingProgress = (current: number, goal: number): number => {
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
