"use client";

import { useState, useRef, useEffect } from "react";
import {
  Atom,
  Send,
  BookOpen,
  Link2,
  Sparkles,
  LineChart as ChartIcon,
  Trash2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Bot,
  User as UserIcon,
  HelpCircle,
  Telescope,
  Compass,
  Cpu,
  ChevronRight,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  chartData?: ChartDataPoint[];
  chartConfig?: {
    xKey: string;
    yKey: string;
    xLabel: string;
    yLabel: string;
    title: string;
  };
  timestamp: string;
  model?: string;
}

const DEFAULT_SUGGESTIONS = [
  {
    title: "Hubble Expansion & Redshift",
    query: "What is the relationship between galaxy redshift and distance?",
    category: "Cosmology",
    icon: <Compass className="w-3.5 h-3.5 text-cyan-300" />,
  },
  {
    title: "ISRO XPoSat Polarimetry",
    query: "How does ISRO XPoSat measure X-ray polarization from neutron stars?",
    category: "ISRO Mission",
    icon: <Telescope className="w-3.5 h-3.5 text-emerald-300" />,
  },
  {
    title: "Hubble Constant Tension",
    query: "Explain the Hubble tension between CMB and local distance ladders.",
    category: "Astrophysics",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
  },
  {
    title: "AI Redshift Estimator",
    query: "How does ResNet-18 predict galaxy redshift from 5-band cutouts?",
    category: "Deep Learning",
    icon: <Cpu className="w-3.5 h-3.5 text-purple-300" />,
  },
];

const THINKING_STEPS = [
  "Formulating cosmological tensor parameters...",
  "Querying DESI DR1 & SDSS spectroscopic catalogs...",
  "Cross-referencing ISRO XPoSat & Aditya-L1 telemetry...",
  "Synthesizing FLRW metric models & scientific literature...",
];

