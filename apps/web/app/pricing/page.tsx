"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Building,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Star,
  Users,
  Briefcase,
  GraduationCap,
  Calendar,
  Gift,
  Flame,
  CheckCircle2,
  Phone,
  X,
  Loader2,
  Heart,
  AlertCircle,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openCashfreeCheckout } from "@/components/cashfree-provider";

type BillingCycle = "monthly" | "quarterly" | "annual";

const PLAN_DETAILS: Record<
  string,
  {
    name: string;
    price: number;
    period: string;
    badge: string;
    badgeColor: string;
    description: string;
    features: string[];
  }
> = {
  pro: {
    name: "Role Nest Pro",
    price: 199,
    period: "30 Days Active Access",
    badge: "Flagship Monthly",
    badgeColor: "bg-emerald-600 text-white",
    description: "Unlimited AI ATS Resume Matcher, Custom Course Engine & Ghosting Tracker",
    features: [
      "Unlimited AI ATS Resume Matcher & gap analysis",
      "AI Accomplishment Bullet Rewriter (Google XYZ format)",
      "Custom 30-Day Job-to-Course AI Generator tailored to any JD",
      "Track up to 25 Active Applications in Kanban pipeline",
      "7-Day Recruiter Inactivity & Ghosting warnings",
      "Verified Pro Badge in public candidate showcase",
    ],
  },
  pro_plus: {
    name: "Role Nest Plus",
    price: 499,
    period: "90 Days Sprint Access (Save 16%)",
    badge: "Most Popular",
    badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950",
    description: "Career Accelerator: Priority recruiter placement & GitHub code audit",
    features: [
      "90-Day Full Hiring Cycle Continuous Access",
      "Top Priority Recruiter Placement in verified showcase",
      "DevScore GitHub Deep Code & Cadence Audit",
      "Unlimited Tracked Applications in pipeline",
      "Early Crawler Job Alerts via Telegram/WhatsApp",
      "Exclusive Plus Gold Badge with Cryptographic Proof",
    ],
  },
  pro_annual: {
    name: "Role Nest Annual Career Pass",
    price: 1499,
    period: "365 Days Access (Save 37%)",
    badge: "Best Long-Term Value",
    badgeColor: "bg-amber-600 text-white",
    description: "Full year continuous access with all Pro & Plus benefits",
    features: [
      "Full 1-Year Continuous Pro & Plus Access (365 Days)",
      "Continuous DevScore Audits & GitHub Tracking",
      "Priority Placement across all Recruiter search feeds",
      "Unlimited AI ATS Scans & Course Generations",
      "Lifetime Proof-of-Work Verification Storage",
    ],
  },
  featured_job: {
    name: "Role Nest Featured Job Listing",
    price: 1499,
    period: "30 Days Active Featured Listing",
    badge: "Employer Boost",
    badgeColor: "bg-amber-500 text-slate-950",
    description: "Pin your job at top of search feed with verified company badge",
    features: [
      "Top-of-feed pinned placement for 30 days",
      "Verified Company Badge on job post",
      "AI Match alerts to top 10% scored candidates",
    ],
  },
  hiring_sprint: {
    name: "Role Nest Hiring Sprint Bundle (3x)",
    price: 3499,
    period: "60 Days Validity",
    badge: "Save 25%",
    badgeColor: "bg-blue-600 text-white",
    description: "3 Featured Jobs Boost + direct candidate messaging",
    features: [
      "3x Featured Job Boosts (valid for 60 days)",
      "Direct Candidate Outreach messaging",
      "Priority Applicant Review Dashboard",
    ],
  },
};

