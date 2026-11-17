"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  Compass,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  CheckCircle2,
  Terminal,
  Radio,
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const wasDenied = searchParams.get("denied") === "1";

  // Auth Modes: "credentials" (Email + Password) or "passkey" (Mission Access Token)
  const [authMode, setAuthMode] = useState<"credentials" | "passkey">("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passkey, setPasskey] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showRefGuide, setShowRefGuide] = useState(false);

  useEffect(() => {
    if (wasDenied) {
      setErrorMessage(
        "Access Denied: Authentication required. You must have verified scientific clearance to access the COSMO AI Observatory."
      );
    }
  }, [wasDenied]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload =
        authMode === "passkey"
          ? { authType: "passkey", passkey: passkey.trim() }
          : { authType: "credentials", email: email.trim(), password: password.trim() };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Access Denied: Invalid credentials.");
        setIsLoading(false);
        return;
      }

      // Success
      setSuccessMessage(data?.message || "Clearance Verified. Entering Observatory...");
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Network error: Unable to contact authentication gateway. Please retry.");
      setIsLoading(false);
    }
  };

  const handleQuickFill = (type: "lead" | "passkey") => {
    setErrorMessage(null);
    if (type === "lead") {
      setAuthMode("credentials");
      setEmail("shruti@cosmo.ai");
      setPassword("CosmoDeepSpace2026!");
    } else {
      setAuthMode("passkey");
      setPasskey("ISRO-COSMO-XSPECT-2026");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#03091e]/90 border backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(56,189,248,0.12)] relative overflow-hidden transition-all duration-300 ${
        errorMessage
          ? "border-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.2)]"
          : "border-cyan-500/25"
      }`}
    >
      {/* Top subtle decorative beam */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-500 ${
          errorMessage
            ? "bg-gradient-to-r from-transparent via-red-500 to-transparent"
            : successMessage
            ? "bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        }`}
      />

      {/* Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Restricted Observatory Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-2">
          Sign In to{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400">
            COSMO AI
          </span>
        </h1>
        <p className="text-xs text-slate-300/70 font-light">
          Authenticate with verified researcher credentials or mission telemetry passkey to enter.
        </p>
      </div>

      {/* Authentication Mode Switcher */}
      <div className="flex rounded-xl bg-black/50 p-1 border border-white/10 mb-5 text-xs font-mono">
        <button
          type="button"
          onClick={() => {
            setAuthMode("credentials");
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
            authMode === "credentials"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Researcher ID</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("passkey");
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
            authMode === "passkey"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Mission Passkey</span>
        </button>
      </div>

      {/* Error Alert Box */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            role="alert"
            className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-red-200 text-xs shadow-lg"
          >
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <span className="font-semibold text-red-300 block mb-0.5">Access Denied</span>
              <p className="text-[11px] leading-relaxed text-red-200/90 font-light">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification Box */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5 text-emerald-200 text-xs shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-mono">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === "credentials" ? (
          <>
            <div>
              <label
                htmlFor="researcher-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Researcher Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="researcher-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shruti@cosmo.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/45 border border-white/10 focus:border-cyan-400/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-light"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="researcher-password"
                  className="block text-[11px] font-mono uppercase tracking-wider text-slate-300"
                >
                  Password / Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setShowRefGuide((prev) => !prev)}
                  className="text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors font-mono"
                >
                  {showRefGuide ? "Hide Access Info" : "Need Access Info?"}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="researcher-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/45 border border-white/10 focus:border-cyan-400/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="mission-passkey"
                className="block text-[11px] font-mono uppercase tracking-wider text-slate-300"
              >
                Mission Access Passkey
              </label>
              <button
                type="button"
                onClick={() => setShowRefGuide((prev) => !prev)}
                className="text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors font-mono"
              >
                {showRefGuide ? "Hide Keys" : "View Keys"}
              </button>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="mission-passkey"
                type="text"
                required
                autoComplete="off"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="e.g. ISRO-COSMO-XSPECT-2026"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/45 border border-white/10 focus:border-cyan-400/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400/70 font-mono">
              Enter your cryptographically registered mission token (e.g. ISRO, DESI, or Chandra).
            </p>
          </div>
        )}

        {/* Collapsible Verified Credentials Drawer */}
        <AnimatePresence>
          {showRefGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-[#081530] border border-cyan-400/30 text-[11px] space-y-2 text-slate-300 font-mono shadow-inner overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-medium pb-1 border-b border-cyan-400/20">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Authorized Observatory Credentials</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div>
                    <span className="text-white font-semibold">Lead Investigator:</span>{" "}
                    <span className="text-cyan-200">shruti@cosmo.ai</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("lead")}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[9px] uppercase tracking-wider"
                  >
                    Auto-Fill
                  </button>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-white font-semibold">ISRO Passkey:</span>{" "}
                    <span className="text-cyan-200">ISRO-COSMO-XSPECT-2026</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("passkey")}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[9px] uppercase tracking-wider"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 italic pt-1">
                Note: Random unauthorized inputs will be rejected by the security gateway.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit / Proceed Button */}
        <button
          type="submit"
          disabled={isLoading || !!successMessage}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.65)] cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Verifying Telemetry Clearance...</span>
            </div>
          ) : successMessage ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Clearance Granted</span>
            </div>
          ) : (
            <>
              <span>Authorize & Enter Observatory</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-mono text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>TLS-256 HMAC Encrypted</span>
        </span>
        <button
          type="button"
          onClick={() => setShowRefGuide((prev) => !prev)}
          className="text-cyan-300/80 hover:text-cyan-200 transition-colors underline font-mono text-[10px]"
        >
          {showRefGuide ? "Close Reference" : "Credentials Reference"}
        </button>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
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
      <main className="relative z-10 flex items-center justify-center px-4 py-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md p-10 rounded-3xl bg-[#03091e]/85 border border-cyan-500/25 flex flex-col items-center justify-center text-cyan-400 gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Initializing Quantum Telemetry Gate...</span>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-500 font-mono">
        COSMO AI PLATFORM • RESTRICTED SCIENTIFIC DATA GATEWAY • STRICT ACCESS ENFORCED
      </footer>
    </div>
  );
}
