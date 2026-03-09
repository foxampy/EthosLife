import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Heart, Utensils, Activity, Pill, Droplets, Dumbbell } from 'lucide-react';
import { NeuCard } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuOrb } from '../Neumorphism/NeuOrb';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export interface QuickActionsWidgetProps {
  actions?: QuickAction[];
  className?: string;
  onLogMeal?: () => void;
  onLogWorkout?: () => void;
  onLogSleep?: () => void;
  onLogVitals?: () => void;
  onLogMedication?: () => void;
  onLogWater?: () => void;
  onLogWeight?: () => void;
  onAddEntry?: () => void;
}

const defaultActions = (props: QuickActionsWidgetProps): QuickAction[] => [
  {
    id: 'meal',
    label: 'Log Meal',
    icon: <Utensils className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    onClick: props.onLogMeal || (() => {}),
  },
  {
    id: 'workout',
    label: 'Workout',
    icon: <Dumbbell className="w-5 h-5" />,
    color: 'bg-green-100 text-green-600 hover:bg-green-200',
    onClick: props.onLogWorkout || (() => {}),
  },
  {
    id: 'sleep',
    label: 'Log Sleep',
    icon: <Moon className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    onClick: props.onLogSleep || (() => {}),
  },
  {
    id: 'vitals',
    label: 'Vitals',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-red-100 text-red-600 hover:bg-red-200',
    onClick: props.onLogVitals || (() => {}),
  },
  {
    id: 'medication',
    label: 'Medication',
    icon: <Pill className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    onClick: props.onLogMedication || (() => {}),
  },
  {
    id: 'water',
    label: 'Water',
    icon: <Droplets className="w-5 h-5" />,
    color: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
    onClick: props.onLogWater || (() => {}),
  },
];

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = (props) => {
  const { actions: customActions, className, onAddEntry } = props;
  const actions = customActions || defaultActions(props);

  return (
    <NeuCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#2d2418]">Quick Actions</h3>
        {onAddEntry && (
          <NeuButton variant="flat" size="sm" onClick={onAddEntry} leftIcon={<Plus className="w-4 h-4" />}>
            Add
          </NeuButton>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={action.onClick}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl
              transition-all duration-200
              ${action.color}
              bg-[#e4dfd5]
              shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)]
              hover:shadow-[6px_6px_12px_rgba(44,40,34,0.15),-6px_-6px_12px_rgba(255,255,255,0.7)]
              active:shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={action.label}
          >
            <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shadow-sm">
              {action.icon}
            </div>
            <span className="text-[10px] font-semibold text-[#2d2418]">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* AI Assistant hint */}
      <motion.div
        className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <NeuOrb size="sm" variant="elevated" color="#f3e8ff">
          <Activity className="w-4 h-4 text-purple-500" />
        </NeuOrb>
        <div className="flex-1">
          <p className="text-xs text-purple-700 font-medium">Need help logging?</p>
          <p className="text-[10px] text-purple-600">Ask our AI assistant</p>
        </div>
        <NeuButton variant="flat" size="sm" className="text-purple-600">
          Chat
        </NeuButton>
      </motion.div>
    </NeuCard>
  );
};
