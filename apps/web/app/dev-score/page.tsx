"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Github,
  Star,
  GitFork,
  ExternalLink,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Loader2,
  Code2,
  Layers,
  Zap,
  Play,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DemoSandboxModal } from "@/components/demo-sandbox-modal";

interface VerifiedRepo {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  updatedAt: string;
  matchedSkills: string[];
}

interface DevScoreResult {
  success: boolean;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicReposCount: number;
  totalStars: number;
  totalForks: number;
  devScore: number;
  percentile: string;
  scoreBreakdown: {
    momentum: number;
    depth: number;
    community: number;
    proofOfWork: number;
  };
  builderLevel: string;
  badgeEmoji: string;
  verifiedSkills: string[];
  highlightedProjects: VerifiedRepo[];
  verifiedAt: string;
  isDemoFallback?: boolean;
}

const SAMPLE_PROFILES = ["shadcn", "karpathy", "gaearon", "torvalds"];

export default function VerifiedDevScorePage() {
  const [username, setUsername] = useState("shadcn");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DevScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [attached, setAttached] = useState(false);

  // Sandbox state
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<{ title: string; url: string; githubUrl: string } | null>(null);

  const fetchScore = async (targetUsername: string) => {
    if (!targetUsername.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/verify?username=${encodeURIComponent(targetUsername.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to calculate Dev Score");
      }
      setResult(data);
      setUsername(data.username);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore("shadcn");
  }, []);

  const handleCopyBadge = () => {
    if (!result) return;
    const badgeMarkdown = `[![JobMint Verified Dev](https://img.shields.io/badge/JobMint%20Dev%20Score-${result.devScore}%2F1000-10b981?style=for-the-badge&logo=github)](https://jobmint.ritualdev.in/dev-score?user=${result.username})`;
    navigator.clipboard.writeText(badgeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttachToProfile = () => {
    if (!result) return;
    try {
      localStorage.setItem(
        "jobmint_verified_dev_score",
        JSON.stringify({
          username: result.username,
          devScore: result.devScore,
          percentile: result.percentile,
          verifiedSkills: result.verifiedSkills,
          verifiedAt: result.verifiedAt,
        })
      );
      setAttached(true);
      setTimeout(() => setAttached(false), 3000);
    } catch {}
  };

  const openSandbox = (title: string, url: string, githubUrl: string) => {
    setActiveProject({ title, url, githubUrl });
    setSandboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Proof-of-Work Verification Protocol
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            JobMint Verified Dev Score
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
            Kill fake resume buzzwords. Scan real GitHub commits, production code architecture, and live deployed web demos to prove actual engineering caliber.
          </p>

          {/* EXPLANATORY BANNER: ANYONE VS MINE */}
          <div className="mx-auto max-w-2xl rounded-2xl bg-white border border-slate-200 p-4 shadow-sm text-left flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">
                How does Dev Score work?
              </p>
              <p>
                • <strong>Public Preview:</strong> You can look up <em>any</em> developer&apos;s public GitHub profile (try your friends, top open-source contributors, or candidates) to inspect their real proof-of-work.
              </p>
              <p>
                • <strong>Your Applications:</strong> When you enter your own GitHub handle and click <strong>&quot;Attach Dev Score to My Applications&quot;</strong>, it binds your score to your JobMint profile so recruiters see verified proof of competence when reviewing your applications.
              </p>
            </div>
          </div>
        </div>

        {/* LOOKUP INPUT BAR */}
        <div className="mx-auto max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchScore(username);
            }}
            className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center text-slate-400 pl-2">
              <Github className="h-5 w-5 text-slate-700" />
            </div>
            <Input
              type="text"
              placeholder="Enter any GitHub username (e.g. torvalds, your handle)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 text-sm shadow-none"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl gap-2 shrink-0 shadow-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>Verify Score</span>
            </Button>
          </form>

          {/* QUICK SAMPLES */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Try sample builder:</span>
            {SAMPLE_PROFILES.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  setUsername(u);
                  fetchScore(u);
                }}
                className="text-slate-600 hover:text-emerald-600 font-mono transition-colors underline font-medium"
              >
                @{u}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-auto max-w-xl rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {/* SCORE DISPLAY */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
            
            {/* MAIN SCORE CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Profile Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={result.avatarUrl}
                    alt={result.name}
                    className="h-20 w-20 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-sm"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900">{result.name}</h2>
                      <span className="text-xs font-mono text-slate-500">@{result.username}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{result.bio}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Code2 className="h-3.5 w-3.5 text-emerald-600" />
                        {result.publicReposCount} Repos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        {result.totalStars} Stars
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <GitFork className="h-3.5 w-3.5 text-blue-500" />
                        {result.totalForks} Forks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Codebase-Verified Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    onClick={handleAttachToProfile}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-sm"
                  >
                    {attached ? (
                      <>
                        <Check className="h-4 w-4" /> Attached to My Applications!
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" /> Attach Dev Score to My Applications
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyBadge}
                    className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs gap-1.5 rounded-xl shadow-sm"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copied Markdown!" : "Copy README Badge"}</span>
                  </Button>
                </div>
              </div>

              {/* Gauge Score Graphic */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <span className="text-4xl">{result.badgeEmoji}</span>
                <div>
                  <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                    {result.devScore}
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    out of 1,000 Points
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-block rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
                    {result.builderLevel}
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">{result.percentile}</div>
                </div>

                {/* Score Pillar Bars */}
                <div className="w-full space-y-2 pt-3 border-t border-slate-200 text-left text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Activity & Momentum</span>
                      <span className="font-mono text-emerald-600 font-bold">{result.scoreBreakdown.momentum}/250</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(result.scoreBreakdown.momentum / 250) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Stack Depth</span>
                      <span className="font-mono text-emerald-600 font-bold">{result.scoreBreakdown.depth}/250</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${(result.scoreBreakdown.depth / 250) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Proof-of-Work Demos</span>
                      <span className="font-mono text-emerald-600 font-bold">{result.scoreBreakdown.proofOfWork}/250</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${(result.scoreBreakdown.proofOfWork / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGHLIGHTED REPOSITORIES & DEMO SANDBOXES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    Verified Repositories & Proof-of-Work Demos
                  </h3>
                  <p className="text-xs text-slate-600">
                    Test live applications directly in your browser without leaving JobMint.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.highlightedProjects.map((repo) => (
                  <Card
                    key={repo.name}
                    className="border-slate-200 bg-white text-slate-900 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-sm"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            {repo.name}
                            {repo.homepage && (
                              <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-mono font-semibold">
                                Live Demo
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1">
                            {repo.description}
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="flex items-center gap-1 text-xs font-mono text-slate-500 font-medium">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            {repo.stars}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Skills in repo */}
                      <div className="flex flex-wrap gap-1">
                        {repo.matchedSkills.map((sk) => (
                          <span
                            key={sk}
                            className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-mono"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                        >
                          <Github className="h-3.5 w-3.5" /> Source
                        </a>

                        {repo.homepage ? (
                          <Button
                            size="sm"
                            onClick={() => openSandbox(repo.name, repo.homepage!, repo.url)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-3 rounded-lg gap-1.5 shadow-sm"
                          >
                            <Play className="h-3 w-3 fill-current" /> Launch 1-Click Sandbox
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              openSandbox(
                                repo.name,
                                `https://htmlpreview.github.io/?${repo.url}`,
                                repo.url
                              )
                            }
                            className="text-slate-600 hover:text-slate-900 text-xs h-8 px-2"
                          >
                            Inspect Repo Sandbox
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 1-Click Interactive Demo Sandbox Modal */}
      {activeProject && (
        <DemoSandboxModal
          isOpen={sandboxOpen}
          onClose={() => setSandboxOpen(false)}
          projectTitle={activeProject.title}
          projectUrl={activeProject.url}
          githubUrl={activeProject.githubUrl}
          candidateName={result?.name || username}
        />
      )}
    </div>
  );
}
