import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, ChevronRight } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface HabitData {
  date: string;
  completed: boolean;
  intensity?: number; // 0-4 for heat level
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  history: HabitData[];
}

export interface HabitHeatmapWidgetProps {
  habits: Habit[];
  className?: string;
  onHabitClick?: (habitId: string) => void;
  onViewAllClick?: () => void;
}

const HeatmapCell: React.FC<{
  completed: boolean;
  intensity: number;
  index: number;
  isToday?: boolean;
}> = ({ completed, intensity, index, isToday }) => {
  const getIntensityColor = (level: number) => {
    if (!completed) return 'bg-[#dcd3c6]';
    const colors = [
      'bg-green-200',
      'bg-green-300',
      'bg-green-400',
      'bg-green-500',
      'bg-green-600',
    ];
    return colors[Math.min(level, 4)];
  };

  return (
    <motion.div
      className={`
        aspect-square rounded-md
        ${getIntensityColor(intensity)}
        ${isToday ? 'ring-2 ring-[#5c5243] ring-offset-1' : ''}
        shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)]
      `}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01, type: 'spring', stiffness: 500 }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      title={completed ? 'Completed' : 'Not completed'}
    />
  );
};

export const HabitHeatmapWidget: React.FC<HabitHeatmapWidgetProps> = ({
  habits,
  className,
  onHabitClick,
  onViewAllClick,
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Generate last 49 days (7 weeks) for each habit
  const generateHeatmapData = (habitHistory: HabitData[]) => {
    const data: (HabitData & { isToday: boolean })[] = [];
    const today = new Date();

    for (let i = 48; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = habitHistory.find((h) => h.date === dateStr);
      data.push({
        date: dateStr,
        completed: existing?.completed || false,
        intensity: existing?.intensity || (existing?.completed ? 3 : 0),
        isToday: i === 0,
      });
    }

    return data;
  };

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Habit Tracker"
        subtitle="Last 7 weeks"
        icon={<Target className="w-5 h-5" />}
        action={
          <NeuButton
            variant="flat"
            size="sm"
            onClick={onViewAllClick}
            rightIcon={<ChevronRight className="w-3 h-3" />}
          >
            All
          </NeuButton>
        }
      />

      <div className="space-y-5">
        {habits.slice(0, 3).map((habit, habitIndex) => {
          const heatmapData = generateHeatmapData(habit.history);

          return (
            <motion.div
              key={habit.id}
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: habitIndex * 0.1 }}
            >
              {/* Habit header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => onHabitClick?.(habit.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{habit.icon}</span>
                  <span className="text-sm font-semibold text-[#2d2418]">{habit.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#5c5243]">
                  <span className="text-orange-500">🔥</span>
                  <span>{habit.streak} days</span>
                </div>
              </div>

              {/* Heatmap grid */}
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.map((day, index) => (
                  <HeatmapCell
                    key={day.date}
                    completed={day.completed}
                    intensity={day.intensity}
                    index={index}
                    isToday={day.isToday}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-[#dcd3c6]/50 flex items-center justify-between">
        <span className="text-xs text-[#8c7a6b]">Less</span>
        <div className="flex gap-1">
          {['bg-[#dcd3c6]', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'].map(
            (color, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded ${color} shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)]`}
              />
            )
          )}
        </div>
        <span className="text-xs text-[#8c7a6b]">More</span>
      </div>
    </NeuCard>
  );
};
