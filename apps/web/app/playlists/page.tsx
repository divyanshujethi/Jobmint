"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Youtube,
  Github,
  Clock,
  ExternalLink,
  Search,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Code2,
  X,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Layers,
  ListVideo,
  FileText,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CURATED_COURSES, CoursePlaylist, getCourseChapters, VideoChapter } from "@/lib/courses-data";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

export default function PlaylistsPage() {
  const [courses, setCourses] = useState<CoursePlaylist[]>(CURATED_COURSES);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalCourse, setActiveModalCourse] = useState<CoursePlaylist | null>(null);
  const [activeTimestampSec, setActiveTimestampSec] = useState<number | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Bookmarks & Completed trackers with localStorage persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [collectionFilter, setCollectionFilter] = useState<"ALL" | "BOOKMARKED" | "COMPLETED">("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [collectionFilter, selectedCategory, searchQuery]);

  useEffect(() => {
    async function loadDynamicPlaylists() {
      try {
        const res = await fetch("/api/playlists");
        const data = await res.json();
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      } catch {
        // Keep initial CURATED_COURSES fallback
      }
    }
    loadDynamicPlaylists();
  }, []);

  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("rolenest_playlist_bookmarks");
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks));

      const savedCompleted = localStorage.getItem("rolenest_playlist_completed");
      if (savedCompleted) setCompletedIds(JSON.parse(savedCompleted));
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem("rolenest_playlist_bookmarks", JSON.stringify(updated));
    } catch {}
  };

  const toggleCompleted = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = completedIds.includes(id)
      ? completedIds.filter((item) => item !== id)
      : [...completedIds, id];
    setCompletedIds(updated);
    try {
      localStorage.setItem("rolenest_playlist_completed", JSON.stringify(updated));
    } catch {}
  };

  const filtered = courses.filter((course) => {
    // Collection Filter (All, Bookmarked, Completed)
    if (collectionFilter === "BOOKMARKED" && !bookmarkedIds.includes(course.id)) {
      return false;
    }
    if (collectionFilter === "COMPLETED" && !completedIds.includes(course.id)) {
      return false;
    }

    // Category Filter
    if (selectedCategory !== "ALL" && course.category !== selectedCategory) {
      return false;
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        course.creator.toLowerCase().includes(q) ||
        course.subcategory.toLowerCase().includes(q) ||
        course.skillsLearned.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const categories = [
    { id: "ALL", label: `All Playlists (${courses.length})`, color: "bg-slate-900 text-white" },
    { id: "AI_ML", label: "🤖 AI & GenAI", color: "bg-emerald-600 text-white" },
    { id: "WEB_DEV", label: "💻 Full Stack", color: "bg-teal-600 text-white" },
    { id: "DSA", label: "⚡ DSA & Coding", color: "bg-purple-600 text-white" },
    { id: "SYSTEM_DESIGN", label: "🏗️ System Design", color: "bg-blue-600 text-white" },
    { id: "DEVOPS_CLOUD", label: "☁️ Cloud & DevOps", color: "bg-cyan-600 text-white" },
    { id: "CYBERSECURITY", label: "🛡️ Cybersecurity", color: "bg-rose-600 text-white" },
    { id: "PYTHON_DATA", label: "🐍 Python & Data", color: "bg-amber-600 text-white" },
  ];

  const handleOpenModal = (course: CoursePlaylist) => {
    setActiveModalCourse(course);
    setActiveTimestampSec(null);
    setActiveChapterIndex(0);
  };

  const currentChapters: VideoChapter[] = activeModalCourse ? getCourseChapters(activeModalCourse) : [];

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* HEADER */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3.5 py-1 text-xs font-mono font-semibold text-red-400">
              <Youtube className="h-4 w-4 text-red-500" />
              Curated Free Developer Video Hub &amp; Certifications
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Top Computer Science &amp; Dev Playlists
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
              High-signal developer masterclasses from elite creators (Striver, Andrej Karpathy, Chai aur Code, ByteByteGo, Hussein Nasser, Kunal Kushwaha). Track progress, bookmark modules, jump across timestamped notes, and claim official certificates.
            </p>

            {/* DEDICATED CALLOUT TO INTERACTIVE COURSES & PROBLEMS */}
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-900/50 p-4 text-xs sm:text-sm text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2.5 text-left">
                <Award className="h-6 w-6 text-indigo-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Earn Verifiable Credentials On Every Playlist</span>
                  <p className="text-[11px] text-slate-400">
                    Every video series is mapped to a 30-question benchmark exam and a proof-of-work project to earn a cryptographically verifiable diploma.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/courses">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    All Certification Exams →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* COLLECTION FILTER TABS (ALL / BOOKMARKED / COMPLETED) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1020] p-3 rounded-2xl border border-indigo-950/80 shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollectionFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  collectionFilter === "ALL"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <ListVideo className="h-3.5 w-3.5" />
                <span>All Courses ({courses.length})</span>
              </button>

              <button
                onClick={() => setCollectionFilter("BOOKMARKED")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  collectionFilter === "BOOKMARKED"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Bookmarked ({bookmarkedIds.length})</span>
              </button>

              <button
                onClick={() => setCollectionFilter("COMPLETED")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  collectionFilter === "COMPLETED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completed ({completedIds.length})</span>
              </button>
            </div>

            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Filter tech, creator, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-900 border-indigo-950/80 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl shadow-none focus-visible:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* CATEGORY SWITCHER PILLS */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.color} shadow-sm`
                    : "text-slate-400 hover:text-white bg-slate-900/80 border border-indigo-950/70 hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* PLAYLISTS GRID */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-[#0c1020] rounded-2xl border border-indigo-950/80 space-y-3">
              <Bookmark className="h-10 w-10 text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-200">No playlists found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {collectionFilter === "BOOKMARKED"
                  ? "You haven't bookmarked any playlists yet. Click the bookmark icon on any playlist card to save it for later."
                  : collectionFilter === "COMPLETED"
                  ? "You haven't marked any playlist as completed yet. Complete courses to build your portfolio."
                  : "No playlists match your search query."}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCollectionFilter("ALL");
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                }}
                className="rounded-xl text-xs border-indigo-950 text-indigo-300 hover:bg-slate-800"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedCourses.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                const isCompleted = completedIds.includes(item.id);

                return (
                  <Card
                    key={item.id}
                    className={`border-indigo-950/70 bg-[#0c1020] text-slate-200 flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:shadow-xl shadow-md relative ${
                      isCompleted ? "border-emerald-500/50 bg-emerald-950/10" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="rounded bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                              {item.subcategory}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400 font-medium">{item.difficulty}</span>

                            {isCompleted && (
                              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed (+50 XP)
                              </span>
                            )}
                          </div>

                          <CardTitle className="text-lg font-bold text-white leading-snug">
                            {item.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                            <span className="font-semibold text-slate-300">{item.creator}</span>
                            <span>({item.creatorSubscribers} Subscribers)</span>
                          </div>
                        </div>

                        {/* CARD QUICK ACTIONS (BOOKMARK, COMPLETE, EXTERNAL) */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => toggleBookmark(item.id, e)}
                            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                              isBookmarked
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                : "bg-slate-900 text-slate-400 border-indigo-950/80 hover:text-white hover:bg-slate-800"
                            }`}
                          >
                            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={(e) => toggleCompleted(item.id, e)}
                            title={isCompleted ? "Mark Incomplete" : "Mark as Finished"}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-slate-900 text-slate-400 border-indigo-950/80 hover:text-emerald-400 hover:bg-slate-800"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>

                          <a
                            href={item.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all shadow-xs"
                            title="Open on YouTube"
                          >
                            <Youtube className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-1">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>

                      {/* METRICS */}
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900/60 border border-indigo-950/80 p-2.5 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Duration: <strong className="text-slate-200">{item.duration}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Play className="h-3.5 w-3.5 text-red-400" />
                          <span>{item.totalVideos} Full Episodes</span>
                        </div>
                      </div>

                      {/* SKILLS */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
                          Core Concepts Taught
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.skillsLearned.map((sk) => (
                            <span
                              key={sk}
                              className="rounded bg-slate-900 border border-indigo-950 px-2 py-0.5 text-[11px] font-medium text-indigo-300"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* RECOMMENDED GITHUB REPOS */}
                      {item.recommendedGithubRepos && item.recommendedGithubRepos.length > 0 && (
                        <div className="rounded-xl border border-indigo-950/80 bg-slate-900/40 p-3 space-y-2">
                          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                            <Github className="h-3.5 w-3.5 text-slate-300" />
                            Companion GitHub Libraries
                          </div>
                          <div className="space-y-2">
                            {item.recommendedGithubRepos.map((repo) => (
                              <div
                                key={repo.name}
                                className="flex items-start justify-between gap-2 text-xs border-t border-indigo-950 pt-1.5 first:border-0 first:pt-0"
                              >
                                <div>
                                  <a
                                    href={repo.repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-mono font-bold text-indigo-400 hover:underline flex items-center gap-1"
                                  >
                                    {repo.name}
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {repo.description}
                                  </p>
                                </div>
                                <span className="font-mono text-[10px] text-amber-400 font-semibold shrink-0">
                                  ★ {repo.stars}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 1-CLICK DEDICATED CERTIFICATE CTA BUTTON */}
                      <Link href={`/courses/${item.id}/certificate`} className="block">
                        <div className="group rounded-xl p-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-between shadow-md hover:shadow-indigo-500/20 transition-all">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                              <Award className="h-4 w-4 text-amber-300" />
                            </div>
                            <div>
                              <span className="font-bold text-xs leading-none block">
                                Test Your Knowledge On This Video &amp; Earn Certificate
                              </span>
                              <span className="text-[10px] text-indigo-200 block mt-0.5">
                                30-Question Assessment &amp; Proof-of-Work Verification
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>

                      {/* BOTTOM ACTIONS */}
                      <div className="pt-2 border-t border-indigo-950/80 flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenModal(item)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Watch With Timestamp Notes</span>
                        </Button>

                        {item.relatedProblemCategory && (
                          <Link href={`/problems?category=${encodeURIComponent(item.relatedProblemCategory)}`} className="shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-indigo-950 text-indigo-400 hover:bg-slate-800 text-xs px-2.5 rounded-xl"
                              title={`Solve ${item.relatedProblemCategory} Problems`}
                            >
                              <Code2 className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-indigo-950/80 bg-[#0c1020]/60 p-4 rounded-2xl border border-indigo-950/60">
                  <div className="text-xs text-slate-400">
                    Showing <span className="font-bold text-white">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{" "}
                    <span className="font-bold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of{" "}
                    <span className="font-bold text-white">{filtered.length}</span> masterclasses
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 350, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="border-indigo-950 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 text-xs gap-1 rounded-xl"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          const isCurrent = page === currentPage;
                          return (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 350, behavior: "smooth" });
                              }}
                              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                isCurrent
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400"
                                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-indigo-950/60"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-1 text-slate-500 text-xs font-mono">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 350, behavior: "smooth" });
                      }}
                      disabled={currentPage === totalPages}
                      className="border-indigo-950 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 text-xs gap-1 rounded-xl"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* EMBEDDED VIDEO PLAYER MODAL WITH SYNCHRONIZED TIMESTAMP CHAPTERS */}
      {activeModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 text-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Play className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white leading-tight">
                    {activeModalCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Curated by <span className="text-emerald-400 font-semibold">{activeModalCourse.creator}</span> • {activeModalCourse.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeModalCourse.id)}
                  title="Bookmark"
                  className={`p-2 rounded-lg border transition-colors ${
                    bookmarkedIds.includes(activeModalCourse.id)
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </button>

                <button
                  onClick={() => toggleCompleted(activeModalCourse.id)}
                  title="Mark Completed"
                  className={`p-2 rounded-lg border transition-colors ${
                    completedIds.includes(activeModalCourse.id)
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setActiveModalCourse(null)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* MODAL MAIN CONTENT (SPLIT: VIDEO ON LEFT/TOP, CHAPTERS ON RIGHT/BOTTOM) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
              
              {/* VIDEO PLAYER (OFFICIAL YOUTUBE EMBED) */}
              <div className="lg:col-span-2 flex flex-col bg-black">
                <div className="relative w-full aspect-video bg-black">
                  {activeModalCourse.embedPlaylistId ? (
                    <iframe
                      key={`embed-${activeTimestampSec ?? 0}`}
                      src={`https://www.youtube-nocookie.com/embed/videoseries?list=${activeModalCourse.embedPlaylistId}&modestbranding=1&rel=0${
                        activeTimestampSec !== null ? `&start=${activeTimestampSec}&autoplay=1` : ""
                      }`}
                      title={activeModalCourse.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <iframe
                      key={`embed-${activeTimestampSec ?? 0}`}
                      src={`${activeModalCourse.youtubeUrl.replace("watch?v=", "embed/")}${
                        activeTimestampSec !== null ? `?start=${activeTimestampSec}&autoplay=1` : ""
                      }`}
                      title={activeModalCourse.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>

                {/* VIDEO STATUS BANNER */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span className="truncate">Official Embed (Creator receives 100% views &amp; monetization)</span>
                  </div>
                  <a
                    href={activeModalCourse.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold shrink-0"
                  >
                    <Youtube className="h-3.5 w-3.5" />
                    Open in YouTube
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* SYNCHRONIZED CHAPTERS & NOTES PANEL */}
              <div className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 flex flex-col h-full max-h-[420px] lg:max-h-none overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-xs text-slate-200">Synchronized Chapters &amp; Notes</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {currentChapters.length} Chapters
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {currentChapters.map((chap, idx) => {
                    const isActive = activeChapterIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveChapterIndex(idx);
                          setActiveTimestampSec(chap.seconds);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                          isActive
                            ? "bg-emerald-950/40 border-emerald-500/60 text-white shadow-xs"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-xs leading-snug line-clamp-1">
                            {idx + 1}. {chap.title}
                          </span>
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                              isActive
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {chap.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                          {chap.notes}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* MODAL BOTTOM PROMO & CERTIFICATE LINK */}
                <div className="p-3 border-t border-slate-800 bg-slate-900 space-y-2">
                  <Link href={`/courses/${activeModalCourse.id}/certificate`} className="block">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md py-2.5 h-auto"
                    >
                      <Award className="h-4 w-4 text-amber-200" />
                      <span>Take 30-Question Assessment &amp; Claim Certificate →</span>
                    </Button>
                  </Link>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Link href="/problems" className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs rounded-xl"
                      >
                        <Code2 className="h-3.5 w-3.5 mr-1" />
                        Code Editor
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveModalCourse(null)}
                      className="text-slate-400 hover:text-white text-xs rounded-xl"
                    >
                      Close
                    </Button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      <StudyFooter />
    </div>
  );
}
