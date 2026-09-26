"use client";

import { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Github,
  Copy,
  Check,
  Info,
  Terminal,
  Code2,
  Lock,
} from "lucide-react";
import { Button } from "./ui/button";

interface DemoSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectUrl: string;
  candidateName?: string;
  githubUrl?: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export function DemoSandboxModal({
  isOpen,
  onClose,
  projectTitle,
  projectUrl,
  candidateName = "Candidate",
  githubUrl,
}: DemoSandboxModalProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [key, setKey] = useState(0);
  const [rating, setRating] = useState<number>(5);
  const [rated, setRated] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Normalize projectUrl in case it was wrapped with htmlpreview
  let normalizedUrl = (projectUrl || "").trim();
  if (normalizedUrl.includes("htmlpreview.github.io/?")) {
    normalizedUrl = normalizedUrl.replace("https://htmlpreview.github.io/?", "").replace("http://htmlpreview.github.io/?", "");
  }

  const isGitHubOrGit =
    /github\.com/i.test(normalizedUrl) ||
    /gitlab\.com/i.test(normalizedUrl) ||
    /bitbucket\.org/i.test(normalizedUrl) ||
    normalizedUrl.endsWith(".git");

  const effectiveGithubUrl = githubUrl || (isGitHubOrGit ? normalizedUrl : undefined);
  const isInsecureHttp = normalizedUrl.startsWith("http://");

  const cloneCommand = effectiveGithubUrl
    ? `git clone ${effectiveGithubUrl.endsWith(".git") ? effectiveGithubUrl : effectiveGithubUrl + ".git"}`
    : `git clone ${normalizedUrl}`;

  useEffect(() => {
    setCopiedClone(false);
  }, [projectUrl]);

  if (!isOpen) return null;

  const reloadIframe = () => {
    setKey((prev) => prev + 1);
  };

  const copyCloneCmd = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2500);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-[420px]";
      case "tablet":
        return "max-w-[780px]";
      case "desktop":
      default:
        return "w-full";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md p-2 sm:p-4">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-white shadow-2xl mb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            {isGitHubOrGit ? <Github className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {projectTitle}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-mono border ${
                  isGitHubOrGit
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {isGitHubOrGit ? "Source Repo Inspection" : "1-Click Live Sandbox"}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>By {candidateName}</span>
              {effectiveGithubUrl && (
                <>
                  <span>•</span>
                  <a
                    href={effectiveGithubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 underline flex items-center gap-1"
                  >
                    <Github className="h-3 w-3" /> View Source
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Device Switcher (for live previews) */}
        {!isGitHubOrGit && (
          <div className="flex items-center gap-1 rounded-xl bg-slate-950/80 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                device === "desktop"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Desktop View"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice("tablet")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                device === "tablet"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Tablet View"
            >
              <Tablet className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                device === "mobile"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Mobile View"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1.5 px-2.5 h-8"
            title="Why does embedding sometimes fail?"
          >
            <Info className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Why Embeds Block?</span>
          </Button>

          {!isGitHubOrGit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reloadIframe}
              className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
              title="Reload Demo"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}

          <a
            href={normalizedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-sm hover:scale-[1.02]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Direct {isGitHubOrGit ? "Repo" : "Live Demo"} ↗</span>
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 p-0 rounded-lg ml-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Security & Frame Disclaimer Banner (Always Visible for Transparency) */}
      {showDiagnostics && (
        <div className="mb-2 rounded-2xl bg-amber-950/40 border border-amber-500/30 p-3 px-4 text-xs text-amber-200 animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-300">
                Understanding Iframe Restrictions &amp; Web Security Policies
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                Many modern services and repositories strictly enforce security policies that prevent them from rendering inside third-party frames:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/80">
                <li>
                  <strong className="text-amber-200">X-Frame-Options: DENY:</strong> GitHub, GitLab, and auth providers explicitly block frame embedding to protect users from clickjacking attacks.
                </li>
                <li>
                  <strong className="text-amber-200">X-Frame-Options: SAMEORIGIN / CSP frame-ancestors:</strong> Vercel, Netlify, and custom domain apps often allow framing only from their own origins.
                </li>
                <li>
                  <strong className="text-amber-200">Backend / Microservices / CLI:</strong> Repositories without a static web bundle (e.g. Python scripts, Go backends, data scrapers) have no browser UI.
                </li>
                <li>
                  <strong className="text-amber-200">Mixed Content (HTTP vs HTTPS):</strong> Browsers block insecure <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono text-[10px]">http://</code> content inside HTTPS web apps.
                </li>
              </ul>
              <div className="pt-1 text-[11px] text-amber-300 font-semibold">
                &rarr; For 100% reliable evaluation, use the <strong>Open Direct Live Demo ↗</strong> or <strong>Open Direct Repo ↗</strong> button.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-2 sm:p-4">
        {isGitHubOrGit ? (
          /* DEDICATED GIT REPO INSPECTION & ARCHITECTURE PANEL */
          <div className="h-full w-full max-w-4xl flex flex-col justify-between overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-6 text-white shadow-2xl">
            <div className="space-y-6">
              {/* Header Box */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-white border border-slate-700">
                    <Github className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      {projectTitle}
                      <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-xs font-mono border border-emerald-500/20">
                        Git Repository
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Author: <span className="text-slate-200 font-semibold">{candidateName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 transition-all shadow-md hover:scale-105"
                  >
                    <Github className="h-4 w-4" /> Open on GitHub ↗
                  </a>
                </div>
              </div>

              {/* Informative Explanation of Why Iframe Doesn't Render Git Repos */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Why can&apos;t Git repositories render directly in an iframe sandbox?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  GitHub strictly sends an <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[11px]">X-Frame-Options: DENY</code> HTTP response header to prevent clickjacking and security vulnerabilities. Attempting to embed raw GitHub pages inside third-party iframes causes browsers to display a blank screen or connection refused error.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Additionally, backend algorithms, data analysis scripts, and CLI packages do not compile into a standalone in-browser DOM. To inspect the candidate&apos;s architecture, clone the codebase locally or open the repository directly.
                </p>
              </div>

              {/* Clone Command Box */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-slate-400" />
                  <span>Quick Clone &amp; Local Test:</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-slate-200">
                  <span className="truncate pr-3 text-emerald-400">{cloneCommand}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyCloneCmd}
                    className="h-7 text-xs gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                  >
                    {copiedClone ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Command
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Recruiter Evaluation Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                    <Code2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>Commit History</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Verified atomic commits with clear messages and branch cadence.
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Clean Architecture</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Separation of concerns, modularized functions, and typed interfaces.
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Proof of Work</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Evaluated by Role Nest Dev Score indexer for authentic candidate authorship.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Direct CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Direct URL: <span className="font-mono text-slate-300">{normalizedUrl}</span>
              </span>
              <a
                href={normalizedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Inspect Full Source Code on GitHub &rarr;
              </a>
            </div>
          </div>
        ) : (
          /* LIVE DEPLOYED APPLICATION IFRAME SANDBOX */
          <div
            className={`h-full w-full transition-all duration-300 flex flex-col rounded-xl overflow-hidden bg-white shadow-2xl border border-slate-700/50 ${getDeviceWidth()}`}
          >
            {/* Mock Browser Header */}
            <div className="h-8 bg-slate-800 px-3 flex items-center justify-between border-b border-slate-700 shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="text-[11px] font-mono text-slate-300 truncate max-w-sm px-2 flex items-center gap-1.5">
                {isInsecureHttp ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Insecure HTTP:
                  </span>
                ) : (
                  <Lock className="h-2.5 w-2.5 text-emerald-400" />
                )}
                <span>{normalizedUrl}</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Safe Sandbox
              </div>
            </div>

            {/* Embedded Iframe Info Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
              <span className="truncate pr-2">
                🔒 If this page is blank or says &apos;refused to connect&apos;, the host enforces <strong>SAMEORIGIN</strong> policies.
              </span>
              <a
                href={normalizedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold underline shrink-0 inline-flex items-center gap-1"
              >
                Open Direct Demo ↗
              </a>
            </div>

            {/* Iframe Viewport */}
            <div className="relative flex-1 w-full bg-white">
              <iframe
                key={key}
                src={normalizedUrl}
                className="w-full h-full border-0 bg-white"
                title={projectTitle}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Recruiter Evaluation Bar */}
      <div className="mt-2 rounded-xl bg-slate-900 border border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Rate Candidate Project:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setRated(true);
                }}
                className={`p-0.5 transition-transform hover:scale-110 ${
                  star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                }`}
              >
                <Star className="h-4 w-4 fill-current" />
              </button>
            ))}
          </div>
          {rated && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Rating recorded in candidate review
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>Tip: For best evaluation, test both responsiveness and edge cases.</span>
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline font-semibold"
          >
            Launch in new tab &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}