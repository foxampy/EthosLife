import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Activity, Sun, ChevronRight } from 'lucide-react';
import { NeuCard, NeuCardHeader } from '../Neumorphism';
import { NeuButton } from '../Neumorphism/NeuButton';

export interface RingData {
  current: number;
  goal: number;
  color: string;
  icon: 'flame' | 'activity' | 'sun';
  label: string;
  unit: string;
}

export interface DailyRingsWidgetProps {
  move: RingData;
  exercise: RingData;
  stand: RingData;
  className?: string;
  onDetailsClick?: () => void;
}

const RingProgress: React.FC<{
  progress: number;
  color: string;
  size: number;
  strokeWidth: number;
  index: number;
}> = ({ progress, color, size, strokeWidth, index }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.svg
      width={size}
      height={size}
      className="transform -rotate-90 absolute"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring' }}
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`${color}20`}
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ delay: 0.3 + index * 0.2, duration: 0.8, ease: 'easeOut' }}
        style={{
          filter: `drop-shadow(0 0 4px ${color}40)`,
        }}
      />
    </motion.svg>
  );
};

export const DailyRingsWidget: React.FC<DailyRingsWidgetProps> = ({
  move,
  exercise,
  stand,
  className,
  onDetailsClick,
}) => {
  const rings = [move, exercise, stand];
  const ringSizes = [180, 140, 100];
  const strokeWidths = [20, 16, 12];

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(100, (current / goal) * 100);
  };

  const getIcon = (iconName: string) => {
    const className = "w-5 h-5";
    switch (iconName) {
      case 'flame': return <Flame className={className} />;
      case 'activity': return <Activity className={className} />;
      case 'sun': return <Sun className={className} />;
      default: return <Activity className={className} />;
    }
  };

  return (
    <NeuCard className={className} hover>
      <NeuCardHeader
        title="Activity Rings"
        icon={<Activity className="w-5 h-5" />}
        action={
          <NeuButton
            variant="flat"
            size="sm"
            onClick={onDetailsClick}
            rightIcon={<ChevronRight className="w-3 h-3" />}
          >
            Movement
          </NeuButton>
        }
      />

      {/* Rings container */}
      <div className="relative h-56 flex items-center justify-center">
        {rings.map((ring, index) => (
          <RingProgress
            key={ring.label}
            progress={calculateProgress(ring.current, ring.goal)}
            color={ring.color}
            size={ringSizes[index]}
            strokeWidth={strokeWidths[index]}
            index={index}
          />
        ))}

        {/* Center icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <Activity className="w-6 h-6 text-[#5c5243] mx-auto mb-1" />
            <span className="text-xs font-bold text-[#2d2418]">Daily</span>
          </div>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {rings.map((ring, index) => (
          <motion.div
            key={ring.label}
            className="text-center p-3 rounded-2xl bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1" style={{ color: ring.color }}>
              {getIcon(ring.icon)}
            </div>
            <p className="text-lg font-bold text-[#2d2418]">
              {ring.current.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#5c5243] uppercase tracking-wider">
              {ring.label}
            </p>
          </motion.div>
        ))}
      </div>
    </NeuCard>
  );
};
