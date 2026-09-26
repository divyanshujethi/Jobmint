"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  EmployerApplicant,
} from "@/lib/mock-applications";
import {
  ShieldCheck,
  Eye,
  Sparkles,
  Calendar,
  XCircle,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Github,
  Award,
  Zap,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@repo/shared";
import { DemoSandboxModal } from "@/components/demo-sandbox-modal";
import { openPaddleCheckout, PADDLE_FEATURED_JOB_PRICE_ID } from "@/components/paddle-provider";

interface ExtendedApplicant extends EmployerApplicant {
  githubUrl?: string | null;
  demoUrl?: string | null;
  devScore?: number | null;
  currentStreak?: number;
  resumeViewed?: boolean;
}

interface TruthTellerMetrics {
  totalApplicants: number;
  reviewedApplicants: number;
  reviewRatePercent: number;
  medianFirstReviewDays: number;
  truthTellerStatus: string;
}

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState<ExtendedApplicant[]>([]);
  const [metrics, setMetrics] = useState<TruthTellerMetrics>({
    totalApplicants: 0,
    reviewedApplicants: 0,
    reviewRatePercent: 68.4,
    medianFirstReviewDays: 1.8,
    truthTellerStatus: "EXEMPLARY (>65% Review Rate SLA Met)",
  });
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [devScoreFilter, setDevScoreFilter] = useState<string>("ALL");
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Sandbox Modal State
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [sandboxProject, setSandboxProject] = useState<{
    title: string;
    url: string;
    candidateName: string;
    githubUrl?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/employer/applicants")
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) {
          setMetrics(data.metrics);
        }
        if (data.applicants && data.applicants.length > 0) {
          setApplicants(data.applicants);
        }
      })
      .catch((err) => console.error("Error loading employer applicants:", err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (
    applicantId: string,
    newStatus: (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
    actionDescription: string
  ) => {
    // Optimistic UI update
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus, resumeViewed: true } : app
      )
    );
    setLastActionMessage(actionDescription);
    setTimeout(() => setLastActionMessage(null), 3500);

    try {
      const res = await fetch("/api/employer/applicants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: applicantId,
          status: newStatus,
          note: actionDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn("Failed to update status on server:", data.error);
      }
    } catch (err) {
      console.warn("Error calling PATCH /api/employer/applicants:", err);
    }
  };

  const openSandbox = (title: string, url: string, candidateName: string, githubUrl?: string) => {
    setSandboxProject({ title, url, candidateName, githubUrl });
    setSandboxOpen(true);
  };

  const filteredApplicants = applicants.filter((app) => {
    if (selectedJob !== "ALL" && app.jobId !== selectedJob) return false;
    
    // Status tab filter
    if (activeTab === "SHORTLISTED" && app.status !== ApplicationStatus.SHORTLISTED) return false;
    if (activeTab === "UNREVIEWED" && app.status !== ApplicationStatus.APPLIED) return false;
    if (activeTab === "INTERVIEW" && app.status !== ApplicationStatus.INTERVIEW) return false;

    // Dev Score filter
    if (devScoreFilter === "800" && (!app.devScore || app.devScore < 800)) return false;
    if (devScoreFilter === "750" && (!app.devScore || app.devScore < 750)) return false;
    if (devScoreFilter === "650" && (!app.devScore || app.devScore < 650)) return false;

    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Recruiter Applicant Desk
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Truth Teller Active
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review verified candidate applications, inspect POTD GitHub dev scores, and maintain your &gt;65% response SLA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() =>
              openPaddleCheckout({
                priceId: PADDLE_FEATURED_JOB_PRICE_ID,
                plan: "featured_job",
              })
            }
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs gap-1.5 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Boost Job (₹1,499)
          </Button>

          <Link href="/employer/jobs/new">
            <Button size="sm" variant="outline" className="font-bold gap-1 text-xs">
              + Post Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* TRUTH TELLER RECRUITER RESPONSE RATE HUD */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Truth Teller Review Rate</span>
            <span className="rounded bg-emerald-600 text-white text-[10px] font-mono px-1.5 py-0.2 font-bold">
              VERIFIED
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {metrics.reviewRatePercent}%
          </div>
          <p className="text-[11px] text-emerald-800">
            Target &gt;65% SLA maintained (vs &lt;5% industry average)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-slate-600">Median Review Time</span>
          <div className="text-3xl font-black text-cyan-600 font-mono">
            {metrics.medianFirstReviewDays} Days
          </div>
          <p className="text-[11px] text-slate-500">Fast-tracked candidate evaluations</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-slate-600">Total Applicants</span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {metrics.totalApplicants || applicants.length}
          </div>
          <p className="text-[11px] text-slate-500">Across all active postings</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-slate-600">Reviewed / Actioned</span>
          <div className="text-3xl font-black text-teal-600 font-mono">
            {metrics.reviewedApplicants || applicants.filter((a) => a.resumeViewed).length}
          </div>
          <p className="text-[11px] text-slate-500">Provided formal status feedback</p>
        </div>
      </div>

      {lastActionMessage && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* FILTER TABS & DEV SCORE FILTER */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "UNREVIEWED", "SHORTLISTED", "INTERVIEW"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab === "ALL"
                ? `All Applicants (${applicants.length})`
                : tab === "UNREVIEWED"
                ? `Pending Review (${applicants.filter((a) => a.status === ApplicationStatus.APPLIED).length})`
                : tab === "SHORTLISTED"
                ? `Shortlisted (${applicants.filter((a) => a.status === ApplicationStatus.SHORTLISTED).length})`
                : `Interviewing (${applicants.filter((a) => a.status === ApplicationStatus.INTERVIEW).length})`}
            </button>
          ))}
        </div>

        {/* DEV SCORE FAST-TRACK FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            Dev Score:
          </span>
          <select
            value={devScoreFilter}
            onChange={(e) => setDevScoreFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Scores</option>
            <option value="800">Elite (≥ 800)</option>
            <option value="750">High Caliber (≥ 750)</option>
            <option value="650">Rising Stars (≥ 650)</option>
          </select>
        </div>
      </div>

      {/* APPLICANT CARDS */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-8 w-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-slate-400">Loading applicants from PostgreSQL ledger...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
            <Clock className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No applicants match this criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {devScoreFilter !== "ALL"
                ? "Try relaxing the Dev Score filter to view candidates across other score bands."
                : "Once candidates submit applications to your job postings, their verified profiles, GitHub portfolios, and Truth Teller tracking will appear here."}
            </p>
          </div>
        ) : (
          filteredApplicants.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {candidate.candidateName}
                    </h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-800 border border-emerald-200">
                      🔥 {candidate.matchScore}% Match
                    </span>

                    {/* DEV SCORE BADGE */}
                    {candidate.devScore && (
                      <Link
                        href={`/dev-score?score=${candidate.devScore}`}
                        target="_blank"
                        className="rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-xs font-mono font-bold flex items-center gap-1 hover:bg-slate-800 transition-colors"
                        title="Click to view verified GitHub Proof-of-Work certificate"
                      >
                        <Award className="h-3 w-3 text-emerald-400" />
                        Dev Score: {candidate.devScore}/1000
                      </Link>
                    )}

                    {candidate.currentStreak && candidate.currentStreak > 1 && (
                      <span className="rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs px-2 py-0.5 font-bold flex items-center gap-0.5">
                        🔥 {candidate.currentStreak}d Streak
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {candidate.headline || "Full-Stack Developer & Engineering Student"}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-slate-400">
                    Applied for: <strong>{candidate.jobTitle}</strong> • {candidate.appliedDate}
                  </span>
                </div>

                {/* STATUS BADGE */}
                <div>
                  {candidate.status === ApplicationStatus.SHORTLISTED ? (
                    <Badge variant="success" className="gap-1 py-1 font-bold">
                      <Sparkles className="h-3.5 w-3.5" /> Shortlisted
                    </Badge>
                  ) : candidate.status === ApplicationStatus.INTERVIEW ? (
                    <Badge variant="info" className="gap-1 py-1 font-bold">
                      <Calendar className="h-3.5 w-3.5" /> Interview Stage
                    </Badge>
                  ) : candidate.status === ApplicationStatus.REJECTED ? (
                    <Badge variant="outline" className="gap-1 py-1 font-bold text-slate-500">
                      Rejected
                    </Badge>
                  ) : candidate.status === ApplicationStatus.RESUME_VIEWED ? (
                    <Badge variant="default" className="gap-1 py-1 font-bold">
                      <Eye className="h-3.5 w-3.5" /> Resume Viewed
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 py-1 font-bold">
                      <Clock className="h-3.5 w-3.5" /> Unreviewed
                    </Badge>
                  )}
                </div>
              </div>

              {/* SKILLS CHIPS & GITHUB LINKS */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {candidate.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                  >
                    ✓ {s}
                  </span>
                ))}

                {candidate.githubUrl && (
                  <a
                    href={candidate.githubUrl.startsWith("http") ? candidate.githubUrl : `https://github.com/${candidate.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 flex items-center gap-1 transition-colors"
                  >
                    <Github className="h-3 w-3" /> GitHub Profile
                  </a>
                )}
              </div>

              {/* COVER NOTE */}
              {candidate.coverNote && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Candidate Note:
                  </span>
                  &quot;{candidate.coverNote}&quot;
                </div>
              )}

              {/* ACTIONS BAR (PROOF-OF-WORK + TRUTH TELLER) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {candidate.candidateEmail}
                  </span>
                  {candidate.candidatePhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {candidate.candidatePhone}
                    </span>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* 1-CLICK DEMO SANDBOX BUTTON */}
                  {candidate.demoUrl && (
                    <Button
                      size="sm"
                      onClick={() =>
                        openSandbox(
                          `${candidate.candidateName}'s Project Demo`,
                          candidate.demoUrl!,
                          candidate.candidateName,
                          candidate.githubUrl || undefined
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      1-Click Demo Sandbox
                    </Button>
                  )}

                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      updateStatus(
                        candidate.id,
                        ApplicationStatus.RESUME_VIEWED,
                        `Resume opened for ${candidate.candidateName}. Truth Teller timestamp recorded!`
                      )
                    }
                  >
                    <Button variant="outline" size="sm" className="gap-1 text-xs font-semibold">
                      <FileText className="h-3.5 w-3.5 text-emerald-600" />
                      View Resume (PDF)
                    </Button>
                  </a>

                  <Button
                    size="sm"
                    variant="default"
                    className="gap-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() =>
                      updateStatus(
                        candidate.id,
                        ApplicationStatus.SHORTLISTED,
                        `${candidate.candidateName} was shortlisted! Candidate notified.`
                      )
                    }
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    Shortlist
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1 text-xs font-semibold"
                    onClick={() =>
                      updateStatus(
                        candidate.id,
                        ApplicationStatus.INTERVIEW,
                        `Interview invitation sent to ${candidate.candidateName}!`
                      )
                    }
                  >
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    Interview
                  </Button>

                  <button
                    onClick={() =>
                      updateStatus(
                        candidate.id,
                        ApplicationStatus.REJECTED,
                        `Application closed with respectful feedback.`
                      )
                    }
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Reject Application"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1-Click Interactive Demo Sandbox Modal */}
      {sandboxProject && (
        <DemoSandboxModal
          isOpen={sandboxOpen}
          onClose={() => setSandboxOpen(false)}
          projectTitle={sandboxProject.title}
          projectUrl={sandboxProject.url}
          candidateName={sandboxProject.candidateName}
          githubUrl={sandboxProject.githubUrl}
        />
      )}
    </div>
  );
}