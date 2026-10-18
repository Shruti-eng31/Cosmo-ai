"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  BrainCircuit,
  Activity,
  Filter,
  X,
  Play,
  RotateCw
} from "lucide-react";

export function MetricCard({
  title,
  value,
  icon,
  trend,
  href = "/dashboard"
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-6 relative overflow-hidden group hover:border-primary/60 hover:bg-[#0D1C42]/80 transition-all block cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-[#263F78]/30 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
            {icon}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">{title}</span>
        </div>
        <ArrowUpRight size={14} className="text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
      <div className="text-3xl font-light text-white mb-2 tracking-wide">{value}</div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-green-400/90">
        <ArrowUpRight size={12} /> {trend}
      </div>
    </Link>
  );
}

const INSIGHTS = [
  {
    title: "DESI DR1 Large-Scale Structure",
    tag: "Spectroscopy",
    body: "Recent analysis of the DESI DR1 dataset indicates a dense concentration of galaxies at z ≈ 0.62. This structure spans roughly 45 Mpc and exhibits lower-than-average star formation rates.",
    link: "/dashboard/ai-analysis"
  },
  {
    title: "ISRO Mission Trajectory Convergence",
    tag: "Aeronautics",
    body: "Historical telemetry of 125 ISRO launches shows a 96.8% overall mission success rate, with PSLV maintaining a 94.4% high-inclination polar insertion reliability across 3 decades.",
    link: "/dashboard/explorer"
  },
  {
    title: "GAIA DR3 Stellar Kinematics",
    tag: "Astrometry",
    body: "Radial velocity mapping of 33 million stars confirms non-axisymmetric spiral arm perturbation in the Milky Way thin disk, matching N-body simulation predictions.",
    link: "/dashboard/universe"
  }
];

export function AIInsightsPanel() {
  const [insightIndex, setInsightIndex] = useState(0);

  const current = INSIGHTS[insightIndex];

  return (
    <div className="bg-gradient-to-br from-[#0D1C42] to-[#010736] border border-[#263F78]/50 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <BrainCircuit size={18} className="animate-pulse" />
          <h3 className="text-sm font-medium tracking-wide">AI Research Insights</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInsightIndex((i) => (i + 1) % INSIGHTS.length)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#263F78]/30 hover:bg-[#263F78]/60 text-[10px] uppercase tracking-widest text-primary border border-[#263F78]/50 transition-colors"
            title="Cycle next insight"
          >
            <RotateCw size={10} /> Next ({insightIndex + 1}/{INSIGHTS.length})
          </button>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase">
          {current.tag}
        </div>
        <h4 className="text-sm font-medium text-white">{current.title}</h4>
        <p className="text-xs text-primary/80 font-light leading-relaxed">
          &ldquo;{current.body}&rdquo;
        </p>

        <div className="pt-2">
          <Link
            href={current.link}
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs uppercase tracking-widest group"
          >
            Open Associated Module <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface AnalysisItem {
  id: string;
  name: string;
  dataset: string;
  status: "Completed" | "Processing" | "Queued";
  time: string;
  details: string;
}

const INITIAL_ANALYSES: AnalysisItem[] = [
  { id: "1", name: "Galaxy Classification (Morphology)", dataset: "DESI + Hubble", status: "Completed", time: "2h ago", details: "Analyzed 120k galaxy thumbnails with Vision Transformer. 52% Spiral, 28% Elliptical." },
  { id: "2", name: "Redshift Distribution Mapping", dataset: "GAIA DR3", status: "Processing", time: "In Progress", details: "Fitting photometric redshift polynomial curve across 1.8M stellar sources." },
  { id: "3", name: "Object Clustering Detection", dataset: "RUBIN Mock", status: "Completed", time: "1d ago", details: "Identified 18 high-density spatial overdensities at z=0.8 with 3.2-sigma significance." },
  { id: "4", name: "Cosmological Parameter Fit (ΛCDM)", dataset: "Planck Lensing", status: "Queued", time: "Waiting", details: "Monte Carlo Markov Chain (MCMC) sampling for cosmological matter density." },
];

export function RecentAnalyses() {
  const [filter, setFilter] = useState<string>("All");
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisItem | null>(null);

  const filtered = INITIAL_ANALYSES.filter(item => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  return (
    <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-[#263F78]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/20">
        <div>
          <h3 className="text-sm font-medium text-white tracking-wide">Recent Analyses</h3>
          <p className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">Your recent computational jobs</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter chips */}
          <div className="flex bg-[#0D1C42] border border-[#263F78]/40 rounded-lg p-0.5 text-[10px]">
            {["All", "Completed", "Processing", "Queued"].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2 py-1 rounded transition-colors ${filter === s ? "bg-[#263F78] text-white" : "text-primary/60 hover:text-white"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/research"
            className="text-[10px] uppercase tracking-widest text-primary hover:text-white transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#263F78]/20 text-[10px] uppercase tracking-widest text-primary/40">
              <th className="font-normal px-6 py-4">Analysis Name</th>
              <th className="font-normal px-6 py-4">Dataset</th>
              <th className="font-normal px-6 py-4">Status</th>
              <th className="font-normal px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#263F78]/10 hover:bg-[#263F78]/10 transition-colors group cursor-pointer"
                onClick={() => setSelectedAnalysis(item)}
              >
                <td className="px-6 py-4 text-white font-light flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-background/50 border border-[#263F78]/30 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
                    <Activity size={14} className="text-primary/60" />
                  </div>
                  <div>
                    <div className="text-white font-normal">{item.name}</div>
                    <div className="text-[10px] text-primary/40">{item.time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-primary/60 font-light text-xs">{item.dataset}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest border ${item.status === 'Completed' ? 'border-green-500/20 text-green-400 bg-green-500/5' :
                      item.status === 'Processing' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                        'border-[#263F78] text-primary/60 bg-background/50'
                    }`}>
                    {item.status === 'Completed' && <CheckCircle2 size={10} />}
                    {item.status === 'Processing' && <Activity size={10} className="animate-pulse" />}
                    {item.status === 'Queued' && <Clock size={10} />}
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedAnalysis(item); }}
                    className="text-[10px] uppercase tracking-widest text-primary hover:text-white transition-colors"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analysis Details Modal */}
      <AnimatePresence>
        {selectedAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D1C42] border border-[#263F78] rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="absolute top-4 right-4 text-primary/50 hover:text-white p-1"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${selectedAnalysis.status === 'Completed' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                    selectedAnalysis.status === 'Processing' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                      'border-[#263F78] text-primary/60'
                  }`}>
                  {selectedAnalysis.status}
                </span>
                <span className="text-xs text-primary/40">• {selectedAnalysis.time}</span>
              </div>

              <h3 className="text-lg font-medium text-white mb-1">{selectedAnalysis.name}</h3>
              <p className="text-xs text-primary/60 font-mono mb-4">Dataset: {selectedAnalysis.dataset}</p>

              <div className="bg-[#010736] border border-[#263F78]/30 rounded-xl p-4 text-xs text-primary/80 leading-relaxed mb-6">
                {selectedAnalysis.details}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/dashboard/ai-analysis"
                  className="flex-1 py-2 rounded-lg bg-primary text-background font-medium text-xs uppercase tracking-widest text-center hover:bg-white transition-colors"
                >
                  Open in AI Studio
                </Link>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="px-4 py-2 rounded-lg border border-[#263F78] text-xs text-primary hover:bg-[#263F78]/30 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
