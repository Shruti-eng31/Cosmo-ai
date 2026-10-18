"use client";

import { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  ScatterChart, 
  Scatter, 
  ZAxis 
} from "recharts";

// Base cosmological redshift mock
const baseRedshift = Array.from({ length: 25 }).map((_, i) => ({
  bin: `z=${(i * 0.08).toFixed(2)}`,
  rawCount: Math.floor(120000 * Math.exp(-((i - 7) ** 2) / 18) + 8000),
}));

// Real ISRO launch decades from isro_missions.json
const isroDecadeData = [
  { bin: "1970s", count: 4, detail: "Aryabhata & experimental tests" },
  { bin: "1980s", count: 12, detail: "SLV-3 & Rohini satellites" },
  { bin: "1990s", count: 24, detail: "PSLV debut, IRS & INSAT fleet" },
  { bin: "2000s", count: 32, detail: "GSLV & Chandrayaan-1" },
  { bin: "2010s", count: 38, detail: "MOM Mars, AstroSat & NavIC" },
  { bin: "2020s", count: 15, detail: "Chandrayaan-3, Aditya-L1" },
];

const galaxyData = [
  { name: 'Spiral', value: 4100000, description: "Milky Way, Andromeda type disk galaxies" },
  { name: 'Elliptical', value: 2300000, description: "E0-E7 smooth spheroidal stellar populations" },
  { name: 'Irregular', value: 900000, description: "Tidally disrupted & Magellanic type systems" },
  { name: 'Quasar', value: 500000, description: "Supermassive black hole powered luminous cores" },
  { name: 'Star', value: 300000, description: "Foreground Milky Way stellar spectra" },
];
const COLORS = ['#263F78', '#FFF3CF', '#3A5A9F', '#7E95C2', '#C4B5FD'];

// Scatter points with categories
const allScatterData = Array.from({ length: 160 }).map((_, i) => {
  const type = i % 4 === 0 ? "Quasar" : i % 5 === 0 ? "Star" : "Galaxy";
  return {
    ra: parseFloat((Math.random() * 360).toFixed(2)),
    dec: parseFloat((Math.random() * 180 - 90).toFixed(2)),
    z: parseFloat((Math.random() * 2.2 + 0.05).toFixed(3)),
    type
  };
});

