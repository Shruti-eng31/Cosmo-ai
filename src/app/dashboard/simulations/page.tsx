"use client";

import { useState } from "react";
import { Play, Settings2, Database, Share2, Download, FastForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SimulationsPage() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRun = () => {
    setRunning(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setRunning(false);
          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 h-full flex flex-col lg:flex-row gap-8">
      
      {/* Left Params Panel */}
      <div className="w-full lg:w-96 bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl overflow-hidden flex flex-col shrink-0">
        <div className="p-6 border-b border-[#263F78]/30 bg-background/20">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Settings2 className="w-4 h-4" />
            <h3 className="text-sm font-medium tracking-wide">Simulation Parameters</h3>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary/40">ΛCDM N-Body Mock Environment</p>
        </div>
        
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          
          <div className="space-y-6">
            <h4 className="text-xs text-white font-medium uppercase tracking-widest border-b border-[#263F78]/30 pb-2">Cosmological Core</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Matter Density (Ωm)</span>
                <span className="text-primary font-mono">0.315</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Dark Energy (ΩΛ)</span>
                <span className="text-primary font-mono">0.685</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Hubble Constant (H₀)</span>
                <span className="text-primary font-mono">67.4</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs text-white font-medium uppercase tracking-widest border-b border-[#263F78]/30 pb-2">Environment Limits</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Box Size (Mpc/h)</span>
                <span className="text-primary font-mono">250.0</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Particles (N³)</span>
                <span className="text-primary font-mono">512</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-[#263F78]/30 bg-background/20">
          <button 
            onClick={handleRun}
            disabled={running}
            className="w-full py-3 bg-primary text-background rounded-lg text-sm tracking-widest uppercase font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {running ? (
              <><FastForward className="w-4 h-4 animate-pulse" /> Simulating...</>
            ) : (
              <><Play className="w-4 h-4" /> Run Simulation</>
            )}
          </button>
        </div>
      </div>

      {/* Right Visualization Area */}
      <div className="flex-1 bg-[#0D1C42]/20 border border-[#263F78]/30 rounded-xl overflow-hidden relative flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-[#263F78]/30 flex justify-between items-center bg-background/30 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#263F78]/30 flex items-center justify-center text-primary">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white tracking-wide">Dark Matter Halo Distribution</h3>
              <p className="text-[10px] text-primary/40 uppercase tracking-widest">z = {((100 - progress) / 10).toFixed(2)} (Redshift)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-[#263F78]/30 rounded text-primary hover:bg-[#263F78]/20 transition-colors"><Share2 className="w-4 h-4" /></button>
            <button className="p-2 border border-[#263F78]/30 rounded text-primary hover:bg-[#263F78]/20 transition-colors"><Download className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Vis Area */}
        <div className="flex-1 relative bg-[#01030B] flex items-center justify-center overflow-hidden">
          
          {/* Mock 3D Cosmic Web Image */}
          <img 
            src="/images/illustris.jpg" 
            alt="Cosmic Web" 
            className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-all duration-[5000ms] ${running ? 'scale-125 opacity-40' : 'scale-100 opacity-80'}`}
          />

          <AnimatePresence>
            {running && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <div className="text-primary font-mono text-4xl font-light mb-4">{progress}%</div>
                <div className="w-64 h-1 bg-[#263F78]/30 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-[10px] text-primary/60 uppercase tracking-widest font-mono">
                  Calculating gravitational potentials...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Panel (if 100%) */}
          {progress === 100 && !running && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 bg-[#0D1C42]/80 backdrop-blur-md border border-primary/30 rounded-xl p-6 z-20 flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest text-primary/50 block mb-1">Simulation Complete</div>
                <h3 className="text-lg text-white font-medium mb-2">Structure Formation matches ΛCDM Model</h3>
                <p className="text-xs text-primary/80 font-light leading-relaxed">
                  The simulated matter distribution accurately reproduces the cosmic web structure at z=0. The power spectrum of the density fluctuations aligns with the theoretical predictions within a 2.4% margin of error.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 shrink-0">
                <div className="bg-[#263F78]/20 border border-[#263F78]/40 rounded p-3 text-center">
                  <div className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Halos Identified</div>
                  <div className="text-xl text-white font-light font-mono">142,805</div>
                </div>
                <div className="bg-[#263F78]/20 border border-[#263F78]/40 rounded p-3 text-center">
                  <div className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Max Mass (M☉)</div>
                  <div className="text-xl text-white font-light font-mono">1.2e15</div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
}
