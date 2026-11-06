"use client";

import { BookOpen, FileText, ExternalLink, Code2, Database, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  const sections = [
    {
      title: "Observational Datasets API",
      icon: <Database className="w-5 h-5 text-[#FFF3CF]" />,
      desc: "Query syntax, FITS file ingestion, coordinates transformations (ICRS to Galactic), and query rate limits for DESI DR1, GAIA DR3, and ISRO catalogues.",
      tags: ["SQL", "FITS", "Astrometry"]
    },
    {
      title: "Deep Learning Model Zoo",
      icon: <BrainCircuit className="w-5 h-5 text-[#FFF3CF]" />,
      desc: "Architecture documentation for ResNet-1D redshift regressors, morphological Vision Transformers (ViT-B/16), and autoencoders for anomaly detection.",
      tags: ["PyTorch", "HuggingFace", "Inference"]
    },
    {
      title: "N-Body Hydrodynamics Engine",
      icon: <Code2 className="w-5 h-5 text-[#FFF3CF]" />,
      desc: "Numerical integration schemes, adaptive mesh refinement (AMR), and cosmological initial conditions generators (CAMB / CLASS).",
      tags: ["CLASS", "ΛCDM", "Simulations"]
    },
    {
      title: "REST & WebSocket Endpoints",
      icon: <FileText className="w-5 h-5 text-[#FFF3CF]" />,
      desc: "Realtime streaming API documentation for live telemetry, batch compute job submission, and cosmological cross-correlation results.",
      tags: ["API", "WebSockets", "JSON"]
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-12 space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-white mb-1 tracking-wide">Platform Documentation</h2>
        <p className="text-xs text-[#FFF3CF]/60 font-light">
          Technical specifications, cosmological APIs, data schemas, and mathematical foundations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, i) => (
          <div 
            key={i} 
            className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:border-[#FFF3CF]/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] group cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#FFF3CF] group-hover:text-slate-950 transition-colors shadow-sm">
                  {sec.icon}
                </div>
                <h3 className="text-base font-medium text-white group-hover:text-[#FFF3CF] transition-colors">{sec.title}</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
                {sec.desc}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="flex gap-2">
                {sec.tags.map(t => (
                  <span key={t} className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#FFF3CF]/80 border border-white/[0.08]">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#FFF3CF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-mono">
                Read Spec <ExternalLink size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
