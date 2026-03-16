/**
 * PsychologyUnified - Psychology/Mental Health Module Page
 * Mood tracker, stress level, and meditation tools
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Brain,
  Smile,
  Frown,
  Meh,
  Zap,
  CloudRain,
  Wind,
  Sparkles,
  Heart,
  TrendingUp,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Calendar,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mood options with emojis
const MOODS = [
  { id: 'great', emoji: '🤩', label: 'Great', color: 'from-emerald-500 to-teal-500', score: 5 },
  { id: 'good', emoji: '🙂', label: 'Good', color: 'from-blue-500 to-cyan-500', score: 4 },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'from-amber-500 to-yellow-500', score: 3 },
  { id: 'low', emoji: '😔', label: 'Low', color: 'from-orange-500 to-red-500', score: 2 },
  { id: 'bad', emoji: '😫', label: 'Bad', color: 'from-red-500 to-rose-500', score: 1 },
];

// Stress levels
const STRESS_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-emerald-500', width: '25%' },
  { id: 'moderate', label: 'Moderate', color: 'bg-amber-500', width: '50%' },
  { id: 'high', label: 'High', color: 'bg-orange-500', width: '75%' },
  { id: 'severe', label: 'Severe', color: 'bg-red-500', width: '100%' },
];

// Mock data
const MOOD_HISTORY = [
  { day: 'Mon', mood: 'good', emoji: '🙂' },
  { day: 'Tue', mood: 'great', emoji: '🤩' },
  { day: 'Wed', mood: 'okay', emoji: '😐' },
  { day: 'Thu', mood: 'good', emoji: '🙂' },
  { day: 'Fri', mood: 'low', emoji: '😔' },
  { day: 'Sat', mood: 'good', emoji: '🙂' },
  { day: 'Sun', mood: 'great', emoji: '🤩' },
];

const MEDITATION_PRESETS = [
  { id: 1, name: 'Quick Calm', duration: '3 min', icon: Wind, color: 'from-cyan-500 to-blue-500' },
  { id: 2, name: 'Stress Relief', duration: '5 min', icon: CloudRain, color: 'from-indigo-500 to-violet-500' },
  { id: 3, name: 'Focus Boost', duration: '10 min', icon: Zap, color: 'from-amber-500 to-orange-500' },
  { id: 4, name: 'Deep Relax', duration: '15 min', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
];

const DAILY_PROMPTS = [
  "What's one thing you're grateful for today?",
  "How did you take care of yourself today?",
  "What's something that made you smile?",
  "What are you looking forward to tomorrow?",
];

// Mood Score Ring
const MoodScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 140 }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / 5) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bone-400)"
          strokeWidth="10"
        />
        <defs>
          <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#moodGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {score}/5
        </motion.span>
        <span className="text-xs text-[var(--text-secondary)]">Mood Score</span>
      </div>
    </div>
  );
};

export const PsychologyUnified: React.FC = () => {
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState<string>('low');
  const [isMeditating, setIsMeditating] = useState(false);
  const [currentPrompt] = useState(() => 
    DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]
  );

  const currentMood = MOODS.find(m => m.id === selectedMood);
  const moodScore = currentMood?.score || 4;

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('psychology.title', 'Mind')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('psychology.subtitle', 'Mental wellness & mood tracking')}
              </p>
            </div>
          </div>
          <ElButton 
            variant="gradient" 
            leftIcon={isMeditating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => setIsMeditating(!isMeditating)}
          >
            {isMeditating ? t('psychology.stop', 'Stop') : t('psychology.meditate', 'Meditate')}
          </ElButton>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Smile className="w-5 h-5 text-violet-500" />
                {t('psychology.howFeeling', 'How are you feeling?')}
              </h3>
              
              {/* Mood Score */}
              <div className="flex justify-center mb-6">
                <MoodScoreRing score={moodScore} />
              </div>

              {/* Mood Selector */}
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((mood, idx) => (
                  <motion.button
                    key={mood.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      selectedMood === mood.id
                        ? 'bg-[var(--bone-300)] shadow-neu-inset scale-105'
                        : 'hover:bg-[var(--bone-300)]/50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className={`text-xs ${selectedMood === mood.id ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                      {mood.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Weekly Mood */}
              <div className="mt-6 pt-4 border-t border-[var(--bone-400)]/30">
                <p className="text-xs text-[var(--text-secondary)] mb-3">This Week</p>
                <div className="flex justify-between">
                  {MOOD_HISTORY.map((day, idx) => (
                    <div key={day.day} className="flex flex-col items-center">
                      <span className="text-lg mb-1">{day.emoji}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Daily Check-in */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                {t('psychology.dailyCheckIn', 'Daily Check-in')}
              </h3>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 mb-4">
                <p className="text-sm text-violet-800 font-medium">{currentPrompt}</p>
              </div>

              <textarea
                placeholder="Write your thoughts here..."
                className="w-full h-24 p-3 rounded-xl bg-[var(--bone-300)]/30 border-none resize-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />

              <ElButton variant="flat" fullWidth className="mt-3" size="sm">
                {t('psychology.saveEntry', 'Save Entry')}
              </ElButton>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-[var(--bone-400)]/30">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--bone-300)]/30 text-center">
                    <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-[var(--text-primary)]">12</p>
                    <p className="text-xs text-[var(--text-secondary)]">Entries this month</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bone-300)]/30 text-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-[var(--text-primary)]">+8%</p>
                    <p className="text-xs text-[var(--text-secondary)]">Mood trend</p>
                  </div>
                </div>
              </div>
            </ElCard>
          </motion.div>

          {/* Stress Level */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ElCard className="h-full">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-500" />
                {t('psychology.stressLevel', 'Stress Level')}
              </h3>
              
              {/* Stress Indicator */}
              <div className="mb-6">
                <div className="h-4 bg-[var(--bone-300)] rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full ${STRESS_LEVELS.find(l => l.id === stressLevel)?.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: STRESS_LEVELS.find(l => l.id === stressLevel)?.width }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  {STRESS_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setStressLevel(level.id)}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        stressLevel === level.id
                          ? 'bg-[var(--bone-300)] font-medium text-[var(--text-primary)]'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meditation Presets */}
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                {t('psychology.quickCalm', 'Quick Calm')}
              </h4>
              <div className="space-y-2">
                {MEDITATION_PRESETS.map((preset, idx) => (
                  <motion.button
                    key={preset.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bone-300)]/30 hover:bg-[var(--bone-300)]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center`}>
                        <preset.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-[var(--text-primary)] text-sm">{preset.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
                      <span className="text-xs text-[var(--text-secondary)]">{preset.duration}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </ElCard>
          </motion.div>
        </div>

        {/* Meditation Player (shown when meditating) */}
        <AnimatePresence>
          {isMeditating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <ElCard variant="hologram">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center animate-pulse">
                      <Wind className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Breathing Exercise</p>
                      <p className="text-sm text-[var(--text-secondary)]">Inhale... Exhale...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono text-[var(--text-primary)]">03:45</span>
                    <button
                      onClick={() => setIsMeditating(false)}
                      className="w-10 h-10 rounded-full bg-[var(--bone-300)] flex items-center justify-center hover:bg-[var(--bone-400)] transition-colors"
                    >
                      <Pause className="w-5 h-5 text-[var(--text-primary)]" />
                    </button>
                  </div>
                </div>
              </ElCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link to Detailed View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--bone-300)]/50 hover:bg-[var(--bone-300)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--text-primary)]">
                  {t('psychology.detailedView', 'Detailed Mind Analysis')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('psychology.detailedViewDesc', 'Mood history, stress patterns, and guided sessions')}
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

export default PsychologyUnified;
