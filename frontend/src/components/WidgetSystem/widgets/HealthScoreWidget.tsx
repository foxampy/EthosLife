/**
 * Health Score Widget - Отображает общий индекс здоровья пользователя
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WidgetSize } from '../../../store/widgetStore';

interface HealthScoreWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

export const HealthScoreWidget: React.FC<HealthScoreWidgetProps> = ({
  settings,
  size,
}) => {
  const { t } = useTranslation();
  
  // Моковые данные - в реальном приложении будут из API
  const score = 87;
  const trend = 'up'; // 'up' | 'down' | 'stable'
  const trendValue = 3;

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-[var(--neon-cyan)]" />
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Health Score
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Circular Progress */}
        <div className="relative">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-[var(--bone-400)]"
            />
            {/* Progress circle */}
            <motion.circle
              cx="56"
              cy="56"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getScoreColor(score)}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">/100</span>
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-center gap-1 mt-2 text-sm">
          {React.cloneElement(getTrendIcon() as React.ReactElement, {
            className: trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
          })}
          <span className={
            trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
          }>
            {(trend === 'up' ? '+' : trend === 'down' ? '-' : '')}{trendValue}%
          </span>
          <span className="text-[var(--text-tertiary)]">this week</span>
        </div>
      </div>

      {/* Footer - conditions */}
      <div className="flex justify-center gap-2 mt-2">
        {['Cardio', 'Sleep', 'Nutrition'].map((condition) => (
          <span
            key={condition}
            className="px-2 py-0.5 text-xs rounded-full bg-[var(--bone-300)] text-[var(--text-secondary)]"
          >
            {condition} ✓
          </span>
        ))}
      </div>
    </div>
  );
};

export default HealthScoreWidget;
