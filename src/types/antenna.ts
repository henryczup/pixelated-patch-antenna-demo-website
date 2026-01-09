// Types for the antenna GA optimization demo

export interface DesignCard {
  id: string;
  name: string;
  pixelGrid: number[][];     // 10x10 binary matrix (initial state)
  color: string;             // Marker color on landscape
}

export interface DesignState {
  designId: string;
  pixelGrid: number[][];     // Current 10x10 pixel state
  position: { x: number; y: number };  // Position on loss landscape
  fitness: number;           // Current fitness value (height on landscape)
  resonance: number;         // Current resonance frequency in GHz
  sParams: SParameterCurve;  // Current S11 curve
}

export interface GAGeneration {
  generation: number;
  designs: DesignState[];
  bestDesignId: string;      // ID of current best performer
}

export interface SParameterCurve {
  frequency: number[];       // Array of frequency points (GHz)
  s11: number[];             // S11 values in dB
}

export interface LossLandscape {
  width: number;
  height: number;
  heightMap: number[][];     // 2D array of fitness values for terrain
  optimalPosition: { x: number; y: number };  // Peak location
}

export type GamePhase = 'landing' | 'selection' | 'racing' | 'finished';

export interface GameState {
  phase: GamePhase;
  selectedDesignId: string | null;
  currentGeneration: number;
  isPlaying: boolean;
}
