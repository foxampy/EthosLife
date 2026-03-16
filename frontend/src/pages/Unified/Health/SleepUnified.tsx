/**
 * SleepUnified - Sleep Health Module Page
 * Sleep tracking, quality score, and bedtime insights
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  Sun,
  Clock,
  TrendingUp,
  Star,
  Sparkles,
  ChevronRight,
  Wind,
  AlarmClock,
  Bed,
  Zap,
  Coffee,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock data
const SLEEP_DATA = {
  lastNight: {
    duration: '7h 42m',
    durationMinutes: 462,
    quality: 85,
    bedtime: '10:45 PM',
    wakeTime: '6:27 AM',
    deepSleep: '1h 45m',
    lightSleep: '4h 30m',
    remSleep: '1h 27m',
  },
  weeklyAverage: '7h 15m',
  streak: 5,
};

const WEEKLY_SLEEP = [
  { day: 'Mon', duration: 420, quality: 78 },
  { day: 'Tue', duration: 390, quality: 72 },
  { day: 'Wed', duration: 450, quality: 85 },
  { day: 'Thu', duration: 480, quality: 88 },
  { day: 'Fri', duration: 360, quality: 65 },
  { day: 'Sat', duration: 510, quality: 92 },
  { day: 'Sun', duration: 462, quality: 85 },
];

const SLEEP_TIPS = [
  {
    id: 1,
    icon: Wind,
    title: 'Breathing Exercise',
    description: 'Try 4-7-8 breathing before bed',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    icon: Coffee,
    title: 'Caffeine Cutoff',
    description: 'Avoid caffeine after 2 PM',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Screen Time',
    description: 'Reduce blue light 1 hour before bed',
    color: 'from-violet-500 to-purple-500',
  },
];

// Sleep Quality Ring
const QualityRing: React.FC<{ quality: number; size?: number }> = ({ quality, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (quality / 100) * circumference;

  let colorClass = 'stroke-red-500';
  if (quality >= 80) colorClass = 'stroke-emerald-500';
  else if (quality >= 60) colorClass = 'stroke-amber-500';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bone-400)"
          strokeWidth="12"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={colorClass}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Star className="w-6 h-6 text-amber-400 mb-1" />
        <motion.span
          className="text-3xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {quality}
        </motion.span>
        <span className="text-xs text-[var(--text-secondary)]">Sleep Score</span>
      </div>
    </div>
  );
};

// Sleep Stage Bar
const SleepStageBar: React.FC<{
  label: string;
  duration: string;
  percentage: number;
  color: string;
  delay?: number;
}> = ({ label, duration, percentage, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="mb-3"
  >
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{duration}</span>
    </div>
    <div className="h-3 bg-[var(--bone-300)] rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
      />
    </div>
  </motion.div>
);

export const SleepUnified: React.FC = () => {
  const { t } = useTranslation();

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('sleep.title', 'Sleep')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('sleep.subtitle', 'Rest and recovery tracking')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              {SLEEP_DATA.streak} day streak 🔥
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Last Night Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500" />
                {t('sleep.lastNight', 'Last Night')}
              </h3>
              
              <div className="flex flex-col items-center mb-6">
                <QualityRing quality={SLEEP_DATA.lastNight.quality} />
                <p className="text-3xl font-bold text-[var(--text-primary)] mt-4">
                  {SLEEP_DATA.lastNight.duration}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Total Sleep Time</p>
              </div>

              {/* Bedtime / Wake Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[var(--bone-300)]/50 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bed className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {SLEEP_DATA.lastNight.bedtime}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">Bedtime</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bone-300)]/50 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlarmClock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {SLEEP_DATA.lastNight.wakeTime}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">Wake Time</p>
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Sleep Stages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                {t('sleep.sleepStages', 'Sleep Stages')}
              </h3>
              
              <SleepStageBar
                label={t('sleep.deepSleep', 'Deep Sleep')}
                duration={SLEEP_DATA.lastNight.deepSleep}
                percentage={23}
                color="bg-gradient-to-r from-indigo-500 to-violet-500"
                delay={0.3}
              />
              <SleepStageBar
                label={t('sleep.lightSleep', 'Light Sleep')}
                duration={SLEEP_DATA.lastNight.lightSleep}
                percentage={58}
                color="bg-gradient-to-r from-blue-400 to-cyan-400"
                delay={0.35}
              />
              <SleepStageBar
                label={t('sleep.remSleep', 'REM Sleep')}
                duration={SLEEP_DATA.lastNight.remSleep}
                percentage={19}
                color="bg-gradient-to-r from-purple-400 to-pink-400"
                delay={0.4}
              />

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-indigo-900 text-sm">
                      {t('sleep.insight', 'Sleep Insight')}
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                      Your deep sleep was 15% better than last week. Keep maintaining a consistent bedtime!
                    </p>
                  </div>
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Sleep Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                {t('sleep.tips', 'Sleep Tips')}
              </h3>
              
              <div className="space-y-3">
                {SLEEP_TIPS.map((tip, idx) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bone-300)]/30 hover:bg-[var(--bone-300)]/50 transition-colors cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center flex-shrink-0`}>
                      <tip.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-sm">{tip.title}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <ElButton variant="flat" fullWidth className="mt-4">
                {t('sleep.viewAllTips', 'View All Tips')}
              </ElButton>
            </ElCard>
          </motion.div>
        </div>

        {/* Weekly Sleep Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <ElCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--text-secondary)]" />
                {t('sleep.weeklyTrend', 'Weekly Sleep Trend')}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--text-secondary)]">
                  Avg: <span className="font-semibold text-[var(--text-primary)]">{SLEEP_DATA.weeklyAverage}</span>
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  Avg Quality: <span className="font-semibold text-emerald-600">79%</span>
                </span>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-3">
              {WEEKLY_SLEEP.map((day, idx) => {
                const height = (day.duration / 600) * 100;
                const isToday = idx === 6;
                const qualityColor = day.quality >= 80 ? 'from-emerald-400 to-emerald-500' : 
                                     day.quality >= 60 ? 'from-amber-400 to-amber-500' : 
                                     'from-red-400 to-red-500';
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.6 + idx * 0.05, duration: 0.4 }}
                      className={`w-full rounded-t-xl bg-gradient-to-t ${qualityColor} relative group`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                        {Math.floor(day.duration / 60)}h {day.duration % 60}m
                      </div>
                    </motion.div>
                    <span className={`text-xs mt-2 ${isToday ? 'font-semibold text-indigo-600' : 'text-[var(--text-tertiary)]'}`}>
                      {day.day}
                    </span>
                    <span className={`text-xs ${isToday ? 'font-semibold text-indigo-600' : 'text-[var(--text-tertiary)]'}`}>
                      {day.quality}%
                    </span>
                  </div>
                );
              })}
            </div>
          </ElCard>
        </motion.div>

        {/* Link to Detailed View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--bone-300)]/50 hover:bg-[var(--bone-300)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--text-primary)]">
                  {t('sleep.detailedView', 'Detailed Sleep Analysis')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('sleep.detailedViewDesc', 'Sleep trends, patterns, and smart alarm settings')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SleepUnified;
