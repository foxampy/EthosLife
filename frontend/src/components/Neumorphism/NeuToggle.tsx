import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    track: 'w-10 h-5',
    thumb: 'w-3.5 h-3.5',
    translate: 18,
  },
  md: {
    track: 'w-14 h-7',
    thumb: 'w-5 h-5',
    translate: 26,
  },
  lg: {
    track: 'w-20 h-10',
    thumb: 'w-7 h-7',
    translate: 36,
  },
};

export const NeuToggle: React.FC<NeuToggleProps> = ({
  checked,
  onChange,
  size = 'md',
  label,
  description,
  disabled = false,
  className,
}) => {
  const config = sizeConfig[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className={cn(
          'relative rounded-full transition-all duration-300',
          config.track,
          checked
            ? 'bg-[#5c5243] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]'
            : 'bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]'
        )}
      >
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-[#e4dfd5]',
            config.thumb,
            'shadow-[2px_2px_4px_rgba(44,40,34,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)]'
          )}
          initial={false}
          animate={{
            left: checked ? `calc(100% - ${config.thumb.split(' ')[0].replace('w-', '')} - 4px)` : '4px',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={cn('text-sm font-medium', disabled ? 'text-[#8c7a6b]' : 'text-[#2d2418]')}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[#8c7a6b]">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Checkbox variant
export interface NeuCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
}

const checkboxSizeConfig = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const NeuCheckbox: React.FC<NeuCheckboxProps> = ({
  checked,
  onChange,
  size = 'md',
  label,
  disabled = false,
  className,
  indeterminate = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className={cn(
          'flex items-center justify-center rounded-lg transition-all duration-200',
          checkboxSizeConfig[size],
          checked || indeterminate
            ? 'bg-[#5c5243] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.2)]'
            : 'bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'
        )}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {(checked || indeterminate) && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="text-white"
            width="60%"
            height="60%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate ? (
              <line x1="5" y1="12" x2="19" y2="12" />
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </motion.svg>
        )}
      </motion.div>
      {label && (
        <span className={cn('text-sm', disabled ? 'text-[#8c7a6b]' : 'text-[#2d2418]')}>{label}</span>
      )}
    </div>
  );
};

// Radio variant
export interface NeuRadioProps {
  checked: boolean;
  onChange: () => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
}

const radioSizeConfig = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const NeuRadio: React.FC<NeuRadioProps> = ({
  checked,
  onChange,
  size = 'md',
  label,
  disabled = false,
  className,
  name,
}) => {
  const handleClick = () => {
    if (!disabled && !checked) {
      onChange();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className={cn(
          'relative flex items-center justify-center rounded-full transition-all duration-200',
          radioSizeConfig[size],
          checked
            ? 'bg-[#5c5243] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.2)]'
            : 'bg-[#e4dfd5] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'
        )}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-2/5 h-2/5 rounded-full bg-[#e4dfd5] shadow-[1px_1px_2px_rgba(0,0,0,0.3)]"
          />
        )}
      </motion.div>
      {label && (
        <span className={cn('text-sm', disabled ? 'text-[#8c7a6b]' : 'text-[#2d2418]')}>{label}</span>
      )}
      {name && <input type="radio" name={name} className="sr-only" checked={checked} readOnly />}
    </div>
  );
};
