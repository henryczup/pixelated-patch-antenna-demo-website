import { LossLandscape } from '@/types/antenna';

// Generate a loss landscape with multiple local optima and one global optimum
// This creates an interesting terrain for the race visualization

const LANDSCAPE_SIZE = 50;

// Generate height map using multiple Gaussian peaks
const generateHeightMap = (): number[][] => {
  const heightMap: number[][] = [];
  
  // Define peaks (x, y, height, spread)
  const peaks = [
    { x: 35, y: 35, height: 1.0, spread: 8 },   // Global optimum (winner goes here)
    { x: 15, y: 40, height: 0.7, spread: 6 },   // Local optimum
    { x: 40, y: 15, height: 0.65, spread: 5 },  // Local optimum
    { x: 10, y: 15, height: 0.5, spread: 7 },   // Local optimum
    { x: 25, y: 25, height: 0.55, spread: 10 }, // Broad local optimum
  ];
  
  for (let i = 0; i < LANDSCAPE_SIZE; i++) {
    const row: number[] = [];
    for (let j = 0; j < LANDSCAPE_SIZE; j++) {
      let height = 0;
      
      // Sum contributions from all peaks
      for (const peak of peaks) {
        const dx = i - peak.x;
        const dy = j - peak.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const contribution = peak.height * Math.exp(-(distance * distance) / (2 * peak.spread * peak.spread));
        height += contribution;
      }
      
      // Add some noise for visual interest
      const noise = Math.sin(i * 0.3) * Math.cos(j * 0.3) * 0.05;
      height += noise;
      
      // Clamp to [0, 1]
      height = Math.max(0, Math.min(1, height));
      
      row.push(height);
    }
    heightMap.push(row);
  }
  
  return heightMap;
};

export const lossLandscape: LossLandscape = {
  width: LANDSCAPE_SIZE,
  height: LANDSCAPE_SIZE,
  heightMap: generateHeightMap(),
  optimalPosition: { x: 35, y: 35 }, // Location of global optimum
};

// Helper to get height at a specific position (with interpolation)
export const getHeightAt = (x: number, y: number): number => {
  const { heightMap, width, height } = lossLandscape;
  
  // Clamp coordinates
  const clampedX = Math.max(0, Math.min(width - 1, x));
  const clampedY = Math.max(0, Math.min(height - 1, y));
  
  // Bilinear interpolation
  const x0 = Math.floor(clampedX);
  const x1 = Math.min(x0 + 1, width - 1);
  const y0 = Math.floor(clampedY);
  const y1 = Math.min(y0 + 1, height - 1);
  
  const xFrac = clampedX - x0;
  const yFrac = clampedY - y0;
  
  const h00 = heightMap[x0][y0];
  const h10 = heightMap[x1][y0];
  const h01 = heightMap[x0][y1];
  const h11 = heightMap[x1][y1];
  
  const h0 = h00 * (1 - xFrac) + h10 * xFrac;
  const h1 = h01 * (1 - xFrac) + h11 * xFrac;
  
  return h0 * (1 - yFrac) + h1 * yFrac;
};

// Convert landscape coordinates to 3D world coordinates
export const landscapeToWorld = (x: number, y: number): { x: number; y: number; z: number } => {
  const worldX = (x / LANDSCAPE_SIZE - 0.5) * 10;
  const worldZ = (y / LANDSCAPE_SIZE - 0.5) * 10;
  const worldY = getHeightAt(x, y) * 3; // Scale height for visibility
  
  return { x: worldX, y: worldY, z: worldZ };
};
