'use client';

import { motion, AnimatePresence } from 'framer-motion';
import PixelPreview from './PixelPreview';
import { DesignCard } from '@/types/antenna';

interface WinnerRevealProps {
  isVisible: boolean;
  winnerCard: DesignCard | null;
  winnerPixelGrid: number[][] | null;
  userPickCard: DesignCard | null;
  userRank: number | null;
  didUserWin: boolean;
  onPlayAgain: () => void;
}

export default function WinnerReveal({
  isVisible,
  winnerCard,
  winnerPixelGrid,
  userPickCard,
  userRank,
  didUserWin,
  onPlayAgain,
}: WinnerRevealProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 tech-card p-8 max-w-2xl mx-4"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Winner announcement */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#4db8c7' }}>
                {didUserWin ? 'You Won!' : 'Race Complete'}
              </h2>
              <p className="text-gray-400">
                {didUserWin
                  ? 'Your design reached the global optimum.'
                  : `You placed #${userRank} out of 6 designs`}
              </p>
            </motion.div>

            {/* Winner display */}
            <motion.div
              className="flex flex-col items-center gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                Inverse Design Success
              </div>

              {winnerCard && winnerPixelGrid && (
                <div className="flex items-center gap-8">
                  <PixelPreview
                    pixelGrid={winnerPixelGrid}
                    size="large"
                    color={winnerCard.color}
                    showLabel
                    label={winnerCard.name}
                  />

                  <div className="text-left">
                    <div
                      className="text-2xl font-bold mb-2"
                      style={{ color: winnerCard.color }}
                    >
                      {winnerCard.name}
                    </div>
                    <div className="text-gray-400 text-sm mb-2">
                      GA discovered this pixel pattern to achieve:
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-300">Target: <span className="font-mono" style={{ color: '#4db8c7' }}>2.16 GHz</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-300">Size reduction: <span className="font-mono" style={{ color: '#d4a84b' }}>82.79%</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-300">S11 match: <span className="font-mono" style={{ color: '#b86fc4' }}>&lt; -10 dB</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inverse Design Explanation */}
              <div className="text-center text-xs text-gray-500 max-w-md mt-2 p-3 rounded-lg bg-gray-800/50">
                <strong style={{ color: '#4db8c7' }}>Inverse Design:</strong> We specified the target frequency,
                and the GA autonomously discovered this non-intuitive pixel pattern — something a human
                designer would be unlikely to conceive.
              </div>
            </motion.div>

            {/* User's pick comparison */}
            {!didUserWin && userPickCard && (
              <motion.div
                className="border-t border-gray-700 pt-6 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-2">Your Pick</div>
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-1"
                      style={{ background: userPickCard.color }}
                    />
                    <div className="font-semibold text-sm" style={{ color: userPickCard.color }}>
                      {userPickCard.name}
                    </div>
                    <div className="text-sm text-gray-500">#{userRank}</div>
                  </div>

                  <div className="text-2xl text-gray-600">→</div>

                  {winnerCard && (
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-2">Winner</div>
                      <div
                        className="w-6 h-6 rounded-full mx-auto mb-1"
                        style={{ background: winnerCard.color }}
                      />
                      <div className="font-semibold text-sm" style={{ color: winnerCard.color }}>
                        {winnerCard.name}
                      </div>
                      <div className="text-sm text-gray-500">#1</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Play again button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={onPlayAgain}
                className="tech-button text-lg px-8 py-4"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
