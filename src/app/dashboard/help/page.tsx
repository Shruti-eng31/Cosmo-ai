"use client";

import { HelpCircle, MessageSquare, Terminal, LifeBuoy, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I query spectroscopic redshift records from DESI?",
      a: "Navigate to Data Explorer, select DESI, and use the filter bar or query by Object ID (e.g., DESI-00042918). You can also run cross-correlations directly in the AI Analysis module."
    },
    {
      q: "Can I inspect real satellite and rocket trajectory data from ISRO?",
      a: "Yes! In the Data Explorer, click on the ISRO Mission Launches dataset. All 125 historical launches (including Chandrayaan-3 and Aditya-L1) are available with launch vehicles, orbits, and mission remarks."
    },
    {
      q: "How does the cosmological simulation calculate the fate of the universe?",
      a: "The simulation evaluates the Friedmann acceleration equation: ä/a = -4πG/3 (ρ + 3p/c²) + Λc²/3. Adjusting Ωm and ΩΛ changes whether gravitational deceleration or dark energy repulsive pressure dominates."
    },
    {
      q: "What vision model is used for astronomical morphology classification?",
      a: "COSMO AI utilizes fine-tuned Vision Transformers (ViT) pre-trained on multi-band Hubble Space Telescope (HST) and James Webb (JWST) FITS observations."
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-12 space-y-8">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Help & Scientific Support</h2>
        <p className="text-xs text-primary/60 font-light">
          Frequently asked questions, cosmological guides, and direct assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/ask"
          className="bg-card border border-[#263F78]/30 hover:border-primary/50 transition-all rounded-xl p-6 flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#263F78]/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-background transition-colors">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-base font-medium text-white mb-1">Ask COSMO Assistant</h3>
            <p className="text-xs text-primary/60 font-light">Ask any research or scientific questions to our AI assistant in realtime.</p>
          </div>
          <div className="pt-4 mt-6 border-t border-[#263F78]/20 text-xs text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Open Chat <ArrowRight size={12} />
          </div>
        </Link>

        <Link
          href="/dashboard/docs"
          className="bg-card border border-[#263F78]/30 hover:border-primary/50 transition-all rounded-xl p-6 flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#263F78]/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-background transition-colors">
              <Terminal size={18} />
            </div>
            <h3 className="text-base font-medium text-white mb-1">API & Formula Docs</h3>
            <p className="text-xs text-primary/60 font-light">Read the technical documentation, schemas, and equations.</p>
          </div>
          <div className="pt-4 mt-6 border-t border-[#263F78]/20 text-xs text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Read Docs <ArrowRight size={12} />
          </div>
        </Link>

        <div className="bg-card border border-[#263F78]/30 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#263F78]/20 flex items-center justify-center text-primary mb-4">
              <LifeBuoy size={18} />
            </div>
            <h3 className="text-base font-medium text-white mb-1">Developer & Lab Support</h3>
            <p className="text-xs text-primary/60 font-light">Contact the cosmology computation laboratory for custom dataset integrations.</p>
          </div>
          <div className="pt-4 mt-6 border-t border-[#263F78]/20 text-xs text-primary/60 font-mono">
            shrutisingh@cosmology.lab
          </div>
        </div>
      </div>

      <div className="bg-card border border-[#263F78]/30 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-medium text-white border-b border-[#263F78]/30 pb-3">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-4 rounded-lg bg-[#0D1C42]/40 border border-[#263F78]/20 space-y-2">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-primary shrink-0" />
                {f.q}
              </h4>
              <p className="text-xs text-primary/70 font-light leading-relaxed pl-5">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
