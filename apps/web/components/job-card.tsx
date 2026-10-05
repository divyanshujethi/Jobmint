"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShieldCheck, Bookmark, ArrowRight, Clock, MapPin, Sparkles, ExternalLink, Zap, MessageCircle } from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { calculateJobMatch } from "@repo/matching";
import { detectJobPlatform, sanitizeExternalJobUrl } from "@repo/shared";
import { MatchScoreBadge } from "./match-score-badge";
import {
  CandidateIntelProfile,
  loadCandidateIntel,
  scoreJobForCandidate,
} from "@/lib/candidate-intelligence";

interface JobCardProps {
  job: MockJob;
  candidateIntel?: CandidateIntelProfile;
}

export function JobCard({ job, candidateIntel }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeIntel, setActiveIntel] = useState<CandidateIntelProfile | null>(
    candidateIntel || null
  );

  useEffect(() => {
    if (candidateIntel) {
      setActiveIntel(candidateIntel);
    } else {
      setActiveIntel(loadCandidateIntel());
    }
  }, [candidateIntel]);

  const candidateProfile = activeIntel
    ? {
        skills: activeIntel.skills,
        experienceYears: activeIntel.experienceLevel === "FRESHER" ? 0 : 2,
      }
    : null;

  const intelScore = activeIntel ? scoreJobForCandidate(job, activeIntel) : null;

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

  const userSkillsLower = new Set((activeIntel?.skills || []).map((s) => s.toLowerCase().trim()));
  const safeSourceUrl = sanitizeExternalJobUrl(job.sourceUrl);
  const platformInfo = detectJobPlatform(safeSourceUrl, job.companyName);

  return (
    <div
      className={`group relative rounded-xl border p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
        job.isFeatured
          ? "border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/50 hover:border-amber-400"
          : intelScore && intelScore.totalScore >= 85
          ? "border-emerald-300/90 bg-emerald-50/15 ring-1 ring-emerald-300/40 hover:border-emerald-400"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* TOP ROW: COMPANY & TITLE */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Company Avatar / Real Logo */}
          {job.companyLogoUrl && !imageError ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 border border-slate-200 group-hover:border-emerald-200 transition-colors shadow-xs overflow-hidden">
              <img
                src={job.companyLogoUrl}
                alt={`${job.companyName} logo`}
                className="h-full w-full object-contain rounded-lg"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white border-0 group-hover:brightness-110 transition-all shadow-sm"
              style={{ background: job.companyLogoColor || "#10b981" }}
            >
              {job.companyLogoInitial}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-black shadow-xs">
                  <Sparkles className="h-3 w-3 fill-slate-950" />
                  Featured
                </span>
              )}
              <span className="text-xs font-semibold text-slate-600">
                {job.companyName}
              </span>
              {job.isVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified
                </span>
              )}
              {job.sourceUrl ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Official Career Portal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {job.truthTeller.lastRecruiterActivity}
                </span>
              )}
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
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl p-2.5 transition-colors touch-manipulation ${
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

        {intelScore && intelScore.summary && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/60 ml-auto">
            <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600" />
            {intelScore.summary}
          </span>
        )}
      </div>

      {/* SKILL TAGS (HIGHLIGHT CANDIDATE MATCHES) */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.map((skill) => {
          const isMatched = userSkillsLower.has(skill.toLowerCase().trim());
          return (
            <span
              key={skill}
              className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                isMatched
                  ? "border-emerald-300 bg-emerald-100/70 text-emerald-950 font-bold shadow-2xs"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {isMatched && <span className="text-emerald-700 mr-1">✓</span>}
              {skill}
            </span>
          );
        })}
      </div>

      {/* CARD FOOTER: TRUTH TELLER & CTA */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3.5 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Posted {job.postedAgo}</span>
          <span>•</span>
          {safeSourceUrl ? (
            <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md border text-[11px] ${platformInfo.badgeClass}`}>
              <ShieldCheck className="h-3 w-3" />
              {platformInfo.badgeLabel}
            </span>
          ) : job.truthTeller.reviewRate > 0 ? (
            <span className="text-emerald-700 font-medium">
              {job.truthTeller.reviewRate}% review rate
            </span>
          ) : (
            <span className="text-slate-600 font-medium">
              Direct Role Nest Opening
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {safeSourceUrl && (
            <a
              href={safeSourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`inline-flex items-center gap-1.5 rounded-lg font-bold text-xs px-3 py-2 shadow-xs transition-colors shrink-0 ${platformInfo.buttonClass}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span>{platformInfo.applyButtonLabel}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = `https://rolenest.in/jobs/${job.slug}?ref=share_card_wa`;
              const text = encodeURIComponent(`🔥 ${job.title} at ${job.companyName} (${job.salaryOrStipend}) with direct ATS link on Role Nest: ${url}`);
              window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
            title="Share opening on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
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
