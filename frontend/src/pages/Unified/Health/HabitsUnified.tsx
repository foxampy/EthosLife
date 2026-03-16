/**
 * HabitsUnified - Habits Health Module Page
 * Habit tracking, streaks, and habit categories
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Target,
  Plus,
  Check,
  Flame,
  Calendar,
  TrendingUp,
  ChevronRight,
  Sun,
  Moon,
  Dumbbell,
  BookOpen,
  Droplets,
  Smartphone,
  Leaf,
  Heart,
  Sparkles,
  Award,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Habit categories
const CATEGORIES = [
  { id: 'all', name: 'All', icon: Target },
  { id: 'morning', name: 'Morning', icon: Sun },
  { id: 'health', name: 'Health', icon: Heart },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell },
  { id: 'learning', name: 'Learning', icon: BookOpen },
  { id: 'wellness', name: 'Wellness', icon: Leaf },
];

// Mock habits data
const HABITS = [
  {
    id: 1,
    name: 'Morning Meditation',
    category: 'morning',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
    streak: 12,
    completed: true,
    time: '7:00 AM',
    weeklyProgress: [true, true, true, true, false, true, true],
  },
  {
    id: 2,
    name: 'Drink 8 Glasses Water',
    category: 'health',
    icon: Droplets,
    color: 'from-cyan-500 to-blue-500',
    streak: 45,
    completed: true,
    time: 'All day',
    weeklyProgress: [true, true, true, true, true, true, true],
  },
  {
    id: 3,
    name: 'Read 30 Minutes',
    category: 'learning',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    streak: 5,
    completed: false,
    time: '8:00 PM',
    weeklyProgress: [true, false, true, true, false, true, false],
  },
  {
    id: 4,
    name: 'No Phone Before Bed',
    category: 'wellness',
    icon: Smartphone,
    color: 'from-indigo-500 to-blue-500',
    streak: 3,
    completed: false,
    time: '10:00 PM',
    weeklyProgress: [false, false, true, false, true, false, false],
  },
  {
    id: 5,
    name: 'Evening Stretch',
    category: 'fitness',
    icon: Dumbbell,
    color: 'from-emerald-500 to-teal-500',
    streak: 8,
    completed: true,
    time: '9:00 PM',
    weeklyProgress: [true, true, false, true, true, true, true],
  },
];

// Stats
const STATS = {
  totalHabits: 5,
  completedToday: 3,
  longestStreak: 45,
  currentStreak: 12,
};

// Heatmap data (last 30 days)
const HEATMAP_DATA = [
  { day: 1, completed: 3 },
  { day: 2, completed: 4 },
  { day: 3, completed: 5 },
  { day: 4, completed: 2 },
  { day: 5, completed: 4 },
  { day: 6, completed: 5 },
  { day: 7, completed: 3 },
  { day: 8, completed: 4 },
  { day: 9, completed: 5 },
  { day: 10, completed: 4 },
  { day: 11, completed: 3 },
  { day: 12, completed: 5 },
  { day: 13, completed: 4 },
  { day: 14, completed: 3 },
  { day: 15, completed: 4 },
  { day: 16, completed: 5 },
  { day: 17, completed: 4 },
  { day: 18, completed: 3 },
  { day: 19, completed: 4 },
  { day: 20, completed: 5 },
  { day: 21, completed: 3 },
  { day: 22, completed: 4 },
  { day: 23, completed: 3 },
  { day: 24, completed: 5 },
  { day: 25, completed: 4 },
  { day: 26, completed: 3 },
  { day: 27, completed: 4 },
  { day: 28, completed: 3 },
  { day: 29, completed: 5 },
  { day: 30, completed: 3 },
];

// Habit Item Component
const HabitItem: React.FC<{
  habit: typeof HABITS[0];
  onToggle: (id: number) => void;
  delay?: number;
}> = ({ habit, onToggle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={`flex items-center gap-3 p-3 rounded-xl ${
      habit.completed 
        ? 'bg-emerald-50/50 border border-emerald-100' 
        : 'bg-[var(--bone-300)]/30'
    }`}
  >
    <button
      onClick={() => onToggle(habit.id)}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        habit.completed
          ? 'bg-emerald-500 text-white'
          : 'bg-[var(--bone-200)] shadow-neu text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {habit.completed ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
    </button>
    
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${habit.color} flex items-center justify-center`}>
      <habit.icon className="w-5 h-5 text-white" />
    </div>
    
    <div className="flex-1 min-w-0">
      <p className={`font-medium text-sm truncate ${habit.completed ? 'text-emerald-700 line-through' : 'text-[var(--text-primary)]'}`}>
        {habit.name}
      </p>
      <p className="text-xs text-[var(--text-tertiary)]">{habit.time}</p>
    </div>
    
    <div className="flex items-center gap-1 text-amber-500">
      <Flame className="w-4 h-4" />
      <span className="text-sm font-medium">{habit.streak}</span>
    </div>
  </motion.div>
);

// Weekly Progress Bar
const WeeklyProgress: React.FC<{
  progress: boolean[];
  delay?: number;
}> = ({ progress, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="flex gap-1"
  >
    {progress.map((completed, idx) => (
      <div
        key={idx}
        className={`w-4 h-4 rounded-full ${
          completed ? 'bg-emerald-400' : 'bg-[var(--bone-400)]/30'
        }`}
      />
    ))}
  </motion.div>
);

export const HabitsUnified: React.FC = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [habits, setHabits] = useState(HABITS);

  const toggleHabit = (id: number) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const filteredHabits = activeCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === activeCategory);

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercentage = (completedCount / habits.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bone-200)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('habits.title', 'Habits')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('habits.subtitle', 'Build better routines')}
              </p>
            </div>
          </div>
          <ElButton variant="gradient" leftIcon={<Plus className="w-4 h-4" />}>
            {t('habits.newHabit', 'New Habit')}
          </ElButton>
        </motion.div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ElCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="var(--bone-400)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="url(#habitGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '176', strokeDashoffset: '176' }}
                      animate={{ strokeDashoffset: 176 - (176 * progressPercentage) / 100 }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                    <defs>
                      <linearGradient id="habitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-[var(--text-primary)]">{completedCount}/{habits.length}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {completedCount === habits.length 
                      ? 'All habits completed! 🎉' 
                      : `${completedCount} of ${habits.length} habits done`}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {habits.length - completedCount} remaining today
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 justify-end">
                  <Flame className="w-5 h-5" />
                  <span className="text-2xl font-bold">{STATS.currentStreak}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Day streak</p>
              </div>
            </div>
          </ElCard>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Habits List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ElCard className="h-full">
              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                        activeCategory === cat.id
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                          : 'bg-[var(--bone-300)]/30 text-[var(--text-secondary)] hover:bg-[var(--bone-300)]/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Habits */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  {filteredHabits.map((habit, idx) => (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      onToggle={toggleHabit}
                      delay={0.1 + idx * 0.05}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </ElCard>
          </motion.div>

          {/* Stats & Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Stats Cards */}
            <ElCard className="mb-4">
              <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                {t('habits.stats', 'Your Stats')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--bone-300)]/30 text-center">
                  <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-[var(--text-primary)]">{STATS.longestStreak}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Best Streak</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bone-300)]/30 text-center">
                  <Calendar className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-[var(--text-primary)]">{STATS.totalHabits}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Active Habits</p>
                </div>
              </div>
            </ElCard>

            {/* Heatmap */}
            <ElCard>
              <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                {t('habits.consistency', 'Consistency (30 days)')}
              </h3>
              <div className="grid grid-cols-10 gap-1">
                {HEATMAP_DATA.map((day, idx) => {
                  const intensity = day.completed / 5;
                  return (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.01 }}
                      className={`aspect-square rounded ${
                        intensity === 0 ? 'bg-[var(--bone-400)]/20' :
                        intensity <= 0.4 ? 'bg-emerald-200' :
                        intensity <= 0.7 ? 'bg-emerald-300' :
                        'bg-emerald-500'
                      }`}
                      title={`Day ${day.day}: ${day.completed} habits completed`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-tertiary)]">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-[var(--bone-400)]/20" />
                  <div className="w-3 h-3 rounded bg-emerald-200" />
                  <div className="w-3 h-3 rounded bg-emerald-300" />
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                </div>
                <span>More</span>
              </div>
            </ElCard>
          </motion.div>
        </div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <ElCard>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">
              {t('habits.weeklyProgress', 'Weekly Progress')}
            </h3>
            <div className="space-y-3">
              {habits.map((habit, idx) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${habit.color} flex items-center justify-center`}>
                      <habit.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-[var(--text-primary)]">{habit.name}</span>
                  </div>
                  <WeeklyProgress progress={habit.weeklyProgress} />
                </motion.div>
              ))}
            </div>
          </ElCard>
        </motion.div>

        {/* New Habit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">{t('habits.createNew', 'Create New Habit')}</p>
                <p className="text-xs text-white/80">
                  {t('habits.createNewDesc', 'Set up reminders and track your progress')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HabitsUnified;
