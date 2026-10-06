"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Compass,
  BookOpen,
  ListVideo,
  Users2,
  Sparkles,
  Flame,
  Zap,
  Search,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Code2,
  Briefcase,
  Trophy,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudyNavbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(850);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem("rolenest_study_streak");
      if (savedStreak) setStreak(parseInt(savedStreak, 10));

      const savedProgress = localStorage.getItem("rolenest_study_progress");
      if (savedProgress) {
        const obj = JSON.parse(savedProgress);
        const totalCompletedDays = Object.values(obj).reduce(
          (acc: number, curr: any) => acc + (Array.isArray(curr) ? curr.length : 0),
          0
        );
        setXp(500 + totalCompletedDays * 120);
      }
    } catch {}

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPlatformMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/roadmaps", label: "Career Roadmaps", icon: Compass },
    { href: "/study", label: "30-Day Cohorts", icon: BookOpen },
    { href: "/playlists", label: "Video Masterclasses", icon: ListVideo },
    { href: "/study#ai-generator", label: "AI Syllabus Builder", icon: Sparkles },
    { href: "/study-pods", label: "Peer Study Pods", icon: Users2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-950/60 bg-[#070913]/90 backdrop-blur-xl text-slate-100">
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
                  RoleNest <span className="text-indigo-400">Study</span>
                </span>
                <span className="rounded-md border border-indigo-500/40 bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-widest text-indigo-300">
                  Academy
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
          {/* USER STREAK & XP BADGES */}
          <div className="hidden sm:flex items-center gap-2">
            <div
              title="Daily Learning Streak"
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300"
            >
              <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{streak}d</span>
            </div>

            <div
              title="Study XP Points"
              className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-300"
            >
              <Zap className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
              <span>{xp} XP</span>
            </div>
          </div>

          {/* ECOSYSTEM SWITCHER DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-xs"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden md:inline">Ecosystem</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {platformMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-indigo-950/80 bg-[#0c1020] p-2 shadow-2xl shadow-indigo-950/50 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-indigo-950 pb-1 mb-1">
                  RoleNest Ecosystem
                </div>

                <a
                  href="https://problem.rolenest.in/potd"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="font-bold text-white group-hover:text-amber-300">Code Arena (POTD)</div>
                      <div className="text-[10px] text-slate-400">FAANG challenges &amp; Daily POTD</div>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>

                <a
                  href="https://rolenest.in/jobs"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-300">Verified Job Board</div>
                      <div className="text-[10px] text-slate-400">Direct ATS applications &amp; stipends</div>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>

                <a
                  href="https://internship.rolenest.in"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white group-hover:text-cyan-300">Internship Bootcamp</div>
                      <div className="text-[10px] text-slate-400">Cohort projects &amp; verified certificate</div>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </div>
            )}
          </div>

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
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <Zap className="h-4 w-4 fill-indigo-400 text-indigo-400" />
              <span>{xp} Total XP</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
