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
        <h2 className="text-3xl font-light text-white mb-2">Workspace Settings</h2>
        <p className="text-xs text-primary/60 font-light">
          Configure computational backend, memory caches, precision thresholds, and data pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings nav / profile */}
        <div className="bg-card border border-[#263F78]/30 rounded-xl p-6 h-fit space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[#263F78]/30">
            <div className="w-12 h-12 rounded-xl bg-[#263F78]/40 flex items-center justify-center text-primary font-medium text-base">
              SS
            </div>
            <div>
              <div className="text-sm font-medium text-white">Dr. Shruti Singh</div>
              <div className="text-[10px] text-primary/60 uppercase tracking-widest font-mono">Lead Astrophysicist</div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-[#263F78]/30 text-primary font-medium flex items-center gap-2">
              <Cpu size={14} /> Compute & Inference
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-primary/60 hover:text-white hover:bg-[#263F78]/10 transition-colors flex items-center gap-2">
              <Database size={14} /> Dataset Connections
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-primary/60 hover:text-white hover:bg-[#263F78]/10 transition-colors flex items-center gap-2">
              <Bell size={14} /> Telemetry Alerts
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-primary/60 hover:text-white hover:bg-[#263F78]/10 transition-colors flex items-center gap-2">
              <Shield size={14} /> API Keys & Security
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-card border border-[#263F78]/30 rounded-xl p-6 space-y-6">
          <h3 className="text-base font-medium text-white border-b border-[#263F78]/30 pb-3">Compute & Inference Cluster</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-primary/70 block mb-1.5 uppercase tracking-wider font-mono">Compute Hardware Allocation</label>
              <select
                value={gpuAllocation}
                onChange={e => setGpuAllocation(e.target.value)}
                className="w-full bg-[#0D1C42] border border-[#263F78]/50 rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-primary"
              >
                <option>8x NVIDIA H100 SXM5 (80GB VRAM each)</option>
                <option>4x NVIDIA A100 (40GB VRAM)</option>
                <option>Apple Metal / MPS Accelerators (Local Unified 64GB)</option>
                <option>CPU Distributed MPI Cluster (64 Cores)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-primary/70 block mb-1.5 uppercase tracking-wider font-mono">Floating Point Tensor Precision</label>
              <div className="grid grid-cols-3 gap-3">
                {["fp32", "fp16", "bfloat16"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrecisionMode(p)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono uppercase transition-colors border ${precisionMode === p
                        ? "bg-[#263F78]/50 border-primary text-primary"
                        : "bg-[#0D1C42]/50 border-[#263F78]/30 text-primary/60 hover:text-white"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-primary/70 block mb-1.5 uppercase tracking-wider font-mono">Spectroscopic Ingestion Cache (GB)</label>
              <input
                type="number"
                value={cacheSize}
                onChange={e => setCacheSize(e.target.value)}
                className="w-full bg-[#0D1C42] border border-[#263F78]/50 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0D1C42]/40 border border-[#263F78]/30 rounded-xl">
              <div>
                <div className="text-xs text-white font-medium">Automatic Observational Telemetry Sync</div>
                <div className="text-[10px] text-primary/50">Polls DESI and ISRO archives every 6 hours for new releases</div>
              </div>
              <input
                type="checkbox"
                checked={telemetrySync}
                onChange={e => setTelemetrySync(e.target.checked)}
                className="accent-primary w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#263F78]/30 flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-primary text-background font-medium text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
            >
              {saved ? <><Check size={14} /> Settings Saved</> : <><Save size={14} /> Save Configuration</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
