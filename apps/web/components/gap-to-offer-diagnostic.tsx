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
        if (parsed.verifiedSkills && Array.isArray(parsed.verifiedSkills) && parsed.verifiedSkills.length > 0) {
          setCandidateSkills(parsed.verifiedSkills);
          setHasScanned(true);
          return;
        }
      }
      const savedSkills = localStorage.getItem("jobmint_candidate_skills");
      if (savedSkills) {
        const parsed = JSON.parse(savedSkills);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidateSkills(parsed);
          setHasScanned(true);
          return;
        }
      }
    } catch {}

    // Never auto-assume or fake candidate skills - start empty
    setCandidateSkills([]);
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
    candidateSkills.length === 0
      ? 0
      : jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-5 sm:p-6 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">Gap-to-Offer Skill Diagnostic</h3>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                Live Match Engine
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Personalized gap analysis & 7-day action sprint to land an offer for {jobTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right mr-1">
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {candidateSkills.length === 0 ? "--%" : `${matchPercentage}%`}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Offer Readiness
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 rounded-xl gap-1.5 shadow-xs"
          >
            <span>{isOpen ? "Hide Diagnostic" : "Run Skill Diagnostic"}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Expanded Diagnostic Content */}
      {isOpen && (
        <div className="mt-5 pt-5 border-t border-slate-200 space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Skill Toggles bar */}
          <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="text-xs font-semibold text-slate-800">
                Select the skills you already know to recalculate your offer readiness:
              </div>
              <Link
                href="/dev-score"
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Zap className="h-3 w-3" /> Auto-sync from GitHub Dev Score
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {jobSkills.map((skill) => {
                const isSelected = candidateSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold shadow-2xs"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
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
            <div className="rounded-xl bg-white border border-emerald-200/80 p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Your Direct Strengths ({matchedSkills.length}/{jobSkills.length})
              </div>
              {matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 text-xs font-semibold"
                    >
                      {s} ✓
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Select your known skills above or connect your GitHub profile to see what matches.
                </div>
              )}
            </div>

            {/* Gaps */}
            <div className="rounded-xl bg-white border border-amber-200/80 p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Missing Gaps to Bridge ({missingSkills.length})
              </div>
              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 text-xs font-medium"
                    >
                      {s} (Gap)
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Zero skill gaps! You match all required skills for this role.
                </div>
              )}
            </div>
          </div>

          {/* 7-DAY PERSONALIZED SPRINT PLAN */}
          {candidateSkills.length > 0 && missingSkills.length > 0 && (
            <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Your Recommended 7-Day Sprint Plan:
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 text-[11px] shrink-0">
                    Day 1–2
                  </span>
                  <div>
                    <strong className="text-slate-900">Core Concept Sprint:</strong> Study{" "}
                    <span className="text-emerald-700 font-semibold">{missingSkills.slice(0, 2).join(", ")}</span>{" "}
                    architecture patterns & official documentation.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 text-[11px] shrink-0">
                    Day 3–4
                  </span>
                  <div>
                    <strong className="text-slate-900">Proof-of-Work Project:</strong> Build a mini service or full-stack component demonstrating{" "}
                    <span className="text-emerald-700 font-semibold">{missingSkills[0]}</span> integration.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 text-[11px] shrink-0">
                    Day 5–6
                  </span>
                  <div>
                    <strong className="text-slate-900">Live Deployment & Sandbox:</strong> Push code to GitHub and deploy a live demo to Vercel/Render so recruiters can test it in 1 click.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="rounded bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 text-[11px] shrink-0">
                    Day 7
                  </span>
                  <div>
                    <strong className="text-slate-900">Direct Application:</strong> Submit application with your verifiable GitHub repository & live demo link.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Link Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Skill recommendations are deterministic and based on employer job specs.</span>
            </div>
            <Link
              href={`/jobs/${jobSlug}/interview-prep`}
              className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline"
            >
              Practice AI Interview Questions for {jobTitle} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
