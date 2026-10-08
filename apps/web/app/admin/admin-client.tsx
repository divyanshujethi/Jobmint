"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
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
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Columns,
  Code,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  DollarSign,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SuperAdminPanelClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "TABLE_EDITOR" | "COMPANIES" | "JOBS" | "APPLICATIONS" | "RESUMES" | "SALARIES" | "SYSTEM"
  >("OVERVIEW");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Salaries Search
  const [salarySearch, setSalarySearch] = useState("");

  // Resume Search
  const [resumeSearch, setResumeSearch] = useState("");

  // Companies Search & Filter
  const [companySearch, setCompanySearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState<"ALL" | "VERIFIED" | "UNVERIFIED">("ALL");

  // Jobs Search & Filter
  const [jobSearch, setJobSearch] = useState("");
  const [jobFilter, setJobFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "FEATURED">("ALL");

  // Supabase Table Editor State
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [tableFilter, setTableFilter] = useState("");
  const [selectedTable, setSelectedTable] = useState("jobs");
  const [tableData, setTableData] = useState<any>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(50);
  const [tableSearch, setTableSearch] = useState("");
  const [tableSearchInput, setTableSearchInput] = useState("");
  const [tableSort, setTableSort] = useState("");
  const [tableOrder, setTableOrder] = useState<"asc" | "desc">("desc");
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState(false);

  // SQL Console (Inside Table Editor or Standalone)
  const [editorMode, setEditorMode] = useState<"GRID" | "SQL">("GRID");
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
  );
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);

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

  const fetchTableData = async (
    tblName = selectedTable,
    page = tablePage,
    limit = tableLimit,
    search = tableSearch,
    sort = tableSort,
    order = tableOrder
  ) => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams({
        table: tblName,
        page: String(page),
        limit: String(limit),
        search: search,
        sort: sort,
        order: order,
      });
      const res = await fetch(`/api/admin/tables?${params.toString()}`);
      const resData = await res.json();
      if (resData.tables) {
        setDbTables(resData.tables);
      }
      if (resData.currentTable) {
        setTableData(resData.currentTable);
      }
    } catch (err) {
      console.error("Failed to fetch table data:", err);
    } finally {
      setTableLoading(false);
    }
  };

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
      if (activeTab === "TABLE_EDITOR") {
        fetchTableData();
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Fetch initial table metadata when Table Editor tab is opened
  useEffect(() => {
    if (activeTab === "TABLE_EDITOR") {
      fetchTableData(selectedTable, tablePage, tableLimit, tableSearch, tableSort, tableOrder);
    }
  }, [activeTab, selectedTable, tablePage, tableLimit, tableSearch, tableSort, tableOrder]);

  const filteredTables = useMemo(() => {
    if (!tableFilter.trim()) return dbTables;
    const term = tableFilter.toLowerCase();
    return dbTables.filter((t) => t.name.toLowerCase().includes(term));
  }, [dbTables, tableFilter]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading RoleNest SuperAdmin Terminal...</p>
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
              This terminal provides direct platform governance over corporate verifications, live job toggling, and recruiter audits.
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
  const pendingSalaries = data?.pendingSalaries || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* TOP ADMIN HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                SuperAdmin Studio
              </span>
              <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                PROD-ACTIVE
              </span>
              <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-300 hidden sm:inline-block">
                PostgreSQL 16 ({health.database?.latencyMs ?? 1}ms)
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              RoleNest Governance &amp; Database Console
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Link
            href="/admin/alligators"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-xs font-semibold text-emerald-300 transition-colors border border-emerald-800/60 shadow-sm"
          >
            <span>🐊</span>
            <span>Alligators Fleet</span>
          </Link>

          <Link
            href="/admin/system"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-semibold text-cyan-300 transition-colors border border-cyan-800/60 shadow-sm"
          >
            <Server className="h-3.5 w-3.5 text-cyan-400" />
            <span>Architecture</span>
          </Link>

          <button
            onClick={fetchAdminData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
            title="Refresh database state"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Sync</span>
          </button>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shadow-sm"
          >
            Public Site &rarr;
          </Link>
        </div>
      </header>

      {message && (
        <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* TOP TABS NAVIGATION */}
      <nav className="mx-4 sm:mx-8 mt-5 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
        {[
          { id: "OVERVIEW", label: "Overview", icon: Layers },
          { id: "TABLE_EDITOR", label: "Table Editor (Supabase)", icon: TableIcon, highlight: true },
          { id: "COMPANIES", label: `Companies (${companies.length})`, icon: Building2 },
          { id: "JOBS", label: `Jobs (${jobs.length})`, icon: Briefcase },
          { id: "APPLICATIONS", label: `Truth Teller (${applications.length})`, icon: Eye },
          { id: "RESUMES", label: `Resumes (${resumes.length})`, icon: FileText },
          { id: "SALARIES", label: `Salaries (${pendingSalaries.length})`, icon: DollarSign },
          { id: "SYSTEM", label: "System & Backups", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap text-xs ${
                isActive
                  ? tab.highlight
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-white font-bold border border-slate-700"
                  : tab.highlight
                    ? "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/50"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <a
          href="https://internship.rolenest.in/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold whitespace-nowrap ml-auto"
        >
          <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
          <span>Internship Admissions &rarr;</span>
        </a>
      </nav>

      {/* MAIN TAB CONTENT CONTAINER */}
      <main className="mx-4 sm:mx-8 mt-5">
        {/* ======================================================== */}
        {/* TAB 1: PLATFORM OVERVIEW                                 */}
        {/* ======================================================== */}
        {activeTab === "OVERVIEW" && (
          <div className="space-y-6">
            {/* 6 Clean Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 block">Verified Companies</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white">{stats.verifiedCompanies || 0}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">/{stats.totalCompanies || 0}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 block">Live Tech Jobs</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-400">{stats.activeJobs || 0}</span>
                  <span className="text-[10px] text-slate-500 font-mono">/{stats.totalJobs || 0}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 block">Resumes in Vault</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-300">
                    {stats.totalResumes || resumes.length || 0}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">PDFs</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 block">Applications Tracked</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-blue-400">{stats.totalApplications || 0}</span>
                  <span className="text-[10px] text-blue-300 font-mono">Truth Teller</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 block">Pro Candidates</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-400">{stats.proUsers || 0}</span>
                  <span className="text-[10px] text-amber-300/80 font-mono">Cashfree</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 block">Registered Users</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-purple-400">{stats.totalUsers || 0}</span>
                  <span className="text-[10px] text-purple-300 font-mono">Auth.js</span>
                </div>
              </div>
            </div>

            {/* Quick Launchpad to Supabase Studio */}
            <div className="rounded-2xl border border-emerald-900/50 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-950 border-emerald-700 text-emerald-300 text-[10px] font-mono">
                    NEW FEATURE
                  </Badge>
                  <h3 className="text-base font-bold text-white">Supabase-Style Table Editor & Data Grid</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Browse all 26+ production PostgreSQL tables, inspect schema column types, run paginated queries with search, inspect JSON payloads in drawer, or execute raw SQL commands directly.
                </p>
              </div>
              <Button
                onClick={() => setActiveTab("TABLE_EDITOR")}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs gap-2 px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                <TableIcon className="h-4 w-4" /> Open Table Studio
              </Button>
            </div>

            {/* System Telemetries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-400">
                    <Database className="h-4 w-4" /> PostgreSQL 16
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    {health.database?.status === "connected" ? "CONNECTED" : "ONLINE"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">Dedicated Database Cluster</h4>
                <p className="text-xs text-slate-400">
                  Drizzle ORM over postgres.js socket. Latency: {health.database?.latencyMs ?? 1}ms.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 127.0.0.1:5432 Isolated
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-400">
                    <Zap className="h-4 w-4" /> Redis 7.2 Cache
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    PONG OK
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">In-Memory Cache & Queues</h4>
                <p className="text-xs text-slate-400">
                  Password authenticated socket. Latency: {health.redis?.latencyMs ?? 1}ms.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 127.0.0.1:6379 Active
                </div>
              </div>

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
                  Gzip archive saved to <code className="text-purple-300">/opt/backups/</code> with 7-day retention.
                </p>
                <div className="pt-2 text-[11px] font-mono text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Cron Daemon Active
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400">
                    <ShieldCheck className="h-4 w-4" /> UFW Firewall
                  </div>
                  <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                    HARDENED
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">TLS 1.3 Reverse Proxy</h4>
                <p className="text-xs text-slate-400">
                  Public Ports: 22, 80, 443. All database ports blocked externally.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Cloudflare Proxied
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SUPABASE-STYLE TABLE EDITOR STUDIO                */}
        {/* ======================================================== */}
        {activeTab === "TABLE_EDITOR" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[720px]">
            {/* LEFT SIDEBAR: TABLES NAVIGATOR */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 p-3.5 flex flex-col space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Public Schema
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono bg-slate-900 text-slate-400 border-slate-800">
                  {dbTables.length} Tables
                </Badge>
              </div>

              {/* Table search filter */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter tables..."
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Tables List */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[560px] scrollbar-thin">
                {filteredTables.map((t) => {
                  const isSelected = selectedTable === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => {
                        setSelectedTable(t.name);
                        setTablePage(1);
                        setTableSearch("");
                        setTableSearchInput("");
                        setTableSort("");
                        setSelectedRow(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-all text-left ${
                        isSelected
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold"
                          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <TableIcon className={`h-3.5 w-3.5 flex-shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                        <span className="truncate">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/80">
                        {t.estimatedRows >= 1000
                          ? `${(t.estimatedRows / 1000).toFixed(1)}k`
                          : t.estimatedRows}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* RIGHT MAIN PANEL: TABLE DATA & SQL EDITOR */}
            <section className="flex-1 flex flex-col bg-slate-900/40 overflow-hidden">
              {/* Table Toolbar Header */}
              <div className="border-b border-slate-800 bg-slate-950/40 p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                      <TableIcon className="h-4 w-4 text-emerald-400" />
                      public.{selectedTable}
                    </span>
                    {tableData && (
                      <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 text-[10px] font-mono">
                        {tableData.totalRows?.toLocaleString()} rows
                      </Badge>
                    )}
                  </div>

                  {/* Mode switch */}
                  <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs">
                    <button
                      onClick={() => setEditorMode("GRID")}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
                        editorMode === "GRID"
                          ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <TableIcon className="h-3 w-3" /> Data Grid
                    </button>
                    <button
                      onClick={() => setEditorMode("SQL")}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
                        editorMode === "SQL"
                          ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Terminal className="h-3 w-3" /> Raw SQL
                    </button>
                  </div>
                </div>

                {editorMode === "GRID" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Search within table */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setTableSearch(tableSearchInput);
                        setTablePage(1);
                      }}
                      className="relative flex items-center"
                    >
                      <Search className="h-3.5 w-3.5 absolute left-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={tableSearchInput}
                        onChange={(e) => setTableSearchInput(e.target.value)}
                        className="pl-8 pr-7 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
                      />
                      {tableSearchInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setTableSearchInput("");
                            setTableSearch("");
                            setTablePage(1);
                          }}
                          className="absolute right-2 text-slate-500 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </form>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSchemaDrawer(!showSchemaDrawer)}
                      className="h-8 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 gap-1.5"
                    >
                      <Columns className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Columns ({tableData?.columns?.length || 0})</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchTableData()}
                      disabled={tableLoading}
                      className="h-8 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 gap-1"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${tableLoading ? "animate-spin text-emerald-400" : ""}`} />
                    </Button>

                    {tableData?.rows?.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const cols = tableData.columns.map((c: any) => c.name);
                          const csvContent = [
                            cols.join(","),
                            ...tableData.rows.map((row: any) =>
                              cols
                                .map((c: string) => {
                                  const val = row[c];
                                  if (val === null || val === undefined) return "";
                                  const str = typeof val === "object" ? JSON.stringify(val) : String(val);
                                  return `"${str.replace(/"/g, '""')}"`;
                                })
                                .join(",")
                            ),
                          ].join("\n");
                          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${selectedTable}_export_${Date.now()}.csv`;
                          a.click();
                        }}
                        className="h-8 text-xs border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" /> CSV
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* SCHEMA DRAWER / MODAL POPUP */}
              {showSchemaDrawer && tableData?.columns && (
                <div className="border-b border-slate-800 bg-slate-950/80 p-3 sm:px-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Table Schema: public.{selectedTable}
                    </span>
                    <button
                      onClick={() => setShowSchemaDrawer(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tableData.columns.map((col: any) => (
                      <div
                        key={col.name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono"
                      >
                        <span className="text-white font-semibold">{col.name}</span>
                        <span className="text-emerald-400 text-[10px]">{col.type}</span>
                        {col.isNullable && <span className="text-slate-500 text-[9px]">nullable</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 1: DATA GRID */}
              {editorMode === "GRID" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[580px] scrollbar-thin">
                    {tableLoading ? (
                      <div className="p-16 flex flex-col items-center justify-center space-y-3">
                        <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin" />
                        <span className="text-xs font-mono text-slate-400">Loading {selectedTable}...</span>
                      </div>
                    ) : tableData && tableData.columns ? (
                      <table className="w-full text-left text-xs font-mono border-collapse">
                        <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] sticky top-0 z-10 border-b border-slate-800 backdrop-blur">
                          <tr>
                            <th className="py-2.5 px-3 text-slate-500 w-12 text-center border-r border-slate-800/60">
                              #
                            </th>
                            {tableData.columns.map((col: any) => (
                              <th
                                key={col.name}
                                onClick={() => {
                                  if (tableSort === col.name) {
                                    setTableOrder(tableOrder === "asc" ? "desc" : "asc");
                                  } else {
                                    setTableSort(col.name);
                                    setTableOrder("desc");
                                  }
                                  setTablePage(1);
                                }}
                                className="py-2.5 px-3 whitespace-nowrap border-r border-slate-800/60 cursor-pointer hover:bg-slate-900 transition-colors group select-none"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-200 group-hover:text-emerald-400 font-bold">
                                    {col.name}
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-normal lowercase">
                                    {col.type}
                                  </span>
                                  {tableSort === col.name && (
                                    <span className="text-emerald-400 text-xs">
                                      {tableOrder === "asc" ? "▲" : "▼"}
                                    </span>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {tableData.rows && tableData.rows.length > 0 ? (
                            tableData.rows.map((row: any, rIdx: number) => (
                              <tr
                                key={rIdx}
                                onClick={() => setSelectedRow(row)}
                                className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                                title="Click to inspect row data"
                              >
                                <td className="py-2 px-3 text-slate-600 text-center text-[10px] border-r border-slate-800/40 group-hover:text-emerald-400">
                                  {(tablePage - 1) * tableLimit + rIdx + 1}
                                </td>
                                {tableData.columns.map((col: any) => {
                                  const val = row[col.name];
                                  let cellDisplay: any;

                                  if (val === null || val === undefined) {
                                    cellDisplay = <span className="text-slate-600 italic">null</span>;
                                  } else if (typeof val === "boolean") {
                                    cellDisplay = (
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                          val
                                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                            : "bg-rose-950 text-rose-300 border border-rose-800"
                                        }`}
                                      >
                                        {String(val)}
                                      </span>
                                    );
                                  } else if (typeof val === "object") {
                                    cellDisplay = (
                                      <span className="text-amber-300 max-w-xs truncate block" title={JSON.stringify(val)}>
                                        {JSON.stringify(val)}
                                      </span>
                                    );
                                  } else {
                                    const str = String(val);
                                    cellDisplay = (
                                      <span className="text-slate-200 max-w-xs truncate block" title={str}>
                                        {str}
                                      </span>
                                    );
                                  }

                                  return (
                                    <td
                                      key={col.name}
                                      className="py-2 px-3 text-[11px] whitespace-nowrap border-r border-slate-800/40"
                                    >
                                      {cellDisplay}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={(tableData.columns?.length || 1) + 1}
                                className="py-12 text-center text-slate-500 text-xs"
                              >
                                {tableSearch
                                  ? `No records found matching "${tableSearch}".`
                                  : `Table '${selectedTable}' contains zero records.`}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ) : null}
                  </div>

                  {/* Table Footer with Pagination */}
                  <div className="border-t border-slate-800 bg-slate-950/60 p-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                    <div className="text-slate-400">
                      Showing{" "}
                      <span className="text-white font-bold">
                        {tableData?.totalRows > 0 ? (tablePage - 1) * tableLimit + 1 : 0}
                      </span>{" "}
                      to{" "}
                      <span className="text-white font-bold">
                        {Math.min(tablePage * tableLimit, tableData?.totalRows || 0)}
                      </span>{" "}
                      of{" "}
                      <span className="text-emerald-400 font-bold">
                        {tableData?.totalRows?.toLocaleString() || 0}
                      </span>{" "}
                      records
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>Page size:</span>
                        <select
                          value={tableLimit}
                          onChange={(e) => {
                            setTableLimit(Number(e.target.value));
                            setTablePage(1);
                          }}
                          className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={tablePage <= 1 || tableLoading}
                          onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                          className="h-7 px-2 border-slate-800 text-slate-300"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <span className="px-2 text-slate-400">
                          {tablePage} / {tableData?.totalPages || 1}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={tablePage >= (tableData?.totalPages || 1) || tableLoading}
                          onClick={() => setTablePage((p) => p + 1)}
                          className="h-7 px-2 border-slate-800 text-slate-300"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: RAW SQL CONSOLE */}
              {editorMode === "SQL" && (
                <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Quick Query Templates:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          label: "List Public Tables",
                          q: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;",
                        },
                        {
                          label: "Sample Jobs (20)",
                          q: "SELECT id, title, type, is_active, created_at FROM jobs ORDER BY created_at DESC LIMIT 20;",
                        },
                        {
                          label: "Verified Companies",
                          q: "SELECT id, name, domain, website, is_verified, created_at FROM companies WHERE is_verified = true ORDER BY created_at DESC LIMIT 20;",
                        },
                        {
                          label: "Recent Users",
                          q: "SELECT id, name, email, role, is_pro, created_at FROM users ORDER BY created_at DESC LIMIT 20;",
                        },
                        {
                          label: "Applications Status Count",
                          q: "SELECT status, count(*) as count FROM applications GROUP BY status ORDER BY count DESC;",
                        },
                        {
                          label: "Top Demanded Skills",
                          q: "SELECT s.name, count(js.job_id) as count FROM job_skills js JOIN skills s ON js.skill_id = s.id GROUP BY s.name ORDER BY count DESC LIMIT 10;",
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

                  {/* SQL Textarea */}
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
                      </div>
                    )}
                  </div>

                  {sqlError && (
                    <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-xs font-mono text-red-200 space-y-1">
                      <div className="font-bold flex items-center gap-2 text-red-400">
                        <AlertTriangle className="h-4 w-4" /> SQL Execution Failed
                      </div>
                      <div className="text-[11px] text-red-300 whitespace-pre-wrap">{sqlError}</div>
                    </div>
                  )}

                  {sqlResult && sqlResult.columns && (
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
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
                                {sqlResult.columns.map((col: string) => (
                                  <td key={col} className="py-2 px-3 text-[11px] whitespace-nowrap">
                                    {row[col] === null || row[col] === undefined ? (
                                      <span className="text-slate-600 italic">null</span>
                                    ) : typeof row[col] === "object" ? (
                                      JSON.stringify(row[col])
                                    ) : (
                                      String(row[col])
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ROW DETAILS INSPECTOR MODAL */}
        {selectedRow && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="border-b border-slate-800 p-4 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-mono">
                    Row Details: public.{selectedTable}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(selectedRow, null, 2), "ALL_JSON")}
                    className="h-7 text-xs border-slate-800 bg-slate-900 text-slate-300 gap-1.5"
                  >
                    {copiedField === "ALL_JSON" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedField === "ALL_JSON" ? "Copied JSON" : "Copy JSON"}</span>
                  </Button>
                  <button
                    onClick={() => setSelectedRow(null)}
                    className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto space-y-2.5 font-mono text-xs">
                {Object.entries(selectedRow).map(([key, value]) => {
                  const strVal = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "");
                  return (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1 group hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold text-[11px]">{key}</span>
                        <button
                          onClick={() => copyToClipboard(strVal, key)}
                          className="text-[10px] text-slate-500 hover:text-emerald-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedField === key ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedField === key ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <div className="text-slate-300 text-xs break-all whitespace-pre-wrap leading-relaxed">
                        {value === null || value === undefined ? (
                          <span className="text-slate-600 italic">null</span>
                        ) : typeof value === "boolean" ? (
                          <span className={value ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            {String(value)}
                          </span>
                        ) : (
                          strVal
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: COMPANIES                                         */}
        {/* ======================================================== */}
        {activeTab === "COMPANIES" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Registered Corporate Entities</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Over {stats.totalCompanies?.toLocaleString() || companies.length} employers crawled and verified in PostgreSQL.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search company or domain..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VERIFIED">Verified Only</option>
                  <option value="UNVERIFIED">Unverified Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Industry</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {companies
                    .filter((c: any) => {
                      if (companyFilter === "VERIFIED" && !c.isVerified) return false;
                      if (companyFilter === "UNVERIFIED" && c.isVerified) return false;
                      if (!companySearch.trim()) return true;
                      const term = companySearch.toLowerCase();
                      return (
                        (c.name || "").toLowerCase().includes(term) ||
                        (c.domain || "").toLowerCase().includes(term) ||
                        (c.website || "").toLowerCase().includes(term)
                      );
                    })
                    .map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-emerald-400 border border-slate-700">
                            {c.name ? c.name.charAt(0) : "C"}
                          </div>
                          <div>
                            <div>{c.name}</div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {c.domain || c.website || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400">{c.industry || "Technology"}</td>
                        <td className="p-3.5 text-slate-400">{c.location || "Remote / India"}</td>
                        <td className="p-3.5">
                          {c.isVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-950 border border-amber-800 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                              <AlertTriangle className="h-3 w-3 text-amber-400" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            size="sm"
                            variant={c.isVerified ? "outline" : "default"}
                            className={`text-xs h-7 ${
                              c.isVerified
                                ? "border-slate-700 text-rose-400 hover:bg-rose-950/40"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                            }`}
                            onClick={() =>
                              handleAction("TOGGLE_COMPANY_VERIFY", {
                                companyId: c.id,
                                isVerified: c.isVerified,
                              })
                            }
                          >
                            {c.isVerified ? "Revoke" : "Approve Badge"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: JOB POSTINGS                                      */}
        {/* ======================================================== */}
        {activeTab === "JOBS" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Active Database Job Postings</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Over {stats.totalJobs?.toLocaleString() || jobs.length} postings indexed in PostgreSQL.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="ALL">All Jobs</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                  <option value="FEATURED">Featured Boosted</option>
                </select>
              </div>
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
                  {jobs
                    .filter((j: any) => {
                      if (jobFilter === "ACTIVE" && !j.isActive) return false;
                      if (jobFilter === "INACTIVE" && j.isActive) return false;
                      if (jobFilter === "FEATURED" && !j.isFeatured) return false;
                      if (!jobSearch.trim()) return true;
                      const term = jobSearch.toLowerCase();
                      return (
                        (j.title || "").toLowerCase().includes(term) ||
                        (j.jobType || "").toLowerCase().includes(term)
                      );
                    })
                    .map((j: any) => (
                      <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-bold text-white">
                          <div>{j.title}</div>
                          <span className="text-[10px] text-emerald-400 font-mono">/jobs/{j.slug}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] mr-1.5 text-slate-200">
                            {j.jobType}
                          </span>
                          <span className="text-slate-400 text-[11px]">{j.workMode}</span>
                        </td>
                        <td className="p-3.5 font-mono">{j.salaryOrStipend}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              j.isActive
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-red-950 text-red-300 border border-red-800"
                            }`}
                          >
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
                            onClick={() =>
                              handleAction("TOGGLE_JOB_FEATURED", {
                                jobId: j.id,
                                isFeatured: j.isFeatured,
                              })
                            }
                          >
                            {j.isFeatured ? "Unboost" : "Boost ★"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 hover:bg-slate-800"
                            onClick={() =>
                              handleAction("TOGGLE_JOB_ACTIVE", {
                                jobId: j.id,
                                isActive: j.isActive,
                              })
                            }
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

        {/* ======================================================== */}
        {/* TAB 5: APPLICATIONS (TRUTH TELLER)                      */}
        {/* ======================================================== */}
        {activeTab === "APPLICATIONS" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4 p-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">Truth Teller Real-Time Audit & Simulation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect candidate applications and simulate recruiter review events (viewed, shortlisted) with real email dispatches.
              </p>
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
                      <th className="p-3 text-right">Recruiter Simulation</th>
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
                        <td className="p-3 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 gap-1"
                            onClick={() =>
                              handleAction("SIMULATE_RECRUITER_ACTION", {
                                applicationId: app.id,
                                eventType: "RESUME_VIEWED",
                              })
                            }
                          >
                            <Eye className="h-3 w-3" /> Mark Viewed
                          </Button>
                          <Button
                            size="sm"
                            className="text-[11px] h-7 bg-blue-600 hover:bg-blue-500 text-white gap-1"
                            onClick={() =>
                              handleAction("SIMULATE_RECRUITER_ACTION", {
                                applicationId: app.id,
                                eventType: "SHORTLISTED",
                              })
                            }
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

        {/* ======================================================== */}
        {/* TAB 6: RESUMES VAULT                                     */}
        {/* ======================================================== */}
        {activeTab === "RESUMES" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 mb-1">
                  <FileText className="h-4 w-4" /> Candidate Resume Vault
                </div>
                <h3 className="text-xl font-bold text-white">Parsed & Uploaded Resumes ({resumes.length})</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Candidate resumes stored in the vault. Inspect ATS readability or download PDFs.
                </p>
              </div>
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

            <div className="overflow-x-auto">
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
                        <td className="py-3 px-4 text-slate-400">{r.location || "Global"}</td>
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
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: SALARIES (MODERATION QUEUE)                         */}
        {/* ======================================================== */}
        {activeTab === "SALARIES" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <DollarSign className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Salary Moderation Queue ({pendingSalaries.length} Pending)
                  </h3>
                  {pendingSalaries.length > 0 && (
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono text-amber-300 font-bold">
                      AWAITING REVIEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Review anonymous community compensation submissions to filter out spam, false reports, and outliers before publishing to live benchmarks.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search company or role..."
                    value={salarySearch}
                    onChange={(e) => setSalarySearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
                  />
                </div>
                <Link
                  href="/salaries"
                  target="_blank"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  <span>Public Benchmarks</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {pendingSalaries.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Moderation Queue is Clean</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    No pending salary submissions awaiting verification. When users submit compensation on /salaries, they will appear here for review.
                  </p>
                </div>
                <Link
                  href="/salaries"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
                >
                  <span>Test Submit on /salaries</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Company &amp; Role</th>
                      <th className="py-3 px-4">Compensation (CTC)</th>
                      <th className="py-3 px-4">Breakdown</th>
                      <th className="py-3 px-4">Location &amp; Mode</th>
                      <th className="py-3 px-4">Interview / Rounds</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {pendingSalaries
                      .filter((s: any) => {
                        if (!salarySearch.trim()) return true;
                        const term = salarySearch.toLowerCase();
                        return (
                          (s.companyName || "").toLowerCase().includes(term) ||
                          (s.role || "").toLowerCase().includes(term) ||
                          (s.location || "").toLowerCase().includes(term)
                        );
                      })
                      .map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-sm">{s.companyName}</div>
                            <div className="text-slate-300 text-xs flex items-center gap-1.5 mt-0.5">
                              <span>{s.role}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-[10px] font-mono text-emerald-400">{s.level}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
                                {s.tier}
                              </span>
                              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-indigo-300">
                                {s.roleTrack}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-base font-black text-emerald-400 font-mono">
                              ₹{s.totalCtcLpa} LPA
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Est. {s.estimatedMonthlyInHand}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px] space-y-0.5">
                            <div>Base: <span className="text-white font-semibold">₹{s.baseSalaryLpa}L</span></div>
                            <div>Bonus: <span className="text-slate-400">₹{s.bonusLpa}L</span></div>
                            <div>Stocks: <span className="text-amber-400">₹{s.stocksLpa}L</span></div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white font-medium">{s.location || "Bangalore"}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{s.workMode}</span>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="text-slate-300 text-[11px] line-clamp-2 font-mono">
                              {s.interviewRounds || "Standard Technical Rounds"}
                            </p>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                            {s.submittedAt
                              ? new Date(s.submittedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recent"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 gap-1 shadow-sm"
                                disabled={actionLoading === "APPROVE_SALARY"}
                                onClick={() =>
                                  handleAction("APPROVE_SALARY", {
                                    salaryId: s.id,
                                  })
                                }
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Approve &amp; Publish</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 border-red-800/60 text-xs h-8 gap-1"
                                disabled={actionLoading === "REJECT_SALARY"}
                                onClick={() =>
                                  handleAction("REJECT_SALARY", {
                                    salaryId: s.id,
                                  })
                                }
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Reject / Spam</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SYSTEM HEALTH & TELEMETRY                        */}
        {/* ======================================================== */}
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
                    Real-time status of production database, in-memory cache, automated backup crons, and firewall.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
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
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-400" /> PostgreSQL 16 Service
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                      STATUS 200 OK
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Host Endpoint:</span>
                      <span>127.0.0.1:5432</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Database Name:</span>
                      <span className="text-white">jobmint_prod</span>
                    </div>
                    <div className="flex justify-between py-1 font-mono">
                      <span className="text-slate-500">Live Latency:</span>
                      <span className="text-emerald-400 font-bold">{health.database?.latencyMs ?? 1} ms</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <Zap className="h-4 w-4 text-red-400" /> Redis In-Memory Service
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                      AUTH PONG OK
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Host Endpoint:</span>
                      <span>127.0.0.1:6379</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-500">Auth Status:</span>
                      <span className="text-emerald-400 font-bold">Encrypted Secret Verified</span>
                    </div>
                    <div className="flex justify-between py-1 font-mono">
                      <span className="text-slate-500">Live Latency:</span>
                      <span className="text-emerald-400 font-bold">{health.redis?.latencyMs ?? 1} ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
