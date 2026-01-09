import { DesignCard } from '@/types/antenna';

// Predefined antenna designs (placeholder data - will be replaced with real GA run data)
// Each design represents a different starting configuration in the GA population

const createRandomGrid = (seed: number): number[][] => {
  // Simple seeded random for reproducible patterns
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const grid: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const row: number[] = [];
    for (let j = 0; j < 10; j++) {
      // Create interesting patterns, not just random noise
      const val = random(seed + i * 10 + j);
      // Keep feed connection area (columns 4-5, row 0) always on
      if (i === 0 && (j === 4 || j === 5)) {
        row.push(1);
      } else {
        row.push(val > 0.4 ? 1 : 0);
      }
    }
    grid.push(row);
  }
  return grid;
};

// Create distinct visual patterns for each design
const patterns: { [key: string]: number[][] } = {
  alpha: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  beta: [
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  ],
  gamma: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  delta: [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  ],
  epsilon: [
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
  ],
  zeta: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

export const designCards: DesignCard[] = [
  {
    id: 'design-alpha',
    name: 'Alpha',
    pixelGrid: patterns.alpha,
    color: '#00ffff', // Cyan
  },
  {
    id: 'design-beta',
    name: 'Beta',
    pixelGrid: patterns.beta,
    color: '#ff00ff', // Magenta
  },
  {
    id: 'design-gamma',
    name: 'Gamma',
    pixelGrid: patterns.gamma,
    color: '#ffff00', // Yellow
  },
  {
    id: 'design-delta',
    name: 'Delta',
    pixelGrid: patterns.delta,
    color: '#00ff00', // Green
  },
  {
    id: 'design-epsilon',
    name: 'Epsilon',
    pixelGrid: patterns.epsilon,
    color: '#ff6600', // Orange
  },
  {
    id: 'design-zeta',
    name: 'Zeta',
    pixelGrid: patterns.zeta,
    color: '#ff0066', // Pink
  },
];

export const getDesignById = (id: string): DesignCard | undefined => {
  return designCards.find(card => card.id === id);
};
