import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Plus, ChevronRight, Clock } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuCircularProgress } from '../Neumorphism/NeuProgress';

export interface NutritionWidgetProps {
  caloriesConsumed: number;
  caloriesGoal: number;
  macros: {
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fats: { current: number; goal: number };
  };
  lastMeal: {
    name: string;
    time: string;
    calories: number;
  };
  nextMeal?: string;
  waterIntake: number;
  waterGoal: number;
  className?: string;
  onLogMealClick?: () => void;
}

export const NutritionWidget: React.FC<NutritionWidgetProps> = ({
  caloriesConsumed,
  caloriesGoal,
  macros,
  lastMeal,
  nextMeal,
  waterIntake,
  waterGoal,
  className,
  onLogMealClick,
}) => {
  const caloriesLeft = Math.max(0, caloriesGoal - caloriesConsumed);
  const caloriesProgress = Math.min(100, (caloriesConsumed / caloriesGoal) * 100);

  const macroData = [
    { label: 'Protein', value: macros.protein.current, goal: macros.protein.goal, color: '#3b82f6' },
    { label: 'Carbs', value: macros.carbs.current, goal: macros.carbs.goal, color: '#eab308' },
    { label: 'Fats', value: macros.fats.current, goal: macros.fats.goal, color: '#ef4444' },
  ];

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Nutrition"
        icon={<Utensils className="w-5 h-5 text-green-500" />}
        action={
          <NeuButton variant="flat" size="sm" onClick={onLogMealClick} rightIcon={<ChevronRight className="w-3 h-3" />}>
            Log
          </NeuButton>
        }
      />

      <div className="flex items-center gap-4 mb-5">
        {/* Circular progress */}
        <NeuCircularProgress
          value={caloriesConsumed}
          max={caloriesGoal}
          size={110}
          strokeWidth={10}
          color="warning"
        >
          <div className="text-center">
            <span className="text-lg font-bold text-[#2d2418]">{caloriesLeft}</span>
            <span className="text-[10px] text-[#5c5243] block">kcal left</span>
          </div>
        </NeuCircularProgress>

        {/* Macros */}
        <div className="flex-1 space-y-3">
          {macroData.map((macro, index) => {
            const progress = Math.min(100, (macro.value / macro.goal) * 100);
            return (
              <motion.div
                key={macro.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#5c5243]">{macro.label}</span>
                  <span className="font-medium text-[#2d2418]">{macro.value}g</span>
                </div>
                <div className="h-2 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: macro.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Last meal */}
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
          <Utensils className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#2d2418] truncate">{lastMeal.name}</p>
          <div className="flex items-center gap-2 text-xs text-[#5c5243]">
            <Clock className="w-3 h-3" />
            <span>{lastMeal.time}</span>
            <span>•</span>
            <span>{lastMeal.calories} kcal</span>
          </div>
        </div>
      </motion.div>

      {/* Next meal reminder */}
      {nextMeal && (
        <motion.div
          className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-blue-700">Next: {nextMeal}</span>
          <Clock className="w-4 h-4 text-blue-500" />
        </motion.div>
      )}

      {/* Add meal button */}
      <NeuButton
        variant="elevated"
        size="md"
        fullWidth
        onClick={onLogMealClick}
        leftIcon={<Plus className="w-4 h-4" />}
        className="w-full"
      >
        Log Meal
      </NeuButton>
    </NeuCard>
  );
};
