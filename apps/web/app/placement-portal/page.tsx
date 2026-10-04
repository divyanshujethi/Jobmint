"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rss,
  Send,
  Check,
  Copy,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Award,
  Calendar,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@repo/shared";

export default function PlacementPortalPage() {
  const [copiedRss, setCopiedRss] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [platform, setPlatform] = useState<"discord" | "slack">("discord");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  // TPO Institutional SaaS State
  const [showTpoModal, setShowTpoModal] = useState(false);
  const [tpoCollege, setTpoCollege] = useState("");
  const [tpoName, setTpoName] = useState("");
  const [tpoEmail, setTpoEmail] = useState("");
  const [tpoPhone, setTpoPhone] = useState("");
  const [tpoStudents, setTpoStudents] = useState("500-1000");
  const [tpoPlan, setTpoPlan] = useState<"SILVER" | "GOLD">("GOLD");
  const [isSubmittingTpo, setIsSubmittingTpo] = useState(false);
  const [tpoSubmitted, setTpoSubmitted] = useState(false);

  const rssFeedUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/feed/rss`
    : "http://localhost:3000/api/feed/rss";

  const copyRss = () => {
    navigator.clipboard.writeText(rssFeedUrl);
    setCopiedRss(true);
    setTimeout(() => setCopiedRss(false), 2000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/webhooks/placement/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl, platform }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch webhook");
      }

      setSendResult({ success: true, message: data.message });
    } catch (err: any) {
      setSendResult({ success: false, error: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">Role Nest</Link>
              <span>/</span>
              <span className="text-neutral-200">Campus Placement Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-emerald-400" />
              College Placement Cell SaaS Portal
            </h1>
            <p className="text-neutral-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Empower your Training &amp; Placement Cell with verified ATS job feeds, batch-wide DevScore readiness telemetry, and on-campus visit coordination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <Button
              onClick={() => setShowTpoModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg"
            >
              Book TPO Demo / Pilot →
            </Button>
            <div className="bg-neutral-900 border border-purple-800/80 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 text-purple-300">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Campus SaaS</span>
            </div>
          </div>
        </div>

        {/* TPO SAAS VALUE PROPOSITION BANNER */}
        <div className="bg-linear-to-r from-emerald-950/70 via-neutral-900 to-indigo-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                Institutional Placement Platform
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Automate Off-Campus &amp; On-Campus Drives for Your College
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                Over 500+ Indian IT companies crawl through our Truth Teller verification pipeline. Package verified direct ATS links, student problem-solving stats, and campus recruitment drives into one unified portal.
              </p>
            </div>

            <Button
              onClick={() => setShowTpoModal(true)}
              className="bg-white hover:bg-neutral-100 text-neutral-950 font-black text-xs px-5 py-3 rounded-xl shrink-0"
            >
              Schedule Campus Onboarding →
            </Button>
          </div>

          {/* 3 Core TPO Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="rounded-2xl bg-neutral-950/60 border border-neutral-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>DevScore Readiness Telemetry</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Real-time dashboard for TPOs to track student GitHub activity, coding streaks, and resume ATS pass rates across engineering batches.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-950/60 border border-neutral-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Building2 className="w-4 h-4" />
                <span>Automated Off-Campus Drives</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Direct verified ATS applications from 500+ Indian startups and tech unicorns automatically broadcasted to student communication channels.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-950/60 border border-neutral-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Calendar className="w-4 h-4" />
                <span>Visit &amp; Drive Management</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Coordinate recruiter campus visits, manage slot allocations, and automatically verify student NOCs and offer letters.
              </p>
            </div>
          </div>
        </div>

        {/* ANNUAL TPO SAAS SUBSCRIPTION TIERS (₹25k - ₹50k / year) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-black text-white">Annual Institutional SaaS Plans</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Budget-friendly annual subscriptions for college placement cells and engineering universities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tier 1: Campus Silver */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-neutral-800 text-neutral-300 px-3 py-1 text-[10px] font-mono font-bold">
                    DEPARTMENTS &amp; MID COLLEGES
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Up to 500 Students</span>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">Campus Silver Pass</h4>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ₹24,999 <span className="text-xs font-normal text-neutral-400">/ year</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Essential automated job feeds and student readiness tracking for departmental placement teams.</p>
                </div>

                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Automated Telegram &amp; Discord Bot Syndication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Batch-wide Student DevScore Leaderboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Daily Verified Off-Campus Tech Openings (India)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Standard Email &amp; Webhook Support
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => {
                  setTpoPlan("SILVER");
                  setShowTpoModal(true);
                }}
                variant="outline"
                className="w-full border-neutral-700 text-neutral-200 hover:bg-neutral-800 font-bold text-xs h-10 rounded-xl"
              >
                Select Campus Silver
              </Button>
            </div>

            {/* Tier 2: University Gold */}
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-neutral-900/90 p-6 flex flex-col justify-between space-y-5 shadow-xl ring-1 ring-emerald-500/20">
              <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 shadow-sm">
                Most Popular for TPOs
              </span>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 text-[10px] font-mono font-bold">
                    FULL UNIVERSITY SUITE
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Unlimited Students</span>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">University Gold SaaS</h4>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ₹49,999 <span className="text-xs font-normal text-neutral-400">/ year</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">End-to-end placement portal suite with dedicated TPO admin dashboard and campus recruiter connects.</p>
                </div>

                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Full TPO Management Portal (Unlimited Students)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    On-Campus Drive Coordination &amp; Scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Branded College Coding Hackathons on POTD Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Direct Recruiter Introductions &amp; Priority Shortlists
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Official Offer Letter &amp; NOC Digital Verification
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => {
                  setTpoPlan("GOLD");
                  setShowTpoModal(true);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs h-10 rounded-xl"
              >
                Get University Gold SaaS
              </Button>
            </div>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Anti-Ghosting Campus Guarantee: </span>
            Every job syndicated through this portal is vetted for student fairness. If an employer fails to review applicant resumes within 7 days, they are automatically flagged on the Truth Teller engine.
          </div>
        </div>

        {/* FREE COMMUNITY SYNDICATION TOOLS (RSS & WEBHOOKS) */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Community Self-Serve Syndication Tools</h3>
            <p className="text-xs text-neutral-400">Free feeds and webhooks for student club leads, coding societies, and placement representatives.</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Module 1: Public RSS Feed */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                <Rss className="w-4 h-4" />
                <span>OPTION 1: RSS 2.0 XML FEED</span>
              </div>

              <h2 className="text-lg font-bold text-white">
                Universal Live Job Feed
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect our verified RSS feed to college intranets, Telegram bots, or RSS readers like Feedly, Inoreader, or Zapier. Updates every time a new verified role is published.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 font-mono">
                  Your Public RSS Feed URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={rssFeedUrl}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-300 select-all"
                  />
                  <button
                    onClick={copyRss}
                    className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs transition-colors shrink-0"
                    title="Copy RSS Feed Link"
                  >
                    {copiedRss ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Free Telegram Bot integration tip */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  Telegram Group Setup (Takes 60 Seconds):
                </div>
                <ol className="text-neutral-400 space-y-1 list-decimal list-inside text-[11px] leading-relaxed">
                  <li>Create or open your college student Telegram group.</li>
                  <li>Add a free RSS bot like <code className="text-emerald-400">@FeedManBot</code>.</li>
                  <li>Send command: <code className="text-emerald-400">/add {rssFeedUrl}</code></li>
                  <li>Students now receive new verified openings instantly!</li>
                </ol>
              </div>
            </div>

            <a
              href="/api/feed/rss"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Raw RSS XML Feed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Module 2: Discord & Slack Webhook Dispatcher */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                <Send className="w-4 h-4" />
                <span>OPTION 2: DISCORD & SLACK WEBHOOKS</span>
              </div>

              <h2 className="text-lg font-bold text-white">
                Real-Time Webhook Bot
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Send rich alerts with stipends, verified employer badges, and skills directly into your college student Discord server or Slack workspace.
              </p>

              {/* Platform selector */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform("discord")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                    platform === "discord"
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                  }`}
                >
                  Discord Webhook
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("slack")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                    platform === "slack"
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                  }`}
                >
                  Slack Webhook
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 font-mono">
                  {platform === "discord" ? "Discord Channel Webhook URL:" : "Slack Incoming Webhook URL:"}
                </label>
                <input
                  type="url"
                  placeholder={
                    platform === "discord"
                      ? "https://discord.com/api/webhooks/..."
                      : "https://hooks.slack.com/services/..."
                  }
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {sendResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
                    sendResult.success
                      ? "bg-emerald-950/50 border-emerald-800 text-emerald-300"
                      : "bg-red-950/50 border-red-800 text-red-300"
                  }`}
                >
                  {sendResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {sendResult.success ? sendResult.message : sendResult.error}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleTestWebhook}
              disabled={sending || !webhookUrl.trim()}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching Test Embed...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Send Live Test Job Alert to {platform === "discord" ? "Discord" : "Slack"}</span>
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* MODAL: TPO DEMO & INSTITUTIONAL PILOT ONBOARDING */}
      {showTpoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 text-neutral-900">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-900 text-neutral-100 p-6 sm:p-8 shadow-2xl space-y-5 border border-neutral-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Campus TPO Institutional Suite
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  Onboard Your College Placement Cell
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Schedule a 15-minute walkthrough of the TPO portal and activate your campus pilot.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTpoModal(false);
                  setTpoSubmitted(false);
                }}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            {tpoSubmitted ? (
              <div className="rounded-2xl bg-emerald-950/40 border border-emerald-800 p-6 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="font-black text-white text-base">Pilot Request Received!</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Our University Partnerships Director will contact you at <strong>{tpoEmail}</strong> within 12 hours with login credentials for the TPO sandbox dashboard.
                </p>
                <Button
                  onClick={() => {
                    setShowTpoModal(false);
                    setTpoSubmitted(false);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmittingTpo(true);
                  setTimeout(() => {
                    setIsSubmittingTpo(false);
                    setTpoSubmitted(true);
                  }, 800);
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">College / University Name</label>
                    <input
                      type="text"
                      required
                      value={tpoCollege}
                      onChange={(e) => setTpoCollege(e.target.value)}
                      placeholder="e.g. DTU, VIT Vellore, Thapar"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">TPO / Coordinator Name</label>
                    <input
                      type="text"
                      required
                      value={tpoName}
                      onChange={(e) => setTpoName(e.target.value)}
                      placeholder="Prof. Sharma / Placement Head"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={tpoEmail}
                      onChange={(e) => setTpoEmail(e.target.value)}
                      placeholder="tpo@college.edu.in"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={tpoPhone}
                      onChange={(e) => setTpoPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Student Batch Size</label>
                    <select
                      value={tpoStudents}
                      onChange={(e) => setTpoStudents(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="100-500">Up to 500 Students</option>
                      <option value="500-1500">500 - 1,500 Students</option>
                      <option value="1500+">1,500+ University-wide</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-neutral-300 block mb-1">Interested SaaS Tier</label>
                    <select
                      value={tpoPlan}
                      onChange={(e) => setTpoPlan(e.target.value as any)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="SILVER">Campus Silver (₹24,999/yr)</option>
                      <option value="GOLD">University Gold (₹49,999/yr)</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3 text-[11px] text-neutral-400 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Institutional Trial Included:
                  </div>
                  <p>Includes 14 days free access to the full TPO dashboard, test job syndication to a pilot Discord/Telegram channel, and student batch DevScore report.</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingTpo}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-2.5 rounded-xl min-h-[44px]"
                >
                  {isSubmittingTpo ? "Processing Request..." : "Request Institutional Access"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}