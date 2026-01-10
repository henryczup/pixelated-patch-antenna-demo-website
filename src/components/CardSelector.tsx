'use client';

import { motion } from 'framer-motion';
import DesignCard from './DesignCard';
import { designCards } from '@/lib/designCards';

interface CardSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function CardSelector({
  selectedId,
  onSelect,
  onConfirm,
  disabled = false,
}: CardSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#4db8c7' }}>
          Choose Your Design
        </h2>
        <p className="text-gray-400 max-w-md">
          Pick an antenna design to bet on. Watch it race across the loss landscape
          as the genetic algorithm optimizes toward the best configuration.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {designCards.map((design, index) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <DesignCard
              design={design}
              isSelected={selectedId === design.id}
              onSelect={onSelect}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Confirm button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: selectedId ? 1 : 0.5, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <button
          onClick={onConfirm}
          disabled={!selectedId || disabled}
          className={`
            tech-button text-lg px-8 py-4
            ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {selectedId ? 'Start Race' : 'Select a Design'}
        </button>
      </motion.div>

      {/* Selected design info */}
      {selectedId && (
        <motion.div
          className="text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          You selected{' '}
          <span
            className="font-semibold"
            style={{ color: designCards.find(d => d.id === selectedId)?.color }}
          >
            {designCards.find(d => d.id === selectedId)?.name}
          </span>
        </motion.div>
      )}
    </div>
  );
}
