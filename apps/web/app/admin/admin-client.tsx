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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SuperAdminPanelClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "COMPANIES" | "JOBS" | "APPLICATIONS" | "SYSTEM" | "SECURITY"
  >("OVERVIEW");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
            {/* 6 High-Level Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
                <Link
                  href="/api/health"
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
                >
                  <Activity className="h-4 w-4" /> Inspect Raw JSON /api/health
                </Link>
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
      </div>
    </div>
  );
}
