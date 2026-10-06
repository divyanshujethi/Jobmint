"use client";

import { useState } from "react";
import {
  Crown,
  Check,
  Zap,
  Building2,
  Sparkles,
  ShieldCheck,
  X,
  Clock,
  Briefcase,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCashfreeCheckout } from "@/components/cashfree-provider";

interface ArenaProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArenaProModal({ isOpen, onClose }: ArenaProModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setLoading(true);
    try {
      openCashfreeCheckout({
        plan: selectedPlan === "annual" ? "pro_annual" : "pro",
        onSuccess: () => {
          setLoading(false);
          onClose();
          window.location.reload();
        },
        onError: () => {
          setLoading(false);
        },
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-[#121212] p-6 sm:p-8 shadow-2xl text-neutral-100 font-sans space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER: PRO BADGE & TITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3.5 py-1 text-xs font-mono font-bold text-amber-400">
            <Crown className="h-4 w-4 text-amber-400" />
            <span>ProblemNest Arena Pro</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Crack High-Paying Tech Interviews Fast
          </h2>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Gain the competitive edge with verified company questions, AI code reviews, and direct recruiter recommendations on RoleNest.
          </p>
        </div>

        {/* FEATURE HIGHLIGHTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-3 rounded-2xl border border-neutral-800 bg-[#171717] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Company-Tagged Questions</div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                Target Google, Amazon, Microsoft, Swiggy, &amp; Uber frequently asked OA challenges.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-neutral-800 bg-[#171717] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">AI Code Reviewer &amp; Explainer</div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                Step-by-step editorial breakdowns, edge case debugging, and O(N) complexity proofs.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-neutral-800 bg-[#171717] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Recruiter Fast-Track Referral</div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                Top DevScore profiles bypass resume filters and land directly in employer inboxes.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-neutral-800 bg-[#171717] p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Mock OA Assessment Simulator</div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                Timed 60-min test runs matching authentic FAANG online assessment test conditions.
              </div>
            </div>
          </div>
        </div>

        {/* PRICING TIER CARDS */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Monthly Option */}
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
              selectedPlan === "monthly"
                ? "border-amber-500 bg-amber-950/20 text-white shadow-md shadow-amber-500/10"
                : "border-neutral-800 bg-[#161616] text-neutral-400 hover:border-neutral-700"
            }`}
          >
            <div className="text-xs font-bold font-mono uppercase text-neutral-400">Monthly Pass</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">₹299</span>
              <span className="text-[11px] text-neutral-500">/ month</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-400">Billed monthly. Cancel anytime.</div>
          </div>

          {/* Annual Option (Best Value) */}
          <div
            onClick={() => setSelectedPlan("annual")}
            className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
              selectedPlan === "annual"
                ? "border-amber-500 bg-amber-950/20 text-white shadow-md shadow-amber-500/10"
                : "border-neutral-800 bg-[#161616] text-neutral-400 hover:border-neutral-700"
            }`}
          >
            <div className="absolute -top-2.5 right-3 rounded-full bg-linear-to-r from-amber-500 to-orange-600 px-2 py-0.5 text-[9px] font-black uppercase text-slate-950">
              Save 58%
            </div>
            <div className="text-xs font-bold font-mono uppercase text-amber-400">Annual Pass</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">₹1,499</span>
              <span className="text-[11px] text-neutral-500">/ year</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-300 font-semibold">Only ₹125/month &bull; 1 Year Access</div>
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 gap-2 transition-all hover:scale-[1.01]"
          >
            <Crown className="h-4 w-4 fill-slate-950" />
            <span>
              {loading ? "Initializing Checkout..." : `Upgrade Now &bull; ${selectedPlan === "annual" ? "₹1,499 / year" : "₹299 / month"}`}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              100% Secure via Cashfree
            </span>
            <span>&bull;</span>
            <span>UPI &bull; Cards &bull; NetBanking</span>
            <span>&bull;</span>
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
