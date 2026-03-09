import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: 'elevated' | 'inset' | 'flat';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles = {
  elevated: `
    bg-[#e4dfd5] 
    shadow-[8px_8px_16px_rgba(44,40,34,0.15),-8px_-8px_16px_rgba(255,255,255,0.6)]
    hover:shadow-[12px_12px_24px_rgba(44,40,34,0.18),-12px_-12px_24px_rgba(255,255,255,0.7)]
    active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]
  `,
  inset: `
    bg-[#e4dfd5] 
    shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]
  `,
  flat: `
    bg-[#e4dfd5] 
    shadow-[4px_4px_8px_rgba(44,40,34,0.1),-4px_-4px_8px_rgba(255,255,255,0.5)]
    hover:shadow-[6px_6px_12px_rgba(44,40,34,0.12),-6px_-6px_12px_rgba(255,255,255,0.55)]
    active:shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
  `,
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  (
    {
      variant = 'elevated',
      size = 'md',
      isActive = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-semibold text-[#2d2418]
      rounded-2xl
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30 focus:ring-offset-2 focus:ring-offset-[#e4dfd5]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    `;

    const activeStyles = isActive
      ? 'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]'
      : '';

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], activeStyles, className)}
        disabled={isDisabled}
        whileHover={!isDisabled && !isActive ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        aria-disabled={isDisabled}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

NeuButton.displayName = 'NeuButton';
