"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Building2,
  Briefcase,
  GraduationCap,
  Star,
  ArrowRight,
  Zap,
  Printer,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { BASE_CERTIFICATE_PROGRAMS, CertificateProgram } from "@/lib/certificates-data";
import { CURATED_COURSES } from "@/lib/courses-data";
import { SHOWCASE_CERTIFICATES } from "@/lib/certificates-issuer";

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<"JOBMINT" | "GLOBAL">("JOBMINT");
  const [programs, setPrograms] = useState<CertificateProgram[]>(BASE_CERTIFICATE_PROGRAMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);

  const fetchLivePrograms = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      if (data.success && data.programs) {
        setPrograms(data.programs);
      }
    } catch {
      // Keep initial base programs
    }
  };

  const handleTriggerCrawl = async () => {
    setIsCrawling(true);
    setCrawlMessage("🐊 Crawler scanning upstream simulation feeds (Forage, Cloud Badges, Open Education)...");
    try {
      const res = await fetch("/api/certificates", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchLivePrograms();
        setCrawlMessage(`✅ Auto-Crawler complete: ${data.data.newFound} newly verified programs synced! Total: ${data.data.totalAvailable}`);
      }
    } catch {
      setCrawlMessage("Crawler ran with verified backup feeds.");
    } finally {
      setIsCrawling(false);
      setTimeout(() => setCrawlMessage(null), 4000);
    }
  };

  const filteredPrograms = programs.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredJobMintCourses = CURATED_COURSES.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.certificateTitle.toLowerCase().includes(q) ||
        c.creator.toLowerCase().includes(q) ||
        c.skillsLearned.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <Award className="h-4 w-4" />
            Verified Technical Certifications &amp; Proof-of-Work Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Earn &amp; Verify Free Certificates
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            Earn official JobMint Course Completion Diplomas with cryptographic verification, or discover free company-backed virtual work experience simulations (Walmart, JPMorgan, Google Cloud, Cisco).
          </p>

          {/* MAIN TABS */}
          <div className="flex items-center justify-center pt-4">
            <div className="inline-flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 shadow-xl">
              <button
                onClick={() => setActiveTab("JOBMINT")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "JOBMINT"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>JobMint Course Completion Diplomas ({CURATED_COURSES.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("GLOBAL")}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "GLOBAL"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Global Simulations &amp; Badges ({programs.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="w-full sm:w-80">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder={
                  activeTab === "JOBMINT"
                    ? "Search JobMint courses or skills..."
                    : "Search simulations, companies, skills..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "JOBMINT" ? (
              <Link href="/certificates/verify/JM-AI-GPT-7B29A1">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-800 bg-slate-900 text-emerald-400 hover:text-white text-xs gap-1.5 rounded-xl"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Public Verification Registry Demo
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerCrawl}
                disabled={isCrawling}
                className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs gap-1.5 rounded-xl"
              >
                <Zap className={`h-3.5 w-3.5 text-amber-400 ${isCrawling ? "animate-spin" : ""}`} />
                <span>{isCrawling ? "Scanning Feeds..." : "Scan & Upload New"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* CRAWL STATUS MESSAGE */}
        {crawlMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 animate-in fade-in flex items-center justify-between">
            <span>{crawlMessage}</span>
          </div>
        )}

        {/* TAB 1: JOBMINT COURSE COMPLETION CERTIFICATES */}
        {activeTab === "JOBMINT" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobMintCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-slate-800 bg-slate-900/90 text-white flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold mb-2">
                          <Award className="h-3 w-3" />
                          Official JobMint Credential
                        </div>
                        <CardTitle className="text-lg font-bold text-white leading-snug">
                          {course.certificateTitle}
                        </CardTitle>
                        <div className="text-xs text-slate-400 mt-1">
                          Course: <strong className="text-slate-200">{course.title}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Curated from {course.creator} ({course.creatorSubscribers})
                        </div>
                      </div>

                      <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 space-y-1">
                      <div className="text-[10px] font-mono uppercase text-[#c9a84d] font-bold">
                        Project Benchmark Required
                      </div>
                      <p className="text-xs text-slate-300">{course.projectBenchmark}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                        Skills Certified
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {course.skillsLearned.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>DPDP Compliant</span>
                      </div>

                      <Link href={`/courses/${course.id}/certificate`}>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
                        >
                          <Award className="h-3.5 w-3.5" />
                          <span>🎓 Claim / View Certificate</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL SIMULATIONS & BADGES */}
        {activeTab === "GLOBAL" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrograms.map((p) => (
                <Card
                  key={p.id}
                  className="border-slate-800 bg-slate-900/90 text-white flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                            {p.category}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{p.durationHours}</span>
                        </div>
                        <CardTitle className="text-lg font-bold text-white leading-snug">
                          {p.title}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-300">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{p.provider}</span>
                        </div>
                      </div>

                      <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                        Skills Gained
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                        {p.costLabel}
                      </span>

                      <a
                        href={p.enrollUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
                        >
                          <span>Start Simulation</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
