"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Shuffle,
  Bookmark,
  Share2,
  Check,
  Flame,
  Atom,
  Telescope,
  Compass,
  Rocket
} from "lucide-react";

interface FunFact {
  id: number;
  category: "Black Holes" | "Deep Cosmos" | "Planets & Moons" | "Relativity & Quantum";
  title: string;
  fact: string;
  detail: string;
  tag: string;
  stat?: string;
  statLabel?: string;
}

const FACTS: FunFact[] = [
  {
    id: 1,
    category: "Black Holes",
    title: "Spaghettification Phenomenon",
    fact: "If you fell into a black hole, extreme gravitational gradients would stretch you vertically and compress you horizontally into a noodle-like shape.",
    detail: "Tidal forces grow so intense near the event horizon of a stellar-mass black hole that the difference in gravity between your head and toes would tear molecular bonds apart.",
    tag: "Astrophysics",
    stat: "10^12 g",
    statLabel: "Tidal Acceleration",
  },
  {
    id: 2,
    category: "Deep Cosmos",
    title: "Cosmic Microwave Background 'Snow'",
    fact: "About 1% of the static 'snow' on analog television screens is the afterglow of the Big Bang itself.",
    detail: "The Cosmic Microwave Background (CMB) photons that fill the universe were released approximately 380,000 years after the Big Bang and have been traveling for 13.8 billion years.",
    tag: "Cosmology",
    stat: "2.725 K",
    statLabel: "Average CMB Temp",
  },
  {
    id: 3,
    category: "Planets & Moons",
    title: "Diamond Rain on Ice Giants",
    fact: "Inside Neptune and Uranus, temperatures and pressures are so intense that methane splits into carbon atoms that condense into literal diamonds that rain down toward the core.",
    detail: "Laboratory shockwave laser experiments simulating the interior pressures of Neptune (over 1.5 million atmospheres) have confirmed that hydrocarbons crystalize into diamond hail.",
    tag: "Planetary Science",
    stat: "Millions carats",
    statLabel: "Estimated Formation",
  },
  {
    id: 4,
    category: "Relativity & Quantum",
    title: "Time Dilates Near Massive Bodies",
    fact: "Your head ages marginally faster than your feet because gravity is stronger closer to Earth's center.",
    detail: "According to Einstein's General Relativity, time ticks slower in stronger gravitational fields. Over an average 79-year human lifespan, your head is about 90 nanoseconds older than your feet.",
    tag: "General Relativity",
    stat: "90 ns",
    statLabel: "Lifespan Difference",
  },
  {
    id: 5,
    category: "Deep Cosmos",
    title: "A Day Longer Than a Year",
    fact: "One day on Venus lasts longer than an entire Venusian year.",
    detail: "Venus rotates extraordinarily slowly on its axis, taking 243 Earth days to complete a single axial turn, while orbiting the Sun in just 225 Earth days. It also spins clockwise (retrograde).",
    tag: "Orbital Mechanics",
    stat: "243 vs 225",
    statLabel: "Rotation vs Revolution Days",
  },
  {
    id: 6,
    category: "Black Holes",
    title: "The Supermassive Beast: TON 618",
    fact: "The largest known black hole, TON 618, has a mass equal to 66 billion Suns — large enough to swallow our entire solar system multiple times over.",
    detail: "Its event horizon spans roughly 390 billion kilometers across (over 40 times the distance from Pluto to the Sun). The light from its surrounding accretion disk shines as bright as 140 trillion suns.",
    tag: "Quasars",
    stat: "66 Billion M☉",
    statLabel: "Solar Mass Equivalent",
  },
  {
    id: 7,
    category: "Planets & Moons",
    title: "Titan's Hydrocarbon Seas & Human Flight",
    fact: "On Saturn's moon Titan, the atmospheric pressure is so dense and gravity so low that a human strapped with artificial wings could fly through muscle power alone.",
    detail: "Titan possesses thick nitrogen air (1.5x Earth's surface pressure) and only 14% of Earth's gravity, alongside lakes of liquid methane and ethane at -179°C.",
    tag: "Astrobiology",
    stat: "0.14 g",
    statLabel: "Surface Gravity",
  },
  {
    id: 8,
    category: "Relativity & Quantum",
    title: "Neutron Stars: A Teaspoon of Mass",
    fact: "A single teaspoon of neutron star matter would weigh approximately 6 billion tons on Earth.",
    detail: "When massive stars collapse into neutron stars, atomic electron clouds are crushed into atomic nuclei, fusing protons and electrons into pure neutrons packed at nuclear density.",
    tag: "Stellar Remnants",
    stat: "6 Billion Tons",
    statLabel: "Per Teaspoon",
  },
];

