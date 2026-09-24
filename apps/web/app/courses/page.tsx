"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Youtube,
  Github,
  BookOpen,
  Sparkles,
  Search,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Layers,
  Code2,
  Cpu,
  Globe,
  Terminal,
  Shield,
  Smartphone,
  ChevronRight,
  Bookmark,
  Award,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CURATED_COURSES, CoursePlaylist } from "@/lib/courses-data";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CURATED_COURSES.filter((course) => {
    if (selectedCategory !== "ALL" && course.category !== selectedCategory) return false;
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
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <BookOpen className="h-4 w-4" />
            Curated Free Developer Curricula &amp; Certifications
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Interactive Courses &amp; Best YouTube Playlists
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            Hand-picked video curricula from the world&apos;s best tech educators (Andrej Karpathy, Striver, Hitesh Choudhary, Nana, NeetCode, Angela Yu) paired with open-source GitHub libraries and verified JobMint completion certificates.
          </p>

          {/* CERTIFICATE BANNER */}
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/30 p-4 text-xs sm:text-sm text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-left">
              <Award className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Earn JobMint Verified Completion Certificates</span>
                <p className="text-[11px] text-slate-400">
                  Every course includes a cryptographic Proof-of-Work certificate with 1-click LinkedIn profile sharing and DPDP Act compliance.
                </p>
              </div>
            </div>
            <Link href="/certificates" className="shrink-0">
              <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 text-xs rounded-xl">
                View All Certificates
              </Button>
            </Link>
          </div>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Subjects ({CURATED_COURSES.length})
            </button>

            <button
              onClick={() => setSelectedCategory("AI_ML")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "AI_ML" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🤖 AI &amp; GenAI
            </button>

            <button
              onClick={() => setSelectedCategory("WEB_DEV")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "WEB_DEV" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              💻 Full-Stack Web
            </button>

            <button
              onClick={() => setSelectedCategory("DSA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DSA" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⚡ DSA &amp; LeetCode
            </button>

            <button
              onClick={() => setSelectedCategory("DEVOPS_CLOUD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DEVOPS_CLOUD" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ☁️ Cloud &amp; DevOps
            </button>

            <button
              onClick={() => setSelectedCategory("PYTHON_DATA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "PYTHON_DATA" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🐍 Python &amp; Data
            </button>
          </div>

          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search subject or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* COURSES & PLAYLISTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="border-slate-800 bg-slate-900/90 text-white flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {course.subcategory}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{course.difficulty}</span>
                    </div>

                    <CardTitle className="text-lg font-bold text-white leading-snug">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">{course.creator}</span>
                      <span>({course.creatorSubscribers})</span>
                    </div>
                  </div>

                  <a
                    href={course.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="Watch Playlist on YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {course.description}
                </p>

                {/* METRICS */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Duration: <strong className="text-white">{course.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-blue-400" />
                    <span>{course.totalVideos} Videos in Series</span>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    Core Skills Covered
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.skillsLearned.map((sk) => (
                      <span
                        key={sk}
                        className="rounded bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CERTIFICATE BADGE PROMPT */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="text-[11px] text-slate-300">
                      Earn: <strong className="text-amber-300">{course.certificateTitle}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                    Free Certificate
                  </span>
                </div>

                {/* RECOMMENDED GITHUB LIBRARIES */}
                {course.recommendedGithubRepos.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5 text-slate-200" />
                      Must-Star GitHub Libraries for this Subject
                    </div>
                    <div className="space-y-2">
                      {course.recommendedGithubRepos.map((repo) => (
                        <div
                          key={repo.name}
                          className="flex items-start justify-between gap-2 text-xs border-t border-slate-800/80 pt-1.5 first:border-0 first:pt-0"
                        >
                          <div>
                            <a
                              href={repo.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              {repo.name}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {repo.description}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] text-amber-400 font-semibold shrink-0">
                            {repo.stars}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Link
                    href={`/courses/${course.id}/certificate`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
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
                      className="w-full sm:w-auto border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs gap-1.5 rounded-xl"
                    >
                      <Play className="h-3 w-3 fill-current text-red-500" />
                      <span>Watch Series</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
