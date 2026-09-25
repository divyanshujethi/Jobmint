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
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  isOpen,
  onClose,
}: ApplyModalProps) {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [file, setFile] = useState<File | null>(null);
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
        }
      } catch (err) {
        console.error("Failed to upload resume to OCI storage:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
                You will receive an in-app alert the instant the recruiter views your resume. If not viewed in 7 days, our Truth Teller will automatically alert you to apply to alternative active roles.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                className="w-full font-semibold"
                onClick={() => {
                  onClose();
                  router.push("/applications");
                }}
              >
                Track in My Applications <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : checkingAuth ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            Verifying candidate credentials...
          </div>
        ) : !sessionUser ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Candidate Sign-In Required</h3>
              <p className="mt-1 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                To apply for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> and activate 7-day Truth Teller tracking, please sign in with your verified candidate account.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`/login?callbackUrl=${typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : "/jobs"}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                Sign In to Apply
              </a>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-500">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Direct Application
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Apply for {jobTitle}
              </h2>
              <p className="text-xs text-slate-500">at {companyName}</p>
            </div>

            {/* RESUME UPLOAD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Upload Resume (PDF or DOCX, max 5MB)
              </label>

              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                {uploadedResume ? (
                  <div className="flex flex-col items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <span>{uploadedResume.filename} ({(uploadedResume.sizeBytes / 1024).toFixed(0)} KB)</span>
                      {uploadedResume.isDuplicate && (
                        <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                          Deduplicated
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600">
                      OCI 200 GB Disk: SHA-256 {uploadedResume.sha256Hash.slice(0, 12)}...
                    </span>
                  </div>
                ) : file ? (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <span>{file.name} (Uploading to OCI storage...)</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      Click to upload resume (PDF)
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Stored on OCI 200 GB NVMe with HMAC-SHA256 privacy
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* CONTACT DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Email</label>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="h-3 w-3" /> Verified Account
                  </span>
                </div>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="bg-slate-50 text-slate-600 cursor-not-allowed font-medium"
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
                />
              </div>
            </div>

            {/* PROOF-OF-WORK OPTIONAL ENHANCEMENTS */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Proof-of-Work Superpowers (Optional)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100/60 font-semibold px-2 py-0.5 rounded">
                  3x Higher Response Rate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">GitHub Profile / Handle</label>
                    {devScore && (
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">
                        Score: {devScore}/1000
                      </span>
                    )}
                  </div>
                  <Input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="h-8 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Live Demo Sandbox URL
                  </label>
                  <Input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://my-project.vercel.app"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Recruiters can test your live app directly in the 1-Click Sandbox without leaving Role Nest.
              </p>
            </div>

            {/* SHORT NOTE */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Quick Note to Recruiter (Optional)
                </label>
                <span className="text-[10px] text-slate-400">Max 300 chars</span>
              </div>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value.slice(0, 300))}
                placeholder="Mention why this role excites you or link a key GitHub project..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px]"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Application..." : "Send Application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
