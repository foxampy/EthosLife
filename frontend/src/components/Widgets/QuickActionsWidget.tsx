import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  Dumbbell,
  Utensils,
  Moon,
  Brain,
  Droplets,
  Heart,
  Activity,
  Target,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { NeuCard } from '../Neumorphism/NeuCard';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface QuickActionsWidgetProps {
  todayProgress?: {
    steps: number;
    stepsGoal: number;
    calories: number;
    caloriesGoal: number;
    water: number;
    waterGoal: number;
    sleep: number;
    sleepGoal: number;
  };
  quickActions?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
  }>;
  className?: string;
  onLogFood?: () => void;
  onLogWorkout?: () => void;
  onLogWater?: () => void;
  onLogSleep?: () => void;
  onLogMood?: () => void;
  onViewCalendar?: () => void;
  onSetGoal?: () => void;
}

const defaultActions = [
  { id: 'food', label: 'Еда', icon: <Utensils size={20} />, color: 'text-green-600' },
  { id: 'workout', label: 'Тренировка', icon: <Dumbbell size={20} />, color: 'text-orange-600' },
  { id: 'water', label: 'Вода', icon: <Droplets size={20} />, color: 'text-blue-600' },
  { id: 'sleep', label: 'Сон', icon: <Moon size={20} />, color: 'text-purple-600' },
  { id: 'mood', label: 'Настроение', icon: <Brain size={20} />, color: 'text-pink-600' },
  { id: 'calendar', label: 'План', icon: <Calendar size={20} />, color: 'text-indigo-600' },
];

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  todayProgress,
  quickActions = defaultActions,
  className,
  onLogFood,
  onLogWorkout,
  onLogWater,
  onLogSleep,
  onLogMood,
  onViewCalendar,
  onSetGoal,
}) => {
  const actionHandlers: Record<string, () => void> = {
    food: onLogFood || (() => {}),
    workout: onLogWorkout || (() => {}),
    water: onLogWater || (() => {}),
    sleep: onLogSleep || (() => {}),
    mood: onLogMood || (() => {}),
    calendar: onViewCalendar || (() => {}),
  };

  const getProgressColor = (current: number, goal: number) => {
    const percent = (current / goal) * 100;
    if (percent >= 100) return 'text-green-600';
    if (percent >= 70) return 'text-blue-600';
    if (percent >= 40) return 'text-amber-600';
    return 'text-red-500';
  };

  const getProgressBg = (current: number, goal: number) => {
    const percent = (current / goal) * 100;
    if (percent >= 100) return 'from-green-500 to-emerald-500';
    if (percent >= 70) return 'from-blue-500 to-cyan-500';
    if (percent >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <NeuCard className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5c5243] to-[#8c7a6b] flex items-center justify-center text-white shadow-lg">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#2d2418]">Быстрые действия</h3>
            <p className="text-xs text-[#5c5243]">Отслеживайте здоровье быстро</p>
          </div>
        </div>
        <NeuButton variant="flat" size="sm" onClick={onSetGoal}>
          <Target size={16} className="mr-1" />
          Цель
        </NeuButton>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.6)] hover:shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] transition-all flex flex-col items-center gap-2 group"
              onClick={() => actionHandlers[action.id]?.()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`${action.color} group-hover:scale-110 transition-transform`}>
                {Icon}
              </div>
              <span className="text-xs font-medium text-[#5c5243]">{action.label}</span>
            </motion.button>
          );
        })}
        
        {/* Add Custom Action */}
        <motion.button
          className="p-4 rounded-2xl bg-[#dcd3c6] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] hover:bg-[#d4ccb8] transition-all flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: quickActions.length * 0.05 }}
        >
          <Plus size={20} className="text-[#5c5243]" />
          <span className="text-xs font-medium text-[#5c5243]">Еще</span>
        </motion.button>
      </div>

      {/* Today's Progress */}
      {todayProgress && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#5c5243]" />
              <span className="text-sm font-medium text-[#5c5243]">Прогресс сегодня</span>
            </div>
            <span className="text-xs text-[#5c5243]">
              {Object.values(todayProgress).filter((v, i) => i % 2 === 0 && v >= (todayProgress as any)[Object.keys(todayProgress)[i + 1]]).length} из 4 целей
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Steps */}
            <div className="p-4 rounded-2xl bg-[#d4ccb8]/50 shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className={getProgressColor(todayProgress.steps, todayProgress.stepsGoal)} />
                <span className="text-xs text-[#5c5243]">Шаги</span>
              </div>
              <div className="text-xl font-bold text-[#2d2418] mb-2">
                {todayProgress.steps.toLocaleString()} / {todayProgress.stepsGoal.toLocaleString()}
              </div>
              <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressBg(todayProgress.steps, todayProgress.stepsGoal)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (todayProgress.steps / todayProgress.stepsGoal) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Calories */}
            <div className="p-4 rounded-2xl bg-[#d4ccb8]/50 shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <FireIcon className={getProgressColor(todayProgress.calories, todayProgress.caloriesGoal)} />
                <span className="text-xs text-[#5c5243]">Ккал</span>
              </div>
              <div className="text-xl font-bold text-[#2d2418] mb-2">
                {todayProgress.calories} / {todayProgress.caloriesGoal}
              </div>
              <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressBg(todayProgress.calories, todayProgress.caloriesGoal)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (todayProgress.calories / todayProgress.caloriesGoal) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Water */}
            <div className="p-4 rounded-2xl bg-[#d4ccb8]/50 shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <Droplets size={16} className={getProgressColor(todayProgress.water, todayProgress.waterGoal)} />
                <span className="text-xs text-[#5c5243]">Вода (мл)</span>
              </div>
              <div className="text-xl font-bold text-[#2d2418] mb-2">
                {todayProgress.water} / {todayProgress.waterGoal}
              </div>
              <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressBg(todayProgress.water, todayProgress.waterGoal)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (todayProgress.water / todayProgress.waterGoal) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Sleep */}
            <div className="p-4 rounded-2xl bg-[#d4ccb8]/50 shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
              <div className="flex items-center gap-2 mb-2">
                <Moon size={16} className={getProgressColor(todayProgress.sleep, todayProgress.sleepGoal)} />
                <span className="text-xs text-[#5c5243]">Сон (ч)</span>
              </div>
              <div className="text-xl font-bold text-[#2d2418] mb-2">
                {todayProgress.sleep} / {todayProgress.sleepGoal}
              </div>
              <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressBg(todayProgress.sleep, todayProgress.sleepGoal)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (todayProgress.sleep / todayProgress.sleepGoal) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </NeuCard>
  );
};

// Custom Fire Icon component
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={`w-4 h-4 ${className}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.699-3.181a1 1 0 111.794.952l-1.699 3.182 2.582 2.581a1 1 0 01-.952 1.794l-3.181-1.699L13 13.277V17a1 1 0 01-1 1H8a1 1 0 01-1-1v-3.723L4.746 14.95a1 1 0 01-.952-1.794l2.582-2.581-1.699-3.182a1 1 0 111.794-.952l1.699 3.181L10 4.323V3a1 1 0 011-1z" />
  </svg>
);
