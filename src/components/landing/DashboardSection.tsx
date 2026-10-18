"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  ScanEye,
  MessageSquare,
  Box,
  Globe2,
  Library,
  User,
  ArrowUpRight,
  Search,
  Play,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Send,
  Download,
  Activity,
  Layers,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import isroDataRaw from "@/data/isro_missions.json";

type TabId = "overview" | "explorer" | "ai" | "vision" | "ask" | "simulations" | "universe" | "research";

interface TabItem {
  id: TabId;
  icon: React.ReactNode;
  label: string;
  route: string;
}

const NAV_ITEMS: TabItem[] = [
  { id: "overview", icon: <LayoutDashboard className="w-4 h-4" />, label: "Overview", route: "/dashboard" },
  { id: "explorer", icon: <Database className="w-4 h-4" />, label: "Data Explorer", route: "/dashboard/explorer" },
  { id: "ai", icon: <BrainCircuit className="w-4 h-4" />, label: "AI Analysis", route: "/dashboard/ai-analysis" },
  { id: "vision", icon: <ScanEye className="w-4 h-4" />, label: "Image Analysis", route: "/dashboard/vision" },
  { id: "ask", icon: <MessageSquare className="w-4 h-4" />, label: "Ask COSMO", route: "/dashboard/ask" },
  { id: "universe", icon: <Globe2 className="w-4 h-4" />, label: "3D Universe", route: "/dashboard/universe" },
  { id: "research", icon: <Library className="w-4 h-4" />, label: "Research", route: "/dashboard/research" },
];

