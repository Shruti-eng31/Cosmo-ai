"use client";

import { BookOpen, FileText, ExternalLink, Code2, Database, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  const sections = [
    {
      title: "Observational Datasets API",
      icon: <Database className="w-5 h-5 text-primary" />,
      desc: "Query syntax, FITS file ingestion, coordinates transformations (ICRS to Galactic), and query rate limits for DESI DR1, GAIA DR3, and ISRO catalogues.",
      tags: ["SQL", "FITS", "Astrometry"]
    },
    {
      title: "Deep Learning Model Zoo",
      icon: <BrainCircuit className="w-5 h-5 text-primary" />,
      desc: "Architecture documentation for ResNet-1D redshift regressors, morphological Vision Transformers (ViT-B/16), and autoencoders for anomaly detection.",
      tags: ["PyTorch", "HuggingFace", "Inference"]
    },
    {
      title: "N-Body Hydrodynamics Engine",
      icon: <Code2 className="w-5 h-5 text-primary" />,
      desc: "Numerical integration schemes, adaptive mesh refinement (AMR), and cosmological initial conditions generators (CAMB / CLASS).",
      tags: ["CLASS", "ΛCDM", "Simulations"]
    },
    {
      title: "REST & WebSocket Endpoints",
      icon: <FileText className="w-5 h-5 text-primary" />,
      desc: "Realtime streaming API documentation for live telemetry, batch compute job submission, and cosmological cross-correlation results.",
      tags: ["API", "WebSockets", "JSON"]
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-12 space-y-8">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Platform Documentation</h2>
        <p className="text-xs text-primary/60 font-light">
          Technical specifications, cosmological APIs, data schemas, and mathematical foundations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, i) => (
          <div key={i} className="bg-card border border-[#263F78]/30 rounded-xl p-6 flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#263F78]/20 flex items-center justify-center">
                  {sec.icon}
                </div>
                <h3 className="text-lg font-medium text-white">{sec.title}</h3>
              </div>
              <p className="text-xs text-primary/70 font-light leading-relaxed mb-6">
                {sec.desc}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#263F78]/20">
              <div className="flex gap-2">
                {sec.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-[#263F78]/20 text-[10px] text-primary/70 font-mono">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/dashboard/explorer" className="text-xs text-primary hover:underline flex items-center gap-1">
                Explore Guide <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
