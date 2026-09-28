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
} from "lucide-react";
import { BOOTCAMP_TRACKS, BootcampTrack } from "@/lib/bootcamp-data";
import { InternshipCertificate } from "@/lib/bootcamp-certificates";
import { Button } from "@/components/ui/button";

export default function InternshipStudentPortalPage() {
  const [enrolledSlugs, setEnrolledSlugs] = useState<string[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [earnedCerts, setEarnedCerts] = useState<InternshipCertificate[]>([]);

  useEffect(() => {
    try {
      const e = JSON.parse(
        localStorage.getItem("rolenest_enrolled_bootcamps") || "[]"
      );
      setEnrolledSlugs(e);

      const s = JSON.parse(
        localStorage.getItem("rolenest_bootcamp_solved_challenges") || "[]"
      );
      setSolvedChallenges(s);

      const c = JSON.parse(
        localStorage.getItem("rolenest_earned_internships") || "[]"
      );
      setEarnedCerts(c);
    } catch {}
  }, []);

  const enrolledTracks = BOOTCAMP_TRACKS.filter(
    (t) => enrolledSlugs.includes(t.id) || enrolledSlugs.includes(t.slug)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* PORTAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            Student Internship Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            My Virtual Engineering Lab
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your 3-4 week lab milestones, solved coding challenges, and earned university credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#tracks"
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Browse All Tracks</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Active Enrolled Programs
          </span>
          <span className="text-2xl font-black text-emerald-400">
            {enrolledTracks.length > 0 ? enrolledTracks.length : "1 Track (Demo)"}
          </span>
          <span className="text-[11px] text-slate-400 block">
            4-Credit Industrial Internships
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Solved Coding Challenges
          </span>
          <span className="text-2xl font-black text-teal-400">
            {solvedChallenges.length} / 12
          </span>
          <span className="text-[11px] text-slate-400 block">
            In-Browser Compiler Verified
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Earned Certificate IDs
          </span>
          <span className="text-2xl font-black text-amber-400">
            {earnedCerts.length}
          </span>
          <span className="text-[11px] text-slate-400 block">
            Recognized by Colleges &amp; MNCs
          </span>
        </div>
      </div>

      {/* EARNED CERTIFICATES SECTION */}
      {earnedCerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <span>My Verified Internship Credentials</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedCerts.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                    ID: {cert.id}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">
                    Grade {cert.grade} ({cert.score}%)
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {cert.trackTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {cert.recipientName} • {cert.collegeName}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/verify/${cert.id}`}
                    className="text-xs text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>View Public Letter &amp; Credential</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <span className="text-[10px] text-slate-500 font-mono">
                    AICTE Compliant
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENROLLED TRACKS OR SUGGESTED TRACKS */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          <span>My Active Programs &amp; Milestones</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(enrolledTracks.length > 0 ? enrolledTracks : [BOOTCAMP_TRACKS[0]]).map((track) => (
            <div
              key={track.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{track.icon}</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 uppercase">
                    {track.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {track.tagline}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Program Progress</span>
                    <span className="text-emerald-400 font-bold">Week 1 of {track.durationWeeks}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href={`/${track.slug}`}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Enter Track Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="https://discord.gg/rolenest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  <span>Track Discord</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
