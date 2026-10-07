"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Gift,
  ShieldCheck,
  Building2,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  Clock,
  Send,
  MessageCircle,
  Award,
  Loader2,
  Share2,
  Copy,
  Check,
  Briefcase,
  MapPin,
  Flame,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FriendReferralBounty, INITIAL_FRIEND_BOUNTIES } from "@/lib/bounties-data";

export default function BountyNestPage() {
  const [bounties, setBounties] = useState<FriendReferralBounty[]>(INITIAL_FRIEND_BOUNTIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedExp, setSelectedExp] = useState<string>("ALL");
  const [activeReferBounty, setActiveReferBounty] = useState<FriendReferralBounty | null>(null);
  const [referSubmitted, setReferSubmitted] = useState(false);
  const [copiedLinkBountyId, setCopiedLinkBountyId] = useState<string | null>(null);

  // Form states for Refer a Friend
  const [referrerName, setReferrerName] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [referrerUpi, setReferrerUpi] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendGithubUrl, setFriendGithubUrl] = useState("");
  const [friendResumeUrl, setFriendResumeUrl] = useState("");
  const [recommendationNote, setRecommendationNote] = useState("");
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);

  // Track My Referrals state
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [trackerEmail, setTrackerEmail] = useState("");
  const [myReferrals, setMyReferrals] = useState<any[]>([]);
  const [isSearchingReferrals, setIsSearchingReferrals] = useState(false);
  const [hasSearchedReferrals, setHasSearchedReferrals] = useState(false);

  useEffect(() => {
    fetch("/api/bounties")
      .then((res) => res.json())
      .then((data) => {
        if (data?.bounties && Array.isArray(data.bounties) && data.bounties.length > 0) {
          setBounties(data.bounties);
        }
      })
      .catch((err) => console.warn("Notice loading bounties from API:", err));

    try {
      const savedEmail = localStorage.getItem("rolenest_referrer_email");
      if (savedEmail) setReferrerEmail(savedEmail);
      const savedName = localStorage.getItem("rolenest_referrer_name");
      if (savedName) setReferrerName(savedName);
      const savedUpi = localStorage.getItem("rolenest_referrer_upi");
      if (savedUpi) setReferrerUpi(savedUpi);
    } catch {}
  }, []);

  const handleReferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReferBounty) return;
    setIsSubmittingReferral(true);
    setReferralError(null);

    try {
      const res = await fetch("/api/bounties/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: activeReferBounty.id,
          companyName: activeReferBounty.companyName,
          roleTitle: activeReferBounty.roleTitle,
          bountyRewardInr: activeReferBounty.bountyRewardInr,
          referrerName,
          referrerEmail,
          referrerPhone,
          referrerUpi,
          friendName,
          friendEmail,
          friendPhone,
          friendGithubUrl,
          friendResumeUrl,
          recommendationNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit friend referral");
      }

      try {
        localStorage.setItem("rolenest_referrer_email", referrerEmail);
        localStorage.setItem("rolenest_referrer_name", referrerName);
        localStorage.setItem("rolenest_referrer_upi", referrerUpi);
      } catch {}

      setReferSubmitted(true);
    } catch (err: any) {
      setReferralError(err.message || "Failed to submit referral");
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  const copyReferralLink = (bounty: FriendReferralBounty) => {
    const userRef = referrerEmail ? encodeURIComponent(referrerEmail.split("@")[0]) : "community";
    const shareUrl = `https://rolenest.in/jobs?ref=${userRef}&role=${encodeURIComponent(bounty.roleTitle)}&bounty=${bounty.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLinkBountyId(bounty.id);
    setTimeout(() => setCopiedLinkBountyId(null), 2500);
  };

  const handleTrackReferrals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerEmail.trim()) return;
    setIsSearchingReferrals(true);
    try {
      const res = await fetch(`/api/bounties/request?email=${encodeURIComponent(trackerEmail.trim())}`);
      const data = await res.json();
      setMyReferrals(data.referrals || []);
      setHasSearchedReferrals(true);
    } catch {
      setMyReferrals([]);
      setHasSearchedReferrals(true);
    } finally {
      setIsSearchingReferrals(false);
    }
  };

  const filteredBounties = useMemo(() => {
    return bounties.filter((b) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesComp = b.companyName.toLowerCase().includes(q);
        const matchesRole = b.roleTitle.toLowerCase().includes(q);
        const matchesSkills = b.keySkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesComp && !matchesRole && !matchesSkills) return false;
      }
      if (selectedDept !== "ALL" && b.department !== selectedDept) {
        return false;
      }
      if (selectedExp !== "ALL" && b.experienceLevel !== selectedExp) {
        return false;
      }
      return true;
    });
  }, [bounties, searchTerm, selectedDept, selectedExp]);

  const totalPoolInr = useMemo(() => {
    return bounties.reduce((sum, b) => sum + b.bountyRewardInr * (b.openPositions || 1), 0);
  }, [bounties]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Gift className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-xs font-bold text-amber-900 font-mono">
              RoleNest Community Referral Program
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Refer a Friend, Earn up to ₹50,000 Cash
          </h1>
          <p className="mt-2 text-sm text-slate-700 max-w-2xl leading-relaxed font-medium">
            Know a talented engineer, student, or peer? Refer your friend to active verified tech roles. When your friend gets hired and completes 30 days, we pay the cash referral bounty directly into your UPI account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => {
              if (referrerEmail) setTrackerEmail(referrerEmail);
              setShowTrackerModal(true);
            }}
            variant="outline"
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs gap-1.5 shadow-xs min-h-[44px]"
          >
            <Wallet className="h-4 w-4 text-emerald-600" />
            Track My Referrals &amp; Payouts
          </Button>
        </div>
      </div>

      {/* HOW IT WORKS BANNER: 100% WCAG CONTRAST */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              COMMUNITY REFERRAL REWARDS • NO COMPANY EMAIL REQUIRED
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Turn Your Network Into Cash in 3 Simple Steps
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              You don&apos;t need to work at these companies. Anyone in the RoleNest community can refer friends, batchmates, and colleagues.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-xl">
            <div className="rounded-2xl bg-white/10 p-3.5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-mono font-black text-amber-300">Step 1</span>
              <h4 className="text-xs font-bold text-white">Pick an Open Role</h4>
              <p className="text-[11px] text-slate-300 leading-snug">Browse open engineering roles and view the bounty reward.</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3.5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-mono font-black text-amber-300">Step 2</span>
              <h4 className="text-xs font-bold text-white">Enter Friend &amp; UPI</h4>
              <p className="text-[11px] text-slate-300 leading-snug">Share their resume/GitHub and your UPI ID for payout.</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-3.5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-mono font-black text-amber-300">Step 3</span>
              <h4 className="text-xs font-bold text-white">Collect Cash Bounty</h4>
              <p className="text-[11px] text-slate-300 leading-snug">When they get hired, receive ₹15k–₹50k straight to your UPI.</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
            Active Community Bounty Pool
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{(totalPoolInr / 100000).toFixed(1)} Lakhs</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Available for referrers across {bounties.length} high-priority openings.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
            Top Referral Bounty
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">₹50,000 / Hire</span>
            <span className="text-xs font-bold text-slate-700">Paid Direct via UPI</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Instant notification upon candidate offer acceptance &amp; onboarding.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
            Guaranteed Fast-Track Review
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700">&lt; 48 Hours</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Priority ATS
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Referred candidates skip public queues and get prioritized screening.</p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="mt-8 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by company, role, or skills (e.g. Razorpay, Go, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-500 shadow-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono font-bold text-slate-600 mr-1 hidden sm:inline">Exp:</span>
            {["ALL", "FRESHER", "1-3 YRS", "3-5 YRS"].map((exp) => (
              <button
                key={exp}
                onClick={() => setSelectedExp(exp)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  selectedExp === exp
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {exp === "ALL" ? "All Experience" : exp}
              </button>
            ))}
          </div>
        </div>

        {/* Department Track Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-slate-100">
          <span className="text-xs font-mono font-bold text-slate-600 mr-1">Track:</span>
          {["ALL", "Backend", "Frontend", "FullStack", "AI & ML", "DevOps & Cloud", "Mobile"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDept(d)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedDept === d
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {d === "ALL" ? "All Tracks" : d}
            </button>
          ))}
        </div>
      </div>

      {/* BOUNTY CARDS LIST: REFER A FRIEND */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBounties.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              {/* Header: Company & Urgency */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 font-bold text-white text-base shadow-sm">
                    {b.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      {b.companyName}
                    </h3>
                    <span className="text-xs text-slate-600 font-medium">
                      {b.location} • {b.workMode}
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-800">
                  {b.experienceLevel}
                </span>
              </div>

              {/* Role Title & Expected Salary */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-2 min-h-[2.5rem] leading-snug" title={b.roleTitle}>
                  {b.roleTitle}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-700">
                  <span className="font-medium text-slate-500">Candidate CTC:</span>
                  <span className="font-bold text-slate-900">{b.salaryRangeCtcLpa}</span>
                </div>
              </div>

              {/* REFERRAL CASH BOUNTY CALLOUT BOX */}
              <div className="rounded-2xl bg-amber-50/90 border border-amber-300 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <Gift className="h-4 w-4 text-amber-700" />
                    Your Referral Bounty:
                  </span>
                  <span className="font-black text-amber-900 text-base">
                    ₹{b.bountyRewardInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 font-medium">
                  Paid directly to your UPI when your referred friend joins.
                </p>
              </div>

              {/* Skills required */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {b.keySkills.map((sk) => (
                  <span
                    key={sk}
                    className="rounded-lg bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 text-[11px] font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Open positions & urgency */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <strong>{b.openPositions}</strong> open positions
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded text-[10px]">
                  {b.hiringUrgency === "IMMEDIATE" ? "⚡ Immediate Hiring" : "Priority Role"}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS: REFER A FRIEND & COPY LINK */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
              <Button
                onClick={() => {
                  setActiveReferBounty(b);
                  setReferSubmitted(false);
                  setReferralError(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl min-h-[42px] gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Refer a Friend
              </Button>

              <button
                onClick={() => copyReferralLink(b)}
                title="Copy shareable link"
                className="h-[42px] px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center transition-colors"
              >
                {copiedLinkBountyId === b.id ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Check className="h-3.5 w-3.5" /> Copied!
                  </span>
                ) : (
                  <Copy className="h-4 w-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REFER A FRIEND MODAL */}
      {activeReferBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveReferBounty(null)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            {!referSubmitted ? (
              <form onSubmit={handleReferSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {activeReferBounty.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Refer a Friend for {activeReferBounty.companyName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{activeReferBounty.roleTitle}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-300 p-3.5 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-900">Your Referral Bounty:</strong>
                    <span className="font-black text-amber-900 text-sm">
                      ₹{activeReferBounty.bountyRewardInr.toLocaleString("en-IN")} Cash
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    When your referred friend joins and passes 30 days of onboarding, ₹{activeReferBounty.bountyRewardInr.toLocaleString("en-IN")} is credited directly to your UPI ID below.
                  </p>
                </div>

                {referralError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                    {referralError}
                  </div>
                )}

                {/* Section A: Your Payout Info */}
                <div className="space-y-2.5 border-t border-slate-100 pt-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider text-emerald-700">
                    1. Your Information (For Bounty Payout)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        placeholder="e.g. Divyanshu"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={referrerEmail}
                        onChange={(e) => setReferrerEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Your UPI ID (For ₹{activeReferBounty.bountyRewardInr.toLocaleString("en-IN")} Payout)
                    </label>
                    <input
                      type="text"
                      required
                      value={referrerUpi}
                      onChange={(e) => setReferrerUpi(e.target.value)}
                      placeholder="e.g. username@okhdfcbank or phone@upi"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                    />
                  </div>
                </div>

                {/* Section B: Friend Info */}
                <div className="space-y-2.5 border-t border-slate-100 pt-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider text-indigo-700">
                    2. Your Friend&apos;s Details (Candidate)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Friend&apos;s Full Name</label>
                      <input
                        type="text"
                        required
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Friend&apos;s Email</label>
                      <input
                        type="email"
                        required
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        placeholder="rahul@domain.com"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Friend&apos;s Phone (+91)</label>
                      <input
                        type="tel"
                        value={friendPhone}
                        onChange={(e) => setFriendPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">GitHub or Portfolio URL</label>
                      <input
                        type="url"
                        value={friendGithubUrl}
                        onChange={(e) => setFriendGithubUrl(e.target.value)}
                        placeholder="https://github.com/rahul"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Friend&apos;s Resume Link (Google Drive / Notion)</label>
                    <input
                      type="url"
                      value={friendResumeUrl}
                      onChange={(e) => setFriendResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or LinkedIn"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Why do you recommend your friend? (Optional)</label>
                    <textarea
                      rows={2}
                      value={recommendationNote}
                      onChange={(e) => setRecommendationNote(e.target.value)}
                      placeholder="e.g. Great at high-concurrency Go services and solved 350+ LeetCode problems..."
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingReferral}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl min-h-[44px]"
                >
                  {isSubmittingReferral ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting Referral...
                    </span>
                  ) : (
                    `Submit Referral & Lock In ₹${activeReferBounty.bountyRewardInr.toLocaleString("en-IN")} Bounty`
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Referral Successfully Dispatched!
                </h3>

                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your friend <strong>{friendName}</strong> has been fast-tracked for <strong>{activeReferBounty.roleTitle}</strong> at <strong>{activeReferBounty.companyName}</strong>.
                </p>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-700 max-w-sm mx-auto">
                  <div className="font-bold text-emerald-700">Payout Locked: ₹{activeReferBounty.bountyRewardInr.toLocaleString("en-IN")}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Will be credited to: <span className="font-mono text-slate-900">{referrerUpi}</span> upon hire.</div>
                </div>

                <Button
                  onClick={() => setActiveReferBounty(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl min-h-[44px]"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRACK MY REFERRALS MODAL */}
      {showTrackerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowTrackerModal(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Wallet className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  My Referrals &amp; Payout Status
                </h3>
                <p className="text-xs text-slate-500">
                  Track all friends you referred and check their hiring status.
                </p>
              </div>
            </div>

            <form onSubmit={handleTrackReferrals} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email to lookup referrals..."
                value={trackerEmail}
                onChange={(e) => setTrackerEmail(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <Button
                type="submit"
                disabled={isSearchingReferrals}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4"
              >
                {isSearchingReferrals ? "Checking..." : "Lookup"}
              </Button>
            </form>

            {hasSearchedReferrals && (
              <div className="space-y-3 pt-2">
                {myReferrals.length === 0 ? (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-1">
                    <p className="text-xs font-bold text-slate-700">No referrals found for {trackerEmail}</p>
                    <p className="text-[11px] text-slate-500">
                      Pick any role on the board and click &quot;Refer a Friend&quot; to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {myReferrals.map((r, i) => (
                      <div key={r.id || i} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{r.friendName}</span>
                          <span className="font-bold text-emerald-700">₹{r.bountyRewardInr?.toLocaleString("en-IN")} Bounty</span>
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          {r.roleTitle} @ {r.companyName}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                          <span>Status: <strong className="text-emerald-700">{r.status || "UNDER REVIEW"}</strong></span>
                          <span>UPI: {r.referrerUpi}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
