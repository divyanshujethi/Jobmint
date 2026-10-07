"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Trophy,
  Target,
  Crown,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";

interface StudyGamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  xp: number;
  initialTab?: "overview" | "quests" | "badges";
}

export const STUDY_RANKS = [
  { level: 1, name: "Apprentice Scholar", minXp: 0, maxXp: 500, icon: "🌱", color: "text-emerald-400", border: "border-emerald-500/40" },
  { level: 2, name: "Algorithm Builder", minXp: 500, maxXp: 1500, icon: "⚡", color: "text-cyan-400", border: "border-cyan-500/40" },
  { level: 3, name: "Systems Architect", minXp: 1500, maxXp: 3000, icon: "🛡️", color: "text-indigo-400", border: "border-indigo-500/40" },
  { level: 4, name: "Staff Specialist", minXp: 3000, maxXp: 5000, icon: "👑", color: "text-purple-400", border: "border-purple-500/40" },
  { level: 5, name: "Principal Fellow", minXp: 5000, maxXp: 10000, icon: "🔥", color: "text-amber-400", border: "border-amber-500/40" },
  { level: 6, name: "Grandmaster Engineer", minXp: 10000, maxXp: 25000, icon: "⚡", color: "text-rose-400", border: "border-rose-500/40" },
];

export const STUDY_DAILY_QUESTS = [
  { id: "q1", title: "Master a Roadmap Milestone", xp: 100, desc: "Complete any checklist node on Canvas or Career Roadmaps", icon: "🎯", href: "/canvas" },
  { id: "q2", title: "Review 3-Min Code Blueprint", xp: 50, desc: "Inspect and test an architectural pattern", icon: "💻", href: "/canvas" },
  { id: "q3", title: "Solve an Engineering Interview POTD", xp: 50, desc: "Crack today's problem with optimal Big-O complexity", icon: "💡", href: "/potd" },
  { id: "q4", title: "Capture Whiteboard Study Notes", xp: 50, desc: "Write technical notes or draw a system topology", icon: "📝", href: "/whiteboard" },
];

export const STUDY_ACHIEVEMENTS = [
  { id: "a1", title: "First Commit", desc: "Started your engineering career path", xp: 100, icon: "🚀" },
  { id: "a2", title: "Streak Warrior", desc: "Maintained a consecutive 3+ day learning streak", xp: 150, icon: "🔥" },
  { id: "a3", title: "Systems Thinker", desc: "Mastered 5 architectural engineering milestones", xp: 250, icon: "💎" },
  { id: "a4", title: "Polyglot Master", desc: "Explored 3 specialized engineering tracks", xp: 100, icon: "🌐" },
  { id: "a5", title: "Grandmaster Aspirant", desc: "Accumulated 1,500+ Engineering Study XP", xp: 500, icon: "👑" },
  { id: "a6", title: "Architect Fellow", desc: "Completed 10 milestones across curricula", xp: 600, icon: "🏛️" },
];

