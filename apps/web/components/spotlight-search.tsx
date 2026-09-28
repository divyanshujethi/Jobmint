"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Briefcase,
  MapPin,
  Code2,
  Building2,
  Flame,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";

interface SpotlightSearchProps {
  jobs: MockJob[];
  isOpen: boolean;
  onClose: () => void;
}

type SuggestionKind = "job" | "company" | "skill" | "location" | "quick";

interface Suggestion {
  kind: SuggestionKind;
  label: string;
  sublabel?: string;
  href?: string;
  action?: () => void;
  icon?: React.ReactNode;
  jobCount?: number;
}

const QUICK_ACTIONS: Suggestion[] = [
  {
    kind: "quick",
    label: "🎓 Fresher Jobs (0 YOE)",
    sublabel: "Entry-level & internships",
    href: "/jobs?exp=0",
    icon: <Zap className="h-4 w-4 text-amber-500" />,
  },
  {
    kind: "quick",
    label: "🌐 Remote India Jobs",
    sublabel: "Work from anywhere in India",
    href: "/jobs?mode=remote",
    icon: <MapPin className="h-4 w-4 text-emerald-500" />,
  },
  {
    kind: "quick",
    label: "🏛️ Government Tech Jobs",
    sublabel: "SSC, NIC, CDAC & more",
    href: "/gov-tech",
    icon: <Building2 className="h-4 w-4 text-blue-500" />,
  },
  {
    kind: "quick",
    label: "🔥 Trending: React / Next.js",
    sublabel: "Frontend engineering roles",
    href: "/jobs?q=React",
    icon: <Flame className="h-4 w-4 text-orange-500" />,
  },
  {
    kind: "quick",
    label: "🤖 AI / ML Engineer Roles",
    sublabel: "Python, PyTorch, LLMs",
    href: "/jobs?q=AI+ML",
    icon: <Sparkles className="h-4 w-4 text-violet-500" />,
  },
];

