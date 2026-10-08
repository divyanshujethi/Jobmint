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
  Percent,
  BadgeCheck,
  Lock,
  Mail,
  UserCheck,
  HelpCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeHostedBounty, VERIFIED_EMPLOYEE_BOUNTIES } from "@/lib/bounties-data";

export default function BountyNestPage() {
  const [bounties, setBounties] = useState<EmployeeHostedBounty[]>(VERIFIED_EMPLOYEE_BOUNTIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedExp, setSelectedExp] = useState<string>("ALL");

  // Referral Invite (Refer a Friend for 1 Week Free Pro)
  const [myReferralCode, setMyReferralCode] = useState<string>("INVITE");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [invitedFriendsCount, setInvitedFriendsCount] = useState<number>(0);

  // Candidate Apply / Request Referral Modal
  const [activeReferBounty, setActiveReferBounty] = useState<EmployeeHostedBounty | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateGithubUrl, setCandidateGithubUrl] = useState("");
  const [candidateResumeUrl, setCandidateResumeUrl] = useState("");
  const [devScore, setDevScore] = useState("840");
  const [pitchNote, setPitchNote] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Employee "Host a Referral Slot" Modal
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostCompanyName, setHostCompanyName] = useState("");
  const [hostWorkEmail, setHostWorkEmail] = useState("");
  const [hostTitle, setHostTitle] = useState("");
  const [hostRoleTitle, setHostRoleTitle] = useState("");
  const [hostDepartment, setHostDepartment] = useState<any>("Backend");
  const [hostCompanyBonusInr, setHostCompanyBonusInr] = useState("60000");
  const [hostCandidateShareInr, setHostCandidateShareInr] = useState("25000");
  const [hostExperience, setHostExperience] = useState<any>("1-3 YRS");
  const [hostLocation, setHostLocation] = useState("Bangalore • Hybrid");
  const [hostSkills, setHostSkills] = useState("Go, Microservices, Kafka, Redis");
  const [hostDescription, setHostDescription] = useState("");
  const [isSubmittingHost, setIsSubmittingHost] = useState(false);
  const [hostSuccess, setHostSuccess] = useState(false);
  const [hostError, setHostError] = useState<string | null>(null);

  // Track My Referral Requests Modal
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [trackerEmail, setTrackerEmail] = useState("");
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isSearchingApps, setIsSearchingApps] = useState(false);
  const [hasSearchedApps, setHasSearchedApps] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/bounties")
      .then((res) => res.json())
      .then((data) => {
        if (data?.bounties && Array.isArray(data.bounties) && data.bounties.length > 0) {
          setBounties(data.bounties);
        }
      })
      .catch((err) => console.error("Error loading employee bounties:", err))
      .finally(() => setIsLoading(false));

    // Fetch real authenticated streak referral telemetry
    fetch("/api/streak")
      .then((res) => res.json())
      .then((data) => {
        if (data?.referralCode) {
          setMyReferralCode(data.referralCode);
        }
        if (typeof data?.referralCount === "number") {
          setInvitedFriendsCount(data.referralCount);
        } else {
          setInvitedFriendsCount(0);
        }
      })
      .catch(() => {
        setInvitedFriendsCount(0);
      });

    try {
      const savedEmail = localStorage.getItem("rolenest_user_email");
      if (savedEmail) {
        setCandidateEmail(savedEmail);
      }
      const savedName = localStorage.getItem("rolenest_user_name");
      if (savedName) setCandidateName(savedName);
    } catch {}
  }, []);

  const handleCopyInviteLink = () => {
    const inviteUrl = `https://rolenest.in/register?ref=${myReferralCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const inviteUrl = `https://rolenest.in/register?ref=${myReferralCode}`;
    const text = encodeURIComponent(
      `Hey! Sign up on RoleNest using my invite code ${myReferralCode} to get 1 Week Free Pro Subscription (unlimited AI mock roadmaps & verified jobs): ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCandidateRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReferBounty) return;
    setIsSubmittingRequest(true);
    setRequestError(null);

    try {
      const res = await fetch("/api/bounties/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: activeReferBounty.id,
          companyName: activeReferBounty.companyName,
          roleTitle: activeReferBounty.roleTitle,
          candidateName,
          candidateEmail,
          candidatePhone,
          candidateGithubUrl,
          candidateResumeUrl,
          devScore: Number(devScore) || 800,
          pitchNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit referral application");
      }
      try {
        localStorage.setItem("rolenest_user_email", candidateEmail);
        localStorage.setItem("rolenest_user_name", candidateName);
      } catch {}
      setRequestSuccess(true);
    } catch (err: any) {
      setRequestError(err.message || "Failed to submit referral application");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleHostBountySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHost(true);
    setHostError(null);

    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: hostCompanyName,
          companyEmail: hostWorkEmail,
          hostTitle,
          roleTitle: hostRoleTitle,
          department: hostDepartment,
          companyBonusInr: hostCompanyBonusInr,
          candidateShareInr: hostCandidateShareInr,
          experienceLevel: hostExperience,
          location: hostLocation,
          keySkills: hostSkills.split(",").map((s) => s.trim()).filter(Boolean),
          description: hostDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to host referral slot");
      }
      setHostSuccess(true);
      if (data.bounty) {
        setBounties((prev) => [data.bounty, ...prev]);
      }
    } catch (err: any) {
      setHostError(err.message || "Failed to host referral slot");
    } finally {
      setIsSubmittingHost(false);
    }
  };

  const handleTrackApps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerEmail.trim()) return;
    setIsSearchingApps(true);
    try {
      const res = await fetch(`/api/bounties/request?email=${encodeURIComponent(trackerEmail.trim())}`);
      const data = await res.json();
      setMyApplications(data.applications || []);
      setHasSearchedApps(true);
    } catch {
      setMyApplications([]);
      setHasSearchedApps(true);
    } finally {
      setIsSearchingApps(false);
    }
  };

  const filteredBounties = useMemo(() => {
    return bounties.filter((b) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesComp = b.companyName.toLowerCase().includes(q);
        const matchesRole = b.roleTitle.toLowerCase().includes(q);
        const matchesLoc = b.location.toLowerCase().includes(q);
        const matchesSkills = b.keySkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesComp && !matchesRole && !matchesLoc && !matchesSkills) return false;
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

  const totalBonusPool = useMemo(() => {
    return bounties.reduce((sum, b) => sum + b.employeeBonusInr * b.openSlots, 0);
  }, [bounties]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* SECTION 1: REFER A FRIEND TO ROLENEST -> GET 1 WEEK FREE PRO SUBSCRIPTION */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
              <Gift className="h-4 w-4 text-amber-300" />
              REFER A FRIEND VIRAL PROGRAM
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Refer RoleNest to a Friend &amp; Get 1 Week Free Pro!
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-medium">
              Share your invite link with college friends or developer peers. When they register and activate their account, <strong className="text-amber-300 font-bold">both of you earn 7 Days of Free Pro Subscription</strong> — including full roadmap source code, AI system reviews, and prioritized job feeds!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-700/60 rounded-xl px-3.5 py-2">
                <Users className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-indigo-200">Your Referred Friends: <strong className="text-white font-bold">{invitedFriendsCount} Friends</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl px-3.5 py-2">
                <Award className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-emerald-200">Pro Days Earned: <strong className="text-emerald-300 font-bold">{invitedFriendsCount * 7} Days Free</strong></span>
              </div>
            </div>
          </div>

          {/* SHARE CARD */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 w-full lg:w-96 shrink-0 shadow-lg space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center justify-between">
              <span>Your Personal Invite Link</span>
              <span className="font-mono text-amber-300">CODE: {myReferralCode}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 border border-indigo-500/40 rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={`https://rolenest.in/register?ref=${myReferralCode}`}
                className="bg-transparent text-xs text-white font-mono flex-1 outline-none select-all"
              />
              <button
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition-colors"
              >
                {copiedInvite ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 w-full h-10 shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Share
              </Button>
              <Button
                onClick={handleCopyInviteLink}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent font-bold text-xs gap-1.5 w-full h-10"
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
            </div>

            <p className="text-[11px] text-indigo-200/80 text-center leading-tight">
              🎁 When your friend registers with your code &amp; activates their profile, 7 Days Pro is credited to both of your accounts in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: EMPLOYEE-HOSTED REFERRAL BOUNTIES MARKETPLACE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-purple-50 border border-purple-300 px-3 py-0.5 text-xs font-bold text-purple-900 font-mono">
              Corporate Insider Marketplace • Direct ATS Referrals
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            Employee-Hosted Referral Bounties
          </h2>
          <p className="mt-2 text-sm text-slate-700 max-w-3xl leading-relaxed font-medium">
            Tech employees at top companies receive internal referral bonuses (up to ₹1,20,000) when a referred candidate joins.
            Verified employees host internal referral slots here to find high-performing candidates with vetted DevScores.
            <strong className="text-indigo-900 font-bold"> RoleNest manages verification &amp; takes a 15% platform facilitation fee upon successful hiring.</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => {
              setShowHostModal(true);
              setHostSuccess(false);
              setHostError(null);
            }}
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs gap-1.5 shadow-sm min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            Host a Referral Slot (For Employees)
          </Button>

          <Button
            onClick={() => {
              if (candidateEmail) setTrackerEmail(candidateEmail);
              setShowTrackerModal(true);
            }}
            variant="outline"
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs gap-1.5 shadow-xs min-h-[44px]"
          >
            <UserCheck className="h-4 w-4 text-purple-700" />
            Track My Referral Applications
          </Button>
        </div>
      </div>

      {/* HOW EMPLOYEE BOUNTIES WORK BANNER */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-purple-600" />
          Who gives this bounty &amp; how does the cut work?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-mono">1</span>
              Corporate Referral Bonus Policy
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every major tech company (Twilio, Google, Razorpay) has an official internal employee referral program. When an employee refers a qualified hire who joins, the company pays the employee an official cash bonus ($1,000–$3,000 / ₹60k–₹1.2L).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-mono">2</span>
              Why Employees Host Slots Here
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employees want top candidates so they don&apos;t waste their internal referral quota. By hosting on RoleNest, they receive candidates pre-vetted with high DevScores and GitHub proof, dramatically increasing their referral success rate.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-mono">3</span>
              RoleNest Escrow &amp; 15% Facilitation Cut
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the candidate gets hired and clears their initial joining period, the company releases the referral payout. RoleNest takes a transparent 15% platform verification fee, and the rest is settled between the employee host and the candidate!
            </p>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Employee Slots</div>
          <div className="mt-1 text-2xl font-black text-slate-900">{bounties.length} Roles</div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5" /> Corporate Email Verified
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bonus Pool</div>
          <div className="mt-1 text-2xl font-black text-purple-700">₹{(totalBonusPool / 100000).toFixed(1)} Lakhs</div>
          <div className="mt-1 text-xs text-slate-600">Company referral budgets</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Platform Facilitation</div>
          <div className="mt-1 text-2xl font-black text-indigo-700">15% Escrow Cut</div>
          <div className="mt-1 text-xs text-slate-600">Secure vetting &amp; escrow</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidate Viral Perk</div>
          <div className="mt-1 text-2xl font-black text-amber-600">7 Days Free Pro</div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">Per friend invited</div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company (Google, Twilio, Zepto...), title, or skill..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "Backend", "Frontend", "FullStack", "AI & ML", "DevOps & Cloud", "Mobile", "Product & Mgmt"].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                selectedDept === dept
                  ? "bg-purple-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* BOUNTIES CARDS GRID */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBounties.map((bounty) => (
          <div
            key={bounty.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* CARD TOP */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-lg">
                    {bounty.companyLogoInitial}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug flex items-center gap-1.5">
                      {bounty.companyName}
                      {bounty.verifiedBadge && (
                        <span title={`Verified Corporate Employee (${bounty.hostEmployeeDomain})`}>
                          <BadgeCheck className="h-4 w-4 text-purple-600 fill-purple-100 shrink-0" />
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {bounty.location}
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                  {bounty.experienceLevel}
                </span>
              </div>

              {/* ROLE TITLE */}
              <div className="mt-4">
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{bounty.roleTitle}</h4>
                <div className="mt-1 text-xs text-purple-700 font-semibold flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-purple-600" />
                  Hosted by: {bounty.hostEmployeeTitle} ({bounty.hostEmployeeDomain})
                </div>
              </div>

              {/* BOUNTY & CTC FINANCIAL BOX */}
              <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Internal Company Bonus:</span>
                  <span className="font-extrabold text-purple-900 text-sm">
                    ₹{bounty.employeeBonusInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-purple-200/60 pt-1.5">
                  <span className="text-slate-600 font-medium">Candidate Reward / Share:</span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    ₹{bounty.candidateRewardInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-purple-200/40 pt-1">
                  <span>RoleNest Platform Escrow Cut:</span>
                  <span className="font-bold text-slate-700">15% on hire</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                  <span>Candidate CTC:</span>
                  <span className="font-bold text-slate-800">{bounty.salaryRangeCtcLpa}</span>
                </div>
              </div>

              {/* SKILLS */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {bounty.keySkills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {bounty.description}
              </p>
            </div>

            {/* CARD BOTTOM / ACTION */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-medium">
                ⚡ <strong className="text-slate-800">{bounty.openSlots} Slots</strong> open
              </div>

              <Button
                onClick={() => {
                  setActiveReferBounty(bounty);
                  setRequestSuccess(false);
                  setRequestError(null);
                }}
                className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs gap-1 h-9 px-3.5 shadow-xs"
              >
                Request Referral
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: CANDIDATE REQUEST REFERRAL MODAL */}
      {activeReferBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setActiveReferBounty(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>

            {requestSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Referral Request Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your profile and DevScore have been submitted to <strong>{activeReferBounty.hostEmployeeTitle}</strong>. When accepted, you will receive an official ATS referral confirmation email from {activeReferBounty.companyName}.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => setActiveReferBounty(null)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs w-full"
                  >
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCandidateRequestSubmit} className="space-y-4">
                <div>
                  <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-bold text-purple-800">
                    Direct Employee Referral
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    Request Referral for {activeReferBounty.roleTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Target Company: <strong>{activeReferBounty.companyName}</strong> • Insider: {activeReferBounty.hostEmployeeTitle}
                  </p>
                </div>

                {requestError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                    {requestError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">DevScore (Estimated)</label>
                    <input
                      type="number"
                      value={devScore}
                      onChange={(e) => setDevScore(e.target.value)}
                      placeholder="e.g. 820"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub / Portfolio URL</label>
                    <input
                      type="url"
                      value={candidateGithubUrl}
                      onChange={(e) => setCandidateGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Resume Link (Drive/Dropbox)</label>
                    <input
                      type="url"
                      value={candidateResumeUrl}
                      onChange={(e) => setCandidateResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pitch Note to Employee</label>
                  <textarea
                    rows={3}
                    value={pitchNote}
                    onChange={(e) => setPitchNote(e.target.value)}
                    placeholder="Briefly highlight your key projects, production stack, and why you are a strong fit for this team..."
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-[11px] text-purple-900 leading-snug">
                  🛡️ <strong>Escrow &amp; Referral Guarantee:</strong> Your profile is sent exclusively to the verified employee. If selected and hired, RoleNest facilitates the reward distribution with a transparent 15% platform cut.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveReferBounty(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingRequest}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs"
                  >
                    {isSubmittingRequest ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Referral Request"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: HOST A REFERRAL SLOT (FOR EMPLOYEES) */}
      {showHostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowHostModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>

            {hostSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Referral Slot Hosted!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your internal referral opening has been published. RoleNest will pre-screen candidate DevScores and notify your work email when a top match applies. RoleNest deducts a 15% cut upon successful hire.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => setShowHostModal(false)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleHostBountySubmit} className="space-y-4">
                <div>
                  <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-bold text-purple-800">
                    For Tech Employees
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    Host an Internal Referral Opening
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Monetize your company referral bonus and hire top pre-vetted engineers. RoleNest takes a 15% facilitation fee.
                  </p>
                </div>

                {hostError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
                    {hostError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={hostCompanyName}
                      onChange={(e) => setHostCompanyName(e.target.value)}
                      placeholder="e.g. Google, Twilio, Zepto"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Work Email *</label>
                    <input
                      type="email"
                      required
                      value={hostWorkEmail}
                      onChange={(e) => setHostWorkEmail(e.target.value)}
                      placeholder="e.g. alex@twilio.com"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Title at Company</label>
                    <input
                      type="text"
                      value={hostTitle}
                      onChange={(e) => setHostTitle(e.target.value)}
                      placeholder="e.g. Senior Backend Lead"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opening Role Title *</label>
                    <input
                      type="text"
                      required
                      value={hostRoleTitle}
                      onChange={(e) => setHostRoleTitle(e.target.value)}
                      placeholder="e.g. SDE-2 Backend (Go)"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Referral Bonus (INR) *</label>
                    <input
                      type="number"
                      required
                      value={hostCompanyBonusInr}
                      onChange={(e) => setHostCompanyBonusInr(e.target.value)}
                      placeholder="e.g. 60000"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Share (INR)</label>
                    <input
                      type="number"
                      value={hostCandidateShareInr}
                      onChange={(e) => setHostCandidateShareInr(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={hostDepartment}
                      onChange={(e) => setHostDepartment(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    >
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="FullStack">FullStack</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Product & Mgmt">Product & Mgmt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                    <select
                      value={hostExperience}
                      onChange={(e) => setHostExperience(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                    >
                      <option value="FRESHER">FRESHER</option>
                      <option value="1-3 YRS">1-3 YRS</option>
                      <option value="3-5 YRS">3-5 YRS</option>
                      <option value="5+ YRS">5+ YRS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Tech Stack / Requirements</label>
                  <input
                    type="text"
                    value={hostSkills}
                    onChange={(e) => setHostSkills(e.target.value)}
                    placeholder="Go, Kafka, Redis, Microservices"
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-[11px] text-purple-900 leading-snug">
                  💡 <strong>Cut Breakdown:</strong> If company bonus is ₹60,000, RoleNest takes 15% (₹9,000), candidate gets ₹25,000, and you retain ₹26,000 completely hands-free while helping a peer join your company!
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowHostModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingHost}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs"
                  >
                    {isSubmittingHost ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        Verifying &amp; Hosting...
                      </>
                    ) : (
                      "Publish Referral Slot"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: TRACK MY REFERRAL APPLICATIONS */}
      {showTrackerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowTrackerModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-slate-900">Track Referral Requests</h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your email to view your submitted referral requests and their current status in internal ATS pipelines.
            </p>

            <form onSubmit={handleTrackApps} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={trackerEmail}
                onChange={(e) => setTrackerEmail(e.target.value)}
                placeholder="Enter your candidate email..."
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
              <Button type="submit" disabled={isSearchingApps} className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold">
                {isSearchingApps ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
              </Button>
            </form>

            <div className="mt-5 space-y-3 max-h-72 overflow-y-auto">
              {hasSearchedApps && myApplications.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">
                  No referral requests found for this email address.
                </div>
              )}

              {myApplications.map((app) => (
                <div key={app.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{app.companyName}</span>
                    <span className="rounded-full bg-purple-100 text-purple-800 font-mono text-[10px] px-2 py-0.5 font-bold">
                      {app.status}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">{app.roleTitle}</div>
                  <div className="text-[11px] text-slate-500">DevScore: {app.devScore} • Submitted {new Date(app.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
