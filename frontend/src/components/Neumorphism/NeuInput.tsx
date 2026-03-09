import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  fullWidth?: boolean;
}

export const NeuInput = React.forwardRef<HTMLInputElement, NeuInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      isPassword = false,
      fullWidth = false,
      className,
      type,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseStyles = `
      w-full px-4 py-3 
      bg-[#e4dfd5] 
      rounded-xl
      text-[#2d2418] placeholder-[#8c7a6b]/60
      transition-all duration-200
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const stateStyles = error
      ? 'shadow-[inset_3px_3px_6px_rgba(220,38,38,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] border border-red-300/50'
      : isFocused
      ? 'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.12),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]'
      : 'shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]';

    const iconPadding = leftIcon ? 'pl-12' : '';
    const rightIconPadding = (rightIcon || isPassword) ? 'pr-12' : '';

    return (
      <div className={cn(fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label className="block text-sm font-semibold text-[#5c5243] mb-2 ml-1">
            {label}
          </label>
        )}
        <motion.div
          className="relative"
          animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c7a6b] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(baseStyles, stateStyles, iconPadding, rightIconPadding)}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c7a6b] hover:text-[#5c5243] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5c5243]/30 rounded"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c7a6b] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </motion.div>
        {error && (
          <div id={`${props.id}-error`} className="flex items-center gap-1 mt-1.5 text-xs text-red-500" role="alert">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1.5 text-xs text-[#8c7a6b] ml-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

NeuInput.displayName = 'NeuInput';

// TextArea variant
export interface NeuTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const NeuTextArea = React.forwardRef<HTMLTextAreaElement, NeuTextAreaProps>(
  (
    { label, helperText, error, fullWidth = false, rows = 4, className, disabled, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const baseStyles = `
      w-full px-4 py-3 
      bg-[#e4dfd5] 
      rounded-xl
      text-[#2d2418] placeholder-[#8c7a6b]/60
      transition-all duration-200
      focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      resize-none
    `;

    const stateStyles = error
      ? 'shadow-[inset_3px_3px_6px_rgba(220,38,38,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] border border-red-300/50'
      : isFocused
      ? 'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.12),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]'
      : 'shadow-[inset_3px_3px_6px_rgba(44,40,34,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]';

    return (
      <div className={cn(fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label className="block text-sm font-semibold text-[#5c5243] mb-2 ml-1">
            {label}
          </label>
        )}
        <motion.textarea
          ref={ref}
          rows={rows}
          className={cn(baseStyles, stateStyles)}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        {error && (
          <div id={`${props.id}-error`} className="flex items-center gap-1 mt-1.5 text-xs text-red-500" role="alert">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1.5 text-xs text-[#8c7a6b] ml-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

NeuTextArea.displayName = 'NeuTextArea';
