"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MockJob } from "@/lib/mock-jobs";
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
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Python",
  "Next.js",
  "Node.js",
  "SQL",
  "Tailwind CSS",
  "Git",
  "Docker",
  "AWS",
];

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<MockJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.error("Error fetching live jobs for recommendations:", err))
      .finally(() => setLoading(false));

    // Check if user has analyzed a resume or saved skills
    try {
      const savedDev = localStorage.getItem("jobmint_verified_dev_score");
      if (savedDev) {
        const parsed = JSON.parse(savedDev);
        if (Array.isArray(parsed.verifiedSkills) && parsed.verifiedSkills.length > 0) {
          setActiveSkills(parsed.verifiedSkills);
          return;
        }
      }
      const saved = localStorage.getItem("jobmint_candidate_skills");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveSkills(parsed);
          return;
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
    if (activeSkills.length === 0) return [];

    const dynamicProfile = {
      id: "candidate-live",
      skills: activeSkills,
      experienceYears: 0,
      isFresher: true,
      projects: [],
      location: "Bangalore / Remote",
      preferredWorkModes: [],
      preferredRoles: [],
      expectedSalaryMin: 0,
      educationField: "Computer Science",
    };

    return jobs
      .map((job) => {
        const result = calculateJobMatch(dynamicProfile, {
          id: job.id,
          title: job.title,
          requiredSkills: job.skills,
          experienceYears: job.experienceYears,
          workMode: job.workMode,
          location: job.location,
          jobType: job.jobType,
        });
        return { job, result };
      })
      .sort((a, b) => b.result.totalScore - a.result.totalScore);
  }, [jobs, activeSkills]);

  const highMatches = matchedJobs.filter((m) => m.result.totalScore >= 75);
  const potentialMatches = matchedJobs.filter(
    (m) => m.result.totalScore >= 50 && m.result.totalScore < 75
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Explainable Candidate Compatibility
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Personalized Recommendations
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ranked in real time based on your verified tech stack. Zero hallucination.
        </p>
      </div>

      {/* SKILL FILTER BAR */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Active Skill Matrix
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                {activeSkills.length} selected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Add or remove skills to recalibrate your personalized matches in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dev-score"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              <Zap className="h-3.5 w-3.5" /> Sync from GitHub Dev Score
            </Link>
          </div>
        </div>

        {/* ACTIVE PILLS */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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

        {/* POPULAR QUICK-ADD SUGGESTIONS IF FEW SKILLS */}
        {activeSkills.length < 5 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Quick add:</span>
            {POPULAR_SKILLS.filter(
              (ps) => !activeSkills.some((s) => s.toLowerCase() === ps.toLowerCase())
            )
              .slice(0, 6)
              .map((ps) => (
                <button
                  key={ps}
                  type="button"
                  onClick={() => addSkill(ps)}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-[11px]"
                >
                  + {ps}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* MATCHED JOBS DISPLAY */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading live opportunities...</p>
        </div>
      ) : activeSkills.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Target className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Select Your Tech Stack Above
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Add your technical skills above or connect your GitHub profile to unlock your personalized job compatibility rankings.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => {
                ["React", "TypeScript", "Next.js"].forEach(addSkill);
              }}
              className="text-xs font-bold"
            >
              Load Full-Stack Stack
            </Button>
            <Link href="/dev-score">
              <Button size="sm" variant="outline" className="text-xs font-bold gap-1">
                <Zap className="h-3 w-3 text-emerald-600" /> Verify Dev Score
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* SECTION 1: HIGH MATCHES */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-xl font-bold text-slate-900">
                  High Compatibility (&ge; 75% Match)
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
                  No jobs currently match &ge; 75%. Try adding relevant skills above or check Close Matches below!
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: CLOSE MATCHES */}
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
        </>
      )}
    </div>
  );
}
