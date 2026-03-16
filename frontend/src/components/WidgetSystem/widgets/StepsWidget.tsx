/**
 * Steps Widget - Дневная активность шагов
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Footprints } from 'lucide-react';
import { WidgetSize } from '../../../store/widgetStore';

interface StepsWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

export const StepsWidget: React.FC<StepsWidgetProps> = ({
  settings,
  size,
}) => {
  const goal = settings.goal || 10000;
  const current = 7234;
  const progress = (current / goal) * 100;
  const weeklyData = [4500, 8200, 6700, 9100, 5600, 7234, 0]; // Последние 7 дней
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Footprints className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Steps
          </span>
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          Goal: {goal.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            {current.toLocaleString()}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 bg-[var(--bone-400)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Weekly Chart */}
      {settings.showChart !== false && size !== 'small' && (
        <div className="flex-1 flex items-end justify-between gap-1">
          {weeklyData.map((steps, index) => {
            const barHeight = (steps / Math.max(...weeklyData)) * 100;
            const isToday = index === weeklyData.length - 2;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-full max-w-8 rounded-t-md ${
                    isToday ? 'bg-blue-500' : 'bg-[var(--bone-400)]'
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(barHeight, 10)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                />
                <span className={`text-xs mt-1 ${isToday ? 'text-blue-500 font-medium' : 'text-[var(--text-tertiary)]'}`}>
                  {days[index]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StepsWidget;
