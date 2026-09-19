"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { CURRENT_CANDIDATE_PROFILE } from "@/lib/candidate-profile";
import { calculateJobMatch } from "@repo/matching";
import { JobCard } from "@/components/job-card";
import {
  Sparkles,
  TrendingUp,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
  // Compute match for each job and sort descending
  const matchedJobs = useMemo(() => {
    return MOCK_JOBS.map((job) => {
      const match = calculateJobMatch(CURRENT_CANDIDATE_PROFILE, {
        id: job.id,
        title: job.title,
        requiredSkills: job.skills,
        experienceYears: job.experienceYears,
        workMode: job.workMode,
        location: job.location,
        jobType: job.jobType,
      });
      return { job, match };
    }).sort((a, b) => b.match.totalScore - a.match.totalScore);
  }, []);

  const highMatches = matchedJobs.filter((item) => item.match.totalScore >= 85);
  const potentialMatches = matchedJobs.filter(
    (item) => item.match.totalScore < 85
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
          <Zap className="h-3.5 w-3.5 text-emerald-600" /> Deterministic Matching Engine
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Personalized Recommendations
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ranked using your verified skills, experience, and project portfolio. Click &quot;Why?&quot; on any card to see the mathematical formula.
        </p>
      </div>

      {/* SECTION 1: HIGH MATCHES */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900">
              High Compatibility (&ge; 85% Match)
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            {highMatches.length} Opportunities
          </span>
        </div>

        <div className="space-y-4">
          {highMatches.map(({ job }) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* SECTION 2: CLOSE MATCHES — BRIDGE THE GAP */}
      {potentialMatches.length > 0 && (
        <div className="mt-12 space-y-4 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">
                  Close Matches — Learn 1 or 2 Skills to Reach 90%+
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                These roles match your profile well, but require one specific tool you haven&apos;t added yet.
              </p>
            </div>

            <Link href="/roadmaps">
              <Button variant="outline" size="sm" className="text-xs font-bold gap-1">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Free Roadmaps
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {potentialMatches.map(({ job }) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
