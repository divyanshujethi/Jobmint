import Link from "next/link";
import { Search, MapPin, Sparkles, ArrowRight, BookOpen, CheckCircle, ShieldCheck, Zap, TrendingUp } from "lucide-react";
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
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Free Forever for Students & Freshers</span>
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
                  <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-800">
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
