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
  Video,
  Send,
  Lock,
} from "lucide-react";
import { MOCK_STUDY_PODS } from "@/lib/mock-pods";
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

  const completedCount = Object.values(completedQuestions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / pod.mockQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="space-y-4">
          <Link
            href="/study-pods"
            className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Study Pods
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 mb-1 font-semibold">
                <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{pod.category}</span>
                <span>•</span>
                <span>Primary Skill: {pod.primarySkill}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                {pod.title}
              </h1>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
                {pod.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <Video className="w-4 h-4" />
                <span>Start Free Peer Meet</span>
              </a>
            </div>
          </div>
        </div>

        {/* Schedule & Roadmap Milestone Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="text-slate-500 font-medium">Pod Meeting Cadence</div>
              <div className="text-slate-900 font-bold mt-0.5">{pod.meetingCadence}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="text-slate-500 font-medium">Current Roadmap Milestone</div>
                <div className="text-slate-900 font-bold mt-0.5">Phase {pod.currentPhaseNumber}: {pod.phaseTitle}</div>
              </div>
            </div>
            <Link
              href={`/roadmaps/${pod.roadmapSlug}`}
              className="text-xs text-emerald-700 hover:underline font-bold font-mono"
            >
              Open Guide →
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab("INTERVIEW")}
            className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "INTERVIEW"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mock Interview Room</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-700 font-bold">
              {completedCount} / {pod.mockQuestions.length} Done
            </span>
          </button>

          <button
            onClick={() => setActiveTab("CHAT")}
            className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "CHAT"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Peer Chat</span>
            <span className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] text-emerald-700 font-bold">
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("MEMBERS")}
            className={`pb-3 px-4 font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "MEMBERS"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
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
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-700 font-bold">Pod Readiness Score:</span>
                <span className="text-emerald-700 font-bold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
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
                    className={`bg-white border rounded-2xl p-6 transition-all space-y-3 shadow-sm ${
                      isChecked ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            Q{idx + 1}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{q.focusArea}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{q.question}</h3>
                      </div>

                      <button
                        onClick={() => toggleQuestion(idx)}
                        className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold transition-all shrink-0 ${
                          isChecked
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isChecked ? "Practiced!" : "Mark Done"}</span>
                      </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="text-amber-700 font-bold flex items-center gap-1.5 font-sans">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        STAR Answer Strategy Tip:
                      </div>
                      <p className="text-slate-700 font-mono text-[12px] leading-relaxed">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Cohort Peer Discussion &amp; AI Bot
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Coordinate mock sessions and get technical advice from the Role Nest Cohort Bot
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      m.sender.includes("Bot")
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300 text-sm"
                        : "bg-white border border-slate-300 text-slate-800"
                    }`}
                  >
                    {m.avatar}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {m.sender}
                          {m.sender.includes("Bot") && (
                            <span className="rounded bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                              AI Mentor
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">({m.role})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            {sessionUser ? (
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Ask a technical question, share code, or coordinate mock interview..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessageText.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingMessage ? "Sending..." : "Send"}</span>
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Sign in to participate in the discussion and ask the Role Nest Cohort Bot.</span>
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
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                  🤖
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">Role Nest Cohort Bot</h4>
                    <span className="rounded bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 text-[9px] text-emerald-800 font-mono font-bold">
                      Verified AI
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-mono truncate font-semibold">Automated Study Coordinator</p>
                  <p className="text-[11px] text-slate-500 truncate">Role Nest Academy</p>
                </div>
              </div>

              {/* Logged in User Card if Joined */}
              {sessionUser && isJoined && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 border border-emerald-500 flex items-center justify-center font-bold text-white text-base font-mono shrink-0 uppercase">
                    {sessionUser.name?.[0] || sessionUser.email?.[0] || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{sessionUser.name || "Candidate"}</h4>
                      <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] text-emerald-700 font-mono font-bold">
                        Enrolled
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate">Active Cohort Member</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
