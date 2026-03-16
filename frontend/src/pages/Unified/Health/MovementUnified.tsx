/**
 * MovementUnified - Movement/Activity Health Module Page
 * Steps counter, activity types, and workout tracking
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Footprints,
  Play,
  Timer,
  Flame,
  MapPin,
  TrendingUp,
  Walking,
  Running,
  Bike,
  Dumbbell,
  Waves,
  Activity,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock data
const STEPS_DATA = {
  current: 7234,
  goal: 10000,
  distance: 5.2,
  calories: 342,
  activeMinutes: 45,
};

const WEEKLY_STEPS = [
  { day: 'Mon', steps: 8500 },
  { day: 'Tue', steps: 10200 },
  { day: 'Wed', steps: 7800 },
  { day: 'Thu', steps: 11500 },
  { day: 'Fri', steps: 9200 },
  { day: 'Sat', steps: 6500 },
  { day: 'Sun', steps: 7234 },
];

const ACTIVITY_TYPES = [
  { id: 'walk', name: 'Walk', icon: Walking, color: 'from-emerald-500 to-teal-500', calories: '200-300', duration: '30 min' },
  { id: 'run', name: 'Run', icon: Running, color: 'from-orange-500 to-red-500', calories: '400-600', duration: '30 min' },
  { id: 'gym', name: 'Gym', icon: Dumbbell, color: 'from-blue-500 to-indigo-500', calories: '300-500', duration: '45 min' },
  { id: 'cycle', name: 'Cycle', icon: Bike, color: 'from-cyan-500 to-blue-500', calories: '350-550', duration: '45 min' },
  { id: 'swim', name: 'Swim', icon: Waves, color: 'from-violet-500 to-purple-500', calories: '400-700', duration: '30 min' },
  { id: 'hiit', name: 'HIIT', icon: Activity, color: 'from-rose-500 to-pink-500', calories: '450-650', duration: '20 min' },
];

const RECENT_WORKOUTS = [
  { id: 1, type: 'Running', duration: '32 min', calories: 420, date: 'Today, 7:00 AM', icon: Running },
  { id: 2, type: 'Morning Walk', duration: '45 min', calories: 180, date: 'Yesterday', icon: Walking },
];

// Circular Progress for Steps
const StepsRing: React.FC<{ current: number; goal: number; size?: number }> = ({
  current,
  goal,
  size = 200,
}) => {
  const radius = (size - 24) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(current / goal, 1);
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bone-400)"
          strokeWidth="16"
        />
        <defs>
          <linearGradient id="stepsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#stepsGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Footprints className="w-8 h-8 text-emerald-500 mb-2" />
        <motion.span
          className="text-4xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {current.toLocaleString()}
        </motion.span>
        <span className="text-sm text-[var(--text-secondary)]">/ {goal.toLocaleString()}</span>
        <span className="text-xs text-[var(--text-tertiary)] mt-1">
          {Math.round(percentage * 100)}% of goal
        </span>
      </div>
    </div>
  );
};

export const MovementUnified: React.FC = () => {
  const { t } = useTranslation();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Footprints className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('movement.title', 'Movement')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('movement.subtitle', 'Track your daily activity')}
              </p>
            </div>
          </div>
          <ElButton variant="gradient" leftIcon={<Play className="w-4 h-4" />}>
            {t('movement.startWorkout', 'Start Workout')}
          </ElButton>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Steps Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ElCard className="h-full flex flex-col items-center justify-center py-8">
              <StepsRing current={STEPS_DATA.current} goal={STEPS_DATA.goal} />
              
              <div className="grid grid-cols-3 gap-4 w-full mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{STEPS_DATA.distance}</p>
                  <p className="text-xs text-[var(--text-secondary)]">km</p>
                </div>
                <div className="text-center border-x border-[var(--bone-400)]/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{STEPS_DATA.calories}</p>
                  <p className="text-xs text-[var(--text-secondary)]">kcal</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Timer className="w-4 h-4 text-[var(--text-tertiary)]" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{STEPS_DATA.activeMinutes}</p>
                  <p className="text-xs text-[var(--text-secondary)]">min</p>
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Weekly Activity Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ElCard className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--text-secondary)]" />
                  {t('movement.weeklyActivity', 'Weekly Activity')}
                </h3>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {t('movement.avgSteps', 'Avg: 8,705 steps')}
                </span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2 mb-4">
                {WEEKLY_STEPS.map((day, idx) => {
                  const height = (day.steps / 12000) * 100;
                  const isToday = idx === 6;
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                        className={`w-full rounded-t-lg ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                            : 'bg-[var(--stone-500)]/40'
                        }`}
                      />
                      <span className={`text-xs mt-2 ${isToday ? 'font-semibold text-emerald-600' : 'text-[var(--text-tertiary)]'}`}>
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Recent Workouts */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                  {t('movement.recentWorkouts', 'Recent Workouts')}
                </h4>
                <div className="space-y-2">
                  {RECENT_WORKOUTS.map((workout, idx) => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--bone-300)]/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <workout.icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)] text-sm">{workout.type}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{workout.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{workout.duration}</p>
                        <p className="text-xs text-orange-500">{workout.calories} kcal</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ElCard>
          </motion.div>
        </div>

        {/* Activity Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">
            {t('movement.activityTypes', 'Start Activity')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ACTIVITY_TYPES.map((activity, idx) => (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedActivity(activity.id)}
                className={`p-4 rounded-2xl bg-[var(--bone-200)] border-2 transition-all ${
                  selectedActivity === activity.id
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'border-transparent shadow-neu hover:shadow-neu-hover'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center mx-auto mb-3`}>
                  <activity.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-[var(--text-primary)] text-sm">{activity.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{activity.duration}</p>
                <p className="text-xs text-orange-500 mt-1">~{activity.calories} kcal</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Start Workout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">{t('movement.quickStart', 'Quick Start Workout')}</p>
                <p className="text-xs text-white/80">
                  {t('movement.quickStartDesc', 'Begin tracking your activity now')}
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

export default MovementUnified;
