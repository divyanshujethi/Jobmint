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
} from "lucide-react";
import { Button } from "./ui/button";
import { NotificationBell } from "./notification-bell";

interface SessionUser {
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

  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          const email = data.user.email?.toLowerCase();
          const adminEmails = [
            "admin@ritualdev.in",
            "divyanshu.dev@gmail.com",
            "divyanshujethi@gmail.com",
          ];
          if (email && adminEmails.includes(email)) {
            setIsAdmin(true);
          }
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
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Core Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105">
              J
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
                <div className="absolute left-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <Link
                    href="/roadmaps"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Compass className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        Career Roadmaps
                        <span className="rounded bg-blue-50 text-blue-700 px-1 py-0.2 text-[9px]">Free</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Full-stack, AI/ML, Cloud roadmaps</div>
                    </div>
                  </Link>

                  <Link
                    href="/canvas"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Layers className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        Interactive Canvas
                        <span className="rounded bg-emerald-50 text-emerald-700 px-1 py-0.2 text-[9px]">Visual</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Visual node-based study canvas</div>
                    </div>
                  </Link>

                  <Link
                    href="/resume/assistant"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">AI Resume Teller</div>
                      <div className="text-[11px] text-slate-500">Groq ATS score & STAR bullet rewrite</div>
                    </div>
                  </Link>

                  <Link
                    href="/study-pods"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Users className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Peer Study Pods</div>
                      <div className="text-[11px] text-slate-500">Mock technical interviews & live chat</div>
                    </div>
                  </Link>

                  <Link
                    href="/placement-portal"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <GraduationCap className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Campus Placement Syndication</div>
                      <div className="text-[11px] text-slate-500">RSS & Discord bots for colleges</div>
                    </div>
                  </Link>

                  <Link
                    href="/dev-score"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Zap className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        Verified Dev Score
                        <span className="rounded bg-amber-50 text-amber-700 px-1 py-0.2 text-[9px]">Proof</span>
                      </div>
                      <div className="text-[11px] text-slate-500">GitHub proof-of-work & README badges</div>
                    </div>
                  </Link>

                  <Link
                    href="/transparency"
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        Transparency Wall
                        <span className="rounded bg-teal-50 text-teal-700 px-1 py-0.2 text-[9px]">Anti-Ghost</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Wall of Fame & Ghosting alerts</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href={user ? "/employer/jobs/new" : "/employer/login"}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold border-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Post an Opening
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
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
                      <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>

                    <div className="py-1">
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
                <Button variant="ghost" size="sm" className="font-semibold text-xs text-slate-600 hover:text-emerald-700">
                  For Employers
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="font-semibold text-xs text-slate-700 border-slate-300">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="font-bold text-xs bg-emerald-600 hover:bg-emerald-500">
                  Candidate Sign In
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
            <Link
              href="/jobs"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Briefcase className="h-4 w-4 text-slate-400" />
              Jobs
            </Link>
            <Link
              href="/internships"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Internships
            </Link>
            <Link
              href="/companies"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Building2 className="h-4 w-4 text-slate-400" />
              Companies
            </Link>
            <Link
              href="/recommendations"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              Recommendations
            </Link>
            <Link
              href="/roadmaps"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Compass className="h-4 w-4 text-blue-500" />
              Career Roadmaps
            </Link>
            <Link
              href="/canvas"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Layers className="h-4 w-4 text-emerald-500" />
              Visual Canvas
            </Link>
            <Link
              href="/dev-score"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Zap className="h-4 w-4 text-amber-500" />
              Verified Dev Score
            </Link>
            <Link
              href="/transparency"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Transparency Wall
            </Link>
            <Link
              href="/study-pods"
              className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setIsOpen(false)}
            >
              <Users className="h-4 w-4 text-indigo-500" />
              Study Pods
            </Link>

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
    </nav>
  );
}
