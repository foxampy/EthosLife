/**
 * Water Widget - Трекер потребления воды
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { WidgetSize } from '../../../store/widgetStore';

interface WaterWidgetProps {
  settings: Record<string, any>;
  size: WidgetSize;
}

export const WaterWidget: React.FC<WaterWidgetProps> = ({
  settings,
  size,
}) => {
  const goal = settings.goal || 8;
  const glassSize = settings.glassSize || 250;
  const [glasses, setGlasses] = useState(5);
  const progress = (glasses / goal) * 100;

  const addGlass = () => setGlasses((g) => Math.min(g + 1, goal + 4));
  const removeGlass = () => setGlasses((g) => Math.max(g - 1, 0));

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-500" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Water
          </span>
        </div>
        <span className="text-xs text-[var(--text-tertiary)]">
          {glasses * glassSize}ml
        </span>
      </div>

      {/* Glasses Visual */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: Math.max(goal, 8) }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`w-8 h-10 rounded-lg border-2 flex items-center justify-center ${
                index < glasses
                  ? 'bg-cyan-400/30 border-cyan-500'
                  : 'bg-[var(--bone-300)] border-[var(--bone-400)]'
              }`}
            >
              {index < glasses && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '80%' }}
                  className="w-5 bg-cyan-500/60 rounded"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={removeGlass}
          className="w-10 h-10 rounded-full bg-[var(--bone-300)] shadow-neu-pressed flex items-center justify-center text-[var(--text-secondary)]"
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        <div className="text-center">
          <span className="text-2xl font-bold text-[var(--text-primary)]">
            {glasses}
          </span>
          <span className="text-sm text-[var(--text-secondary)] ml-1">
            / {goal} glasses
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addGlass}
          className="w-10 h-10 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Progress text */}
      <div className="text-center mt-2">
        <span className={`text-sm font-medium ${
          progress >= 100 ? 'text-cyan-500' : 'text-[var(--text-tertiary)]'
        }`}>
          {progress >= 100 ? '🎉 Goal reached!' : `${Math.round(progress)}% of daily goal`}
        </span>
      </div>
    </div>
  );
};

export default WaterWidget;
