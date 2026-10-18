"use client";

import { useState } from "react";
import { Upload, Scan, Maximize, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VisionAnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 2500);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col xl:flex-row gap-8">
      
      {/* Left Workspace */}
      <div className="flex-1 bg-card border border-[#263F78]/30 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#263F78]/30 bg-background/20 flex justify-between items-center">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#263F78]/30 border border-[#263F78]/50 rounded text-xs text-primary flex items-center gap-2 hover:bg-[#263F78]/50 transition-colors">
              <Upload className="w-3 h-3" /> Upload FITS / Image
            </button>
            <button className="px-3 py-1.5 bg-transparent border border-[#263F78]/50 rounded text-xs text-primary/60 flex items-center gap-2 hover:bg-[#263F78]/20 transition-colors">
              Select Sample
            </button>
          </div>
          <button className="p-1.5 text-primary/60 hover:text-primary transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {/* Sample Image */}
          <img 
            src="/images/jwst.jpg" 
            alt="Space" 
            className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen"
          />

          <AnimatePresence>
            {analyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#263F78]/10"
              >
                {/* Scanner Animation */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_20px_var(--color-primary)] z-20"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[40%] left-[30%] w-48 h-48 border-[1.5px] border-primary z-20 flex items-start justify-end p-2 bg-primary/10 shadow-[0_0_30px_rgba(245,230,195,0.2)]"
              >
                <div className="bg-background text-primary text-[10px] font-mono px-2 py-1 tracking-wider uppercase border border-[#263F78]">
                  TARGET: NGC-224-B
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(245,230,195,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,230,195,0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
        
        {!result && !analyzing ? (
          <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full">
            <Scan className="w-12 h-12 text-primary/40 mb-4" />
            <h3 className="text-white font-medium mb-2">Ready to Analyze</h3>
            <p className="text-xs text-primary/60 font-light leading-relaxed mb-6">Select a region or upload a new image to run the Vision Transformer model.</p>
            <button 
              onClick={handleAnalyze}
              className="w-full py-3 bg-primary text-background rounded-lg text-sm tracking-widest uppercase font-medium hover:bg-white transition-colors"
            >
              Run Vision AI
            </button>
          </div>
        ) : analyzing ? (
          <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full">
            <Scan className="w-12 h-12 text-primary animate-pulse mb-4" />
            <h3 className="text-white font-medium mb-2">Processing Image...</h3>
            <p className="text-xs text-primary/60 font-mono">Running feature extraction across 12 attention heads.</p>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0D1C42]/50 border border-primary/40 rounded-xl p-6"
            >
              <div className="flex items-center gap-4 border-b border-[#263F78]/30 pb-6 mb-6">
                <div className="w-12 h-12 rounded-lg bg-background border border-[#263F78] flex items-center justify-center shrink-0">
                  <Scan className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-primary/50 block">Object Detected</div>
                  <div className="text-lg text-white font-medium flex items-center gap-2">Galaxy <span className="w-2 h-2 rounded-full bg-green-500" /></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-[#263F78]/10 pb-2">
                  <span className="text-primary/60">Classification</span>
                  <span className="text-white px-2 py-0.5 bg-[#263F78]/30 rounded">Spiral (Sb)</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-[#263F78]/10 pb-2">
                  <span className="text-primary/60">Confidence</span>
                  <span className="text-primary font-mono">94.7%</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-[#263F78]/10 pb-2">
                  <span className="text-primary/60">Redshift (z)</span>
                  <span className="text-white font-mono">0.623</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-[#263F78]/10 pb-2">
                  <span className="text-primary/60">Distance</span>
                  <span className="text-white">~ 3.8B ly</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2">
                  <span className="text-primary/60">Coordinates</span>
                  <span className="text-primary/80 font-mono">RA: 189.23° DEC: 62.11°</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0D1C42]/50 border border-red-500/20 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <h3 className="text-sm font-medium">Anomaly Detected</h3>
              </div>
              <p className="text-xs text-white font-light leading-relaxed">
                The galactic halo exhibits unusual asymmetry on the northern axis, potentially indicating a recent merger event or a tidal stream. 
              </p>
            </motion.div>

            <button 
              onClick={() => setResult(false)}
              className="w-full py-3 bg-transparent border border-[#263F78] text-primary rounded-lg text-xs tracking-widest uppercase hover:bg-[#263F78]/20 transition-colors mt-auto"
            >
              Reset Analysis
            </button>
          </>
        )}
      </div>
    </div>
  );
}
