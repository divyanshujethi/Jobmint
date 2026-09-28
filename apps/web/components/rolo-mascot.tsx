"use client";

import { useState } from "react";
import Image from "next/image";

type RoloMood = "default" | "happy" | "thinking" | "wave" | "search";
type RoloSize = "sm" | "md" | "lg" | "xl";

interface RoloMascotProps {
  mood?: RoloMood;
  size?: RoloSize;
  message?: string;
  /** Show as floating bubble (fixed bottom-right corner) */
  floating?: boolean;
  /** Dismiss handler for floating mode */
  onDismiss?: () => void;
  className?: string;
}

const SIZE_MAP: Record<RoloSize, { img: number; wrapper: string }> = {
  sm: { img: 40, wrapper: "h-10 w-10" },
  md: { img: 64, wrapper: "h-16 w-16" },
  lg: { img: 96, wrapper: "h-24 w-24" },
  xl: { img: 128, wrapper: "h-32 w-32" },
};

const MOOD_TIPS: Record<RoloMood, string> = {
  default: "Hi! I'm Rolo 🦉 — your AI career guide on RoleNest!",
  happy: "🎉 Great match found! This role fits your profile perfectly.",
  thinking: "🤔 Analyzing your profile... finding the best roles for you!",
  wave: "👋 Welcome back! Your personalized job feed is ready.",
  search: "🔍 Tip: Use Cmd/Ctrl + K to open spotlight search instantly!",
};

export function RoloMascot({
  mood = "default",
  size = "md",
  message,
  floating = false,
  onDismiss,
  className = "",
}: RoloMascotProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const { img, wrapper } = SIZE_MAP[size];

  if (dismissed) return null;

  const displayMessage = message ?? MOOD_TIPS[mood];

  if (floating) {
    return (
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 ${className}`}
      >
        {/* Speech bubble */}
        {showBubble && (
          <div className="relative max-w-[220px] rounded-2xl rounded-br-sm bg-white border border-emerald-200 shadow-lg p-3 text-xs text-slate-700 font-medium leading-relaxed animate-in slide-in-from-bottom-2 fade-in duration-300">
            {displayMessage}
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 text-[9px] font-black"
            >
              ✕
            </button>
          </div>
        )}

        {/* Rolo avatar button */}
        <button
          onClick={() => setShowBubble((v) => !v)}
          className="group relative flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl hover:shadow-emerald-400/50 hover:scale-110 transition-all duration-200 border-2 border-white"
          title="Chat with Rolo"
          style={{ width: img + 8, height: img + 8 }}
        >
          <img
            src="/rolo-mascot.png"
            alt="Rolo - RoleNest AI Guide"
            width={img}
            height={img}
            className="object-contain drop-shadow-sm"
            onError={(e) => {
              // Fallback to emoji if image fails
              (e.target as HTMLImageElement).style.display = "none";
              const el = e.target as HTMLImageElement;
              el.parentElement!.innerHTML = `<span style="font-size:${img * 0.5}px">🦉</span>`;
            }}
          />
          {/* Pulse dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        </button>

        {onDismiss && (
          <button
            onClick={() => { setDismissed(true); onDismiss(); }}
            className="text-[10px] text-slate-400 hover:text-slate-600 underline"
          >
            Hide Rolo
          </button>
        )}
      </div>
    );
  }

  // Inline / embedded mode
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${wrapper} shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 shadow-sm overflow-hidden`}
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
      {displayMessage && (
        <div className="rounded-2xl rounded-tl-sm bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-slate-700 font-medium leading-relaxed max-w-[240px]">
          {displayMessage}
        </div>
      )}
    </div>
  );
}

/** Compact inline Rolo avatar chip — use anywhere in the UI */
export function RoloChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">
      <span className="text-base leading-none">🦉</span>
      {label}
    </span>
  );
}