export function StudyGamificationModal({
  isOpen,
  onClose,
  streak,
  xp,
  initialTab = "overview",
}: StudyGamificationModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "quests" | "badges">(initialTab);
  const [claimedQuests, setClaimedQuests] = useState<Set<string>>(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set(["a1"]));
  const [currentXp, setCurrentXp] = useState(xp);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setCurrentXp(xp);
  }, [xp]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const savedQuests = localStorage.getItem("studynest_claimed_quests");
      if (savedQuests) setClaimedQuests(new Set(JSON.parse(savedQuests)));

      const savedAchievements = localStorage.getItem("studynest_achievements");
      if (savedAchievements) setUnlockedAchievements(new Set(JSON.parse(savedAchievements)));
    } catch {}
  }, [isOpen]);

  const currentRank = useMemo(() => {
    return STUDY_RANKS.find((r) => currentXp >= r.minXp && currentXp < r.maxXp) || STUDY_RANKS[STUDY_RANKS.length - 1];
  }, [currentXp]);

  const nextRank = useMemo(() => {
    const idx = STUDY_RANKS.findIndex((r) => r.level === currentRank.level);
    return idx >= 0 && idx < STUDY_RANKS.length - 1 ? STUDY_RANKS[idx + 1] : null;
  }, [currentRank]);

  const rankProgress = useMemo(() => {
    if (!nextRank) return 100;
    const range = nextRank.minXp - currentRank.minXp;
    const currentInRank = currentXp - currentRank.minXp;
    return Math.min(100, Math.max(0, Math.round((currentInRank / range) * 100)));
  }, [currentXp, currentRank, nextRank]);

  const xpNeeded = useMemo(() => {
    if (!nextRank) return 0;
    return Math.max(0, nextRank.minXp - currentXp);
  }, [currentXp, nextRank]);

  const handleClaimQuest = (questId: string, questXp: number) => {
    if (claimedQuests.has(questId)) return;
    const updated = new Set(claimedQuests);
    updated.add(questId);
    setClaimedQuests(updated);

    const nextXp = currentXp + questXp;
    setCurrentXp(nextXp);

    try {
      localStorage.setItem("studynest_claimed_quests", JSON.stringify(Array.from(updated)));
      localStorage.setItem("studynest_gamification_xp", nextXp.toString());
      window.dispatchEvent(new Event("studynest-xp-updated"));
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#090d24] border border-indigo-900/80 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-6 max-h-[92vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-950/60 transition-colors"
          title="Close Dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER: PLAYER RANK & STREAK OVERVIEW */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-3xl shadow-lg shadow-indigo-600/30">
            {currentRank.icon}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 border ${currentRank.border} ${currentRank.color}`}>
                Rank: {currentRank.name}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Level {currentRank.level}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              StudyNest Gamification Hub
            </h2>
            <p className="text-xs text-slate-400">
              Track your daily learning momentum, earn Engineering XP, and complete technical quests.
            </p>
          </div>
        </div>

        {/* STATS MATRIX: STREAK & XP PROGRESS */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          {/* Daily Streak Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider">Learning Streak</span>
              <Flame className="h-5 w-5 fill-amber-400 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-amber-300">{streak} Days</div>
            <p className="text-[10px] text-amber-400/80 font-sans">
              Keep solving or learning daily to protect your streak flame!
            </p>
          </div>

          {/* Total XP Card */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-1">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Study XP</span>
              <Zap className="h-5 w-5 fill-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{currentXp.toLocaleString()} XP</div>
            <p className="text-[10px] text-indigo-400/80 font-sans">
              Earned from curricula, quizzes, and canvas milestones.
            </p>
          </div>
        </div>

        {/* XP TO NEXT LEVEL PROGRESS BAR */}
        <div className="rounded-2xl border border-indigo-900/60 bg-[#0c1133] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              <span>Next Rank: {nextRank ? nextRank.name : "Max Rank Reached"}</span>
            </span>
            <span className="text-cyan-300 font-bold">
              {nextRank ? `${xpNeeded.toLocaleString()} XP to Level-Up` : "Legendary Status"}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400 transition-all duration-500 shadow-sm"
              style={{ width: `${rankProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>{currentRank.minXp.toLocaleString()} XP</span>
            <span>{rankProgress}% Completed</span>
            <span>{nextRank ? nextRank.minXp.toLocaleString() : "MAX"} XP</span>
          </div>
        </div>

        {/* TAB TOGGLE: Overview | Quests | Badges */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#070a1e] border border-indigo-950">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Ranks ({STUDY_RANKS.length})
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "quests"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Daily Quests</span>
            {claimedQuests.size < STUDY_DAILY_QUESTS.length && (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "badges"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Trophies</span>
          </button>
        </div>

        {/* TAB 1: ALL RANKS HIERARCHY */}
        {activeTab === "overview" && (
          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
            {STUDY_RANKS.map((r) => {
              const isCurrent = currentRank.level === r.level;
              const isPassed = currentXp >= r.maxXp;
              return (
                <div
                  key={r.level}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-indigo-950/60 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30"
                      : isPassed
                      ? "bg-[#0b102b]/60 border-indigo-950 text-slate-400"
                      : "bg-[#070b1f]/40 border-indigo-950/40 opacity-60 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{r.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{r.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                            Current
                          </span>
                        )}
                        {isPassed && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {r.minXp.toLocaleString()} - {r.maxXp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Lvl {r.level}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DAILY QUESTS */}
        {activeTab === "quests" && (
          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
            {STUDY_DAILY_QUESTS.map((q) => {
              const isClaimed = claimedQuests.has(q.id);
              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0c1133] border border-indigo-900/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{q.title}</div>
                      <div className="text-[10px] text-slate-400">{q.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.href && !isClaimed && (
                      <Link
                        href={q.href}
                        onClick={onClose}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Go &rarr;
                      </Link>
                    )}
                    <Button
                      size="sm"
                      disabled={isClaimed}
                      onClick={() => handleClaimQuest(q.id, q.xp)}
                      className={`text-xs font-bold rounded-xl h-8 px-3 ${
                        isClaimed
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-default"
                          : "bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-md shadow-amber-500/20"
                      }`}
                    >
                      {isClaimed ? "Claimed" : `+${q.xp} XP`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: CAREER TROPHIES */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-1">
            {STUDY_ACHIEVEMENTS.map((a) => {
              const isUnlocked = unlockedAchievements.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isUnlocked
                      ? "bg-[#0f153d] border-indigo-700/80 shadow-md"
                      : "bg-[#080c24]/50 border-indigo-950/40 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{a.title}</span>
                        {isUnlocked && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{a.desc}</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-indigo-900/40 flex items-center justify-between text-[10px] font-mono">
                    <span className={isUnlocked ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      {isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                    <span className="text-amber-400 font-bold">+{a.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="pt-2 flex items-center justify-between border-t border-indigo-950 text-xs">
          <Link
            href="/canvas"
            onClick={onClose}
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 font-bold transition-colors"
          >
            <span>Open Spatial Canvas</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <Button
            size="sm"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
