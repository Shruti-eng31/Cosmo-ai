"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CosmicBackground() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate particles
  const [positions, sizes, opacities] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const op = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Create a galactic distribution
      const r = 20 * Math.pow(Math.random(), 0.5);
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.2; // flatten disk
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      size[i] = Math.random() * 0.05 + 0.01;
      op[i] = Math.random() * 0.6 + 0.1;
    }
    return [pos, size, op];
  }, []);

  // Generate orbital rings
  const ringPositions = useMemo(() => {
    const segments = 128;
    const rings = 5;
    const pos = new Float32Array(rings * segments * 2 * 3);
    let idx = 0;

    for (let r = 1; r <= rings; r++) {
      const radius = r * 3;
      for (let i = 0; i < segments; i++) {
        const theta1 = (i / segments) * Math.PI * 2;
        const theta2 = ((i + 1) / segments) * Math.PI * 2;
        
        pos[idx++] = Math.cos(theta1) * radius;
        pos[idx++] = 0;
        pos[idx++] = Math.sin(theta1) * radius;
        
        pos[idx++] = Math.cos(theta2) * radius;
        pos[idx++] = 0;
        pos[idx++] = Math.sin(theta2) * radius;
      }
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#FFF3CF"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={ringPositions.length / 3}
            args={[ringPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#263F78"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
