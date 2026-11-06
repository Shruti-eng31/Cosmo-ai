"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  ScanEye,
  MessageSquare,
  Globe2,
  Library,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles
} from "lucide-react";

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/dashboard" },
  { icon: <BrainCircuit size={18} />, label: "AI Analysis", href: "/dashboard/ai-analysis" },
  { icon: <ScanEye size={18} />, label: "Image Analysis", href: "/dashboard/vision" },
  { icon: <MessageSquare size={18} />, label: "Ask COSMO AI", href: "/dashboard/ask" },
  { icon: <Globe2 size={18} />, label: "3D Universe", href: "/dashboard/universe" },
  { icon: <Library size={18} />, label: "Research", href: "/dashboard/research" },
  { icon: <Sparkles size={18} />, label: "Fun Facts", href: "/dashboard/fun-facts" },
];

const BOTTOM_NAV_ITEMS = [
  { icon: <Library size={17} />, label: "Documentation", href: "/dashboard/docs" },
  { icon: <Settings size={17} />, label: "Settings", href: "/dashboard/settings" },
  { icon: <HelpCircle size={17} />, label: "Help", href: "/dashboard/help" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#030712]/50 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col shrink-0 shadow-[4px_0_30px_rgba(0,0,0,0.6)] z-20">

      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.07] bg-white/[0.01]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="COSMO AI Logo" 
              className="w-8 h-8 object-cover rounded-full group-hover:scale-105 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(245,230,195,0.25)]" 
            />
            <div className="absolute inset-0 rounded-full bg-[#FFF3CF]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium tracking-widest text-white text-base group-hover:text-[#FFF3CF] transition-colors">
              COSMO <span className="font-light text-[#FFF3CF]/80">AI</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#FFF3CF]/40 font-mono -mt-0.5">
              Deep Space Studio
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300 border ${
                isActive
                  ? "bg-white/[0.08] text-[#FFF3CF] border-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] font-medium"
                  : "text-white/60 border-transparent hover:bg-white/[0.04] hover:text-[#FFF3CF] hover:border-white/[0.06]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-[#FFF3CF] to-[#F5E6C3] rounded-r-full shadow-[0_0_12px_rgba(255,243,207,0.7)]"
                />
              )}
              <div className={`transition-colors ${isActive ? "text-[#FFF3CF]" : "text-white/50 group-hover:text-white"}`}>
                {item.icon}
              </div>
              <span className="tracking-wide text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav Items */}
      <div className="p-3 border-t border-white/[0.07] space-y-1 bg-white/[0.01]">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-white/50 hover:bg-white/[0.04] hover:text-[#FFF3CF] transition-all"
          >
            <div className="text-white/40">{item.icon}</div>
            <span className="font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile Card */}
      <div className="p-3 m-3 mt-0 border border-white/[0.08] rounded-xl bg-white/[0.02] backdrop-blur-md flex items-center gap-3 cursor-pointer hover:border-white/[0.18] hover:bg-white/[0.05] transition-all shadow-sm group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-sky-500/20 border border-white/10 flex items-center justify-center text-[#FFF3CF] font-medium text-xs shrink-0 shadow-inner">
          SS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white truncate group-hover:text-[#FFF3CF] transition-colors">Dr. Shruti Singh</div>
          <div className="text-[9px] text-[#FFF3CF]/50 uppercase tracking-widest truncate font-mono">Astrophysicist</div>
        </div>
        <LogOut size={15} className="text-white/40 hover:text-[#FFF3CF] transition-colors shrink-0" />
      </div>

    </aside>
  );
}
