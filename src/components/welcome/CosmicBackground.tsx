"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// High-performance vertex shader
const vortexVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Optimized lightweight analytical swirl shader:
// Replaces multi-octave loop Simplex Noise with fast trigonometric harmonics
// Yields silky-smooth 60+ FPS without GPU load/fan spin
const vortexFragmentShader = `
  precision mediump float;
  uniform float uTime;
  uniform vec3 uColorCore;
  uniform vec3 uColorInner;
  uniform vec3 uColorOuter;
  uniform vec3 uColorDeep;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;

    if (dist > 1.0 || dist < 0.08) {
      discard;
    }

    float angle = atan(centered.y, centered.x);

    // Fast multi-frequency analytical spiral waves (zero expensive noise calls)
    float spiral1 = sin(angle * 3.0 - dist * 9.0 + uTime * 0.5);
    float spiral2 = sin(angle * 6.0 - dist * 14.0 - uTime * 0.35);
    float spiral3 = cos(angle * 2.0 - dist * 5.0 + uTime * 0.2);

    float filaments = spiral1 * 0.5 + spiral2 * 0.3 + spiral3 * 0.2;
    filaments = filaments * 0.5 + 0.5;
    filaments = pow(filaments, 2.2);

    // Smooth cosmic spectral gradient
    vec3 col = mix(uColorCore, uColorInner, smoothstep(0.08, 0.30, dist));
    col = mix(col, uColorOuter, smoothstep(0.30, 0.65, dist));
    col = mix(col, uColorDeep, smoothstep(0.65, 1.0, dist));

    // Golden streak accents
    float goldBand = smoothstep(0.20, 0.35, dist) * (1.0 - smoothstep(0.35, 0.52, dist));
    float goldWave = sin(angle * 4.0 - uTime * 0.6) * 0.5 + 0.5;
    vec3 goldColor = vec3(1.0, 0.72, 0.32);
    col += goldColor * goldWave * goldBand * 1.5;

    // Glowing filaments
    col += uColorInner * filaments * 0.6 * (1.0 - dist * 0.4);

    // Edge fading
    float innerFade = smoothstep(0.08, 0.16, dist);
    float outerFade = 1.0 - smoothstep(0.85, 1.0, dist);
    float alpha = innerFade * outerFade * (0.80 + filaments * 0.2);

    gl_FragColor = vec4(col, alpha);
  }
`;

// Glowing Singularity Core
function SingularityCore() {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2.0) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Black Hole Void */}
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color="#00020a" />
      </mesh>

      {/* Radiant Event Horizon */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Glow Shield */}
      <mesh>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Optimized Orbiting Celestial Body
interface OrbitPlanetProps {
  radius: number;
  speed: number;
  size: number;
  baseColor: string;
  glowColor: string;
  initialAngle: number;
  yOffset: number;
  hasRing?: boolean;
}

