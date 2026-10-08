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
  Crown,
  X,
  MessageCircle,
  Linkedin,
  ArrowRight,
  Briefcase,
  AlertTriangle,
  MapPin,
  PlusCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEETCODE_PROBLEMS, Problem } from "@/lib/problems-data";
import { executeCodeInSandbox, ExecutionReport, SupportedLanguage, SUPPORTED_LANGUAGES } from "@/lib/code-runner";
import { openCashfreeCheckout } from "@/components/cashfree-provider";
import { CodeEditorFallback } from "@/components/code-editor-fallback";
import { ArenaNavbar } from "@/components/arena-navbar";
import { ArenaFooter } from "@/components/arena-footer";
import { ArenaProModal } from "@/components/arena-pro-modal";

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

const POPULAR_COLLEGES = [
  "Delhi Technological University (DTU)",
  "IIT Bombay",
  "IIT Delhi",
  "BITS Pilani",
  "NIT Trichy",
  "NSUT Delhi",
  "VIT Vellore",
  "SRM Institute of Science and Technology",
  "Manipal Institute of Technology",
  "Pune University (SPPU)",
  "Anna University Chennai",
  "Mumbai University (VJTI/SPIT)",
];

function POTDWorkspace() {
  const searchParams = useSearchParams();
  const problemSlug = searchParams.get("problem");

  const dayNumber = Math.floor(Date.now() / 86400000);
  const defaultDayIndex = dayNumber % LEETCODE_PROBLEMS.length;
  const standardDailyProblem = LEETCODE_PROBLEMS[defaultDayIndex] || LEETCODE_PROBLEMS[0];

  const hardProblems = LEETCODE_PROBLEMS.filter((p) => p.difficulty === "Hard");
  const superHardDailyProblems = [
    hardProblems[dayNumber % hardProblems.length],
    hardProblems[(dayNumber + 1) % hardProblems.length],
    hardProblems[(dayNumber + 2) % hardProblems.length],
  ].filter(Boolean);

  const initialProblem =
    (problemSlug && LEETCODE_PROBLEMS.find((p) => p.slug === problemSlug)) ||
    standardDailyProblem;

  const [allProblems, setAllProblems] = useState<Problem[]>(LEETCODE_PROBLEMS);
  const [dailyProblem, setDailyProblem] = useState<Problem>(standardDailyProblem);
  const [superHardList, setSuperHardList] = useState<Problem[]>(superHardDailyProblems);
  const [currentProblem, setCurrentProblem] = useState<Problem>(initialProblem);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [languageCodeMap, setLanguageCodeMap] = useState<Record<SupportedLanguage, string>>({
    javascript: initialProblem.starterCodeJs,
    typescript: initialProblem.starterCodeTs,
    python: initialProblem.starterCodePy,
    cpp: initialProblem.starterCodeCpp,
    java: initialProblem.starterCodeJava,
  });
  const [activeLeftTab, setActiveLeftTab] = useState<"DESCRIPTION" | "HINTS" | "EDITORIAL" | "AI_REVIEW" | "CAMPUS" | "BADGES">("DESCRIPTION");
  const [activeBottomTab, setActiveBottomTab] = useState<"TEST_CASES" | "CONSOLE">("TEST_CASES");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);

  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<ExecutionReport | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [badgeUnlocked, setBadgeUnlocked] = useState<string | null>(null);
  const [solvedList, setSolvedList] = useState<string[]>([]);

  // Campus Battles & Dev Score State
  const [selectedCampus, setSelectedCampus] = useState<string>("IIT Delhi");
  const [userDevScore, setUserDevScore] = useState<number>(0);
  const [collegeBattles, setCollegeBattles] = useState<CollegeLeaderboardItem[]>(DEFAULT_CAMPUS_BATTLES);
  const [registeredCollegesList, setRegisteredCollegesList] = useState<{ id?: string; name: string; location: string; state?: string | null }[]>([]);
  const [showRegisterCollegeModal, setShowRegisterCollegeModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeLocation, setNewCollegeLocation] = useState("");
  const [newCollegeState, setNewCollegeState] = useState("");
  const [registeringCollegeLoading, setRegisteringCollegeLoading] = useState(false);
  const [campusSavedMsg, setCampusSavedMsg] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"PROBLEM" | "CODE">("PROBLEM");
  const [editorEngine, setEditorEngine] = useState<"monaco" | "lightweight">("lightweight");
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [showProCelebration, setShowProCelebration] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  // Mock OA Assessment Simulator State
  const [isMockOaActive, setIsMockOaActive] = useState(false);
  const [mockOaSecondsLeft, setMockOaSecondsLeft] = useState(3600);
  const [mockOaScore, setMockOaScore] = useState<{ completed: boolean; timeTaken: string; passed: boolean } | null>(null);

  // AI Code Review & Explainer State
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReviewData, setAiReviewData] = useState<any>(null);
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);

  // Sponsored Hackathons / POTD B2B Monetization State
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [sponsorCompany, setSponsorCompany] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [sponsorTier, setSponsorTier] = useState<"STANDARD" | "PRO" | "FLAGSHIP">("PRO");
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Mock OA Simulator 60-min countdown timer
  useEffect(() => {
    if (!isMockOaActive) return;
    const interval = setInterval(() => {
      setMockOaSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsMockOaActive(false);
          setMockOaScore({
            completed: true,
            timeTaken: "60:00 (Time Expired)",
            passed: false,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isMockOaActive]);

  const handleRunAiReview = async () => {
    setAiReviewLoading(true);
    setAiReviewError(null);
    try {
      const currentCode = languageCodeMap[selectedLanguage] || "";
      const res = await fetch("/api/arena/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentCode,
          language: selectedLanguage,
          problemTitle: currentProblem.title,
          problemDescription: currentProblem.description,
          category: currentProblem.category,
          difficulty: currentProblem.difficulty,
        }),
      });
      if (!res.ok) throw new Error("Could not generate AI code review");
      const data = await res.json();
      setAiReviewData(data);
      setActiveLeftTab("AI_REVIEW");
    } catch (err: any) {
      setAiReviewError(err?.message || "AI review failed. Please try again.");
    } finally {
      setAiReviewLoading(false);
    }
  };

  const handleSaveCollege = async (cName: string, loc?: string, st?: string) => {
    setSelectedCampus(cName);
    try {
      localStorage.setItem("rolenest_user_campus", cName);
    } catch (err) {}
    try {
      const res = await fetch("/api/candidate/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeName: cName, location: loc, state: st }),
      });
      if (res.ok) {
        setCampusSavedMsg(`🏫 Representing ${cName}!`);
        // Refresh registered colleges & leaderboard
        fetch("/api/candidate/college")
          .then((r) => r.json())
          .then((colRes) => {
            if (colRes?.registeredColleges) setRegisteredCollegesList(colRes.registeredColleges);
          });
        fetch("/api/leaderboard")
          .then((r) => r.json())
          .then((leadRes) => {
            if (leadRes?.collegeRankings && Array.isArray(leadRes.collegeRankings)) {
              setCollegeBattles(
                leadRes.collegeRankings.map((c: any) => ({
                  collegeName: c.collegeName,
                  buildersCount: c.buildersCount,
                  totalStreakDays: c.totalStreakDays,
                  avgDevScore: c.avgDevScore,
                  topBuilder: c.topBuilder || { name: "Builder", streak: 0 },
                }))
              );
            }
          });
        setTimeout(() => setCampusSavedMsg(null), 3500);
      }
    } catch {
      setCampusSavedMsg("College updated!");
      setTimeout(() => setCampusSavedMsg(null), 3000);
    }
  };

  const handleRegisterNewCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;
    setRegisteringCollegeLoading(true);
    try {
      await handleSaveCollege(
        newCollegeName.trim(),
        newCollegeLocation.trim() || "India",
        newCollegeState.trim() || undefined
      );
      setShowRegisterCollegeModal(false);
      setNewCollegeName("");
      setNewCollegeLocation("");
      setNewCollegeState("");
    } finally {
      setRegisteringCollegeLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    try {
      const storedCampus = localStorage.getItem("rolenest_user_campus");
      if (storedCampus) setSelectedCampus(storedCampus);

      const storedSolved = localStorage.getItem("jobmint_solved_problems");
      if (storedSolved) {
        const parsedSolved = JSON.parse(storedSolved);
        if (Array.isArray(parsedSolved) && parsedSolved.length > 0) {
          setSolvedList(parsedSolved);
          setUserDevScore(Math.min(1000, parsedSolved.length * 50));
        }
      }

      const storedGithubScore = localStorage.getItem("jobmint_github_dev_score");
      if (storedGithubScore) {
        const parsedGScore = parseInt(storedGithubScore, 10);
        if (!isNaN(parsedGScore) && parsedGScore > 0) {
          setUserDevScore(parsedGScore);
        }
      }
    } catch (e) {}

    // Fetch dynamic leaderboard for campus battles
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data?.collegeRankings && Array.isArray(data.collegeRankings) && data.collegeRankings.length > 0) {
          setCollegeBattles(
            data.collegeRankings.map((c: any) => ({
              collegeName: c.collegeName,
              buildersCount: c.buildersCount,
              totalStreakDays: c.totalStreakDays,
              avgDevScore: c.avgDevScore,
              topBuilder: c.topBuilder || { name: "Builder", streak: 0 },
            }))
          );
        }
      })
      .catch((err) => console.warn("Notice loading campus battles:", err));

    // Fetch registered colleges & user college from backend
    fetch("/api/candidate/college")
      .then((res) => res.json())
      .then((colData) => {
        if (colData?.collegeName) {
          setSelectedCampus(colData.collegeName);
        }
        if (colData?.registeredColleges && Array.isArray(colData.registeredColleges)) {
          setRegisteredCollegesList(colData.registeredColleges);
        }
      })
      .catch(() => {});

      // Fetch user streak for dev score
    fetch("/api/streak")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.devScore === "number") {
          setUserDevScore(data.devScore);
        }
      })
      .catch(() => {});

    // Fetch dynamic Daily POTD & Super Hard problems
    fetch("/api/arena/potd/daily")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.success) return;
        if (data.daily) {
          setDailyProblem(data.daily);
          if (!problemSlug) {
            setCurrentProblem(data.daily);
          }
        }
        if (Array.isArray(data.superHard) && data.superHard.length > 0) {
          setSuperHardList(data.superHard);
        }
      })
      .catch((e) => console.warn("Failed to fetch daily POTD:", e));

    // Fetch all catalog problems (static + crawled)
    fetch("/api/arena/problems")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.success || !Array.isArray(data.problems)) return;
        setAllProblems(data.problems);
      })
      .catch((e) => console.warn("Failed to fetch arena problems:", e));
  }, []);

  useEffect(() => {
    if (problemSlug) {
      const found = allProblems.find((p) => p.slug === problemSlug);
      if (found) {
        if (found.id !== currentProblem.id) {
          setCurrentProblem(found);
        }
      } else {
        // Fetch specific dynamic problem by slug
        fetch(`/api/arena/problems?slug=${encodeURIComponent(problemSlug)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.problem) {
              setCurrentProblem(data.problem);
              setAllProblems((prev) => {
                if (prev.some((p) => p.slug === data.problem.slug)) return prev;
                return [data.problem, ...prev];
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [problemSlug, allProblems]);

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
          setShowProCelebration(true);
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const audioCtx = new AudioContextClass();
              const notes = [523.25, 659.25, 783.99, 1046.5];
              notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + idx * 0.08);
                osc.stop(audioCtx.currentTime + idx * 0.08 + 0.35);
              });
            }
          } catch {}
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
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex flex-col font-sans">
      <ArenaNavbar />

      {/* GUEST WARNING & LOGIN BANNER */}
      {!user && (
        <div className="bg-amber-950/40 border-b border-amber-800/60 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>
              You are coding as a <strong>Guest</strong>. Sign in with your RoleNest account to permanently track your streak, earn XP, and climb the Campus Leaderboard!
            </span>
          </div>
          <a
            href={`https://rolenest.in/login?callbackUrl=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : "https://problem.rolenest.in/potd"
            )}`}
            className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shrink-0 transition-colors"
          >
            Sign In with RoleNest
          </a>
        </div>
      )}

      {/* LEETCODE STYLE PROBLEM CONTROL BAR */}
      <div className="border-b border-neutral-800 bg-[#0d0d0d] px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Problem Set</span>
          </Link>
          <span className="text-neutral-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-orange-600/20 text-orange-400 text-xs font-bold border border-orange-500/30">
              🔥
            </span>
            <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[200px] sm:max-w-md">
              {currentProblem.title}
            </span>
            <span
              className={`rounded px-2 py-0.2 text-[10px] font-mono font-bold ${
                currentProblem.difficulty === "Easy"
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                  : currentProblem.difficulty === "Medium"
                  ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                  : "bg-rose-950/60 text-rose-400 border border-rose-800"
              }`}
            >
              {currentProblem.difficulty}
            </span>
            {isCurrentSolved && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-950/80 border border-emerald-800 px-2 py-0.2 text-[10px] font-semibold text-emerald-400">
                <Check className="h-3 w-3" /> Solved
              </span>
            )}
          </div>
        </div>

        {/* Daily Challenges Switcher Bar */}
        <div className="flex items-center gap-2">
          {/* Daily Track Pills */}
          <div className="hidden xl:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentProblem(dailyProblem)}
              title={`Standard POTD: ${dailyProblem.title}`}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                currentProblem.id === dailyProblem.id
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Flame className="h-3 w-3 fill-current text-orange-400" />
              <span>Standard POTD</span>
              {solvedList.includes(dailyProblem.slug) && (
                <span className="text-[10px] text-emerald-400">✓</span>
              )}
            </button>

            <span className="text-neutral-700 font-mono text-xs">|</span>

            {superHardList.map((hp, idx) => {
              const isSelected = currentProblem.id === hp.id;
              const isSolved = solvedList.includes(hp.slug);
              return (
                <button
                  key={hp.id}
                  onClick={() => setCurrentProblem(hp)}
                  title={`Super Hard POTD #${idx + 1}: ${hp.title}`}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-rose-600 text-white shadow-xs ring-1 ring-rose-400"
                      : "bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-900/60"
                  }`}
                >
                  <Zap className="h-3 w-3 text-rose-400" />
                  <span>Super Hard #{idx + 1}</span>
                  <span className="text-[9px] font-mono bg-rose-950 px-1 py-0.2 rounded border border-rose-800 text-rose-300">
                    +150 XP
                  </span>
                  {isSolved && (
                    <span className="text-[10px] text-emerald-400">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Problem Select Dropdown */}
          <select
            value={currentProblem.slug}
            onChange={(e) => {
              const p = allProblems.find((prob) => prob.slug === e.target.value);
              if (p) setCurrentProblem(p);
            }}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] font-mono text-neutral-300 focus:outline-none focus:border-amber-500 max-w-[150px] sm:max-w-[210px] truncate"
          >
            <optgroup label="Today's POTD Challenges">
              <option value={dailyProblem.slug}>
                🔥 Daily Standard: {dailyProblem.title}
              </option>
              {superHardList.map((hp, idx) => (
                <option key={hp.slug} value={hp.slug}>
                  💀 Super Hard #{idx + 1}: {hp.title}
                </option>
              ))}
            </optgroup>
            <optgroup label={`All Interview Challenges (${allProblems.length})`}>
              {allProblems.map((p, idx) => (
                <option key={p.id} value={p.slug}>
                  #{idx + 1} [{p.difficulty}] {p.title}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Mock OA Assessment Simulator Toggle Button */}
          <button
            onClick={() => {
              if (isMockOaActive) {
                setIsMockOaActive(false);
                setMockOaScore({
                  completed: true,
                  timeTaken: `${Math.floor((3600 - mockOaSecondsLeft) / 60)}m ${(3600 - mockOaSecondsLeft) % 60}s`,
                  passed: isCurrentSolved,
                });
              } else {
                setIsMockOaActive(true);
                setMockOaSecondsLeft(3600);
                setMockOaScore(null);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              isMockOaActive
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-700/60"
            }`}
            title="Timed 60-min FAANG Online Assessment test conditions"
          >
            <Clock className="h-3 w-3" />
            <span>
              {isMockOaActive
                ? `OA: ${Math.floor(mockOaSecondsLeft / 60)}:${String(mockOaSecondsLeft % 60).padStart(2, "0")}`
                : "Mock OA Simulator"}
            </span>
          </button>

          <Link
            href="/problems"
            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <ListOrdered className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">All ({allProblems.length})</span>
          </Link>
        </div>
      </div>

      {/* MOCK OA ACTIVE BANNER */}
      {isMockOaActive && (
        <div className="bg-purple-950/80 border-b border-purple-700/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              FAANG Mock OA Test Mode (60 Mins)
            </span>
            <span className="text-[11px] text-purple-300 hidden sm:inline">• Strict test conditions • O(N) complexity &amp; edge cases required</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {Math.floor(mockOaSecondsLeft / 60)}m {mockOaSecondsLeft % 60}s
            </span>
            <button
              onClick={() => {
                setIsMockOaActive(false);
                setMockOaScore({
                  completed: true,
                  timeTaken: `${Math.floor((3600 - mockOaSecondsLeft) / 60)}m ${(3600 - mockOaSecondsLeft) % 60}s`,
                  passed: isCurrentSolved,
                });
              }}
              className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
            >
              Submit &amp; Grade OA
            </button>
          </div>
        </div>
      )}

      {/* MOBILE SEGMENTED CONTROL (< lg) */}
      <div className="flex lg:hidden items-center justify-between p-1.5 bg-slate-950 border-b border-slate-800 shrink-0 sticky top-0 z-20">
        <button
          onClick={() => setMobileTab("PROBLEM")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "PROBLEM"
              ? "bg-slate-800 text-white shadow-sm border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Description</span>
        </button>
        <button
          onClick={() => setMobileTab("CODE")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "CODE"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-950"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Code Editor &amp; Run</span>
        </button>
      </div>

      {/* SPLIT WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden h-auto lg:h-[calc(100vh-53px)] pb-24 lg:pb-0">
        
        {/* LEFT COLUMN: DESCRIPTION & TABS */}
        <div className={`${mobileTab === "PROBLEM" ? "flex" : "hidden"} lg:flex lg:col-span-5 border-r border-slate-800 bg-slate-950 flex-col h-auto lg:h-full overflow-y-auto lg:overflow-hidden`}>
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
              onClick={() => setActiveLeftTab("AI_REVIEW")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeLeftTab === "AI_REVIEW"
                  ? "bg-purple-950/80 text-purple-300 border border-purple-700"
                  : "text-purple-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              AI Code Review
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
                {/* Super Hard / POTD Challenge Tier Banner */}
                {currentProblem.difficulty === "Hard" ? (
                  <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                        <Zap className="h-3 w-3 text-rose-400" />
                        SUPER HARD PROBLEM OF THE DAY
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md">
                        +150 XP • FAANG OA TIER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      High-difficulty challenge matching authentic Google, Amazon &amp; Uber L5 online assessment conditions.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
                        DAILY PROBLEM OF THE DAY
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                        +50 XP • Daily Streak
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-[11px] text-slate-300">
                        Solve today's challenge or tackle one of the 3 Super Hard challenges for +150 XP.
                      </p>
                      {superHardList[0] && (
                        <button
                          onClick={() => setCurrentProblem(superHardList[0])}
                          className="shrink-0 text-[10px] font-mono font-bold bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Try Super Hard POTD →
                        </button>
                      )}
                    </div>
                  </div>
                )}

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

                  {/* Company Tags */}
                  {currentProblem.companies && currentProblem.companies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1">
                      <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        Targeted in FAANG &amp; Tech OA:
                      </span>
                      {currentProblem.companies.map((company: string) => (
                        <span
                          key={company}
                          className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300 flex items-center gap-1 shadow-xs"
                        >
                          <Building2 className="h-2.5 w-2.5 text-amber-400" />
                          {company}
                        </span>
                      ))}
                    </div>
                  )}
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

                {/* RECRUITER FAST-TRACK REFERRAL STATUS */}
                <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-2.5 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>Recruiter Fast-Track Referral</span>
                          <span className="rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.2 border border-blue-500/40">
                            Verified Candidate
                          </span>
                        </div>
                        <div className="text-[10px] text-blue-300/80">
                          Direct pipeline to Google, Amazon, Microsoft, Swiggy, &amp; Uber recruiters
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      DevScore: {userDevScore || 750}/1000
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                    Top DevScore profiles bypass resume screening filters. Every verified problem solve writes authentic proof-of-work to your profile and dispatches you directly into employer inboxes on RoleNest.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <a
                      href="https://rolenest.in/jobs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 underline font-mono"
                    >
                      Explore 115,000+ Direct ATS Openings on RoleNest ↗
                    </a>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Direct Referral Active
                    </span>
                  </div>
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

            {activeLeftTab === "AI_REVIEW" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      AI Code Reviewer &amp; Explainer
                    </h3>
                    <p className="text-xs text-slate-400">
                      Step-by-step editorial breakdowns, edge case debugging, and O(N) complexity proofs.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleRunAiReview}
                    disabled={aiReviewLoading}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {aiReviewLoading ? "Analyzing..." : "Review My Code"}
                  </Button>
                </div>

                {aiReviewError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                    {aiReviewError}
                  </div>
                )}

                {aiReviewLoading && (
                  <div className="p-8 rounded-2xl border border-purple-900/60 bg-purple-950/20 text-center space-y-3 animate-pulse">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold text-white">Analyzing AST &amp; Algorithmic Complexity...</div>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Evaluating edge cases, verifying Big-O time and space proofs, and identifying structural optimizations.
                    </p>
                  </div>
                )}

                {!aiReviewLoading && !aiReviewData && (
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold text-white">Ready to Inspect Your Solution</div>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Click below to get an automated editorial breakdown, edge-case vulnerability checklist, and mathematical Big-O proof for your current code.
                    </p>
                    <Button
                      onClick={handleRunAiReview}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-purple-950"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Analyze Solution with AI</span>
                    </Button>
                  </div>
                )}

                {aiReviewData && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Verdict & Complexity Card */}
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase text-purple-300 font-bold">Review Verdict:</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                            String(aiReviewData.verdict).toLowerCase().includes("optimal")
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}>
                            {aiReviewData.verdict || "Optimal"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                            Time: {aiReviewData.timeComplexity || "O(n)"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-blue-300 font-bold">
                            Space: {aiReviewData.spaceComplexity || "O(n)"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-xs text-neutral-300 space-y-1">
                        <div className="font-bold text-white text-[11px] font-mono flex items-center gap-1.5 text-purple-300">
                          <Zap className="h-3.5 w-3.5" />
                          O(N) Complexity Proof:
                        </div>
                        <p className="leading-relaxed text-[11px] text-neutral-300">
                          {aiReviewData.complexityProof}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Editorial Breakdown */}
                    {aiReviewData.editorialBreakdown && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5">
                        <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                          Step-by-Step Editorial Breakdown
                        </h4>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          {aiReviewData.editorialBreakdown.map((step: string, sIdx: number) => (
                            <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Edge Case Checklist */}
                    {aiReviewData.edgeCases && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5">
                        <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                          Edge Case Debugging &amp; Vulnerability Analysis
                        </h4>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          {aiReviewData.edgeCases.map((edge: string, eIdx: number) => (
                            <div key={eIdx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 leading-relaxed text-amber-200">
                              {edge}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clean Code Tips */}
                    {aiReviewData.cleanCodeTips && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5">
                        <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Clean Code &amp; Optimization Tips
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                          {aiReviewData.cleanCodeTips.map((tip: string, tIdx: number) => (
                            <li key={tIdx} className="leading-relaxed">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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

                {/* B2B SPONSORED HACKATHON PROPOSITION BANNER */}
                <div className="rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-950/40 via-slate-900 to-amber-950/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      TECH RECRUITERS &amp; COMPANIES
                    </span>
                    <span className="text-[10px] font-mono text-amber-200">
                      ₹25k - ₹75k / Contest
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sponsor a Weekend Hiring Hackathon</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Host custom problems in our anti-cheat sandbox. Reach 5,000+ top student coders and receive direct candidate shortlists.
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowSponsorModal(true)}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs h-8 rounded-xl shadow-xs"
                  >
                    Sponsor Next Weekend Contest →
                  </Button>
                </div>

                {/* College Selector / Affiliation Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="potd-campus-select" className="font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                      <School className="h-4 w-4 text-orange-400" /> Which College Do You Belong To?
                    </label>
                    <span className="text-emerald-400 font-mono font-bold">
                      Dev Score: {userDevScore > 0 ? `${userDevScore}/1000` : "0/1000 (Unranked)"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Select your college or register your campus below so your daily problem solves and Dev Score push your college up the All-India leaderboard!
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <select
                      id="potd-campus-select"
                      value={selectedCampus}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setShowRegisterCollegeModal(true);
                        } else {
                          handleSaveCollege(e.target.value);
                        }
                      }}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="">-- Select Your College to Represent --</option>
                      <option value="__NEW__" className="text-amber-400 font-bold bg-slate-900">
                        ➕ Don't see your college? Register it now!
                      </option>
                      {Array.from(
                        new Set([
                          ...POPULAR_COLLEGES,
                          ...registeredCollegesList.map((rc) => rc.name),
                          ...collegeBattles.map((c) => c.collegeName),
                        ])
                      )
                        .filter((c) => c && c !== "Independent Builders")
                        .sort()
                        .map((c) => {
                          const matched = registeredCollegesList.find((rc) => rc.name === c);
                          return (
                            <option key={c} value={c}>
                              {c} {matched?.location ? `(${matched.location})` : ""}
                            </option>
                          );
                        })}
                    </select>

                    <Button
                      type="button"
                      onClick={() => setShowRegisterCollegeModal(true)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-3 rounded-xl gap-1 shrink-0"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Register College
                    </Button>
                  </div>

                  {campusSavedMsg && (
                    <div className="text-xs font-bold text-emerald-400 animate-in fade-in flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {campusSavedMsg}
                    </div>
                  )}

                  {selectedCampus && (
                    <div className="flex items-center justify-between text-[11px] bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
                      <span className="text-slate-400">
                        Currently Fighting For: <strong className="text-white">{selectedCampus}</strong>
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-orange-950/60 border border-orange-800/80 text-orange-300 px-2 py-0.5 rounded-lg">
                        🔥 Active Fighter
                      </span>
                    </div>
                  )}
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
                        const badgeCode = `[![ProblemNest Verified Dev](https://img.shields.io/badge/ProblemNest%20Dev%20Score-${userDevScore}%2F1000-10b981?style=for-the-badge&logo=github)](https://problem.rolenest.in/dev-score?score=${userDevScore})`;
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
        <div className={`${mobileTab === "CODE" ? "flex" : "hidden"} lg:flex lg:col-span-7 bg-slate-900 flex-col h-auto lg:h-full overflow-y-auto lg:overflow-hidden`}>
          
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
                onClick={() => setEditorEngine((prev) => (prev === "monaco" ? "lightweight" : "monaco"))}
                className={`text-xs flex items-center gap-1 font-mono transition-colors px-2.5 py-1 rounded-lg border ${
                  editorEngine === "lightweight"
                    ? "bg-emerald-950/70 border-emerald-700 text-emerald-300 font-bold"
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
                }`}
                title="Toggle between Zero-Lag Instant Editor and VS Code Monaco"
              >
                <Zap className="h-3 w-3 text-amber-400" />
                <span>{editorEngine === "lightweight" ? "⚡ Fast Editor" : "💻 Monaco IDE"}</span>
              </button>
              <button
                onClick={handleResetCode}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-mono transition-colors px-2 py-1 rounded hover:bg-slate-800"
                title={`Reset ${selectedLanguage} starter code`}
              >
                <RotateCcw className="h-3 w-3" /> Reset Code
              </button>
            </div>
          </div>

          {/* Resilient Code Editor Container */}
          <div className="flex-1 min-h-[380px] lg:min-h-0 relative bg-slate-950 overflow-hidden">
            {editorEngine === "lightweight" ? (
              <CodeEditorFallback
                value={languageCodeMap[selectedLanguage] || ""}
                onChange={handleCodeChange}
                language={selectedLanguage}
              />
            ) : (
              <MonacoEditor
                height="100%"
                language={SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.monacoLang || "javascript"}
                theme="vs-dark"
                value={languageCodeMap[selectedLanguage] || ""}
                onChange={handleCodeChange}
                onMount={() => setMonacoLoaded(true)}
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
            )}
          </div>

          {/* TEST RUNNER HUD */}
          <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3 shrink-0 pb-10 lg:pb-4">
            
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
                  onClick={handleRunAiReview}
                  disabled={aiReviewLoading}
                  className="bg-purple-950/40 border-purple-800 text-purple-300 hover:bg-purple-900/60 text-xs font-bold gap-1.5"
                  title="Generate step-by-step editorial breakdown and O(N) complexity proof"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>{aiReviewLoading ? "Reviewing..." : "AI Review"}</span>
                </Button>
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
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-sans">
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
                        <Award className="h-3 w-3 text-amber-400" /> Showcase Dev Score
                      </Link>
                      <button
                        onClick={() => setShowProModal(true)}
                        className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 px-3 py-1 text-[11px] font-black flex items-center gap-1 transition-all shadow-sm"
                      >
                        <Crown className="h-3 w-3 text-slate-950 fill-current" /> Unlock Arena Pro (₹299/mo)
                      </button>
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

      {/* MODAL: SPONSOR A WEEKEND HIRING HACKATHON */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 text-slate-900">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                  Employer Contest Sponsorship
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Sponsor a Weekend Hiring Hackathon
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Host custom engineering challenges. Benchmark talent in our anti-cheat sandbox and hire the top 1% solvers.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSponsorModal(false);
                  setSponsorSubmitted(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {sponsorSubmitted ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-amber-600 mx-auto" />
                <h4 className="font-black text-slate-900 text-base">Sponsorship Request Received!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our developer relations and contest engineering team will contact <strong>{sponsorEmail}</strong> within 12 hours with problem curation specs and schedule dates.
                </p>
                <Button
                  onClick={() => {
                    setShowSponsorModal(false);
                    setSponsorSubmitted(false);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmittingSponsor(true);
                  setTimeout(() => {
                    setIsSubmittingSponsor(false);
                    setSponsorSubmitted(true);
                  }, 800);
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Team Name</label>
                    <input
                      type="text"
                      required
                      value={sponsorCompany}
                      onChange={(e) => setSponsorCompany(e.target.value)}
                      placeholder="e.g. Swiggy, Cred, Sarvam AI"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Recruiter / Work Email</label>
                    <input
                      type="email"
                      required
                      value={sponsorEmail}
                      onChange={(e) => setSponsorEmail(e.target.value)}
                      placeholder="recruiter@company.com"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Hackathon Sponsorship Package</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSponsorTier("STANDARD")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        sponsorTier === "STANDARD"
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-black text-slate-900 text-[11px]">Weekend Sprint</div>
                      <div className="text-amber-700 font-bold text-xs mt-0.5">₹24,999</div>
                      <div className="text-[10px] text-slate-500 mt-1">Top 50 shortlists</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSponsorTier("PRO")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        sponsorTier === "PRO"
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-black text-slate-900 text-[11px]">Pro Hackathon</div>
                      <div className="text-amber-700 font-bold text-xs mt-0.5">₹49,999</div>
                      <div className="text-[10px] text-slate-500 mt-1">Custom sandbox + 150 candidates</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSponsorTier("FLAGSHIP")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        sponsorTier === "FLAGSHIP"
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-black text-slate-900 text-[11px]">Flagship Blitz</div>
                      <div className="text-amber-700 font-bold text-xs mt-0.5">₹74,999</div>
                      <div className="text-[10px] text-slate-500 mt-1">Pan-India campus push</div>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Sponsor Deliverables:
                  </div>
                  <p>Dedicated branded banner on the POTD problem page, verified DevScore candidate export, automated anti-plagiarism reports, and fast-track interview scheduling links.</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingSponsor}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl min-h-[44px]"
                >
                  {isSubmittingSponsor ? "Confirming Booking..." : "Submit Hackathon Sponsorship Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CELEBRATION & VIRAL SHARE MODAL */}
      {showProCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl text-slate-100 space-y-5">
            <button
              onClick={() => setShowProCelebration(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-3xl shadow-lg">
                🎉
              </div>
              <h3 className="text-xl font-black text-white">
                Challenge Conquered!
              </h3>
              <p className="text-xs text-slate-400">
                All test cases passed. Your daily habit streak is locked in and your DevScore has been boosted!
              </p>
            </div>

            {/* STATS TILES */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">XP</span>
                <span className="text-base font-black text-emerald-400">+50</span>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Coins</span>
                <span className="text-base font-black text-amber-400">+10 PC</span>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Streak</span>
                <span className="text-base font-black text-orange-400 flex items-center justify-center gap-0.5">
                  <Flame className="h-3.5 w-3.5 fill-orange-400" /> Active
                </span>
              </div>
              <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">DevScore</span>
                <span className="text-base font-black text-blue-400">{userDevScore || 750}</span>
              </div>
            </div>

            {/* VIRAL SHARE ACTIONS */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                Share your victory &amp; challenge your peers:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    const shareText = encodeURIComponent(
                      `🔥 Just solved coding challenge "${currentProblem.title}" on ProblemNest Arena! Current DevScore: ${userDevScore || 750}/1000. Try solving it: https://problem.rolenest.in/potd?problem=${currentProblem.slug}`
                    );
                    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank", "noopener,noreferrer");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 py-2.5 h-auto rounded-xl"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => {
                    const postUrl = encodeURIComponent(`https://problem.rolenest.in/potd?problem=${currentProblem.slug}`);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`, "_blank", "noopener,noreferrer");
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 py-2.5 h-auto rounded-xl"
                >
                  <Linkedin className="h-4 w-4 fill-white" />
                  LinkedIn
                </Button>
              </div>
            </div>

            {/* NEXT STEP CTA */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <Link
                href="/problems"
                className="w-full text-center py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Explore Next Challenge (+50 XP)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MOCK OA ASSESSMENT SCORECARD MODAL */}
      {mockOaScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-purple-500/40 bg-[#121212] p-6 sm:p-8 shadow-2xl text-neutral-100 font-sans space-y-6">
            <button
              onClick={() => setMockOaScore(null)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 px-3.5 py-1 text-xs font-mono font-bold text-purple-300">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>FAANG Mock OA Assessment Report</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {mockOaScore.passed ? "Assessment Passed 🎉" : "Mock OA Completed"}
              </h3>
              <p className="text-xs text-neutral-400">
                Performance benchmarked under authentic timed FAANG test conditions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-3.5 text-center">
                <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Time Taken</div>
                <div className="text-xl font-black text-amber-400 mt-1">{mockOaScore.timeTaken}</div>
                <div className="text-[10px] text-neutral-500">Benchmark: &lt; 45 mins</div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-3.5 text-center">
                <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Test Matrix</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{mockOaScore.passed ? "100% Passed" : "In Progress"}</div>
                <div className="text-[10px] text-neutral-500">Automated Judge</div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span>Recruiter Referral Status</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {mockOaScore.passed
                  ? "Your successful timed OA submission qualifies your profile for priority fast-track referral directly to Google, Amazon, and Swiggy recruiters on RoleNest."
                  : "Keep practicing! Solving problems with passing test cases unlocks recruiter fast-track referral priority."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setMockOaScore(null);
                  handleRunAiReview();
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Review with AI</span>
              </Button>
              <Button
                onClick={() => setMockOaScore(null)}
                variant="outline"
                className="border-neutral-700 bg-neutral-900 text-neutral-200 text-xs py-2.5 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER YOUR COLLEGE MODAL */}
      {showRegisterCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-orange-500/30 bg-[#141414] p-6 sm:p-8 shadow-2xl text-neutral-100 font-sans space-y-5">
            <button
              onClick={() => setShowRegisterCollegeModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 px-3 py-0.5 text-xs font-mono font-bold text-orange-400">
                <School className="h-3.5 w-3.5" />
                <span>Inter-College Engineering Battles</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Register Your College / Campus
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your college details to represent your campus, rally your classmates, and push your team up the All-India Leaderboard.
              </p>
            </div>

            <form onSubmit={handleRegisterNewCollege} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-orange-400" />
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g. National Institute of Technology Warangal"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    City / Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCollegeLocation}
                    onChange={(e) => setNewCollegeLocation(e.target.value)}
                    placeholder="e.g. Warangal, Bengaluru, Pune"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-sky-400" />
                    State (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCollegeState}
                    onChange={(e) => setNewCollegeState(e.target.value)}
                    placeholder="e.g. Telangana, Karnataka"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRegisterCollegeModal(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={registeringCollegeLoading || !newCollegeName.trim() || !newCollegeLocation.trim()}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 h-10 rounded-xl gap-1.5 shadow-md shadow-orange-950"
                >
                  {registeringCollegeLoading ? (
                    "Registering..."
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Register &amp; Represent College
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ArenaProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />

      <ArenaFooter />
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
