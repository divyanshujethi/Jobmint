"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Award,
  Zap,
  Check,
  ChevronRight,
  Briefcase,
  ArrowRight,
  Cloud,
  FileCheck,
  Layers,
} from "lucide-react";
import { CareerRoadmap, RoadmapSprintWeek, SprintMilestone } from "@repo/shared";
import { Button } from "./ui/button";
import {
  Code,
  Github,
  HelpCircle,
  Copy,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
} from "lucide-react";

interface InteractiveRoadmapSprintsProps {
  roadmap: CareerRoadmap;
}

interface MilestoneProof {
  githubUrl?: string;
  notes?: string;
  quizPassed?: boolean;
  verifiedAt: string;
}

// Deterministic question generator per milestone to give real interactive technical engagement
function getMilestoneQuiz(milestone: SprintMilestone) {
  const task = milestone.task.toLowerCase();

  if (task.includes("matrix") || task.includes("math") || task.includes("dot product")) {
    return {
      question: "What is the computational complexity of standard naive matrix multiplication of two N x N matrices?",
      options: [
        { text: "O(N^3) time, O(N^2) space", correct: true },
        { text: "O(N^2) time, O(N) space", correct: false },
        { text: "O(N log N) time, O(1) space", correct: false },
      ],
      explanation: "Standard matrix multiplication multiplies N rows by N columns with N operations each, yielding O(N^3).",
    };
  }

  if (task.includes("docker") || task.includes("container") || task.includes("distroless")) {
    return {
      question: "Why are multi-stage Docker builds preferred for production container images?",
      options: [
        { text: "They separate build tools/compilers from final runtime, reducing image size & CVE attack surfaces", correct: true },
        { text: "They run container processes with root privileges by default", correct: false },
        { text: "They eliminate the need for Docker daemon caches", correct: false },
      ],
      explanation: "Multi-stage builds leave compilers, headers, and build tools behind in the build stage, creating tiny production images.",
    };
  }

  if (task.includes("kafka") || task.includes("partition") || task.includes("message")) {
    return {
      question: "In Apache Kafka, what determines message ordering guarantees?",
      options: [
        { text: "Messages are strictly ordered only within a single partition, not across topics", correct: true },
        { text: "Messages are globally ordered across all topics and brokers", correct: false },
        { text: "Ordering is determined by random consumer group rebalancing", correct: false },
      ],
      explanation: "Kafka guarantees total ordering within a single partition using sequential offset numbers.",
    };
  }

  if (task.includes("sql") || task.includes("window") || task.includes("index") || task.includes("acid")) {
    return {
      question: "What is the difference between ROW_NUMBER() and DENSE_RANK() in SQL window functions?",
      options: [
        { text: "DENSE_RANK() does not skip rank values after ties, whereas ROW_NUMBER() assigns distinct sequential integers", correct: true },
        { text: "ROW_NUMBER() only works on partitioned PostgreSQL tables", correct: false },
        { text: "DENSE_RANK() always returns random non-deterministic numbers", correct: false },
      ],
      explanation: "DENSE_RANK() assigns the same rank to identical values without skipping subsequent ranks (1, 2, 2, 3), while ROW_NUMBER() assigns unique sequential integers (1, 2, 3, 4).",
    };
  }

  // Default engineering question
  return {
    question: `To verify "${milestone.deliverable}": What is the fundamental requirement for this deliverable to pass production code review?`,
    options: [
      { text: "Idempotency, test coverage, and reproducible execution with documented commands", correct: true },
      { text: "Hardcoding credentials directly inside source code without environment variables", correct: false },
      { text: "Skipping linting and error handling boundaries", correct: false },
    ],
    explanation: "Production deliverables require idempotency, deterministic test coverage, and environment configuration.",
  };
}

