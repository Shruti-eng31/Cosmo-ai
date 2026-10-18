"use client";

import { motion } from "framer-motion";
import { Maximize2, Minus, Plus } from "lucide-react";

export default function ExploreSection() {
  return (
    <section className="py-32 relative bg-background border-t border-border">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="mb-12">
          <h2 className="text-3xl font-light text-white mb-2">
            Explore the <span className="text-primary font-medium">Universe</span>
          </h2>
          <p className="text-primary/60 text-sm font-light">
            Interact with 3D cosmic environments and explore celestial objects.
          </p>
        </div>

        <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl aspect-[21/9] flex items-center justify-center">
          
          {/* Background image simulating 3D interactive view */}
          <img 
            src="/images/gaia.jpg" 
            alt="Deep Space" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70 scale-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

          {/* Fake 3D interactive controls */}
          <div className="absolute left-6 top-6 flex flex-col gap-2">
            <button className="w-8 h-8 rounded bg-background/50 border border-border flex items-center justify-center text-white hover:bg-border/50">
              <Plus className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded bg-background/50 border border-border flex items-center justify-center text-white hover:bg-border/50">
              <Minus className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded bg-background/50 border border-border flex items-center justify-center text-white hover:bg-border/50 mt-2">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Object Marker */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-[40%] left-[55%] w-4 h-4 rounded-full border border-primary/50 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary)]" />
          </motion.div>

          {/* Info Panel Overlay */}
          <div className="absolute right-6 top-6 bottom-6 w-72 bg-card/80 backdrop-blur-md border border-border rounded-xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img src="/images/jwst.jpg" className="w-12 h-12 rounded-lg object-cover border border-border" alt="Target" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-primary/50">Selected Object</div>
                <div className="text-white font-medium">Spiral Galaxy</div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-y-4 text-xs">
                <div className="text-primary/60">Redshift (z)</div>
                <div className="text-white">0.623</div>
                
                <div className="text-primary/60">Distance</div>
                <div className="text-white">3.8 billion ly</div>
                
                <div className="text-primary/60">Type</div>
                <div className="text-white">Spiral</div>
                
                <div className="text-primary/60">Coordinates</div>
                <div className="text-primary/80">RA: 189.23°<br/>DEC: 62.11°</div>
              </div>
            </div>
            
            <button className="w-full py-2 bg-transparent border border-border text-primary text-xs uppercase tracking-widest hover:bg-border/50 transition-colors rounded-full">
              View Details
            </button>
          </div>

          {/* Legend */}
          <div className="absolute left-6 bottom-6 flex items-center gap-6 text-xs text-primary/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" /> Galaxies
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" /> Quasars
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" /> Stars
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> Dark Matter
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
