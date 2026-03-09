import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface NeuGaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  startAngle?: number;
  endAngle?: number;
  color?: string | { start: string; end: string };
  trackColor?: string;
  showValue?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  label?: string;
  valueFormatter?: (value: number) => string;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const NeuGauge: React.FC<NeuGaugeProps> = ({
  value,
  min = 0,
  max = 100,
  size = 200,
  strokeWidth = 20,
  startAngle = 135,
  endAngle = 405,
  color = '#5c5243',
  trackColor = '#dcd3c6',
  showValue = true,
  showTicks = true,
  tickCount = 10,
  label,
  valueFormatter = (v) => v.toString(),
  animated = true,
  className,
  children,
}) => {
  const normalizedValue = Math.min(max, Math.max(min, value));
  const percentage = (normalizedValue - min) / (max - min);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 10;

  // Convert angle to radians
  const toRadians = (angle: number) => (angle * Math.PI) / 180;

  // Get point on circle
  const getPoint = (angle: number, r: number = radius) => ({
    x: center + r * Math.cos(toRadians(angle - 90)),
    y: center + r * Math.sin(toRadians(angle - 90)),
  });

  // Create arc path
  const createArc = (start: number, end: number, r: number) => {
    const startPoint = getPoint(start, r);
    const endPoint = getPoint(end, r);
    const largeArc = end - start <= 180 ? 0 : 1;
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
  };

  // Calculate current value angle
  const currentAngle = startAngle + (endAngle - startAngle) * percentage;

  // Track path
  const trackPath = createArc(startAngle, endAngle, radius);

  // Value path
  const valuePath = createArc(startAngle, currentAngle, radius);

  // Generate gradient ID
  const gradientId = React.useMemo(() => `gauge-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  // Color handling
  const colorValue = typeof color === 'string' ? color : null;
  const hasGradient = typeof color === 'object';

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)} style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            {hasGradient && (
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={(color as { start: string; end: string }).start} />
                <stop offset="100%" stopColor={(color as { start: string; end: string }).end} />
              </linearGradient>
            )}
            <filter id={`gauge-shadow-${size}`}>
              <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="rgba(44,40,34,0.15)" />
              <feDropShadow dx="-3" dy="-3" stdDeviation="3" floodColor="rgba(255,255,255,0.6)" />
            </filter>
            <filter id={`gauge-inset-${size}`}>
              <feOffset dx="2" dy="2" />
              <feGaussianBlur stdDeviation="2" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="rgba(44,40,34,0.2)" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter={`url(#gauge-shadow-${size})`}
          />

          {/* Value arc */}
          <motion.path
            d={valuePath}
            fill="none"
            stroke={hasGradient ? `url(#${gradientId})` : colorValue!}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
          />

          {/* Ticks */}
          {showTicks &&
            Array.from({ length: tickCount + 1 }, (_, i) => {
              const tickAngle = startAngle + ((endAngle - startAngle) / tickCount) * i;
              const tickStart = getPoint(tickAngle, radius - strokeWidth / 2 - 5);
              const tickEnd = getPoint(tickAngle, radius - strokeWidth / 2 - 12);
              return (
                <line
                  key={i}
                  x1={tickStart.x}
                  y1={tickStart.y}
                  x2={tickEnd.x}
                  y2={tickEnd.y}
                  stroke="#8c7a6b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}

          {/* Needle (optional) */}
          <motion.g
            initial={{ rotate: startAngle - 180 }}
            animate={{ rotate: currentAngle - 180 }}
            transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          >
            <circle
              cx={center}
              cy={center}
              r={8}
              fill="#e4dfd5"
              filter={`url(#gauge-shadow-${size})`}
            />
            <polygon
              points={`${center},${center - 4} ${center - 4},${center + radius - strokeWidth / 2 - 10} ${center + 4},${center + radius - strokeWidth / 2 - 10}`}
              fill="#5c5243"
            />
          </motion.g>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          {children || (
            <>
              {showValue && (
                <motion.span
                  className="text-3xl font-bold text-[#2d2418]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {valueFormatter(normalizedValue)}
                </motion.span>
              )}
              {label && (
                <span className="text-xs text-[#5c5243] mt-1">{label}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple meter bar variant
export interface NeuMeterProps {
  value: number;
  min?: number;
  max?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: number;
  thickness?: number;
  color?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showTicks?: boolean;
  tickLabels?: string[];
  label?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const meterColorConfig = {
  default: '#5c5243',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  gradient: 'linear-gradient(90deg, #22c55e, #eab308, #ef4444)',
};

export const NeuMeter: React.FC<NeuMeterProps> = ({
  value,
  min = 0,
  max = 100,
  orientation = 'horizontal',
  size = 200,
  thickness = 24,
  color = 'default',
  showTicks = false,
  tickLabels,
  label,
  valueFormatter = (v) => v.toString(),
  className,
}) => {
  const normalizedValue = Math.min(max, Math.max(min, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  const isHorizontal = orientation === 'horizontal';
  const colorValue = meterColorConfig[color];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {label && <span className="text-sm font-medium text-[#5c5243] mb-2">{label}</span>}
      
      <div
        className={cn(
          'relative rounded-full overflow-hidden',
          'bg-[#e4dfd5] shadow-[inset_4px_4px_8px_rgba(44,40,34,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]'
        )}
        style={isHorizontal ? { width: size, height: thickness } : { width: thickness, height: size }}
      >
        <motion.div
          className="rounded-full"
          style={{
            background: colorValue,
            boxShadow: '2px 2px 4px rgba(44,40,34,0.2)',
          }}
          initial={isHorizontal ? { width: 0 } : { height: 0 }}
          animate={isHorizontal ? { width: `${percentage}%` } : { height: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Value indicator */}
        <motion.div
          className="absolute flex items-center justify-center text-xs font-bold text-white drop-shadow-md"
          style={{
            [isHorizontal ? 'left' : 'bottom']: `${percentage}%`,
            [isHorizontal ? 'top' : 'left']: '50%',
            [isHorizontal ? 'transform' : 'transform']: isHorizontal ? 'translate(-50%, -50%)' : 'translate(-50%, 50%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {valueFormatter(normalizedValue)}
        </motion.div>
      </div>

      {/* Ticks */}
      {showTicks && (
        <div
          className={cn(
            'flex justify-between mt-2 text-xs text-[#8c7a6b]',
            isHorizontal ? 'w-full px-1' : 'flex-col h-full py-1 items-center'
          )}
          style={isHorizontal ? { width: size } : { height: size }}
        >
          {tickLabels || [min, (min + max) / 2, max].map((v) => valueFormatter(v))}
        </div>
      )}
    </div>
  );
};

// Battery indicator
export interface NeuBatteryProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  charging?: boolean;
  className?: string;
}

const batterySizeConfig = {
  sm: { width: 40, height: 20, cap: 4 },
  md: { width: 60, height: 30, cap: 6 },
  lg: { width: 80, height: 40, cap: 8 },
};

export const NeuBattery: React.FC<NeuBatteryProps> = ({
  level,
  size = 'md',
  showPercentage = true,
  charging = false,
  className,
}) => {
  const normalizedLevel = Math.min(100, Math.max(0, level));
  const config = batterySizeConfig[size];

  const getColor = (lvl: number) => {
    if (lvl <= 20) return '#ef4444';
    if (lvl <= 50) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="relative rounded-lg bg-[#e4dfd5] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
        style={{ width: config.width, height: config.height, padding: 4 }}
      >
        <div className="relative w-full h-full rounded overflow-hidden">
          <motion.div
            className="h-full rounded"
            style={{ backgroundColor: getColor(normalizedLevel) }}
            initial={{ width: 0 }}
            animate={{ width: `${normalizedLevel}%` }}
            transition={{ duration: 0.5 }}
          />
          {charging && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
      <div
        className="rounded-r-full bg-[#dcd3c6] shadow-[inset_1px_1px_2px_rgba(44,40,34,0.1)]"
        style={{ width: config.cap / 2, height: config.cap * 2 }}
      />
      {showPercentage && (
        <span className="text-sm font-medium text-[#2d2418]">{normalizedLevel}%</span>
      )}
    </div>
  );
};
