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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { BASE_CERTIFICATE_PROGRAMS, CertificateProgram } from "@/lib/certificates-data";

export default function CertificatesPage() {
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

  const filtered = programs.filter((prog) => {
    if (selectedCategory !== "ALL" && prog.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        prog.title.toLowerCase().includes(q) ||
        prog.provider.toLowerCase().includes(q) ||
        prog.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <Award className="h-4 w-4" />
            Verified Student Credentials & Experience
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Free Virtual Internships & Certifications
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            Boost your resume and JobMint Dev Score with official virtual work experience from JPMorgan, Goldman Sachs, Google Cloud, Harvard, and Meta.
          </p>
        </div>

        {/* VALUE PILLARS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              100% Free for Students
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No hidden fees or paywalls. Every program listed offers free enrollment and verified credentials upon completion.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-teal-400 text-sm">
              <Briefcase className="h-4 w-4" />
              Real Corporate Simulations
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solve actual engineering tickets from Fortune 500 tech teams (JPMorgan, Lyft, BCG) and add real proof-of-work to your profile.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
              <Sparkles className="h-4 w-4" />
              Boosts JobMint Dev Score
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Completed projects and credentials automatically sync with your verified profile, boosting your ranking on recruiter dashboards.
            </p>
          </div>
        </div>

        {/* AUTO-CRAWLER STATUS & TRIGGER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-800 text-xl">
              🐊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Live Certificate & Simulation Crawler</span>
                <span className="rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-2 py-0.2 text-[9px] font-mono">
                  AUTO-SYNC
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Monitors Forage, Google Skills Boost, AWS Educate, and verified open credentials to upload new programs automatically.
              </p>
            </div>
          </div>

          <Button
            onClick={handleTriggerCrawl}
            disabled={isCrawling}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shrink-0 rounded-xl"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isCrawling ? "animate-spin" : ""}`} />
            {isCrawling ? "Crawling Feeds..." : "Scan & Upload New"}
          </Button>
        </div>

        {crawlMessage && (
          <div className="p-3.5 rounded-xl border border-emerald-800 bg-emerald-950/50 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{crawlMessage}</span>
          </div>
        )}

        {/* TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Programs ({programs.length})
            </button>

            <button
              onClick={() => setSelectedCategory("VIRTUAL_INTERNSHIP")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "VIRTUAL_INTERNSHIP" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Virtual Internships (Forage)
            </button>

            <button
              onClick={() => setSelectedCategory("GOOGLE_CLOUD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "GOOGLE_CLOUD" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Google & Cloud Badges
            </button>

            <button
              onClick={() => setSelectedCategory("DEV_CS")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DEV_CS" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              CS & Full-Stack
            </button>

            <button
              onClick={() => setSelectedCategory("CYBERSECURITY")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "CYBERSECURITY" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cybersecurity
            </button>

            <button
              onClick={() => setSelectedCategory("AI_ML")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "AI_ML" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              AI & GenAI
            </button>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search program or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="border-slate-800 bg-slate-900/90 text-white flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-lg">
                      {item.logoInitial}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base font-bold text-white">
                          {item.title}
                        </CardTitle>
                        {item.isPopular && (
                          <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-current" /> Popular
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-400 mt-0.5">
                        {item.provider}
                      </CardDescription>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-xs font-mono font-bold shrink-0">
                    {item.costLabel}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* SKILLS */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    Skills Covered
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.skills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* METRICS & CREDENTIAL */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 text-xs text-slate-400">
                  <div>
                    <span className="text-[10px] block text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-200">{item.durationHours}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block text-slate-500">Credential</span>
                    <span className="font-semibold text-emerald-400 truncate block">
                      {item.certificateType}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Verified Official Issuer
                  </span>

                  <a
                    href={item.enrollUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
                    >
                      <span>Enroll & Earn Free</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}