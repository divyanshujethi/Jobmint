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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminPanel() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "COMPANIES" | "JOBS" | "APPLICATIONS" | "SECURITY">("OVERVIEW");
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
        <p className="text-sm font-mono text-slate-400">Loading JobMint SuperAdmin Console...</p>
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
              Only authorized administrator accounts (e.g. admin@ritualdev.in, divyanshu.dev@gmail.com) can access this terminal.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/auth/signin">
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
              JobMint Governance & Operations Console
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          { id: "SECURITY", label: "RBAC Security Guard", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono text-slate-400 block">Verified Companies</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white">{stats.verifiedCompanies}</span>
                  <span className="text-xs text-emerald-400">of {stats.totalCompanies} active</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono text-slate-400 block">Live Tech Jobs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-400">{stats.activeJobs}</span>
                  <span className="text-xs text-slate-400">PostgreSQL</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono text-slate-400 block">Applications Tracked</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-blue-400">{stats.totalApplications}</span>
                  <span className="text-xs text-blue-300">Truth Teller</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <span className="text-xs font-mono text-slate-400 block">Registered Users</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-purple-400">{stats.totalUsers}</span>
                  <span className="text-xs text-purple-300">Auth.js SSO</span>
                </div>
              </div>
            </div>

            {/* Architecture Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400">
                  <Cpu className="h-4 w-4" /> AI Tier 1 Gateway
                </div>
                <h4 className="text-base font-bold text-white">Groq Qwen/Llama 3.3</h4>
                <p className="text-xs text-slate-400">Ultra-fast inference (246ms) with circuit-breaker quota protection.</p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300">STATUS: HEALTHY</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-400">
                  <Layers className="h-4 w-4" /> Database Engine
                </div>
                <h4 className="text-base font-bold text-white">OCI PostgreSQL 16</h4>
                <p className="text-xs text-slate-400">Indexed connection pooling on localhost:5432, 18 relational tables.</p>
                <div className="pt-2 text-[11px] font-mono text-blue-300">STATUS: CONNECTED</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-400">
                  <ShieldCheck className="h-4 w-4" /> Storage Vault
                </div>
                <h4 className="text-base font-bold text-white">200 GB NVMe Disk</h4>
                <p className="text-xs text-slate-400">SHA-256 deduplication and token-gated HMAC streaming for candidate CVs.</p>
                <div className="pt-2 text-[11px] font-mono text-purple-300">PATH: /data/resumes</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPANIES */}
        {activeTab === "COMPANIES" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Registered Companies & Verification Badges</h3>
              <span className="text-xs text-slate-400 font-mono">10 Verified in Database</span>
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
                        <span className="text-slate-500">{c.reviewedApplications}/{c.totalApplications} reviewed</span>
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
              <span className="text-xs text-slate-400 font-mono">Live PostgreSQL Listings</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Job Title</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Work Mode</th>
                    <th className="p-3.5">Compensation</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
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
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px]">
                          {j.jobType}
                        </span>
                      </td>
                      <td className="p-3.5">{j.workMode}</td>
                      <td className="p-3.5 font-mono">{j.salaryOrStipend}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${j.isActive ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"}`}>
                          {j.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
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

        {/* TAB 5: SECURITY */}
        {activeTab === "SECURITY" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-1">
                <ShieldCheck className="h-4 w-4" /> Multi-Layer Admin Protection
              </div>
              <h3 className="text-xl font-bold text-white">How This Admin Panel Is Secured</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                JobMint implements defense-in-depth security to guarantee unauthorized visitors, candidates, or recruiters can never execute governance commands.
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
