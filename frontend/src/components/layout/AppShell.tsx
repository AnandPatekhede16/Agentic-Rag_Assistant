import { useState, type ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { UploadDialog } from "@/components/upload/UploadDialog";
import { PanelRightOpen, PanelRightClose, Sparkles } from "lucide-react";

export function AppShell({
  health,
  chat,
  inspector,
  onIngested,
}: {
  health?: ReactNode;
  chat: ReactNode;
  inspector: ReactNode;
  onIngested?: (chunks: number) => void;
}) {
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-2.5 backdrop-blur">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight">Nexus AI</span>
            <span className="hidden rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent sm:inline">
              Agentic RAG
            </span>
          </div>
          <span className="text-[11px] text-muted">LangGraph · ChromaDB · Dual Search Engine</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {health}
          <UploadDialog onIngested={onIngested} />

          <a
            href="https://github.com/AnandPatekhede16/Agentic-Rag_Assistant"
            target="_blank"
            rel="noreferrer"
            title="View project on GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-2 hover:text-fg"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          <button
            onClick={() => setMobileInspectorOpen(!mobileInspectorOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-2 hover:text-fg lg:hidden"
            title="Toggle Agent Inspector"
          >
            {mobileInspectorOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>

          <ThemeToggle />
        </div>
      </header>

      <main className="relative grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div className="min-h-0 border-r border-border">{chat}</div>
        <aside
          className={`${
            mobileInspectorOpen ? "absolute inset-0 z-20 flex bg-bg p-4" : "hidden"
          } min-h-0 flex-col gap-4 overflow-y-auto bg-bg p-4 lg:flex`}
        >
          {inspector}
        </aside>
      </main>
    </div>
  );
}
