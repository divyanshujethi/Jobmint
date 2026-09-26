import type { Metadata } from "next";
import Link from "next/link";
import { ResumeUploader } from "@/components/resume-uploader";
import { HardDrive, ShieldCheck, Sparkles, FileSearch, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Candidate Resume Vault — Role Nest",
  description: "Secure, private cloud storage for your verified PDF resumes with token-gated recruiter access and 1-click job applications.",
};

export default function ResumeStoragePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private Cloud Vault
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              <Lock className="h-3.5 w-3.5" />
              Encrypted &amp; Token-Gated
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Candidate Resume Vault
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Your personal, encrypted resume repository. Save your latest verified PDF resume here to enable instant 1-click applications across Role Nest. Your resume is never public and is only shared with companies you explicitly apply to.
          </p>
        </div>

        {/* Uploader Component */}
        <ResumeUploader />

        {/* Privacy & Speed Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Instant 1-Click Apply</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Keep your latest polished resume ready. Apply to verified jobs and high-stipend internships in seconds without re-uploading every time.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">100% Private &amp; Token-Gated</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Your resume files are completely hidden from public web scrapers and search engines. Only verified recruiters on active jobs can stream your resume.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">ATS Quality Check</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Uploaded files are verified for single-column Harvard ATS readability so applicant tracking systems parse your technical skills flawlessly.
            </p>
          </div>
        </div>

        {/* Quick Next Steps */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Need to scan or polish your resume?</h3>
            <p className="text-xs text-slate-600 mt-1">
              Extract skills in your browser with 0-cost client parsing, or optimize bullets with the AI Assistant.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/resume/parser">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <FileSearch className="h-4 w-4" />
                Parse Skills
              </Button>
            </Link>
            <Link href="/resume/assistant">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <Sparkles className="h-4 w-4" />
                Polish with AI
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}