"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Terminal,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Users,
  Search,
  Code2,
  Clock,
  Zap,
  Star,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BOOTCAMP_TRACKS, BootcampTrack } from "@/lib/bootcamp-data";
import { CodeArenaRunner } from "@/components/bootcamp/code-arena-runner";
import { StudyMaterialModal } from "@/components/bootcamp/study-material-modal";

export default function InternshipBootcampPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchCertId, setSearchCertId] = useState("");

  const filteredTracks = BOOTCAMP_TRACKS.filter((t) => {
    if (selectedCategory === "ALL") return true;
    return t.category === selectedCategory;
  });

  const featuredChallenge = BOOTCAMP_TRACKS[0].codingChallenges[0];

  const handleCertSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCertId.trim()) {
      window.location.href = `/internship-bootcamp/verify/${searchCertId.trim().toUpperCase()}`;
    }
  };

  return (
    <div className="space-y-16 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-6 relative">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>AICTE &amp; UGC Credit Framework Recommended • 3-4 Week Industrial Internships</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Industrial Engineering Bootcamps &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Virtual Internships
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            <strong>Zero third-party YouTube embeds.</strong> A production-grade 3-4 week curriculum featuring live in-browser coding competitions, downloadable engineering blueprints, dedicated VIP Discord mentorship, and official verifiable Certificate IDs recognized by colleges and tech employers across India.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#tracks"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm px-6 py-3 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Explore 6 Domain Tracks</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#code-arena"
              className="rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm px-5 py-3 transition-colors inline-flex items-center gap-2"
            >
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>Try Live Code Arena</span>
            </a>

            <a
              href="https://discord.gg/rolenest"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 font-bold text-sm px-5 py-3 transition-colors inline-flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>Join VIP Discord</span>
            </a>
          </div>

          {/* STATS TICKER */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                6 Tracks
              </span>
              <span className="text-xs text-slate-400">
                AI/ML, Cyber, GenAI, Python, Java, FullStack
              </span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-teal-400">
                160 Hours
              </span>
              <span className="text-xs text-slate-400">
                Practical Hands-On Lab Work &amp; Capstones
              </span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-blue-400">
                4 Credits
              </span>
              <span className="text-xs text-slate-400">
                Academic Recommendation Letter for Colleges
              </span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-2xl sm:text-3xl font-black text-purple-400">
                100% Real
              </span>
              <span className="text-xs text-slate-400">
                Verifiable Certificate ID Ledger Lookup
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CERTIFICATE LOOKUP SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Award className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-extrabold text-white">
                Public Certificate ID Verification Ledger
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-lg">
              University faculties, placement cells, and background check teams can instantly verify any graduate's credential ID and academic transcript.
            </p>
          </div>

          <form onSubmit={handleCertSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="e.g. RN-INT-2026-AIML-9F2B84"
                value={searchCertId}
                onChange={(e) => setSearchCertId(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-700 text-xs text-white rounded-xl h-9"
              />
            </div>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs h-9 px-4 rounded-xl shrink-0"
            >
              Verify Credential
            </Button>
          </form>
        </div>
      </section>

      {/* 6 DOMAIN TRACKS SECTION */}
      <section id="tracks" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Intensive 3-4 Week Curricula
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Choose Your Industrial Engineering Track
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Each track is crafted with real production assignments, week-by-week engineering milestones, test suites, and verifiable capstones.
            </p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "All Tracks (6)" },
              { id: "AI_ML", label: "AI & ML" },
              { id: "CYBER_SECURITY", label: "Cyber Security" },
              { id: "GEN_AI", label: "Prompt Eng" },
              { id: "PYTHON", label: "Python" },
              { id: "JAVA", label: "Enterprise Java" },
              { id: "FULLSTACK", label: "Full-Stack Next.js" },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedCategory(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedCategory === pill.id
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* TRACK CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all p-6 flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                
                {/* TOP BADGES */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-3xl">{track.icon}</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                    {track.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    {track.domain}
                  </span>
                  <Link href={`/internship-bootcamp/${track.slug}`}>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-400 transition-colors mt-0.5 leading-snug">
                      {track.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {track.tagline}
                  </p>
                </div>

                {/* DURATION & STATS PILLS */}
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono flex-wrap">
                  <span className="rounded-md bg-slate-950 px-2 py-1 border border-slate-800 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-400" />
                    {track.durationWeeks} Weeks
                  </span>
                  <span className="rounded-md bg-slate-950 px-2 py-1 border border-slate-800">
                    {track.totalHours} Hours Labs
                  </span>
                  <span className="rounded-md bg-slate-950 px-2 py-1 border border-slate-800 text-purple-300">
                    4 Credits
                  </span>
                </div>

                {/* SKILLS TAGS */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {track.certificateSpec.skills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {track.certificateSpec.skills.length > 5 && (
                    <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                      +{track.certificateSpec.skills.length - 5} more
                    </span>
                  )}
                </div>

                {/* CAPSTONE PREVIEW */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Capstone Deliverable:
                  </span>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {track.capstoneProject.title}
                  </p>
                </div>
              </div>

              {/* FOOTER & ENROLL BUTTON */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-white">
                      ₹{track.pricing.discountedPrice}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹{track.pricing.originalPrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    Early Bird Student Rate
                  </span>
                </div>

                <Link
                  href={`/internship-bootcamp/${track.slug}`}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 inline-flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                >
                  <span>View Syllabus</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE CODE COMPETITION ARENA TEASER */}
      <section id="code-arena" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
            Interactive In-Browser Compilation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            The RoleNest Code Competition Arena
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every week includes algorithmic problem-solving tasks and system implementation challenges with automated unit test assertions. Try solving this Week 1 challenge live:
          </p>
        </div>

        <CodeArenaRunner
          challenge={featuredChallenge}
          trackTitle="AI & Machine Learning Engineering"
        />
      </section>

      {/* PDF STUDY MATERIAL & FIELD MANUALS */}
      <section id="study-material" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Engineering Blueprints &amp; Lab Notes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Downloadable PDF Study Material
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive 30+ page guides for each week formatted for university lab record compliance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BOOTCAMP_TRACKS.slice(0, 4).map((track) => {
            const mat = track.weeks[0].studyMaterial;
            return (
              <div
                key={track.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{track.domain}</span>
                    <span className="text-blue-400">{mat.totalPages} Pages</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                    {mat.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {mat.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <StudyMaterialModal
                    material={mat}
                    trackTitle={track.title}
                    weekNumber={1}
                  />
                  <span className="text-[10px] text-slate-500 font-mono">
                    Free Preview
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COLLEGE RECOGNITION & ACADEMIC CREDITS EXPLANATION */}
      <section id="college-recognition" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 p-6 sm:p-10 space-y-8 shadow-2xl">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-300">
              <FileCheck2 className="h-4 w-4" />
              <span>University Submission Guarantee</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Recognized by Colleges &amp; Tech Employers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              How students use RoleNest Internship Certificates for semester credits and mandatory university training requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                01
              </span>
              <h4 className="font-bold text-white text-sm">
                AICTE / UGC Credit Alignment
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                4-week curricula spanning 160 total practical hours fulfill the standard 4-credit academic internship quota required by Indian engineering colleges.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                02
              </span>
              <h4 className="font-bold text-white text-sm">
                University NOC &amp; Recommendation Letter
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every graduate receives an official "To Whom It May Concern" Academic Credit Recommendation Letter with mentor digital sign-off and syllabus breakdown.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-2">
              <span className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                03
              </span>
              <h4 className="font-bold text-white text-sm">
                Permanent SHA-256 Ledger ID
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unique credential IDs (e.g. <code>RN-INT-2026-AIML-XXXXXX</code>) are hosted on our public verification portal with verifiable GitHub capstone project proof.
              </p>
            </div>
          </div>

          {/* SAMPLE CERTIFICATE CALLOUT */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-white block">
                  Inspect an Authentic Graduate Certificate
                </strong>
                <span className="text-[11px] text-slate-400 font-mono">
                  Credential ID: RN-INT-2026-AIML-9F2B84 (Divyanshu Jethi, Chitkara University)
                </span>
              </div>
            </div>

            <Link
              href="/internship-bootcamp/verify/RN-INT-2026-AIML-9F2B84"
              className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs h-9 px-4 inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>View Live Credential</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* VIP DISCORD & MENTORSHIP BANNER */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
              <Users className="h-3.5 w-3.5" />
              <span>1,500+ Student Engineers &amp; Mentors</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Official RoleNest Internship VIP Discord
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Connect directly with domain mentors, ask questions in <code>#code-reviews</code>, participate in weekly live office hours, and team up for hackathons and capstone submissions.
            </p>
          </div>

          <a
            href="https://discord.gg/rolenest"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm px-6 py-4 shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2 shrink-0 transition-all hover:scale-105"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Join VIP Discord Server</span>
          </a>
        </div>
      </section>

    </div>
  );
}
