/**
 * ElButton - EthosLife Button Component
 * Tactile Retrofuturism Design System
 * 
 * Features:
 * - Multiple variants (elevated, inset, flat, neon)
 * - Size options (xs, sm, md, lg, xl)
 * - Icon support (left/right)
 * - Loading state
 * - Tactile press feedback
 * - Neon glow effects
 */

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// TYPES
// ============================================
export type ButtonVariant = 
  | 'elevated'      // Classic neumorphic raised
  | 'inset'         // Pressed/pressed effect
  | 'flat'          // Minimal shadow
  | 'neon'          // Retrofuture neon glow
  | 'gradient'      // Gradient background
  | 'outline';      // Border only

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonColor = 'default' | 'cyan' | 'pink' | 'amber' | 'green' | 'purple';

export interface ElButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  isLoading?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const variantStyles: Record<ButtonVariant, string> = {
  elevated: `
    bg-[var(--bone-200)]
    shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)]
    hover:shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.5)]
    active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]
    border border-transparent
  `,
  inset: `
    bg-[var(--bone-300)]
    shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]
    border border-transparent
  `,
  flat: `
    bg-[var(--bone-200)]
    shadow-[4px_4px_8px_rgba(44,40,34,0.08),-4px_-4px_8px_rgba(255,255,255,0.5)]
    hover:shadow-[6px_6px_12px_rgba(44,40,34,0.1),-6px_-6px_12px_rgba(255,255,255,0.55)]
    active:shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
    border border-transparent
  `,
  neon: `
    bg-[var(--bone-200)]
    border-2 border-[var(--neon-cyan)]
    text-[var(--neon-cyan)]
    shadow-[0_0_10px_rgba(0,217,255,0.3)]
    hover:shadow-[0_0_20px_rgba(0,217,255,0.5),0_0_40px_rgba(0,217,255,0.3)]
    hover:bg-[var(--neon-cyan)]
    hover:text-[var(--bone-900)]
    transition-all duration-300
  `,
  gradient: `
    bg-gradient-to-r from-[var(--stone-600)] to-[var(--stone-500)]
    text-white
    shadow-[4px_4px_8px_rgba(44,40,34,0.2),-4px_-4px_8px_rgba(255,255,255,0.4)]
    hover:shadow-[6px_6px_12px_rgba(44,40,34,0.25),-6px_-6px_12px_rgba(255,255,255,0.45)]
    border border-transparent
  `,
  outline: `
    bg-transparent
    border-2 border-[var(--stone-500)]
    text-[var(--stone-600)]
    hover:bg-[var(--stone-500)]
    hover:text-white
    shadow-none
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3 text-base gap-2.5',
  xl: 'px-10 py-4 text-lg gap-3',
};

const neonColorStyles: Record<ButtonColor, string> = {
  default: 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_10px_rgba(0,217,255,0.3)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:bg-[var(--neon-cyan)]',
  cyan: 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_10px_rgba(0,217,255,0.3)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:bg-[var(--neon-cyan)]',
  pink: 'border-[var(--neon-pink)] text-[var(--neon-pink)] shadow-[0_0_10px_rgba(255,0,170,0.3)] hover:shadow-[0_0_20px_rgba(255,0,170,0.5)] hover:bg-[var(--neon-pink)]',
  amber: 'border-[var(--neon-amber)] text-[var(--neon-amber)] shadow-[0_0_10px_rgba(255,183,0,0.3)] hover:shadow-[0_0_20px_rgba(255,183,0,0.5)] hover:bg-[var(--neon-amber)]',
  green: 'border-[var(--neon-green)] text-[var(--neon-green)] shadow-[0_0_10px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] hover:bg-[var(--neon-green)]',
  purple: 'border-[var(--neon-purple)] text-[var(--neon-purple)] shadow-[0_0_10px_rgba(157,78,221,0.3)] hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] hover:bg-[var(--neon-purple)]',
};

// ============================================
// COMPONENT
// ============================================

export const ElButton = forwardRef<HTMLButtonElement, ElButtonProps>(
  (
    {
      variant = 'elevated',
      size = 'md',
      color = 'default',
      isLoading = false,
      isActive = false,
      isDisabled = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = isDisabled || disabled || isLoading;
    
    // Base styles
    const baseStyles = `
      relative
      inline-flex items-center justify-center
      font-semibold
      rounded-2xl
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-[var(--stone-500)]/30 focus:ring-offset-2 focus:ring-offset-[var(--bone-200)]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
      overflow-hidden
    `;

    // Active/pressed state override
    const activeStyles = isActive && variant !== 'inset'
      ? 'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
      : '';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Loading spinner
    const LoadingSpinner = () => (
      <motion.div
        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    );

    // Neon variant with color
    const getNeonStyles = () => {
      if (variant === 'neon') {
        return neonColorStyles[color];
      }
      return '';
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          activeStyles,
          widthStyles,
          getNeonStyles(),
          className
        )}
        disabled={isButtonDisabled}
        whileHover={!isButtonDisabled && !isActive ? { scale: 1.02 } : {}}
        whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
        aria-disabled={isButtonDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <span className="absolute left-4">
            <LoadingSpinner />
          </span>
        )}
        
        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        {/* Button text */}
        <span className={cn(isLoading && 'opacity-70')}>
          {children}
        </span>
        
        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
        
        {/* Ripple effect overlay */}
        <span className="absolute inset-0 overflow-hidden rounded-2xl">
          <span className="absolute inset-0 opacity-0 hover:opacity-10 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full hover:translate-x-full transition-all duration-700" />
        </span>
      </motion.button>
    );
  }
);

ElButton.displayName = 'ElButton';

export default ElButton;
