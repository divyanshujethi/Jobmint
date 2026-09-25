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
  const [activeLeftTab, setActiveLeftTab] = useState<"DESCRIPTION" | "HINTS" | "EDITORIAL" | "BADGES">("DESCRIPTION");
  const [activeBottomTab, setActiveBottomTab] = useState<"TEST_CASES" | "CONSOLE">("TEST_CASES");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);

  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<ExecutionReport | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [badgeUnlocked, setBadgeUnlocked] = useState<string | null>(null);
  const [solvedList, setSolvedList] = useState<string[]>([]);

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

  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || "";
    setLanguageCodeMap((prev) => ({
      ...prev,
      [selectedLanguage]: val,
    }));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jobmint_solved_problems");
      if (stored) {
        setSolvedList(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleRun = async (isSubmission = false) => {
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
          <div className="flex items-center gap-1.5 border-b border-slate-800 px-4 pt-2.5 pb-2 bg-slate-950 shrink-0">
            <button
              onClick={() => setActiveLeftTab("DESCRIPTION")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeLeftTab === "EDITORIAL"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Editorial
            </button>
            <button
              onClick={() => setActiveLeftTab("BADGES")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
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

                {/* Description Body */}
                <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
                  {currentProblem.description}
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <div className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                    Examples
                  </div>
                  {currentProblem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-1.5 font-mono text-xs"
                    >
                      <div>
                        <strong className="text-slate-400">Input:</strong>{" "}
                        <span className="text-emerald-400">{ex.input}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Output:</strong>{" "}
                        <span className="text-orange-400">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-slate-400 text-[11px] pt-1.5 border-t border-slate-800/80 font-sans leading-relaxed">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <div className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                    Constraints
                  </div>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-slate-400">
                    {currentProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
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
                tabSize: selectedLanguage === "python" ? 4 : 2,
                wordWrap: "on",
                padding: { top: 12, bottom: 12 },
                suggestOnTriggerCharacters: true,
                formatOnType: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "all",
              }}
            />
          </div>

          {/* BOTTOM TEST RUNNER & CONSOLE HUD */}
          <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3 shrink-0">
            
            {/* Top Bar: Tabs & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveBottomTab("TEST_CASES")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeBottomTab === "TEST_CASES"
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-emerald-400" />
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveBottomTab("CONSOLE")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeBottomTab === "CONSOLE"
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  Console Output {report?.logs?.length ? `(${report.logs.length})` : ""}
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
                  className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-between ${
                    submitMessage.startsWith("🎉")
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      : "bg-rose-950/80 text-rose-300 border border-rose-800"
                  }`}
                >
                  <span>{submitMessage}</span>
                  {badgeUnlocked && (
                    <span className="text-[11px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded text-white flex items-center gap-1">
                      🏆 {badgeUnlocked}
                    </span>
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

              {/* TEST CASES TAB */}
              {activeBottomTab === "TEST_CASES" && (
                <div>
                  {report?.results && report.results.length > 0 ? (
                    <div className="space-y-2.5">
                      {/* Case Selectors */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {report.results.map((r, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTestCaseIdx(idx)}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                              activeTestCaseIdx === idx
                                ? "bg-slate-800 text-white border border-slate-700"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {r.passed ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <XCircle className="h-3 w-3 text-rose-400" />
                            )}
                            <span>Case {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {/* Selected Case Details */}
                      {report.results[activeTestCaseIdx] && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{report.results[activeTestCaseIdx].name}</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="h-3 w-3" />{" "}
                              {report.results[activeTestCaseIdx].durationMs}ms
                            </span>
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
