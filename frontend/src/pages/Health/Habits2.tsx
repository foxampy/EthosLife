import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Check,
  Plus,
  Flame,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  Users,
  Brain,
  Zap,
  Moon,
  Sun,
  Droplets,
  BookOpen,
  Dumbbell,
  Heart,
  Smile,
  Clock,
  MoreHorizontal,
  ChevronRight,
  Share2,
  Award,
  Star,
  Activity,
  Coffee,
  Music,
  Phone,
  MessageCircle,
  Briefcase,
  Lightbulb,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw,
  X,
  ChevronLeft,
  BarChart3,
  PieChart,
  Bell,
  Settings,
  Filter,
  Search,
  Link2,
  UserPlus,
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

type HabitCategory = 'health' | 'productivity' | 'mindfulness' | 'social' | 'custom';
type HabitFrequency = 'daily' | 'weekly' | 'specific';
type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  specificDays?: WeekDay[];
  targetTime?: string;
  reminderTime?: string;
  streakGoal: number;
  createdAt: Date;
  description?: string;
  linkedHabits?: string[];
  isGroupHabit?: boolean;
  partners?: string[];
}

interface Completion {
  habitId: string;
  date: Date;
  completed: boolean;
  notes?: string;
  mood?: number;
  timeOfDay?: string;
}

interface DailyCompletion {
  date: Date;
  completed: boolean;
}

interface StreakData {
  current: number;
  best: number;
  history: DailyCompletion[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Analytics {
  completionRate7: number;
  completionRate30: number;
  completionRate90: number;
  weeklyAverage: number;
  strongestHabit: string;
  weakestHabit: string;
  bestTimeOfDay: string;
  predictedCompletion: number;
}

interface HabitsState {
  habits: Habit[];
  todayCompletions: Completion[];
  streaks: Record<string, StreakData>;
  analytics: Analytics;
  achievements: Achievement[];
}

interface HabitStack {
  id: string;
  triggerHabitId: string;
  actionHabitId: string;
  description: string;
}

// ============================================
// MOCK DATA & CONSTANTS
// ============================================

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: '#10b981',
  productivity: '#3b82f6',
  mindfulness: '#8b5cf6',
  social: '#f59e0b',
  custom: '#ec4899',
};

const CATEGORY_NAMES: Record<HabitCategory, string> = {
  health: 'Health',
  productivity: 'Productivity',
  mindfulness: 'Mindfulness',
  social: 'Social',
  custom: 'Custom',
};

const ICON_OPTIONS = [
  { name: 'dumbbell', icon: Dumbbell },
  { name: 'moon', icon: Moon },
  { name: 'droplets', icon: Droplets },
  { name: 'book-open', icon: BookOpen },
  { name: 'briefcase', icon: Briefcase },
  { name: 'brain', icon: Brain },
  { name: 'heart', icon: Heart },
  { name: 'smile', icon: Smile },
  { name: 'sun', icon: Sun },
  { name: 'coffee', icon: Coffee },
  { name: 'music', icon: Music },
  { name: 'phone', icon: Phone },
  { name: 'message-circle', icon: MessageCircle },
  { name: 'activity', icon: Activity },
  { name: 'target', icon: Target },
  { name: 'zap', icon: Zap },
  { name: 'star', icon: Star },
  { name: 'trophy', icon: Trophy },
  { name: 'flame', icon: Flame },
  { name: 'lightbulb', icon: Lightbulb },
];

const COLOR_OPTIONS = [
  '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f59e0b',
  '#ef4444', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#d946ef', '#8b5cf6', '#22c55e', '#eab308',
];

const WEEK_DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Exercise',
    icon: 'dumbbell',
    color: '#10b981',
    category: 'health',
    frequency: 'daily',
    targetTime: '30 min',
    reminderTime: '07:00',
    streakGoal: 30,
    createdAt: new Date('2024-01-01'),
    linkedHabits: ['2'],
  },
  {
    id: '2',
    name: 'Drink 2L Water',
    icon: 'droplets',
    color: '#3b82f6',
    category: 'health',
    frequency: 'daily',
    targetTime: 'All day',
    reminderTime: '09:00',
    streakGoal: 21,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Read 30 Minutes',
    icon: 'book-open',
    color: '#8b5cf6',
    category: 'productivity',
    frequency: 'daily',
    targetTime: '30 min',
    reminderTime: '21:00',
    streakGoal: 100,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Meditation',
    icon: 'brain',
    color: '#f59e0b',
    category: 'mindfulness',
    frequency: 'specific',
    specificDays: ['Mon', 'Wed', 'Fri'],
    targetTime: '15 min',
    reminderTime: '08:00',
    streakGoal: 21,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    name: 'Call Parents',
    icon: 'phone',
    color: '#ec4899',
    category: 'social',
    frequency: 'weekly',
    targetTime: '30 min',
    streakGoal: 52,
    createdAt: new Date('2024-01-01'),
    isGroupHabit: true,
    partners: ['sister', 'brother'],
  },
  {
    id: '6',
    name: 'Journal Writing',
    icon: 'lightbulb',
    color: '#8b5cf6',
    category: 'mindfulness',
    frequency: 'daily',
    targetTime: '10 min',
    reminderTime: '22:00',
    streakGoal: 30,
    createdAt: new Date('2024-02-10'),
  },
];