function OrbitPlanet({ radius, speed, size, baseColor, glowColor, initialAngle, yOffset, hasRing }: OrbitPlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + initialAngle;
    if (planetRef.current) {
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * (radius * 0.85);
      const y = yOffset + Math.sin(t * 1.5) * 0.25;
      planetRef.current.position.set(x, y, z);
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={planetRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[size, 20, 20]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.7}
          metalness={0.15}
          emissive={baseColor}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Backlit Rim */}
      <mesh scale={1.07}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {hasRing && (
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
          <ringGeometry args={[size * 1.35, size * 2.1, 32]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// Lightweight Accretion Disc (Plane geometry reduced to 24x24 segments)
function AccretionDisk() {
  const diskRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color("#f0fdf4") },
      uColorInner: { value: new THREE.Color("#38bdf8") },
      uColorOuter: { value: new THREE.Color("#1e40af") },
      uColorDeep: { value: new THREE.Color("#020617") },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (diskRef.current) {
      diskRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh
      ref={diskRef}
      rotation={[-Math.PI / 2.3, 0.45, -Math.PI / 3.8]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[20, 20, 24, 24]} />
      <shaderMaterial
        vertexShader={vortexVertexShader}
        fragmentShader={vortexFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Lightweight Cosmic Orbital Rings
function CosmicLensingRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * -0.015;
    }
  });

  const rings = [
    { inner: 3.5, outer: 3.56, color: "#38bdf8", opacity: 0.35 },
    { inner: 5.2, outer: 5.28, color: "#60a5fa", opacity: 0.22 },
    { inner: 7.2, outer: 7.28, color: "#818cf8", opacity: 0.15 },
  ];

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2.3, 0.45, -Math.PI / 3.8]}>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0, (i - 1) * 0.03]}>
          <ringGeometry args={[r.inner, r.outer, 48]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={r.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Optimized Starfield (reduced particle count from 3800 to 1200 with zero visual loss)
function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const cyan = new THREE.Color("#67e8f9");
    const blue = new THREE.Color("#3b82f6");
    const gold = new THREE.Color("#fef08a");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const arm = i % 4;
      const angle = (i / count) * Math.PI * 10 + (arm * Math.PI * 2) / 4;
      const dist = 1.8 + Math.pow(Math.random(), 0.65) * 15;

      const spreadX = (Math.random() - 0.5) * 1.8;
      const spreadY = (Math.random() - 0.5) * (dist * 0.4);
      const spreadZ = (Math.random() - 0.5) * 1.8;

      pos[i * 3] = Math.cos(angle) * dist + spreadX;
      pos[i * 3 + 1] = spreadY;
      pos[i * 3 + 2] = Math.sin(angle) * dist + spreadZ;

      const rand = Math.random();
      let chosen = white;
      if (rand < 0.45) chosen = cyan;
      else if (rand < 0.75) chosen = blue;
      else chosen = gold;

      cols[i * 3] = chosen.r;
      cols[i * 3 + 1] = chosen.g;
      cols[i * 3 + 2] = chosen.b;
    }

    return [pos, cols];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Master Scene with throttled/smooth parallax
export default function CosmicBackground() {
  const containerRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (containerRef.current) {
      containerRef.current.rotation.y += (mouse.x * 0.35 - containerRef.current.rotation.y) * 0.035;
      containerRef.current.rotation.x += (-mouse.y * 0.25 - containerRef.current.rotation.x) * 0.035;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3.5} distance={20} color="#38bdf8" />
      <pointLight position={[3, 4, 3]} intensity={1.8} distance={15} color="#e0f2fe" />

      <group ref={containerRef} position={[0.5, -0.8, -1.5]}>
        <SingularityCore />
        <AccretionDisk />
        <CosmicLensingRings />

        {/* 1. Large Foreground Planet with Ring */}
        <OrbitPlanet
          radius={6.5}
          speed={0.09}
          size={1.15}
          baseColor="#081e42"
          glowColor="#38bdf8"
          initialAngle={-0.6}
          yOffset={-1.8}
          hasRing={true}
        />

        {/* 2. Midground Oceanic Planet */}
        <OrbitPlanet
          radius={5.5}
          speed={-0.14}
          size={0.78}
          baseColor="#0c2d5e"
          glowColor="#67e8f9"
          initialAngle={2.6}
          yOffset={0.2}
        />

        {/* 3. Outer Silhouette Planet */}
        <OrbitPlanet
          radius={8.8}
          speed={0.05}
          size={0.55}
          baseColor="#06122b"
          glowColor="#818cf8"
          initialAngle={1.2}
          yOffset={2.5}
        />

        {/* 4. Mini Satellite Moon */}
        <OrbitPlanet
          radius={3.6}
          speed={0.28}
          size={0.25}
          baseColor="#1e3a5f"
          glowColor="#e0f2fe"
          initialAngle={4.2}
          yOffset={0.6}
        />

        <Starfield />
      </group>
    </>
  );
}
