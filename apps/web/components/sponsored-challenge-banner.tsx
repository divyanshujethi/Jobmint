"use client";

import { useState } from "react";
import { Trophy, Sparkles, Building2, CheckCircle2, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function SponsoredChallengeBanner() {
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [budgetTier, setBudgetTier] = useState<"STARTER" | "FLAGSHIP">("STARTER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        const existing = JSON.parse(localStorage.getItem("rolenest_challenge_sponsors") || "[]");
        existing.push({
          companyName,
          companyEmail,
          targetRole,
          budgetTier,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem("rolenest_challenge_sponsors", JSON.stringify(existing));
      } catch (err) {}
    }, 900);
  };

  return (
    <>
      {/* SPONSORED HACKATHON PROMO STRIP */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 p-4 sm:p-5 text-white shadow-md my-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  Hire Top 1% Fresher Talent — Sponsor a Weekend Challenge
                </span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-300 border border-amber-500/30 uppercase tracking-wider font-mono">
                  B2B Hiring Sprint
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Skip 1,000 unverified PDFs. Test candidates on real sandboxed coding challenges, evaluate automated test suites, and hire top performers directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => {
                setShowModal(true);
                setSubmitted(false);
              }}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs gap-1.5 shadow-sm min-h-[44px] px-5 rounded-xl cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Sponsor a Challenge (₹25k–₹75k)
            </Button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* SPONSOR INQUIRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-7 shadow-2xl text-slate-100 space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Trophy className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-white">
                  Host a Sponsored Hiring Challenge
                </h3>
                <p className="text-xs text-slate-400">
                  Direct pipeline to top engineering freshers across 50+ Indian colleges.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-2xl">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">
                  Challenge Request Received!
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Our developer relations lead will reach out to <strong>{companyEmail}</strong> within 12 hours with problem sandbox templates and scheduling.
                </p>
                <Button
                  onClick={() => setShowModal(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Company / Startup Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay, Swiggy, Incred..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Work Email (Corporate Domain)</label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Target Roles to Hire</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React Frontend Interns (₹35k/mo) or Go Backend Fresher (₹12 LPA)"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sponsorship Tier</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBudgetTier("STARTER")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        budgetTier === "STARTER"
                          ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                          : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-bold text-white text-xs">Weekend Sprint</div>
                      <div className="text-amber-400 font-extrabold text-sm mt-0.5">₹24,999</div>
                      <div className="text-[10px] text-slate-400 mt-1">1 custom problem • 150 submissions</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBudgetTier("FLAGSHIP")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        budgetTier === "FLAGSHIP"
                          ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                          : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                      }`}
                    >
                      <div className="font-bold text-white text-xs">Flagship Blitz</div>
                      <div className="text-amber-400 font-extrabold text-sm mt-0.5">₹74,999</div>
                      <div className="text-[10px] text-slate-400 mt-1">Full hackathon • 50+ college push</div>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Included in All Challenge Packages:
                  </div>
                  <p>Candidate code sandboxing, anti-plagiarism heuristics, DevScore leaderboard integration, and 1-click candidate direct interview scheduling.</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl min-h-[44px]"
                >
                  {isSubmitting ? "Submitting Request..." : "Request Challenge Sponsorship"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
