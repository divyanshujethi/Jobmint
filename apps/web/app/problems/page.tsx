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
  Crown,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEETCODE_PROBLEMS, Problem } from "@/lib/problems-data";
import { ArenaNavbar } from "@/components/arena-navbar";
import { ArenaFooter } from "@/components/arena-footer";
import { ArenaProModal } from "@/components/arena-pro-modal";

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
  const [allProblems, setAllProblems] = useState<Problem[]>(LEETCODE_PROBLEMS);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    try {
      const solved = localStorage.getItem("jobmint_solved_problems");
      if (solved) setSolvedSlugs(JSON.parse(solved));
      const badges = localStorage.getItem("jobmint_unlocked_badges");
      if (badges) setUnlockedBadges(JSON.parse(badges));
    } catch (e) {}

    // Fetch dynamic + crawled problems
    let isMounted = true;
    fetch("/api/arena/problems")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.problems) && data.problems.length > 0) {
          setAllProblems(data.problems);
        }
      })
      .catch((e) => console.warn("Failed to fetch dynamic problems:", e));

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute categories relevant to selected domain
  const availableCategories = Array.from(
    new Set(
      allProblems.filter((p) => {
        const domain = DOMAINS.find((d) => d.key === selectedDomain);
        return domain ? domain.countMatches(p) : true;
      }).map((p) => p.category)
    )
  );

  const TARGET_COMPANIES = ["All", "Google", "Amazon", "Microsoft", "Swiggy", "Uber"];

  const filteredProblems = allProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.realWorldContext.toLowerCase().includes(search.toLowerCase()) ||
      Boolean(p.companies && p.companies.some((c: string) => c.toLowerCase().includes(search.toLowerCase())));

    const domainConfig = DOMAINS.find((d) => d.key === selectedDomain);
    const matchesDomain = domainConfig ? domainConfig.countMatches(p) : true;

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesCompany =
      selectedCompany === "All" || (p.companies && p.companies.includes(selectedCompany));

    return matchesSearch && matchesDomain && matchesCategory && matchesDifficulty && matchesCompany;
  });

  const totalSolved = solvedSlugs.filter((s) =>
    allProblems.some((p) => p.slug === s)
  ).length;
  const progressPct = Math.round((totalSolved / (allProblems.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans">
      <ArenaNavbar />

      {/* HEADER / HERO */}
      <div className="border-b border-neutral-800 bg-[#0d0d0d] px-4 py-6 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-xs font-black">
                  <Code2 className="h-5 w-5 stroke-[2.5]" />
                </span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                    Problem Set
                  </h1>
                  <span className="inline-block text-[11px] font-semibold text-neutral-400 font-mono">
                    {allProblems.length} Curated Interview Challenges &bull; Live LeetCode Sync &bull; In-Browser Execution
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link href="/potd">
                <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 text-xs shadow-xs transition-all hover:scale-[1.02]">
                  <Flame className="h-4 w-4 fill-slate-950" />
                  Solve Daily POTD (+50 XP)
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs shadow-xs"
                >
                  <Trophy className="h-3.5 w-3.5 text-amber-400 mr-1.5" />
                  Rankings
                </Button>
              </Link>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-3.5 space-y-1 shadow-xs">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Your Progress
              </div>
              <div className="text-xl font-black text-white flex items-baseline gap-1.5 font-mono">
                <span>{totalSolved}</span>
                <span className="text-xs font-normal text-neutral-500">
                  / {allProblems.length} Solved
                </span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-3.5 space-y-1 shadow-xs">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                XP Earned
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                +{totalSolved * 50}{" "}
                <span className="text-xs text-neutral-500 font-normal">XP</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-medium">
                50 XP per accepted submission
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-3.5 space-y-1 shadow-xs">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Badges Claimed
              </div>
              <div className="text-xl font-black text-amber-400 flex items-center gap-1.5 font-mono">
                <Award className="h-5 w-5 text-amber-400" />
                <span>{unlockedBadges.length}</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-medium">
                Mastery badges unlocked
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-[#121212] p-3.5 space-y-1 shadow-xs">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Sandbox Engine
              </div>
              <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 pt-0.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>V8 + Pyodide Worker</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium font-mono">
                Zero server lag &bull; 0ms local
              </div>
            </div>
          </div>

          {/* ARENA PRO MONETIZATION BANNER */}
          <div className="rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-950/30 via-[#141414] to-[#121212] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Crown className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Upgrade to Arena Pro</span>
                  <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.2 border border-amber-500/40">
                    FAANG &amp; Unicorn Packs
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xl">
                  Unlock company-tagged challenges (Google, Amazon, Swiggy, Uber), AI code explanations, mock OA simulators, and verified cryptographic skill badges.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowProModal(true)}
              className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs gap-1.5 shrink-0 px-4 py-2 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Crown className="h-3.5 w-3.5 fill-slate-950" />
              <span>Unlock Pro (₹299/mo)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* DOMAIN TRACKS SELECTOR */}
      <div className="border-b border-neutral-800 bg-[#0a0a0a]/95 sticky top-13 z-20 backdrop-blur-md px-4 py-2 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Domain Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.key;
              const count = allProblems.filter(domain.countMatches).length;
              return (
                <button
                  key={domain.key}
                  onClick={() => {
                    setSelectedDomain(domain.key);
                    setSelectedCategory("All");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "bg-[#141414] text-neutral-400 hover:bg-[#1e1e1e] hover:text-white border border-neutral-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{domain.label}</span>
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-slate-950 text-amber-300 font-bold" : "bg-neutral-800 text-neutral-400"
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
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
              <input
                id="problem-search-input"
                name="search"
                aria-label="Search coding problems"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, topic..."
                className="w-full rounded-lg border border-neutral-800 bg-[#141414] pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded-lg border border-neutral-800">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? "bg-neutral-800 text-white font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY CATEGORY PILLS */}
      {availableCategories.length > 1 && (
        <div className="border-b border-neutral-800 bg-[#0d0d0d] px-4 py-2 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-mono uppercase text-neutral-500 font-bold mr-1 shrink-0">
              Topic:
            </span>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "All"
                  ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30"
                  : "text-neutral-400 hover:text-white"
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
                    ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COMPANY OA FILTER BAR */}
      <div className="border-b border-neutral-800 bg-[#0c0c0c] px-4 py-2 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-mono uppercase text-amber-400 font-bold mr-1 shrink-0 flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            Company OA:
          </span>
          {TARGET_COMPANIES.map((comp) => {
            const count =
              comp === "All"
                ? allProblems.length
                : allProblems.filter((p) => p.companies?.includes(comp)).length;
            return (
              <button
                key={comp}
                onClick={() => setSelectedCompany(comp)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedCompany === comp
                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                    : "bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>{comp === "All" ? "All Companies" : comp}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded-full ${
                    selectedCompany === comp ? "bg-slate-950 text-amber-300" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PROBLEMS LIST */}
      <div className="flex-1 px-4 py-6 sm:px-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto space-y-2.5">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-neutral-800 space-y-3">
              <Code2 className="h-10 w-10 text-neutral-600 mx-auto" />
              <div className="text-white font-bold text-base">No problems match your filter criteria</div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
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
                className="text-xs text-neutral-300 border-neutral-700 bg-neutral-900"
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
                  className="group rounded-xl border border-neutral-800/90 bg-[#121212] p-3.5 sm:p-4 hover:border-neutral-700 hover:bg-[#161616] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  {/* Left: Info */}
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isSolved ? (
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700"
                          title="Solved"
                        >
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-neutral-600" />
                      )}
                      <span className="font-mono text-xs text-neutral-500 font-semibold">
                        #{idx + 1}
                      </span>
                      <Link
                        href={`/potd?problem=${problem.slug}`}
                        className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors"
                      >
                        {problem.title}
                      </Link>
                      <span
                        className={`rounded px-2 py-0.2 text-[10px] font-mono font-bold ${
                          problem.difficulty === "Easy"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                            : problem.difficulty === "Medium"
                            ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                            : "bg-rose-950/60 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.2 text-[10px] font-mono text-neutral-400">
                        {problem.category}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-sans pl-6">
                      <Zap className="h-3 w-3 text-amber-400 shrink-0" />
                      <span className="line-clamp-1">{problem.realWorldContext}</span>
                    </div>

                    {problem.companies && problem.companies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pl-6 pt-0.5">
                        <span className="text-[10px] text-neutral-500 font-mono">Asked in:</span>
                        {problem.companies.slice(0, 4).map((comp: string) => (
                          <span
                            key={comp}
                            className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.2 text-[9px] font-mono text-neutral-300 flex items-center gap-0.5"
                          >
                            <Building2 className="h-2.5 w-2.5 text-amber-400" />
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Acceptance & CTA */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center pl-6 md:pl-0 font-mono">
                    <span className="text-[11px] text-neutral-400">
                      {problem.acceptance}
                    </span>

                    <Link href={`/potd?problem=${problem.slug}`}>
                      <Button
                        size="sm"
                        className={`text-xs font-bold gap-1 h-7 px-3 ${
                          isSolved
                            ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                            : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xs"
                        }`}
                      >
                        <span>{isSolved ? "Practice" : "Solve"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ArenaFooter />

      <ArenaProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </div>
  );
}
