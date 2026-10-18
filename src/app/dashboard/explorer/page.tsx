"use client";

import { useState } from "react";
import { Search, Database, ChevronRight, Activity, Filter, Download } from "lucide-react";
import isroData from "@/data/isro_missions.json";

const datasets = [
  { 
    id: "isro", 
    name: "ISRO Mission Launches", 
    desc: "Indian Space Research Organisation's historical mission launch dataset containing 125 missions.", 
    objects: "Satellites, Launch Vehicles", 
    params: "Date, Application, Remarks", 
    status: "Active",
    image: "/images/isro.jpg"
  },
  { 
    id: "desi", 
    name: "DESI (Dark Energy Spectroscopic Instrument)", 
    desc: "Spectroscopic measurements of 35 million galaxies and quasars across cosmic time.", 
    objects: "Galaxies, Quasars, Stars", 
    params: "Redshift, Spectra, RA, DEC", 
    status: "Active",
    image: "/images/desi.jpg"
  },
  { 
    id: "gaia", 
    name: "GAIA DR3", 
    desc: "Astrometric data for over 1.8 billion celestial objects in the Milky Way with parallax & proper motions.", 
    objects: "Stars, Milky Way", 
    params: "Parallax, Proper Motion, Brightness", 
    status: "Active",
    image: "/images/gaia.jpg"
  },
  { 
    id: "rubin", 
    name: "RUBIN (LSST) Mock", 
    desc: "Simulated time-domain data for the upcoming Legacy Survey of Space and Time.", 
    objects: "Transients, Solar System", 
    params: "Light Curves, Photometry", 
    status: "Simulated",
    image: "/images/rubin.jpg"
  },
  { 
    id: "jwst", 
    name: "NASA / ESA JWST Archive", 
    desc: "Deep field multi-wavelength infrared observations of earliest galaxies and gravitational lensing.", 
    objects: "Deep Space Objects", 
    params: "Infrared Spectra, Images", 
    status: "Active",
    image: "/images/jwst.jpg"
  },
  { 
    id: "illustris", 
    name: "ILLUSTRIS TNG", 
    desc: "Large scale cosmological hydrodynamical simulations mapping dark matter and cosmic gas filaments.", 
    objects: "Dark Matter, Gas", 
    params: "Density, Temperature", 
    status: "Simulation",
    image: "/images/illustris.jpg"
  },
];

