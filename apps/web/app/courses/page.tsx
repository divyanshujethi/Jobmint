"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  ExternalLink,
  Search,
  Code2,
  Sparkles,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CURATED_COURSES } from "@/lib/courses-data";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CURATED_COURSES.filter((course) => {
    if (selectedCategory !== "ALL" && course.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        course.creator.toLowerCase().includes(q) ||
        course.subcategory.toLowerCase().includes(q) ||
        course.skillsLearned.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          
          {/* HEADER */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-xs font-mono font-semibold text-indigo-300">
              <Award className="h-4 w-4 text-indigo-400" />
              Proof-of-Work Interactive Certifications
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
              Interactive Developer Courses &amp; Certifications
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
              Structured hands-on curricula with required Proof-of-Work project benchmarks, code implementations, and verified cryptographic StudyNest Academy completion certificates.
            </p>

          {/* JOB-SPECIFIC 30-DAY COURSE GENERATOR CALLOUT */}
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0c1024] to-indigo-950/60 border border-emerald-500/40 p-4 sm:p-5 text-xs sm:text-sm text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <Sparkles className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white flex items-center gap-2">
                  Target Any Job: Interactive 30-Day Course Studio
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[10px] px-2 py-0.2 rounded-full">NEW</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter any job or company to automatically generate a tailored 30-day interactive daily curriculum with coding tasks and streak tracking.
                </p>
              </div>
            </div>
            <Link href="/study" className="shrink-0">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20">
                Open Course Studio →
              </Button>
            </Link>
          </div>

          {/* DEDICATED SEPARATION CALLOUT TO YOUTUBE PLAYLISTS */}
          <div className="mx-auto max-w-4xl rounded-2xl bg-[#0c1024] border border-indigo-950/80 p-4 sm:p-5 text-xs sm:text-sm text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <Youtube className="h-6 w-6 text-rose-500 shrink-0" />
              <div>
                <span className="font-bold text-white">Looking for Free YouTube Video Playlists?</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Browse our dedicated YouTube Playlists Hub featuring Striver, Chai aur Code, Karpathy, and 3Blue1Brown with GitHub companion repos.
                </p>
              </div>
            </div>
            <Link href="/playlists" className="shrink-0">
              <Button size="sm" variant="outline" className="border-indigo-800/60 bg-[#101533] text-rose-400 hover:bg-indigo-950 hover:text-white text-xs rounded-xl shadow-sm">
                View YouTube Playlists →
              </Button>
            </Link>
          </div>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-indigo-950/70 pb-5">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#0c1024] p-1.5 border border-indigo-950/80">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              All Interactive Tracks ({CURATED_COURSES.length})
            </button>

            <button
              onClick={() => setSelectedCategory("AI_ML")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "AI_ML" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              🤖 AI &amp; GenAI
            </button>

            <button
              onClick={() => setSelectedCategory("WEB_DEV")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "WEB_DEV" ? "bg-teal-600 text-white shadow-md shadow-teal-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              💻 Full-Stack Web
            </button>

            <button
              onClick={() => setSelectedCategory("DSA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DSA" ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              ⚡ DSA &amp; Algorithms
            </button>

            <button
              onClick={() => setSelectedCategory("DEVOPS_CLOUD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DEVOPS_CLOUD" ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              ☁️ Cloud &amp; DevOps
            </button>

            <button
              onClick={() => setSelectedCategory("FREE_TEST")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "FREE_TEST" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 hover:text-white"
              }`}
            >
              🚀 Free Test Course
            </button>

            <button
              onClick={() => setSelectedCategory("PYTHON_DATA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "PYTHON_DATA" ? "bg-amber-600 text-white shadow-md shadow-amber-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              🐍 Python &amp; Data
            </button>
          </div>

          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search course or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#0c1024] border-indigo-950 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl shadow-none focus-visible:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* INTERACTIVE COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="border-indigo-950/80 bg-[#0b0f24] text-white flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-950/30 shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {course.category === "FREE_TEST" && (
                        <span className="rounded bg-emerald-500 text-slate-950 font-black px-2 py-0.5 text-[10px] uppercase tracking-wider animate-pulse">
                          100% Free Test Course
                        </span>
                      )}
                      <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {course.subcategory}
                      </span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{course.difficulty}</span>
                    </div>

                    <CardTitle className="text-lg font-bold text-white leading-snug">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-medium">
                      <span>Curriculum Lead: <strong className="text-cyan-300">{course.creator}</strong></span>
                    </div>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm" title="Includes Verified Certificate">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {course.description}
                </p>

                {/* DURATION & MODULES */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#101533] border border-indigo-900/60 p-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Estimated: <strong className="text-white">{course.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{course.curriculumModules.length} Core Modules</span>
                  </div>
                </div>

                {/* CURRICULUM MODULES BREAKDOWN */}
                <div className="rounded-xl border border-indigo-900/60 bg-[#101533]/60 p-3 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    Syllabus &amp; Learning Modules
                  </div>
                  <ul className="space-y-1">
                    {course.curriculumModules.map((mod, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PROOF-OF-WORK BENCHMARK */}
                <div className="rounded-xl border border-indigo-900/60 bg-indigo-950/30 p-3 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-indigo-300 font-bold tracking-wider flex items-center gap-1">
                    <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                    Capstone Proof-of-Work Requirement
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {course.projectBenchmark}
                  </p>
                </div>

                {/* CERTIFICATE CLAIM PREVIEW */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-slate-300">
                      Earn: <strong className="text-amber-300 font-semibold">{course.certificateTitle}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                    Free Certificate
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="pt-3 border-t border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Link
                    href={`/courses/${course.id}/certificate`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md shadow-emerald-600/20"
                    >
                      <Award className="h-3.5 w-3.5 text-white" />
                      <span>🎓 Claim Completion Certificate</span>
                    </Button>
                  </Link>

                  <a
                    href={course.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto border-indigo-900/60 bg-[#101533] hover:bg-indigo-950 text-slate-300 hover:text-white text-xs gap-1.5 rounded-xl shadow-sm"
                    >
                      <Play className="h-3 w-3 fill-current text-rose-500" />
                      <span>Watch Lessons</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </main>
      <StudyFooter />
    </div>
  );
}
