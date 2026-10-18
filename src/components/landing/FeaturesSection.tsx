"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Database, Brain, Telescope } from "lucide-react";

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  const features = [
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: "01 — ANALYZE",
      subtitle: "AI Data Scientist",
      description: "Automatically explore astronomical datasets. Clean data, calculate statistics, detect correlations, and identify complex patterns in raw telescope data.",
      tags: ["DESI", "GAIA", "RUBIN"]
    },
    {
      icon: <Telescope className="w-8 h-8 text-primary" />,
      title: "02 — DISCOVER",
      subtitle: "Astronomical Vision AI",
      description: "Deep learning and Vision Transformers designed for astronomical image analysis. Identify anomalies, classify galaxies, and detect unusual cosmic objects.",
      tags: ["PyTorch", "Transformers", "CNNs"]
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "03 — ASK",
      subtitle: "COSMO AI Assistant",
      description: "Natural-language cosmology research powered by LLM and RAG. Query massive databases of scientific literature and datasets simply by asking.",
      tags: ["LLM", "RAG", "Vector DB"]
    }
  ];

  return (
    <section ref={containerRef} className="py-32 relative bg-background border-t border-accent/20">

      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-light text-primary mb-6"
          >
            One Platform. <br />
            <span className="font-medium text-white">Multiple Intelligence Layers.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary/60 text-lg font-light"
          >
            From raw observational data to scientific discovery through advanced artificial intelligence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              style={{ y: i % 2 === 0 ? y1 : y2 }}
              className="bg-card border border-border p-8 rounded-2xl flex flex-col hover:border-accent transition-colors duration-500 group relative"
            >
              <div className="mb-6 p-4 rounded-xl inline-block border border-border group-hover:border-accent transition-colors duration-500 self-start text-primary/80">
                {feature.icon}
              </div>

              <div className="mb-1 text-xs tracking-widest text-primary/60 uppercase font-mono">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl tracking-wider text-primary mb-1 uppercase font-medium">
                {feature.title.split(" — ")[1]}
              </h3>
              <h4 className="text-lg text-white font-light mb-6">
                {feature.subtitle}
              </h4>

              <p className="text-primary/70 font-light leading-relaxed mb-8 text-sm flex-grow">
                {feature.description}
              </p>

              <div className="space-y-3 mb-8 pt-6 border-t border-border">
                {feature.tags.map((tag, j) => (
                  <div key={j} className="flex items-start gap-3 text-xs text-primary/70">
                    <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto self-end w-8 h-8 rounded-full border border-border flex items-center justify-center text-primary group-hover:bg-accent/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
