"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, Terminal, Database } from "lucide-react";
import type { RiskVerdict } from "@/lib/intelligence/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CopilotProps {
  verdict: RiskVerdict;
}

const SUGGESTED_QUESTIONS = [
  "Why did this get this risk grade?",
  "What are the security flags?",
  "Is the holder distribution safe?",
];

function renderMarkdown(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-text-primary font-semibold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function Copilot({ verdict }: CopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          context: {
            symbol: verdict.symbol,
            riskGrade: verdict.overallGrade,
            riskScore: verdict.overallScore,
            metrics: {
              liquidityScore: verdict.liquidityScore,
              holderScore: verdict.holderScore,
              securityScore: verdict.securityScore,
            },
            flags: verdict.flags,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: json.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: Could not process query." },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestion(q: string) {
    setInput(q);
  }

  return (
    <div className="flex flex-col h-full min-h-[400px] bg-bg-surface border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-elevated/50 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-sm font-semibold text-text-primary">Wavefront Copilot</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase font-mono px-2 py-1 bg-accent-emerald/10 text-accent-emerald rounded border border-accent-emerald/20 flex items-center gap-1"
            title="Birdeye risk & liquidity metrics pre-loaded into context"
          >
            <Database className="w-3 h-3" /> Context Loaded
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-1 bg-accent-violet/10 text-accent-violet rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Active
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <Terminal className="w-8 h-8 text-accent-cyan mb-2" />
            <p className="text-sm text-text-secondary text-center">
              Ask me anything about {verdict.symbol}.<br />
              I have full context on its risk profile.
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent-cyan/10 border border-accent-cyan/20 text-text-primary"
                    : "bg-bg-elevated border border-border text-text-secondary"
                }`}
              >
                {renderMarkdown(msg.content)}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-bg-elevated border border-border rounded-xl px-3 py-2">
                <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input + Suggestions */}
      <div className="p-3 bg-bg-elevated/30 border-t border-border flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 px-1">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestion(q)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-bg-surface border border-border text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${verdict.symbol}...`}
            className="w-full bg-bg-surface border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-cyan transition-colors placeholder:text-text-muted"
            disabled={isLoading}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-text-muted hover:text-accent-cyan hover:bg-accent-cyan/10 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
