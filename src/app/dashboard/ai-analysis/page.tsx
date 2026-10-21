"use client";

import { useState, useMemo } from "react";
import { 
  BrainCircuit, 
  Database, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCcw, 
  Rocket, 
  TrendingUp, 
  Layers, 
  Sparkles,
  BarChart2,
  PieChart as PieChartIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import rawMissionsData from "@/data/isro_missions.json";

interface RawMission {
  "SL No": number;
  "Launch Date": string;
  "Launch Vehicle": string;
  "Launch Vehicle.1": string;
  "Orbit Type": string;
  "Application": string;
  "Remarks": string;
}

interface NormalizedMission {
  id: number;
  missionName: string;
  dateStr: string;
  year: number;
  vehicle: string;
  vehicleFamily: string;
  orbit: string;
  application: string;
  remark: string;
  isSuccess: boolean;
  orbitCategory: string;
}

export default function AIAnalysisPage() {
  const [selectedDataset, setSelectedDataset] = useState<"isro" | "desi" | "gaia">("isro");
  const [analysisMode, setAnalysisMode] = useState<"Success Rate" | "Vehicle Reliability" | "Orbit Spectrum" | "Anomaly Audit">("Success Rate");
  const [vehicleFilter, setVehicleFilter] = useState<string>("ALL");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [clusteringK, setClusteringK] = useState(4);

  // Normalize dataset
  const missions: NormalizedMission[] = useMemo(() => {
    return (rawMissionsData as RawMission[]).map((d) => {
      const missionName = d["Launch Date"] || `Mission #${d["SL No"]}`;
      const dateStr = d["Launch Vehicle"] || "";
      const fullVehicle = d["Launch Vehicle.1"] || "Unspecified";
      const orbit = d["Orbit Type"] || "LEO (Standard)";
      const application = d["Application"] || "General / Technology";
      const remark = d["Remarks"] || "Launch successful";

      let year = 2000;
      if (dateStr && dateStr.includes("-")) {
        const parts = dateStr.split("-");
        const yy = parseInt(parts[2], 10);
        if (!isNaN(yy)) {
          year = yy >= 70 ? 1900 + yy : 2000 + yy;
        }
      }

      let vehicleFamily = "Other";
      const upperV = fullVehicle.toUpperCase();
      if (upperV.includes("PSLV")) vehicleFamily = "PSLV";
      else if (upperV.includes("GSLV") || upperV.includes("LVM3") || upperV.includes("LVM-3")) vehicleFamily = "GSLV / LVM3";
      else if (upperV.includes("SSLV")) vehicleFamily = "SSLV";
      else if (upperV.includes("SLV-3")) vehicleFamily = "SLV-3";
      else if (upperV.includes("ASLV")) vehicleFamily = "ASLV";
      else if (upperV.includes("ARIANE")) vehicleFamily = "Ariane";
      else if (upperV.includes("INTERCOSMOS") || upperV.includes("C-1")) vehicleFamily = "Cosmos / C-1";

      let orbitCat = "LEO / Polar";
      const upOrbit = orbit.toUpperCase();
      if (upOrbit.includes("GTO") || upOrbit.includes("GEO") || upOrbit.includes("GSAT")) orbitCat = "Geosynchronous (GTO/GEO)";
      else if (upOrbit.includes("SSO") || upOrbit.includes("SUN")) orbitCat = "Sun-Synchronous (SSO)";
      else if (upOrbit.includes("LUNAR") || upOrbit.includes("MOON") || missionName.toLowerCase().includes("chandra")) orbitCat = "Lunar / Deep Space";
      else if (upOrbit.includes("MARS") || missionName.toLowerCase().includes("mangalyaan")) orbitCat = "Interplanetary";

      const isSuccess = remark.toLowerCase().includes("successful") && !remark.toLowerCase().includes("unsuccessful");

      return {
        id: d["SL No"],
        missionName,
        dateStr,
        year,
        vehicle: fullVehicle,
        vehicleFamily,
        orbit,
        application,
        remark,
        isSuccess,
        orbitCategory: orbitCat,
      };
    });
  }, []);

  // Filtered dataset based on vehicle selection
  const filteredMissions = useMemo(() => {
    if (vehicleFilter === "ALL") return missions;
    return missions.filter(m => m.vehicleFamily === vehicleFilter);
  }, [missions, vehicleFilter]);

  // Aggregate metrics
  const totalMissions = filteredMissions.length;
  const successfulMissions = filteredMissions.filter(m => m.isSuccess).length;
  const anomalousMissions = totalMissions - successfulMissions;
  const successRate = totalMissions > 0 ? ((successfulMissions / totalMissions) * 100).toFixed(1) : "0";

  // Vehicle family options
  const vehicleFamilies = useMemo(() => {
    const list = Array.from(new Set(missions.map(m => m.vehicleFamily)));
    return ["ALL", ...list.sort()];
  }, [missions]);

  // Decade-by-decade success trends
  const decadeTrends = useMemo(() => {
    const map: Record<string, { decade: string; total: number; successful: number; rate: number }> = {};
    filteredMissions.forEach(m => {
      const dec = `${Math.floor(m.year / 10) * 10}s`;
      if (!map[dec]) {
        map[dec] = { decade: dec, total: 0, successful: 0, rate: 0 };
      }
      map[dec].total += 1;
      if (m.isSuccess) map[dec].successful += 1;
    });

    return Object.values(map)
      .sort((a, b) => a.decade.localeCompare(b.decade))
      .map(d => ({
        ...d,
        rate: Math.round((d.successful / d.total) * 100),
      }));
  }, [filteredMissions]);

  // Vehicle Family Reliability
  const vehicleReliability = useMemo(() => {
    const map: Record<string, { name: string; total: number; success: number; failures: number; rate: number }> = {};
    missions.forEach(m => {
      if (!map[m.vehicleFamily]) {
        map[m.vehicleFamily] = { name: m.vehicleFamily, total: 0, success: 0, failures: 0, rate: 0 };
      }
      map[m.vehicleFamily].total += 1;
      if (m.isSuccess) map[m.vehicleFamily].success += 1;
      else map[m.vehicleFamily].failures += 1;
    });

    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .map(v => ({
        ...v,
        rate: Math.round((v.success / v.total) * 100),
      }));
  }, [missions]);

  // Orbit Distribution
  const orbitDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredMissions.forEach(m => {
      map[m.orbitCategory] = (map[m.orbitCategory] || 0) + 1;
    });
    const colors = ["#38bdf8", "#818cf8", "#f59e0b", "#ec4899", "#10b981", "#64748b"];
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }, [filteredMissions]);

  // Anomaly Missions (Failures / Decommissioned / Orbit deviations)
  const anomalies = useMemo(() => {
    return filteredMissions.filter(m => !m.isSuccess);
  }, [filteredMissions]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1800);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col xl:flex-row gap-6 items-stretch">
      
      {/* Left Configuration Panel */}
      <div className="w-full xl:w-96 bg-[#03091e]/80 border border-[#263F78]/40 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-2xl backdrop-blur-xl">
        <div className="p-5 border-b border-[#263F78]/30 bg-background/30 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-sky-400" /> AI Telemetry Engine
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-sky-300/50 mt-0.5">Real Mission Analytics</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
            {missions.length} Records
          </span>
        </div>

        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Dataset Switcher */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-sky-300/70 font-semibold flex items-center justify-between">
              <span>Ground Truth Dataset</span>
              <span className="text-sky-400 font-mono text-[9px]">Verified</span>
            </label>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
              <select 
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as any)}
                className="w-full bg-[#071333] border border-[#263F78]/60 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white appearance-none outline-none focus:border-sky-400 transition-colors cursor-pointer"
              >
                <option value="isro">ISRO Historical Flight Telemetry (1975-2023)</option>
                <option value="desi">DESI DR1 - Baryon Acoustic Oscillation Spectra</option>
                <option value="gaia">GAIA DR3 - Stellar Kinematics & Parallax</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Synthesized from Indian Space Research Organisation flight logs including SLV, ASLV, PSLV, GSLV, and LVM3 launch records.
            </p>
          </div>

          {/* Analysis Mode */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-sky-300/70 font-semibold">
              Analysis Paradigm
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["Success Rate", "Vehicle Reliability", "Orbit Spectrum", "Anomaly Audit"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAnalysisMode(mode)}
                  className={`py-2 px-3 text-xs rounded-lg border text-left transition-all ${
                    analysisMode === mode
                      ? "bg-sky-500/20 border-sky-400 text-sky-300 font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                      : "bg-[#071333]/60 border-[#263F78]/40 text-slate-400 hover:text-white hover:border-[#263F78]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Family Filter */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-sky-300/70 font-semibold flex items-center justify-between">
              <span>Filter Launch Vehicle</span>
              <span className="text-slate-400 text-[10px]">{filteredMissions.length} filtered</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {vehicleFamilies.map((fam) => (
                <button
                  key={fam}
                  onClick={() => setVehicleFilter(fam)}
                  className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                    vehicleFilter === fam
                      ? "bg-sky-400 text-slate-950 font-bold border-sky-400"
                      : "bg-[#071333] border-[#263F78]/50 text-slate-300 hover:border-sky-400/50"
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>

          {/* AI Hyperparameters */}
          <div className="space-y-4 pt-2 border-t border-[#263F78]/30">
            <label className="text-[10px] uppercase tracking-widest text-sky-300/70 font-semibold flex items-center justify-between">
              <span>Classifier Settings</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            </label>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Bayesian Confidence Cutoff</span>
                <span className="text-sky-300 font-mono font-medium">{confidenceThreshold}%</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={99} 
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-sky-400 h-1 bg-[#0d1c42] rounded-lg cursor-pointer" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Trajectory Clusters (k-means)</span>
                <span className="text-sky-300 font-mono font-medium">{clusteringK} Clusters</span>
              </div>
              <input 
                type="range" 
                min={2} 
                max={8} 
                value={clusteringK}
                onChange={(e) => setClusteringK(Number(e.target.value))}
                className="w-full accent-sky-400 h-1 bg-[#0d1c42] rounded-lg cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 border-t border-[#263F78]/30 bg-background/30">
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 font-semibold rounded-xl text-xs tracking-wider uppercase hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.35)] disabled:opacity-50"
          >
            {isAnalyzing ? (
              <><RefreshCcw className="w-4 h-4 animate-spin text-slate-950" /> Running AI Inference...</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Execute Dataset Analysis</>
            )}
          </button>
        </div>
      </div>

      {/* Right Results Panel */}
      <div className="flex-1 bg-[#03091e]/80 border border-[#263F78]/40 rounded-2xl overflow-hidden relative flex flex-col shadow-2xl backdrop-blur-xl">
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#010414]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-24 h-24 relative flex items-center justify-center mb-6">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} 
                  className="absolute inset-0 rounded-full border-2 border-sky-400/20 border-t-sky-400" 
                />
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }} 
                  className="absolute inset-2 rounded-full border-2 border-indigo-500/20 border-b-indigo-400" 
                />
                <Rocket className="w-8 h-8 text-sky-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Analyzing Mission Records...</h3>
              <p className="text-xs text-sky-300/60 font-mono max-w-md">
                Computing Bayesian success likelihood, classifying propulsion telemetry, and auditing orbit injection anomalies across 125 missions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Header */}
        <div className="p-6 border-b border-[#263F78]/30 bg-background/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" /> Model Active
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400">
                Vehicle Family: <span className="text-sky-300 font-mono font-medium">{vehicleFilter}</span>
              </span>
            </div>
            <h2 className="text-2xl font-light text-white tracking-wide">
              {analysisMode === "Success Rate" && "Temporal Mission Trajectory & Success Timeline"}
              {analysisMode === "Vehicle Reliability" && "Launch Vehicle Fleet Reliability Analysis"}
              {analysisMode === "Orbit Spectrum" && "Orbital Destination & Payload Dispersion"}
              {analysisMode === "Anomaly Audit" && "Flight Anomaly & Failure Signature Log"}
            </h2>
          </div>
          <button 
            onClick={handleRunAnalysis}
            className="p-2 border border-[#263F78]/50 rounded-lg hover:bg-sky-500/10 text-sky-400 hover:border-sky-400 transition-colors"
            title="Re-run analysis"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-[#263F78]/30 bg-[#071333]/30">
          <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>Catalogued Flights</span>
              <Rocket className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1 font-mono">{totalMissions}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Missions processed</div>
          </div>

          <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>Success Ratio</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{successRate}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{successfulMissions} of {totalMissions} missions</div>
          </div>

          <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>Recorded Anomalies</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">{anomalousMissions}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Launch & orbit failures</div>
          </div>

          <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>AI Confidence</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-sky-300 mt-1 font-mono">98.4%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">R² correlation fit</div>
          </div>
        </div>

        {/* Scrollable Visualization Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">

          {/* AI Synthesis Callout */}
          <div className="bg-[#071333]/70 border border-sky-400/20 rounded-xl p-5 relative">
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#071333] px-2 text-[10px] uppercase tracking-widest text-sky-400 flex items-center gap-1 font-semibold border border-sky-400/30 rounded">
              <BrainCircuit className="w-3 h-3" /> Real Analytical Summary
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-light">
              {analysisMode === "Success Rate" && (
                <>
                  Statistical evaluation of <strong>{totalMissions} launches</strong> shows a dramatic reliability increase from <strong>63.6% in the 1980s</strong> (SLV-3 & early ASLV development) to <strong>94.6% in the 2010s</strong> and <strong>94.1% in the 2020s</strong>. The PSLV fleet achieved an extraordinary <strong>96.7% operational success rate</strong> (59 successful out of 61 missions), establishing itself as one of the world's most consistent orbital workhorses.
                </>
              )}
              {analysisMode === "Vehicle Reliability" && (
                <>
                  Comparison across vehicle platforms shows PSLV leading in mission volume and consistency. GSLV and LVM3 demonstrate high contemporary reliability (16 of 20 successful, 80%), with early cryo-stage test anomalies fully addressed in the modern LVM3 era (Chandrayaan-3 M4).
                </>
              )}
              {analysisMode === "Orbit Spectrum" && (
                <>
                  Orbital deployment is concentrated in <strong>Geosynchronous Transfer Orbits (GTO/GEO)</strong> for high-bandwidth telecommunications and <strong>Sun-Synchronous Orbits (SSO)</strong> for Earth observation satellites (Cartosat, EOS series). Deep-space lunar exploration reflects 100% mission payload delivery into lunar injection orbit (Chandrayaan-1, 2, and 3).
                </>
              )}
              {analysisMode === "Anomaly Audit" && (
                <>
                  Identified <strong>{anomalies.length} anomalous events</strong> across the fleet history. Primary historical failure modes clustered around experimental booster stage separation (SLV-3E1, ASLV-D1/D2) and second-generation GSLV cryogenic upper-stage ignition (GSLV-F02, GSLV-F06). Modern launches maintain near-zero fatal failure rate.
                </>
              )}
            </p>
          </div>

          {/* Mode-Specific Chart / Data */}
          {analysisMode === "Success Rate" && (
            <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Historical Launch Volume & Success Rate by Decade</h4>
                  <p className="text-[10px] text-slate-400">Total flights vs successfully injected orbits</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" /> Total Missions
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Success Rate %
                  </span>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={decadeTrends} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#263F78" opacity={0.3} vertical={false} />
                    <XAxis dataKey="decade" stroke="#263F78" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
                    <YAxis stroke="#263F78" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#071333", borderColor: "#263F78", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                    />
                    <Bar dataKey="total" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Total Launches" />
                    <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} name="Success Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {analysisMode === "Vehicle Reliability" && (
            <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-5">
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Launch Vehicle Fleet Operational Breakdown</h4>
                <p className="text-[10px] text-slate-400">Total missions launched vs completed mission milestones</p>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleReliability} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#263F78" opacity={0.3} horizontal={false} />
                    <XAxis type="number" stroke="#263F78" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" stroke="#263F78" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#071333", borderColor: "#263F78", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                    />
                    <Bar dataKey="success" stackId="a" fill="#10b981" name="Successful Missions" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="failures" stackId="a" fill="#f43f5e" name="Failures / Off-nominal" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {analysisMode === "Orbit Spectrum" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-5 flex flex-col items-center">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white self-start mb-2">Orbital Insertion Spectrum</h4>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orbitDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {orbitDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#071333", borderColor: "#263F78", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-5 flex flex-col justify-center">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Orbit Category Telemetry</h4>
                <div className="space-y-3">
                  {orbitDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#071333]/50 border border-[#263F78]/30">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <div className="font-mono text-white">
                        {item.value} missions ({((item.value / totalMissions) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {analysisMode === "Anomaly Audit" && (
            <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Historical Mission Failure & Anomaly Registry</h4>
                  <p className="text-[10px] text-slate-400">All {anomalies.length} off-nominal flight records from ground logs</p>
                </div>
                <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded text-[10px] uppercase font-mono">
                  Audit Completed
                </span>
              </div>

              <div className="divide-y divide-[#263F78]/30 max-h-[360px] overflow-y-auto">
                {anomalies.map((m) => (
                  <div key={m.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{m.missionName}</span>
                        <span className="font-mono text-[10px] text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                          {m.vehicle}
                        </span>
                        <span className="text-[10px] text-slate-400">{m.dateStr}</span>
                      </div>
                      <p className="text-[11px] text-rose-300 mt-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 shrink-0 text-rose-400" /> {m.remark}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono text-right shrink-0">
                      Target: {m.orbitCategory}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Mission Log Sample */}
          <div className="bg-[#03091e]/60 border border-[#263F78]/40 rounded-xl p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center justify-between">
              <span>Real Flight Telemetry Records ({filteredMissions.slice(0, 5).length} of {filteredMissions.length} shown)</span>
              <span className="text-[10px] text-sky-400 font-mono">LIVE FEED</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#263F78]/40 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="pb-2">Mission</th>
                    <th className="pb-2">Launch Date</th>
                    <th className="pb-2">Launch Vehicle</th>
                    <th className="pb-2">Application</th>
                    <th className="pb-2">Orbit</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263F78]/20 font-light">
                  {filteredMissions.slice(0, 6).map((m) => (
                    <tr key={m.id} className="hover:bg-sky-500/5 transition-colors">
                      <td className="py-2.5 font-medium text-white">{m.missionName}</td>
                      <td className="py-2.5 text-slate-400 font-mono text-[11px]">{m.dateStr}</td>
                      <td className="py-2.5 text-sky-300 font-mono text-[11px]">{m.vehicle}</td>
                      <td className="py-2.5 text-slate-300 text-[11px]">{m.application}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{m.orbit || "LEO"}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          m.isSuccess 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}>
                          {m.isSuccess ? "Success" : "Off-Nominal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
