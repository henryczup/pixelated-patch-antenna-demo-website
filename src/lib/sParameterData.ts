import { SParameterCurve } from '@/types/antenna';

// Generate S-parameter curves for antenna simulation
// The resonance dip shifts from ~4.9 GHz toward ~2.16 GHz as optimization progresses

const FREQ_POINTS = 100;
const FREQ_MIN = 1.5; // GHz
const FREQ_MAX = 5.5; // GHz

// Generate frequency array
export const frequencyArray: number[] = Array.from(
  { length: FREQ_POINTS },
  (_, i) => FREQ_MIN + (i / (FREQ_POINTS - 1)) * (FREQ_MAX - FREQ_MIN)
);

// Generate an S11 curve with a resonance dip at a specific frequency
export const generateS11Curve = (
  resonanceFreq: number,
  dipDepth: number = -25, // dB at resonance
  bandwidth: number = 0.15 // GHz
): SParameterCurve => {
  const s11: number[] = frequencyArray.map(freq => {
    // Baseline S11 (around -3 to -5 dB away from resonance)
    const baseline = -3;
    
    // Gaussian-like dip at resonance
    const delta = freq - resonanceFreq;
    const dip = (dipDepth - baseline) * Math.exp(-(delta * delta) / (2 * bandwidth * bandwidth));
    
    // Add some realistic ripple
    const ripple = Math.sin(freq * 8) * 0.5;
    
    return baseline + dip + ripple;
  });
  
  return {
    frequency: [...frequencyArray],
    s11,
  };
};

// Generate S-parameter curve based on fitness (0-1)
// Higher fitness = resonance closer to target 2.16 GHz
export const generateS11ForFitness = (fitness: number): SParameterCurve => {
  // Map fitness to resonance frequency
  // fitness 0 -> ~4.9 GHz (starting point)
  // fitness 1 -> ~2.16 GHz (target)
  const startFreq = 4.9;
  const targetFreq = 2.16;
  const resonanceFreq = startFreq - fitness * (startFreq - targetFreq);
  
  // Better fitness = deeper dip (better matching)
  const dipDepth = -15 - fitness * 15; // -15 to -30 dB
  
  // Better fitness = narrower bandwidth (more selective)
  const bandwidth = 0.25 - fitness * 0.1; // 0.25 to 0.15 GHz
  
  return generateS11Curve(resonanceFreq, dipDepth, bandwidth);
};

// Get resonance frequency from fitness
export const getResonanceFromFitness = (fitness: number): number => {
  const startFreq = 4.9;
  const targetFreq = 2.16;
  return startFreq - fitness * (startFreq - targetFreq);
};
