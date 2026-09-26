"use client";

import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Crown,
  FileCheck,
  Bot,
  MessageSquare,
  ArrowRight,
  X,
  CreditCard,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  openPaddleCheckout,
  PADDLE_PRO_PRICE_ID,
} from "./paddle-provider";

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
  } | null;
}

export function ProModal({ isOpen, onClose, user }: ProModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setLoading(true);
    openPaddleCheckout({
      priceId: PADDLE_PRO_PRICE_ID,
      userId: user?.id,
      userEmail: user?.email || undefined,
      plan: "pro",
    });
    setLoading(false);
  };

  const benefits = [
    {
      icon: <Bot className="h-4 w-4 text-emerald-600" />,
      title: "Unlimited AI Technical Mock Interviews",
      desc: "Live interactive coding & behavioral practice with instant scoring & feedback.",
    },
    {
      icon: <FileCheck className="h-4 w-4 text-emerald-600" />,
      title: "AI Resume & ATS Keyword Optimizer",
      desc: "Instant alignment with targeted job descriptions to beat applicant filters.",
    },
    {
      icon: <Crown className="h-4 w-4 text-amber-500" />,
      title: "Verified Pro Candidate Badge",
      desc: "Stand out to hiring managers with verified technical skills and project badges.",
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-emerald-600" />,
      title: "Direct Recruiter Outreach",
      desc: "Message hiring managers and founders directly on posted opportunities.",
    },
    {
      icon: <Zap className="h-4 w-4 text-emerald-600" />,
      title: "Truth Teller Deep Recruiter Analytics",
      desc: "Full insight into employer response times, ghosting rates, and interview steps.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100">
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md mb-2 border border-amber-300/30">
            <Crown className="h-3.5 w-3.5" /> ROLE NEST PRO
          </div>
          <h2 className="text-2xl font-black tracking-tight">Supercharge Your Career</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Stand out in tech hiring with automated AI preparation and verified proof-of-work.
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">₹299</span>
              <span className="text-xs font-semibold text-slate-500">/ month</span>
              <span className="text-xs text-slate-400 ml-1">($4.99 USD)</span>
            </div>
            <p className="text-[11px] text-slate-500">Cancel anytime with 1-click. 7-day money back guarantee.</p>
          </div>
          <div className="rounded-xl bg-emerald-100/70 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            Most Popular
          </div>
        </div>

        <div className="p-6 space-y-3.5 max-h-[340px] overflow-y-auto">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3 text-left">
              <div className="rounded-lg bg-emerald-50 p-1.5 shrink-0 mt-0.5 border border-emerald-100">
                {b.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 pt-2 bg-white border-t border-slate-100 space-y-2">
          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 rounded-xl flex items-center justify-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {loading ? "Launching Paddle Checkout..." : "Upgrade to Pro — ₹499/mo"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Secured by Paddle.com (Merchant of Record). All cards, UPI, & NetBanking accepted.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
