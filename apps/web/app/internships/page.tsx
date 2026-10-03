"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Sparkles, MapPin, Search, Filter, X } from "lucide-react";
import { MockJob } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { ScrollToTop } from "@/components/scroll-to-top";
import { RoloMascot } from "@/components/rolo-mascot";
import { JobType, WorkMode } from "@repo/shared";

export default function InternshipsPage() {
  const [internships, setInternships] = useState<MockJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 12;

  const searchInputRef = useRef<HTMLInputElement>(null);

  // "/" keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, modeFilter]);

  const filteredInternships = useMemo(() => {
    return internships.filter((job) => {
      if (search) {
        const q = search.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        const matchesLocation = (job.location || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesLocation) return false;
      }
      if (modeFilter !== "ALL" && job.workMode !== modeFilter) {
        return false;
      }
      return true;
    });
  }, [internships, search, modeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInternships.length / PAGE_SIZE));

  const paginatedInternships = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredInternships.slice(start, start + PAGE_SIZE);
  }, [filteredInternships, currentPage]);

  return (
    <>
      {/* Floating Scroll to Top Arrow Button */}
      <ScrollToTop className="bottom-36 right-5 md:bottom-28 md:right-9" />

      {/* Rolo interactive floating mascot */}
      <RoloMascot
        floating
        onQuickFilter={(f) => {
          if (f.mode !== undefined) setModeFilter(f.mode);
          if (f.search !== undefined) setSearch(f.search);
          setCurrentPage(1);
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Student &amp; Fresher Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Paid Tech Internships
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              All listings are verified with clear stipends, real review rates, and ghosting protection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search role, skill, or city (press /)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-emerald-600" /> Quick Filters:
          </span>
          {[
            { label: "All", value: "" },
            { label: "🌐 Remote", value: "remote" },
            { label: "📍 Bengaluru", value: "bengaluru" },
            { label: "📍 Hyderabad", value: "hyderabad" },
            { label: "📍 Chennai", value: "chennai" },
            { label: "📍 Pune & Mumbai", value: "pune" },
            { label: "📍 Delhi NCR", value: "delhi" },
            { label: "📍 Kochi & Kerala", value: "kerala" },
            { label: "📍 Goa & Coastal Hubs", value: "goa" },
            { label: "📍 Vizag & AP", value: "andhra" },
            { label: "📍 Coimbatore & TN", value: "coimbatore" },
            { label: "📍 Tricity & Mohali", value: "mohali" },
            { label: "📍 Gujarat & Rajasthan", value: "gujarat" },
            { label: "📍 Indore & Central", value: "indore" },
            { label: "⚛️ React", value: "react" },
            { label: "🐍 Python", value: "python" },
            { label: "🟢 Node.js", value: "node" },
            { label: "🤖 AI / ML", value: "ai" },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setSearch(chip.value);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                (chip.value === "" && !search) || (chip.value && search.toLowerCase() === chip.value)
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {chip.label}
            </button>
          ))}
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline shrink-0 cursor-pointer ml-1"
            >
              Clear
            </button>
          )}
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
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedInternships.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200 text-xs text-slate-600">
                  <div className="font-mono font-medium">
                    Showing <span className="font-bold text-slate-900">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, filteredInternships.length)}</span> of{" "}
                    <span className="font-bold text-slate-900">{filteredInternships.length}</span> internships
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 180, behavior: "smooth" });
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
                                  window.scrollTo({ top: 180, behavior: "smooth" });
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
                        window.scrollTo({ top: 180, behavior: "smooth" });
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
              <p className="text-sm text-slate-500">No internships match your current search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
