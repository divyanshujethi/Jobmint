"use client";

import { useState } from "react";
import {
  BootcampCodingChallenge,
  BootcampChallengeTestCase,
} from "@/lib/bootcamp-data";
import {
  evaluateBootcampCode,
  EvaluationResult,
} from "@/lib/bootcamp-compiler";
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Terminal,
  Code2,
  ChevronRight,
  HelpCircle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeArenaRunnerProps {
  challenge: BootcampCodingChallenge;
  trackTitle?: string;
  onSuccess?: () => void;
}

export function CodeArenaRunner({
  challenge,
  trackTitle,
  onSuccess,
}: CodeArenaRunnerProps) {
  const [language, setLanguage] = useState<"python" | "javascript" | "java">(
    "python"
  );
  const [code, setCode] = useState<string>(challenge.starterCode.python);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "hints">("description");
  const [selectedTestIdx, setSelectedTestIdx] = useState(0);

  const handleLanguageChange = (newLang: "python" | "javascript" | "java") => {
    setLanguage(newLang);
    setCode(challenge.starterCode[newLang]);
    setResult(null);
  };

  const handleReset = () => {
    setCode(challenge.starterCode[language]);
    setResult(null);
  };

  const handleRun = async () => {
    setIsEvaluating(true);
    try {
      const evalResult = await evaluateBootcampCode(challenge, language, code);
      setResult(evalResult);

      if (evalResult.passed) {
        // Save progress to local storage
        try {
          const key = "rolenest_bootcamp_solved_challenges";
          const current: string[] = JSON.parse(localStorage.getItem(key) || "[]");
          if (!current.includes(challenge.id)) {
            current.push(challenge.id);
            localStorage.setItem(key, JSON.stringify(current));
          }
        } catch {}

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col">
      {/* HEADER BAR */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Week {challenge.week} Challenge
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  challenge.difficulty === "BEGINNER"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : challenge.difficulty === "INTERMEDIATE"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {challenge.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black">
                {challenge.points} Points
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              {challenge.title}
            </h3>
          </div>
        </div>

        {/* LANGUAGE SELECTOR & ACTIONS */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-bold">
            {(["python", "javascript", "java"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  language === lang
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-slate-400 hover:text-white text-xs h-8 px-2.5 rounded-lg border border-slate-800 hover:bg-slate-800"
            title="Reset Starter Code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleRun}
            disabled={isEvaluating}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs h-8 px-4 rounded-xl shadow-md shadow-emerald-500/20"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            {isEvaluating ? "Evaluating..." : "Run Test Suite"}
          </Button>
        </div>
      </div>

      {/* TWO-COLUMN WORKSPACE: LEFT PROBLEM DESCRIPTION, RIGHT CODE EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        
        {/* LEFT COLUMN: PROBLEM STATEMENT & TEST CASES */}
        <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 overflow-y-auto max-h-[560px] text-xs text-slate-300 space-y-4">
          
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-1 text-xs font-bold transition-colors ${
                activeTab === "description"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Problem Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hints")}
              className={`pb-1 text-xs font-bold transition-colors flex items-center gap-1 ${
                activeTab === "hints"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <HelpCircle className="h-3 w-3" /> Hints ({challenge.hints.length})
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-4">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                {challenge.description}
              </div>

              {/* CONSTRAINTS */}
              {challenge.constraints.length > 0 && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 space-y-1.5">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                    Constraints
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    {challenge.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SAMPLE INPUT / OUTPUT */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                  Sample Input / Output
                </h4>
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-[11px] text-slate-200 space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                      Standard Input:
                    </span>
                    <pre className="bg-slate-950 p-2 rounded-lg mt-1 text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                      {challenge.sampleInput}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                      Expected Output:
                    </span>
                    <pre className="bg-slate-950 p-2 rounded-lg mt-1 text-teal-300 overflow-x-auto whitespace-pre-wrap">
                      {challenge.sampleOutput}
                    </pre>
                  </div>
                  {challenge.explanation && (
                    <div className="text-slate-400 text-[11px] font-sans pt-1 border-t border-slate-800/80">
                      <strong>Explanation:</strong> {challenge.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-bold text-emerald-400 text-xs">
                Mentor Algorithmic Hints
              </h4>
              {challenge.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-slate-300 text-[11px] leading-relaxed flex items-start gap-2"
                >
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CODE EDITOR & TEST RESULTS */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900">
          
          {/* EDITOR AREA */}
          <div className="flex-1 p-4 bg-slate-950/40 relative">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-2 border-b border-slate-800/80 mb-2">
              <span>Solution Editor ({language})</span>
              <span>UTF-8 • Tab: 4 spaces</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-80 bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 leading-relaxed resize-none shadow-inner"
              placeholder="Write your code here..."
            />
          </div>

          {/* TEST RESULTS CONSOLE */}
          {result && (
            <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      All {result.totalTests} Test Cases Passed! (+{result.pointsAwarded} pts)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">
                      <XCircle className="h-4 w-4 text-red-400" />
                      {result.passedTests}/{result.totalTests} Test Cases Passed
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {result.runtimeMs}ms
                  </span>
                </div>

                {/* TEST SELECTOR TABS */}
                <div className="flex items-center gap-1">
                  {result.testResults.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTestIdx(idx)}
                      className={`h-6 px-2 rounded text-[10px] font-bold font-mono transition-colors ${
                        selectedTestIdx === idx
                          ? "bg-slate-800 text-white border border-slate-700"
                          : t.passed
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      Case {t.testIndex} {t.passed ? "✓" : "✗"}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE TEST CASE INSPECTION */}
              {result.testResults[selectedTestIdx] && (
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Test Case #{result.testResults[selectedTestIdx].testIndex}</span>
                    <span
                      className={
                        result.testResults[selectedTestIdx].passed
                          ? "text-emerald-400 font-bold"
                          : "text-red-400 font-bold"
                      }
                    >
                      {result.testResults[selectedTestIdx].passed ? "PASSED" : "FAILED"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                      Input:
                    </span>
                    <pre className="bg-slate-950 p-2 rounded text-slate-200 mt-0.5 overflow-x-auto whitespace-pre-wrap">
                      {result.testResults[selectedTestIdx].input}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                        Expected Output:
                      </span>
                      <pre className="bg-slate-950 p-2 rounded text-teal-300 mt-0.5 overflow-x-auto whitespace-pre-wrap">
                        {result.testResults[selectedTestIdx].expectedOutput}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                        Your Output:
                      </span>
                      <pre
                        className={`bg-slate-950 p-2 rounded mt-0.5 overflow-x-auto whitespace-pre-wrap ${
                          result.testResults[selectedTestIdx].passed
                            ? "text-emerald-300"
                            : "text-red-300"
                        }`}
                      >
                        {result.testResults[selectedTestIdx].actualOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
