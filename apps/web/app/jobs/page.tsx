"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Filter, Briefcase, Sparkles, X } from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { JobType, WorkMode } from "@repo/shared";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
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

      // Work Mode
      if (selectedMode !== "ALL" && job.workMode !== selectedMode) {
        return false;
      }

      // Only Verified Companies
      if (onlyVerified && !job.isVerified) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedType, selectedMode, onlyVerified]);

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
            placeholder="Search by title, skill (e.g. React)..."
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

      {/* FILTER BUTTONS & CONTROLS */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        {/* Job Type Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedType("ALL")}
            className={`min-h-[44px] inline-flex items-center rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors touch-manipulation ${
              selectedType === "ALL"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All Opportunities ({jobs.length})
          </button>
          <button
            onClick={() => setSelectedType(JobType.INTERNSHIP)}
            className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors touch-manipulation ${
              selectedType === JobType.INTERNSHIP
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Internships
          </button>
          <button
            onClick={() => setSelectedType(JobType.FULL_TIME)}
            className={`min-h-[44px] inline-flex items-center rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors touch-manipulation ${
              selectedType === JobType.FULL_TIME
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Full-Time (Fresher)
          </button>
        </div>

        {/* Work Mode & Verified Toggles */}
        <div className="flex items-center gap-3 text-xs">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 touch-manipulation"
          >
            <option value="ALL">Any Work Mode</option>
            <option value={WorkMode.REMOTE}>Remote Only</option>
            <option value={WorkMode.HYBRID}>Hybrid</option>
            <option value={WorkMode.ON_SITE}>On-Site</option>
          </select>

          <label className="min-h-[44px] inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none px-2 py-1 rounded-xl hover:bg-slate-100/60 transition-colors touch-manipulation">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Verified Only
          </label>
        </div>
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
