'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUIStore } from '@/store/uiStore';

interface CircuitNode {
  position: THREE.Vector3;
  connections: number[];
}

interface FrameState {
  clock: THREE.Clock;
  camera: THREE.Camera;
  scene: THREE.Scene;
}

export const CircuitBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glitchIntensity = useUIStore(state => state.glitchIntensity);
  
  // Generate circuit nodes
  const { nodes, geometry } = useMemo(() => {
    const nodes: CircuitNode[] = [];
    const points: number[] = [];
    const colors: number[] = [];
    
    // Create grid of nodes
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        nodes.push({
          position: new THREE.Vector3(
            (i - 10) * 2,
            (j - 10) * 2,
            0
          ),
          connections: []
        });
        
        // Add connection points
        if (Math.random() > 0.7) {
          points.push(
            (i - 10) * 2, (j - 10) * 2, 0,
            (i - 10) * 2 + Math.random() * 2 - 1,
            (j - 10) * 2 + Math.random() * 2 - 1,
            Math.random() * 0.5
          );
          
          // Add colors for gradient effect
          colors.push(
            0, 0.5, 1, // Electric blue start
            0, 1, 1  // Neon cyan end
          );
        }
      }
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return { nodes, geometry };
  }, []);
  
  // Animate circuit paths
  useFrame((state: FrameState, delta: number) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Apply glitch effect based on intensity
      meshRef.current.position.z = Math.sin(time) * 0.1 * glitchIntensity;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.02 * glitchIntensity;
      
      // Update vertex positions for flowing effect
      const positions = meshRef.current.geometry.attributes.position.array as number[];
      for (let i = 0; i < positions.length; i += 6) {
        // Animate only end points of lines
        positions[i + 3] += Math.sin(time + i) * 0.01;
        positions[i + 4] += Math.cos(time + i) * 0.01;
        positions[i + 5] = Math.sin(time * 2 + i) * 0.2;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <Canvas>
      <mesh ref={meshRef}>
        <lineSegments geometry={geometry}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.3}
            linewidth={1}
          />
        </lineSegments>
      </mesh>
    </Canvas>
  );
}; 