export default function DataExplorer() {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDatasets = datasets.filter(ds => 
    ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ds.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ds.objects.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedDataset) {
    if (selectedDataset === "isro") return <ISRODatasetDetail onBack={() => setSelectedDataset(null)} />;
    return <DatasetDetail id={selectedDataset} onBack={() => setSelectedDataset(null)} />;
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      
      {/* Search Header */}
      <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search astronomical datasets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-[#263F78]/50 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-primary/30 outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#263F78]/20 border border-[#263F78]/40 rounded-lg text-xs text-primary/80">
            <Database className="w-3.5 h-3.5" /> 6 Observational Catalogs
          </div>
        </div>
      </div>

      {/* Dataset Grid with rich imagery */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map(ds => (
          <div 
            key={ds.id} 
            className="bg-card border border-[#263F78]/30 hover:border-primary/60 transition-all rounded-xl overflow-hidden flex flex-col cursor-pointer group hover:shadow-2xl hover:shadow-primary/5" 
            onClick={() => setSelectedDataset(ds.id)}
          >
            {/* Image banner */}
            <div className="h-44 w-full overflow-hidden relative bg-[#0D1C42]">
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent z-10" />
              <img 
                src={ds.image} 
                alt={ds.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <span className={`absolute top-3 right-3 z-20 text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md ${
                ds.status === 'Active' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-primary/10 border-primary/30 text-primary'
              }`}>
                {ds.status}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col pt-3">
              <h3 className="text-lg font-medium text-white tracking-wide mb-2 group-hover:text-primary transition-colors">
                {ds.name}
              </h3>
              
              <p className="text-xs text-primary/70 font-light mb-6 flex-1 leading-relaxed">
                {ds.desc}
              </p>

              <div className="space-y-2.5 pt-4 border-t border-[#263F78]/20 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-primary/40">Object Types</span>
                  <span className="text-white font-light">{ds.objects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-primary/40">Parameters</span>
                  <span className="text-primary/90 font-mono text-[11px]">{ds.params}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button className="flex-1 py-2.5 bg-primary text-background rounded-lg font-medium text-xs tracking-wide hover:bg-white transition-colors">
                  Explore
                </button>
                <button className="flex-1 py-2.5 bg-transparent border border-[#263F78] text-primary rounded-lg font-medium text-xs tracking-wide hover:bg-[#263F78]/30 transition-colors">
                  Analyze
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatasetDetail({ id, onBack }: { id: string, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Data Table");

  const currentDs = datasets.find(d => d.id === id) || datasets[1];

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col">
      {/* Detail Header Banner */}
      <div className="relative rounded-2xl border border-[#263F78]/40 overflow-hidden mb-8 bg-[#0D1C42]">
        <div className="h-44 w-full relative">
          <img src={currentDs.image} alt={currentDs.name} className="w-full h-full object-cover opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C42] via-[#0D1C42]/60 to-transparent" />
        </div>

        <div className="p-6 -mt-20 relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <button onClick={onBack} className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary/80 hover:text-white mb-3 transition-colors">
              <ChevronRight className="w-3 h-3 rotate-180" /> Back to Datasets
            </button>
            <h2 className="text-3xl font-light text-white mb-1">{currentDs.name}</h2>
            <p className="text-primary/70 text-xs font-light">{currentDs.desc}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#263F78]/30 border border-[#263F78]/60 rounded-lg text-xs text-primary hover:bg-[#263F78]/50 transition-colors uppercase tracking-widest">
              <Activity className="w-4 h-4" /> Run AI Analysis
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg text-xs hover:bg-white transition-colors uppercase tracking-widest font-medium">
              <Download className="w-4 h-4" /> Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#263F78]/30 mb-8">
        {["Overview", "Data Table", "Statistics", "Visualization", "Analysis"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs uppercase tracking-widest transition-colors relative ${activeTab === tab ? "text-primary" : "text-primary/40 hover:text-primary/70"}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-card border border-[#263F78]/30 rounded-xl overflow-hidden flex flex-col">
        {activeTab === "Data Table" ? (
          <>
            <div className="p-4 border-b border-[#263F78]/20 bg-background/20 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 w-3 h-3" />
                <input type="text" placeholder="Filter Object ID..." className="w-full bg-background border border-[#263F78]/30 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-primary/30 outline-none focus:border-primary/50" />
              </div>
              <span className="text-[10px] text-primary/40 uppercase tracking-widest">Showing 1-20 of 2.1M (Sample)</span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 bg-[#0D1C42] border-b border-[#263F78]/50 z-10">
                  <tr className="text-[10px] uppercase tracking-widest text-primary/40">
                    <th className="font-normal px-6 py-4">Object ID</th>
                    <th className="font-normal px-6 py-4">RA (deg)</th>
                    <th className="font-normal px-6 py-4">DEC (deg)</th>
                    <th className="font-normal px-6 py-4">Redshift (z)</th>
                    <th className="font-normal px-6 py-4">Type</th>
                    <th className="font-normal px-6 py-4">Apparent Mag</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono text-primary/80">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#263F78]/10 hover:bg-[#263F78]/10 transition-colors">
                      <td className="px-6 py-3 text-white">{currentDs.name.split(' ')[0]}-{Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}</td>
                      <td className="px-6 py-3">{(Math.random() * 360).toFixed(4)}</td>
                      <td className="px-6 py-3">{(Math.random() * 180 - 90).toFixed(4)}</td>
                      <td className="px-6 py-3 text-primary">{(Math.random() * 2).toFixed(5)}</td>
                      <td className="px-6 py-3 text-primary/60 font-sans text-xs">{['GALAXY', 'QSO', 'STAR'][Math.floor(Math.random() * 3)]}</td>
                      <td className="px-6 py-3">{(Math.random() * 10 + 15).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-[#263F78]/20 bg-background/20 flex justify-between items-center text-xs text-primary/60">
              <button className="px-3 py-1 border border-[#263F78]/30 rounded hover:bg-[#263F78]/20">Previous</button>
              <div className="flex gap-1">
                {[1, 2, 3, '...', 105000].map((n, i) => (
                  <button key={i} className={`px-2 py-1 rounded ${n === 1 ? 'bg-[#263F78]/50 text-white' : 'hover:bg-[#263F78]/20'}`}>{n}</button>
                ))}
              </div>
              <button className="px-3 py-1 border border-[#263F78]/30 rounded hover:bg-[#263F78]/20">Next</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-primary/40 p-12">
            <Database className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Content for {activeTab} is ready for cluster ingestion.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ISRODatasetDetail({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Data Table");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(isroData.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const currentData = isroData.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="max-w-[1600px] mx-auto pb-12 h-full flex flex-col">
      {/* Detail Header Banner */}
      <div className="relative rounded-2xl border border-[#263F78]/40 overflow-hidden mb-8 bg-[#0D1C42]">
        <div className="h-48 w-full relative">
          <img src="/images/isro.jpg" alt="ISRO Missions" className="w-full h-full object-cover opacity-50 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C42] via-[#0D1C42]/60 to-transparent" />
        </div>

        <div className="p-6 -mt-20 relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <button onClick={onBack} className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary/80 hover:text-white mb-3 transition-colors">
              <ChevronRight className="w-3 h-3 rotate-180" /> Back to Datasets
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-light text-white mb-1">ISRO Mission Launches</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-green-500/10 border border-green-500/30 text-green-400">
                125 Real Flights
              </span>
            </div>
            <p className="text-primary/70 text-xs font-light">Historical orbital launch vehicle telemetry and mission results</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#263F78]/30 border border-[#263F78]/60 rounded-lg text-xs text-primary hover:bg-[#263F78]/50 transition-colors uppercase tracking-widest">
              <Activity className="w-4 h-4" /> Run AI Analysis
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg text-xs hover:bg-white transition-colors uppercase tracking-widest font-medium">
              <Download className="w-4 h-4" /> Export CSV (125 Records)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#263F78]/30 mb-8">
        {["Overview", "Data Table", "Statistics", "Visualization", "Analysis"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs uppercase tracking-widest transition-colors relative ${activeTab === tab ? "text-primary" : "text-primary/40 hover:text-primary/70"}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-card border border-[#263F78]/30 rounded-xl overflow-hidden flex flex-col">
        {activeTab === "Data Table" ? (
          <>
            <div className="p-4 border-b border-[#263F78]/20 bg-background/20 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 w-3 h-3" />
                <input type="text" placeholder="Filter Missions..." className="w-full bg-background border border-[#263F78]/30 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-primary/30 outline-none focus:border-primary/50" />
              </div>
              <span className="text-[10px] text-primary/40 uppercase tracking-widest font-mono">Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, isroData.length)} of {isroData.length}</span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="sticky top-0 bg-[#0D1C42] border-b border-[#263F78]/50 z-10">
                  <tr className="text-[10px] uppercase tracking-widest text-primary/40">
                    <th className="font-normal px-6 py-4">SL No</th>
                    <th className="font-normal px-6 py-4">Spacecraft / Mission</th>
                    <th className="font-normal px-6 py-4">Launch Date</th>
                    <th className="font-normal px-6 py-4">Launch Vehicle</th>
                    <th className="font-normal px-6 py-4">Orbit Type</th>
                    <th className="font-normal px-6 py-4">Application</th>
                    <th className="font-normal px-6 py-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono text-primary/80">
                  {currentData.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-[#263F78]/10 hover:bg-[#263F78]/10 transition-colors">
                      <td className="px-6 py-3 text-white font-mono">{row["SL No"] || "-"}</td>
                      <td className="px-6 py-3 text-white font-sans font-medium">{row["Launch Date"] || "-"}</td>
                      <td className="px-6 py-3 text-primary/70">{row["Launch Vehicle"] || "-"}</td>
                      <td className="px-6 py-3 text-primary">{row["Launch Vehicle.1"] || "-"}</td>
                      <td className="px-6 py-3 text-primary/60 font-sans text-xs">{row["Orbit Type"] || "-"}</td>
                      <td className="px-6 py-3 font-sans text-xs">{row["Application"] || "-"}</td>
                      <td className="px-6 py-3 font-sans text-xs truncate max-w-xs" title={row["Remarks"]}>{row["Remarks"] || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-[#263F78]/20 bg-background/20 flex justify-between items-center text-xs text-primary/60">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-[#263F78]/30 rounded hover:bg-[#263F78]/20 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex gap-1">
                <span className="px-2 py-1 bg-[#263F78]/50 text-white rounded">Page {page} of {totalPages}</span>
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-[#263F78]/30 rounded hover:bg-[#263F78]/20 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-primary/40 p-12">
            <Database className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Content for {activeTab} is available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
