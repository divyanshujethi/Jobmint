"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Zap,
  Flame,
  Award,
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Coins,
  Shield,
  Layers,
} from "lucide-react";
import { LEETCODE_PROBLEMS } from "@/lib/problems-data";

interface ArenaRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  xp: number;
  devScore: number;
}

const BADGE_DEFINITIONS: { name: string; desc: string; icon: string; category: string }[] = [
  { name: "Hash Map Master", desc: "Solved Two Sum with optimal O(n) hash table lookups", icon: "🔑", category: "Arrays & Hashing" },
  { name: "Syntax Tree Sentinel", desc: "Conquered Valid Parentheses using LIFO stack verification", icon: "🛡️", category: "Stack" },
  { name: "Volatility Trader", desc: "Found the optimal stock buy/sell valley and peak", icon: "📈", category: "Sliding Window" },
  { name: "Kadane Conqueror", desc: "Executed Kadane's maximum contiguous subarray algorithm", icon: "⚡", category: "Dynamic Programming" },
  { name: "Set Collision Detector", desc: "Detected duplicate elements using constant-time set lookups", icon: "🎯", category: "Arrays & Hashing" },
  { name: "Anagram Counter", desc: "Character frequency mapping for anagram validation", icon: "🔤", category: "Arrays & Hashing" },
  { name: "Calendar Optimizer", desc: "Merged overlapping chronological intervals in O(n log n)", icon: "📅", category: "Intervals" },
  { name: "Binary Log Halver", desc: "Executed textbook O(log n) binary search space reduction", icon: "🎯", category: "Binary Search" },
  { name: "Vector Embedding Alchemist", desc: "Computed dense vector cosine similarities for AI search", icon: "🤖", category: "AI & Machine Learning" },
  { name: "Distributed Shard Warden", desc: "Mapped key lookups onto a consistent hashing virtual node ring", icon: "🌐", category: "System Design" },
  { name: "Token Bucket Architect", desc: "Implemented high-throughput burst rate limiting for API gateways", icon: "🪣", category: "System Design" },
  { name: "Product Array Prodigy", desc: "Computed prefix and suffix products in O(n) without division", icon: "🔢", category: "Arrays & Hashing" },
];

export function ArenaRewardsModal({
  isOpen,
  onClose,
  streak,
  xp,
  devScore,
}: ArenaRewardsModalProps) {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    try {
      const storedSolved = localStorage.getItem("jobmint_solved_problems");
      if (storedSolved) {
        const arr = JSON.parse(storedSolved);
        if (Array.isArray(arr)) setSolvedCount(arr.length);
      }
      const storedBadges = localStorage.getItem("jobmint_unlocked_badges");
      if (storedBadges) {
        const arr = JSON.parse(storedBadges);
        if (Array.isArray(arr)) setUnlockedBadges(arr);
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  // Level computation: Every 300 XP is a level
  const level = Math.max(1, Math.floor(xp / 300) + 1);
  const currentLevelXp = xp % 300;
  const nextLevelProgress = Math.min(100, Math.round((currentLevelXp / 300) * 100));
  const coins = Math.floor(xp / 5);

  const getTierTitle = (lvl: number) => {
    if (lvl >= 10) return "Grandmaster Coder";
    if (lvl >= 7) return "Diamond Architect";
    if (lvl >= 5) return "Data Structure Duelist";
    if (lvl >= 3) return "Algorithm Apprentice";
    return "Novice Byte";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-[#121212] p-6 shadow-2xl text-neutral-100 font-sans space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER: PLAYER TIER & STATS */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-md">
            <Crown className="h-7 w-7 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                Level {level} &bull; {getTierTitle(level)}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Arena Gamification HUD
            </h2>
            <p className="text-xs text-neutral-400">
              Solve algorithmic problems to gain XP, unlock badges, and raise your DevScore.
            </p>
          </div>
        </div>

        {/* XP PROGRESS BAR */}
        <div className="rounded-xl border border-neutral-800 bg-[#171717] p-4 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>XP Progress to Level {level + 1}</span>
            </span>
            <span className="text-white font-bold">{currentLevelXp} / 300 XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-amber-500 transition-all duration-500"
              style={{ width: `${nextLevelProgress}%` }}
            />
          </div>
        </div>

        {/* STATS MATRIX */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
          <div className="rounded-xl border border-neutral-800 bg-[#171717] p-3 text-center">
            <div className="flex items-center justify-center text-orange-400 mb-1">
              <Flame className="h-4 w-4 fill-orange-400" />
            </div>
            <div className="text-lg font-black text-white">{streak} Days</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase">Streak</div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-[#171717] p-3 text-center">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <Zap className="h-4 w-4 fill-emerald-400" />
            </div>
            <div className="text-lg font-black text-white">{xp}</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase">Total XP</div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-[#171717] p-3 text-center">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Coins className="h-4 w-4" />
            </div>
            <div className="text-lg font-black text-white">{coins}</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase">Coins</div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-[#171717] p-3 text-center">
            <div className="flex items-center justify-center text-blue-400 mb-1">
              <Trophy className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-lg font-black text-white">{devScore}</div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase">DevScore</div>
          </div>
        </div>

        {/* ACHIEVEMENTS & BADGES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Achievement Badges ({unlockedBadges.length} / {BADGE_DEFINITIONS.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">
              Solved: {solvedCount} / {LEETCODE_PROBLEMS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BADGE_DEFINITIONS.map((b) => {
              const isUnlocked = unlockedBadges.includes(b.name);
              return (
                <div
                  key={b.name}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${
                    isUnlocked
                      ? "border-amber-500/40 bg-amber-950/20 text-neutral-100"
                      : "border-neutral-800 bg-[#161616] text-neutral-500 opacity-60"
                  }`}
                >
                  <div className="text-xl shrink-0 pt-0.5">{b.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono truncate">
                        {b.name}
                      </span>
                      {isUnlocked ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="h-3 w-3 text-neutral-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Daily Challenges reset every 24h</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors"
          >
            Close HUD
          </button>
        </div>
      </div>
    </div>
  );
}
