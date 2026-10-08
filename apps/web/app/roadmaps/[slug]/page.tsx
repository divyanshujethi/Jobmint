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
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLiveJobs } from "@/lib/db-jobs";
import { getEnrichedCareerRoadmaps } from "@/lib/roadmaps-store";
import { InteractiveRoadmapSprints } from "@/components/interactive-roadmap-sprints";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

interface RoadmapPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RoadmapPageProps) {
  const { slug } = await params;
  const roadmap = CAREER_ROADMAPS.find((r) => r.slug === slug);
  if (!roadmap) {
    return { title: "Roadmap Not Found — StudyNest Academy" };
  }
  return {
    title: `${roadmap.title} Roadmap — StudyNest Academy`,
    description: roadmap.shortDescription,
    alternates: {
      canonical: `https://study.rolenest.in/roadmaps/${slug}`,
    },
    openGraph: {
      title: `${roadmap.title} Roadmap — StudyNest Academy`,
      description: roadmap.shortDescription,
      url: `https://study.rolenest.in/roadmaps/${slug}`,
      siteName: "StudyNest Academy",
      type: "article",
      images: [
        {
          url: "/icon-512.png",
          width: 512,
          height: 512,
          alt: `${roadmap.title} Roadmap`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${roadmap.title} Roadmap — StudyNest Academy`,
      description: roadmap.shortDescription,
      images: ["/icon-512.png"],
      creator: "@RoleNest",
    },
  };
}

export default async function RoadmapDetailPage({ params }: RoadmapPageProps) {
  const { slug } = await params;
  const enrichedRoadmaps = await getEnrichedCareerRoadmaps();
  const roadmap = enrichedRoadmaps.find((r) => r.slug === slug);

  if (!roadmap) {
    notFound();
  }

  // Find live jobs related to this roadmap from PostgreSQL
  const allJobs = await getLiveJobs();
  const relatedJobs = allJobs.filter((job) =>
    job.skills.some((skill) => roadmap.keySkills.includes(skill))
  );

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 w-full">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Link href="/roadmaps" className="hover:text-indigo-400 transition-colors">
            Roadmaps &amp; Cohorts
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">{roadmap.title}</span>
        </div>

        {/* HERO BANNER */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1024] via-[#090d22] to-[#060814] p-8 sm:p-10 text-white shadow-2xl border border-indigo-950/80 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300 font-mono">
              {roadmap.category}
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300 font-mono">
              100% Free Open Curriculum
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> {roadmap.durationWeeks}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
            {roadmap.title} Career Guide
          </h1>
          <p className="max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
            {roadmap.shortDescription}
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            {roadmap.keySkills.map((s) => (
              <span
                key={s}
                className="rounded-lg bg-[#101533] border border-indigo-900/60 px-2.5 py-1 text-xs font-mono font-semibold text-cyan-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* INTERACTIVE 8-WEEK SPRINTS & DEVSCORE BOOSTER */}
        <InteractiveRoadmapSprints roadmap={roadmap} />

        {/* ROADMAP PHASES & CURRICULUM */}
        <div className="space-y-8">
          <div className="border-b border-indigo-950/80 pb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-400" />
              <span>In-Depth Curriculum &amp; Video Masterclasses</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Curated step-by-step guides with zero paid subscriptions. Complete the hands-on project before advancing.
            </p>
          </div>

          {roadmap.phases.map((phase) => (
            <div
              key={phase.phaseNumber}
              className="rounded-3xl border border-indigo-950/80 bg-[#0c1024] p-6 sm:p-8 shadow-xl space-y-6"
            >
              {/* PHASE HEADER */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white font-black text-lg shadow-lg shadow-indigo-600/30">
                  {phase.phaseNumber}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {phase.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    {phase.description}
                  </p>
                </div>
              </div>

              {/* CURATED FREE RESOURCES */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Curated Free Courses &amp; Guides:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between rounded-2xl border border-indigo-950/80 bg-[#101533]/80 p-4 transition-all hover:border-indigo-500/60 hover:bg-[#101533] hover:shadow-lg shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 font-mono">
                            {res.provider}
                          </span>
                          {res.badge && (
                            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
                              {res.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1.5 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          {res.title}
                          <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                        </h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-indigo-950">
                        <span className="font-mono">{res.type} &bull; ~{res.estimatedHours}h</span>
                        <span className="font-bold text-emerald-400 font-mono">100% Free</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* CAPSTONE PROJECT FOR THIS PHASE */}
              <div className="rounded-2xl border border-indigo-900/60 bg-[#12173d] p-5 space-y-3 shadow-inner">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
                    Build to Master: {phase.projectIdea.title}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {phase.projectIdea.description}
                </p>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-indigo-300 block font-mono">
                    GitHub Portfolio Deliverables:
                  </span>
                  {phase.projectIdea.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DIRECT SKILL BRIDGE: MATCHING ROLES */}
        <div className="border-t border-indigo-950/80 pt-10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full mb-1 font-mono">
                <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                Industry Skill Alignment
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Live Industry Roles Requiring {roadmap.title} Skills
              </h2>
              <p className="text-xs text-slate-400">
                Industry hiring requirements matching these curriculum milestones. Master these nodes to pass screening.
              </p>
            </div>
            <Link href="/canvas" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 font-mono">
              <span>Explore Visual Course Canvas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(relatedJobs.length > 0 ? relatedJobs.slice(0, 4) : allJobs.slice(0, 4)).map((j) => (
              <div
                key={j.id}
                className="rounded-3xl border border-indigo-950/80 bg-[#0c1024] p-5 shadow-xl hover:border-indigo-600/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400 truncate font-mono">
                      {j.companyName}
                    </span>
                    <span className="rounded-full bg-indigo-500/10 text-indigo-300 px-2 py-0.5 text-[10px] font-bold font-mono border border-indigo-500/30 shrink-0">
                      Target Role Profile
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-1 line-clamp-1">
                    {j.title}
                  </h4>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                      {j.salaryOrStipend}
                    </span>
                    <span className="text-slate-400 bg-[#101533] px-2 py-0.5 rounded border border-indigo-950">
                      {j.workMode}
                    </span>
                    <span className="text-slate-400 bg-[#101533] px-2 py-0.5 rounded border border-indigo-950">
                      {j.location}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {j.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="rounded-lg bg-[#101533] border border-indigo-900/40 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-indigo-950/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    StudyNest Skill Match
                  </span>
                  <Link href="/canvas">
                    <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-md gap-1">
                      <span>Train on Canvas</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <StudyFooter />
    </div>
  );
}
