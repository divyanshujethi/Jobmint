"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { MatchResult } from "@repo/matching";
import { MatchExplanationModal } from "./match-explanation-modal";

interface MatchScoreBadgeProps {
  jobTitle: string;
  companyName: string;
  matchResult: MatchResult;
}

export function MatchScoreBadge({
  jobTitle,
  companyName,
  matchResult,
}: MatchScoreBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const score = matchResult.totalScore;

  const colorClass =
    score >= 85
      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
      : score >= 70
      ? "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100"
      : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100";

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold transition-transform active:scale-95 ${colorClass}`}
        title="Click to see explainable match score breakdown"
      >
        <span>🔥 {score}% Match</span>
        <span className="text-[10px] underline font-medium opacity-80">Why?</span>
      </button>

      <MatchExplanationModal
        jobTitle={jobTitle}
        companyName={companyName}
        matchResult={matchResult}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
