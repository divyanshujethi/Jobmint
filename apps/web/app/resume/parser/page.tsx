import Link from "next/link";
import { FileText, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { ResumePdfParser } from "@/components/resume-pdf-parser";

export default function ResumeParserPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-600 transition-colors">Role Nest</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Resume Parser</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FileText className="w-6 h-6" />
              </div>
              Resume Skill &amp; ATS Parser
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Zero-server, 100% private text extraction. Detect skills, contact info, and projects directly inside your browser.
            </p>
          </div>

          <Link
            href="/resume/assistant"
            className="flex items-center gap-2 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-emerald-700 hover:text-emerald-800 px-4 py-2.5 rounded-xl transition-all shadow-xs self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>ATS Bullet Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Client-Side Resume Parser Component */}
        <ResumePdfParser />
      </div>
    </div>
  );
}