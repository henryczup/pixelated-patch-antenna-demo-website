'use client';

import { motion } from 'framer-motion';

interface PixelPreviewProps {
  pixelGrid: number[][];
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  color?: string;
  className?: string;
}

export default function PixelPreview({
  pixelGrid,
  size = 'medium',
  showLabel = false,
  label = '',
  color = '#b87333',
  className = '',
}: PixelPreviewProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-md overflow-hidden`}
        style={{
          background: '#1a4a1a',
        }}
      >
        {/* Subtle substrate texture */}
        <div className="absolute inset-0 opacity-30" style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }} />

        {/* Pixel grid */}
        <div className="absolute inset-1 grid grid-cols-10 grid-rows-10 gap-[1px]">
          {pixelGrid.flat().map((cell, index) => (
            <div
              key={index}
              className="rounded-[1px]"
              style={{
                background: cell === 1 ? color : 'rgba(15, 20, 25, 0.7)',
              }}
            />
          ))}
        </div>

        {/* Feed strip indicator (bottom center) */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[15%] h-[8%] rounded-t-sm"
          style={{
            background: color,
          }}
        />
      </div>

      {showLabel && label && (
        <span
          className="text-xs font-mono font-medium tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// Floating tooltip version for hover preview
interface PixelTooltipProps {
  pixelGrid: number[][];
  designName: string;
  fitness: number;
  resonance: number;
  color: string;
  position: { x: number; y: number };
}

export function PixelTooltip({
  pixelGrid,
  designName,
  fitness,
  resonance,
  color,
  position,
}: PixelTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-10px)',
      }}
    >
      <div className="tech-card p-3 flex flex-col items-center gap-2">
        <PixelPreview pixelGrid={pixelGrid} size="small" color={color} />
        <div className="text-center">
          <div className="font-semibold text-sm" style={{ color }}>
            {designName}
          </div>
          <div className="text-xs text-gray-400 mono">
            Fitness: {(fitness * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mono">
            {resonance.toFixed(2)} GHz
          </div>
        </div>
      </div>
    </motion.div>
  );
}
