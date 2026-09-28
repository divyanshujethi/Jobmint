"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Search,
  ArrowRight,
  Code2,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  Target,
  Share2,
  Check,
  Building2,
  Filter,
  RefreshCw,
  Trophy,
  Star
} from "lucide-react";
import {
  InteractiveJobCourse,
  ALL_INTERACTIVE_COURSES,
  synthesizeJobCourse,
  DailyLesson
} from "@/lib/study-courses-data";

export default function StudyHubPage() {
  const [courses, setCourses] = useState<InteractiveJobCourse[]>(ALL_INTERACTIVE_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<InteractiveJobCourse>(ALL_INTERACTIVE_COURSES[0]!);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Generator inputs
  const [customRole, setCustomRole] = useState<string>("");
  const [customCompany, setCustomCompany] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<boolean>(false);

  // Daily streak & completed days state (persisted in localStorage)
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showAnswerDay, setShowAnswerDay] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(3);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rolenest_study_progress");
      if (saved) {
        setCompletedDays(JSON.parse(saved));
      }
      const savedStreak = localStorage.getItem("rolenest_study_streak");
      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10));
      }
    } catch {}
  }, []);

  // Save progress
  const toggleDayCompletion = (courseId: string, day: number) => {
    setCompletedDays((prev) => {
      const currentList = prev[courseId] || [];
      const isDone = currentList.includes(day);
      const updated = isDone
        ? currentList.filter((d) => d !== day)
        : [...currentList, day];

      const newState = { ...prev, [courseId]: updated };
      try {
        localStorage.setItem("rolenest_study_progress", JSON.stringify(newState));
        // Bump streak if completing
        if (!isDone) {
          const newStreak = streakCount + 1;
          setStreakCount(newStreak);
          localStorage.setItem("rolenest_study_streak", newStreak.toString());
        }
      } catch {}
      return newState;
    });
  };

  // Dynamic Course Generator handler
  const handleGenerateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRole.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newCourse = synthesizeJobCourse({
        jobTitle: customRole,
        companyName: customCompany.trim() || undefined,
        skills: ["System Design", "Core Algorithms", "Database Optimization", "Clean Code"],
      });

      setCourses((prev) => [newCourse, ...prev]);
      setSelectedCourse(newCourse);
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setExpandedDay(1);
    }, 600);
  };

  // Filtered course tracks
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedCategory !== "ALL" && c.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesRole = c.targetRole.toLowerCase().includes(q);
        const matchesSkills = c.skillsCovered.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesRole && !matchesSkills) return false;
      }
      return true;
    });
  }, [courses, selectedCategory, searchQuery]);

  const courseCompletedList = completedDays[selectedCourse.id] || [];
  const progressPercent = Math.round((courseCompletedList.length / selectedCourse.days.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* DAILY STREAK & STUDENT WELCOME STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <Flame className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white">
                {streakCount}-Day Daily Study Streak!
              </span>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                🔥 Active Habit
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Consistency beats intensity. Complete 1 daily lesson or POTD every 24 hours to keep your streak alive and unlock verified certificates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/potd"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition-colors"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            Today's POTD (+50 XP)
          </Link>
          <Link
            href="/playlists"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            Video Playlists
          </Link>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Interactive Course Engine &amp; Job Prep
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Study Things: Interactive Job-to-Course Studio
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl">
              Whatever tech job you want in India, RoleNest automatically synthesizes an interactive 30-day day-by-day learning course with daily coding tasks, core CS concepts, and mock interview questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <Trophy className="h-4 w-4 text-amber-500" /> 100% Free for Students
            </span>
          </div>
        </div>
      </div>

      {/* AUTOMATION STUDIO: DYNAMIC JOB-TO-COURSE GENERATOR */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                AI
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Target Any Job: Instant 30-Day Course Generator
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Enter any role or dream company (e.g. <em>"Backend Engineer at Razorpay"</em>, <em>"AI Applications Engineer at Sarvam AI"</em>, or <em>"Scientist B at NIC"</em>). Our automation will build a customized 30-day interactive daily curriculum for you.
            </p>
          </div>

          {generatedSuccess && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <Check className="h-4 w-4 text-emerald-600" /> Course Generated &amp; Activated!
            </span>
          )}
        </div>

        <form onSubmit={handleGenerateCourse} className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Target Job Role or Specialization *
            </label>
            <input
              type="text"
              placeholder="e.g. Backend Software Engineer, React Developer, AI/LLM Intern..."
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Target Company (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Razorpay, Swiggy, Sarvam AI, NIC, Google..."
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  Generate Course
                </>
              )}
            </button>
          </div>
        </form>

        {/* POPULAR PRESET SHORTCUTS */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Target className="h-3 w-3 text-emerald-600" /> Popular Quick Tracks:
          </span>
          {[
            { label: "🚀 SDE-1 / Fresher All-Rounder", role: "SDE-1 / Junior Software Engineer", company: "Top Tech Unicorns" },
            { label: "🤖 AI & LLM Applications", role: "AI & LLM Software Engineer", company: "Sarvam AI / SigNoz" },
            { label: "⚛️ Next.js 15 Full Stack", role: "Full Stack Engineer (Next.js)", company: "Postman / Groww" },
            { label: "🐹 Golang Distributed Systems", role: "Backend Engineer (Go)", company: "Zerodha / CRED" },
            { label: "🏛️ Govt Scientist 'B' (NIC/ISRO)", role: "Scientist 'B' Computer Science", company: "NIC & ISRO" },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setCustomRole(preset.role);
                setCustomCompany(preset.company);
                const synthesized = synthesizeJobCourse({
                  jobTitle: preset.role,
                  companyName: preset.company,
                });
                setCourses((prev) => [synthesized, ...prev]);
                setSelectedCourse(synthesized);
                setGeneratedSuccess(true);
              }}
              className="rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* TRACK SELECTOR & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search study tracks by role, skill (e.g. React, Go, System Design, NIC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "All Tracks", value: "ALL" },
            { label: "Full Stack", value: "FULL_STACK" },
            { label: "Backend", value: "BACKEND" },
            { label: "AI & ML", value: "AI_ML" },
            { label: "Govt Tech", value: "GOVT_TECH" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE COURSE HEADER & PROGRESS CARD */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl">{selectedCourse.iconEmoji}</span>
              <span className="rounded-md bg-emerald-100/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {selectedCourse.targetRole}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedCourse.days.length} Days Structured
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {selectedCourse.expectedSalary}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {selectedCourse.title}
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {selectedCourse.overview}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedCourse.skillsCovered.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white border border-emerald-200/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-900 shadow-2xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* PROGRESS & COMPLETION GAUGE */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0 rounded-2xl bg-white p-5 border border-emerald-200/80 shadow-xs min-w-[240px]">
            <div className="w-full">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Course Progress</span>
                <span className="text-emerald-700 font-mono">{progressPercent}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>{courseCompletedList.length} of {selectedCourse.days.length} Days Done</span>
                <span>{selectedCourse.days.length - courseCompletedList.length} Remaining</span>
              </div>
            </div>

            <Link
              href="/certificates"
              className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                progressPercent >= 100
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              {progressPercent >= 100 ? "Claim Verified Certificate 🎉" : "Certificate at 100%"}
            </Link>
          </div>
        </div>

        {/* LIVE JOB ALIGNMENT CALLOUT */}
        <div className="mt-6 pt-4 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-700" />
            <span className="font-semibold">
              Currently hiring for this track: {selectedCourse.targetCompanies.join(", ")}
            </span>
          </div>
          <Link
            href="/jobs"
            className="font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 flex items-center gap-1"
          >
            Browse 620+ Live Open Positions &rarr;
          </Link>
        </div>
      </div>

      {/* COURSE DAYS ACCORDION (1 to 30) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            30-Day Interactive Daily Schedule
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Click any day to expand curriculum &amp; interview questions
          </span>
        </div>

        <div className="space-y-3">
          {selectedCourse.days.map((lesson) => {
            const isDone = courseCompletedList.includes(lesson.day);
            const isExpanded = expandedDay === lesson.day;
            const isAnswerVisible = showAnswerDay === lesson.day;

            return (
              <div
                key={lesson.day}
                className={`rounded-2xl border transition-all ${
                  isDone
                    ? "border-emerald-300 bg-emerald-50/20"
                    : isExpanded
                      ? "border-slate-300 bg-white shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* DAY HEADER BAR */}
                <div
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none"
                  onClick={() => setExpandedDay(isExpanded ? null : lesson.day)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDayCompletion(selectedCourse.id, lesson.day);
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all ${
                        isDone
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "border-slate-300 bg-white text-transparent hover:border-emerald-500"
                      }`}
                      title={isDone ? "Completed! Click to unmark." : "Mark as completed today"}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                          Day {lesson.day}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {lesson.phase}
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold mt-0.5 ${isDone ? "line-through text-slate-500" : "text-slate-900"}`}>
                        {lesson.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {lesson.practiceLink && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        <Code2 className="h-3 w-3" /> Practice Link
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-4 sm:p-6 space-y-4 bg-slate-50/50 rounded-b-2xl text-xs text-slate-700">
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                        Concept Summary
                      </h5>
                      <p className="mt-1 leading-relaxed text-slate-700">
                        {lesson.conceptSummary}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                        Key Topics Covered
                      </h5>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {lesson.keyTopics.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700 shadow-2xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-blue-600" />
                        Today's Hands-On Coding Task:
                      </div>
                      <p className="text-slate-600">
                        {lesson.handsOnTask}
                      </p>
                    </div>

                    {/* INTERVIEW QUESTION & MODEL ANSWER */}
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-amber-950 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                          Company Mock Interview Question:
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAnswerDay(isAnswerVisible ? null : lesson.day)}
                          className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline underline-offset-2 cursor-pointer"
                        >
                          {isAnswerVisible ? "Hide Answer" : "Reveal Model Answer"}
                        </button>
                      </div>

                      <p className="font-medium text-slate-800 italic">
                        "{lesson.interviewQuestion}"
                      </p>

                      {isAnswerVisible && (
                        <div className="pt-2 border-t border-amber-200/60 mt-2 text-slate-700 leading-relaxed animate-in fade-in duration-150">
                          <strong className="text-emerald-900">Model Answer: </strong>
                          {lesson.modelAnswer}
                        </div>
                      )}
                    </div>

                    {/* FOOTER ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      {lesson.practiceLink ? (
                        <a
                          href={lesson.practiceLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 text-slate-500" />
                          {lesson.practiceLink.title}
                        </a>
                      ) : <span />}

                      <button
                        type="button"
                        onClick={() => toggleDayCompletion(selectedCourse.id, lesson.day)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          isDone
                            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        {isDone ? "Mark as Incomplete" : "Mark Day Complete (+10 XP)"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CAPSTONE PROJECT SHOWCASE */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
              Proof-of-Work Required
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Capstone Project: {selectedCourse.capstoneProject.title}
            </h3>
          </div>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Submit for Verified Certificate &rarr;
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-600 leading-relaxed">
          {selectedCourse.capstoneProject.description}
        </p>

        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Deliverable Benchmark:</strong> {selectedCourse.capstoneProject.deliverable}
          </div>
        </div>
      </div>
    </div>
  );
}
