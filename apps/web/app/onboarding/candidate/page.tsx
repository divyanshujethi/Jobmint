"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  Check,
  Upload,
  FileText,
  Plus,
  X,
  ShieldCheck,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { WorkMode } from "@repo/shared";

const POPULAR_SKILLS = [
  "Java", "Go (Golang)", "Python", "TypeScript", "React", "Next.js", "Node.js",
  "C++", "Rust", "Spring Boot", "PostgreSQL", "SQL", "MongoDB", "Redis",
  "Docker", "Kubernetes", "AWS", "GraphQL", "Tailwind CSS", "PyTorch",
  "Machine Learning", "Git", "Linux", "Flutter", "Swift"
];

const EXPERIENCE_LEVELS = [
  { id: "fresher", label: "Student / Fresher", detail: "0 years" },
  { id: "junior", label: "1–2 Years Experience", detail: "Early Career" },
  { id: "mid", label: "3–5 Years Experience", detail: "Mid-Level Engineer" },
  { id: "senior", label: "6–9 Years Experience", detail: "Senior Engineer" },
  { id: "lead", label: "10+ Years Experience", detail: "Lead / Staff / Principal" },
];

function CandidateOnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/recommendations";

  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "TypeScript", "Python"]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [workModes, setWorkModes] = useState<string[]>([WorkMode.REMOTE]);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput("");
    }
  };

  const toggleWorkMode = (mode: string) => {
    if (workModes.includes(mode)) {
      if (workModes.length > 1) setWorkModes(workModes.filter((m) => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      setResumeUploadError("File exceeds 5MB limit. Please select a compressed PDF.");
      return;
    }

    setResumeFile(file);
    setIsUploadingResume(true);
    setResumeUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const fileUrl = data.file?.publicUrl || data.file?.key || URL.createObjectURL(file);
      setResumeUrl(fileUrl);

      // Auto-save to localStorage
      try {
        localStorage.setItem("jobmint_candidate_resume_name", file.name);
        localStorage.setItem("jobmint_candidate_resume_url", fileUrl);
      } catch {}

      // Auto-suggest headline if empty
      if (!headline) {
        setHeadline("Software Engineer • Full Stack & Applied Systems");
      }
    } catch (err: any) {
      setResumeUploadError(err.message || "Failed to upload resume. Please try again.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to database via API
      await fetch("/api/candidate/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          location,
          experienceLevel,
          workModes,
          selectedSkills,
          resumeUrl,
        }),
      });

      // 2. Save to localStorage for instant client-side ATS matching across cards
      try {
        localStorage.setItem("jobmint_candidate_skills", JSON.stringify(selectedSkills));
        localStorage.setItem("jobmint_candidate_headline", headline);
        localStorage.setItem("jobmint_candidate_location", location);
        localStorage.setItem("jobmint_candidate_exp", experienceLevel);
      } catch {}

      setIsSaved(true);
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1000);
    } catch (err) {
      console.error("Onboarding submission error:", err);
      // Still redirect gracefully
      router.push(callbackUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Candidate Onboarding
          </div>
          <CardTitle className="text-2xl font-black text-slate-900">
            Set Up Your Engineering Profile
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Upload your resume and select your tech stack so Role Nest can compute your real-time ATS match scores and connect you directly with hiring founders.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleComplete}>
          <CardContent className="space-y-6">
            {/* STEP 1: RESUME UPLOAD IN ONBOARDING */}
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-5 space-y-3 transition-colors hover:border-emerald-400">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>Upload Your Resume (PDF)</span>
                </span>
                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold font-mono">
                  Instant ATS Matching
                </span>
              </div>

              {resumeFile ? (
                <div className="flex items-center justify-between rounded-xl bg-white border border-emerald-300 p-3 shadow-xs">
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{resumeFile.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {(resumeFile.size / 1024).toFixed(0)} KB • Stored in your private vault
                      </p>
                    </div>
                  </div>
                  <label className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer underline shrink-0">
                    Replace
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="h-6 w-6 text-slate-400 mb-1.5" />
                  <p className="text-xs font-bold text-slate-800">
                    {isUploadingResume ? "Uploading to your private vault..." : "Click or drag your PDF resume here"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PDF up to 5MB • Used for 1-click applications &amp; ATS score matching
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={isUploadingResume}
                    className="hidden"
                  />
                </label>
              )}

              {resumeUploadError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{resumeUploadError}</span>
                </div>
              )}
            </div>

            {/* HEADLINE */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Professional Headline
              </label>
              <Input
                type="text"
                placeholder="e.g. Senior Backend Engineer • Go & Distributed Systems, or 3rd Year CS Student"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>

            {/* LOCATION */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Current Location
              </label>
              <Input
                type="text"
                placeholder="e.g. Bangalore, Delhi, Pune, Hyderabad, or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* EXPERIENCE LEVEL: FULL SPECTRUM (0 to 10+ YEARS) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Total Engineering Experience
                </label>
                <span className="text-[11px] text-slate-400">Select your current level</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {EXPERIENCE_LEVELS.map((lvl) => {
                  const isSelected = experienceLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`rounded-xl border p-2.5 text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold leading-tight">{lvl.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{lvl.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WORK MODES */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Preferred Work Modes
              </label>
              <div className="flex flex-wrap gap-2">
                {[WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ON_SITE].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => toggleWorkMode(mode)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                      workModes.includes(mode)
                        ? "border-emerald-600 bg-emerald-600 text-white font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {mode.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* SKILLS MULTI-SELECT + CUSTOM SKILL INPUT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Select Your Skills ({selectedSkills.length} selected)
                </label>
                <span className="text-[11px] text-slate-400">Tap to toggle or add custom below</span>
              </div>

              {/* Popular Skills Pills */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-2xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-emerald-600" />}
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Input (e.g. Java, Go, Scala, Solidity) */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type any other skill (e.g. Java, Go, C++, Solidity, Kafka)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSkill(e);
                    }
                  }}
                  className="text-xs h-9"
                />
                <Button
                  type="button"
                  onClick={handleAddCustomSkill}
                  variant="outline"
                  size="sm"
                  className="h-9 font-bold text-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* Active Selected Skills List */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="text-emerald-600 hover:text-emerald-950 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              disabled={isSubmitting || isSaved}
            >
              {isSaved ? (
                <>
                  <Check className="h-5 w-5" /> Profile &amp; Resume Saved! Redirecting...
                </>
              ) : isSubmitting ? (
                "Saving Your Profile..."
              ) : (
                <>
                  Save Profile &amp; View Matched Jobs <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default function CandidateOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-sm font-mono text-slate-500">Loading Candidate Onboarding...</div>
        </div>
      }
    >
      <CandidateOnboardingContent />
    </Suspense>
  );
}
