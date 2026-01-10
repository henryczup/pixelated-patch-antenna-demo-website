'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import CardSelector from '@/components/CardSelector';
import { GamePhase } from '@/types/antenna';

// Dynamic import for RaceLayout (contains Three.js)
const RaceLayout = dynamic(() => import('@/components/RaceLayout'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0f1419]">
      <div className="text-gray-400 text-xl">Loading Race...</div>
    </div>
  ),
});

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setPhase('selection');
  }, []);

  const handleSelectDesign = useCallback((id: string) => {
    setSelectedDesignId(id);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    if (selectedDesignId) {
      setPhase('racing');
    }
  }, [selectedDesignId]);

  const handlePlayAgain = useCallback(() => {
    setSelectedDesignId(null);
    setPhase('selection');
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0f1419] grid-bg">
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <LandingPage key="landing" onStart={handleStart} />
        )}

        {phase === 'selection' && (
          <SelectionPage
            key="selection"
            selectedId={selectedDesignId}
            onSelect={handleSelectDesign}
            onConfirm={handleConfirmSelection}
          />
        )}

        {phase === 'racing' && selectedDesignId && (
          <motion.div
            key="racing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <RaceLayout
              userPickId={selectedDesignId}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Landing Page Component
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="h-full w-full flex flex-col items-center justify-center p-8 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        {/* Antenna icon */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative w-28 h-28">
            {/* PCB representation */}
            <div className="absolute inset-0 rounded-md bg-[#1a4a1a]" />

            {/* Pixel grid */}
            <div className="absolute inset-2 grid grid-cols-5 grid-rows-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    background: '#b87333',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-3"
          style={{ color: '#4db8c7' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Pixelated Patch Antenna
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-gray-400 text-center max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          Inverse Design via Genetic Algorithm Optimization
        </motion.p>
      </div>

      {/* Inverse Design Explanation */}
      <motion.div
        className="tech-card p-6 max-w-3xl mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#4db8c7' }}>
          What is Inverse Design?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-sm">
          {/* Traditional vs Inverse */}
          <div className="space-y-3">
            <div className="p-3 rounded-md bg-red-900/20 border border-red-800/30">
              <h3 className="font-semibold text-red-400 mb-1">Traditional Design</h3>
              <p className="text-gray-400">
                Engineer designs antenna shape → Simulate to find resonance frequency
              </p>
              <p className="text-gray-500 text-xs mt-1 italic">
                &ldquo;I made this shape, what frequency does it resonate at?&rdquo;
              </p>
            </div>

            <div className="p-3 rounded-md bg-green-900/20 border border-green-800/30">
              <h3 className="font-semibold text-green-400 mb-1">Inverse Design</h3>
              <p className="text-gray-400">
                Specify target frequency → Algorithm discovers optimal shape
              </p>
              <p className="text-gray-500 text-xs mt-1 italic">
                &ldquo;I need 2.16 GHz — what shape achieves this?&rdquo;
              </p>
            </div>
          </div>

          {/* How GA Works */}
          <div className="space-y-2">
            <h3 className="font-semibold" style={{ color: '#b86fc4' }}>How the GA Finds Solutions:</h3>
            <ol className="space-y-1 text-gray-400">
              <li className="flex gap-2">
                <span className="font-mono" style={{ color: '#4db8c7' }}>1.</span>
                <span><strong>Population:</strong> Start with random pixel configurations</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono" style={{ color: '#4db8c7' }}>2.</span>
                <span><strong>Evaluate:</strong> Simulate S11 for each design</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono" style={{ color: '#4db8c7' }}>3.</span>
                <span><strong>Select:</strong> Keep designs closest to target frequency</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono" style={{ color: '#4db8c7' }}>4.</span>
                <span><strong>Evolve:</strong> Crossover & mutate pixels</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono" style={{ color: '#4db8c7' }}>5.</span>
                <span><strong>Repeat:</strong> Iterate until convergence</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-4 p-3 rounded-md bg-[#1a2a30] border border-[#2a3a45]">
          <p className="text-sm" style={{ color: '#7ac4cf' }}>
            <strong>Key Insight:</strong> By removing copper pixels strategically, we can shift the
            resonance from 4.9 GHz down to 2.16 GHz — achieving <span className="font-mono" style={{ color: '#d4a84b' }}>82.79% size reduction</span> compared
            to a conventional patch antenna at the same frequency.
          </p>
        </div>
      </motion.div>

      {/* The Challenge */}
      <motion.div
        className="tech-card p-6 max-w-3xl mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: '#d4a84b' }}>
          The Challenge
        </h2>

        <p className="text-gray-400 mb-4">
          A 10×10 pixel grid has <span className="font-mono" style={{ color: '#4db8c7' }}>2<sup>100</sup></span> ≈ <span className="font-mono" style={{ color: '#4db8c7' }}>1.27 × 10<sup>30</sup></span> possible
          configurations — that&apos;s over a <em>nonillion</em> combinations!
          Even a supercomputer checking 1 trillion configs/second would need
          <span className="font-mono" style={{ color: '#d4a84b' }}> ~40 billion years</span> to search them all.
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-md bg-gray-800/50">
            <div className="text-2xl font-mono" style={{ color: '#4db8c7' }}>100</div>
            <div className="text-xs text-gray-500">Pixels</div>
          </div>
          <div className="p-3 rounded-md bg-gray-800/50">
            <div className="text-xl font-mono" style={{ color: '#b86fc4' }}>10<sup>30</sup></div>
            <div className="text-xs text-gray-500">Combinations</div>
          </div>
          <div className="p-3 rounded-md bg-gray-800/50">
            <div className="text-2xl font-mono" style={{ color: '#5bb98b' }}>60</div>
            <div className="text-xs text-gray-500">Generations</div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4 text-center">
          The Genetic Algorithm efficiently navigates this astronomically large design space,
          finding near-optimal solutions in just 60 generations by intelligently evolving promising candidates.
        </p>
      </motion.div>

      {/* Start button */}
      <motion.button
        onClick={onStart}
        className="tech-button text-xl px-10 py-5 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Pick Your Design & Race
      </motion.button>

      {/* Tech specs */}
      <motion.div
        className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="text-center">
          <div className="font-mono text-lg" style={{ color: '#4db8c7' }}>17.58 × 13.85</div>
          <div>Patch Size (mm)</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg" style={{ color: '#b86fc4' }}>FR4</div>
          <div>Substrate</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg" style={{ color: '#d4a84b' }}>1.6 mm</div>
          <div>Thickness</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg" style={{ color: '#5bb98b' }}>2.16 GHz</div>
          <div>Target Freq</div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-xs text-gray-600 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        RF Conference Demo | Based on MATLAB Antenna Toolbox Example
        <br />
        <span className="text-gray-700">Miniaturize Rectangular Microstrip Patch Antenna Using Genetic Algorithm Optimization</span>
      </motion.div>
    </motion.div>
  );
}

// Selection Page Component
function SelectionPage({
  selectedId,
  onSelect,
  onConfirm,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="h-full w-full flex items-center justify-center"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <CardSelector
        selectedId={selectedId}
        onSelect={onSelect}
        onConfirm={onConfirm}
      />
    </motion.div>
  );
}
