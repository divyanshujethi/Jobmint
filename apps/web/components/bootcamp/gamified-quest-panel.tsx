"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  Swords,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PlayerStats,
  getStoredPlayerStats,
  addPlayerXp,
  playSuccessChime,
  playWrongBuzzer,
  triggerConfetti,
} from "@/lib/game-engine";

export interface QuestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface GamifiedQuestPanelProps {
  dayNumber: number;
  subdomain: string;
  questions?: QuestQuestion[];
  isCodeSolved: boolean;
  isAssignmentSubmitted: boolean;
  onSolveCodeTrigger?: () => void;
}

export function GamifiedQuestPanel({
  dayNumber,
  subdomain,
  questions,
  isCodeSolved,
  isAssignmentSubmitted,
  onSolveCodeTrigger,
}: GamifiedQuestPanelProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Rapid knowledge battle state
  const defaultQuestions: QuestQuestion[] = questions && questions.length > 0 ? questions : [
    {
      question: `In production ${subdomain}, what is the primary architectural trade-off to consider?`,
      options: [
        "Throughput vs Latency under high concurrent load",
        "Ignoring error codes for faster network roundtrips",
        "Storing unhashed credentials in distributed cache",
        "Hardcoding IP addresses in client-side bundles",
      ],
      correctIndex: 0,
      explanation: "Balancing latency budgets and throughput throughput requirements is fundamental to engineering scalable systems.",
    },
    {
      question: "Which pattern best prevents cascading failures in distributed microservices?",
      options: [
        "Circuit Breaker & Exponential Backoff with Jitter",
        "Synchronous blocking loops on failed network calls",
        "Disabling health check endpoints under traffic spikes",
        "Unbounded in-memory queue without backpressure",
      ],
      correctIndex: 0,
      explanation: "Circuit Breakers combined with exponential backoff prevent downstream service exhaustion during outages.",
    },
    {
      question: "Why are atomic commits and linear commit histories favored in open-source engineering?",
      options: [
        "Enables git bisect and isolated rollbacks of breaking changes",
        "Increases repository file size unnecessarily",
        "Prevents other developers from contributing",
        "Bypasses CI/CD automated validation runs",
      ],
      correctIndex: 0,
      explanation: "Atomic commits make bisecting regressions and cherry-picking fixes reliable and transparent.",
    },
  ];

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [hasClaimedTheoryXp, setHasClaimedTheoryXp] = useState(false);

  useEffect(() => {
    setStats(getStoredPlayerStats());
  }, []);

  const currentQ = defaultQuestions[activeQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      if (soundEnabled) playSuccessChime();
      const earned = 100 * comboMultiplier;
      setQuizScore((prev) => prev + 1);
      setComboMultiplier((prev) => prev + 1);
      const updated = addPlayerXp(earned);
      setStats(updated);
    } else {
      if (soundEnabled) playWrongBuzzer();
      setComboMultiplier(1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx + 1 < defaultQuestions.length) {
      setActiveQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (soundEnabled) triggerConfetti();
    }
  };

  const handleClaimTheory = () => {
    if (hasClaimedTheoryXp) return;
    setHasClaimedTheoryXp(true);
    const updated = addPlayerXp(100);
    setStats(updated);
  };

  if (!stats) return null;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-6 shadow-xl relative overflow-hidden">
      {/* GLOW DECOR */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP STATS HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black text-lg">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">{stats.title}</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                {stats.xp} XP
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Next Rank at {stats.nextLevelXp} XP</span>
              <span>•</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                {stats.streakDays} Day Streak!
              </span>
            </div>
          </div>
        </div>

        {/* SOUND FX TOGGLE & COMBO PILL */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {comboMultiplier > 1 && (
            <span className="rounded-full bg-amber-500/20 border border-amber-500/50 px-2.5 py-1 text-[11px] font-black text-amber-300 animate-bounce">
              🔥 {comboMultiplier}x COMBO BONUS!
            </span>
          )}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title={soundEnabled ? "Mute Game Audio" : "Enable Game Audio"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* XP PROGRESS BAR */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Level Progress</span>
          <span className="text-emerald-400 font-bold">{stats.progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${stats.progressPercent}%` }}
          />
        </div>
      </div>

      {/* TWO COLUMN GRID: QUEST OBJECTIVES & KNOWLEDGE BATTLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* QUEST OBJECTIVES */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-white uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Day {dayNumber} Daily Quest Objectives</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Quest 1 */}
            <div
              onClick={handleClaimTheory}
              className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                hasClaimedTheoryXp
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                  hasClaimedTheoryXp ? "bg-emerald-500 text-slate-950" : "border border-slate-700"
                }`}>
                  {hasClaimedTheoryXp ? "✓" : "1"}
                </div>
                <div>
                  <div className="font-bold">Inspect Architecture &amp; Theory</div>
                  <div className="text-[10px] text-slate-400">Review foundational systems guide</div>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-400">
                {hasClaimedTheoryXp ? "+100 XP Claimed" : "+100 XP"}
              </span>
            </div>

            {/* Quest 2 */}
            <div
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                isCodeSolved
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                  : "border-slate-800 bg-slate-950/50 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                  isCodeSolved ? "bg-emerald-500 text-slate-950" : "border border-slate-700"
                }`}>
                  {isCodeSolved ? "✓" : "2"}
                </div>
                <div>
                  <div className="font-bold">Defeat Code Arena Test Suite</div>
                  <div className="text-[10px] text-slate-400">Pass 100% of algorithmic test cases</div>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-400">
                {isCodeSolved ? "+250 XP Cleared" : "+250 XP"}
              </span>
            </div>

            {/* Quest 3 */}
            <div
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                isAssignmentSubmitted
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                  : "border-slate-800 bg-slate-950/50 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                  isAssignmentSubmitted ? "bg-emerald-500 text-slate-950" : "border border-slate-700"
                }`}>
                  {isAssignmentSubmitted ? "✓" : "3"}
                </div>
                <div>
                  <div className="font-bold">Push Production Git Commit Proof</div>
                  <div className="text-[10px] text-slate-400">Submit commit URL to unlock next day</div>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-400">
                {isAssignmentSubmitted ? "+500 XP Cleared" : "+500 XP"}
              </span>
            </div>
          </div>
        </div>

        {/* RAPID KNOWLEDGE BATTLE */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-white uppercase tracking-wider">
              <Swords className="h-4 w-4 text-emerald-400" />
              <span>Rapid Knowledge Battle ({activeQuestionIdx + 1}/{defaultQuestions.length})</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              Score: {quizScore}/{defaultQuestions.length}
            </span>
          </div>

          {!quizCompleted ? (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200 leading-snug">
                  {currentQ.question}
                </p>

                <div className="space-y-1.5 pt-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = isAnswerSubmitted && oIdx === currentQ.correctIndex;
                    const isWrong = isAnswerSubmitted && isSelected && oIdx !== currentQ.correctIndex;

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full text-left p-2 rounded-lg text-[11px] transition-all border flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold"
                            : isWrong
                            ? "bg-red-500/20 border-red-500 text-red-200"
                            : isSelected
                            ? "bg-slate-800 border-emerald-500 text-white font-medium"
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <span className="text-emerald-400 font-black">✓</span>}
                        {isWrong && <span className="text-red-400 font-black">✗</span>}
                      </button>
                    );
                  })}
                </div>

                {isAnswerSubmitted && (
                  <p className="text-[10px] text-slate-400 mt-2 bg-slate-950/60 p-2 rounded border border-slate-800">
                    💡 {currentQ.explanation}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                {!isAnswerSubmitted ? (
                  <Button
                    type="button"
                    onClick={handleVerifyAnswer}
                    disabled={selectedOption === null}
                    size="sm"
                    className="h-7 px-3 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                  >
                    Confirm Answer
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextQuestion}
                    size="sm"
                    className="h-7 px-3 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg inline-flex items-center gap-1"
                  >
                    <span>{activeQuestionIdx + 1 < defaultQuestions.length ? "Next Challenge" : "Complete Battle"}</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-2 my-auto">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-lg font-black">
                ★
              </div>
              <h4 className="text-sm font-extrabold text-white">Knowledge Battle Conquered!</h4>
              <p className="text-xs text-slate-400">
                You scored {quizScore}/{defaultQuestions.length} correct and earned +{quizScore * 100} XP!
              </p>
              <Button
                type="button"
                onClick={() => {
                  setQuizCompleted(false);
                  setActiveQuestionIdx(0);
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                  setQuizScore(0);
                }}
                size="sm"
                variant="outline"
                className="border-slate-700 text-slate-300 text-xs rounded-lg mt-1"
              >
                Replay Battle
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
