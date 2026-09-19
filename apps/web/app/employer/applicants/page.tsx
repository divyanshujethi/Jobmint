"use client";

import { useState } from "react";
import Link from "next/link";
import {
  INITIAL_EMPLOYER_APPLICANTS,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@repo/shared";

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState<EmployerApplicant[]>(
    INITIAL_EMPLOYER_APPLICANTS
  );
  const [selectedJob, setSelectedJob] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const updateStatus = (
    applicantId: string,
    newStatus: (typeof ApplicationStatus)[keyof typeof ApplicationStatus],
    actionDescription: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus } : app
      )
    );
    setLastActionMessage(actionDescription);
    setTimeout(() => setLastActionMessage(null), 3000);
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
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Employer Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Candidate Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review candidates transparently. When you view a resume or update status, candidates are updated in real-time.
          </p>
        </div>

        <Link href="/employer/jobs/new">
          <Button size="sm" className="font-bold">
            + Post New Opening
          </Button>
        </Link>
      </div>

      {/* TOAST ACTION ALERT */}
      {lastActionMessage && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {/* FILTER CONTROLS */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        {/* Tab filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: `All Candidates (${applicants.length})` },
            {
              id: "UNREVIEWED",
              label: `Unreviewed (${applicants.filter((a) => a.status === ApplicationStatus.APPLIED).length})`,
            },
            {
              id: "SHORTLISTED",
              label: `Shortlisted (${applicants.filter((a) => a.status === ApplicationStatus.SHORTLISTED).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Job selector dropdown */}
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
        >
          <option value="ALL">All Active Openings</option>
          <option value="job-1">Frontend Developer Intern</option>
          <option value="job-2">AI & Deep Learning Intern</option>
        </select>
      </div>

      {/* APPLICANT CARDS */}
      <div className="mt-6 space-y-4">
        {filteredApplicants.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {candidate.candidateName}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-800 border border-emerald-200">
                    🔥 {candidate.matchScore}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {candidate.headline}
                </p>
                <span className="inline-block text-[11px] font-semibold text-slate-400">
                  Applied for: {candidate.jobTitle} • {candidate.appliedDate}
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

            {/* SKILLS CHIPS */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {candidate.matchedSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                >
                  ✓ {s}
                </span>
              ))}
              {candidate.missingSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                >
                  Missing: {s}
                </span>
              ))}
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

            {/* ACTIONS BAR (TRUTH TELLER INTEGRATED) */}
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

              {/* STATUS ACTION BUTTONS */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs font-semibold"
                  onClick={() =>
                    updateStatus(
                      candidate.id,
                      ApplicationStatus.RESUME_VIEWED,
                      `Resume opened for ${candidate.candidateName}. Truth Teller timestamp recorded!`
                    )
                  }
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  View Resume
                </Button>

                <Button
                  size="sm"
                  variant="default"
                  className="gap-1 text-xs font-bold"
                  onClick={() =>
                    updateStatus(
                      candidate.id,
                      ApplicationStatus.SHORTLISTED,
                      `${candidate.candidateName} was shortlisted! Candidate notified.`
                    )
                  }
                >
                  <Sparkles className="h-3.5 w-3.5" />
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
                  title="Reject with dignity"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
