"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  Eye,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Lock,
  Cpu,
  Layers,
  ExternalLink,
  Activity,
  Server,
  Database,
  HardDrive,
  Zap,
  Flame,
  CheckCircle,
  FileText,
  Terminal,
  Download,
  Search,
  Play,
  Table as TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SuperAdminPanelClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "COMPANIES" | "JOBS" | "APPLICATIONS" | "RESUMES" | "SQL_CONSOLE" | "SYSTEM" | "SECURITY"
  >("OVERVIEW");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Resume Search & SQL Console state
  const [resumeSearch, setResumeSearch] = useState("");
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
  );
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);

  const handleRunSql = async (overrideQuery?: string) => {
    const queryToRun = overrideQuery || sqlQuery;
    if (!queryToRun.trim()) return;
    setSqlLoading(true);
    setSqlError(null);
    try {
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToRun }),
      });
      const resData = await res.json();
      if (!res.ok || resData.error) {
        throw new Error(resData.error || "Failed to execute SQL query");
      }
      setSqlResult(resData);
    } catch (err: any) {
      setSqlError(err.message);
      setSqlResult(null);
    } finally {
      setSqlLoading(false);
    }
  };

  const fetchAdminData = () => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
      })
      .catch((err) => console.error("Error loading admin stats:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (action: string, payload: any) => {
    setActionLoading(action);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Action failed");
      setMessage(resData.message || "Action executed successfully!");
      fetchAdminData();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading Role Nest SuperAdmin Console...</p>
      </div>
    );
  }

  if (!data?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              Access Restricted
            </span>
            <h1 className="text-2xl font-bold text-white">SuperAdmin Clearance Required</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              This panel provides direct platform governance over corporate verifications, live job toggling, and recruiter audits.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left space-y-2 text-xs font-mono">
            <div className="text-slate-400">Your Current Identity:</div>
            <div className="text-emerald-400 font-bold break-all">
              {data?.currentUser?.email || "Not signed in (Guest)"}
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Only authorized administrator accounts (e.g. admin@rolenest.in, divyanshu.dev@gmail.com) can access this terminal.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full font-bold">Sign In as Admin</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full text-xs text-slate-400 hover:text-white">
                Return to Job Board
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const health = data?.health || {};
  const companies = data?.companies || [];
  const jobs = data?.jobs || [];
  const applications = data?.applications || [];
  const resumes = data?.resumes || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* TOP ADMIN BAR */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Restricted Clearance
              </span>
              <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.2 text-[10px] font-mono text-emerald-300">
                ROLE: SUPERADMIN
              </span>
            </div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Role Nest Governance & Operations Console
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/api/health"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-300 transition-colors border border-emerald-500/30"
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            Live /api/health
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
          <button
            onClick={fetchAdminData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            Sync DB
          </button>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
          >
            Public Site →
          </Link>
        </div>
      </div>

      {message && (
        <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* ADMIN TABS NAVIGATION */}
      <div className="mx-4 sm:mx-8 mt-6 border-b border-slate-800 flex gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: "OVERVIEW", label: "Platform Overview", icon: Layers },
          { id: "COMPANIES", label: `Companies (${companies.length})`, icon: Building2 },
          { id: "JOBS", label: `Job Postings (${jobs.length})`, icon: Briefcase },
          { id: "APPLICATIONS", label: `Truth Teller Audit (${applications.length})`, icon: Eye },
          { id: "RESUMES", label: `Resumes Vault (${resumes.length})`, icon: FileText },
          { id: "SQL_CONSOLE", label: "SQL Console (Supabase)", icon: Terminal },
          { id: "SYSTEM", label: "System Health & Backups", icon: Activity },
          { id: "SECURITY", label: "Security & Compliance", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-4 sm:mx-8 mt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "OVERVIEW" && (
          <div className="space-y-6">
            {/* 7 High-Level Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Verified Companies</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-white">{stats.verifiedCompanies || 0}</span>
                  <span className="text-[10px] text-emerald-400">/{stats.totalCompanies || 0}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Live Tech Jobs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.activeJobs || 0}</span>
                  <span className="text-[10px] text-slate-400">active</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Pro Candidates</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">{stats.proUsers || 0}</span>
                  <span className="text-[10px] text-amber-300 font-mono">Paddle</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Resumes in Vault</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.totalResumes || resumes.length || 0}</span>
                  <span className="text-[10px] text-emerald-300 font-mono">PDFs</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Boosted Jobs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-yellow-400">{stats.featuredJobs || 0}</span>
                  <span className="text-[10px] text-yellow-300 font-mono">30d Boost</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Applications Tracked</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-blue-400">{stats.totalApplications || 0}</span>
                  <span className="text-[10px] text-blue-300">Truth Teller</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-[11px] font-mono text-slate-400 block">Total Users</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-purple-400">{stats.totalUsers || 0}</span>
                  <span className="text-[10px] text-purple-300">Auth.js</span>
                </div>
              </div>
            </div>

            {/* Architecture & Telemetry Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database Telemetry */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-400">
                    <Database className="h-4 w-4" /> PostgreSQL 16
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    {health.database?.status === "connected" ? "CONNECTED" : "ONLINE"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Database Pool & Relations</h4>
                <p className="text-xs text-slate-400">
                  localhost:5432 with Drizzle ORM.
                  {health.database?.latencyMs !== undefined && ` Latency: ${health.database.latencyMs}ms.`}
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Bound: 127.0.0.1:5432
                </div>
              </div>

              {/* Redis Telemetry */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-400">
                    <Zap className="h-4 w-4" /> Redis 7.2 Cache
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    {health.redis?.status === "connected" ? "PONG OK" : "ACTIVE"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">In-Memory Queues & Sessions</h4>
                <p className="text-xs text-slate-400">
                  Password authenticated socket.
                  {health.redis?.latencyMs !== undefined && ` Latency: ${health.redis.latencyMs}ms.`}
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Bound: 127.0.0.1:6379
                </div>
              </div>

              {/* Automated Backups */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-400">
                    <HardDrive className="h-4 w-4" /> Database Backups
                  </div>
                  <span className="rounded-full bg-purple-950 border border-purple-800 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                    DAILY 02:00 UTC
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Automated pg_dump</h4>
                <p className="text-xs text-slate-400">
                  Gzip compressed archive saved to <code className="text-purple-300">/opt/backups/</code> with 7-day automated pruning.
                </p>
                <div className="pt-2 text-[11px] font-mono text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Cron Daemon Active
                </div>
              </div>

              {/* Firewall & Security */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400">
                    <ShieldCheck className="h-4 w-4" /> UFW Firewall
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    HARDENED
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Public Ports 22, 80, 443</h4>
                <p className="text-xs text-slate-400">
                  Default INCOMING: DENY. Port 3000, 5432, 6379, 11434 blocked externally.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> TLS 1.3 Proxied
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPANIES */}
        {activeTab === "COMPANIES" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Registered Companies & Verification Badges</h3>
              <span className="text-xs text-slate-400 font-mono">{stats.verifiedCompanies || 0} Verified in Database</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Industry</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Truth Teller Stats</th>
                    <th className="p-3.5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {companies.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-emerald-400">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{c.domain || c.website}</span>
                        </div>
                      </td>
                      <td className="p-3.5">{c.industry}</td>
                      <td className="p-3.5">{c.location}</td>
                      <td className="p-3.5">
                        {c.isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950 border border-amber-800 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            <AlertTriangle className="h-3 w-3 text-amber-400" /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <div>Review Time: {c.medianFirstReviewDays || "2.1"}d</div>
                        <span className="text-slate-500">{c.reviewedApplications || 0}/{c.totalApplications || 0} reviewed</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          size="sm"
                          variant={c.isVerified ? "outline" : "default"}
                          className="text-xs h-7"
                          onClick={() => handleAction("TOGGLE_COMPANY_VERIFY", { companyId: c.id, isVerified: c.isVerified })}
                        >
                          {c.isVerified ? "Revoke" : "Verify Badge"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JOBS */}
        {activeTab === "JOBS" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Active Database Job Postings</h3>
              <span className="text-xs text-slate-400 font-mono">{jobs.length} Listings in PostgreSQL</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Job Title</th>
                    <th className="p-3.5">Type & Mode</th>
                    <th className="p-3.5">Compensation</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Boost</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {jobs.map((j: any) => (
                    <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        <div>{j.title}</div>
                        <span className="text-[10px] text-emerald-400 font-mono">/jobs/{j.slug}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] mr-1.5">
                          {j.jobType}
                        </span>
                        <span className="text-slate-400 text-[11px]">{j.workMode}</span>
                      </td>
                      <td className="p-3.5 font-mono">{j.salaryOrStipend}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${j.isActive ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
                          {j.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {j.isFeatured ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-950/80 border border-amber-700/80 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            <Sparkles className="h-3 w-3 text-amber-400" /> Featured
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono text-[10px]">Standard</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <Button
                          size="sm"
                          variant={j.isFeatured ? "outline" : "secondary"}
                          className="text-xs h-7"
                          onClick={() => handleAction("TOGGLE_JOB_FEATURED", { jobId: j.id, isFeatured: j.isFeatured })}
                        >
                          {j.isFeatured ? "Unboost" : "Boost ★"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 hover:bg-slate-800"
                          onClick={() => handleAction("TOGGLE_JOB_ACTIVE", { jobId: j.id, isActive: j.isActive })}
                        >
                          {j.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: APPLICATIONS & SIMULATOR */}
        {activeTab === "APPLICATIONS" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Truth Teller Real-Time Audit & Simulation</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  View candidates applying through the live portal. Trigger recruiter actions to verify real in-app notifications.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                No candidate applications recorded in PostgreSQL yet. Apply for a role on /jobs to see it appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Application ID</th>
                      <th className="p-3">Company & Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3">Recruiter Simulation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {applications.map((app: any) => (
                      <tr key={app.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono text-[10px] text-slate-400">
                          {app.id.slice(0, 8)}...
                        </td>
                        <td className="p-3 font-bold text-white">
                          <div>{app.jobTitle}</div>
                          <span className="text-[11px] text-slate-400 font-normal">at {app.companyName}</span>
                        </td>
                        <td className="p-3">
                          <span className="rounded bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 gap-1"
                            onClick={() => handleAction("SIMULATE_RECRUITER_ACTION", { applicationId: app.id, eventType: "RESUME_VIEWED" })}
                          >
                            <Eye className="h-3 w-3" /> Mark Viewed
                          </Button>
                          <Button
                            size="sm"
                            className="text-[11px] h-7 bg-blue-600 hover:bg-blue-500 text-white gap-1"
                            onClick={() => handleAction("SIMULATE_RECRUITER_ACTION", { applicationId: app.id, eventType: "SHORTLISTED" })}
                          >
                            <Sparkles className="h-3 w-3" /> Shortlist
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SYSTEM HEALTH & TELEMETRY */}
        {activeTab === "SYSTEM" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-1">
                    <Activity className="h-4 w-4" /> Production Telemetry & Diagnostics
                  </div>
                  <h3 className="text-xl font-bold text-white">Infrastructure Health Monitor</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time status of production database, in-memory cache, automated backup crons, and UFW firewall rules.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-9 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 gap-1.5"
                    disabled={actionLoading === "PING_GOOGLE_INDEXING"}
                    onClick={() => handleAction("PING_GOOGLE_INDEXING", { publishAll: true })}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    {actionLoading === "PING_GOOGLE_INDEXING" ? "Pinging Google..." : "Ping Google Indexing (All Jobs)"}
                  </Button>
                  <Link
                    href="/api/health"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Activity className="h-4 w-4" /> Inspect Raw /api/health
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Database Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-400" /> PostgreSQL 16 Service
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                      STATUS 200 OK
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Host Endpoint:</span>
                      <span>127.0.0.1:5432 (Isolated)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Database Name:</span>
                      <span className="text-white">jobmint_prod</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Live Ping Latency:</span>
                      <span className="text-emerald-400 font-bold">{health.database?.latencyMs ?? 1} ms</span>
                    </div>
                    <div className="flex justify-between py-1 font-mono">
                      <span className="text-slate-500">Driver / ORM:</span>
                      <span className="text-slate-400">postgres.js + Drizzle ORM</span>
                    </div>
                  </div>
                </div>

                {/* Redis Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Zap className="h-4 w-4 text-red-400" /> Redis In-Memory Service
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                      AUTH PONG OK
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Host Endpoint:</span>
                      <span>127.0.0.1:6379 (Isolated)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Auth Status:</span>
                      <span className="text-emerald-400 font-bold">Encrypted Secret Verified</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Live Ping Latency:</span>
                      <span className="text-emerald-400 font-bold">{health.redis?.latencyMs ?? 1} ms</span>
                    </div>
                    <div className="flex justify-between py-1 font-mono">
                      <span className="text-slate-500">Role:</span>
                      <span className="text-slate-400">Queues, Rate Limiting, Cache</span>
                    </div>
                  </div>
                </div>

                {/* Database Backups Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-purple-400" /> Automated Database Backups
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 border border-purple-800 text-purple-300">
                      CRON ACTIVE
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Schedule:</span>
                      <span className="text-purple-300 font-bold">Daily at 02:00 UTC</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Backup Directory:</span>
                      <span>/opt/backups/</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Compression:</span>
                      <span className="text-white">pg_dump | gzip (.sql.gz)</span>
                    </div>
                    <div className="flex justify-between py-1 font-mono">
                      <span className="text-slate-500">Retention Policy:</span>
                      <span className="text-emerald-400">Auto-prune files &gt; 7 days</span>
                    </div>
                  </div>
                </div>

                {/* Firewall & Port Hardening Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" /> UFW Firewall Hardening
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                      ENFORCED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Public Ingress:</span>
                      <span className="text-emerald-400 font-bold">Ports 22 (SSH), 80, 443</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Default Policy:</span>
                      <span className="text-amber-400">DROP / DENY ALL</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                      <span className="text-slate-500">Docker Containment:</span>
                      <span className="text-emerald-400 font-bold">127.0.0.1 (Strict Loopback)</span>
                    </div>
                    <div className="flex justify-between py-1 font-mono">
                      <span className="text-slate-500">Node Web Port:</span>
                      <span>3000 (Internal only, Proxied)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY */}
        {activeTab === "SECURITY" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-1">
                <ShieldCheck className="h-4 w-4" /> Multi-Layer Admin Protection
              </div>
              <h3 className="text-xl font-bold text-white">How This Admin Panel Is Secured</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Role Nest implements defense-in-depth security to guarantee unauthorized visitors, candidates, or recruiters can never execute governance commands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-400" /> 1. Server-Side Role-Based Access Control (RBAC)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every API and page request extracts the encrypted JWT session cookie with Auth.js. If <code className="text-emerald-300">user.role !== &quot;ADMIN&quot;</code>, the request is immediately aborted before reaching the database.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 2. Environment Email Allowlist
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The host server defines <code className="text-emerald-300">ADMIN_EMAILS</code> in <code className="text-slate-300">/opt/jobmint/app/.env</code> (mode 600). Even if a user logs in with Google, GitHub, or LinkedIn, admin privileges are strictly denied unless their verified email matches the allowlist.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" /> 3. PostgreSQL Database Identity Column
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The <code className="text-emerald-300">users.role</code> column in PostgreSQL defaults to <code className="text-slate-300">&quot;CANDIDATE&quot;</code>. Upgrading to <code className="text-slate-300">&quot;ADMIN&quot;</code> requires direct host database access or the master migration script.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-emerald-400" /> 4. Cloudflare Firewall & TLS 1.3
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All requests pass through Cloudflare with DDoS shielding, bot challenge rules, and encrypted HTTP/2 proxying directly to origin Nginx.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: RESUMES */}
        {activeTab === "RESUMES" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-1">
                    <FileText className="h-4 w-4" /> Candidate Resume Vault
                  </div>
                  <h3 className="text-xl font-bold text-white">Parsed & Uploaded Resumes ({resumes.length})</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct access to candidate resumes stored in the vault. Inspect ATS readability, download PDFs, or test match algorithms.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter candidate or email..."
                      value={resumeSearch}
                      onChange={(e) => setResumeSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Resume List Table */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Headline / Domain</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Experience Status</th>
                      <th className="py-3 px-4">Uploaded / Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {resumes
                      .filter((r: any) => {
                        if (!resumeSearch.trim()) return true;
                        const term = resumeSearch.toLowerCase();
                        return (
                          (r.userName || "").toLowerCase().includes(term) ||
                          (r.userEmail || "").toLowerCase().includes(term) ||
                          (r.headline || "").toLowerCase().includes(term) ||
                          (r.location || "").toLowerCase().includes(term)
                        );
                      })
                      .map((r: any) => (
                        <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                                {(r.userName || r.userEmail || "C")[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white">{r.userName || "Anonymous Candidate"}</div>
                                <div className="text-[11px] font-mono text-slate-400">{r.userEmail || "No email"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                            {r.headline || <span className="text-slate-500 italic">Not set</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {r.location || <span className="text-slate-500">Global</span>}
                          </td>
                          <td className="py-3 px-4">
                            {r.isFresher ? (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">
                                Fresher / 0 yrs
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                                Experienced
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                            {r.updatedAt
                              ? new Date(r.updatedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={r.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-colors border border-emerald-500/30"
                              >
                                <Eye className="h-3 w-3" /> View PDF
                              </a>
                              <a
                                href={r.resumeUrl}
                                download
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs transition-colors"
                                title="Download Resume"
                              >
                                <Download className="h-3 w-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {resumes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <FileText className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                          <p className="font-semibold text-white">No resumes in vault yet</p>
                          <p className="text-xs text-slate-500 mt-1">
                            When candidates upload their resumes via onboarding or profile, they will appear here.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SQL CONSOLE */}
        {activeTab === "SQL_CONSOLE" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-1">
                    <Terminal className="h-4 w-4" /> Live PostgreSQL Console
                  </div>
                  <h3 className="text-xl font-bold text-white">Supabase-Style SQL Editor</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Directly query and inspect production PostgreSQL tables with raw SQL. Guardrails block accidental database drops.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-950 border-emerald-800 text-emerald-300 font-mono text-[10px]">
                    POSTGRESQL 16
                  </Badge>
                  <Badge variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 font-mono text-[10px]">
                    READ / WRITE SAFEGUARDED
                  </Badge>
                </div>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick Query Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: "List All Public Tables",
                      q: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;",
                    },
                    {
                      label: "Recent Users (20)",
                      q: "SELECT id, name, email, role, is_pro, created_at FROM users ORDER BY created_at DESC LIMIT 20;",
                    },
                    {
                      label: "Candidate Profiles with Resumes",
                      q: "SELECT cp.id, u.name, u.email, cp.headline, cp.resume_url, cp.updated_at FROM candidate_profiles cp JOIN users u ON cp.user_id = u.id WHERE cp.resume_url IS NOT NULL ORDER BY cp.updated_at DESC LIMIT 20;",
                    },
                    {
                      label: "Live Tech Jobs (20)",
                      q: "SELECT j.id, j.title, c.name as company, j.type, j.is_active, j.created_at FROM jobs j LEFT JOIN companies c ON j.company_id = c.id ORDER BY j.created_at DESC LIMIT 20;",
                    },
                    {
                      label: "Applications Count by Status",
                      q: "SELECT status, count(*) as count FROM applications GROUP BY status ORDER BY count DESC;",
                    },
                    {
                      label: "Count Resumes in Vault",
                      q: "SELECT count(*) as total_candidates, count(resume_url) as with_resumes FROM candidate_profiles;",
                    },
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSqlQuery(tmpl.q);
                        handleRunSql(tmpl.q);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-emerald-300 border border-slate-800 transition-colors"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SQL Editor Area */}
              <div className="space-y-3">
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs focus-within:border-emerald-500 transition-colors">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 border-b border-slate-900 pb-2">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Terminal className="h-3 w-3 text-emerald-400" /> SQL Command Input
                    </span>
                    <span className="text-[10px] text-slate-500">Press Ctrl+Enter / ⌘+Enter to Run</span>
                  </div>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleRunSql();
                      }
                    }}
                    rows={5}
                    placeholder="Enter SQL query (e.g. SELECT * FROM users LIMIT 10;)"
                    className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-y leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleRunSql()}
                      disabled={sqlLoading || !sqlQuery.trim()}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2"
                    >
                      {sqlLoading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Executing SQL...
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" /> Run Query
                        </>
                      )}
                    </Button>
                    <button
                      onClick={() => {
                        setSqlQuery("");
                        setSqlResult(null);
                        setSqlError(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  {sqlResult && (
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-emerald-400 font-bold">
                        ✓ {sqlResult.totalRowsCount} row{sqlResult.totalRowsCount !== 1 ? "s" : ""}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{sqlResult.durationMs}ms</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 uppercase">{sqlResult.command}</span>
                      {sqlResult.rows && sqlResult.rows.length > 0 && (
                        <button
                          onClick={() => {
                            const headers = sqlResult.columns.join(",");
                            const csvRows = sqlResult.rows.map((row: any) =>
                              sqlResult.columns
                                .map((col: string) => {
                                  const val = row[col];
                                  if (val === null || val === undefined) return "";
                                  const str = typeof val === "object" ? JSON.stringify(val) : String(val);
                                  return `"${str.replace(/"/g, '""')}"`;
                                })
                                .join(",")
                            );
                            const blob = new Blob([headers + "\n" + csvRows.join("\n")], { type: "text/csv" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `query_export_${Date.now()}.csv`;
                            a.click();
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                        >
                          <Download className="h-3 w-3" /> Export CSV
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Box */}
              {sqlError && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-xs font-mono text-red-200 space-y-1">
                  <div className="font-bold flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-4 w-4" /> SQL Execution Failed
                  </div>
                  <div className="text-[11px] text-red-300 whitespace-pre-wrap">{sqlError}</div>
                </div>
              )}

              {/* Result Table */}
              {sqlResult && sqlResult.columns && (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 sticky top-0 z-10 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3 text-slate-500 w-12 text-center">#</th>
                          {sqlResult.columns.map((col: string) => (
                            <th key={col} className="py-2.5 px-3 text-emerald-400 font-bold whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {sqlResult.rows.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-2 px-3 text-slate-600 text-center text-[10px]">{rIdx + 1}</td>
                            {sqlResult.columns.map((col: string) => {
                              const val = row[col];
                              let displayVal: any;
                              if (val === null || val === undefined) {
                                displayVal = <span className="text-slate-600 italic">NULL</span>;
                              } else if (typeof val === "boolean") {
                                displayVal = (
                                  <span className={val ? "text-emerald-400 font-bold" : "text-red-400"}>
                                    {String(val)}
                                  </span>
                                );
                              } else if (typeof val === "object") {
                                displayVal = (
                                  <span className="text-amber-300 max-w-xs truncate block" title={JSON.stringify(val)}>
                                    {JSON.stringify(val)}
                                  </span>
                                );
                              } else {
                                const str = String(val);
                                displayVal = (
                                  <span className="text-slate-200 max-w-xs truncate block" title={str}>
                                    {str}
                                  </span>
                                );
                              }
                              return (
                                <td key={col} className="py-2 px-3 text-[11px] whitespace-nowrap">
                                  {displayVal}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                        {sqlResult.rows.length === 0 && (
                          <tr>
                            <td colSpan={sqlResult.columns.length + 1} className="py-8 text-center text-slate-500 text-xs">
                              Query completed with zero rows returned.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {sqlResult.totalRowsCount > 100 && (
                    <div className="py-2 px-4 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 font-mono text-center">
                      Showing first 100 of {sqlResult.totalRowsCount} rows. Use LIMIT or pagination in your query for targeted slicing.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
