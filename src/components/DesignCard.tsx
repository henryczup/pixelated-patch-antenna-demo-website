'use client';

import { motion } from 'framer-motion';
import PixelPreview from './PixelPreview';
import { DesignCard as DesignCardType } from '@/types/antenna';

interface DesignCardProps {
  design: DesignCardType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function DesignCard({
  design,
  isSelected,
  onSelect,
  disabled = false,
}: DesignCardProps) {
  return (
    <motion.button
      onClick={() => !disabled && onSelect(design.id)}
      disabled={disabled}
      className={`
        relative p-4 rounded-lg transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${design.color}15 0%, ${design.color}08 100%)`
          : 'rgba(26, 32, 40, 0.8)',
        border: `2px solid ${isSelected ? design.color : 'rgba(100, 110, 125, 0.3)'}`,
      }}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: design.color }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <PixelPreview
          pixelGrid={design.pixelGrid}
          size="large"
          color={design.color}
        />

        <div className="text-center">
          <h3
            className="text-lg font-semibold tracking-wide"
            style={{ color: design.color }}
          >
            {design.name}
          </h3>
          <p className="text-xs text-gray-500 mono mt-1">
            {design.id.replace('design-', '').toUpperCase()}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200"
        style={{
          width: isSelected ? '50%' : '0%',
          background: design.color,
        }}
      />
    </motion.button>
  );
}
