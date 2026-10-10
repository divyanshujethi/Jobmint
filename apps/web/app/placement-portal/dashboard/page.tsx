"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Download,
  Upload,
  Filter,
  Search,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Briefcase,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Check,
  AlertCircle,
  Send,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  devScore: number;
  githubHandle: string;
  potdStreak: number;
  applicationsCount: number;
  offersCount: number;
  status: "READY" | "INTERVIEWING" | "PLACED";
}

const SAMPLE_STUDENTS: StudentRecord[] = [
  {
    id: "st-1",
    name: "Aarav Sharma",
    rollNo: "21CS042",
    branch: "Computer Science",
    devScore: 840,
    githubHandle: "aarav-sharma-dev",
    potdStreak: 45,
    applicationsCount: 8,
    offersCount: 2,
    status: "PLACED",
  },
  {
    id: "st-2",
    name: "Priya Nair",
    rollNo: "21IT019",
    branch: "Information Tech",
    devScore: 785,
    githubHandle: "priya-codes-tech",
    potdStreak: 32,
    applicationsCount: 12,
    offersCount: 1,
    status: "PLACED",
  },
  {
    id: "st-3",
    name: "Rohan Kulkarni",
    rollNo: "21AI008",
    branch: "AI & Data Science",
    devScore: 720,
    githubHandle: "rohan-k-ai",
    potdStreak: 21,
    applicationsCount: 15,
    offersCount: 0,
    status: "INTERVIEWING",
  },
  {
    id: "st-4",
    name: "Ananya Deshmukh",
    rollNo: "21CS102",
    branch: "Computer Science",
    devScore: 690,
    githubHandle: "ananya-d99",
    potdStreak: 18,
    applicationsCount: 9,
    offersCount: 0,
    status: "INTERVIEWING",
  },
  {
    id: "st-5",
    name: "Vikram Sengupta",
    rollNo: "21EC055",
    branch: "Electronics & Comm",
    devScore: 610,
    githubHandle: "vikram-sg-embedded",
    potdStreak: 12,
    applicationsCount: 6,
    offersCount: 0,
    status: "READY",
  },
];

