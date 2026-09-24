"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Zap,
  Target,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button";

interface GapToOfferDiagnosticProps {
  jobTitle: string;
  companyName: string;
  jobSkills: string[];
  jobSlug: string;
}

export function GapToOfferDiagnostic({
  jobTitle,
  companyName,
  jobSkills,
  jobSlug,
}: GapToOfferDiagnosticProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    // Check if user has verified dev score saved in localStorage
    try {
      const saved = localStorage.getItem("jobmint_verified_dev_score");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verifiedSkills && Array.isArray(parsed.verifiedSkills)) {
          setCandidateSkills(parsed.verifiedSkills);
          setHasScanned(true);
          return;
        }
      }
    } catch {}

    // Default starting set (common student baseline)
    setCandidateSkills(jobSkills.slice(0, Math.max(1, Math.floor(jobSkills.length * 0.6))));
  }, [jobSkills]);

  const toggleSkill = (skill: string) => {
    if (candidateSkills.includes(skill)) {
      setCandidateSkills(candidateSkills.filter((s) => s !== skill));
    } else {
      setCandidateSkills([...candidateSkills, skill]);
    }
  };

  const matchedSkills = jobSkills.filter((s) => candidateSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !candidateSkills.includes(s));
  const matchPercentage =
    jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 100;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 p-5 text-white shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Gap-to-Offer™ Skill Diagnostic</h3>
              <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-mono border border-emerald-500/20">
                Live AI Match
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized gap analysis & 7-day action sprint to land an offer for {jobTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right mr-1">
            <div className="text-xl font-black text-emerald-400 font-mono">{matchPercentage}%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Offer Readiness</div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 rounded-xl gap-1.5"
          >
            <span>{isOpen ? "Hide Diagnostic" : "Run Skill Diagnostic"}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Expanded Diagnostic Content */}
      {isOpen && (
        <div className="mt-5 pt-5 border-t border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Skill Toggles bar */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-200">
                Select the skills you already know to recalculate your gap:
              </div>
              <Link
                href="/dev-score"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Zap className="h-3 w-3" /> Auto-sync from GitHub Dev Score
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {jobSkills.map((skill) => {
                const isSelected = candidateSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    )}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Breakdown columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Matches */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Your Direct Strengths ({matchedSkills.length}/{jobSkills.length})
              </div>
              {matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 text-xs"
                    >
                      {s} ✓
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  Select your known skills above to see what matches.
                </div>
              )}
            </div>

            {/* Gaps */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                Missing Gaps to Bridge ({missingSkills.length})
              </div>
              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 text-xs"
                    >
                      {s} (Gap)
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Zero skill gaps! You are 100% offer-ready for this role.
                </div>
              )}
            </div>
          </div>

          {/* 7-DAY PERSONALIZED SPRINT PLAN */}
          {missingSkills.length > 0 && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Calendar className="h-4 w-4 text-emerald-400" />
                Your Recommended 7-Day Sprint Plan:
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-800 text-slate-300 font-mono px-2 py-0.5 text-[11px] shrink-0">
                    Day 1–2
                  </span>
                  <div>
                    <strong className="text-white">Core Concept Sprint:</strong> Study{" "}
                    <span className="text-emerald-400 font-semibold">{missingSkills.slice(0, 2).join(", ")}</span>{" "}
                    architecture patterns & official documentation.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-800 text-slate-300 font-mono px-2 py-0.5 text-[11px] shrink-0">
                    Day 3–4
                  </span>
                  <div>
                    <strong className="text-white">Proof-of-Work Project:</strong> Build a mini service or full-stack component demonstrating{" "}
                    <span className="text-emerald-400 font-semibold">{missingSkills[0]}</span> integration.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-800 text-slate-300 font-mono px-2 py-0.5 text-[11px] shrink-0">
                    Day 5–6
                  </span>
                  <div>
                    <strong className="text-white">Live Deployment & Sandbox:</strong> Push code to GitHub and deploy a live demo to Vercel/Render so recruiters can test it in 1 click.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-800 text-slate-300 font-mono px-2 py-0.5 text-[11px] shrink-0">
                    Day 7
                  </span>
                  <div>
                    <strong className="text-white">Mock Interview Practice:</strong> Practice technical role questions in the JobMint Interview Prep Simulator.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link href={`/jobs/${jobSlug}/interview-prep`}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs gap-1.5 rounded-xl"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                Practice Interview Questions for this Role
              </Button>
            </Link>

            <Link href="/dev-score">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-emerald-400 gap-1"
              >
                <span>View Full GitHub Dev Score</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}