"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users,
  Calendar,
  ArrowLeft,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Video,
  Send,
  Lock,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  Award,
  Plus,
  Compass,
} from "lucide-react";
import { MOCK_STUDY_PODS, PodMember, PodInterviewQuestion } from "@/lib/mock-pods";
import { Button } from "@/components/ui/button";
import { StudyNavbar } from "@/components/study-navbar";
import { StudyFooter } from "@/components/study-footer";

interface PodMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  avatar: string;
}

interface PeerStandup {
  id: string;
  author: string;
  avatar: string;
  college: string;
  timeAgo: string;
  completed: string;
  nextUp: string;
  blockers?: string;
}

export default function StudyPodDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const pod = MOCK_STUDY_PODS.find((p) => p.slug === slug || p.id === slug) || MOCK_STUDY_PODS[0];

  const [activeTab, setActiveTab] = useState<"INTERVIEW" | "STANDUPS" | "CHAT" | "MEMBERS">("INTERVIEW");
  const [completedQuestions, setCompletedQuestions] = useState<Record<number, boolean>>({});
  const [expandedBlueprints, setExpandedBlueprints] = useState<Record<number, boolean>>({ 0: true });
  const [personalNotes, setPersonalNotes] = useState<Record<number, string>>({});
  const [savingNoteIdx, setSavingNoteIdx] = useState<number | null>(null);

  // Pomodoro Focus Timer State
  const [timerMode, setTimerMode] = useState<"FOCUS" | "SHORT" | "LONG">("FOCUS");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [focusSprintsCompleted, setFocusSprintsCompleted] = useState<number>(2);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Standups State
  const [standups, setStandups] = useState<PeerStandup[]>([]);
  const [myCompletedInput, setMyCompletedInput] = useState("");
  const [myNextInput, setMyNextInput] = useState("");
  const [myBlockersInput, setMyBlockersInput] = useState("");
  const [isSubmittingStandup, setIsSubmittingStandup] = useState(false);
  const [hasSubmittedStandupToday, setHasSubmittedStandupToday] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<PodMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);

  // Toast / XP notification
  const [xpToast, setXpToast] = useState<string | null>(null);

  const showXp = (msg: string) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 3500);
  };

  // Timer Effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            if (timerMode === "FOCUS") {
              setFocusSprintsCompleted((c) => c + 1);
              showXp("🎉 Focus Sprint Finished! +25 XP Earned");
              return 5 * 60; // Switch to short break
            }
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerMode]);

  const switchTimerMode = (mode: "FOCUS" | "SHORT" | "LONG") => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === "FOCUS") setTimeLeft(25 * 60);
    if (mode === "SHORT") setTimeLeft(5 * 60);
    if (mode === "LONG") setTimeLeft(15 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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
      const savedJoined = localStorage.getItem("jobmint_joined_pods");
      if (savedJoined) {
        const parsed = JSON.parse(savedJoined);
        if (parsed[pod.id] || parsed[pod.slug]) {
          setIsJoined(true);
        }
      }

      const savedProgress = localStorage.getItem(`jobmint_pod_progress_${pod.slug}`);
      if (savedProgress) {
        setCompletedQuestions(JSON.parse(savedProgress));
      }

      const savedNotes = localStorage.getItem(`jobmint_pod_notes_${pod.slug}`);
      if (savedNotes) {
        setPersonalNotes(JSON.parse(savedNotes));
      }

      const savedStandups = localStorage.getItem(`jobmint_pod_standups_${pod.slug}`);
      if (savedStandups) {
        setStandups(JSON.parse(savedStandups));
      } else {
        // Initialize with realistic student peer standups
        const peers = (pod.activeMembers || []).filter((m) => !m.isBot);
        const defaults: PeerStandup[] = [
          {
            id: "std-1",
            author: peers[0]?.name || "Aarav Sharma",
            avatar: peers[0]?.avatarInitial || "A",
            college: peers[0]?.college || "IIT Delhi",
            timeAgo: "2 hours ago",
            completed: `Completed hands-on milestone for ${pod.phaseTitle}. Benchmarked latency against test dataset.`,
            nextUp: `Reviewing STAR questions and preparing code solution for tomorrow's peer mock session.`,
            blockers: "None right now, clear path forward.",
          },
          {
            id: "std-2",
            author: peers[1]?.name || "Priya Nair",
            avatar: peers[1]?.avatarInitial || "P",
            college: peers[1]?.college || "BITS Pilani",
            timeAgo: "4 hours ago",
            completed: `Tackled daily challenge: "${pod.dailyChallenge || 'System verification and integration'}".`,
            nextUp: `Refactoring modular components and deploying Docker container locally.`,
            blockers: "Resolving minor memory footprint overhead under concurrent stress test.",
          },
        ];
        setStandups(defaults);
      }
    } catch {}

    fetch(`/api/study-pods/${pod.slug}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error("Error loading pod messages:", err));
  }, [pod.id, pod.slug, pod.phaseTitle, pod.dailyChallenge, pod.activeMembers]);

  const toggleQuestion = (idx: number) => {
    setCompletedQuestions((prev) => {
      const next = !prev[idx];
      const updated = {
        ...prev,
        [idx]: next,
      };
      try {
        localStorage.setItem(`jobmint_pod_progress_${pod.slug}`, JSON.stringify(updated));
      } catch {}
      if (next) {
        showXp("🎯 Question Practiced! +20 DevScore XP");
      }
      return updated;
    });
  };

  const handleSaveNote = (idx: number, text: string) => {
    setPersonalNotes((prev) => {
      const updated = { ...prev, [idx]: text };
      try {
        localStorage.setItem(`jobmint_pod_notes_${pod.slug}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSavingNoteIdx(idx);
    setTimeout(() => setSavingNoteIdx(null), 1200);
  };

  const toggleBlueprint = (idx: number) => {
    setExpandedBlueprints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || sendingMessage) return;

    const optimisticMsg: PodMessage = {
      id: Date.now().toString(),
      sender: sessionUser?.name || "You",
      role: "Cohort Peer",
      text: newMessageText.trim(),
      timestamp: "Just now",
      avatar: (sessionUser?.name?.[0] || "U").toUpperCase(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const toSend = newMessageText;
    setNewMessageText("");
    setSendingMessage(true);

    try {
      const res = await fetch(`/api/study-pods/${pod.slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: toSend }),
      });
      const data = await res.json();
      if (data.botReply) {
        setMessages((prev) => [...prev, data.botReply]);
      }
    } catch (err) {
      console.error("Failed to post pod message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSubmitStandup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myCompletedInput.trim()) return;

    setIsSubmittingStandup(true);
    const newEntry: PeerStandup = {
      id: `std-user-${Date.now()}`,
      author: sessionUser?.name || "Candidate (You)",
      avatar: (sessionUser?.name?.[0] || "Y").toUpperCase(),
      college: "RoleNest Verified Candidate",
      timeAgo: "Just now",
      completed: myCompletedInput.trim(),
      nextUp: myNextInput.trim() || "Continuing next phase sprint.",
      blockers: myBlockersInput.trim() || "No blockers.",
    };

    const updated = [newEntry, ...standups];
    setStandups(updated);
    try {
      localStorage.setItem(`jobmint_pod_standups_${pod.slug}`, JSON.stringify(updated));
    } catch {}

    setMyCompletedInput("");
    setMyNextInput("");
    setMyBlockersInput("");
    setIsSubmittingStandup(false);
    setHasSubmittedStandupToday(true);
    showXp("🚀 Standup Published! +25 Cohort XP");
  };

  const completedCount = Object.values(completedQuestions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (pod.mockQuestions?.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <StudyNavbar />

      {/* Floating XP Notification Toast */}
      {xpToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{xpToast}</span>
        </div>
      )}

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Breadcrumb & Navigation Header */}
          <div className="space-y-4">
            <Link
              href="/study-pods"
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Study Pods
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/80 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1.5 font-semibold">
                  <span className="bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/30 text-indigo-300">
                    {pod.category}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">
                    Core Stack: <span className="text-slate-200 font-bold">{pod.primarySkill}</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  {pod.title}
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                  {pod.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Video className="w-4 h-4" />
                  <span>Instant Peer Meet (Free)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Pod Status, Milestone & Pomodoro Timer Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Milestone Banner */}
            <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">Active Milestone</span>
                </div>
                <Link
                  href={`/roadmaps/${pod.roadmapSlug}`}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold font-mono transition-colors"
                >
                  Roadmap →
                </Link>
              </div>
              <div className="mt-2">
                <div className="text-xs text-indigo-400 font-bold font-mono">Phase {pod.currentPhaseNumber}</div>
                <p className="text-sm font-bold text-white leading-tight mt-0.5">{pod.phaseTitle}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-950/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">{pod.meetingCadence}</span>
              </div>
            </div>

            {/* 2. Today's Focus & Challenge */}
            <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Today&apos;s Cohort Mission</span>
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="text-xs text-slate-200 font-semibold line-clamp-2">
                  🎯 {pod.dailyTopic || "Mastering core architectural primitives"}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  ⚡ {pod.dailyChallenge || "Implement and benchmark hands-on proof"}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-950/80 text-[11px] text-emerald-400 font-mono font-bold flex items-center justify-between">
                <span>Verification: In Progress</span>
                <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Active</span>
              </div>
            </div>

            {/* 3. Live Pomodoro Focus Timer */}
            <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Timer className="w-4 h-4 text-rose-400" />
                  <span>Cohort Focus Room</span>
                </div>
                <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                  {focusSprintsCompleted} Sprints Done
                </span>
              </div>

              <div className="my-2 flex items-center justify-between">
                <div className="text-3xl font-mono font-black text-white tracking-wider">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                      isTimerRunning
                        ? "bg-amber-600 hover:bg-amber-500 text-white"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? "Pause" : "Focus"}</span>
                  </button>
                  <button
                    onClick={() => switchTimerMode(timerMode)}
                    title="Reset Timer"
                    className="h-9 w-9 bg-slate-900 border border-indigo-950 hover:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 pt-2 border-t border-indigo-950/80 text-[10px] font-mono">
                <button
                  onClick={() => switchTimerMode("FOCUS")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    timerMode === "FOCUS" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  25m Sprint
                </button>
                <button
                  onClick={() => switchTimerMode("SHORT")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    timerMode === "SHORT" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  5m Break
                </button>
                <button
                  onClick={() => switchTimerMode("LONG")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    timerMode === "LONG" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  15m Long
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b border-indigo-950/80 text-xs font-mono gap-1">
            <button
              onClick={() => setActiveTab("INTERVIEW")}
              className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "INTERVIEW"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>STAR Mock Interview Room</span>
              <span className="bg-slate-800/80 border border-indigo-950 px-2 py-0.5 rounded text-[10px] text-slate-300 font-bold">
                {completedCount} / {pod.mockQuestions?.length || 5} Practiced
              </span>
            </button>

            <button
              onClick={() => setActiveTab("STANDUPS")}
              className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "STANDUPS"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cohort Daily Standups</span>
              <span className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] text-amber-400 font-bold">
                {standups.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("CHAT")}
              className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "CHAT"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Peer Chat</span>
              <span className="bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] text-indigo-400 font-bold">
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("MEMBERS")}
              className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "MEMBERS"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Cohort Peer Roster</span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                {(pod.activeMembers?.length || 0) + (isJoined ? 1 : 0)}
              </span>
            </button>
          </div>

          {/* TAB 1: Mock Interview Room */}
          {activeTab === "INTERVIEW" && (
            <div className="space-y-6">
              {/* Readiness Progress Bar */}
              <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Technical Interview Readiness Score:</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}% Ready</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-indigo-950">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                  <span>
                    Pair up with cohort members: Take 10 minutes answering using the STAR format (Situation, Task, Action, Result).
                  </span>
                  <span className="text-indigo-400 font-mono font-bold shrink-0">
                    +20 XP per verified question
                  </span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {(pod.mockQuestions || []).map((q, idx) => {
                  const isChecked = !!completedQuestions[idx];
                  const isBlueprintOpen = !!expandedBlueprints[idx];
                  const currentNote = personalNotes[idx] || "";

                  return (
                    <div
                      key={idx}
                      className={`bg-[#0c1024] border rounded-2xl p-6 transition-all space-y-4 shadow-md ${
                        isChecked
                          ? "border-emerald-500/40 bg-[#0c1024]/90 ring-1 ring-emerald-500/20"
                          : "border-indigo-950/80 hover:border-indigo-500/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded font-bold">
                              STAR Q{idx + 1}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{q.focusArea}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{q.question}</h3>
                        </div>

                        <button
                          onClick={() => toggleQuestion(idx)}
                          className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold transition-all shrink-0 ${
                            isChecked
                              ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20"
                              : "bg-slate-900 text-slate-300 border-indigo-950 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isChecked ? "Practiced! ✓" : "Mark Practiced"}</span>
                        </button>
                      </div>

                      {/* STAR Strategy Tip */}
                      <div className="bg-[#101533]/80 p-4 rounded-xl border border-indigo-950/80 space-y-1 text-xs">
                        <div className="text-amber-400 font-bold flex items-center gap-1.5 font-sans">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          Interviewer Strategy Focus:
                        </div>
                        <p className="text-slate-300 font-mono text-[12px] leading-relaxed">
                          {q.starTip}
                        </p>
                      </div>

                      {/* Expandable STAR Blueprint & Model Answer */}
                      <div className="border border-indigo-950/80 rounded-xl overflow-hidden bg-slate-900/50">
                        <button
                          onClick={() => toggleBlueprint(idx)}
                          className="w-full px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 flex items-center justify-between text-xs font-mono font-bold text-indigo-300 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{isBlueprintOpen ? "Hide Solution Blueprint & STAR Breakdown" : "Reveal Solution Blueprint & STAR Breakdown"}</span>
                          </span>
                          {isBlueprintOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {isBlueprintOpen && (
                          <div className="p-4 space-y-3.5 text-xs border-t border-indigo-950/80 bg-[#090d1f]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="bg-[#0c1024] p-3 rounded-lg border border-indigo-950/80 space-y-1">
                                <span className="text-[10px] uppercase font-mono font-bold text-amber-400">Situation (S)</span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  Encountered in a production {pod.primarySkill} environment handling high volume concurrent operations or distributed model workflows.
                                </p>
                              </div>

                              <div className="bg-[#0c1024] p-3 rounded-lg border border-indigo-950/80 space-y-1">
                                <span className="text-[10px] uppercase font-mono font-bold text-blue-400">Task (T)</span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  Diagnose root cause, isolate latency / memory bottlenecks, and prevent cascading failure under load.
                                </p>
                              </div>

                              <div className="bg-[#0c1024] p-3 rounded-lg border border-indigo-950/80 space-y-1">
                                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">Action (A)</span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  {q.starTip} Applied architectural isolation, structured logging, and verified invariants with automated benchmarks.
                                </p>
                              </div>

                              <div className="bg-[#0c1024] p-3 rounded-lg border border-indigo-950/80 space-y-1">
                                <span className="text-[10px] uppercase font-mono font-bold text-purple-400">Result (R)</span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  Achieved measurable performance gains (30-50% lower compute overhead), deterministic memory footprints, and zero regressions.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Personal Talking Points Notes */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>My Verbal Talking Points / Elevator Pitch:</span>
                          </span>
                          {savingNoteIdx === idx && (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Saved!
                            </span>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Draft your bullet points here before peer practice (auto-saved locally)..."
                          value={currentNote}
                          onChange={(e) => handleSaveNote(idx, e.target.value)}
                          className="w-full bg-slate-900/80 border border-indigo-950 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Cohort Daily Standups */}
          {activeTab === "STANDUPS" && (
            <div className="space-y-6">
              {/* Post Daily Standup Form */}
              <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-6 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-indigo-950/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Post Your Daily Standup Check-in</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    +25 XP Today
                  </span>
                </div>

                <form onSubmit={handleSubmitStandup} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      1. What did you build / study today?
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`e.g. Completed Phase ${pod.currentPhaseNumber} milestone in ${pod.primarySkill}, tested edge cases`}
                      value={myCompletedInput}
                      onChange={(e) => setMyCompletedInput(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        2. What will you tackle next?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Practice STAR mock questions 1-3 with pod"
                        value={myNextInput}
                        onChange={(e) => setMyNextInput(e.target.value)}
                        className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        3. Any blockers / help needed?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Need code review on Docker compose networking"
                        value={myBlockersInput}
                        onChange={(e) => setMyBlockersInput(e.target.value)}
                        className="w-full bg-slate-900 border border-indigo-950 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isSubmittingStandup || !myCompletedInput.trim()}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSubmittingStandup ? "Publishing..." : "Submit Standup & Claim +25 XP"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Standup Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Recent Peer Standups</span>
                  <span>{standups.length} updates logged</span>
                </div>

                {standups.map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs font-mono">
                          {s.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{s.author}</h4>
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                              {s.college}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{s.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-1">
                      <div>
                        <span className="text-emerald-400 font-bold font-mono">✓ Completed: </span>
                        <span className="text-slate-200">{s.completed}</span>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-bold font-mono">⚡ Next Up: </span>
                        <span className="text-slate-300">{s.nextUp}</span>
                      </div>
                      {s.blockers && (
                        <div>
                          <span className="text-amber-400 font-bold font-mono">⚠️ Blockers: </span>
                          <span className="text-slate-400">{s.blockers}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Live Peer Chat Room */}
          {activeTab === "CHAT" && (
            <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-6 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-indigo-950/80 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Cohort Peer Discussion &amp; AI Mentor
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Coordinate live mock interviews and clarify doubts with RoleNest Cohort Bot
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Room
                </span>
              </div>

              {/* Message Stream */}
              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      m.sender.includes("Bot")
                        ? "bg-indigo-950/30 border-indigo-900/60"
                        : "bg-[#101533]/60 border-indigo-950/80"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                        m.sender.includes("Bot")
                          ? "bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 text-sm"
                          : "bg-slate-800 border border-slate-700 text-white"
                      }`}
                    >
                      {m.avatar}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            {m.sender}
                            {m.sender.includes("Bot") && (
                              <span className="rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                                AI Mentor
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({m.role})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              {sessionUser ? (
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-indigo-950/80">
                  <input
                    type="text"
                    placeholder="Ask a technical question, propose a mock interview time, or share code..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-indigo-950 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900/90 shadow-none"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessageText.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingMessage ? "Sending..." : "Send"}</span>
                  </button>
                </form>
              ) : (
                <div className="rounded-xl border border-indigo-950/80 bg-slate-900/60 p-4 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Sign in to participate in discussion and ask the RoleNest Cohort Bot.</span>
                  </div>
                  <Link href={`/login?callbackUrl=/study-pods/${pod.slug}`}>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20">
                      Sign In to Chat
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Cohort Peer Roster */}
          {activeTab === "MEMBERS" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Verified Cohort Members &amp; Mentors</span>
                <span>{(pod.activeMembers?.length || 0) + (isJoined ? 1 : 0)} Enrolled</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AI Coordinator Card */}
                <div className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-4 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
                      🤖
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">RoleNest Cohort Bot</h4>
                        <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-1.5 py-0.2 text-[9px] text-indigo-300 font-mono font-bold">
                          AI Mentor
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-mono truncate font-semibold">Automated Coordinator</p>
                      <p className="text-[11px] text-slate-400 truncate">StudyNest Academy</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Online 24/7
                  </span>
                </div>

                {/* Logged in User Card if Joined */}
                {sessionUser && isJoined && (
                  <div className="bg-[#0c1024] border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between shadow-md ring-1 ring-emerald-500/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-emerald-600 border border-emerald-500 flex items-center justify-center font-bold text-white text-base font-mono shrink-0 uppercase shadow-md shadow-emerald-600/20">
                        {sessionUser.name?.[0] || sessionUser.email?.[0] || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{sessionUser.name || "Candidate"}</h4>
                          <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] text-emerald-300 font-mono font-bold">
                            You
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono truncate">Active Cohort Peer</p>
                        <p className="text-[11px] text-slate-400 truncate">RoleNest Candidate</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Enrolled
                    </span>
                  </div>
                )}

                {/* Active Cohort Members */}
                {(pod.activeMembers || [])
                  .filter((m) => !m.isBot)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#0c1024] border border-indigo-950/80 rounded-2xl p-4 flex items-center justify-between shadow-md hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-base font-mono shrink-0">
                          {m.avatarInitial}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                          <p className="text-xs text-indigo-400 font-mono truncate">{m.college}</p>
                          <p className="text-[11px] text-slate-400 truncate">Interest: {m.roleInterest}</p>
                        </div>
                      </div>

                      <a
                        href="https://meet.google.com/new"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-indigo-950 text-[11px] text-indigo-300 font-mono font-bold flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Video className="w-3 h-3 text-indigo-400" />
                        <span>Pair Mock</span>
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <StudyFooter />
    </div>
  );
}
