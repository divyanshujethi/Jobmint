"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Flame,
  Trophy,
  Zap,
  Sparkles,
  ExternalLink,
  Crown,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ArenaRewardsModal } from "./arena-rewards-modal";
import { ArenaProModal } from "./arena-pro-modal";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  devScore?: number | null;
}

export function ArenaNavbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(0);
  const [devScore, setDevScore] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync user session and local problem progress
  useEffect(() => {
    // 1. Fetch Auth session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          if (data.user.devScore) {
            setDevScore(data.user.devScore);
          }
        }
      })
      .catch(() => {});

    // 2. Local storage streak & solved count
    try {
      const storedSolved = localStorage.getItem("jobmint_solved_problems");
      if (storedSolved) {
        const solvedArr = JSON.parse(storedSolved);
        if (Array.isArray(solvedArr) && solvedArr.length > 0) {
          setXp(solvedArr.length * 50);
          setStreak(solvedArr.length);
          setDevScore(Math.min(1000, solvedArr.length * 50));
        }
      }
    } catch {}

    // Close user menu on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 h-13 border-b border-neutral-800 bg-[#0a0a0a] px-3 sm:px-6 flex items-center justify-between font-sans text-xs">
        {/* LEFT: LEETCODE STYLE LOGO & NAV */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-xs">
              <Code2 className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-sm tracking-tight text-white">
                Problem<span className="text-amber-400">Nest</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold hidden md:inline">
                Arena
              </span>
            </div>
          </Link>

          {/* NAV TABS */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/problems"
              className={`px-2.5 sm:px-3 py-1.5 rounded-md font-semibold transition-colors ${
                pathname === "/problems"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              Problems
            </Link>

            <Link
              href="/potd"
              className={`px-2.5 sm:px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
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
              className={`px-2.5 sm:px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                pathname === "/leaderboard"
                  ? "bg-neutral-800 text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Campus Battles</span>
              <span className="sm:hidden">Rank</span>
            </Link>
          </nav>
        </div>

        {/* RIGHT: GAMIFICATION HUD & USER PROFILE */}
        <div className="flex items-center gap-2 sm:gap-2.5 font-mono">
          {/* PRO MONETIZATION BUTTON */}
          <button
            onClick={() => setShowProModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-linear-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 text-amber-400 text-[11px] font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            title="Unlock Company Questions & AI Debugger"
          >
            <Crown className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Arena Pro</span>
            <span className="sm:hidden">Pro</span>
          </button>

          {/* ROLENEST.IN PORTAL LINK */}
          <a
            href="https://rolenest.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-[11px] transition-colors"
            title="Switch back to RoleNest Tech Jobs & Internships Platform"
          >
            <span>RoleNest.in</span>
            <ExternalLink className="h-3 w-3 text-neutral-500" />
          </a>

          {/* Streak */}
          <button
            onClick={() => setShowRewardsModal(true)}
            title="Daily Solving Streak — Click for Rewards"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-orange-950/50 hover:bg-orange-900/50 border border-orange-800/80 text-orange-400 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
            <span>{streak}d</span>
          </button>

          {/* XP */}
          <button
            onClick={() => setShowRewardsModal(true)}
            title="Total Earned XP — Click for Rewards"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/80 text-emerald-400 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <Zap className="h-3 w-3 fill-emerald-400 text-emerald-400" />
            <span>{xp} XP</span>
          </button>

          {/* USER PROFILE OR LOGIN */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white transition-colors"
                title={`Signed in as ${user.name || user.email}`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-[11px] font-bold text-white shadow-xs">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <ChevronDown className="h-3 w-3 text-neutral-400 pr-1" />
              </button>

              {/* USER DROPDOWN */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-neutral-800 bg-[#141414] p-2 shadow-2xl text-neutral-200 z-50 font-sans animate-in fade-in zoom-in-95">
                  <div className="border-b border-neutral-800 px-3 py-2.5">
                    <div className="text-xs font-bold text-white truncate">{user.name || "Coder"}</div>
                    <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono bg-neutral-900 px-2 py-1 rounded-md text-amber-400">
                      <span>DevScore: {devScore !== null && devScore > 0 ? `${devScore}/1000` : "Unranked"}</span>
                      <span>Streak: {streak}d</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/leaderboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                    >
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      <span>My Campus Rank</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setShowRewardsModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors text-left"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Gamification Badges</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setShowProModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-amber-950/30 text-amber-400 transition-colors text-left font-semibold"
                    >
                      <Crown className="h-3.5 w-3.5" />
                      <span>Upgrade to Arena Pro</span>
                    </button>
                  </div>

                  <div className="border-t border-neutral-800 pt-1">
                    <a
                      href="/api/auth/signout"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a
              href={`https://rolenest.in/login?callbackUrl=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : "https://problem.rolenest.in/potd"
              )}`}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all hover:scale-[1.02]"
              title="Sign in with your RoleNest account to save streaks and rank on leaderboard"
            >
              <span>Sign In</span>
            </a>
          )}
        </div>
      </header>

      {/* Gamification Rewards Modal */}
      <ArenaRewardsModal
        isOpen={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
        streak={streak}
        xp={xp}
        devScore={devScore || 0}
      />

      {/* Pro Monetization Modal */}
      <ArenaProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </>
  );
}
