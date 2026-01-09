'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { SParameterCurve } from '@/types/antenna';
import { motion } from 'framer-motion';

interface ChartData {
  frequency: number;
  s11: number;
}

interface SingleChartProps {
  title: string;
  subtitle?: string;
  sParams: SParameterCurve;
  color: string;
  resonance: number;
  targetFreq?: number;
}

function SingleChart({
  title,
  subtitle,
  sParams,
  color,
  resonance,
  targetFreq = 2.16,
}: SingleChartProps) {
  const data: ChartData[] = useMemo(() => {
    return sParams.frequency.map((freq, i) => ({
      frequency: freq,
      s11: sParams.s11[i],
    }));
  }, [sParams]);
  
  // Find the minimum S11 value (resonance dip)
  const minS11 = Math.min(...sParams.s11);
  
  return (
    <div className="chart-container h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-bold" style={{ color }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Resonance</div>
          <div className="text-sm font-mono font-bold" style={{ color }}>
            {resonance.toFixed(2)} GHz
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(100, 100, 150, 0.2)"
              vertical={false}
            />
            
            <XAxis
              dataKey="frequency"
              type="number"
              domain={[1.5, 5.5]}
              tickCount={5}
              tick={{ fill: '#666', fontSize: 10 }}
              axisLine={{ stroke: '#444' }}
              tickLine={{ stroke: '#444' }}
              tickFormatter={(v) => `${v.toFixed(1)}`}
            />
            
            <YAxis
              domain={[-35, 0]}
              tickCount={4}
              tick={{ fill: '#666', fontSize: 10 }}
              axisLine={{ stroke: '#444' }}
              tickLine={{ stroke: '#444' }}
              tickFormatter={(v) => `${v}`}
            />
            
            {/* Target frequency reference line */}
            <ReferenceLine
              x={targetFreq}
              stroke="#00ff88"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{
                value: 'Target',
                position: 'top',
                fill: '#00ff88',
                fontSize: 9,
              }}
            />
            
            {/* -10 dB reference line (common matching threshold) */}
            <ReferenceLine
              y={-10}
              stroke="#ff6600"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: '-10dB',
                position: 'right',
                fill: '#ff6600',
                fontSize: 9,
              }}
            />
            
            <Tooltip
              contentStyle={{
                background: 'rgba(10, 10, 20, 0.9)',
                border: '1px solid rgba(100, 100, 150, 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelFormatter={(v) => `${Number(v).toFixed(2)} GHz`}
              formatter={(v) => [`${Number(v).toFixed(1)} dB`, 'S11']}
            />
            
            <Line
              type="monotone"
              dataKey="s11"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats footer */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-800">
        <span>Min S11: <span className="font-mono" style={{ color }}>{minS11.toFixed(1)} dB</span></span>
        <span>Target: <span className="font-mono text-green-400">{targetFreq} GHz</span></span>
      </div>
    </div>
  );
}

interface DualSParamChartProps {
  userDesign: {
    name: string;
    sParams: SParameterCurve;
    color: string;
    resonance: number;
  } | null;
  bestDesign: {
    name: string;
    sParams: SParameterCurve;
    color: string;
    resonance: number;
  } | null;
}

export default function DualSParamChart({
  userDesign,
  bestDesign,
}: DualSParamChartProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 h-full p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* User's design chart */}
      <div className="h-full">
        {userDesign ? (
          <SingleChart
            title="Your Design"
            subtitle={userDesign.name}
            sParams={userDesign.sParams}
            color={userDesign.color}
            resonance={userDesign.resonance}
          />
        ) : (
          <div className="chart-container h-full flex items-center justify-center text-gray-500">
            No design selected
          </div>
        )}
      </div>
      
      {/* Best design chart */}
      <div className="h-full">
        {bestDesign ? (
          <SingleChart
            title="Best Design"
            subtitle={bestDesign.name}
            sParams={bestDesign.sParams}
            color={bestDesign.color}
            resonance={bestDesign.resonance}
          />
        ) : (
          <div className="chart-container h-full flex items-center justify-center text-gray-500">
            Waiting for race...
          </div>
        )}
      </div>
    </motion.div>
  );
}
