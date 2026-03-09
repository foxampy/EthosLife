import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'elevated' | 'inset' | 'pulse' | 'glow';
  color?: string;
  children?: React.ReactNode;
  animate?: boolean;
  pulseColor?: string;
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128,
};

export const NeuOrb: React.FC<NeuOrbProps> = ({
  size = 'md',
  variant = 'elevated',
  color = '#e4dfd5',
  children,
  animate = false,
  pulseColor = '#5c5243',
  className,
  onClick,
}) => {
  const dimension = typeof size === 'number' ? size : sizeConfig[size];

  const variantStyles = {
    elevated: `
      rounded-full
      shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6),inset_2px_2px_4px_rgba(255,255,255,0.8)]
    `,
    inset: `
      rounded-full
      shadow-[inset_6px_6px_12px_rgba(44,40,34,0.12),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]
    `,
    pulse: `
      rounded-full
      shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)]
    `,
    glow: `
      rounded-full
      shadow-[0_0_30px_rgba(92,82,67,0.3),8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)]
    `,
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      style={{ width: dimension, height: dimension }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      animate={
        animate
          ? {
              boxShadow: [
                '8px 8px 16px rgba(44,40,34,0.15),-8px_-8px_16px rgba(255,255,255,0.6)',
                '12px 12px 24px rgba(44,40,34,0.2),-12px_-12px_24px rgba(255,255,255,0.7)',
                '8px 8px 16px rgba(44,40,34,0.15),-8px_-8px_16px rgba(255,255,255,0.6)',
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Pulse rings for pulse variant */}
      {variant === 'pulse' && animate && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: pulseColor }}
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: pulseColor }}
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </>
      )}

      {/* Main orb */}
      <motion.div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          variantStyles[variant]
        )}
        style={{ backgroundColor: color }}
        animate={
          animate && variant !== 'pulse'
            ? {
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Status orb (colored indicator)
export interface NeuStatusOrbProps {
  status: 'online' | 'away' | 'busy' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const statusColors = {
  online: '#22c55e',
  away: '#eab308',
  busy: '#ef4444',
  offline: '#8c7a6b',
};

const statusSizeConfig = {
  sm: 12,
  md: 16,
  lg: 20,
};

export const NeuStatusOrb: React.FC<NeuStatusOrbProps> = ({
  status,
  size = 'md',
  pulse = false,
  className,
}) => {
  const color = statusColors[status];
  const dimension = statusSizeConfig[size];

  return (
    <div className={cn('relative inline-flex', className)}>
      <motion.div
        className="rounded-full"
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: color,
          boxShadow: `inset 1px 1px 2px rgba(255,255,255,0.4), 0 0 0 2px #e4dfd5`,
        }}
        animate={
          pulse && status === 'online'
            ? {
                boxShadow: [
                  `inset 1px 1px 2px rgba(255,255,255,0.4), 0 0 0 2px #e4dfd5, 0 0 0 0 ${color}40`,
                  `inset 1px 1px 2px rgba(255,255,255,0.4), 0 0 0 2px #e4dfd5, 0 0 0 8px ${color}00`,
                ],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      />
    </div>
  );
};

// Activity orb (animated spinner)
export interface NeuActivityOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const activitySizeConfig = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

const speedConfig = {
  slow: 3,
  normal: 1.5,
  fast: 0.8,
};

export const NeuActivityOrb: React.FC<NeuActivityOrbProps> = ({
  size = 'md',
  color = '#5c5243',
  speed = 'normal',
  className,
}) => {
  const dimension = activitySizeConfig[size];
  const strokeWidth = dimension / 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: dimension, height: dimension }}>
      <motion.svg
        width={dimension}
        height={dimension}
        className="transform"
        animate={{ rotate: 360 }}
        transition={{ duration: speedConfig[speed], repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="#dcd3c6"
          strokeWidth={strokeWidth}
          style={{ filter: 'drop-shadow(inset 1px 1px 2px rgba(44,40,34,0.1))' }}
        />
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference * 0.75 }}
          animate={{ strokeDashoffset: [circumference * 0.75, circumference * 0.25, circumference * 0.75] }}
          transition={{ duration: speedConfig[speed] * 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
};
