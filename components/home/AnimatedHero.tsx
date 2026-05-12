"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radio, Terminal } from "lucide-react";
import type { NarrativeEvent } from "@/lib/intelligence/types";
import { NarrativePanel } from "./NarrativePanel";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const rightPanel = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.15, ease: [0.32, 0.72, 0, 1] as const },
  },
};

interface Props {
  narratives: NarrativeEvent[];
}

export function AnimatedHero({ narratives }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-20 items-center pt-28 lg:pt-0">
      {/* Left: Content */}
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} className="mb-7">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/15 bg-accent-cyan/6 text-[10px] uppercase tracking-[0.2em] font-medium text-accent-cyan">
            <Radio className="w-2.5 h-2.5" strokeWidth={2} />
            Real-Time Solana Intelligence
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] mb-7"
        >
          See the narrative
          <br />
          <span className="text-accent-cyan">before the market.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[52ch] mb-10"
        >
          Spot which Solana narratives are pumping before CT does. Instant rug
          risk scores for any token. No wallet required.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-3">
          <Link
            href="/feed"
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-accent-cyan text-bg-primary font-semibold text-sm shadow-glow-cyan transition-all duration-200 active:scale-[0.97] cursor-pointer"
          >
            Enter the Feed
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" strokeWidth={1.5} />
            MCP Terminal
          </Link>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-4 mt-8">
          {[
            { label: "10 narrative clusters", color: "bg-accent-violet" },
            { label: "Real-time scoring", color: "bg-accent-emerald" },
            { label: "A+ to F risk grades", color: "bg-accent-cyan" },
          ].map((signal) => (
            <div key={signal.label} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${signal.color}`} />
              <span className="text-[11px] text-text-muted">{signal.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right: Live narrative panel */}
      <motion.div
        variants={rightPanel}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col h-[420px]"
      >
        <NarrativePanel narratives={narratives} />
      </motion.div>
    </div>
  );
}
