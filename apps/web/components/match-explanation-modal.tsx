"use client";

import Link from "next/link";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MatchResult } from "@repo/matching";
import { getLearningGuideForSkill } from "@repo/shared";
import { Button } from "./ui/button";

interface MatchExplanationModalProps {
  jobTitle: string;
  companyName: string;
  matchResult: MatchResult;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchExplanationModal({
  jobTitle,
  companyName,
  matchResult,
  isOpen,
  onClose,
}: MatchExplanationModalProps) {
  if (!isOpen) return null;

  const { totalScore, breakdown, matchedSkills, missingSkills } = matchResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Explainable Match Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Why you matched {totalScore}%
          </h2>
          <p className="text-xs text-slate-500">
            For {jobTitle} at {companyName}
          </p>
        </div>

        {/* BIG SCORE CARD */}
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-900 block">
              Overall Candidate Compatibility
            </span>
            <span className="text-xs text-emerald-700">
              Computed mathematically without hallucination
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {totalScore}%
          </div>
        </div>

        {/* 6-COMPONENT SCORE BREAKDOWN */}
        <div className="mt-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Scoring Formula Breakdown
          </span>

          <div className="space-y-2 text-xs">
            {/* Skills */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Technical Skills (Max 35)</span>
                <span className="font-bold text-slate-900">{breakdown.skills.score} / 35 pts</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(breakdown.skills.score / 35) * 100}%` }}
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Experience Level (Max 20)</span>
                <span className="font-bold text-slate-900">{breakdown.experience.score} / 20 pts</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(breakdown.experience.score / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* Projects */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Project Portfolio (Max 15)</span>
                <span className="font-bold text-slate-900">{breakdown.projects.score} / 15 pts</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(breakdown.projects.score / 15) * 100}%` }}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Location & Work Mode (Max 10)</span>
                <span className="font-bold text-slate-900">{breakdown.location.score} / 10 pts</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(breakdown.location.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Education (Max 10)</span>
                <span className="font-bold text-slate-900">{breakdown.education.score} / 10 pts</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(breakdown.education.score / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Preferences */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Role Preferences (Max 10)</span>
                <span className="font-bold text-slate-900">{breakdown.preferences.score} / 10 pts</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(breakdown.preferences.score / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MATCHED & MISSING SKILLS */}
        <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
          <div>
            <span className="text-xs font-bold text-emerald-800 block mb-1">
              ✓ Skills You Match:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {missingSkills.length > 0 && (
            <div>
              <span className="text-xs font-bold text-amber-800 block mb-1">
                ⚠ Missing Skills to Learn:
              </span>
              <div className="space-y-2">
                {missingSkills.map((s) => {
                  const guide = getLearningGuideForSkill(s.toLowerCase());
                  return (
                    <div
                      key={s}
                      className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 text-xs text-slate-700 flex items-center justify-between"
                    >
                      <span className="font-bold text-amber-900">{s}</span>
                      {guide && (
                        <Link
                          href={`/roadmaps/${guide.roadmapSlug}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          <BookOpen className="h-3 w-3" /> Learn Free →
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100">
          <Button onClick={onClose} className="w-full font-bold">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
