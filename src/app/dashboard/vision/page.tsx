"use client";

import { useState } from "react";
import { 
  Upload, 
  Scan, 
  Maximize, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Crosshair, 
  Eye, 
  CheckCircle2, 
  FileText,
  Activity,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CelestialTarget {
  id: string;
  name: string;
  image: string;
  survey: string;
  targetName: string;
  classification: string;
  morphology: string;
  confidence: string;
  redshift: string;
  distance: string;
  coordinates: string;
  sersicIndex: string;
  stellarMass: string;
  colorHex: string;
  detectedFeatures: {
    label: string;
    top: string;
    left: string;
    width: string;
    height: string;
    type: string;
    confidence: string;
  }[];
  spectralBands: { band: string; flux: string; snr: string }[];
  aiNotes: string;
}

const CELESTIAL_SAMPLES: CelestialTarget[] = [
  {
    id: "jwst-smacs",
    name: "JWST Deep Field (SMACS 0723)",
    image: "/images/jwst.jpg",
    survey: "James Webb Space Telescope / NIRCam",
    targetName: "SMACS J0723.3-7327 Cluster",
    classification: "Gravitational Lensing Arc & High-z Galaxy",
    morphology: "Strong Gravitational Lens / Distorted Spiral",
    confidence: "98.7%",
    redshift: "z = 7.31 ± 0.04",
    distance: "~ 13.1 Billion light-years",
    coordinates: "RA: 07h 23m 19.5s | Dec: -73° 27′ 15″",
    sersicIndex: "n = 3.82 (Bulge Dominated)",
    stellarMass: "4.8 × 10¹¹ M☉",
    colorHex: "#38bdf8",
    detectedFeatures: [
      { label: "Lensed Arc Alpha", top: "38%", left: "44%", width: "16%", height: "16%", type: "Lensing Core", confidence: "99.1%" },
      { label: "Background High-z Emitter", top: "25%", left: "28%", width: "12%", height: "12%", type: "Early Galaxy", confidence: "94.6%" },
      { label: "Cluster Member Elliptical", top: "54%", left: "62%", width: "15%", height: "15%", type: "Brightest Cluster Gal", confidence: "97.3%" },
    ],
    spectralBands: [
      { band: "F090W", flux: "1.42 µJy", snr: "28.4" },
      { band: "F150W", flux: "3.85 µJy", snr: "54.1" },
      { band: "F200W", flux: "5.19 µJy", snr: "71.9" },
      { band: "F444W", flux: "8.64 µJy", snr: "88.2" },
    ],
    aiNotes: "Strong relativistic light bending detected around cluster core. Extreme redshifted Lyman-break features confirm early epoch formation (< 700 Myr post-Big Bang).",
  },
  {
    id: "desi-spectro",
    name: "DESI Spectroscopic Survey",
    image: "/images/desi.jpg",
    survey: "Dark Energy Spectroscopic Instrument (Mayall 4m)",
    targetName: "DESI J1429+3538",
    classification: "Emission-Line Galaxy (ELG) / BAO Tracer",
    morphology: "Clumpy Star-Forming Disc",
    confidence: "96.4%",
    redshift: "z = 1.15 ± 0.01",
    distance: "~ 8.5 Billion light-years",
    coordinates: "RA: 14h 29m 41.2s | Dec: +35° 38′ 09″",
    sersicIndex: "n = 1.24 (Exponential Disc)",
    stellarMass: "8.2 × 10¹⁰ M☉",
    colorHex: "#818cf8",
    detectedFeatures: [
      { label: "OIII Doublet Core", top: "42%", left: "36%", width: "18%", height: "18%", type: "Active Starburst", confidence: "97.8%" },
      { label: "Tidal Disruption Tail", top: "58%", left: "50%", width: "14%", height: "14%", type: "Merger Stream", confidence: "91.2%" },
    ],
    spectralBands: [
      { band: "B-band (400nm)", flux: "2.11 µJy", snr: "34.0" },
      { band: "R-band (650nm)", flux: "4.73 µJy", snr: "62.5" },
      { band: "Z-band (900nm)", flux: "6.82 µJy", snr: "74.8" },
    ],
    aiNotes: "Characteristic [O II] λ3727Å doublet verified. Used as an active cosmic cosmological tracer for Baryon Acoustic Oscillation (BAO) scale measurement.",
  },
  {
    id: "gaia-dr3",
    name: "GAIA DR3 Stellar Kinematics",
    image: "/images/gaia.jpg",
    survey: "European Space Agency Gaia Space Telescope",
    targetName: "Gaia DR3 4053829104",
    classification: "Milky Way Thick Disk Kinematic Stream",
    morphology: "Stellar Association / Kinematic Moving Group",
    confidence: "99.4%",
    redshift: "z = 0.000000 (Galactic Source)",
    distance: "~ 1,420 light-years (Parallax 2.30 mas)",
    coordinates: "RA: 19h 44m 58.1s | Dec: +27° 18′ 05″",
    sersicIndex: "Point Spread Function (PSF)",
    stellarMass: "1.15 M☉ (Solar Analogue)",
    colorHex: "#f59e0b",
    detectedFeatures: [
      { label: "Target Gaia Source", top: "45%", left: "48%", width: "14%", height: "14%", type: "Astrometric Center", confidence: "99.8%" },
      { label: "Companion Dwarf (Binary)", top: "32%", left: "55%", width: "10%", height: "10%", type: "M-Dwarf Companion", confidence: "93.4%" },
    ],
    spectralBands: [
      { band: "G-mag", flux: "12.4 mag", snr: "240.0" },
      { band: "BP-mag", flux: "13.1 mag", snr: "185.2" },
      { band: "RP-mag", flux: "11.6 mag", snr: "210.6" },
    ],
    aiNotes: "Proper motion vector: pmRA = -4.12 mas/yr, pmDec = -18.7 mas/yr. Radial velocity confirms membership in Gaia-Enceladus merger remnants.",
  },
  {
    id: "rubin-lsst",
    name: "Rubin Observatory Transient",
    image: "/images/rubin.jpg",
    survey: "Vera C. Rubin Observatory / Legacy Survey of Space and Time",
    targetName: "LSST-TNS-2024akq",
    classification: "Type Ia Supernova / Standard Candle",
    morphology: "Point Transient in Host Spiral Outskirts",
    confidence: "95.2%",
    redshift: "z = 0.284",
    distance: "~ 3.4 Billion light-years",
    coordinates: "RA: 03h 32m 38.8s | Dec: -27° 48′ 21″",
    sersicIndex: "Transient Point Source",
    stellarMass: "Progenitor ~ 1.4 M☉ (Chandrasekhar Limit)",
    colorHex: "#ec4899",
    detectedFeatures: [
      { label: "Supernova Transient", top: "35%", left: "40%", width: "15%", height: "15%", type: "Optical Transient", confidence: "98.2%" },
      { label: "Host Galaxy Core", top: "50%", left: "52%", width: "20%", height: "20%", type: "Host Spiral", confidence: "96.5%" },
    ],
    spectralBands: [
      { band: "u-band", flux: "18.4 mag", snr: "22.1" },
      { band: "g-band", flux: "16.8 mag", snr: "78.4" },
      { band: "r-band", flux: "16.2 mag", snr: "94.0" },
      { band: "i-band", flux: "16.5 mag", snr: "88.1" },
    ],
    aiNotes: "Rapid 15-day rise time with standard Si II 6355Å absorption trough. Peak absolute magnitude fits Phillips relation for precision dark energy cosmic expansion.",
  },
];

export default function VisionAnalysisPage() {
  const [selectedTarget, setSelectedTarget] = useState<CelestialTarget>(CELESTIAL_SAMPLES[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(true);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(0);
  const [showGrid, setShowGrid] = useState(true);

  const handleSelectSample = (sample: CelestialTarget) => {
    setSelectedTarget(sample);
    setActiveFeatureIndex(0);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 700);
  };

  const handleReanalyze = () => {
    setAnalyzing(true);
    setResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col xl:flex-row gap-6">
      
      {/* Left Imaging Workspace */}
      <div className="flex-1 bg-[#03091e]/80 border border-[#263F78]/40 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
        
        {/* Workspace Toolbar */}
        <div className="p-4 border-b border-[#263F78]/30 bg-background/30 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mr-1">
              Surveys:
            </span>
            {CELESTIAL_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedTarget.id === sample.id
                    ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "bg-[#071333] border-[#263F78]/50 text-slate-400 hover:text-white hover:border-[#263F78]"
                }`}
              >
                <Eye className="w-3 h-3" /> {sample.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                showGrid 
                  ? "bg-sky-500/10 border-sky-400/40 text-sky-300" 
                  : "bg-transparent border-[#263F78]/40 text-slate-400"
              }`}
              title="Toggle Astrometric Grid"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleReanalyze}
              disabled={analyzing}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 font-semibold rounded-lg text-xs tracking-wider uppercase flex items-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Scan className="w-3.5 h-3.5" /> Scan Target
            </button>
          </div>
        </div>

        {/* Optical Canvas */}
        <div className="flex-1 relative bg-black min-h-[460px] flex items-center justify-center overflow-hidden select-none">
          
          {/* Main Astronomical Image */}
          <img 
            src={selectedTarget.image} 
            alt={selectedTarget.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-90"
          />

          {/* Astrometric Reticle / Grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,rgba(56,189,248,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.25)_1px,transparent_1px)] bg-[size:4rem_4rem]">
              <div className="absolute inset-x-0 top-1/2 border-t border-sky-400/30" />
              <div className="absolute inset-y-0 left-1/2 border-l border-sky-400/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-sky-400/20" />
            </div>
          )}

          {/* Scanning Beam Animation */}
          <AnimatePresence>
            {analyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-sky-950/20 backdrop-blur-[1px] z-30"
              >
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                  className="absolute left-0 w-full h-0.5 bg-sky-400 shadow-[0_0_25px_#38bdf8] z-30"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Real AI Feature Bounding Boxes */}
          {result && !analyzing && selectedTarget.detectedFeatures.map((feat, idx) => {
            const isSelected = activeFeatureIndex === idx;
            return (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setActiveFeatureIndex(idx)}
                style={{
                  top: feat.top,
                  left: feat.left,
                  width: feat.width,
                  height: feat.height,
                }}
                className={`absolute z-20 border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-sky-400 bg-sky-400/15 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
                    : "border-sky-400/40 bg-sky-400/5 hover:border-sky-400/80"
                }`}
              >
                {/* Corner reticles */}
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

                {/* Tag label */}
                <div className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap border shadow-sm ${
                  isSelected
                    ? "bg-sky-400 text-slate-950 font-bold border-sky-300"
                    : "bg-[#03091e]/90 text-sky-300 border-[#263F78]"
                }`}>
                  {feat.label} • {feat.confidence}
                </div>
              </motion.div>
            );
          })}

          {/* Coordinate Overlay */}
          <div className="absolute bottom-3 left-3 bg-[#03091e]/80 border border-[#263F78]/50 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-300 z-10 backdrop-blur-md">
            FOV: 2.4′ × 2.4′ | {selectedTarget.coordinates}
          </div>

          <div className="absolute top-3 right-3 bg-[#03091e]/80 border border-sky-400/30 rounded-lg px-2.5 py-1 text-[10px] font-mono text-sky-400 z-10 backdrop-blur-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {selectedTarget.survey.split("/")[0]}
          </div>

        </div>

      </div>

      {/* Right Real Analysis Inspector */}
      <div className="w-full xl:w-[420px] flex flex-col gap-5 shrink-0">
        
        {/* Detection Card */}
        <div className="bg-[#03091e]/80 border border-[#263F78]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-[#263F78]/30 pb-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shrink-0">
              <Scan className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                Vision Transformer Output
              </span>
              <h3 className="text-base font-semibold text-white leading-tight">
                {selectedTarget.targetName}
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-[#263F78]/20">
              <span className="text-slate-400">Classification</span>
              <span className="text-sky-300 font-medium px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-right">
                {selectedTarget.classification}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#263F78]/20">
              <span className="text-slate-400">Confidence Score</span>
              <span className="text-emerald-400 font-mono font-bold">{selectedTarget.confidence}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#263F78]/20">
              <span className="text-slate-400">Cosmological Redshift</span>
              <span className="text-white font-mono">{selectedTarget.redshift}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#263F78]/20">
              <span className="text-slate-400">Light Travel Distance</span>
              <span className="text-slate-200">{selectedTarget.distance}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#263F78]/20">
              <span className="text-slate-400">Morphological Profile</span>
              <span className="text-slate-200">{selectedTarget.sersicIndex}</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Estimated Stellar Mass</span>
              <span className="text-amber-400 font-mono">{selectedTarget.stellarMass}</span>
            </div>
          </div>
        </div>

        {/* Feature Sub-Regions Inspector */}
        <div className="bg-[#03091e]/80 border border-[#263F78]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center justify-between">
            <span>Segmented Coordinates</span>
            <span className="text-[10px] text-sky-400 font-mono">{selectedTarget.detectedFeatures.length} ROIs</span>
          </h4>

          <div className="space-y-2">
            {selectedTarget.detectedFeatures.map((feat, i) => {
              const active = activeFeatureIndex === i;
              return (
                <div
                  key={feat.label}
                  onClick={() => setActiveFeatureIndex(i)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    active
                      ? "bg-sky-500/15 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                      : "bg-[#071333]/50 border-[#263F78]/30 text-slate-400 hover:text-white hover:border-[#263F78]"
                  }`}
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${active ? "bg-sky-400" : "bg-slate-500"}`} />
                      {feat.label}
                    </span>
                    <span className="font-mono text-[10px] text-sky-400">{feat.confidence}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                    <span>Feature: {feat.type}</span>
                    <span className="font-mono">T:{feat.top} L:{feat.left}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photometric & Spectral Readout */}
        <div className="bg-[#03091e]/80 border border-[#263F78]/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center justify-between">
            <span>Photometric Band Flux</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </h4>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {selectedTarget.spectralBands.map((band) => (
              <div key={band.band} className="p-2 rounded-lg bg-[#071333]/60 border border-[#263F78]/30 text-xs">
                <div className="text-[10px] text-slate-400 uppercase font-mono">{band.band}</div>
                <div className="font-mono text-white text-sm mt-0.5">{band.flux}</div>
                <div className="text-[9px] text-emerald-400">SNR: {band.snr}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-400/20 text-xs text-slate-300 leading-relaxed font-light">
            <span className="font-semibold text-sky-300 block mb-1">Astro-Inference:</span>
            {selectedTarget.aiNotes}
          </div>
        </div>

      </div>

    </div>
  );
}
