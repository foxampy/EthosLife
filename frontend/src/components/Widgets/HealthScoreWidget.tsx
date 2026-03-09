import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { NeuCard, NeuCardHeader, NeuCircularProgress } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface HealthScoreWidgetProps {
  score: number;
  lastWeekScore: number;
  trend: 'up' | 'down' | 'stable';
  breakdown: {
    fitness: number;
    nutrition: number;
    sleep: number;
    mental: number;
  };
  className?: string;
  onDetailsClick?: () => void;
}

export const HealthScoreWidget: React.FC<HealthScoreWidgetProps> = ({
  score,
  lastWeekScore,
  trend,
  breakdown,
  className,
  onDetailsClick,
}) => {
  const difference = score - lastWeekScore;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const progressColor = score > 80 ? 'success' : score > 60 ? 'warning' : 'error';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const breakdownItems = [
    { label: 'Fitness', value: breakdown.fitness, color: 'bg-blue-500' },
    { label: 'Nutrition', value: breakdown.nutrition, color: 'bg-green-500' },
    { label: 'Sleep', value: breakdown.sleep, color: 'bg-indigo-500' },
    { label: 'Mental', value: breakdown.mental, color: 'bg-purple-500' },
  ];

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Health Score"
        icon={<Heart className="w-5 h-5" />}
        action={
          <NeuButton
            variant="flat"
            size="sm"
            onClick={onDetailsClick}
            rightIcon={<ChevronRight className="w-3 h-3" />}
          >
            Details
          </NeuButton>
        }
      />

      <div className="flex flex-col items-center">
        <div className="relative">
          <NeuCircularProgress
            value={score}
            max={100}
            size={160}
            strokeWidth={16}
            color={progressColor as 'success' | 'warning' | 'error'}
          >
            <div className="text-center">
              <motion.span
                className="text-5xl font-bold text-[#2d2418]"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {score}
              </motion.span>
              <span className="text-sm text-[#5c5243] block">/100</span>
            </div>
          </NeuCircularProgress>

          {/* Trend badge */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <TrendIcon className={`w-6 h-6 ${trendColor}`} />
          </motion.div>
        </div>

        {/* Comparison text */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-[#5c5243]">vs last week:</span>
          <span className={`font-bold ${trendColor}`}>
            {trend === 'up' ? '+' : ''}{difference}
          </span>
        </div>

        {/* Breakdown */}
        <div className="mt-5 w-full space-y-3">
          {breakdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <span className="text-xs font-medium text-[#5c5243] w-16">{item.label}</span>
              <div className="flex-1 h-2 bg-[#dcd3c6] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1)]">
                <motion.div
                  className={`h-full rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                />
              </div>
              <span className="text-xs font-bold text-[#2d2418] w-8 text-right">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </NeuCard>
  );
};
