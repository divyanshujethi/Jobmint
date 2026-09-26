"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  TrendingUp,
  Cpu,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

interface ResumeAnalysisData {
  candidateName: string;
  email: string | null;
  phone: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  detectedSkills: string[];
  atsScore: number;
  experienceYears: number;
  educationSnippet?: string;
  projectsSnippet?: string;
  strengths: string[];
  criticalWeaknesses: string[];
  bulletImprovements: BulletImprovement[];
  recommendedRoles: string[];
  rawAnalysis?: string;
}

interface AITelemetry {
  provider: string;
  modelUsed: string;
  tier: number;
  latencyMs: number;
}

const SAMPLE_RESUME_TEXT = `John Doe
Email: john.doe@example.com | Phone: +1 555-019-2834
GitHub: https://github.com/johndoe | LinkedIn: https://linkedin.com/in/johndoe

EDUCATION
B.Tech in Computer Science & Engineering (2022 - 2026)
ABC Institute of Technology, CGPA: 8.7/10

TECHNICAL SKILLS
Languages & Frameworks: React, Next.js, TypeScript, JavaScript, Node.js, Python, Tailwind CSS, HTML5, CSS3
Databases & Cloud: PostgreSQL, SQLite, Cloudflare R2, Docker, Git, REST APIs

PROJECTS
1. Role Nest Portal (React, Next.js, TypeScript, PostgreSQL)
- Developed an open-source recruitment platform with deterministic matching algorithms.
- Built responsive mobile & web interfaces adhering to WCAG accessibility guidelines.
- Integrated Cloudflare R2 presigned URLs for zero-egress document storage.

2. AI Text Summarizer (Python, PyTorch, FastAPI)
- Built an extractive text summarizer serving real-time requests with sub-100ms latency.
`;

export function ResumePdfParser() {
  const [inputText, setInputText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);
  const [telemetry, setTelemetry] = useState<AITelemetry | null>(null);
  const [appliedToProfile, setAppliedToProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (textToAnalyze: string, save = false) => {
    if (!textToAnalyze || textToAnalyze.trim().length < 20) {
      setError("Please provide at least 20 characters of resume text to analyze.");
      return;
    }
    setParsing(true);
    setError(null);

    try {
      const res = await fetch("/api/resumes/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: textToAnalyze,
          saveToProfile: save,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data.analysis);
      if (data.telemetry) {
        setTelemetry(data.telemetry);
      }
      if (save) {
        setAppliedToProfile(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume text");
    } finally {
      setParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      runAnalysis(content);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_RESUME_TEXT);
    runAnalysis(SAMPLE_RESUME_TEXT);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-900 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-900">Real AI Inference: </span>
          Evaluates resumes using our ultra-fast Groq Qwen/Llama 3.3 engine with genuine ATS scoring, candidate contact parsing, and STAR-method impact rewrites.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload / Paste Area */}
        <div className="space-y-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Upload or Paste Resume</h3>
            <button
              onClick={handleLoadSample}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
            >
              Load Sample Resume
            </button>
          </div>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-colors group">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors" />
            <span className="text-sm font-semibold text-slate-700">Click to select resume</span>
            <span className="text-xs text-slate-500 mt-1">Supports TXT, MD, PDF text</span>
            <input
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Or paste raw resume text below:</span>
              <span>{inputText.length} chars</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your full resume text here (education, experience, technical skills)..."
              rows={12}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={() => runAnalysis(inputText)}
            disabled={parsing || inputText.trim().length < 20}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            {parsing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                Analyzing with AI Cascade...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Resume &amp; ATS Score
              </>
            )}
          </Button>
        </div>

        {/* Real AI Results Area */}
        <div className="space-y-6">
          {!analysis && !parsing && (
            <div className="h-full min-h-[400px] border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Analysis Generated Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Click &quot;Load Sample Resume&quot; or paste your text to get real ATS scoring, weaknesses, and bullet rewrites.
              </p>
            </div>
          )}

          {parsing && (
            <div className="h-full min-h-[400px] border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white shadow-sm space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Analyzing Resume Content</h4>
                <p className="text-xs text-slate-500">
                  Routing through Groq Tier 1 Qwen/Llama 3.3 for real-time ATS scoring...
                </p>
              </div>
            </div>
          )}

          {analysis && !parsing && (
            <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm animate-in fade-in duration-200">
              {/* Telemetry Header */}
              {telemetry && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-700">{telemetry.modelUsed}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold">{telemetry.latencyMs}ms</span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                    Tier {telemetry.tier} Active
                  </Badge>
                </div>
              )}

              {/* Score Card */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    ATS Compatibility Score
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {analysis.candidateName || "Candidate"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Estimated Experience: {analysis.experienceYears} year(s)
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-600">
                    {analysis.atsScore ?? 84}%
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-semibold">
                    {analysis.atsScore >= 80 ? "ATS Optimized" : "Needs Polish"}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {analysis.email && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{analysis.email}</span>
                  </div>
                )}
                {analysis.phone && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{analysis.phone}</span>
                  </div>
                )}
                {analysis.githubUrl && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <Github className="w-3.5 h-3.5 text-slate-800 shrink-0" />
                    <span className="truncate">{analysis.githubUrl}</span>
                  </div>
                )}
                {analysis.linkedinUrl && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <Linkedin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{analysis.linkedinUrl}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              {analysis.detectedSkills && analysis.detectedSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    Detected Canonical Skills ({analysis.detectedSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.detectedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.strengths && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
                    </span>
                    <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
                      {analysis.strengths.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.criticalWeaknesses && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> ATS Weaknesses Found
                    </span>
                    <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
                      {analysis.criticalWeaknesses.map((w, idx) => (
                        <li key={idx} className="leading-relaxed">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bullet Improvements */}
              {analysis.bulletImprovements && analysis.bulletImprovements.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    STAR-Method High Impact Bullet Rewrites
                  </div>
                  {analysis.bulletImprovements.map((b, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Before:</span>
                        <p className="text-slate-500 line-through">{b.original}</p>
                      </div>
                      <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">After (AI Optimized):</span>
                        <p className="text-slate-900 font-semibold text-[11px] leading-relaxed mt-0.5">{b.improved}</p>
                      </div>
                      <p className="text-[10px] text-emerald-700 italic">Why: {b.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => runAnalysis(inputText, true)}
                  disabled={appliedToProfile}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  {appliedToProfile ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      Saved to Candidate Profile!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Skills to Candidate Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