const INITIAL_COMPLETIONS: Completion[] = [
  { habitId: '1', date: new Date(), completed: true, mood: 8, timeOfDay: '07:30' },
  { habitId: '2', date: new Date(), completed: true, mood: 8, timeOfDay: '08:00' },
  { habitId: '3', date: new Date(), completed: false },
  { habitId: '4', date: new Date(), completed: false },
  { habitId: '6', date: new Date(), completed: true, mood: 7, timeOfDay: '22:15' },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: '7-Day Streak', description: 'Maintain a 7-day streak', icon: 'flame', unlockedAt: new Date('2024-01-08'), progress: 7, target: 7, rarity: 'common' },
  { id: '2', name: '30-Day Streak', description: 'Maintain a 30-day streak', icon: 'fire', progress: 23, target: 30, rarity: 'rare' },
  { id: '3', name: 'Perfect Week', description: 'Complete all habits for 7 days', icon: 'star', unlockedAt: new Date('2024-01-14'), progress: 7, target: 7, rarity: 'common' },
  { id: '4', name: 'Health Master', description: 'Complete 100 health habits', icon: 'heart', progress: 67, target: 100, rarity: 'rare' },
  { id: '5', name: '100-Day Legend', description: 'Maintain a 100-day streak', icon: 'crown', progress: 23, target: 100, rarity: 'legendary' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getIconComponent = (iconName: string) => {
  const icon = ICON_OPTIONS.find(i => i.name === iconName);
  return icon?.icon || Activity;
};

const generateMockHistory = (days: number, completionRate: number = 0.8): DailyCompletion[] => {
  const history: DailyCompletion[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    history.push({
      date,
      completed: Math.random() < completionRate,
    });
  }
  return history;
};

const calculateStreak = (history: DailyCompletion[]): number => {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].completed) {
      streak++;
    } else if (i !== history.length - 1) {
      break;
    }
  }
  return streak;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ============================================
// SUB-COMPONENTS
// ============================================

