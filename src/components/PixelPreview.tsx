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
  
  const cellSizes = {
    small: 'w-[10%] h-[10%]',
    medium: 'w-[10%] h-[10%]',
    large: 'w-[10%] h-[10%]',
  };
  
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-lg overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #1a5c1a 0%, #0d2e0d 100%)',
          boxShadow: `0 0 20px ${color}33`,
        }}
      >
        {/* Substrate background */}
        <div className="absolute inset-0 opacity-50" style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }} />
        
        {/* Pixel grid */}
        <div className="absolute inset-1 grid grid-cols-10 grid-rows-10 gap-[1px]">
          {pixelGrid.flat().map((cell, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.005, duration: 0.2 }}
              className={`rounded-[1px] ${cell === 1 ? 'shadow-sm' : ''}`}
              style={{
                background: cell === 1
                  ? `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -30)} 100%)`
                  : 'rgba(10, 10, 15, 0.6)',
                boxShadow: cell === 1 ? `inset 0 1px 2px rgba(255,255,255,0.3)` : 'none',
              }}
            />
          ))}
        </div>
        
        {/* Feed strip indicator (bottom center) */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[15%] h-[8%] rounded-t-sm"
          style={{
            background: `linear-gradient(to top, ${color}, ${adjustColor(color, 20)})`,
          }}
        />
      </div>
      
      {showLabel && label && (
        <span
          className="text-xs font-mono font-bold tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// Helper to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
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
          <div className="font-bold text-sm" style={{ color }}>
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
