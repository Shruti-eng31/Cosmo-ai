"use client";

import { useState } from "react";
import { Atom, Send, BookOpen, Link2, Sparkles, LineChart as ChartIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  chart?: boolean;
}

export default function AskCosmoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStep, setTypingStep] = useState(0);

  const steps = [
    "Understanding cosmological parameters...",
    "Searching scientific literature...",
    "Querying DESI & ISRO datasets...",
    "Synthesizing celestial models..."
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTypingStep(0);

    // Simulate thinking steps
    const interval = setInterval(() => {
      setTypingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "The relationship between redshift (z) and distance follows Hubble's Law (v = H₀d). In the expanding universe, objects further away appear to recede faster, leading to a higher cosmological redshift. Analyzing the DESI DR1 sample, we observe a linear correlation in the local universe which curves as we look further back in time due to the acceleration driven by Dark Energy (Λ).",
              sources: ["DESI Data Release 1", "Astropy Cosmology Module", "Planck 2018 Results"],
              chart: true
            }]);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-6 h-full flex flex-col relative">

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-6 pr-2 md:pr-4 space-y-8">

        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,243,207,0.15)]">
              <Atom className="w-8 h-8 text-[#FFF3CF] animate-spin-slow" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-2 tracking-wide">Ask COSMO AI</h2>
            <p className="text-[#FFF3CF]/60 text-xs md:text-sm max-w-md mb-12 font-light">
              Your personal cosmological research assistant. Connected to live astronomical databases and trained on scientific papers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
              {[
                "What is the relationship between galaxy redshift and distance?",
                "Analyze the distribution of Quasars in the SDSS dataset.",
                "Explain the tension in the Hubble Constant measurements.",
                "Generate a visualization of the local group and Milky Way."
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:border-[#FFF3CF]/40 transition-all duration-300 group flex flex-col text-left shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
                >
                  <Sparkles className="w-4 h-4 text-[#FFF3CF]/50 mb-3 group-hover:text-[#FFF3CF] transition-colors" />
                  <span className="text-xs text-white/80 leading-relaxed font-light">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 md:gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm">
                    <Atom className="w-4 h-4 text-[#FFF3CF]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#FFF3CF] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs shadow-md">
                    US
                  </div>
                )}

                <div className={`space-y-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl text-xs md:text-sm font-light leading-relaxed backdrop-blur-xl shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-[#FFF3CF] text-slate-950 rounded-tr-sm font-normal'
                      : 'bg-white/[0.04] border border-white/[0.09] text-white rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Sources & Rich Content for Assistant */}
                  {msg.role === 'assistant' && (
                    <div className="space-y-4 pt-1">
                      {msg.chart && (
                        <div className="h-44 border border-white/[0.08] rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-inner">
                          <ChartIcon className="w-8 h-8 text-[#FFF3CF]/30 group-hover:scale-110 transition-transform" />
                          <div className="absolute bottom-4 left-4 right-4 h-1/2 border-l border-b border-white/[0.1] flex items-end">
                            <div className="w-full h-[2px] bg-[#FFF3CF]/60 origin-bottom-left -rotate-[35deg] ml-1 shadow-[0_0_10px_#FFF3CF]" />
                          </div>
                        </div>
                      )}
                      {msg.sources && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/50 flex items-center gap-1 py-1 font-mono">
                            <BookOpen className="w-3 h-3" /> Sources:
                          </span>
                          {msg.sources.map((s, i) => (
                            <span 
                              key={i} 
                              className="text-xs text-white/80 bg-white/[0.04] border border-white/[0.08] hover:border-[#FFF3CF]/40 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-white/[0.08] transition-colors font-mono"
                            >
                              <Link2 className="w-3 h-3 text-[#FFF3CF]" /> {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-md flex items-center justify-center shrink-0">
                  <Atom className="w-4 h-4 text-[#FFF3CF] animate-spin-slow" />
                </div>
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.09] text-white/70 rounded-2xl rounded-tl-sm p-4 text-xs font-mono space-y-2 shadow-md">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={typingStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#FFF3CF] animate-pulse" />
                      {steps[typingStep]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative mt-auto shrink-0 bg-[#050B1B]/75 backdrop-blur-2xl rounded-2xl border border-white/[0.12] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a cosmological question or request a calculation..."
          className="w-full bg-transparent border-none py-3 pl-4 pr-14 text-xs md:text-sm text-white placeholder:text-white/35 outline-none font-light"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FFF3CF] rounded-xl flex items-center justify-center text-slate-950 font-bold disabled:opacity-30 disabled:bg-white/10 disabled:text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#FFF3CF]/20"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>

    </div>
  );
}
