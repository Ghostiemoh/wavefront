const FOOTER_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-24 sm:pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border">
        <div>
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            Wave<span className="text-accent-cyan">front</span>
          </span>
          <span className="ml-2 text-xs text-text-muted">
            AI-native onchain intelligence
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-text-muted">
          <a
            href="https://birdeye.so"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-cyan transition-colors cursor-pointer"
          >
            Powered by Birdeye
          </a>
          <span className="text-border-subtle">·</span>
          <span>BIP Sprint 4</span>
          <span className="text-border-subtle">·</span>
          <span className="font-mono">{FOOTER_YEAR}</span>
        </div>
      </div>
    </footer>
  );
}
