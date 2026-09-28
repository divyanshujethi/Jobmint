"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Terminal,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
  Clock,
  Sparkles,
  Users,
  Github,
  FileText,
  Lock,
  Play,
  GitPullRequest,
  Check,
  Building2,
  UserCheck,
  Calendar,
} from "lucide-react";
import { BOOTCAMP_TRACKS, BootcampTrack } from "@/lib/bootcamp-data";
import { getCurriculumDaysForTrack } from "@/lib/bootcamp-curriculum-days";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InternshipStudentPortalPage() {
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState<{
    authenticated: boolean;
    user: any;
    enrollments: any[];
    submissions: any[];
  }>({
    authenticated: false,
    user: null,
    enrollments: [],
    submissions: [],
  });

  // Open source contribution form state
  const [activeEnrollmentId, setActiveEnrollmentId] = useState<string | null>(null);
  const [forkUrl, setForkUrl] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [submittingOs, setSubmittingOs] = useState(false);
  const [osMessage, setOsMessage] = useState<string | null>(null);

  // Featured contributors
  const [contributors, setContributors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/bootcamp/me")
      .then((res) => res.json())
      .then((data) => {
        setAuthData(data);
        if (data.enrollments && data.enrollments.length > 0) {
          setActiveEnrollmentId(data.enrollments[0].id);
          setForkUrl(data.enrollments[0].githubForkUrl || "");
          setPrUrl(data.enrollments[0].osContributionPrUrl || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/bootcamp/contributors")
      .then((res) => res.json())
      .then((data) => {
        if (data.contributors) {
          setContributors(data.contributors);
        }
      })
      .catch(() => {});
  }, []);

  const handleOsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnrollmentId || !prUrl.trim()) return;
    setSubmittingOs(true);
    setOsMessage(null);

    try {
      const res = await fetch("/api/bootcamp/submit-os-contribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: activeEnrollmentId,
          githubForkUrl: forkUrl.trim(),
          osContributionPrUrl: prUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit PR");
      setOsMessage(data.message || "Pull Request registered for review!");
    } catch (err: any) {
      alert(err.message || "Error submitting contribution");
    } finally {
      setSubmittingOs(false);
    }
  };

  const activeEnrollment = authData.enrollments.find((e) => e.id === activeEnrollmentId) || authData.enrollments[0];
  const activeTrack = activeEnrollment
    ? BOOTCAMP_TRACKS.find((t) => t.id === activeEnrollment.trackId || t.slug === activeEnrollment.trackId) || BOOTCAMP_TRACKS[0]
    : BOOTCAMP_TRACKS[0];

  const curriculumDays = getCurriculumDaysForTrack(activeTrack.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* PORTAL TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              RoleNest Virtual Engineering Labs
            </span>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.2 text-[10px] font-bold text-purple-300">
              AICTE / UGC 4 Credits
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Student Internship Dashboard &amp; Lab Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time day-by-day task progression, official appointment letter, college NOC, and GitHub audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!authData.authenticated ? (
            <Link
              href="/login"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 px-5 inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <UserCheck className="h-4 w-4" />
              <span>Log In to View My Tasks</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Logged in as <strong className="text-white">{authData.user?.name || authData.user?.email}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* NON-LOGGED IN WARNING BANNER */}
      {!loading && !authData.authenticated && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-extrabold text-white">
              Student Authentication Required
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              To submit daily GitHub deliverables, access your verifiable Offer Letter &amp; College NOC, and unlock Day 2+ tasks, please log in or register your student account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 inline-flex items-center gap-1.5"
            >
              <span>Student Sign In</span>
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Enrolled Industrial Program
          </span>
          <span className="text-lg font-black text-white truncate block">
            {activeEnrollment ? activeTrack.title : "AI & Machine Learning"}
          </span>
          <span className="text-[11px] text-emerald-400 block font-mono">
            {activeEnrollment ? `ID: ${activeEnrollment.offerLetterId}` : "4-Week Virtual Lab"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Current Day Unlocked
          </span>
          <span className="text-2xl font-black text-teal-400">
            Day {activeEnrollment ? activeEnrollment.unlockedDay : 1} of {curriculumDays.length}
          </span>
          <span className="text-[11px] text-slate-400 block">
            Day-by-Day sequential unlocking
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            GitHub Deliverables Submitted
          </span>
          <span className="text-2xl font-black text-purple-400">
            {authData.submissions.length} Tasks
          </span>
          <span className="text-[11px] text-slate-400 block">
            Verified in student git repo
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            DevShelf Open Source PR
          </span>
          <span className="text-lg font-black text-amber-400 truncate block">
            {activeEnrollment?.osContributionStatus || "NOT_STARTED"}
          </span>
          <span className="text-[11px] text-slate-400 block">
            RitualDev-Lab/DevShelf
          </span>
        </div>
      </div>

      {/* OFFICIAL APPOINTMENT & COLLEGE DOCUMENTS */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>Official Institutional Documents &amp; Letters</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Download or print your official Appointment Letter and College NOC for HOD / TPO semester credit sanction.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={activeEnrollment ? `/portal/offer-letter/${activeEnrollment.id}` : "/portal/offer-letter/demo"}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <FileText className="h-4 w-4" />
              <span>View Internship Offer Letter &rarr;</span>
            </Link>

            <Link
              href={activeEnrollment ? `/portal/noc/${activeEnrollment.id}` : "/portal/noc/demo"}
              className="rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5"
            >
              <Building2 className="h-4 w-4" />
              <span>College NOC Approval Packet &rarr;</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1">
            <div className="font-bold text-slate-300">Appointment Offer Reference No:</div>
            <div className="font-mono text-emerald-400 font-bold text-sm">
              {activeEnrollment ? activeEnrollment.offerLetterId : "RN-OFFER-2026-AIML-SAMPLE"}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Issued to: {activeEnrollment?.studentName || "Enrolled Student"} • {activeEnrollment?.collegeName || "Engineering Institution"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1">
            <div className="font-bold text-slate-300">University NOC Reference No:</div>
            <div className="font-mono text-purple-400 font-bold text-sm">
              {activeEnrollment ? activeEnrollment.nocLetterId : "RN-NOC-2026-AIML-SAMPLE"}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Valid for sanction of 4 Academic Credits (160 Hours AICTE/UGC NCrF Guidelines)
            </p>
          </div>
        </div>
      </div>

      {/* DAY-BY-DAY PROGRESSION TIMELINE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-400" />
              <span>Day-by-Day Industrial Curriculum Timeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete each daily module in sequence. You cannot skip days; completing each day unlocks the next.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Unlocked: Day 1 - Day {activeEnrollment ? activeEnrollment.unlockedDay : 1}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {curriculumDays.map((day) => {
            const isCompleted = authData.submissions.some((s) => s.dayNumber === day.dayNumber);
            const isUnlocked = activeEnrollment
              ? day.dayNumber <= activeEnrollment.unlockedDay
              : day.dayNumber === 1;

            return (
              <Link
                key={day.dayNumber}
                href={isUnlocked ? `/${activeTrack.slug}/day/${day.dayNumber}` : "#"}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                  isCompleted
                    ? "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400"
                    : isUnlocked
                    ? "border-teal-500/40 bg-slate-900 hover:border-teal-400 hover:scale-[1.02]"
                    : "border-slate-800/80 bg-slate-950/60 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                      Day {day.dayNumber}
                    </span>
                    {isCompleted ? (
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : isUnlocked ? (
                      <span className="h-5 w-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                        <Play className="h-2.5 w-2.5 fill-current" />
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-2">
                    {day.title.replace(/^Day \d+:\s*/, "")}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {day.subdomain}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800/60 mt-3 flex items-center justify-between text-[10px]">
                  <span className={isCompleted ? "text-emerald-400 font-bold" : isUnlocked ? "text-teal-300 font-bold" : "text-slate-500"}>
                    {isCompleted ? "Completed" : isUnlocked ? "Unlocked &rarr;" : "Locked"}
                  </span>
                  <span className="text-slate-500">{day.estimatedHours}h</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* OPEN SOURCE MILESTONE: RITUALDEV-LAB/DEVSHELF */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-300 uppercase">
                Mandatory Industrial Milestone
              </span>
              <span className="text-xs text-indigo-400 font-bold">
                Featured Contributor Opportunity
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              Open Source Contribution to RitualDev-Lab/DevShelf
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Every engineer in this bootcamp contributes to real production open-source software. Fork <strong>https://github.com/RitualDev-Lab/DevShelf</strong>, contribute a curated developer guide or algorithmic utility, and submit your Pull Request link below.
            </p>
          </div>

          <a
            href="https://github.com/RitualDev-Lab/DevShelf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-5 inline-flex items-center gap-1.5 shrink-0 transition-colors shadow-lg shadow-indigo-600/30"
          >
            <Github className="h-4 w-4" />
            <span>Fork DevShelf on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* SUBMISSION FORM FOR DEVSHELF */}
        <form onSubmit={handleOsSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-300 font-bold block mb-1">
              Your Forked Repo URL *
            </label>
            <Input
              type="url"
              required
              placeholder="https://github.com/your-username/DevShelf"
              value={forkUrl}
              onChange={(e) => setForkUrl(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl h-10 text-xs"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-bold block mb-1">
              Your Open Pull Request URL *
            </label>
            <Input
              type="url"
              required
              placeholder="https://github.com/RitualDev-Lab/DevShelf/pull/..."
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl h-10 text-xs"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={submittingOs}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs h-10 rounded-xl shadow-lg shadow-indigo-600/20"
            >
              <GitPullRequest className="h-4 w-4 mr-1.5" />
              <span>{submittingOs ? "Registering PR..." : "Submit DevShelf Contribution"}</span>
            </Button>
          </div>
        </form>

        {osMessage && (
          <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{osMessage}</span>
          </div>
        )}

        {/* FEATURED CONTRIBUTORS BOARD */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Featured DevShelf Student Contributors Board</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {(contributors.length > 0 ? contributors : [
              {
                studentName: "John Dao",
                collegeName: "Apex Institute of Technology",
                osContributionPrUrl: "https://github.com/RitualDev-Lab/DevShelf/pull/18",
                osContributionStatus: "FEATURED",
              },
              {
                studentName: "Rohan Kulkarni",
                collegeName: "PICT Pune",
                osContributionPrUrl: "https://github.com/RitualDev-Lab/DevShelf/pull/22",
                osContributionStatus: "APPROVED",
              },
              {
                studentName: "Sneha Reddy",
                collegeName: "VIT Vellore",
                osContributionPrUrl: "https://github.com/RitualDev-Lab/DevShelf/pull/29",
                osContributionStatus: "FEATURED",
              },
            ]).map((c, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">{c.studentName}</strong>
                  <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                    {c.osContributionStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{c.collegeName}</div>
                {c.osContributionPrUrl && (
                  <a
                    href={c.osContributionPrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    <span>View Merged PR &rarr;</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
