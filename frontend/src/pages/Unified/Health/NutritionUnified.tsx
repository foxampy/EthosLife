/**
 * NutritionUnified - Nutrition Health Module Page
 * Clean, minimal design with key metrics and quick actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Utensils,
  Flame,
  Droplets,
  Plus,
  TrendingUp,
  ChevronRight,
  Apple,
  Beef,
  Wheat,
  Droplet,
} from 'lucide-react';
import { ElCard, ElButton } from '../../../components/ElCore';

// Mock data for metrics
const METRICS = {
  calories: { current: 1850, goal: 2200, unit: 'kcal' },
  protein: { current: 95, goal: 150, unit: 'g' },
  carbs: { current: 180, goal: 275, unit: 'g' },
  fat: { current: 55, goal: 73, unit: 'g' },
  water: { current: 5, goal: 8, unit: 'glasses' },
};

const WEEKLY_DATA = [
  { day: 'Mon', calories: 1850 },
  { day: 'Tue', calories: 2100 },
  { day: 'Wed', calories: 1950 },
  { day: 'Thu', calories: 2300 },
  { day: 'Fri', calories: 2050 },
  { day: 'Sat', calories: 2400 },
  { day: 'Sun', calories: 1820 },
];

const RECENT_MEALS = [
  { id: 1, name: 'Oatmeal with Berries', calories: 320, time: '8:00 AM', type: 'breakfast' },
  { id: 2, name: 'Grilled Chicken Salad', calories: 450, time: '1:00 PM', type: 'lunch' },
  { id: 3, name: 'Greek Yogurt', calories: 120, time: '4:00 PM', type: 'snack' },
];

// Metric Card Component
const MetricCard: React.FC<{
  icon: React.ElementType;
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  delay?: number;
}> = ({ icon: Icon, label, current, goal, unit, color, delay = 0 }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <ElCard variant="flat" className="h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-[var(--text-primary)]">{current}</span>
          <span className="text-sm text-[var(--text-tertiary)]">/ {goal} {unit}</span>
        </div>
        <div className="h-2 bg-[var(--bone-300)] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color.replace('bg-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
          />
        </div>
      </ElCard>
    </motion.div>
  );
};

export const NutritionUnified: React.FC = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState(RECENT_MEALS);

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
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {t('nutrition.title', 'Nutrition')}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('nutrition.subtitle', 'Track your daily intake')}
              </p>
            </div>
          </div>
          <ElButton variant="gradient" leftIcon={<Plus className="w-4 h-4" />}>
            {t('nutrition.logMeal', 'Log Meal')}
          </ElButton>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard
            icon={Flame}
            label={t('nutrition.calories', 'Calories')}
            current={METRICS.calories.current}
            goal={METRICS.calories.goal}
            unit={METRICS.calories.unit}
            color="bg-gradient-to-br from-orange-500 to-amber-500"
            delay={0.1}
          />
          <MetricCard
            icon={Beef}
            label={t('nutrition.protein', 'Protein')}
            current={METRICS.protein.current}
            goal={METRICS.protein.goal}
            unit={METRICS.protein.unit}
            color="bg-gradient-to-br from-rose-500 to-pink-500"
            delay={0.15}
          />
          <MetricCard
            icon={Wheat}
            label={t('nutrition.carbs', 'Carbs')}
            current={METRICS.carbs.current}
            goal={METRICS.carbs.goal}
            unit={METRICS.carbs.unit}
            color="bg-gradient-to-br from-amber-500 to-yellow-500"
            delay={0.2}
          />
          <MetricCard
            icon={Droplet}
            label={t('nutrition.fat', 'Fat')}
            current={METRICS.fat.current}
            goal={METRICS.fat.goal}
            unit={METRICS.fat.unit}
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
            delay={0.25}
          />
          <MetricCard
            icon={Droplets}
            label={t('nutrition.water', 'Water')}
            current={METRICS.water.current}
            goal={METRICS.water.goal}
            unit={METRICS.water.unit}
            color="bg-gradient-to-br from-cyan-500 to-blue-500"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <ElCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--text-secondary)]" />
                  {t('nutrition.weeklyProgress', 'Weekly Progress')}
                </h3>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {t('nutrition.avgCalories', 'Avg: 2,067 kcal')}
                </span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {WEEKLY_DATA.map((day, idx) => {
                  const height = (day.calories / 2500) * 100;
                  const isToday = idx === 6;
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + idx * 0.05, duration: 0.4 }}
                        className={`w-full rounded-t-lg ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                            : 'bg-[var(--stone-500)]/50'
                        }`}
                      />
                      <span className={`text-xs mt-2 ${isToday ? 'font-semibold text-emerald-600' : 'text-[var(--text-tertiary)]'}`}>
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ElCard>
          </motion.div>

          {/* Today's Meals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ElCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Apple className="w-5 h-5 text-[var(--text-secondary)]" />
                  {t('nutrition.todayMeals', "Today's Meals")}
                </h3>
                <button className="text-sm text-[var(--neon-cyan)] hover:underline">
                  {t('common.viewAll', 'View All')}
                </button>
              </div>
              <div className="space-y-3">
                {meals.map((meal, idx) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--bone-300)]/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bone-200)] shadow-neu flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)] text-sm">{meal.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{meal.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {meal.calories} kcal
                    </span>
                  </motion.div>
                ))}
              </div>
              <ElButton variant="flat" fullWidth className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
                {t('nutrition.addMeal', 'Add Meal')}
              </ElButton>
            </ElCard>
          </motion.div>
        </div>

        {/* Link to Detailed View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--bone-300)]/50 hover:bg-[var(--bone-300)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--text-primary)]">
                  {t('nutrition.detailedView', 'Detailed Nutrition View')}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('nutrition.detailedViewDesc', 'Analytics, recipes, and meal planning')}
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

export default NutritionUnified;
