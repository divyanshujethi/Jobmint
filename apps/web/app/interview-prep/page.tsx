"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  RefreshCw,
  Search,
  Briefcase,
  Zap,
  Lock,
  Layers,
  GraduationCap,
  Crown,
  FileText,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InterviewQuestion {
  question: string;
  focusArea: string;
  recommendedApproach: string;
}

const PRESET_ROLES = [
  {
    title: "Software Engineer (SDE-1 / Fresher)",
    company: "Google India",
    skills: ["Data Structures", "Algorithms", "System Architecture", "C++ / Java", "Clean Code"],
  },
  {
    title: "Backend Engineer II (Distributed Systems)",
    company: "Amazon India",
    skills: ["Go", "Kafka", "PostgreSQL", "Distributed Systems", "AWS"],
  },
  {
    title: "Full-Stack Web Developer",
    company: "Razorpay",
    skills: ["React", "TypeScript", "Node.js", "Redis", "REST APIs"],
  },
  {
    title: "Scientist / Technical Officer (Gov Tech)",
    company: "ISRO / NIC",
    skills: ["Operating Systems", "Networking", "Computer Networks", "DBMS", "C / Linux"],
  },
  {
    title: "AI / ML Engineer (GenAI & LLMs)",
    company: "Swiggy / Zepto",
    skills: ["Python", "PyTorch", "LangChain", "Vector Databases", "Prompt Engineering"],
  },
];

