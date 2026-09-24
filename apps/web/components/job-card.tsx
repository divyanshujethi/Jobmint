"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShieldCheck, Bookmark, ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { calculateJobMatch } from "@repo/matching";
import { MatchScoreBadge } from "./match-score-badge";

interface JobCardProps {
  job: MockJob;
}

export function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState<{
    skills: string[];
    experienceYears?: number;
  } | null>(null);

  useEffect(() => {
    try {
      const savedDev = localStorage.getItem("jobmint_verified_dev_score");
      if (savedDev) {
        const parsed = JSON.parse(savedDev);
        if (Array.isArray(parsed.verifiedSkills) && parsed.verifiedSkills.length > 0) {
          setCandidateProfile({ skills: parsed.verifiedSkills, experienceYears: 0 });
          return;
        }
      }
      const savedSkills = localStorage.getItem("jobmint_candidate_skills");
      if (savedSkills) {
        const parsed = JSON.parse(savedSkills);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidateProfile({ skills: parsed, experienceYears: 0 });
          return;
        }
      }
    } catch {}
    setCandidateProfile(null);
  }, []);

  const matchResult = candidateProfile
    ? calculateJobMatch(
        {
          id: "active-candidate",
          skills: candidateProfile.skills,
          experienceYears: candidateProfile.experienceYears || 0,
          isFresher: true,
          location: "Remote",
          preferredWorkModes: [],
          preferredRoles: [],
          expectedSalaryMin: 0,
          educationField: "Computer Science",
          projects: [],
        },
        {
          id: job.id,
          title: job.title,
          requiredSkills: job.skills,
          experienceYears: job.experienceYears,
          workMode: job.workMode,
          location: job.location,
          jobType: job.jobType,
        }
      )
    : null;

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      {/* TOP ROW: COMPANY & TITLE */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Company Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-800 border border-slate-200 group-hover:border-emerald-200 transition-colors">
            {job.companyLogoInitial}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-600">
                {job.companyName}
              </span>
              {job.isVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {job.truthTeller.lastRecruiterActivity}
              </span>
            </div>

            <Link href={`/jobs/${job.slug}`}>
              <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {job.title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Match Badge & Save Bookmark Button */}
        <div className="flex items-center gap-2">
          {matchResult && (
            <MatchScoreBadge
              jobTitle={job.title}
              companyName={job.companyName}
              matchResult={matchResult}
            />
          )}

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`rounded-lg p-2 transition-colors ${
              isSaved
                ? "bg-emerald-50 text-emerald-600"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            }`}
            title={isSaved ? "Saved" : "Save Job"}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-emerald-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* WORK MODE, LOCATION & SALARY */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
          {job.workMode.replace("_", " ")}
        </span>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-800 font-bold">
          {job.salaryOrStipend}
        </span>
        <span className="flex items-center gap-1 text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" /> {job.location}
        </span>
      </div>

      {/* SKILL TAGS */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* CARD FOOTER: TRUTH TELLER & CTA */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3.5 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Posted {job.postedAgo}</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium">
            {job.truthTeller.reviewRate}% review rate
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.slug}`} className="w-full sm:w-auto">
            <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-semibold gap-1">
              View & Match <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
