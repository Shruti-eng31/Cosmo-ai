"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import CosmicBackground from "./CosmicBackground";
import { ChevronRight, Compass } from "lucide-react";

interface GrandWelcomeProps {
  onEnter: () => void;
}

export default function GrandWelcome({ onEnter }: GrandWelcomeProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnter();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {!isTransitioning && (
        <motion.div
          key="welcome-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-8 px-6 bg-[#010414] overflow-hidden select-none"
        >
          {/* Interactive 3D Cosmic Vortex & Planetary Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas
              camera={{ position: [0, 3.5, 15], fov: 46 }}
              dpr={[1, 1.5]}
              gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            >
              <CosmicBackground />
            </Canvas>
          </div>

          {/* Central Deep Contrast Scrim - Ensures crystal clear text legibility against bright vortex */}
          <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 48%, rgba(1, 4, 20, 0.88) 0%, rgba(1, 4, 20, 0.70) 45%, rgba(1, 4, 20, 0.25) 85%, transparent 100%)",
            }}
          />

          {/* Vignette Rim */}
          <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 60%, rgba(1, 4, 20, 0.95) 100%)",
            }}
          />


          {/* Central Content Hero Card */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto pointer-events-auto">
            {/* Title with maximum contrast: Pure solid brilliant white with golden warmth & deep shadow drop */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5"
            >
              <h1 className="text-6xl sm:text-7xl md:text-9xl font-light tracking-[0.25em] text-[#ffffff] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] [text-shadow:_0_0_40px_rgba(56,189,248,0.35)]">
                COSMO AI
              </h1>
            </motion.div>

            {/* Tagline triad with solid white and vibrant gold/cyan dots inside a high-contrast dark capsule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="px-7 py-3 rounded-full bg-[#030a1c]/85 border border-cyan-500/30 backdrop-blur-lg flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-[#f1f5f9] font-medium tracking-widest text-xs sm:text-sm md:text-base uppercase shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
            >
              <span className="flex items-center gap-2.5 text-white">
                <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
                Explore the Universe
              </span>
              <span className="text-cyan-400/50 hidden sm:inline">•</span>
              <span className="flex items-center gap-2.5 text-white">
                <span className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_10px_#38bdf8]" />
                Understand the Cosmos
              </span>
              <span className="text-cyan-400/50 hidden sm:inline">•</span>
              <span className="flex items-center gap-2.5 text-white">
                <span className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]" />
                Discover with AI
              </span>
            </motion.div>

            {/* Platform Description with crystal clear brightness */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="max-w-2xl mx-auto mb-10 px-4"
            >
              <p className="text-sm sm:text-base md:text-lg text-[#e2e8f0] font-normal leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                An intelligent cosmology platform combining deep astronomical datasets,
                neural spectral modeling, and interactive multidimensional spacetime visualization.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.9 }}
              className="flex flex-col sm:flex-row gap-5 items-center"
            >
              <button
                onClick={handleEnter}
                className="group relative px-9 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-full transition-all duration-300 overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_50px_rgba(56,189,248,0.8)] cursor-pointer scale-100 hover:scale-[1.03]"
              >
                <span className="relative z-10 text-slate-950 tracking-[0.2em] uppercase text-xs sm:text-sm font-bold">
                  Enter Cosmos
                </span>
                <ChevronRight className="relative z-10 w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform duration-300 stroke-[3]" />
              </button>

              <button
                onClick={handleEnter}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#030a1c]/80 hover:bg-[#030a1c] border border-cyan-400/40 hover:border-cyan-300 text-white transition-all duration-300 text-xs sm:text-sm tracking-[0.16em] uppercase font-medium cursor-pointer backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              >
                <Compass className="w-4 h-4 text-cyan-300 group-hover:rotate-45 transition-transform duration-500" />
                <span>Explore Platform</span>
              </button>
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
