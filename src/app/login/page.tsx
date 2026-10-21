"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lock, Mail, KeyRound, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate instant authentic authorization into the cosmology workspace
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#010414] text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Dynamic Cosmic Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/15 blur-[150px] rounded-full" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(56, 189, 248, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.2) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
            maskImage: "radial-gradient(circle at center, black 40%, transparent 85%)",
          }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 p-6 sm:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="COSMO AI Logo"
            className="w-8 h-8 rounded-full border border-cyan-400/40 object-cover group-hover:rotate-90 transition-transform duration-500"
          />
          <span className="text-xl font-light tracking-[0.2em] text-white">
            COSMO <span className="font-semibold text-cyan-300">AI</span>
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono tracking-widest uppercase text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4" />
          <span>Back to Landing</span>
        </Link>
      </header>

      {/* Main Glassmorphic Login Container */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#03091e]/85 border border-cyan-500/25 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.15)] relative overflow-hidden"
        >
          {/* Top subtle decorative beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Astrophysics Workspace</span>
            </div>
            <h1 className="text-3xl font-light tracking-wide text-white mb-2">
              Sign In to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400">COSMO AI</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/70 font-light">
              Enter your research credentials or proceed directly to enter the telemetry console.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Researcher Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@cosmology.org"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-light"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                  Password / Passkey
                </label>
                <a href="#" className="text-[11px] text-cyan-400/70 hover:text-cyan-300 transition-colors">
                  Forgot key?
                </a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-light"
                />
              </div>
            </div>

            {/* Quick Demo Bypass Hint */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/80 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Demo Mode: Click "Sign In" to proceed to Dashboard.</span>
            </div>

            {/* Submit / Proceed Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Telescope Access...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center pt-6 border-t border-white/10 text-xs text-slate-400">
            <span>New observatory team? </span>
            <a href="#" className="text-cyan-300 hover:underline">
              Request API Key
            </a>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-500 font-mono">
        COSMO AI PLATFORM • SECURE SCIENTIFIC DATA GATEWAY
      </footer>
    </div>
  );
}
