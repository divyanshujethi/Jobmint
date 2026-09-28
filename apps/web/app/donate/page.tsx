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
  HelpCircle,
  TrendingUp,
  Users,
  Compass,
  Layers,
  BookOpen,
  ChevronDown,
  Gift,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openCashfreeCheckout } from "@/components/cashfree-provider";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, 2500, 5000];

const IMPACT_TIERS: Record<number, string> = {
  50: "Provides 50 free AI resume scans and ATS feedback to college job seekers.",
  100: "Powers 1,000 automated recruiter verification and fraud-detection scans.",
  250: "Funds 24 hours of uninterrupted high-speed cloud server and database uptime.",
  500: "Covers free coding sandbox and DSA runner tokens for 25 engineering students.",
  1000: "Maintains open-source roadmaps and cheat sheets on DevShelf for 100+ devs.",
  2500: "Sponsors continuous infrastructure scaling & anti-ghosting telemetry for a week.",
  5000: "Major community pillar: funds core infrastructure and free candidate tooling for an entire month.",
};

const FAQS = [
  {
    q: "Why should I donate to Role Nest, DevShelf, and RitualDev?",
    a: "Unlike traditional placement agencies that charge candidates ₹10,000–₹50,000 or sell candidate emails and phone numbers to recruiters, our platforms believe tech careers and learning resources must remain 100% free and open. Your contribution directly funds high-speed server infrastructure, AI compute tokens, and continuous development.",
  },
  {
    q: "How does my payment work? What payment methods are supported?",
    a: "Payments are processed securely via Cashfree Payments (authorized by the Reserve Bank of India). You can pay in 1-tap using UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), all Indian and International Debit/Credit Cards (RuPay, Visa, Mastercard), and NetBanking.",
  },
  {
    q: "Will I get an official receipt for my donation?",
    a: "Yes! Immediately upon completing your payment, Cashfree generates an instant digital payment receipt sent directly to your email and SMS with a verified Order ID.",
  },
  {
    q: "Can I donate anonymously?",
    a: "Yes. Simply enter 'Anonymous Supporter' or leave your name generic in the donor details field. Your contribution will still be securely processed and allocated to community infrastructure.",
  },
  {
    q: "What is the relationship between rolenest.in, devshelf.ritualdev.in, and ritualdev.in?",
    a: "RitualDev Lab (ritualdev.in) is the parent developer collective and engineering team. Role Nest (rolenest.in) is the flagship job intelligence and career platform. DevShelf (devshelf.ritualdev.in) is our free developer library containing engineering roadmaps, interview prep kits, and open-source cheat sheets.",
  },
];

