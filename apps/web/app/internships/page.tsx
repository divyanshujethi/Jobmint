"use client";

import { useState, useEffect, useMemo } from "react";
import { Sparkles, MapPin, Search, Filter } from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { JobType, WorkMode } from "@repo/shared";

export default function InternshipsPage() {
  const [internships, setInternships] = useState<MockJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/jobs?type=INTERNSHIP")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs)) {
          setInternships(data.jobs);
        }
      })
      .catch((err) => console.error("Error loading live internships:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredInternships = useMemo(() => {
    return internships.filter((job) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }
      if (modeFilter !== "ALL" && job.workMode !== modeFilter) {
        return false;
      }
      return true;
    });
  }, [internships, search, modeFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Student & Fresher Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Paid Tech Internships
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            All listings are verified with clear stipends, real review rates, and ghosting protection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search internships or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Modes</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Showing {filteredInternships.length} live openings</span>
        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">100% Verified Stipends</span>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
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
        ) : filteredInternships.length > 0 ? (
          filteredInternships.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">No internships match your current search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
