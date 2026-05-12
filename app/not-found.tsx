import Link from "next/link";
import { Compass, ArrowRight, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 py-24">
      <div className="glow-card gradient-border max-w-md w-full p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-5">
          <Compass className="w-5 h-5 text-accent-cyan" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2">
          404
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
          Off the wavefront.
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          This route is not on any radar. Head back to the feed or the home
          stream.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan text-bg-primary font-semibold text-xs shadow-glow-cyan-sm active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            Home
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            Live feed
          </Link>
        </div>
      </div>
    </div>
  );
}
