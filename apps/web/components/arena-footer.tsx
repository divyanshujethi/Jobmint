"use client";

import Link from "next/link";
import { Code2, Flame, Trophy, ExternalLink, ShieldCheck, Zap } from "lucide-react";

export function ArenaFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-[#0a0a0a] text-neutral-400 font-sans text-xs py-8 px-4 sm:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-xs">
            <Code2 className="h-3.5 w-3.5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-white tracking-tight">
            Problem<span className="text-amber-400">Nest</span> Arena
          </span>
          <span className="text-neutral-600">&bull;</span>
          <span className="text-[11px] text-neutral-500">
            Isolated In-Browser V8 Sandboxed Runner
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-neutral-400">
          <Link href="/problems" className="hover:text-white transition-colors">
            Problems
          </Link>
          <Link href="/potd" className="hover:text-white transition-colors flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-400 fill-orange-400" />
            <span>Daily POTD</span>
          </Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors flex items-center gap-1">
            <Trophy className="h-3 w-3 text-amber-400" />
            <span>Campus Battles</span>
          </Link>
          <a
            href="https://rolenest.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-neutral-400 flex items-center gap-1 transition-colors"
          >
            <span>RoleNest.in</span>
            <ExternalLink className="h-3 w-3 text-neutral-600" />
          </a>
        </div>
      </div>
    </footer>
  );
}
