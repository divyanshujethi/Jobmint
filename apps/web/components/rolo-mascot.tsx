"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Flame,
  FileText,
  ShieldCheck,
  Search,
  ArrowUp,
  X,
  Shuffle,
  ChevronRight,
  Bot,
  Laptop,
} from "lucide-react";

type RoloMood = "default" | "happy" | "thinking" | "wave" | "search";
type RoloSize = "sm" | "md" | "lg" | "xl";

interface RoloMascotProps {
  mood?: RoloMood;
  size?: RoloSize;
  message?: string;
  /** Show as floating interactive copilot */
  floating?: boolean;
  /** Custom filter handler if embedded in jobs page */
  onQuickFilter?: (filter: {
    exp?: string;
    mode?: string;
    search?: string;
    type?: string;
  }) => void;
  /** Dismiss handler */
  onDismiss?: () => void;
  className?: string;
}

const SIZE_MAP: Record<RoloSize, { img: number; wrapper: string }> = {
  sm: { img: 40, wrapper: "h-10 w-10" },
  md: { img: 60, wrapper: "h-14 w-14" },
  lg: { img: 90, wrapper: "h-20 w-20" },
  xl: { img: 120, wrapper: "h-28 w-28" },
};

const CAREER_TIPS = [
  "💡 Roles applied to within the first 48 hours receive a 4.2x higher recruiter response rate!",
  "🚀 Adding a live deployment URL to your GitHub projects boosts resume shortlisting by 68%.",
  "⚡ RoleNest Truth Teller tracks recruiter ghosting so you never waste weeks waiting in silence.",
  "🎯 For freshers: Highlight project impact (e.g. 'reduced load time by 40%') over long technology lists.",
  "🔥 Keep your POTD streak alive! Solving daily challenges elevates your verified DevScore profile.",
  "📄 ATS Tip: Standard single-column resume formatting ensures automated parsers capture 100% of your data.",
  "💼 Check our 4-Week Industrial Bootcamp for verified certificate IDs and real repo contributions!",
  "🌐 Tailor your headline with your core stack (e.g. 'Full Stack Engineer • Next.js & Python') for instant recruiter clarity.",
];

