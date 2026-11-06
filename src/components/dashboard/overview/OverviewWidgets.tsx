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
      className="relative overflow-hidden rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:border-[#FFF3CF]/40 p-6 transition-all duration-300 block cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.36)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,243,207,0.08)] group"
    >
      {/* Subtle starlight ambient flare in card corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] group-hover:bg-[#FFF3CF]/10 rounded-full blur-2xl transition-all pointer-events-none" />

      {/* Watermark Icon */}
      <div className="absolute top-2 right-2 p-4 text-[#FFF3CF] opacity-[0.05] group-hover:opacity-20 group-hover:scale-110 transition-all pointer-events-none">
        {icon}
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/[0.1] text-[#FFF3CF] group-hover:bg-[#FFF3CF] group-hover:text-slate-950 transition-colors shadow-sm">
            {icon}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/60 font-medium font-mono">{title}</span>
        </div>
        <ArrowUpRight size={14} className="text-white/40 group-hover:text-[#FFF3CF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>

      <div className="text-3xl font-light text-white mb-2 tracking-wide relative z-10">{value}</div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-300/90 font-mono relative z-10">
        <ArrowUpRight size={12} className="text-emerald-400" /> {trend}
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
    link: "/dashboard/ai-analysis"
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/25 via-slate-900/35 to-black/45 backdrop-blur-xl border border-white/[0.09] p-6 flex flex-col justify-between h-full shadow-[0_8px_32px_rgba(0,0,0,0.36)] group">
      {/* Background galaxy nebula decoration */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-[#FFF3CF]">
          <BrainCircuit size={18} className="animate-pulse text-[#FFF3CF]" />
          <h3 className="text-sm font-medium tracking-wide">AI Research Insights</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInsightIndex((i) => (i + 1) % INSIGHTS.length)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[10px] uppercase tracking-widest text-[#FFF3CF] border border-white/[0.1] transition-all font-mono"
            title="Cycle next insight"
          >
            <RotateCw size={10} /> Next ({insightIndex + 1}/{INSIGHTS.length})
          </button>
        </div>
      </div>

      <div className="relative z-10 space-y-3.5">
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF3CF]/10 text-[#FFF3CF] border border-[#FFF3CF]/25 text-[10px] font-mono uppercase tracking-wider">
          {current.tag}
        </div>
        <h4 className="text-sm font-medium text-white">{current.title}</h4>
        <p className="text-xs text-white/75 font-light leading-relaxed">
          &ldquo;{current.body}&rdquo;
        </p>

        <div className="pt-2">
          <Link
            href={current.link}
            className="inline-flex items-center gap-1.5 text-[#FFF3CF] hover:text-white transition-colors text-xs uppercase tracking-widest group/link font-mono"
          >
            <span>Open Associated Module</span> 
            <ChevronRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
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
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
      <div className="p-5 md:p-6 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
        <div>
          <h3 className="text-sm font-medium text-white tracking-wide">Recent Analyses</h3>
          <p className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/40 mt-1 font-mono">Your recent computational jobs</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter chips */}
          <div className="flex bg-black/35 border border-white/[0.08] rounded-xl p-0.5 text-[10px] font-mono">
            {["All", "Completed", "Processing", "Queued"].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === s ? "bg-white/[0.12] text-white font-medium shadow-sm" : "text-white/50 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/research"
            className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/70 hover:text-[#FFF3CF] transition-colors font-mono"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-widest text-white/40 font-mono">
              <th className="font-normal px-6 py-3.5">Analysis Name</th>
              <th className="font-normal px-6 py-3.5">Dataset</th>
              <th className="font-normal px-6 py-3.5">Status</th>
              <th className="font-normal px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors group cursor-pointer"
                onClick={() => setSelectedAnalysis(item)}
              >
                <td className="px-6 py-3.5 text-white font-light flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-[#FFF3CF]/40 transition-colors">
                    <Activity size={14} className="text-[#FFF3CF]/70" />
                  </div>
                  <div>
                    <div className="text-white font-normal text-xs">{item.name}</div>
                    <div className="text-[10px] text-white/40 font-mono">{item.time}</div>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-[#FFF3CF]/60 font-light text-xs font-mono">{item.dataset}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-[10px] uppercase tracking-widest border font-mono ${
                    item.status === 'Completed' 
                      ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' 
                      : item.status === 'Processing' 
                        ? 'border-sky-500/30 text-sky-300 bg-sky-500/10' 
                        : 'border-white/10 text-white/50 bg-white/[0.03]'
                  }`}>
                    {item.status === 'Completed' && <CheckCircle2 size={10} />}
                    {item.status === 'Processing' && <Activity size={10} className="animate-pulse" />}
                    {item.status === 'Queued' && <Clock size={10} />}
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedAnalysis(item); }}
                    className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/70 hover:text-white transition-colors font-mono"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#060D20]/90 backdrop-blur-2xl border border-white/[0.14] rounded-2xl p-6 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative"
            >
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${
                  selectedAnalysis.status === 'Completed' 
                    ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' 
                    : selectedAnalysis.status === 'Processing' 
                      ? 'border-sky-500/30 text-sky-300 bg-sky-500/10' 
                      : 'border-white/10 text-white/50 bg-white/[0.03]'
                }`}>
                  {selectedAnalysis.status}
                </span>
                <span className="text-xs text-white/40 font-mono">• {selectedAnalysis.time}</span>
              </div>

              <h3 className="text-lg font-medium text-white mb-1">{selectedAnalysis.name}</h3>
              <p className="text-xs text-[#FFF3CF]/60 font-mono mb-4">Dataset: {selectedAnalysis.dataset}</p>

              <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 text-xs text-white/80 leading-relaxed mb-6 font-light">
                {selectedAnalysis.details}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/dashboard/ai-analysis"
                  className="flex-1 py-2.5 rounded-xl bg-[#FFF3CF] text-slate-950 font-medium text-xs uppercase tracking-widest text-center hover:bg-white transition-colors font-mono shadow-md"
                >
                  Open in AI Studio
                </Link>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.12] text-xs text-white/70 hover:bg-white/[0.06] transition-colors font-mono"
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
