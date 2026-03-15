/**
 * GadgetRadarScope - Radar Display Component
 * Retrofuturism Design System
 * 
 * A radar-style display for showing coverage,
 * activity zones, or analytical data.
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
export interface RadarPoint {
  id: string;
  angle: number; // 0-360 degrees
  distance: number; // 0-100 (percentage from center)
  label?: string;
  value?: number;
  size?: 'sm' | 'md' | 'lg';
}

export interface GadgetRadarScopeProps {
  points: RadarPoint[];
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  showGrid?: boolean;
  showSweep?: boolean;
  color?: 'cyan' | 'green' | 'amber' | 'pink';
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const GadgetRadarScope: React.FC<GadgetRadarScopeProps> = ({
  points,
  title,
  size = 'md',
  showGrid = true,
  showSweep = true,
  color = 'cyan',
  className,
}) => {
  const colorConfig = {
    cyan: {
      primary: 'var(--neon-cyan)',
      glow: 'rgba(0,217,255,0.5)',
      secondary: 'rgba(0,217,255,0.3)',
    },
    green: {
      primary: 'var(--neon-green)',
      glow: 'rgba(0,255,136,0.5)',
      secondary: 'rgba(0,255,136,0.3)',
    },
    amber: {
      primary: 'var(--neon-amber)',
      glow: 'rgba(255,183,0,0.5)',
      secondary: 'rgba(255,183,0,0.3)',
    },
    pink: {
      primary: 'var(--neon-pink)',
      glow: 'rgba(255,0,170,0.5)',
      secondary: 'rgba(255,0,170,0.3)',
    },
  };

  const sizeConfig = {
    sm: 150,
    md: 200,
    lg: 250,
  };

  const colors = colorConfig[color];
  const diameter = sizeConfig[size];
  const radius = diameter / 2;
  const center = radius;

  // Convert polar to cartesian
  const polarToCartesian = (angle: number, distance: number) => {
    const angleRad = ((angle - 90) * Math.PI) / 180;
    const r = (distance / 100) * (radius - 20);
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    };
  };

  const pointSizes = {
    sm: 4,
    md: 6,
    lg: 8,
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-4',
        'bg-[var(--bone-300)]',
        'shadow-[inset_4px_4px_8px_rgba(44,40,34,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
        className
      )}
    >
      {/* Title */}
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: colors.primary }}
          />
          <span className="font-future text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            {title}
          </span>
        </div>
      )}

      {/* Radar display */}
      <div className="relative flex justify-center">
        <svg
          width={diameter}
          height={diameter}
          className="transform"
        >
          {/* Grid circles */}
          {showGrid && [25, 50, 75].map((percent) => (
            <circle
              key={percent}
              cx={center}
              cy={center}
              r={(percent / 100) * (radius - 20)}
              fill="none"
              stroke={colors.secondary}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Grid lines */}
          {showGrid && [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const end = polarToCartesian(angle, 100);
            return (
              <line
                key={angle}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke={colors.secondary}
                strokeWidth="1"
              />
            );
          })}

          {/* Outer ring */}
          <circle
            cx={center}
            cy={center}
            r={radius - 20}
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            className="opacity-50"
          />

          {/* Sweep line */}
          {showSweep && (
            <motion.line
              x1={center}
              y1={center}
              x2={center}
              y2={20}
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 4px ${colors.glow})`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
              transform={`rotate(0, ${center}, ${center})`}
            />
          )}

          {/* Data points */}
          {points.map((point) => {
            const pos = polarToCartesian(point.angle, point.distance);
            const size = pointSizes[point.size || 'md'];

            return (
              <g key={point.id}>
                {/* Point glow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size * 2}
                  fill={colors.glow}
                  className="animate-pulse"
                />
                {/* Point */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill={colors.primary}
                />
              </g>
            );
          })}

          {/* Center */}
          <circle
            cx={center}
            cy={center}
            r="4"
            fill={colors.primary}
          />
        </svg>

        {/* Corner brackets */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to right, ${colors.primary} 2px, transparent 2px) 0 0,
              linear-gradient(to bottom, ${colors.primary} 2px, transparent 2px) 0 0,
              linear-gradient(to left, ${colors.primary} 2px, transparent 2px) 100% 0,
              linear-gradient(to bottom, ${colors.primary} 2px, transparent 2px) 100% 0,
              linear-gradient(to right, ${colors.primary} 2px, transparent 2px) 0 100%,
              linear-gradient(to top, ${colors.primary} 2px, transparent 2px) 0 100%,
              linear-gradient(to left, ${colors.primary} 2px, transparent 2px) 100% 100%,
              linear-gradient(to top, ${colors.primary} 2px, transparent 2px) 100% 100%
            `,
            backgroundSize: '10px 10px',
            backgroundRepeat: 'no-repeat',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Point labels */}
      <div className="mt-3 space-y-1">
        {points.slice(0, 4).map((point) => (
          <div key={point.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-[var(--text-secondary)]">{point.label || point.id}</span>
            </div>
            {point.value !== undefined && (
              <span className="font-mono text-[var(--text-primary)]">{point.value}%</span>
            )}
          </div>
        ))}
        {points.length > 4 && (
          <div className="text-xs text-[var(--text-tertiary)] text-center">
            +{points.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
};

export default GadgetRadarScope;
