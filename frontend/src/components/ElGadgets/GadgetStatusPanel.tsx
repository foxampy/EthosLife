/**
 * GadgetStatusPanel - LED Status Panel Component
 * Retrofuturism Design System
 * 
 * A panel with LED-style indicators for showing system status,
 * health metrics, or any boolean/tristate data.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// TYPES
// ============================================
export type StatusValue = 'good' | 'warning' | 'error' | 'neutral' | 'active';

export interface StatusItem {
  id: string;
  label: string;
  value: StatusValue;
  message?: string;
  icon?: React.ReactNode;
}

export interface GadgetStatusPanelProps {
  items: StatusItem[];
  title?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const statusConfig: Record<StatusValue, {
  color: string;
  glow: string;
  bg: string;
  label: string;
}> = {
  good: {
    color: 'text-[var(--neon-green)]',
    glow: 'shadow-[0_0_10px_rgba(0,255,136,0.8)]',
    bg: 'bg-[var(--neon-green)]',
    label: 'OPTIMAL',
  },
  warning: {
    color: 'text-[var(--neon-amber)]',
    glow: 'shadow-[0_0_10px_rgba(255,183,0,0.8)]',
    bg: 'bg-[var(--neon-amber)]',
    label: 'WARNING',
  },
  error: {
    color: 'text-[var(--neon-red)]',
    glow: 'shadow-[0_0_10px_rgba(255,51,102,0.8)]',
    bg: 'bg-[var(--neon-red)]',
    label: 'CRITICAL',
  },
  neutral: {
    color: 'text-[var(--text-tertiary)]',
    glow: '',
    bg: 'bg-[var(--text-tertiary)]',
    label: 'STANDBY',
  },
  active: {
    color: 'text-[var(--neon-cyan)]',
    glow: 'shadow-[0_0_10px_rgba(0,217,255,0.8)]',
    bg: 'bg-[var(--neon-cyan)]',
    label: 'ACTIVE',
  },
};

const layoutStyles = {
  horizontal: 'flex flex-wrap gap-4',
  vertical: 'flex flex-col gap-3',
  grid: 'grid grid-cols-2 gap-4',
};

const sizeStyles = {
  sm: {
    led: 'w-2 h-2',
    text: 'text-xs',
    padding: 'p-2',
  },
  md: {
    led: 'w-3 h-3',
    text: 'text-sm',
    padding: 'p-3',
  },
  lg: {
    led: 'w-4 h-4',
    text: 'text-base',
    padding: 'p-4',
  },
};

// ============================================
// COMPONENT
// ============================================

export const GadgetStatusPanel: React.FC<GadgetStatusPanelProps> = ({
  items,
  title,
  layout = 'vertical',
  size = 'md',
  showLabels = true,
  className,
}) => {
  const sizeClasses = sizeStyles[size];

  return (
    <div
      className={cn(
        'rounded-2xl',
        'bg-[var(--bone-300)]',
        'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
        'p-4',
        className
      )}
    >
      {/* Title */}
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-gradient-to-b from-[var(--neon-cyan)] to-transparent rounded-full" />
          <h4 className="font-future font-bold text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            {title}
          </h4>
        </div>
      )}

      {/* Status items */}
      <div className={layoutStyles[layout]}>
        {items.map((item, index) => {
          const config = statusConfig[item.value];
          
          return (
            <motion.div
              key={item.id}
              className={cn(
                'flex items-center gap-3',
                layout === 'vertical' && 'justify-between',
                sizeClasses.padding,
                'rounded-xl',
                'bg-[var(--bone-200)]',
                'shadow-[4px_4px_8px_rgba(44,40,34,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)]',
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* LED indicator */}
              <div className="flex items-center gap-2">
                <motion.div
                  className={cn(
                    'rounded-full',
                    sizeClasses.led,
                    config.bg,
                    config.glow
                  )}
                  animate={item.value === 'active' || item.value === 'good' ? {
                    opacity: [1, 0.5, 1],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Icon */}
                {item.icon && (
                  <span className={cn('text-[var(--text-secondary)]', sizeClasses.text)}>
                    {item.icon}
                  </span>
                )}
              </div>

              {/* Label and message */}
              <div className={cn('flex-1', layout === 'vertical' && 'text-right')}>
                <div className={cn('font-medium text-[var(--text-primary)]', sizeClasses.text)}>
                  {item.label}
                </div>
                {item.message && (
                  <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {item.message}
                  </div>
                )}
              </div>

              {/* Status label */}
              {showLabels && (
                <div className={cn(
                  'font-mono font-bold text-xs uppercase tracking-wider',
                  config.color
                )}>
                  {config.label}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom accent line */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[var(--text-tertiary)]/20 to-transparent" />
    </div>
  );
};

export default GadgetStatusPanel;