const CATEGORIES = ["All", "Black Holes", "Deep Cosmos", "Planets & Moons", "Relativity & Quantum"] as const;

export default function FunFactsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dailyFactIndex, setDailyFactIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const filteredFacts = selectedCategory === "All"
    ? FACTS
    : FACTS.filter((f) => f.category === selectedCategory);

  const handleRandomize = () => {
    const nextIdx = Math.floor(Math.random() * FACTS.length);
    setDailyFactIndex(nextIdx);
  };

  const handleCopy = (fact: FunFact) => {
    navigator.clipboard.writeText(`${fact.title}: ${fact.fact}`);
    setCopiedId(fact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const activeDaily = FACTS[dailyFactIndex];

  return (
    <div className="max-w-[1400px] mx-auto pb-16 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-[#FFF3CF]" />
            <h1 className="text-2xl font-light text-white tracking-wide">Cosmic Fun Facts</h1>
          </div>
          <p className="text-xs text-[#FFF3CF]/60">
            Fascinating astrophysical realities, curiosities, and mind-bending phenomena across space and time.
          </p>
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#263F78]/30 border border-[#263F78] hover:border-[#FFF3CF]/50 text-[#FFF3CF] rounded-xl text-xs font-medium transition-all duration-300 hover:bg-[#263F78]/50 active:scale-95 shadow-lg shadow-[#010736]/50"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Surprise Me</span>
        </button>
      </div>

      {/* Featured Spotlight Card */}
      <motion.div
        key={activeDaily.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1C42] via-[#142A5C] to-[#0A1633] border border-[#263F78] p-6 md:p-8 mb-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFF3CF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#FFF3CF]/15 text-[#FFF3CF] border border-[#FFF3CF]/30 uppercase tracking-widest">
                <Flame className="w-3 h-3 text-[#FFF3CF]" />
                Spotlight Curiosity
              </span>
              <span className="text-xs text-[#FFF3CF]/50">• {activeDaily.category}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-medium text-white mb-3">
              {activeDaily.title}
            </h2>

            <p className="text-sm md:text-base text-[#FFF3CF]/90 leading-relaxed max-w-3xl mb-4 font-light">
              "{activeDaily.fact}"
            </p>

            <p className="text-xs text-[#FFF3CF]/60 max-w-2xl leading-relaxed">
              {activeDaily.detail}
            </p>
          </div>

          {activeDaily.stat && (
            <div className="shrink-0 bg-[#0D1C42]/80 border border-[#263F78]/70 rounded-xl p-5 text-center min-w-[160px] shadow-inner">
              <div className="text-xl md:text-2xl font-bold text-[#FFF3CF] tracking-wide">
                {activeDaily.stat}
              </div>
              <div className="text-[10px] text-[#FFF3CF]/50 uppercase tracking-widest mt-1">
                {activeDaily.statLabel}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 shrink-0 ${
                isActive
                  ? "bg-[#263F78] text-[#FFF3CF] border border-[#FFF3CF]/30 shadow-md"
                  : "bg-[#0D1C42]/50 text-[#FFF3CF]/60 border border-[#263F78]/30 hover:bg-[#263F78]/30 hover:text-[#FFF3CF]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Facts Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredFacts.map((fact) => {
            const isBookmarked = bookmarkedIds.includes(fact.id);
            const isCopied = copiedId === fact.id;

            return (
              <motion.div
                layout
                key={fact.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-[#0D1C42]/70 hover:bg-[#0D1C42] border border-[#263F78]/40 hover:border-[#FFF3CF]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-[#263F78]/30 text-[#FFF3CF]/80 border border-[#263F78]/50">
                      {fact.tag}
                    </span>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(fact)}
                        title="Copy fact"
                        className="p-1.5 rounded-lg text-[#FFF3CF]/60 hover:text-[#FFF3CF] hover:bg-[#263F78]/40 transition-colors"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => toggleBookmark(fact.id)}
                        title="Bookmark"
                        className="p-1.5 rounded-lg text-[#FFF3CF]/60 hover:text-[#FFF3CF] hover:bg-[#263F78]/40 transition-colors"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isBookmarked ? "fill-[#FFF3CF] text-[#FFF3CF]" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-medium text-white mb-2 group-hover:text-[#FFF3CF] transition-colors">
                    {fact.title}
                  </h3>

                  <p className="text-xs text-[#FFF3CF]/80 leading-relaxed mb-4">
                    {fact.fact}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#263F78]/40 flex items-center justify-between text-[11px] text-[#FFF3CF]/50">
                  <span>{fact.category}</span>
                  {fact.stat && (
                    <span className="font-mono text-[#FFF3CF]/70 font-medium">
                      {fact.stat}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
