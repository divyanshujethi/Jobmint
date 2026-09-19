import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CAREER_ROADMAPS,
  CareerRoadmap,
} from "@repo/shared";
import {
  Compass,
  Clock,
  CheckCircle2,
  ExternalLink,
  Code2,
  Briefcase,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOBS } from "@/lib/mock-jobs";

interface RoadmapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoadmapDetailPage({ params }: RoadmapPageProps) {
  const { slug } = await params;
  const roadmap = CAREER_ROADMAPS.find((r) => r.slug === slug);

  if (!roadmap) {
    notFound();
  }

  // Find jobs related to this roadmap
  const relatedJobs = MOCK_JOBS.filter((job) =>
    job.skills.some((skill) => roadmap.keySkills.includes(skill))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/roadmaps" className="hover:text-emerald-600">
          Roadmaps
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{roadmap.title}</span>
      </div>

      {/* HERO BANNER */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10 text-white shadow-lg">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
            {roadmap.category}
          </span>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            100% Free Resources
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" /> {roadmap.durationWeeks}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {roadmap.title} Study Guide
        </h1>
        <p className="mt-2 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
          {roadmap.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {roadmap.keySkills.map((s) => (
            <span
              key={s}
              className="rounded-lg bg-slate-800/90 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ROADMAP STEPS & CURRICULUM */}
      <div className="mt-12 space-y-12">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Step-by-Step Curriculum
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Follow each phase in order. Complete the hands-on project before moving to the next.
          </p>
        </div>

        {roadmap.phases.map((phase) => (
          <div
            key={phase.phaseNumber}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
          >
            {/* PHASE HEADER */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-lg">
                {phase.phaseNumber}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {phase.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  {phase.description}
                </p>
              </div>
            </div>

            {/* CURATED FREE RESOURCES */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Curated Free Courses & Guides:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {phase.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/20 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">
                          {res.provider}
                        </span>
                        {res.badge && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                            {res.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                        {res.title}
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </h4>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>{res.type} • ~{res.estimatedHours}h</span>
                      <span className="font-bold text-emerald-700">100% Free</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* CAPSTONE PROJECT FOR THIS PHASE */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Build to Master: {phase.projectIdea.title}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {phase.projectIdea.description}
              </p>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-blue-950 block">
                  GitHub Portfolio Deliverables:
                </span>
                {phase.projectIdea.deliverables.map((del, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* JOBS HIRING FOR THIS TRACK */}
      {relatedJobs.length > 0 && (
        <div className="mt-16 border-t border-slate-200 pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Jobs Requiring These Skills
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active opportunities on JobMint that look for the skills in this roadmap.
              </p>
            </div>
            <Link href="/jobs" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedJobs.slice(0, 2).map((j) => (
              <div
                key={j.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {j.companyName}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                    {j.title}
                  </h4>
                  <div className="mt-2 text-xs text-emerald-700 font-bold">
                    {j.salaryOrStipend} • {j.workMode}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <Link href={`/jobs/${j.slug}`}>
                    <Button size="sm" variant="outline" className="text-xs font-semibold">
                      View Job <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
