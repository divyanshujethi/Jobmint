"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Lock,
  KeyRound,
  FileCode,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface GitHubProfileResult {
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
  builderLevel: string;
  badgeEmoji: string;
  verifiedSkills: string[];
  highlightedProjects: VerifiedRepo[];
  verifiedAt: string;
  isDemoFallback?: boolean;
  // Security & Ownership
  isOwner: boolean;
  ownershipStatus: "VERIFIED_OAUTH" | "VERIFIED_EMAIL" | "VERIFIED_BIO_TOKEN" | "VERIFIED_REPO_TOKEN" | "UNVERIFIED_PUBLIC_PREVIEW";
  ownerExplanation: string;
  verificationToken: string;
  authenticatedGithubUsername: string | null;
  isAuthenticated: boolean;
}

const PUBLIC_INSPECT_EXAMPLES = ["karpathy", "shadcn", "gaearon", "torvalds"];

export default function GitHubVerifierPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GitHubProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showClaimGuide, setShowClaimGuide] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSessionUser(data.user);
          const ghUser = (data.user as any).githubUsername;
          if (ghUser) {
            setUsername(ghUser);
            handleVerify(ghUser);
            return;
          }
        }
        // Default to karpathy for public inspection preview if not logged in
        setUsername("karpathy");
        handleVerify("karpathy");
      })
      .catch(() => {
        setUsername("karpathy");
        handleVerify("karpathy");
      });
  }, []);

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
      if (!data.isOwner) {
        setShowClaimGuide(true);
      } else {
        setShowClaimGuide(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while contacting the GitHub API.");
    } finally {
      setLoading(false);
    }
  };

  const copyBadgeText = () => {
    if (!result || !result.isOwner) return;
    const shareText = `🛡️ Role Nest Verified GitHub Builder: ${result.name} (@${result.username}) • ${result.builderLevel} • ${result.verifiedSkills.join(", ")}`;
    navigator.clipboard.writeText(shareText);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const copyVerificationToken = () => {
    if (!result?.verificationToken) return;
    navigator.clipboard.writeText(result.verificationToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Breadcrumbs & Header */}
        <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">Role Nest</Link>
              <span>/</span>
              <Link href="/dev-score" className="hover:text-emerald-400">DevScore</Link>
              <span>/</span>
              <span className="text-neutral-200 font-semibold">GitHub Project Verifier</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Github className="w-8 h-8 text-emerald-400" />
              Automated GitHub Project Verifier
            </h1>
            <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
              Cryptographically verify real GitHub code, commits, and project ownership. Prevents claiming third-party repositories without verified authorization.
            </p>
          </div>

          {/* Session Indicator */}
          {sessionUser ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 flex items-center gap-3 self-start sm:self-auto text-xs">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-neutral-400 text-[10px] font-mono">Role Nest Account</div>
                <div className="font-bold text-white truncate max-w-[160px]">
                  {sessionUser.name || sessionUser.email}
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => signIn("github", { callbackUrl: "/profile/github" })}
              className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl self-start sm:self-auto"
            >
              Sign In with GitHub
            </Button>
          )}
        </div>

        {/* Input Bar Card */}
        <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-neutral-200 block">
              Enter GitHub Username to Inspect or Verify:
            </label>
            {sessionUser?.githubUsername && (
              <button
                onClick={() => {
                  setUsername(sessionUser.githubUsername);
                  handleVerify(sessionUser.githubUsername);
                }}
                className="text-xs text-emerald-400 hover:underline font-mono"
              >
                Use my GitHub (@{sessionUser.githubUsername})
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 font-mono text-sm">
                github.com/
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="username"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-32 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={loading || !username.trim()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Auditing Code &amp; Ownership...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Audit &amp; Verify</span>
                </>
              )}
            </button>
          </div>

          {/* Sample quick selectors with clarification */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-neutral-500 font-medium">Inspect public examples:</span>
            {PUBLIC_INSPECT_EXAMPLES.map((u) => (
              <button
                key={u}
                onClick={() => {
                  setUsername(u);
                  handleVerify(u);
                }}
                className="text-xs font-mono bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg border border-neutral-700/40 transition-colors"
              >
                @{u} (Public Code)
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800 rounded-2xl p-4 text-sm text-red-300 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Verification Result */}
        {result && (
          <div className="space-y-6">
            
            {/* OWNERSHIP STATUS BANNER */}
            {result.isOwner ? (
              <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/50">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                        Cryptographically Verified Owner
                      </span>
                      <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded-full">
                        {result.ownershipStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {result.ownerExplanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href="/resume/builder">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shadow-xs">
                      Add to Resume &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 sm:p-5 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                          Public Repository Inspection (Ownership Unverified)
                        </span>
                        <span className="bg-amber-900/60 text-amber-300 border border-amber-700 text-[10px] font-mono px-2 py-0.5 rounded-full">
                          UNVERIFIED
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/90 mt-1 max-w-2xl leading-relaxed">
                        You are viewing public repository metrics for <strong>@{result.username}</strong>. Anyone can inspect open-source code, but <strong>you cannot claim badges or attach these projects to your Role Nest profile</strong> without proving ownership of this GitHub account.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowClaimGuide(!showClaimGuide)}
                    className="px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 font-mono text-xs font-bold transition-colors shrink-0"
                  >
                    {showClaimGuide ? "Hide Claim Guide" : "Prove Ownership"}
                  </button>
                </div>

                {/* Claim Ownership Instructions Box */}
                {showClaimGuide && (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-4 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <KeyRound className="h-4 w-4 text-amber-400" />
                      Two Ways to Prove Ownership of @{result.username}:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Method 1: OAuth Sign-in */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-2">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>Method 1:</span> 1-Click GitHub OAuth
                        </div>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          Sign into Role Nest using the GitHub account for <strong>@{result.username}</strong>. We automatically verify ownership with zero setup.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => signIn("github", { callbackUrl: `/profile/github?username=${result.username}` })}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg mt-2"
                        >
                          Sign In as @{result.username}
                        </Button>
                      </div>

                      {/* Method 2: Bio Token Verification */}
                      <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900 space-y-2">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>Method 2:</span> Challenge Verification Token
                        </div>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          Add your unique Role Nest token to your GitHub Bio (at github.com/settings/profile):
                        </p>
                        <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                          <code className="text-emerald-400 font-mono text-[11px] select-all truncate flex-1">
                            {result.verificationToken}
                          </code>
                          <button
                            onClick={copyVerificationToken}
                            className="p-1 text-neutral-400 hover:text-white shrink-0"
                            title="Copy Token"
                          >
                            {copiedToken ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleVerify(result.username)}
                          disabled={loading}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg mt-2 flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="h-3 w-3" /> Re-check Bio for Token
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Overview Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
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
                  <div className="bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
                    <span className="text-xl">{result.badgeEmoji}</span>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                        Builder Status
                      </div>
                      <div className="text-xs font-bold text-emerald-400">
                        {result.builderLevel} {!result.isOwner && "(Public)"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={copyBadgeText}
                    disabled={!result.isOwner}
                    className={`p-2.5 rounded-2xl border transition-colors ${
                      result.isOwner
                        ? "bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                        : "bg-neutral-950 border-neutral-800 text-neutral-600 cursor-not-allowed opacity-50"
                    }`}
                    title={result.isOwner ? "Copy Verified Badge" : "Cannot copy badge for unverified profile"}
                  >
                    {copiedBadge ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Verified Metrics Counter */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800 text-center font-mono">
                <div className="bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800">
                  <div className="text-xs text-neutral-400">Public Repos</div>
                  <div className="text-lg font-bold text-white mt-0.5">{result.publicReposCount}</div>
                </div>
                <div className="bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800">
                  <div className="text-xs text-neutral-400">Total Stars Earned</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">★ {result.totalStars}</div>
                </div>
                <div className="bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800">
                  <div className="text-xs text-neutral-400">
                    {result.isOwner ? "Verified Skills" : "Detected Skills"}
                  </div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {result.verifiedSkills.length}
                  </div>
                </div>
              </div>

              {/* Verified Skills Tags */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>
                    {result.isOwner ? "Skills Verified Through Real Code:" : "Public Technologies Detected in Code:"}
                  </span>
                  {!result.isOwner && (
                    <span className="text-[10px] text-amber-400 font-normal">
                      (Unverified until ownership proven)
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.verifiedSkills.length === 0 ? (
                    <span className="text-xs text-neutral-500">No canonical skills matched in public repos.</span>
                  ) : (
                    result.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg border ${
                          result.isOwner
                            ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60"
                            : "bg-neutral-950 text-neutral-400 border-neutral-800"
                        }`}
                      >
                        {result.isOwner ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Highlighted Projects Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Audited Repositories ({result.highlightedProjects.length})
                </h3>
                {result.isOwner ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All Repositories Verified
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400">
                    Read-Only Code Audit
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.highlightedProjects.map((repo) => (
                  <div
                    key={repo.name}
                    className="bg-neutral-900/70 border border-neutral-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:border-neutral-700 transition-colors"
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

            {/* Promotion / Roadmaps Link */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-800/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Want to verify more skills on your profile?
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
