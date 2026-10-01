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
  const storageKey = `rolenest_roadmap_progress_${roadmap.slug}`;

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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* HEADER WITH PROGRESS & XP */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-bold text-emerald-800">
              ⚡ 8-Week Actionable Sprint Track
            </span>
            {cloudSynced && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-700">
                <Cloud className="h-3 w-3 text-blue-600" />
                Synced to Cloud
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Interactive Sprint Milestones &amp; DevScore
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Check off weekly milestones as you build deliverables. Each checked milestone boosts your candidate DevScore (+30 XP) and ranks you higher on recruiter talent searches.
          </p>
        </div>

        {/* STATS BADGE */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl shrink-0">
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Sprint Progress
            </div>
            <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>{completedCount}/{totalMilestonesCount}</span>
              <span className="text-xs text-emerald-600 font-bold">({progressPercent}%)</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 fill-current" />
              DevScore XP
            </div>
            <div className="text-lg font-black text-amber-600">
              +{totalXpEarned} XP
            </div>
          </div>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
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
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : isComplete
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span>Week {week.weekNumber}</span>
                {isComplete && <Check className={`h-3 w-3 ${isActive ? "text-emerald-400" : "text-emerald-600"}`} />}
              </div>
              <span className={`text-[10px] mt-0.5 font-mono ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                {weekDoneCount}/{week.milestones.length} Tasks
              </span>
            </button>
          );
        })}
      </div>

      {/* CURRENT WEEK DETAIL CARD */}
      {currentWeek && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                {currentWeek.theme}
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                {currentWeek.title}
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Week {currentWeek.weekNumber} of 8
            </span>
          </div>

          {/* MILESTONES CHECKBOX LIST */}
          <div className="space-y-3">
            {currentWeek.milestones.map((milestone) => {
              const isChecked = completedMilestones.has(milestone.id);

              return (
                <div
                  key={milestone.id}
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? "bg-emerald-50/80 border-emerald-300 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-2xs"
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 hover:text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5
                        className={`text-sm font-bold leading-snug ${
                          isChecked ? "text-slate-700 line-through decoration-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {milestone.task}
                      </h5>
                      <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800 shrink-0">
                        +{milestone.xpBonus} XP
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                        <FileCheck className="h-3 w-3 text-emerald-600" />
                        Deliverable: {milestone.deliverable}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Clock className="h-3 w-3 text-slate-400" />
                        ~{milestone.estimatedHours}h
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
