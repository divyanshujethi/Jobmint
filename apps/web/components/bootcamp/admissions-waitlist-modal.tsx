"use client";

import { useState } from "react";
import {
  X,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  School,
  Mail,
  User,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { playSuccessChime, triggerConfetti } from "@/lib/game-engine";

interface AdmissionsWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  trackIcon?: string;
  defaultName?: string;
  defaultEmail?: string;
}

export function AdmissionsWaitlistModal({
  isOpen,
  onClose,
  trackId,
  trackTitle,
  trackIcon = "🚀",
  defaultName = "",
  defaultEmail = "",
}: AdmissionsWaitlistModalProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [degreeBranch, setDegreeBranch] = useState("B.Tech Computer Science");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please provide your name and email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bootcamp/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          trackTitle,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: college.trim(),
          degreeBranch: degreeBranch.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to join waitlist. Please try again.");
      }

      setSubmitted(true);
      playSuccessChime();
      triggerConfetti();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 space-y-6">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Priority Waitlist Confirmed
              </span>
              <h2 className="text-2xl font-black text-white">
                You&apos;re On The Priority List!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                We have registered <strong>{email}</strong> for early admissions to{" "}
                <span className="text-amber-300 font-bold">{trackTitle}</span>. You will receive direct notification the moment admissions open.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-left text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Early Bird Perk Guaranteed</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Waitlisted candidates get a 24-hour headstart before public opening and guaranteed eligibility for the ₹499 early-bird subsidized fee.
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 shadow-lg shadow-emerald-500/20"
            >
              Back to Track Syllabus
            </Button>
          </div>
        ) : (
          <>
            {/* MODAL HEADER */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{trackIcon}</span>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Admissions Opening Soon
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Join Priority Admissions Waitlist
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Be the first to know when registrations unlock for{" "}
                <strong className="text-slate-200">{trackTitle}</strong>. Strictly limited seats per cohort.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3 w-3 text-amber-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Divyanshu Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-amber-400" />
                    <span>Email Address *</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-amber-400" />
                    <span>WhatsApp / Phone Number</span>
                  </label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <School className="h-3 w-3 text-amber-400" />
                    <span>College / University</span>
                  </label>
                  <Input
                    placeholder="e.g. IIT, NIT, Thapar, SRM..."
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Branch / Specialization
                </label>
                <Input
                  placeholder="e.g. B.Tech CSE / IT / ECE"
                  value={degreeBranch}
                  onChange={(e) => setDegreeBranch(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm h-11 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  <span>{loading ? "Registering..." : "Notify Me When Admissions Open"}</span>
                </Button>
                <p className="text-[10px] text-center text-slate-500 mt-2">
                  Zero spam. We will only contact you regarding cohort admission unlocking.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
