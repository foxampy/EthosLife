/**
 * Quick Actions Widget - Быстрые действия для логирования
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Dumbbell, Moon, SmilePlus, Droplets, Pill } from 'lucide-react';
import { WidgetSize } from '../../../store/widgetStore';

interface QuickActionsWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

const actions = [
  { id: 'meal', label: 'Meal', icon: Utensils, color: '#f97316', bgColor: 'bg-orange-100' },
  { id: 'workout', label: 'Workout', icon: Dumbbell, color: '#22c55e', bgColor: 'bg-emerald-100' },
  { id: 'sleep', label: 'Sleep', icon: Moon, color: '#6366f1', bgColor: 'bg-indigo-100' },
  { id: 'mood', label: 'Mood', icon: SmilePlus, color: '#fbbf24', bgColor: 'bg-amber-100' },
  { id: 'water', label: 'Water', icon: Droplets, color: '#06b6d4', bgColor: 'bg-cyan-100' },
  { id: 'medication', label: 'Meds', icon: Pill, color: '#ec4899', bgColor: 'bg-pink-100' },
];

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  settings,
  size,
}) => {
  const visibleActions = actions.filter((a) => settings[a.id] !== false);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Quick Log
        </span>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl ${action.bgColor} hover:brightness-95 transition-all`}
              onClick={() => console.log(`Log ${action.label}`)}
            >
              <Icon className="w-6 h-6 mb-1" style={{ color: action.color }} />
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-xs text-center text-[var(--text-tertiary)] mt-3">
        Tap to log instantly
      </p>
    </div>
  );
};

export default QuickActionsWidget;
