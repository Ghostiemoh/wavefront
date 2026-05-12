"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Terminal, Radio, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getWatchlist } from "@/lib/watchlist";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: Radio },
  { href: "/playground", label: "Terminal", icon: Terminal },
];

export function Navbar() {
  const pathname = usePathname();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    setWatchlistCount(getWatchlist().length);
    const onStorage = () => setWatchlistCount(getWatchlist().length);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setWatchlistCount(getWatchlist().length);
  }, [pathname]);

  return (
    <>
      {/* Desktop: floating pill */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden sm:block w-max max-w-[calc(100vw-32px)]">
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="nav-pill flex items-center gap-0.5 px-2.5 py-1.5"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer mr-1"
          >
            <Activity className="w-3.5 h-3.5 text-accent-cyan" strokeWidth={2.5} />
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              Wave<span className="text-accent-cyan">front</span>
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-4 bg-border-subtle mx-0.5 shrink-0" />

          {/* Nav links */}
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            const isFeed = href === "/feed";
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-accent-cyan/10 text-accent-cyan"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2 : 1.5} />
                {label}
                {isFeed && watchlistCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-accent-cyan text-[9px] font-bold leading-none text-bg-primary">
                    {watchlistCount > 9 ? "9+" : watchlistCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-4 bg-border-subtle mx-0.5 shrink-0" />

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono text-text-muted">
            <div className="live-dot" />
            <span>Live</span>
          </div>
        </motion.div>
      </header>

      {/* Mobile: bottom nav bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 nav-pill rounded-none border-t border-border-subtle border-l-0 border-r-0 border-b-0 flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const isFeed = href === "/feed";
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl text-[10px] font-medium transition-colors cursor-pointer ${
                isActive ? "text-accent-cyan" : "text-text-muted"
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                {isFeed && watchlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-accent-cyan text-[8px] font-bold text-bg-primary leading-none">
                    {watchlistCount > 9 ? "9+" : watchlistCount}
                  </span>
                )}
              </div>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
