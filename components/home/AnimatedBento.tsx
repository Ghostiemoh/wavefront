"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Zap, Radio, Search, BarChart3 } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export function AnimatedBento() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={item} className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-3">
            Built for traders, agents, and researchers
          </h2>
          <p className="text-text-secondary text-sm max-w-[48ch]">
            Three intelligence layers — narrative, risk, and natural language —
            running on live Birdeye data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Narrative Engine — 2 cols */}
          <motion.div variants={item} className="md:col-span-2 card-shell group">
            <div className="card-core p-8 min-h-[240px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-violet/10">
                    <Brain className="w-5 h-5 text-accent-violet" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full badge-ai">
                    AI-Powered
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">
                  Narrative Engine
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[44ch]">
                  Detects emerging onchain themes before they trend publicly.
                  Gaming, AI, DeFi, DePIN — know what&apos;s rotating and why,
                  minutes before CT does.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-auto border-t border-border">
                {["AI Infrastructure", "Gaming", "DeFi", "DePIN", "Meme"].map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-1 rounded-full text-text-muted border border-border bg-bg-elevated/50"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Risk Engine */}
          <motion.div variants={item} className="card-shell group">
            <div className="card-core p-6 flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-emerald/10">
                    <Shield className="w-5 h-5 text-accent-emerald" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full badge-bullish">
                    Real-Time
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2 tracking-tight">
                  Risk Engine
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Full token autopsy in seconds. A+ to F grades based on
                  liquidity, holder concentration, volume authenticity, and
                  security flags.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-accent-emerald" strokeWidth={1.5} />
                  <span className="text-[10px] font-mono text-text-muted">
                    Instant verdict at /verdict/[mint]
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Natural Language Search */}
          <motion.div variants={item} className="card-shell group">
            <div className="card-core p-6 flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-cyan/10">
                    <Zap className="w-5 h-5 text-accent-cyan" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full badge-info">
                    MCP Ready
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2 tracking-tight">
                  Natural Language Search
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Ask in plain English. Get structured results, confidence
                  scores, and instant verdict links.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Intelligence Pipeline — full width */}
          <motion.div variants={item} className="md:col-span-2 card-shell">
            <div className="card-core p-6">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em] mb-6">
                Intelligence pipeline
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { step: "01", label: "Ingest", desc: "Birdeye streams", icon: Radio },
                  { step: "02", label: "Cluster", desc: "Narrative detection", icon: Search },
                  { step: "03", label: "Score", desc: "Risk analysis", icon: Shield },
                  { step: "04", label: "Synthesize", desc: "AI intelligence", icon: Brain },
                ].map((s, i) => (
                  <div key={s.step} className="relative flex flex-col gap-2.5">
                    {/* Connecting line */}
                    {i < 3 && (
                      <div className="hidden sm:block absolute top-[18px] left-[calc(100%+8px)] right-0 w-[calc(100%-16px)] h-px bg-border-subtle" />
                    )}
                    {/* Step number + icon row */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold text-accent-cyan/50 tabular-nums">
                        {s.step}
                      </span>
                      <div className="w-px h-3 bg-border-subtle" />
                      <s.icon className="w-3.5 h-3.5 text-accent-cyan" strokeWidth={1.5} />
                    </div>
                    {/* Label + desc */}
                    <div>
                      <p className="text-sm font-semibold text-text-primary leading-tight">{s.label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
