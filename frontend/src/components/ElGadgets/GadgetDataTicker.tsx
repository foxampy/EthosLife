/**
 * GadgetDataTicker - Scrolling Data Display
 * Retrofuturism Design System
 * 
 * A sci-fi inspired scrolling ticker for displaying
 * real-time data, metrics, or news.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// TYPES
// ============================================
export interface TickerItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface GadgetDataTickerProps {
  items: TickerItem[];
  title?: string;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const GadgetDataTicker: React.FC<GadgetDataTickerProps> = ({
  items,
  title,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
  className,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [duplicatedItems, setDuplicatedItems] = useState<TickerItem[]>([]);

  // Duplicate items for seamless loop
  useEffect(() => {
    setDuplicatedItems([...items, ...items, ...items]);
  }, [items]);

  const speedConfig = {
    slow: 40,
    normal: 25,
    fast: 15,
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-[var(--neon-green)]';
      case 'down':
        return 'text-[var(--neon-red)]';
      default:
        return 'text-[var(--text-tertiary)]';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return '▲';
      case 'down':
        return '▼';
      default:
        return '●';
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-[var(--bone-300)]',
        'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
        'border border-[var(--neon-cyan)]/20',
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--bone-400)]/30">
          <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
          <span className="font-future text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            {title}
          </span>
        </div>
      )}

      {/* Ticker container */}
      <div className="relative h-12 overflow-hidden">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bone-300)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bone-300)] to-transparent z-10" />

        {/* Scrolling content */}
        <motion.div
          className={cn(
            'flex items-center gap-8 h-full',
            direction === 'right' && 'flex-row-reverse'
          )}
          animate={{
            x: direction === 'left' ? [0, -33.33 + '%'] : [0, 33.33 + '%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: speedConfig[speed],
              ease: 'linear',
            },
          }}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-xl',
                'bg-[var(--bone-200)]',
                'shadow-[2px_2px_4px_rgba(44,40,34,0.05),-2px_-2px_4px_rgba(255,255,255,0.5)]',
                'flex-shrink-0'
              )}
            >
              {/* Icon */}
              {item.icon && (
                <span className="text-[var(--text-secondary)]">{item.icon}</span>
              )}

              {/* Label */}
              <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                {item.label}
              </span>

              {/* Value */}
              <span className="font-mono font-bold text-[var(--text-primary)]">
                {item.value}
                {item.unit && (
                  <span className="text-xs text-[var(--text-tertiary)] ml-1">
                    {item.unit}
                  </span>
                )}
              </span>

              {/* Change indicator */}
              {item.change !== undefined && (
                <span
                  className={cn(
                    'font-mono text-xs flex items-center gap-1',
                    getTrendColor(item.trend)
                  )}
                >
                  {getTrendIcon(item.trend)}
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </span>
              )}

              {/* Separator */}
              <div className="w-px h-6 bg-[var(--bone-400)]" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GadgetDataTicker;
