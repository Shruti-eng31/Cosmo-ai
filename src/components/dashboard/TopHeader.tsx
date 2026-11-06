"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Activity,
  Database,
  BrainCircuit,
  ScanEye,
  MessageSquare,
  Globe2,
  Library,
  Sparkles,
  X,
  ChevronRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_TITLES: Record<string, { title: string, subtitle: string }> = {
  "/dashboard": { title: "Cosmology Overview", subtitle: "Realtime astrophysical data and mission metrics." },
  "/dashboard/ai-analysis": { title: "AI Data Scientist", subtitle: "Deep learning models, ISRO telemetry and redshift estimators." },
  "/dashboard/vision": { title: "Vision AI & Morphology", subtitle: "Analyze deep space imagery with Vision Transformers." },
  "/dashboard/ask": { title: "Ask COSMO AI", subtitle: "Your personal cosmological research assistant." },
  "/dashboard/universe": { title: "3D Universe Observatory", subtitle: "Interactive cosmic visualization and logarithmic spiral mapping." },
  "/dashboard/research": { title: "Research Workspace", subtitle: "Organize your findings, saved queries and datasets." },
  "/dashboard/fun-facts": { title: "Cosmic Curiosities", subtitle: "Mind-bending astrophysics realities across space and time." },
  "/dashboard/docs": { title: "Platform Documentation", subtitle: "Observational APIs, schemas, and model zoo references." },
  "/dashboard/settings": { title: "Workspace Settings", subtitle: "Compute clusters, tensor precision, and memory cache." },
  "/dashboard/help": { title: "Help & Support", subtitle: "Scientific queries, documentation guides and direct assistance." },
};

const SEARCH_ITEMS = [
  { title: "ISRO Historical Mission Launches", category: "Dataset (125 Launches)", href: "/dashboard/ai-analysis", icon: <Database size={16} /> },
  { title: "DESI Spectroscopic Survey DR1", category: "Dataset (2.1M Galaxies)", href: "/dashboard", icon: <Database size={16} /> },
  { title: "GAIA DR3 Astrometry Catalog", category: "Dataset (1.8B Stars)", href: "/dashboard/universe", icon: <Database size={16} /> },
  { title: "Deep Learning Redshift Regressor", category: "AI Tool", href: "/dashboard/ai-analysis", icon: <BrainCircuit size={16} /> },
  { title: "Vision Transformer Galaxy Morphology", category: "Vision Tool", href: "/dashboard/vision", icon: <ScanEye size={16} /> },
  { title: "Dark Energy Equation of State w(z)", category: "Assistant Query", href: "/dashboard/ask", icon: <MessageSquare size={16} /> },
  { title: "3D Cosmic Web & Filament Map", category: "3D Universe", href: "/dashboard/universe", icon: <Globe2 size={16} /> },
  { title: "Hubble Tension (H0) Research Notebook", category: "Research Workspace", href: "/dashboard/research", icon: <Library size={16} /> },
  { title: "Cosmic Microwave Background Curiosities", category: "Fun Facts", href: "/dashboard/fun-facts", icon: <Sparkles size={16} /> },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { title, subtitle } = PAGE_TITLES[pathname] || { title: "Dashboard", subtitle: "Scientific workspace" };

  // Search Palette State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "DESI DR1 Batch Synced", message: "2,100,000 spectroscopic redshift coordinates cached to local metadata DB.", time: "10m ago", read: false },
    { id: "2", title: "ISRO Launch Catalogue Active", message: "125 historical missions loaded into Data Explorer for instant querying.", time: "42m ago", read: false },
    { id: "3", title: "AI Model Ingestion", message: "ResNet-1D redshift estimator model weights updated to checkpoint v2.4.", time: "2h ago", read: true },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter search items
  const filteredSearchItems = SEARCH_ITEMS.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectSearchItem = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <header className="h-20 bg-[#030712]/45 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">

      {/* Title Area */}
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-light text-white tracking-wide flex items-center gap-2">
          {title}
        </h1>
        <p className="text-[11px] text-[#FFF3CF]/60 font-light tracking-wide">{subtitle}</p>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-6 md:mx-8 relative hidden sm:block">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 group-hover:text-[#FFF3CF] transition-colors">
            <Search size={15} />
          </div>
          <input
            type="text"
            readOnly
            value={searchQuery}
            placeholder="Search datasets, celestial objects, analyses..."
            className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.09] group-hover:border-white/[0.22] rounded-full py-2 pl-10 pr-14 text-xs text-white placeholder:text-white/35 outline-none transition-all font-light cursor-pointer backdrop-blur-md shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[9px] uppercase font-mono text-white/40 border border-white/[0.1] bg-white/[0.04] rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 relative">

        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 backdrop-blur-md shadow-sm" title="Latency: 14ms • Compute: 8 GPU Nodes Operational">
          <Activity size={13} className="text-emerald-400 animate-pulse" />
          <span className="text-[9px] uppercase tracking-widest text-emerald-300 font-mono">Systems Operational</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="relative w-9 h-9 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-white/70 hover:text-[#FFF3CF] transition-all backdrop-blur-md shadow-sm"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Tray */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 md:w-88 bg-[#050B1B]/85 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 z-50 overflow-hidden"
              >
                <div className="flex justify-between items-center pb-3 border-b border-white/[0.08] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white tracking-wide">Cosmic Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FFF3CF] text-slate-950 font-bold font-mono">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] uppercase tracking-wider text-[#FFF3CF]/70 hover:text-[#FFF3CF] transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        n.read 
                          ? "bg-white/[0.02] border-white/[0.04] text-white/50" 
                          : "bg-white/[0.06] border-white/[0.12] text-white shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-white">{n.title}</span>
                        <span className="text-[9px] text-white/40 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-white/70 leading-relaxed font-light">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.08] flex justify-between items-center text-[10px] text-white/50 font-mono">
                  <span>COSMO Realtime Ingestion</span>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[#FFF3CF] hover:underline"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Command Palette / Quick Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="bg-[#060D20]/85 backdrop-blur-2xl border border-white/[0.14] rounded-2xl max-w-xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
            >
              {/* Search Input Bar */}
              <div className="p-4 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.02]">
                <Search size={18} className="text-[#FFF3CF]" />
                <input
                  ref={searchInputRef}
                  autoFocus
                  type="text"
                  placeholder="Type a command, dataset name, or tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Results List */}
              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchItem(item.href)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.07] border border-transparent hover:border-white/[0.08] transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FFF3CF] group-hover:bg-[#FFF3CF] group-hover:text-slate-950 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-[#FFF3CF] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-white/45 uppercase tracking-widest font-mono">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-white/40 group-hover:text-[#FFF3CF] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-white/40">
                    No matching datasets or tools found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>

              {/* Footer hints */}
              <div className="p-3 bg-white/[0.02] border-t border-white/[0.08] flex justify-between items-center text-[10px] text-white/40 font-mono">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1]">↑↓</span> to navigate
                  <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1]">↵</span> to select
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1]">ESC</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}
