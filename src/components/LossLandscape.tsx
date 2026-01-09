'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { lossLandscape, landscapeToWorld } from '@/lib/lossLandscapeData';
import { DesignState } from '@/types/antenna';
import { designCards } from '@/lib/designCards';

interface TerrainMeshProps {
  heightMap: number[][];
}

function TerrainMesh({ heightMap }: TerrainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const size = heightMap.length;
    const geo = new THREE.PlaneGeometry(10, 10, size - 1, size - 1);
    
    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    
    for (let i = 0; i < positions.count; i++) {
      const x = Math.floor(i % size);
      const y = Math.floor(i / size);
      
      // Clamp indices to valid range
      const clampedX = Math.min(x, size - 1);
      const clampedY = Math.min(y, size - 1);
      
      const height = heightMap[clampedX]?.[clampedY] ?? 0;
      positions.setZ(i, height * 3); // Scale height for visibility
      
      // Color gradient based on height (valley = dark blue, peak = bright cyan/white)
      const t = height;
      colors[i * 3] = 0.1 + t * 0.5;     // R
      colors[i * 3 + 1] = 0.2 + t * 0.8; // G
      colors[i * 3 + 2] = 0.4 + t * 0.6; // B
    }
    
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    
    return geo;
  }, [heightMap]);
  
  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        metalness={0.3}
        roughness={0.7}
        wireframe={false}
      />
    </mesh>
  );
}

// Wireframe overlay for the terrain
function TerrainWireframe({ heightMap }: TerrainMeshProps) {
  const geometry = useMemo(() => {
    const size = heightMap.length;
    const geo = new THREE.PlaneGeometry(10, 10, size - 1, size - 1);
    
    const positions = geo.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = Math.floor(i % size);
      const y = Math.floor(i / size);
      const clampedX = Math.min(x, size - 1);
      const clampedY = Math.min(y, size - 1);
      const height = heightMap[clampedX]?.[clampedY] ?? 0;
      positions.setZ(i, height * 3 + 0.02); // Slightly above solid mesh
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [heightMap]);
  
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <meshBasicMaterial
        color="#00ffff"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

interface RaceMarkerProps {
  position: { x: number; y: number };
  color: string;
  isUserPick: boolean;
  isLeader: boolean;
  designId: string;
  onHover?: (designId: string | null) => void;
}

function RaceMarker({ position, color, isUserPick, isLeader, designId, onHover }: RaceMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const worldPos = landscapeToWorld(position.x, position.y);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = worldPos.y + 0.3 + Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.05;
    }
    if (glowRef.current) {
      // Pulsing glow
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      glowRef.current.scale.setScalar(scale);
    }
  });
  
  const markerSize = isUserPick ? 0.25 : isLeader ? 0.22 : 0.18;
  
  return (
    <group position={[worldPos.x, worldPos.y + 0.3, worldPos.z]}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[markerSize * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isUserPick ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover?.(designId)}
        onPointerLeave={() => onHover?.(null)}
      >
        <sphereGeometry args={[markerSize, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isUserPick ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Ring for user pick */}
      {isUserPick && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[markerSize * 1.8, 0.03, 16, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      
      {/* Crown for leader */}
      {isLeader && (
        <mesh position={[0, markerSize + 0.15, 0]}>
          <coneGeometry args={[0.08, 0.15, 4]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Trail showing path traveled
interface TrailProps {
  positions: { x: number; y: number }[];
  color: string;
}

function Trail({ positions, color }: TrailProps) {
  const points = useMemo(() => {
    return positions.map(pos => {
      const world = landscapeToWorld(pos.x, pos.y);
      return new THREE.Vector3(world.x, world.y + 0.1, world.z);
    });
  }, [positions]);
  
  if (points.length < 2) return null;
  
  const curve = new THREE.CatmullRomCurve3(points);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.02, 8, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

// Optimal peak marker
function OptimalMarker() {
  const meshRef = useRef<THREE.Mesh>(null);
  const worldPos = landscapeToWorld(
    lossLandscape.optimalPosition.x,
    lossLandscape.optimalPosition.y
  );
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group position={[worldPos.x, worldPos.y + 0.5, worldPos.z]}>
      {/* Beacon light */}
      <pointLight color="#00ffff" intensity={2} distance={3} />
      
      {/* Rotating diamond */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

interface LossLandscapeSceneProps {
  designs: DesignState[];
  userPickId: string | null;
  onHoverDesign?: (designId: string | null) => void;
  trails?: { [designId: string]: { x: number; y: number }[] };
}

function LossLandscapeScene({ designs, userPickId, onHoverDesign, trails }: LossLandscapeSceneProps) {
  // Find the current leader
  const leaderId = designs.reduce((best, current) =>
    current.fitness > (designs.find(d => d.designId === best)?.fitness ?? 0) ? current.designId : best
  , designs[0]?.designId);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff00ff" />
      
      {/* Terrain */}
      <TerrainMesh heightMap={lossLandscape.heightMap} />
      <TerrainWireframe heightMap={lossLandscape.heightMap} />
      
      {/* Optimal peak marker */}
      <OptimalMarker />
      
      {/* Trails */}
      {trails && Object.entries(trails).map(([designId, positions]) => {
        const card = designCards.find(c => c.id === designId);
        return card ? (
          <Trail key={`trail-${designId}`} positions={positions} color={card.color} />
        ) : null;
      })}
      
      {/* Race markers */}
      {designs.map(design => {
        const card = designCards.find(c => c.id === design.designId);
        if (!card) return null;
        
        return (
          <RaceMarker
            key={design.designId}
            position={design.position}
            color={card.color}
            isUserPick={design.designId === userPickId}
            isLeader={design.designId === leaderId}
            designId={design.designId}
            onHover={onHoverDesign}
          />
        );
      })}
      
      {/* Grid floor */}
      <gridHelper args={[12, 24, '#1a1a2e', '#1a1a2e']} position={[0, -0.01, 0]} />
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.2}
      />
      
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
    </>
  );
}

interface LossLandscapeProps {
  designs: DesignState[];
  userPickId: string | null;
  onHoverDesign?: (designId: string | null) => void;
  trails?: { [designId: string]: { x: number; y: number }[] };
}

export default function LossLandscape({ designs, userPickId, onHoverDesign, trails }: LossLandscapeProps) {
  return (
    <div className="w-full h-full bg-[#0a0a0f]">
      <Canvas shadows>
        <LossLandscapeScene
          designs={designs}
          userPickId={userPickId}
          onHoverDesign={onHoverDesign}
          trails={trails}
        />
      </Canvas>
    </div>
  );
}