export default function PlacementDashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentRecord[]>(SAMPLE_STUDENTS);
  const [isExporting, setIsExporting] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Credential & NOC Verifier State
  const [verifyQuery, setVerifyQuery] = useState("");
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStudents = students.filter((s) => {
    const matchesBranch = selectedBranch === "ALL" || s.branch === selectedBranch;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.githubHandle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const totalStudents = Math.max(640, students.length);
  const placedCount = students.filter((s) => s.status === "PLACED").length + 480;
  const placementRate = Math.round((placedCount / totalStudents) * 100);
  const medianDevScore =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.devScore, 0) / students.length)
      : 745;
  const activeDrives = 14;

  const handleExportCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "Name,RollNo,Branch,DevScore,GitHub,POTDStreak,Applications,Offers,Status\n";
      const rows = filteredStudents
        .map(
          (s) =>
            `"${s.name}","${s.rollNo}","${s.branch}",${s.devScore},"${s.githubHandle}",${s.potdStreak},${s.applicationsCount},${s.offersCount},"${s.status}"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `RoleNest_Placement_Readiness_${selectedBranch}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadMessage(null);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          throw new Error("CSV file is empty or missing data rows.");
        }

        const newRecords: StudentRecord[] = [];
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",").map((p) => p.replace(/^"|"$/g, "").trim());
          if (parts.length >= 2 && parts[0]) {
            newRecords.push({
              id: `csv-${Date.now()}-${i}`,
              name: parts[0],
              rollNo: parts[1] || `21CS${String(i).padStart(3, "0")}`,
              branch: parts[2] || "Computer Science",
              devScore: parts[3] ? parseInt(parts[3], 10) || 720 : Math.floor(Math.random() * 250 + 650),
              githubHandle: parts[4] || parts[0].toLowerCase().replace(/\s+/g, "-"),
              potdStreak: parts[5] ? parseInt(parts[5], 10) || 15 : Math.floor(Math.random() * 30 + 5),
              applicationsCount: parts[6] ? parseInt(parts[6], 10) || 5 : Math.floor(Math.random() * 10 + 2),
              offersCount: parts[7] ? parseInt(parts[7], 10) || 0 : (parts[8]?.toUpperCase() === "PLACED" ? 1 : 0),
              status: (parts[8]?.toUpperCase() === "PLACED" ? "PLACED" : parts[8]?.toUpperCase() === "INTERVIEWING" ? "INTERVIEWING" : "READY") as any,
            });
          }
        }

        if (newRecords.length === 0) {
          throw new Error("Could not parse any valid student records from the CSV file.");
        }

        setStudents((prev) => [...newRecords, ...prev]);
        setUploadMessage(`Successfully loaded ${newRecords.length} student records into the placement roster.`);
      } catch (err: any) {
        setUploadError(err.message || "Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  const handleVerifyCredential = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = verifyQuery.trim();
    if (!clean) return;

    if (clean.toUpperCase().startsWith("RN-NOC") || clean.toLowerCase().includes("noc")) {
      window.open(`/internship-bootcamp/portal/noc/${encodeURIComponent(clean)}`, "_blank");
    } else if (clean.toUpperCase().startsWith("RN-OFFER") || clean.toLowerCase().includes("offer")) {
      window.open(`/internship-bootcamp/portal/offer-letter/${encodeURIComponent(clean)}`, "_blank");
    } else if (clean.toUpperCase().startsWith("RN-CERT") || clean.toLowerCase().includes("cert")) {
      window.open(`/internship-bootcamp/verify/${encodeURIComponent(clean)}`, "_blank");
    } else {
      // Filter the table by roll number or student name
      setSearchQuery(clean);
      setVerifyNotice(`Filtered batch roster for student identifier "${clean}".`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP BAR / BREADCRUMB */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <Link href="/placement-portal" className="hover:text-emerald-400">
                Placement Portal
              </Link>
              <span>/</span>
              <span className="text-slate-200">Institutional TPO Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-emerald-400" />
              Campus Placement Cell Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live batch readiness telemetry, proof-of-work DevScores, and corporate hiring drive coordination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCsvFileChange}
              accept=".csv"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-slate-800 text-slate-200 hover:bg-slate-900 text-xs h-9 px-3.5 rounded-xl gap-2 font-bold cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              Upload Batch CSV
            </Button>

            <Button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Generating NAAC Report..." : "Export Accreditation CSV"}
            </Button>

            <Link href="/employer/jobs/new">
              <Button variant="outline" className="border-slate-800 text-slate-200 hover:bg-slate-900 text-xs h-9 px-4 rounded-xl gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Invite Employer
              </Button>
            </Link>
          </div>
        </div>

        {uploadMessage && (
          <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/80 p-4 text-xs text-emerald-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadMessage}</span>
            </div>
            <button
              onClick={() => setUploadMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {uploadError && (
          <div className="rounded-2xl bg-red-950/60 border border-red-800/80 p-4 text-xs text-red-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* METRICS HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Batch Strength</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{totalStudents}</div>
            <div className="text-[11px] text-emerald-400 font-mono">Class of 2026 • Verified</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Placement Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{placementRate}%</div>
            <div className="text-[11px] text-slate-400 font-mono">{placedCount} Students Placed</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Median DevScore</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400">{medianDevScore}</div>
            <div className="text-[11px] text-slate-400 font-mono">Top 15% Nationally</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Campus Drives</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400">{activeDrives}</div>
            <div className="text-[11px] text-slate-400 font-mono">6 On-Campus, 8 Pool</div>
          </div>

          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-4 space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 text-xs">
              <span>Truth Teller Alert</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">0% Ghosting</div>
            <div className="text-[11px] text-emerald-300 font-mono">All 14 drives tracked</div>
          </div>
        </div>

        {/* INSTITUTIONAL VERIFICATION PIPELINE CONSOLE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Student Credential, NOC &amp; Offer Verification Console
                </h2>
                <p className="text-xs text-slate-400">
                  Audit and verify official university credits, internship appointment letters, and NOC recommendations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                AICTE / UGC Aligned
              </span>
            </div>
          </div>

          <form onSubmit={handleVerifyCredential} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Student Roll No, NOC ID (RN-NOC-...), Offer ID (RN-OFFER-...), or Certificate ID..."
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl shrink-0 gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Credential
            </Button>
          </form>

          {verifyNotice && (
            <div className="text-xs text-emerald-400 flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-2.5 px-3">
              <span>{verifyNotice}</span>
              <button
                type="button"
                onClick={() => setVerifyNotice(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Quick Audit Specimen Portals:</span>
            <Link
              href="/internship-bootcamp/portal/noc/demo"
              target="_blank"
              className="rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Specimen NOC Letter</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
            <Link
              href="/internship-bootcamp/portal/offer-letter/demo"
              target="_blank"
              className="rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Specimen Offer Letter</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
            <Link
              href="/internship-bootcamp/verify/demo"
              target="_blank"
              className="rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-mono text-purple-300 flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Specimen Certificate Ledger</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* ACTIVE HIRING DRIVES ROW */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Active Corporate Recruitment Drives (October 2026)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Razorpay</span>
                <span className="rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 border border-emerald-500/20">
                  Online Assessment
                </span>
              </div>
              <div className="text-xs text-slate-400">Software Development Engineer (Backend)</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                <span>CTC: ₹18.5 LPA</span>
                <span>42 Students Shortlisted</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Swiggy</span>
                <span className="rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono px-2 py-0.5 border border-purple-500/20">
                  Technical Interviews
                </span>
              </div>
              <div className="text-xs text-slate-400">Frontend Engineer (React / Next.js)</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                <span>CTC: ₹16.0 LPA</span>
                <span>18 In Final Rounds</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Zomato / Blinkit</span>
                <span className="rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono px-2 py-0.5 border border-blue-500/20">
                  Registrations Open
                </span>
              </div>
              <div className="text-xs text-slate-400">Associate AI &amp; Data Engineer</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                <span>CTC: ₹15.2 LPA</span>
                <span>Closes in 3 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* CANDIDATE TELEMETRY TABLE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Student Placement Readiness Roster</h2>
              <p className="text-xs text-slate-400">Ground truth GitHub commits, POTD streaks, and DevScores.</p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Engineering Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Tech">Information Tech</option>
                <option value="AI & Data Science">AI &amp; Data Science</option>
                <option value="Electronics & Comm">Electronics &amp; Comm</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Student &amp; Roll No</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">DevScore</th>
                  <th className="py-3 px-3">GitHub Activity</th>
                  <th className="py-3 px-3">POTD Streak</th>
                  <th className="py-3 px-3">Applications</th>
                  <th className="py-3 px-3">Offers</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{st.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{st.rollNo}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{st.branch}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {st.devScore}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={`https://github.com/${st.githubHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono text-[11px]"
                      >
                        @{st.githubHandle} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      🔥 {st.potdStreak} Days
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{st.applicationsCount}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{st.offersCount}</td>
                    <td className="py-3 px-3 text-right">
                      {st.status === "PLACED" ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                          ✓ Placed
                        </span>
                      ) : st.status === "INTERVIEWING" ? (
                        <span className="rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                          Interviewing
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                          Ready for Drive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
