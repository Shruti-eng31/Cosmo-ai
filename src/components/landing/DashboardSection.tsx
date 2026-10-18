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

  return
}
