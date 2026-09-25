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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CURATED_COURSES } from "@/lib/courses-data";

export default function PlaylistsPage() {
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3.5 py-1 text-xs font-mono font-semibold text-red-700">
            <Youtube className="h-4 w-4 text-red-600" />
            Curated Free Video Education
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Best YouTube Developer Playlists
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
            Hand-picked, high-signal YouTube playlists from the world&apos;s greatest computer science educators (Striver, Chai aur Code, Andrej Karpathy, 3Blue1Brown, TechWorld with Nana) paired with top open-source GitHub companion repositories.
          </p>

          {/* DEDICATED CALLOUT TO INTERACTIVE COURSES */}
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/80 p-4 text-xs sm:text-sm text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-left">
              <Award className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Looking for Interactive Courses with Diplomas?</span>
                <p className="text-[11px] text-slate-600">
                  Switch to our Interactive Courses to submit project benchmarks and earn cryptographically verifiable Role Nest certificates.
                </p>
              </div>
            </div>
            <Link href="/courses" className="shrink-0">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs">
                Explore Interactive Courses →
              </Button>
            </Link>
          </div>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Playlists ({CURATED_COURSES.length})
            </button>

            <button
              onClick={() => setSelectedCategory("AI_ML")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "AI_ML" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🤖 AI &amp; GenAI
            </button>

            <button
              onClick={() => setSelectedCategory("WEB_DEV")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "WEB_DEV" ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              💻 Web Dev
            </button>

            <button
              onClick={() => setSelectedCategory("DSA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DSA" ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚡ DSA &amp; Coding
            </button>

            <button
              onClick={() => setSelectedCategory("DEVOPS_CLOUD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DEVOPS_CLOUD" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ☁️ Cloud &amp; DevOps
            </button>

            <button
              onClick={() => setSelectedCategory("PYTHON_DATA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "PYTHON_DATA" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
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
                placeholder="Search channel or creator..."
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
                      <span className="text-xs text-slate-500">{item.difficulty}</span>
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
                    title="Watch Playlist on YouTube"
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
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Watch Full Playlist on YouTube</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
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
