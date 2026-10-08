import { useEffect, useRef } from "react";
import { Sparkles, FileText, Globe, Key, Layers, ArrowUpRight } from "lucide-react";
import type { ChatMessage } from "@/hooks/useAgentStream";
import { MessageBubble } from "./MessageBubble";

const SUGGESTED_PROMPTS = [
  {
    icon: Key,
    title: "Document Authentication",
    text: "What auth does Aurora use, and what is mTLS?",
    type: "Document RAG",
  },
  {
    icon: Globe,
    title: "Live Web Intelligence",
    text: "What are the latest AI news and agent breakthroughs this week?",
    type: "Web Search",
  },
  {
    icon: FileText,
    title: "Tenant Architecture",
    text: "Does Aurora support cross-tenant joins or personal access tokens?",
    type: "Fact Extraction",
  },
  {
    icon: Layers,
    title: "Product Specs",
    text: "Summarize the key features and changelog specs of Aurora v3.2.",
    type: "Document Summary",
  },
];

export function MessageList({
  messages,
  liveAnswer,
  streaming,
  onSelectPrompt,
}: {
  messages: ChatMessage[];
  liveAnswer: string;
  streaming: boolean;
  onSelectPrompt?: (prompt: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);

  useEffect(() => {
    if (atBottomRef.current) endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, liveAnswer, streaming]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const empty = messages.length === 0 && !liveAnswer;

  return (
    <div onScroll={onScroll} className="flex-1 overflow-y-auto px-4 py-6">
      {empty ? (
        <div className="mx-auto my-auto flex max-w-2xl flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm ring-1 ring-accent/30">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            Nexus AI — Autonomous Research Assistant
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            An agentic reasoning assistant that plans, queries your private document knowledge base, searches the live web, and verifies every statement with clickable inline citations.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-muted">
              📑 ChromaDB Vector Retrieval
            </span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-muted">
              🌐 Real-Time Web Search
            </span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-muted">
              ⚡ Multi-Step ReAct Engine
            </span>
          </div>

          <div className="mt-8 w-full text-left">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted">
              Suggested Questions
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SUGGESTED_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectPrompt?.(item.text)}
                    disabled={streaming}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-3 text-left transition hover:border-accent/50 hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg">
                        <Icon className="h-3.5 w-3.5 text-accent" />
                        {item.title}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted group-hover:text-fg">
                      "{item.text}"
                    </p>
                    <span className="mt-2 text-[10px] font-medium text-accent/80">
                      {item.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {liveAnswer && <MessageBubble role="assistant" content={liveAnswer} streaming />}
          {streaming && !liveAnswer && (
            <MessageBubble role="assistant" content="" streaming />
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
