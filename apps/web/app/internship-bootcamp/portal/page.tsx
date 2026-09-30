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
  Check,
  Building2,
  UserCheck,
  Calendar,
  LogOut,
  Sliders,
} from "lucide-react";
import { BOOTCAMP_TRACKS, BootcampTrack } from "@/lib/bootcamp-data";
import { getCurriculumDaysForTrack } from "@/lib/bootcamp-curriculum-days";
import { Button } from "@/components/ui/button";

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

  const [activeEnrollmentId, setActiveEnrollmentId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bootcamp/me")
      .then((res) => res.json())
      .then((data) => {
        setAuthData(data);
        if (data.enrollments && data.enrollments.length > 0) {
          setActiveEnrollmentId(data.enrollments[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const hasEnrollments = Boolean(authData.enrollments && authData.enrollments.length > 0);
  const activeEnrollment = hasEnrollments
    ? authData.enrollments.find((e) => e.id === activeEnrollmentId) || authData.enrollments[0]
    : null;

  const activeTrack = activeEnrollment
    ? BOOTCAMP_TRACKS.find(
        (t) => t.id === activeEnrollment.trackId || t.slug === activeEnrollment.trackId
      ) || BOOTCAMP_TRACKS[0]
    : null;

  const curriculumDays = activeTrack ? getCurriculumDaysForTrack(activeTrack.id) : [];

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

        <div className="flex items-center gap-3 flex-wrap">
          {!authData.authenticated ? (
            <Link
              href="/login?callbackUrl=/portal"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 px-5 inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <UserCheck className="h-4 w-4" />
              <span>Log In to View My Tasks</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-300 font-medium block">
                  Logged in as <strong className="text-white">{authData.user?.name || authData.user?.email}</strong>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {hasEnrollments ? `${authData.enrollments.length} Active Program(s)` : "Candidate Account"}
                </span>
              </div>

              {/* LOGOUT BUTTON */}
              <a
                href="/api/auth/signout"
                className="rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-900/40 text-red-300 font-bold text-xs h-9 px-3.5 inline-flex items-center gap-1.5 transition-colors shadow-sm"
                title="Sign out of your RoleNest student session"
              >
                <LogOut className="h-3.5 w-3.5 text-red-400" />
                <span>Log Out</span>
              </a>
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
              href="/login?callbackUrl=/portal"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 inline-flex items-center gap-1.5"
            >
              <span>Student Sign In</span>
            </Link>
            <Link
              href="/register?callbackUrl=/portal"
              className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      )}

      {/* STATE A: LOGGED IN BUT NOT ENROLLED IN ANY COURSE YET */}
      {!loading && authData.authenticated && !hasEnrollments && (
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <GraduationCap className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              No Active Enrollment Found
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Start Your 4-Week Industrial Internship?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You haven&apos;t enrolled in an industrial internship track yet. Once you enroll (or test our 100% Free Sandbox), your official, verifiable <strong>Appointment Offer Letter</strong>, <strong>College NOC</strong>, and <strong>Day-by-Day Lab Workspace</strong> will instantly unlock right here.
            </p>
          </div>

          {/* WHAT GETS UNLOCKED PREVIEWS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Instant Verifiable Offer Letter</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Official appointment letter with your college name, roll number, and unique QR verification ID.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Building2 className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-white">AICTE 4-Credit College NOC</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Institutional approval packet for HOD and TPO sanction of your academic credits.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-2">
              <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Calendar className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Day-by-Day Lab Workspace</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sequential day-by-day compiler challenges, downloadable engineering blueprints, and git commits.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/#tracks"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs h-11 px-6 inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <span>Browse 31 Industrial Tracks</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/developer-sandbox"
              className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 font-bold text-xs h-11 px-6 inline-flex items-center gap-2 transition-colors"
            >
              <span>Test Free Track (₹0 Sandbox) &rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* STATE B: ENROLLED IN ONE OR MORE TRACKS */}
      {!loading && hasEnrollments && activeEnrollment && activeTrack && (
        <div className="space-y-8">
          
          {/* TRACK SWITCHER IF MULTIPLE ENROLLMENTS */}
          {authData.enrollments.length > 1 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Your Enrolled Programs:
              </span>
              <div className="flex flex-wrap gap-2">
                {authData.enrollments.map((enr) => {
                  const t = BOOTCAMP_TRACKS.find(
                    (tr) => tr.id === enr.trackId || tr.slug === enr.trackId
                  );
                  const isSelected = enr.id === activeEnrollment.id;
                  return (
                    <button
                      key={enr.id}
                      onClick={() => setActiveEnrollmentId(enr.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{t?.icon || "🎓"}</span>
                      <span>{t?.title || enr.trackId}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? "bg-slate-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        Day {enr.unlockedDay}/28
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVE ENROLLMENT METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Active Industrial Program
              </span>
              <span className="text-lg font-black text-white truncate block">
                {activeTrack.title}
              </span>
              <span className="text-[11px] text-emerald-400 block font-mono">
                Ref: {activeEnrollment.offerLetterId}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Current Progress
              </span>
              <span className="text-2xl font-black text-teal-400">
                Day {activeEnrollment.unlockedDay} of 28
              </span>
              <span className="text-[11px] text-slate-400 block">
                Sequential day-by-day unlocking
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                GitHub Tasks Verified
              </span>
              <span className="text-2xl font-black text-purple-400">
                {authData.submissions.filter((s) => s.enrollmentId === activeEnrollment.id).length} Completed
              </span>
              <span className="text-[11px] text-slate-400 block">
                Verified in student git repo
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Enrollment Status
              </span>
              <span className="text-lg font-black text-emerald-400 truncate block">
                {activeEnrollment.status || "ACTIVE"}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                {activeEnrollment.amountPaid === 0 ? "Free Test Track (₹0)" : `Subsidized ₹${activeEnrollment.amountPaid}`}
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
                  Your official verifiable Appointment Letter and College NOC generated for <strong className="text-slate-200">{activeEnrollment.studentName}</strong> ({activeEnrollment.collegeName}).
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={`/portal/offer-letter/${activeEnrollment.id}`}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Internship Offer Letter &rarr;</span>
                </Link>

                <Link
                  href={`/portal/noc/${activeEnrollment.id}`}
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
                  {activeEnrollment.offerLetterId}
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Issued to: <span className="text-slate-300">{activeEnrollment.studentName}</span> • Roll #{activeEnrollment.rollNumber} • {activeEnrollment.collegeName}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1">
                <div className="font-bold text-slate-300">University NOC Reference No:</div>
                <div className="font-mono text-purple-400 font-bold text-sm">
                  {activeEnrollment.nocLetterId}
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  AICTE / UGC 4-Credit Framework Compliant (160 Hours Practical Lab Work)
                </p>
              </div>
            </div>
          </div>

          {/* DAY-BY-DAY PROGRESSION TIMELINE */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-teal-400" />
                  <span>Day-by-Day Industrial Curriculum Timeline</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete each daily module in sequence. Complete Day {activeEnrollment.unlockedDay} tasks to unlock the next day.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Unlocked: Day 1 - Day {activeEnrollment.unlockedDay}
                </span>

                <Link
                  href={`/${activeTrack.slug}/day/${activeEnrollment.unlockedDay}`}
                  className="rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs h-9 px-4 inline-flex items-center gap-1.5 shadow-md shadow-teal-500/20"
                >
                  <span>Resume Day {activeEnrollment.unlockedDay} Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {curriculumDays.map((day) => {
                const isCompleted = authData.submissions.some(
                  (s) => s.enrollmentId === activeEnrollment.id && s.dayNumber === day.dayNumber
                );
                const isUnlocked = day.dayNumber <= activeEnrollment.unlockedDay;

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

        </div>
      )}

    </div>
  );
}