export function RoloMascot({
  mood = "default",
  size = "md",
  message,
  floating = false,
  onQuickFilter,
  onDismiss,
  className = "",
}: RoloMascotProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { img, wrapper } = SIZE_MAP[size];

  // Rotate tips periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CAREER_TIPS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const currentTip = CAREER_TIPS[tipIndex];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % CAREER_TIPS.length);
  };

  const handleApplyFilter = (filter: {
    exp?: string;
    mode?: string;
    search?: string;
    type?: string;
  }) => {
    if (onQuickFilter) {
      onQuickFilter(filter);
    } else {
      const params = new URLSearchParams();
      if (filter.exp) params.set("exp", filter.exp);
      if (filter.mode) params.set("mode", filter.mode);
      if (filter.search) params.set("q", filter.search);
      if (filter.type) params.set("type", filter.type);
      router.push(`/jobs?${params.toString()}`);
    }
    setIsOpen(false);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  if (floating) {
    return (
      <div
        className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3 select-none ${className}`}
      >
        {/* Expanded Assistant Card Popover */}
        {isOpen && (
          <div className="w-[320px] sm:w-[350px] rounded-3xl border border-emerald-500/40 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-4 text-white space-y-3.5 animate-pop-fade border-t-2 border-t-emerald-400">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-md shadow-emerald-500/30">
                  <img
                    src="/rolo-mascot.png"
                    alt="Rolo"
                    width={32}
                    height={32}
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    Rolo Copilot
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                      AI Guide
                    </span>
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-medium">
                    Smart recommendations &amp; shortcuts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Close Rolo Menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dynamic Career Tip Box */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-3 space-y-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-400" /> Career Insight
                </span>
                <button
                  type="button"
                  onClick={handleNextTip}
                  title="Next Tip"
                  className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Shuffle className="h-2.5 w-2.5" /> Next Tip
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentTip}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyFilter({ exp: "0" })}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-left transition-all group cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 truncate">
                      Fresher Roles
                    </div>
                    <div className="text-[9.5px] text-slate-400">0 Yrs Experience</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyFilter({ mode: "REMOTE" })}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-left transition-all group cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Laptop className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white group-hover:text-cyan-300 truncate">
                      100% Remote
                    </div>
                    <div className="text-[9.5px] text-slate-400">Work Anywhere</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyFilter({ search: "AI" })}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-left transition-all group cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white group-hover:text-purple-300 truncate">
                      AI &amp; ML Roles
                    </div>
                    <div className="text-[9.5px] text-slate-400">PyTorch &amp; LLMs</div>
                  </div>
                </button>

                <Link
                  href="/internships"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-left transition-all group cursor-pointer"
                >
                  <div className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold text-white group-hover:text-amber-300 truncate">
                      Paid Internships
                    </div>
                    <div className="text-[9.5px] text-slate-400">Stipends &gt;₹25k</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Secondary Direct Links */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/80">
              <Link
                href="/potd"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/60 text-center group"
              >
                <Flame className="h-3.5 w-3.5 text-orange-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] font-bold text-slate-300">Daily POTD</span>
              </Link>

              <Link
                href="/resume/parser"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/60 text-center group"
              >
                <FileText className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[10px] font-bold text-slate-300">ATS Score</span>
              </Link>

              <button
                type="button"
                onClick={handleScrollTop}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/60 text-center group cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform mb-1" />
                <span className="text-[10px] font-bold text-slate-300">Top of Page</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubble Prompt (When closed and not interacted) */}
        {!isOpen && showSpeechBubble && (
          <div className="relative max-w-[210px] rounded-2xl rounded-br-none bg-slate-950/95 border border-emerald-500/40 shadow-xl p-2.5 text-xs text-slate-200 font-medium leading-tight animate-pop-fade">
            <div className="flex items-start justify-between gap-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] mb-1">
                <Sparkles className="h-3 w-3" />
                <span>Rolo AI Copilot</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSpeechBubble(false)}
                className="text-slate-500 hover:text-slate-300 text-[10px] font-bold px-1"
                aria-label="Dismiss speech bubble"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300">
              Need freshers, remote jobs or ATS tips? Click me! 🦉
            </p>
          </div>
        )}

        {/* Animated Mascot Button */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setShowSpeechBubble(false);
              setHasInteracted(true);
            }}
            title="Open Rolo AI Copilot"
            aria-label="Open Rolo AI Copilot"
            className="relative flex h-14 w-14 md:h-16 md:md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 p-0.5 shadow-2xl transition-all duration-300 cursor-pointer animate-rolo-float animate-rolo-glow hover:scale-110 active:scale-95 group"
          >
            {/* Inner avatar badge */}
            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-white/80 p-1">
              <img
                src="/rolo-mascot.png"
                alt="Rolo - RoleNest Mascot"
                width={img}
                height={img}
                className="object-contain drop-shadow-md group-hover:scale-115 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                  const p = (e.target as HTMLElement).parentElement;
                  if (p) p.innerHTML = `<span style="font-size: 26px">🦉</span>`;
                }}
              />
            </div>

            {/* Glowing online radar badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Inline / embedded mode
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${wrapper} shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300 shadow-sm overflow-hidden animate-rolo-float`}
      >
        <img
          src="/rolo-mascot.png"
          alt="Rolo"
          width={img}
          height={img}
          className="object-contain"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            el.parentElement!.innerHTML = `<span style="font-size:${Math.round(img * 0.55)}px;line-height:1">🦉</span>`;
          }}
        />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs text-slate-800 font-medium leading-relaxed max-w-[280px] shadow-xs">
        {message ?? currentTip}
      </div>
    </div>
  );
}

/** Compact inline Rolo avatar chip */
export function RoloChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 animate-pulse">
      <span className="text-base leading-none">🦉</span>
      {label}
    </span>
  );
}
