"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  INITIAL_CANDIDATE_APPLICATIONS,
  CandidateApplication,
} from "@/lib/mock-applications";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@repo/shared";

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>(
    INITIAL_CANDIDATE_APPLICATIONS
  );
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.applications && data.applications.length > 0) {
          setApplications(data.applications);
        }
      })
      .catch((err) => console.error("Error loading live applications:", err));
  }, []);

  const total = applications.length;
  const viewed = applications.filter(
    (a) =>
      a.status === ApplicationStatus.RESUME_VIEWED ||
      a.status === ApplicationStatus.SHORTLISTED ||
      a.status === ApplicationStatus.INTERVIEW
  ).length;
  const shortlisted = applications.filter(
    (a) =>
      a.status === ApplicationStatus.SHORTLISTED ||
      a.status === ApplicationStatus.INTERVIEW
  ).length;
  const interview = applications.filter(
    (a) => a.status === ApplicationStatus.INTERVIEW
  ).length;
  const inactive = applications.filter((a) => a.isGhosted).length;

  const filteredApps = applications.filter((app) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "VIEWED")
      return (
        app.status === ApplicationStatus.RESUME_VIEWED ||
        app.status === ApplicationStatus.SHORTLISTED ||
        app.status === ApplicationStatus.INTERVIEW
      );
    if (activeFilter === "SHORTLISTED")
      return app.status === ApplicationStatus.SHORTLISTED;
    if (activeFilter === "INTERVIEW")
      return app.status === ApplicationStatus.INTERVIEW;
    if (activeFilter === "INACTIVE") return app.isGhosted;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Truth Teller Enabled
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Applications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Real-time event tracking. Know the exact moment an employer reviews your resume.
        </p>
      </div>

      {/* SUMMARY STATS COUNTERS */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Applied</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {total}
          </span>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
          <span className="text-xs text-emerald-700 block">Resume Viewed</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">
            {viewed}
          </span>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 shadow-2xs">
          <span className="text-xs text-blue-700 block">Shortlisted</span>
          <span className="text-2xl font-black text-blue-800 mt-1 block">
            {shortlisted}
          </span>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 shadow-2xs">
          <span className="text-xs text-purple-700 block">Interview</span>
          <span className="text-2xl font-black text-purple-800 mt-1 block">
            {interview}
          </span>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs text-amber-800 block">7+ Days Inactive</span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">
            {inactive}
          </span>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "ALL", label: `All (${total})` },
          { id: "VIEWED", label: `Viewed (${viewed})` },
          { id: "SHORTLISTED", label: `Shortlisted (${shortlisted})` },
          { id: "INACTIVE", label: `Ghosting Alert (${inactive})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilter === tab.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* APPLICATIONS LIST */}
      <div className="mt-6 space-y-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className={`rounded-2xl border bg-white p-6 shadow-sm transition-all ${
              app.isGhosted ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
            }`}
          >
            {/* CARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-800 border border-slate-200">
                  {app.companyLogoInitial}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">
                    {app.companyName}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {app.jobTitle}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{app.salaryOrStipend}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" /> {app.location}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {app.isGhosted ? (
                  <Badge variant="warning" className="gap-1 py-1 font-bold">
                    <AlertCircle className="h-3.5 w-3.5" /> No Activity (7+ Days)
                  </Badge>
                ) : app.status === ApplicationStatus.SHORTLISTED ? (
                  <Badge variant="success" className="gap-1 py-1 font-bold">
                    <Sparkles className="h-3.5 w-3.5" /> Shortlisted
                  </Badge>
                ) : app.status === ApplicationStatus.RESUME_VIEWED ? (
                  <Badge variant="default" className="gap-1 py-1 font-bold">
                    <Eye className="h-3.5 w-3.5" /> Resume Viewed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1 py-1 font-bold">
                    <Clock className="h-3.5 w-3.5" /> Submitted
                  </Badge>
                )}
              </div>
            </div>

            {/* TRUTH TELLER TIMELINE */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Verifiable Activity Timeline
              </div>
              <div className="space-y-2.5 text-xs text-slate-700">
                {app.events.map((event) => (
                  <div key={event.id} className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {event.eventType === ApplicationStatus.SHORTLISTED ? (
                        <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : event.eventType === ApplicationStatus.RESUME_VIEWED ? (
                        <Eye className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {event.eventType.replace("_", " ")} —{" "}
                        <span className="text-slate-500 font-normal">
                          {event.displayDate}
                        </span>
                      </div>
                      {event.note && (
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-DAY GHOSTING ALERT & ACTIONABLE FALLBACK */}
            {app.isGhosted && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  Truth Teller Inactivity Notice
                </div>
                <p className="text-slate-700 leading-relaxed">
                  You applied <strong>{app.appliedDaysAgo} days ago</strong>. The employer has not viewed your application on JobMint yet. Their typical first review window is 2–3 days.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Don&apos;t wait around — 12 similar active jobs available
                  </span>
                  <Link href="/jobs">
                    <Button size="sm" variant="default" className="text-xs font-bold gap-1">
                      Find Similar Jobs <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
