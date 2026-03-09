import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuCardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'inset' | 'pressed';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  elevated: `
    bg-[#e4dfd5] 
    shadow-[12px_12px_24px_rgba(44,40,34,0.15),-12px_-12px_24px_rgba(255,255,255,0.6),inset_1px_1px_2px_rgba(255,255,255,0.8)]
  `,
  inset: `
    bg-[#e4dfd5] 
    shadow-[inset_6px_6px_12px_rgba(44,40,34,0.12),inset_-6px_-6px_12px_rgba(255,255,255,0.6)]
  `,
  pressed: `
    bg-[#e4dfd5] 
    shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]
  `,
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      hover = false,
      clickable = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative rounded-3xl
      transition-all duration-300 ease-out
      ${hover && variant === 'elevated' ? 'hover:shadow-[16px_16px_32px_rgba(44,40,34,0.18),-16px_-16px_32px_rgba(255,255,255,0.65)]' : ''}
      ${clickable ? 'cursor-pointer active:shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]' : ''}
    `;

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
        whileHover={clickable && !hover ? { scale: 1.01 } : {}}
        whileTap={clickable ? { scale: 0.99 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

NeuCard.displayName = 'NeuCard';

// Sub-components for card structure
export interface NeuCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const NeuCardHeader: React.FC<NeuCardHeaderProps> = ({
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
          <div className="w-10 h-10 rounded-xl bg-[#dcd3c6] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] flex items-center justify-center text-[#5c5243]">
            {icon}
          </div>
        )}
        <div>
          {title && <h3 className="font-bold text-[#2d2418] text-base">{title}</h3>}
          {subtitle && <p className="text-xs text-[#5c5243]">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
      {children}
    </div>
  );
};

export interface NeuCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const NeuCardContent: React.FC<NeuCardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

export interface NeuCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const NeuCardFooter: React.FC<NeuCardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('mt-4 pt-4 border-t border-[#dcd3c6]/50', className)} {...props}>
      {children}
    </div>
  );
};
