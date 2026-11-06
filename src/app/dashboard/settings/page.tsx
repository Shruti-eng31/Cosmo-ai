"use client";

import { useState } from "react";
import { Settings, Sliders, Database, Bell, Shield, Cpu, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [gpuAllocation, setGpuAllocation] = useState("8x NVIDIA H100");
  const [telemetrySync, setTelemetrySync] = useState(true);
  const [precisionMode, setPrecisionMode] = useState("fp32");
  const [cacheSize, setCacheSize] = useState("64");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-12 space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-white mb-1 tracking-wide">Workspace Settings</h2>
        <p className="text-xs text-[#FFF3CF]/60 font-light">
          Configure computational backend, memory caches, precision thresholds, and data pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings nav / profile */}
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 h-fit space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-sky-500/20 border border-white/10 flex items-center justify-center text-[#FFF3CF] font-medium text-base shadow-inner">
              SS
            </div>
            <div>
              <div className="text-sm font-medium text-white">Dr. Shruti Singh</div>
              <div className="text-[10px] text-[#FFF3CF]/60 uppercase tracking-widest font-mono">Lead Astrophysicist</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <button className="w-full text-left px-3 py-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] text-[#FFF3CF] font-medium flex items-center gap-2 shadow-sm">
              <Cpu size={14} /> Compute & Inference
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-2">
              <Database size={14} /> Dataset Connections
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-2">
              <Bell size={14} /> Telemetry Alerts
            </button>
            <button className="w-full text-left px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-2">
              <Shield size={14} /> API Keys & Security
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
          <h3 className="text-sm font-medium text-white border-b border-white/[0.08] pb-3 tracking-wide">
            Compute & Inference Cluster
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-[#FFF3CF]/70 block mb-1.5 uppercase tracking-wider font-mono">
                Compute Hardware Allocation
              </label>
              <select
                value={gpuAllocation}
                onChange={e => setGpuAllocation(e.target.value)}
                className="w-full bg-black/45 border border-white/[0.1] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#FFF3CF]/60 backdrop-blur-md cursor-pointer"
              >
                <option value="8x NVIDIA H100">8x NVIDIA H100 SXM5 (80GB VRAM each)</option>
                <option value="4x NVIDIA A100">4x NVIDIA A100 (40GB VRAM)</option>
                <option value="Apple Metal">Apple Metal / MPS Accelerators (Local Unified 64GB)</option>
                <option value="CPU Distributed">CPU Distributed MPI Cluster (64 Cores)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#FFF3CF]/70 block mb-1.5 uppercase tracking-wider font-mono">
                Floating Point Tensor Precision
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["fp32", "fp16", "bfloat16"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrecisionMode(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono uppercase transition-all border ${
                      precisionMode === p
                        ? "bg-[#FFF3CF] border-[#FFF3CF] text-slate-950 font-bold shadow-[0_0_15px_rgba(255,243,207,0.2)]"
                        : "bg-black/35 border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#FFF3CF]/70 block mb-1.5 uppercase tracking-wider font-mono">
                Spectroscopic Ingestion Cache (GB)
              </label>
              <input
                type="number"
                value={cacheSize}
                onChange={e => setCacheSize(e.target.value)}
                className="w-full bg-black/45 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#FFF3CF]/60 backdrop-blur-md"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-black/35 border border-white/[0.08] rounded-xl backdrop-blur-md">
              <div>
                <div className="text-xs text-white font-medium">Automatic Observational Telemetry Sync</div>
                <div className="text-[10px] text-[#FFF3CF]/50 font-mono">Polls DESI and ISRO archives every 6 hours for new releases</div>
              </div>
              <input
                type="checkbox"
                checked={telemetrySync}
                onChange={e => setTelemetrySync(e.target.checked)}
                className="accent-[#FFF3CF] w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#FFF3CF] text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 font-mono shadow-md shadow-[#FFF3CF]/10"
            >
              {saved ? <><Check size={14} /> Settings Saved</> : <><Save size={14} /> Save Configuration</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
