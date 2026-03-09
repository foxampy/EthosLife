import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'striped' | 'animated';
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  className?: string;
  animated?: boolean;
}

const sizeConfig = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-5',
};

const colorConfig = {
  default: 'from-[#8c7a6b] to-[#5c5243]',
  success: 'from-green-500 to-green-600',
  warning: 'from-yellow-500 to-orange-500',
  error: 'from-red-500 to-red-600',
  info: 'from-blue-500 to-blue-600',
};

export const NeuProgress: React.FC<NeuProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  color = 'default',
  showLabel = false,
  labelPosition = 'outside',
  className,
  animated = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const config = sizeConfig[size];

  return (
    <div className={cn('w-full', className)}>
      {(showLabel && labelPosition === 'outside') && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#5c5243]">Progress</span>
          <span className="text-xs font-bold text-[#2d2418]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden',
          config,
          'bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]'
        )}
      >
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            colorConfig[color],
            variant === 'striped' && 'progress-striped',
            variant === 'animated' && 'progress-animated'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.6 : 0, ease: 'easeOut' }}
        >
          {(showLabel && labelPosition === 'inside' && size !== 'sm') && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>
      </div>
      <style>{`
        .progress-striped {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 1rem 1rem;
        }
        .progress-animated {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 1rem 1rem;
          animation: progress-stripes 1s linear infinite;
        }
        @keyframes progress-stripes {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
};

// Circular progress variant
export interface NeuCircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  labelFormatter?: (value: number, max: number) => string;
  children?: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const circularColorConfig = {
  default: '#5c5243',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
};

export const NeuCircularProgress: React.FC<NeuCircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 12,
  color = 'default',
  showLabel = true,
  labelFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
  children,
  className,
  animated = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const trackColor = '#dcd3c6';
  const progressColor = circularColorConfig[color];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track with neumorphic shadow */}
        <defs>
          <filter id={`shadow-${size}`}>
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(44,40,34,0.15)" />
            <feDropShadow dx="-2" dy="-2" stdDeviation="2" floodColor="rgba(255,255,255,0.6)" />
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          filter={`url(#shadow-${size})`}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showLabel && (
          <span className="text-lg font-bold text-[#2d2418]">
            {labelFormatter(value, max)}
          </span>
        ))}
      </div>
    </div>
  );
};

// Multi-step progress (steps indicator)
export interface NeuStepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export const NeuStepProgress: React.FC<NeuStepProgressProps> = ({
  currentStep,
  totalSteps,
  labels,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isPending = step > currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                    isCompleted && 'bg-[#5c5243] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]',
                    isCurrent && 'bg-[#e4dfd5] text-[#5c5243] shadow-[4px_4px_8px_rgba(44,40,34,0.15),-4px_-4px_8px_rgba(255,255,255,0.6)]',
                    isPending && 'bg-[#e4dfd5] text-[#8c7a6b] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'
                  )}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </motion.div>
                {labels && labels[i] && (
                  <span className={cn(
                    'mt-2 text-xs font-medium',
                    isCurrent ? 'text-[#2d2418]' : 'text-[#8c7a6b]'
                  )}>
                    {labels[i]}
                  </span>
                )}
              </div>
              {step < totalSteps && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-[#e4dfd5] shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#5c5243]"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
