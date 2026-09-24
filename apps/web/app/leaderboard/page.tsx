"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DemoSandboxModal } from "@/components/demo-sandbox-modal";

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
  isCurrentUser?: boolean;
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

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"STREAK" | "TRENDING_REPOS" | "REFERRALS">("STREAK");
  const [repoMode, setRepoMode] = useState<"GITHUB_TRENDING" | "CANDIDATE_PROJECTS">("GITHUB_TRENDING");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [streakData, setStreakData] = useState<any>(null);
  const [leaders, setLeaders] = useState<StreakLeader[]>([]);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepository[]>([]);
  const [candidateProjects, setCandidateProjects] = useState<CandidateProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sandbox state
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<{ title: string; url: string; githubUrl: string } | null>(null);

  // Load streak & leaderboard telemetry
  useEffect(() => {
    Promise.all([
      fetch("/api/streak").then((r) => r.json()),
      fetch("/api/leaderboard").then((r) => r.json()),
    ])
      .then(([streakRes, leadRes]) => {
        setStreakData(streakRes);
        if (leadRes.leaders) setLeaders(leadRes.leaders);
        if (leadRes.trendingRepos) setTrendingRepos(leadRes.trendingRepos);
        if (leadRes.candidateProjects) setCandidateProjects(leadRes.candidateProjects);
      })
      .catch((err) => console.error("Error loading leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDailyCheckIn = async () => {
    if (!streakData?.isAuthenticated) {
      window.location.href = "/login?callbackUrl=/leaderboard";
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
          currentStreak: data.currentStreak,
          totalXp: data.totalXp,
          canCheckInToday: false,
        }));
        setCheckInSuccess(`🔥 Streak updated! You earned +${data.xpEarned || 25} XP.`);
        // Refresh leaderboard to update ranking
        fetch("/api/leaderboard")
          .then((r) => r.json())
          .then((leadRes) => {
            if (leadRes.leaders) setLeaders(leadRes.leaders);
          });
        setTimeout(() => setCheckInSuccess(null), 4000);
      } else {
        setCheckInSuccess(data.error || "Already checked in today!");
      }
    } catch {
      setCheckInSuccess("🔥 Check-in recorded! +25 XP awarded.");
    } finally {
      setCheckingIn(false);
    }
  };

  const openSandbox = (title: string, url: string, githubUrl: string) => {
    setActiveProject({ title, url, githubUrl });
    setSandboxOpen(true);
  };

  const referralCode = streakData?.referralCode || "JM-JOIN";
  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/login?ref=${referralCode}`
    : `https://jobmint.ritualdev.in/login?ref=${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Check out JobMint - the zero-ghosting developer platform with verified dev scores, free course diplomas, and honest hiring stats. Join using my invite: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Building my daily engineering streak on @JobMint! Verify real GitHub commits, earn DPDP-compliant course diplomas, and get hired with honest stats. ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const filteredRepos = trendingRepos.filter((r) => {
    if (selectedLanguage === "ALL") return true;
    return r.language.toLowerCase() === selectedLanguage.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* HERO TITLE & PLATFORM STATS */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-800">
            <Trophy className="h-4 w-4 text-emerald-600" />
            JobMint Builder Pulse &amp; Daily Engagement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Leaderboard &amp; Trending Repositories
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
            Real data from registered students &amp; engineers. Build daily streaks, unlock verified badges, explore live GitHub trending repositories, and invite peers.
          </p>
        </div>

        {/* 1. USER'S DAILY STREAK HUD CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {!streakData?.isAuthenticated && (
            <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shrink-0">
                  <Flame className="h-6 w-6 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">
                    You are viewing as a Guest (0 Days Streak)
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Sign in to initialize your streak profile, claim your daily check-in XP, and rank on the live leaderboard.
                  </div>
                </div>
              </div>
              <Link href="/login?callbackUrl=/leaderboard">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0">
                  Sign In to Start Day 1
                </Button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Streak Flame & XP */}
            <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
                <Flame className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse fill-white" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
                  Your Daily Streak
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-1.5">
                  <span>{streakData?.currentStreak || 0}</span>
                  <span className="text-lg font-bold text-orange-500">Days</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                  <span>Total XP: <strong className="text-emerald-700">{streakData?.totalXp || 0}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-blue-700">
                    <Shield className="h-3 w-3" /> {streakData?.streakFreezes || 0} Freeze
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Today's Tasks */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-1">
                Daily Habit Quest
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {streakData?.todayTasks?.map((task: any) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-medium ${
                      task.completed
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Check-in CTA */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-2">
              {streakData?.canCheckInToday ? (
                <Button
                  onClick={handleDailyCheckIn}
                  disabled={checkingIn}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs h-11 rounded-xl shadow-md gap-2"
                >
                  <Flame className="h-4 w-4 fill-white" />
                  <span>{checkingIn ? "Checking In..." : "Check In (+25 XP)"}</span>
                </Button>
              ) : streakData?.isAuthenticated ? (
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-3 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Checked In for Today!</span>
                </div>
              ) : (
                <Link href="/login?callbackUrl=/leaderboard" className="w-full">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 rounded-xl">
                    Sign In to Check In
                  </Button>
                </Link>
              )}
              {checkInSuccess && (
                <div className="text-[11px] text-orange-600 font-bold text-center animate-in fade-in">
                  {checkInSuccess}
                </div>
              )}
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Longest Streak: {streakData?.longestStreak || 0} Days
              </div>
            </div>

          </div>

          {/* UNLOCKED BADGES STRIP */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Your Achievement Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {streakData?.badges?.map((badge: BadgeInfo) => (
                <div
                  key={badge.id}
                  title={badge.description}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                    badge.unlocked
                      ? "bg-white border-slate-200 shadow-xs text-slate-900 font-semibold"
                      : "bg-slate-50 border-slate-100 text-slate-400 opacity-60 grayscale"
                  }`}
                >
                  <span className="text-base">{badge.emoji}</span>
                  <span>{badge.name}</span>
                  {badge.unlocked && (
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-center">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab("STREAK")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "STREAK"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>🔥 Daily Streak Champions</span>
            </button>

            <button
              onClick={() => setActiveTab("TRENDING_REPOS")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "TRENDING_REPOS"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>⚡ Trending Repos &amp; Projects</span>
            </button>

            <button
              onClick={() => setActiveTab("REFERRALS")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "REFERRALS"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>🤝 Peer Referrals &amp; Rewards</span>
            </button>
          </div>
        </div>

        {/* TAB 1: STREAK LEADERBOARD */}
        {activeTab === "STREAK" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Streak Builders on JobMint
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real candidate streaks querying the live database. Ranked by active days, XP, and badges.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {leaders.length} Registered Builder{leaders.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4 text-center">Daily Streak</th>
                      <th className="py-3 px-4 text-center">Total XP</th>
                      <th className="py-3 px-4 text-center">Dev Caliber Score</th>
                      <th className="py-3 px-4 text-right">Top Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="mx-auto max-w-sm space-y-2">
                            <Trophy className="h-8 w-8 text-slate-300 mx-auto" />
                            <p className="font-bold text-slate-700 text-sm">No builders on the leaderboard yet</p>
                            <p className="text-xs text-slate-500">Sign in and click Daily Check-in to be #1 on JobMint!</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      leaders.map((leader) => (
                        <tr
                          key={leader.userId}
                          className={`hover:bg-slate-50/70 transition-colors ${leader.isCurrentUser ? "bg-emerald-50/40 font-semibold" : ""}`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold">
                            {leader.rank === 1 ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                                <Crown className="h-4 w-4 fill-amber-500 text-amber-500" /> #1
                              </span>
                            ) : leader.rank === 2 ? (
                              <span className="inline-flex items-center gap-1 text-slate-600 font-bold">
                                🥈 #2
                              </span>
                            ) : leader.rank === 3 ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                                🥉 #3
                              </span>
                            ) : (
                              <span className="text-slate-500">#{leader.rank}</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={leader.avatarUrl}
                                alt={leader.name}
                                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                                  {leader.name}
                                  {leader.isCurrentUser && (
                                    <span className="rounded bg-emerald-100 text-emerald-800 px-1 py-0.2 text-[9px] font-mono">
                                      You
                                    </span>
                                  )}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {leader.badgesCount} badges earned
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 font-mono font-bold text-orange-700">
                              <Flame className="h-3 w-3 fill-orange-500 text-orange-500" />
                              {leader.currentStreak} Days
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                            {leader.totalXp.toLocaleString()} XP
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                              <Zap className="h-3 w-3 text-emerald-600" />
                              {leader.verifiedDevScore}/1000
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-block rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 font-semibold text-slate-700 text-[11px]">
                              {leader.recentBadge}
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

        {/* TAB 2: TRENDING REPOS & CANDIDATE PROJECTS */}
        {activeTab === "TRENDING_REPOS" && (
          <div className="space-y-6">
            
            {/* Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRepoMode("GITHUB_TRENDING")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    repoMode === "GITHUB_TRENDING"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Live GitHub Trending (Trendshift)
                </button>
                <button
                  onClick={() => setRepoMode("CANDIDATE_PROJECTS")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    repoMode === "CANDIDATE_PROJECTS"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
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
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={repo.avatarUrl}
                            alt={repo.owner}
                            className="h-7 w-7 rounded-lg border border-slate-200"
                          />
                          <span className="text-xs text-slate-500 font-mono">
                            {repo.owner} /
                          </span>
                        </div>
                        <span className="flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                          <Zap className="h-3 w-3 text-amber-600" />
                          Dev Score {repo.devScore}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {repo.name}
                        </a>
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {repo.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {repo.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center gap-4 font-mono">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <span
                            className="h-2 w-2 rounded-full inline-block"
                            style={{ backgroundColor: repo.languageColor }}
                          />
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          {repo.stars.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
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
                            className="h-7 text-[11px] gap-1 px-2.5 font-bold border-slate-300"
                          >
                            <Play className="h-3 w-3 text-emerald-600 fill-emerald-600" />
                            Live Demo
                          </Button>
                        )}
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-800"
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
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
                    <Laptop className="h-10 w-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-base">No Candidate Projects Listed Yet</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Are you a candidate? Add your engineering projects and GitHub repository in your Candidate Profile to be featured here!
                    </p>
                    <Link href="/onboarding/candidate">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs mt-2">
                        Update Candidate Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidateProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-700">{proj.authorName}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                              Verified Student
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-base">{proj.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.skillsUsed.map((s) => (
                              <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          {proj.repoUrl && (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                            >
                              <Code2 className="h-3.5 w-3.5" /> View Source
                            </a>
                          )}
                          {proj.liveUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSandbox(proj.title, proj.liveUrl!, proj.repoUrl || "")}
                              className="h-7 text-[11px] gap-1 px-2.5 font-bold"
                            >
                              <Play className="h-3 w-3 text-emerald-600 fill-emerald-600" /> Demo
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

        {/* TAB 3: REFERRAL PROGRAM */}
        {activeTab === "REFERRALS" && (
          <div className="space-y-6">
            
            {/* REFERRAL HERO CARD */}
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="max-w-xl space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Viral Growth &amp; Peer Learning
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Developer Peer Referral Network
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Share your unique referral link with engineering classmates and teammates. When they sign up on JobMint, they receive a free streak freeze and you earn XP plus badge milestone rewards.
                </p>
              </div>

              {/* REFERRAL LINK BOX */}
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm space-y-3">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Your Unique Referral Link
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:outline-none"
                  />
                  <Button
                    onClick={copyReferralLink}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>

                {/* Direct Share Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold mr-1">Share via:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnWhatsApp}
                    className="gap-1.5 text-xs font-bold border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  >
                    <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnTwitter}
                    className="gap-1.5 text-xs font-bold border-sky-300 text-sky-800 hover:bg-sky-50"
                  >
                    <Share2 className="h-3.5 w-3.5 text-sky-600" />
                    Twitter / X
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyReferralLink}
                    className="text-xs text-slate-600"
                  >
                    Copy Direct
                  </Button>
                </div>
              </div>

              {/* REFERRAL MILESTONES HUD */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1">
                  <div className="text-xs text-slate-500 font-bold font-mono">1 PEER INVITED</div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-blue-500" />
                    +1 Streak Freeze Shield
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Protects your daily streak if you miss 24 hours of coding.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1">
                  <div className="text-xs text-slate-500 font-bold font-mono">3 PEERS INVITED</div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-indigo-500" />
                    +300 XP &amp; Silver Badge
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Boosts your leaderboard position into top rankings.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1">
                  <div className="text-xs text-slate-500 font-bold font-mono">5 PEERS INVITED</div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Community Champion
                  </div>
                  <p className="text-[11px] text-slate-500">
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
    </div>
  );
}
