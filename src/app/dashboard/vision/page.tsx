"use client";

import { useState, useRef, useEffect } from "react";
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
  Compass,
  Brain,
  Cpu,
  Database,
  Radio,
  ArrowUpRight,
  RefreshCw,
  Info,
  X,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RedshiftService, 
  RedshiftPrediction, 
  ModelMetadata, 
  SampleGalaxyTarget 
} from "@/lib/services/imageAnalysisService";

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

const HSC_SAMPLE_TARGETS: SampleGalaxyTarget[] = [
  {
    id: "hsc-starburst",
    name: "HSC-SSP J0218-0510",
    type: "Emission-Line Starburst",
    description: "Star-forming spiral galaxy with strong rest-frame UV/optical emission.",
    survey: "Hyper Suprime-Cam Subaru PDR2",
    expected_z: "z ~ 0.38",
    bands: { g: 3.5, r: 3.8, i: 2.9, z: 2.1, y: 1.8 }
  },
  {
    id: "hsc-lrg",
    name: "HSC-SSP J1415+0042",
    type: "Luminous Red Galaxy (LRG)",
    description: "Massive early-type elliptical showing prominent 4000Å Balmer/Ca II break.",
    survey: "Hyper Suprime-Cam Subaru PDR2",
    expected_z: "z ~ 0.72",
    bands: { g: 0.4, r: 1.2, i: 3.8, z: 4.5, y: 4.2 }
  },
  {
    id: "hsc-highz",
    name: "HSC-SSP J2330-0012",
    type: "Lyman-Break Galaxy Candidate",
    description: "High-redshift source exhibiting optical dropout due to neutral hydrogen absorption.",
    survey: "Hyper Suprime-Cam Subaru PDR2",
    expected_z: "z ~ 2.35",
    bands: { g: 0.1, r: 0.2, i: 0.9, z: 3.2, y: 3.6 }
  }
];