export function InteractiveRoadmapSprints({ roadmap }: InteractiveRoadmapSprintsProps) {
  const sprints = roadmap.weeklySprints || [];
  const [activeWeekNumber, setActiveWeekNumber] = useState<number>(1);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [proofs, setProofs] = useState<Record<string, MilestoneProof>>({});
  const [githubInput, setGithubInput] = useState<string>("");
  const [notesInput, setNotesInput] = useState<string>("");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Storage keys
  const storageKey = `studynest_roadmap_progress_${roadmap.slug}`;
  const proofsStorageKey = `studynest_roadmap_proofs_${roadmap.slug}`;

  // Load from localStorage and sync with PostgreSQL
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedMilestones(new Set(JSON.parse(saved)));
      }

      const savedProofs = localStorage.getItem(proofsStorageKey);
      if (savedProofs) {
        setProofs(JSON.parse(savedProofs));
      }
    } catch {}

    fetch(`/api/user/roadmap-progress?slug=${roadmap.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && Array.isArray(data.completedMilestones)) {
          setCompletedMilestones((prev) => {
            const merged = new Set([...Array.from(prev), ...data.completedMilestones]);
            try {
              localStorage.setItem(storageKey, JSON.stringify(Array.from(merged)));
            } catch {}
            return merged;
          });
          setCloudSynced(true);
        }
      })
      .catch(() => {});
  }, [roadmap.slug, storageKey, proofsStorageKey]);

  // Complete milestone with proof
  const verifyMilestone = (milestoneId: string, proofData: Partial<MilestoneProof>) => {
    const nextSet = new Set(completedMilestones);
    nextSet.add(milestoneId);
    setCompletedMilestones(nextSet);

    const updatedProofs: Record<string, MilestoneProof> = {
      ...proofs,
      [milestoneId]: {
        ...proofs[milestoneId],
        ...proofData,
        verifiedAt: new Date().toISOString(),
      },
    };
    setProofs(updatedProofs);

    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(nextSet)));
      localStorage.setItem(proofsStorageKey, JSON.stringify(updatedProofs));

      // Award +30 XP on unified gamification ledger
      const currentXp = parseInt(localStorage.getItem("studynest_gamification_xp") || "850", 10);
      const newXp = currentXp + 30;
      localStorage.setItem("studynest_gamification_xp", newXp.toString());
      const currentStreak = parseInt(localStorage.getItem("studynest_study_streak") || "4", 10);
      window.dispatchEvent(new CustomEvent("studynest-xp-updated", { detail: { xp: newXp, streak: currentStreak } }));
    } catch {}

    // Cloud sync with PostgreSQL
    fetch("/api/user/roadmap-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: roadmap.slug,
        milestoneId,
        isCompleted: true,
      }),
    })
      .then((res) => {
        if (res.ok) setCloudSynced(true);
      })
      .catch(() => {});
  };

  // Undo milestone
  const unverifyMilestone = (milestoneId: string) => {
    const nextSet = new Set(completedMilestones);
    nextSet.delete(milestoneId);
    setCompletedMilestones(nextSet);

    const updatedProofs = { ...proofs };
    delete updatedProofs[milestoneId];
    setProofs(updatedProofs);

    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(nextSet)));
      localStorage.setItem(proofsStorageKey, JSON.stringify(updatedProofs));
    } catch {}

    fetch("/api/user/roadmap-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: roadmap.slug,
        milestoneId,
        isCompleted: false,
      }),
    }).catch(() => {});
  };

  const handleCopyScaffold = (milestone: SprintMilestone) => {
    const scaffold = `// ==========================================
// Deliverable: ${milestone.deliverable}
// Task: ${milestone.task}
// Estimated Time: ${milestone.estimatedHours} Hours
// DevScore Bonus: +${milestone.xpBonus || 30} XP
// ==========================================

export async function solution() {
  console.log("Initializing verified implementation for ${milestone.deliverable}...");
  // TODO: Implement production solution with error handling
}
`;
    navigator.clipboard.writeText(scaffold);
    setCopiedCodeId(milestone.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleQuizSubmit = (milestone: SprintMilestone) => {
    const quiz = getMilestoneQuiz(milestone);
    if (selectedQuizAnswer === null) {
      setQuizError("Please select an answer to verify your solution.");
      return;
    }

    if (quiz.options[selectedQuizAnswer]?.correct) {
      setQuizError(null);
      verifyMilestone(milestone.id, { quizPassed: true, notes: "Verified via Rapid Knowledge Check" });
      setSelectedQuizAnswer(null);
    } else {
      setQuizError("Incorrect response. Review the concept and try again!");
    }
  };

  const handleProofSubmit = (milestone: SprintMilestone) => {
    if (!githubInput.trim()) {
      setQuizError("Please provide a valid GitHub URL or proof repository link.");
      return;
    }

    setQuizError(null);
    verifyMilestone(milestone.id, {
      githubUrl: githubInput.trim(),
      notes: notesInput.trim(),
    });
    setGithubInput("");
    setNotesInput("");
  };

  // Calculations
  const allMilestones: SprintMilestone[] = sprints.flatMap((w) => w.milestones);
  const totalMilestonesCount = allMilestones.length;
  const completedCount = allMilestones.filter((m) => completedMilestones.has(m.id)).length;
  const progressPercent = totalMilestonesCount > 0 ? Math.round((completedCount / totalMilestonesCount) * 100) : 0;
  const totalXpEarned = completedCount * 30;

  const currentWeek = sprints.find((w) => w.weekNumber === activeWeekNumber) || sprints[0];

  if (sprints.length === 0) return null;

  return (
    <div className="rounded-3xl border border-indigo-950/80 bg-[#0c1024] p-6 sm:p-8 shadow-xl space-y-6 text-white">
      {/* HEADER WITH PROGRESS & XP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-900/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
              ⚡ 8-Week Actionable Sprint Track
            </span>
            {cloudSynced && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                <Cloud className="h-3 w-3 text-cyan-400" />
                Synced to Cloud
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Interactive Sprint Milestones &amp; DevScore
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every milestone includes an interactive proof hook: complete the technical knowledge check or submit your GitHub deliverable to earn +30 DevScore XP.
          </p>
        </div>

        {/* STATS BADGE */}
        <div className="flex items-center gap-4 bg-[#101533] border border-indigo-900/60 p-4 rounded-2xl shrink-0 shadow-inner">
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Sprint Progress
            </div>
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <span>{completedCount}/{totalMilestonesCount}</span>
              <span className="text-xs text-emerald-400 font-bold">({progressPercent}%)</span>
            </div>
          </div>
          <div className="h-8 w-px bg-indigo-900/60" />
          <div>
            <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 fill-current" />
              DevScore XP
            </div>
            <div className="text-lg font-black text-amber-400">
              +{totalXpEarned} XP
            </div>
          </div>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#101533] rounded-full h-2.5 overflow-hidden border border-indigo-900/40">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* WEEK TABS (1 TO 8) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sprints.map((week) => {
          const weekDoneCount = week.milestones.filter((m) => completedMilestones.has(m.id)).length;
          const isComplete = weekDoneCount === week.milestones.length;
          const isActive = week.weekNumber === activeWeekNumber;

          return (
            <button
              key={week.weekNumber}
              onClick={() => {
                setActiveWeekNumber(week.weekNumber);
                setExpandedMilestoneId(null);
              }}
              className={`flex flex-col items-start px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 min-w-[110px] ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-400/50 shadow-md shadow-indigo-600/30"
                  : isComplete
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/40"
                  : "bg-[#101533]/80 text-slate-300 border-indigo-900/40 hover:bg-[#161d47] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span>Week {week.weekNumber}</span>
                {isComplete && <Check className="h-3 w-3 text-emerald-400" />}
              </div>
              <span className={`text-[10px] font-normal mt-0.5 ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                {weekDoneCount}/{week.milestones.length} Done
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE WEEK CARD & MILESTONES */}
      {currentWeek && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Week {currentWeek.weekNumber} Objective
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {currentWeek.theme}
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Estimated ~{currentWeek.milestones.reduce((acc, m) => acc + (m.estimatedHours || 0), 0) || 12} hrs study time
            </span>
          </div>

          <div className="space-y-3">
            {currentWeek.milestones.map((milestone) => {
              const isChecked = completedMilestones.has(milestone.id);
              const isExpanded = expandedMilestoneId === milestone.id;
              const quiz = getMilestoneQuiz(milestone);
              const proof = proofs[milestone.id];

              return (
                <div
                  key={milestone.id}
                  className={`rounded-2xl border transition-all ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-800/50"
                      : isExpanded
                      ? "bg-[#101533] border-indigo-500/70 shadow-lg"
                      : "bg-[#101533]/60 border-indigo-900/40 hover:border-indigo-600/40"
                  }`}
                >
                  {/* MAIN MILESTONE BAR */}
                  <div
                    onClick={() => {
                      setExpandedMilestoneId(isExpanded ? null : milestone.id);
                      setQuizError(null);
                    }}
                    className="flex items-start justify-between gap-3.5 p-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-500 hover:text-cyan-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-bold ${isChecked ? "line-through text-slate-400" : "text-white"}`}>
                            {milestone.task}
                          </span>
                          {isChecked && (
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Verified Proof ✓
                            </span>
                          )}
                        </div>

                        {milestone.deliverable && (
                          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                            <FileCheck className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                            <span>Deliverable: <strong>{milestone.deliverable}</strong> ({milestone.estimatedHours}h)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold">
                        +{milestone.xpBonus || 30} XP
                      </span>
                      <button className="text-slate-400 hover:text-white p-1">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED INTERACTIVE VERIFICATION WORKSPACE HOOK */}
                  {isExpanded && (
                    <div className="border-t border-indigo-900/60 p-5 bg-[#080c24] rounded-b-2xl space-y-5 animate-in fade-in duration-150">
                      {isChecked ? (
                        <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/40 p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                              <span>Deliverable Verified &amp; Candidate DevScore Awarded (+30 XP)</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unverifyMilestone(milestone.id)}
                              className="text-[10px] h-7 px-2.5 border-rose-900/50 text-rose-300 hover:bg-rose-950/60"
                            >
                              Reset Milestone
                            </Button>
                          </div>
                          {proof?.githubUrl && (
                            <div className="text-xs text-slate-300 font-mono">
                              Proof URL: <a href={proof.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{proof.githubUrl}</a>
                            </div>
                          )}
                          {proof?.notes && (
                            <p className="text-xs text-slate-400">{proof.notes}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* QUICK TOOLS BAR */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-950 pb-3 text-xs">
                            <span className="text-slate-400 font-mono">Interactive Verification Workspace:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyScaffold(milestone)}
                                className="text-xs h-7 gap-1 border-indigo-800 bg-[#101533] text-indigo-300 hover:text-white"
                              >
                                <Copy className="h-3 w-3" />
                                <span>{copiedCodeId === milestone.id ? "Scaffold Copied!" : "Copy Code Scaffold"}</span>
                              </Button>
                              <Link href="/whiteboard">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-7 gap-1 border-indigo-800 bg-[#101533] text-cyan-300 hover:text-white"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span>Whiteboard Topology</span>
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* OPTION 1: RAPID TECHNICAL CONCEPT CHECK */}
                          <div className="rounded-xl border border-indigo-900/60 bg-[#0c1024] p-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                              <Zap className="h-4 w-4 text-amber-400" />
                              <span>Method A: Rapid Technical Sanity Check (Instant Unlock)</span>
                            </div>
                            <p className="text-xs text-slate-200 font-semibold">{quiz.question}</p>

                            <div className="space-y-2">
                              {quiz.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => setSelectedQuizAnswer(optIdx)}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all ${
                                    selectedQuizAnswer === optIdx
                                      ? "bg-indigo-600/30 border-indigo-500 text-white"
                                      : "bg-[#080d24] border-indigo-950 text-slate-300 hover:border-indigo-800"
                                  }`}
                                >
                                  <span className="text-indigo-400 font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                                  {opt.text}
                                </button>
                              ))}
                            </div>

                            {quizError && (
                              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono pt-1">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>{quizError}</span>
                              </div>
                            )}

                            <Button
                              size="sm"
                              onClick={() => handleQuizSubmit(milestone)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 rounded-lg"
                            >
                              Verify Solution &amp; Earn +30 XP
                            </Button>
                          </div>

                          {/* OPTION 2: SUBMIT GITHUB DELIVERABLE */}
                          <div className="rounded-xl border border-indigo-900/60 bg-[#0c1024] p-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                              <Github className="h-4 w-4 text-cyan-400" />
                              <span>Method B: Submit GitHub Deliverable / PR Proof</span>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="url"
                                placeholder="https://github.com/your-username/repo-name"
                                value={githubInput}
                                onChange={(e) => setGithubInput(e.target.value)}
                                className="w-full bg-[#080d24] border border-indigo-950 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                              />
                              <input
                                type="text"
                                placeholder="Technical notes or architecture summary (optional)"
                                value={notesInput}
                                onChange={(e) => setNotesInput(e.target.value)}
                                className="w-full bg-[#080d24] border border-indigo-950 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleProofSubmit(milestone)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-8 rounded-lg"
                            >
                              Submit Proof &amp; Verify
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FOOTER CALLOUT */}
      <div className="pt-4 border-t border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>Sprint completions count directly toward your candidate DevScore.</span>
        </div>
        <Link href="/canvas" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
          <span>Inspect In Interactive Course Canvas</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
