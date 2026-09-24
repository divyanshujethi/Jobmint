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
  ExternalLink,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Video,
  Send,
  Sparkles,
} from "lucide-react";
import { MOCK_STUDY_PODS } from "@/lib/mock-pods";

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

  // Load completed questions and messages
  useEffect(() => {
    try {
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
  }, [pod.slug]);

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

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/study-pods/${pod.slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessageText }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessageText("");
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="space-y-4">
          <Link
            href="/study-pods"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Study Pods
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span>{pod.category}</span>
                <span>•</span>
                <span>Primary Skill: {pod.primarySkill}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                {pod.title}
              </h1>
              <p className="text-neutral-400 text-sm mt-1 max-w-2xl leading-relaxed">
                {pod.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <Video className="w-4 h-4" />
                <span>Start Free Peer Meet</span>
              </a>
            </div>
          </div>
        </div>

        {/* Schedule & Roadmap Milestone Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs font-mono">
              <div className="text-neutral-400">Pod Meeting Cadence</div>
              <div className="text-white font-medium mt-0.5">{pod.meetingCadence}</div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs font-mono">
                <div className="text-neutral-400">Current Roadmap Milestone</div>
                <div className="text-white font-medium mt-0.5">Phase {pod.currentPhaseNumber}: {pod.phaseTitle}</div>
              </div>
            </div>
            <Link
              href={`/roadmaps/${pod.roadmapSlug}`}
              className="text-xs text-emerald-400 hover:underline font-mono"
            >
              Open Guide ?
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab("INTERVIEW")}
            className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "INTERVIEW"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mock Interview Room</span>
            <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] text-neutral-300">
              {completedCount} / {pod.mockQuestions.length} Done
            </span>
          </button>

          <button
            onClick={() => setActiveTab("CHAT")}
            className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "CHAT"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-neutral-400 hover:text-white"
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
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Pod Cohort ({pod.activeMembers.length})</span>
          </button>
        </div>

        {/* TAB 1: Mock Interview Room */}
        {activeTab === "INTERVIEW" && (
          <div className="space-y-6">
            {/* Progress Counter */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300 font-semibold">Pod Readiness Score:</span>
                <span className="text-emerald-400 font-bold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-400">
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
                    className={`bg-neutral-900/90 border rounded-2xl p-6 transition-all space-y-3 ${
                      isChecked ? "border-emerald-800/60 bg-emerald-950/20" : "border-neutral-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded">
                            Q{idx + 1}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono">{q.focusArea}</span>
                        </div>
                        <h3 className="text-base font-medium text-white">{q.question}</h3>
                      </div>

                      <button
                        onClick={() => toggleQuestion(idx)}
                        className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono transition-colors shrink-0 ${
                          isChecked
                            ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-bold"
                            : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isChecked ? "Practiced!" : "Mark Done"}</span>
                      </button>
                    </div>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-1 text-xs">
                      <div className="text-amber-400 font-semibold flex items-center gap-1.5 font-sans">
                        <Lightbulb className="w-3.5 h-3.5" />
                        STAR Answer Strategy Tip:
                      </div>
                      <p className="text-neutral-300 font-mono text-[12px] leading-relaxed">
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
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Cohort Peer Discussion
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Coordinate mock session schedules and share code solutions
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Room
              </span>
            </div>

            {/* Message Stream */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3 bg-neutral-950/60 border border-neutral-800/70 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono shrink-0">
                    {m.avatar}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{m.sender}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">({m.role})</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-neutral-800">
              <input
                type="text"
                placeholder="Type your message, mock interview question, or resource..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessageText.trim()}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Members List */}
        {activeTab === "MEMBERS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pod.activeMembers.map((m) => (
              <div
                key={m.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-base font-mono">
                  {m.avatarInitial}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                  <p className="text-xs text-emerald-400 font-mono truncate">{m.roleInterest}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{m.college}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
