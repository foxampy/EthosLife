/**
 * GadgetHoloDisplay - Holographic Display Component
 * Retrofuturism Design System
 * 
 * A sci-fi inspired display with holographic effects,
 * scanlines, and glowing borders. Perfect for data visualization
 * and status displays.
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
export interface GadgetHoloDisplayProps {
  children: React.ReactNode;
  title?: string;
  color?: 'cyan' | 'pink' | 'amber' | 'green' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  scanlines?: boolean;
  glitchEffect?: boolean;
  className?: string;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const colorStyles = {
  cyan: {
    border: 'border-[var(--neon-cyan)]/40',
    glow: 'shadow-[0_0_30px_rgba(0,217,255,0.2),inset_0_0_30px_rgba(0,217,255,0.1)]',
    text: 'text-[var(--neon-cyan)]',
    bg: 'bg-[var(--neon-cyan)]/5',
    scanline: 'from-transparent via-[var(--neon-cyan)]/5 to-transparent',
  },
  pink: {
    border: 'border-[var(--neon-pink)]/40',
    glow: 'shadow-[0_0_30px_rgba(255,0,170,0.2),inset_0_0_30px_rgba(255,0,170,0.1)]',
    text: 'text-[var(--neon-pink)]',
    bg: 'bg-[var(--neon-pink)]/5',
    scanline: 'from-transparent via-[var(--neon-pink)]/5 to-transparent',
  },
  amber: {
    border: 'border-[var(--neon-amber)]/40',
    glow: 'shadow-[0_0_30px_rgba(255,183,0,0.2),inset_0_0_30px_rgba(255,183,0,0.1)]',
    text: 'text-[var(--neon-amber)]',
    bg: 'bg-[var(--neon-amber)]/5',
    scanline: 'from-transparent via-[var(--neon-amber)]/5 to-transparent',
  },
  green: {
    border: 'border-[var(--neon-green)]/40',
    glow: 'shadow-[0_0_30px_rgba(0,255,136,0.2),inset_0_0_30px_rgba(0,255,136,0.1)]',
    text: 'text-[var(--neon-green)]',
    bg: 'bg-[var(--neon-green)]/5',
    scanline: 'from-transparent via-[var(--neon-green)]/5 to-transparent',
  },
  purple: {
    border: 'border-[var(--neon-purple)]/40',
    glow: 'shadow-[0_0_30px_rgba(157,78,221,0.2),inset_0_0_30px_rgba(157,78,221,0.1)]',
    text: 'text-[var(--neon-purple)]',
    bg: 'bg-[var(--neon-purple)]/5',
    scanline: 'from-transparent via-[var(--neon-purple)]/5 to-transparent',
  },
};

const sizeStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// ============================================
// COMPONENT
// ============================================

export const GadgetHoloDisplay: React.FC<GadgetHoloDisplayProps> = ({
  children,
  title,
  color = 'cyan',
  size = 'md',
  animated = true,
  scanlines = true,
  glitchEffect = false,
  className,
}) => {
  const styles = colorStyles[color];

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border-2 overflow-hidden',
        'bg-[var(--bone-200)]/90 backdrop-blur-sm',
        styles.border,
        styles.glow,
        sizeStyles[size],
        className
      )}
      initial={animated ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Corner accents */}
      <div className={cn('absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2', styles.border.replace('/40', ''))} />
      <div className={cn('absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2', styles.border.replace('/40', ''))} />
      <div className={cn('absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2', styles.border.replace('/40', ''))} />
      <div className={cn('absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2', styles.border.replace('/40', ''))} />

      {/* Title bar */}
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn('font-future font-bold tracking-wider uppercase text-sm', styles.text)}>
            {title}
          </h3>
          <div className={cn('flex gap-1', styles.text)}>
            <motion.div
              className="w-2 h-2 rounded-full bg-current"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-current"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-current"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Scanline effect */}
      {scanlines && (
        <>
          {/* Horizontal scanline */}
          <motion.div
            className={cn(
              'absolute inset-x-0 h-px bg-gradient-to-r',
              styles.scanline
            )}
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Static scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.03) 2px,
                rgba(0,0,0,0.03) 4px
              )`,
            }}
          />
        </>
      )}

      {/* Glitch effect overlay */}
      {glitchEffect && (
        <motion.div
          className={cn('absolute inset-0 pointer-events-none', styles.bg)}
          animate={{
            opacity: [0, 0.1, 0, 0.05, 0],
            x: [0, -2, 2, -1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}

      {/* Hologram flicker */}
      {animated && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [1, 0.98, 1, 0.99, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

export default GadgetHoloDisplay;
