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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BountyListing {
  id: string;
  companyName: string;
  companySlug: string;
  roleTitle: string;
  referrerName: string;
  referrerTitle: string;
  referrerCompanyEmailVerified: boolean;
  totalReferralBonusInr: number;
  candidateSplitBonusInr: number; // What candidate receives
  availableSlots: number;
  totalSlots: number;
  minDevScore: number;
  experienceLevel: "FRESHER" | "1-3 YRS" | "3-5 YRS" | "5+ YRS";
  location: string;
  workMode: string;
  postedAgo: string;
  activeRequestsCount: number;
}

const SAMPLE_BOUNTIES: BountyListing[] = [
  {
    id: "bounty-1",
    companyName: "Razorpay",
    companySlug: "razorpay",
    roleTitle: "Backend Software Engineer (Payments Core)",
    referrerName: "Aakash S.",
    referrerTitle: "Staff Engineer @ Razorpay",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 80000,
    candidateSplitBonusInr: 40000,
    availableSlots: 2,
    totalSlots: 5,
    minDevScore: 650,
    experienceLevel: "1-3 YRS",
    location: "Bangalore",
    workMode: "Hybrid (2 days/wk)",
    postedAgo: "2h ago",
    activeRequestsCount: 7,
  },
  {
    id: "bounty-2",
    companyName: "Swiggy",
    companySlug: "swiggy",
    roleTitle: "Frontend Engineer (Consumer Web & Mobile)",
    referrerName: "Pooja M.",
    referrerTitle: "Senior SDE @ Swiggy",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 75000,
    candidateSplitBonusInr: 37500,
    availableSlots: 1,
    totalSlots: 4,
    minDevScore: 600,
    experienceLevel: "1-3 YRS",
    location: "Bangalore",
    workMode: "Remote / Hybrid",
    postedAgo: "4h ago",
    activeRequestsCount: 11,
  },
  {
    id: "bounty-3",
    companyName: "Zepto",
    companySlug: "zepto",
    roleTitle: "SDE-2 (Distributed Systems & Supply Chain)",
    referrerName: "Rohan V.",
    referrerTitle: "Engineering Lead @ Zepto",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 100000,
    candidateSplitBonusInr: 50000,
    availableSlots: 3,
    totalSlots: 5,
    minDevScore: 720,
    experienceLevel: "3-5 YRS",
    location: "Mumbai",
    workMode: "On-site",
    postedAgo: "1d ago",
    activeRequestsCount: 14,
  },
  {
    id: "bounty-4",
    companyName: "Google India",
    companySlug: "google",
    roleTitle: "Software Engineer (Cloud Storage & Infrastructure)",
    referrerName: "Siddharth K.",
    referrerTitle: "Senior Software Engineer @ Google",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 150000,
    candidateSplitBonusInr: 75000,
    availableSlots: 1,
    totalSlots: 2,
    minDevScore: 780,
    experienceLevel: "3-5 YRS",
    location: "Hyderabad",
    workMode: "Hybrid",
    postedAgo: "1d ago",
    activeRequestsCount: 29,
  },
  {
    id: "bounty-5",
    companyName: "PhonePe",
    companySlug: "phonepe",
    roleTitle: "Associate Software Engineer (Campus & Freshers)",
    referrerName: "Neha G.",
    referrerTitle: "Software Engineer @ PhonePe",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 50000,
    candidateSplitBonusInr: 25000,
    availableSlots: 4,
    totalSlots: 6,
    minDevScore: 550,
    experienceLevel: "FRESHER",
    location: "Bangalore",
    workMode: "On-site",
    postedAgo: "Just now",
    activeRequestsCount: 19,
  },
  {
    id: "bounty-6",
    companyName: "CRED",
    companySlug: "cred",
    roleTitle: "Android Developer (Fintech App Platform)",
    referrerName: "Varun D.",
    referrerTitle: "Lead Mobile Architect @ CRED",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 90000,
    candidateSplitBonusInr: 45000,
    availableSlots: 2,
    totalSlots: 3,
    minDevScore: 700,
    experienceLevel: "1-3 YRS",
    location: "Bangalore",
    workMode: "In-office",
    postedAgo: "5h ago",
    activeRequestsCount: 8,
  },
];

