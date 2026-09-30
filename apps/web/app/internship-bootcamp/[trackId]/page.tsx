"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
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
  Building2,
  Lock,
  Play,
  FileText,
  GitPullRequest,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBootcampTrackBySlug, BOOTCAMP_TRACKS } from "@/lib/bootcamp-data";
import { getCurriculumDaysForTrack } from "@/lib/bootcamp-curriculum-days";
import { CodeArenaRunner } from "@/components/bootcamp/code-arena-runner";
import { StudyMaterialModal } from "@/components/bootcamp/study-material-modal";
import { InternshipCertificateModal } from "@/components/bootcamp/internship-certificate-modal";

export default function BootcampTrackDetailPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const track = getBootcampTrackBySlug(unwrappedParams.trackId);

  if (!track) {
    notFound();
  }

  const curriculumDays = getCurriculumDaysForTrack(track.id);

  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentRecord, setEnrollmentRecord] = useState<any>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Enrollment form fields
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [degreeBranch, setDegreeBranch] = useState("B.Tech Computer Science & Engineering");
  const [rollNumber, setRollNumber] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bootcamp/me")
      .then((res) => res.json())
      .then((data) => {
        setAuthChecked(true);
        setIsAuthenticated(Boolean(data.authenticated));
        if (data.authenticated && data.user) {
          setStudentName(data.user.name || "");
          setStudentEmail(data.user.email || "");
        }
        if (data.enrollments) {
          const match = data.enrollments.find(
            (e: any) => e.trackId === track.id || e.trackId === track.slug
          );
          if (match) {
            setIsEnrolled(true);
            setEnrollmentRecord(match);
          }
        }
      })
      .catch(() => setAuthChecked(true));
  }, [track.id, track.slug]);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/${track.slug}`);
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      const res = await fetch("/api/bootcamp/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: track.id,
          studentName,
          studentEmail,
          studentPhone,
          collegeName: studentCollege,
          degreeBranch,
          rollNumber,
          githubUsername,
          amountPaid: track.pricing.discountedPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Enrollment failed. Please try again.");
      }

      setIsEnrolled(true);
      setEnrollmentRecord(data.enrollment);
      setEnrollModalOpen(false);
    } catch (err: any) {
      setEnrollError(err.message || "Failed to complete enrollment");
    } finally {
      setEnrolling(false);
    }
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
                <FileCheck2 className="h-4 w-4 text-purple-400" />
                University NOC &amp; Offer Letter
              </span>
            </div>
          </div>

          {/* PRICING & ENROLLMENT CARD */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-6 space-y-4 lg:w-80 shrink-0 shadow-xl shadow-emerald-500/10">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Industrial Internship Fee
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  ₹{track.pricing.discountedPrice}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  ₹{track.pricing.originalPrice}
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  (75% Off)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Includes live in-browser compiler, daily GitHub tracking, VIP Discord, and college-recognized Certificate ID.
              </span>
            </div>

            {isEnrolled ? (
              <div className="space-y-2 pt-2">
                <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-2.5 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Enrolled &amp; Active Intern</span>
                </div>

                <Link
                  href={`/${track.slug}/day/${enrollmentRecord ? enrollmentRecord.unlockedDay : 1}`}
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 inline-flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>Go to Day {enrollmentRecord ? enrollmentRecord.unlockedDay : 1} Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/portal/offer-letter/${enrollmentRecord?.id || "demo"}`}
                    className="rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 text-center py-1.5"
                  >
                    Offer Letter &rarr;
                  </Link>
                  <Link
                    href={`/portal/noc/${enrollmentRecord?.id || "demo"}`}
                    className="rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-purple-300 text-center py-1.5"
                  >
                    College NOC &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setEnrollModalOpen(true)}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm h-11 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Enroll Now (₹499)</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}

            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Instant Verifiable Offer Letter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400" />
                <span>AICTE 4-Credit College NOC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-400" />
                <span>7-Day 100% Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DAY-BY-DAY CURRICULUM SYLLABUS GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Sequential Learning Architecture
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                Day-by-Day Unlocking
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Industrial Curriculum Schedule &amp; Daily Tasks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Students progress day-by-day. Complete daily theory, solve compiler challenges, and submit your GitHub task proof to unlock subsequent days.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 font-bold">
            Total {curriculumDays.length} Instructional Days
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {curriculumDays.map((day) => {
            const isDayUnlocked = isEnrolled
              ? day.dayNumber <= (enrollmentRecord?.unlockedDay || 1)
              : day.dayNumber === 1;

            return (
              <Link
                key={day.dayNumber}
                href={isDayUnlocked ? `/${track.slug}/day/${day.dayNumber}` : "#"}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                  isDayUnlocked
                    ? "border-slate-800 bg-slate-900/90 hover:border-emerald-500/50 hover:bg-slate-900 hover:scale-[1.02]"
                    : "border-slate-900 bg-slate-950/40 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                      Day {day.dayNumber}
                    </span>
                    {isDayUnlocked ? (
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Play className="h-2.5 w-2.5 fill-current" />
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2">
                    {day.title.replace(/^Day \d+:\s*/, "")}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {day.subdomain}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800/60 mt-3 flex items-center justify-between text-[10px]">
                  <span className={isDayUnlocked ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {isDayUnlocked ? "Enter Day Workspace &rarr;" : "Locked"}
                  </span>
                  <span className="text-slate-500">{day.estimatedHours}h</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* OPEN SOURCE REQUIREMENT BANNER */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-300 uppercase">
              Open Source Requirement
            </span>
            <span className="text-xs text-indigo-400 font-bold">RitualDev-Lab/DevShelf</span>
          </div>
          <h3 className="text-lg font-black text-white">
            Contribute to Production Open-Source Software
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every enrolled engineer contributes to <strong>DevShelf</strong> on GitHub. Fork the repository, contribute an engineering guide or tool, and submit your Pull Request to be recognized on our Featured Contributors board.
          </p>
        </div>

        <a
          href="https://github.com/RitualDev-Lab/DevShelf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-6 inline-flex items-center gap-1.5 shrink-0 transition-colors shadow-lg shadow-indigo-600/30"
        >
          <Github className="h-4 w-4" />
          <span>Fork DevShelf on GitHub</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* REAL ENROLLMENT MODAL WITH ACADEMIC VERIFICATION */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Academic Internship Registration
                </span>
                <h3 className="text-base font-bold text-white">
                  Enroll in {track.title}
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

            {!isAuthenticated ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Student Account Required
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  To generate your verified Offer Letter, College NOC, and track your daily GitHub assignments, you must sign in to your RoleNest account first.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href={`/login?callbackUrl=/${track.slug}`}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 px-6 inline-flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <span>Log In to Continue &rarr;</span>
                  </Link>
                  <Link
                    href={`/register?callbackUrl=/${track.slug}`}
                    className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-10 px-4 inline-flex items-center gap-1.5"
                  >
                    <span>Register Account</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
                {enrollError && (
                  <div className="rounded-xl bg-red-950/40 border border-red-500/40 p-3 text-xs text-red-300">
                    {enrollError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Student Full Name *</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. John Dao"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">College / University Name *</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. SRM / VIT / IIT / DTU"
                      value={studentCollege}
                      onChange={(e) => setStudentCollege(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Degree &amp; Branch *</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. B.Tech Computer Science"
                      value={degreeBranch}
                      onChange={(e) => setDegreeBranch(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">College Roll No / Student ID *</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. 2022-CSE-1042"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">WhatsApp Phone (for Mentors)</label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">GitHub Username</label>
                    <Input
                      type="text"
                      placeholder="e.g. johndao"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-9"
                    />
                  </div>
                </div>

                <div className={`rounded-xl p-3 border space-y-1 ${
                  track.pricing.discountedPrice === 0
                    ? "bg-emerald-950/30 border-emerald-500/40"
                    : "bg-slate-950 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Internship Enrollment Fee:</span>
                    <span className="text-emerald-400 font-black text-sm">
                      {track.pricing.discountedPrice === 0 ? "₹0 (100% Free Test Track)" : `₹${track.pricing.discountedPrice}`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {track.pricing.discountedPrice === 0
                      ? "Zero payment required. Test all platform features immediately (instant Offer Letter, NOC Letter, Day-by-Day unlocking, and certificate verification)."
                      : "Covers live compiler telemetry, daily mentor code review, AICTE 4-credit NOC, and public ledger Certificate ID."}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={enrolling}
                  className={`w-full rounded-xl font-black text-xs h-10 shadow-lg shadow-emerald-500/20 ${
                    track.pricing.discountedPrice === 0
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  {enrolling
                    ? "Activating Internship Track..."
                    : track.pricing.discountedPrice === 0
                    ? "Activate Free Test Track & Generate Instant Letters →"
                    : "Confirm Enrollment & Generate Offer Letter →"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
