import Link from "next/link";
import { CAREER_ROADMAPS } from "@repo/shared";
import { Compass, BookOpen, Clock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoadmapsIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> 100% Free Open Educational Guides
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Career Roadmaps for Young Talent
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Don&apos;t spend thousands on expensive bootcamps. Follow step-by-step curricula curated from the best free courses, video series, and hands-on projects in the world.
        </p>
      </div>

      {/* ROADMAPS GRID */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CAREER_ROADMAPS.map((roadmap) => (
          <div
            key={roadmap.slug}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                  {roadmap.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5" /> {roadmap.durationWeeks}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {roadmap.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {roadmap.shortDescription}
                </p>
              </div>

              {/* SKILLS CHIPS */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Core Skills You Will Master:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CURRICULUM HIGHLIGHTS */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Curriculum Highlights:
                </span>
                {roadmap.phases.map((phase) => (
                  <div key={phase.phaseNumber} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{phase.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href={`/roadmaps/${roadmap.slug}`}>
                <Button className="w-full font-bold gap-2">
                  <BookOpen className="h-4 w-4" /> View Full Free Guide
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
