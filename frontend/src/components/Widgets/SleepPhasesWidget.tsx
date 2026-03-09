import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface SleepPhase {
  phase: 'deep' | 'light' | 'rem' | 'awake';
  duration: number; // in minutes
  startTime: string;
}

export interface SleepPhasesWidgetProps {
  duration: number; // in hours
  score: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  bedTime: string;
  wakeTime: string;
  sleepDebt: number; // in minutes
  phases: SleepPhase[];
  className?: string;
  onDetailsClick?: () => void;
}

const phaseConfig = {
  deep: { color: '#4f46e5', label: 'Deep', icon: '😴' },
  light: { color: '#818cf8', label: 'Light', icon: '💤' },
  rem: { color: '#c084fc', label: 'REM', icon: '✨' },
  awake: { color: '#fbbf24', label: 'Awake', icon: '👁️' },
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'excellent': return '#22c55e';
    case 'good': return '#84cc16';
    case 'fair': return '#eab308';
    case 'poor': return '#ef4444';
    default: return '#8c7a6b';
  }
};

export const SleepPhasesWidget: React.FC<SleepPhasesWidgetProps> = ({
  duration,
  score,
  quality,
  bedTime,
  wakeTime,
  sleepDebt,
  phases,
  className,
  onDetailsClick,
}) => {
  const totalMinutes = phases.reduce((acc, phase) => acc + phase.duration, 0);
  const qualityColor = getQualityColor(quality);

  // Calculate phase percentages
  const phaseData = phases.map((phase) => ({
    ...phase,
    percentage: (phase.duration / totalMinutes) * 100,
  }));

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Sleep Analysis"
        subtitle={`${bedTime} → ${wakeTime}`}
        icon={<Moon className="w-5 h-5 text-indigo-500" />}
        action={
          <NeuButton variant="flat" size="sm" onClick={onDetailsClick}>
            Details
          </NeuButton>
        }
      />

      <div className="flex items-center gap-4 mb-5">
        {/* Sleep score circle */}
        <motion.div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(${qualityColor} ${(score / 100) * 360}deg, #dcd3c6 0deg)`,
            boxShadow: 'inset 4px 4px 8px rgba(44,40,34,0.15), inset -4px -4px 8px rgba(255,255,255,0.6)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <div className="w-20 h-20 rounded-full bg-[#e4dfd5] shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center">
            <Moon className="w-5 h-5 text-indigo-500 mb-1" />
            <span className="text-xl font-bold text-[#2d2418]">{score}</span>
          </div>
        </motion.div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <motion.span
              className="text-3xl font-bold text-[#2d2418]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {duration.toFixed(1)}
            </motion.span>
            <span className="text-sm text-[#5c5243]">hours</span>
          </div>

          <motion.span
            className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase"
            style={{
              backgroundColor: `${qualityColor}20`,
              color: qualityColor,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {quality}
          </motion.span>

          {sleepDebt > 0 && (
            <motion.div
              className="flex items-center gap-1 mt-2 text-xs text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sleep debt: {Math.floor(sleepDebt / 60)}h {sleepDebt % 60}m</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sleep phases timeline */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-[#5c5243] uppercase tracking-wider">Sleep Stages</p>

        {/* Visual timeline */}
        <div className="h-8 rounded-xl overflow-hidden flex shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1)]">
          {phaseData.map((phase, index) => (
            <motion.div
              key={index}
              className="h-full relative group cursor-pointer"
              style={{ backgroundColor: phaseConfig[phase.phase].color, width: `${phase.percentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${phase.percentage}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#2d2418] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {phaseConfig[phase.phase].label}: {Math.round(phase.duration)}min
              </div>
            </motion.div>
          ))}
        </div>

        {/* Phase legend */}
        <div className="grid grid-cols-2 gap-2">
          {(['deep', 'light', 'rem', 'awake'] as const).map((phaseType, index) => {
            const phase = phaseData.find((p) => p.phase === phaseType);
            if (!phase) return null;

            return (
              <motion.div
                key={phaseType}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <span className="text-lg">{phaseConfig[phaseType].icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#2d2418]">{phaseConfig[phaseType].label}</p>
                  <p className="text-[10px] text-[#5c5243]">{Math.round(phase.percentage)}%</p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phaseConfig[phaseType].color }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      <motion.div
        className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5" />
          <p className="text-xs text-indigo-700">
            Your deep sleep was optimal tonight. Good job maintaining consistent bedtime!
          </p>
        </div>
      </motion.div>
    </NeuCard>
  );
};
