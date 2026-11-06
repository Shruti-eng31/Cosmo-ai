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
        <h2 className="text-2xl md:text-3xl font-light text-white mb-1 tracking-wide">Help & Scientific Support</h2>
        <p className="text-xs text-[#FFF3CF]/60 font-light">
          Frequently asked questions, cosmological guides, and direct assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/ask"
          className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:border-[#FFF3CF]/40 p-6 flex flex-col justify-between group transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FFF3CF] mb-4 group-hover:bg-[#FFF3CF] group-hover:text-slate-950 transition-colors shadow-sm">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-base font-medium text-white mb-1 group-hover:text-[#FFF3CF] transition-colors">Ask COSMO Assistant</h3>
            <p className="text-xs text-white/70 font-light leading-relaxed">Ask any research or scientific questions to our AI assistant in realtime.</p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/[0.06] text-xs text-[#FFF3CF] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-mono">
            Open Chat <ArrowRight size={12} />
          </div>
        </Link>

        <Link
          href="/dashboard/docs"
          className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:border-[#FFF3CF]/40 p-6 flex flex-col justify-between group transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FFF3CF] mb-4 group-hover:bg-[#FFF3CF] group-hover:text-slate-950 transition-colors shadow-sm">
              <Terminal size={18} />
            </div>
            <h3 className="text-base font-medium text-white mb-1 group-hover:text-[#FFF3CF] transition-colors">API & Formula Docs</h3>
            <p className="text-xs text-white/70 font-light leading-relaxed">Read the technical documentation, schemas, and equations.</p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/[0.06] text-xs text-[#FFF3CF] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-mono">
            Read Docs <ArrowRight size={12} />
          </div>
        </Link>

        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FFF3CF] mb-4 shadow-sm">
              <LifeBuoy size={18} />
            </div>
            <h3 className="text-base font-medium text-white mb-1">Developer & Lab Support</h3>
            <p className="text-xs text-white/70 font-light leading-relaxed">Contact the cosmology computation laboratory for custom dataset integrations.</p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/[0.06] text-xs text-[#FFF3CF]/70 font-mono">
            shrutisingh@cosmology.lab
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
        <h3 className="text-sm font-medium text-white border-b border-white/[0.08] pb-3 tracking-wide">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/35 border border-white/[0.07] space-y-2 backdrop-blur-md">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-[#FFF3CF] shrink-0" />
                {f.q}
              </h4>
              <p className="text-xs text-white/70 font-light leading-relaxed pl-5">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
