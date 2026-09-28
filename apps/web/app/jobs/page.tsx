"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, Briefcase, Sparkles, X, ShieldCheck } from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { InstantAlertsBanner } from "@/components/instant-alerts-modal";
import { JobType, WorkMode } from "@repo/shared";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
  const [selectedExp, setSelectedExp] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [jobs, setJobs] = useState<MockJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

      // Work Mode (normalizing REMOTE, HYBRID, ONSITE/ON_SITE)
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
        } else if (loc === "hyderabad") {
          if (!jLoc.includes("hyderabad")) return false;
        } else if (loc === "pune") {
          if (!jLoc.includes("pune")) return false;
        } else if (loc === "mumbai") {
          if (!jLoc.includes("mumbai")) return false;
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
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Discover verified jobs and internships with honest activity stats.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, skill, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* QUICK CANDIDATE 1-CLICK SEARCH CHIPS */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-emerald-600" /> Quick Filter:
        </span>
        {[
          { label: "🇮🇳 Bengaluru", action: () => setSelectedLocation("bengaluru") },
          { label: "🌐 Remote India", action: () => { setSelectedMode(WorkMode.REMOTE); setSelectedLocation("india"); } },
          { label: "🎓 Freshers (0 YOE)", action: () => setSelectedExp("0") },
          { label: "🚀 Startups", action: () => setSearchTerm("Startup") },
          { label: "React / Next.js", action: () => setSearchTerm("React") },
          { label: "Python / AI", action: () => setSearchTerm("Python") },
          { label: "Golang", action: () => setSearchTerm("Go") },
          { label: "Internships", action: () => setSelectedType(JobType.INTERNSHIP) },
          { label: "Delhi NCR", action: () => setSelectedLocation("delhi_ncr") },
          { label: "Hyderabad", action: () => setSelectedLocation("hyderabad") },
        ].map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={chip.action}
            className="rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* TRUTH TELLER GUARANTEE CALLOUT */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white px-4 py-2.5 text-xs text-emerald-950 shadow-2xs">
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
          Anti-Ghosting Ledger →
        </Link>
      </div>

      {/* INSTANT WHATSAPP & TELEGRAM ALERTS */}
      <InstantAlertsBanner />

      {/* FILTER CONTROLS BAR */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
        {/* Row 1: Job Types & Quick Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedType("ALL")}
              className={`min-h-[38px] inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation ${
                selectedType === "ALL"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Opportunities ({jobs.length})
            </button>
            <button
              onClick={() => setSelectedType(JobType.INTERNSHIP)}
              className={`min-h-[38px] inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation ${
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
              className={`min-h-[38px] inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors touch-manipulation ${
                selectedType === JobType.FULL_TIME
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Full-Time Roles
            </button>
          </div>

          {/* Results count & Reset */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{filteredJobs.length}</strong> of {jobs.length} roles
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline ml-2"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Detailed Filters (Experience, Location, Work Mode, Verified) */}
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
              <option value="bengaluru">Bengaluru / Bangalore</option>
              <option value="delhi_ncr">Delhi NCR (Gurgaon / Noida)</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
              <option value="mumbai">Mumbai</option>
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
                Location: {selectedLocation.replace("_", " ").toUpperCase()}
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

      {/* JOBS GRID / LIST */}
      <div className="mt-6 space-y-4">
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
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">
              No matching opportunities found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing work mode filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("ALL");
                setSelectedMode("ALL");
                setOnlyVerified(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