export default function StandaloneInterviewPrepPage() {
  const [roleInput, setRoleInput] = useState("Software Engineer (SDE-1)");
  const [companyInput, setCompanyInput] = useState("Top Tech Company");
  const [skillsInput, setSkillsInput] = useState("Data Structures, Algorithms, System Design, SQL");
  const [jdSnippet, setJdSnippet] = useState("");

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [provider, setProvider] = useState<string>("groq");
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);

  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setSessionUser(data.user);
      })
      .catch(() => {})
      .finally(() => setSessionChecked(true));

    fetch("/api/user/pro-status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isPro) setIsPro(true);
      })
      .catch(() => {});

    // Automatically load default question set for starter role
    loadQuestions(PRESET_ROLES[0]!.title, PRESET_ROLES[0]!.company, PRESET_ROLES[0]!.skills.join(", "));
  }, []);

  const loadQuestions = async (role: string, company: string, skillsStr: string) => {
    setLoading(true);
    setRateLimitMsg(null);
    const skillsList = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "INTERVIEW_PREP_QUESTIONS",
          input: {
            jobTitle: role,
            companyName: company,
            skills: skillsList,
            description: jdSnippet.trim() || undefined,
          },
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setQuestions(getDefaultQuestions(role, company));
        return;
      }

      if (res.status === 429) {
        setRateLimitMsg(data.error || "Rate limit reached. Showing verified offline standard questions.");
        setQuestions(getDefaultQuestions(role, company));
        return;
      }

      if (res.ok && data.result) {
        setProvider(data.provider || "groq");
        if (Array.isArray(data.result)) {
          setQuestions(data.result);
        } else if (typeof data.result === "string") {
          const lines = data.result
            .split("\n")
            .filter((l: string) => l.trim().length > 0);
          const parsed = lines.map((line: string) => ({
            question: line.replace(/^\d+[\.\)]\s*/, ""),
            focusArea: "Technical Architecture & Core Competency",
            recommendedApproach:
              "Structure your response with the STAR framework (Situation, Task, Action, Result). State architectural trade-offs, Big-O complexities, and testing edge cases clearly.",
          }));
          setQuestions(parsed.length > 0 ? parsed : getDefaultQuestions(role, company));
        }
      } else {
        setQuestions(getDefaultQuestions(role, company));
      }
    } catch {
      setQuestions(getDefaultQuestions(role, company));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    loadQuestions(roleInput, companyInput || "Top Tech Employer", skillsInput);
  };

  const applyPreset = (preset: (typeof PRESET_ROLES)[0]) => {
    setRoleInput(preset.title);
    setCompanyInput(preset.company);
    setSkillsInput(preset.skills.join(", "));
    loadQuestions(preset.title, preset.company, preset.skills.join(", "));
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-800 shadow-2xs">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>AI Interview Prep Question Generator</span>
            <span className="rounded-md bg-purple-200/80 px-1.5 py-0.2 text-[9px] font-mono uppercase font-black">
              Llama 3.3 AI
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Targeted Technical &amp; System Design Interview Prep
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Generate authentic technical interview scenarios, coding edge-cases, and behavioral STAR prompts customized to any job description or tech stack.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs">
            <Link
              href="/jobs"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Or choose from 115,000+ Live Verified Job Openings →</span>
            </Link>
          </div>
        </div>

        {/* INPUT FORM CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Customize Target Position</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                  Step 1
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a quick template or type any company, role, and tech stack requirements.
              </p>
            </div>

            {/* PRESET CHIPS */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ROLES.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    roleInput === preset.title
                      ? "border-purple-600 bg-purple-50 text-purple-900 shadow-2xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {preset.company}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Target Job Title *
                </label>
                <Input
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. SDE-1, Backend Engineer, Frontend React Developer"
                  required
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Company / Organization
                </label>
                <Input
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  placeholder="e.g. Google India, Razorpay, Flipkart, TCS, NIC"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Required Tech Stack &amp; Skills (comma separated)
              </label>
              <Input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Java, Spring Boot, PostgreSQL, Kafka, Microservices"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Optional: Paste Job Description / Requirements Snippet</span>
                <span className="text-[10px] font-normal text-slate-400">Enriches domain scenarios</span>
              </label>
              <textarea
                value={jdSnippet}
                onChange={(e) => setJdSnippet(e.target.value)}
                placeholder="Paste key responsibilities or requirements from the JD to simulate company-specific scenarios..."
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Structured with Google XYZ STAR frameworks &amp; technical trade-offs.</span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-md gap-2 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Synthesizing Tailored Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Tailored Questions</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Tailored Technical Interview Suite</span>
              <span className="rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-mono font-bold">
                {questions.length} Scenarios
              </span>
            </h2>

            <span className="text-[11px] font-mono text-slate-500">
              Provider: <strong className="text-slate-700 uppercase">{provider}</strong>
            </span>
          </div>

          {rateLimitMsg && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-center gap-2">
              <span className="font-bold">Notice:</span> {rateLimitMsg}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
              <div className="font-bold text-slate-800 text-sm">
                Generating Company-Specific Interview Scenarios...
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Analyzing required skills, algorithmic edge-cases, and behavioral prompts for {roleInput} at {companyInput}.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const isExpanded = expandedIndex === idx;
                const isCopied = copiedIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all overflow-hidden bg-white shadow-2xs ${
                      isExpanded ? "border-purple-300 ring-2 ring-purple-500/10" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* ACCORDION HEADER */}
                    <div
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-md bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                            Q{idx + 1} • {q.focusArea}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(
                              `Question: ${q.question}\n\nFocus: ${q.focusArea}\n\nRecommended Approach:\n${q.recommendedApproach}`,
                              idx
                            );
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Copy Question & Framework"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* EXPANDED MODEL APPROACH */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-purple-900">
                          <Lightbulb className="h-4 w-4 text-purple-600" />
                          <span>Recommended Answering Strategy &amp; Key Talking Points</span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line pl-5 border-l-2 border-purple-300">
                          {q.recommendedApproach}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM CALLOUT */}
        <div className="rounded-3xl border border-indigo-200 bg-linear-to-r from-purple-50 via-indigo-50 to-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <span className="rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
              Ready to Apply?
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Apply with Direct ATS Transparency &amp; Tracked Follow-ups
            </h3>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              Every job on RoleNest links directly to official employer career portals (Greenhouse, Lever, Ashby, Workday). Track your application with automated 7-day follow-up reminders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-sm gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Explore 115,000+ Openings</span>
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-indigo-300 text-indigo-900 font-bold text-xs h-11 px-6 rounded-xl hover:bg-indigo-50 gap-2">
                <Crown className="h-3.5 w-3.5 text-amber-500" />
                <span>Pro &amp; Student Passes</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultQuestions(role: string, company: string): InterviewQuestion[] {
  return [
    {
      question: `How would you architect a fault-tolerant, high-concurrency request flow for ${role} at ${company}?`,
      focusArea: "System Design & Scalability",
      recommendedApproach:
        "Define your requirements (RPS, latency SLA, read/write ratio). Detail load balancer placement, stateless microservices, cache invalidation strategies (Redis Cache-Aside), asynchronous message brokers (Kafka/RabbitMQ), and database read-replicas with sharding.",
    },
    {
      question: "Walk through an algorithmic optimization where you reduced quadratic time complexity O(N²) to linearithmic O(N log N) or linear O(N).",
      focusArea: "Data Structures & Big-O Optimization",
      recommendedApproach:
        "Frame using the STAR method: describe the initial bottleneck, explain the data structure change (e.g. hash map indexing, two-pointer window, or monotonic queue), and state the concrete before-and-after performance metrics and memory trade-offs.",
    },
    {
      question: "Describe a production incident or bug you diagnosed where a service failed silently or experienced deadlock.",
      focusArea: "Root Cause Analysis (RCA) & Reliability",
      recommendedApproach:
        "Focus on structured observability: log aggregation, distributed tracing (OpenTelemetry), connection pool exhaustion, database locking, or unhandled promise rejections. Emphasize your post-mortem fix and automated integration tests prevent recurrence.",
    },
    {
      question: `How do you ensure clean code, comprehensive automated testing, and CI/CD quality in a fast-moving engineering team like ${company}?`,
      focusArea: "Engineering Standards & CI/CD",
      recommendedApproach:
        "Explain test pyramid balance (unit tests with high branch coverage, contract tests, and end-to-end integration tests). Mention linting, static code analysis, semantic versioning, feature flags for canary rollouts, and rollback triggers.",
    },
    {
      question: "Tell me about a high-stakes technical disagreement you had with a senior colleague or product manager. How did you resolve it?",
      focusArea: "Behavioral & STAR Leadership",
      recommendedApproach:
        "Describe the conflicting architectural viewpoints objectively. Explain how you anchored the discussion around objective benchmarks, customer impact, and prototypes rather than dogma. Highlight the collaborative compromise reached.",
    },
  ];
}
