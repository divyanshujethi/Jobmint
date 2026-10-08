"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CandidateApplication } from "@/lib/mock-applications";
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
  Lock,
  Briefcase,
  Crown,
  Zap,
  ExternalLink,
  Mail,
  Copy,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@repo/shared";
import { openCashfreeCheckout } from "@/components/cashfree-provider";

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [planTier, setPlanTier] = useState<string>("free");
  const [maxLimit, setMaxLimit] = useState<number>(5);
  const [followUpApp, setFollowUpApp] = useState<CandidateApplication | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [followUpMarked, setFollowUpMarked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 1. Check session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((sessionData) => {
        if (sessionData && sessionData.user) {
          setSessionUser(sessionData.user);
          // 2. Load user's real applications from PostgreSQL
          return fetch("/api/applications")
            .then((res) => res.json())
            .then((data) => {
              if (data.applications && Array.isArray(data.applications)) {
                setApplications(data.applications);
              }
              if (data.maxLimit !== undefined) setMaxLimit(data.maxLimit);
              if (data.planTier) setPlanTier(data.planTier);
            });
        } else {
          setSessionUser(null);
        }
      })
      .catch((err) => console.error("Error loading applications:", err))
      .finally(() => setLoading(false));
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
      return app.status === ApplicationStatus.RESUME_VIEWED;
    if (activeFilter === "SHORTLISTED")
      return (
        app.status === ApplicationStatus.SHORTLISTED ||
        app.status === ApplicationStatus.INTERVIEW
      );
    if (activeFilter === "INACTIVE") return app.isGhosted;
    return true;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="h-10 w-10 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-slate-500">Connecting to verified application ledger...</p>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-sm space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sign In to Track Applications</h1>
            <p className="mt-2 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your personal application journal with smart 7-day follow-up countdowns, recruiter outreach drafts, and anti-ghosting timelines is linked directly to your authenticated profile.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login?callbackUrl=/applications"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              Sign In to View Applications <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500">
                Explore Verified Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Personal Application Journal &amp; Follow-Up Tracker
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Personal application journal with smart 7-day follow-up countdowns, outreach templates, and recruiter timeline tracking.
          </p>
        </div>

        <Link href="/jobs">
          <Button className="font-semibold gap-1.5 text-xs">
            Browse More Jobs <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* TRUTH TELLER VERIFIED APPLICATION LEDGER HUD */}
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider font-mono">
                Truth Teller Application Ledger
              </span>
              <span className="rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.2">
                Verified Telemetry Active
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Track your job applications across official company career portals in one unified ledger. Automated 7-day follow-up countdowns and direct career links ensure you stay on top of every opportunity.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            openCashfreeCheckout({
              plan: "pro",
            })
          }
          className="shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span>Get Pro Priority (₹499/mo)</span>
        </button>
      </div>

      {/* PLAN TRACKING QUOTA HUD */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Active Tracking Quota: {total} / {maxLimit === Infinity ? "Unlimited" : maxLimit} Applications
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                {planTier} Tier
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  maxLimit !== Infinity && total >= maxLimit
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${
                    maxLimit === Infinity
                      ? Math.min(100, (total / 25) * 100)
                      : Math.min(100, (total / maxLimit) * 100)
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {maxLimit !== Infinity && total >= maxLimit ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-amber-700 font-semibold">Quota Reached ({total}/{maxLimit})</span>
            <Link href="/pricing">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-3 rounded-xl shadow-xs">
                Upgrade for 50 or 150 Slots →
              </Button>
            </Link>
          </div>
        ) : maxLimit !== Infinity ? (
          <Link href="/pricing" className="shrink-0 text-xs text-emerald-700 hover:underline font-semibold">
            Upgrade for up to 50 or 150 tracked applications →
          </Link>
        ) : (
          <span className="shrink-0 text-xs text-emerald-700 font-bold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> High-Quota Tracking Active
          </span>
        )}
      </div>

      {/* SUMMARY STATS BAR */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={`rounded-xl border p-4 text-left transition-all ${
            activeFilter === "ALL"
              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <span className="text-xs font-medium block opacity-80">Total Applied</span>
          <span className="text-2xl font-bold font-mono mt-1 block">{total}</span>
        </button>

        <button
          onClick={() => setActiveFilter("VIEWED")}
          className={`rounded-xl border p-4 text-left transition-all ${
            activeFilter === "VIEWED"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-emerald-200"
          }`}
        >
          <span className="text-xs font-medium block opacity-80">Resumes Viewed</span>
          <span className="text-2xl font-bold font-mono mt-1 block text-emerald-600">
            {viewed}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter("SHORTLISTED")}
          className={`rounded-xl border p-4 text-left transition-all ${
            activeFilter === "SHORTLISTED"
              ? "border-purple-600 bg-purple-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-purple-200"
          }`}
        >
          <span className="text-xs font-medium block opacity-80">Shortlisted</span>
          <span className="text-2xl font-bold font-mono mt-1 block text-purple-600">
            {shortlisted}
          </span>
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-medium text-slate-500 block">Interviews</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {interview}
          </span>
        </div>

        <button
          onClick={() => setActiveFilter("INACTIVE")}
          className={`col-span-2 sm:col-span-1 rounded-xl border p-4 text-left transition-all ${
            activeFilter === "INACTIVE"
              ? "border-amber-600 bg-amber-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-amber-200"
          }`}
        >
          <span className="text-xs font-medium block opacity-80">Inactive (7+ Days)</span>
          <span className="text-2xl font-bold font-mono mt-1 block text-amber-600">
            {inactive}
          </span>
        </button>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="mt-8 space-y-4">
        {filteredApps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">
              {total === 0 ? "No applications yet" : "No applications in this category"}
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {total === 0
                ? "You haven't submitted any job or internship applications yet. Browse verified roles and apply directly with 1-click Truth Teller tracking."
                : "Try selecting a different filter to view your applications."}
            </p>
            {total === 0 && (
              <Link href="/jobs">
                <Button size="sm" className="mt-4 font-bold text-xs">
                  Explore Verified Jobs <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold text-slate-800 border border-slate-200">
                    {app.companyLogoInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-600">
                        {app.companyName}
                      </span>
                      {app.isVerifiedCompany && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified
                        </span>
                      )}
                      {(app as any).isExternal && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          Official {(app as any).source || "Company"} Portal
                        </span>
                      )}
                    </div>
                    <Link href={`/jobs/${app.jobSlug}`}>
                      <h2 className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                        {app.jobTitle}
                      </h2>
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>Applied on {app.appliedDateFormatted}</span>
                      <span>•</span>
                      <span>{app.salaryOrStipend}</span>
                      <span>•</span>
                      <span>{app.location}</span>
                    </div>
                  </div>
                </div>

                {/* STATUS & ACTIONS */}
                <div className="shrink-0 flex flex-wrap items-center gap-2">
                  {(app as any).sourceUrl && (
                    <a
                      href={(app as any).sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <span>Official Listing</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {followUpMarked[app.id] ? (
                    <Badge variant="success" className="gap-1 py-1 font-bold">
                      <Check className="h-3.5 w-3.5" /> Follow-Up Logged (+14d)
                    </Badge>
                  ) : (app as any).isExternal ? (
                    (app as any).followUpDueDays === 0 ? (
                      <>
                        <Badge variant="warning" className="gap-1 py-1 font-bold">
                          <AlertCircle className="h-3.5 w-3.5" /> Follow Up Recommended (7d+)
                        </Badge>
                        <button
                          type="button"
                          onClick={() => setFollowUpApp(app)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                        >
                          <Mail className="h-3.5 w-3.5 text-amber-700" />
                          <span>Outreach Templates</span>
                        </button>
                      </>
                    ) : (
                      <Badge variant="secondary" className="gap-1 py-1 font-bold bg-slate-100 text-slate-800">
                        <Clock className="h-3.5 w-3.5 text-slate-500" /> Follow Up in {(app as any).followUpDueDays}d
                      </Badge>
                    )
                  ) : app.isGhosted ? (
                    <>
                      <Badge variant="warning" className="gap-1 py-1 font-bold">
                        <AlertCircle className="h-3.5 w-3.5" /> No Activity (7+ Days)
                      </Badge>
                      <button
                        type="button"
                        onClick={() => setFollowUpApp(app)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5 text-amber-700" />
                        <span>Outreach Templates</span>
                      </button>
                    </>
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
                  {(app.events || []).map((event) => (
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
                    You applied <strong>{app.appliedDaysAgo ?? 0} days ago</strong>. The employer has not viewed your application on Role Nest yet. Their typical first review window is 2–3 days.
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Don&apos;t wait around — explore active roles with active recruiters
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
          ))
        )}
      </div>

      {/* FOLLOW-UP TEMPLATES & OUTREACH MODAL */}
      {followUpApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4">
            <button
              onClick={() => setFollowUpApp(null)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Follow-Up Templates for {followUpApp.companyName}
                </h3>
                <p className="text-xs text-slate-500">
                  Polite recruiter outreach templates to respectfully check your application status.
                </p>
              </div>
            </div>

            {/* EMAIL TEMPLATE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  📧 Professional Recruiter Follow-up Email:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const emailBody = `Subject: Following up on my application for ${followUpApp.jobTitle} - ${sessionUser?.name || "Candidate"}\n\nDear Hiring Team at ${followUpApp.companyName},\n\nI hope this email finds you well.\n\nI am writing to respectfully follow up on my application for the ${followUpApp.jobTitle} position, which I submitted on ${followUpApp.appliedDateFormatted}.\n\nI remain very enthusiastic about ${followUpApp.companyName} and believe my technical background aligns well with your team's goals. I would welcome the opportunity to discuss how I can contribute.\n\nPlease let me know if you need any additional project links or references. Thank you for your time and consideration!\n\nBest regards,\n${sessionUser?.name || "Candidate"}`;
                    navigator.clipboard.writeText(emailBody);
                    setCopiedTemplate("email");
                    setTimeout(() => setCopiedTemplate(null), 2500);
                  }}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedTemplate === "email" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedTemplate === "email" ? "Copied!" : "Copy Email"}
                </button>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-700 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {`Subject: Following up on my application for ${followUpApp.jobTitle} - ${sessionUser?.name || "Candidate"}

Dear Hiring Team at ${followUpApp.companyName},

I hope this email finds you well.

I am writing to respectfully follow up on my application for the ${followUpApp.jobTitle} position, which I submitted on ${followUpApp.appliedDateFormatted}.

I remain very enthusiastic about ${followUpApp.companyName} and believe my technical background aligns well with your team's goals. I would welcome the opportunity to discuss how I can contribute.

Thank you for your time and consideration!

Best regards,
${sessionUser?.name || "Candidate"}`}
              </div>
            </div>

            {/* LINKEDIN NOTE */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  💼 LinkedIn Connection Note (&lt;300 chars):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const liNote = `Hi! I applied for the ${followUpApp.jobTitle} role at ${followUpApp.companyName}. I'm excited about your engineering mission and would love to connect and share my portfolio. Thanks for your time!`;
                    navigator.clipboard.writeText(liNote);
                    setCopiedTemplate("linkedin");
                    setTimeout(() => setCopiedTemplate(null), 2500);
                  }}
                  className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedTemplate === "linkedin" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedTemplate === "linkedin" ? "Copied!" : "Copy Note"}
                </button>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-700 font-mono">
                {`Hi! I applied for the ${followUpApp.jobTitle} role at ${followUpApp.companyName}. I'm excited about your engineering mission and would love to connect and share my portfolio. Thanks for your time!`}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setFollowUpApp(null)}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setFollowUpMarked((prev) => ({ ...prev, [followUpApp.id]: true }));
                  setFollowUpApp(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Mark as Followed Up (+14 Days Snooze)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
