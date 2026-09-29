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
  Cpu,
  Globe,
  Server,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEETCODE_PROBLEMS, Problem } from "@/lib/problems-data";

type DomainKey = "all" | "dsa" | "aiml" | "web" | "system";

const DOMAINS: { key: DomainKey; label: string; icon: any; countMatches: (p: Problem) => boolean }[] = [
  {
    key: "all",
    label: "All Tracks",
    icon: Layers,
    countMatches: () => true,
  },
  {
    key: "dsa",
    label: "DSA & Algorithms",
    icon: Zap,
    countMatches: (p) =>
      !["AI & Machine Learning", "Web Engineering", "System Design"].includes(p.category),
  },
  {
    key: "aiml",
    label: "AI & ML Systems",
    icon: Cpu,
    countMatches: (p) => p.category === "AI & Machine Learning",
  },
  {
    key: "web",
    label: "Web Engineering",
    icon: Globe,
    countMatches: (p) => p.category === "Web Engineering",
  },
  {
    key: "system",
    label: "System Design",
    icon: Server,
    countMatches: (p) => p.category === "System Design",
  },
];

export default function ProblemsCatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>("all");
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

  // Compute categories relevant to selected domain
  const availableCategories = Array.from(
    new Set(
      LEETCODE_PROBLEMS.filter((p) => {
        const domain = DOMAINS.find((d) => d.key === selectedDomain);
        return domain ? domain.countMatches(p) : true;
      }).map((p) => p.category)
    )
  );

  const filteredProblems = LEETCODE_PROBLEMS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.realWorldContext.toLowerCase().includes(search.toLowerCase());

    const domainConfig = DOMAINS.find((d) => d.key === selectedDomain);
    const matchesDomain = domainConfig ? domainConfig.countMatches(p) : true;

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

    return matchesSearch && matchesDomain && matchesCategory && matchesDifficulty;
  });

  const totalSolved = solvedSlugs.filter((s) =>
    LEETCODE_PROBLEMS.some((p) => p.slug === s)
  ).length;
  const progressPct = Math.round((totalSolved / LEETCODE_PROBLEMS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* HEADER / HERO */}
      <div className="border-b border-slate-200 bg-white px-4 py-8 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
                  <Code2 className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    Interview Problem Catalog
                  </h1>
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full mt-0.5">
                    15 Curated Practice Problems &bull; 0ms Web Worker Sandbox
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl pt-1">
                Battle-tested engineering challenges spanning Algorithms, AI Models, System Design, and Modern Frontend. Code in JS, TS, Python, C++, or Java with instant local test evaluation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/potd">
                <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold gap-2 text-xs shadow-md shadow-orange-100 transition-all hover:scale-[1.02]">
                  <Flame className="h-4 w-4 fill-white" />
                  Solve Problem of the Day (+50 XP)
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs shadow-xs"
                >
                  <Trophy className="h-4 w-4 text-amber-500 mr-1.5" />
                  Leaderboard
                </Button>
              </Link>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Your Progress
              </div>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1.5">
                <span>{totalSolved}</span>
                <span className="text-xs font-normal text-slate-500">
                  / {LEETCODE_PROBLEMS.length} Solved
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                XP Earned
              </div>
              <div className="text-2xl font-black text-emerald-600">
                +{totalSolved * 50}{" "}
                <span className="text-xs text-slate-500 font-normal">XP</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                50 XP per accepted submission
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Badges Unlocked
              </div>
              <div className="text-2xl font-black text-amber-600 flex items-center gap-1.5">
                <Award className="h-6 w-6 text-amber-500" />
                <span>{unlockedBadges.length}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Mastery badges claimable
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Sandboxed Engine
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pt-0.5">
                <Zap className="h-4 w-4 text-emerald-600" />
                <span>Web Worker Sandbox</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Zero server lag &bull; TLE protected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOMAIN TRACKS SELECTOR */}
      <div className="border-b border-slate-200 bg-white/90 sticky top-0 z-20 backdrop-blur-md px-4 py-2 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Domain Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.key;
              const count = LEETCODE_PROBLEMS.filter(domain.countMatches).length;
              return (
                <button
                  key={domain.key}
                  onClick={() => {
                    setSelectedDomain(domain.key);
                    setSelectedCategory("All");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{domain.label}</span>
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-emerald-700 text-emerald-100" : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Difficulty Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="problem-search-input"
                name="search"
                aria-label="Search coding problems"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems, topics, companies..."
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY CATEGORY PILLS (if more than 1 category in selected domain) */}
      {availableCategories.length > 1 && (
        <div className="border-b border-slate-200/60 bg-slate-100/60 px-4 py-2 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold mr-1 shrink-0">
              Topic:
            </span>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "All"
                  ? "bg-white text-emerald-700 font-bold border border-slate-200 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Topics
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-white text-emerald-700 font-bold border border-slate-200 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PROBLEMS LIST */}
      <div className="flex-1 px-4 py-6 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-3">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <Code2 className="h-10 w-10 text-slate-400 mx-auto" />
              <div className="text-slate-700 font-bold text-base">No problems match your filter criteria</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching domains, changing difficulty, or clearing your search term.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedDomain("all");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                }}
                className="text-xs text-slate-700 border-slate-300"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            filteredProblems.map((problem, idx) => {
              const isSolved = solvedSlugs.includes(problem.slug);
              return (
                <div
                  key={problem.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isSolved ? (
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300"
                          title="Solved"
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : (
                        <Circle className="h-4 w-4 text-slate-300" />
                      )}
                      <span className="font-mono text-xs text-slate-400 font-bold">
                        #{idx + 1}
                      </span>
                      <Link
                        href={`/potd?problem=${problem.slug}`}
                        className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                          problem.difficulty === "Easy"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : problem.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="rounded bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                        {problem.category}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1.5 font-sans pl-7">
                      <Zap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{problem.realWorldContext}</span>
                    </div>
                  </div>

                  {/* Right: Badge & CTA */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center pl-7 md:pl-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span>{problem.badgeName}</span>
                    </div>

                    <span className="text-xs font-mono text-slate-500 font-medium">
                      {problem.acceptance}
                    </span>

                    <Link href={`/potd?problem=${problem.slug}`}>
                      <Button
                        size="sm"
                        className={`text-xs font-bold gap-1.5 ${
                          isSolved
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        }`}
                      >
                        <span>{isSolved ? "Practice Again" : "Solve Challenge"}</span>
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
