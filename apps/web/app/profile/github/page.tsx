"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Search,
} from "lucide-react";

interface VerifiedRepo {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
  matchedSkills: string[];
}

interface GitHubProfileResult {
  success: boolean;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicReposCount: number;
  totalStars: number;
  builderLevel: string;
  badgeEmoji: string;
  verifiedSkills: string[];
  highlightedProjects: VerifiedRepo[];
  verifiedAt: string;
  isDemoFallback?: boolean;
}

const SAMPLE_USERNAMES = ["karpathy", "shadcn", "gaearon", "torvalds"];

export default function GitHubVerifierPage() {
  const [username, setUsername] = useState("karpathy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GitHubProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleVerify = async (targetUsername?: string) => {
    const userToFetch = targetUsername || username;
    if (!userToFetch.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github/verify?username=${encodeURIComponent(userToFetch)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify GitHub profile");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while contacting the GitHub API.");
    } finally {
      setLoading(false);
    }
  };

  const copyBadgeText = () => {
    if (!result) return;
    const shareText = `🛡️ JobMint Verified GitHub Builder: ${result.name} (@${result.username}) • ${result.builderLevel} • ${result.verifiedSkills.join(", ")}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumbs & Header */}
        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
            <Link href="/jobs" className="hover:text-emerald-400">JobMint</Link>
            <span>/</span>
            <span className="text-neutral-200">GitHub Project Verifier</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Github className="w-8 h-8 text-emerald-400" />
            Automated GitHub Project Verifier
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Prove your real coding ability. We inspect your public repos, stars, and code commits to award verified skill badges. 100% Free via public GitHub API.
          </p>
        </div>

        {/* Input Bar Card */}
        <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-4">
          <label className="text-sm font-semibold text-neutral-200 block">
            Enter your GitHub Username:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 font-mono text-sm">
                github.com/
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-32 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={loading || !username.trim()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-emerald-500/10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify My Projects</span>
                </>
              )}
            </button>
          </div>

          {/* Sample quick selectors */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-neutral-400 font-medium">Try popular examples:</span>
            {SAMPLE_USERNAMES.map((u) => (
              <button
                key={u}
                onClick={() => {
                  setUsername(u);
                  handleVerify(u);
                }}
                className="text-xs font-mono bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white px-2.5 py-1 rounded-lg border border-neutral-700/60 transition-colors"
              >
                @{u}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Verification Result */}
        {result && (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={result.avatarUrl}
                    alt={result.name}
                    className="w-16 h-16 rounded-2xl border-2 border-emerald-500/40 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{result.name}</h2>
                      <span className="text-xs font-mono text-neutral-400">@{result.username}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 max-w-md">{result.bio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="bg-neutral-950 border border-emerald-800/50 px-4 py-2.5 rounded-xl flex items-center gap-2.5">
                    <span className="text-xl">{result.badgeEmoji}</span>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                        Builder Status
                      </div>
                      <div className="text-xs font-bold text-emerald-400">{result.builderLevel}</div>
                    </div>
                  </div>

                  <button
                    onClick={copyBadgeText}
                    className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-300 hover:text-white transition-colors"
                    title="Copy Verified Badge"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Verified Metrics Counter */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800 text-center font-mono">
                <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                  <div className="text-xs text-neutral-400">Public Repos</div>
                  <div className="text-lg font-bold text-white mt-0.5">{result.publicReposCount}</div>
                </div>
                <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                  <div className="text-xs text-neutral-400">Total Stars Earned</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">★ {result.totalStars}</div>
                </div>
                <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                  <div className="text-xs text-neutral-400">Verified Skills</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {result.verifiedSkills.length}
                  </div>
                </div>
              </div>

              {/* Verified Skills Tags */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                  Skills Verified Through Real Code:
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.verifiedSkills.length === 0 ? (
                    <span className="text-xs text-neutral-500">No canonical skills matched in public repos.</span>
                  ) : (
                    result.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 text-xs font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 px-3 py-1 rounded-lg"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Highlighted Projects Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Verified Repositories ({result.highlightedProjects.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.highlightedProjects.map((repo) => (
                  <div
                    key={repo.name}
                    className="bg-neutral-900/70 border border-neutral-800 p-5 rounded-xl space-y-3 flex flex-col justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-sm text-white hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                        >
                          {repo.name}
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                        </a>
                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                          {repo.stars > 0 && (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Star className="w-3 h-3 fill-current" /> {repo.stars}
                            </span>
                          )}
                          {repo.forks > 0 && (
                            <span className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" /> {repo.forks}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                      {repo.language ? (
                        <span className="font-mono text-emerald-400 bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-800">
                          {repo.language}
                        </span>
                      ) : (
                        <span className="text-neutral-600 font-mono">Multi-language</span>
                      )}
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills Promotion */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-800/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Want to add more verified skills to your profile?
                </h4>
                <p className="text-xs text-neutral-400">
                  Follow our 100% free career roadmaps and build capstone projects that get verified here.
                </p>
              </div>
              <Link
                href="/roadmaps"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                Browse Free Roadmaps <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}