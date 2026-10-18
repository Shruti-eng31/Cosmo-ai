"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import CosmicBackground from "./CosmicBackground";
import { ChevronRight } from "lucide-react";

interface GrandWelcomeProps {
  onEnter: () => void;
}

export default function GrandWelcome({ onEnter }: GrandWelcomeProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnter();
    }, 2000); // Wait for transition animation
  };

  return (
    <AnimatePresence>
      {!isTransitioning && (
        <motion.div
          key="welcome-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* 3D Background */}
          <div className="absolute inset-0 z-0 opacity-60">
            <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
              <CosmicBackground />
            </Canvas>
          </div>

          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(38, 63, 120, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(38, 63, 120, 0.2) 1px, transparent 1px)',
              backgroundSize: '4rem 4rem',
              maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h1 className="text-6xl md:text-8xl font-light tracking-widest text-primary mb-6">
                COSMO AI
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="space-y-2 mb-12"
            >
              <p className="text-xl md:text-2xl text-primary/80 font-light tracking-wide">
                Explore the Universe.
              </p>
              <p className="text-xl md:text-2xl text-primary/80 font-light tracking-wide">
                Understand the Cosmos.
              </p>
              <p className="text-xl md:text-2xl text-primary/80 font-light tracking-wide">
                Discover with AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <p className="text-sm md:text-base text-primary/60 max-w-lg mb-12 font-light leading-relaxed">
                An intelligent cosmology platform combining scientific data, artificial intelligence, deep learning and interactive visualization.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="flex flex-col sm:flex-row gap-6 items-center"
            >
              <button
                onClick={handleEnter}
                className="group relative px-8 py-4 bg-transparent border border-accent hover:border-primary transition-colors duration-500 overflow-hidden flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 text-primary tracking-widest uppercase text-sm">Enter Cosmos</span>
                <ChevronRight className="relative z-10 w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-500" />
              </button>
              
              <button
                onClick={handleEnter}
                className="text-primary/60 hover:text-primary transition-colors duration-300 text-sm tracking-wider uppercase"
              >
                Explore Platform
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
