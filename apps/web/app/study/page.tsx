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
  Star,
  Lock,
  Crown,
  X,
  Compass,
  ListVideo,
  Users2,
  Cpu,
  Server,
  Cloud,
  Database,
  GraduationCap,
  PenTool,
} from "lucide-react";
import {
  InteractiveJobCourse,
  ALL_INTERACTIVE_COURSES,
  synthesizeJobCourse,
  DailyLesson,
} from "@/lib/study-courses-data";
import { CAREER_ROADMAPS } from "@repo/shared";
import { Button } from "@/components/ui/button";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";
import { StudyProModal } from "@/components/study-pro-modal";
import { StudyGamificationModal } from "@/components/study-gamification-modal";

export default function StudyHubPage() {
  const [proModalOpen, setProModalOpen] = useState(false);
  const [gamificationModalOpen, setGamificationModalOpen] = useState(false);
  const [gamificationTab, setGamificationTab] = useState<"overview" | "quests" | "badges">("overview");
  const [studyXp, setStudyXp] = useState<number>(0);
  const [courses, setCourses] = useState<InteractiveJobCourse[]>(ALL_INTERACTIVE_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<InteractiveJobCourse>(ALL_INTERACTIVE_COURSES[0]!);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // AI Generator inputs
  const [customRole, setCustomRole] = useState<string>("");
  const [customCompany, setCustomCompany] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<boolean>(false);

  // Daily streak & completed days state (persisted in localStorage)
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showAnswerDay, setShowAnswerDay] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);

  // Load progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rolenest_study_progress");
      if (saved) {
        setCompletedDays(JSON.parse(saved));
      }
      const savedStreak =
        localStorage.getItem("studynest_study_streak") ||
        localStorage.getItem("rolenest_study_streak");
      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10));
      }

      const savedXp =
        localStorage.getItem("studynest_gamification_xp") ||
        localStorage.getItem("rolenest_study_xp");
      if (savedXp) {
        setStudyXp(parseInt(savedXp, 10));
      }
    } catch {}

    const handleXpUpdate = () => {
      try {
        const x = localStorage.getItem("studynest_gamification_xp");
        if (x) setStudyXp(parseInt(x, 10));
        const s = localStorage.getItem("studynest_study_streak");
        if (s) setStreakCount(parseInt(s, 10));
      } catch {}
    };

    window.addEventListener("studynest-xp-updated", handleXpUpdate);

    // Check hash for direct section scrolling or modal
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (hash === "ai-generator" || hash === "ai-syllabus") {
        setTimeout(() => {
          document.getElementById("ai-generator")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else if (hash === "pro") {
        setProModalOpen(true);
      }
    }

    return () => {
      window.removeEventListener("studynest-xp-updated", handleXpUpdate);
    };
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
        if (!isDone) {
          const newStreak = streakCount + 1;
          setStreakCount(newStreak);
          localStorage.setItem("studynest_study_streak", newStreak.toString());
          localStorage.setItem("rolenest_study_streak", newStreak.toString());

          const currentXp = parseInt(localStorage.getItem("studynest_gamification_xp") || "0", 10);
          const newXp = currentXp + 120;
          localStorage.setItem("studynest_gamification_xp", newXp.toString());
          window.dispatchEvent(new CustomEvent("studynest-xp-updated", { detail: { xp: newXp, streak: newStreak } }));
        }
      } catch {}
      return newState;
    });
  };

  // AI Course Generator
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
  const progressPercent = Math.round((courseCompletedList.length / (selectedCourse.days.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-indigo-950/60 bg-gradient-to-b from-[#0c102a] via-[#070913] to-[#070913] px-4 py-12 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.2),rgba(255,255,255,0))]" />

          <div className="relative mx-auto max-w-5xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              <span>StudyNest Academy • Open Engineering University</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                100% Free Core
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
              Zero-BS Tech Roadmaps &amp;{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                Interactive Cohorts
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Bypass ₹50,000 bootcamps. Follow step-by-step curricula, visual course canvases, 30-day day-by-day guided exercises, and curated video masterclasses from beginner to FAANG-grade engineer.
            </p>

            {/* STREAK & XP STRIP */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setGamificationTab("overview");
                  setGamificationModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title="Inspect Learning Streak & Daily Goals (Click to view)"
              >
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
                <span>{streakCount > 0 ? `${streakCount}-Day Learning Streak` : "0-Day Streak • Start Learning"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGamificationTab("overview");
                  setGamificationModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title="Inspect Total Study XP & Rank Level Progress (Click to view)"
              >
                <Zap className="h-4 w-4 fill-indigo-400 text-indigo-400" />
                <span>{studyXp > 0 ? `${studyXp.toLocaleString()} XP Points • Lvl Progress` : "0 XP • Start Lesson to Level Up"}</span>
              </button>

              <button
                onClick={() => setProModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors shadow-sm"
              >
                <Crown className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>Get Pro Scholar Pass &bull; Diplomas &amp; AI &rarr;</span>
              </button>
            </div>
          </div>
        </section>

        {/* ACADEMY QUICK GATEWAY CARDS */}
        <section className="border-b border-indigo-950/60 bg-[#060814] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <Link
                href="/canvas"
                className="group p-4 rounded-2xl bg-[#0c1024] border border-indigo-950/80 hover:border-emerald-500/50 hover:bg-[#101533] transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Layers className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      9 Tracks
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors">
                    Course Canvas
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Visual dependency trees
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                  <span>Open Canvas</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/playlists"
                className="group p-4 rounded-2xl bg-[#0c1024] border border-indigo-950/80 hover:border-red-500/50 hover:bg-[#101533] transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                      <ListVideo className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                      75+ Courses
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-red-300 transition-colors">
                    Video Masterclasses
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Full video courses &amp; notes
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-red-400 font-semibold">
                  <span>Browse Library</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/whiteboard"
                className="group p-4 rounded-2xl bg-[#0c1024] border border-indigo-950/80 hover:border-cyan-500/50 hover:bg-[#101533] transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <PenTool className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      Infinite
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors">
                    Vector Whiteboard
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Freehand notes &amp; diagrams
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold">
                  <span>Launch Canvas</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/study-pods"
                className="group p-4 rounded-2xl bg-[#0c1024] border border-indigo-950/80 hover:border-violet-500/50 hover:bg-[#101533] transition-all shadow-md flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                      <Users2 className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                      Peer Meets
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-violet-300 transition-colors">
                    Peer Study Pods
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    STAR technical mock interviews
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-violet-400 font-semibold">
                  <span>Join Study Pods</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CORE CURRICULUM & COHORTS CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
          {/* 1. CAREER ROADMAP GUIDES */}
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/80 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Compass className="h-5 w-5 text-indigo-400" />
                    <span>Engineering Career Roadmaps</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Structured, phase-by-phase paths covering fundamentals, deep systems, deliverables, and capstone projects.
                  </p>
                </div>
                <Link href="/roadmaps">
                  <Button variant="outline" className="border-indigo-900 bg-[#0d1226] text-indigo-300 hover:bg-indigo-900/40 text-xs font-bold gap-1.5">
                    <span>Explore All Guides</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAREER_ROADMAPS.map((roadmap) => (
                  <div
                    key={roadmap.slug}
                    className="flex flex-col justify-between rounded-2xl border border-indigo-950/80 bg-[#0b0f22] p-6 shadow-xl hover:border-indigo-500/40 hover:shadow-indigo-950/40 transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300 font-mono">
                          {roadmap.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{roadmap.durationWeeks}</span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {roadmap.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {roadmap.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-indigo-950">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-bold">
                          Core Stack:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {roadmap.keySkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 text-[10px] font-mono text-indigo-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                          Key Milestone Phases ({roadmap.phases.length}):
                        </span>
                        {roadmap.phases.slice(0, 3).map((ph) => (
                          <div key={ph.phaseNumber} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate text-[11px] text-slate-300">{ph.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-indigo-950">
                      <Link href={`/roadmaps/${roadmap.slug}`}>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 text-xs shadow-md shadow-indigo-600/20">
                          <BookOpen className="h-4 w-4" />
                          <span>View Full Curriculum</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 30-DAY GUIDED COHORT TRACKS */}
            <div className="space-y-8 pt-4">
              {/* COURSE TRACK SELECTOR BAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-indigo-950/80 bg-[#0b0f22] p-4">
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                  {courses.map((c) => {
                    const isSelected = selectedCourse.id === c.id;
                    const doneCount = (completedDays[c.id] || []).length;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCourse(c);
                          setExpandedDay(1);
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20"
                            : "bg-[#0d1226] text-slate-300 hover:text-white border border-indigo-950"
                        }`}
                      >
                        <span className="text-base">{c.iconEmoji}</span>
                        <span>{c.targetRole}</span>
                        {doneCount > 0 && (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 text-[10px] font-mono">
                            {doneCount}/30
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Cohort Progress
                    </div>
                    <div className="text-xs font-bold text-indigo-300 font-mono">
                      {progressPercent}% Complete
                    </div>
                  </div>
                  <div className="w-20 bg-indigo-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SELECTED COURSE OVERVIEW */}
              <div className="rounded-2xl border border-indigo-950/80 bg-[#090d1f] p-6 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{selectedCourse.iconEmoji}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white font-mono">{selectedCourse.title}</h2>
                      <p className="text-xs text-slate-400">{selectedCourse.overview}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-emerald-300 font-bold">
                      {selectedCourse.expectedSalary}
                    </span>
                    <span className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 text-indigo-300">
                      {selectedCourse.difficulty}
                    </span>
                  </div>
                </div>

                {/* TARGET COMPANIES */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-2 border-t border-indigo-950/80">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mr-1">
                    Target Companies:
                  </span>
                  {selectedCourse.targetCompanies.map((tc) => (
                    <span
                      key={tc}
                      className="rounded-md bg-[#0d1226] border border-indigo-950 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {tc}
                    </span>
                  ))}
                </div>
              </div>

              {/* DAY BY DAY LESSON LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-mono font-bold uppercase tracking-wider">
                    Daily Workout Plan (Day 1 - {selectedCourse.days.length})
                  </span>
                  <span>Click any day to expand curriculum &amp; challenges</span>
                </div>

                {selectedCourse.days.map((lesson: DailyLesson) => {
                  const isCompleted = courseCompletedList.includes(lesson.day);
                  const isExpanded = expandedDay === lesson.day;
                  const isAnswerVisible = showAnswerDay === lesson.day;

                  return (
                    <div
                      key={lesson.day}
                      className={`rounded-2xl border transition-all ${
                        isCompleted
                          ? "border-emerald-500/40 bg-[#09151c]/90"
                          : isExpanded
                          ? "border-indigo-500/50 bg-[#0c1024]"
                          : "border-indigo-950/80 bg-[#090d1f] hover:border-indigo-900"
                      }`}
                    >
                      {/* LESSON ACCORDION HEADER */}
                      <div
                        onClick={() => setExpandedDay(isExpanded ? null : lesson.day)}
                        className="cursor-pointer p-4 sm:p-5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDayCompletion(selectedCourse.id, lesson.day);
                            }}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                                : "border-slate-700 bg-slate-900 hover:border-indigo-400 text-transparent"
                            }`}
                          >
                            <Check className="h-4 w-4 stroke-[3]" />
                          </button>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-indigo-400">
                                Day {lesson.day}
                              </span>
                              <span className="rounded bg-indigo-950/60 border border-indigo-900/50 px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
                                {lesson.phase}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                              {lesson.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {lesson.practiceLink && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-indigo-300">
                              <Code2 className="h-3.5 w-3.5" />
                              <span>Code Task</span>
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* LESSON ACCORDION BODY */}
                      {isExpanded && (
                        <div className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6 border-t border-indigo-950/80 space-y-4 text-xs text-slate-300">
                          {/* CONCEPT SUMMARY */}
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                              Concept Breakdown:
                            </span>
                            <p className="text-slate-200 leading-relaxed bg-[#060914] p-3 rounded-xl border border-indigo-950">
                              {lesson.conceptSummary}
                            </p>
                          </div>

                          {/* KEY TOPICS */}
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                              Key Topics to Master:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {lesson.keyTopics.map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-md bg-indigo-950/50 border border-indigo-900/40 px-2 py-0.5 text-[10px] font-mono text-indigo-300"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* HANDS-ON TASK */}
                          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-amber-300">
                              <Target className="h-4 w-4 text-amber-400" />
                              <span>Today&apos;s Hands-On Engineering Assignment:</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{lesson.handsOnTask}</p>
                          </div>

                          {/* INTERVIEW QUESTION & MODEL ANSWER */}
                          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Real Technical Interview Question:</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowAnswerDay(isAnswerVisible ? null : lesson.day)}
                                className="text-[11px] font-mono font-bold text-indigo-400 hover:text-indigo-300 underline"
                              >
                                {isAnswerVisible ? "Hide Model Answer" : "Reveal Model Answer →"}
                              </button>
                            </div>
                            <p className="text-slate-200 font-medium italic">{lesson.interviewQuestion}</p>

                            {isAnswerVisible && (
                              <div className="mt-2 pt-2 border-t border-indigo-950/80 text-slate-300 leading-relaxed bg-[#060914] p-3 rounded-lg border border-indigo-900/30">
                                <span className="font-bold text-emerald-400 block mb-1">
                                  FAANG Principal Evaluator Answer:
                                </span>
                                {lesson.modelAnswer}
                              </div>
                            )}
                          </div>

                          {/* BOTTOM ACTIONS */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            {lesson.practiceLink && (
                              <a
                                href={lesson.practiceLink.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 font-bold shadow-md shadow-indigo-600/20 transition-colors"
                              >
                                <Code2 className="h-3.5 w-3.5" />
                                <span>Practice: {lesson.practiceLink.title}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleDayCompletion(selectedCourse.id, lesson.day)}
                              className={`ml-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 font-bold transition-all ${
                                isCompleted
                                  ? "bg-emerald-600 text-white"
                                  : "border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>{isCompleted ? "Completed (+120 XP)" : "Mark Day Complete"}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          {/* 3. TARGET ANY JOB: AI SYLLABUS BUILDER */}
          <section id="ai-generator" className="max-w-3xl mx-auto space-y-6 pt-4">
            <div className="rounded-3xl border border-indigo-950/80 bg-[#090d20] p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="space-y-2 border-b border-indigo-950 pb-5">
                <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Instant AI Study Plan Generator</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-mono">
                  Target Any Job: Custom 30-Day Syllabus
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter any target role and company (e.g. <em>&quot;Backend Engineer at Razorpay&quot;</em>, <em>&quot;AI Systems at Google&quot;</em>, or <em>&quot;Fullstack at Swiggy&quot;</em>). StudyNest AI generates a structured 30-day daily workout with assignments and mock questions.
                </p>
              </div>

              <form onSubmit={handleGenerateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
                    Target Job Role or Specialization *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Systems Engineer, PyTorch AI Specialist, React Fullstack..."
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full rounded-xl border border-indigo-950 bg-[#060914] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
                    Target Company (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Razorpay, Amazon, Swiggy, Uber..."
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="w-full rounded-xl border border-indigo-950 bg-[#060914] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isGenerating || !customRole.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs gap-2 shadow-lg shadow-indigo-600/30"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Synthesizing 30-Day Daily Curriculum...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate 30-Day Plan Free</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </section>

          {/* STUDY PRO SCHOLAR MONETIZATION CARD */}
          <div className="mt-12 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-indigo-950/60 to-purple-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-mono font-bold text-amber-300">
                  <Crown className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  StudyNest Pro Scholar Pass
                </div>
                <h3 className="text-2xl font-black text-white">
                  Get Cryptographically Verified Diplomas &amp; AI Copilot
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Unlock official course graduation certificates for your LinkedIn &amp; resume, advanced AI syllabus generators, downloadable systems architecture kits, and 1-on-1 mock STAR interviews.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <Button
                  onClick={() => setProModalOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 gap-2 h-auto"
                >
                  <Crown className="h-4 w-4 fill-slate-950" />
                  <span>Activate Pro Pass &bull; From ₹199/mo &rarr;</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StudyFooter />

      {/* Gamification Modal */}
      <StudyGamificationModal
        isOpen={gamificationModalOpen}
        onClose={() => setGamificationModalOpen(false)}
        streak={streakCount}
        xp={studyXp}
        initialTab={gamificationTab}
      />

      {/* Pro Modal */}
      <StudyProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
      />
    </div>
  );
}
