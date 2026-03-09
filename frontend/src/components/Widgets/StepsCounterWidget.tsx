import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Footprints, Target, TrendingUp, Flame, MapPin } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuGauge } from '../Neumorphism/NeuGauge';

export interface StepsCounterWidgetProps {
  steps: number;
  goal: number;
  calories: number;
  distance: number; // in km
  activeMinutes: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  className?: string;
  onDetailsClick?: () => void;
}

// Animated counter hook
const useAnimatedCounter = (value: number, duration: number = 1) => {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return display;
};

export const StepsCounterWidget: React.FC<StepsCounterWidgetProps> = ({
  steps,
  goal,
  calories,
  distance,
  activeMinutes,
  trend = 'up',
  trendValue = 12,
  className,
  onDetailsClick,
}) => {
  const [isClient, setIsClient] = useState(false);
  const animatedSteps = useAnimatedCounter(steps);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const percentage = Math.min(100, (steps / goal) * 100);
  const remaining = Math.max(0, goal - steps);

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Steps Today"
        icon={<Footprints className="w-5 h-5" />}
        action={
          <NeuButton variant="flat" size="sm" onClick={onDetailsClick}>
            Details
          </NeuButton>
        }
      />

      <div className="flex flex-col items-center">
        {/* Main step counter */}
        <div className="relative mb-4">
          <NeuGauge
            value={percentage}
            size={180}
            strokeWidth={18}
            startAngle={135}
            endAngle={405}
            color={{ start: '#22c55e', end: '#10b981' }}
            showTicks={false}
            showValue={false}
            animated
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-4xl font-bold text-[#2d2418]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {isClient ? (
                <motion.span>{animatedSteps}</motion.span>
              ) : (
                steps.toLocaleString()
              )}
            </motion.div>
            <span className="text-xs text-[#5c5243]">steps</span>
          </div>

          {/* Goal badge */}
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#e4dfd5] shadow-[3px_3px_6px_rgba(44,40,34,0.15),-3px_-3px_6px_rgba(255,255,255,0.6)]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-xs font-medium text-[#5c5243]">
              Goal: {goal.toLocaleString()}
            </span>
          </motion.div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full mt-4">
          <motion.div
            className="text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-[#2d2418]">{calories}</p>
            <p className="text-[10px] text-[#5c5243] uppercase">Kcal</p>
          </motion.div>

          <motion.div
            className="text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MapPin className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-[#2d2418]">{distance.toFixed(1)}</p>
            <p className="text-[10px] text-[#5c5243] uppercase">km</p>
          </motion.div>

          <motion.div
            className="text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TrendingUp className="w-4 h-4 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-[#2d2418]">{activeMinutes}</p>
            <p className="text-[10px] text-[#5c5243] uppercase">min</p>
          </motion.div>
        </div>

        {/* Remaining indicator */}
        {remaining > 0 && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-sm text-[#5c5243]">
              {remaining.toLocaleString()} steps to reach your goal
            </span>
          </motion.div>
        )}
      </div>
    </NeuCard>
  );
};
