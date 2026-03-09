import React from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface BodyMetricsWidgetProps {
  weight: {
    current: number;
    unit: string;
    change: number;
    trend: number[];
  };
  bmi: {
    value: number;
    category: string;
    idealRange: string;
  };
  bodyFat?: number;
  muscleMass?: number;
  goalProgress: number;
  daysToGoal?: number;
  className?: string;
  onHistoryClick?: () => void;
}

const Sparkline: React.FC<{ data: number[]; color?: string; width?: number; height?: number }> = ({
  data,
  color = '#5c5243',
  width = 120,
  height = 40,
}) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const isUp = data[data.length - 1] >= data[0];

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="3"
          fill={color}
        />
      </svg>
      <div className="absolute -right-1 -top-1">
        {isUp ? (
          <TrendingUp className="w-3 h-3 text-green-500" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-500" />
        )}
      </div>
    </div>
  );
};

export const BodyMetricsWidget: React.FC<BodyMetricsWidgetProps> = ({
  weight,
  bmi,
  bodyFat,
  muscleMass,
  goalProgress,
  daysToGoal,
  className,
  onHistoryClick,
}) => {
  const isWeightDown = weight.change < 0;

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Body Metrics"
        icon={<Scale className="w-5 h-5" />}
        action={
          <NeuButton variant="flat" size="sm" onClick={onHistoryClick} rightIcon={<ChevronRight className="w-3 h-3" />}>
            History
          </NeuButton>
        }
      />

      {/* Weight display */}
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-[#2d2418]">{weight.current}</span>
            <span className="text-sm text-[#5c5243]">{weight.unit}</span>
          </div>
          <div className={`flex items-center gap-1 text-sm ${isWeightDown ? 'text-green-600' : 'text-red-500'}`}>
            {isWeightDown ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span>{isWeightDown ? '' : '+'}{weight.change} {weight.unit}</span>
          </div>
        </motion.div>

        <Sparkline data={weight.trend} />
      </div>

      {/* BMI Card */}
      <motion.div
        className="p-4 rounded-2xl bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#5c5243] uppercase">BMI</span>
          <span className="text-xs text-[#8c7a6b]">{bmi.idealRange}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#2d2418]">{bmi.value}</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            bmi.category === 'Normal' ? 'bg-green-100 text-green-700' :
            bmi.category === 'Overweight' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {bmi.category}
          </span>
        </div>

        {/* BMI scale */}
        <div className="mt-3 relative h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2d2418] shadow-md"
            style={{ left: `${Math.min(100, (bmi.value / 40) * 100)}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#8c7a6b] mt-1">
          <span>15</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
      </motion.div>

      {/* Additional metrics */}
      {(bodyFat !== undefined || muscleMass !== undefined) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {bodyFat !== undefined && (
            <motion.div
              className="p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-[10px] text-[#5c5243] uppercase">Body Fat</p>
              <p className="text-lg font-bold text-[#2d2418]">{bodyFat}%</p>
            </motion.div>
          )}
          {muscleMass !== undefined && (
            <motion.div
              className="p-3 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-[10px] text-[#5c5243] uppercase">Muscle</p>
              <p className="text-lg font-bold text-[#2d2418]">{muscleMass}%</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Goal progress */}
      <motion.div
        className="p-3 rounded-xl bg-gradient-to-r from-[#5c5243] to-[#8c7a6b] text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium opacity-90">Goal Progress</span>
          <span className="text-sm font-bold">{goalProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress}%` }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
        </div>
        {daysToGoal && (
          <p className="text-xs mt-2 opacity-80">{daysToGoal} days to reach your goal</p>
        )}
      </motion.div>
    </NeuCard>
  );
};
