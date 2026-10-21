"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageSquare, Activity, Database } from "lucide-react";

// Optimized Holographic Planetary Core (Smooth 60+ FPS with minimal draw calls)
function InteractiveCosmicCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  // Generate a minimal, crisp set of quantum stardust particles
  const [particlesPos, particleColors] = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#38bdf8");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.35 + Math.random() * 0.35;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const col = Math.random() < 0.7 ? cyan : white;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.25;
      coreRef.current.rotation.x = 0.1;
    }

    if (glowMeshRef.current) {
      const pulse = 1 + Math.sin(time * 2.0) * 0.04;
      glowMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * -0.15;
    }

    if (moonRef.current) {
      const angle = time * 0.5;
      moonRef.current.position.set(Math.cos(angle) * 3.2, Math.sin(angle * 0.7) * 0.5, Math.sin(angle) * 3.2);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={3.0} distance={12} color="#38bdf8" />
      <pointLight position={[3, 4, 3]} intensity={1.5} distance={10} color="#ffffff" />

      {/* Central Celestial Body */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.2, 20, 20]} />
        <meshStandardMaterial
          color="#061838"
          roughness={0.4}
          metalness={0.6}
          emissive="#0d2858"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glowing Pulsing Outer Atmosphere */}
      <mesh ref={glowMeshRef} scale={1.08}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          wireframe
        />
      </mesh>

      {/* Quantum Stardust */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesPos.length / 3} args={[particlesPos, 3]} />
          <bufferAttribute attach="attributes-color" count={particleColors.length / 3} args={[particleColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </points>

      {/* Ring 1 - Deep Cyan Resonant Track */}
      <group ref={ring1Ref}>
        <mesh rotation={[0.5, 0, 0]}>
          <torusGeometry args={[2.5, 0.015, 8, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Ring 2 - Outer Track */}
      <group ref={ring2Ref}>
        <mesh rotation={[-0.4, 0.3, 0]}>
          <torusGeometry args={[3.4, 0.015, 8, 48]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Orbiting Satellite Probe */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>
    </group>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
      {/* Static GPU-friendly ambient radial glow (no expensive continuously calculating layout auras) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[110px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content (Cols 7) */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-light tracking-tight text-white leading-[1.08]">
                Understand the <br />
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                  Universe
                </span> <br />
                with Intelligence.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300/85 max-w-xl font-light leading-relaxed tracking-wide drop-shadow"
            >
              COSMO AI transforms complex multi-wavelength astronomical observations into
              autonomous deep-learning workflows, real-time spectral analysis, and scientific discoveries.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="/login"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-full transition-all duration-300 overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_45px_rgba(56,189,248,0.7)] text-sm uppercase tracking-wider scale-100 hover:scale-[1.03]"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1.5 transition-transform duration-300 stroke-[2.5]" />
              </Link>

              <a
                href="#ask"
                className="group px-7 py-4 border border-cyan-400/30 hover:border-cyan-300 text-white rounded-full transition-all duration-300 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider bg-[#030a1c]/70 hover:bg-[#030a1c] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <MessageSquare className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span>Ask COSMO AI</span>
              </a>
            </motion.div>
          </div>

          {/* Right Visual (Cols 5) - High-Performance 3D Core */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="h-[460px] sm:h-[520px] w-full relative"
            >
              <Canvas
                camera={{ position: [0, 2, 7.5], fov: 45 }}
                dpr={[1, 1.25]}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
              >
                <InteractiveCosmicCore />
              </Canvas>

              {/* Lightweight Floating Badges with CSS animations instead of continuous framer JS loops */}
              <div className="absolute top-6 left-2 sm:left-6 z-20 p-3 rounded-xl bg-[#03091e]/85 border border-cyan-400/30 backdrop-blur-md shadow-lg flex items-center gap-3 text-xs animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Neural Vision</div>
                  <div className="font-semibold text-white">Galaxy Cluster M87</div>
                </div>
              </div>

              <div className="absolute bottom-10 right-2 sm:right-6 z-20 p-3 rounded-xl bg-[#03091e]/85 border border-blue-400/30 backdrop-blur-md shadow-lg flex items-center gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Spectral Stream</div>
                  <div className="font-semibold text-cyan-200">Redshift z = 2.418</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
