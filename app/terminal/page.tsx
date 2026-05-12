"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Loader2, ChevronRight, Sparkles } from "lucide-react";
import type { MCPQueryResult } from "@/lib/intelligence/types";
import Link from "next/link";

const EXAMPLE_QUERIES = [
  "find emerging gaming narratives under $5M market cap",
  "show me trending AI infrastructure tokens",
  "what meme tokens have the highest volume today",
  "give me a market overview of Solana",
  "find tokens with strong smart money inflows",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  data?: MCPQueryResult;
  timestamp: number;
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(query?: string) {
    const q = query ?? input.trim();
    if (!q || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q, timestamp: Date.now() }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/mcp/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const json = await response.json();

      if (json.success) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: json.data.interpretation,
          data: json.data,
          timestamp: Date.now(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `Error: ${json.error || "Query failed"}`,
          timestamp: Date.now(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Network error. Please try again.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-accent-cyan" />
          <h1 className="text-2xl font-bold text-text-primary">MCP Playground</h1>
        </div>
        <p className="text-sm text-text-secondary">Query Wavefront intelligence with natural language. AI interprets your request and returns structured onchain data.</p>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <Sparkles className="w-10 h-10 text-accent-cyan/30 mb-4" />
            <p className="text-sm text-text-muted mb-6">Try a query to get started</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {EXAMPLE_QUERIES.map(q => (
                <button key={q} onClick={() => handleSubmit(q)}
                  className="text-left p-3 rounded-lg bg-bg-surface border border-border text-xs text-text-secondary hover:border-border-active hover:text-text-primary transition-colors cursor-pointer">
                  <ChevronRight className="w-3 h-3 inline mr-1 text-accent-cyan" />{q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 ${msg.role === "user" ? "bg-accent-cyan/10 border border-accent-cyan/15 text-text-primary" : "bg-bg-surface border border-border text-text-primary"}`}>
                {msg.role === "user" ? (
                  <p className="text-sm font-mono">{msg.content}</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-text-secondary">{msg.content}</p>
                    {msg.data?.results && msg.data.results.length > 0 && (
                      <div className="space-y-1.5">
                        {msg.data.results.slice(0, 8).map((r, j) => (
                          <Link key={j} href={`/verdict/${r.address}`}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elevated/50 hover:bg-bg-hover transition-colors cursor-pointer group">
                            <div>
                              <span className="text-xs font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{r.symbol}</span>
                              <span className="text-[10px] text-text-muted ml-2">{r.token}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono">
                              <span className="text-text-muted">{r.reason}</span>
                              <span className="text-accent-cyan font-medium">{(r.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-surface border border-border">
              <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />
              <span className="text-xs text-text-muted">Processing query...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="Query intelligence... (e.g., find trending AI tokens)"
          disabled={isLoading}
          className="w-full px-4 py-3.5 pr-12 rounded-xl bg-bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active font-mono transition-colors disabled:opacity-50"
        />
        <button onClick={() => handleSubmit()} disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer disabled:opacity-30"
          aria-label="Send query">
          <Send className="w-4 h-4 text-accent-cyan" />
        </button>
      </div>
    </div>
  );
}
