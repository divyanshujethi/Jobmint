"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { APP_CONFIG } from "@repo/shared";
import {
  Sparkles,
  Briefcase,
  Compass,
  Building2,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Users,
  HardDrive,
  Layers,
  ChevronDown,
  LogOut,
  User,
  GraduationCap,
  Lock,
  Award,
  BookOpen,
  Flame,
  Trophy,
  Code2,
  FileText,
  School,
  Youtube,
} from "lucide-react";
import { Button } from "./ui/button";
import { NotificationBell } from "./notification-bell";
import { ProModal } from "./pro-modal";

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [streakCount, setStreakCount] = useState<number | null>(null);

  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/streak")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.streak && typeof data.streak.currentStreak === "number") {
          setStreakCount(data.streak.currentStreak);
        }
      })
      .catch(() => {});

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          const email = data.user.email?.toLowerCase();
          const adminEmails = [
            "admin@rolenest.in",
            "admin@ritualdev.in",
            "divyanshu.dev@gmail.com",
            "divyanshujethi@gmail.com",
          ];
          if (email && (adminEmails.includes(email) || data.user.role === "ADMIN")) {
            setIsAdmin(true);
          }
        }
      })
      .catch(() => {});

    fetch("/api/user/pro-status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isPro) {
          setIsPro(true);
        }
      })
      .catch(() => {});

    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Core Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {APP_CONFIG.name}
              </span>
              <span className="hidden text-[10px] font-bold text-emerald-600 sm:block tracking-wide">
                Truth & Transparency
              </span>
            </div>
          </Link>

          {/* Core Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Briefcase className="h-4 w-4 text-slate-400" />
              Jobs
            </Link>

            <Link
              href="/internships"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Internships
            </Link>

            <Link
              href="/companies"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Building2 className="h-4 w-4 text-slate-400" />
              Companies
            </Link>

            <Link
              href="/recommendations"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              For You
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              Leaderboard
            </Link>

            {/* Tools & Resources Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors focus:outline-none"
              >
                <span>Tools & Prep</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute -left-64 sm:-left-48 mt-3 w-[780px] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="grid grid-cols-3 gap-6">
                    {/* COLUMN 1: CODING & INTERVIEWS */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 px-2">
                        <Code2 className="h-3.5 w-3.5" />
                        <span>Coding &amp; Practice</span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/potd"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Flame className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              Problem of the Day
                              <span className="rounded bg-orange-50 text-orange-700 px-1 py-0.2 text-[9px] font-mono">+50 XP</span>
                            </div>
                            <div className="text-[11px] text-slate-500">In-browser runner &amp; streak</div>
                          </div>
                        </Link>

                        <Link
                          href="/problems"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <BookOpen className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              Problem Catalog
                              <span className="rounded bg-emerald-50 text-emerald-700 px-1 py-0.2 text-[9px] font-mono">Monaco</span>
                            </div>
                            <div className="text-[11px] text-slate-500">LeetCode interview challenges</div>
                          </div>
                        </Link>

                        <Link
                          href="/study-pods"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Users className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Peer Study Pods</div>
                            <div className="text-[11px] text-slate-500">Virtual cohorts &amp; live chat</div>
                          </div>
                        </Link>

                        <Link
                          href="/leaderboard"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Trophy className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              Campus Battles
                              <span className="rounded bg-amber-50 text-amber-700 px-1 py-0.2 text-[9px] font-mono">Live</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Inter-college leaderboard</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* COLUMN 2: RESUME & CAREER TOOLKIT */}
                    <div className="space-y-3 border-l border-slate-100 pl-4">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 px-2">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Resume &amp; Caliber</span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/resume/builder"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <FileText className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                              Harvard ATS Resume
                              <span className="rounded bg-blue-50 text-blue-700 px-1 py-0.2 text-[9px] font-mono">LaTeX/PDF</span>
                            </div>
                            <div className="text-[11px] text-slate-500">1-click single-column builder</div>
                          </div>
                        </Link>

                        <Link
                          href="/resume/assistant"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">AI Resume Auditor</div>
                            <div className="text-[11px] text-slate-500">ATS score &amp; STAR rewrites</div>
                          </div>
                        </Link>

                        <Link
                          href="/dev-score"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                              Verified Dev Score
                              <span className="rounded bg-amber-50 text-amber-700 px-1 py-0.2 text-[9px] font-mono">Proof</span>
                            </div>
                            <div className="text-[11px] text-slate-500">GitHub proof-of-work score</div>
                          </div>
                        </Link>

                        <Link
                          href="/placement-portal"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Placement Syndication</div>
                            <div className="text-[11px] text-slate-500">College placement cell feed</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* COLUMN 3: LEARNING & MASTERY */}
                    <div className="space-y-3 border-l border-slate-100 pl-4">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5 px-2">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Learning &amp; Growth</span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/roadmaps"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Compass className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-purple-600 transition-colors">
                              Career Roadmaps
                              <span className="rounded bg-blue-50 text-blue-700 px-1 py-0.2 text-[9px] font-mono">Free</span>
                            </div>
                            <div className="text-[11px] text-slate-500">AI, Full-Stack &amp; Cloud paths</div>
                          </div>
                        </Link>

                        <Link
                          href="/canvas"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Layers className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-purple-600 transition-colors">
                              Interactive Canvas
                              <span className="rounded bg-emerald-50 text-emerald-700 px-1 py-0.2 text-[9px] font-mono">Visual</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Node-graph knowledge trees</div>
                          </div>
                        </Link>

                        <Link
                          href="/playlists"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Youtube className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-purple-600 transition-colors">
                              YouTube Playlists Hub
                              <span className="rounded bg-red-50 text-red-700 px-1 py-0.2 text-[9px] font-mono">Curated</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Striver, Karpathy, Chai aur Code</div>
                          </div>
                        </Link>

                        <Link
                          href="/courses"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-purple-600 transition-colors">
                              Courses &amp; Diplomas
                              <span className="rounded bg-amber-50 text-amber-700 px-1 py-0.2 text-[9px] font-mono">Certs</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Verified course diplomas</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-2 font-sans">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      100% Free Tools • Zero Paywalls for Students &amp; Freshers
                    </span>
                    <Link
                      href="/transparency"
                      onClick={() => setToolsOpen(false)}
                      className="text-slate-600 hover:text-slate-900 font-semibold underline decoration-slate-300"
                    >
                      Transparency Pledge &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/pricing" className="text-xs font-semibold text-slate-600 hover:text-emerald-700">
            Pricing
          </Link>

          <Link href={user ? "/employer/jobs/new" : "/employer/login"}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold border-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Post an Opening
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5">
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs border border-amber-300">
                  <Crown className="h-3.5 w-3.5 fill-slate-950" />
                  <span>PRO</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setProModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all hover:scale-105"
                >
                  <Crown className="h-3.5 w-3.5 text-amber-300" />
                  <span>Pro</span>
                </button>
              )}

              <Link
                href="/leaderboard"
                title="Daily Streak & Quests"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
              >
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{streakCount ?? 1}d</span>
              </Link>

              <NotificationBell />

              {/* User Dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white uppercase">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                        {isPro && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>

                    <div className="py-1">
                      {!isPro ? (
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setProModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors mb-1 text-left"
                        >
                          <span className="flex items-center gap-1.5">
                            <Crown className="h-4 w-4 text-amber-500" />
                            Upgrade to Pro
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                            ₹299
                          </span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1 rounded-xl bg-amber-50 text-[11px] font-bold text-amber-800 border border-amber-200">
                          <Crown className="h-3.5 w-3.5 text-amber-600" />
                          <span>Role Nest Pro Member</span>
                        </div>
                      )}

                      <Link
                        href="/leaderboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors mb-1"
                      >
                        <Flame className="h-4 w-4 text-amber-500" />
                        Daily Streak &amp; Badges
                      </Link>

                      <Link
                        href="/applications"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        My Tracked Applications
                      </Link>

                      <Link
                        href="/profile/resume"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <HardDrive className="h-4 w-4 text-blue-500" />
                        Resume Vault & ATS
                      </Link>

                      <Link
                        href="/employer/applicants"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Users className="h-4 w-4 text-purple-600" />
                        Recruiter Dashboard
                      </Link>

                      <Link
                        href="/settings/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        Account & Data Settings
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors mt-1"
                        >
                          <Lock className="h-4 w-4 text-amber-600" />
                          SuperAdmin Panel
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <a
                        href="/api/auth/signout"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/employer/login">
                <Button variant="ghost" size="sm" className="font-semibold text-xs text-slate-600 hover:text-emerald-700">
                  For Employers
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {user && <NotificationBell />}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-3 pb-6 lg:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            {/* Primary Links */}
            <div className="grid grid-cols-2 gap-1 pb-2 border-b border-slate-100">
              <Link
                href="/jobs"
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                <Briefcase className="h-4 w-4 text-slate-400" />
                Jobs
              </Link>
              <Link
                href="/internships"
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                Internships
              </Link>
              <Link
                href="/companies"
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="h-4 w-4 text-slate-400" />
                Companies
              </Link>
              <Link
                href="/recommendations"
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                <Zap className="h-4 w-4 text-emerald-600" />
                For You
              </Link>
            </div>

            {/* Category 1: Coding & Practice */}
            <div className="pt-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 flex items-center gap-1.5">
                <Code2 className="h-3 w-3" />
                <span>Coding &amp; Practice</span>
              </div>
              <div className="grid grid-cols-1 gap-0.5">
                <Link
                  href="/potd"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                    Problem of the Day
                  </span>
                  <span className="rounded bg-orange-50 text-orange-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Daily</span>
                </Link>
                <Link
                  href="/problems"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                    Problem Catalog &amp; Editor
                  </span>
                  <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Monaco</span>
                </Link>
                <Link
                  href="/study-pods"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    Peer Study Pods
                  </span>
                  <span className="rounded bg-indigo-50 text-indigo-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Cohort Bot</span>
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    Campus Battles &amp; Streaks
                  </span>
                  <span className="rounded bg-amber-50 text-amber-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Colleges</span>
                </Link>
              </div>
            </div>

            {/* Category 2: Resume & Caliber */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 px-3 py-1 flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                <span>Resume &amp; Caliber</span>
              </div>
              <div className="grid grid-cols-1 gap-0.5">
                <Link
                  href="/resume/builder"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    Harvard ATS Resume Builder
                  </span>
                  <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">1-Click</span>
                </Link>
                <Link
                  href="/profile/resume"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    AI Resume Auditor &amp; Fixer
                  </span>
                  <span className="rounded bg-purple-50 text-purple-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">AI</span>
                </Link>
                <Link
                  href="/dev-score"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Verified Dev Score &amp; Rank
                  </span>
                  <span className="rounded bg-amber-50 text-amber-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Proof</span>
                </Link>
                <Link
                  href="/transparency"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Placement Syndication &amp; Transparency
                  </span>
                  <span className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[9px] font-mono font-bold">Wall</span>
                </Link>
              </div>
            </div>

            {/* Category 3: Learning & Growth */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 px-3 py-1 flex items-center gap-1.5">
                <Compass className="h-3 w-3" />
                <span>Learning &amp; Growth</span>
              </div>
              <div className="grid grid-cols-1 gap-0.5">
                <Link
                  href="/roadmaps"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-blue-500" />
                    Career Roadmaps
                  </span>
                  <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Free</span>
                </Link>
                <Link
                  href="/canvas"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-emerald-500" />
                    Interactive Canvas
                  </span>
                  <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Visual</span>
                </Link>
                <Link
                  href="/playlists"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Youtube className="h-3.5 w-3.5 text-red-500" />
                    YouTube Playlists Hub
                  </span>
                  <span className="rounded bg-red-50 text-red-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Curated</span>
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    Courses &amp; Diplomas
                  </span>
                  <span className="rounded bg-amber-50 text-amber-700 px-1.5 py-0.5 text-[9px] font-mono font-bold">Certs</span>
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href={user ? "/employer/jobs/new" : "/employer/login"} onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full text-xs font-bold gap-1.5 border-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Post an Opening (Employers)
                </Button>
              </Link>
              {user ? (
                <div className="space-y-1 pt-1">
                  <div className="px-3 py-1 text-xs text-slate-500">
                    Signed in as <strong>{user.email}</strong>
                  </div>
                  <Link
                    href="/applications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Tracked Applications
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-amber-700 bg-amber-50"
                    >
                      SuperAdmin Console
                    </Link>
                  )}
                  <a
                    href="/api/auth/signout"
                    className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full text-xs font-semibold">
                        Candidate Login
                      </Button>
                    </Link>
                    <Link href="/employer/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white">
                        Recruiter Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        user={user}
      />
    </nav>
  );
}
