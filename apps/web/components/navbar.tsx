"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Crown,
  Gift,
  DollarSign,
  Heart,
  Clock,
  FlaskConical,
} from "lucide-react";
import { Button } from "./ui/button";
import { NotificationBell } from "./notification-bell";
import { ProModal } from "./pro-modal";

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export function Navbar() {
  const pathname = usePathname();

  const isDonation =
    pathname?.startsWith("/donate") ||
    (typeof window !== "undefined" &&
      (window.location.hostname.includes("donation.") ||
        window.location.hostname.includes("donate.")));

  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const isCandidate = Boolean(user && (!user.role || user.role === "CANDIDATE"));
  const isRecruiterAllowed = Boolean(
    user?.email?.toLowerCase() === "divyanshujethi@gmail.com"
  );
  const [isPro, setIsPro] = useState(false);
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [streakCount, setStreakCount] = useState<number | null>(null);

  const isExpired = !isPro && Boolean(proExpiresAt && new Date(proExpiresAt) <= new Date());

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
        setIsPro(Boolean(data?.isPro));
        if (data?.proExpiresAt) {
          setProExpiresAt(data.proExpiresAt);
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

  const isArena =
    pathname?.startsWith("/potd") ||
    pathname?.startsWith("/problems") ||
    (typeof window !== "undefined" &&
      (window.location.hostname.includes("problem.") ||
        window.location.hostname.includes("arena.") ||
        window.location.hostname.includes("code.")));

  if (isArena || isDonation) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md print:hidden overflow-x-clip">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-6 xl:px-8">
        {/* Brand Logo & Core Nav */}
        <div className="flex items-center gap-3 sm:gap-4 xl:gap-8 min-w-0 shrink-0">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {APP_CONFIG.name}
              </span>
              <span className="hidden text-[10px] font-bold text-emerald-600 sm:block tracking-wide">
                Truth & Transparency
              </span>
            </div>
          </Link>

          {/* Core Desktop Navigation — 3 Core Pillars */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 text-sm font-semibold shrink-0">
            {/* PILLAR 1: JOBS & INTERNSHIPS */}
            <Link
              href="/jobs"
              className={`flex items-center gap-1.5 transition-colors shrink-0 ${
                pathname === "/jobs" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <Briefcase className="h-4 w-4 text-slate-400" />
              <span>Jobs</span>
            </Link>

            <Link
              href="/internships"
              className={`flex items-center gap-1.5 transition-colors shrink-0 ${
                pathname === "/internships" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Internships</span>
            </Link>

            {/* PILLAR 2: APPLICATION TRACKER */}
            <Link
              href="/applications"
              className={`flex items-center gap-1.5 transition-colors shrink-0 ${
                pathname === "/applications" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>Tracker</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                Follow-ups
              </span>
            </Link>

            {/* PILLAR 3: ATS RESUME BUILDER */}
            <Link
              href="/resume/builder"
              className={`flex items-center gap-1.5 transition-colors shrink-0 ${
                pathname?.startsWith("/resume") ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Resume</span>
              <span className="rounded-full bg-blue-50 text-blue-700 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                ATS
              </span>
            </Link>

            {/* SECONDARY FEATURES: LABS & BETA */}
            <div className="relative shrink-0" ref={toolsRef}>
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-purple-700 transition-colors focus:outline-none cursor-pointer py-1 px-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-purple-50 hover:border-purple-200"
              >
                <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
                <span>Labs</span>
                <span className="rounded-full bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                  Beta
                </span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute left-0 xl:-left-20 mt-3 w-[min(840px,calc(100vw-32px))] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {/* LABS HEADER BANNER */}
                  <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100 text-purple-700 text-xs font-bold">
                        🧪
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          RoleNest Labs &amp; Community Modules
                          <span className="rounded-full bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.2 text-[9px] font-mono font-bold">
                            BETA
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Experimental practice sandboxes, cohorts &amp; market intelligence
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      Phase 3 Launch Scope
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* COLUMN 1: CODING & PRACTICE (BETA) */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5 px-2">
                        <Code2 className="h-3.5 w-3.5" />
                        <span>Daily Practice &amp; Sandboxes</span>
                      </div>
                      <div className="space-y-1">
                        <a
                          href="https://problem.rolenest.in/potd"
                          target="_blank"
                          rel="noopener noreferrer"
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
                        </a>

                        <a
                          href="https://problem.rolenest.in/problems"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <BookOpen className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              Problem Catalog
                              <span className="rounded bg-emerald-50 text-emerald-700 px-1 py-0.2 text-[9px] font-mono">34+ DSA</span>
                            </div>
                            <div className="text-[11px] text-slate-500">LeetCode interview challenges</div>
                          </div>
                        </a>

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
                            <div className="text-[11px] text-slate-500">Inter-college leaderboard &amp; streaks</div>
                          </div>
                        </Link>

                        <Link
                          href="/resume/assistant"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">AI Bullet Improver</div>
                            <div className="text-[11px] text-slate-500">STAR rewrites &amp; power verbs</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* COLUMN 2: LEARNING & ROADMAPS (BETA) */}
                    <div className="space-y-3 border-l border-slate-100 pl-4">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5 px-2">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Learning &amp; Roadmaps</span>
                      </div>
                      <div className="space-y-1">
                        <a
                          href="https://study.rolenest.in/roadmaps"
                          target="_blank"
                          rel="noopener noreferrer"
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
                        </a>

                        <a
                          href="https://study.rolenest.in/canvas"
                          target="_blank"
                          rel="noopener noreferrer"
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
                        </a>

                        <a
                          href="https://study.rolenest.in/playlists"
                          target="_blank"
                          rel="noopener noreferrer"
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
                        </a>

                        <a
                          href="https://study.rolenest.in/courses"
                          target="_blank"
                          rel="noopener noreferrer"
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
                        </a>
                      </div>
                    </div>

                    {/* COLUMN 3: MARKET INTEL & COMMUNITY (BETA) */}
                    <div className="space-y-3 border-l border-slate-100 pl-4">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 px-2">
                        <Users className="h-3.5 w-3.5" />
                        <span>Community &amp; Intel</span>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/salaries"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <DollarSign className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                              Tech Salaries &amp; CTC
                              <span className="rounded bg-emerald-50 text-emerald-700 px-1 py-0.2 text-[9px] font-mono">Real</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Compensation benchmarks</div>
                          </div>
                        </Link>

                        <Link
                          href="/bounties"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Gift className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                              Bounties &amp; Referrals
                              <span className="rounded bg-amber-50 text-amber-700 px-1 py-0.2 text-[9px] font-mono">Earn</span>
                            </div>
                            <div className="text-[11px] text-slate-500">Employee referrals market</div>
                          </div>
                        </Link>

                        <a
                          href="https://study.rolenest.in/study-pods"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Users className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Peer Study Pods</div>
                            <div className="text-[11px] text-slate-500">Virtual cohorts &amp; live chat</div>
                          </div>
                        </a>

                        <Link
                          href="/placement-portal"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Placement Syndication</div>
                            <div className="text-[11px] text-slate-500">College placement cell feed</div>
                          </div>
                        </Link>

                        <Link
                          href="/gov-tech"
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                        >
                          <Building2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                              Govt Tech Roles
                              <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-bold">🇮🇳</span>
                            </div>
                            <div className="text-[11px] text-slate-500">NIC, ISRO &amp; public sector</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-2 font-sans">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Candidate Core Free Forever • Experimental Labs Modules
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
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <Link
            href="/pricing"
            className={`text-xs xl:text-sm font-semibold transition-colors shrink-0 ${
              pathname === "/pricing" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            Pricing
          </Link>

          <Link
            href="/donate"
            target="_blank"
            rel="noopener noreferrer"
            title="Support Role Nest"
            className={`flex items-center gap-1 text-xs font-bold transition-colors shrink-0 py-1.5 px-2.5 rounded-full border border-rose-200/80 bg-rose-50/80 hover:bg-rose-100 ${
              pathname === "/donate" ? "text-rose-700 bg-rose-100" : "text-rose-600"
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0" />
            <span className="hidden xl:inline">Donate</span>
          </Link>

          {!isCandidate && (
            <Link href={user ? "/employer/jobs/new" : "/employer/login"} className="shrink-0">
              <Button variant="outline" size="sm" className="gap-1 text-xs font-bold border-slate-300 h-8 px-2.5 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden xl:inline">Post a Job</span>
                <span className="xl:hidden">Post Job</span>
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2.5">
              {isPro ? (
                <Link
                  href="/pricing"
                  title={`Active Pro Plan${proExpiresAt ? ` (Valid until ${new Date(proExpiresAt).toLocaleDateString()})` : ""}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs border border-amber-300 hover:brightness-105 transition-all"
                >
                  <Crown className="h-3.5 w-3.5 fill-slate-950" />
                  <span>PRO</span>
                </Link>
              ) : isExpired ? (
                <Link
                  href="/pricing"
                  title="Your Pro subscription has ended. Click to renew."
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-xs transition-all hover:scale-105"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>Pro Expired • Renew</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setProModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all hover:scale-105"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                  <span>Get Pro</span>
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
              <div className="relative shrink-0" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-2.5 sm:px-3 hover:bg-slate-100 transition-colors focus:outline-none shrink-0"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white uppercase shrink-0">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[75px] xl:max-w-[110px] truncate">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                        {isPro && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                            PRO
                          </span>
                        )}
                        {isExpired && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            EXPIRED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>

                    <div className="py-1">
                      {isPro ? (
                        <div className="flex flex-col gap-0.5 px-3 py-2 mb-1 rounded-xl bg-amber-50 text-[11px] font-bold text-amber-900 border border-amber-200">
                          <div className="flex items-center gap-1.5">
                            <Crown className="h-3.5 w-3.5 text-amber-600" />
                            <span>Role Nest Pro Member</span>
                          </div>
                          {proExpiresAt && (
                            <span className="text-[10px] text-amber-700 font-normal">
                              Valid until {new Date(proExpiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : isExpired ? (
                        <div className="p-2.5 mb-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900">
                            <span>⚠️ Pro Subscription Ended</span>
                          </div>
                          <p className="text-[10px] text-amber-800 leading-snug">
                            Your Pro benefits ended{proExpiresAt ? ` on ${new Date(proExpiresAt).toLocaleDateString()}` : ""}. Renew now to resume AI interviews and recruiter visibility.
                          </p>
                          <Link
                            href="/pricing"
                            onClick={() => setUserMenuOpen(false)}
                            className="inline-flex w-full items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Renew Pro Subscription →
                          </Link>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setProModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors mb-1 text-left"
                        >
                          <span className="flex items-center gap-1.5">
                            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                            Upgrade to Pro
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                            Plans
                          </span>
                        </button>
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

                      {isRecruiterAllowed && (
                        <Link
                          href="/employer/applicants"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Users className="h-4 w-4 text-purple-600" />
                          Recruiter Dashboard
                        </Link>
                      )}

                      <Link
                        href="/settings/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        Account &amp; Data Settings
                      </Link>

                      <Link
                        href="/donate"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                        Support RitualDev &amp; Role Nest
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
            <div className="flex items-center gap-2">
              <Link href="/employer/login">
                <Button variant="ghost" size="sm" className="font-semibold text-xs text-slate-600 hover:text-emerald-700 hidden xl:inline-flex">
                  For Employers
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="font-semibold text-xs border-slate-300 hover:bg-slate-50 text-slate-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {user && <NotificationBell />}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-3 pb-6 lg:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            {/* 3 CORE PILLARS (LAUNCH SCOPE) */}
            <div className="space-y-1 pb-3 border-b border-slate-100">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 px-3 py-1 flex items-center justify-between">
                <span>Core Career Pillars</span>
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">Priority</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {/* Pillar 1 */}
                <Link
                  href="/jobs"
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    Verified Tech Jobs
                  </span>
                  <span className="rounded bg-slate-100 text-slate-700 px-1.5 py-0.5 text-[9px] font-mono">Direct ATS</span>
                </Link>

                <Link
                  href="/internships"
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Paid Tech Internships
                  </span>
                  <span className="rounded bg-amber-50 text-amber-800 px-1.5 py-0.5 text-[9px] font-mono">₹ Stipends</span>
                </Link>

                {/* Pillar 2 */}
                <Link
                  href="/applications"
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-700" />
                    Application Tracker
                  </span>
                  <span className="rounded bg-emerald-600 text-white px-1.5 py-0.5 text-[9px] font-mono font-bold">7-Day Nudges</span>
                </Link>

                {/* Pillar 3 */}
                <Link
                  href="/resume/builder"
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    ATS Resume Builder
                  </span>
                  <span className="rounded bg-blue-50 text-blue-800 px-1.5 py-0.5 text-[9px] font-mono font-bold">1-Click PDF</span>
                </Link>

                <Link
                  href="/resume/assistant"
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI Bullet Improver
                  </span>
                  <span className="rounded bg-purple-50 text-purple-700 px-1.5 py-0.5 text-[9px] font-mono">STAR AI</span>
                </Link>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-1.5 pb-2 pt-1 border-b border-slate-100">
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200"
                onClick={() => setIsOpen(false)}
              >
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                Pricing Plans
              </Link>
              <Link
                href="/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/60 hover:bg-rose-100"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                Support Platform
              </Link>
            </div>

            {/* SECONDARY FEATURES: ROLENEST LABS (BETA) */}
            <div className="pt-2">
              <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-2.5 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
                    <span>RoleNest Labs</span>
                  </div>
                  <span className="rounded-full bg-purple-200 text-purple-800 px-2 py-0.2 text-[9px] font-mono font-bold">
                    Beta Modules
                  </span>
                </div>
                <p className="text-[10px] text-purple-700/80 px-1 leading-tight">
                  Experimental practice sandboxes, cohorts &amp; market telemetry
                </p>

                <div className="grid grid-cols-1 gap-0.5 pt-1">
                  <a
                    href="https://problem.rolenest.in/potd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      Problem of the Day (POTD)
                    </span>
                    <span className="text-[9px] font-mono text-orange-700 font-bold">+50 XP</span>
                  </a>

                  <Link
                    href="/leaderboard"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      Campus Battles &amp; Streaks
                    </span>
                    <span className="text-[9px] font-mono text-amber-700">Arena</span>
                  </Link>

                  <a
                    href="https://study.rolenest.in/study-pods"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-indigo-500" />
                      Peer Study Pods
                    </span>
                    <span className="text-[9px] font-mono text-indigo-700">Cohorts</span>
                  </a>

                  <a
                    href="https://study.rolenest.in/canvas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-emerald-600" />
                      Visual Skill Canvas
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700">Nodes</span>
                  </a>

                  <a
                    href="https://study.rolenest.in/roadmaps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="h-3.5 w-3.5 text-blue-500" />
                      Career Roadmaps
                    </span>
                    <span className="text-[9px] font-mono text-blue-700">Free</span>
                  </a>

                  <Link
                    href="/salaries"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      Tech Salaries &amp; CTC
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700">Data</span>
                  </Link>

                  <Link
                    href="/bounties"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Gift className="h-3.5 w-3.5 text-amber-500" />
                      Bounties &amp; Referrals
                    </span>
                    <span className="text-[9px] font-mono text-amber-700">Bonus</span>
                  </Link>

                  <Link
                    href="/placement-portal"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                      Placement Syndication
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Colleges</span>
                  </Link>

                  <Link
                    href="/gov-tech"
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                      Govt Tech Jobs
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700">🇮🇳</span>
                  </Link>

                  <Link
                    href="/transparency"
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 transition-colors mt-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Verification &amp; Transparency
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold">Standard</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {!isCandidate && (
                <Link href={user ? "/employer/jobs/new" : "/employer/login"} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-bold gap-1.5 border-slate-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Post an Opening (Employers)
                  </Button>
                </Link>
              )}
              {user ? (
                <div className="space-y-1 pt-1">
                  <div className="px-3 py-1 text-xs text-slate-500">
                    Signed in as <strong>{user.email}</strong>
                  </div>
                  {isExpired && (
                    <div className="mx-1 my-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-900">
                        <span>⚠️ Pro Subscription Ended</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        Your Pro access expired. Renew now to resume AI practice &amp; recruiter visibility.
                      </p>
                      <Link
                        href="/pricing"
                        onClick={() => setIsOpen(false)}
                        className="mt-1 flex items-center justify-center py-1.5 px-3 rounded-lg bg-amber-600 text-white font-bold text-xs shadow-xs"
                      >
                        Renew Pro Subscription →
                      </Link>
                    </div>
                  )}
                  <Link
                    href="/applications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Tracked Applications
                  </Link>
                  <Link
                    href="/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100"
                  >
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                    Support RitualDev &amp; Role Nest
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
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white">
                        Sign Up Free
                      </Button>
                    </Link>
                  </div>
                  <Link href="/employer/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full text-xs text-slate-600 font-medium">
                      Recruiter &amp; Employer Portal →
                    </Button>
                  </Link>
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
