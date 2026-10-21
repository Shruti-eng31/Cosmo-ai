"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageSquare, Compass, Activity, Database, Telescope } from "lucide-react";

// Interactive Holographic Planetary Reactor Core with Dynamic Gravitational Rings
function InteractiveCosmicCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  // Generate glowing orbital points for the core
  const [particlesPos, particleColors] = useMemo(() => {
    const count = 450;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#38bdf8");
    const gold = new THREE.Color("#fde047");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.35 + Math.random() * 0.4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      const col = rand < 0.6 ? cyan : rand < 0.85 ? gold : white;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.35;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
    }

    if (glowMeshRef.current) {
      const pulse = 1 + Math.sin(time * 2.5) * 0.05;
      glowMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.25;
      ring1Ref.current.rotation.x = 0.5 + Math.sin(time * 0.15) * 0.1;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * -0.2;
      ring2Ref.current.rotation.z = 0.8 + Math.cos(time * 0.12) * 0.15;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = time * 0.18;
      ring3Ref.current.rotation.y = time * 0.12;
    }

    if (moonRef.current) {
      const angle = time * 0.6;
      moonRef.current.position.set(Math.cos(angle) * 3.4, Math.sin(angle * 0.8) * 0.7, Math.sin(angle) * 3.4);
      moonRef.current.rotation.y = time;
    }
  });

  return (
    <group>
      {/* Dynamic Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={4.5} distance={15} color="#38bdf8" />
      <pointLight position={[4, 5, 4]} intensity={2.0} distance={15} color="#ffffff" />
      <pointLight position={[-4, -3, 3]} intensity={1.5} distance={15} color="#f59e0b" />

      {/* Central Singularity Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.2, 28, 28]} />
        <meshStandardMaterial
          color="#061838"
          roughness={0.3}
          metalness={0.8}
          wireframe={false}
          emissive="#0d2858"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Glowing Pulsing Outer Atmosphere */}
      <mesh ref={glowMeshRef} scale={1.08}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          wireframe
        />
      </mesh>

      {/* Swirling Cloud of Quantum Data Energy */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesPos.length / 3} args={[particlesPos, 3]} />
          <bufferAttribute attach="attributes-color" count={particleColors.length / 3} args={[particleColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.75} blending={THREE.AdditiveBlending} />
      </points>

      {/* Ring 1 - Deep Cyan Resonant Track */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[2.5, 0.02, 16, 80]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[2.5, 0, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Ring 2 - Electric Sapphire Track */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[3.4, 0.02, 16, 90]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Ring 3 - Outer Golden Horizon */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[4.4, 0.015, 16, 100]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[-4.4, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#0f2b5c" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Orbiting Satellite Probe */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e0f2fe" emissive="#67e8f9" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Animated Cosmic Aura Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.28, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.22, 0.12],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full"
        />
      </div>

      {/* Grid overlay with subtle mask */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(56, 189, 248, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.2) 1px, transparent 1px)",
          backgroundSize: "5rem 5rem",
          maskImage: "radial-gradient(circle at 50% 50%, black 40%, transparent 85%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content (Cols 7) */}
          <div className="lg:col-span-7 space-y-8">
            

            {/* Glowing Hero Typography with Staggered Word Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-light tracking-tight text-white leading-[1.08]">
                Understand the <br />
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                  Universe
                </span> <br />
                with Intelligence.
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="text-base sm:text-lg text-slate-300/85 max-w-xl font-light leading-relaxed tracking-wide drop-shadow"
            >
              COSMO AI transforms complex multi-wavelength astronomical observations into
              autonomous deep-learning workflows, real-time spectral analysis, and scientific discoveries.
            </motion.p>


            {/* Call to Actions with Vibrant Hover Effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="/dashboard"
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

          {/* Right Visual (Cols 5) - Interactive 3D Cosmic Core with Floating Widgets */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="h-[520px] sm:h-[600px] w-full relative"
            >
              {/* Radial backdrop glow */}
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

              <Canvas
                camera={{ position: [0, 2, 7.5], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
              >
                <InteractiveCosmicCore />
              </Canvas>

              {/* Floating Live AI Analytics Card 1 (Top Left) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-6 -left-4 sm:left-4 z-20 p-3.5 rounded-xl bg-[#03091e]/85 border border-cyan-400/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center gap-3 text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Neural Vision</div>
                  <div className="font-semibold text-white">Galaxy Cluster M87</div>
                </div>
              </motion.div>

              {/* Floating Live AI Analytics Card 2 (Bottom Right) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-0 sm:right-4 z-20 p-3.5 rounded-xl bg-[#03091e]/85 border border-blue-400/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center gap-3 text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Spectral Stream</div>
                  <div className="font-semibold text-cyan-200">Redshift z = 2.418</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
