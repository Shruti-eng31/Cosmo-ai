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
    "Querying DESI dataset...",
    "Generating visualization..."
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
      <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-8">
        
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Atom className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">Ask COSMO AI</h2>
            <p className="text-primary/60 text-sm max-w-md mb-12">Your personal cosmological research assistant. Connected to live astronomical databases and trained on scientific papers.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl text-left">
              {[
                "What is the relationship between galaxy redshift and distance?",
                "Analyze the distribution of Quasars in the SDSS dataset.",
                "Explain the tension in the Hubble Constant measurements.",
                "Generate a visualization of the local group."
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(q)}
                  className="p-4 bg-[#0D1C42]/30 border border-[#263F78]/30 rounded-xl hover:bg-[#263F78]/20 hover:border-primary/30 transition-colors group flex flex-col"
                >
                  <Sparkles className="w-4 h-4 text-primary/40 mb-3 group-hover:text-primary transition-colors" />
                  <span className="text-xs text-primary/80 leading-relaxed">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map(msg => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                    <Atom className="w-4 h-4 text-primary" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded bg-[#263F78] flex items-center justify-center shrink-0 text-xs font-medium text-white">
                    US
                  </div>
                )}
                
                <div className={`space-y-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-4 rounded-2xl text-sm font-light leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#263F78] text-white rounded-tr-sm' 
                      : 'bg-[#0D1C42]/50 border border-[#263F78]/30 text-white rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Sources & Rich Content for Assistant */}
                  {msg.role === 'assistant' && (
                    <div className="space-y-4 pt-2">
                      {msg.chart && (
                        <div className="h-48 border border-[#263F78]/30 rounded-lg bg-background/50 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                          <ChartIcon className="w-8 h-8 text-primary/20 group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                          <div className="absolute bottom-4 left-4 right-4 h-1/2 border-l border-b border-[#263F78]/50 flex items-end">
                             <div className="w-full h-[2px] bg-primary/50 origin-bottom-left -rotate-[35deg] ml-1 shadow-[0_0_10px_var(--color-primary)]" />
                          </div>
                        </div>
                      )}
                      {msg.sources && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-primary/40 flex items-center gap-1 py-1"><BookOpen className="w-3 h-3" /> Sources:</span>
                          {msg.sources.map((s, i) => (
                            <span key={i} className="text-xs text-primary/80 bg-[#263F78]/20 px-2 py-1 rounded border border-[#263F78]/30 flex items-center gap-1 cursor-pointer hover:bg-[#263F78]/40">
                              <Link2 className="w-3 h-3" /> {s}
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
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Atom className="w-4 h-4 text-primary animate-spin-slow" />
                </div>
                <div className="bg-[#0D1C42]/50 border border-[#263F78]/30 text-primary/60 rounded-2xl rounded-tl-sm p-4 text-xs font-mono space-y-2">
                  <AnimatePresence mode="popLayout">
                    <motion.div 
                      key={typingStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
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
      <div className="relative mt-auto shrink-0 bg-[#0D1C42]/80 backdrop-blur-md rounded-2xl border border-[#263F78]/50 p-2 shadow-2xl">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a cosmological question..." 
          className="w-full bg-transparent border-none py-3 pl-4 pr-14 text-sm text-white placeholder:text-primary/30 outline-none font-light"
          disabled={isTyping}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background disabled:opacity-50 disabled:bg-[#263F78] hover:scale-105 transition-all"
        >
          <Send className="w-4 h-4 ml-1" />
        </button>
      </div>

    </div>
  );
}
