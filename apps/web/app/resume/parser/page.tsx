import Link from "next/link";
import { FileText, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { ResumePdfParser } from "@/components/resume-pdf-parser";

export default function ResumeParserPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">Role Nest</Link>
              <span>/</span>
              <span className="text-neutral-200">Resume Parser</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-400" />
              Client-Side Resume Parser
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Zero-server, 100% private text extraction. Detect skills, contact info, and projects directly inside your browser.
            </p>
          </div>

          <Link
            href="/resume/assistant"
            className="flex items-center gap-2 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
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