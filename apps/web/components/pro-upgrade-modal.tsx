"use client";

import { X, Sparkles, Check, ShieldCheck, Zap, ArrowRight, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { openPaddleCheckout, PADDLE_PRO_PRICE_ID } from "./paddle-provider";
import Link from "next/link";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  reason?: string;
}

export function ProUpgradeModal({
  isOpen,
  onClose,
  title = "Unlock Unlimited AI Generations with Pro",
  reason = "You have used your 3 free AI trials. Upgrade to Role Nest Pro for unlimited ATS matching, personalized cover letters, and employer AI drafting.",
}: ProUpgradeModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    openPaddleCheckout({
      priceId: PADDLE_PRO_PRICE_ID,
      plan: "pro",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 font-mono">
              <Lock className="h-3 w-3" /> PRO UPGRADE REQUIRED
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {reason}
        </p>

        {/* VALUE PROPOSITIONS */}
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2.5 text-xs">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider font-mono">
            Pro Membership Includes:
          </div>

          <div className="flex items-start gap-2 text-slate-700">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Unlimited AI ATS Matches</strong> with instant skill gap analysis.</span>
          </div>

          <div className="flex items-start gap-2 text-slate-700">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>1-Click Tailored Bullet Points</strong> to bridge missing keywords.</span>
          </div>

          <div className="flex items-start gap-2 text-slate-700">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Personalized AI Outreach Notes</strong> customized to company tech stacks.</span>
          </div>

          <div className="flex items-start gap-2 text-slate-700">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Verified Pro Badge</strong> &amp; 5x higher visibility in employer queues.</span>
          </div>
        </div>

        {/* PRICING & ACTION */}
        <div className="pt-1 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">₹499</span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Cancel Anytime
            </span>
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm py-3 rounded-2xl shadow-lg shadow-orange-500/25 min-h-[46px] flex items-center justify-center gap-2"
          >
            <span>Upgrade to Pro Now</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Backed by 7-Day Money-Back Guarantee via Paddle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
