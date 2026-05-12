"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && error?.digest) {
      console.error("[wavefront]", error.digest, error.message);
    }
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="glow-card gradient-border max-w-md w-full p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-amber/10 border border-accent-amber/20 mb-5">
          <AlertTriangle className="w-5 h-5 text-accent-amber" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2 tracking-tight">
          Signal lost.
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Something on the wavefront broke. The stream will return shortly.
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan text-bg-primary font-semibold text-xs shadow-glow-cyan-sm active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
