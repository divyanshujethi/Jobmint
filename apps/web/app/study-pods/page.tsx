"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Check,
} from "lucide-react";
import { MOCK_STUDY_PODS, StudyPod } from "@/lib/mock-pods";

export default function StudyPodsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedPods, setJoinedPods] = useState<Record<string, boolean>>({ "pod-1": true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobmint_joined_pods");
      if (saved) {
        setJoinedPods(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const categories = ["ALL", "AI & ML", "Web Development", "Data Science", "Mobile"];

  const filteredPods = MOCK_STUDY_PODS.filter((pod) => {
    if (selectedCategory !== "ALL" && pod.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = pod.title.toLowerCase().includes(q);
      const matchSkill = pod.primarySkill.toLowerCase().includes(q);
      const matchDesc = pod.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSkill && !matchDesc) return false;
    }
    return true;
  });

  const toggleJoinPod = (podId: string) => {
    setJoinedPods((prev) => {
      const updated = {
        ...prev,
        [podId]: !prev[podId],
      };
      try {
        localStorage.setItem("jobmint_joined_pods", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">JobMint</Link>
              <span>/</span>
              <span className="text-neutral-200">Study Pods</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-400" />
              Peer Study Pods & Mock Interviews
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Join small cohorts of students (4-8 members) learning the same free roadmaps and practicing real STAR technical interviews together.
            </p>
          </div>

          <Link
            href="/roadmaps"
            className="flex items-center gap-2 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Roadmaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Informational Banner */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">100% Free Peer Learning: </span>
            No paid cohort fees. Students connect, share progress along curated open-source roadmaps, and conduct turn-based technical mock interviews.
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-neutral-950 font-bold"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {cat === "ALL" ? "All Cohorts" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by skill or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPods.map((pod) => {
            const isJoined = !!joinedPods[pod.id];
            const capacityRatio = Math.round((pod.memberCount / pod.maxMembers) * 100);

            return (
              <div
                key={pod.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-neutral-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-950 text-emerald-400 border border-neutral-800 font-semibold">
                          {pod.category}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          Stack: {pod.primarySkill}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{pod.title}</h3>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-xs text-neutral-400">
                        {pod.memberCount} / {pod.maxMembers}
                      </div>
                      <span className="text-[10px] text-emerald-400">
                        {pod.maxMembers - pod.memberCount} seats left
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {pod.description}
                  </p>

                  {/* Current Phase Milestone */}
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">Current Milestone:</span>
                      <span className="text-emerald-400 font-bold">Phase {pod.currentPhaseNumber}</span>
                    </div>
                    <p className="text-xs text-neutral-200 font-medium">{pod.phaseTitle}</p>
                  </div>

                  {/* Meeting Cadence */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pod.meetingCadence}</span>
                  </div>

                  {/* Member Avatars */}
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                    <div className="flex -space-x-2 overflow-hidden">
                      {pod.activeMembers.slice(0, 5).map((m) => (
                        <div
                          key={m.id}
                          className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-[10px] font-bold text-white font-mono"
                          title={`${m.name} (${m.college})`}
                        >
                          {m.avatarInitial}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {pod.activeMembers.length} active students
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
                  <button
                    onClick={() => toggleJoinPod(pod.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isJoined
                        ? "bg-neutral-800 text-neutral-300 border border-neutral-700"
                        : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Joined Pod (Active Member)</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Join Study Pod</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/study-pods/${pod.slug}`}
                    className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-xs font-semibold text-neutral-200 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Open Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}