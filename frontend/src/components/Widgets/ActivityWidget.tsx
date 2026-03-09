import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Timer, Trophy, ChevronRight } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuProgress } from '../Neumorphism/NeuProgress';

export interface ActivityWidgetProps {
  calories: number;
  caloriesGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  workoutsThisWeek: number;
  weeklyGoal: number;
  currentStreak: number;
  lastWorkout: {
    type: string;
    duration: number;
    calories: number;
    date: string;
  };
  className?: string;
  onWorkoutClick?: () => void;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  calories,
  caloriesGoal,
  activeMinutes,
  activeMinutesGoal,
  workoutsThisWeek,
  weeklyGoal,
  currentStreak,
  lastWorkout,
  className,
  onWorkoutClick,
}) => {
  const caloriesProgress = Math.min(100, (calories / caloriesGoal) * 100);
  const minutesProgress = Math.min(100, (activeMinutes / activeMinutesGoal) * 100);
  const workoutsProgress = Math.min(100, (workoutsThisWeek / weeklyGoal) * 100);

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Activity"
        icon={<Activity className="w-5 h-5 text-orange-500" />}
        action={
          <NeuButton variant="flat" size="sm" onClick={onWorkoutClick} rightIcon={<ChevronRight className="w-3 h-3" />}>
            Log Workout
          </NeuButton>
        }
      />

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <motion.div
          className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
          <span className="text-2xl font-bold text-[#2d2418]">{calories.toLocaleString()}</span>
          <p className="text-[10px] text-[#5c5243] uppercase">kcal burned</p>
        </motion.div>

        <motion.div
          className="text-center p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Timer className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <span className="text-2xl font-bold text-[#2d2418]">{activeMinutes}</span>
          <p className="text-[10px] text-[#5c5243] uppercase">min active</p>
        </motion.div>
      </div>

      {/* Progress bars */}
      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#5c5243]">Calories Goal</span>
            <span className="text-xs font-medium text-[#2d2418]">{Math.round(caloriesProgress)}%</span>
          </div>
          <NeuProgress value={calories} max={caloriesGoal} size="sm" color="warning" animated />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#5c5243]">Active Minutes</span>
            <span className="text-xs font-medium text-[#2d2418]">{Math.round(minutesProgress)}%</span>
          </div>
          <NeuProgress value={activeMinutes} max={activeMinutesGoal} size="sm" color="info" animated />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#5c5243]">Weekly Workouts</span>
            <span className="text-xs font-medium text-[#2d2418]">{workoutsThisWeek}/{weeklyGoal}</span>
          </div>
          <NeuProgress value={workoutsThisWeek} max={weeklyGoal} size="sm" color="success" animated />
        </div>
      </div>

      {/* Streak indicator */}
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#2d2418]">{currentStreak} Day Streak!</p>
          <p className="text-xs text-[#5c5243]">Keep it going!</p>
        </div>
      </motion.div>

      {/* Last workout */}
      <motion.div
        className="p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-[10px] text-[#5c5243] uppercase mb-2">Last Workout</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#2d2418]">{lastWorkout.type}</p>
            <p className="text-xs text-[#5c5243]">{lastWorkout.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#2d2418]">{lastWorkout.duration} min</p>
            <p className="text-xs text-[#5c5243]">{lastWorkout.calories} kcal</p>
          </div>
        </div>
      </motion.div>
    </NeuCard>
  );
};