// Deduplicate and sort suggestion groups
function buildSuggestions(query: string, jobs: MockJob[]): Suggestion[] {
  if (!query || query.length < 1) return [];

  const q = query.toLowerCase().trim();
  const results: Suggestion[] = [];

  // 1. Direct title matches (top 5 most relevant)
  const titleMatches = jobs
    .filter((j) => j.title.toLowerCase().includes(q))
    .slice(0, 5);
  for (const j of titleMatches) {
    results.push({
      kind: "job",
      label: j.title,
      sublabel: `${j.companyName} • ${j.location}`,
      href: `/jobs/${j.slug}`,
      icon: <Briefcase className="h-4 w-4 text-slate-400" />,
    });
  }

  // 2. Company matches
  const companyCounts: Record<string, { name: string; count: number; slug: string }> = {};
  for (const j of jobs) {
    if (j.companyName.toLowerCase().includes(q)) {
      if (!companyCounts[j.companySlug]) {
        companyCounts[j.companySlug] = { name: j.companyName, count: 0, slug: j.companySlug };
      }
      companyCounts[j.companySlug].count++;
    }
  }
  Object.values(companyCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .forEach((c) => {
      results.push({
        kind: "company",
        label: c.name,
        sublabel: `${c.count} open role${c.count !== 1 ? "s" : ""}`,
        href: `/companies/${c.slug}`,
        icon: <Building2 className="h-4 w-4 text-slate-400" />,
        jobCount: c.count,
      });
    });

  // 3. Skill matches
  const skillCounts: Record<string, number> = {};
  for (const j of jobs) {
    for (const s of j.skills) {
      if (s.toLowerCase().includes(q)) {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      }
    }
  }
  Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .forEach(([skill, count]) => {
      results.push({
        kind: "skill",
        label: skill,
        sublabel: `${count} job${count !== 1 ? "s" : ""} require this skill`,
        href: `/jobs?q=${encodeURIComponent(skill)}`,
        icon: <Code2 className="h-4 w-4 text-emerald-400" />,
        jobCount: count,
      });
    });

  // 4. Location matches
  const locationSet = new Set<string>();
  for (const j of jobs) {
    if (j.location.toLowerCase().includes(q)) locationSet.add(j.location);
  }
  Array.from(locationSet)
    .slice(0, 3)
    .forEach((loc) => {
      results.push({
        kind: "location",
        label: loc,
        sublabel: `Jobs in ${loc}`,
        href: `/jobs?q=${encodeURIComponent(loc)}`,
        icon: <MapPin className="h-4 w-4 text-blue-400" />,
      });
    });

  return results.slice(0, 10);
}

const KIND_ORDER: Record<SuggestionKind, number> = {
  job: 0,
  company: 1,
  skill: 2,
  location: 3,
  quick: 4,
};

const KIND_LABELS: Record<SuggestionKind, string> = {
  job: "Roles",
  company: "Companies",
  skill: "Skills",
  location: "Locations",
  quick: "Quick Actions",
};

export function SpotlightSearch({ jobs, isOpen, onClose }: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => (query.trim().length >= 1 ? buildSuggestions(query, jobs) : []),
    [query, jobs]
  );

  const displayItems: Suggestion[] = query.trim().length >= 1 ? suggestions : QUICK_ACTIONS;

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, displayItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const item = displayItems[activeIdx];
        if (item) {
          if (item.href) {
            router.push(item.href);
            onClose();
          } else if (item.action) {
            item.action();
            onClose();
          }
        } else if (query.trim()) {
          router.push(`/jobs?q=${encodeURIComponent(query.trim())}`);
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [displayItems, activeIdx, query, router, onClose]
  );

  const handleSelect = (item: Suggestion) => {
    if (item.href) {
      router.push(item.href);
      onClose();
    } else if (item.action) {
      item.action();
      onClose();
    }
  };

  // Keep active item in view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement;
    if (active) active.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!isOpen) return null;

  // Group items by kind for section headers
  const grouped: { kind: SuggestionKind; items: (Suggestion & { idx: number })[] }[] = [];
  let globalIdx = 0;
  const kindOrder = query.trim() ? [...new Set(displayItems.map((i) => i.kind))].sort((a, b) => KIND_ORDER[a] - KIND_ORDER[b]) : ["quick" as SuggestionKind];

  for (const kind of kindOrder) {
    const items = displayItems
      .filter((it) => it.kind === kind)
      .map((it) => ({ ...it, idx: globalIdx++ }));
    if (items.length) grouped.push({ kind, items });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-[12vh] z-50 w-full max-w-2xl -translate-x-1/2 px-4 sm:px-0">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 flex flex-col max-h-[70vh]">
          
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
            <Search className="h-5 w-5 shrink-0 text-emerald-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search jobs, companies, skills, locations…"
              className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="shrink-0 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="shrink-0 hidden sm:inline-flex items-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-500">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="overflow-y-auto">
            {grouped.length === 0 && query.trim().length >= 1 && (
              <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
                <span className="text-4xl">🦉</span>
                <p className="text-sm font-medium">No results for <strong className="text-slate-700">"{query}"</strong></p>
                <button
                  onClick={() => { router.push(`/jobs?q=${encodeURIComponent(query)}`); onClose(); }}
                  className="mt-1 text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                >
                  Search all jobs for "{query}" <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {grouped.map(({ kind, items }) => (
              <div key={kind}>
                {/* Section header */}
                <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-50/80 border-b border-slate-100">
                  {KIND_LABELS[kind]}
                </div>
                {items.map((item) => (
                  <button
                    key={item.label + item.idx}
                    data-idx={item.idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIdx(item.idx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeIdx === item.idx
                        ? "bg-emerald-50 border-l-2 border-emerald-500"
                        : "hover:bg-slate-50 border-l-2 border-transparent"
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 truncate">
                        {item.label}
                      </span>
                      {item.sublabel && (
                        <span className="block text-xs text-slate-500 truncate mt-0.5">
                          {item.sublabel}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  </button>
                ))}
              </div>
            ))}

            {/* Footer hint */}
            {displayItems.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>🦉</span>
                  <span>Rolo — Your AI Career Guide</span>
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span><kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] font-mono">↑↓</kbd> navigate</span>
                  <span><kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] font-mono">↵</kbd> select</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Hook: opens spotlight on Cmd/Ctrl+K or "/" keypress globally */
export function useSpotlight() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
        return;
      }
      // "/" key when not in an input/textarea
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement).isContentEditable
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
