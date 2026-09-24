"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  acceptance: string;
  description: string;
  realWorldContext: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  starterCodeJs: string;
  testCases: {
    inputArgs: any[];
    expected: any;
    name: string;
  }[];
  editorial: string;
}

const PROBLEMS: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum: Target Pair Indexer",
    difficulty: "Easy",
    category: "Arrays & Hash Maps",
    acceptance: "52.8%",
    description:
      "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.\\n\\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice. Return the answer in any order.",
    realWorldContext:
      "Used in financial order book matching at Zerodha and Razorpay to instantaneously pair matching buy and sell prices with O(n) hash map lookups.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "A brute force approach checks every pair with nested loops in O(n^2) time.",
      "Can you use a Hash Map (dictionary) to remember numbers you've seen so far in O(n) time?",
      "For each number x, look up whether (target - x) already exists in your map.",
    ],
    starterCodeJs: `function solution(nums, target) {
  // Write your O(n) solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { name: "Standard Array", inputArgs: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { name: "Unsorted Target", inputArgs: [[3, 2, 4], 6], expected: [1, 2] },
      { name: "Identical Elements", inputArgs: [[3, 3], 6], expected: [0, 1] },
      { name: "Negative Integers", inputArgs: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    ],
    editorial:
      "### Optimal Approach: One-Pass Hash Map\nBy maintaining a lookup table mapping each visited number to its index, we can check for the complement `(target - current)` in O(1) average time per element.\n\n- **Time Complexity**: O(n)\n- **Space Complexity**: O(n)",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses: Syntax Tree Validator",
    difficulty: "Easy",
    category: "Stacks & Compilers",
    acceptance: "44.2%",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    realWorldContext:
      "The foundational grammar parser used inside TypeScript/Babel compiler lexers to validate JSON payloads and AST tree balance.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    hints: [
      "Think about Last-In First-Out (LIFO). Which data structure handles this?",
      "Push opening brackets onto a stack. When a closing bracket arrives, verify it matches the top of the stack.",
    ],
    starterCodeJs: `function solution(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { name: "Simple Pair", inputArgs: ["()"], expected: true },
      { name: "Multiple Sets", inputArgs: ["()[]{}"], expected: true },
      { name: "Mismatched Brackets", inputArgs: ["(]"], expected: false },
      { name: "Nested Valid", inputArgs: ["{[]}"], expected: true },
      { name: "Unbalanced Open", inputArgs: ["((("], expected: false },
    ],
    editorial:
      "### Optimal Approach: Stack Verification\n- Push opening brackets onto the stack.\n- Pop and match corresponding closing brackets.\n- If stack is empty at the end, the string is valid.\n\n- **Time**: O(n)\n- **Space**: O(n)",
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray: Peak Profit Window",
    difficulty: "Medium",
    category: "Dynamic Programming",
    acceptance: "51.1%",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.",
    realWorldContext:
      "Kadane's Algorithm is widely deployed in quantitative trading and genomic sequence analysis to identify maximum contiguous return periods.",
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum 6.",
      },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5, 4, -1, 7, 8]", output: "23" },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    hints: [
      "Can you keep track of the current subarray sum and reset whenever it drops below 0?",
      "This is known as Kadane's Algorithm.",
    ],
    starterCodeJs: `function solution(nums) {
  let maxSum = nums[0];
  let curr = 0;
  for (const n of nums) {
    curr = Math.max(n, curr + n);
    maxSum = Math.max(maxSum, curr);
  }
  return maxSum;
}`,
    testCases: [
      { name: "Standard Mixed", inputArgs: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { name: "Single Element", inputArgs: [[1]], expected: 1 },
      { name: "All Positive", inputArgs: [[5, 4, -1, 7, 8]], expected: 23 },
      { name: "All Negative", inputArgs: [[-5, -3, -1, -4]], expected: -1 },
    ],
    editorial:
      "### Optimal Approach: Kadane's Algorithm\nAt each index, decide whether to append to the existing sum or start fresh with the current number.\n\n- **Time**: O(n)\n- **Space**: O(1)",
  },
];

