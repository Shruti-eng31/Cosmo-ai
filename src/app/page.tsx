"use client";

import { useState } from "react";
import GrandWelcome from "@/components/welcome/GrandWelcome";
import Navbar from "@/components/navigation/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AskCosmoSection from "@/components/landing/AskCosmoSection";
import DataExplorerSection from "@/components/landing/DataExplorerSection";
import ImageAnalysisSection from "@/components/landing/ImageAnalysisSection";
import ExploreSection from "@/components/landing/ExploreSection";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <main className="min-h-screen bg-background selection:bg-accent selection:text-primary overflow-x-hidden">
      {!hasEntered ? (
        <GrandWelcome onEnter={() => setHasEntered(true)} />
      ) : (
        <>
          <Navbar />
          <HeroSection />
          <FeaturesSection />
          <AskCosmoSection />
          <ImageAnalysisSection />
          <ExploreSection />
          
          {/* Footer */}
          <footer className="bg-[#010521] border-t border-accent/20 py-12 text-center text-primary/40 font-light text-sm">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="COSMO AI Logo" className="w-6 h-6 object-cover rounded-full" />
                COSMO AI Platform
              </div>
              <div className="text-primary/60">
                Designed by Shruti SIngh
              </div>
              <div>
                © {new Date().getFullYear()} COSMO AI. Research Grade Intelligence.
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
