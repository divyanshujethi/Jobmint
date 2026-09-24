"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MOCK_JOBS, MockJob } from "@/lib/mock-jobs";
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
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<MockJob[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>(CURRENT_CANDIDATE_PROFILE.skills);
  const [newSkillInput, setNewSkillInput] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.error("Error fetching live jobs for recommendations:", err));

    // Check if user has analyzed a resume or saved skills
    try {
      const saved = localStorage.getItem("jobmint_candidate_skills");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveSkills(parsed);
        }
      }
    } catch {}
  }, []);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !activeSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...activeSkills, trimmed];
      setActiveSkills(updated);
      try {
        localStorage.setItem("jobmint_candidate_skills", JSON.stringify(updated));
      } catch {}
    }
    setNewSkillInput("");
  };

  const removeSkill = (skill: string) => {
    const updated = activeSkills.filter((s) => s !== skill);
    setActiveSkills(updated);
    try {
      localStorage.setItem("jobmint_candidate_skills", JSON.stringify(updated));
    } catch {}
  };

  // Compute match for each live job using deterministic matching engine
  const matchedJobs = useMemo(() => {
    const dynamicProfile = {
      ...CURRENT_CANDIDATE_PROFILE,
      skills: activeSkills,
    };

    return jobs
      .map((job) => {
        const match = calculateJobMatch(dynamicProfile, {
          id: job.id,
          title: job.title,
          requiredSkills: job.skills,
          experienceYears: job.experienceYears,
          workMode: job.workMode,
          location: job.location,
          jobType: job.jobType,
        });
        return { job, match };
      })
      .sort((a, b) => b.match.totalScore - a.match.totalScore);
  }, [jobs, activeSkills]);

  const highMatches = matchedJobs.filter((item) => item.match.totalScore >= 80);
  const potentialMatches = matchedJobs.filter((item) => item.match.totalScore < 80);

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
          Ranked dynamically against live PostgreSQL database jobs using your verified skills. Click &quot;Why?&quot; on any card to inspect the mathematical breakdown.
        </p>

        {/* SKILLS CHIP TUNER */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Profile Skills (Edit to recalculate scores live):
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-persisted to your profile
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="rounded-full hover:bg-emerald-200/60 p-0.5 text-emerald-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSkill(newSkillInput);
              }}
              className="inline-flex items-center gap-1"
            >
              <input
                type="text"
                placeholder="+ Add skill..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                className="w-28 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 1: HIGH MATCHES */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900">
              High Compatibility (&ge; 80% Match)
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
          {highMatches.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No jobs currently match &ge; 80%. Try adding relevant skills above or check Close Matches below!
            </div>
          )}
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
                  Close Matches — Bridge the Gap
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                These roles match your profile well, but require one specific tool you haven&apos;t added yet.
              </p>
            </div>

            <Link href="/canvas">
              <Button variant="outline" size="sm" className="text-xs font-bold gap-1">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Visual Skill Canvas
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
