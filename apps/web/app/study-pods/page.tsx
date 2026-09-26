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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-600 transition-colors">Role Nest</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Study Pods</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Users className="w-6 h-6" />
              </div>
              Peer Study Pods &amp; Mock Interviews
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Join focused cohorts of genuine engineering students learning curated free roadmaps and practicing real STAR technical interviews together.
            </p>
          </div>

          <Link
            href="/roadmaps"
            className="flex items-center gap-2 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl transition-all shadow-xs self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>View Roadmaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Guest Mode Notice */}
        {!sessionUser && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-amber-900">Guest Preview Mode: </span>
                You can browse cohort roadmaps and interview questions. Sign in with GitHub or Google to join a pod, chat with peers, and access the Role Nest Cohort Bot.
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
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-900 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-900">100% Free Peer Learning • Zero Paywalls: </span>
            No paid cohort fees. Connect with real campus peers and practice turn-based technical mock interviews moderated by the Role Nest Cohort Bot.
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {cat === "ALL" ? "All Cohorts" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by skill or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
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
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {pod.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Stack: {pod.primarySkill}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{pod.title}</h3>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-xs font-semibold text-slate-600">
                        {displayMemberCount} / {pod.maxMembers}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {pod.maxMembers - displayMemberCount} seats open
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pod.description}
                  </p>

                  {/* Current Phase Milestone */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 font-semibold">Current Milestone:</span>
                      <span className="text-emerald-700 font-bold">Phase {pod.currentPhaseNumber}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold">{pod.phaseTitle}</p>
                  </div>

                  {/* Meeting Cadence */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{pod.meetingCadence}</span>
                  </div>

                  {/* Cohort Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                        🤖
                      </div>
                      <div className="text-[11px] font-mono text-slate-600">
                        Role Nest Cohort Bot <span className="text-emerald-700 font-semibold">(Active)</span>
                      </div>
                    </div>
                    {isJoined && (
                      <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        You are enrolled
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => handleJoinPod(pod.id, pod.slug)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      isJoined
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
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
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 shadow-xs"
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