export default function DonatePage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmountInput, setCustomAmountInput] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorNote, setDonorNote] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const getImpactDescription = (amt: number) => {
    if (IMPACT_TIERS[amt]) return IMPACT_TIERS[amt];
    if (amt < 100) return "Directly supports student AI resume scans and cloud uptime.";
    if (amt < 500) return "Funds high-frequency job crawling, anti-ghosting telemetry, and database indexing.";
    if (amt < 2000) return "Sponsors free coding sandboxes, DevShelf roadmaps, and student developer tools.";
    return "Major champion: fuels dedicated cloud servers, security audits, and open-access resources.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 flex flex-col justify-between">
      {/* 1. Standalone Portal Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Heart className="h-5 w-5 fill-white text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900">
                  Role Nest <span className="text-emerald-700">Donations</span>
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 hidden sm:inline-block">
                  Community Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Powered by RitualDev Lab • Backing Open-Access Tech Tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
            <a
              href="https://rolenest.in"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>rolenest.in</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
            <a
              href="https://devshelf.ritualdev.in"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>devshelf.ritualdev.in</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
            <a
              href="https://ritualdev.in"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>ritualdev.in</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
            <a
              href="https://rolenest.in/jobs"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
            >
              Explore Jobs →
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-4 py-1.5 text-xs font-bold text-rose-800 shadow-xs">
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
              <span>100% Direct Allocation • Ad-Free Community Fund</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Empowering Freshers &amp; Developers with{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Zero Paywalls
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Your contribution fuels open-access engineering across <strong>Role Nest</strong> (verified tech hiring),{" "}
              <strong>DevShelf</strong> (free developer resources &amp; roadmaps), and <strong>RitualDev Lab</strong> (independent research &amp; anti-fraud tools).
            </p>

            {/* Monthly Goal Progress Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 max-w-xl mx-auto shadow-xs text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  Monthly Cloud &amp; Token Fund
                </span>
                <span className="font-mono font-bold text-emerald-700">₹24,350 / ₹35,000 (70%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: "70%" }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Backed by 164 students &amp; engineers this month</span>
                <span>Next server renewal: Oct 1, 2026</span>
              </div>
            </div>
          </div>

          {/* "HOW IT WORKS / WHAT TO DO" - Step-by-Step Interactive Guide */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                Simple &amp; Transparent
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                How It Works — What You Need To Do
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Contributing takes less than 30 seconds with zero signup hurdles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900">Choose Your Impact</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Tap any preset contribution (₹50 to ₹5,000) or type any custom amount (min ₹10).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-800 font-black text-xs">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900">Enter Receipt Info</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Provide your name, email, and 10-digit mobile number for instant Cashfree UPI/SMS receipts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-800 font-black text-xs">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900">1-Tap UPI Payment</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Pay instantly via Google Pay, PhonePe, Paytm, BHIM, RuPay, or any card with 0% platform surcharge.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-black text-xs">
                  4
                </div>
                <h3 className="font-bold text-sm text-slate-900">Instant Verification</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Get your official digital donation receipt with Order ID and honorary Community Supporter status.
                </p>
              </div>
            </div>
          </div>

          {/* Main 2-Column Donation & Impact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Mission Breakdown & Ecosystem */}
            <div className="lg:col-span-6 space-y-6">
              {/* Three Projects Showcase Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>The Connected Ecosystem</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    What Your Donation Powers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every rupee supports three complementary initiatives engineered for developers:
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Pillar 1: Role Nest */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-black text-sm text-slate-900">Role Nest</span>
                      </div>
                      <a
                        href="https://rolenest.in"
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                      >
                        <span>rolenest.in</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11.5px]">
                      Transparent tech career intelligence, verified direct company links, Harvard ATS resume analyzer, and anti-ghosting Truth Teller telemetry. 100% free for applicants.
                    </p>
                  </div>

                  {/* Pillar 2: DevShelf */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="font-black text-sm text-slate-900">DevShelf</span>
                      </div>
                      <a
                        href="https://devshelf.ritualdev.in"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                      >
                        <span>devshelf.ritualdev.in</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11.5px]">
                      The digital developer shelf. Curated system design roadmaps, DSA cheat sheets, engineering interview kits, code snippets, and free student dev tools.
                    </p>
                  </div>

                  {/* Pillar 3: RitualDev Lab */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        <span className="font-black text-sm text-slate-900">RitualDev Lab</span>
                      </div>
                      <a
                        href="https://ritualdev.in"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-0.5"
                      >
                        <span>ritualdev.in</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11.5px]">
                      The parent engineering collective. Operates daily scrapers, maintains cloud compute clusters, audits recruiter legitimacy, and ensures strict DPDP Act 2023 privacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Impact Calculator Box */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Your Selected Impact (₹{activeAmount > 0 ? activeAmount : 250})</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {getImpactDescription(activeAmount)}
                </p>
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
                  <p className="text-xs text-slate-500">
                    Choose a preset or enter any custom amount via Cashfree UPI.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium animate-in fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleDonate} className="space-y-5">
                  {/* 1. Quick Presets */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Select Preset Contribution</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Most Popular: ₹250</span>
                    </label>
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

          {/* Interactive FAQ Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Everything You Need to Know About Contributing
              </h3>
            </div>

            <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-emerald-700 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed pr-6 animate-in fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Banner: Community Gratitude & Reciprocal Links */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-4 shadow-xs">
            <h3 className="text-xl font-black text-slate-900">
              A Thank You from the RitualDev, Role Nest &amp; DevShelf Teams
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every single rupee contributed empowers college engineering candidates who cannot afford expensive ₹10,000+ placement courses or paid recruiter spam services. We remain accountable to our developer community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://rolenest.in"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
              >
                Role Nest Careers (rolenest.in) <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://devshelf.ritualdev.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 underline flex items-center gap-1"
              >
                DevShelf Knowledge Hub (devshelf.ritualdev.in) <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://ritualdev.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-purple-700 hover:text-purple-800 underline flex items-center gap-1"
              >
                RitualDev Technologies (ritualdev.in) <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Standalone Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl space-y-2">
          <p>© {new Date().getFullYear()} Role Nest &amp; DevShelf — Engineered &amp; Maintained by RitualDev Lab.</p>
          <p className="text-[11px] text-slate-400">
            Operating Business: Role Nest / RitualDev Technologies (Divyanshu Jethi) • DPDP Act 2023 Compliant • Verified Merchant on Cashfree
          </p>
        </div>
      </footer>
    </div>
  );
}
