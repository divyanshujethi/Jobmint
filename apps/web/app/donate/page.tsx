"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Building2,
  Code2,
  Server,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Loader2,
  HelpCircle,
  TrendingUp,
  Layers,
  BookOpen,
  ChevronDown,
  Scale,
  FileCheck2,
  UserCheck,
  Check,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openCashfreeCheckout } from "@/components/cashfree-provider";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, 2500, 5000];

const IMPACT_TIERS: Record<number, string> = {
  50: "Subsidizes 50 free AI resume analyses and ATS bullet optimizations for college freshers.",
  100: "Powers 1,000 automated recruiter verification scans across tech company portals.",
  250: "Funds 24 hours of high-availability cloud compute, database indexing, and server operations.",
  500: "Covers free coding sandbox and DSA runner tokens for 25 student developers.",
  1000: "Maintains open-source interview kits, roadmaps, and cheat sheets on DevShelf for 100+ devs.",
  2500: "Sponsors continuous infrastructure scaling & anti-ghosting telemetry for a full week.",
  5000: "Major community pillar: fuels core server clusters and free candidate tooling for an entire month.",
};

const FAQS = [
  {
    q: "Why should I contribute to the RitualDev Lab, DevShelf & RoleNest Fund?",
    a: "Unlike traditional placement agencies that charge job seekers ₹10,000–₹50,000 or sell candidate phone numbers to spam recruiters, our collective believes developer learning resources and verified hiring must remain 100% free, open, and ad-free. Your contribution directly funds cloud server clusters, AI compute tokens, and continuous development.",
  },
  {
    q: "How does payment work? What payment methods are supported?",
    a: "Payments are processed securely via Cashfree Payments (authorized by the Reserve Bank of India). You can pay in 1-tap using UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Indian & International Debit/Credit Cards (RuPay, Visa, Mastercard), and NetBanking.",
  },
  {
    q: "How is my personal data protected under the DPDP Act 2023?",
    a: "We adhere strictly to India's Digital Personal Data Protection Act, 2023. Your contact details (name, email, phone) are collected solely for transaction confirmation, RBI compliance, and digital receipt delivery. We NEVER sell, rent, or cross-market your personal data to any third party.",
  },
  {
    q: "Will I get an official receipt for my contribution?",
    a: "Yes! Immediately upon completing your payment, Cashfree generates an instant digital payment receipt sent directly to your email and SMS with a verified Order ID.",
  },
  {
    q: "Can I donate anonymously?",
    a: "Yes. You can enter 'Anonymous Supporter' in the donor name field. Your contribution will be processed securely and attributed to the community fund without public disclosure.",
  },
  {
    q: "What is the relationship between ritualdev.in, devshelf.ritualdev.in, and rolenest.in?",
    a: "RitualDev Lab (ritualdev.in) is the parent developer collective and engineering studio. DevShelf (devshelf.ritualdev.in) is our free developer shelf for roadmaps, cheat sheets, and interview prep. RoleNest (rolenest.in) is the flagship tech careers and job verification platform.",
  },
];

