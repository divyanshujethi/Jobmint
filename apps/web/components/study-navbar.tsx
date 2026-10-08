"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Compass,
  BookOpen,
  ListVideo,
  Users2,
  Sparkles,
  Flame,
  Zap,
  Layers,
  Crown,
  Menu,
  X,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudyProModal } from "./study-pro-modal";
import { StudyGamificationModal } from "./study-gamification-modal";

export function StudyNavbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [gamificationModalOpen, setGamificationModalOpen] = useState(false);
  const [gamificationTab, setGamificationTab] = useState<"overview" | "quests" | "badges">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncGamification = () => {
      try {
        const savedPro = localStorage.getItem("studynest_pro_member");
        setIsPro(savedPro === "true");

        const savedStreak =
          localStorage.getItem("studynest_study_streak") ||
          localStorage.getItem("rolenest_study_streak");
        if (savedStreak) setStreak(parseInt(savedStreak, 10));

        const savedXp =
          localStorage.getItem("studynest_gamification_xp") ||
          localStorage.getItem("rolenest_study_xp");
        if (savedXp) {
          setXp(parseInt(savedXp, 10));
        }
      } catch {}
    };

    syncGamification();
    window.addEventListener("studynest-pro-updated", syncGamification);
    window.addEventListener("studynest-xp-updated", syncGamification);
    return () => {
      window.removeEventListener("studynest-pro-updated", syncGamification);
      window.removeEventListener("studynest-xp-updated", syncGamification);
    };
  }, []);

  const navLinks = [
    { href: "/roadmaps", label: "Roadmaps & Cohorts", icon: Compass },
    { href: "/canvas", label: "Course Canvas", icon: Layers },
    { href: "/whiteboard", label: "Whiteboard & Notes", icon: PenTool },
    { href: "/playlists", label: "Video Masterclasses", icon: ListVideo },
    { href: "/study-pods", label: "Peer Study Pods", icon: Users2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-indigo-950/60 bg-[#070913]/90 backdrop-blur-xl text-slate-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BRAND LOGO */}
          <div className="flex items-center gap-3">
            <Link href="/study" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white font-mono">
                    StudyNest <span className="text-indigo-400">Academy</span>
                  </span>
                  <span className="rounded-md border border-indigo-500/40 bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-widest text-indigo-300">
                    Campus
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-sans">
                  Open Curricula &amp; Engineering Roadmaps
                </span>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/study" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs shadow-indigo-500/10 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-2.5">
            {/* USER STREAK & XP BADGES (CLICKABLE GAMIFICATION HUB) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setGamificationTab("overview");
                  setGamificationModalOpen(true);
                }}
                title="View Learning Streak & Levels (Click to inspect)"
                className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
              >
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                <span>{streak}d</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGamificationTab("overview");
                  setGamificationModalOpen(true);
                }}
                title="View Study XP, Rank & Level-up Progress (Click to inspect)"
                className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
              >
                <Zap className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                <span>{xp.toLocaleString()} XP</span>
              </button>
            </div>

            {/* MONETIZATION: PRO UPGRADE BUTTON */}
            <button
              onClick={() => setProModalOpen(true)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all shadow-md ${
                isPro
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/50 text-amber-300 shadow-amber-500/20"
                  : "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 hover:scale-102"
              }`}
            >
              <Crown className={`h-3.5 w-3.5 ${isPro ? "text-amber-400 fill-amber-400" : "text-slate-950 fill-slate-950"}`} />
              <span>{isPro ? "PRO SCHOLAR" : "Get Pro Pass"}</span>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-indigo-950/60 bg-[#070913] px-4 py-4 space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-indigo-950 flex items-center justify-between text-xs px-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGamificationTab("overview");
                  setGamificationModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-amber-300 font-bold hover:opacity-80"
              >
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{streak}d Streak</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGamificationTab("overview");
                  setGamificationModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-indigo-300 font-bold hover:opacity-80"
              >
                <Zap className="h-4 w-4 fill-indigo-400 text-indigo-400" />
                <span>{xp.toLocaleString()} XP</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProModalOpen(true);
                }}
                className="flex items-center gap-1 text-amber-400 font-bold text-xs"
              >
                <Crown className="h-3.5 w-3.5 fill-amber-400" />
                <span>{isPro ? "PRO" : "Upgrade"}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Gamification Hub Modal (Streak, XP, Ranks, Daily Quests & Trophies) */}
      <StudyGamificationModal
        isOpen={gamificationModalOpen}
        onClose={() => setGamificationModalOpen(false)}
        streak={streak}
        xp={xp}
        initialTab={gamificationTab}
      />

      {/* Pro Membership Modal */}
      <StudyProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        onActivated={() => setIsPro(true)}
      />
    </>
  );
}
