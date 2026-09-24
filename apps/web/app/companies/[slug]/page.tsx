import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CompanyProfile,
} from "@/lib/mock-companies";
import { getLiveCompanyBySlug } from "@/lib/db-companies";
import { getLiveJobs } from "@/lib/db-jobs";
import { JobCard } from "@/components/job-card";
import {
  ShieldCheck,
  Globe,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompanyDetailsPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getLiveCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  // Active jobs posted by this company from PostgreSQL
  const allJobs = await getLiveJobs();
  const activeJobs = allJobs.filter((j) => j.companySlug === company.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/companies" className="hover:text-emerald-600">
          Companies
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{company.name}</span>
      </div>

      {/* COMPANY HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl font-bold text-slate-800 border border-slate-200">
              {company.logoInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {company.name}
                </h1>
                {company.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span>{company.industry}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {company.location}
                </span>
                <span>•</span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <Globe className="h-3 w-3" /> Website
                </a>
              </div>
            </div>
          </div>

          <Link href={`#openings`}>
            <Button className="font-bold gap-1 text-xs sm:text-sm">
              View {activeJobs.length} Active {activeJobs.length === 1 ? "Job" : "Jobs"}
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {company.description}
        </p>
      </div>

      {/* TRUTH TELLER TRANSPARENCY CARD (PRD SECTION 10) */}
      <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
            Factual Hiring Transparency (Truth Teller)
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          This data is derived directly from candidate interactions on JobMint. We do not label companies &quot;good&quot; or &quot;bad&quot; — we show the observed facts.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white border border-emerald-100 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block">Applications Received</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {company.truthTeller.totalApplications}
            </span>
          </div>

          <div className="rounded-xl bg-white border border-emerald-100 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block">Applications Reviewed</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {company.truthTeller.reviewedApplications}
            </span>
          </div>

          <div className="rounded-xl bg-white border border-emerald-100 p-4 shadow-2xs">
            <span className="text-xs text-emerald-700 block">Review Rate</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {company.truthTeller.reviewRate}%
            </span>
          </div>

          <div className="rounded-xl bg-white border border-emerald-100 p-4 shadow-2xs">
            <span className="text-xs text-slate-500 block">Median First Review</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {company.truthTeller.medianFirstReviewDays} days
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-emerald-900 bg-white/70 border border-emerald-100 rounded-lg p-3">
          <span className="font-semibold">Last Recruiter Activity:</span>
          <span className="font-bold text-emerald-700">
            {company.truthTeller.lastRecruiterActivity}
          </span>
        </div>
      </div>

      {/* ACTIVE OPENINGS */}
      <div id="openings" className="mt-12 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold text-slate-900">
            Active Openings at {company.name} ({activeJobs.length})
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Apply with verifiable 7-day ghosting protection.
          </p>
        </div>

        <div className="space-y-4">
          {activeJobs.length > 0 ? (
            activeJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-500">
              No active job postings at this time. Check back soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
