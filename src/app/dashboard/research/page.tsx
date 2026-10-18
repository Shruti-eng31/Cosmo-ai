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
          <h2 className="text-2xl font-light text-white mb-1">Your Research Workspace</h2>
          <p className="text-xs text-primary/60">Organize and manage your cosmological discoveries.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#263F78]/20 border border-[#263F78]/40 rounded-lg text-xs text-primary/80 hover:bg-[#263F78]/40 transition-colors">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg text-xs hover:bg-white transition-colors uppercase tracking-widest font-medium">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchItems.map((item, i) => (
          <div key={i} className="bg-card border border-[#263F78]/30 rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-pointer flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#263F78]/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                {item.icon}
              </div>
              <button className="p-1 text-primary/40 hover:text-primary transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-lg text-white font-medium mb-1 line-clamp-2">{item.title}</h3>
            
            <div className="flex justify-between items-center mt-auto pt-6">
              <span className="text-[10px] uppercase tracking-widest text-primary/60 px-2 py-1 bg-[#263F78]/20 rounded border border-[#263F78]/30">
                {item.type}
              </span>
              <span className="text-xs text-primary/40 font-mono">
                {item.date}
              </span>
            </div>
          </div>
        ))}

        {/* Empty Add State */}
        <div className="bg-card/30 border border-[#263F78]/30 border-dashed rounded-xl p-6 hover:bg-[#263F78]/10 transition-colors group cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-[#263F78]/20 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-sm text-primary/80 font-medium">Create New</h3>
        </div>
      </div>

    </div>
  );
}
