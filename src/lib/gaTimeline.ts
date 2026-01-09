import { GAGeneration, DesignState, SParameterCurve } from '@/types/antenna';
import { designCards } from './designCards';
import { lossLandscape, getHeightAt } from './lossLandscapeData';
import { generateS11ForFitness, getResonanceFromFitness } from './sParameterData';

// Pre-computed GA timeline data
// This will be replaced with real GA run data later

const TOTAL_GENERATIONS = 60;

// Starting positions for each design (spread around the landscape)
const startingPositions: { [key: string]: { x: number; y: number } } = {
  'design-alpha': { x: 5, y: 5 },
  'design-beta': { x: 45, y: 5 },
  'design-gamma': { x: 5, y: 45 },
  'design-delta': { x: 45, y: 45 },
  'design-epsilon': { x: 25, y: 10 },
  'design-zeta': { x: 10, y: 25 },
};

// Target positions (where each design ends up)
// The winner ends up at the global optimum
const targetPositions: { [key: string]: { x: number; y: number } } = {
  'design-alpha': { x: 15, y: 40 },   // Local optimum
  'design-beta': { x: 35, y: 35 },    // Global optimum - WINNER
  'design-gamma': { x: 40, y: 15 },   // Local optimum
  'design-delta': { x: 25, y: 25 },   // Broad local optimum
  'design-epsilon': { x: 10, y: 15 }, // Local optimum
  'design-zeta': { x: 33, y: 33 },    // Near global optimum (2nd place)
};

// Interpolate pixel grid between generations (simulate evolution)
const interpolatePixelGrid = (
  startGrid: number[][],
  targetGrid: number[][],
  progress: number
): number[][] => {
  return startGrid.map((row, i) =>
    row.map((cell, j) => {
      // Randomly flip some cells based on progress
      const shouldChange = Math.random() < progress * 0.1;
      if (shouldChange) {
        return targetGrid[i][j];
      }
      return cell;
    })
  );
};

// Generate evolved pixel grid (simulating GA mutations)
const evolvePixelGrid = (
  baseGrid: number[][],
  generation: number,
  designId: string
): number[][] => {
  const seed = designId.charCodeAt(designId.length - 1) + generation;
  const random = (s: number) => {
    const x = Math.sin(s * 9999) * 10000;
    return x - Math.floor(x);
  };
  
  return baseGrid.map((row, i) =>
    row.map((cell, j) => {
      // Keep feed connection (row 0, cols 4-5) always on
      if (i === 0 && (j === 4 || j === 5)) return 1;
      
      // Mutation probability decreases over generations
      const mutationProb = 0.1 * (1 - generation / TOTAL_GENERATIONS);
      if (random(seed + i * 10 + j) < mutationProb) {
        return cell === 1 ? 0 : 1;
      }
      return cell;
    })
  );
};

// Ease function for smooth movement
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Generate a single generation's state
const generateGeneration = (generationNum: number): GAGeneration => {
  const progress = generationNum / TOTAL_GENERATIONS;
  const easedProgress = easeInOutCubic(progress);
  
  const designs: DesignState[] = designCards.map(card => {
    const start = startingPositions[card.id];
    const target = targetPositions[card.id];
    
    // Add some randomness to path
    const noise = {
      x: Math.sin(generationNum * 0.5 + card.id.charCodeAt(7)) * 2,
      y: Math.cos(generationNum * 0.5 + card.id.charCodeAt(7)) * 2,
    };
    
    const position = {
      x: start.x + (target.x - start.x) * easedProgress + noise.x * (1 - easedProgress),
      y: start.y + (target.y - start.y) * easedProgress + noise.y * (1 - easedProgress),
    };
    
    // Clamp position to landscape bounds
    position.x = Math.max(0, Math.min(lossLandscape.width - 1, position.x));
    position.y = Math.max(0, Math.min(lossLandscape.height - 1, position.y));
    
    const fitness = getHeightAt(position.x, position.y);
    const resonance = getResonanceFromFitness(fitness);
    const sParams = generateS11ForFitness(fitness);
    
    const pixelGrid = evolvePixelGrid(card.pixelGrid, generationNum, card.id);
    
    return {
      designId: card.id,
      pixelGrid,
      position,
      fitness,
      resonance,
      sParams,
    };
  });
  
  // Find best design
  const bestDesign = designs.reduce((best, current) =>
    current.fitness > best.fitness ? current : best
  );
  
  return {
    generation: generationNum,
    designs,
    bestDesignId: bestDesign.designId,
  };
};

// Generate all generations
export const gaTimeline: GAGeneration[] = Array.from(
  { length: TOTAL_GENERATIONS + 1 },
  (_, i) => generateGeneration(i)
);

// Get a specific generation
export const getGeneration = (gen: number): GAGeneration => {
  const clampedGen = Math.max(0, Math.min(TOTAL_GENERATIONS, gen));
  return gaTimeline[clampedGen];
};

// Get total number of generations
export const getTotalGenerations = (): number => TOTAL_GENERATIONS;

// Get the winning design ID
export const getWinnerDesignId = (): string => {
  return gaTimeline[TOTAL_GENERATIONS].bestDesignId;
};

// Get final rankings
export const getFinalRankings = (): { designId: string; fitness: number; rank: number }[] => {
  const finalGen = gaTimeline[TOTAL_GENERATIONS];
  const sorted = [...finalGen.designs].sort((a, b) => b.fitness - a.fitness);
  return sorted.map((design, index) => ({
    designId: design.designId,
    fitness: design.fitness,
    rank: index + 1,
  }));
};
