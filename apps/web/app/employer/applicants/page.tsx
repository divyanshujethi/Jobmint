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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@repo/shared";
import { DemoSandboxModal } from "@/components/demo-sandbox-modal";

interface ExtendedApplicant extends EmployerApplicant {
  githubUrl?: string | null;
  demoUrl?: string | null;
  devScore?: number | null;
}

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState<ExtendedApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");
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
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.applications && data.applications.length > 0) {
          const liveList = data.applications.map((a: any, idx: number) => ({
            id: a.id,
            candidateName: a.candidateName || `Candidate #${idx + 1}`,
            candidateEmail: a.candidateEmail || "applicant@jobmint.dev",
            candidatePhone: "+91 98765 43210",
            jobId: a.jobId,
            jobTitle: a.jobTitle,
            appliedDaysAgo: a.appliedDaysAgo ?? 0,
            status: a.status,
            matchScore: Math.max(75, 94 - idx * 3),
            matchedSkills: ["TypeScript", "React", "PostgreSQL"],
            missingSkills: [],
            atsSummary: "Verified candidate with matching core skills and active portfolio projects.",
            resumeViewed: !!a.resumeViewedAtFormatted,
            resumeUrl: a.resumeUrl || "/mock-resume.pdf",
            coverNote: a.coverNote,
            githubUrl: a.githubUrl,
            demoUrl: a.demoUrl,
            devScore: a.devScore,
            appliedDate: a.appliedDateFormatted || "Recently",
          }));
          setApplicants(liveList);
        }
      })
      .catch((err) => console.error("Error loading employer applicants:", err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (
    applicantId: string,
    newStatus: (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
    actionDescription: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus, resumeViewed: true } : app
      )
    );
    setLastActionMessage(actionDescription);
    setTimeout(() => setLastActionMessage(null), 3000);

    const eventType = newStatus === ApplicationStatus.SHORTLISTED ? "SHORTLISTED" : "RESUME_VIEWED";
    fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SIMULATE_RECRUITER_ACTION",
        payload: { applicationId: applicantId, eventType },
      }),
    }).catch((err) => console.warn("Error recording recruiter action in DB:", err));
  };

  const openSandbox = (title: string, url: string, candidateName: string, githubUrl?: string) => {
    setSandboxProject({ title, url, candidateName, githubUrl });
    setSandboxOpen(true);
  };

  const filteredApplicants = applicants.filter((app) => {
    if (selectedJob !== "ALL" && app.jobId !== selectedJob) return false;
    if (activeTab === "ALL") return true;
    if (activeTab === "SHORTLISTED")
      return app.status === ApplicationStatus.SHORTLISTED;
    if (activeTab === "UNREVIEWED")
      return app.status === ApplicationStatus.APPLIED;
    if (activeTab === "INTERVIEW")
      return app.status === ApplicationStatus.INTERVIEW;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Recruiter Applicant Desk
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              Truth Teller Active
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Review verified candidate applications, launch 1-Click project sandboxes, and inspect GitHub dev scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/employer/jobs/new">
            <Button size="sm" className="font-bold gap-1 text-xs">
              + Post New Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {lastActionMessage && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          {["ALL", "UNREVIEWED", "SHORTLISTED", "INTERVIEW"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
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
      </div>

      {/* APPLICANT CARDS */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-8 w-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-slate-400">Loading applicants...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
            <Clock className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No applicants received yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once candidates submit applications to your job postings, their verified profiles, GitHub portfolios, and Truth Teller tracking will appear here.
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
                        className="rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-xs font-mono font-bold flex items-center gap-1 hover:bg-slate-800 transition-colors"
                      >
                        <Award className="h-3 w-3 text-emerald-400" />
                        Dev Score: {candidate.devScore}/1000
                      </Link>
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