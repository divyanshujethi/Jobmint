"use client";

import { useMemo } from "react";
import { Sparkles, MapPin } from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { JobCard } from "@/components/job-card";
import { JobType } from "@repo/shared";

export default function InternshipsPage() {
  const internships = useMemo(() => {
    return MOCK_JOBS.filter((job) => job.jobType === JobType.INTERNSHIP);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-slate-200 pb-6">
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

      <div className="mt-8 space-y-4">
        {internships.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
