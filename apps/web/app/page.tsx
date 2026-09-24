import Link from "next/link";
import { Search, MapPin, Sparkles, ArrowRight, BookOpen, CheckCircle, ShieldCheck, Zap, TrendingUp, FileText } from "lucide-react";
import { APP_CONFIG } from "@repo/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruthTellerPreview } from "@/components/truth-teller-preview";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Free Forever for Students & Freshers</span>
              </div>
              <Link
                href="/resume/builder"
                className="group inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 hover:bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 transition-all shadow-sm"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>Harvard ATS Resume Builder</span>
                <span className="rounded bg-blue-200/60 px-1 py-0.2 text-[9px] text-blue-800 uppercase font-mono">LaTeX &amp; PDF</span>
                <ArrowRight className="h-3 w-3 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Find Opportunities Without Being Left{" "}
              <span className="text-emerald-600">Guessing</span>.
            </h1>
            
            <p className="text-lg text-slate-600 sm:text-xl">
              Apply to verified internships and junior tech roles. Know exactly when your resume is viewed, why you match, and where to learn missing skills for free.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:flex sm:items-center sm:gap-2">
              <div className="flex flex-1 items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skill (e.g. React, AI, Python)..."
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-1 items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <Link href="/jobs" className="block sm:inline-block mt-2 sm:mt-0">
                <Button size="lg" className="w-full sm:w-auto font-semibold gap-2">
                  Find Jobs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* QUICK POPULAR PILLS */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              <Link href="/jobs?filter=remote" className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 font-medium text-slate-700">
                Remote Internships
              </Link>
              <Link href="/jobs?filter=fresher" className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 font-medium text-slate-700">
                0-1 Year Experience
              </Link>
              <Link href="/jobs?filter=ai" className="rounded-full bg-emerald-50 hover:bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
                AI / Machine Learning
              </Link>
              <Link href="/jobs?filter=fullstack" className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 font-medium text-slate-700">
                React & Node.js
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE TRUTH TELLER SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TruthTellerPreview />
      </section>

      {/* 1-CLICK HARVARD / ATS RESUME BUILDER SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>Flagship Career Tool • 100% Free Forever</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                1-Click Harvard / ATS <br />
                <span className="bg-gradient-to-r from-blue-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Resume Builder &amp; LaTeX Export
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Stop getting filtered by algorithmic Applicant Tracking Systems. Build an industry-standard, single-column resume recommended by Harvard OCS and engineering hiring managers at Google, Microsoft, and Uber.
              </p>

              {/* Feature Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-start gap-2.5 text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">100% ATS Single-Column</strong>
                    <span className="text-slate-400">Zero multi-column or table parsing traps</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Live LaTeX &amp; PDF Export</strong>
                    <span className="text-slate-400">Copy Jake&apos;s Resume .tex code or 1-click print</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Auto-DevScore &amp; GitHub Sync</strong>
                    <span className="text-slate-400">Embed verified commits &amp; solved badges</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Zero Watermarks or Paywalls</strong>
                    <span className="text-slate-400">No premium tier, no subscription traps</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link href="/resume/builder">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black gap-2 shadow-lg shadow-emerald-950">
                    <FileText className="h-4 w-4" />
                    Build Your ATS Resume (Free)
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/resume/assistant">
                  <Button variant="outline" size="lg" className="border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    AI Resume Auditor
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-slate-700 bg-white p-6 text-slate-900 shadow-2xl scale-[0.95] sm:scale-100 transition-transform font-serif select-none">
                {/* Header watermark pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-sans font-bold text-emerald-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  98/100 ATS Score
                </div>

                {/* Miniature resume representation */}
                <div className="text-center pb-3 border-b border-slate-300">
                  <div className="text-lg font-bold tracking-tight text-slate-900 font-sans">John Doe</div>
                  <div className="text-[10px] text-slate-600 font-sans mt-0.5">
                    San Francisco, CA • john.doe@example.com • github.com/johndoe • linkedin.com/in/johndoe
                  </div>
                </div>

                {/* Education */}
                <div className="pt-2.5">
                  <div className="text-[10px] font-bold font-sans tracking-wider uppercase border-b border-slate-300 pb-0.5 text-slate-800">
                    Education
                  </div>
                  <div className="flex justify-between items-baseline pt-1 text-[11px] font-sans">
                    <span className="font-bold text-slate-900">State University of Technology</span>
                    <span className="text-[10px] text-slate-500">2021 – 2025</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-sans italic">
                    B.S. in Computer Science &amp; Engineering • GPA: 3.9 / 4.0
                  </div>
                </div>

                {/* Experience */}
                <div className="pt-2.5">
                  <div className="text-[10px] font-bold font-sans tracking-wider uppercase border-b border-slate-300 pb-0.5 text-slate-800">
                    Experience
                  </div>
                  <div className="flex justify-between items-baseline pt-1 text-[11px] font-sans">
                    <span className="font-bold text-slate-900">Software Engineering Intern</span>
                    <span className="text-[10px] text-slate-500">May 2024 – Aug 2024</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-sans italic">Acme Cloud Systems • Remote</div>
                  <ul className="list-disc pl-4 text-[9.5px] text-slate-700 font-sans space-y-0.5 pt-1">
                    <li>Architected distributed microservices with Redis streams reducing API latency by 42%.</li>
                    <li>Engineered real-time audit logging pipeline with cryptographic signature verification.</li>
                  </ul>
                </div>

                {/* Projects */}
                <div className="pt-2.5">
                  <div className="text-[10px] font-bold font-sans tracking-wider uppercase border-b border-slate-300 pb-0.5 text-slate-800">
                    Technical Projects
                  </div>
                  <div className="flex justify-between items-baseline pt-1 text-[11px] font-sans">
                    <span className="font-bold text-slate-900">Distributed Task Scheduler &amp; Queue</span>
                    <span className="text-[10px] text-slate-500">TypeScript, Go, Redis</span>
                  </div>
                  <ul className="list-disc pl-4 text-[9.5px] text-slate-700 font-sans space-y-0.5 pt-1">
                    <li>Engineered high-throughput task scheduler processing 50,000+ jobs/min.</li>
                  </ul>
                </div>

                {/* Action overlay bar */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-sans">
                  <span className="text-[11px] font-mono text-slate-500">Harvard Standard (LaTeX / PDF)</span>
                  <Link
                    href="/resume/builder"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Open Editor →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLAINABLE MATCH & "LEARN MISSING SKILLS" BRIDGE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-semibold">
                <Zap className="h-3.5 w-3.5" /> Explainable Matching Engine
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                We Don&apos;t Just Reject You. <br />
                <span className="text-emerald-400">We Teach You What&apos;s Missing.</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Traditional job portals leave you wondering why you never got an interview. JobMint breaks down your match with exact mathematical transparency and links you directly to 100% free courses to bridge the gap.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link href="/roadmaps">
                  <Button variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold">
                    <BookOpen className="h-4 w-4 mr-2" /> Explore Free Roadmaps
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold shadow-sm">
                    Create Free Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Card Mockup */}
            <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-6 text-slate-100 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400">Target Role</span>
                  <h4 className="font-bold text-lg text-white">AI / Deep Learning Intern</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">76%</div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Match Score</span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Python & NumPy (Strong match)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Git & Open Source Contributions</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-amber-950/40 border border-amber-800/60 p-2.5 text-amber-200 mt-3">
                  <div>
                    <span className="font-semibold block">Missing: PyTorch & Tensor basics</span>
                    <span className="text-[11px] text-amber-300/80">Required by 82% of similar companies</span>
                  </div>
                  <Link
                    href="/roadmaps/ai-engineer"
                    className="rounded bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/30 whitespace-nowrap"
                  >
                    Learn Free (3h guide) →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR EMPLOYERS CALLOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4" /> Zero Junk Applications
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Hiring Interns or Junior Engineers?
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
            Post your internship in 2 minutes. Receive pre-matched candidates with verified project portfolios, and build a high-trust employer brand.
          </p>
          <div className="pt-2">
            <Link href="/employer/jobs/new">
              <Button size="lg" className="font-bold">
                Post an Opportunity for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
