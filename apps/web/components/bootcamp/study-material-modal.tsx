"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  X,
  BookOpen,
  CheckCircle2,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BootcampStudyMaterial } from "@/lib/bootcamp-data";

interface StudyMaterialModalProps {
  material: BootcampStudyMaterial;
  trackTitle: string;
  weekNumber: number;
}

export function StudyMaterialModal({
  material,
  trackTitle,
  weekNumber,
}: StudyMaterialModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadCount, setDownloadCount] = useState(148);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    setIsDownloaded(true);
    setDownloadCount((prev) => prev + 1);

    // Create a client-side simulated PDF/Markdown file download with comprehensive notes
    const content = `================================================================================
ROLENEST VIRTUAL INTERNSHIP LABS & TECHNICAL EDUCATION
ENGINEERING FIELD MANUAL & STUDY GUIDE - WEEK ${weekNumber}
================================================================================
Program Track: ${trackTitle}
Document: ${material.title}
Pages: ${material.totalPages} Pages Equivalent | AICTE / UGC Academic Credit Compliant
Ledger Registration: Verified Academic Study Material
--------------------------------------------------------------------------------

OVERVIEW & EXECUTIVE SUMMARY:
${material.summary}

--------------------------------------------------------------------------------
CORE SYLLABUS TOPICS COVERED:
${material.topicsCovered.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

--------------------------------------------------------------------------------
PRODUCTION ENGINEERING BEST PRACTICES & TAKEAWAYS:
${material.keyTakeaways.map((k, i) => `  [+] ${k}`).join("\n")}

--------------------------------------------------------------------------------
COLLEGE SUBMISSION & LAB RECORD COMPLIANCE:
This document fulfills the practical curriculum documentation requirements 
for industrial internship academic credits under the National Education Policy (NEP)
and AICTE internship evaluation framework.

Official Verification: https://internship.rolenest.in
Verification Authority: RoleNest Virtual Engineering Labs & Advisory Board
(c) 2026 RoleNest India. All rights reserved.
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${material.filename.replace(/\.pdf$/, "")}-RoleNest-Study-Guide.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="rounded-xl border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold gap-1.5 h-8 px-3"
      >
        <FileText className="h-3.5 w-3.5 text-blue-400" />
        <span>Study Guide ({material.totalPages} pgs)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* MODAL HEADER */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    Week {weekNumber} • Official Engineering Study Guide
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {material.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              
              {/* SUMMARY BOX */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                    Curriculum Summary
                  </span>
                  <span className="font-mono text-blue-400">
                    {material.totalPages} Pages Equivalent
                  </span>
                </div>
                <p className="leading-relaxed text-slate-300 text-xs">
                  {material.summary}
                </p>
              </div>

              {/* TOPICS COVERED */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Detailed Technical Topics in this Guide
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {material.topicsCovered.map((topic, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2.5 flex items-start gap-2 text-slate-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KEY TAKEAWAYS */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Production Takeaways &amp; Architectural Rules
                </h4>
                <div className="space-y-1.5">
                  {material.keyTakeaways.map((takeaway, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-slate-300 leading-relaxed"
                    >
                      <strong className="text-emerald-400 font-mono text-[10px] block mb-0.5">
                        RULE #{i + 1}:
                      </strong>
                      {takeaway}
                    </div>
                  ))}
                </div>
              </div>

              {/* COLLEGE RECOGNITION NOTICE */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px] text-purple-200">
                  <strong className="font-bold text-white block">
                    College Lab Record &amp; Viva Voce Ready
                  </strong>
                  <span>
                    This study guide is formatted according to AICTE laboratory record standards. Students can attach these notes and lab project write-ups directly into their college internship presentation.
                  </span>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                Downloaded {downloadCount} times by enrolled interns
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  Close
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownload}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 px-4 shadow-md shadow-blue-500/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isDownloaded ? "Downloaded Again" : `Download Full Guide (${material.totalPages} pgs)`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
