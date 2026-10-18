"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";
import Link from "next/link";

export default function DataExplorerSection() {
  const datasets = [
    {
      id: "isro",
      name: "ISRO Missions",
      type: "Launches (Real)",
      objects: "Satellites, Rockets",
      params: "125 Historical Flights",
      image: "/images/isro.jpg",
      badge: "Real Dataset"
    },
    {
      id: "desi",
      name: "DESI",
      type: "Spectroscopic",
      objects: "Galaxies, Quasars",
      params: "Redshift, Spectra",
      image: "/images/desi.jpg",
      badge: "Survey DR1"
    },
    {
      id: "gaia",
      name: "GAIA",
      type: "Astrometric",
      objects: "Stars, Milky Way",
      params: "Parallax, Proper Motion",
      image: "/images/gaia.jpg",
      badge: "DR3 Catalog"
    },
    {
      id: "rubin",
      name: "RUBIN",
      type: "Time-Domain",
      objects: "Transients, Solar System",
      params: "Light Curves, Photometry",
      image: "/images/rubin.jpg",
      badge: "LSST Mock"
    },
    {
      id: "jwst",
      name: "NASA/ESA",
      type: "Archives",
      objects: "Deep Space Objects",
      params: "Multi-wavelength",
      image: "/images/jwst.jpg",
      badge: "JWST / Hubble"
    }
  ];

  return (
    <section className="py-32 relative bg-background border-t border-border overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-primary text-xs uppercase tracking-widest mb-3">
              <Database className="w-3.5 h-3.5" /> Curated Astronomical Repositories
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">
              Cosmological <span className="text-primary font-medium">Data Explorer</span>
            </h2>
            <p className="text-primary/60 text-lg font-light max-w-xl">
              Explore verified astronomical and aerospace launch datasets with high-precision query engines.
            </p>
          </motion.div>

          <Link
            href="/dashboard/explorer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:text-white transition-colors border-b border-primary/40 pb-1"
          >
            View All in Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
          {datasets.map((dataset, i) => (
            <motion.div
              key={dataset.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href="/dashboard/explorer"
                className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer flex flex-col h-full block"
              >
                {/* Image Header with guaranteed local assets */}
                <div className="h-36 w-full overflow-hidden relative bg-[#0D1C42]">
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent z-10" />
                  <img 
                    src={dataset.image} 
                    alt={dataset.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider bg-background/80 backdrop-blur-md text-primary border border-border">
                    {dataset.badge}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow p-5 pt-1">
                  <h3 className="text-lg font-medium text-white mb-3 tracking-wide group-hover:text-primary transition-colors">
                    {dataset.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-xs text-primary/60">
                      <span className="w-16 uppercase tracking-widest text-[9px] text-primary/40">Objects</span>
                      <span className="truncate text-white/90">{dataset.objects}</span>
                    </div>
                    <div className="flex items-center text-xs text-primary/60">
                      <span className="w-16 uppercase tracking-widest text-[9px] text-primary/40">Params</span>
                      <span className="truncate text-primary/80 font-mono text-[11px]">{dataset.params}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between text-[11px] uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors border-t border-border pt-3">
                    <span>Explore Dataset</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
