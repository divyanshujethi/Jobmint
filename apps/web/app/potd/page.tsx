"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Trophy,
  Flame,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Lightbulb,
  Check,
  Shield,
  Zap,
  Terminal,
  Award,
  ListOrdered,
  Layers,
  School,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEETCODE_PROBLEMS, Problem } from "@/lib/problems-data";
import { executeCodeInSandbox, ExecutionReport, SupportedLanguage, SUPPORTED_LANGUAGES } from "@/lib/code-runner";

// Lazy-load Monaco Editor on client side (no SSR, isolated bundle)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 font-mono text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Loading Monaco Code Editor (VS Code Engine)...
      </div>
      <span className="text-[10px] text-slate-600 mt-1">Lazy loaded client-side bundle</span>
    </div>
  ),
});

interface CollegeLeaderboardItem {
  collegeName: string;
  buildersCount: number;
  totalStreakDays: number;
  avgDevScore: number;
  topBuilder: { name: string; streak: number };
}

const DEFAULT_CAMPUS_BATTLES: CollegeLeaderboardItem[] = [
  {
    collegeName: "IIT Delhi",
    buildersCount: 142,
    totalStreakDays: 890,
    avgDevScore: 840,
    topBuilder: { name: "Aarav S.", streak: 42 },
  },
  {
    collegeName: "BITS Pilani",
    buildersCount: 118,
    totalStreakDays: 760,
    avgDevScore: 815,
    topBuilder: { name: "Tanvi M.", streak: 38 },
  },
  {
    collegeName: "DTU Delhi",
    buildersCount: 96,
    totalStreakDays: 610,
    avgDevScore: 790,
    topBuilder: { name: "Rohan V.", streak: 31 },
  },
  {
    collegeName: "VIT Vellore",
    buildersCount: 88,
    totalStreakDays: 540,
    avgDevScore: 765,
    topBuilder: { name: "Pooja K.", streak: 27 },
  },
  {
    collegeName: "NIT Trichy",
    buildersCount: 74,
    totalStreakDays: 480,
    avgDevScore: 780,
    topBuilder: { name: "Karthik R.", streak: 25 },
  },
  {
    collegeName: "NSUT Delhi",
    buildersCount: 65,
    totalStreakDays: 410,
    avgDevScore: 755,
    topBuilder: { name: "Ananya B.", streak: 21 },
  },
];

