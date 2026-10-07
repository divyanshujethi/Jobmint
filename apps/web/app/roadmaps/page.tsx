"use client";

import { useState } from "react";
import Link from "next/link";
import { CAREER_ROADMAPS, CareerRoadmap } from "@repo/shared";
import {
  Compass,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Server,
  Cloud,
  Database,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

export default function RoadmapsIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { key: "ALL", label: "All Tracks", icon: Layers },
    { key: "AI & ML", label: "AI & Machine Learning", icon: Cpu },
    { key: "Web Development", label: "Full-Stack Web", icon: Code2 },
    { key: "Backend & Systems", label: "Backend & Systems", icon: Server },
    { key: "DevOps & Cloud", label: "DevOps & Cloud", icon: Cloud },
    { key: "Data Science", label: "Data Science", icon: Database },
  ];

  const filteredRoadmaps = CAREER_ROADMAPS.filter((roadmap) => {
    if (selectedCategory !== "ALL" && roadmap.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = roadmap.title.toLowerCase().includes(q);
      const matchDesc = roadmap.shortDescription.toLowerCase().includes(q);
      const matchSkills = roadmap.keySkills.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchSkills;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-indigo-950/60 bg-gradient-to-b from-[#0b0f24] via-[#070913] to-[#070913] px-4 py-14 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
          
          <div className="relative mx-auto max-w-4xl text-center space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>100% Free Open Engineering Curricula</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold text-cyan-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Auto-Updated Every 7–15 Days</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
              Engineering <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">Career Roadmaps</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Bypass overpriced bootcamps. Follow structured, battle-tested learning phases curated from the best open MIT, Stanford, Harvard, and industry resources in the world.
            </p>

            {/* SEARCH BAR */}
            <div className="pt-2 max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search roadmaps by skill (e.g. PyTorch, Go, Docker, Kafka)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-indigo-950/80 bg-[#0d1226] pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY TABS */}
        <div className="sticky top-16 z-30 border-b border-indigo-950/60 bg-[#070913]/90 backdrop-blur-md px-4 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20"
                      : "bg-[#0d1226] text-slate-400 hover:text-white border border-indigo-950/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROADMAPS GRID */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <div
                key={roadmap.slug}
                className="flex flex-col justify-between rounded-2xl border border-indigo-950/60 bg-[#0b0f22]/90 p-6 shadow-xl hover:border-indigo-500/40 hover:shadow-indigo-950/30 transition-all group"
              >
                <div className="space-y-4">
                  {/* HEADER BADGES */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                      {roadmap.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="h-3 w-3 text-indigo-400" />
                      {roadmap.durationWeeks}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {roadmap.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {roadmap.shortDescription}
                    </p>
                  </div>

                  {/* KEY SKILLS */}
                  <div className="pt-3 border-t border-indigo-950/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2 font-bold">
                      Core Stack Mastered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {roadmap.keySkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-indigo-950/50 border border-indigo-900/40 px-2 py-0.5 text-[10px] font-medium text-indigo-300 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CURRICULUM HIGHLIGHTS */}
                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                      Curriculum Phases ({roadmap.phases.length}):
                    </span>
                    {roadmap.phases.slice(0, 3).map((phase) => (
                      <div key={phase.phaseNumber} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate text-[11px] text-slate-300">{phase.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-950/60">
                  <Link href={`/roadmaps/${roadmap.slug}`}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 text-xs shadow-md shadow-indigo-600/20">
                      <BookOpen className="h-4 w-4" />
                      <span>Start Roadmap Free</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <StudyFooter />
    </div>
  );
}
