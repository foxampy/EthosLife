/**
 * ElCard - EthosLife Card Component
 * Tactile Retrofuturism Design System
 * 
 * Features:
 * - Multiple variants (elevated, inset, hologram, glass)
 * - Interactive states (hover, clickable)
 * - Header/Content/Footer structure
 * - Gradient borders
 * - Glow effects
 */

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// TYPES
// ============================================
export type CardVariant = 
  | 'elevated'   // Classic neumorphic card
  | 'inset'      // Pressed card
  | 'flat'       // Minimal shadow
  | 'hologram'   // Retrofuture holographic
  | 'glass'      // Glassmorphism
  | 'neon';      // Neon border glow

export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ElCardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  clickable?: boolean;
  glowColor?: 'cyan' | 'pink' | 'amber' | 'green' | 'purple';
  children: React.ReactNode;
}

// Sub-component props
export interface ElCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ElCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ElCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  divider?: boolean;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const variantStyles: Record<CardVariant, string> = {
  elevated: `
    bg-[var(--bone-200)]
    shadow-[12px_12px_24px_rgba(44,40,34,0.12),-12px_-12px_24px_rgba(255,255,255,0.6)]
    border border-transparent
  `,
  inset: `
    bg-[var(--bone-300)]
    shadow-[inset_6px_6px_12px_rgba(44,40,34,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.5)]
    border border-transparent
  `,
  flat: `
    bg-[var(--bone-200)]
    shadow-[4px_4px_8px_rgba(44,40,34,0.06),-4px_-4px_8px_rgba(255,255,255,0.5)]
    border border-transparent
  `,
  hologram: `
    bg-[var(--bone-200)]/90
    backdrop-blur-sm
    border border-[var(--neon-cyan)]/30
    shadow-[0_0_30px_rgba(0,217,255,0.15),inset_0_0_30px_rgba(0,217,255,0.05)]
    relative overflow-hidden
  `,
  glass: `
    bg-[var(--bone-200)]/70
    backdrop-blur-xl
    border border-white/40
    shadow-[0_8px_32px_rgba(44,40,34,0.1)]
  `,
  neon: `
    bg-[var(--bone-200)]
    border-2 border-[var(--neon-cyan)]
    shadow-[0_0_20px_rgba(0,217,255,0.3)]
  `,
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const glowStyles: Record<string, string> = {
  cyan: 'shadow-[0_0_30px_rgba(0,217,255,0.4)] border-[var(--neon-cyan)]',
  pink: 'shadow-[0_0_30px_rgba(255,0,170,0.4)] border-[var(--neon-pink)]',
  amber: 'shadow-[0_0_30px_rgba(255,183,0,0.4)] border-[var(--neon-amber)]',
  green: 'shadow-[0_0_30px_rgba(0,255,136,0.4)] border-[var(--neon-green)]',
  purple: 'shadow-[0_0_30px_rgba(157,78,221,0.4)] border-[var(--neon-purple)]',
};

// ============================================
// MAIN CARD COMPONENT
// ============================================

export const ElCard = forwardRef<HTMLDivElement, ElCardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      hover = false,
      clickable = false,
      glowColor,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative rounded-3xl
      transition-all duration-300 ease-out
      ${hover && variant === 'elevated' ? 'hover:shadow-[16px_16px_32px_rgba(44,40,34,0.15),-16px_-16px_32px_rgba(255,255,255,0.55)] hover:-translate-y-1' : ''}
      ${clickable ? 'cursor-pointer active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]' : ''}
    `;

    const glowClass = glowColor ? glowStyles[glowColor] : '';

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], glowClass, className)}
        whileHover={clickable && !hover ? { scale: 1.01 } : {}}
        whileTap={clickable ? { scale: 0.99 } : {}}
        {...props}
      >
        {/* Hologram scanline effect */}
        {variant === 'hologram' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--neon-cyan)]/5 to-transparent animate-scanline pointer-events-none" />
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,217,255,0.03) 2px,
                rgba(0,217,255,0.03) 4px
              )`
            }} />
          </>
        )}
        
        {children}
      </motion.div>
    );
  }
);

ElCard.displayName = 'ElCard';

// ============================================
// CARD HEADER
// ============================================

export const ElCardHeader: React.FC<ElCardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-[var(--bone-300)] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] flex items-center justify-center text-[var(--stone-600)]">
            {icon}
          </div>
        )}
        <div>
          {title && <h3 className="font-bold text-[var(--text-primary)] text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
      {children}
    </div>
  );
};

// ============================================
// CARD CONTENT
// ============================================

export const ElCardContent: React.FC<ElCardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

// ============================================
// CARD FOOTER
// ============================================

export const ElCardFooter: React.FC<ElCardFooterProps> = ({ 
  className, 
  children, 
  divider = true,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'mt-4 pt-4',
        divider && 'border-t border-[var(--bone-400)]/50',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default ElCard;