export default function POTDPage() {
  const dayIndex = Math.floor(Date.now() / 86400000) % PROBLEMS.length;
  const [currentProblem, setCurrentProblem] = useState<Problem>(PROBLEMS[dayIndex]);
  const [code, setCode] = useState<string>(PROBLEMS[dayIndex].starterCodeJs);
  const [activeTab, setActiveTab] = useState<"DESCRIPTION" | "HINTS" | "EDITORIAL">("DESCRIPTION");
  const [activeTestCaseTab, setActiveTestCaseTab] = useState<number>(0);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [streakEarned, setStreakEarned] = useState(false);

  useEffect(() => {
    setCode(currentProblem.starterCodeJs);
    setTestResults(null);
    setSubmitSuccess(null);
    setSubmitted(false);
  }, [currentProblem]);

  const runCode = (isSubmission = false) => {
    setRunning(true);
    setSubmitSuccess(null);

    setTimeout(() => {
      try {
        // Create isolated function wrapper
        const userFn = new Function(
          `return (${code})`
        )();

        const results = currentProblem.testCases.map((tc) => {
          const startTime = performance.now();
          let output: any;
          let passed = false;
          let error: string | null = null;

          try {
            // Clone args to avoid mutations
            const clonedArgs = JSON.parse(JSON.stringify(tc.inputArgs));
            output = userFn(...clonedArgs);
            passed = JSON.stringify(output) === JSON.stringify(tc.expected);
          } catch (err: any) {
            error = err.message || "Runtime Error";
          }
          const duration = Math.round((performance.now() - startTime) * 100) / 100;

          return {
            name: tc.name,
            inputArgs: tc.inputArgs,
            expected: tc.expected,
            actual: output,
            passed,
            error,
            durationMs: Math.max(1, duration),
          };
        });

        setTestResults(results);

        const allPassed = results.every((r) => r.passed);
        if (isSubmission && allPassed) {
          setSubmitted(true);
          setSubmitSuccess("🎉 All test cases passed! +50 XP Awarded & Daily Habit Completed!");
          setStreakEarned(true);

          // Update streak & awards on server
          fetch("/api/streak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questId: "potd" }),
          }).catch(() => {});
        } else if (isSubmission) {
          setSubmitSuccess("❌ Some test cases failed. Inspect the output below and refine your logic.");
        }
      } catch (compileErr: any) {
        setTestResults([
          {
            name: "Compilation",
            passed: false,
            error: compileErr.message || "Syntax Error in code",
          },
        ]);
      } finally {
        setRunning(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* TOP NAV BAR */}
      <header className="border-b border-slate-800 bg-slate-950 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-600 text-xs font-black text-white">
              🔥
            </span>
            <span className="font-bold text-sm text-white">
              Problem of the Day (POTD)
            </span>
            <span className="rounded bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
              +50 XP
            </span>
          </div>
        </div>

        {/* Problem Switcher */}
        <div className="flex items-center gap-2">
          {PROBLEMS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentProblem(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currentProblem.id === p.id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              #{idx + 1}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN SPLIT WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: PROBLEM DESCRIPTION & TABS */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950 flex flex-col h-full overflow-y-auto">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 px-4 pt-3 pb-2 bg-slate-950 sticky top-0 z-10">
            <button
              onClick={() => setActiveTab("DESCRIPTION")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "DESCRIPTION"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Description
            </button>
            <button
              onClick={() => setActiveTab("HINTS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "HINTS"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              Hints ({currentProblem.hints.length})
            </button>
            <button
              onClick={() => setActiveTab("EDITORIAL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "EDITORIAL"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Editorial
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1 text-slate-300 text-xs sm:text-sm leading-relaxed">
            {activeTab === "DESCRIPTION" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
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
                    <span className="text-slate-500 font-mono text-xs">
                      {currentProblem.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500 text-xs font-mono">
                      Acceptance: {currentProblem.acceptance}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-white">
                    {currentProblem.title}
                  </h2>
                </div>

                {/* Real-World Context Banner */}
                <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/30 p-3.5 text-emerald-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400 text-[11px] uppercase tracking-wider font-mono">
                    <Zap className="h-3.5 w-3.5" />
                    Real-World Engineering Context
                  </div>
                  <div>{currentProblem.realWorldContext}</div>
                </div>

                {/* Description Text */}
                <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">
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
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1.5 font-mono text-xs"
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
                        <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/80 font-sans">
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

            {activeTab === "HINTS" && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Guided Hints</h3>
                {currentProblem.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-1"
                  >
                    <div className="text-amber-400 font-bold text-xs font-mono">
                      HINT {idx + 1}
                    </div>
                    <div className="text-slate-300 text-xs">{hint}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "EDITORIAL" && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Editorial &amp; Complexity Analysis</h3>
                <div className="whitespace-pre-line text-slate-300 text-xs leading-relaxed font-sans rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  {currentProblem.editorial}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CODE EDITOR & TEST RUNNER */}
        <div className="lg:col-span-7 bg-slate-900 flex flex-col h-full overflow-hidden">
          
          {/* Editor Header Bar */}
          <div className="border-b border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold text-slate-300">
                JavaScript (V8 Runtime)
              </span>
            </div>
            <button
              onClick={() => setCode(currentProblem.starterCodeJs)}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-mono transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Interactive Code Editor TextArea */}
          <div className="flex-1 relative bg-slate-900 font-mono text-xs overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-slate-900 text-emerald-300 font-mono p-4 resize-none focus:outline-none leading-relaxed selection:bg-emerald-900 selection:text-white"
            />
          </div>

          {/* BOTTOM TEST RUNNER HUD */}
          <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3">
            
            {/* Test Case Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {currentProblem.testCases.map((tc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestCaseTab(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      activeTestCaseTab === idx
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runCode(false)}
                  disabled={running}
                  className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  Run Code
                </Button>
                <Button
                  size="sm"
                  onClick={() => runCode(true)}
                  disabled={running}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5 shadow-md shadow-emerald-950"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Submit Solution (+50 XP)
                </Button>
              </div>
            </div>

            {/* Test Output Console */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2 font-mono text-xs">
              {submitSuccess && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-bold ${
                    submitSuccess.startsWith("🎉")
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      : "bg-rose-950/80 text-rose-300 border border-rose-800"
                  }`}
                >
                  {submitSuccess}
                </div>
              )}

              {testResults ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>Test Case: {testResults[activeTestCaseTab]?.name}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="h-3 w-3" />{" "}
                      {testResults[activeTestCaseTab]?.durationMs || 1}ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Result:</span>
                    {testResults[activeTestCaseTab]?.passed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="h-3.5 w-3.5" /> Failed
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-400">Expected:</span>{" "}
                    <span className="text-orange-400">
                      {JSON.stringify(testResults[activeTestCaseTab]?.expected)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400">Actual Output:</span>{" "}
                    <span className="text-emerald-400">
                      {JSON.stringify(testResults[activeTestCaseTab]?.actual)}
                    </span>
                  </div>

                  {testResults[activeTestCaseTab]?.error && (
                    <div className="text-rose-400 text-[11px] pt-1">
                      Error: {testResults[activeTestCaseTab]?.error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 py-1">
                  Click 'Run Code' or 'Submit Solution' to execute test cases.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
