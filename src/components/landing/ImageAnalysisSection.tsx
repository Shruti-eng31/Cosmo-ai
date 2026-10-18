"use client";

import { motion } from "framer-motion";
import { Scan, Eye, Activity } from "lucide-react";

export default function ImageAnalysisSection() {
  return (
    <section className="py-32 relative bg-background border-t border-border">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-2">
            See the Universe <br />
            <span className="text-primary font-medium">Through AI</span>
          </h2>
          <p className="text-primary/60 text-sm font-light">
            Analyze astronomical images with deep learning and Vision Transformers.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Image Area */}
          <div className="lg:col-span-2 relative aspect-[16/10] bg-card border border-border rounded-xl overflow-hidden group">
            {/* Realistic astronomical image background */}
            <img 
              src="/images/desi.jpg" 
              alt="Space" 
              className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen"
            />

            {/* Scanner Animation */}
            <motion.div 
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[2px] bg-primary/70 shadow-[0_0_15px_var(--color-primary)] z-20"
            />

            {/* Bounding Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[1.5px] border-primary/80 z-20 flex items-start justify-end p-2 bg-primary/5"
            >
              <div className="bg-background text-primary text-[10px] font-mono px-2 py-1 tracking-wider uppercase border border-border">
                NGC-224-B
              </div>
            </motion.div>
          </div>

          {/* Analysis Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col gap-6 bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                <Scan className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-primary/50 block">Object Detected</div>
                <div className="text-sm text-white font-medium">Galaxy</div>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-primary/60">Classification</div>
                <div className="text-white">Spiral Galaxy</div>
                
                <div className="text-primary/60">Confidence</div>
                <div className="text-white">94.7%</div>
                
                <div className="text-primary/60">Redshift (z)</div>
                <div className="text-white">0.623</div>
                
                <div className="text-primary/60">Coordinates</div>
                <div className="text-primary/80">RA: 189.23° DEC: 62.11°</div>
                
                <div className="text-primary/60">Distance</div>
                <div className="text-white">~ 3.8 billion light years</div>
                
                <div className="text-primary/60">Anomaly Score</div>
                <div className="text-white">Low</div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-transparent border border-border text-primary text-xs uppercase tracking-widest hover:bg-border/50 transition-colors mt-auto rounded-full">
              View Details
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
