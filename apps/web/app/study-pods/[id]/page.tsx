"use client";

import { useState, useEffect } from "react";
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
  ShieldCheck,
  Video,
  Send,
  Lock,
  Share2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { MOCK_STUDY_PODS, BOT_COORDINATOR } from "@/lib/mock-pods";
import { Button } from "@/components/ui/button";

interface PodMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  avatar: string;
}

export default function StudyPodDetailPage() {
  const params = useParams();
  const slug = params?.id as string;
  const pod = MOCK_STUDY_PODS.find((p) => p.slug === slug || p.id === slug) || MOCK_STUDY_PODS[0];

  const [activeTab, setActiveTab] = useState<"INTERVIEW" | "CHAT" | "MEMBERS">("INTERVIEW");
  const [completedQuestions, setCompletedQuestions] = useState<Record<number, boolean>>({});
  const [messages, setMessages] = useState<PodMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

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
    } catch {}

    fetch(`/api/study-pods/${pod.slug}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error("Error loading pod messages:", err));
  }, [pod.id, pod.slug]);

  const toggleQuestion = (idx: number) => {
    setCompletedQuestions((prev) => {
      const updated = {
        ...prev,
        [idx]: !prev[idx],
      };
      try {
        localStorage.setItem(`jobmint_pod_progress_${pod.slug}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || sendingMessage) return;

    if (!sessionUser) {
      window.location.href = `/login?callbackUrl=/study-pods/${pod.slug}`;
      return;
    }

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/study-pods/${pod.slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessageText }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => {
          const next = [...prev, data.message];
          if (data.botResponse) {
            next.push(data.botResponse);
          }
          return next;
        });
        setNewMessageText("");
      }
    } catch (err) {
      console.error("Failed to post pod message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const copyShareLink = () => {
    const url = `https://jobmint.ritualdev.in/study-pods/${pod.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const completedCount = Object.values(completedQuestions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / pod.mockQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="space-y-4">
          <Link
            href="/study-pods"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Study Pods
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span>{pod.category}</span>
                <span>•</span>
                <span>Primary Skill: {pod.primarySkill}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
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
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <Video className="w-4 h-4" />
                <span>Start Free Peer Meet</span>
              </a>
            </div>
          </div>
        </div>

        {/* Schedule & Roadmap Milestone Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs font-mono">
              <div className="text-slate-400">Pod Meeting Cadence</div>
              <div className="text-white font-medium mt-0.5">{pod.meetingCadence}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs font-mono">
                <div className="text-slate-400">Current Roadmap Milestone</div>
                <div className="text-white font-medium mt-0.5">Phase {pod.currentPhaseNumber}: {pod.phaseTitle}</div>
              </div>
            </div>
            <Link
              href={`/roadmaps/${pod.roadmapSlug}`}
              className="text-xs text-emerald-400 hover:underline font-mono"
            >
              Open Guide →
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab("INTERVIEW")}
            className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "INTERVIEW"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mock Interview Room</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
              {completedCount} / {pod.mockQuestions.length} Done
            </span>
          </button>

          <button
            onClick={() => setActiveTab("CHAT")}
            className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "CHAT"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Peer Chat</span>
            <span className="bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-[10px] text-emerald-300 font-bold">
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("MEMBERS")}
            className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "MEMBERS"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Pod Cohort</span>
          </button>
        </div>

        {/* TAB 1: Mock Interview Room */}
        {activeTab === "INTERVIEW" && (
          <div className="space-y-6">
            {/* Progress Counter */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Pod Readiness Score:</span>
                <span className="text-emerald-400 font-bold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Take turns: One student acts as interviewer while the other answers using the STAR technique (Situation, Task, Action, Result).
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {pod.mockQuestions.map((q, idx) => {
                const isChecked = !!completedQuestions[idx];
                return (
                  <div
                    key={idx}
                    className={`bg-slate-900/90 border rounded-2xl p-6 transition-all space-y-3 ${
                      isChecked ? "border-emerald-800/60 bg-emerald-950/20" : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                            Q{idx + 1}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{q.focusArea}</span>
                        </div>
                        <h3 className="text-base font-medium text-white">{q.question}</h3>
                      </div>

                      <button
                        onClick={() => toggleQuestion(idx)}
                        className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono transition-colors shrink-0 ${
                          isChecked
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isChecked ? "Practiced!" : "Mark Done"}</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                      <div className="text-amber-400 font-semibold flex items-center gap-1.5 font-sans">
                        <Lightbulb className="w-3.5 h-3.5" />
                        STAR Answer Strategy Tip:
                      </div>
                      <p className="text-slate-300 font-mono text-[12px] leading-relaxed">
                        {q.starTip}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Live Peer Chat Room */}
        {activeTab === "CHAT" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Cohort Peer Discussion &amp; AI Bot
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Coordinate mock sessions and get technical advice from the JobMint Cohort Bot
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
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
                      ? "bg-emerald-950/20 border-emerald-800/50"
                      : "bg-slate-950/60 border-slate-800/70"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      m.sender.includes("Bot")
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm"
                        : "bg-slate-800 border border-slate-700 text-emerald-400"
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
                            <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-mono">
                              AI Mentor
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({m.role})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authentication Gate or Message Input Box */}
            {sessionUser ? (
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Ask a technical question, share code, or coordinate mock interview..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessageText.trim()}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingMessage ? "Sending..." : "Send"}</span>
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Sign in to participate in the discussion and ask the JobMint Cohort Bot.</span>
                </div>
                <Link href={`/login?callbackUrl=/study-pods/${pod.slug}`}>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs">
                    Sign In to Chat
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Members List */}
        {activeTab === "MEMBERS" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Coordinator Card */}
              <div className="bg-slate-900 border border-emerald-800/40 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
                  🤖
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">JobMint Cohort Bot</h4>
                    <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] text-emerald-400 font-mono">
                      Verified AI
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono truncate">Automated Study Coordinator</p>
                  <p className="text-[11px] text-slate-500 truncate">JobMint Academy</p>
                </div>
              </div>

              {/* Logged in User Card if Joined */}
              {sessionUser && isJoined && (
                <div className="bg-slate-900 border border-emerald-700/60 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 border border-emerald-500 flex items-center justify-center font-bold text-white text-base font-mono shrink-0 uppercase">
                    {sessionUser.name?.[0] || sessionUser.email?.[0] || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">
                        {sessionUser.name || sessionUser.email?.split("@")[0]}
                      </h4>
                      <span className="rounded bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 text-[9px] text-emerald-300 font-mono font-bold">
                        You
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400 font-mono truncate">{pod.primarySkill} Learner</p>
                    <p className="text-[11px] text-slate-500 truncate">{sessionUser.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Invite Campus Peers Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Invite Batchmates to Join this Cohort</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                JobMint adheres to a strict zero-fake-profile policy. To practice mock interviews with real peers, share this room link with your college study group or WhatsApp batch chat.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={copyShareLink}
                  size="sm"
                  variant="outline"
                  className="gap-2 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Link Copied!" : "Copy Room Link"}</span>
                </Button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Join my peer study pod for ${pod.title} on JobMint: https://jobmint.ritualdev.in/study-pods/${pod.slug}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors"
                >
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
