import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, Minus, GlassWater } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';
import { NeuProgress } from '../Neumorphism/NeuProgress';

export interface WaterTrackerWidgetProps {
  current: number;
  goal: number;
  className?: string;
  onAddWater?: (amount: number) => void;
}

export const WaterTrackerWidget: React.FC<WaterTrackerWidgetProps> = ({
  current,
  goal,
  className,
  onAddWater,
}) => {
  const percentage = Math.min(100, (current / goal) * 100);
  const remaining = Math.max(0, goal - current);

  // Calculate filled cups (assuming 250ml per cup)
  const cupSize = 250;
  const filledCups = Math.floor(current / cupSize);
  const totalCups = Math.ceil(goal / cupSize);

  const quickAddAmounts = [250, 500, 750];

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Water Tracker"
        subtitle={`Goal: ${goal}ml`}
        icon={<Droplets className="w-5 h-5 text-blue-500" />}
      />

      {/* Main progress display */}
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          className="relative w-20 h-20 rounded-full bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          {/* Water fill animation */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400"
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Wave effect */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-2 bg-blue-400/50"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>

          {/* Percentage text */}
          <span className="relative z-10 text-xl font-bold text-[#2d2418] mix-blend-difference text-white">
            {Math.round(percentage)}%
          </span>
        </motion.div>

        <div className="flex-1">
          <motion.div
            className="text-3xl font-bold text-[#2d2418]"
            key={current}
            initial={{ scale: 1.2, color: '#3b82f6' }}
            animate={{ scale: 1, color: '#2d2418' }}
            transition={{ duration: 0.3 }}
          >
            {current.toLocaleString()}
            <span className="text-sm text-[#5c5243] ml-1">ml</span>
          </motion.div>
          <p className="text-sm text-[#5c5243]">
            {remaining > 0 ? `${remaining}ml to goal` : 'Goal reached! 🎉'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <NeuProgress
        value={current}
        max={goal}
        size="lg"
        color="info"
        animated
        className="mb-5"
      />

      {/* Visual cups */}
      <div className="flex justify-center gap-2 mb-5 flex-wrap">
        {Array.from({ length: Math.min(totalCups, 8) }, (_, i) => (
          <motion.div
            key={i}
            className={`
              w-8 h-10 rounded-lg flex items-center justify-center
              ${i < filledCups
                ? 'bg-blue-100 shadow-[inset_2px_2px_4px_rgba(59,130,246,0.2)]'
                : 'bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'
              }
            `}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassWater
              className={`w-5 h-5 ${i < filledCups ? 'text-blue-500' : 'text-[#c8c2b6]'}`}
            />
          </motion.div>
        ))}
        {totalCups > 8 && (
          <span className="flex items-center text-sm text-[#5c5243]">
            +{totalCups - 8} more
          </span>
        )}
      </div>

      {/* Quick add buttons */}
      <div className="grid grid-cols-4 gap-2">
        <NeuButton
          variant="inset"
          size="sm"
          onClick={() => onAddWater?.(-250)}
          className="aspect-square"
        >
          <Minus className="w-4 h-4" />
        </NeuButton>
        {quickAddAmounts.map((amount) => (
          <NeuButton
            key={amount}
            variant="elevated"
            size="sm"
            onClick={() => onAddWater?.(amount)}
            className="bg-blue-50 hover:bg-blue-100"
          >
            +{amount}
          </NeuButton>
        ))}
      </div>
    </NeuCard>
  );
};
