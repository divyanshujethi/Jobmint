"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Award,
  Zap,
  Loader2,
  Briefcase,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalaryRecord, COMPREHENSIVE_INDIAN_SALARIES } from "@/lib/salary-data";

export default function SalariesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [selectedTrack, setSelectedTrack] = useState<string>("ALL");
  const [salaries, setSalaries] = useState<SalaryRecord[]>(COMPREHENSIVE_INDIAN_SALARIES);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form states for Anonymous Submission
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formTier, setFormTier] = useState<"BIG_TECH" | "UNICORN" | "PRODUCT" | "IT_SERVICES">("PRODUCT");
  const [formTrack, setFormTrack] = useState<"BACKEND" | "FRONTEND" | "FULLSTACK" | "AIML" | "DEVOPS_DATA" | "GENERAL">("FULLSTACK");
  const [formLevel, setFormLevel] = useState<"FRESHER" | "SDE_1" | "SDE_2" | "STAFF">("SDE_1");
  const [formTotalCtc, setFormTotalCtc] = useState("");
  const [formBase, setFormBase] = useState("");
  const [formBonus, setFormBonus] = useState("");
  const [formStocks, setFormStocks] = useState("");
  const [formLocation, setFormLocation] = useState("Bangalore");
  const [formWorkMode, setFormWorkMode] = useState<"Remote" | "Hybrid" | "On-site">("Hybrid");
  const [formRounds, setFormRounds] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/salaries")
      .then((res) => res.json())
      .then((data) => {
        if (data?.salaries && Array.isArray(data.salaries) && data.salaries.length > 0) {
          setSalaries(data.salaries);
        }
      })
      .catch((err) => console.warn("Notice loading salaries from API:", err));
  }, []);

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formCompany,
          role: formRole,
          level: formLevel,
          tier: formTier,
          roleTrack: formTrack,
          totalCtcLpa: Number(formTotalCtc),
          baseSalaryLpa: Number(formBase) || Math.round(Number(formTotalCtc) * 0.75),
          bonusLpa: Number(formBonus) || Math.round(Number(formTotalCtc) * 0.1),
          stocksLpa: Number(formStocks) || 0,
          location: formLocation,
          workMode: formWorkMode,
          interviewRounds: formRounds || "Coding Assessment + Technical Rounds + HR",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit salary report");
      }

      setSubmitSuccess(data.message || "Thank you! Your salary report has been recorded anonymously.");
      fetch("/api/salaries")
        .then((r) => r.json())
        .then((d) => {
          if (d?.salaries) setSalaries(d.salaries);
        });

      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitSuccess(null);
        setFormCompany("");
        setFormRole("");
        setFormTotalCtc("");
        setFormBase("");
        setFormBonus("");
        setFormStocks("");
      }, 2500);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit salary report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter((s) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesComp = s.companyName.toLowerCase().includes(q);
        const matchesRole = s.role.toLowerCase().includes(q);
        const matchesLoc = s.location.toLowerCase().includes(q);
        if (!matchesComp && !matchesRole && !matchesLoc) return false;
      }
      if (selectedLevel !== "ALL" && s.level !== selectedLevel) {
        return false;
      }
      if (selectedTier !== "ALL" && s.tier !== selectedTier) {
        return false;
      }
      if (selectedTrack !== "ALL" && s.roleTrack !== selectedTrack) {
        return false;
      }
      return true;
    });
  }, [salaries, searchTerm, selectedLevel, selectedTier, selectedTrack]);

  const medianFresherCtc = useMemo(() => {
    const freshers = salaries.filter((s) => s.level === "FRESHER");
    if (!freshers.length) return 14;
    const sorted = [...freshers].sort((a, b) => a.totalCtcLpa - b.totalCtcLpa);
    return sorted[Math.floor(sorted.length / 2)].totalCtcLpa;
  }, [salaries]);

  const medianSde1Ctc = useMemo(() => {
    const sde1s = salaries.filter((s) => s.level === "SDE_1");
    if (!sde1s.length) return 26;
    const sorted = [...sde1s].sort((a, b) => a.totalCtcLpa - b.totalCtcLpa);
    return sorted[Math.floor(sorted.length / 2)].totalCtcLpa;
  }, [salaries]);

  const medianSde2Ctc = useMemo(() => {
    const sde2s = salaries.filter((s) => s.level === "SDE_2");
    if (!sde2s.length) return 46;
    const sorted = [...sde2s].sort((a, b) => a.totalCtcLpa - b.totalCtcLpa);
    return sorted[Math.floor(sorted.length / 2)].totalCtcLpa;
  }, [salaries]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-50 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800 font-mono">
              Verified Indian Tech Compensation Data (2024–2025)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Indian Tech Salary Benchmarks &amp; In-Hand Insights
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Authentic compensation benchmarks (Fixed Base + Annual Bonus + Stocks / ESOPs) and estimated monthly take-home in-hand pay across Top Tech, Unicorns, FinTech, and IT Services in India.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-sm min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            Submit Anonymous Salary (+50 XP)
          </Button>
        </div>
      </div>

      {/* METRIC TILES: REAL INDIAN TECH BENCHMARKS */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            College Fresher Median CTC (0–1 Yrs)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{medianFresherCtc} LPA</span>
            <span className="text-xs font-bold text-emerald-600">Product &amp; IT Mix</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ranges from ₹3.36L (IT Services) to ₹42.6L (Google L3).</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            SDE-1 Median CTC (1–3 Yrs Exp)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{medianSde1Ctc} LPA</span>
            <span className="text-xs font-bold text-blue-600">Top Unicorns &amp; Product</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Base salary typically ₹18L – ₹28L with RSUs / ESOPs.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            SDE-2 Median CTC (3–5 Yrs Exp)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">₹{medianSde2Ctc} LPA</span>
            <span className="text-xs font-bold text-emerald-600">Senior Distributed Systems</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">High-concurrency backend &amp; full-stack architecture roles.</p>
        </div>
      </div>

      {/* FILTER CONTROLS: TIER, EXP, ROLE */}
      <div className="mt-8 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or title (e.g. Google, Razorpay, Go, Frontend)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Experience Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono font-bold text-slate-500 mr-1 hidden sm:inline">Exp:</span>
            {[
              { id: "ALL", label: "All Exp" },
              { id: "FRESHER", label: "0-1 Yrs (Fresher)" },
              { id: "SDE_1", label: "1-3 Yrs (SDE-1)" },
              { id: "SDE_2", label: "3-5 Yrs (SDE-2)" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLevel === lvl.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Company Tier & Role Track Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-mono font-bold text-slate-500 mr-1">Tier:</span>
            {[
              { id: "ALL", label: "All Tiers" },
              { id: "BIG_TECH", label: "Big Tech / FAANG" },
              { id: "UNICORN", label: "Top Unicorns" },
              { id: "PRODUCT", label: "Product & FinTech" },
              { id: "IT_SERVICES", label: "IT Services / GCCs" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedTier === t.id
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-mono font-bold text-slate-500 mr-1">Track:</span>
            {[
              { id: "ALL", label: "All Roles" },
              { id: "BACKEND", label: "Backend" },
              { id: "FRONTEND", label: "Frontend" },
              { id: "FULLSTACK", label: "Full-Stack" },
            ].map((tk) => (
              <button
                key={tk.id}
                onClick={() => setSelectedTrack(tk.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedTrack === tk.id
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tk.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* METHODOLOGY & DATA DISCLOSURE */}
      <div className="mt-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Verified Benchmark Methodology:</strong> Figures reflect realistic Indian engineering compensation from offer letters, campus placements (IITs/NITs/Tier-2/3), and public filings (2024–2025). Monthly in-hand estimates reflect standard tax deduction at source (TDS) under the new tax regime and EPF.
          </span>
        </div>
        <Link href="/transparency" className="font-bold text-emerald-800 hover:underline whitespace-nowrap shrink-0">
          Transparency Standard &rarr;
        </Link>
      </div>

      {/* SALARIES LIST */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredSalaries.map((s) => {
            const isExpanded = expandedId === s.id;
            const tierBadge =
              s.tier === "BIG_TECH"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : s.tier === "UNICORN"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : s.tier === "PRODUCT"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-slate-100 text-slate-700 border-slate-200";

            return (
              <div key={s.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{s.companyName}</span>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${tierBadge}`}>
                        {s.tier.replace("_", " ")}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {s.experienceYears}
                      </span>
                      <span className="text-xs text-slate-400">• {s.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span>{s.role}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-mono text-[11px] font-bold bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200/60">
                        Est. In-Hand: {s.estimatedMonthlyInHand}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <div className="text-xl font-black text-slate-900">
                        ₹{s.totalCtcLpa} LPA
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Base: ₹{s.baseSalaryLpa}L {s.stocksLpa > 0 ? `+ ₹${s.stocksLpa}L Stocks` : "+ ₹0 Stocks"}
                      </div>
                    </div>

                    <div className="text-right hidden md:block">
                      <div className="text-xs font-bold text-slate-800">
                        {s.marketPercentile}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ~{s.typicalTimelineDays}d hiring cycle
                      </div>
                    </div>

                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED DETAILED BREAKDOWN */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
                    {/* Column 1: Compensation Splits */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-2 border border-slate-100">
                      <h5 className="font-bold text-slate-900 font-mono uppercase text-[10px] tracking-wider">
                        Full Compensation Split
                      </h5>
                      <div className="space-y-1.5 text-slate-600 text-[11px]">
                        <div className="flex justify-between">
                          <span>Fixed Base Salary:</span>
                          <span className="font-bold text-slate-900">₹{s.baseSalaryLpa} LPA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target Bonus / Perf:</span>
                          <span className="font-bold text-slate-900">₹{s.bonusLpa} LPA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stock / ESOPs (Yr 1):</span>
                          <span className="font-bold text-slate-900">₹{s.stocksLpa} LPA</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                          <span>Total CTC:</span>
                          <span className="text-emerald-700">₹{s.totalCtcLpa} LPA</span>
                        </div>
                        <div className="flex justify-between pt-1 text-emerald-800 font-semibold text-[10px]">
                          <span>Net In-Hand (Est.):</span>
                          <span>{s.estimatedMonthlyInHand}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Interview Loop & Rounds */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-2 border border-slate-100">
                      <h5 className="font-bold text-slate-900 font-mono uppercase text-[10px] tracking-wider">
                        Interview Format &amp; Loop
                      </h5>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-mono">
                        {s.interviewRounds}
                      </p>
                      <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Work Mode: <strong>{s.workMode}</strong></span>
                        <span>Benchmark Status: <strong className="text-emerald-700">{s.status === "PENDING_VERIFICATION" ? "Under Review" : "Verified Offer"}</strong></span>
                      </div>
                    </div>

                    {/* Column 3: Prepare / Action */}
                    <div className="rounded-2xl bg-slate-50 p-4 flex flex-col justify-between border border-slate-100">
                      <div>
                        <h5 className="font-bold text-slate-900 font-mono uppercase text-[10px] tracking-wider">
                          Ready for {s.companyName}?
                        </h5>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Practice targeted STAR technical questions and system design with verified peer cohorts.
                        </p>
                      </div>
                      <div className="pt-3">
                        <Link
                          href="/roadmaps"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          <span>Practice Interview Questions</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSalaries.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No salary benchmarks match your filter criteria. Try adjusting the experience or search keyword.
            </div>
          )}
        </div>
      </div>

      {/* ANONYMOUS SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Submit Anonymous Salary (+50 XP)
                </h3>
                <p className="text-xs text-slate-500">
                  Zero PII collected. Submissions are reviewed by admins for anti-spam verification before publishing.
                </p>
              </div>
            </div>

            {submitSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                ✓ {submitSuccess}
              </div>
            )}

            {submitError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSalarySubmit} className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Swiggy, Google India"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. SDE-1 Backend"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level</label>
                  <select
                    value={formLevel}
                    onChange={(e: any) => setFormLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="FRESHER">Fresher (0-1 Yrs)</option>
                    <option value="SDE_1">SDE-1 (1-3 Yrs)</option>
                    <option value="SDE_2">SDE-2 (3-5 Yrs)</option>
                    <option value="STAFF">Senior / Staff (5+ Yrs)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Tier</label>
                  <select
                    value={formTier}
                    onChange={(e: any) => setFormTier(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="BIG_TECH">Big Tech / FAANG</option>
                    <option value="UNICORN">Top Unicorn</option>
                    <option value="PRODUCT">Product / Startup</option>
                    <option value="IT_SERVICES">IT Services / GCC</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Track</label>
                  <select
                    value={formTrack}
                    onChange={(e: any) => setFormTrack(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="BACKEND">Backend</option>
                    <option value="FRONTEND">Frontend</option>
                    <option value="FULLSTACK">Full-Stack</option>
                    <option value="AIML">AI / ML</option>
                    <option value="DEVOPS_DATA">DevOps / Data</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total CTC (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formTotalCtc}
                    onChange={(e) => setFormTotalCtc(e.target.value)}
                    placeholder="e.g. 28"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fixed Base (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formBase}
                    onChange={(e) => setFormBase(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stocks / Yr (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formStocks}
                    onChange={(e) => setFormStocks(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Mode</label>
                  <select
                    value={formWorkMode}
                    onChange={(e: any) => setFormWorkMode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Rounds Summary (Optional)</label>
                <input
                  type="text"
                  value={formRounds}
                  onChange={(e) => setFormRounds(e.target.value)}
                  placeholder="e.g. 1 Machine Coding + 2 DSA Rounds + HM"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl min-h-[44px] mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Recording Anonymously...
                  </span>
                ) : (
                  "Submit Anonymous Salary Report"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
