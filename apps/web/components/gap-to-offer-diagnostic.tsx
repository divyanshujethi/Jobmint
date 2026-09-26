"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Zap,
  Target,
  ChevronDown,
  RotateCcw,
  Loader2,
  Copy,
  Check,
  FileText,
  Upload,
} from "lucide-react";
import { Button } from "./ui/button";
import { ProUpgradeModal } from "./pro-upgrade-modal";

interface GapToOfferDiagnosticProps {
  jobTitle: string;
  companyName: string;
  jobSkills: string[];
  jobSlug: string;
}

export function GapToOfferDiagnostic({
  jobTitle,
  companyName,
  jobSkills,
  jobSlug,
}: GapToOfferDiagnosticProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [uploadedResumeName, setUploadedResumeName] = useState<string | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  // AI ATS matcher state
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiMatchData, setAiMatchData] = useState<{
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    suggestedBullets: string[];
    reasoning?: string;
  } | null>(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [proModalReason, setProModalReason] = useState("");
  const [freeUsesRemaining, setFreeUsesRemaining] = useState<number | null>(null);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    // Check if user has uploaded resume or verified dev score saved in localStorage
    try {
      const savedResume = localStorage.getItem("jobmint_candidate_resume_name");
      if (savedResume) {
        setUploadedResumeName(savedResume);
      }

      const savedScore = localStorage.getItem("jobmint_verified_dev_score");
      if (savedScore) {
        const parsed = JSON.parse(savedScore);
        if (parsed.verifiedSkills && Array.isArray(parsed.verifiedSkills) && parsed.verifiedSkills.length > 0) {
          setCandidateSkills(parsed.verifiedSkills);
          setHasScanned(true);
          return;
        }
      }
      const savedSkills = localStorage.getItem("jobmint_candidate_skills");
      if (savedSkills) {
        const parsed = JSON.parse(savedSkills);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidateSkills(parsed);
          setHasScanned(true);
          return;
        }
      }
    } catch {}

    setCandidateSkills([]);
  }, [jobSkills]);

  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File exceeds 5MB limit. Please upload a compressed PDF.");
      return;
    }

    setIsUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadedResumeName(file.name);
      try {
        localStorage.setItem("jobmint_candidate_resume_name", file.name);
        if (data.file?.publicUrl) {
          localStorage.setItem("jobmint_candidate_resume_url", data.file.publicUrl);
        }
      } catch {}

      // Automatically trigger genuine ATS match on newly uploaded resume
      handleRunAiMatch(file.name);
    } catch (err: any) {
      console.error("Resume upload error:", err);
      alert(err.message || "Failed to upload resume");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (candidateSkills.includes(skill)) {
      setCandidateSkills(candidateSkills.filter((s) => s !== skill));
    } else {
      setCandidateSkills([...candidateSkills, skill]);
    }
  };

  const handleRunAiMatch = async (overrideResumeName?: string) => {
    const activeResume = overrideResumeName || uploadedResumeName;
    setIsAiMatching(true);
    setIsOpen(true);

    try {
      const resumeContent = activeResume
        ? `Candidate Uploaded Resume: ${activeResume}. Verified candidate skills: ${candidateSkills.join(", ")}.`
        : candidateSkills.length > 0
        ? `Candidate Profile Skills: ${candidateSkills.join(", ")}.`
        : "Software developer with full-stack web and backend engineering fundamentals.";

      const res = await fetch("/api/ai/ats-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeContent,
          jobTitle,
          jobDescription: `${jobTitle} at ${companyName}. Required stack: ${jobSkills.join(", ")}`,
          requiredSkills: jobSkills,
        }),
      });

      const data = await res.json();
      if (res.status === 403 && data.requiresPro) {
        setProModalReason(data.error || "You have used your 3 free AI generations. Upgrade to Pro for unlimited ATS matching.");
        setShowProModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to run AI ATS matcher");
      }

      setAiMatchData(data);
      if (data.matchedSkills && Array.isArray(data.matchedSkills)) {
        setCandidateSkills(data.matchedSkills);
      }
      if (data.quota) {
        setIsProUser(data.quota.isPro);
        setFreeUsesRemaining(data.quota.remaining);
      }
    } catch (err: any) {
      console.warn("AI Match error:", err);
    } finally {
      setIsAiMatching(false);
    }
  };

  const handleCopyBullet = (bullet: string, idx: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const matchedSkills = jobSkills.filter((s) => candidateSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !candidateSkills.includes(s));
  const matchPercentage = aiMatchData
    ? aiMatchData.matchScore
    : candidateSkills.length === 0
    ? 0
    : jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;

  return (
    <>
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-5 sm:p-6 shadow-sm">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">AI Resume-to-Job Fit Score</h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-mono font-bold">
                  Instant ATS Matcher
                </span>
                {isProUser ? (
                  <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[9px] font-bold font-mono">
                    PRO
                  </span>
                ) : freeUsesRemaining !== null ? (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({freeUsesRemaining}/3 free tries left)
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Compare your skills &amp; resume against {jobTitle}&apos;s tech stack with 1-click tailored gap fixes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-right mr-1">
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {matchPercentage > 0 ? `${matchPercentage}%` : "--%"}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                ATS Match
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => handleRunAiMatch()}
              disabled={isAiMatching}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 rounded-xl gap-1.5 shadow-xs"
            >
              {isAiMatching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Matching...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                  <span>AI Match</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl px-2.5"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Expanded Diagnostic Content */}
        {isOpen && (
          <div className="mt-5 pt-5 border-t border-slate-200 space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Resume Status / Upload Banner */}
            {uploadedResumeName ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Comparing against your vault resume: <strong>{uploadedResumeName}</strong>
                  </span>
                </div>
                <label className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer underline shrink-0">
                  Replace Resume
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeFileSelect}
                    disabled={isUploadingResume}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-700 gap-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">No resume uploaded yet</span>
                    <span className="text-[11px] text-slate-500">
                      Upload your PDF resume once to get real ATS scores and tailored gap-fix bullets across all jobs!
                    </span>
                  </div>
                </div>
                <label className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 text-xs cursor-pointer shadow-xs shrink-0 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{isUploadingResume ? "Uploading..." : "Upload Resume (PDF)"}</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeFileSelect}
                    disabled={isUploadingResume}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* AI Suggested Bullets to bridge the gap */}
            {aiMatchData && aiMatchData.suggestedBullets.length > 0 && (
              <div className="rounded-2xl bg-indigo-950 text-indigo-100 p-4 space-y-3 text-xs shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    1-Click Fix: Tailored Resume Bullets to Bridge Missing Skills
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400">
                    STAR Metric Aligned
                  </span>
                </div>
                <div className="space-y-2">
                  {aiMatchData.suggestedBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-indigo-900/60 border border-indigo-800 p-2.5 text-xs leading-relaxed flex items-start justify-between gap-3"
                    >
                      <span className="text-indigo-200">{bullet}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyBullet(bullet, idx)}
                        title="Copy to clipboard"
                        className="shrink-0 p-1.5 rounded-lg hover:bg-indigo-800 text-indigo-300 transition-colors"
                      >
                        {copiedBulletIdx === idx ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Toggles bar */}
            <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="text-xs font-semibold text-slate-800">
                  Select your proven skills to simulate ATS score changes:
                </div>
                <Link
                  href="/dev-score"
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" /> Auto-sync from GitHub Dev Score
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {jobSkills.map((skill) => {
                  const isSelected = candidateSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold shadow-2xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      )}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Breakdown columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matches */}
              <div className="rounded-xl bg-white border border-emerald-200/80 p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Matched Skills ({matchedSkills.length}/{jobSkills.length})
                </div>
                {matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-800 flex items-center gap-1"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No matched skills selected yet. Click skills above or run AI match.
                  </p>
                )}
              </div>

              {/* Missing */}
              <div className="rounded-xl bg-white border border-amber-200/80 p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Missing Skills to Learn ({missingSkills.length})
                </div>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800 flex items-center gap-1"
                      >
                        ⚠️ {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">
                    🎉 Outstanding! You have matched 100% of the required tech stack!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRO UPGRADE MODAL */}
      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        reason={proModalReason}
      />
    </>
  );
}
