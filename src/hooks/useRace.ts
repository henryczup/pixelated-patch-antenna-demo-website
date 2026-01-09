'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { DesignState } from '@/types/antenna';
import { gaTimeline, getGeneration, getTotalGenerations, getWinnerDesignId, getFinalRankings } from '@/lib/gaTimeline';
import { designCards } from '@/lib/designCards';

interface UseRaceOptions {
  isPlaying: boolean;
  onGenerationChange?: (generation: number) => void;
  onRaceComplete?: () => void;
  speed?: number; // ms per generation
}

interface TrailData {
  [designId: string]: { x: number; y: number }[];
}

export function useRace({
  isPlaying,
  onGenerationChange,
  onRaceComplete,
  speed = 200,
}: UseRaceOptions) {
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [designs, setDesigns] = useState<DesignState[]>([]);
  const [trails, setTrails] = useState<TrailData>({});
  const [isComplete, setIsComplete] = useState(false);
  
  const totalGenerations = getTotalGenerations();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize designs from first generation
  useEffect(() => {
    const gen = getGeneration(0);
    setDesigns(gen.designs);
    
    // Initialize trails
    const initialTrails: TrailData = {};
    gen.designs.forEach(d => {
      initialTrails[d.designId] = [{ ...d.position }];
    });
    setTrails(initialTrails);
  }, []);
  
  // Animation loop
  useEffect(() => {
    if (isPlaying && !isComplete) {
      intervalRef.current = setInterval(() => {
        setCurrentGeneration(prev => {
          const next = prev + 1;
          
          if (next > totalGenerations) {
            setIsComplete(true);
            onRaceComplete?.();
            return prev;
          }
          
          // Update designs
          const gen = getGeneration(next);
          setDesigns(gen.designs);
          
          // Update trails
          setTrails(prevTrails => {
            const newTrails: TrailData = {};
            gen.designs.forEach(d => {
              const existingTrail = prevTrails[d.designId] || [];
              // Keep last 20 positions for trail
              const trail = [...existingTrail, { ...d.position }].slice(-20);
              newTrails[d.designId] = trail;
            });
            return newTrails;
          });
          
          onGenerationChange?.(next);
          return next;
        });
      }, speed);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isComplete, speed, totalGenerations, onGenerationChange, onRaceComplete]);
  
  // Get current best design
  const getBestDesign = useCallback(() => {
    if (designs.length === 0) return null;
    return designs.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }, [designs]);
  
  // Get design by ID
  const getDesignById = useCallback((id: string) => {
    return designs.find(d => d.designId === id) || null;
  }, [designs]);
  
  // Get design card info by ID
  const getDesignCardById = useCallback((id: string) => {
    return designCards.find(c => c.id === id) || null;
  }, []);
  
  // Reset race
  const resetRace = useCallback(() => {
    setCurrentGeneration(0);
    setIsComplete(false);
    
    const gen = getGeneration(0);
    setDesigns(gen.designs);
    
    const initialTrails: TrailData = {};
    gen.designs.forEach(d => {
      initialTrails[d.designId] = [{ ...d.position }];
    });
    setTrails(initialTrails);
  }, []);
  
  // Get winner info
  const getWinner = useCallback(() => {
    if (!isComplete) return null;
    const winnerId = getWinnerDesignId();
    const winnerDesign = getDesignById(winnerId);
    const winnerCard = getDesignCardById(winnerId);
    return { design: winnerDesign, card: winnerCard };
  }, [isComplete, getDesignById, getDesignCardById]);
  
  // Get final rankings
  const getRankings = useCallback(() => {
    return getFinalRankings();
  }, []);
  
  // Get user's rank
  const getUserRank = useCallback((userId: string) => {
    const rankings = getRankings();
    const userRank = rankings.find(r => r.designId === userId);
    return userRank?.rank || null;
  }, [getRankings]);
  
  return {
    currentGeneration,
    totalGenerations,
    designs,
    trails,
    isComplete,
    getBestDesign,
    getDesignById,
    getDesignCardById,
    resetRace,
    getWinner,
    getRankings,
    getUserRank,
    progress: currentGeneration / totalGenerations,
  };
}
