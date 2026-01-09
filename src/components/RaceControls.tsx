'use client';

import { motion } from 'framer-motion';
import { designCards } from '@/lib/designCards';

interface RaceControlsProps {
  generation: number;
  totalGenerations: number;
  isPlaying: boolean;
  userPickId: string | null;
  bestDesignId: string | null;
  onPlayPause: () => void;
  onRestart: () => void;
}

export default function RaceControls({
  generation,
  totalGenerations,
  isPlaying,
  userPickId,
  bestDesignId,
  onPlayPause,
  onRestart,
}: RaceControlsProps) {
  const userCard = designCards.find(c => c.id === userPickId);
  const bestCard = designCards.find(c => c.id === bestDesignId);
  const progress = (generation / totalGenerations) * 100;
  
  return (
    <motion.div
      className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left: Generation counter */}
      <div className="tech-card px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Gen:</span>
          <span className="font-mono text-xl text-cyan-400 font-bold">
            {generation}
          </span>
          <span className="text-gray-500 text-sm">/ {totalGenerations}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
      
      {/* Center: Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayPause}
          className="tech-button px-4 py-2 flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play
            </>
          )}
        </button>
        
        <button
          onClick={onRestart}
          className="tech-button px-4 py-2 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart
        </button>
      </div>
      
      {/* Right: Design info */}
      <div className="tech-card px-4 py-2 flex items-center gap-6">
        {/* User's pick */}
        {userCard && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white"
              style={{ background: userCard.color }}
            />
            <span className="text-sm text-gray-400">Your Pick:</span>
            <span className="font-bold" style={{ color: userCard.color }}>
              {userCard.name}
            </span>
          </div>
        )}
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-700" />
        
        {/* Current leader */}
        {bestCard && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: bestCard.color }}
            />
            <span className="text-sm text-gray-400">Leader:</span>
            <span className="font-bold" style={{ color: bestCard.color }}>
              {bestCard.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
