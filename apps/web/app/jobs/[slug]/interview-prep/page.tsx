"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { MockJob } from "@/lib/mock-jobs";

interface InterviewQuestion {
  question: string;
  focusArea: string;
  recommendedApproach: string;
}

export default function JobInterviewPrepPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [job, setJob] = useState<MockJob | null>(null);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [provider, setProvider] = useState<string>("gemini");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs)) {
          const found = data.jobs.find((j: any) => j.slug === slug);
          if (found) {
            setJob(found);
          }
        }
      })
      .catch((err) => console.error("Error loading job for interview prep:", err));
  }, [slug]);

  const fetchPrepQuestions = async () => {
    if (!job) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "INTERVIEW_PREP_QUESTIONS",
          input: {
            jobTitle: job.title,
            skills: job.skills,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setProvider(data.provider || "mock");
        if (Array.isArray(data.result)) {
          setQuestions(data.result);
        } else if (typeof data.result === "string") {
          const lines = data.result
            .split("\n")
            .filter((l: string) => l.trim().length > 0);
          const parsed = lines.map((line: string) => ({
            question: line.replace(/^\d+[\.\)]\s*/, ""),
            focusArea: "Technical Assessment",
            recommendedApproach:
              "Structure your answer using the STAR method: explain the specific challenge, your tech stack decisions, and the measurable outcome.",
          }));
          setQuestions(parsed.length > 0 ? parsed : getDefaultQuestions(job.title));
        }
      } else {
        setQuestions(getDefaultQuestions(job.title));
      }
    } catch {
      setQuestions(getDefaultQuestions(job.title));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (job) {
      fetchPrepQuestions();
    }
  }, [job]);

  const copyQuestion = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-500 flex items-center justify-center py-20 font-mono text-xs">
        Loading interview prep guide...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="space-y-4">
          <Link
            href={`/jobs/${job.slug}`}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Details
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold mb-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{job.companyName}</span>
                <span>•</span>
                <span>{job.location}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                Interview Preparation Guide
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Targeted technical &amp; behavioral interview questions for{" "}
                <span className="text-slate-900 font-semibold">{job.title}</span>.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={fetchPrepQuestions}
                disabled={loading}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Required Skills Pill List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-2 shadow-sm">
          <span className="text-xs font-mono text-slate-500 mr-2 font-medium">Tested Stack:</span>
          {job.skills.map((skill: string) => (
            <span
              key={skill}
              className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-mono font-medium"
            >
              {skill}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 font-mono">
            Provider: {provider}
          </span>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 shadow-sm">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-mono">Generating tailored interview questions...</p>
            </div>
          ) : (
            questions.map((q, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-5 cursor-pointer hover:bg-slate-50/80 flex items-start justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Q{idx + 1}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-medium">
                          {q.focusArea}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyQuestion(q.question, idx);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Copy question"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/80 space-y-3">
                      <div className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-slate-900 mb-1">
                            Recommended Answer Strategy (STAR Method)
                          </div>
                          <p className="text-slate-600 leading-relaxed font-mono text-[13px]">
                            {q.recommendedApproach}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Advice */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Pro Tip: Don&apos;t memorize scripted answers. Recount true project tradeoffs and debugging stories.
            </span>
          </div>
          <Link
            href={`/jobs/${job.slug}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shrink-0 transition-colors shadow-sm"
          >
            Apply to this Job
          </Link>
        </div>
      </div>
    </div>
  );
}

function getDefaultQuestions(title: string): InterviewQuestion[] {
  return [
    {
      question: `How do you structure and optimize code for high readability and reliability in a ${title} role?`,
      focusArea: "Code Architecture",
      recommendedApproach: "Mention modular folder structures, single-responsibility principle, and typing invariants.",
    },
    {
      question: "Can you walk through a complex bug you solved under tight time constraints?",
      focusArea: "Problem Solving",
      recommendedApproach: "Use STAR (Situation, Task, Action, Result). State how you isolated the root cause.",
    },
    {
      question: "How do you handle asynchronous data fetching and cache invalidation?",
      focusArea: "Data Flow & State",
      recommendedApproach: "Discuss optimistic updates, background refetching, and error boundary recovery.",
    },
    {
      question: "Describe how you write tests to ensure code quality before pushing to main.",
      focusArea: "Testing & Quality",
      recommendedApproach: "Cover unit tests for business logic, integration tests for critical user flows, and CI linting.",
    },
    {
      question: "Why does this specific role fit your learning journey right now?",
      focusArea: "Culture & Motivation",
      recommendedApproach: "Connect your recent projects and learning milestones to what the company builds.",
    },
  ];
}
