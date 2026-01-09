'use client';

import { useState, useCallback } from 'react';
import { GameState, GamePhase } from '@/types/antenna';

const initialState: GameState = {
  phase: 'landing',
  selectedDesignId: null,
  currentGeneration: 0,
  isPlaying: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  
  const setPhase = useCallback((phase: GamePhase) => {
    setState(prev => ({ ...prev, phase }));
  }, []);
  
  const selectDesign = useCallback((designId: string) => {
    setState(prev => ({ ...prev, selectedDesignId: designId }));
  }, []);
  
  const setGeneration = useCallback((generation: number) => {
    setState(prev => ({ ...prev, currentGeneration: generation }));
  }, []);
  
  const setPlaying = useCallback((isPlaying: boolean) => {
    setState(prev => ({ ...prev, isPlaying }));
  }, []);
  
  const startRace = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'racing',
      currentGeneration: 0,
      isPlaying: true,
    }));
  }, []);
  
  const finishRace = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'finished',
      isPlaying: false,
    }));
  }, []);
  
  const reset = useCallback(() => {
    setState(initialState);
  }, []);
  
  const goToSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'selection',
      currentGeneration: 0,
      isPlaying: false,
    }));
  }, []);
  
  return {
    state,
    setPhase,
    selectDesign,
    setGeneration,
    setPlaying,
    startRace,
    finishRace,
    reset,
    goToSelection,
  };
}
