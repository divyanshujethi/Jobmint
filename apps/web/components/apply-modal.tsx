"use client";

import { useState, useEffect } from "react";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Lock,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { ProUpgradeModal } from "./pro-upgrade-modal";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  requiredSkills?: string[];
  jobDescription?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface AtsMatchData {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestedBullets: string[];
  reasoning?: string;
}

export function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  requiredSkills = ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  jobDescription,
  isOpen,
  onClose,
}: ApplyModalProps) {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [devScore, setDevScore] = useState<number | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<{
    filename: string;
    sha256Hash: string;
    sizeBytes: number;
    isDuplicate: boolean;
  } | null>(null);

  // AI State
  const [atsData, setAtsData] = useState<AtsMatchData | null>(null);
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [showBridgeBullets, setShowBridgeBullets] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [proModalReason, setProModalReason] = useState("");
  const [freeUsesRemaining, setFreeUsesRemaining] = useState<number | null>(null);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCheckingAuth(true);
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.user) {
            setSessionUser(data.user);
            setEmail(data.user.email || "");
          } else {
            setSessionUser(null);
          }
        })
        .catch(() => setSessionUser(null))
        .finally(() => setCheckingAuth(false));

      fetch("/api/user/pro-status")
        .then((res) => res.json())
        .then((data) => {
          if (data?.isPro) {
            setIsProUser(true);
          }
        })
        .catch(() => {});

      try {
        const savedScore = localStorage.getItem("jobmint_verified_dev_score");
        if (savedScore) {
          const parsed = JSON.parse(savedScore);
          if (parsed.username && !githubUrl) {
            setGithubUrl(`https://github.com/${parsed.username}`);
          }
          if (parsed.devScore) {
            setDevScore(parsed.devScore);
          }
          if (parsed.verifiedSkills) {
            setResumeText(`Skills: ${parsed.verifiedSkills.join(", ")}. Full-stack software developer with production Git repositories.`);
          }
        }
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setFile(selected);
      setResumeText(`Resume file: ${selected.name} (${Math.round(selected.size / 1024)} KB)`);

      // Instantly upload and verify on OCI 200 GB persistent disk
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("file", selected);
        const res = await fetch("/api/resumes/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.file) {
          setUploadedResume(data.file);
          // Automatically trigger ATS match once file is uploaded
          runAtsMatch(selected.name);
        }
      } catch (err) {
        console.error("Failed to upload resume to OCI storage:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const runAtsMatch = async (fileName?: string) => {
    setIsAnalyzingAts(true);
    try {
      const payloadResume = resumeText || fileName || "Full Stack Developer with JavaScript, React, Node.js, and SQL experience.";
      const res = await fetch("/api/ai/ats-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: payloadResume,
          jobTitle,
          jobDescription: jobDescription || `Open engineering position at ${companyName}`,
          requiredSkills,
        }),
      });

      const data = await res.json();
      if (res.status === 403 && data.requiresPro) {
        setProModalReason(data.error || "You have reached your 3 free AI generations limit. Upgrade to Pro for unlimited ATS matching.");
        setShowProModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "ATS analysis failed");
      }

      setAtsData(data);
      if (data.quota) {
        setIsProUser(data.quota.isPro);
        setFreeUsesRemaining(data.quota.remaining);
      }
    } catch (err: any) {
      console.warn("ATS match error:", err);
    } finally {
      setIsAnalyzingAts(false);
    }
  };

  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    try {
      const res = await fetch("/api/ai/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          companyName,
          requiredSkills,
          candidateSkills: atsData?.matchedSkills || ["React", "TypeScript", "Node.js"],
          candidateSummary: resumeText,
          devScore,
        }),
      });

      const data = await res.json();
      if (res.status === 403 && data.requiresPro) {
        setProModalReason(data.error || "You have used your 3 free AI trials. Upgrade to Pro for unlimited AI cover letters.");
        setShowProModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate pitch");
      }

      if (data.pitch) {
        setCoverNote(data.pitch);
      }
      if (data.quota) {
        setIsProUser(data.quota.isPro);
        setFreeUsesRemaining(data.quota.remaining);
      }
    } catch (err: any) {
      alert(err.message || "Could not generate AI pitch");
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopyBullet = (bullet: string, idx: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !uploadedResume) {
      alert("Please upload your resume (PDF)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeUrl: uploadedResume
            ? `/api/resumes/stream?token=${uploadedResume.sha256Hash}`
            : "/uploads/resumes/default.pdf",
          email,
          phone,
          coverNote,
          githubUrl: githubUrl.trim() || undefined,
          demoUrl: demoUrl.trim() || undefined,
          devScore: devScore || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }
      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-6">
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>

          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Application Submitted!
                </h3>
                <p className="mt-1 text-xs text-slate-600 max-w-sm mx-auto">
                  Your application for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been logged in PostgreSQL with verifiable Truth Teller telemetry.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-900 text-left space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Truth Teller Active:
                </span>
                <p className="text-[11px] text-emerald-800">
                  We verify when {companyName} reviews your resume. If no response within 7 business days, you receive an automated notification.
                </p>
              </div>

              <Button onClick={onClose} className="w-full font-bold">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 font-mono">
                    Zero-Ghosting Direct ATS
                  </span>
                  {isProUser ? (
                    <span className="rounded-full bg-amber-50 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-800 flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> PRO MEMBER
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {freeUsesRemaining !== null ? `${freeUsesRemaining}/3 AI tries left` : "3 Free AI tries"}
                    </span>
                  )}
                </div>

                <h3 className="mt-1 text-lg font-bold text-slate-900 leading-tight">
                  Apply for {jobTitle}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{companyName}</p>
              </div>

              {/* RESUME UPLOAD ZONE */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Resume (PDF, max 5MB)
                </label>
                <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-4 hover:border-emerald-500 hover:bg-emerald-50/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      {uploadedResume ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <UploadCloud className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-800 block">
                        {file ? file.name : "Click to select or drag PDF"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {uploadedResume
                          ? "✓ Uploaded & Verified with SHA-256 fingerprint"
                          : "Stored on secure encrypted storage"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* FEATURE 1: AI RESUME-TO-JOB FIT SCORE (INSTANT ATS MATCHER) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">
                      AI Resume-to-Job Fit Score
                    </span>
                  </div>

                  {!atsData && (
                    <button
                      type="button"
                      onClick={() => runAtsMatch()}
                      disabled={isAnalyzingAts}
                      className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/70 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {isAnalyzingAts ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" /> Scanning...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" /> Check ATS Fit
                        </>
                      )}
                    </button>
                  )}
                </div>

                {atsData ? (
                  <div className="space-y-3 pt-1 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-mono font-black text-xs shadow-xs">
                          {atsData.matchScore}%
                        </span>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900">
                            {atsData.matchScore >= 80 ? "High Match Candidate" : "Moderate Alignment"}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ATS Vector Similarity Analyzed
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowBridgeBullets(!showBridgeBullets)}
                        className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3 text-indigo-600" />
                        <span>1-Click Fix Bullets</span>
                      </button>
                    </div>

                    {/* Matched Skills */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                        Matched Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {atsData.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1"
                          >
                            <Check className="h-2.5 w-2.5" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    {atsData.missingSkills.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider font-mono">
                          Missing Skills to Bridge:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {atsData.missingSkills.map((s) => (
                            <span
                              key={s}
                              className="rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1"
                            >
                              <AlertTriangle className="h-2.5 w-2.5 text-amber-600" /> {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 1-Click Fix: Tailored Bullets */}
                    {showBridgeBullets && atsData.suggestedBullets.length > 0 && (
                      <div className="rounded-xl bg-indigo-950 text-indigo-100 p-3 space-y-2 text-xs">
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-[11px]">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          AI Suggested Resume Bullets to Bridge Missing Skills:
                        </span>
                        <div className="space-y-2">
                          {atsData.suggestedBullets.map((bullet, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg bg-indigo-900/60 border border-indigo-800 p-2 text-[11px] leading-relaxed flex items-start justify-between gap-2"
                            >
                              <span>{bullet}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyBullet(bullet, idx)}
                                title="Copy to clipboard"
                                className="shrink-0 p-1 rounded hover:bg-indigo-800 text-indigo-300"
                              >
                                {copiedBulletIdx === idx ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Compare your uploaded resume against {jobTitle}&apos;s tech stack to reveal matched skills, missing keywords, and tailored bullet point fixes.
                  </p>
                )}
              </div>

              {/* CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Email</label>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  </div>
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    className="bg-slate-50 text-slate-600 cursor-not-allowed font-medium text-xs h-9"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* FEATURE 2: AI COVER LETTER & INTRODUCTION NOTE GENERATOR */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    Personalized Outreach Pitch
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePitch}
                    disabled={isGeneratingPitch}
                    className="text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1"
                  >
                    {isGeneratingPitch ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-purple-600" />
                        <span>Drafting Pitch...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        <span>Generate Personalized Pitch (AI)</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder={`Personalized note explaining why your technical background matches ${companyName}'s stack...`}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[90px] leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 block text-right">
                  3 concise paragraphs tailored to company tech stack
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white min-h-[44px] rounded-xl shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Application..." : "Submit Zero-Ghosting Application"}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* PRO UPGRADE MODAL PAYWALL */}
      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        reason={proModalReason}
      />
    </>
  );
}
