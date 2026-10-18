"use client";

import { useState } from "react";
import { BrainCircuit, Database, Play, CheckCircle2, RefreshCcw, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const correlationData = Array.from({ length: 50 }).map((_, i) => ({
  x: i,
  real: Math.sin(i * 0.2) * 50 + 50 + (Math.random() * 20 - 10),
  predicted: Math.sin(i * 0.2) * 50 + 50
}));

export default function AIAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col md:flex-row gap-8 items-stretch">

      {/* Left Configuration Panel */}
      <div className="w-full md:w-96 bg-card border border-[#263F78]/30 rounded-xl flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-[#263F78]/30 bg-background/20">
          <h3 className="text-sm font-medium text-white tracking-wide">Analysis Configuration</h3>
          <p className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">Setup deep learning parameters</p>
        </div>

        <div className="p-6 space-y-8 flex-1 overflow-y-auto">

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-primary/60">Dataset</label>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              <select className="w-full bg-[#0D1C42]/50 border border-[#263F78]/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white appearance-none outline-none focus:border-primary/50 cursor-pointer">
                <option>DESI DR1 - Main Sample</option>
                <option>GAIA DR3 - Astrometry</option>
                <option>RUBIN - Time Domain Mock</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-primary/60">Analysis Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Correlation', 'Clustering', 'Classification', 'Anomaly', 'Prediction', 'Statistical'].map((type, i) => (
                <button key={type} className={`py-2 px-3 text-xs rounded border transition-colors ${i === 0 ? 'bg-[#263F78]/30 border-primary/30 text-primary' : 'bg-transparent border-[#263F78]/30 text-primary/60 hover:bg-[#263F78]/10'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-primary/60">Hyperparameters</label>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Epochs</span>
                <span className="text-primary font-mono">100</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Learning Rate</span>
                <span className="text-primary font-mono">0.001</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-primary/60">Batch Size</span>
                <span className="text-primary font-mono">256</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#263F78]/30 bg-background/20">
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 bg-primary text-background rounded-lg text-sm tracking-widest uppercase font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <><Activity className="w-4 h-4 animate-spin" /> Initializing Run...</>
            ) : (
              <><Play className="w-4 h-4" /> Run AI Analysis</>
            )}
          </button>
        </div>
      </div>

      {/* Right Results Panel */}
      <div className="flex-1 bg-card border border-[#263F78]/30 rounded-xl overflow-hidden relative flex flex-col">

        {/* Loading State Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#010736]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center"
            >
              <div className="w-32 h-32 relative flex items-center justify-center mb-8">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-primary/20 border-r-2" />
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-2 rounded-full border-b-2 border-accent/40 border-l-2" />
                <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-light text-white mb-2">Training Model...</h3>
              <div className="text-xs text-primary/50 font-mono flex flex-col items-center gap-1">
                <span>Loading tensors from DESI DR1...</span>
                <span>Optimizing weights (Epoch 12/100)...</span>
                <span>Loss: 0.0432</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isAnalyzing && !showResults && (
          <div className="flex-1 flex flex-col items-center justify-center text-primary/40 p-12 text-center">
            <BrainCircuit className="w-16 h-16 mb-6 opacity-20" />
            <h3 className="text-lg text-white font-light mb-2">No Analysis Running</h3>
            <p className="text-sm max-w-sm leading-relaxed">Configure your analysis parameters on the left and click Run to start the AI Data Scientist.</p>
          </div>
        )}

        {/* Results State */}
        {showResults && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-8 border-b border-[#263F78]/30 bg-background/20 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>
                  <span className="text-[10px] uppercase tracking-widest text-primary/40">Duration: 12.4s</span>
                </div>
                <h2 className="text-2xl font-light text-white">Correlation Analysis Results</h2>
              </div>
              <button className="p-2 border border-[#263F78]/30 rounded hover:bg-[#263F78]/20 text-primary transition-colors">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-8">

              {/* Scientific Explanation generated by AI */}
              <div className="bg-[#0D1C42]/50 border border-primary/20 rounded-xl p-6 relative">
                <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#0D1C42] px-2 text-[10px] uppercase tracking-widest text-primary flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" /> AI Summary
                </div>
                <p className="text-sm text-white font-light leading-relaxed">
                  The model identified a strong non-linear correlation between the selected parameters. The predicted curve (yellow) closely matches the observed data (blue scatter) with an <span className="font-mono text-primary/80">R² = 0.94</span>. This suggests that the underlying distribution of the galaxies is heavily influenced by the secondary parameter, consistent with recent ΛCDM models.
                </p>
              </div>

              {/* Result Chart */}
              <div className="h-[400px] border border-[#263F78]/30 rounded-xl p-6 relative">
                <div className="absolute top-6 left-6 z-10">
                  <h3 className="text-xs uppercase tracking-widest text-primary/60">Actual vs Predicted</h3>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={correlationData} margin={{ top: 40, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#263F78" opacity={0.2} vertical={false} />
                    <XAxis dataKey="x" stroke="#263F78" tick={{ fill: '#FFF3CF', opacity: 0.5, fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#263F78', opacity: 0.5 }} />
                    <YAxis stroke="#263F78" tick={{ fill: '#FFF3CF', opacity: 0.5, fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0D1C42', borderColor: '#263F78', color: '#FFF3CF', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="real" stroke="#263F78" strokeWidth={0} dot={{ fill: '#263F78', r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="predicted" stroke="#FFF3CF" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Accuracy", value: "94.2%" },
                  { label: "Loss (MSE)", value: "0.0432" },
                  { label: "Validation Loss", value: "0.0451" },
                  { label: "Inference Time", value: "14ms" },
                ].map((m, i) => (
                  <div key={i} className="bg-background/50 border border-[#263F78]/30 rounded-lg p-4">
                    <div className="text-[10px] uppercase tracking-widest text-primary/40 mb-1">{m.label}</div>
                    <div className="text-xl font-light text-white font-mono">{m.value}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
