"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { CompanyProfile } from "@/lib/mock-companies";
import {
  ShieldCheck,
  Search,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CompaniesDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyFastReviewers, setOnlyFastReviewers] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (data.companies && Array.isArray(data.companies)) {
          setCompanies(data.companies);
        }
      })
      .catch((err) => console.error("Error loading live companies:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesIndustry = comp.industry.toLowerCase().includes(q);
        if (!matchesName && !matchesIndustry) return false;
      }
      if (onlyFastReviewers && !comp.truthTeller.isFastReviewer) return false;
      if (onlyVerified && !comp.isVerified) return false;
      return true;
    });
  }, [companies, searchTerm, onlyFastReviewers, onlyVerified]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Transparent Employer Index
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Hiring Companies & Transparency
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse companies with verifiable response times. We reward companies that don&apos;t ghost candidates.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
          <input
            type="checkbox"
            checked={onlyFastReviewers}
            onChange={(e) => setOnlyFastReviewers(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <Zap className="h-3.5 w-3.5 text-amber-500" /> Fast Reviewers (&le; 2.5 Days)
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified Only
        </label>
      </div>

      {/* COMPANIES GRID */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
              <div className="h-16 bg-slate-100 rounded-xl" />
            </div>
          ))
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
            <div className="space-y-4">
              {/* TOP ROW */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold text-slate-800 border border-slate-200">
                    {comp.logoInitial}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {comp.name}
                    </h3>
                    <span className="text-xs text-slate-500 block">
                      {comp.industry}
                    </span>
                  </div>
                </div>

                {comp.isVerified && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {comp.description}
              </p>

              {/* TRUTH TELLER STATS BOX */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Candidate Review Rate</span>
                  <span className="font-bold text-emerald-700">
                    {comp.truthTeller.reviewRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Median First Review</span>
                  <span className="font-bold text-slate-900">
                    {comp.truthTeller.medianFirstReviewDays} days
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200/60 text-slate-400">
                  <span>Recruiter Activity</span>
                  <span className="text-emerald-600 font-medium">
                    {comp.truthTeller.lastRecruiterActivity}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href={`/companies/${comp.slug}`}>
                <Button variant="outline" className="w-full text-xs font-bold gap-1">
                  View Transparency & Jobs <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            No companies found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
