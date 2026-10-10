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
  FileCheck,
  FileText,
  Video,
  Layers,
  Code2,
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
  student: {
    name: "Campus & Student Pass",
    price: 99,
    period: "30 Days Student Access (or ₹249 for 6 Mos)",
    badge: "Student Special",
    badgeColor: "bg-indigo-600 text-white",
    description: "Budget-friendly pass for college students & freshers with verified college ID",
    features: [
      "25 AI ATS Resume Tailorings & Google XYZ STAR Rewrites / mo",
      "Interview Prep Question Generator customized to any JD",
      "Track up to 15 Active Applications in Kanban pipeline with 7-day nudges",
      "Verified Student Developer Badge on profile & leaderboard",
      "Full POTD Monaco Editor Solutions & Testcase Hints",
    ],
  },
  pro: {
    name: "RoleNest Pro",
    price: 199,
    period: "30 Days Active Access",
    badge: "Flagship Monthly",
    badgeColor: "bg-emerald-600 text-white",
    description: "Generous AI ATS Resume Matcher, Cover Letter Generator & Ghosting Shield",
    features: [
      "75 AI ATS Resume Tailorings & Keyword Gap Analyses / mo",
      "Custom Cover Letter & Google XYZ STAR Bullet Writer",
      "Interview Prep Question Generator customized to any JD",
      "Track up to 50 Active Applications with automated 7-day follow-up alerts",
      "DevScore GitHub Analytics & proof-of-work code audits",
      "Verified Pro Candidate Badge in recruiter search feeds",
    ],
  },
  all_access_bundle: {
    name: "RoleNest All-Access Super Pass",
    price: 299,
    period: "30 Days Ecosystem Access (or ₹1,999 / year)",
    badge: "Ultimate 3-in-1 Pass",
    badgeColor: "bg-purple-600 text-white font-bold",
    description: "Complete access across RoleNest + ProblemNest + StudyNest in one single pass",
    features: [
      "RoleNest Pro: 75 AI Resume Tailorings, Cover Letters & Ghosting Shield",
      "Interview Prep Question Generator for any tech job opening",
      "ProblemNest CodePass: Complete POTD Editorial Solutions & Testcase Hints",
      "StudyNest Scholar: All 30-Day Job-to-Course Curricula & Verified Certificates",
      "Priority Telegram / WhatsApp Instant Job Match Pings",
    ],
  },
  pro_annual: {
    name: "RoleNest Annual Career Pass",
    price: 1499,
    period: "365 Days Access (Save 37% • ₹125/mo)",
    badge: "Best Long-Term Value",
    badgeColor: "bg-amber-600 text-white",
    description: "Full year continuous access with all RoleNest Pro features",
    features: [
      "Full 1-Year Continuous Pro Access (365 Days)",
      "300 AI ATS Tailorings, STAR Bullets & Cover Letters",
      "Track up to 150 Active Applications with 7-Day Ghosting Shield",
      "Priority Telegram / WhatsApp Instant Job Alert Pings",
      "Continuous DevScore Audits & GitHub Code Tracking",
    ],
  },
  featured_job: {
    name: "RoleNest Featured Job Listing",
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
    name: "RoleNest Hiring Sprint Bundle (3x)",
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
  const [activeAudience, setActiveAudience] = useState<"candidate" | "employer">("candidate");
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
  const [liveJobsCount, setLiveJobsCount] = useState<number>(20686);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      try {
        const [sessionRes, profileRes, companyRes, statsRes] = await Promise.allSettled([
          fetch("/api/auth/session"),
          fetch("/api/account/profile"),
          fetch("/api/employer/company"),
          fetch("/api/stats/public"),
        ]);

        if (statsRes.status === "fulfilled") {
          const statsData = await statsRes.value.json().catch(() => null);
          if (statsData?.activeJobs) {
            setLiveJobsCount(statsData.activeJobs);
          }
        }

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
            setActiveAudience("employer");
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

  const handleStudentCheckout = () => {
    initiatePlanCheckout("student");
  };

  const handleProCheckout = () => {
    initiatePlanCheckout("pro");
  };

  const handleAnnualCheckout = () => {
    initiatePlanCheckout("pro_annual");
  };

  const handleAllAccessCheckout = () => {
    initiatePlanCheckout("all_access_bundle");
  };

  const handleFeaturedCheckout = () => {
    initiatePlanCheckout("featured_job");
  };

  const handleHiringSprintCheckout = () => {
    initiatePlanCheckout("hiring_sprint");
  };

  const isCompanyAccount = hasCompanyAccount || userRole === "EMPLOYER";
  const isAdmin = Boolean((sessionUser as any)?.isAdmin || sessionUser?.role === "ADMIN");

  // Allow users to toggle between Candidate and Employer views (defaulting according to account type)
  const effectiveView: "candidate" | "employer" =
    adminOverride || activeAudience;

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* PUBLIC AUDIENCE SELECTOR (Candidates & 3-in-1 Bundle vs Employers) */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/80 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveAudience("candidate");
                setAdminOverride(null);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                effectiveView === "candidate"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>For Developers &amp; Candidates</span>
              <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-[10px] font-black uppercase">
                3-in-1 Bundle
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveAudience("employer");
                setAdminOverride(null);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                effectiveView === "employer"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building className="h-4 w-4 text-blue-600" />
              <span>For Employers &amp; Recruiters</span>
            </button>
          </div>
        </div>

        {/* ADMIN VIEW CONTROLLER (If Admin) */}
        {isAdmin && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <span className="font-bold text-amber-950 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span>
                <strong>Admin Mode:</strong> Currently viewing{" "}
                <span className="underline uppercase tracking-wider font-extrabold text-amber-900">
                  {effectiveView === "employer" ? "Company / Employer" : "Candidate & Developer (3-in-1 Bundle)"}
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
                Direct ATS job discovery is forever free. Accelerate your interview preparation with intelligent AI ATS resume optimization, 30-day interactive study courses, and verified employer telemetry.
              </p>
            </div>

            {/* Section: Candidates */}
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">For Candidates &amp; Developers</h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                  Direct ATS job discovery is forever free. Accelerate your interview preparation with intelligent AI ATS resume optimization, 30-day interactive study courses, and verified employer telemetry.
                </p>
              </div>

              {/* RoleNest Community Backer Banner */}
              <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50 to-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shrink-0">
                    <Heart className="h-5 w-5 fill-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>An Open Community Initiative by RitualDev Lab &amp; RoleNest</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px] font-mono font-bold">100% Ad-Free</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      <strong>RoleNest</strong> (<a href="https://rolenest.in" className="text-emerald-700 underline font-semibold">rolenest.in</a>) is backed by <strong>RitualDev Lab</strong> (<a href="https://ritualdev.in" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">ritualdev.in</a>) to keep developer jobs free from recruiter paywalls.
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

              {/* CLEAR FREE VS PAID MESSAGING BANNER */}
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 shadow-xs text-center max-w-3xl mx-auto">
                <p className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>
                    Job search &amp; application links are <strong>100% Free Forever</strong>. Premium AI generation tools require a Pro upgrade.
                  </span>
                </p>
              </div>

              {/* PROMINENT 3-IN-1 MASTER BUNDLE HERO CALLOUT */}
              <div className="rounded-3xl border-2 border-purple-500 bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 p-6 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 ring-2 ring-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white font-black shadow-md shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-lg sm:text-xl text-slate-900">
                        3-in-1 All-Access Master Bundle
                      </span>
                      <span className="rounded-full bg-purple-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                        Save 25%
                      </span>
                      <span className="rounded-full bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 text-[10px] font-bold">
                        ₹299 / month or ₹1,999 / year
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Unlocks the entire ecosystem in one click: <strong>RoleNest Pro</strong> (75 AI ATS tailorings) + <strong>ProblemNest CodePass</strong> (POTD solutions &amp; 70 DSA problems) + <strong>StudyNest Scholar Pass</strong> (all interactive roadmaps &amp; certs).
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAllAccessCheckout}
                  className="whitespace-nowrap rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 w-full lg:w-auto justify-center"
                >
                  <Crown className="h-4 w-4" />
                  <span>Get 3-in-1 Master Bundle — ₹299</span>
                </Button>
              </div>

              {/* Candidate Plan Cards: 3 Tiers (Free, Student ₹99, Pro ₹199) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {/* TIER 1: FREE FOREVER */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Free Starter</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Core job search, standard resume builder &amp; POTD arena.</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold shrink-0 whitespace-nowrap">
                        Free Forever
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="text-3xl font-black text-slate-900">₹0</span>
                        <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">Zero paywalls on searching or applying to jobs</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> What&apos;s Included (100% Free):
                      </div>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Full access to {liveJobsCount.toLocaleString()}+ verified tech jobs &amp; internships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Direct official ATS apply links (Greenhouse, Lever, Ashby)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Application Tracker (up to 5 active tracked applications)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Standard Single-Column ATS Resume Builder (LaTeX &amp; PDF)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>5 AI ATS resume scans &amp; match analyses (2x free trial quota)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Daily Problem of the Day (POTD) Monaco coding challenges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Indian Govt Tech Careers Portal (<Link href="/gov-tech" className="text-emerald-700 underline font-semibold">/gov-tech</Link>)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Link href="/jobs">
                      <Button variant="outline" className="w-full font-bold text-xs h-10 border-slate-300">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* TIER 2: CAMPUS STUDENT PASS (₹99 / month) */}
                <div className="relative rounded-3xl border border-indigo-300 bg-white p-6 shadow-md flex flex-col justify-between hover:border-indigo-400 transition-all">
                  <div className="absolute -top-3 right-5 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> Student Verified
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          Campus Student Pass
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Budget accelerator for enrolled students &amp; freshers.</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="text-3xl font-black text-slate-900">₹99</span>
                        <span className="text-xs text-slate-500 font-semibold">/ month</span>
                      </div>
                      <p className="text-[11px] text-indigo-700 font-medium mt-1">₹3.3 / day • Verified via .edu or college student ID</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Student Perks:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>25 AI Resume Tailorings</strong> &amp; Google XYZ STAR bullet improver / mo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>Interview Prep Question Generator</strong> (<Link href="/interview-prep" className="text-indigo-700 underline font-semibold">/interview-prep</Link>)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>Track up to 15 Active Applications</strong> in pipeline with 7-day follow-up nudges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>Verified Student Developer Badge</strong> on public profile &amp; leaderboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>Monaco POTD Complete Solutions</strong>, edge cases &amp; test-case hints</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-tight">
                      <strong>Verification Note:</strong> Open to any student with a valid university email address (.edu, .ac.in) or verified college enrollment. All student verification records are stored privately under the DPDP Act 2023.
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button
                      onClick={handleStudentCheckout}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 shadow-md"
                    >
                      Get Student Pass — ₹99
                    </Button>
                  </div>
                </div>

                {/* TIER 3: PRO MEMBER (MONTHLY ₹199 OR ANNUAL ₹1,499) */}
                <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
                  <div className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Most Popular • Career Edge
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          RoleNest Pro
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">The complete AI &amp; job tracking unfair advantage.</p>
                      </div>
                    </div>

                    {/* Dual Pricing Display */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <div className="flex items-baseline gap-1 whitespace-nowrap">
                          <span className="text-3xl font-black text-slate-900">₹199</span>
                          <span className="text-xs text-slate-500 font-semibold">/ month</span>
                        </div>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          <Sparkles className="h-3 w-3 text-emerald-600" />
                          or ₹1,499 / year (Save 37%)
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium">Billed monthly at ₹199 or annual pass at ₹125/mo</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Full Pro Suite:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>75 AI Resume Tailorings</strong> &amp; job gap analyses / month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Custom Cover Letter &amp; STAR Bullet Writer</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Interview Prep Question Generator</strong> (<Link href="/interview-prep" className="text-emerald-700 underline font-semibold">/interview-prep</Link>)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Priority Telegram &amp; WhatsApp Alert Pings</strong> for instant new matches</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Track up to 50 Active Applications</strong> with automated 7-day follow-up alerts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>DevScore GitHub Analytics</strong> &amp; proof-of-work code audits</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Verified Pro Candidate Badge</strong> in recruiter search feeds</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 space-y-2">
                    <Button
                      onClick={handleProCheckout}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Get Pro Monthly — ₹199/mo
                    </Button>
                    <Button
                      onClick={handleAnnualCheckout}
                      variant="outline"
                      className="w-full border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-950 font-bold text-xs h-9 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      Activate Annual Pass — ₹1,499/yr (Save 37%)
                    </Button>
                  </div>
                </div>
              </div>

              {/* SECTION: ECOSYSTEM STANDALONE PASSES & ALL-ACCESS MASTER BUNDLE */}
              <div className="pt-8 space-y-6">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-[11px] font-bold text-purple-900">
                    <Layers className="h-3.5 w-3.5 text-purple-600" /> Specialized Products &amp; Ecosystem Passes
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Choose Only What You Need Or Bundle Everything</h3>
                  <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                    RoleNest, ProblemNest, and StudyNest are distinct, focused platforms. Purchase individual passes standalone, or unlock the entire ecosystem with the 3-in-1 Super Pass.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* APP 1: PROBLEM NEST CODEPASS */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                            <Code2 className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">ProblemNest CodePass</h4>
                            <span className="text-[10px] text-slate-400 font-mono">problem.rolenest.in</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-orange-50 text-orange-700 px-2.5 py-0.5 text-[10px] font-bold font-mono shrink-0 whitespace-nowrap">
                          ₹99 / mo
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dedicated algorithmic DSA coding arena pass. Complete test-case hints, full editorial breakdowns, and in-browser Monaco runner.
                      </p>

                      <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span>Full POTD Editorial Solutions &amp; Big-O proofs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span>Multi-language code runner (Python, C++, Java, JS)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span>70 curated DSA problems catalog with company tags</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <a
                        href="https://problem.rolenest.in/potd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button variant="outline" className="w-full border-orange-300 text-orange-900 hover:bg-orange-50 font-bold text-xs h-10">
                          Visit ProblemNest Arena →
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* APP 2: STUDY NEST SCHOLAR PASS */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <GraduationCap className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">StudyNest Scholar Pass</h4>
                            <span className="text-[10px] text-slate-400 font-mono">study.rolenest.in</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-[10px] font-bold font-mono shrink-0 whitespace-nowrap">
                          ₹99 / mo
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Complete open engineering curricula pass. Core roadmaps remain 100% free with open diplomas; Scholar adds verified digital IDs, AI course synthesis, and capstones.
                      </p>

                      <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span>Cryptographic Verified Digital Credentials &amp; Ledger IDs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span>Personalized 30-Day Job-to-Course AI synthesis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span>Node-based interactive skill tree canvas</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6">
                      <a
                        href="https://study.rolenest.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button variant="outline" className="w-full border-indigo-300 text-indigo-900 hover:bg-indigo-50 font-bold text-xs h-10">
                          Visit StudyNest Academy →
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* 3-IN-1 MASTER BUNDLE: ALL-ACCESS SUPER PASS */}
                  <div className="relative rounded-3xl border-2 border-purple-500 bg-linear-to-b from-purple-50/70 via-white to-white p-6 shadow-xl flex flex-col justify-between ring-2 ring-purple-500/20 hover:border-purple-600 transition-all">
                    <div className="absolute -top-3 right-5 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> 3-in-1 Master Bundle
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            All-Access Super Pass
                          </h3>
                          <p className="text-xs text-purple-700 font-semibold mt-0.5">RoleNest + ProblemNest + StudyNest</p>
                        </div>
                      </div>

                      {/* Dual Pricing Display */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <div className="flex items-baseline gap-1 whitespace-nowrap">
                            <span className="text-3xl font-black text-slate-900">₹299</span>
                            <span className="text-xs text-slate-500 font-semibold">/ month</span>
                          </div>
                          <span className="text-slate-300 hidden sm:inline">•</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            or ₹1,999 / yr
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-700 font-medium">
                          Saves 25% (₹299/mo vs ₹397/mo combined: Pro ₹199 + CodePass ₹99 + Scholar ₹99)
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-purple-100">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" /> Complete 3-in-1 Suite:
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <span><strong>RoleNest Pro Included:</strong> 75 AI ATS tailorings &amp; Ghosting Shield</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <span><strong>ProblemNest CodePass:</strong> Full POTD solutions &amp; 70 curated DSA catalog</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <span><strong>StudyNest Scholar:</strong> All 30-day interactive curricula &amp; certificates</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <span><strong>Telegram / WhatsApp Alerts:</strong> Instant priority match notifications</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <span><strong>Single Unified Billing:</strong> One pass unlocks all 3 subdomains</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button
                        onClick={handleAllAccessCheckout}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Crown className="h-3.5 w-3.5" />
                        Get All-Access Super Pass — ₹299
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Feature & Limitations Comparison Matrix */}
            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900">Transparent Feature &amp; Limitations Comparison</h3>
                <p className="text-xs text-slate-500">Every feature is backed by real code in RoleNest. Zero synthetic claims, zero hidden restrictions.</p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75">
                      <th className="p-4 font-bold text-slate-900">Features &amp; Limitations</th>
                      <th className="p-4 font-bold text-slate-900 text-center">Free Community</th>
                      <th className="p-4 font-bold text-indigo-700 text-center bg-indigo-50/50">Campus Student Pass</th>
                      <th className="p-4 font-bold text-emerald-700 text-center bg-emerald-50/50">RoleNest Pro</th>
                      <th className="p-4 font-bold text-purple-700 text-center bg-purple-50/70 border-l border-purple-200">
                        All-Access Super Pass (3-in-1 Master Bundle)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        Core Job Discovery &amp; Practice
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">{liveJobsCount.toLocaleString()}+ Live Verified Tech Jobs &amp; Internships</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/30">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Included</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Direct Official ATS Links (Greenhouse, Lever, Ashby)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ 100% Direct</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/30">✓ 100% Direct</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ 100% Direct</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ 100% Direct</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Indian Govt Tech Careers Portal (/gov-tech)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/30">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Included</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Standard Single-Column ATS Resume Builder</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included (LaTeX)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/30">✓ Included (LaTeX)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Included (LaTeX)</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Included (LaTeX)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Daily Problem of the Day (Monaco Editor Runner)</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/30">✓ Full Solutions</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Full Solutions</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Full Solutions</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">ProblemNest Full DSA Catalog (70 Curated Problems)</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-400 bg-indigo-50/30">—</td>
                      <td className="p-4 text-center text-slate-400 bg-emerald-50/30">—</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ All 70+ Problems</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">StudyNest Interactive 30-Day Curricula &amp; Certs</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-400 bg-indigo-50/30">—</td>
                      <td className="p-4 text-center text-slate-400 bg-emerald-50/30">—</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Full Access &amp; Certs</td>
                    </tr>

                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        AI Career Suite &amp; Automation
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">AI ATS Resume Matcher &amp; Keyword Gap Analysis</td>
                      <td className="p-4 text-center text-slate-500">5 scans starter quota</td>
                      <td className="p-4 text-center text-indigo-700 font-bold bg-indigo-50/30">25 / month</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">75 / month</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">75 / month</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">STAR Accomplishment Bullet Improver</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-indigo-700 font-bold bg-indigo-50/30">25 / month</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">75 / month</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">75 / month</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Interview Prep Question Generator</td>
                      <td className="p-4 text-center text-slate-500">3 questions</td>
                      <td className="p-4 text-center text-indigo-700 font-bold bg-indigo-50/30">10 / job</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">25 / job</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">25 / job</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Custom Cover Letter Writer</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-400 bg-indigo-50/30">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">75 / month</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">75 / month</td>
                    </tr>

                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        Application Tracking &amp; Recruiter Visibility
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Simultaneously Tracked Applications Limit</td>
                      <td className="p-4 text-center text-slate-500">Max 5 jobs</td>
                      <td className="p-4 text-center text-indigo-700 font-bold bg-indigo-50/30">Max 15 jobs</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Max 50 jobs</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">Max 50 jobs</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">7-Day Follow-Up &amp; Recruiter Inactivity Reminders</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-indigo-700 font-bold bg-indigo-50/30">✓ Active</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Active</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Active</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Telegram / WhatsApp Instant Job Match Pings</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-400 bg-indigo-50/30">—</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓ Instant Pings</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">✓ Instant Pings</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Candidate Directory Badge</td>
                      <td className="p-4 text-center text-slate-400">Standard (None)</td>
                      <td className="p-4 text-center text-indigo-700 font-bold bg-indigo-50/30">Verified Student</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Verified Pro</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">Verified All-Access Pro</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">DevScore GitHub Code Cadence Audit</td>
                      <td className="p-4 text-center text-slate-400">—</td>
                      <td className="p-4 text-center text-slate-600 font-medium bg-indigo-50/30">Basic Score</td>
                      <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Deep Audit</td>
                      <td className="p-4 text-center text-purple-700 font-bold bg-purple-50/40 border-l border-purple-100">Deep Audit</td>
                    </tr>

                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="p-3 font-extrabold uppercase tracking-wider text-[10px] text-slate-500">
                        Pricing &amp; Duration
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Price</td>
                      <td className="p-4 text-center font-black text-slate-900">₹0</td>
                      <td className="p-4 text-center font-black text-indigo-700 bg-indigo-50/30">₹99 / month</td>
                      <td className="p-4 text-center font-black text-emerald-700 bg-emerald-50/30">₹199/mo or ₹1,499/yr</td>
                      <td className="p-4 text-center font-black text-purple-800 bg-purple-50/50 border-l border-purple-100">₹299/mo or ₹1,999/yr</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Access Duration</td>
                      <td className="p-4 text-center font-mono">Forever Free</td>
                      <td className="p-4 text-center font-mono bg-indigo-50/30">30 Days</td>
                      <td className="p-4 text-center font-mono bg-emerald-50/30">30 or 365 Days</td>
                      <td className="p-4 text-center font-mono text-purple-900 bg-purple-50/50 border-l border-purple-100">30 or 365 Days</td>
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
                  <h4 className="font-bold text-slate-900">What is the difference between Free, Campus Pass (₹99), and Pro?</h4>
                  <p>Job searching, application links, standard resume building, and POTD challenges are 100% Free Forever with 5 complimentary AI scans. Campus Pass (₹99/mo for students) unlocks 25 AI resume tailorings/mo, STAR bullet rewrites, and 15 active application slots. Pro (₹199/mo or ₹1,499/yr) unlocks the complete suite including 75 tailorings/mo, custom cover letters, instant Telegram/WhatsApp match alerts, 50 active application slots, and DevScore audits.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">How do I verify for the ₹99 Campus Student Pass?</h4>
                  <p>Sign up with an active university or college email address (e.g., .edu, .ac.in). If your institution does not issue student emails, you may submit proof of enrollment. All student verification records are stored privately with zero third-party sharing in accordance with the Digital Personal Data Protection (DPDP) Act 2023.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">How do RoleNest, ProblemNest, and StudyNest passes work?</h4>
                  <p>Each platform has its own dedicated pass: RoleNest Pro for job hunting &amp; ATS tailoring, ProblemNest CodePass (₹99/mo) for DSA solutions &amp; coding arena, and StudyNest Scholar Pass (₹99/mo) for interactive roadmaps &amp; certifications. You can also choose the All-Access Super Pass (₹299/mo or ₹1,999/yr) to unlock all three platforms simultaneously.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">What payment methods are supported in India?</h4>
                  <p>Via Cashfree Payments, we support all Indian UPI apps (Google Pay, PhonePe, Paytm, CRED, BHIM), Indian RuPay &amp; Visa/Mastercard debit/credit cards, and NetBanking across 50+ Indian banks.</p>
                </div>
                <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900">Why are there limits on the Free plan?</h4>
                  <p>Direct ATS job browsing, application tracking, and study roadmaps are 100% free forever. Generating AI ATS resume tailored bullets, cover letters, and custom syllabi requires LLM compute and token costs, which are covered by the ₹99 student and ₹199 Pro plans.</p>
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

            {/* HIGH-TICKET B2B & CAMPUS MONETIZATION SOLUTIONS */}
            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="text-center space-y-1">
                <span className="rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                  HIGH-YIELD B2B &amp; CAMPUS PLATFORMS
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Enterprise Solutions &amp; Campus Partnerships
                </h3>
                <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                  High-ticket monetization options for fast-growing startups, enterprise hiring blitzes, and engineering college placement cells.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* B2B 1: Direct Placement Bounty */}
                <div className="rounded-3xl border border-indigo-200 bg-linear-to-b from-indigo-50/40 to-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="rounded-full bg-indigo-100 text-indigo-700 px-2.5 py-0.5 text-[9px] font-bold">
                      ₹0 UPFRONT RISK
                    </span>
                    <h4 className="text-lg font-black text-slate-900">Direct Placement Bounty</h4>
                    <div className="text-xl font-black text-indigo-900">
                      Flat ₹35k <span className="text-xs font-normal text-slate-500">/ hire or 8-10% CTC</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Partner with RoleNest to hire pre-screened junior and mid-level engineers with audited GitHub repositories and verified DevScores. Pay only on 30-day candidate retention.
                    </p>
                  </div>
                  <Link href="/placement-portal">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 rounded-xl">
                      Hire Vetted Engineers →
                    </Button>
                  </Link>
                </div>

                {/* B2B 2: Sponsored Challenges */}
                <div className="rounded-3xl border border-amber-200 bg-linear-to-b from-amber-50/40 to-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[9px] font-bold">
                      POTD / HACKATHON ENGINE
                    </span>
                    <h4 className="text-lg font-black text-slate-900">Sponsored Weekend Hackathons</h4>
                    <div className="text-xl font-black text-amber-900">
                      ₹25k - ₹75k <span className="text-xs font-normal text-slate-500">/ contest</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Host custom problems in the ProblemNest arena and review shortlisted student solvers.
                    </p>
                  </div>
                  <Link href="/potd">
                    <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-10 rounded-xl">
                      Sponsor a Hackathon →
                    </Button>
                  </Link>
                </div>

                {/* B2B 3: College Placement SaaS */}
                <div className="rounded-3xl border border-emerald-200 bg-linear-to-b from-emerald-50/40 to-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[9px] font-bold">
                      ANNUAL TPO LICENSE
                    </span>
                    <h4 className="text-lg font-black text-slate-900">College Placement Cell SaaS</h4>
                    <div className="text-xl font-black text-emerald-900">
                      ₹25k - ₹50k <span className="text-xs font-normal text-slate-500">/ year</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Institutional platform for Training &amp; Placement Officers (TPOs) to track student batch readiness, syndicate verified off-campus drives, and coordinate campus visits.
                    </p>
                  </div>
                  <Link href="/placement-portal">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 rounded-xl">
                      Onboard College Placement Cell →
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
