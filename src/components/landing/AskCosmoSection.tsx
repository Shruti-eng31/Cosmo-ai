"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles, ChevronRight, FileText, Database } from "lucide-react";

export default function AskCosmoSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { text: "Understanding natural language query...", icon: <Sparkles className="w-4 h-4" /> },
    { text: "Searching astrophysical literature (RAG)...", icon: <FileText className="w-4 h-4" /> },
    { text: "Querying DESI redshift dataset...", icon: <Database className="w-4 h-4" /> },
    { text: "Generating correlation response...", icon: <Loader2 className="w-4 h-4 animate-spin" /> },
    { text: "Analysis complete.", icon: <Sparkles className="w-4 h-4 text-primary" /> }
  ];

  return (
    <section className="py-32 relative bg-background">
      <div className="container mx-auto px-6 relative z-10">

        <div className="mb-12">
          <h2 className="text-3xl font-light text-white mb-2">
            Ask the <span className="text-primary font-medium">Cosmos</span>
          </h2>
          <p className="text-primary/60 text-sm font-light">
            Ask questions, get scientific answers with sources, data and visualizations.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">

          {/* User Query Area */}
          <div className="flex justify-end p-6 border-b border-border bg-card-hover/30">
            <div className="bg-border text-white px-6 py-3 rounded-full rounded-tr-sm text-sm font-light">
              Show me how galaxy redshift changes with distance.
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-2 gap-12">

            {/* Left: AI Process & Summary */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-primary">
                <Atom className="w-6 h-6" />
                <span className="font-medium tracking-wide">COSMO AI</span>
              </div>

              <div className="space-y-3">
                {steps.map((s, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: step >= i ? 1 : 0, x: step >= i ? 0 : -10 }}
                    key={i}
                    className={`flex items-center gap-3 text-sm ${i === step && step !== 4 ? "text-primary" : "text-primary/60"}`}
                  >
                    {step > i || step === 4 ? (
                      <div className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-current opacity-50 shrink-0" />
                    )}
                    {s.text}
                  </motion.div>
                ))}
              </div>

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-6 border-t border-border"
                >
                  <p className="text-sm text-primary/80 font-light leading-relaxed mb-4">
                    The graph shows that redshift increases with distance, which is consistent with the expanding universe. This follows Hubble's Law (<span className="italic">v = H₀d</span>).
                  </p>

                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-primary/40 block mb-2">Sources:</span>
                    <ol className="text-xs text-primary/60 space-y-1 list-decimal list-inside">
                      <li>DESI DR1 (data)</li>
                      <li>Astropy (analysis)</li>
                      <li>NASA/ESA (reference)</li>
                    </ol>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Graph */}
            <div className="border border-border rounded-xl bg-background/50 p-6 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,43,107,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,43,107,0.1)_1px,transparent_1px)] bg-[size:1rem_1rem]" />

              <h3 className="text-sm text-white font-medium mb-8 relative z-10 text-center">Redshift vs Distance</h3>

              <div className="flex-1 relative z-10">
                {/* Y Axis Label */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-primary/40 uppercase tracking-widest">
                  Redshift (z)
                </div>

                {/* Y Axis ticks */}
                <div className="absolute left-4 top-0 bottom-8 flex flex-col justify-between text-[10px] text-primary/40 text-right pr-2 border-r border-border h-full">
                  <span>2.0</span>
                  <span>1.5</span>
                  <span>1.0</span>
                  <span>0.5</span>
                  <span>0.0</span>
                </div>

                {/* Data Plot (Scatter simulation) */}
                <div className="absolute left-10 right-4 top-0 bottom-8">
                  {step === 4 && Array.from({ length: 60 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
                      style={{
                        left: `${(i / 60) * 100}%`,
                        bottom: `${(i / 60) * 100 + (Math.random() * 20 - 10)}%`,
                        boxShadow: "0 0 4px rgba(96,165,250,0.5)"
                      }}
                    />
                  ))}
                  {/* Line of best fit */}
                  {step === 4 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 1 }}
                      className="absolute left-0 bottom-[10%] h-[2px] bg-primary/50 shadow-[0_0_8px_var(--color-primary)] origin-bottom-left"
                      style={{ rotate: "-38deg" }}
                    />
                  )}
                </div>

                {/* X Axis */}
                <div className="absolute left-10 right-4 bottom-8 border-t border-border flex justify-between pt-2 text-[10px] text-primary/40">
                  <span>0</span>
                  <span>2,000</span>
                  <span>4,000</span>
                  <span>6,000</span>
                  <span>8,000</span>
                  <span>10,000</span>
                </div>

                {/* X Axis Label */}
                <div className="absolute left-0 right-0 bottom-0 text-center text-[10px] text-primary/40 uppercase tracking-widest pt-2">
                  Distance (Mpc)
                </div>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card-hover/20">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask a follow-up question..."
                className="w-full bg-transparent border-none py-2 px-4 text-sm text-white placeholder:text-primary/30 outline-none font-light"
                disabled
              />
              <button className="w-8 h-8 bg-border rounded-full flex items-center justify-center text-primary">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Atom(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </svg>
  )
}