export default function BountyNestPage() {
  const [bounties, setBounties] = useState<BountyListing[]>(SAMPLE_BOUNTIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExp, setSelectedExp] = useState<string>("ALL");
  const [activeRequestBounty, setActiveRequestBounty] = useState<BountyListing | null>(null);
  const [showPostBountyModal, setShowPostBountyModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Form states for Request Referral
  const [reqCandidateName, setReqCandidateName] = useState("");
  const [reqCandidateEmail, setReqCandidateEmail] = useState("");
  const [reqCandidatePhone, setReqCandidatePhone] = useState("");
  const [reqGithubUrl, setReqGithubUrl] = useState("");
  const [reqPitch, setReqPitch] = useState("");
  const [reqDevScore, setReqDevScore] = useState(720);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Form states for Post Bounty
  const [postCorporateEmail, setPostCorporateEmail] = useState("");
  const [postCompanyName, setPostCompanyName] = useState("");
  const [postRoleTitle, setPostRoleTitle] = useState("");
  const [postTotalBonus, setPostTotalBonus] = useState("80000");
  const [postSlots, setPostSlots] = useState("3");
  const [postExp, setPostExp] = useState<"FRESHER" | "1-3 YRS" | "3-5 YRS" | "5+ YRS">("1-3 YRS");
  const [isPostingBounty, setIsPostingBounty] = useState(false);
  const [postSuccessMessage, setPostSuccessMessage] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bounties")
      .then((res) => res.json())
      .then((data) => {
        if (data?.bounties && Array.isArray(data.bounties) && data.bounties.length > 0) {
          setBounties(data.bounties);
        }
      })
      .catch((err) => console.warn("Notice loading bounties from API:", err));
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequestBounty) return;
    setIsSubmittingRequest(true);
    setRequestError(null);

    try {
      const res = await fetch("/api/bounties/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: activeRequestBounty.id,
          companyName: activeRequestBounty.companyName,
          roleTitle: activeRequestBounty.roleTitle,
          candidateName: reqCandidateName,
          candidateEmail: reqCandidateEmail,
          candidatePhone: reqCandidatePhone,
          githubUrl: reqGithubUrl,
          pitch: reqPitch,
          devScore: reqDevScore,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit referral request");
      }
      setRequestSubmitted(true);
    } catch (err: any) {
      setRequestError(err.message || "Failed to submit request");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handlePostBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingBounty(true);
    setPostError(null);
    setPostSuccessMessage(null);

    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          corporateEmail: postCorporateEmail,
          companyName: postCompanyName,
          roleTitle: postRoleTitle,
          totalBonusInr: Number(postTotalBonus),
          availableSlots: Number(postSlots),
          experienceLevel: postExp,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post referral slot");
      }
      if (data.bounty) {
        setBounties((prev) => [data.bounty, ...prev]);
      }
      setPostSuccessMessage(data.message || "Referral slot posted successfully!");
      setTimeout(() => {
        setShowPostBountyModal(false);
        setPostSuccessMessage(null);
        setPostCorporateEmail("");
        setPostCompanyName("");
        setPostRoleTitle("");
      }, 2500);
    } catch (err: any) {
      setPostError(err.message || "Failed to post referral opening");
    } finally {
      setIsPostingBounty(false);
    }
  };

  const filteredBounties = useMemo(() => {
    return bounties.filter((b) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesComp = b.companyName.toLowerCase().includes(q);
        const matchesRole = b.roleTitle.toLowerCase().includes(q);
        const matchesLoc = b.location.toLowerCase().includes(q);
        if (!matchesComp && !matchesRole && !matchesLoc) return false;
      }
      if (selectedExp !== "ALL" && b.experienceLevel !== selectedExp) {
        return false;
      }
      return true;
    });
  }, [bounties, searchTerm, selectedExp]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Gift className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-xs font-bold text-amber-800 font-mono">
              Bounty Nest™ Employee Referral Network
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Referral Bounty Market
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Get referred directly by verified software engineers at top Indian tech firms. Employees split their hiring referral bonus (₹25k - ₹75k) with you upon joining.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => setShowPostBountyModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-sm min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            Post Employee Referral Slot
          </Button>
        </div>
      </div>

      {/* VALUE PROPOSITION TILES */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            ⚡
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct ATS Bypass</h4>
            <p className="text-[11px] text-slate-500">Internal employee referral submissions get reviewed 5x faster than public queues.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold">
            💰
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Bonus Bounty Split</h4>
            <p className="text-[11px] text-slate-500">Referrers contractually pledge 50% of their referral reward bonus directly to you.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold">
            🛡️
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Verified Insiders Only</h4>
            <p className="text-[11px] text-slate-500">All referrers verify work emails (@razorpay.com, @google.com) before listing slots.</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or role (e.g. Swiggy, Backend)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "FRESHER", "1-3 YRS", "3-5 YRS"].map((exp) => (
            <button
              key={exp}
              onClick={() => setSelectedExp(exp)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                selectedExp === exp
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {exp === "ALL" ? "All Levels" : exp}
            </button>
          ))}
        </div>
      </div>

      {/* BOUNTY CARDS LIST */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBounties.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 font-bold text-white text-base shadow-sm">
                    {b.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {b.companyName}
                    </h3>
                    <span className="text-[11px] text-slate-500">{b.location} • {b.workMode}</span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  {b.experienceLevel}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{b.roleTitle}</h4>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Referrer:</span>
                  <span className="font-semibold text-slate-700">{b.referrerName}</span>
                  {b.referrerCompanyEmailVerified && (
                    <span title="Verified Corporate Work Email">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </span>
                  )}
                </div>
              </div>

              {/* BOUNTY SPLIT CALLOUT */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900">Your Bounty Share:</span>
                  <span className="font-extrabold text-amber-700 text-sm">
                    ₹{b.candidateSplitBonusInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-800/80">
                  <span>Total Pool: ₹{b.totalReferralBonusInr.toLocaleString("en-IN")}</span>
                  <span>50% Candidate Split</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <strong>{b.availableSlots}</strong> slots left of {b.totalSlots}
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-600">
                  Min Dev Score: {b.minDevScore}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                {b.activeRequestsCount} engineers requested
              </span>

              <Button
                onClick={() => {
                  setActiveRequestBounty(b);
                  setRequestSubmitted(false);
                  setRequestError(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl min-h-[44px]"
              >
                Request Referral
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* REQUEST REFERRAL MODAL */}
      {activeRequestBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4">
            <button
              onClick={() => setActiveRequestBounty(null)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            {!requestSubmitted ? (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                    {activeRequestBounty.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Request Referral @ {activeRequestBounty.companyName}
                    </h3>
                    <p className="text-xs text-slate-500">{activeRequestBounty.roleTitle}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 space-y-1">
                  <strong>Referrer: {activeRequestBounty.referrerName}</strong> ({activeRequestBounty.referrerTitle})
                  <p className="text-[11px] text-amber-800">
                    Bounty agreement: You receive <strong>₹{activeRequestBounty.candidateSplitBonusInr.toLocaleString("en-IN")}</strong> upon successful hiring probation.
                  </p>
                </div>

                {requestError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                    {requestError}
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={reqCandidateName}
                      onChange={(e) => setReqCandidateName(e.target.value)}
                      placeholder="e.g. Divyanshu Jethi"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={reqCandidateEmail}
                        onChange={(e) => setReqCandidateEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone (+91)</label>
                      <input
                        type="tel"
                        value={reqCandidatePhone}
                        onChange={(e) => setReqCandidatePhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GitHub / Portfolio URL</label>
                    <input
                      type="url"
                      required
                      value={reqGithubUrl}
                      onChange={(e) => setReqGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourhandle"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Short Pitch to Referrer (2-3 sentences)</label>
                    <textarea
                      rows={3}
                      required
                      value={reqPitch}
                      onChange={(e) => setReqPitch(e.target.value)}
                      placeholder="Why you are a strong match for this role and key projects you have shipped..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl min-h-[44px]"
                >
                  {isSubmittingRequest ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Dispatching...
                    </span>
                  ) : (
                    "Submit Referral Request"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Referral Request Dispatched!
                </h3>

                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your portfolio and pitch have been sent directly to <strong>{activeRequestBounty.referrerName}</strong>. You will receive an email and notification once they review and submit your profile to the internal company portal.
                </p>

                <Button
                  onClick={() => setActiveRequestBounty(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl min-h-[44px]"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POST BOUNTY MODAL */}
      {showPostBountyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4">
            <button
              onClick={() => setShowPostBountyModal(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Gift className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Post an Employee Referral Slot
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Only employees with verified corporate work emails can post referral slots. You retain 50% of your company referral reward and help talented engineers get noticed.
            </p>

            {postSuccessMessage && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                ✓ {postSuccessMessage}
              </div>
            )}

            {postError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                {postError}
              </div>
            )}

            <form onSubmit={handlePostBounty} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Corporate Email (@company.com)</label>
                <input
                  type="email"
                  required
                  value={postCorporateEmail}
                  onChange={(e) => setPostCorporateEmail(e.target.value)}
                  placeholder="name@razorpay.com or name@swiggy.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={postRoleTitle}
                    onChange={(e) => setPostRoleTitle(e.target.value)}
                    placeholder="e.g. SDE-1 Frontend"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={postCompanyName}
                    onChange={(e) => setPostCompanyName(e.target.value)}
                    placeholder="e.g. Razorpay"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Bonus (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={postTotalBonus}
                    onChange={(e) => setPostTotalBonus(e.target.value)}
                    placeholder="e.g. 80000"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Referral Slots</label>
                  <input
                    type="number"
                    value={postSlots}
                    onChange={(e) => setPostSlots(e.target.value)}
                    min={1}
                    max={10}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPostingBounty}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl min-h-[44px] mt-2"
              >
                {isPostingBounty ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying &amp; Publishing...
                  </span>
                ) : (
                  "Verify & Publish Referral Slots"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
