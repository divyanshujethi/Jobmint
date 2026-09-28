"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  Calendar,
  Clock,
  Award,
  Terminal,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Users,
  Code2,
  Download,
  Github,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBootcampTrackBySlug, BOOTCAMP_TRACKS } from "@/lib/bootcamp-data";
import { CodeArenaRunner } from "@/components/bootcamp/code-arena-runner";
import { StudyMaterialModal } from "@/components/bootcamp/study-material-modal";
import { InternshipCertificateModal } from "@/components/bootcamp/internship-certificate-modal";

export default function BootcampTrackDetailPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const unwrappedParams = use(params);
  const track = getBootcampTrackBySlug(unwrappedParams.trackId);

  if (!track) {
    notFound();
  }

  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentCollege, setStudentCollege] = useState("");

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnrolled(true);
    setEnrollModalOpen(false);

    try {
      const enrolled = JSON.parse(
        localStorage.getItem("rolenest_enrolled_bootcamps") || "[]"
      );
      if (!enrolled.includes(track.id)) {
        enrolled.push(track.id);
        localStorage.setItem(
          "rolenest_enrolled_bootcamps",
          JSON.stringify(enrolled)
        );
      }
    } catch {}
  };

  const activeWeekData = track.weeks.find((w) => w.weekNumber === activeWeek) || track.weeks[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          href="/#tracks"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All 6 Tracks
        </Link>
        <span className="text-xs font-mono text-emerald-400 font-bold">
          Official Track ID: {track.certificateSpec.prefix}-2026
        </span>
      </div>

      {/* TRACK HERO BANNER */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl">{track.icon}</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-400 uppercase tracking-wider">
                {track.badge}
              </span>
              <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-300">
                AICTE / UGC 4 Credits
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {track.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {track.overview}
            </p>

            {/* KEY HIGHLIGHTS */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2">
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800">
                <Clock className="h-4 w-4 text-emerald-400" />
                {track.durationWeeks} Weeks ({track.totalHours} Hours)
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                Verified Certificate ID
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800">
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                {track.discordChannel}
              </span>
            </div>
          </div>

          {/* PRICING & ENROLL CARD */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-6 space-y-4 shrink-0 lg:w-72 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  ₹{track.pricing.discountedPrice}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  ₹{track.pricing.originalPrice}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold block">
                Early Bird Student Rate (Save 75%)
              </span>
            </div>

            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Full {track.durationWeeks}-Week Structured Labs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Official Recognized Certificate ID</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>College Letter of Recommendation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>VIP Discord Mentorship Access</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>All {track.durationWeeks} Downloadable Study Guides</span>
              </li>
            </ul>

            <Button
              type="button"
              onClick={() => setEnrollModalOpen(true)}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs h-10 shadow-lg shadow-emerald-500/20"
            >
              {isEnrolled ? "Enrolled (Access Active)" : "Enroll Now (₹499)"}
            </Button>

            <p className="text-[10px] text-center text-slate-400">
              Instant access to Week 1 labs &amp; materials
            </p>
          </div>
        </div>
      </div>

      {/* WEEK-BY-WEEK SYLLABUS SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {track.durationWeeks}-Week Industrial Curriculum &amp; Milestones
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a week to review technical topics, practical lab projects, and engineering study manuals.
            </p>
          </div>

          {/* WEEK SELECTOR TABS */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800">
            {track.weeks.map((w) => (
              <button
                key={w.weekNumber}
                type="button"
                onClick={() => setActiveWeek(w.weekNumber)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeWeek === w.weekNumber
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Week {w.weekNumber}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE WEEK CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                Week {activeWeekData.weekNumber} • {activeWeekData.hours} Hours Practical Work
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {activeWeekData.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Focus: {activeWeekData.theme}
              </p>
            </div>

            <StudyMaterialModal
              material={activeWeekData.studyMaterial}
              trackTitle={track.title}
              weekNumber={activeWeekData.weekNumber}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeWeekData.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* CORE TOPICS */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                Technical Topics &amp; Derivations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeWeekData.coreTopics.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRACTICAL LABS & DELIVERABLES */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-teal-400" />
                  Hands-On Practical Labs
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeWeekData.practicalLabs.map((lab, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {lab}
                    </li>
                  ))}
                </ul>
              </div>

              {/* WEEKLY PROJECT */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block">
                  Weekly Project Deliverable:
                </span>
                <h5 className="font-extrabold text-white text-xs">
                  {activeWeekData.weeklyProject.name}
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeWeekData.weeklyProject.deliverable}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeWeekData.weeklyProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CODE COMPETITION ARENA FOR THIS TRACK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Track Coding Competitions &amp; Tests
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Solve interactive coding tasks in the browser with automated test verification.
            </p>
          </div>

          <div className="flex items-center gap-1">
            {track.codingChallenges.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedChallengeIdx(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedChallengeIdx === idx
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Task {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {track.codingChallenges[selectedChallengeIdx] && (
          <CodeArenaRunner
            challenge={track.codingChallenges[selectedChallengeIdx]}
            trackTitle={track.title}
          />
        )}
      </div>

      {/* CAPSTONE PROJECT & CERTIFICATE ISSUANCE SECTION */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-10 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
              <Award className="h-4 w-4" />
              <span>Final Capstone &amp; Verifiable Credential</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {track.capstoneProject.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {track.capstoneProject.industryContext}
            </p>

            <div className="space-y-1 text-xs text-slate-400">
              <strong className="text-white block">Required Deliverables:</strong>
              <ul className="list-disc list-inside space-y-1">
                {track.capstoneProject.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 shrink-0 md:w-80">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Grading Rubric
              </h4>
              <div className="space-y-1.5 pt-1">
                {track.capstoneProject.gradingCriteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{c.item}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {c.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <InternshipCertificateModal track={track} />
            </div>
          </div>
        </div>
      </div>

      {/* ENROLLMENT MODAL */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">
                  Confirm Student Enrollment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">{track.title}</span>
              <p className="text-[11px] text-slate-400">
                {track.durationWeeks} Weeks • 160 Hours • Verifiable Certificate ID Included
              </p>
              <div className="flex items-baseline gap-2 pt-1 font-bold text-emerald-400">
                <span className="text-lg">₹{track.pricing.discountedPrice}</span>
                <span className="text-xs text-slate-500 line-through">₹{track.pricing.originalPrice}</span>
                <span className="text-[10px] text-slate-400 font-normal">(Instant Scholarship Applied)</span>
              </div>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Student Email *</label>
                <Input
                  type="email"
                  required
                  placeholder="your.name@college.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">College / University *</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. SRM / VIT / IIT / Delhi University"
                  value={studentCollege}
                  onChange={(e) => setStudentCollege(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 mt-2 shadow-lg shadow-emerald-500/20"
              >
                Complete Enrollment &amp; Unlock Full Syllabus &rarr;
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
