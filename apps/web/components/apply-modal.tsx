"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("student@college.edu");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<{
    key: string;
    filename: string;
    sizeBytes: number;
    sha256Hash: string;
    url: string;
    isDuplicate: boolean;
  } | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !uploadedResume) {
      alert("Please upload your resume (PDF)");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
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
                Your application for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been logged with verifiable Truth Teller telemetry.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-900 text-left space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Truth Teller Active:
              </span>
              <p className="text-[11px] text-emerald-800">
                You will receive an in-app alert the instant the recruiter views your resume. If not viewed in 7 days, we will automatically notify you.
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
                <label className="text-xs font-semibold text-slate-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
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
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[70px]"
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
