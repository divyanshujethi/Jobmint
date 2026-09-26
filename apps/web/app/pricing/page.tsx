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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  openPaddleCheckout,
  PADDLE_PRO_PRICE_ID,
  PADDLE_FEATURED_JOB_PRICE_ID,
} from "@/components/paddle-provider";

export default function PricingPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Transparent, Fair Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Invest in Your Tech Career &amp; Hiring
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Simple, honest plans for candidates and high-velocity employers. No hidden fees, instant activation, and 1-click cancellation.
          </p>
        </div>

        {/* Section 1: Candidates */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900">For Candidates &amp; Students</h2>
            <p className="text-xs text-slate-500 mt-1">Accelerate your preparation with AI and verified proof-of-work.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Candidate Plan */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Role Nest Free</h3>
                  <p className="text-xs text-slate-500 mt-1">Core job discovery and problem-solving features.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Search all verified jobs &amp; internships</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Daily Problem of the Day (POTD) code runner</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Basic Truth Teller response metrics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Access to curated courses &amp; roadmaps</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/jobs">
                  <Button variant="outline" className="w-full font-bold">
                    Explore Jobs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pro Candidate Plan */}
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
              <div className="absolute -top-3.5 right-6 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                <Crown className="h-3 w-3" /> Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Role Nest Pro
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Full AI power, priority visibility, and direct recruiter contact.</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900">₹499</span>
                    <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">($6.99 USD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">7-Day Money Back Guarantee • Cancel anytime</p>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Unlimited AI Mock Technical Interviews</strong> with instant scores</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>AI Resume &amp; ATS Keyword Optimizer</strong> per job role</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Verified Pro Candidate Badge</strong> on applications</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Direct Recruiter Messaging</strong> to founders &amp; hiring managers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span><strong>Deep Truth Teller Analytics</strong> (ghosting rates &amp; exact timelines)</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 space-y-2">
                {isPro ? (
                  <Button disabled className="w-full bg-emerald-100 text-emerald-800 font-bold">
                    ✓ You Have Role Nest Pro Active
                  </Button>
                ) : (
                  <Button
                    onClick={handleProCheckout}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 shadow-lg shadow-emerald-600/25"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade to Pro — ₹499/mo
                  </Button>
                )}
                <p className="text-[10px] text-center text-slate-400">
                  Secured by Paddle.com (Merchant of Record). All payment cards, UPI & NetBanking accepted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Employers */}
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900">For Employers &amp; Startups</h2>
            <p className="text-xs text-slate-500 mt-1">Hire verified developers and engineers with zero ghosting overhead.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Post */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Direct Job Listing</h3>
                  <p className="text-xs text-slate-500 mt-1">Standard listing with Truth Teller transparency.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">Free</span>
                  <span className="text-xs text-slate-500 font-semibold">/ open community</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Listed in searchable database &amp; feeds</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Direct candidate applications</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Candidate proof-of-work and GitHub score previews</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/employer/jobs/new">
                  <Button variant="outline" className="w-full font-bold">
                    Post a Standard Job
                  </Button>
                </Link>
              </div>
            </div>

            {/* Featured Job Boost */}
            <div className="rounded-3xl border-2 border-amber-400 bg-white p-8 shadow-xl flex flex-col justify-between ring-1 ring-amber-400/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      Featured Job Boost
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">30 days of top-of-search placement &amp; candidate broadcast.</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                    5x Reach
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900">₹1,499</span>
                    <span className="text-xs text-slate-500 font-semibold">/ 30 days</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">($19.00 USD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">One-time payment • No recurring charge</p>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span><strong>Pinned to Top of Search</strong> on home &amp; category pages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span><strong>Eye-catching Gold &apos;Featured&apos; Badge</strong> across platform</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span><strong>Automated AI Candidate Matching &amp; Alert</strong> to qualified candidates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span><strong>Highlighted in Candidate Weekly Newsletter</strong></span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 space-y-2">
                <Link href="/employer/jobs/new">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold h-11 shadow-lg shadow-amber-500/20">
                    Post a Featured Job
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-slate-400">
                  Processed securely via Paddle. Instant invoice receipt provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-black text-center text-slate-900">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900">How does the 7-day refund guarantee work?</h4>
              <p>If you subscribe to Role Nest Pro and are not fully satisfied, email us or cancel within 7 days for a 100% full refund with no questions asked.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900">How does billing and invoicing work?</h4>
              <p>All transactions are processed by our Merchant of Record, Paddle.com. You will immediately receive a digital invoice receipt via email with GST/VAT compliance.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900">Can I cancel my subscription at any time?</h4>
              <p>Yes. You can cancel with 1-click at any time from your settings or directly via the Paddle management link sent in your email receipt.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-900">What payment methods are supported?</h4>
              <p>We support Visa, MasterCard, American Express, UPI (GPay, PhonePe, Paytm), NetBanking, Apple Pay, and Google Pay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
