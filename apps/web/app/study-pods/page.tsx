"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  Lock,
} from "lucide-react";
import { MOCK_STUDY_PODS } from "@/lib/mock-pods";
import { Button } from "@/components/ui/button";

export default function StudyPodsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedPods, setJoinedPods] = useState<Record<string, boolean>>({});
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSessionUser(data.user);
        }
      })
      .catch(() => {});

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

  const handleJoinPod = (podId: string, podSlug: string) => {
    if (!sessionUser) {
      router.push(`/login?callbackUrl=/study-pods/${podSlug}`);
      return;
    }

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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">JobMint</Link>
              <span>/</span>
              <span className="text-slate-200">Study Pods</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-400" />
              Peer Study Pods &amp; Mock Interviews
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Join focused cohorts of genuine engineering students learning curated free roadmaps and practicing real STAR technical interviews together.
            </p>
          </div>

          <Link
            href="/roadmaps"
            className="flex items-center gap-2 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Roadmaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Guest Mode Notice */}
        {!sessionUser && (
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">Guest Preview Mode: </span>
                You can browse cohort roadmaps and interview questions. Sign in with GitHub or Google to join a pod, chat with peers, and access the JobMint Cohort Bot.
              </div>
            </div>
            <Link href="/login?callbackUrl=/study-pods" className="shrink-0">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs">
                Sign In to Join
              </Button>
            </Link>
          </div>
        )}

        {/* Informational Banner */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">100% Free Peer Learning • Zero Fake Profiles: </span>
            No paid cohort fees. Connect with real campus peers and practice turn-based technical mock interviews moderated by the JobMint Cohort Bot.
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
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat === "ALL" ? "All Cohorts" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by skill or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPods.map((pod) => {
            const isJoined = !!joinedPods[pod.id];
            const displayMemberCount = (isJoined ? 1 : 0) + 1; // You (if joined) + AI Cohort Bot

            return (
              <div
                key={pod.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800 font-semibold">
                          {pod.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Stack: {pod.primarySkill}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{pod.title}</h3>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-xs text-slate-400">
                        {displayMemberCount} / {pod.maxMembers}
                      </div>
                      <span className="text-[10px] text-emerald-400">
                        {pod.maxMembers - displayMemberCount} seats open
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pod.description}
                  </p>

                  {/* Current Phase Milestone */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Current Milestone:</span>
                      <span className="text-emerald-400 font-bold">Phase {pod.currentPhaseNumber}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{pod.phaseTitle}</p>
                  </div>

                  {/* Meeting Cadence */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pod.meetingCadence}</span>
                  </div>

                  {/* Cohort Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                        🤖
                      </div>
                      <div className="text-[11px] font-mono text-slate-300">
                        JobMint Cohort Bot <span className="text-emerald-400 font-semibold">(Active)</span>
                      </div>
                    </div>
                    {isJoined && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                        You are enrolled
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <button
                    onClick={() => handleJoinPod(pod.id, pod.slug)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isJoined
                        ? "bg-slate-800 text-slate-300 border border-slate-700"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Joined Pod (Leave)</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>{sessionUser ? "Join Study Pod" : "Sign In to Join"}</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/study-pods/${pod.slug}`}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1"
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