export default function DonatePage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmountInput, setCustomAmountInput] = useState<string>("250");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorNote, setDonorNote] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDpdpDetails, setShowDpdpDetails] = useState<boolean>(false);
  const [realStats, setRealStats] = useState<{ totalAmount: number; donorCount: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{
    rank: number;
    displayName: string;
    totalAmount: number;
    donationCount: number;
    lastDonatedAt: string;
    isAnonymous: boolean;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentBanner, setPaymentBanner] = useState<"success" | "cancelled" | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const donationParam = params.get("donation");
      const orderIdParam = params.get("order_id");
      if (donationParam === "success") {
        setPaymentBanner("success");
        if (orderIdParam) setSuccessOrderId(orderIdParam);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      } else if (donationParam === "cancelled") {
        setPaymentBanner("cancelled");
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/payment/donations/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setRealStats({ totalAmount: data.totalAmount, donorCount: data.donorCount });
        }
      })
      .catch(() => {});

    fetch("/api/payment/donations/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        }
      })
      .catch(() => {});

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
    setCustomAmountInput(String(amount));
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Forcibly hide default headers, footers and navbars on donation portal */}
      <style jsx global>{`
        header.sticky:not(.donation-header),
        nav.fixed,
        footer.print\\:hidden,
        .mobile-bottom-nav {
          display: none !important;
        }
      `}</style>

      {/* 1. Standalone Top Bar - Distinct from RoleNest Job Board */}
      <header className="donation-header sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/20">
              <Heart className="h-5 w-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-white">
                  RitualDev <span className="text-emerald-400">×</span> RoleNest
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 hidden sm:inline-block">
                  Community Fund
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Backing Free Developer Tooling, DevShelf &amp; Transparent Hiring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <a
              href="https://ritualdev.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>ritualdev.in</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
            <a
              href="https://devshelf.ritualdev.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>devshelf.ritualdev.in</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
            <a
              href="https://rolenest.in"
              className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>rolenest.in</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>DPDP Act 2023 Verified</span>
            </div>
          </div>
        </div>
      </header>
      {paymentBanner === "success" && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-3 text-center text-sm font-semibold text-emerald-300 flex items-center justify-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-2">
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
          <span>
            Thank you for your generous contribution! Your payment has been received and verified.
            {successOrderId ? ` (Order ID: ${successOrderId})` : ""}
          </span>
          <button
            onClick={() => setPaymentBanner(null)}
            className="ml-3 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
      {paymentBanner === "cancelled" && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-3 text-center text-sm font-semibold text-amber-300 flex items-center justify-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-2">
          <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Payment was not completed. You can try again whenever you are ready.</span>
          <button
            onClick={() => setPaymentBanner(null)}
            className="ml-3 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Open-Access Collective • 100% Direct Infrastructure Allocation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Empowering Developers with{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Open Tools &amp; Zero Paywalls
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Jointly supported by <strong>RitualDev Lab</strong>, <strong>RoleNest</strong>, and <strong>DevShelf</strong>. Your contribution keeps tech career telemetry, standard ATS tools, and developer learning roadmaps completely free for students.
            </p>

            {/* Real Live Community Ledger - Zero Fake Funding */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 max-w-xl mx-auto shadow-xl text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Live Verified Contributions (Current Month)
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₹{realStats ? realStats.totalAmount.toLocaleString() : "0"}
                </span>
              </div>
              <div className="text-[11.5px] text-slate-400 leading-relaxed">
                {realStats && realStats.totalAmount > 0 ? (
                  <span>
                    <strong>₹{realStats.totalAmount.toLocaleString()}</strong> contributed by <strong>{realStats.donorCount}</strong> community backer(s). 100% genuine and verified via RBI Cashfree gateway.
                  </span>
                ) : (
                  <span>
                    <strong>₹0 Raised so far this cycle</strong> (100% Genuine Ledger • Zero Fake Counters). Be the founding supporter to fuel our high-speed servers, DevShelf cheat sheets, and free student AI tools!
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                <span>Zero Platform Markup • Direct Server Allocation</span>
                <span>Live DB Sync • RBI Authorized</span>
              </div>
            </div>
          </div>

          {/* "HOW IT WORKS / WHAT TO DO" - Step-by-Step Guide */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-[11px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                Simple &amp; Direct
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                How It Works — What You Need To Do
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Contributing takes less than 30 seconds with zero signup hurdles or spam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs relative space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                  1
                </div>
                <h3 className="font-bold text-sm text-white">Choose Your Impact</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Tap any preset contribution (₹50 to ₹5,000) or type any custom amount (min ₹10).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs relative space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 font-black text-xs border border-blue-500/30">
                  2
                </div>
                <h3 className="font-bold text-sm text-white">Enter Receipt Info</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Provide name, email, and 10-digit mobile number for immediate Cashfree UPI/SMS receipts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs relative space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-black text-xs border border-purple-500/30">
                  3
                </div>
                <h3 className="font-bold text-sm text-white">1-Tap UPI Payment</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Pay instantly via Google Pay, PhonePe, Paytm, BHIM, RuPay, or any card with 0% gateway fees.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs relative space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/30">
                  4
                </div>
                <h3 className="font-bold text-sm text-white">Instant Verification</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Get your official digital donation receipt with Order ID and honorary Community Supporter status.
                </p>
              </div>
            </div>
          </div>

          {/* Main 2-Column Donation & Impact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: The 3 Projects & DPDP Act Notice */}
            <div className="lg:col-span-6 space-y-6">
              {/* Three Projects Showcase Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl space-y-5">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>The Three Pillars</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Where Every Rupee Is Deployed
                  </h3>
                  <p className="text-xs text-slate-400">
                    Supporting three complementary non-paywalled engineering initiatives:
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Pillar 1: RitualDev Lab */}
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-purple-500/40 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-400" />
                        <span className="font-black text-sm text-white">RitualDev Lab</span>
                      </div>
                      <a
                        href="https://ritualdev.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>ritualdev.in</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11.5px]">
                      The parent engineering studio. Powers cloud scraping infrastructure, recruiter fraud intelligence, and privacy-first digital developer tooling.
                    </p>
                  </div>

                  {/* Pillar 2: DevShelf */}
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-blue-500/40 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        <span className="font-black text-sm text-white">DevShelf</span>
                      </div>
                      <a
                        href="https://devshelf.ritualdev.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>devshelf.ritualdev.in</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11.5px]">
                      The open digital developer shelf. Curated system design roadmaps, DSA cheat sheets, engineering interview kits, code snippets, and free student dev tools.
                    </p>
                  </div>

                  {/* Pillar 3: RoleNest */}
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/40 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="font-black text-sm text-white">RoleNest</span>
                      </div>
                      <a
                        href="https://rolenest.in"
                        className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>rolenest.in</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11.5px]">
                      Career intelligence platform. 100% verified direct job links, single-column ATS resume analyzer, and Truth Teller application telemetry. Zero recruiter fees for freshers.
                    </p>
                  </div>
                </div>
              </div>

              {/* DPDP Act 2023 Compliance Box */}
              <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Scale className="h-4 w-4" />
                    <span>DPDP Act, 2023 Compliance &amp; Privacy Notice</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDpdpDetails(!showDpdpDetails)}
                    className="text-[11px] text-slate-400 hover:text-white underline font-medium"
                  >
                    {showDpdpDetails ? "Hide Details" : "Read Notice"}
                  </button>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  <strong>Data Fiduciary:</strong> RoleNest &amp; RitualDev Technologies (Sector 62, Noida, UP 201301). Under Section 5 &amp; 6 of the DPDP Act 2023, your contact information is exclusively processed for Cashfree UPI payment processing and digital receipt generation.
                </p>

                {showDpdpDetails && (
                  <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px] text-slate-400 animate-in fade-in">
                    <div className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Purpose Limitation:</strong> Zero marketing calls, zero third-party recruiter data sharing, and zero tracking cookies.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Data Principal Rights:</strong> Right to access, correction, or erasure under Section 12 can be exercised via <code>privacy@rolenest.in</code>.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Grievance Redressal:</strong> Dedicated Data Protection Officer reachable at <code>grievance@rolenest.in</code>.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Impact Tier Preview */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Selected Impact (₹{activeAmount > 0 ? activeAmount : 250})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {getImpactDescription(activeAmount)}
                </p>
              </div>
            </div>

            {/* Right Column: Custom Payment Form */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 relative">
                <div className="space-y-1 text-center">
                  <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <Sparkles className="h-3 w-3" /> Quick &amp; Custom Contribution
                  </div>
                  <h2 className="text-2xl font-black text-white">Make a Donation</h2>
                  <p className="text-xs text-slate-400">
                    Choose a preset or enter any custom amount via Cashfree UPI.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs text-rose-300 font-medium animate-in fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleDonate} className="space-y-5">
                  {/* 1. Quick Presets */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Select Preset Contribution</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Most Popular: ₹250</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_AMOUNTS.map((amt) => {
                        const isSelected = Number(customAmountInput) === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleSelectPreset(amt)}
                            className={`py-2 px-1 rounded-xl text-xs font-black border transition-all cursor-pointer select-none active:scale-95 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-102 font-extrabold"
                                : "border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-950/60 hover:bg-slate-800"
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
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Or Enter Custom Amount (₹)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Min ₹10</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-black text-slate-400">
                        ₹
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 350, 750, 1500"
                        value={customAmountInput}
                        onChange={handleCustomAmountChange}
                        className="pl-9 h-11 text-base font-bold bg-slate-950 border-slate-800 text-white focus-visible:ring-emerald-500 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* 3. Donor Details */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Donor Details (for Instant UPI Receipt)
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
                      <Input
                        type="text"
                        required
                        placeholder="Your Name / Anonymous Supporter"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="h-10 text-xs bg-slate-950 border-slate-800 text-white rounded-xl focus-visible:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">Email Address</label>
                      <Input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="h-10 text-xs bg-slate-950 border-slate-800 text-white rounded-xl focus-visible:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Mobile Number <span className="text-slate-500 font-normal">(for Cashfree UPI / SMS)</span>
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
                          className="pl-12 h-10 text-xs bg-slate-950 border-slate-800 text-white rounded-xl font-mono focus-visible:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                        <span>Message for the Engineering Team (Optional)</span>
                        <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                      </label>
                      <Input
                        type="text"
                        maxLength={100}
                        placeholder="e.g. Keep fighting for transparency and freshers!"
                        value={donorNote}
                        onChange={(e) => setDonorNote(e.target.value)}
                        className="h-10 text-xs bg-slate-950 border-slate-800 text-white rounded-xl focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* 4. Instant Submit Button */}
                  <div className="pt-2 space-y-2.5">
                    <Button
                      type="submit"
                      disabled={isSubmitting || activeAmount < 10}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                          <span>Connecting to Cashfree...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 fill-slate-950 text-slate-950" />
                          <span>Donate ₹{activeAmount > 0 ? activeAmount : 250} via UPI / Cards</span>
                          <ArrowRight className="h-4 w-4 ml-0.5 text-slate-950" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
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
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Everything You Need to Know About Contributing
              </h3>
            </div>

            <div className="divide-y divide-slate-800 max-w-3xl mx-auto">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-emerald-400 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-emerald-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed pr-6 animate-in fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contribution Leaderboard */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <Trophy className="h-3.5 w-3.5" />
                <span>Community Leaderboard</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Our Top Community Backers
              </h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                Every contribution is verified via RBI-authorized Cashfree gateway and recorded live in our open ledger. Thank you for keeping developer tools free.
              </p>
            </div>

            {leaderboard.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center space-y-3">
                <div className="text-4xl">🏆</div>
                <p className="text-sm font-bold text-slate-300">No contributions yet — be the first!</p>
                <p className="text-xs text-slate-500">Your name will appear here the moment your contribution is verified. It takes under 30 seconds.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Top 3 Podium */}
                {leaderboard.length >= 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-2">
                    {/* 2nd place - left */}
                    {leaderboard[1] ? (
                      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center space-y-1.5 sm:order-1 order-2">
                        <div className="text-2xl">🥈</div>
                        <div className="text-xs font-black text-slate-200 truncate">
                          {leaderboard[1].displayName}
                        </div>
                        <div className="text-sm font-black text-slate-300">
                          ₹{leaderboard[1].totalAmount.toLocaleString()}
                        </div>
                        {leaderboard[1].donationCount > 1 && (
                          <div className="text-[10px] text-slate-500">{leaderboard[1].donationCount} contributions</div>
                        )}
                      </div>
                    ) : <div className="sm:order-1 order-2" />}

                    {/* 1st place - center (taller) */}
                    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5 text-center space-y-1.5 sm:order-2 order-1 ring-1 ring-amber-500/20">
                      <div className="text-3xl">🥇</div>
                      <div className="text-xs font-black text-amber-200 truncate">
                        {leaderboard[0].displayName}
                      </div>
                      <div className="text-base font-black text-amber-400">
                        ₹{leaderboard[0].totalAmount.toLocaleString()}
                      </div>
                      {leaderboard[0].donationCount > 1 && (
                        <div className="text-[10px] text-amber-600">{leaderboard[0].donationCount} contributions</div>
                      )}
                      <div className="text-[9px] font-bold uppercase tracking-widest text-amber-500/70 pt-0.5">Top Backer</div>
                    </div>

                    {/* 3rd place - right */}
                    {leaderboard[2] ? (
                      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center space-y-1.5 sm:order-3 order-3">
                        <div className="text-2xl">🥉</div>
                        <div className="text-xs font-black text-slate-200 truncate">
                          {leaderboard[2].displayName}
                        </div>
                        <div className="text-sm font-black text-slate-300">
                          ₹{leaderboard[2].totalAmount.toLocaleString()}
                        </div>
                        {leaderboard[2].donationCount > 1 && (
                          <div className="text-[10px] text-slate-500">{leaderboard[2].donationCount} contributions</div>
                        )}
                      </div>
                    ) : <div className="sm:order-3 order-3" />}
                  </div>
                )}

                {/* Rank 4–20 list */}
                {leaderboard.slice(3).length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden">
                    <div className="grid grid-cols-[2rem_1fr_auto] gap-x-3 px-4 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>#</span>
                      <span>Name</span>
                      <span>Total</span>
                    </div>
                    {leaderboard.slice(3).map((entry) => (
                      <div
                        key={entry.rank}
                        className="grid grid-cols-[2rem_1fr_auto] gap-x-3 px-4 py-2.5 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/60 transition-colors items-center"
                      >
                        <span className="text-xs font-black text-slate-500">{entry.rank}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 truncate block">
                            {entry.isAnonymous ? (
                              <span className="flex items-center gap-1">
                                <Lock className="h-3 w-3 text-slate-500 shrink-0" />
                                Anonymous Supporter
                              </span>
                            ) : entry.displayName}
                          </span>
                          {entry.donationCount > 1 && (
                            <span className="text-[10px] text-slate-500">{entry.donationCount}× contributor</span>
                          )}
                        </div>
                        <span className="text-xs font-black text-emerald-400 tabular-nums">
                          ₹{entry.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-slate-600 text-center pt-1">
                  Leaderboard updates live after each verified contribution. Names shown as entered — use &quot;Anonymous Supporter&quot; as your name for privacy.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Banner: Gratitude & Reciprocal Links */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center space-y-4 shadow-xl">
            <h3 className="text-xl font-black text-white">
              A Thank You from the RitualDev, RoleNest &amp; DevShelf Teams
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every single rupee contributed empowers college engineering candidates who cannot afford expensive ₹10,000+ placement courses or paid recruiter spam services. We remain accountable to our developer community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://ritualdev.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
              >
                RitualDev Technologies (ritualdev.in) <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://devshelf.ritualdev.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
              >
                DevShelf Knowledge Hub (devshelf.ritualdev.in) <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://rolenest.in"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
              >
                RoleNest Platform (rolenest.in) <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Standalone Distinct Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300">
            <a href="https://ritualdev.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">RitualDev Lab</a>
            <span>•</span>
            <a href="https://devshelf.ritualdev.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">DevShelf</a>
            <span>•</span>
            <a href="https://rolenest.in" className="hover:text-white">RoleNest</a>
            <span>•</span>
            <a href="https://rolenest.in/privacy" className="hover:text-white">DPDP Privacy Policy</a>
            <span>•</span>
            <a href="https://rolenest.in/terms" className="hover:text-white">Terms of Contribution</a>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Community Infrastructure Fund — Jointly Operated by RitualDev Lab &amp; RoleNest (Founder: Divyanshu Jethi).
          </p>
          <p className="text-[11px] text-slate-600 max-w-2xl mx-auto">
            DPDP Act 2023 Compliant • Registered Office: Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301 • RBI-Authorized Cashfree Payments Processing
          </p>
        </div>
      </footer>
    </div>
  );
}
