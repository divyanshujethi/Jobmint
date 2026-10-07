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

interface InteractiveRoadmapSprintsProps {
  roadmap: CareerRoadmap;
}

export function InteractiveRoadmapSprints({ roadmap }: InteractiveRoadmapSprintsProps) {
  const sprints = roadmap.weeklySprints || [];
  const [activeWeekNumber, setActiveWeekNumber] = useState<number>(1);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [cloudSynced, setCloudSynced] = useState(false);

  // Storage key
  const storageKey = `studynest_roadmap_progress_${roadmap.slug}`;

  // Load from localStorage and sync with PostgreSQL
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedMilestones(new Set(JSON.parse(saved)));
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
  }, [roadmap.slug, storageKey]);

  // Toggle milestone completion
  const toggleMilestone = (milestoneId: string) => {
    const isNowCompleted = !completedMilestones.has(milestoneId);
    setCompletedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(milestoneId)) {
        next.delete(milestoneId);
      } else {
        next.add(milestoneId);
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });

    // Award +30 XP on unified gamification ledger
    if (isNowCompleted) {
      try {
        const currentXp = parseInt(localStorage.getItem("studynest_gamification_xp") || "850", 10);
        const newXp = currentXp + 30;
        localStorage.setItem("studynest_gamification_xp", newXp.toString());
        const currentStreak = parseInt(localStorage.getItem("studynest_study_streak") || "4", 10);
        window.dispatchEvent(new CustomEvent("studynest-xp-updated", { detail: { xp: newXp, streak: currentStreak } }));
      } catch {}
    }

    // Cloud sync with PostgreSQL
    fetch("/api/user/roadmap-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: roadmap.slug,
        milestoneId,
        isCompleted: isNowCompleted,
      }),
    })
      .then((res) => {
        if (res.ok) setCloudSynced(true);
      })
      .catch(() => {});
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
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Check off weekly milestones as you build deliverables. Each checked milestone boosts your candidate DevScore (+30 XP) on StudyNest Academy.
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
              onClick={() => setActiveWeekNumber(week.weekNumber)}
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

          <div className="space-y-2.5">
            {currentWeek.milestones.map((milestone) => {
              const isChecked = completedMilestones.has(milestone.id);

              return (
                <div
                  key={milestone.id}
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-emerald-950/30 border-emerald-800/40 text-slate-200"
                      : "bg-[#101533]/60 border-indigo-900/40 hover:border-indigo-600/50 hover:bg-[#101533] text-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-600 hover:text-cyan-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-bold ${isChecked ? "line-through text-slate-400" : "text-white"}`}>
                        {milestone.task}
                      </span>
                      <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold shrink-0">
                        +{milestone.xpBonus || 30} XP
                      </span>
                    </div>
                    {milestone.deliverable && (
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                        <FileCheck className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                        <span>Deliverable: {milestone.deliverable} ({milestone.estimatedHours}h)</span>
                      </div>
                    )}
                  </div>
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
