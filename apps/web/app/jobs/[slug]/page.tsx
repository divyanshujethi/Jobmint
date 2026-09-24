import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Building2,
  Sparkles,
  Share2,
} from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { getLiveJobBySlug } from "@/lib/db-jobs";
import { getLearningGuideForSkill } from "@repo/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobApplyButton } from "@/components/job-apply-button";
import { GapToOfferDiagnostic } from "@/components/gap-to-offer-diagnostic";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JobDetailsPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = (await getLiveJobBySlug(slug)) || MOCK_JOBS.find((j) => j.slug === slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/jobs" className="hover:text-emerald-600">
          Jobs
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{job.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN COLUMN (2 COLS) */}
        <div className="lg:col-span-2 space-y-8">
          {/* HEADER CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-800 border border-slate-200">
                  {job.companyLogoInitial}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {job.title}
                  </h1>
                  <div className="mt-1 flex items-center gap-2 flex-wrap text-sm">
                    <span className="font-semibold text-slate-700">
                      {job.companyName}
                    </span>
                    {job.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block">
                <JobApplyButton
                  jobId={job.id}
                  jobTitle={job.title}
                  companyName={job.companyName}
                  size="lg"
                  className="font-bold"
                />
              </div>
            </div>

            {/* KEY METRICS */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5 text-xs">
              <div>
                <span className="text-slate-400 block">Stipend / Salary</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                  {job.salaryOrStipend}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Work Mode</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {job.workMode.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Experience</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {job.experienceYears === 0 ? "Fresher / 0 yrs" : `${job.experienceYears}+ yrs`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Posted</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {job.postedAgo}
                </span>
              </div>
            </div>

            <div className="mt-5 sm:hidden">
              <JobApplyButton
                jobId={job.id}
                jobTitle={job.title}
                companyName={job.companyName}
                size="lg"
                className="w-full font-bold"
              />
            </div>
          </div>

          {/* GAP-TO-OFFER INSTANT SKILL DIAGNOSTIC */}
          <GapToOfferDiagnostic
            jobTitle={job.title}
            companyName={job.companyName}
            jobSkills={job.skills}
            jobSlug={job.slug}
          />

          {/* JOB DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 text-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                About the Role
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Key Responsibilities
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Requirements & Qualifications
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Perks & Benefits
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SIDEBAR COLUMN (1 COL) */}
        <div className="space-y-6">
          {/* REQUIRED TECHNICAL COMPETENCIES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Required Tech Stack
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-700">
                {job.skills.length} Skills
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-500">
                The employer seeks candidates proficient in the following core technologies:
              </p>

              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <span className="text-slate-400 block font-semibold">Free Learning Guides:</span>
                {job.skills.slice(0, 3).map((s) => {
                  const guide = getLearningGuideForSkill(s.toLowerCase());
                  if (!guide) return null;
                  return (
                    <div
                      key={s}
                      className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-slate-700 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                      <Link
                        href={`/roadmaps/${guide.roadmapSlug}`}
                        className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0"
                      >
                        Free Roadmap →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI INTERVIEW PREP CARD */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/70 to-indigo-50/50 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                AI Interview Prep
              </h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-600">
              Practice 5 targeted questions tailored to {job.title} and the required tech stack before you apply.
            </p>
            <Link
              href={`/jobs/${job.slug}/interview-prep`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Interview Questions</span>
            </Link>
          </div>

          {/* TRUTH TELLER TRANSPARENCY CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Truth Teller Transparency
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Verifiable hiring activity recorded for {job.companyName}.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Applications Received</span>
                <span className="font-bold text-slate-900">
                  {job.truthTeller.totalApplications}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Applications Reviewed</span>
                <span className="font-bold text-slate-900">
                  {job.truthTeller.reviewedApplications}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Candidate Review Rate</span>
                <span className="font-bold text-emerald-700">
                  {job.truthTeller.reviewRate}%
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Median First Review Time</span>
                <span className="font-bold text-slate-900">
                  {job.truthTeller.medianFirstReviewDays} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Recruiter Activity</span>
                <span className="font-medium text-emerald-600">
                  {job.truthTeller.lastRecruiterActivity}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600">
              🛡️ <strong>JobMint Ghosting Guarantee:</strong> If the employer does not review your application within 7 days, we alert you and suggest similar active openings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
