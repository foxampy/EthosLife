/**
 * Sleep Widget - Сон и качество отдыха
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, Star } from 'lucide-react';
import { WidgetSize } from '../../../store/widgetStore';

interface SleepWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

export const SleepWidget: React.FC<SleepWidgetProps> = ({
  settings,
  size,
}) => {
  const goal = settings.goal || 8;
  const lastNight = 7.5;
  const quality = 85;
  const showStages = settings.showSleepStages !== false;

  // Sleep stages (hours)
  const stages = [
    { name: 'Deep', value: 1.5, color: '#6366f1' },
    { name: 'Light', value: 4, color: '#8b5cf6' },
    { name: 'REM', value: 1.5, color: '#ec4899' },
    { name: 'Awake', value: 0.5, color: '#f59e0b' },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Sleep
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {quality}%
          </span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-3xl font-bold text-[var(--text-primary)]">
            {lastNight}h
          </span>
          <p className="text-xs text-[var(--text-tertiary)]">
            of {goal}h goal
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          lastNight >= goal
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-amber-100 text-amber-600'
        }`}>
          {lastNight >= goal ? '✓ Rested' : '⚠ Short'}
        </div>
      </div>

      {/* Sleep Stages Bar */}
      {showStages && (
        <div className="space-y-3">
          {/* Stacked bar */}
          <div className="h-4 rounded-full overflow-hidden flex">
            {stages.map((stage, index) => {
              const width = (stage.value / lastNight) * 100;
              return (
                <motion.div
                  key={stage.name}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                  style={{ backgroundColor: stage.color }}
                  title={`${stage.name}: ${stage.value}h`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-between text-xs">
            {stages.map((stage) => (
              <div key={stage.name} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-[var(--text-tertiary)]">
                  {stage.name} {stage.value}h
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bedtime / Wake time */}
      <div className="flex justify-between mt-auto pt-3 border-t border-[var(--bone-400)]/30">
        <div className="text-center">
          <p className="text-xs text-[var(--text-tertiary)]">Bedtime</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">23:15</p>
        </div>
        <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
        <div className="text-center">
          <p className="text-xs text-[var(--text-tertiary)]">Wake</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">06:45</p>
        </div>
      </div>
    </div>
  );
};

export default SleepWidget;
