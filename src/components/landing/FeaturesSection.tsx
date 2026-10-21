"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Database, Brain, Telescope, Sparkles, ChevronRight, Activity, Cpu, Layers } from "lucide-react";

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const features = [
    {
      icon: <Database className="w-7 h-7 text-cyan-300" />,
      code: "MODULE 01",
      title: "AI Data Scientist",
      badge: "DESI × GAIA × RUBIN",
      description:
        "Automatically explore multi-terabyte astronomical catalogs. Automated clean-up, cross-matching sky surveys, calculate spatial correlation functions, and detect anomalies across billions of stars.",
      metrics: "1.8B+ celestial objects indexed",
      accent: "from-cyan-500/20 to-transparent",
      border: "border-cyan-500/30 hover:border-cyan-400",
      glow: "group-hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]",
    },
    {
      icon: <Telescope className="w-7 h-7 text-sky-300" />,
      code: "MODULE 02",
      title: "Astronomical Vision AI",
      badge: "VISION TRANSFORMERS & CNNs",
      description:
        "Deep learning vision models fine-tuned for deep-sky imaging. Classify morphological galaxy structures, detect gravitational lensing rings, and extract faint planetary nebulae from telescope noise.",
      metrics: "99.4% galaxy classification accuracy",
      accent: "from-blue-500/20 to-transparent",
      border: "border-blue-500/30 hover:border-blue-400",
      glow: "group-hover:shadow-[0_0_35px_rgba(96,165,250,0.25)]",
    },
    {
      icon: <Brain className="w-7 h-7 text-amber-300" />,
      code: "MODULE 03",
      title: "COSMO RAG Assistant",
      badge: "LLM + VECTOR EMBEDDINGS",
      description:
        "Conversational astrophysics research copilot. Query millions of arXiv papers, NASA ADS abstracts, and mission logs in plain English to uncover citations, mathematical proofs, and cosmic models.",
      metrics: "250,000+ astrophysics papers indexed",
      accent: "from-amber-500/20 to-transparent",
      border: "border-amber-500/30 hover:border-amber-400",
      glow: "group-hover:shadow-[0_0_35px_rgba(251,191,36,0.25)]",
    },
  ];

  return (
    <section id="explore" ref={containerRef} className="py-28 relative bg-[#010414] border-t border-cyan-500/15 overflow-hidden">
      {/* Animated Background Laser Grid Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute top-1/3 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        />
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 11, ease: "linear" }}
          className="absolute top-2/3 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTELLIGENT ASTROPHYSICS PIPELINE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight"
          >
            One Platform. <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400">
              Infinite Scientific Horizons.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-300/80 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            Seamlessly bridging raw petabyte-scale observatory archives with state-of-the-art
            deep learning models and interactive visual telemetry.
          </motion.p>
        </div>

        {/* Dynamic Interactive Feature Cards with Tilt & Glow */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative p-8 rounded-2xl bg-[#03091e]/80 border ${feature.border} backdrop-blur-md transition-all duration-500 overflow-hidden ${feature.glow}`}
            >
              {/* Card top subtle gradient beam */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent}`} />
              
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <span className="text-xs font-mono tracking-widest text-slate-400">{feature.code}</span>
              </div>

              <div className="inline-block px-2.5 py-1 rounded bg-white/5 text-[10px] font-mono tracking-wider text-cyan-300/90 mb-3 border border-white/5">
                {feature.badge}
              </div>

              <h3 className="text-2xl font-light text-white mb-3 group-hover:text-cyan-200 transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-300/75 font-light leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-300/80">
                <span>{feature.metrics}</span>
                <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
