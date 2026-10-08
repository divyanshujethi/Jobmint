"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Award,
  TrendingUp,
  Star,
  GitFork,
  ExternalLink,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Sparkles,
  Trophy,
  Crown,
  Play,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Globe,
  Clock,
  HelpCircle,
  Code2,
  Laptop,
  GraduationCap,
  Building2,
  School,
  FileText,
  MapPin,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DemoSandboxModal } from "@/components/demo-sandbox-modal";
import { SponsoredChallengeBanner } from "@/components/sponsored-challenge-banner";
import { ArenaNavbar } from "@/components/arena-navbar";
import { ArenaFooter } from "@/components/arena-footer";

interface StreakLeader {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  verifiedDevScore: number;
  badgesCount: number;
  recentBadge: string;
  planBadge?: "none" | "student" | "pro";
  isPriorityPlaced?: boolean;
  isCurrentUser?: boolean;
}

interface CollegeRanking {
  rank: number;
  collegeName: string;
  buildersCount: number;
  totalStreakDays: number;
  totalXp: number;
  avgDevScore: number;
  topBuilder: {
    name: string;
    avatarUrl: string;
    streak: number;
  };
}

interface TrendingRepository {
  id: string;
  name: string;
  owner: string;
  avatarUrl: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  starsToday: number;
  devScore: number;
  repoUrl: string;
  demoUrl?: string;
  topics: string[];
}

interface CandidateProjectItem {
  id: string;
  title: string;
  description: string;
  liveUrl?: string | null;
  repoUrl?: string | null;
  skillsUsed: string[];
  authorName: string;
  authorImage?: string | null;
}

interface BadgeInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
}

