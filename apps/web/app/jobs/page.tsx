"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  Sparkles,
  X,
  ShieldCheck,
  Building2,
  Zap,
  Layers,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  FileText,
  Phone,
  AlertCircle,
} from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { InstantAlertsBanner } from "@/components/instant-alerts-modal";
import { JobType, WorkMode } from "@repo/shared";
import {
  CandidateIntelProfile,
  DEFAULT_INTEL_PROFILE,
  loadCandidateIntel,
  interleaveJobsByCompany,
  groupJobsByCompany,
  scoreJobForCandidate,
} from "@/lib/candidate-intelligence";
import { CandidateIntelBar } from "@/components/candidate-intel-bar";
import { CompanyJobGroupCard } from "@/components/company-job-group-card";
import { SpotlightSearch, useSpotlight } from "@/components/spotlight-search";
import { RoloMascot } from "@/components/rolo-mascot";
import { ScrollToTop } from "@/components/scroll-to-top";

type ViewMode = "DIVERSIFIED" | "COMPANY_GROUPED" | "RECOMMENDED";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
  const [selectedExp, setSelectedExp] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [jobs, setJobs] = useState<MockJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 15;

  // Spotlight search (Cmd/Ctrl+K or "/" shortcut)
  const spotlight = useSpotlight();

  // Candidate Intelligence System state
  const [intelProfile, setIntelProfile] = useState<CandidateIntelProfile>(DEFAULT_INTEL_PROFILE);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("DIVERSIFIED");

  useEffect(() => {
    // Load candidate intelligence profile from local storage or verified dev score
    setIntelProfile(loadCandidateIntel());

    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.profile) {
          setCandidateProfile(data.profile);
        }
      })
      .catch(() => {});

    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.error("Error loading live jobs:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filtered jobs based on user's query and filter chips
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.companyName.toLowerCase().includes(query);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(query));
        const matchesLocation = job.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      // Job Type
      if (selectedType !== "ALL" && job.jobType !== selectedType) {
        return false;
      }

      // Work Mode
      if (selectedMode !== "ALL") {
        const targetMode = selectedMode.toUpperCase().replace(/[-_]/g, "");
        const jMode = (job.workMode || "").toUpperCase().replace(/[-_]/g, "");
        if (targetMode === "ONSITE") {
          if (!jMode.includes("ONSITE") && !jMode.includes("OFFICE")) return false;
        } else if (targetMode === "REMOTE") {
          if (!jMode.includes("REMOTE")) return false;
        } else if (targetMode === "HYBRID") {
          if (!jMode.includes("HYBRID")) return false;
        } else if (job.workMode !== selectedMode) {
          return false;
        }
      }

      // Experience Level
      if (selectedExp !== "ALL") {
        const exp = job.experienceYears ?? 0;
        if (selectedExp === "0" || selectedExp === "FRESHER") {
          if (exp > 0 && job.jobType !== JobType.INTERNSHIP) return false;
        } else if (selectedExp === "1-2") {
          if (exp < 1 || exp > 2) return false;
        } else if (selectedExp === "3-5") {
          if (exp < 3 || exp > 5) return false;
        } else if (selectedExp === "5+") {
          if (exp < 5) return false;
        }
      }

      // Location Filter
      if (selectedLocation !== "ALL") {
        const jLoc = (job.location || "").toLowerCase();
        const loc = selectedLocation.toLowerCase();
        if (loc === "bengaluru") {
          if (!jLoc.includes("bengaluru") && !jLoc.includes("bangalore")) return false;
        } else if (loc === "delhi_ncr") {
          if (!jLoc.includes("delhi") && !jLoc.includes("noida") && !jLoc.includes("gurgaon") && !jLoc.includes("gurugram") && !jLoc.includes("ncr")) return false;
        } else if (loc === "tricity") {
          if (!jLoc.includes("chandigarh") && !jLoc.includes("mohali") && !jLoc.includes("panchkula") && !jLoc.includes("tricity")) return false;
        } else if (loc === "dehradun") {
          if (!jLoc.includes("dehradun")) return false;
        } else if (loc === "hyderabad") {
          if (!jLoc.includes("hyderabad")) return false;
        } else if (loc === "pune") {
          if (!jLoc.includes("pune")) return false;
        } else if (loc === "mumbai") {
          if (!jLoc.includes("mumbai")) return false;
        } else if (loc === "chennai") {
          if (!jLoc.includes("chennai")) return false;
        } else if (loc === "ahmedabad") {
          if (!jLoc.includes("ahmedabad") && !jLoc.includes("gandhinagar")) return false;
        } else if (loc === "kolkata") {
          if (!jLoc.includes("kolkata")) return false;
        } else if (loc === "jaipur") {
          if (!jLoc.includes("jaipur")) return false;
        } else if (loc === "indore") {
          if (!jLoc.includes("indore")) return false;
        } else if (loc === "kochi") {
          if (!jLoc.includes("kochi") && !jLoc.includes("cochin") && !jLoc.includes("kerala")) return false;
        } else if (loc === "remote") {
          const jMode = (job.workMode || "").toUpperCase();
          if (!jMode.includes("REMOTE") && !jLoc.includes("remote")) return false;
        } else if (loc === "india") {
          if (!jLoc.includes("india")) return false;
        } else if (!jLoc.includes(loc)) {
          return false;
        }
      }

      // Only Verified Companies
      if (onlyVerified && !job.isVerified) {
        return false;
      }

      return true;
    });
  }, [jobs, searchTerm, selectedType, selectedMode, selectedExp, selectedLocation, onlyVerified]);

  // Diversified Feed: Interleaved round-robin by company so no 20 GitLab / 10 MongoDB in a row
  const diversifiedJobs = useMemo(() => {
    return interleaveJobsByCompany(filteredJobs);
  }, [filteredJobs]);

  // Recommended Jobs: Filtered for score >= 60%, sorted highest score first
  const recommendedJobsWithScores = useMemo(() => {
    return filteredJobs
      .map((job) => ({
        job,
        scoreInfo: scoreJobForCandidate(job, intelProfile),
      }))
      .filter(({ scoreInfo }) => scoreInfo.totalScore >= 55)
      .sort((a, b) => b.scoreInfo.totalScore - a.scoreInfo.totalScore);
  }, [filteredJobs, intelProfile]);

  // Grouped by Company
  const companyGroups = useMemo(() => {
    return groupJobsByCompany(filteredJobs, intelProfile);
  }, [filteredJobs, intelProfile]);

  // Top AI Recommendations (Top 3 for carousel/banner)
  const topAIRecommendations = useMemo(() => {
    return recommendedJobsWithScores.slice(0, 3);
  }, [recommendedJobsWithScores]);

  // Reset pagination to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedMode, selectedExp, selectedLocation, onlyVerified, viewMode]);

  // Paginated Diversified Jobs
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return diversifiedJobs.slice(start, start + PAGE_SIZE);
  }, [diversifiedJobs, currentPage]);

  const totalPages = Math.max(1, Math.ceil(diversifiedJobs.length / PAGE_SIZE));

  // Paginated Recommended Jobs
  const paginatedRecommended = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return recommendedJobsWithScores.slice(start, start + PAGE_SIZE);
  }, [recommendedJobsWithScores, currentPage]);

  const totalRecommendedPages = Math.max(1, Math.ceil(recommendedJobsWithScores.length / PAGE_SIZE));

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedType !== "ALL" ||
    selectedMode !== "ALL" ||
    selectedExp !== "ALL" ||
    selectedLocation !== "ALL" ||
    onlyVerified;

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedType("ALL");
    setSelectedMode("ALL");
    setSelectedExp("ALL");
    setSelectedLocation("ALL");
    setOnlyVerified(false);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Spotlight Search Modal — Cmd/Ctrl+K */}
      <SpotlightSearch
        jobs={jobs}
        isOpen={spotlight.isOpen}
        onClose={spotlight.close}
      />

      {/* Floating Scroll to Top Arrow Button */}
      <ScrollToTop className="bottom-36 right-5 md:bottom-28 md:right-9" />

      {/* Rolo interactive floating mascot */}
      <RoloMascot
        floating
        onQuickFilter={(f) => {
          if (f.exp !== undefined) setSelectedExp(f.exp);
          if (f.mode !== undefined) setSelectedMode(f.mode);
          if (f.search !== undefined) setSearchTerm(f.search);
          if (f.type !== undefined) setSelectedType(f.type);
          setCurrentPage(1);
        }}
      />

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Verified Indian engineering roles &amp; remote global teams with honest recruiter stats.
          </p>
        </div>

        {/* SPOTLIGHT SEARCH TRIGGER */}
        <button
          type="button"
          onClick={spotlight.open}
          className="group flex items-center gap-2 w-full md:w-80 rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm text-slate-400 shadow-2xs hover:border-emerald-400 hover:shadow-emerald-100/60 hover:shadow-md transition-all"
        >
          <Search className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
          <span className="flex-1 text-left text-sm text-slate-400">Search jobs, skills, companies…</span>
          <kbd className="shrink-0 hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* CANDIDATE INTELLIGENCE SYSTEM BAR */}
      <CandidateIntelBar
        profile={intelProfile}
        onChange={setIntelProfile}
        totalMatchedRoles={recommendedJobsWithScores.length}
      />

      {/* QUICK CANDIDATE 1-CLICK SEARCH CHIPS */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-emerald-600" /> Quick Filter:
        </span>
        {[
          { label: "🏛️ Govt & PSU Tech", href: "/gov-tech" },
          { label: "📍 Chandigarh / Tricity", action: () => setSelectedLocation("tricity") },
          { label: "📍 Dehradun", action: () => setSelectedLocation("dehradun") },
          { label: "🇮🇳 Bengaluru", action: () => setSelectedLocation("bengaluru") },
          { label: "📍 Delhi NCR", action: () => setSelectedLocation("delhi_ncr") },
          { label: "📍 Hyderabad", action: () => setSelectedLocation("hyderabad") },
          { label: "📍 Pune", action: () => setSelectedLocation("pune") },
          { label: "🌐 Remote India", action: () => { setSelectedMode(WorkMode.REMOTE); setSelectedLocation("india"); } },
          { label: "🎓 Freshers (0 YOE)", action: () => setSelectedExp("0") },
          { label: "🚀 Startups", action: () => setSearchTerm("Startup") },
          { label: "React / Next.js", action: () => setSearchTerm("React") },
          { label: "Python / AI", action: () => setSearchTerm("Python") },
          { label: "Internships", action: () => setSelectedType(JobType.INTERNSHIP) },
        ].map((chip) =>
          chip.href ? (
            <Link
              key={chip.label}
              href={chip.href}
              className="rounded-full bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1 text-[11px] font-bold text-emerald-900 transition-colors"
            >
              {chip.label}
            </Link>
          ) : (
            <button
              key={chip.label}
              type="button"
              onClick={chip.action}
              className="rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              {chip.label}
            </button>
          )
        )}
      </div>

      {/* CANDIDATE PROFILE COMPLETION BANNER (Shown when user has not yet uploaded their resume) */}
      {candidateProfile && !candidateProfile.hasResume && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/60 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Profile {candidateProfile.completionPercent || 25}% Complete
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified Candidate Readiness
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Upload your resume to unlock Real AI ATS Match Scoring
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                We calculate honest, transparent match scores against real job descriptions. Since you haven&apos;t uploaded your resume yet, upload your CV or add your phone number so verified recruiters can reach you.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
              <Link href="/profile/resume">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Upload Resume →
                </Button>
              </Link>
              {!candidateProfile.hasPhone && (
                <Link href="/settings/account">
                  <Button variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 font-semibold text-xs h-9 px-3 rounded-xl">
                    <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Add Mobile
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Missing Checklist Pills */}
          {candidateProfile.missingFields && candidateProfile.missingFields.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60 text-xs">
              <span className="text-[11px] font-bold text-slate-500">Missing steps:</span>
              {candidateProfile.missingFields.map((field: string) => (
                <span key={field} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200/80 text-[11px] text-slate-700 font-medium">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  {field}
                </span>
              ))}
            </div>
          )}

          {/* Completion Progress Bar */}
          <div className="w-full bg-emerald-200/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${candidateProfile.completionPercent || 25}%` }}
            />
          </div>
        </div>
      )}

      {/* TOP AI PICKS HIGHLIGHT BANNER (Only when relevant matches exist and candidate has real profile/resume) */}
      {(candidateProfile?.hasResume || !candidateProfile) && topAIRecommendations.length > 0 && viewMode !== "COMPANY_GROUPED" && (
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/70 via-orange-50/30 to-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
                <Flame className="h-4 w-4 fill-white text-white" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  Top AI Matches For You
                  <span className="rounded-full bg-amber-200 text-amber-950 px-2 py-0.2 text-[10px] font-black">
                    85%+ FIT
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600">
                  Calculated against your verified skills: {intelProfile.skills.slice(0, 4).join(", ")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("RECOMMENDED")}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Recommended ({recommendedJobsWithScores.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {topAIRecommendations.map(({ job, scoreInfo }) => (
              <div
                key={job.id}
                className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600 truncate">
                      {job.companyName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black shrink-0">
                      {scoreInfo.badgeLabel}
                    </span>
                  </div>
                  <Link href={`/jobs/${job.slug}`}>
                    <h4 className="mt-1 text-xs sm:text-sm font-extrabold text-slate-900 hover:text-emerald-700 line-clamp-1">
                      {job.title}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {job.location} • {job.salaryOrStipend}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold truncate max-w-[150px]">
                    {scoreInfo.summary}
                  </span>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-[11px] font-extrabold text-emerald-700 hover:underline shrink-0"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE SWITCHER & COUNTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Toggle Pills: Recommended vs Diversified vs Grouped */}
        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-100/80 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode("DIVERSIFIED")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "DIVERSIFIED"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List className="h-3.5 w-3.5 text-slate-500" />
            <span>Feed View (Diversified)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("COMPANY_GROUPED")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "COMPANY_GROUPED"
                ? "bg-white text-emerald-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Group by Company ({companyGroups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("RECOMMENDED")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === "RECOMMENDED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Recommended for You ({recommendedJobsWithScores.length})</span>
          </button>
        </div>

        {/* Results count & Reset */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">
            Showing{" "}
            <strong className="text-slate-900">
              {viewMode === "COMPANY_GROUPED"
                ? `${companyGroups.length} companies (${filteredJobs.length} roles)`
                : viewMode === "RECOMMENDED"
                ? `${recommendedJobsWithScores.length} matched roles`
                : `${filteredJobs.length} roles`}
            </strong>
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline ml-2 cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
        {/* Row 1: Job Types & Quick Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`min-h-[38px] inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation cursor-pointer ${
                selectedType === "ALL"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Opportunities ({jobs.length})
            </button>
            <button
              onClick={() => setSelectedType(JobType.INTERNSHIP)}
              className={`min-h-[38px] inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation cursor-pointer ${
                selectedType === JobType.INTERNSHIP
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Internships
            </button>
            <button
              onClick={() => setSelectedType(JobType.FULL_TIME)}
              className={`min-h-[38px] inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation cursor-pointer ${
                selectedType === JobType.FULL_TIME
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Full-Time Roles
            </button>
          </div>
        </div>

        {/* Row 2: Detailed Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100">
          {/* Experience Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Experience Level
            </label>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Experience</option>
              <option value="0">Fresher / 0 Years (Entry Level)</option>
              <option value="1-2">1–2 Years Experience</option>
              <option value="3-5">3–5 Years Experience</option>
              <option value="5+">5+ Years Experience</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Location / City
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Location</option>
              <option value="tricity">Chandigarh / Tricity (Mohali & Panchkula)</option>
              <option value="dehradun">Dehradun</option>
              <option value="bengaluru">Bengaluru / Bangalore</option>
              <option value="delhi_ncr">Delhi NCR (Gurgaon / Noida)</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="mumbai">Mumbai</option>
              <option value="chennai">Chennai</option>
              <option value="ahmedabad">Ahmedabad / Gandhinagar</option>
              <option value="kolkata">Kolkata</option>
              <option value="jaipur">Jaipur</option>
              <option value="indore">Indore</option>
              <option value="kochi">Kochi / Kerala</option>
              <option value="remote">Remote (India & Worldwide)</option>
              <option value="india">All India (Pan-India)</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Work Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Any Work Mode</option>
              <option value={WorkMode.REMOTE}>Remote</option>
              <option value={WorkMode.HYBRID}>Hybrid</option>
              <option value={WorkMode.ON_SITE}>On-Site (Office)</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="flex flex-col justify-end">
            <label className="min-h-[40px] inline-flex items-center gap-2.5 cursor-pointer font-semibold text-xs text-slate-700 select-none px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Companies Only</span>
            </label>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Active:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Keyword: &quot;{searchTerm}&quot;
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSearchTerm("")} />
              </span>
            )}
            {selectedType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Type: {selectedType.replace("_", " ")}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedType("ALL")} />
              </span>
            )}
            {selectedExp !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Exp: {selectedExp === "0" ? "Fresher" : `${selectedExp} Yrs`}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedExp("ALL")} />
              </span>
            )}
            {selectedLocation !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Location: {selectedLocation === "tricity" ? "Chandigarh / Tricity" : selectedLocation === "delhi_ncr" ? "Delhi NCR" : selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedLocation("ALL")} />
              </span>
            )}
            {selectedMode !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Mode: {selectedMode.replace("_", " ")}
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setSelectedMode("ALL")} />
              </span>
            )}
            {onlyVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
                Verified Only
                <X className="h-3 w-3 cursor-pointer hover:text-emerald-950" onClick={() => setOnlyVerified(false)} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* JOBS CONTENT: DIVERSIFIED FEED, GROUPED BY COMPANY, OR RECOMMENDED */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-5 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "COMPANY_GROUPED" ? (
          /* COMPANY GROUPED VIEW */
          companyGroups.length > 0 ? (
            <div className="space-y-4">
              {companyGroups.map((group, idx) => (
                <CompanyJobGroupCard
                  key={group.companyName}
                  group={group}
                  defaultExpanded={idx === 0}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No companies match your filters
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your location or work mode filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetAllFilters}>
                Reset Filters
              </Button>
            </div>
          )
        ) : viewMode === "RECOMMENDED" ? (
          /* RECOMMENDED VIEW (High Match Scores Only) */
          recommendedJobsWithScores.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedRecommended.map(({ job }) => (
                  <JobCard key={job.id} job={job} candidateIntel={intelProfile} />
                ))}
              </div>

              {/* Recommended Pagination Bar */}
              {totalRecommendedPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="font-mono font-medium">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, recommendedJobsWithScores.length)}</span> of{" "}
                    <span className="font-bold text-slate-900">{recommendedJobsWithScores.length}</span> high-match roles
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalRecommendedPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalRecommendedPages || Math.abs(p - currentPage) <= 1)
                        .map((pageNumber, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const isEllipsis = prevPage && pageNumber - prevPage > 1;
                          return (
                            <div key={pageNumber} className="flex items-center gap-1">
                              {isEllipsis && <span className="px-1 text-slate-400">...</span>}
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNumber);
                                  window.scrollTo({ top: 380, behavior: "smooth" });
                                }}
                                className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer ${
                                  currentPage === pageNumber
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalRecommendedPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalRecommendedPages, p + 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Zap className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No high-match roles for this stack combination
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try adding more skills in the Candidate Intelligence Bar above or switch to Diversified Feed.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setViewMode("DIVERSIFIED")}
              >
                Show All Opportunities
              </Button>
            </div>
          )
        ) : (
          /* DIVERSIFIED FEED VIEW (Round-Robin Interleaved) */
          diversifiedJobs.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} candidateIntel={intelProfile} />
                ))}
              </div>

              {/* Diversified Feed Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="font-mono font-medium">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, diversifiedJobs.length)}</span> of{" "}
                    <span className="font-bold text-slate-900">{diversifiedJobs.length}</span> opportunities
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((pageNumber, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const isEllipsis = prevPage && pageNumber - prevPage > 1;
                          return (
                            <div key={pageNumber} className="flex items-center gap-1">
                              {isEllipsis && <span className="px-1 text-slate-400">...</span>}
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNumber);
                                  window.scrollTo({ top: 380, behavior: "smooth" });
                                }}
                                className={`h-8 w-8 rounded-xl font-bold transition-all cursor-pointer ${
                                  currentPage === pageNumber
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-base font-bold text-slate-800">
                No matching opportunities found
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search terms or clearing work mode filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetAllFilters}>
                Reset Filters
              </Button>
            </div>
          )
        )}
      </div>

      {/* TRUTH TELLER GUARANTEE CALLOUT */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white px-4 py-3 text-xs text-emerald-950 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-emerald-900 font-mono flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Truth Teller Standard:
          </span>
          <span className="text-slate-700">
            Direct application tracking with real-time status updates and zero recruiter ghosting.
          </span>
        </div>
        <Link
          href="/transparency"
          className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 flex items-center gap-1"
        >
          Anti-Ghosting Ledger &rarr;
        </Link>
      </div>

      {/* INSTANT WHATSAPP & TELEGRAM ALERTS */}
      <InstantAlertsBanner />
    </div>
    </>
  );
}