// ---------- Habit Card Component ----------
interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  weeklyProgress: boolean[];
  onToggle: () => void;
  onClick: () => void;
  onAddNote: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  streak,
  weeklyProgress,
  onToggle,
  onClick,
  onAddNote,
}) => {
  const Icon = getIconComponent(habit.icon);
  const completedCount = weeklyProgress.filter(Boolean).length;
  const completionPercent = (completedCount / 7) * 100;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
        isCompleted
          ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
          : 'border-violet-100 bg-white hover:border-violet-300 hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${habit.color}20, transparent)` }}
      />

      <div className="p-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)` }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? 'bg-green-500 text-white scale-110'
                : 'bg-gray-100 text-gray-400 hover:bg-violet-100 hover:text-violet-600'
            }`}
          >
            <Check className={`w-5 h-5 ${isCompleted ? 'animate-bounce' : ''}`} />
          </button>
        </div>

        {/* Name & Streak */}
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{habit.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-500">{CATEGORY_NAMES[habit.category]}</span>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-sm font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3" />
              {streak}
            </span>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>This week</span>
            <span>{completedCount}/7</span>
          </div>
          <div className="flex gap-1">
            {weeklyProgress.map((completed, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  completed ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddNote();
            }}
            className="flex-1 text-xs text-violet-600 hover:text-violet-700 font-medium py-1 px-2 rounded-lg hover:bg-violet-50 transition-colors"
          >
            + Add Note
          </button>
          {habit.linkedHabits && habit.linkedHabits.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-violet-500">
              <Link2 className="w-3 h-3" />
              <span>Stacked</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Calendar Heatmap Component ----------
interface CalendarHeatmapProps {
  history: DailyCompletion[];
  color?: string;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ history, color = '#8b5cf6' }) => {
  const weeks = useMemo(() => {
    const w: DailyCompletion[][] = [];
    for (let i = 0; i < history.length; i += 7) {
      w.push(history.slice(i, i + 7));
    }
    return w;
  }, [history]);

  const getIntensity = (completed: boolean) => {
    if (!completed) return 'bg-gray-100';
    return '';
  };

  return (
    <div className="flex gap-1">
      {weeks.slice(-12).map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 ${
                day.completed ? '' : 'bg-gray-100'
              }`}
              style={{
                backgroundColor: day.completed ? color : undefined,
                opacity: day.completed ? 0.3 + Math.random() * 0.7 : 1,
              }}
              title={formatDate(day.date)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ---------- Streak Counter Component ----------
interface StreakCounterProps {
  current: number;
  best: number;
  color?: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ current, best, color = '#8b5cf6' }) => {
  return (
    <div className="flex items-center justify-center gap-8 py-6">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-30"
            style={{ backgroundColor: color }}
          />
          <div
            className="relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center"
            style={{ borderColor: color }}
          >
            <Flame className="w-8 h-8 mb-1" style={{ color }} />
            <span className="text-3xl font-bold text-gray-900">{current}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Current Streak</p>
        {current >= 7 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
            <Sparkles className="w-3 h-3" />
            On Fire!
          </span>
        )}
      </div>

      <div className="text-center">
        <div className="relative inline-flex items-center justify-center">
          <div
            className="relative w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center"
            style={{ borderColor: color + '60' }}
          >
            <Trophy className="w-6 h-6 mb-1 text-gray-400" />
            <span className="text-2xl font-bold text-gray-600">{best}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Best Streak</p>
      </div>
    </div>
  );
};

// ---------- Achievement Badge Component ----------
interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-orange-500',
  };

  const isUnlocked = achievement.unlockedAt !== undefined;

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        isUnlocked
          ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50'
          : 'border-gray-200 bg-gray-50 opacity-70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isUnlocked
              ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white`
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm">{achievement.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
          
          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">
                {achievement.progress}/{achievement.target}
              </span>
              <span
                className={`font-medium ${
                  isUnlocked ? 'text-green-600' : 'text-violet-600'
                }`}
              >
                {Math.round((achievement.progress / achievement.target) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : 'bg-gradient-to-r from-violet-400 to-purple-500'
                }`}
                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      )}
    </div>
  );
};

// ---------- AI Coach Component ----------
const AICoach: React.FC = () => {
  const suggestions = [
    {
      icon: Brain,
      message: "You're 80% likely to maintain your morning exercise streak! Keep the momentum going.",
      type: 'prediction',
      color: 'green',
    },
    {
      icon: Clock,
      message: "Optimal time for meditation is 8:00 AM based on your completion patterns.",
      type: 'suggestion',
      color: 'violet',
    },
    {
      icon: Target,
      message: "Try habit stacking: After morning exercise, drink water immediately.",
      type: 'tip',
      color: 'amber',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-violet-800 rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold">AI Habit Coach</h3>
          <p className="text-xs text-violet-200">Personalized insights for you</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors cursor-pointer"
          >
            <suggestion.icon className="w-5 h-5 text-violet-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-violet-100">{suggestion.message}</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl bg-white text-violet-900 font-medium text-sm hover:bg-violet-50 transition-colors flex items-center justify-center gap-2">
        <Brain className="w-4 h-4" />
        Get More Insights
      </button>
    </div>
  );
};

// ---------- Habit Creation Modal ----------
interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
}

const HabitCreationModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [habitData, setHabitData] = useState({
    name: '',
    icon: 'dumbbell',
    color: '#8b5cf6',
    category: 'health' as HabitCategory,
    frequency: 'daily' as HabitFrequency,
    specificDays: [] as WeekDay[],
    targetTime: '',
    reminderTime: '',
    streakGoal: 21,
    description: '',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(habitData);
    onClose();
    setStep(1);
    setHabitData({
      name: '',
      icon: 'dumbbell',
      color: '#8b5cf6',
      category: 'health',
      frequency: 'daily',
      specificDays: [],
      targetTime: '',
      reminderTime: '',
      streakGoal: 21,
      description: '',
    });
  };

  const toggleDay = (day: WeekDay) => {
    setHabitData(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Habit</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={habitData.name}
                  onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
                  placeholder="e.g., Morning Exercise"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CATEGORY_NAMES) as HabitCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setHabitData({ ...habitData, category: cat })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        habitData.category === cat
                          ? 'bg-violet-100 text-violet-700 border-2 border-violet-500'
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {CATEGORY_NAMES[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => setHabitData({ ...habitData, icon: name })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        habitData.icon === name
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setHabitData({ ...habitData, color })}
                      className={`w-10 h-10 rounded-full transition-all ${
                        habitData.color === color
                          ? 'ring-4 ring-offset-2 ring-violet-300 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2: Frequency */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <div className="space-y-2">
                  {[
                    { value: 'daily', label: 'Every Day' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'specific', label: 'Specific Days' },
                  ].map((freq) => (
                    <button
                      key={freq.value}
                      onClick={() => setHabitData({ ...habitData, frequency: freq.value as HabitFrequency })}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        habitData.frequency === freq.value
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{freq.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {habitData.frequency === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
                  <div className="flex gap-2">
                    {WEEK_DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          habitData.specificDays.includes(day)
                            ? 'bg-violet-500 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {day.slice(0, 1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Time</label>
                  <input
                    type="text"
                    value={habitData.targetTime}
                    onChange={(e) => setHabitData({ ...habitData, targetTime: e.target.value })}
                    placeholder="e.g., 30 min"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reminder</label>
                  <input
                    type="time"
                    value={habitData.reminderTime}
                    onChange={(e) => setHabitData({ ...habitData, reminderTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Streak Goal</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="7"
                    max="365"
                    value={habitData.streakGoal}
                    onChange={(e) => setHabitData({ ...habitData, streakGoal: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-violet-600 font-semibold w-16 text-right">{habitData.streakGoal} days</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
          >
            Back
          </button>
          <div className="flex gap-2">
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!habitData.name}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={habitData.frequency === 'specific' && habitData.specificDays.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Create Habit
              </button>
            )}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                s === step ? 'w-6 bg-violet-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- Weekly Progress Component ----------
const WeeklyProgress: React.FC<{ completions: boolean[] }> = ({ completions }) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completedCount = completions.filter(Boolean).length;
  const percentage = Math.round((completedCount / 7) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Weekly Progress</h3>
        <span
          className={`text-sm font-medium ${
            percentage === 100 ? 'text-green-600' : 'text-violet-600'
          }`}
        >
          {percentage}%
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {days.map((day, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`w-full aspect-square rounded-xl flex items-center justify-center mb-1 transition-all ${
                completions[i]
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {completions[i] && <Check className="w-4 h-4" />}
            </div>
            <span className="text-xs text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {completedCount < 7 && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{7 - completedCount} days remaining to complete the week!</span>
        </div>
      )}
    </div>
  );
};

// ---------- Analytics Card Component ----------
interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {change}
          </p>
        )}
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color + '20' }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function Habits2() {
  // State
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [completions, setCompletions] = useState<Completion[]>(INITIAL_COMPLETIONS);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<HabitCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Derived state
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesFilter = activeFilter === 'all' || habit.category === activeFilter;
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [habits, activeFilter, searchQuery]);

  const todayCompletions = useMemo(() => {
    const today = new Date().toDateString();
    return completions.filter((c) => c.date.toDateString() === today);
  }, [completions]);

  const getHabitCompletion = useCallback(
    (habitId: string) => {
      return todayCompletions.find((c) => c.habitId === habitId)?.completed || false;
    },
    [todayCompletions]
  );

  const getWeeklyProgress = useCallback(
    (habitId: string): boolean[] => {
      const weekProgress: boolean[] = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const completed = completions.some(
          (c) => c.habitId === habitId && c.date.toDateString() === date.toDateString() && c.completed
        );
        weekProgress.push(completed);
      }
      return weekProgress;
    },
    [completions]
  );

  const getStreakData = useCallback(
    (habitId: string): StreakData => {
      const history = generateMockHistory(30, 0.75);
      const current = calculateStreak(history);
      return {
        current,
        best: Math.max(current, Math.floor(Math.random() * 50) + 20),
        history,
      };
    },
    []
  );

  // Handlers
  const handleToggleHabit = useCallback(
    (habitId: string) => {
      const today = new Date();
      const existingIndex = completions.findIndex(
        (c) => c.habitId === habitId && c.date.toDateString() === today.toDateString()
      );

      if (existingIndex >= 0) {
        const newCompletions = [...completions];
        newCompletions[existingIndex] = {
          ...newCompletions[existingIndex],
          completed: !newCompletions[existingIndex].completed,
        };
        setCompletions(newCompletions);
      } else {
        setCompletions([
          ...completions,
          { habitId, date: today, completed: true, mood: 7, timeOfDay: new Date().toLocaleTimeString() },
        ]);
      }
    },
    [completions]
  );

  const handleCreateHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
      const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setHabits([...habits, newHabit]);
    },
    [habits]
  );

  const completedTodayCount = todayCompletions.filter((c) => c.completed).length;
  const totalHabits = habits.length;
  const completionRate = Math.round((completedTodayCount / totalHabits) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
                <p className="text-sm text-gray-500">Build better habits, one day at a time</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-xl">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-violet-900">23 day streak</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Habit
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              {(Object.keys(CATEGORY_NAMES) as HabitCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === cat
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {CATEGORY_NAMES[cat]}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search habits..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL - Today's Habits */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Today's Progress</h2>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${completionRate}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{completionRate}%</span>
                  <span className="text-xs text-gray-500">{completedTodayCount}/{totalHabits}</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                {completionRate === 100
                  ? '🎉 All habits completed!'
                  : `Keep going! ${totalHabits - completedTodayCount} more to go`}
              </p>
            </div>

            {/* Quick Add Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Add</h3>
              <div className="space-y-2">
                {['Drink water', 'Take vitamins', 'Stretch 5 min', 'Read 10 pages'].map((quick) => (
                  <button
                    key={quick}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-violet-50 hover:border-violet-200 border border-transparent transition-all text-left group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-violet-700">{quick}</span>
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Habits Grid */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">My Habits</h3>
              <div className="space-y-3">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={getHabitCompletion(habit.id)}
                    streak={getStreakData(habit.id).current}
                    weeklyProgress={getWeeklyProgress(habit.id)}
                    onToggle={() => handleToggleHabit(habit.id)}
                    onClick={() => setSelectedHabit(habit)}
                    onAddNote={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER PANEL - Habit Detail */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-5 space-y-6">
            {selectedHabit ? (
              <>
                {/* Habit Detail Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div
                    className="h-32 relative"
                    style={{
                      background: `linear-gradient(135deg, ${selectedHabit.color}, ${selectedHabit.color}dd)`,
                    }}
                  >
                    <button
                      onClick={() => setSelectedHabit(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute -bottom-8 left-6">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                        {React.createElement(getIconComponent(selectedHabit.icon), {
                          className: 'w-8 h-8',
                          style: { color: selectedHabit.color },
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 px-6 pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedHabit.name}</h2>
                        <p className="text-sm text-gray-500">{CATEGORY_NAMES[selectedHabit.category]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedHabit.isGroupHabit && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Group
                          </span>
                        )}
                        {selectedHabit.linkedHabits && selectedHabit.linkedHabits.length > 0 && (
                          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            Stacked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Streak Counter */}
                    <StreakCounter
                      current={getStreakData(selectedHabit.id).current}
                      best={getStreakData(selectedHabit.id).best}
                      color={selectedHabit.color}
                    />

                    {/* Calendar Heatmap */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Last 12 Weeks</h4>
                      <CalendarHeatmap
                        history={getStreakData(selectedHabit.id).history}
                        color={selectedHabit.color}
                      />
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <span>Less</span>
                        <div className="flex gap-1">
                          {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                            <div
                              key={opacity}
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: selectedHabit.color, opacity }}
                            />
                          ))}
                        </div>
                        <span>More</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleToggleHabit(selectedHabit.id)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          getHabitCompletion(selectedHabit.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                        {getHabitCompletion(selectedHabit.id) ? 'Completed' : 'Mark Complete'}
                      </button>
                      <button className="px-4 py-3 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors">
                        <Bell className="w-5 h-5" />
                      </button>
                      <button className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weekly Progress */}
                <WeeklyProgress completions={getWeeklyProgress(selectedHabit.id)} />

                {/* Habit Stacking Section */}
                {selectedHabit.linkedHabits && selectedHabit.linkedHabits.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Habit Stack</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 flex-1">
                        {React.createElement(getIconComponent(selectedHabit.icon), {
                          className: 'w-5 h-5 text-violet-600',
                        })}
                        <span className="font-medium text-violet-900">{selectedHabit.name}</span>
                      </div>
                      <Link2 className="w-5 h-5 text-gray-400" />
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 flex-1">
                        {(() => {
                          const linked = habits.find((h) => h.id === selectedHabit.linkedHabits![0]);
                          if (!linked) return null;
                          const LinkedIcon = getIconComponent(linked.icon);
                          return (
                            <>
                              <LinkedIcon className="w-5 h-5" style={{ color: linked.color }} />
                              <span className="font-medium text-gray-700">{linked.name}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      After I <strong>{selectedHabit.name}</strong>, I will{' '}
                      <strong>
                        {habits.find((h) => h.id === selectedHabit.linkedHabits![0])?.name}
                      </strong>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Habit</h3>
                <p className="text-gray-500">Click on any habit to view details, track progress, and see your streaks.</p>
              </div>
            )}

            {/* AI Coach */}
            <AICoach />
          </div>

          {/* RIGHT PANEL - Analytics & Achievements */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-4 space-y-6">
            {/* Analytics Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Analytics</h3>
              <div className="grid grid-cols-2 gap-3">
                <AnalyticsCard
                  title="7 Days"
                  value="87%"
                  change="+5%"
                  icon={BarChart3}
                  color="#8b5cf6"
                />
                <AnalyticsCard
                  title="30 Days"
                  value="76%"
                  change="+12%"
                  icon={TrendingUp}
                  color="#10b981"
                />
                <AnalyticsCard
                  title="Best Habit"
                  value="Exercise"
                  icon={Trophy}
                  color="#f59e0b"
                />
                <AnalyticsCard
                  title="Focus Time"
                  value="9:00 AM"
                  icon={Clock}
                  color="#3b82f6"
                />
              </div>
            </div>

            {/* Completion Rate Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Completion Trends</h3>
              <div className="h-32 flex items-end gap-1">
                {[65, 72, 68, 85, 90, 87, 92, 88, 95, 87, 91, 94].map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg transition-all hover:opacity-80 relative group"
                    style={{
                      height: `${value}%`,
                      background: `linear-gradient(to top, #8b5cf6, #ec4899)`,
                      opacity: 0.3 + (value / 150),
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Achievements</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {INITIAL_ACHIEVEMENTS.slice(0, 3).map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>

            {/* Group Habits */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Group Habits</h3>
                <button className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 hover:bg-violet-200 transition-colors">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {habits
                  .filter((h) => h.isGroupHabit)
                  .map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-violet-50 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: habit.color + '20' }}
                      >
                        {React.createElement(getIconComponent(habit.icon), {
                          className: 'w-5 h-5',
                          style: { color: habit.color },
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{habit.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex -space-x-1">
                            {['sister', 'brother'].map((partner, i) => (
                              <div
                                key={partner}
                                className="w-5 h-5 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center text-xs font-medium text-violet-700"
                              >
                                {partner[0].toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">+2 partners</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-violet-600">#2</span>
                        <p className="text-xs text-gray-400">Rank</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Share Achievements */}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Progress
            </button>
          </div>
        </div>
      </main>

      {/* Habit Creation Modal */}
      <HabitCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateHabit}
      />
    </div>
  );
}
