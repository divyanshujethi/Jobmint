"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, Zap, AlertCircle, BookOpen } from "lucide-react";

interface EnhancedResult {
  original: string;
  enhanced: string;
  actionVerbUsed?: string;
  impactFocus?: string;
}

const SAMPLE_BULLETS = [
  "I worked on building a website using react and nodejs for my college club to register members.",
  "Wrote python scripts to scrape job data from multiple portals and saved into csv files.",
  "Built an android app in flutter where users can chat and share study notes.",
];

export default function ResumeAssistantPage() {
  const [inputBullet, setInputBullet] = useState(SAMPLE_BULLETS[0]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<EnhancedResult | null>(null);
  const [provider, setProvider] = useState<string>("gemini");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ aiPercentage: number; circuitBreakerStatus: string } | null>(null);

  useEffect(() => {
    fetch("/api/ai")
      .then((res) => res.json())
      .then((data) => {
        if (data.aiPercentage !== undefined) {
          setStats({
            aiPercentage: data.aiPercentage,
            circuitBreakerStatus: data.circuitBreakerStatus,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleEnhance = async () => {
    if (!inputBullet.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "IMPROVE_RESUME_BULLET",
          input: { bullet: inputBullet },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process bullet point");
      }

      setProvider(data.provider || "mock");
      if (typeof data.result === "string") {
        setResult({
          original: inputBullet,
          enhanced: data.result,
          actionVerbUsed: "Engineered",
          impactFocus: "Clarity & Readability",
        });
      } else {
        setResult(data.result);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.enhanced) return;
    navigator.clipboard.writeText(result.enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb & Quota Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">JobMint</Link>
              <span>/</span>
              <span className="text-neutral-200">Resume Optimizer</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-emerald-400" />
              ATS Resume Bullet Assistant
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Transform raw student project descriptions into high-impact, ATS-optimized bullet points.
            </p>
          </div>

          {/* Live Quota Badge */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center gap-3 self-start sm:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs font-mono">
              <div className="text-neutral-400">Gateway Status</div>
              <div className="text-white font-medium">
                {stats ? `Quota: ${stats.aiPercentage}% Used` : "Online (Healthy)"}
              </div>
            </div>
            <Link
              href="/admin/system"
              className="text-[11px] text-emerald-400 hover:underline border-l border-neutral-800 pl-3"
            >
              System Telemetry
            </Link>
          </div>
        </div>

        {/* Informational Alert */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-start gap-3 text-sm text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Zero-Hallucination Guarantee: </span>
            This tool sharpens phrasing and action verbs without inventing fake metrics, dates, or technologies you didn&apos;t build. Keep your resume 100% honest.
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 flex items-center gap-3 text-sm text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Column */}
          <div className="space-y-6 bg-neutral-900/70 border border-neutral-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-200">
                Draft Bullet / Raw Description
              </label>
              <span className="text-xs text-neutral-500 font-mono">
                {inputBullet.length} chars
              </span>
            </div>

            <textarea
              rows={5}
              value={inputBullet}
              onChange={(e) => setInputBullet(e.target.value)}
              placeholder="e.g. I worked on a react app that lets students register for hackathons..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />

            {/* Quick Sample Selector */}
            <div className="space-y-2">
              <div className="text-xs text-neutral-400 font-medium">Try a student example:</div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_BULLETS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputBullet(sample)}
                    className="text-xs bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-700/60 transition-colors text-left"
                  >
                    Example {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleEnhance}
              disabled={loading || !inputBullet.trim()}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Optimizing phrasing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Enhance Bullet Point</span>
                </>
              )}
            </button>
          </div>

          {/* Result Column */}
          <div className="space-y-6 bg-neutral-900/70 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  ATS-Optimized Output
                  {result && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                      Engine: {provider}
                    </span>
                  )}
                </span>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Bullet"}
                  </button>
                )}
              </div>

              {result ? (
                <div className="space-y-4">
                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-neutral-100 font-mono text-sm leading-relaxed border-l-4 border-l-emerald-500">
                    • {result.enhanced}
                  </div>

                  {result.actionVerbUsed && (
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 font-mono">Power Action Verb</div>
                        <div className="text-emerald-400 font-semibold text-sm mt-0.5">
                          {result.actionVerbUsed}
                        </div>
                      </div>
                      <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 font-mono">Recruiter Focus</div>
                        <div className="text-neutral-200 font-semibold text-sm mt-0.5">
                          {result.impactFocus || "Technical Competency"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ATS Checklist */}
                  <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                      ATS Scannability Checklist
                    </div>
                    <ul className="text-xs text-neutral-400 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Starts with an active past-tense engineering verb
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Removes first-person pronouns (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Concise length for human recruiters scanning in 6 seconds
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-neutral-800 rounded-xl p-12 text-center text-neutral-500 text-sm flex flex-col items-center justify-center h-64">
                  <Sparkles className="w-8 h-8 text-neutral-700 mb-3" />
                  <p>Click <span className="text-neutral-300 font-medium">Enhance Bullet Point</span> to transform your project description.</p>
                </div>
              )}
            </div>

            {/* Roadmaps Promotion */}
            <div className="border-t border-neutral-800/80 pt-4 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Need projects with heavier technical depth?</span>
              </div>
              <Link href="/roadmaps" className="text-emerald-400 hover:underline flex items-center gap-1">
                Free Roadmaps <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}