function POTDWorkspace() {
  const searchParams = useSearchParams();
  const problemSlug = searchParams.get("problem");

  const defaultDayIndex = Math.floor(Date.now() / 86400000) % LEETCODE_PROBLEMS.length;
  const initialProblem =
    (problemSlug && LEETCODE_PROBLEMS.find((p) => p.slug === problemSlug)) ||
    LEETCODE_PROBLEMS[defaultDayIndex] ||
    LEETCODE_PROBLEMS[0];

  const [currentProblem, setCurrentProblem] = useState<Problem>(initialProblem);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [languageCodeMap, setLanguageCodeMap] = useState<Record<SupportedLanguage, string>>({
    javascript: initialProblem.starterCodeJs,
    typescript: initialProblem.starterCodeTs,
    python: initialProblem.starterCodePy,
    cpp: initialProblem.starterCodeCpp,
    java: initialProblem.starterCodeJava,
  });
  const [activeLeftTab, setActiveLeftTab] = useState<"DESCRIPTION" | "HINTS" | "EDITORIAL" | "CAMPUS" | "BADGES">("DESCRIPTION");
  const [activeBottomTab, setActiveBottomTab] = useState<"TEST_CASES" | "CONSOLE">("TEST_CASES");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);

  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<ExecutionReport | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [badgeUnlocked, setBadgeUnlocked] = useState<string | null>(null);
  const [solvedList, setSolvedList] = useState<string[]>([]);

  // Campus Battles & Dev Score State
  const [selectedCampus, setSelectedCampus] = useState<string>("IIT Delhi");
  const [userDevScore, setUserDevScore] = useState<number>(780);
  const [collegeBattles, setCollegeBattles] = useState<CollegeLeaderboardItem[]>(DEFAULT_CAMPUS_BATTLES);

  useEffect(() => {
    try {
      const storedCampus = localStorage.getItem("rolenest_user_campus");
      if (storedCampus) setSelectedCampus(storedCampus);

      const storedSolved = localStorage.getItem("jobmint_solved_problems");
      if (storedSolved) setSolvedList(JSON.parse(storedSolved));
    } catch (e) {}

    // Fetch dynamic leaderboard for campus battles
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data?.collegeBattles && Array.isArray(data.collegeBattles) && data.collegeBattles.length > 0) {
          setCollegeBattles(data.collegeBattles);
        }
      })
      .catch((err) => console.warn("Notice loading campus battles:", err));

    // Fetch user streak for dev score
    fetch("/api/streak")
      .then((res) => res.json())
      .then((data) => {
        if (data?.devScore) setUserDevScore(data.devScore);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (problemSlug) {
      const found = LEETCODE_PROBLEMS.find((p) => p.slug === problemSlug);
      if (found && found.id !== currentProblem.id) {
        setCurrentProblem(found);
      }
    }
  }, [problemSlug]);

  useEffect(() => {
    setLanguageCodeMap({
      javascript: currentProblem.starterCodeJs,
      typescript: currentProblem.starterCodeTs,
      python: currentProblem.starterCodePy,
      cpp: currentProblem.starterCodeCpp,
      java: currentProblem.starterCodeJava,
    });
    setReport(null);
    setSubmitMessage(null);
    setActiveTestCaseIdx(0);
    setBadgeUnlocked(null);
  }, [currentProblem]);

  const handleResetCode = () => {
    const defaultStarter =
      selectedLanguage === "javascript"
        ? currentProblem.starterCodeJs
        : selectedLanguage === "typescript"
        ? currentProblem.starterCodeTs
        : selectedLanguage === "python"
        ? currentProblem.starterCodePy
        : selectedLanguage === "cpp"
        ? currentProblem.starterCodeCpp
        : currentProblem.starterCodeJava;

    setLanguageCodeMap((prev) => ({
      ...prev,
      [selectedLanguage]: defaultStarter,
    }));
  };

  const handleCodeChange = (newCode: string | undefined) => {
    if (typeof newCode === "string") {
      setLanguageCodeMap((prev) => ({
        ...prev,
        [selectedLanguage]: newCode,
      }));
    }
  };

  const handleRun = async (isSubmission: boolean = false) => {
    if (running) return;
    setRunning(true);
    setSubmitMessage(null);

    const testCasesToRun = isSubmission
      ? currentProblem.testCases
      : currentProblem.testCases.filter((tc) => !tc.isHidden);

    try {
      const currentCode = languageCodeMap[selectedLanguage] || "";
      const timeout = selectedLanguage === "python" ? 6000 : 3500;
      const execReport = await executeCodeInSandbox(currentCode, testCasesToRun, selectedLanguage, timeout);
      setReport(execReport);

      if (isSubmission) {
        if (execReport.allPassed) {
          const newSolved = Array.from(new Set([...solvedList, currentProblem.slug]));
          setSolvedList(newSolved);
          try {
            localStorage.setItem("jobmint_solved_problems", JSON.stringify(newSolved));
            const badgesStored = localStorage.getItem("jobmint_unlocked_badges");
            const badgesList: string[] = badgesStored ? JSON.parse(badgesStored) : [];
            if (!badgesList.includes(currentProblem.badgeName)) {
              badgesList.push(currentProblem.badgeName);
              localStorage.setItem("jobmint_unlocked_badges", JSON.stringify(badgesList));
            }
          } catch (e) {}

          setBadgeUnlocked(currentProblem.badgeName);
          setSubmitMessage(`🎉 All ${execReport.totalTests} test cases passed! +50 XP Awarded & Habit Streak Saved!`);

          fetch("/api/streak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questId: "potd", problemSlug: currentProblem.slug }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data?.devScore) {
                setUserDevScore(data.devScore);
                setSubmitMessage(
                  `🎉 All ${execReport.totalTests} test cases passed! +50 XP Awarded & Dev Score boosted to ${data.devScore}/1000!`
                );
              }
            })
            .catch(() => {});
        } else {
          setSubmitMessage(`❌ ${execReport.passedTests}/${execReport.totalTests} test cases passed. Inspect failures and debug your code.`);
        }
      }
    } catch (err: any) {
      setSubmitMessage(`Execution error: ${err?.message || "Unknown error"}`);
    } finally {
      setRunning(false);
    }
  };

  const isCurrentSolved = solvedList.includes(currentProblem.slug);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* TOP HEADER */}
      <header className="border-b border-slate-800 bg-slate-950 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Problem Catalog</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-600 text-xs font-black text-white shadow-sm shadow-orange-950">
              🔥
            </span>
            <span className="font-bold text-sm text-white">
              Problem of the Day
            </span>
            <span className="rounded bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
              +50 XP
            </span>
            <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
              Dev Score: {userDevScore}/1000
            </span>
            {isCurrentSolved && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-900/60 border border-emerald-700 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <Check className="h-3 w-3" /> Solved
              </span>
            )}
          </div>
        </div>

        {/* Quick Problem Switcher */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {LEETCODE_PROBLEMS.map((p, idx) => {
              const solved = solvedList.includes(p.slug);
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentProblem(p)}
                  title={p.title}
                  className={`relative px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    currentProblem.id === p.id
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900"
                      : "bg-slate-800/80 text-slate-400 hover:text-white"
                  }`}
                >
                  #{idx + 1}
                  {solved && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                  )}
                </button>
              );
            })}
          </div>

          <Link
            href="/problems"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-900 bg-emerald-950/40"
          >
            <ListOrdered className="h-3.5 w-3.5" />
            <span>All Problems ({LEETCODE_PROBLEMS.length})</span>
          </Link>
        </div>
      </header>

      {/* SPLIT WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-53px)]">
        
        {/* LEFT COLUMN: DESCRIPTION & TABS */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950 flex flex-col h-full overflow-hidden">
          {/* Sub Navigation */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 px-4 pt-2.5 pb-2 bg-slate-950 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveLeftTab("DESCRIPTION")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeLeftTab === "DESCRIPTION"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Description
            </button>
            <button
              onClick={() => setActiveLeftTab("HINTS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeLeftTab === "HINTS"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              Hints ({currentProblem.hints.length})
            </button>
            <button
              onClick={() => setActiveLeftTab("EDITORIAL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeLeftTab === "EDITORIAL"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Editorial
            </button>
            <button
              onClick={() => setActiveLeftTab("CAMPUS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeLeftTab === "CAMPUS"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-orange-400" />
              Campus Battles
            </button>
            <button
              onClick={() => setActiveLeftTab("BADGES")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeLeftTab === "BADGES"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Badge
            </button>
          </div>

          {/* Left Pane Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto text-slate-300 text-xs sm:text-sm leading-relaxed">
            {activeLeftTab === "DESCRIPTION" && (
              <>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold font-mono ${
                        currentProblem.difficulty === "Easy"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : currentProblem.difficulty === "Medium"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-rose-950 text-rose-400 border border-rose-800"
                      }`}
                    >
                      {currentProblem.difficulty}
                    </span>
                    <span className="text-slate-400 font-mono text-xs">
                      {currentProblem.category}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-400 text-xs font-mono">
                      Acceptance: {currentProblem.acceptance}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white tracking-tight">
                    {currentProblem.title}
                  </h2>
                </div>

                {/* Real-World Context Callout */}
                <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/30 p-3.5 text-emerald-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400 text-[11px] uppercase tracking-wider font-mono">
                    <Zap className="h-3.5 w-3.5" />
                    Real-World Engineering Context
                  </div>
                  <div className="leading-relaxed">{currentProblem.realWorldContext}</div>
                </div>

                {/* Markdown Description Body */}
                <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans space-y-3">
                  {currentProblem.description}
                </div>

                {/* Visible Test Case Examples */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                    Sample Test Cases
                  </h3>
                  {currentProblem.testCases
                    .filter((tc) => !tc.isHidden)
                    .map((tc, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs font-mono space-y-1"
                      >
                        <div className="text-slate-400">
                          <strong className="text-slate-300">Input:</strong>{" "}
                          <span className="text-emerald-400">{JSON.stringify(tc.inputArgs)}</span>
                        </div>
                        <div className="text-slate-400">
                          <strong className="text-slate-300">Expected:</strong>{" "}
                          <span className="text-orange-400">{JSON.stringify(tc.expected)}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                    Constraints
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                    {currentProblem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeLeftTab === "HINTS" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Guided Hints</h3>
                  <p className="text-xs text-slate-400">
                    Try solving step-by-step before opening the full editorial.
                  </p>
                </div>
                {currentProblem.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-1"
                  >
                    <div className="text-amber-400 font-bold text-xs font-mono flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" />
                      HINT {idx + 1}
                    </div>
                    <div className="text-slate-300 text-xs leading-relaxed">{hint}</div>
                  </div>
                ))}
              </div>
            )}

            {activeLeftTab === "EDITORIAL" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Editorial & Complexity Analysis</h3>
                  <p className="text-xs text-slate-400">
                    Industry benchmark solution and algorithmic time complexity.
                  </p>
                </div>
                <div className="whitespace-pre-line text-slate-300 text-xs leading-relaxed font-sans rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
                  {currentProblem.editorial}
                </div>
              </div>
            )}

            {/* TAB 4: CAMPUS BATTLES & DEV SCORE SHOWCASE */}
            {activeLeftTab === "CAMPUS" && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-orange-400" />
                      Campus Battles &amp; Leaderboard
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                      Live Rankings
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Daily problem solves directly increase your college team's score and showcase your Verified Dev Score to hiring companies.
                  </p>
                </div>

                {/* College Selector / Affiliation Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <School className="h-3.5 w-3.5 text-orange-400" /> Your College / Campus:
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      Dev Score: {userDevScore}/1000
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedCampus}
                      onChange={(e) => {
                        setSelectedCampus(e.target.value);
                        try {
                          localStorage.setItem("rolenest_user_campus", e.target.value);
                        } catch (err) {}
                      }}
                      placeholder="e.g. IIT Delhi, BITS Pilani, DTU, VIT..."
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <span className="text-[11px] font-mono font-bold bg-orange-950/60 border border-orange-800/80 text-orange-300 px-2.5 py-1.5 rounded-xl whitespace-nowrap">
                      🔥 Active Fighter
                    </span>
                  </div>
                </div>

                {/* National Rankings */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Top Engineering Colleges
                  </span>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden divide-y divide-slate-800/80">
                    {collegeBattles.map((c, idx) => (
                      <div
                        key={c.collegeName}
                        className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                          selectedCampus.toLowerCase() === c.collegeName.toLowerCase()
                            ? "bg-emerald-950/40 border-l-2 border-emerald-500"
                            : "hover:bg-slate-900/50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono font-black text-[11px] ${
                              idx === 0
                                ? "bg-amber-500 text-slate-950"
                                : idx === 1
                                ? "bg-slate-300 text-slate-950"
                                : idx === 2
                                ? "bg-amber-700 text-white"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {c.collegeName}
                              {selectedCampus.toLowerCase() === c.collegeName.toLowerCase() && (
                                <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1.5 py-0.2 font-mono">
                                  YOUR CAMPUS
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {c.buildersCount} builders • MVP: {c.topBuilder?.name || "Student"} ({c.topBuilder?.streak || 24}d streak)
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-emerald-400">
                            {c.avgDevScore} DevScore
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.totalStreakDays} streak pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Showcase Dev Score to Employers */}
                <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950/40 to-slate-900 p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-400" />
                    <h4 className="font-bold text-white text-xs">
                      Showcase Dev Score Directly to Employers
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Hiring companies on Role Nest (Swiggy, Razorpay, Google, Zepto) filter candidates by Verified Dev Score. Each POTD you solve increases your verified score, bypassing the ATS queue automatically.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link
                      href={`/dev-score?score=${userDevScore}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-colors"
                    >
                      <span>View Verified Certificate</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                    <button
                      onClick={() => {
                        const badgeCode = `[![Role Nest Verified Dev](https://img.shields.io/badge/Role%20Nest%20Dev%20Score-${userDevScore}%2F1000-10b981?style=for-the-badge&logo=github)](https://rolenest.in/dev-score?score=${userDevScore})`;
                        navigator.clipboard.writeText(badgeCode);
                        alert("GitHub / Resume Dev Score Badge Markdown copied to clipboard!");
                      }}
                      className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs font-bold transition-colors"
                    >
                      Copy Badge Markdown
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === "BADGES" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Problem Achievement Badge</h3>
                  <p className="text-xs text-slate-400">
                    Solve all test cases to permanently unlock this badge on your profile.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-center text-center space-y-3">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-3xl">
                    🏆
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{currentProblem.badgeName}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Awarded for mastering {currentProblem.category} algorithms in browser sandbox.
                    </p>
                  </div>
                  {isCurrentSolved ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 border border-emerald-700 px-3 py-1 text-xs font-bold text-emerald-400">
                      <Check className="h-3.5 w-3.5" /> Unlocked & Claimed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-mono text-slate-400">
                      🔒 Locked (Solve Problem to Earn)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MONACO EDITOR + TEST RUNNER HUD */}
        <div className="lg:col-span-7 bg-slate-900 flex flex-col h-full overflow-hidden">
          
          {/* Editor Header Bar */}
          <div className="border-b border-slate-800 bg-slate-950 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-4 w-4 text-emerald-500" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Language:
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                  className="rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-200">
                      {lang.name} ({lang.badge})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[10px] font-mono rounded bg-slate-800/80 px-2 py-0.5 text-slate-400 border border-slate-700/60 hidden sm:inline">
                {SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.version}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-mono transition-colors px-2 py-1 rounded hover:bg-slate-800"
                title={`Reset ${selectedLanguage} starter code`}
              >
                <RotateCcw className="h-3 w-3" /> Reset Code
              </button>
            </div>
          </div>

          {/* Lazy Monaco Editor Container */}
          <div className="flex-1 relative bg-slate-950 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.monacoLang || "javascript"}
              theme="vs-dark"
              value={languageCodeMap[selectedLanguage] || ""}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                tabSize: 2,
              }}
            />
          </div>

          {/* TEST RUNNER HUD */}
          <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3 shrink-0">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Output Sub-Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveBottomTab("TEST_CASES")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    activeBottomTab === "TEST_CASES"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Test Results
                </button>
                <button
                  onClick={() => setActiveBottomTab("CONSOLE")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    activeBottomTab === "CONSOLE"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Console Logs
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRun(false)}
                  disabled={running}
                  className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  {running ? "Running..." : "Run Code"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRun(true)}
                  disabled={running}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5 shadow-md shadow-emerald-950"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {running ? "Evaluating..." : "Submit Solution (+50 XP)"}
                </Button>
              </div>
            </div>

            {/* Test Output Panel */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
              
              {/* Submission Banner */}
              {submitMessage && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-bold space-y-2 ${
                    submitMessage.startsWith("🎉")
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      : "bg-rose-950/80 text-rose-300 border border-rose-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{submitMessage}</span>
                    {badgeUnlocked && (
                      <span className="text-[11px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded text-white flex items-center gap-1">
                        🏆 {badgeUnlocked}
                      </span>
                    )}
                  </div>

                  {submitMessage.startsWith("🎉") && (
                    <div className="flex items-center gap-2 pt-1 font-sans">
                      <button
                        onClick={() => setActiveLeftTab("CAMPUS")}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Trophy className="h-3 w-3" /> View Campus Rank
                      </button>
                      <Link
                        href={`/dev-score?score=${userDevScore}`}
                        target="_blank"
                        className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Award className="h-3 w-3 text-amber-400" /> Showcase to Employers
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Errors (Compilation / Sandbox TLE) */}
              {report?.compilationError && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                  <strong>Syntax / Compilation Error:</strong>
                  <pre className="mt-1 font-mono text-[11px] whitespace-pre-wrap">{report.compilationError}</pre>
                </div>
              )}

              {report?.runtimeError && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                  <strong>Runtime / Sandbox Error:</strong>
                  <pre className="mt-1 font-mono text-[11px] whitespace-pre-wrap">{report.runtimeError}</pre>
                </div>
              )}

              {/* TEST CASE SELECTOR & DETAILS */}
              {activeBottomTab === "TEST_CASES" && (
                <div className="space-y-3">
                  {report ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        {report.results.map((r, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTestCaseIdx(idx)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                              activeTestCaseIdx === idx
                                ? "bg-slate-800 text-white ring-1 ring-slate-600"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {r.passed ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-rose-400" />
                            )}
                            Case #{idx + 1}
                          </button>
                        ))}
                      </div>

                      {report.results[activeTestCaseIdx] && (
                        <div className="space-y-1.5 pt-1 text-[11px]">
                          <div className="flex items-center gap-3 text-slate-400">
                            <span>Status:</span>
                            <span
                              className={`font-bold ${
                                report.results[activeTestCaseIdx].passed
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {report.results[activeTestCaseIdx].passed ? "Passed" : "Failed"}
                            </span>
                            <span>•</span>
                            <span>Time: {report.results[activeTestCaseIdx].durationMs}ms</span>
                          </div>

                          <div>
                            <span className="text-slate-400">Input:</span>{" "}
                            <span className="text-emerald-400">
                              {JSON.stringify(report.results[activeTestCaseIdx].inputArgs)}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400">Expected:</span>{" "}
                            <span className="text-orange-400">
                              {JSON.stringify(report.results[activeTestCaseIdx].expected)}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400">Actual Output:</span>{" "}
                            <span
                              className={
                                report.results[activeTestCaseIdx].passed
                                  ? "text-emerald-400"
                                  : "text-rose-400 font-bold"
                              }
                            >
                              {typeof report.results[activeTestCaseIdx].actual === "undefined"
                                ? "undefined"
                                : JSON.stringify(report.results[activeTestCaseIdx].actual)}
                            </span>
                          </div>

                          {report.results[activeTestCaseIdx].error && (
                            <div className="text-rose-400 text-[11px] pt-1">
                              Error: {report.results[activeTestCaseIdx].error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 py-1">
                      Ready to test. Click <strong>Run Code</strong> or <strong>Submit Solution</strong> to run test cases in isolated browser sandbox.
                    </div>
                  )}
                </div>
              )}

              {/* CONSOLE OUTPUT TAB */}
              {activeBottomTab === "CONSOLE" && (
                <div className="space-y-1">
                  {report?.logs && report.logs.length > 0 ? (
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      {report.logs.map((log, idx) => (
                        <div key={idx} className="leading-snug">
                          {log}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 py-1">
                      No console output. Use <code>console.log()</code> inside your solution to trace variables.
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function POTDPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 font-mono text-sm">
          Loading Problem Workspace...
        </div>
      }
    >
      <POTDWorkspace />
    </Suspense>
  );
}
