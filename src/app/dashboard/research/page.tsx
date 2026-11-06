"use client";

import { Folder, FileText, BrainCircuit, LineChart as ChartIcon, MoreVertical, Plus, Filter } from "lucide-react";

const researchItems = [
  { title: "Hubble Tension Analysis Notebook", type: "Note", date: "Today, 10:42 AM", icon: <FileText className="w-4 h-4" /> },
  { title: "DESI DR1 + GAIA Cross-match", type: "Dataset", date: "Yesterday", icon: <Folder className="w-4 h-4" /> },
  { title: "Redshift vs Distance Correlation", type: "Analysis", date: "Oct 24, 2026", icon: <ChartIcon className="w-4 h-4" /> },
  { title: "Anomaly Detection in NGC-224-B", type: "AI Run", date: "Oct 22, 2026", icon: <BrainCircuit className="w-4 h-4" /> },
  { title: "Literature Review: Dark Matter Candidates", type: "Note", date: "Oct 20, 2026", icon: <FileText className="w-4 h-4" /> },
  { title: "Simulated ΛCDM Mass Distribution", type: "Simulation", date: "Oct 15, 2026", icon: <Folder className="w-4 h-4" /> },
];

export default function ResearchPage() {
  return (
    <div className="max-w-[1400px] mx-auto pb-12 h-full flex flex-col">

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-1 tracking-wide">Research Workspace</h2>
          <p className="text-xs text-[#FFF3CF]/60 font-light">Organize and manage your cosmological discoveries and notebook experiments.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] rounded-xl text-xs text-[#FFF3CF] transition-colors font-mono backdrop-blur-md">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FFF3CF] text-slate-950 rounded-xl text-xs hover:bg-white transition-colors uppercase tracking-widest font-bold font-mono shadow-md shadow-[#FFF3CF]/15">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchItems.map((item, i) => (
          <div 
            key={i} 
            className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:border-[#FFF3CF]/40 p-6 transition-all duration-300 group cursor-pointer flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FFF3CF] group-hover:bg-[#FFF3CF] group-hover:text-slate-950 transition-colors shadow-sm">
                {item.icon}
              </div>
              <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base text-white font-medium mb-1 line-clamp-2 group-hover:text-[#FFF3CF] transition-colors">{item.title}</h3>

            <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/75 px-2.5 py-1 bg-white/[0.04] rounded-full border border-white/[0.08] font-mono">
                {item.type}
              </span>
              <span className="text-xs text-white/40 font-mono">
                {item.date}
              </span>
            </div>
          </div>
        ))}

        {/* Empty Add State */}
        <div className="rounded-2xl bg-white/[0.015] hover:bg-white/[0.04] border border-white/[0.08] border-dashed p-6 transition-all group cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px] backdrop-blur-md">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 group-hover:text-[#FFF3CF] group-hover:border-[#FFF3CF]/40 transition-colors mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-sm text-white/80 font-medium tracking-wide">Create New Notebook</h3>
        </div>
      </div>

    </div>
  );
}