export default function PricingPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("CANDIDATE");
  const [hasCompanyAccount, setHasCompanyAccount] = useState<boolean>(false);
  const [company, setCompany] = useState<any>(null);
  const [adminOverride, setAdminOverride] = useState<"candidate" | "employer" | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(true);

  const [isPro, setIsPro] = useState(false);
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("quarterly");

  // In-Page Checkout Modal state
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [inputPhone, setInputPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      try {
        const [sessionRes, profileRes, companyRes] = await Promise.allSettled([
          fetch("/api/auth/session"),
          fetch("/api/account/profile"),
          fetch("/api/employer/company"),
        ]);

        if (sessionRes.status === "fulfilled") {
          const data = await sessionRes.value.json().catch(() => null);
          if (data?.user) {
            setSessionUser(data.user);
            if (data.user.role) {
              setUserRole(data.user.role);
            }
          }
        }

        if (profileRes.status === "fulfilled") {
          const data = await profileRes.value.json().catch(() => null);
          if (data?.success && data?.profile) {
            setIsPro(Boolean(data.profile.isPro));
            setProExpiresAt(data.profile.proExpiresAt || null);
            if (data.profile.role) {
              setUserRole(data.profile.role);
            }
            if (data.profile.phone) {
              setUserPhone(data.profile.phone);
              setInputPhone(data.profile.phone);
            }
          }
        }

        if (companyRes.status === "fulfilled") {
          const data = await companyRes.value.json().catch(() => null);
          if (data?.company) {
            setHasCompanyAccount(true);
            setCompany(data.company);
            setUserRole("EMPLOYER");
          }
        }
      } catch (err) {
        console.error("Pricing account load error:", err);
      } finally {
        if (isMounted) setIsLoadingAccount(false);
      }
    }

    loadAccountData();
    return () => {
      isMounted = false;
    };
  }, []);

  const initiatePlanCheckout = (planKey: string) => {
    if (!sessionUser) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent("/pricing")}`;
      return;
    }

    setPendingPlan(planKey);
    setPhoneError(null);
    if (userPhone && !inputPhone) {
      setInputPhone(userPhone);
    }
    // Instantly launch in-page modal (0ms latency)
    setIsPhoneModalOpen(true);
  };

  const handleConfirmPhoneAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPhone.replace(/\D/g, "").slice(-10);
    if (clean.length !== 10) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneError(null);
    setIsSubmittingCheckout(true);
    setUserPhone(clean);

    try {
      await openCashfreeCheckout({
        plan: (pendingPlan || "pro") as any,
        phone: clean,
      });
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setPhoneError(err?.message || "Failed to launch gateway. Please try again.");
      setIsSubmittingCheckout(false);
    }
  };

  const handleProCheckout = () => {
    initiatePlanCheckout("pro");
  };

  const handlePlusCheckout = () => {
    initiatePlanCheckout("pro_plus");
  };

  const handleAnnualCheckout = () => {
    initiatePlanCheckout("pro_annual");
  };

  const handleFeaturedCheckout = () => {
    initiatePlanCheckout("featured_job");
  };

  const handleHiringSprintCheckout = () => {
    initiatePlanCheckout("hiring_sprint");
  };

  const isCompanyAccount = hasCompanyAccount || userRole === "EMPLOYER";
  const isAdmin =
    sessionUser?.role === "ADMIN" ||
    [
      "admin@rolenest.in",
      "admin@ritualdev.in",
      "divyanshu.dev@gmail.com",
      "divyanshujethi@gmail.com",
    ].includes(sessionUser?.email?.toLowerCase());

  // Strictly respect account boundary:
  // - If user has a company account -> "employer" view only
  // - If user does NOT have a company account -> "candidate" view only
  // - Admin can optionally toggle view mode to audit both
  const effectiveView: "candidate" | "employer" =
    isAdmin && adminOverride
      ? adminOverride
      : isCompanyAccount
        ? "employer"
        : "candidate";

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* ADMIN VIEW CONTROLLER */}
        {isAdmin && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <span className="font-bold text-amber-950 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span>
                <strong>Admin Mode:</strong> Currently viewing{" "}
                <span className="underline uppercase tracking-wider font-extrabold text-amber-900">
                  {effectiveView === "employer" ? "Company / Employer" : "Candidate & Developer"}
                </span>{" "}
                plans
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAdminOverride("candidate")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  effectiveView === "candidate"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-amber-200"
                }`}
              >
                Candidate View
              </button>
              <button
                type="button"
                onClick={() => setAdminOverride("employer")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  effectiveView === "employer"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-amber-200"
                }`}
              >
                Company View
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE A: CANDIDATES & DEVELOPERS ONLY (Visible only without company account) */}
        {/* ========================================================================= */}
        {effectiveView === "candidate" && (
          <>
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Transparent, Fair Pricing for Developers
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                Accelerate Your Tech Career With Verified Tools
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Direct ATS job discovery is forever free. Accelerate your interview preparation with unlimited AI ATS resume optimization, 30-day interactive study courses, and verified recruiter placement.
              </p>
            </div>

            {/* Section: Candidates */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">For Candidates &amp; Developers</h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                  Direct ATS job discovery is forever free. Accelerate your interview preparation with unlimited AI ATS resume optimization, 30-day interactive study courses, and verified recruiter placement.
                </p>
              </div>

              {/* RitualDev & Role Nest Community Backer Banner */}
              <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50 to-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shrink-0">
                    <Heart className="h-5 w-5 fill-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>An Open Community Initiative by RitualDev &amp; Role Nest</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px] font-mono font-bold">100% Ad-Free</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      <strong>Role Nest</strong> (<a href="https://rolenest.in" className="text-emerald-700 underline font-semibold">rolenest.in</a>) is backed by <strong>RitualDev</strong> (<a href="https://ritualdev.in" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">ritualdev.in</a>) to keep developer jobs free from recruiter paywalls.
                    </p>
                  </div>
                </div>
                <Link
                  href="/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  <span>Custom Donation Page →</span>
                </Link>
              </div>

              {/* Candidate Plan Cards: 3 Clean Pillars (Free, Pro ₹199, Plus ₹499) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Tier 1: Free Community */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Free Community</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Core job discovery &amp; daily coding problems.</p>
                      </div>
                      <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold">
                        Free Forever
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">₹0</span>
                        <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">No credit card or payment required</p>
                    </div>

                    {/* What You Get */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Included Features (100% Real):
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Search 590+ live tech jobs &amp; internships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Direct official ATS apply links (Greenhouse, Lever, Ashby)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Indian Govt Tech Careers Portal (<Link href="/gov-tech" className="text-emerald-700 underline font-semibold">/gov-tech</Link>)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Daily Problem of the Day (POTD) with Monaco runner</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>All 4 Curated 30-Day Study Hubs (<Link href="/study" className="text-emerald-700 underline font-semibold">/study</Link>)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Truth Teller public company ghosting statistics</span>
                        </li>
                      </ul>
                    </div>

                    {/* Explicit Limitations */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-slate-400" /> Explicit Free Limitations:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-500">
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span><strong>AI Quota:</strong> 3 generations total (ATS resume scans / JD drafts)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span><strong>Interview Prep:</strong> 3 mock questions per job</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span><strong>Tracking:</strong> Up to 5 simultaneous active tracked applications</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span><strong>Directory:</strong> Standard unbadged candidate listing</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span><strong>Courses:</strong> Curated tracks only (no custom AI-generated syllabi)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Link href="/jobs">
                      <Button variant="outline" className="w-full font-bold text-xs h-10">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Tier 2: Role Nest Pro (₹199 / month) */}
                <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
                  <div className="absolute -top-3 right-5 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Pro Monthly Flagship
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          Role Nest Pro
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">AI ATS scoring, custom course engine &amp; ghosting tracker.</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">₹199</span>
                        <span className="text-xs text-slate-500 font-semibold">/ month</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium mt-1">₹6.6 / day • 30 days active access</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Pro Features (100% Real):
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Unlimited AI ATS Resume Matcher</strong> with job-specific gap analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>AI Accomplishment Bullet Rewriter</strong> in Google XYZ format</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Custom 30-Day Job-to-Course AI Generator</strong> tailored to any job description</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Track up to 25 Active Applications</strong> in Kanban pipeline</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>7-Day Recruiter Inactivity &amp; Ghosting Warnings</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Verified Pro Badge</strong> in public candidate showcase</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-slate-400" /> Pro Plan Boundaries:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-500">
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Duration:</strong> 30 days access per renewal</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Placement:</strong> Standard verified queue (Priority placement is in Plus)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>DevScore:</strong> Automated summary (Deep GitHub code audit is in Plus)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button
                      onClick={handleProCheckout}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 shadow-md"
                    >
                      Get Pro Access — ₹199
                    </Button>
                  </div>
                </div>

                {/* Tier 3: Role Nest Plus (₹499 / 3 months) */}
                <div className="relative rounded-3xl border-2 border-amber-400 bg-linear-to-b from-amber-50/40 via-white to-white p-6 shadow-xl flex flex-col justify-between ring-1 ring-amber-400/30">
                  <div className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-sm flex items-center gap-1">
                    <Flame className="h-3 w-3 fill-slate-950" /> Most Popular • Save 16%
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          Role Nest Plus
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Career Accelerator: Priority placement &amp; deep audits.</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">₹499</span>
                        <span className="text-xs text-slate-500 font-semibold">/ 3-month sprint</span>
                      </div>
                      <p className="text-[11px] text-amber-800 font-medium mt-1">₹166 / month • 90 days total access • Save 16%</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" /> Everything in Pro PLUS:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>90-Day Uninterrupted Access</strong> (Full interview hiring cycle)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Top Priority Recruiter Placement</strong> in verified talent showcase</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>DevScore GitHub Deep Audit</strong> (Commit cadence, complexity, clean code score)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Unlimited Tracked Applications</strong> in candidate Kanban pipeline</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Early Crawler Job Alerts</strong> via Telegram/WhatsApp webhook notifications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Exclusive Plus Badge</strong> with cryptographic proof verification</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-slate-400" /> Plus Plan Terms:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-500">
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Duration:</strong> 90 full days of continuous access</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Cost:</strong> Billed as single upfront payment of ₹499 via UPI/Card</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Refunds:</strong> Unconditional 14-day money-back guarantee</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button
                      onClick={handlePlusCheckout}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs h-10 shadow-md"
                    >
                      Get Plus Access — ₹499
                    </Button>
                  </div>
                </div>
              </div>

              {/* Annual Plan Strip */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-black shrink-0">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">Role Nest Annual Career Pass</h4>
                      <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                        Save 37% • Best Long-Term Value
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      Prepare with continuous year-round access for <strong>₹1,499 / year</strong> (just <strong>₹125 / month</strong>). Includes full Plus benefits, DevScore GitHub audits, priority recruiter placement, and unlimited AI ATS features for 365 days.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAnnualCheckout}
                  variant="outline"
                  className="whitespace-nowrap font-bold text-xs h-11 border-amber-300 text-amber-950 hover:bg-amber-50 px-6 shrink-0"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                  Activate Annual Pass — ₹1,499
                </Button>
              </div>
            </div>

            {/* Candidate Feature & Limitations Comparison Matrix */}
            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900">Transparent Feature &amp; Limitations Comparison</h3>
                <p className="text-xs text-slate-500">Every feature is backed by real code in Role Nest. Zero synthetic claims, zero hidden restrictions.</p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75">
                      <th className="p-4 font-bold text-slate-900">Features &amp; Limitations</th>
                      <th className="p-4 font-bold text-slate-900 text-center">Free Community</th>
                      <th className="p-4 font-bold text-emerald-700 text-center bg-emerald-50/50">Role Nest Pro</th>
                      <th className="p-4 font-bold text-amber-800 text-center bg-amber-50/50">Role Nest Plus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        Core Job Discovery &amp; Practice
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">590+ Live Verified Tech Jobs (ATS Crawled)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Direct Official ATS Links (Greenhouse, Lever, Ashby)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ 100% Direct</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ 100% Direct</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ 100% Direct</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Indian Govt Tech Careers Portal (/gov-tech)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Daily Problem of the Day (Monaco Editor Runner)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">30-Day Curated Interactive Study Hubs (/study)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ 4 Pre-set Tracks</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ 4 Pre-set Tracks</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ 4 Pre-set Tracks</td>
                    </tr>

                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        AI Career Suite &amp; Course Synthesizer
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">AI ATS Resume Matcher &amp; Keyword Gap Analysis</td>
                      <td className="p-4 text-center text-slate-500">3 scans trial limit</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Unlimited</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Gap-to-Offer Bullets (Google XYZ Format)</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Unlimited</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Custom 30-Day Job-to-Course AI Synthesizer</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Unlimited</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">AI Mock Interview Questions per Job</td>
                      <td className="p-4 text-center text-slate-500">3 questions</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Full Suite</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">Full Suite</td>
                    </tr>

                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        Application Tracking &amp; Recruiter Visibility
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Simultaneously Tracked Applications Limit</td>
                      <td className="p-4 text-center text-slate-500">Max 5 jobs</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Max 25 jobs</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">7-Day Employer Inactivity &amp; Ghosting Alerts</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Active</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ Active</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Candidate Directory Badge</td>
                      <td className="p-4 text-center text-slate-400">Standard (None)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Verified Pro Badge</td>
                      <td className="p-4 text-center text-amber-700 font-bold bg-amber-50/20">Verified Plus Badge</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Recruiter Search Placement</td>
                      <td className="p-4 text-center text-slate-400">Standard Queue</td>
                      <td className="p-4 text-center text-slate-700 font-medium bg-emerald-50/30">Verified Queue</td>
                      <td className="p-4 text-center text-amber-700 font-bold bg-amber-50/20">Top Priority Placement</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">DevScore GitHub Repository Deep Audit</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-600 font-medium bg-emerald-50/30">Basic Score</td>
                      <td className="p-4 text-center text-amber-700 font-bold bg-amber-50/20">Full Deep Audit</td>
                    </tr>

                    <tr className="bg-slate-50/50">
                      <td colSpan={4} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        Pricing &amp; Duration
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Price</td>
                      <td className="p-4 text-center font-black text-slate-900">₹0</td>
                      <td className="p-4 text-center font-black text-emerald-700 bg-emerald-50/30">₹199 / month</td>
                      <td className="p-4 text-center font-black text-amber-800 bg-amber-50/20">₹499 / 3 months</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Equivalent Monthly Cost</td>
                      <td className="p-4 text-center font-mono">₹0/mo</td>
                      <td className="p-4 text-center font-mono bg-emerald-50/30">₹199/mo</td>
                      <td className="p-4 text-center font-mono text-emerald-700 font-bold bg-amber-50/20">₹166/mo (Save 16%)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Access Duration</td>
                      <td className="p-4 text-center font-mono">Lifetime</td>
                      <td className="p-4 text-center font-mono bg-emerald-50/30">30 Days</td>
                      <td className="p-4 text-center font-mono bg-amber-50/20">90 Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Candidate FAQ Section */}
            <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-slate-200">
              <h2 className="text-2xl font-black text-center text-slate-900">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600">
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">What is the difference between Free, Pro (₹199), and Plus (₹499)?</h4>
                  <p>Free provides unlimited search across 590+ tech jobs, direct ATS links, Govt tech jobs, and POTD coding challenges with 3 free AI trials. Pro (₹199/mo) unlocks unlimited AI ATS resume matching, accomplishment bullets, and custom course generation. Plus (₹499/3 mos) gives full 90-day access (₹166/mo), priority recruiter placement, and DevScore GitHub deep audits.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Are the job listings and platform features 100% real?</h4>
                  <p>Yes. Every job listing is crawled directly from authentic company ATS portals (Greenhouse, Lever, Ashby). We do not host fake companies, phantom jobs, or synthetic metrics. Every single feature advertised is backed by real, functional code in Role Nest.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">What payment methods are supported in India?</h4>
                  <p>Via Cashfree Payments, we support all Indian UPI apps (Google Pay, PhonePe, Paytm, CRED, BHIM), Indian RuPay &amp; Visa/Mastercard debit and credit cards, and NetBanking across 50+ Indian banks.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Can I upgrade from Pro to Plus or Annual?</h4>
                  <p>Yes. Upgrading or extending simply adds days to your active account. For example, upgrading to Plus adds 90 days on top of any remaining time on your account without any lost days or penalty.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Why are there limitations on the Free plan?</h4>
                  <p>Direct ATS job browsing, POTD coding challenges, and study courses are 100% free forever. AI ATS resume scans and custom curriculum generation require high-performance LLM compute and token costs, which are covered by the ₹199 and ₹499 plans.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">How does the 14-day refund guarantee work?</h4>
                  <p>Every first-time subscriber is covered by our unconditional 14-Day Money-Back Guarantee. If you are not satisfied for any reason, email support@rolenest.in within 14 days for a 100% full refund directly to your original payment method.</p>
                </div>
              </div>
            </div>

            {/* Bottom Employer Switch Prompt for Recruiters */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Are you hiring engineers or running a startup?</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Company accounts get access to verified candidate sourcing, featured job boosts, and DevScore audits.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <Link href="/employer/login">
                  <Button variant="outline" className="text-xs font-bold h-9">
                    Company Sign In
                  </Button>
                </Link>
                <Link href="/onboarding/employer">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold h-9">
                    Register Company →
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* MODE B: HIRE VERIFIED DEVELOPERS FAST (Visible ONLY with company account)   */}
        {/* ========================================================================= */}
        {effectiveView === "employer" && (
          <>
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-800">
                <Building className="h-3.5 w-3.5 text-blue-600" /> Company Account • Verified Tech Hiring
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                Hire Verified Developers Fast
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Skip fake agency resumes. Receive applications from candidates with verified GitHub scores, active coding streaks, and direct skill audits.
              </p>
            </div>

            {/* Active Company Account Banner */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shrink-0">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-blue-950 flex items-center gap-2">
                    <span>Company Account: <strong>{company?.name || sessionUser?.name || "Verified Tech Employer"}</strong></span>
                    <span className="rounded bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[10px] font-mono font-bold">Verified Org</span>
                  </div>
                  <p className="text-blue-800 text-[11px] mt-0.5">
                    Manage job postings, review verified candidate applications, and sponsor priority featured listings.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/employer/jobs/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 shadow-xs">
                    Post a Job →
                  </Button>
                </Link>
                <Link href="/employer/applicants">
                  <Button variant="outline" className="border-blue-200 text-blue-900 hover:bg-blue-100/50 font-bold text-xs h-9">
                    View Applicants
                  </Button>
                </Link>
              </div>
            </div>

            {/* Employer Pricing Cards: 4 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Employer Variant 1: Direct Job Listing */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Community Post</h3>
                    <p className="text-xs text-slate-500 mt-1">Standard listing with transparent metrics.</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">Free</span>
                    <span className="text-xs text-slate-500 font-semibold">/ open community</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Listed in searchable database &amp; RSS feed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Direct candidate applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Candidate Dev Score &amp; GitHub proofs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Basic applicant tracking dashboard</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6">
                  <Link href="/employer/jobs/new">
                    <Button variant="outline" className="w-full font-bold text-xs h-10">
                      Post a Free Job
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Employer Variant 2: Single Featured Boost */}
              <div className="relative rounded-3xl border-2 border-amber-400 bg-white p-6 shadow-xl flex flex-col justify-between ring-1 ring-amber-400/20">
                <div className="absolute -top-3 right-5 rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-sm flex items-center gap-1">
                  <Flame className="h-3 w-3" /> 5x Reach
                </div>
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Featured Job</h3>
                    <p className="text-xs text-slate-500 mt-1">30 days of top-of-search placement.</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹1,499</span>
                      <span className="text-xs text-slate-500 font-semibold">/ 30 days</span>
                    </div>
                    <p className="text-[11px] text-amber-700 font-medium mt-1">One-time payment • No recurring fee</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Pinned to Top of Search</strong> on home &amp; category pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Gold &apos;Featured&apos; Badge</strong> across platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>AI Candidate Matching Alert</strong> to top 10% scored candidates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Featured in Tech Feed</strong> and priority candidate recommendations</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6">
                  <Button
                    onClick={handleFeaturedCheckout}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-10 shadow-sm"
                  >
                    Post Featured Job — ₹1,499
                  </Button>
                </div>
              </div>

              {/* Employer Variant 3: Hiring Sprint Bundle */}
              <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Hiring Sprint (3x)</h3>
                      <p className="text-xs text-slate-500 mt-1">For growing teams hiring 2–5 engineers.</p>
                    </div>
                    <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[9px] font-bold">
                      Save 25%
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹3,499</span>
                      <span className="text-xs text-slate-500 font-semibold">/ bundle</span>
                    </div>
                    <p className="text-[11px] text-blue-700 font-medium mt-1">₹1,166 per featured job • 60-day validity</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>3x Featured Job Boosts</strong> (publish together or over 60 days)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Direct Candidate Outreach</strong> (message top applicants)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Priority Applicant Review Dashboard</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Company Spotlight Page</strong> with social links</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6">
                  <Button
                    onClick={handleHiringSprintCheckout}
                    variant="outline"
                    className="w-full font-bold text-xs h-10 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Buy 3-Job Sprint — ₹3,499
                  </Button>
                </div>
              </div>

              {/* Employer Variant 4: Enterprise Recruiter Unlimited */}
              <div className="rounded-3xl border border-slate-300 bg-linear-to-b from-slate-50/50 to-white p-6 shadow-sm flex flex-col justify-between hover:border-slate-400 transition-all">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Enterprise Recruiter</h3>
                      <p className="text-xs text-slate-500 mt-1">Unlimited hiring for high-growth tech firms.</p>
                    </div>
                    <span className="rounded-full bg-slate-200 text-slate-800 px-2 py-0.5 text-[9px] font-bold">
                      Custom
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹9,999</span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Billed annually or monthly</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-slate-800 shrink-0 mt-0.5" />
                      <span><strong>Unlimited Featured Job Listings</strong> all year round</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-slate-800 shrink-0 mt-0.5" />
                      <span><strong>Direct Candidate Resume Vault Access</strong> with semantic search</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-slate-800 shrink-0 mt-0.5" />
                      <span><strong>ATS Webhooks &amp; Greenhouse/Lever Sync</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-slate-800 shrink-0 mt-0.5" />
                      <span><strong>Dedicated Technical Account Manager</strong> &amp; campus drive portal</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6">
                  <Link href="/employer/jobs/new">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10">
                      Contact Enterprise Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Employer Comparison Matrix */}
            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900">Employer Plan Comparison</h3>
                <p className="text-xs text-slate-500">Transparent pricing for scaling your engineering organization.</p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75">
                      <th className="p-4 font-bold text-slate-900">Feature</th>
                      <th className="p-4 font-bold text-slate-900 text-center">Community Post</th>
                      <th className="p-4 font-bold text-amber-800 text-center bg-amber-50/50">Featured Job (₹1,499)</th>
                      <th className="p-4 font-bold text-blue-800 text-center bg-blue-50/50">Hiring Sprint (₹3,499)</th>
                      <th className="p-4 font-bold text-slate-900 text-center">Enterprise (₹9,999)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-4 font-medium">Job Postings Limit</td>
                      <td className="p-4 text-center">1 Standard</td>
                      <td className="p-4 text-center font-bold text-amber-800 bg-amber-50/20">1 Featured Boost</td>
                      <td className="p-4 text-center font-bold text-blue-800 bg-blue-50/20">3 Featured Boosts</td>
                      <td className="p-4 text-center font-bold">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Top of Search Boost</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">30 Days</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-blue-50/20">60 Days (3 Jobs)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">Continuous</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Verified DevScore Proofs</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-blue-50/20">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">AI Candidate Matching Alerts</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-amber-50/20">Top 10% Scored</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-blue-50/20">Top 10% Scored</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">All Matching Devs</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">ATS Webhook Sync</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-500 bg-amber-50/20">CSV Export</td>
                      <td className="p-4 text-center text-slate-500 bg-blue-50/20">CSV Export</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">Full ATS Webhook Sync</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Employer FAQ Section */}
            <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-slate-200">
              <h2 className="text-2xl font-black text-center text-slate-900">Employer Hiring FAQ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600">
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">How fast does a Featured Job activate?</h4>
                  <p>Instantly. Once your payment is verified via Cashfree, your job is automatically pinned to the top of the search feed and highlighted with the Gold Featured badge across the platform.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">What makes RoleNest developers different?</h4>
                  <p>RoleNest developers come with verified GitHub DevScores, verified LeetCode/POTD coding streaks, and genuine skill assessments. You receive zero AI resume spam.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Can we post jobs for free?</h4>
                  <p>Yes. The Community Post tier is 100% free for verified company accounts. You can post real engineering roles and receive applications with complete DevScore data.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Can we edit or close a listing early?</h4>
                  <p>Yes, at any time from your Employer Dashboard. You can update requirements, add hiring stages, or mark a role filled.</p>
                </div>
              </div>
            </div>

            {/* Bottom Candidate Switch Prompt */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-600">
              Are you an individual developer or student?{" "}
              <Link href="/login?callbackUrl=/pricing" className="text-emerald-700 underline font-semibold">
                Sign in with a Candidate account to view personal career plans
              </Link>
            </div>
          </>
        )}

        {/* CASHFREE SECURE PAYMENTS DISCLOSURE (Universal footer) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-5 text-center space-y-2 text-xs text-emerald-900">
          <p className="font-medium">
            Payments are securely processed by <strong>Cashfree Payments India Pvt. Ltd.</strong> (RBI Authorized Payment Aggregator &amp; PCI-DSS Level 1 Certified). Instant UPI, Cards &amp; NetBanking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-emerald-700 pt-2 border-t border-emerald-200/60">
            <Link href="/terms" className="hover:underline font-semibold">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline font-semibold">Privacy Policy</Link>
            <span>•</span>
            <Link href="/refund" className="hover:underline font-semibold">Refund Policy</Link>
            <span>•</span>
            <Link href="/cancellation" className="hover:underline font-semibold">Cancellation Policy</Link>
            <span>•</span>
            <a href="mailto:support@rolenest.in" className="hover:underline font-semibold">support@rolenest.in</a>
          </div>
        </div>
      </div>

      {/* PHONE NUMBER CONFIRMATION MODAL */}
      {/* SEAMLESS IN-PAGE CHECKOUT MODAL */}
      {isPhoneModalOpen && (() => {
        const currentPlan = PLAN_DETAILS[pendingPlan || "pro"] || PLAN_DETAILS.pro;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 overflow-hidden">
              {/* TOP BRAND ACCENT BAR */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

              {/* MODAL HEADER */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        Verified RoleNest Checkout
                      </span>
                      {currentPlan.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${currentPlan.badgeColor}`}>
                          {currentPlan.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      {currentPlan.name}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmittingCheckout) {
                      setIsPhoneModalOpen(false);
                      setPhoneError(null);
                    }
                  }}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* PLAN SUMMARY BOX */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
                <div className="flex items-baseline justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{currentPlan.price}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {currentPlan.period} • Inclusive of all taxes • One-time non-recurring
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 uppercase tracking-wider">
                    Instant Activation
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    What's included in this plan:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentPlan.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[12px] leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleConfirmPhoneAndPay} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Indian Mobile Number (for UPI &amp; Invoice)</span>
                    <span className="text-[10px] text-slate-400 font-normal">10 Digits</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 select-none h-11">
                      +91
                    </div>
                    <Input
                      type="tel"
                      required
                      autoFocus
                      disabled={isSubmittingCheckout}
                      value={inputPhone}
                      onChange={(e) => {
                        setInputPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setPhoneError(null);
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      className="h-11 text-base font-mono tracking-wider flex-1 rounded-xl border-slate-300 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Used to link UPI apps (Google Pay, PhonePe, Paytm, BHIM) and deliver your verified receipt via SMS.
                  </p>
                  {phoneError && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                </div>

                {/* TRUST & SECURITY BADGES */}
                <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-2.5 flex items-center justify-between gap-3 text-[11px] text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>UPI, Cards (RuPay/Visa/Master), NetBanking</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                    256-Bit SSL
                  </span>
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmittingCheckout}
                    onClick={() => {
                      setIsPhoneModalOpen(false);
                      setPhoneError(null);
                    }}
                    className="w-1/3 text-xs h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingCheckout || inputPhone.replace(/\D/g, "").length !== 10}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 rounded-xl shadow-md gap-1.5 transition-all"
                  >
                    {isSubmittingCheckout ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Launching Gateway...
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{currentPlan.price} via UPI / Card</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[10px] text-center text-slate-400">
                  Processed securely by RBI Authorized Cashfree Payments India Pvt. Ltd.
                </p>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
