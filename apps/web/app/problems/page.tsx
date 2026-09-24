"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  ArrowRight,
  Search,
  Sparkles,
  Filter,
  Award,
  Zap,
  BookOpen,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEETCODE_PROBLEMS, Problem } from "@/lib/problems-data";

export default function ProblemsCatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    try {
      const solved = localStorage.getItem("jobmint_solved_problems");
      if (solved) setSolvedSlugs(JSON.parse(solved));
      const badges = localStorage.getItem("jobmint_unlocked_badges");
      if (badges) setUnlockedBadges(JSON.parse(badges));
    } catch (e) {}
  }, []);

  const categories = [
    "All",
    "Arrays & Hashing",
    "Stack",
    "Sliding Window",
    "Dynamic Programming",
    "Intervals",
    "Binary Search",
  ];

  const filteredProblems = LEETCODE_PROBLEMS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.realWorldContext.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalSolved = solvedSlugs.filter((s) => LEETCODE_PROBLEMS.some((p) => p.slug === s)).length;
  const progressPct = Math.round((totalSolved / LEETCODE_PROBLEMS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER / HERO */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-8 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-950">
                  <Code2 className="h-4 w-4" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Interview Problem Catalog
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Curated high-frequency engineering interview challenges with in-browser Monaco Editor &amp; sandbox test runner. Zero server lag, 100% free.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/potd">
                <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold gap-2 text-xs shadow-lg shadow-orange-950">
                  <Flame className="h-4 w-4 fill-white" />
                  Solve Problem of the Day (+50 XP)
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs">
                  <Trophy className="h-4 w-4 text-amber-400 mr-1.5" />
                  Leaderboard
                </Button>
              </Link>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Your Progress
              </div>
              <div className="text-xl font-black text-white flex items-baseline gap-1.5">
                <span>{totalSolved}</span>
                <span className="text-xs font-normal text-slate-400">/ {LEETCODE_PROBLEMS.length} Solved</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                XP Earned
              </div>
              <div className="text-xl font-black text-emerald-400">
                +{totalSolved * 50} <span className="text-xs text-slate-400 font-normal">XP</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">50 XP per accepted submission</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Badges Unlocked
              </div>
              <div className="text-xl font-black text-amber-400 flex items-center gap-1.5">
                <Award className="h-5 w-5 text-amber-400" />
                <span>{unlockedBadges.length}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Mastery badges claimable</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Sandboxed Engine
              </div>
              <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5 pt-0.5">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>Web Worker Sandbox</span>
              </div>
              <div className="text-[10px] text-emerald-400/90 font-mono">Zero server latency &amp; TLE guards</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-8 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems, companies, topics..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-950"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                    selectedDifficulty === diff
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEMS LIST */}
      <div className="flex-1 px-4 py-6 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-3">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No interview questions match your filter criteria.
            </div>
          ) : (
            filteredProblems.map((problem, idx) => {
              const isSolved = solvedSlugs.includes(problem.slug);
              return (
                <div
                  key={problem.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isSolved ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800" title="Solved">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <Circle className="h-4 w-4 text-slate-600" />
                      )}
                      <span className="font-mono text-xs text-slate-500 font-bold">
                        #{idx + 1}
                      </span>
                      <Link
                        href={`/potd?problem=${problem.slug}`}
                        className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                          problem.difficulty === "Easy"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : problem.difficulty === "Medium"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {problem.category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-sans pl-7">
                      <Zap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{problem.realWorldContext}</span>
                    </div>
                  </div>

                  {/* Right: Badge & CTA */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center pl-7 md:pl-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                      <span>{problem.badgeName}</span>
                    </div>

                    <span className="text-xs font-mono text-slate-400">
                      {problem.acceptance}
                    </span>

                    <Link href={`/potd?problem=${problem.slug}`}>
                      <Button
                        size="sm"
                        className={`text-xs font-bold gap-1.5 ${
                          isSolved
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950"
                        }`}
                      >
                        <span>{isSolved ? "Practice Again" : "Solve"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
