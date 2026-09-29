"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Youtube,
  Github,
  Clock,
  ExternalLink,
  Search,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Code2,
  X,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CURATED_COURSES, CoursePlaylist } from "@/lib/courses-data";

export default function PlaylistsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalCourse, setActiveModalCourse] = useState<CoursePlaylist | null>(null);

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

  const categories = [
    { id: "ALL", label: `All Playlists (${CURATED_COURSES.length})`, color: "bg-slate-900 text-white" },
    { id: "AI_ML", label: "🤖 AI & GenAI", color: "bg-emerald-600 text-white" },
    { id: "WEB_DEV", label: "💻 Full Stack", color: "bg-teal-600 text-white" },
    { id: "DSA", label: "⚡ DSA & Coding", color: "bg-purple-600 text-white" },
    { id: "SYSTEM_DESIGN", label: "🏗️ System Design", color: "bg-blue-600 text-white" },
    { id: "DEVOPS_CLOUD", label: "☁️ Cloud & DevOps", color: "bg-cyan-600 text-white" },
    { id: "CYBERSECURITY", label: "🛡️ Cybersecurity", color: "bg-rose-600 text-white" },
    { id: "PYTHON_DATA", label: "🐍 Python & Data", color: "bg-amber-600 text-white" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3.5 py-1 text-xs font-mono font-semibold text-red-700">
            <Youtube className="h-4 w-4 text-red-600" />
            Curated Free Developer Video Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Best Computer Science &amp; Dev Playlists
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
            Hand-picked, high-signal developer masterclasses from elite creators (Striver, Andrej Karpathy, Chai aur Code, ByteByteGo, Hussein Nasser, Kunal Kushwaha) paired with companion GitHub repos and hands-on coding challenges.
          </p>

          {/* DEDICATED CALLOUT TO INTERACTIVE COURSES & PROBLEMS */}
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/80 to-purple-50/60 border border-emerald-200/80 p-4 text-xs sm:text-sm text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-left">
              <Award className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Want Hands-On Code Practice &amp; Diplomas?</span>
                <p className="text-[11px] text-slate-600">
                  Solve 450+ LeetCode-style interview problems or complete interactive benchmark projects to earn verifiable certificates.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/problems">
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl shadow-xs">
                  <Code2 className="h-3.5 w-3.5 mr-1" />
                  Code Editor
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs">
                  Bootcamp &amp; Diplomas →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1.5 border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.color} shadow-sm`
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search topic, tech, or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 h-9 rounded-xl shadow-none focus-visible:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* PLAYLISTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200 bg-white text-slate-900 flex flex-col justify-between hover:border-red-300 transition-all hover:shadow-md shadow-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {item.subcategory}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">{item.difficulty}</span>
                    </div>

                    <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{item.creator}</span>
                      <span>({item.creatorSubscribers} Subscribers)</span>
                    </div>
                  </div>

                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="Open on YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* METRICS */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Duration: <strong className="text-slate-900">{item.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-red-500" />
                    <span>{item.totalVideos} Full Episodes</span>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
                    Core Concepts Taught
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.skillsLearned.map((sk) => (
                      <span
                        key={sk}
                        className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RECOMMENDED GITHUB REPOS */}
                {item.recommendedGithubRepos.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-slate-600 font-bold tracking-wider flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5 text-slate-700" />
                      Companion GitHub Libraries
                    </div>
                    <div className="space-y-2">
                      {item.recommendedGithubRepos.map((repo) => (
                        <div
                          key={repo.name}
                          className="flex items-start justify-between gap-2 text-xs border-t border-slate-200 pt-1.5 first:border-0 first:pt-0"
                        >
                          <div>
                            <a
                              href={repo.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                            >
                              {repo.name}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {repo.description}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] text-amber-600 font-semibold shrink-0">
                            ★ {repo.stars}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveModalCourse(item)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Watch Inside RoleNest</span>
                    </Button>

                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs px-2.5 rounded-xl"
                        title="Open Playlist on YouTube"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>

                  {/* RELATED PROBLEMS LINK */}
                  {item.relatedProblemCategory && (
                    <Link href={`/problems?category=${encodeURIComponent(item.relatedProblemCategory)}`} className="block">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold gap-1.5 rounded-xl justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-purple-600" />
                          <span>Solve {item.relatedProblemCategory} Problems</span>
                        </span>
                        <ArrowRight className="h-3 w-3 text-purple-600" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      {/* EMBEDDED VIDEO PLAYER MODAL */}
      {activeModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 text-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
                  <Play className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white leading-tight">
                    {activeModalCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Curated by <span className="text-emerald-400 font-semibold">{activeModalCourse.creator}</span> • {activeModalCourse.duration}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalCourse(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* VIDEO PLAYER (OFFICIAL YOUTUBE EMBED) */}
            <div className="relative w-full aspect-video bg-black">
              {activeModalCourse.embedPlaylistId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${activeModalCourse.embedPlaylistId}&modestbranding=1&rel=0`}
                  title={activeModalCourse.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={activeModalCourse.youtubeUrl.replace("watch?v=", "embed/")}
                  title={activeModalCourse.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* MODAL DETAILS & ACTIONS */}
            <div className="p-5 overflow-y-auto space-y-4 bg-slate-900 text-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Official YouTube Player Embed (Creator receives 100% views &amp; monetization)</span>
                </div>
                <a
                  href={activeModalCourse.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                >
                  <Youtube className="h-3.5 w-3.5" />
                  Open in YouTube app
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* CURRICULUM HIGHLIGHTS */}
              {activeModalCourse.curriculumModules && activeModalCourse.curriculumModules.length > 0 && (
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-purple-400" />
                    Syllabus Milestones
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {activeModalCourse.curriculumModules.map((mod, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Link href="/problems" className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 rounded-xl">
                    <Code2 className="h-3.5 w-3.5" />
                    Practice Coding Problems
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveModalCourse(null)}
                  className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 text-xs rounded-xl"
                >
                  Close Player
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
