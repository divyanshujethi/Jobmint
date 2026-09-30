"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Save,
  RefreshCw,
  ExternalLink,
  Download,
  FileCheck2,
  Award,
  ChevronRight,
  Bell,
  Code2,
  Trash2,
  Unlock,
  Check,
  Send,
  Sliders,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BOOTCAMP_TRACKS, BootcampTrack } from "@/lib/bootcamp-data";

interface AdminClientProps {
  userEmail: string;
}

export function BootcampAdminPanelClient({ userEmail }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<
    "ADMISSIONS" | "WAITLIST" | "ENROLLMENTS" | "SUBMISSIONS" | "BANNER"
  >("ADMISSIONS");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [trackSettings, setTrackSettings] = useState<Record<string, any>>({});
  const [savingTrackId, setSavingTrackId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [trackSearchQuery, setTrackSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [enrollmentSearchQuery, setEnrollmentSearchQuery] = useState("");
  const [waitlistSearchQuery, setWaitlistSearchQuery] = useState("");

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/bootcamp/admin/stats");
      const data = await res.json();
      if (res.ok && data.success) {
        setStatsData(data);
        setTrackSettings(data.trackSettings || {});
        if (data.trackSettings?.["__global__"]) {
          setBannerMessage(data.trackSettings["__global__"].announcement || "");
          setBannerEnabled(data.trackSettings["__global__"].admissionStatus !== "CLOSED");
        }
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to load admin stats" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to fetch stats" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update track setting in local state
  const handleLocalSettingChange = (trackId: string, field: string, value: any) => {
    setTrackSettings((prev) => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || { trackId, admissionStatus: "OPEN" }),
        [field]: value,
      },
    }));
  };

  // Save single track setting to backend
  const handleSaveTrackSetting = async (trackId: string) => {
    setSavingTrackId(trackId);
    setStatusMessage(null);

    const setting = trackSettings[trackId] || { trackId, admissionStatus: "OPEN" };

    try {
      const res = await fetch("/api/bootcamp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          admissionStatus: setting.admissionStatus || "OPEN",
          openingDate: setting.openingDate || null,
          cohortName: setting.cohortName || null,
          announcement: setting.announcement || null,
          maxSeats: setting.maxSeats || null,
          seatsRemaining: setting.seatsRemaining || null,
          isFeatured: Boolean(setting.isFeatured),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save track setting");
      }

      setStatusMessage({
        type: "success",
        text: `Track "${trackId}" admission status updated to ${setting.admissionStatus}!`,
      });
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setSavingTrackId(null);
    }
  };

  // Bulk update all tracks (e.g. Set all to OPENING_SOON)
  const handleBulkUpdate = async (status: "OPEN" | "OPENING_SOON" | "WAITLIST" | "CLOSED") => {
    const trackIds = BOOTCAMP_TRACKS.map((t) => t.id);
    if (!confirm(`Are you sure you want to set ALL ${trackIds.length} tracks to "${status}"?`)) {
      return;
    }

    setActionLoading("bulk");
    setStatusMessage(null);

    try {
      const res = await fetch("/api/bootcamp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulk: true,
          trackIds,
          admissionStatus: status,
          cohortName: status === "OPENING_SOON" ? "Upcoming 2026 Batch" : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk update failed");

      setStatusMessage({
        type: "success",
        text: `Successfully updated all ${trackIds.length} tracks to ${status}!`,
      });
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Save global banner
  const handleSaveGlobalBanner = async () => {
    setActionLoading("banner");
    try {
      const res = await fetch("/api/bootcamp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: "__global__",
          admissionStatus: bannerEnabled ? "OPEN" : "CLOSED",
          announcement: bannerMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update banner");
      setStatusMessage({ type: "success", text: "Global announcement banner updated!" });
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Perform quick action on enrollment (unlock day, certify, delete)
  const handleEnrollmentAction = async (action: string, payload: any) => {
    setActionLoading(payload.enrollmentId + action);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/bootcamp/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setStatusMessage({ type: "success", text: data.message });
      fetchData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Download Waitlist as CSV
  const handleDownloadWaitlistCsv = () => {
    if (!statsData?.waitlist || statsData.waitlist.length === 0) {
      alert("No waitlist leads available to download.");
      return;
    }

    const headers = ["ID", "Track ID", "Track Title", "Student Name", "Email", "Phone", "College", "Branch", "Date Joined"];
    const rows = statsData.waitlist.map((w: any) => [
      w.id,
      w.trackId,
      `"${(w.trackTitle || "").replace(/"/g, '""')}"`,
      `"${(w.name || "").replace(/"/g, '""')}"`,
      w.email,
      w.phone || "",
      `"${(w.college || "").replace(/"/g, '""')}"`,
      `"${(w.degreeBranch || "").replace(/"/g, '""')}"`,
      new Date(w.createdAt).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e: any[]) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RoleNest_Waitlist_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered tracks for the Admissions Manager
  const filteredTracks = BOOTCAMP_TRACKS.filter((t) => {
    const setting = trackSettings[t.id] || trackSettings[t.slug];
    const status = setting?.admissionStatus || t.admissionStatus || "OPEN";

    if (statusFilter !== "ALL" && status !== statusFilter) return false;

    if (trackSearchQuery.trim()) {
      const q = trackSearchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      
      {/* TOP COMMAND HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">
                Internship &amp; Bootcamp Admin Center
              </h1>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                PROD LEDGER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Admin Session: <span className="text-slate-300 font-mono">{userEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchData}
            disabled={refreshing}
            className="border-slate-800 text-xs text-slate-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync Stats</span>
          </Button>

          <Link href="/" target="_blank">
            <Button size="sm" variant="outline" className="border-slate-800 text-xs text-emerald-400 hover:text-emerald-300">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              <span>Public Site</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* STATUS NOTIFICATION BANNER */}
      {statusMessage && (
        <div
          className={`mx-4 sm:mx-8 mt-4 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-red-500/20 border border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-75 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}

      {/* METRICS DASHBOARD TILES */}
      <section className="mx-4 sm:mx-8 mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Enrolled</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            {statsData?.metrics?.totalStudents || 0}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {statsData?.metrics?.paidCount || 0} Paid • {statsData?.metrics?.freeTestCount || 0} Free Test
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
            ₹{(statsData?.metrics?.totalRevenue || 0).toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-slate-500 block">Direct Cashfree &amp; Instant ₹0</span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
            <span>Waitlist Leads</span>
            <Bell className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 block">
            {statsData?.metrics?.totalWaitlistLeads || 0}
          </span>
          <span className="text-[10px] text-amber-300/70 block">Opening Soon interest</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Code Submissions</span>
            <Code2 className="h-4 w-4 text-teal-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-teal-300 block">
            {statsData?.metrics?.submissionsCount || 0}
          </span>
          <span className="text-[10px] text-slate-500 block">Daily GitHub commit audits</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Track Admissions</span>
            <Sliders className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400">
              {statsData?.metrics?.tracksSummary?.open || 0} Open
            </span>
            <span className="text-sm font-black text-amber-400">
              {statsData?.metrics?.tracksSummary?.openingSoon || 0} Soon
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Across {BOOTCAMP_TRACKS.length} engineering tracks
          </span>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="mx-4 sm:mx-8 mt-6 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "ADMISSIONS", label: "🎛️ Track Admissions Manager", count: BOOTCAMP_TRACKS.length },
          { id: "WAITLIST", label: "📋 Priority Waitlist Leads", count: statsData?.waitlist?.length || 0 },
          { id: "ENROLLMENTS", label: "🎓 Enrolled Students", count: statsData?.enrollments?.length || 0 },
          { id: "SUBMISSIONS", label: "💻 Daily Submissions", count: statsData?.submissions?.length || 0 },
          { id: "BANNER", label: "📢 Global Announcement Banner" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                activeTab === tab.id ? "bg-slate-950 text-amber-400" : "bg-slate-800 text-slate-300"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </section>

      {/* TAB 1: TRACK ADMISSIONS MANAGER */}
      {activeTab === "ADMISSIONS" && (
        <section className="mx-4 sm:mx-8 mt-6 space-y-6">
          
          {/* TOOLBAR CONTROLS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Bulk Actions:
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkUpdate("OPENING_SOON")}
                disabled={actionLoading === "bulk"}
                className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
              >
                <Clock className="h-3.5 w-3.5 mr-1 text-amber-400" />
                <span>Set All to &quot;Opening Soon&quot;</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkUpdate("OPEN")}
                disabled={actionLoading === "bulk"}
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                <span>Open All Admissions</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <Input
                  placeholder="Search tracks..."
                  value={trackSearchQuery}
                  onChange={(e) => setTrackSearchQuery(e.target.value)}
                  className="pl-8 bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 h-9"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">🟢 Admissions Open</option>
                <option value="OPENING_SOON">⏳ Opening Soon</option>
                <option value="WAITLIST">🟡 Waitlist Only</option>
                <option value="CLOSED">🔴 Closed</option>
              </select>
            </div>
          </div>

          {/* TRACKS LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTracks.map((track) => {
              const setting = trackSettings[track.id] || trackSettings[track.slug] || {};
              const currentStatus = setting.admissionStatus || track.admissionStatus || "OPEN";
              const currentOpeningDate = setting.openingDate || "";
              const currentCohort = setting.cohortName || "Upcoming 2026 Batch";
              const currentAnnouncement = setting.announcement || "";
              const isSaving = savingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className={`rounded-2xl border p-5 transition-all space-y-4 ${
                    currentStatus === "OPENING_SOON"
                      ? "border-amber-500/40 bg-slate-900/90 shadow-lg shadow-amber-500/5"
                      : currentStatus === "CLOSED"
                      ? "border-red-500/30 bg-slate-900/50 opacity-80"
                      : "border-slate-800 bg-slate-900/70"
                  }`}
                >
                  {/* TRACK HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{track.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                            {track.domain}
                          </span>
                          {(track.pricing.discountedPrice === 0 || track.id === "developer-sandbox") && (
                            <span className="rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-1.5 py-0.2">
                              SANDBOX
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                          {track.title}
                        </h3>
                      </div>
                    </div>

                    <Link
                      href={`/${track.slug}`}
                      target="_blank"
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                      title="View public page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* ADMISSION STATUS CONTROL SELECTOR */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Admission Status:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { id: "OPEN", label: "🟢 Open", color: "hover:border-emerald-500/50" },
                        { id: "OPENING_SOON", label: "⏳ Opening Soon", color: "hover:border-amber-500/50" },
                        { id: "WAITLIST", label: "🟡 Waitlist", color: "hover:border-yellow-500/50" },
                        { id: "CLOSED", label: "🔴 Closed", color: "hover:border-red-500/50" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleLocalSettingChange(track.id, "admissionStatus", st.id)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            currentStatus === st.id
                              ? st.id === "OPEN"
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md"
                                : st.id === "OPENING_SOON"
                                ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md"
                                : st.id === "WAITLIST"
                                ? "bg-yellow-500 text-slate-950 border-yellow-400 font-black"
                                : "bg-red-500 text-white border-red-400 font-black"
                              : `bg-slate-950 border-slate-800 text-slate-400 ${st.color}`
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DETAILS WHEN "OPENING_SOON" OR CUSTOMIZED */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-amber-400" />
                        <span>Opening / Launch Date:</span>
                      </label>
                      <Input
                        type="datetime-local"
                        value={
                          currentOpeningDate
                            ? new Date(currentOpeningDate).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleLocalSettingChange(
                            track.id,
                            "openingDate",
                            e.target.value ? new Date(e.target.value).toISOString() : null
                          )
                        }
                        className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Cohort Batch Label:
                      </label>
                      <Input
                        placeholder="e.g. Winter 2026 Batch"
                        value={currentCohort}
                        onChange={(e) =>
                          handleLocalSettingChange(track.id, "cohortName", e.target.value)
                        }
                        className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Custom Banner / Announcement Note (Optional):
                    </label>
                    <Input
                      placeholder="e.g. Only 30 seats allocated • Priority waitlist open"
                      value={currentAnnouncement}
                      onChange={(e) =>
                        handleLocalSettingChange(track.id, "announcement", e.target.value)
                      }
                      className="bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-8"
                    />
                  </div>

                  {/* SAVE BUTTON */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Track ID: {track.id}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => handleSaveTrackSetting(track.id)}
                      disabled={isSaving}
                      className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs h-8 px-4 shadow-md shadow-amber-500/20"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3 mr-1.5" />
                          <span>Apply Setting</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: PRIORITY WAITLIST LEADS */}
      {activeTab === "WAITLIST" && (
        <section className="mx-4 sm:mx-8 mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Waitlist Registrations ({statsData?.waitlist?.length || 0})
              </h2>
              <p className="text-xs text-slate-400">
                Prospective students who signed up for &quot;Admissions Opening Soon&quot; notifications.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleDownloadWaitlistCsv}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 shadow-md shadow-emerald-500/20"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              <span>Export CSV for WhatsApp / Mailer</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-3">Track Requested</th>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">College &amp; Branch</th>
                    <th className="p-3">Date Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {statsData?.waitlist?.length ? (
                    statsData.waitlist.map((w: any) => (
                      <tr key={w.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-amber-300">
                          {w.trackTitle || w.trackId}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-white block">{w.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{w.email}</span>
                        </td>
                        <td className="p-3 font-mono">
                          {w.phone ? (
                            <a
                              href={`https://wa.me/${w.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline"
                            >
                              {w.phone}
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="block text-slate-200">{w.college || "—"}</span>
                          <span className="text-[10px] text-slate-400">{w.degreeBranch || ""}</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-mono">
                          {new Date(w.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No students on waitlist yet. As soon as you set tracks to &quot;Opening Soon&quot;, candidates can register here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ENROLLED STUDENTS */}
      {activeTab === "ENROLLMENTS" && (
        <section className="mx-4 sm:mx-8 mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Active Student Enrollments ({statsData?.enrollments?.length || 0})
              </h2>
              <p className="text-xs text-slate-400">
                Manage student records, day progress, Offer Letters, and College NOC letters.
              </p>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <Input
                placeholder="Search by student or roll #..."
                value={enrollmentSearchQuery}
                onChange={(e) => setEnrollmentSearchQuery(e.target.value)}
                className="pl-8 bg-slate-950 border-slate-800 text-xs text-white rounded-xl h-9"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Track ID</th>
                    <th className="p-3">College &amp; Roll #</th>
                    <th className="p-3">Day Progress</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Letters &amp; Cert</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {statsData?.enrollments?.length ? (
                    statsData.enrollments
                      .filter((e: any) => {
                        if (!enrollmentSearchQuery.trim()) return true;
                        const q = enrollmentSearchQuery.toLowerCase();
                        return (
                          e.studentName.toLowerCase().includes(q) ||
                          e.studentEmail.toLowerCase().includes(q) ||
                          e.rollNumber.toLowerCase().includes(q) ||
                          e.collegeName.toLowerCase().includes(q)
                        );
                      })
                      .map((e: any) => (
                        <tr key={e.id} className="hover:bg-slate-800/40">
                          <td className="p-3">
                            <span className="font-bold text-white block">{e.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{e.studentEmail}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400">
                            {e.trackId}
                          </td>
                          <td className="p-3">
                            <span className="block text-slate-200">{e.collegeName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Roll: {e.rollNumber}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="rounded-md bg-slate-950 border border-slate-800 px-2 py-1 font-mono font-bold text-teal-300">
                              Day {e.unlockedDay} / 28
                            </span>
                          </td>
                          <td className="p-3">
                            {e.amountPaid === 0 ? (
                              <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-bold">
                                Free Test
                              </span>
                            ) : (
                              <span className="rounded bg-teal-500/20 text-teal-300 px-1.5 py-0.5 text-[10px] font-bold font-mono">
                                ₹{e.amountPaid}
                              </span>
                            )}
                          </td>
                          <td className="p-3 space-x-1.5">
                            <Link
                              href={`/portal/offer-letter/${e.id}`}
                              target="_blank"
                              className="text-[10px] text-emerald-400 hover:underline"
                            >
                              Offer Letter
                            </Link>
                            <span>•</span>
                            <Link
                              href={`/portal/noc/${e.id}`}
                              target="_blank"
                              className="text-[10px] text-purple-400 hover:underline"
                            >
                              College NOC
                            </Link>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEnrollmentAction("unlock_day", {
                                    enrollmentId: e.id,
                                    dayNumber: (e.unlockedDay || 1) + 1,
                                  })
                                }
                                disabled={actionLoading === e.id + "unlock_day"}
                                className="border-slate-800 text-[10px] h-7 px-2"
                              >
                                +1 Day
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEnrollmentAction("unlock_all", {
                                    enrollmentId: e.id,
                                  })
                                }
                                disabled={actionLoading === e.id + "unlock_all"}
                                className="border-emerald-500/30 text-emerald-300 text-[10px] h-7 px-2"
                              >
                                Unlock 28 Days
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (confirm("Delete this test enrollment?")) {
                                    handleEnrollmentAction("delete_enrollment", {
                                      enrollmentId: e.id,
                                    });
                                  }
                                }}
                                disabled={actionLoading === e.id + "delete_enrollment"}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] h-7 px-1.5"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No enrollments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: DAILY SUBMISSIONS */}
      {activeTab === "SUBMISSIONS" && (
        <section className="mx-4 sm:mx-8 mt-6 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Daily Code Arena &amp; GitHub Submissions ({statsData?.submissions?.length || 0})
            </h2>
            <p className="text-xs text-slate-400">
              Live audit trail of student git commits and interactive code problem assertions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-3">Track &amp; Day</th>
                    <th className="p-3">Day Title</th>
                    <th className="p-3">GitHub Commit Proof</th>
                    <th className="p-3">Code Arena Status</th>
                    <th className="p-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {statsData?.submissions?.length ? (
                    statsData.submissions.map((s: any) => (
                      <tr key={s.id} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <span className="font-bold text-white block">{s.trackId}</span>
                          <span className="text-[10px] font-mono text-teal-400">Day {s.dayNumber}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-200">
                          {s.dayTitle}
                        </td>
                        <td className="p-3 font-mono">
                          <a
                            href={s.githubCommitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Commit Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="p-3">
                          {s.passedCodeChallenge ? (
                            <span className="rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                              ✓ All Tests Passed
                            </span>
                          ) : (
                            <span className="rounded bg-slate-800 text-slate-400 px-2 py-0.5 text-[10px]">
                              Manual PR
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-mono">
                          {new Date(s.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No submissions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: GLOBAL BANNER SETTINGS */}
      {activeTab === "BANNER" && (
        <section className="mx-4 sm:mx-8 mt-6 max-w-3xl space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Global Header Announcement Banner
              </h2>
              <p className="text-xs text-slate-400">
                This banner is pinned to the very top of <strong className="text-slate-300">internship.rolenest.in</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bannerToggle"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-amber-500"
              />
              <label htmlFor="bannerToggle" className="text-xs font-bold text-slate-200">
                Enable Top Announcement Banner
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Announcement Message Text:
              </label>
              <textarea
                rows={3}
                value={bannerMessage}
                onChange={(e) => setBannerMessage(e.target.value)}
                placeholder="e.g. 📢 Winter 2026 Batch Admissions Opening Soon! Register on priority waitlist."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <Button
              onClick={handleSaveGlobalBanner}
              disabled={actionLoading === "banner"}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs h-9 px-5 shadow-lg shadow-amber-500/20"
            >
              {actionLoading === "banner" ? "Saving..." : "Save Global Banner"}
            </Button>
          </div>
        </section>
      )}

    </div>
  );
}
