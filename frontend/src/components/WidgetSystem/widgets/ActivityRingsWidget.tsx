/**
 * Activity Rings Widget - Apple Watch-style activity rings
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { WidgetSize } from '../../../store/widgetStore';

interface ActivityRingsWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

export const ActivityRingsWidget: React.FC<ActivityRingsWidgetProps> = ({
  settings,
  size,
}) => {
  // Моковые данные
  const activities = [
    { name: 'Move', value: 420, goal: 500, color: '#ff3b30', unit: 'kcal' },
    { name: 'Exercise', value: 25, goal: 30, color: '#34c759', unit: 'min' },
    { name: 'Stand', value: 8, goal: 12, color: '#007aff', unit: 'hrs' },
  ];

  const ringConfig = [
    { radius: 48, strokeWidth: 10 },
    { radius: 36, strokeWidth: 10 },
    { radius: 24, strokeWidth: 10 },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Activity
        </span>
      </div>

      {/* Rings */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            {activities.map((activity, index) => {
              const config = ringConfig[index];
              const circumference = 2 * Math.PI * config.radius;
              const progress = Math.min(activity.value / activity.goal, 1);
              const strokeDashoffset = circumference - progress * circumference;

              return (
                <motion.circle
                  key={activity.name}
                  cx="64"
                  cy="64"
                  r={config.radius}
                  fill="none"
                  stroke={activity.color}
                  strokeWidth={config.strokeWidth}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                  style={{
                    strokeDasharray: circumference,
                    opacity: 0.9,
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {Math.round(activities.reduce((acc, a) => acc + a.value / a.goal, 0) / 3 * 100)}%
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">avg</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2 text-xs">
        {activities.map((activity) => (
          <div key={activity.name} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activity.color }}
            />
            <span className="text-[var(--text-tertiary)]">
              {activity.value}/{activity.goal}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityRingsWidget;
