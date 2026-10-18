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
  Box,
  Globe2,
  Library,
  CheckCircle2,
  X,
  ChevronRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_TITLES: Record<string, { title: string, subtitle: string }> = {
  "/dashboard": { title: "Cosmology Overview", subtitle: "Explore, analyze and understand astronomical data." },
  "/dashboard/explorer": { title: "Cosmological Data Explorer", subtitle: "Access and query petabytes of astronomical data." },
  "/dashboard/ai-analysis": { title: "AI Data Scientist", subtitle: "Run advanced deep learning models on datasets." },
  "/dashboard/vision": { title: "Vision AI", subtitle: "Analyze deep space imagery with Vision Transformers." },
  "/dashboard/ask": { title: "Ask COSMO AI", subtitle: "Your personal cosmological research assistant." },
  "/dashboard/universe": { title: "3D Universe", subtitle: "Interactive cosmic visualization and mapping." },
  "/dashboard/research": { title: "Research Workspace", subtitle: "Organize your findings, saved queries and datasets." },
};

const SEARCH_ITEMS = [
  { title: "ISRO Historical Mission Launches", category: "Dataset (125 Launches)", href: "/dashboard/explorer", icon: <Database size={16} /> },
  { title: "DESI Spectroscopic Survey DR1", category: "Dataset (2.1M Galaxies)", href: "/dashboard/explorer", icon: <Database size={16} /> },
  { title: "GAIA DR3 Astrometry Catalog", category: "Dataset (1.8B Stars)", href: "/dashboard/explorer", icon: <Database size={16} /> },
  { title: "Deep Learning Redshift Regressor", category: "AI Tool", href: "/dashboard/ai-analysis", icon: <BrainCircuit size={16} /> },
  { title: "Vision Transformer Galaxy Morphology", category: "Vision Tool", href: "/dashboard/vision", icon: <ScanEye size={16} /> },
  { title: "Dark Energy Equation of State w(z)", category: "Assistant Query", href: "/dashboard/ask", icon: <MessageSquare size={16} /> },
  { title: "3D Cosmic Web & Filament Map", category: "3D Universe", href: "/dashboard/universe", icon: <Globe2 size={16} /> },
  { title: "Hubble Tension (H0) Research Notebook", category: "Research Workspace", href: "/dashboard/research", icon: <Library size={16} /> },
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
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-[#263F78]/30 flex items-center justify-between px-8 sticky top-0 z-40">

      {/* Title Area */}
      <div className="flex flex-col">
        <h1 className="text-xl font-light text-white tracking-wide">{title}</h1>
        <p className="text-xs text-primary/60 font-light tracking-wide">{subtitle}</p>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-8 relative">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary/40 group-hover:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            readOnly
            value={searchQuery}
            placeholder="Search datasets, objects, analyses..."
            className="w-full bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-full py-2.5 pl-11 pr-14 text-sm text-white placeholder:text-primary/30 outline-none group-hover:border-primary/50 group-hover:bg-[#0D1C42] transition-all font-light cursor-pointer"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] uppercase font-mono text-primary/40 border border-[#263F78]/30 rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6 relative">

        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5" title="Latency: 14ms • Compute: 8 GPU Nodes Operational">
          <Activity size={14} className="text-green-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-green-400/80">Systems Operational</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="relative w-10 h-10 rounded-full hover:bg-[#263F78]/20 flex items-center justify-center text-primary/60 hover:text-primary transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Tray */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-[#0D1C42] border border-[#263F78] rounded-xl shadow-2xl p-4 z-50 overflow-hidden"
              >
                <div className="flex justify-between items-center pb-3 border-b border-[#263F78]/30 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white tracking-wide">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary text-background font-bold font-mono">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] uppercase tracking-wider text-primary/70 hover:text-primary transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition-colors ${n.read ? "bg-background/20 border-transparent text-primary/60" : "bg-background/50 border-[#263F78]/50 text-white"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-white">{n.title}</span>
                        <span className="text-[9px] text-primary/40 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-primary/70 leading-relaxed font-light">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 mt-3 border-t border-[#263F78]/30 flex justify-between items-center text-[10px] text-primary/50">
                  <span>COSMO Realtime Ingestion</span>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-primary hover:underline"
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
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="bg-[#0D1C42] border border-[#263F78] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Search Input Bar */}
              <div className="p-4 border-b border-[#263F78]/40 flex items-center gap-3 bg-background/30">
                <Search size={18} className="text-primary" />
                <input
                  ref={searchInputRef}
                  autoFocus
                  type="text"
                  placeholder="Type a command, dataset name, or tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-primary/40 outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded text-primary/40 hover:text-white"
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
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#263F78]/30 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#263F78]/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-primary/50 uppercase tracking-widest font-mono">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-primary/40">
                    No matching datasets or tools found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>

              {/* Footer hints */}
              <div className="p-3 bg-background/50 border-t border-[#263F78]/30 flex justify-between items-center text-[10px] text-primary/50">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#263F78]/30 font-mono">↑↓</span> to navigate
                  <span className="px-1.5 py-0.5 rounded bg-[#263F78]/30 font-mono">↵</span> to select
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#263F78]/30 font-mono">ESC</span> to exit
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
}
