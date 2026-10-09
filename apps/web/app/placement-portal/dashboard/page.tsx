"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  Search,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Briefcase,
  TrendingUp,
  FileSpreadsheet,
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
  const [students] = useState<StudentRecord[]>(SAMPLE_STUDENTS);
  const [isExporting, setIsExporting] = useState(false);

  const filteredStudents = students.filter((s) => {
    const matchesBranch = selectedBranch === "ALL" || s.branch === selectedBranch;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.githubHandle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const totalStudents = 640;
  const placedCount = 485;
  const placementRate = Math.round((placedCount / totalStudents) * 100);
  const medianDevScore = 745;
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

          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 shadow-sm"
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
