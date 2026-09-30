"use client";

import { useState } from "react";
import {
  FileText,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  Terminal,
  Code2,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailySopGeneratorProps {
  dayNumber: number;
  trackTitle: string;
  subdomain: string;
  lessonTitle: string;
  estimatedHours: number;
  overview: string;
  lectureNotes: string[];
  repoDeliverable: string;
  suggestedCommitMessage: string;
  studentName?: string;
  collegeName?: string;
  rollNumber?: string;
}

export function DailySopGenerator({
  dayNumber,
  trackTitle,
  subdomain,
  lessonTitle,
  estimatedHours,
  overview,
  lectureNotes,
  repoDeliverable,
  suggestedCommitMessage,
  studentName = "Industrial Engineering Intern",
  collegeName = "Affiliated Engineering Institution",
  rollNumber = "RN-INTERN-2026",
}: DailySopGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const documentId = `RN-SOP-${trackTitle.replace(/[^a-zA-Z0-9]/g, "").substring(0, 4).toUpperCase()}-D${dayNumber.toString().padStart(2, "0")}`;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="rounded-xl border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 font-bold text-xs h-9 px-4 gap-2 transition-all shadow-sm"
      >
        <FileText className="h-4 w-4 text-emerald-400" />
        <span>Generate Daily SOP PDF &rarr;</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* MODAL CONTROL HEADER (Hidden during window.print()) */}
            <div className="print:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-extrabold text-white">
                  Industrial Standard Operating Procedure (SOP) Viewer
                </span>
                <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                  {documentId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-8 px-3.5 gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / Save as PDF</span>
                </Button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* PRINTABLE SOP DOCUMENT */}
            <div className="overflow-y-auto p-6 sm:p-10 bg-white text-slate-900 print:p-0 print:m-0 print:overflow-visible font-sans leading-normal">
              {/* PRINT HEADER */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-widest uppercase text-emerald-700">
                      RoleNest Virtual Engineering Labs
                    </span>
                    <span className="text-[10px] bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                      AICTE / UGC 4-CREDIT FRAMEWORK
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    STANDARD OPERATING PROCEDURE (SOP)
                  </h1>
                  <p className="text-xs font-semibold text-slate-600">
                    Industrial Laboratory Specification &amp; Telemetry Guidelines
                  </p>
                </div>

                <div className="text-right text-xs font-mono space-y-0.5 border-l-2 border-slate-200 pl-4 sm:border-l sm:pl-4">
                  <div className="font-bold text-slate-900">DOC REF: {documentId}</div>
                  <div className="text-slate-600">REVISION: 2026.4</div>
                  <div className="text-slate-600">STATUS: APPROVED</div>
                  <div className="text-emerald-700 font-bold">EFFORT: {estimatedHours} LAB HOURS</div>
                </div>
              </div>

              {/* CANDIDATE INFO STRIP */}
              <div className="rounded-lg bg-slate-50 border border-slate-300 p-3 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Assigned Engineer:</span>
                  <span className="font-bold text-slate-900">{studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Institutional Roll No:</span>
                  <span className="font-bold font-mono text-slate-900">{rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Affiliated Institution:</span>
                  <span className="font-bold text-slate-900">{collegeName}</span>
                </div>
              </div>

              {/* MODULE OVERVIEW */}
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase font-black tracking-wider text-emerald-800">
                    Day {dayNumber} Operational Mission
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">
                    {lessonTitle}
                  </h2>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {overview}
                  </p>
                </div>

                {/* CORE LECTURE NOTES & INDUSTRIAL STANDARDS */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Industrial Principles &amp; Engineering Constraints</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                    {lectureNotes.map((note, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* STEP BY STEP EXECUTION PROTOCOL */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Terminal className="h-4 w-4 text-indigo-600" />
                  <span>Terminal Execution &amp; Local Verification Protocol</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
                    <span className="font-bold text-slate-900 block font-mono text-[11px]">
                      Phase 1: Feature Branch Isolation
                    </span>
                    <pre className="bg-slate-900 text-emerald-400 p-2 rounded text-[10px] font-mono overflow-x-auto">
git checkout -b feature/day-{dayNumber}-core
git status</pre>
                    <p className="text-[10px] text-slate-600">
                      Never commit directly to main. Isolate day deliverables on designated feature branches.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
                    <span className="font-bold text-slate-900 block font-mono text-[11px]">
                      Phase 2: Automated Test Execution
                    </span>
                    <pre className="bg-slate-900 text-teal-400 p-2 rounded text-[10px] font-mono overflow-x-auto">
npm test -- --coverage
# OR python -m unittest</pre>
                    <p className="text-[10px] text-slate-600">
                      Verify that unit tests execute with 100% pass rate before committing code.
                    </p>
                  </div>
                </div>
              </div>

              {/* DELIVERABLE SPECIFICATION */}
              <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 space-y-2 mb-6 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800 text-[11px] uppercase">
                    Mandatory Repository Deliverable:
                  </span>
                  <span className="font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded font-bold text-indigo-900">
                    {repoDeliverable}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-bold text-slate-800 text-[11px] uppercase">
                    Conventional Commit Specification:
                  </span>
                  <span className="font-mono text-[11px] text-emerald-800 font-bold">
                    &quot;{suggestedCommitMessage}&quot;
                  </span>
                </div>
              </div>

              {/* SIGN-OFF STAMP */}
              <div className="border-t-2 border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div className="space-y-0.5 text-slate-600 text-[10px]">
                  <div>ISSUING AUTHORITY: RoleNest Industrial Board</div>
                  <div>AICTE PRACTICAL LAB RECOGNITION: Approved for 4 Academic Credits</div>
                  <div>SECURITY LEDGER: Cryptographically Audited by GitHub API</div>
                </div>

                <div className="rounded border border-dashed border-emerald-600 p-2 text-center text-emerald-800">
                  <div className="font-black text-[11px] uppercase">ROLENEST LAB STAMP</div>
                  <div className="text-[9px]">SOP COMPLIANCE: MANDATORY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
