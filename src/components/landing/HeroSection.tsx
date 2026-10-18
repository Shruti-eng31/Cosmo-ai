"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import Link from "next/link";

function CosmicCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const orbit1Ref = useRef<THREE.Group>(null);
  const orbit2Ref = useRef<THREE.Group>(null);
  const orbit3Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.5;
      coreRef.current.rotation.x = time * 0.2;
    }
    
    if (orbit1Ref.current) {
      orbit1Ref.current.rotation.y = time * 0.2;
      orbit1Ref.current.rotation.z = Math.sin(time * 0.1) * 0.2;
    }
    
    if (orbit2Ref.current) {
      orbit2Ref.current.rotation.x = time * 0.15;
      orbit2Ref.current.rotation.y = time * 0.1;
    }

    if (orbit3Ref.current) {
      orbit3Ref.current.rotation.z = time * 0.1;
      orbit3Ref.current.rotation.x = Math.cos(time * 0.1) * 0.2;
    }
  });

  return (
    <group>
      {/* Central Core */}
      <Sphere ref={coreRef} args={[1, 32, 32]}>
        <meshBasicMaterial color="#FFF3CF" wireframe transparent opacity={0.3} />
      </Sphere>
      <Sphere args={[0.9, 16, 16]}>
        <meshBasicMaterial color="#263F78" transparent opacity={0.8} />
      </Sphere>

      {/* Orbit 1: Data */}
      <group ref={orbit1Ref}>
        <mesh>
          <torusGeometry args={[2.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#263F78" transparent opacity={0.4} />
        </mesh>
        <mesh position={[2.5, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#FFF3CF" />
          <Text position={[0.4, 0.2, 0]} fontSize={0.15} color="#FFF3CF" anchorX="left" anchorY="middle">
            DATA
          </Text>
        </mesh>
      </group>

      {/* Orbit 2: Cosmos / Galaxies */}
      <group ref={orbit2Ref}>
        <mesh>
          <torusGeometry args={[3.8, 0.01, 16, 100]} />
          <meshBasicMaterial color="#263F78" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 3.8, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#0D1C42" />
          <Text position={[0.4, 0.2, 0]} fontSize={0.15} color="#FFF3CF" anchorX="left" anchorY="middle">
            COSMOS
          </Text>
        </mesh>
      </group>

      {/* Orbit 3: AI / Discovery */}
      <group ref={orbit3Ref}>
        <mesh>
          <torusGeometry args={[5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#263F78" transparent opacity={0.2} />
        </mesh>
        <mesh position={[-5, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#FFF3CF" wireframe />
          <Text position={[-0.4, 0.3, 0]} fontSize={0.15} color="#FFF3CF" anchorX="right" anchorY="middle">
            AI / DISCOVERY
          </Text>
        </mesh>
      </group>

      {/* Subtle background particles */}
      <points>
        <sphereGeometry args={[10, 32, 32]} />
        <pointsMaterial color="#FFF3CF" size={0.05} transparent opacity={0.3} />
      </points>
    </group>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/50 bg-accent/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs tracking-widest text-primary/80 uppercase font-medium">
                AI × COSMOLOGY × DISCOVERY
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-light leading-tight text-white/90">
              Understand the <br />
              <span className="text-primary font-medium">Universe</span> <br />
              with Intelligence.
            </h1>

            <p className="text-lg text-primary/60 max-w-xl font-light leading-relaxed">
              COSMO AI transforms complex astronomical data into interactive analysis, intelligent explanations and scientific discoveries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="/dashboard" className="px-8 py-3.5 bg-primary text-background rounded-full font-medium tracking-wide hover:bg-white transition-colors duration-300 flex items-center gap-2 text-sm">
                Start Exploring
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <button className="px-8 py-3.5 border border-border text-primary rounded-full hover:bg-accent/10 transition-colors duration-300 flex items-center gap-2 text-sm bg-card/30 backdrop-blur-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Ask COSMO AI
              </button>
            </div>
          </motion.div>

          {/* Right Visual - Cosmic Core */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="h-[600px] w-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />
            <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <CosmicCore />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2 + 0.2}
                minPolarAngle={Math.PI / 2 - 0.2}
              />
            </Canvas>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
