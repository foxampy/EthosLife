import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: {
    track: 'h-1.5',
    thumb: 'w-4 h-4',
  },
  md: {
    track: 'h-2.5',
    thumb: 'w-5 h-5',
  },
  lg: {
    track: 'h-3.5',
    thumb: 'w-6 h-6',
  },
};

export const NeuSlider: React.FC<NeuSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueFormatter = (v) => v.toString(),
  disabled = false,
  className,
  size = 'md',
}) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const config = sizeConfig[size];

  const percentage = ((value - min) / (max - min)) * 100;

  const handleInteraction = (clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = min + newPercentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleInteraction(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleInteraction(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className={cn('text-sm font-medium', disabled ? 'text-[#8c7a6b]' : 'text-[#5c5243]')}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={cn('text-sm font-bold', disabled ? 'text-[#8c7a6b]' : 'text-[#2d2418]')}>
              {valueFormatter(value)}
            </span>
          )}
        </div>
      )}
      <div
        ref={trackRef}
        className={cn(
          'relative rounded-full cursor-pointer',
          config.track,
          'bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]',
          disabled ? 'cursor-not-allowed opacity-50' : ''
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
      >
        {/* Filled track */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#8c7a6b] to-[#5c5243] shadow-inner"
          style={{ width: `${percentage}%` }}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: isDragging ? 0 : 0.2 }}
        />

        {/* Thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-[#e4dfd5]',
            config.thumb,
            'shadow-[3px_3px_6px_rgba(44,40,34,0.2),-3px_-3px_6px_rgba(255,255,255,0.8)]'
          )}
          style={{ left: `calc(${percentage}% - ${size === 'sm' ? 8 : size === 'md' ? 10 : 12}px)` }}
          initial={false}
          animate={{
            left: `calc(${percentage}% - ${size === 'sm' ? 8 : size === 'md' ? 10 : 12}px)`,
            scale: isDragging ? 1.2 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
};

// Range slider variant (dual handle)
export interface NeuRangeSliderProps {
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const NeuRangeSlider: React.FC<NeuRangeSliderProps> = ({
  minValue,
  maxValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  disabled = false,
  className,
}) => {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [activeHandle, setActiveHandle] = React.useState<'min' | 'max' | null>(null);

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const handleInteraction = (clientX: number) => {
    if (!trackRef.current || disabled || !activeHandle) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = min + newPercentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    if (activeHandle === 'min') {
      onChange(Math.min(clampedValue, maxValue - step), maxValue);
    } else {
      onChange(minValue, Math.max(clampedValue, minValue + step));
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeHandle) {
        handleInteraction(e.clientX);
      }
    };

    const handleEnd = () => {
      setActiveHandle(null);
    };

    if (activeHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [activeHandle]);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className={cn('text-sm font-medium', disabled ? 'text-[#8c7a6b]' : 'text-[#5c5243]')}>
            {label}
          </span>
          <span className={cn('text-sm font-bold', disabled ? 'text-[#8c7a6b]' : 'text-[#2d2418]')}>
            {minValue} - {maxValue}
          </span>
        </div>
      )}
      <div
        ref={trackRef}
        className={cn(
          'relative h-2.5 rounded-full',
          'bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]',
          disabled ? 'opacity-50' : ''
        )}
      >
        {/* Filled range */}
        <motion.div
          className="absolute h-full rounded-full bg-gradient-to-r from-[#8c7a6b] to-[#5c5243]"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
          initial={false}
          animate={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Min thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#e4dfd5] cursor-pointer',
            'shadow-[3px_3px_6px_rgba(44,40,34,0.2),-3px_-3px_6px_rgba(255,255,255,0.8)]'
          )}
          style={{ left: `calc(${minPercentage}% - 10px)` }}
          onMouseDown={() => !disabled && setActiveHandle('min')}
          animate={{ scale: activeHandle === 'min' ? 1.2 : 1 }}
        />

        {/* Max thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#e4dfd5] cursor-pointer',
            'shadow-[3px_3px_6px_rgba(44,40,34,0.2),-3px_-3px_6px_rgba(255,255,255,0.8)]'
          )}
          style={{ left: `calc(${maxPercentage}% - 10px)` }}
          onMouseDown={() => !disabled && setActiveHandle('max')}
          animate={{ scale: activeHandle === 'max' ? 1.2 : 1 }}
        />
      </div>
    </div>
  );
};