const POPULAR_COLLEGES = [
  "Delhi Technological University (DTU)",
  "IIT Bombay",
  "IIT Delhi",
  "BITS Pilani",
  "NIT Trichy",
  "NSUT Delhi",
  "VIT Vellore",
  "SRM Institute of Science and Technology",
  "Manipal Institute of Technology",
  "Pune University (SPPU)",
  "Anna University Chennai",
  "Mumbai University (VJTI/SPIT)",
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"STREAK" | "CAMPUS_BATTLES" | "TRENDING_REPOS" | "REFERRALS">("STREAK");
  const [repoMode, setRepoMode] = useState<"GITHUB_TRENDING" | "CANDIDATE_PROJECTS">("GITHUB_TRENDING");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [streakData, setStreakData] = useState<any>(null);
  const [leaders, setLeaders] = useState<StreakLeader[]>([]);
  const [colleges, setColleges] = useState<CollegeRanking[]>([]);
  const [registeredCollegesList, setRegisteredCollegesList] = useState<{ id?: string; name: string; location: string; state?: string | null }[]>([]);
  const [userCollege, setUserCollege] = useState<string>("");
  const [savingCollege, setSavingCollege] = useState(false);
  const [collegeSavedMsg, setCollegeSavedMsg] = useState<string | null>(null);
  const [showRegisterCollegeModal, setShowRegisterCollegeModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeLocation, setNewCollegeLocation] = useState("");
  const [newCollegeState, setNewCollegeState] = useState("");
  const [registeringCollegeLoading, setRegisteringCollegeLoading] = useState(false);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepository[]>([]);
  const [candidateProjects, setCandidateProjects] = useState<CandidateProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<{ title: string; url: string; githubUrl: string } | null>(null);
  const [isArena, setIsArena] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const h = window.location.hostname;
      setIsArena(h.includes("problem.") || h.includes("arena.") || h.includes("code."));
    }
  }, []);

  const loginUrl = isArena
    ? `https://rolenest.in/login?callbackUrl=${encodeURIComponent(
        typeof window !== "undefined" ? window.location.href : "https://problem.rolenest.in/leaderboard"
      )}`
    : "/login?callbackUrl=/leaderboard";

  // Load telemetry
  useEffect(() => {
    Promise.all([
      fetch("/api/streak").then((r) => r.json()),
      fetch("/api/leaderboard").then((r) => r.json()),
      fetch("/api/candidate/college").then((r) => r.json()).catch(() => ({ collegeName: null, registeredColleges: [] })),
    ])
      .then(([streakRes, leadRes, colRes]) => {
        setStreakData(streakRes);
        if (leadRes.leaders) setLeaders(leadRes.leaders);
        if (leadRes.collegeRankings) setColleges(leadRes.collegeRankings);
        if (leadRes.trendingRepos) setTrendingRepos(leadRes.trendingRepos);
        if (leadRes.candidateProjects) setCandidateProjects(leadRes.candidateProjects);
        if (colRes?.collegeName) setUserCollege(colRes.collegeName);
        if (colRes?.registeredColleges && Array.isArray(colRes.registeredColleges)) {
          setRegisteredCollegesList(colRes.registeredColleges);
        }
      })
      .catch((err) => console.error("Error loading leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDailyCheckIn = async () => {
    if (!streakData?.isAuthenticated) {
      window.location.href = loginUrl;
      return;
    }
    setCheckingIn(true);
    setCheckInSuccess(null);
    try {
      const res = await fetch("/api/streak", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStreakData((prev: any) => ({
          ...prev,
          currentStreak: data.currentStreak ?? prev?.currentStreak,
          totalXp: data.totalXp ?? prev?.totalXp,
          devScore: data.devScore ?? prev?.devScore,
          canCheckInToday: false,
          todayTasks: prev?.todayTasks?.map((t: any) =>
            t.id === "checkin" ? { ...t, completed: true } : t
          ),
        }));
        setCheckInSuccess(data.message || `🔥 Streak updated to ${data.currentStreak} Days! You earned +${data.xpEarned || 25} XP.`);
        fetch("/api/leaderboard")
          .then((r) => r.json())
          .then((leadRes) => {
            if (leadRes.leaders) setLeaders(leadRes.leaders);
            if (leadRes.collegeRankings) setColleges(leadRes.collegeRankings);
          });
        setTimeout(() => setCheckInSuccess(null), 5000);
      } else {
        setCheckInSuccess(data.error || "Already checked in today!");
      }
    } catch {
      setCheckInSuccess("🔥 Check-in recorded! +25 XP awarded.");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleQuestAction = async (taskId: string) => {
    if (!streakData?.isAuthenticated) {
      window.location.href = loginUrl;
      return;
    }

    if (taskId === "checkin") {
      await handleDailyCheckIn();
      return;
    }

    if (taskId === "potd") {
      if (isArena) {
        window.location.href = "/potd";
      } else {
        window.open("https://problem.rolenest.in/potd", "_blank");
      }
      return;
    }

    if (taskId === "referral") {
      const code = streakData?.referralCode;
      const refUrl = typeof window !== "undefined"
        ? `${window.location.origin}/leaderboard?ref=${code || ""}`
        : `https://rolenest.in/leaderboard?ref=${code || ""}`;
      navigator.clipboard.writeText(refUrl);
      setCheckInSuccess("📋 Referral invite link copied to clipboard!");
      setTimeout(() => setCheckInSuccess(null), 4000);
      return;
    }

    if (taskId === "github" || taskId === "prep") {
      setCheckingIn(true);
      try {
        const res = await fetch("/api/streak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questId: taskId === "github" ? "github_sync" : "prep" }),
        });
        const data = await res.json();
        if (res.ok) {
          setStreakData((prev: any) => ({
            ...prev,
            currentStreak: data.currentStreak ?? prev?.currentStreak,
            totalXp: data.totalXp ?? prev?.totalXp,
            devScore: data.devScore ?? prev?.devScore,
            todayTasks: prev?.todayTasks?.map((t: any) =>
              t.id === taskId ? { ...t, completed: true } : t
            ),
          }));
          setCheckInSuccess(data.message || `+${data.xpEarned || 50} XP awarded!`);
          fetch("/api/leaderboard")
            .then((r) => r.json())
            .then((leadRes) => {
              if (leadRes.leaders) setLeaders(leadRes.leaders);
              if (leadRes.collegeRankings) setColleges(leadRes.collegeRankings);
            });
          setTimeout(() => setCheckInSuccess(null), 5000);
        } else {
          setCheckInSuccess(data.error || "Quest already claimed!");
          setTimeout(() => setCheckInSuccess(null), 3000);
        }
      } catch {
        setCheckInSuccess("⚡ Activity synced! +50 XP recorded.");
        setTimeout(() => setCheckInSuccess(null), 3000);
      } finally {
        setCheckingIn(false);
      }
    }
  };

  const handleSaveCollege = async (cName: string, loc?: string, st?: string) => {
    if (!streakData?.isAuthenticated) {
      window.location.href = loginUrl;
      return;
    }
    setSavingCollege(true);
    setUserCollege(cName);
    try {
      const res = await fetch("/api/candidate/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeName: cName, location: loc, state: st }),
      });
      if (res.ok) {
        setCollegeSavedMsg(`🏫 Representing ${cName}!`);
        // Refresh leaderboard & colleges
        fetch("/api/leaderboard")
          .then((r) => r.json())
          .then((leadRes) => {
            if (leadRes.collegeRankings) setColleges(leadRes.collegeRankings);
          });
        fetch("/api/candidate/college")
          .then((r) => r.json())
          .then((colRes) => {
            if (colRes?.registeredColleges) setRegisteredCollegesList(colRes.registeredColleges);
          });
        setTimeout(() => setCollegeSavedMsg(null), 3000);
      }
    } catch {
      setCollegeSavedMsg("College updated!");
    } finally {
      setSavingCollege(false);
    }
  };

  const handleRegisterNewCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;
    setRegisteringCollegeLoading(true);
    try {
      await handleSaveCollege(newCollegeName.trim(), newCollegeLocation.trim() || "India", newCollegeState.trim() || undefined);
      setShowRegisterCollegeModal(false);
      setNewCollegeName("");
      setNewCollegeLocation("");
      setNewCollegeState("");
    } finally {
      setRegisteringCollegeLoading(false);
    }
  };

  const openSandbox = (title: string, url: string, githubUrl: string) => {
    setActiveProject({ title, url, githubUrl });
    setSandboxOpen(true);
  };

  const referralCode = streakData?.referralCode || "RN-JOIN";
  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/login?ref=${referralCode}`
    : `https://rolenest.in/login?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareCampusBattle = () => {
    const collegeTag = userCollege ? `${userCollege}` : "our college";
    const text = encodeURIComponent(
      `🚨 Representing ${collegeTag} on the National Inter-College Engineering Leaderboard on RoleNest! Join using our campus invite to boost our college rank: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Check out RoleNest - the zero-ghosting developer platform with verified dev scores, free course diplomas, and honest hiring stats. Join using my invite: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Building my daily engineering streak on @RoleNest! Verify real GitHub commits, earn DPDP-compliant course diplomas, and get hired with honest stats. ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const filteredRepos = trendingRepos.filter((r) => {
    if (selectedLanguage === "ALL") return true;
    return r.language.toLowerCase() === selectedLanguage.toLowerCase();
  });

  const t = {
    pageBg: isArena ? "min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans" : "min-h-screen bg-slate-50/50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8",
    contentWrap: isArena ? "mx-auto max-w-6xl w-full space-y-8 px-4 sm:px-6 lg:px-8 py-8 flex-1" : "mx-auto max-w-6xl space-y-8",
    heroBadge: isArena ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-purple-50 border-purple-200 text-purple-900",
    title: isArena ? "text-3xl sm:text-5xl font-black tracking-tight text-white font-mono" : "text-3xl sm:text-5xl font-black tracking-tight text-slate-900",
    subtitle: isArena ? "mx-auto max-w-2xl text-sm sm:text-base text-neutral-400" : "mx-auto max-w-2xl text-sm sm:text-base text-slate-600",
    card: isArena ? "rounded-3xl border border-neutral-800 bg-[#121212] p-6 sm:p-8 shadow-sm" : "rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm",
    cardBorder: isArena ? "border-neutral-800" : "border-slate-100",
    guestBanner: isArena ? "mb-6 rounded-2xl bg-amber-950/30 border border-amber-800/60 p-4 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4" : "mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4",
    guestTextTitle: isArena ? "text-xs font-bold text-amber-300" : "text-xs font-bold text-amber-950",
    guestTextDesc: isArena ? "text-[11px] text-amber-400/80" : "text-[11px] text-amber-800",
    guestButton: isArena ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0" : "bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0",
    statLabel: isArena ? "text-xs font-mono uppercase text-neutral-500 font-bold tracking-wider" : "text-xs font-mono uppercase text-slate-500 font-bold tracking-wider",
    statValue: isArena ? "text-3xl sm:text-4xl font-black text-white flex items-center gap-1.5" : "text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-1.5",
    statSub: isArena ? "text-xs text-neutral-400 flex items-center gap-2 font-medium" : "text-xs text-slate-500 flex items-center gap-2 font-medium",
    taskCompleted: isArena ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300 cursor-default" : "bg-emerald-50/70 border-emerald-200 text-emerald-900 cursor-default",
    taskPending: isArena ? "bg-[#181818] border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 cursor-pointer" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer",
    taskPendingIcon: isArena ? "text-neutral-500" : "text-slate-400",
    badgeUnlocked: isArena ? "bg-[#181818] border-neutral-800 shadow-xs text-neutral-200 font-semibold" : "bg-white border-slate-200 shadow-xs text-slate-900 font-semibold",
    badgeLocked: isArena ? "bg-[#141414] border-neutral-900 text-neutral-600 opacity-50" : "bg-slate-50 border-slate-100 text-slate-400 opacity-60 grayscale",
    tabsBar: isArena ? "inline-flex flex-wrap justify-center rounded-2xl bg-[#141414] p-1.5 border border-neutral-800 shadow-xs gap-1" : "inline-flex flex-wrap justify-center rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-xs gap-1",
    tabActive: isArena ? "bg-amber-500 text-slate-950 shadow-xs font-black" : "bg-emerald-600 text-white shadow-xs",
    tabInactive: isArena ? "text-neutral-400 hover:text-white" : "text-slate-600 hover:text-slate-900",
    tableWrap: isArena ? "rounded-3xl border border-neutral-800 bg-[#121212] shadow-sm overflow-hidden" : "rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden",
    tableCardHead: isArena ? "p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2" : "p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
    tableTitle: isArena ? "font-bold text-white text-base flex items-center gap-2" : "font-bold text-slate-900 text-base flex items-center gap-2",
    tableThead: isArena ? "bg-[#181818] text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800" : "bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200",
    tableDivide: isArena ? "divide-y divide-neutral-800" : "divide-y divide-slate-100",
    tableTrHover: isArena ? "hover:bg-neutral-800/40 transition-colors" : "hover:bg-slate-50/70 transition-colors",
    tableTrCurrent: isArena ? "bg-amber-950/20 font-semibold text-white" : "bg-emerald-50/40 font-semibold",
    candidateName: isArena ? "font-bold text-white block flex items-center gap-1.5 flex-wrap" : "font-bold text-slate-900 block flex items-center gap-1.5 flex-wrap",
    campusHero: isArena ? "rounded-3xl border border-indigo-900/60 bg-gradient-to-br from-indigo-950/40 via-[#141414] to-neutral-900 p-6 sm:p-8 shadow-sm space-y-6" : "rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 sm:p-8 shadow-sm space-y-6",
    campusInputCard: isArena ? "rounded-2xl border border-neutral-800 bg-[#161616] p-4 space-y-3" : "rounded-2xl border border-slate-200 bg-white p-4 space-y-3",
    campusSelect: isArena ? "w-full rounded-xl border border-neutral-700 bg-[#202020] p-2.5 text-xs font-semibold text-neutral-200 focus:outline-none" : "w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 focus:outline-none",
    repoCard: isArena ? "flex flex-col justify-between rounded-2xl border border-neutral-800 bg-[#121212] p-5 shadow-xs hover:border-neutral-700 transition-all space-y-4" : "flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-4",
    repoTitle: isArena ? "font-extrabold text-white text-base flex items-center gap-2" : "font-extrabold text-slate-900 text-base flex items-center gap-2",
    referralHero: isArena ? "rounded-3xl border border-emerald-900/50 bg-gradient-to-br from-emerald-950/30 via-[#141414] to-teal-950/20 p-6 sm:p-8 shadow-sm space-y-6" : "rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 sm:p-8 shadow-sm space-y-6",
    referralInputCard: isArena ? "rounded-2xl border border-neutral-800 bg-[#161616] p-4 shadow-sm space-y-3" : "rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm space-y-3",
    referralInput: isArena ? "w-full rounded-xl border border-neutral-700 bg-[#202020] px-3.5 py-2.5 font-mono text-xs text-neutral-200 focus:outline-none" : "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:outline-none",
    referralMilestoneCard: isArena ? "rounded-2xl border border-neutral-800 bg-[#161616] p-4 space-y-1" : "rounded-2xl border border-slate-200 bg-white p-4 space-y-1",
    referralMilestoneTitle: isArena ? "text-sm font-extrabold text-white flex items-center gap-1.5" : "text-sm font-extrabold text-slate-900 flex items-center gap-1.5",
  };

  return (
    <div className={t.pageBg}>
      {isArena && <ArenaNavbar />}

      <div className={t.contentWrap}>
        
        {/* HERO TITLE & PLATFORM QUICK ACTIONS */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono font-semibold ${t.heroBadge}`}>
            <Trophy className={`h-4 w-4 ${isArena ? "text-amber-400" : "text-purple-600"}`} />
            RoleNest Labs (Beta) • Campus Battles &amp; Builder Pulse
          </div>
          <h1 className={t.title}>
            Leaderboard &amp; Campus Battles
          </h1>
          <p className={t.subtitle}>
            Real data from registered students &amp; engineers. Build daily streaks, battle for your college rank, solve the Daily Problem (POTD), and export ATS resumes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {isArena ? (
              <Link href="/potd">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs gap-1.5 shadow-sm">
                  <Flame className="h-3.5 w-3.5 fill-slate-950" />
                  Solve Today's Problem (POTD)
                </Button>
              </Link>
            ) : (
              <a
                href="https://problem.rolenest.in/potd"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs gap-1.5 shadow-sm">
                  <Flame className="h-3.5 w-3.5 fill-white" />
                  Solve Today's Problem (POTD)
                </Button>
              </a>
            )}

            {isArena ? (
              <Link href="/problems">
                <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 font-bold text-xs gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-amber-400" />
                  Explore Problem Catalog
                </Button>
              </Link>
            ) : (
              <Link href="/resume/builder">
                <Button variant="outline" size="sm" className="border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  1-Click ATS Resume Builder
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 1. USER'S DAILY STREAK HUD CARD */}
        <div className={t.card}>
          {!streakData?.isAuthenticated && (
            <div className={t.guestBanner}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold shrink-0 ${isArena ? "bg-amber-500 text-slate-950" : "bg-amber-500 text-white"}`}>
                  <Flame className={`h-6 w-6 ${isArena ? "fill-slate-950 text-slate-950" : "fill-white"}`} />
                </div>
                <div>
                  <div className={t.guestTextTitle}>
                    You are viewing as a Guest (0 Days Streak)
                  </div>
                  <div className={t.guestTextDesc}>
                    Sign in to initialize your streak profile, claim daily check-in XP, represent your college, and rank on the leaderboard.
                  </div>
                </div>
              </div>
              <a href={loginUrl}>
                <Button size="sm" className={t.guestButton}>
                  Sign In to Start Day 1
                </Button>
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Streak Flame & XP */}
            <div className={`lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r ${t.cardBorder} pb-4 lg:pb-0 lg:pr-6`}>
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
                <Flame className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse fill-white" />
              </div>
              <div className="space-y-1">
                <div className={t.statLabel}>
                  Your Daily Streak
                </div>
                <div className={t.statValue}>
                  <span>{streakData?.currentStreak || 0}</span>
                  <span className={`text-lg font-bold ${isArena ? "text-amber-400" : "text-orange-500"}`}>Days</span>
                </div>
                <div className={t.statSub}>
                  <span>Total XP: <strong className={isArena ? "text-emerald-400" : "text-emerald-700"}>{streakData?.totalXp || 0}</strong></span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 ${isArena ? "text-sky-400" : "text-blue-700"}`}>
                    <Shield className="h-3 w-3" /> {streakData?.streakFreezes || 0} Freeze
                  </span>
                </div>
                {userCollege && (
                  <div className={`text-[11px] font-semibold flex items-center gap-1 ${isArena ? "text-emerald-400" : "text-emerald-800"}`}>
                    <School className="h-3 w-3 text-emerald-500" />
                    <span>{userCollege}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Today's Tasks */}
            <div className="lg:col-span-5 space-y-2">
              <div className={`${t.statLabel} mb-1`}>
                Daily Habit Quest
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {streakData?.todayTasks?.map((task: any) => (
                  <button
                    key={task.id}
                    onClick={() => handleQuestAction(task.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-[11px] font-medium transition-all text-left ${
                      task.completed
                        ? t.taskCompleted
                        : t.taskPending
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {task.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Clock className={`h-3.5 w-3.5 shrink-0 ${t.taskPendingIcon}`} />
                      )}
                      <span className="truncate">{task.title}</span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold shrink-0 ml-1 px-1.5 py-0.5 rounded ${
                      task.completed
                        ? (isArena ? "bg-emerald-900/60 text-emerald-300" : "bg-emerald-100 text-emerald-800")
                        : (isArena ? "bg-amber-950/60 text-amber-300" : "bg-orange-100 text-orange-800")
                    }`}>
                      +{task.xp} XP
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Check-in CTA */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-2">
              {streakData?.canCheckInToday ? (
                <Button
                  onClick={handleDailyCheckIn}
                  disabled={checkingIn}
                  className={`w-full text-white font-black text-xs h-11 rounded-xl shadow-md gap-2 ${
                    isArena
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                  }`}
                >
                  <Flame className={`h-4 w-4 ${isArena ? "fill-slate-950 text-slate-950" : "fill-white"}`} />
                  <span>{checkingIn ? "Checking In..." : "Check In (+25 XP)"}</span>
                </Button>
              ) : streakData?.isAuthenticated ? (
                <div className={`w-full rounded-xl py-2 px-3 text-center text-xs font-bold flex items-center justify-center gap-1.5 ${
                  isArena ? "bg-emerald-950/40 border border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                }`}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Checked In for Today!</span>
                </div>
              ) : (
                <a href={loginUrl} className="w-full">
                  <Button className={`w-full font-bold text-xs h-11 rounded-xl ${
                    isArena ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black" : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}>
                    Sign In to Check In
                  </Button>
                </a>
              )}
              {checkInSuccess && (
                <div className="text-[11px] text-orange-500 font-bold text-center animate-in fade-in">
                  {checkInSuccess}
                </div>
              )}
              <div className={`text-[10px] text-center font-mono ${isArena ? "text-neutral-500" : "text-slate-400"}`}>
                Longest Streak: {streakData?.longestStreak || 0} Days
              </div>
            </div>

          </div>

          {/* UNLOCKED BADGES STRIP */}
          <div className={`mt-6 pt-5 border-t ${t.cardBorder} space-y-2`}>
            <div className={`text-[11px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Your Achievement Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {streakData?.badges?.map((badge: BadgeInfo) => (
                <div
                  key={badge.id}
                  title={badge.description}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                    badge.unlocked ? t.badgeUnlocked : t.badgeLocked
                  }`}
                >
                  <span className="text-base">{badge.emoji}</span>
                  <span>{badge.name}</span>
                  {badge.unlocked && (
                    <span className={`text-[9px] font-mono px-1 rounded ${isArena ? "text-emerald-400 bg-emerald-950/60" : "text-emerald-700 bg-emerald-50"}`}>
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HIGH-YIELD SPONSORED HACKATHON B2B BANNER */}
        <SponsoredChallengeBanner />

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-center">
          <div className={t.tabsBar}>
            <button
              onClick={() => setActiveTab("STREAK")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "STREAK" ? t.tabActive : t.tabInactive
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>🔥 Daily Streak Champions</span>
            </button>

            <button
              onClick={() => setActiveTab("CAMPUS_BATTLES")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "CAMPUS_BATTLES" ? t.tabActive : t.tabInactive
              }`}
            >
              <School className="h-4 w-4" />
              <span>🏫 Campus Battles (Inter-College)</span>
            </button>

            <button
              onClick={() => setActiveTab("TRENDING_REPOS")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "TRENDING_REPOS" ? t.tabActive : t.tabInactive
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>⚡ Trending Repos &amp; Projects</span>
            </button>

            <button
              onClick={() => setActiveTab("REFERRALS")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "REFERRALS" ? t.tabActive : t.tabInactive
              }`}
            >
              <Users className="h-4 w-4" />
              <span>🤝 Peer Referrals</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INDIVIDUAL STREAK LEADERBOARD */}
        {activeTab === "STREAK" && (
          <div className="space-y-6">
            <div className={t.tableWrap}>
              <div className={t.tableCardHead}>
                <div>
                  <h3 className={t.tableTitle}>
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Streak Builders on RoleNest
                  </h3>
                  <p className={`text-xs mt-0.5 ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                    Real candidate streaks querying the live database. Ranked by active days, XP, and badges.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border ${
                    isArena ? "bg-neutral-900 border-neutral-700 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    {leaders.length} Registered Builder{leaders.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={t.tableThead}>
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4 text-center">Daily Streak</th>
                      <th className="py-3 px-4 text-center">Total XP</th>
                      <th className="py-3 px-4 text-center">Dev Caliber Score</th>
                      <th className="py-3 px-4 text-right">Top Badge</th>
                    </tr>
                  </thead>
                  <tbody className={t.tableDivide}>
                    {leaders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="mx-auto max-w-sm space-y-2">
                            <Trophy className={`h-8 w-8 mx-auto ${isArena ? "text-neutral-600" : "text-slate-300"}`} />
                            <p className={`font-bold text-sm ${isArena ? "text-neutral-300" : "text-slate-700"}`}>No builders on the leaderboard yet</p>
                            <p className={`text-xs ${isArena ? "text-neutral-500" : "text-slate-500"}`}>Sign in and click Daily Check-in to be #1 on RoleNest!</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      leaders.map((leader) => (
                        <tr
                          key={leader.userId}
                          className={`${t.tableTrHover} ${leader.isCurrentUser ? t.tableTrCurrent : ""}`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold">
                            {leader.rank === 1 ? (
                              <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                                <Crown className="h-4 w-4 fill-amber-500 text-amber-500" /> #1
                              </span>
                            ) : leader.rank === 2 ? (
                              <span className={`inline-flex items-center gap-1 font-bold ${isArena ? "text-neutral-300" : "text-slate-600"}`}>
                                🥈 #2
                              </span>
                            ) : leader.rank === 3 ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                                🥉 #3
                              </span>
                            ) : (
                              <span className={isArena ? "text-neutral-500" : "text-slate-500"}>#{leader.rank}</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={leader.avatarUrl}
                                alt=""
                                role="presentation"
                                width={32}
                                height={32}
                                className={`h-8 w-8 rounded-full border object-cover shrink-0 ${isArena ? "border-neutral-700" : "border-slate-200"}`}
                              />
                              <div>
                                <span className={t.candidateName}>
                                  {leader.name}
                                  {leader.isCurrentUser && (
                                    <span className={`rounded px-1 py-0.2 text-[9px] font-mono ${isArena ? "bg-amber-900/60 text-amber-300" : "bg-emerald-100 text-emerald-800"}`}>
                                      You
                                    </span>
                                  )}
                                  {leader.planBadge === "pro" && (
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                                      isArena ? "bg-amber-950/60 border-amber-800 text-amber-300" : "bg-emerald-100 border-emerald-300 text-emerald-800"
                                    }`}>
                                      <CheckCircle2 className="h-2.5 w-2.5 text-amber-400" /> Pro
                                    </span>
                                  )}
                                  {leader.planBadge === "student" && (
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                                      isArena ? "bg-indigo-950/60 border-indigo-800 text-indigo-300" : "bg-indigo-100 border-indigo-200 text-indigo-800"
                                    }`}>
                                      <GraduationCap className="h-2.5 w-2.5 text-indigo-400" /> Student
                                    </span>
                                  )}
                                  {leader.isPriorityPlaced && (
                                    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-mono font-semibold border ${
                                      isArena ? "bg-amber-950/60 border-amber-800 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700"
                                    }`} title="Top Priority Recruiter Placement">
                                      ⭐ Priority
                                    </span>
                                  )}
                                </span>
                                <span className={`text-[11px] font-mono ${isArena ? "text-neutral-500" : "text-slate-400"}`}>
                                  {leader.badgesCount} badges earned
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono font-bold ${
                              isArena ? "bg-orange-950/40 border-orange-800/60 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"
                            }`}>
                              <Flame className="h-3 w-3 fill-orange-500 text-orange-500" />
                              {leader.currentStreak} Days
                            </span>
                          </td>

                          <td className={`py-3.5 px-4 text-center font-mono font-bold ${isArena ? "text-emerald-400" : "text-emerald-700"}`}>
                            {leader.totalXp.toLocaleString()} XP
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                              isArena ? "bg-[#181818] border border-neutral-700 text-neutral-200" : "bg-slate-100 text-slate-800"
                            }`}>
                              <Zap className="h-3 w-3 text-emerald-500" />
                              {leader.verifiedDevScore > 0 ? `${leader.verifiedDevScore}/1000` : "Unranked"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span className={`inline-block rounded-lg border px-2 py-1 font-semibold text-[11px] ${
                              isArena ? "bg-[#181818] border-neutral-800 text-neutral-300" : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}>
                              {leader.badgesCount > 0 ? leader.recentBadge : "No badges yet"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTER-COLLEGE CAMPUS BATTLES */}
        {activeTab === "CAMPUS_BATTLES" && (
          <div className="space-y-6">
            
            {/* CAMPUS BATTLES BANNER & COLLEGE SELECTOR */}
            <div className={t.campusHero}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
                    isArena ? "bg-indigo-950/70 border border-indigo-800 text-indigo-300" : "bg-indigo-100 text-indigo-800"
                  }`}>
                    <School className="h-3.5 w-3.5 text-indigo-400" />
                    All-India Inter-College Ranking
                  </div>
                  <h3 className={`text-2xl font-black ${isArena ? "text-white" : "text-slate-900"}`}>
                    Inter-College Engineering Battles
                  </h3>
                  <p className={`text-xs sm:text-sm ${isArena ? "text-neutral-400" : "text-slate-600"}`}>
                    Students from across India build daily streaks and complete projects to push their college up the ranks.
                  </p>
                </div>

                <Button
                  onClick={shareCampusBattle}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shrink-0 shadow-sm"
                >
                  <Share2 className="h-4 w-4" />
                  Rally Your College WhatsApp Group
                </Button>
              </div>

              {/* Set My College HUD */}
              <div className={t.campusInputCard}>
                <div className={`text-xs font-mono font-bold uppercase flex items-center justify-between ${isArena ? "text-neutral-400" : "text-slate-600"}`}>
                  <span className="flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 text-indigo-400" />
                    Tag Your College / University
                  </span>
                  {userCollege && (
                    <span className={`font-bold font-sans ${isArena ? "text-emerald-400" : "text-emerald-700"}`}>
                      Currently Representing: <strong>{userCollege}</strong>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <select
                    value={userCollege}
                    onChange={(e) => {
                      if (e.target.value === "__NEW__") {
                        setShowRegisterCollegeModal(true);
                      } else {
                        handleSaveCollege(e.target.value);
                      }
                    }}
                    disabled={savingCollege}
                    className={t.campusSelect}
                  >
                    <option value="">-- Select Your College to Represent --</option>
                    <option value="__NEW__" className="text-amber-500 font-bold bg-neutral-900">
                      ➕ Don't see your college? Register it now!
                    </option>
                    {/* Combine POPULAR_COLLEGES and dynamic registeredCollegesList */}
                    {Array.from(
                      new Set([
                        ...POPULAR_COLLEGES,
                        ...registeredCollegesList.map((rc) => rc.name),
                        ...colleges.map((c) => c.collegeName),
                      ])
                    )
                      .filter((c) => c && c !== "Independent Builders")
                      .sort()
                      .map((c) => {
                        const matched = registeredCollegesList.find((rc) => rc.name === c);
                        return (
                          <option key={c} value={c}>
                            {c} {matched?.location ? `(${matched.location})` : ""}
                          </option>
                        );
                      })}
                  </select>

                  <Button
                    type="button"
                    onClick={() => setShowRegisterCollegeModal(true)}
                    className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 rounded-xl h-10 px-3.5 shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Register Your College
                  </Button>
                </div>

                {collegeSavedMsg && (
                  <div className="text-xs font-bold text-emerald-500 animate-in fade-in flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    {collegeSavedMsg}
                  </div>
                )}
              </div>
            </div>

            {/* COLLEGE RANKING TABLE */}
            <div className={t.tableWrap}>
              <div className={t.tableCardHead}>
                <div>
                  <h4 className={t.tableTitle}>
                    <Trophy className="h-5 w-5 text-amber-500" />
                    College Dominance Standings
                  </h4>
                  <p className={`text-xs mt-0.5 ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                    Colleges ordered by aggregate student streak days and collective builder XP.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={t.tableThead}>
                    <tr>
                      <th className="py-3 px-4">College Rank</th>
                      <th className="py-3 px-4">Institution / University</th>
                      <th className="py-3 px-4 text-center">Active Builders</th>
                      <th className="py-3 px-4 text-center">Collective Streak Days</th>
                      <th className="py-3 px-4 text-center">Collective XP</th>
                      <th className="py-3 px-4 text-right">Campus MVP</th>
                    </tr>
                  </thead>
                  <tbody className={t.tableDivide}>
                    {colleges.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={`py-12 text-center ${isArena ? "text-neutral-500" : "text-slate-500"}`}>
                          Select your college above to create the first campus team on RoleNest!
                        </td>
                      </tr>
                    ) : (
                      colleges.map((col) => (
                        <tr
                          key={col.collegeName}
                          className={`${t.tableTrHover} ${
                            userCollege === col.collegeName ? (isArena ? "bg-indigo-950/30 font-semibold" : "bg-indigo-50/40 font-semibold") : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold">
                            {col.rank === 1 ? (
                              <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                                <Crown className="h-4 w-4 fill-amber-500 text-amber-500" /> #1
                              </span>
                            ) : col.rank === 2 ? (
                              <span className={`inline-flex items-center gap-1 font-bold ${isArena ? "text-neutral-300" : "text-slate-600"}`}>
                                🥈 #2
                              </span>
                            ) : col.rank === 3 ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                                🥉 #3
                              </span>
                            ) : (
                              <span className={isArena ? "text-neutral-500" : "text-slate-500"}>#{col.rank}</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`font-bold block flex items-center gap-1.5 ${isArena ? "text-white" : "text-slate-900"}`}>
                              <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                              {col.collegeName}
                              {userCollege === col.collegeName && (
                                <span className={`rounded px-1 py-0.2 text-[9px] font-mono ${isArena ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-100 text-indigo-800"}`}>
                                  Your Campus
                                </span>
                              )}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono font-bold ${
                              isArena ? "bg-neutral-900 border border-neutral-800 text-neutral-300" : "bg-slate-100 text-slate-700"
                            }`}>
                              <Users className="h-3 w-3 text-neutral-500" />
                              {col.buildersCount} Builders
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono font-bold ${
                              isArena ? "bg-orange-950/40 border-orange-800/60 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"
                            }`}>
                              <Flame className="h-3 w-3 fill-orange-500 text-orange-500" />
                              {col.totalStreakDays} Days
                            </span>
                          </td>

                          <td className={`py-3.5 px-4 text-center font-mono font-bold ${isArena ? "text-emerald-400" : "text-emerald-700"}`}>
                            {col.totalXp.toLocaleString()} XP
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Image
                                src={col.topBuilder.avatarUrl}
                                alt={col.topBuilder.name}
                                width={24}
                                height={24}
                                className={`h-6 w-6 rounded-full border object-cover ${isArena ? "border-neutral-700" : "border-slate-200"}`}
                              />
                              <span className={`font-bold text-[11px] ${isArena ? "text-neutral-200" : "text-slate-800"}`}>
                                {col.topBuilder.name}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: TRENDING REPOS & CANDIDATE PROJECTS */}
        {activeTab === "TRENDING_REPOS" && (
          <div className="space-y-6">
            
            {/* Mode Switcher */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b ${t.cardBorder} pb-4`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRepoMode("GITHUB_TRENDING")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    repoMode === "GITHUB_TRENDING"
                      ? (isArena ? "bg-amber-500 text-slate-950 font-black" : "bg-slate-900 text-white")
                      : (isArena ? "bg-[#181818] text-neutral-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:text-slate-900")
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Live GitHub Trending (Trendshift)
                </button>
                <button
                  onClick={() => setRepoMode("CANDIDATE_PROJECTS")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    repoMode === "CANDIDATE_PROJECTS"
                      ? (isArena ? "bg-amber-500 text-slate-950 font-black" : "bg-slate-900 text-white")
                      : (isArena ? "bg-[#181818] text-neutral-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:text-slate-900")
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Community Candidate Projects ({candidateProjects.length})
                </button>
              </div>

              {repoMode === "GITHUB_TRENDING" && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {["ALL", "TypeScript", "Python", "Rust", "Go"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedLanguage === lang
                          ? (isArena ? "bg-amber-500 text-slate-950" : "bg-emerald-600 text-white shadow-xs")
                          : (isArena ? "bg-[#181818] text-neutral-400 hover:bg-neutral-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GITHUB TRENDING VIEW */}
            {repoMode === "GITHUB_TRENDING" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className={t.repoCard}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={repo.avatarUrl}
                            alt={repo.owner}
                            width={28}
                            height={28}
                            className={`h-7 w-7 rounded-lg border ${isArena ? "border-neutral-700" : "border-slate-200"}`}
                          />
                          <span className={`text-xs font-mono ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                            {repo.owner} /
                          </span>
                        </div>
                        <span className={`flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-bold ${
                          isArena ? "bg-amber-950/40 border-amber-800/60 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}>
                          <Zap className="h-3 w-3 text-amber-500" />
                          Dev Score {repo.devScore}
                        </span>
                      </div>

                      <h4 className={t.repoTitle}>
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-amber-400 transition-colors"
                        >
                          {repo.name}
                        </a>
                      </h4>

                      <p className={`text-xs line-clamp-2 leading-relaxed ${isArena ? "text-neutral-400" : "text-slate-600"}`}>
                        {repo.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {repo.topics.map((tItem) => (
                          <span
                            key={tItem}
                            className={`rounded-md px-2 py-0.5 text-[10px] font-mono ${
                              isArena ? "bg-[#181818] text-neutral-400 border border-neutral-800" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            #{tItem}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`flex items-center justify-between border-t ${t.cardBorder} pt-3 text-xs`}>
                      <div className="flex items-center gap-4 font-mono">
                        <span className={`flex items-center gap-1 font-semibold ${isArena ? "text-neutral-300" : "text-slate-700"}`}>
                          <span
                            className="h-2 w-2 rounded-full inline-block"
                            style={{ backgroundColor: repo.languageColor }}
                          />
                          {repo.language}
                        </span>
                        <span className={`flex items-center gap-1 ${isArena ? "text-neutral-400" : "text-slate-600"}`}>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          {repo.stars.toLocaleString()}
                        </span>
                        <span className={`flex items-center gap-1 ${isArena ? "text-neutral-500" : "text-slate-500"}`}>
                          <GitFork className="h-3.5 w-3.5" />
                          {repo.forks.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {repo.demoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSandbox(repo.name, repo.demoUrl!, repo.repoUrl)}
                            className={`h-7 text-[11px] gap-1 px-2.5 font-bold ${
                              isArena ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white" : "border-slate-300 text-slate-800"
                            }`}
                          >
                            <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                            Live Demo
                          </Button>
                        )}
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={isArena ? "text-neutral-500 hover:text-white" : "text-slate-400 hover:text-slate-800"}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CANDIDATE PROJECTS VIEW */}
            {repoMode === "CANDIDATE_PROJECTS" && (
              <div className="space-y-4">
                {candidateProjects.length === 0 ? (
                  <div className={`rounded-3xl border p-12 text-center space-y-3 ${
                    isArena ? "border-neutral-800 bg-[#121212]" : "border-slate-200 bg-white"
                  }`}>
                    <Laptop className={`h-10 w-10 mx-auto ${isArena ? "text-neutral-600" : "text-slate-300"}`} />
                    <h4 className={`font-bold text-base ${isArena ? "text-neutral-200" : "text-slate-800"}`}>No Candidate Projects Listed Yet</h4>
                    <p className={`text-xs max-w-md mx-auto ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                      Are you a candidate? Add your engineering projects and GitHub repository in your Candidate Profile to be featured here!
                    </p>
                    <Link href="/onboarding/candidate">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-2">
                        Update Candidate Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidateProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className={t.repoCard}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold ${isArena ? "text-neutral-300" : "text-slate-700"}`}>{proj.authorName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isArena ? "text-emerald-400 bg-emerald-950/60" : "text-emerald-700 bg-emerald-50"
                            }`}>
                              Verified Student
                            </span>
                          </div>
                          <h4 className={t.repoTitle}>{proj.title}</h4>
                          <p className={`text-xs mt-1 line-clamp-2 ${isArena ? "text-neutral-400" : "text-slate-600"}`}>{proj.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.skillsUsed.map((s) => (
                              <span key={s} className={`rounded px-2 py-0.5 text-[10px] font-mono ${
                                isArena ? "bg-[#181818] text-neutral-400 border border-neutral-800" : "bg-slate-100 text-slate-600"
                              }`}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={`flex items-center justify-between border-t ${t.cardBorder} pt-3`}>
                          {proj.repoUrl && (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
                            >
                              <Code2 className="h-3.5 w-3.5" /> View Source
                            </a>
                          )}
                          {proj.liveUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSandbox(proj.title, proj.liveUrl!, proj.repoUrl || "")}
                              className={`h-7 text-[11px] gap-1 px-2.5 font-bold ${
                                isArena ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800" : ""
                              }`}
                            >
                              <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" /> Demo
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REFERRAL PROGRAM */}
        {activeTab === "REFERRALS" && (
          <div className="space-y-6">
            
            {/* REFERRAL HERO CARD */}
            <div className={t.referralHero}>
              <div className="max-w-xl space-y-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold ${
                  isArena ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                }`}>
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Viral Growth &amp; Peer Learning
                </span>
                <h3 className={`text-2xl sm:text-3xl font-extrabold ${isArena ? "text-white" : "text-slate-900"}`}>
                  Developer Peer Referral Network
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isArena ? "text-neutral-400" : "text-slate-600"}`}>
                  Share your unique referral link with engineering classmates and teammates. When they sign up on RoleNest, they receive a free streak freeze and you earn XP plus badge milestone rewards.
                </p>
              </div>

              {/* REFERRAL LINK BOX */}
              <div className={t.referralInputCard}>
                <div className={`text-xs font-mono font-bold uppercase ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                  Your Unique Referral Link
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className={t.referralInput}
                  />
                  <Button
                    onClick={copyReferralLink}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>

                {/* Direct Share Buttons */}
                <div className={`flex flex-wrap items-center gap-2 pt-2 border-t ${t.cardBorder}`}>
                  <span className={`text-xs font-semibold mr-1 ${isArena ? "text-neutral-400" : "text-slate-500"}`}>Share via:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnWhatsApp}
                    className={`gap-1.5 text-xs font-bold ${
                      isArena ? "border-emerald-800/80 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/60" : "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5 text-emerald-500" />
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnTwitter}
                    className={`gap-1.5 text-xs font-bold ${
                      isArena ? "border-sky-800/80 bg-sky-950/30 text-sky-300 hover:bg-sky-950/60" : "border-sky-300 text-sky-800 hover:bg-sky-50"
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5 text-sky-400" />
                    Twitter / X
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyReferralLink}
                    className={`text-xs ${isArena ? "text-neutral-400 hover:text-white" : "text-slate-600"}`}
                  >
                    Copy Direct
                  </Button>
                </div>
              </div>

              {/* REFERRAL MILESTONES HUD */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className={t.referralMilestoneCard}>
                  <div className={`text-xs font-bold font-mono ${isArena ? "text-neutral-500" : "text-slate-500"}`}>1 PEER INVITED</div>
                  <div className={t.referralMilestoneTitle}>
                    <Shield className="h-4 w-4 text-blue-400" />
                    +1 Streak Freeze Shield
                  </div>
                  <p className={`text-[11px] ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                    Protects your daily streak if you miss 24 hours of coding.
                  </p>
                </div>

                <div className={t.referralMilestoneCard}>
                  <div className={`text-xs font-bold font-mono ${isArena ? "text-neutral-500" : "text-slate-500"}`}>3 PEERS INVITED</div>
                  <div className={t.referralMilestoneTitle}>
                    <Award className="h-4 w-4 text-indigo-400" />
                    +300 XP &amp; Silver Badge
                  </div>
                  <p className={`text-[11px] ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                    Boosts your leaderboard position into top rankings.
                  </p>
                </div>

                <div className={t.referralMilestoneCard}>
                  <div className={`text-xs font-bold font-mono ${isArena ? "text-neutral-500" : "text-slate-500"}`}>5 PEERS INVITED</div>
                  <div className={t.referralMilestoneTitle}>
                    <Crown className="h-4 w-4 text-amber-400" />
                    Community Champion
                  </div>
                  <p className={`text-[11px] ${isArena ? "text-neutral-400" : "text-slate-500"}`}>
                    Unlocks permanent Gold badge on your verified profile.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 1-Click Interactive Demo Sandbox Modal */}
      {activeProject && (
        <DemoSandboxModal
          isOpen={sandboxOpen}
          onClose={() => setSandboxOpen(false)}
          projectTitle={activeProject.title}
          projectUrl={activeProject.url}
          githubUrl={activeProject.githubUrl}
        />
      )}

      {/* REGISTER YOUR COLLEGE MODAL */}
      {showRegisterCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-indigo-500/30 bg-[#141414] p-6 sm:p-8 shadow-2xl text-neutral-100 font-sans space-y-5">
            <button
              onClick={() => setShowRegisterCollegeModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-0.5 text-xs font-mono font-bold text-indigo-400">
                <School className="h-3.5 w-3.5" />
                <span>Inter-College Engineering Battles</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Register Your College / Campus
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your college details to create a dedicated campus leaderboard, rally your classmates, and climb the All-India ranks together.
              </p>
            </div>

            <form onSubmit={handleRegisterNewCollege} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-indigo-400" />
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g. National Institute of Technology Warangal"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    City / Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCollegeLocation}
                    onChange={(e) => setNewCollegeLocation(e.target.value)}
                    placeholder="e.g. Warangal, Bengaluru, Pune"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-sky-400" />
                    State (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCollegeState}
                    onChange={(e) => setNewCollegeState(e.target.value)}
                    placeholder="e.g. Telangana, Karnataka"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRegisterCollegeModal(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={registeringCollegeLoading || !newCollegeName.trim() || !newCollegeLocation.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 h-10 rounded-xl gap-1.5 shadow-md shadow-indigo-950"
                >
                  {registeringCollegeLoading ? (
                    "Registering..."
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Register &amp; Represent College
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isArena && <ArenaFooter />}
    </div>
  );
}
