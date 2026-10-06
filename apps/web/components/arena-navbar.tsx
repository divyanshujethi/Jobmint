"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Flame, Trophy, Zap, Terminal, Sparkles, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

import { ArenaRewardsModal } from "./arena-rewards-modal";

export function ArenaNavbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(3);
  const [devScore, setDevScore] = useState(780);
  const [xp, setXp] = useState(1250);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  useEffect(() => {
    try {
      const storedSolved = localStorage.getItem("jobmint_solved_problems");
      if (storedSolved) {
        const solvedArr = JSON.parse(storedSolved);
        if (Array.isArray(solvedArr)) {
          setXp(solvedArr.length * 50 + 200);
          setStreak(Math.max(1, solvedArr.length));
        }
      }
    } catch {}
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 h-13 border-b border-neutral-800 bg-[#0a0a0a] px-4 sm:px-6 flex items-center justify-between font-sans text-xs">
        {/* LEFT: LEETCODE STYLE LOGO & NAV */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-xs">
              <Code2 className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-sm tracking-tight text-white">
                Problem<span className="text-amber-400">Nest</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold hidden sm:inline">
                Arena
              </span>
            </div>
          </Link>

          {/* NAV TABS */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/problems"
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                pathname === "/problems"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              Problems
            </Link>

            <Link
              href="/potd"
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                pathname === "/potd" || pathname === "/"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
              <span>Daily POTD</span>
            </Link>

            <Link
              href="/leaderboard"
              className={`px-3 py-1.5 rounded-md font-semibold hidden md:flex items-center gap-1.5 transition-colors ${
                pathname === "/leaderboard"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Campus Battles</span>
            </Link>
          </nav>
        </div>

        {/* RIGHT: GAMIFICATION HUD */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono">
          {/* Rewards Button */}
          <button
            onClick={() => setShowRewardsModal(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 text-[11px] font-semibold transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Rewards</span>
          </button>

          {/* Streak */}
          <button
            onClick={() => setShowRewardsModal(true)}
            title="Consecutive Solving Streak — Click for Gamification HUD"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-950/50 hover:bg-orange-900/50 border border-orange-800/80 text-orange-400 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
            <span>{streak}d</span>
          </button>

          {/* XP */}
          <button
            onClick={() => setShowRewardsModal(true)}
            title="Earned Coding XP — Click for Gamification HUD"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/80 text-emerald-400 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <Zap className="h-3 w-3 fill-emerald-400 text-emerald-400" />
            <span>{xp} XP</span>
          </button>

          {/* DevScore Rank */}
          <button
            onClick={() => setShowRewardsModal(true)}
            title="Verified Coding DevScore — Click for Gamification HUD"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
          >
            <Trophy className="h-3 w-3 text-amber-400" />
            <span>DevScore: <strong className="text-white">{devScore}</strong></span>
          </button>
        </div>
      </header>

      {/* Gamification Modal */}
      <ArenaRewardsModal
        isOpen={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
        streak={streak}
        xp={xp}
        devScore={devScore}
      />
    </>
  );
}
