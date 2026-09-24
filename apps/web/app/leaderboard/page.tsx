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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [streakData, setStreakData] = useState<any>(null);
  const [leaders, setLeaders] = useState<StreakLeader[]>([]);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepository[]>([]);
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
      })
      .catch((err) => console.error("Error loading leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDailyCheckIn = async () => {
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

  const referralCode = streakData?.referralCode || "JM-VIP-2026";
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
            JobMint Builder Pulse &amp; Daily Engagement Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Leaderboard &amp; Trending Repositories
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
            Build daily consistency, unlock verified achievement badges, explore trending open-source projects (Trendshift style), and invite peers to earn streak protection.
          </p>
        </div>

        {/* 1. USER'S DAILY STREAK HUD CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
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
                  <span>{streakData?.currentStreak || 1}</span>
                  <span className="text-lg font-bold text-orange-500">Days</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                  <span>Total XP: <strong className="text-emerald-700">{streakData?.totalXp || 50}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-blue-700">
                    <Shield className="h-3 w-3" /> {streakData?.streakFreezes || 1} Freeze
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Today's Tasks */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-1">
                Daily Habit Quest (Come Back Daily)
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
              {streakData?.canCheckInToday !== false ? (
                <Button
                  onClick={handleDailyCheckIn}
                  disabled={checkingIn}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs h-11 rounded-xl shadow-md gap-2"
                >
                  <Flame className="h-4 w-4 fill-white" />
                  <span>{checkingIn ? "Checking In..." : "Check In (+25 XP)"}</span>
                </Button>
              ) : (
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-3 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Checked In for Today!</span>
                </div>
              )}
              {checkInSuccess && (
                <div className="text-[11px] text-orange-600 font-bold text-center animate-in fade-in">
                  {checkInSuccess}
                </div>
              )}
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Longest Streak: {streakData?.longestStreak || 1} Days
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
              <span>⚡ Trending Git Repos (Trendshift)</span>
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

        {/* TAB 1: DAILY STREAK LEADERBOARD */}
        {activeTab === "STREAK" && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Streak Builders on JobMint
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Engineers ranked by active daily streak, total XP, and proof-of-work achievements.
                  </p>
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
                      <th className="py-3 px-4 text-center">Verified Dev Score</th>
                      <th className="py-3 px-4 text-right">Top Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaders.map((leader) => (
                      <tr
                        key={leader.userId}
                        className="hover:bg-slate-50/70 transition-colors"
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
                              <span className="font-bold text-slate-900 block">
                                {leader.name}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRENDING REPOS (TRENDSHIFT STYLE) */}
        {activeTab === "TRENDING_REPOS" && (
          <div className="space-y-6">
            
            {/* Trendshift Language Filter Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Trendshift: Trending Developer Repositories
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated open-source projects built by candidates with live 1-Click Interactive Sandboxes and verified Dev Scores.
                </p>
              </div>

              {/* Language Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["ALL", "TypeScript", "Python", "Rust", "Go"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      selectedLanguage === lang
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRepos.map((repo) => (
                <Card
                  key={repo.id}
                  className="border-slate-200 bg-white text-slate-900 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src={repo.avatarUrl}
                            alt={repo.owner}
                            className="h-5 w-5 rounded-full border border-slate-200 object-cover"
                          />
                          <span className="text-xs font-mono text-slate-500 font-semibold">
                            {repo.owner}
                          </span>
                        </div>

                        <CardTitle className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                          <a href={repo.repoUrl} target="_blank" rel="noreferrer">
                            {repo.name}
                          </a>
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {repo.description}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs font-mono font-bold">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {repo.stars.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          +{repo.starsToday} today
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    {/* Topics / Tags */}
                    <div className="flex flex-wrap gap-1">
                      {repo.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: repo.languageColor }}
                          />
                          <span className="text-xs text-slate-700 font-medium">
                            {repo.language}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                          Dev Score: {repo.devScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {repo.demoUrl && (
                          <Button
                            size="sm"
                            onClick={() => openSandbox(repo.name, repo.demoUrl!, repo.repoUrl)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-7 px-2.5 rounded-lg gap-1 shadow-xs"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>1-Click Sandbox</span>
                          </Button>
                        )}
                        <a
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-800 p-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REFERRAL PROGRAM */}
        {activeTab === "REFERRALS" && (
          <div className="space-y-8">
            {/* REFERRAL HERO CARD */}
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                  <Users className="h-3.5 w-3.5" />
                  Developer Peer Referral Network
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Invite Peers. Protect Your Streak. Earn XP.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Share your unique referral link with engineering classmates, batchmates, and hackathon teammates. When they sign up on JobMint, you both unlock exclusive streak protections and platform rewards.
                </p>
              </div>

              {/* REFERRAL LINK BOX */}
              <div className="space-y-3 max-w-xl">
                <label className="text-xs font-bold text-slate-800 block">
                  Your Unique Referral Link
                </label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-xs">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="flex-1 bg-transparent border-0 text-xs font-mono text-slate-800 pl-2 focus:outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={copyReferralLink}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shrink-0 shadow-xs"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                  </Button>
                </div>

                {/* 1-Click Sharing buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={shareOnWhatsApp}
                    className="flex items-center gap-1.5 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 border border-[#25D366]/30 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    Share on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={shareOnTwitter}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    Post on X / Twitter
                  </button>
                  <button
                    type="button"
                    onClick={copyReferralLink}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Direct Invite
                  </button>
                </div>
              </div>

              {/* REFERRAL MILESTONES HUD */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Milestone 1</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      1 Friend
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    +100 XP + 🛡️ 1 Streak Freeze Shield + &quot;Community Champion&quot; badge.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Milestone 2</span>
                    <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                      3 Friends
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    +300 XP + Priority Recruiter Highlight on applications.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Milestone 3</span>
                    <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      5 Friends
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    +600 XP + Top Builder Spotlight on the JobMint Leaderboard.
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
          candidateName="Open-Source Contributor"
        />
      )}
    </div>
  );
}
