/**
 * ElInput - EthosLife Input Component
 * Tactile Retrofuturism Design System
 * 
 * Features:
 * - Neumorphic inset styling
 * - Icon support (left/right)
 * - Label and helper text
 * - Error state with visual feedback
 * - Focus animations
 * - Different sizes
 */

import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// TYPES
// ============================================
export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'neon' | 'glass';

export interface ElInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export interface ElTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

const variantStyles: Record<InputVariant, string> = {
  default: `
    bg-[var(--bone-200)]
    shadow-[inset_4px_4px_8px_rgba(44,40,34,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]
    border border-transparent
    focus:shadow-[inset_6px_6px_12px_rgba(44,40,34,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.7),0_0_0_3px_rgba(92,82,67,0.1)]
  `,
  neon: `
    bg-[var(--bone-200)]/80
    border-2 border-[var(--neon-cyan)]/50
    shadow-[0_0_10px_rgba(0,217,255,0.1)]
    focus:border-[var(--neon-cyan)]
    focus:shadow-[0_0_20px_rgba(0,217,255,0.3),0_0_40px_rgba(0,217,255,0.1)]
    text-[var(--neon-cyan)]
    placeholder:text-[var(--neon-cyan)]/50
  `,
  glass: `
    bg-white/50
    backdrop-blur-sm
    border border-white/40
    shadow-[inset_2px_2px_4px_rgba(44,40,34,0.05)]
    focus:bg-white/70
    focus:border-white/60
  `,
};

// ============================================
// INPUT COMPONENT
// ============================================

export const ElInput = forwardRef<HTMLInputElement, ElInputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      isLoading,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles = `
      w-full
      rounded-2xl
      font-medium
      text-[var(--text-primary)]
      placeholder:text-[var(--text-tertiary)]
      transition-all duration-200 ease-out
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const errorStyles = error
      ? 'border-[var(--error)] shadow-[0_0_0_3px_rgba(244,63,94,0.1)]'
      : '';

    const focusGlowStyles = isFocused && variant === 'neon'
      ? 'shadow-[0_0_20px_rgba(0,217,255,0.3)]'
      : '';

    return (
      <div className={cn(fullWidth ? 'w-full' : '', className)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        
        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              sizeStyles[size],
              variantStyles[variant],
              errorStyles,
              focusGlowStyles,
              leftIcon && 'pl-12',
              rightIcon && 'pr-12'
            )}
            disabled={disabled || isLoading}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {/* Right icon / Loading */}
          {rightIcon && !isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </div>
          )}
          
          {/* Loading spinner */}
          {isLoading && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[var(--text-tertiary)] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
        
        {/* Helper text / Error */}
        {(helperText || error) && (
          <div className={cn('mt-2 text-sm', error ? 'text-[var(--error)]' : 'text-[var(--text-tertiary)]')}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

ElInput.displayName = 'ElInput';

// ============================================
// TEXTAREA COMPONENT
// ============================================

export const ElTextArea = forwardRef<HTMLTextAreaElement, ElTextAreaProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label,
      helperText,
      error,
      fullWidth = false,
      rows = 4,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      w-full
      rounded-2xl
      font-medium
      text-[var(--text-primary)]
      placeholder:text-[var(--text-tertiary)]
      transition-all duration-200 ease-out
      focus:outline-none
      resize-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeStyles[size]}
      ${variantStyles[variant]}
    `;

    const errorStyles = error
      ? 'border-[var(--error)] shadow-[0_0_0_3px_rgba(244,63,94,0.1)]'
      : '';

    return (
      <div className={cn(fullWidth ? 'w-full' : '', className)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
            {label}
          </label>
        )}
        
        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(baseStyles, errorStyles)}
          disabled={disabled}
          {...props}
        />
        
        {/* Helper text / Error */}
        {(helperText || error) && (
          <div className={cn('mt-2 text-sm', error ? 'text-[var(--error)]' : 'text-[var(--text-tertiary)]')}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

ElTextArea.displayName = 'ElTextArea';

export default ElInput;
