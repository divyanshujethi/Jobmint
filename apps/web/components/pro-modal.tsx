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
import { openCashfreeCheckout } from "./cashfree-provider";

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
  const [selectedPlan, setSelectedPlan] = useState<"student" | "pro" | "pro_annual">("pro");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await openCashfreeCheckout({
        plan: selectedPlan,
      });
    } catch {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Bot className="h-4 w-4 text-emerald-600" />,
      title: "Unlimited AI ATS Resume Tailoring & STAR Rewrites",
      desc: "Instant alignment with targeted job descriptions to pass applicant tracking systems.",
    },
    {
      icon: <FileCheck className="h-4 w-4 text-emerald-600" />,
      title: "Custom Cover Letter & Interview Prep Generator",
      desc: "Generate role-tailored pitch letters and behavioral STAR answers for any job.",
    },
    {
      icon: <Crown className="h-4 w-4 text-amber-500" />,
      title: "Verified Pro Candidate Badge & Priority Search",
      desc: "Stand out to hiring managers with verified technical skill tags and recruiter visibility.",
    },
    {
      icon: <Zap className="h-4 w-4 text-emerald-600" />,
      title: "Priority Telegram & WhatsApp Job Alert Pings",
      desc: "Instant notifications when new high-match tech jobs or paid internships are crawled.",
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-emerald-600" />,
      title: "Application Tracker & 7-Day Follow-Up Alerts",
      desc: "Keep all your applications organized with automated follow-up reminders.",
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
            Job search &amp; application links are 100% Free Forever. Premium AI generation tools require a Pro upgrade.
          </p>
        </div>

        {/* PLAN SELECTOR TOGGLE — 3 CLEAN TIERS */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedPlan("student")}
            className={`rounded-2xl p-2.5 text-left border transition-all ${
              selectedPlan === "student"
                ? "bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20"
                : "bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            <div className="text-[9px] font-bold uppercase text-indigo-700">Campus Pass</div>
            <div className="text-lg font-black text-slate-900">₹99<span className="text-[10px] font-normal text-slate-500">/mo</span></div>
            <div className="text-[9px] text-slate-500 mt-0.5">Student ID verified</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan("pro")}
            className={`rounded-2xl p-2.5 text-left border transition-all ${
              selectedPlan === "pro"
                ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                : "bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            <div className="text-[9px] font-bold uppercase text-emerald-700">Pro Monthly</div>
            <div className="text-lg font-black text-slate-900">₹199<span className="text-[10px] font-normal text-slate-500">/mo</span></div>
            <div className="text-[9px] text-slate-500 mt-0.5">Full 30-day access</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan("pro_annual")}
            className={`rounded-2xl p-2.5 text-left border transition-all relative ${
              selectedPlan === "pro_annual"
                ? "bg-white border-amber-500 shadow-sm ring-1 ring-amber-500/20"
                : "bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white"
            }`}
          >
            <span className="absolute -top-2 right-1.5 rounded-full bg-amber-600 text-white text-[7px] font-black px-1 py-0.2">
              SAVE 37%
            </span>
            <div className="text-[9px] font-bold uppercase text-amber-700">Annual Pass</div>
            <div className="text-lg font-black text-slate-900">₹1,499<span className="text-[10px] font-normal text-slate-500">/yr</span></div>
            <div className="text-[9px] text-slate-500 mt-0.5">₹125/mo • Best Value</div>
          </button>
        </div>

        <div className="p-6 space-y-3.5 max-h-[300px] overflow-y-auto">
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

        <div className="p-6 pt-3 bg-white border-t border-slate-100 space-y-2.5">
          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 rounded-xl flex items-center justify-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            {loading
              ? "Launching Cashfree..."
              : selectedPlan === "student"
                ? "Activate Campus Pass — ₹99/mo"
                : selectedPlan === "pro"
                  ? "Activate Pro — ₹199/mo"
                  : "Activate Annual Pass — ₹1,499/yr"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <div className="flex items-center justify-center gap-3 text-xs font-semibold">
            <a
              href="/pricing"
              onClick={onClose}
              className="text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              View detailed tier comparison →
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/donate"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="text-amber-800 hover:text-amber-900 hover:underline"
            >
              Support via Donation →
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Secured by Cashfree Payments. Instant UPI (GPay/PhonePe), RuPay &amp; Cards.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
