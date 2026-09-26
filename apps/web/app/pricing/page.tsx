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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  openPaddleCheckout,
  PADDLE_PRO_PRICE_ID,
  PADDLE_FEATURED_JOB_PRICE_ID,
} from "@/components/paddle-provider";

type BillingCycle = "monthly" | "quarterly" | "annual";

export default function PricingPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("quarterly");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setSessionUser(data.user);
        }
      })
      .catch(() => {});

    fetch("/api/user/pro-status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isPro) {
          setIsPro(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleProCheckout = () => {
    openPaddleCheckout({
      priceId: PADDLE_PRO_PRICE_ID,
      userId: sessionUser?.id,
      userEmail: sessionUser?.email,
      plan: "pro",
    });
  };

  const handleFeaturedCheckout = () => {
    openPaddleCheckout({
      priceId: PADDLE_FEATURED_JOB_PRICE_ID,
      userId: sessionUser?.id,
      userEmail: sessionUser?.email,
      plan: "featured_job",
    });
  };

  // Pricing calculations per cycle
  const proPricing = {
    monthly: { price: "₹499", period: "/ month", subtext: "Billed monthly • Cancel anytime", saveTag: null },
    quarterly: { price: "₹1,199", period: "/ 3 months", subtext: "Equivalent to ₹399/mo • Save 20%", saveTag: "Save 20% • Most Popular" },
    annual: { price: "₹3,999", period: "/ year", subtext: "Equivalent to ₹333/mo • Save 33%", saveTag: "Save 33% • Best Value" },
  }[billingCycle];

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Transparent, Fair Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Choose the Perfect Plan for Your Career &amp; Hiring
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Accelerate your tech job search or scale your engineering team with zero recruiter spam. Clear pricing, instant activation, and 100% money-back guarantee.
          </p>
        </div>

        {/* Section 1: Candidates */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900">For Candidates &amp; Developers</h2>
            <p className="text-xs text-slate-500">Master technical interviews, optimize your resume ATS score, and apply directly to verified founders.</p>

            {/* Billing Cycle Switcher */}
            <div className="inline-flex items-center rounded-2xl bg-white p-1.5 border border-slate-200 shadow-sm gap-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("quarterly")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                  billingCycle === "quarterly"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Quarterly Sprint</span>
                <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                  Save 20%
                </span>
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                  billingCycle === "annual"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual Pass</span>
                <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                  Save 33%
                </span>
              </button>
            </div>
          </div>

          {/* Candidate Plan Cards: 4 Variants */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Variant 1: Free Community */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Free Community</h3>
                  <p className="text-xs text-slate-500 mt-1">Core job discovery &amp; daily coding problems.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Search verified developer jobs &amp; internships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Daily Problem of the Day (POTD) code runner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Basic Truth Teller company response stats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Curated roadmaps &amp; free study canvas</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/jobs">
                  <Button variant="outline" className="w-full font-bold text-xs">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* Variant 2: Role Nest Pro (Main AI Flagship) */}
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
              <div className="absolute -top-3 right-5 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                <Crown className="h-3 w-3" /> {proPricing.saveTag || "Most Popular"}
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Role Nest Pro
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Full AI suite, priority ranking, and direct messaging.</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{proPricing.price}</span>
                    <span className="text-xs text-slate-500 font-semibold">{proPricing.period}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">{proPricing.subtext}</p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Unlimited AI Mock Technical Interviews</strong> with instant scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Instant ATS Resume Matcher</strong> with 1-click tailored bullets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Verified Pro Candidate Badge</strong> on recruiter dashboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Recruiter Messaging</strong> to founders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Deep Truth Teller Metrics</strong> (exact ghosting dates)</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 space-y-2">
                {isPro ? (
                  <Button disabled className="w-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    ✓ Role Nest Pro Active
                  </Button>
                ) : (
                  <Button
                    onClick={handleProCheckout}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 shadow-md shadow-emerald-600/25"
                  >
                    <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                    Upgrade to Pro — {proPricing.price}
                  </Button>
                )}
                <p className="text-[10px] text-center text-slate-400">
                  7-Day Money Back Guarantee • Cancel anytime
                </p>
              </div>
            </div>

            {/* Variant 3: Pro + 1-on-1 Mentorship */}
            <div className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pro + Mentorship</h3>
                    <p className="text-xs text-slate-500 mt-1">Live FAANG mentor guidance &amp; personalized reviews.</p>
                  </div>
                  <span className="rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[9px] font-bold">
                    Mentored
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">₹1,999</span>
                    <span className="text-xs text-slate-500 font-semibold">/ month</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 font-medium mt-1">Includes all Pro features</p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Everything in Role Nest Pro</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>1x Monthly 45-min Live Mock Technical Interview</strong> with senior FAANG engineer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Line-by-line Resume Overhaul</strong> by engineering hiring managers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Warm Referrals</strong> to partner startup hiring pools</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  onClick={handleProCheckout}
                  variant="outline"
                  className="w-full font-bold text-xs border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  Join Mentorship Track
                </Button>
              </div>
            </div>

            {/* Variant 4: Lifetime Founder's Pass */}
            <div className="relative rounded-3xl border border-amber-300 bg-linear-to-b from-amber-50/50 to-white p-6 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span>Founder Pass</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Pay once, own Pro forever with no recurring bills.</p>
                  </div>
                  <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[9px] font-bold">
                    One-Time
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">₹7,999</span>
                    <span className="text-xs text-slate-500 font-semibold">/ lifetime</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium mt-1">Limited to first 100 early engineers</p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Lifetime Unlimited Access</strong> to all future AI tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Gold Founder Verified Badge</strong> on profile and applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Infinite AI Credits</strong> for resume ATS scoring and mock interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Private Founder Discord Room</strong> directly with our product team</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button
                  onClick={handleProCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-10 shadow-sm"
                >
                  Claim Lifetime Pass
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Employers */}
        <div className="space-y-8 pt-10 border-t border-slate-200">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-bold text-blue-800">
              <Building className="h-3.5 w-3.5 text-blue-600" /> For Tech Employers &amp; Startups
            </div>
            <h2 className="text-2xl font-black text-slate-900">Hire Verified Developers Fast</h2>
            <p className="text-xs text-slate-500">Skip fake agency resumes. Receive applications from candidates with verified GitHub scores and POTD streaks.</p>
          </div>

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
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/employer/jobs/new">
                  <Button variant="outline" className="w-full font-bold text-xs">
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
                    <span><strong>Featured in Weekly Newsletter</strong> (15,000+ engineers)</span>
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
                  onClick={handleFeaturedCheckout}
                  variant="outline"
                  className="w-full font-bold text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Buy 3-Job Sprint
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
        </div>

        {/* Feature Comparison Table */}
        <div className="space-y-6 pt-10 border-t border-slate-200">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-900">Compare Candidate Plans Side-by-Side</h3>
            <p className="text-xs text-slate-500">Pick the level of AI assistance and visibility that matches your career goal.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="p-4 font-bold text-slate-900">Features</th>
                  <th className="p-4 font-bold text-slate-900 text-center">Free Community</th>
                  <th className="p-4 font-bold text-emerald-700 text-center bg-emerald-50/50">Role Nest Pro</th>
                  <th className="p-4 font-bold text-indigo-700 text-center">Pro + Mentorship</th>
                  <th className="p-4 font-bold text-amber-700 text-center">Founder Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-4 font-medium">Job Search &amp; Internship Board</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Daily Coding Challenge (POTD)</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">AI Mock Technical Interviews</td>
                  <td className="p-4 text-center text-slate-300">2 tries only</td>
                  <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Unlimited</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">Unlimited</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">Lifetime Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Instant ATS Resume-to-Job Matcher</td>
                  <td className="p-4 text-center text-slate-300">Basic score</td>
                  <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Full 1-Click Fix</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">Full 1-Click Fix</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">Full 1-Click Fix</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Verified Profile Badge</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">Pro Badge</td>
                  <td className="p-4 text-center text-indigo-600 font-bold">Mentored Badge</td>
                  <td className="p-4 text-center text-amber-600 font-bold">Gold Founder Badge</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Direct Founder / Recruiter Messaging</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-emerald-600 font-bold bg-emerald-50/30">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Live 1-on-1 Senior Engineer Mock Interview</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-slate-300 bg-emerald-50/30">—</td>
                  <td className="p-4 text-center text-indigo-600 font-bold">1 Session / month</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Billing Period</td>
                  <td className="p-4 text-center font-mono">Free Forever</td>
                  <td className="p-4 text-center font-mono bg-emerald-50/30">{proPricing.price}</td>
                  <td className="p-4 text-center font-mono">₹1,999 / mo</td>
                  <td className="p-4 text-center font-mono">₹7,999 One-Time</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-black text-center text-slate-900">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600">
            <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-slate-900">How does the 7-day refund guarantee work?</h4>
              <p>If you subscribe to Role Nest Pro and feel it hasn&apos;t accelerated your preparation, email us within 7 days for a 100% full refund, no questions asked.</p>
            </div>
            <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-slate-900">What payment methods are supported in India?</h4>
              <p>Via Paddle.com (Merchant of Record), we support UPI (Google Pay, PhonePe, Paytm, BHIM), Indian NetBanking, and all major debit &amp; credit cards (Visa, Mastercard, RuPay, Amex).</p>
            </div>
            <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-slate-900">Can I cancel my subscription at any time?</h4>
              <p>Yes. You can cancel with 1-click at any time from your settings or via the self-service Paddle link in your email receipt. You retain full access until the end of your billing cycle.</p>
            </div>
            <div className="space-y-1.5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-slate-900">What is the difference between Free and Pro AI usage?</h4>
              <p>Free users get 2 try-outs of the AI ATS Matcher and Mock Interviewer. Pro users unlock unlimited mock technical interviews, AI resume bullet tailoring, and direct recruiter contact.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