export default function VisionAnalysisPage() {
  // Navigation Mode: "model" (ResNet-18 Redshift Predictor) vs "surveys" (Multi-Survey Inspector)
  const [activeTab, setActiveTab] = useState<"model" | "surveys">("model");

  // State for Trained ResNet-18 Model Integration
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleGalaxyTarget>(HSC_SAMPLE_TARGETS[0]);
  const [isInferencing, setIsInferencing] = useState(false);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<RedshiftPrediction | null>(null);
  const [modelSpecs, setModelSpecs] = useState<ModelMetadata | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Existing Surveys Inspector State (100% Intact)
  const [selectedTarget, setSelectedTarget] = useState<CelestialTarget>(CELESTIAL_SAMPLES[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(true);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(0);
  const [showGrid, setShowGrid] = useState(true);

  // Load model metadata on mount & evaluate initial sample
  useEffect(() => {
    RedshiftService.getModelInfo()
      .then((info) => setModelSpecs(info))
      .catch((e) => console.warn("Model info fetch:", e));
    handleEvaluateSample(HSC_SAMPLE_TARGETS[0]);
  }, []);

  const handleEvaluateSample = async (sample: SampleGalaxyTarget) => {
    setSelectedSample(sample);
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setInferenceError(null);
    setIsInferencing(true);

    try {
      const pred = await RedshiftService.predictSample(sample.id);
      setPredictionResult(pred);
    } catch (e: any) {
      console.error("Evaluation error:", e);
      setInferenceError(e.message || "Failed to run sample inference");
    } finally {
      setIsInferencing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFileSelection(file);
    }
    // Clear input value so selecting the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFileSelection(file);
    }
  };

  const processFileSelection = (file: File) => {
    setSelectedFile(file);
    setInferenceError(null);

    // If image format, create preview URL
    if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name)) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }

    // Automatically execute prediction on the uploaded file
    handleExecuteFilePrediction(file);
  };

  const handleExecuteFilePrediction = async (fileToAnalyze?: File | null) => {
    const file = fileToAnalyze || selectedFile;
    if (!file) return;

    setIsInferencing(true);
    setInferenceError(null);

    try {
      const pred = await RedshiftService.predictFromFile(file);
      setPredictionResult(pred);
    } catch (e: any) {
      console.error("Prediction error:", e);
      setInferenceError(e.message || "Model failed to process file.");
    } finally {
      setIsInferencing(false);
    }
  };

  const handleClearUploadedFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setInferenceError(null);
    handleEvaluateSample(selectedSample);
  };

  const handleSelectSurveySample = (sample: CelestialTarget) => {
    setSelectedTarget(sample);
    setActiveFeatureIndex(0);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 700);
  };

  const handleReanalyzeSurvey = () => {
    setAnalyzing(true);
    setResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col gap-6">
      
      {/* Top Main Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF3CF]/10 border border-[#FFF3CF]/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#FFF3CF]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Cosmo Vision Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                PyTorch ResNet-18 Live
              </span>
            </h1>
            <p className="text-xs text-white/50">
              Astronomical deep learning inference & spectroscopic redshift estimation
            </p>
          </div>
        </div>

        <div className="flex items-center bg-black/40 border border-white/[0.08] p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("model")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-2 ${
              activeTab === "model"
                ? "bg-[#FFF3CF] text-slate-950 font-bold shadow-[0_0_15px_rgba(255,243,207,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            ResNet-18 Redshift Estimator
          </button>

          <button
            onClick={() => setActiveTab("surveys")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-2 ${
              activeTab === "surveys"
                ? "bg-[#FFF3CF] text-slate-950 font-bold shadow-[0_0_15px_rgba(255,243,207,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Multi-Survey Inspector (JWST / DESI / Gaia)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRAINED RESNET-18 MODEL & UPLOAD INTEGRATION                       */}
      {/* ========================================================================= */}
      {activeTab === "model" && (
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left Column: Data Upload, Samples & 5-Band Visualizer */}
          <div className="flex-1 flex flex-col gap-5">
            
            {/* Upload Zone Card */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`bg-white/[0.03] backdrop-blur-2xl border-2 border-dashed rounded-2xl p-6 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${
                dragOver 
                  ? "border-[#FFF3CF] bg-[#FFF3CF]/[0.05]" 
                  : "border-white/[0.12] hover:border-white/[0.25]"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".npy,.npz,.h5,.hdf5,.fits,.fit,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden" 
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF3CF]/10 border border-[#FFF3CF]/25 flex items-center justify-center shrink-0">
                    <Upload className="w-7 h-7 text-[#FFF3CF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Upload Astronomical Cutout or Image
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Accepts <span className="text-[#FFF3CF] font-mono">.h5</span>, <span className="text-[#FFF3CF] font-mono">.npy</span>, <span className="text-[#FFF3CF] font-mono">.npz</span>, <span className="text-[#FFF3CF] font-mono">.fits</span> or <span className="text-[#FFF3CF] font-mono">.png / .jpg</span> cutouts (127×127, 5-band g, r, i, z, y)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-[#FFF3CF] text-slate-950 font-bold rounded-xl text-xs font-mono tracking-wider uppercase hover:bg-white transition-all shadow-md flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Select Galaxy File
                  </button>
                </div>
              </div>

              {/* Uploaded File Details & Actions Banner */}
              {selectedFile && (
                <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    {filePreviewUrl ? (
                      <img 
                        src={filePreviewUrl} 
                        alt="Uploaded Cutout" 
                        className="w-10 h-10 rounded-lg object-cover border border-white/[0.15]" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-sky-400" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white font-mono flex items-center gap-2">
                        {selectedFile.name}
                        <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.2 bg-emerald-500/10 rounded">
                          Uploaded
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40 font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || "Astronomical Array"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExecuteFilePrediction(selectedFile)}
                      disabled={isInferencing}
                      className="px-3.5 py-1.5 bg-[#FFF3CF] text-slate-950 font-bold font-mono text-xs rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center gap-1.5 shadow"
                    >
                      {isInferencing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Re-Run Inference
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleClearUploadedFile}
                      className="p-1.5 text-white/40 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                      title="Clear file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert Banner */}
              {inferenceError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Inference Error: {inferenceError}</span>
                  </div>
                  {selectedFile && (
                    <button
                      onClick={() => handleExecuteFilePrediction(selectedFile)}
                      className="text-xs font-mono underline hover:text-white"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pre-Calibrated HSC-SSP Survey Samples */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-[#FFF3CF]/70 font-semibold font-mono flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Or Evaluate Standard Hyper Suprime-Cam (HSC) Samples:
                </span>
                <span className="text-[10px] font-mono text-white/40">5-Band Photometry</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {HSC_SAMPLE_TARGETS.map((sample) => {
                  const isSelected = selectedSample.id === sample.id && !selectedFile;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => handleEvaluateSample(sample)}
                      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                        isSelected
                          ? "bg-white/[0.1] border-[#FFF3CF] shadow-[0_0_20px_rgba(255,243,207,0.15)]"
                          : "bg-black/35 border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white">{sample.name}</span>
                        <span className="text-[10px] font-mono text-[#FFF3CF] font-bold">{sample.expected_z}</span>
                      </div>
                      <div className="text-[11px] text-[#FFF3CF]/70 font-mono mb-1">{sample.type}</div>
                      <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2">
                        {sample.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5-Band Photometric Breakdown (g, r, i, z, y) */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FFF3CF]" />
                  <h3 className="text-sm font-semibold text-white">
                    5-Band Optical & Near-Infrared Channel Spectrum
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-white/50">
                  Input Array: [5, 127, 127] float32
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[
                  { band: "g", name: "Cyan/Blue", wl: "475 nm", color: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
                  { band: "r", name: "Green/Red", wl: "622 nm", color: "from-emerald-500/20 to-green-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
                  { band: "i", name: "Deep Red", wl: "771 nm", color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", text: "text-orange-400" },
                  { band: "z", name: "Near IR", wl: "891 nm", color: "from-rose-500/20 to-pink-500/10", border: "border-rose-500/30", text: "text-rose-400" },
                  { band: "y", name: "Far NIR", wl: "976 nm", color: "from-purple-500/20 to-indigo-500/10", border: "border-purple-500/30", text: "text-purple-400" },
                ].map((b, idx) => {
                  const stat = predictionResult?.band_statistics?.[idx];
                  return (
                    <div 
                      key={b.band}
                      className={`p-3 rounded-xl bg-gradient-to-b ${b.color} border ${b.border} flex flex-col justify-between min-h-[110px] text-center relative overflow-hidden`}
                    >
                      <div>
                        <span className={`text-base font-bold font-mono ${b.text}`}>{b.band}-band</span>
                        <div className="text-[10px] text-white/60 font-mono mt-0.5">{b.wl}</div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/[0.08]">
                        <div className="text-[9px] text-white/40 uppercase font-mono">Mean Flux</div>
                        <div className="font-mono text-xs text-white font-semibold">
                          {stat ? stat.mean_flux : (0.8 + idx * 0.3).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Model Output, Redshift & Cosmological Context */}
          <div className="w-full xl:w-[460px] flex flex-col gap-5 shrink-0">
            
            {/* Primary Prediction Readout Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)] relative overflow-hidden">
              
              {/* Scanning beam animation during inference */}
              <AnimatePresence>
                {isInferencing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-sky-950/30 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center"
                  >
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="absolute left-0 w-full h-0.5 bg-[#FFF3CF] shadow-[0_0_20px_#FFF3CF]"
                    />
                    <RefreshCw className="w-7 h-7 text-[#FFF3CF] animate-spin mb-3" />
                    <span className="text-xs font-mono text-white font-semibold">
                      Executing ResNet-18 Model Inference...
                    </span>
                    <span className="text-[11px] font-mono text-[#FFF3CF]/70 mt-1">
                      {selectedFile ? `Processing ${selectedFile.name}` : `Evaluating ${selectedSample.name}`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/60 font-semibold block font-mono">
                    Spectroscopic Redshift
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {predictionResult?.object_name || (selectedFile ? selectedFile.name : selectedSample.name)}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300">
                    z ∈ [0, 4]
                  </span>
                </div>
              </div>

              {/* Big Redshift Callout */}
              <div className="bg-black/45 border border-white/[0.1] rounded-2xl p-4 mb-4 text-center">
                <span className="text-xs text-white/50 uppercase font-mono tracking-wider block mb-1">
                  Estimated Redshift (z)
                </span>
                <div className="text-4xl font-extrabold font-mono text-[#FFF3CF] tracking-tight drop-shadow-[0_0_20px_rgba(255,243,207,0.3)]">
                  z = {predictionResult ? predictionResult.predicted_z.toFixed(4) : "—"}
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-1">
                  68% Credible Interval: [
                  {predictionResult?.confidence_interval[0]?.toFixed(4) || "—"}, 
                  {" "}
                  {predictionResult?.confidence_interval[1]?.toFixed(4) || "—"}
                  ]
                </div>
              </div>

              {/* Cosmological Parameters Table */}
              <div className="space-y-2 text-xs font-light">
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Cosmic Epoch</span>
                  <span className="text-[#FFF3CF] font-medium font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1]">
                    {predictionResult?.cosmology.cosmic_epoch || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Lookback Time</span>
                  <span className="text-white font-mono font-semibold">
                    {predictionResult ? `${predictionResult.cosmology.lookback_time_gyr} Billion Years` : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Comoving Distance</span>
                  <span className="text-white font-mono">
                    {predictionResult ? `${predictionResult.cosmology.comoving_distance_mpc} Mpc (${predictionResult.cosmology.comoving_distance_gly} Gly)` : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Luminosity Distance</span>
                  <span className="text-white font-mono">
                    {predictionResult ? `${predictionResult.cosmology.luminosity_distance_mpc} Mpc` : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Angular Diameter Distance</span>
                  <span className="text-white font-mono">
                    {predictionResult ? `${predictionResult.cosmology.angular_diameter_distance_mpc} Mpc` : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Age of Universe at Emission</span>
                  <span className="text-amber-300 font-mono">
                    {predictionResult ? `${predictionResult.cosmology.age_at_redshift_gyr} Billion Years` : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-white/60">Cosmic Scale Factor (a)</span>
                  <span className="text-white font-mono">
                    {predictionResult ? `a = ${predictionResult.cosmology.scale_factor}` : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Model Architecture & Benchmark Specifications */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-[#FFF3CF]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                  Trained Model Specifications
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-black/35 border border-white/[0.08]">
                  <span className="text-white/40 block text-[9px]">ARCHITECTURE</span>
                  <span className="text-white font-semibold">ResNet-18 (5-ch)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/35 border border-white/[0.08]">
                  <span className="text-white/40 block text-[9px]">TEST RMSE</span>
                  <span className="text-emerald-400 font-semibold">0.2399</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/35 border border-white/[0.08]">
                  <span className="text-white/40 block text-[9px]">σ_NMAD ACCURACY</span>
                  <span className="text-[#FFF3CF] font-semibold">0.0319</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/35 border border-white/[0.08]">
                  <span className="text-white/40 block text-[9px]">OUTLIER FRACTION (η)</span>
                  <span className="text-sky-300 font-semibold">4.98%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/35 border border-white/[0.08] col-span-2">
                  <span className="text-white/40 block text-[9px]">TRAINING BENCHMARK</span>
                  <span className="text-white/80">163,658 HSC Cutouts • Huber Loss (δ=0.1) • Adam</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTI-SURVEY INSPECTOR (ORIGINAL CODE PRESERVED 100%)              */}
      {/* ========================================================================= */}
      {activeTab === "surveys" && (
        <div className="h-full flex flex-col xl:flex-row gap-6">
          
          {/* Left Imaging Workspace */}
          <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
            
            {/* Workspace Toolbar */}
            <div className="p-4 border-b border-white/[0.07] bg-white/[0.01] flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <span className="text-[10px] uppercase tracking-wider text-[#FFF3CF]/50 font-semibold mr-1 font-mono">
                  Surveys:
                </span>
                {CELESTIAL_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSurveySample(sample)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1.5 font-mono ${
                      selectedTarget.id === sample.id
                        ? "bg-[#FFF3CF] border-[#FFF3CF] text-slate-950 font-bold shadow-[0_0_12px_rgba(255,243,207,0.25)]"
                        : "bg-black/35 border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <Eye className="w-3 h-3" /> {sample.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border transition-colors ${
                    showGrid 
                      ? "bg-white/[0.1] border-white/[0.2] text-[#FFF3CF]" 
                      : "bg-transparent border-white/[0.08] text-white/40 hover:text-white"
                  }`}
                  title="Toggle Astrometric Grid"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleReanalyzeSurvey}
                  disabled={analyzing}
                  className="px-3.5 py-1.5 bg-[#FFF3CF] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase flex items-center gap-1.5 hover:bg-white transition-all disabled:opacity-50 font-mono shadow-md"
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
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <div className="flex items-center gap-3 border-b border-white/[0.07] pb-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Scan className="w-5 h-5 text-[#FFF3CF]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/50 font-semibold block font-mono">
                    Vision Transformer Output
                  </span>
                  <h3 className="text-base font-semibold text-white leading-tight">
                    {selectedTarget.targetName}
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-light">
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Classification</span>
                  <span className="text-[#FFF3CF] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-right text-[11px] font-mono">
                    {selectedTarget.classification}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Confidence Score</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedTarget.confidence}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Cosmological Redshift</span>
                  <span className="text-white font-mono">{selectedTarget.redshift}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Light Travel Distance</span>
                  <span className="text-white/80">{selectedTarget.distance}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.05]">
                  <span className="text-white/60">Morphological Profile</span>
                  <span className="text-white/80">{selectedTarget.sersicIndex}</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-white/60">Estimated Stellar Mass</span>
                  <span className="text-amber-300 font-mono">{selectedTarget.stellarMass}</span>
                </div>
              </div>
            </div>

            {/* Feature Sub-Regions Inspector */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center justify-between font-mono">
                <span>Segmented Coordinates</span>
                <span className="text-[10px] text-[#FFF3CF] font-mono px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1]">{selectedTarget.detectedFeatures.length} ROIs</span>
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
                          ? "bg-white/[0.1] border-white/[0.2] text-white shadow-sm"
                          : "bg-black/35 border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${active ? "bg-[#FFF3CF]" : "bg-white/40"}`} />
                          {feat.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#FFF3CF]">{feat.confidence}</span>
                      </div>
                      <div className="text-[10px] text-white/45 mt-1 flex justify-between font-mono">
                        <span>Feature: {feat.type}</span>
                        <span>T:{feat.top} L:{feat.left}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photometric & Spectral Readout */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center justify-between font-mono">
                <span>Photometric Band Flux</span>
                <Activity className="w-3.5 h-3.5 text-[#FFF3CF]" />
              </h4>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedTarget.spectralBands.map((band) => (
                  <div key={band.band} className="p-2.5 rounded-xl bg-black/35 border border-white/[0.08] text-xs">
                    <div className="text-[10px] text-white/45 uppercase font-mono">{band.band}</div>
                    <div className="font-mono text-white text-sm mt-0.5">{band.flux}</div>
                    <div className="text-[9px] text-emerald-400 font-mono">SNR: {band.snr}</div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white/80 leading-relaxed font-light">
                <span className="font-semibold text-[#FFF3CF] block mb-1 font-mono text-[11px] uppercase tracking-wider">Astro-Inference:</span>
                {selectedTarget.aiNotes}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
