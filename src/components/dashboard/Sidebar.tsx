"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  ScanEye,
  MessageSquare,
  Globe2,
  Box,
  Library,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/dashboard" },
  { icon: <Database size={20} />, label: "Data Explorer", href: "/dashboard/explorer" },
  { icon: <BrainCircuit size={20} />, label: "AI Analysis", href: "/dashboard/ai-analysis" },
  { icon: <ScanEye size={20} />, label: "Image Analysis", href: "/dashboard/vision" },
  { icon: <MessageSquare size={20} />, label: "Ask COSMO AI", href: "/dashboard/ask" },
  { icon: <Box size={20} />, label: "Simulations", href: "/dashboard/simulations" },
  { icon: <Globe2 size={20} />, label: "3D Universe", href: "/dashboard/universe" },
  { icon: <Library size={20} />, label: "Research", href: "/dashboard/research" },
];

const BOTTOM_NAV_ITEMS = [
  { icon: <Library size={20} />, label: "Documentation", href: "/dashboard/docs" },
  { icon: <Settings size={20} />, label: "Settings", href: "/dashboard/settings" },
  { icon: <HelpCircle size={20} />, label: "Help", href: "/dashboard/help" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0D1C42] border-r border-[#263F78] flex flex-col shrink-0">

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-[#263F78]/50">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="COSMO AI Logo" className="w-8 h-8 object-cover rounded-full" />
          <span className="font-medium tracking-widest text-white text-lg">COSMO AI</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive
                  ? "bg-[#263F78]/50 text-[#FFF3CF]"
                  : "text-[#FFF3CF]/60 hover:bg-[#263F78]/20 hover:text-[#FFF3CF]"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFF3CF] rounded-r-full"
                />
              )}
              {item.icon}
              <span className="font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="p-4 border-t border-[#263F78]/50 space-y-1">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#FFF3CF]/50 hover:bg-[#263F78]/20 hover:text-[#FFF3CF]/80 transition-colors"
          >
            {item.icon}
            <span className="font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 m-4 mt-0 border border-[#263F78]/40 rounded-xl bg-background/30 flex items-center gap-3 cursor-pointer hover:border-[#263F78] hover:bg-background/50 transition-all">
        <div className="w-10 h-10 rounded-lg bg-[#263F78]/50 flex items-center justify-center text-primary font-medium shrink-0">
          SS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">Dr. Shruti Singh</div>
          <div className="text-[10px] text-primary/50 uppercase tracking-widest truncate">Astrophysicist</div>
        </div>
        <LogOut size={16} className="text-primary/40 hover:text-primary transition-colors shrink-0" />
      </div>

    </aside>
  );
}