export function RedshiftDistribution() {
  const [activeRange, setActiveRange] = useState<"1D" | "7D" | "30D" | "All">("All");
  const [chartMode, setChartMode] = useState<"cosmic" | "isro">("cosmic");

  const displayData = useMemo(() => {
    if (chartMode === "isro") {
      return isroDecadeData;
    }
    // Scale count based on active range
    const scaleFactor = activeRange === "1D" ? 0.08 : activeRange === "7D" ? 0.35 : activeRange === "30D" ? 0.75 : 1.0;
    return baseRedshift.map(d => ({
      bin: d.bin,
      count: Math.round(d.rawCount * scaleFactor)
    }));
  }, [activeRange, chartMode]);

  return (
    <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-6 flex flex-col h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white tracking-wide">
              {chartMode === "cosmic" ? "Redshift Distribution (DESI DR1)" : "ISRO Mission Launches by Decade"}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#263F78]/30 text-primary border border-[#263F78]/50 uppercase font-mono">
              {chartMode === "cosmic" ? "Cosmology" : "Real Dataset"}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">
            {chartMode === "cosmic" ? "z-score frequency across 2.1M spectra" : "125 launches from ISRO mission archive"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle between Cosmic vs ISRO */}
          <div className="flex bg-[#0D1C42] border border-[#263F78]/40 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setChartMode("cosmic")}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartMode === "cosmic" ? "bg-primary text-background font-medium" : "text-primary/60 hover:text-white"
              }`}
            >
              DESI Survey
            </button>
            <button
              onClick={() => setChartMode("isro")}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartMode === "isro" ? "bg-primary text-background font-medium" : "text-primary/60 hover:text-white"
              }`}
            >
              ISRO Launches
            </button>
          </div>

          {/* Time Filter buttons (only relevant for survey view) */}
          {chartMode === "cosmic" && (
            <div className="flex gap-1 bg-[#0D1C42] border border-[#263F78]/40 rounded-lg p-0.5">
              {(["1D", "7D", "30D", "All"] as const).map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveRange(t)}
                  className={`px-2 py-1 rounded text-[10px] uppercase transition-all ${
                    activeRange === t 
                      ? "bg-[#263F78] text-white font-medium" 
                      : "text-primary/60 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#263F78" opacity={0.2} vertical={false} />
            <XAxis 
              dataKey="bin" 
              stroke="#263F78" 
              tick={{ fill: '#FFF3CF', opacity: 0.6, fontSize: 10 }} 
              tickLine={false} 
              axisLine={{ stroke: '#263F78', opacity: 0.5 }} 
            />
            <YAxis 
              stroke="#263F78" 
              tick={{ fill: '#FFF3CF', opacity: 0.6, fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => chartMode === "isro" ? `${val}` : `${(val / 1000).toFixed(0)}k`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0D1C42', borderColor: '#263F78', color: '#FFF3CF', fontSize: '12px', borderRadius: '8px' }}
              itemStyle={{ color: '#FFF3CF' }}
              cursor={{ fill: '#263F78', opacity: 0.2 }}
              formatter={(val: any) => [chartMode === "isro" ? `${val} Launches` : `${Number(val).toLocaleString()} Spectra`, "Count"]}
            />
            <Bar dataKey="count" fill="#263F78" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function GalaxyClassification() {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  const activeInfo = selectedSlice !== null ? galaxyData[selectedSlice] : null;

  return (
    <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-white tracking-wide">Galaxy Classification</h3>
          <p className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">Morphological Sample (8.1M)</p>
        </div>
        {activeInfo && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
            {activeInfo.name} Selected
          </span>
        )}
      </div>

      <div className="flex-1 w-full min-h-0 mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={galaxyData}
              cx="45%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              onClick={(_, index) => setSelectedSlice(selectedSlice === index ? null : index)}
            >
              {galaxyData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  opacity={selectedSlice === null || selectedSlice === index ? 1 : 0.4}
                  className="cursor-pointer transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0D1C42', borderColor: '#263F78', color: '#FFF3CF', fontSize: '12px', borderRadius: '8px' }}
              itemStyle={{ color: '#FFF3CF' }}
              formatter={(value: any) => `${(Number(value) / 1000000).toFixed(2)}M Objects`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="absolute top-2 right-0 space-y-2 max-w-[120px]">
          {galaxyData.map((entry, index) => (
            <div 
              key={entry.name} 
              onClick={() => setSelectedSlice(selectedSlice === index ? null : index)}
              className={`flex items-center gap-1.5 text-xs cursor-pointer p-1 rounded transition-colors ${
                selectedSlice === index ? "bg-[#263F78]/40" : "hover:bg-[#263F78]/20"
              }`}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index] }} />
              <span className="text-white font-light text-[11px] truncate">{entry.name}</span>
              <span className="text-primary/50 ml-auto font-mono text-[9px]">
                {((entry.value / 8100000) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail description banner */}
      <div className="mt-auto pt-3 border-t border-[#263F78]/20 text-[11px] text-primary/70 truncate">
        {activeInfo ? activeInfo.description : "Click on any slice or legend item to inspect morphological traits"}
      </div>
    </div>
  );
}

export function ObjectDistribution() {
  const [filterType, setFilterType] = useState<string>("All");

  const filteredScatter = useMemo(() => {
    if (filterType === "All") return allScatterData;
    return allScatterData.filter(d => d.type === filterType);
  }, [filterType]);

  return (
    <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-white tracking-wide">Sky Object Distribution</h3>
          <p className="text-[10px] uppercase tracking-widest text-primary/40 mt-1">Equatorial Coordinates (RA/DEC)</p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 bg-[#010736] border border-[#263F78]/40 rounded-lg p-0.5">
          {["All", "Galaxy", "Quasar", "Star"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${
                filterType === type 
                  ? "bg-primary text-background font-medium" 
                  : "text-primary/60 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 bg-[#010736]/50 rounded-lg border border-[#263F78]/20 relative overflow-hidden">
        {/* Milky Way galactic plane hint */}
        <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 bg-white/5 blur-xl rotate-12 pointer-events-none" />
        
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#263F78" opacity={0.15} />
            <XAxis 
              type="number" 
              dataKey="ra" 
              name="Right Ascension" 
              unit="°" 
              domain={[0, 360]} 
              stroke="#263F78" 
              tick={{ fill: '#FFF3CF', opacity: 0.5, fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              type="number" 
              dataKey="dec" 
              name="Declination" 
              unit="°" 
              domain={[-90, 90]} 
              stroke="#263F78" 
              tick={{ fill: '#FFF3CF', opacity: 0.5, fontSize: 10 }} 
              tickLine={false} 
              axisLine={false} 
            />
            <ZAxis type="number" dataKey="z" range={[6, 22]} name="Redshift" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: '#263F78', opacity: 0.5 }}
              contentStyle={{ backgroundColor: '#0D1C42', borderColor: '#263F78', color: '#FFF3CF', fontSize: '12px', borderRadius: '8px' }}
              formatter={(value: any, name: any) => [value, name === "z" ? "Redshift (z)" : name]}
            />
            <Scatter 
              name="Objects" 
              data={filteredScatter} 
              fill="#FFF3CF" 
              opacity={0.7} 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