export default function DashboardSection() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Overview Tab State
  const [overviewMode, setOverviewMode] = useState<"cosmic" | "isro">("cosmic");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Data Explorer Tab State
  const [explorerQuery, setExplorerQuery] = useState("");
  const [explorerFilter, setExplorerFilter] = useState("All");

  // AI Analysis Tab State
  const [selectedAiModel, setSelectedAiModel] = useState("DESI Redshift Regressor");
  const [aiRunning, setAiRunning] = useState(false);
  const [aiCompleted, setAiCompleted] = useState(false);

  // Ask COSMO Tab State
  const [askHistory, setAskHistory] = useState([
    { role: "assistant", text: "Welcome to COSMO AI research terminal. Ask any cosmological query or select a preset prompt below." }
  ]);
  const [askInput, setAskInput] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  // Simulations / Universe Tab State
  const [omegaM, setOmegaM] = useState(0.315);
  const [omegaLambda, setOmegaLambda] = useState(0.685);
  const [h0, setH0] = useState(67.4);

  // Image Analysis Tab State
  const [selectedImageTarget, setSelectedImageTarget] = useState<"jwst" | "andromeda" | "cartwheel">("jwst");
  const [visionAnalyzed, setVisionAnalyzed] = useState(true);

  // Filtered ISRO Data for Data Explorer Tab
  const filteredIsroData = useMemo(() => {
    return isroDataRaw.filter((item: any) => {
      const missionName = item["Launch Date"] || "";
      const vehicle = item["Launch Vehicle.1"] || "";
      const app = item["Application"] || "";
      const matchesSearch =
        missionName.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        vehicle.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        app.toLowerCase().includes(explorerQuery.toLowerCase());

      if (explorerFilter === "All") return matchesSearch;
      return matchesSearch && app.toLowerCase().includes(explorerFilter.toLowerCase());
    });
  }, [explorerQuery, explorerFilter]);

  // Handle AI analysis simulation
  const handleTriggerAiAnalysis = () => {
    setAiRunning(true);
    setAiCompleted(false);
    setTimeout(() => {
      setAiRunning(false);
      setAiCompleted(true);
    }, 1800);
  };

  // Handle Ask COSMO messaging
  const handleSendPrompt = (textToSend?: string) => {
    const query = textToSend || askInput;
    if (!query.trim() || askLoading) return;

    const newMessages = [...askHistory, { role: "user", text: query }];
    setAskHistory(newMessages);
    if (!textToSend) setAskInput("");
    setAskLoading(true);

    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();
      if (lower.includes("desi") || lower.includes("z")) {
        reply = "DESI spectroscopic survey measured baryon acoustic oscillations (BAO) at z ≈ 0.62 with 0.8% precision, hinting at potential dynamical evolution of dark energy parameter w(z) over cosmic time.";
      } else if (lower.includes("isro") || lower.includes("chandrayaan") || lower.includes("aditya")) {
        reply = "ISRO's Aditya-L1 was launched via PSLV-C57 to halo orbit at Lagrange Point 1 (1.5M km). Chandrayaan-3 successfully completed soft landing near the lunar south pole using LVM3-M4.";
      } else if (lower.includes("dark energy") || lower.includes("equation of state")) {
        reply = "In standard ΛCDM cosmology, w = -1. Recent joint DESI + CMB analysis suggests mild tension with constant w, allowing for phantom or quintessence scenarios w(a) = w0 + wa(1 - a).";
      } else {
        reply = `Analysis completed for query: "${query}". Cosmological cross-correlation yields significant alignment across observational survey catalogs.`;
      }

      setAskHistory([...newMessages, { role: "assistant", text: reply }]);
      setAskLoading(false);
    }, 900);
  };

  // Active route for "Launch Full" button
  const currentRoute = NAV_ITEMS.find(n => n.id === activeTab)?.route || "/dashboard";

  // Universe Fate calculation
  const totalOmega = omegaM + omegaLambda;
  const universeFate = totalOmega > 1.05
    ? "Closed Universe (Eventual Big Crunch)"
    : totalOmega < 0.95
      ? "Open Universe (Continuous Expansion)"
      : "Flat Universe (ΛCDM Accelerated Expansion)";

  return (
    <section className="py-24 relative bg-background border-t border-border" id="dashboard-section">
      <div className="container mx-auto px-6 relative z-10">

        {/* Section Heading with Direct Launch Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-primary text-xs uppercase tracking-widest mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Interactive Live Console
            </div>
            <h2 className="text-3xl font-light text-white tracking-wide">
              COSMO AI <span className="text-primary font-medium">Research Dashboard</span>
            </h2>
            <p className="text-xs text-primary/60 mt-1 max-w-xl">
              Switch modules below to explore real datasets, run AI inference, inspect deep-space imagery, or query the cosmological research assistant.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={currentRoute}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-background text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all shadow-lg shadow-primary/10 group"
            >
              Launch Full Workspace
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dashboard Main Console Frame */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[660px]">

          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 border-r border-border bg-background/60 flex flex-col p-4 shrink-0">
            <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-background" />
                </div>
                <span className="font-medium tracking-wide text-white text-sm">COSMO OS</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                LIVE
              </span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${isActive
                        ? "bg-accent/25 text-primary border border-accent/40 shadow-sm"
                        : "text-primary/60 hover:bg-border/30 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </nav>

            {/* User Profile Card */}
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#263F78]/50 flex items-center justify-center text-primary font-medium text-xs">
                  SS
                </div>
                <div className="text-left">
                  <div className="text-xs text-white font-medium">Dr. Shruti Singh</div>
                  <div className="text-[10px] text-primary/60">Lead Astrophysicist</div>
                </div>
              </div>
              <Link href="/dashboard" className="text-primary/60 hover:text-white transition-colors" title="Open Dashboard">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Main Dynamic Content Area */}
          <div className="flex-1 p-6 md:p-8 bg-card flex flex-col overflow-y-auto">

            {/* ==================== 1. OVERVIEW TAB ==================== */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col"
              >
                {/* Header with Mode Switcher */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">Cosmology Research Overview</h3>
                    <p className="text-xs text-primary/60">Live telemetry and astronomical metric aggregation</p>
                  </div>

                  {/* Toggle between Cosmic Survey and Real ISRO Data */}
                  <div className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg text-xs">
                    <button
                      onClick={() => setOverviewMode("cosmic")}
                      className={`px-3 py-1.5 rounded-md transition-all font-medium ${overviewMode === "cosmic"
                          ? "bg-primary text-background shadow"
                          : "text-primary/60 hover:text-white"
                        }`}
                    >
                      Cosmic Survey (DESI / GAIA)
                    </button>
                    <button
                      onClick={() => setOverviewMode("isro")}
                      className={`px-3 py-1.5 rounded-md transition-all font-medium flex items-center gap-1.5 ${overviewMode === "isro"
                          ? "bg-primary text-background shadow"
                          : "text-primary/60 hover:text-white"
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      ISRO Launches (Real Data)
                    </button>
                  </div>
                </div>

                {/* Stats Row */}
                {overviewMode === "cosmic" ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Objects", value: "8.1M", sub: "+12% verified galaxies" },
                      { label: "Datasets", value: "5", sub: "DESI, GAIA, JWST, RUBIN" },
                      { label: "AI Analyses", value: "24", sub: "98.4% model accuracy" },
                      { label: "Research Queries", value: "48", sub: "Active pipeline" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-background/50 border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                        <div className="text-[10px] uppercase tracking-widest text-primary/60 mb-1">{stat.label}</div>
                        <div className="text-2xl font-light text-white mb-1">{stat.value}</div>
                        <div className="text-[10px] text-primary/40">{stat.sub}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Missions", value: "125", sub: "Historical ISRO records" },
                      { label: "Launch Success", value: "96.8%", sub: "121 successful launches" },
                      { label: "Communication", value: "38", sub: "GSAT, INSAT fleets" },
                      { label: "Planetary / Lunar", value: "5", sub: "Chandrayaan, Aditya, MOM" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-background/50 border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                        <div className="text-[10px] uppercase tracking-widest text-primary/60 mb-1">{stat.label}</div>
                        <div className="text-2xl font-light text-white mb-1">{stat.value}</div>
                        <div className="text-[10px] text-green-400/80">{stat.sub}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

                  {/* Left Chart: Redshift / Launch Timeline */}
                  <div className="lg:col-span-2 bg-background/50 border border-border rounded-xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-primary/80 font-medium">
                          {overviewMode === "cosmic" ? "Redshift Distribution (z = 0.0 to 2.0)" : "Mission Launches by Decade"}
                        </h4>
                        <p className="text-[10px] text-primary/50">
                          {overviewMode === "cosmic" ? "Hover over bars to inspect galaxy frequency" : "Real historical frequency from ISRO mission catalogue"}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-accent/20 text-primary border border-accent/30 font-mono">
                        {overviewMode === "cosmic" ? "DESI DR1" : "ISRO DB"}
                      </span>
                    </div>

                    {overviewMode === "cosmic" ? (
                      <div className="h-48 flex items-end gap-1.5 relative pl-10 pb-6 pt-4">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-2 bottom-8 flex flex-col justify-between text-[9px] text-primary/40 text-right pr-2">
                          <span>200k</span><span>100k</span><span>50k</span><span>0</span>
                        </div>
                        {/* Interactive Bars */}
                        {[3, 8, 16, 38, 68, 96, 100, 88, 64, 48, 34, 22, 16, 12, 8, 6, 4, 2, 1, 1].map((h, i) => {
                          const zVal = (i * 0.1).toFixed(1);
                          const count = Math.round(h * 2000);
                          const isHovered = hoveredBarIndex === i;
                          return (
                            <div
                              key={i}
                              className="flex-1 h-full flex items-end group relative cursor-pointer"
                              onMouseEnter={() => setHoveredBarIndex(i)}
                              onMouseLeave={() => setHoveredBarIndex(null)}
                            >
                              <div
                                style={{ height: `${h}%` }}
                                className={`w-full rounded-t-sm transition-all duration-300 ${isHovered ? "bg-primary" : "bg-accent/40 group-hover:bg-accent/70"
                                  }`}
                              />
                              {isHovered && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0D1C42] border border-primary/50 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap shadow-lg z-20">
                                  z={zVal} • {count.toLocaleString()} obj
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {/* X-axis labels */}
                        <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[9px] text-primary/40 pt-1 border-t border-border">
                          <span>z=0.0</span><span>z=0.5</span><span>z=1.0</span><span>z=1.5</span><span>z=2.0</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-end gap-3 relative pl-10 pb-6 pt-4">
                        {/* Decades for ISRO */}
                        {[
                          { decade: "1970s", count: 4, label: "Aryabhata & early tests" },
                          { decade: "1980s", count: 12, label: "SLV-3 & Rohini series" },
                          { decade: "1990s", count: 24, label: "PSLV debut & IRS/INSAT" },
                          { decade: "2000s", count: 32, label: "GSLV & Chandrayaan-1" },
                          { decade: "2010s", count: 38, label: "MOM Mars, AstroSat & 104 satellites" },
                          { decade: "2020s", count: 15, label: "Chandrayaan-3, Aditya-L1" }
                        ].map((d, i) => {
                          const heightPct = (d.count / 40) * 100;
                          const isHovered = hoveredBarIndex === i;
                          return (
                            <div
                              key={i}
                              className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                              onMouseEnter={() => setHoveredBarIndex(i)}
                              onMouseLeave={() => setHoveredBarIndex(null)}
                            >
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-md transition-all duration-300 ${isHovered ? "bg-primary" : "bg-primary/50 group-hover:bg-primary/80"
                                  }`}
                              />
                              <span className="text-[10px] text-primary/70 mt-2 font-mono">{d.decade}</span>
                              {isHovered && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0D1C42] border border-primary/50 px-2.5 py-1 rounded text-[10px] text-white whitespace-nowrap shadow-xl z-20">
                                  <div className="font-medium">{d.count} Missions</div>
                                  <div className="text-[9px] text-primary/60">{d.label}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Chart: Classification breakdown */}
                  <div className="bg-background/50 border border-border rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-primary/80 font-medium mb-1">
                        {overviewMode === "cosmic" ? "Morphological Ratio" : "Mission Application"}
                      </h4>
                      <p className="text-[10px] text-primary/40">
                        {overviewMode === "cosmic" ? "Hubble + DESI classified galaxies" : "125 launches distributed by mission goal"}
                      </p>
                    </div>

                    <div className="py-4 space-y-3">
                      {overviewMode === "cosmic" ? (
                        <>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Spiral Galaxies</span>
                              <span className="text-primary font-mono">52% (4.2M)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: "52%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Elliptical Galaxies</span>
                              <span className="text-accent font-mono">28% (2.3M)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: "28%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Irregulars & Mergers</span>
                              <span className="text-primary/60 font-mono">12% (1.0M)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-primary/40 rounded-full" style={{ width: "12%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Active Galactic Nuclei (QSO)</span>
                              <span className="text-blue-400 font-mono">8% (0.6M)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-400 rounded-full" style={{ width: "8%" }} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Communication (GSAT/INSAT)</span>
                              <span className="text-primary font-mono">38 (30.4%)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: "30.4%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Earth Observation (Cartosat, RISAT)</span>
                              <span className="text-accent font-mono">36 (28.8%)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: "28.8%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Experimental / Technology</span>
                              <span className="text-primary/60 font-mono">11 (8.8%)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-primary/40 rounded-full" style={{ width: "8.8%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white">Navigation (NavIC / IRNSS)</span>
                              <span className="text-green-400 font-mono">10 (8.0%)</span>
                            </div>
                            <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 rounded-full" style={{ width: "8%" }} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex justify-between items-center text-[10px] text-primary/60">
                      <span>Source: {overviewMode === "cosmic" ? "DESI Survey DR1" : "ISRO Mission Launches CSV"}</span>
                      <Link href="/dashboard/explorer" className="text-primary hover:underline flex items-center gap-1">
                        Inspect <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* ==================== 2. DATA EXPLORER TAB ==================== */}
            {activeTab === "explorer" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">ISRO Historical Missions Explorer</h3>
                    <p className="text-xs text-primary/60">Live interactive query engine for 125 real mission records</p>
                  </div>
                  <Link
                    href="/dashboard/explorer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open Full Explorer <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input
                      type="text"
                      placeholder="Search mission name, launch vehicle, or application..."
                      value={explorerQuery}
                      onChange={(e) => setExplorerQuery(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-primary/30 outline-none focus:border-primary/50"
                    />
                  </div>

                  {/* Category Chips */}
                  <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {["All", "Communication", "Earth", "Planetary", "Navigation"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setExplorerFilter(tag)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${explorerFilter === tag
                            ? "bg-primary text-background font-medium"
                            : "bg-background/50 border border-border text-primary/60 hover:text-white"
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Table */}
                <div className="flex-1 bg-background/50 border border-border rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-background border-b border-border text-[10px] uppercase tracking-wider text-primary/60 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3 font-normal">Mission / Spacecraft</th>
                          <th className="py-2.5 px-3 font-normal">Launch Date</th>
                          <th className="py-2.5 px-3 font-normal">Vehicle</th>
                          <th className="py-2.5 px-3 font-normal">Application</th>
                          <th className="py-2.5 px-3 font-normal">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {filteredIsroData.slice(0, 7).map((row: any, i: number) => {
                          const mission = row["Launch Date"] || "Mission";
                          const date = row["Launch Vehicle"] || "-";
                          const vehicle = row["Launch Vehicle.1"] || "-";
                          const app = row["Application"] || "General";
                          const remarks = row["Remarks"] || "Launch successful";
                          const isSuccess = remarks.toLowerCase().includes("success");

                          return (
                            <tr key={i} className="hover:bg-accent/10 transition-colors">
                              <td className="py-2.5 px-3 text-white font-medium">{mission}</td>
                              <td className="py-2.5 px-3 text-primary/70 font-mono text-[11px]">{date}</td>
                              <td className="py-2.5 px-3 text-primary/90 font-mono text-[11px]">{vehicle}</td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded bg-accent/20 text-primary border border-accent/30 text-[10px]">
                                  {app}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${isSuccess
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                  }`}>
                                  {isSuccess && <CheckCircle2 className="w-2.5 h-2.5" />}
                                  {remarks}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 border-t border-border bg-background/30 flex justify-between items-center text-[10px] text-primary/60">
                    <span>Showing top {Math.min(7, filteredIsroData.length)} of {filteredIsroData.length} records in demo console</span>
                    <Link href="/dashboard/explorer" className="text-primary hover:underline">
                      Explore all 125 records & export CSV →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 3. AI ANALYSIS TAB ==================== */}
            {activeTab === "ai" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col"
              >
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">Deep Learning Cosmological Inference</h3>
                    <p className="text-xs text-primary/60">Neural regression for spectroscopic data and dark energy constraints</p>
                  </div>
                  <Link
                    href="/dashboard/ai-analysis"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open AI Scientist <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                  {/* Left Setup */}
                  <div className="bg-background/50 border border-border rounded-xl p-5 space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-primary/60 block mb-1">
                        Select Neural Architecture
                      </label>
                      <select
                        value={selectedAiModel}
                        onChange={(e) => setSelectedAiModel(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary/50"
                      >
                        <option>DESI Redshift Regressor (ResNet-1D)</option>
                        <option>Gravitational Lensing Anomaly Detector</option>
                        <option>Cosmological Parameter Fit (w0, wa)</option>
                        <option>ISRO Mission Success Predictor</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-primary/60 block mb-1">
                        Target Sample Size
                      </label>
                      <div className="text-xs text-white font-mono bg-background px-3 py-2 rounded-lg border border-border">
                        50,000 Spectroscopic Flux Vectors
                      </div>
                    </div>

                    <button
                      onClick={handleTriggerAiAnalysis}
                      disabled={aiRunning}
                      className="w-full py-2.5 rounded-lg bg-primary text-background font-medium text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {aiRunning ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" />
                          Processing Tensors...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Model Inference
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Output Display */}
                  <div className="md:col-span-2 bg-background/50 border border-border rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs uppercase tracking-widest text-primary/80 font-medium">
                          Inference Stream
                        </span>
                        <span className="text-[10px] font-mono text-green-400">
                          {aiRunning ? "RUNNING COMPUTATION" : aiCompleted ? "CONVERGED (χ² = 1.04)" : "READY FOR INFERENCE"}
                        </span>
                      </div>

                      {aiRunning ? (
                        <div className="space-y-4 py-8">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-primary/70">
                              <span>Computing multi-head self-attention</span>
                              <span className="font-mono">72%</span>
                            </div>
                            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "10%" }}
                                animate={{ width: "95%" }}
                                transition={{ duration: 1.6 }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-primary/60 font-mono">
                            &gt; Validating spectral continuum across 3600Å - 9800Å ...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-card border border-border rounded-lg p-3">
                              <div className="text-[10px] uppercase text-primary/60">Confidence</div>
                              <div className="text-xl font-light text-white">98.7%</div>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-3">
                              <div className="text-[10px] uppercase text-primary/60">Redshift Error σz</div>
                              <div className="text-xl font-light text-primary">0.0004</div>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-3">
                              <div className="text-[10px] uppercase text-primary/60">Anomaly Score</div>
                              <div className="text-xl font-light text-white">0.012</div>
                            </div>
                          </div>

                          <div className="p-3 bg-card border border-border rounded-lg text-xs space-y-2">
                            <div className="text-white font-medium flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              Model Diagnostic Result:
                            </div>
                            <p className="text-primary/70 font-light leading-relaxed">
                              "Strong Lyman-alpha and [O III] emission lines successfully identified at z = 0.6234 ± 0.0003. Flux calibration conforms to standard synthetic photometry benchmarks."
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] text-primary/60">
                      <span>PyTorch / JAX execution backend</span>
                      <Link href="/dashboard/ai-analysis" className="text-primary hover:underline">
                        Open advanced training parameters →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 4. VISION TAB ==================== */}
            {activeTab === "vision" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">Vision Transformer Celestial Inspector</h3>
                    <p className="text-xs text-primary/60">Morphological feature detection and automated anomaly tagging</p>
                  </div>
                  <Link
                    href="/dashboard/vision"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open Vision Studio <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Target switcher */}
                <div className="flex gap-2">
                  {[
                    { id: "jwst", name: "JWST Deep Field (SMACS 0723)" },
                    { id: "andromeda", name: "Andromeda Spiral (NGC 224)" },
                    { id: "cartwheel", name: "Cartwheel Ring Galaxy" },
                  ].map((target) => (
                    <button
                      key={target.id}
                      onClick={() => setSelectedImageTarget(target.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedImageTarget === target.id
                          ? "bg-primary text-background font-medium"
                          : "bg-background/50 border border-border text-primary/60 hover:text-white"
                        }`}
                    >
                      {target.name}
                    </button>
                  ))}
                </div>

                {/* Visual Canvas Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                  <div className="md:col-span-2 relative rounded-xl border border-border overflow-hidden min-h-[260px] bg-black">
                    <img
                      src={
                        selectedImageTarget === "jwst"
                          ? "/images/jwst.jpg"
                          : selectedImageTarget === "andromeda"
                            ? "/images/gaia.jpg"
                            : "/images/desi.jpg"
                      }
                      alt="Astronomical Target"
                      className="w-full h-full object-cover opacity-85"
                    />

                    {/* Simulated Vision Bounding Box */}
                    <div className="absolute top-1/4 left-1/3 w-36 h-36 border-2 border-primary/80 rounded-lg pointer-events-none animate-pulse flex flex-col justify-between p-1.5">
                      <span className="text-[9px] bg-primary text-background px-1.5 py-0.5 rounded font-mono font-bold self-start">
                        {selectedImageTarget === "jwst" ? "Gravitational Arc (z=1.8)" : "Bulge Core (Sb)"}
                      </span>
                      <span className="text-[9px] text-white/80 font-mono self-end">Conf: 99.1%</span>
                    </div>
                  </div>

                  {/* Feature Breakdown */}
                  <div className="bg-background/50 border border-border rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-primary/80 font-medium mb-3">
                        Extracted Visual Tokens
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-primary/60">Morphology Class</span>
                          <span className="text-white font-medium">Spiral (Type Sb)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-primary/60">Bulge-to-Disk Ratio</span>
                          <span className="text-white font-mono">0.42</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-primary/60">Dust Lane Density</span>
                          <span className="text-white font-mono">High (84%)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-primary/60">Star Forming Knots</span>
                          <span className="text-green-400 font-mono">14 detected</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/vision"
                      className="w-full py-2 bg-primary/10 border border-primary/30 text-primary text-xs uppercase tracking-widest hover:bg-primary/20 transition-colors rounded-lg text-center block"
                    >
                      Upload Custom FITS / TIFF File →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 5. ASK COSMO TAB ==================== */}
            {activeTab === "ask" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 flex-1 flex flex-col h-full"
              >
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">Ask COSMO AI Terminal</h3>
                    <p className="text-xs text-primary/60">Cosmological Q&A trained on arXiv astrophysical preprints & mission telemetry</p>
                  </div>
                  <Link
                    href="/dashboard/ask"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open Full Assistant <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Prompt Suggestions */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    "What did DESI discover at z ≈ 0.62?",
                    "Summarize ISRO Chandrayaan-3 and Aditya-L1 launches",
                    "How does Dark Energy equation of state w(z) vary?"
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPrompt(p)}
                      className="px-3 py-1 rounded-full bg-background/60 border border-border text-[11px] text-primary/80 hover:text-white hover:border-primary/40 whitespace-nowrap transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Chat Stream Window */}
                <div className="flex-1 bg-background/50 border border-border rounded-xl p-4 overflow-y-auto space-y-3 min-h-[220px] max-h-[320px]">
                  {askHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 text-xs ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 text-[10px]">
                          AI
                        </div>
                      )}
                      <div className={`p-3 rounded-xl max-w-lg leading-relaxed ${msg.role === "user"
                          ? "bg-primary text-background font-medium rounded-tr-none"
                          : "bg-card border border-border text-white rounded-tl-none font-light"
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {askLoading && (
                    <div className="flex items-center gap-2 text-xs text-primary/60">
                      <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      COSMO AI is analyzing cosmological research papers...
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    placeholder="Ask any cosmology or astronomy question..."
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-xs text-white placeholder:text-primary/30 outline-none focus:border-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={askLoading || !askInput.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-background text-xs font-semibold hover:bg-white transition-all disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </motion.div>
            )}

            {/* ==================== 6. SIMULATIONS & UNIVERSE TAB ==================== */}
            {(activeTab === "simulations" || activeTab === "universe") && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col"
              >
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">Cosmic Expansion & Universe Dynamics</h3>
                    <p className="text-xs text-primary/60">Adjust cosmological parameters in real-time to compute the fate of the cosmos</p>
                  </div>
                  <Link
                    href={activeTab === "simulations" ? "/dashboard/simulations" : "/dashboard/universe"}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open {activeTab === "simulations" ? "Simulations" : "3D Universe"} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Sliders */}
                  <div className="bg-background/50 border border-border rounded-xl p-5 space-y-5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white font-medium">Matter Density (Ωm)</span>
                        <span className="font-mono text-primary">{omegaM.toFixed(3)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={omegaM}
                        onChange={(e) => setOmegaM(parseFloat(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white font-medium">Dark Energy Density (ΩΛ)</span>
                        <span className="font-mono text-accent">{omegaLambda.toFixed(3)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={omegaLambda}
                        onChange={(e) => setOmegaLambda(parseFloat(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white font-medium">Hubble Constant (H0)</span>
                        <span className="font-mono text-blue-400">{h0.toFixed(1)} km/s/Mpc</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="90"
                        step="0.5"
                        value={h0}
                        onChange={(e) => setH0(parseFloat(e.target.value))}
                        className="w-full accent-blue-400 cursor-pointer"
                      />
                    </div>

                    <button
                      onClick={() => { setOmegaM(0.315); setOmegaLambda(0.685); setH0(67.4); }}
                      className="px-3 py-1.5 rounded bg-background border border-border text-xs text-primary/70 hover:text-white transition-colors"
                    >
                      Reset to Planck 2018 Standard
                    </button>
                  </div>

                  {/* Dynamic Simulation Result Card */}
                  <div className="bg-background/50 border border-border rounded-xl p-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="text-[10px] uppercase tracking-widest text-primary/60">
                        Computed Metric & Fate
                      </div>
                      <div className="text-xl font-light text-white">
                        {universeFate}
                      </div>

                      <div className="space-y-2 text-xs border-t border-border/40 pt-4">
                        <div className="flex justify-between">
                          <span className="text-primary/60">Total Density Ω_tot:</span>
                          <span className="text-white font-mono">{totalOmega.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary/60">Deceleration Parameter q0:</span>
                          <span className="text-primary font-mono">{((omegaM / 2) - omegaLambda).toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary/60">Age of the Universe:</span>
                          <span className="text-white font-mono">{(13.8 * (67.4 / h0)).toFixed(2)} Billion Years</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/simulations"
                      className="w-full py-2.5 bg-primary text-background font-medium text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-colors text-center block mt-4"
                    >
                      Launch N-Body Hydrodynamical Simulation →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== 7. RESEARCH TAB ==================== */}
            {activeTab === "research" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg text-white font-medium">Research Projects & Notebooks</h3>
                    <p className="text-xs text-primary/60">Organize saved queries, cross-matches, and analytical notes</p>
                  </div>
                  <Link
                    href="/dashboard/research"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open Research Workspace <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  {[
                    { title: "Hubble Tension Analysis (SH0ES vs Planck)", type: "Notebook", updated: "Today", stars: "4.9k" },
                    { title: "DESI DR1 + GAIA Cross-Match Pipeline", type: "Dataset", updated: "Yesterday", stars: "3.2k" },
                    { title: "ISRO Lunar South Pole Trajectory Fit", type: "Analysis", updated: "Oct 12", stars: "1.8k" },
                  ].map((doc, i) => (
                    <div key={i} className="bg-background/50 border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="px-2 py-0.5 rounded bg-accent/20 text-primary border border-accent/30 text-[10px] uppercase font-mono">
                            {doc.type}
                          </span>
                          <span className="text-[10px] text-primary/40">{doc.updated}</span>
                        </div>
                        <h4 className="text-sm text-white font-medium mb-2">{doc.title}</h4>
                      </div>
                      <Link
                        href="/dashboard/research"
                        className="text-xs text-primary hover:text-white flex items-center gap-1 mt-4"
                      >
                        Open Project <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
