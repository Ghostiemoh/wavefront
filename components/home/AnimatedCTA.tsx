"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export function AnimatedCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24 sm:pb-12">
      <motion.div
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="card-shell"
      >
        <div className="card-core px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary tracking-tight mb-1">
              Start with the live feed
            </h3>
            <p className="text-sm text-text-secondary">
              Narrative surges, trending tokens, and new listings — all in real time.
            </p>
          </div>
          <Link
            href="/feed"
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-accent-cyan text-bg-primary font-semibold text-sm shrink-0 shadow-glow-cyan-sm transition-all duration-200 active:scale-[0.97] cursor-pointer"
          >
            Open Live Feed
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
