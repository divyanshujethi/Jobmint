"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Code2,
  Server,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Loader2,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openCashfreeCheckout } from "@/components/cashfree-provider";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, 2500, 5000];

export default function DonatePage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmountInput, setCustomAmountInput] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorNote, setDonorNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setSessionUser(data.user);
          if (data.user.name) setDonorName(data.user.name);
          if (data.user.email) setDonorEmail(data.user.email);
        }
      })
      .catch(() => {});

    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.profile) {
          if (data.profile.phone) setDonorPhone(data.profile.phone);
          if (data.profile.name && !donorName) setDonorName(data.profile.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmountInput("");
    setError(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmountInput(val);
    const num = Number(val);
    if (num > 0) {
      setSelectedAmount(num);
    }
    setError(null);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalAmount = customAmountInput ? Number(customAmountInput) : selectedAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 10) {
      setError("Please select or enter an amount of at least ₹10.");
      return;
    }

    const cleanPhone = donorPhone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number for Cashfree payment confirmation.");
      return;
    }

    if (!donorEmail || !donorEmail.includes("@")) {
      setError("Please enter a valid email address for your contribution receipt.");
      return;
    }

    setIsSubmitting(true);
    try {
      await openCashfreeCheckout({
        plan: "donation",
        amount: finalAmount,
        donorName: donorName.trim() || "Community Supporter",
        donorEmail: donorEmail.trim().toLowerCase(),
        donorPhone: cleanPhone,
        donorNote: donorNote.trim(),
        onError: (err) => {
          setError(err?.message || "Failed to initialize payment gateway.");
          setIsSubmitting(false);
        },
      });
    } catch (err: any) {
      setError(err?.message || "Failed to launch donation payment.");
      setIsSubmitting(false);
    }
  };

  const activeAmount = customAmountInput ? Number(customAmountInput) : selectedAmount;

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Partnership & Initiative Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-4 py-1 text-xs font-bold text-rose-800 shadow-2xs">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>Open Source Community Contribution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Support Transparent Tech Hiring &amp; Open Developer Tools
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>Role Nest</strong> (<a href="https://rolenest.in" className="text-emerald-700 underline font-semibold">rolenest.in</a>) is an open-access developer ecosystem engineered and maintained by <strong>RitualDev Lab</strong> (<a href="https://ritualdev.in" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5">ritualdev.in <ExternalLink className="h-3 w-3" /></a>). Your contribution keeps tech jobs ad-free, verified, and 100% open for students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Zero Recruiter Paywalls
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <Code2 className="h-4 w-4 text-blue-600" /> Free POTD &amp; ATS Resume Builder
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <Lock className="h-4 w-4 text-purple-600" /> DPDP Compliant • Zero Data Selling
            </span>
          </div>
        </div>

        {/* Main Donation Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Why We Need Your Support & Dual-Org Credibility */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>The RitualDev &amp; Role Nest Mission</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Where Does Your Contribution Go?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike traditional job boards that charge desperate candidates and sell contact lists to spam recruiters, <strong>Role Nest</strong> and <strong>RitualDev</strong> believe finding a verified engineering role must remain transparent, verified, and free.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700 shrink-0 border border-emerald-100">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">High-Performance Cloud Infrastructure</h4>
                    <p className="text-slate-500 mt-0.5 leading-normal">
                      Powers daily high-speed indexing across 50,000+ official career portals so freshers get instant, direct application links with zero ghosting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-700 shrink-0 border border-blue-100">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Free AI Tokens for Students</h4>
                    <p className="text-slate-500 mt-0.5 leading-normal">
                      Subsidizes free AI keyword optimization, Harvard ATS resume formatting, and interactive coding runner sandbox for college graduates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-purple-50 p-2 text-purple-700 shrink-0 border border-purple-100">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Open-Source Engineering by RitualDev Lab</h4>
                    <p className="text-slate-500 mt-0.5 leading-normal">
                      Supports continuous research, fraud recruiter blacklisting, DPDP Act 2023 privacy audits, and free tooling built by RitualDev Technologies.
                    </p>
                  </div>
                </div>
              </div>

              {/* RitualDev & Role Nest Card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Organization Verification</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Official Portals
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <a
                    href="https://rolenest.in"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition-colors block text-slate-700"
                  >
                    <div className="font-bold text-emerald-800">rolenest.in</div>
                    <div className="text-[10px] text-slate-500">Career Portal &amp; ATS</div>
                  </a>
                  <a
                    href="https://ritualdev.in"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition-colors block text-slate-700"
                  >
                    <div className="font-bold text-emerald-800 flex items-center gap-1">
                      <span>ritualdev.in</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </div>
                    <div className="text-[10px] text-slate-500">Engineering Collective</div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Payment Form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border-2 border-emerald-500/80 bg-white p-6 sm:p-8 shadow-xl space-y-6 relative">
              <div className="space-y-1 text-center">
                <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="h-3 w-3" /> Quick &amp; Custom Contribution
                </div>
                <h2 className="text-2xl font-black text-slate-900">Make a Donation</h2>
                <p className="text-xs text-slate-500">Choose a preset or enter any custom amount via Cashfree UPI.</p>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleDonate} className="space-y-5">
                {/* 1. Quick Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Select Preset Contribution</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AMOUNTS.map((amt) => {
                      const isSelected = !customAmountInput && selectedAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSelectPreset(amt)}
                          className={`py-2 px-1 rounded-xl text-xs font-black border transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white shadow-xs scale-102"
                              : "border-slate-200 hover:border-emerald-300 text-slate-700 bg-slate-50/50 hover:bg-white"
                          }`}
                        >
                          ₹{amt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Custom Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Or Enter Custom Amount (₹)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Min ₹10</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-black text-slate-500">
                      ₹
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 350, 750, 1500"
                      value={customAmountInput}
                      onChange={handleCustomAmountChange}
                      className="pl-9 h-11 text-base font-bold border-slate-300 focus-visible:ring-emerald-600 rounded-xl"
                    />
                  </div>
                </div>

                {/* 3. Donor Details */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Donor Details (for Instant UPI Receipt)
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Full Name</label>
                    <Input
                      type="text"
                      required
                      placeholder="Your Name / Anonymous Supporter"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Email Address</label>
                    <Input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Mobile Number <span className="text-slate-400 font-normal">(for Cashfree UPI / SMS)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                        +91
                      </span>
                      <Input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="pl-12 h-10 text-xs rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                      <span>Message for the Engineering Team (Optional)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <Input
                      type="text"
                      maxLength={100}
                      placeholder="e.g. Keep fighting for transparency and freshers!"
                      value={donorNote}
                      onChange={(e) => setDonorNote(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                {/* 4. Instant Submit Button */}
                <div className="pt-2 space-y-2.5">
                  <Button
                    type="submit"
                    disabled={isSubmitting || activeAmount < 10}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Connecting to Cashfree...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 fill-white text-white" />
                        <span>Donate ₹{activeAmount > 0 ? activeAmount : 250} via UPI / Cards</span>
                        <ArrowRight className="h-4 w-4 ml-0.5" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Secured by Cashfree Payments (RBI Authorized). Supports Google Pay, PhonePe, Paytm, RuPay &amp; NetBanking.
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Community Transparency */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-xs">
          <h3 className="text-xl font-black text-slate-900">
            A Thank You from the RitualDev &amp; Role Nest Teams
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every rupee contributed empowers engineering candidates who cannot afford expensive ₹10,000+ placement courses or paid recruiter spam services. We remain accountable to our developer community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/pricing"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              View Role Nest Pro Plans →
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/jobs"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 underline"
            >
              Explore 50,000+ Verified Jobs →
            </Link>
            <span className="text-slate-300">•</span>
            <a
              href="https://ritualdev.in"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 underline inline-flex items-center gap-1"
            >
              RitualDev Technologies <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
