'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import RaceControls from './RaceControls';
import DualSParamChart from './DualSParamChart';
import WinnerReveal from './WinnerReveal';
import InfoPanel from './InfoPanel';
import { PixelTooltip } from './PixelPreview';
import { useRace } from '@/hooks/useRace';
import { designCards } from '@/lib/designCards';

// Dynamic import for Three.js component (no SSR)
const LossLandscape = dynamic(() => import('./LossLandscape'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-cyan-400 animate-pulse">Loading 3D Scene...</div>
    </div>
  ),
});

interface RaceLayoutProps {
  userPickId: string;
  onPlayAgain: () => void;
}

export default function RaceLayout({ userPickId, onPlayAgain }: RaceLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredDesignId, setHoveredDesignId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showWinner, setShowWinner] = useState(false);
  
  const {
    currentGeneration,
    totalGenerations,
    designs,
    trails,
    getBestDesign,
    getDesignById,
    getDesignCardById,
    resetRace,
    getWinner,
    getUserRank,
  } = useRace({
    isPlaying,
    onRaceComplete: () => {
      setIsPlaying(false);
      // Delay winner reveal for dramatic effect
      setTimeout(() => setShowWinner(true), 1000);
    },
  });
  
  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const handleRestart = useCallback(() => {
    setShowWinner(false);
    resetRace();
    setIsPlaying(true);
  }, [resetRace]);
  
  const handlePlayAgain = useCallback(() => {
    setShowWinner(false);
    onPlayAgain();
  }, [onPlayAgain]);
  
  // Get chart data
  const userDesign = getDesignById(userPickId);
  const userCard = getDesignCardById(userPickId);
  const bestDesign = getBestDesign();
  const bestCard = bestDesign ? getDesignCardById(bestDesign.designId) : null;
  
  // Get hovered design info for tooltip
  const hoveredDesign = hoveredDesignId ? getDesignById(hoveredDesignId) : null;
  const hoveredCard = hoveredDesignId ? getDesignCardById(hoveredDesignId) : null;
  
  // Winner info
  const winner = getWinner();
  const userRank = getUserRank(userPickId);
  const didUserWin = winner?.card?.id === userPickId;
  
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* Loss Landscape (70% height) */}
      <div className="relative flex-[7] min-h-0">
        <LossLandscape
          designs={designs}
          userPickId={userPickId}
          onHoverDesign={setHoveredDesignId}
          trails={trails}
        />
        
        {/* Race controls overlay */}
        <RaceControls
          generation={currentGeneration}
          totalGenerations={totalGenerations}
          isPlaying={isPlaying}
          userPickId={userPickId}
          bestDesignId={bestDesign?.designId || null}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
        />
        
        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredDesign && hoveredCard && (
            <PixelTooltip
              pixelGrid={hoveredDesign.pixelGrid}
              designName={hoveredCard.name}
              fitness={hoveredDesign.fitness}
              resonance={hoveredDesign.resonance}
              color={hoveredCard.color}
              position={mousePos}
            />
          )}
        </AnimatePresence>
        
        {/* Info panel */}
        <InfoPanel
          generation={currentGeneration}
          totalGenerations={totalGenerations}
          bestFitness={bestDesign?.fitness || 0}
          userFitness={userDesign?.fitness || 0}
        />
      </div>
      
      {/* Dual S-Parameter Charts (30% height) */}
      <div className="flex-[3] min-h-0 border-t border-gray-800">
        <DualSParamChart
          userDesign={userDesign && userCard ? {
            name: userCard.name,
            sParams: userDesign.sParams,
            color: userCard.color,
            resonance: userDesign.resonance,
          } : null}
          bestDesign={bestDesign && bestCard ? {
            name: bestCard.name,
            sParams: bestDesign.sParams,
            color: bestCard.color,
            resonance: bestDesign.resonance,
          } : null}
        />
      </div>
      
      {/* Winner reveal overlay */}
      <WinnerReveal
        isVisible={showWinner}
        winnerCard={winner?.card || null}
        winnerPixelGrid={winner?.design?.pixelGrid || null}
        userPickCard={userCard}
        userRank={userRank}
        didUserWin={didUserWin}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
