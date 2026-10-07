"use client";

import { useState, useEffect } from "react";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  Users2,
  FileCode2,
  ShieldCheck,
  X,
  ArrowRight,
  Flame,
  Check,
} from "lucide-react";
import { Button } from "./ui/button";

interface StudyProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export function StudyProModal({ isOpen, onClose, onActivated }: COURSES_MODAL_PROPS = {} as any) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("studynest_pro_member");
      if (saved === "true") {
        setIsPro(true);
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    // Simulate instantaneous activation with persistent token
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      localStorage.setItem("studynest_pro_member", "true");
      localStorage.setItem("studynest_pro_plan", selectedPlan);
      localStorage.setItem("studynest_pro_date", new Date().toISOString());
      window.dispatchEvent(new Event("studynest-pro-updated"));
    } catch {}

    setLoading(false);
    setIsSuccess(true);
    setIsPro(true);
    if (onActivated) onActivated();
  };

  const handleDeactivate = () => {
    try {
      localStorage.removeItem("studynest_pro_member");
      localStorage.removeItem("studynest_pro_plan");
      window.dispatchEvent(new Event("studynest-pro-updated"));
    } catch {}
    setIsPro(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0f142c] via-[#090d1f] to-[#070913] text-slate-100 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/30">
              <Crown className="h-8 w-8 fill-slate-950" />
            </div>
            <div>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                Upgrade Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Welcome to StudyNest Pro Scholar!
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
                Your Pro Scholar pass is now active. All verified diplomas, unlimited AI custom syllabus generations, downloadable architecture kits, and private mock rooms are unlocked.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg"
              >
                Start Learning Now →
              </Button>
            </div>
          </div>
        ) : isPro ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Crown className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-white">Your Pro Scholar Pass is Active</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You currently have full unlimited access to all courses, verified certificate diplomas, and AI learning tools.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6">
                Back to Academy
              </Button>
              <Button onClick={handleDeactivate} variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950/30 rounded-xl">
                Reset Pass
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 px-3.5 py-1 text-xs font-mono font-bold text-amber-300">
                <Crown className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                StudyNest Academy Pro
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Accelerate Your Tech Career With Pro Pass
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Unlock verifiable graduation diplomas, unlimited AI personalized course synthesis, and 1-on-1 technical mock interview matching.
              </p>
            </div>

            {/* Plan Picker Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly */}
              <div
                onClick={() => setSelectedPlan("monthly")}
                className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === "monthly"
                    ? "border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500 shadow-lg"
                    : "border-indigo-950/70 bg-[#0c1020] hover:border-indigo-800"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-300">Monthly Scholar</div>
                  <div className="mt-2 text-2xl font-black text-white">
                    ₹199<span className="text-xs text-slate-400 font-normal">/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Flexible month-to-month learning access.</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-indigo-300 font-semibold">
                  {selectedPlan === "monthly" && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                  <span>Billed monthly</span>
                </div>
              </div>

              {/* Annual - Recommended */}
              <div
                onClick={() => setSelectedPlan("annual")}
                className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === "annual"
                    ? "border-amber-400 bg-gradient-to-b from-amber-950/30 to-indigo-950/40 ring-2 ring-amber-400 shadow-xl"
                    : "border-indigo-950/70 bg-[#0c1020] hover:border-indigo-800"
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950 shadow-sm">
                  Most Popular • Save 60%
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <span>Annual Pro Fellow</span>
                    <Sparkles className="h-3 w-3 fill-amber-300 text-amber-300" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    ₹999<span className="text-xs text-slate-400 font-normal">/yr</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">Only ₹83/month. Full access to verifiable diplomas &amp; all tracks.</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
                  {selectedPlan === "annual" && <Check className="h-3.5 w-3.5" />}
                  <span>Save ₹1,389/yr</span>
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="rounded-2xl border border-indigo-950/80 bg-slate-900/60 p-4 space-y-2.5 text-xs">
              <div className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                What&apos;s Included with Pro:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Verified Diplomas &amp; Cryptographic Badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Unlimited AI Syllabus &amp; Quiz Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>1-on-1 Mock STAR Technical Interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Full Distributed Systems Architecture Kits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Interactive Visual Node Canvas Progress Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-2 pt-1">
              <Button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600 hover:from-amber-400 hover:via-indigo-500 hover:to-violet-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 h-auto"
              >
                {loading ? (
                  <span>Activating Pro Pass...</span>
                ) : (
                  <>
                    <Crown className="h-4 w-4 fill-current" />
                    <span>
                      Activate Pro Pass &mdash; {selectedPlan === "monthly" ? "₹199 / mo" : "₹999 / yr"}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-slate-500">
                Secure 256-bit SSL encrypted &bull; Instant activation &bull; Cancel anytime
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type COURSES_MODAL_PROPS = {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
};
