'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface InfoPanelProps {
  generation: number;
  totalGenerations: number;
  bestFitness: number;
  userFitness: number;
}

export default function InfoPanel({
  generation,
  totalGenerations,
  bestFitness,
  userFitness,
}: InfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progress = generation / totalGenerations;
  const phase = progress < 0.2 ? 'exploration' : progress < 0.6 ? 'exploitation' : 'convergence';
  
  const phaseInfo = {
    exploration: {
      title: 'Exploration Phase',
      description: 'The GA is exploring diverse regions of the design space, trying many different pixel configurations.',
      color: '#00ffff',
    },
    exploitation: {
      title: 'Exploitation Phase',
      description: 'Good designs are being refined. Crossover combines successful patterns while mutations fine-tune.',
      color: '#ff00ff',
    },
    convergence: {
      title: 'Convergence Phase',
      description: 'Designs are converging toward optimal solutions. The best configurations dominate the population.',
      color: '#00ff88',
    },
  };
  
  const currentPhase = phaseInfo[phase];
  
  return (
    <motion.div
      className="absolute bottom-4 left-4 z-10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="tech-card px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-cyan-500 transition-colors"
      >
        <span className="text-lg">💡</span>
        <span className="text-sm text-gray-400">
          {isExpanded ? 'Hide Info' : 'What\'s happening?'}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-cyan-400"
        >
          ▼
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="tech-card p-4 mt-2 w-80"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
          >
            {/* Current Phase */}
            <div className="mb-4">
              <div
                className="text-sm font-bold mb-1"
                style={{ color: currentPhase.color }}
              >
                {currentPhase.title}
              </div>
              <p className="text-xs text-gray-400">
                {currentPhase.description}
              </p>
            </div>
            
            {/* Progress indicators */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Best Fitness:</span>
                <span className="font-mono text-green-400">
                  {(bestFitness * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Your Design:</span>
                <span className="font-mono text-cyan-400">
                  {(userFitness * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* GA Operators Legend */}
            <div className="mt-4 pt-3 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-2">GA Operators Active:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-cyan-900/30 text-cyan-400 text-xs">
                  Selection
                </span>
                <span className="px-2 py-1 rounded bg-magenta-900/30 text-xs" style={{ color: '#ff00ff', background: 'rgba(255,0,255,0.1)' }}>
                  Crossover
                </span>
                <span className="px-2 py-1 rounded bg-yellow-900/30 text-yellow-400 text-xs">
                  Mutation
                </span>
              </div>
            </div>
            
            {/* Inverse Design Reminder */}
            <div className="mt-3 p-2 rounded bg-gray-800/50 text-xs text-gray-400">
              <strong className="text-gray-300">Inverse Design:</strong> Instead of designing 
              the shape and checking the frequency, we specify the target frequency (2.16 GHz) 
              and let the GA discover the optimal pixel pattern.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