// Clean text and math block formatter
function FormattedMessage({ text }: { text: string }) {
  const blocks = text.split("\n\n");

  return (
    <div className="space-y-3.5 text-xs sm:text-sm font-light leading-relaxed">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={bIdx}
              className="text-sm sm:text-base font-semibold text-[#FFF3CF] tracking-wide pt-2 border-b border-white/10 pb-1 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{trimmed.replace(/^###\s+/, "")}</span>
            </h3>
          );
        }

        if (trimmed.startsWith("#### ")) {
          return (
            <h4
              key={bIdx}
              className="text-xs sm:text-sm font-medium text-cyan-200 tracking-wide pt-1"
            >
              {trimmed.replace(/^####\s+/, "")}
            </h4>
          );
        }

        // Display math blocks ($$ ... $$)
        if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
          const formula = trimmed.slice(2, -2).trim();
          return (
            <div
              key={bIdx}
              className="my-2.5 p-3 rounded-xl bg-black/60 border border-cyan-500/30 text-center font-mono text-cyan-300 overflow-x-auto shadow-inner text-xs sm:text-sm"
            >
              {formula}
            </div>
          );
        }

        // Bullet lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ul key={bIdx} className="space-y-1.5 pl-2">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                  <span>{renderInlineFormatting(item.replace(/^[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split("\n").filter((l) => l.trim().length > 0);
          return (
            <ol key={bIdx} className="space-y-1.5 pl-2">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-white/90">
                  <span className="text-[11px] font-mono text-[#FFF3CF] shrink-0 mt-0.5">
                    {iIdx + 1}.
                  </span>
                  <span>{renderInlineFormatting(item.replace(/^\d+\.\s+/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph
        return (
          <p key={bIdx} className="text-white/85 leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting parser for bold, code, and inline formulas
function renderInlineFormatting(str: string) {
  // Simple regex replacement for bold and inline code
  const parts = str.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#FFF3CF]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return (
        <span
          key={index}
          className="font-mono text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded text-[11px] sm:text-xs border border-cyan-400/20"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="font-mono text-emerald-300 bg-emerald-950/30 px-1.5 py-0.5 rounded text-[11px] border border-emerald-500/20"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function AskCosmoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStep, setTypingStep] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<typeof DEFAULT_SUGGESTIONS>(DEFAULT_SUGGESTIONS);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Dynamic thinking step animation while waiting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTyping) {
      interval = setInterval(() => {
        setTypingStep((prev) => (prev + 1) % THINKING_STEPS.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setTypingStep(0);

    try {
      // Build conversation history payload
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/cosmo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error contacting COSMO Copilot.");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || "No response received.",
        sources: data.sources || [],
        chartData: data.chartData,
        chartConfig: data.chartConfig,
        model: data.model || "COSMO Copilot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (Array.isArray(data.suggestedQuestions) && data.suggestedQuestions.length > 0) {
        setSuggestions(
          data.suggestedQuestions.map((q: string, idx: number) => ({
            title: `Follow-up ${idx + 1}`,
            query: q,
            category: "Astrophysics",
            icon: <Sparkles className="w-3.5 h-3.5 text-cyan-300" />,
          }))
        );
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `**Observatory Warning:** ${err?.message || "Encountered a gateway communication failure. Please check telemetry connection."}`,
        sources: ["COSMO Local Safety Diagnostics"],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("Reset conversation and clear chat history?")) {
      setMessages([]);
      setSuggestions(DEFAULT_SUGGESTIONS);
    }
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === "user" ? "RESEARCHER" : "COSMO COPILOT"}:\n${m.content}\n\n`
      )
      .join("---\n\n");

    const blob = new Blob([transcript], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmo-ai-chat-transcript-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1240px] mx-auto pb-4 h-[calc(100vh-100px)] flex flex-col relative">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white tracking-wide">COSMO Copilot</span>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-400/30 font-mono">
                AI Assistant Active
              </span>
            </div>
            <p className="text-[10px] text-white/50 font-mono">
              Trained on Astrophysics • DESI DR1 & ISRO Telemetry Connected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white text-xs font-mono transition-colors"
                title="Export Conversation Transcript"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/30 text-white/70 hover:text-red-300 text-xs font-mono transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 overflow-y-auto pr-2 sm:pr-3 space-y-6">
        {messages.length === 0 && !isTyping ? (
          /* Empty / Welcome State with Categorized Starters */
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(56,189,248,0.2)]"
            >
              <Atom className="w-8 h-8 text-[#FFF3CF] animate-spin-slow" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-light text-white mb-2 tracking-wide"
            >
              Ask <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400">COSMO AI</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#FFF3CF]/60 text-xs sm:text-sm max-w-lg mb-8 font-light"
            >
              Your intelligent astrophysical copilot. Inquire about cosmological expansion, ISRO space telemetry, neural redshift regressors, or galaxy morphologies.
            </motion.p>

            {/* Quick Starter Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-left"
            >
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.query)}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 group flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(56,189,248,0.15)] cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFF3CF]/60 flex items-center gap-1.5">
                      {item.icon}
                      {item.category}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </div>
                  <span className="text-xs text-white/85 leading-relaxed font-light group-hover:text-white">
                    {item.query}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Conversation Message Feed */
          <div className="space-y-6 pb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 sm:gap-4 max-w-4xl ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                {/* Role Avatar */}
                {msg.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 backdrop-blur-md flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.25)] text-cyan-300 mt-1">
                    <Atom className="w-4 h-4 animate-spin-slow" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#FFF3CF] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs shadow-md mt-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`space-y-2 flex-1 max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                  {/* Meta Tag: Role & Timestamp */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 px-1">
                    <span>{msg.role === "user" ? "Researcher" : msg.model || "COSMO Copilot"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-xl transition-all ${
                      msg.role === "user"
                        ? "bg-[#FFF3CF] text-slate-950 rounded-tr-sm font-normal text-left inline-block"
                        : "bg-[#040A1E]/80 border border-white/[0.1] text-white rounded-tl-sm text-left"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <FormattedMessage text={msg.content} />
                    ) : (
                      <p className="text-xs sm:text-sm font-normal whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>

                  {/* Assistant Rich Additions: Chart, Sources & Copy Button */}
                  {msg.role === "assistant" && (
                    <div className="space-y-3 pt-1">
                      {/* Interactive Scientific Recharts Visualization */}
                      {msg.chartData && msg.chartData.length > 0 && (
                        <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.1] backdrop-blur-xl shadow-inner">
                          <div className="flex items-center justify-between mb-3 text-xs">
                            <span className="font-mono text-[#FFF3CF] font-medium flex items-center gap-1.5">
                              <ChartIcon className="w-4 h-4 text-cyan-400" />
                              {msg.chartConfig?.title || "Cosmological Metric Curve"}
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">
                              Units: {msg.chartConfig?.yLabel || "Metric"}
                            </span>
                          </div>

                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={msg.chartData}
                                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="astroGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                <XAxis
                                  dataKey="x"
                                  stroke="rgba(255,255,255,0.4)"
                                  fontSize={10}
                                  tickLine={false}
                                />
                                <YAxis
                                  stroke="rgba(255,255,255,0.4)"
                                  fontSize={10}
                                  tickLine={false}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "rgba(3, 9, 30, 0.95)",
                                    borderColor: "rgba(56, 189, 248, 0.4)",
                                    borderRadius: "0.75rem",
                                    fontSize: "11px",
                                    color: "#FFF",
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
                                  }}
                                  formatter={(val: any) => [`${val} Gyr`, "Lookback Time"]}
                                  labelFormatter={(lbl) => `Redshift z = ${lbl}`}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="y"
                                  stroke="#38BDF8"
                                  strokeWidth={2}
                                  fillOpacity={1}
                                  fill="url(#astroGradient)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Source Citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFF3CF]/60 flex items-center gap-1 mr-1">
                            <BookOpen className="w-3 h-3 text-cyan-400" />
                            Sources:
                          </span>
                          {msg.sources.map((src, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] text-white/80 bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono transition-colors"
                            >
                              <Link2 className="w-2.5 h-2.5 text-cyan-300" />
                              {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Bar (Copy Button) */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white px-2 py-1 rounded bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] transition-colors font-mono"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Dynamic Realtime Thinking Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 sm:gap-4 max-w-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 backdrop-blur-md flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.25)] text-cyan-300">
                  <Atom className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-[#040A1E]/80 backdrop-blur-xl border border-white/[0.1] text-white/80 rounded-2xl rounded-tl-sm p-4 text-xs font-mono space-y-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={typingStep}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.25 }}
                        className="text-cyan-200"
                      >
                        {THINKING_STEPS[typingStep]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-[pulse_1s_infinite]" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Follow-ups (when messages exist) */}
      {messages.length > 0 && !isTyping && (
        <div className="flex items-center gap-2 overflow-x-auto py-2 shrink-0 no-scrollbar">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFF3CF]/50 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Suggested:
          </span>
          {suggestions.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              className="text-[11px] text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-400/40 px-3 py-1.5 rounded-full shrink-0 transition-all font-light flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{item.query}</span>
              <ChevronRight className="w-3 h-3 text-cyan-400" />
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="relative mt-2 shrink-0 bg-[#050B1B]/85 backdrop-blur-2xl rounded-2xl border border-white/[0.14] p-2 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask a cosmological question, inquire about ISRO missions, or request a calculation... (Enter to send)"
          className="w-full bg-transparent border-none py-3 pl-4 pr-14 text-xs sm:text-sm text-white placeholder:text-white/35 outline-none font-light resize-none max-h-32"
          disabled={isTyping}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-slate-950 font-bold disabled:opacity-30 disabled:bg-white/10 disabled:text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-cyan-500/25 cursor-pointer disabled:cursor-not-allowed"
          title="Send Query (Enter)"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
