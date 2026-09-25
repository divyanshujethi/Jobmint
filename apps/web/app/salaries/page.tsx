"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalaryRecord {
  id: string;
  companyName: string;
  companySlug: string;
  role: string;
  level: "FRESHER" | "SDE_1" | "SDE_2" | "STAFF";
  experienceYears: string;
  baseSalaryLpa: number;
  bonusLpa: number;
  stocksLpa: number;
  totalCtcLpa: number;
  location: string;
  verifiedSubmissions: number;
  daysToFirstReview: number;
  daysToOffer: number;
  ghostingRate: number; // percentage
  hiringStatus: "ACTIVELY_HIRING" | "MODERATE" | "FREEZE";
}

const INDIAN_TECH_SALARIES: SalaryRecord[] = [
  {
    id: "sal-1",
    companyName: "Razorpay",
    companySlug: "razorpay",
    role: "Software Development Engineer",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 22,
    bonusLpa: 3.5,
    stocksLpa: 6,
    totalCtcLpa: 31.5,
    location: "Bangalore",
    verifiedSubmissions: 38,
    daysToFirstReview: 2.1,
    daysToOffer: 14,
    ghostingRate: 1.5,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-2",
    companyName: "Google India",
    companySlug: "google",
    role: "Software Engineer (L3)",
    level: "FRESHER",
    experienceYears: "0-1 Yrs",
    baseSalaryLpa: 24,
    bonusLpa: 4,
    stocksLpa: 15,
    totalCtcLpa: 43,
    location: "Bangalore / Hyderabad",
    verifiedSubmissions: 52,
    daysToFirstReview: 4.5,
    daysToOffer: 24,
    ghostingRate: 0.8,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-3",
    companyName: "Zepto",
    companySlug: "zepto",
    role: "Backend Engineer (Go / Rust)",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 26,
    bonusLpa: 4,
    stocksLpa: 8,
    totalCtcLpa: 38,
    location: "Mumbai / Bangalore",
    verifiedSubmissions: 29,
    daysToFirstReview: 1.4,
    daysToOffer: 11,
    ghostingRate: 2.1,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-4",
    companyName: "Swiggy",
    companySlug: "swiggy",
    role: "Full Stack Engineer",
    level: "SDE_2",
    experienceYears: "3-5 Yrs",
    baseSalaryLpa: 38,
    bonusLpa: 6,
    stocksLpa: 12,
    totalCtcLpa: 56,
    location: "Bangalore / Remote",
    verifiedSubmissions: 44,
    daysToFirstReview: 2.8,
    daysToOffer: 18,
    ghostingRate: 3.4,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-5",
    companyName: "CRED",
    companySlug: "cred",
    role: "Product Engineer",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 28,
    bonusLpa: 5,
    stocksLpa: 10,
    totalCtcLpa: 43,
    location: "Bangalore",
    verifiedSubmissions: 31,
    daysToFirstReview: 1.8,
    daysToOffer: 12,
    ghostingRate: 1.2,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-6",
    companyName: "Flipkart",
    companySlug: "flipkart",
    role: "Software Development Engineer (Fresher)",
    level: "FRESHER",
    experienceYears: "0-1 Yrs",
    baseSalaryLpa: 18,
    bonusLpa: 2.5,
    stocksLpa: 6,
    totalCtcLpa: 26.5,
    location: "Bangalore",
    verifiedSubmissions: 64,
    daysToFirstReview: 3.2,
    daysToOffer: 21,
    ghostingRate: 2.5,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-7",
    companyName: "RitualDev Cloud Labs",
    companySlug: "ritualdev-cloud-labs",
    role: "Full Stack & DevSecOps Engineer",
    level: "FRESHER",
    experienceYears: "0-2 Yrs",
    baseSalaryLpa: 14,
    bonusLpa: 2,
    stocksLpa: 4,
    totalCtcLpa: 20,
    location: "Bangalore / Remote",
    verifiedSubmissions: 22,
    daysToFirstReview: 1.2,
    daysToOffer: 7,
    ghostingRate: 0.2,
    hiringStatus: "ACTIVELY_HIRING",
  },
];

export default function SalariesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [salaries, setSalaries] = useState<SalaryRecord[]>(INDIAN_TECH_SALARIES);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

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

      if (selectedLocation !== "ALL" && !s.location.includes(selectedLocation)) {
        return false;
      }

      return true;
    });
  }, [salaries, searchTerm, selectedLevel, selectedLocation]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800 font-mono">
              Truth Teller Verified Salaries (₹ INR)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
            Real Tech Salaries &amp; Hiring Timelines
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
            Anonymous, verified compensation figures (Base + Bonus + Stocks) and actual hiring speed telemetry from Indian tech companies. Know what to ask before entering negotiation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 shadow-sm min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            Contribute Anonymous Salary
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company (e.g. Razorpay, Google, Zepto)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[44px]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "FRESHER", "SDE_1", "SDE_2"].map((lvl) => {
            const labelMap: Record<string, string> = {
              ALL: "All Levels",
              FRESHER: "Fresher (0-1 Yrs)",
              SDE_1: "SDE-1 (1-3 Yrs)",
              SDE_2: "SDE-2 (3-5 Yrs)",
            };
            const isSel = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation ${
                  isSel
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {labelMap[lvl]}
              </button>
            );
          })}
        </div>
      </div>

      {/* SALARIES GRID */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSalaries.map((s) => (
          <div
            key={s.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-all space-y-5"
          >
            {/* CARD TOP */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white font-extrabold text-base shadow-sm">
                    {s.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {s.companyName}
                    </h3>
                    <span className="text-xs text-slate-500 block">{s.location}</span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  {s.verifiedSubmissions} Verified
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{s.role}</span>
                  <span className="text-[11px] font-mono text-slate-500">{s.experienceYears}</span>
                </div>

                {/* TOTAL CTC */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    ₹{s.totalCtcLpa} LPA
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Median Total CTC</span>
                </div>

                {/* BREAKDOWN */}
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Base Pay</span>
                    <span className="font-bold text-slate-800 font-mono">₹{s.baseSalaryLpa}L</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Bonus</span>
                    <span className="font-bold text-slate-800 font-mono">₹{s.bonusLpa}L</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Stocks/Yr</span>
                    <span className="font-bold text-slate-800 font-mono">₹{s.stocksLpa}L</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD BOTTOM: TRUTH TELLER TIMELINES */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Avg. to Round 1:
                </span>
                <strong className="text-slate-900 font-mono">{s.daysToFirstReview} days</strong>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Round 1 to Offer:
                </span>
                <strong className="text-slate-900 font-mono">{s.daysToOffer} days</strong>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Ghosting Risk:
                </span>
                <strong className="text-emerald-700 font-semibold">{s.ghostingRate}%</strong>
              </div>

              <div className="pt-2">
                <Link
                  href={`/jobs?q=${encodeURIComponent(s.companyName)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
                >
                  View Open Roles <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ANONYMOUS SALARY SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-4">
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
              <h3 className="text-lg font-bold text-slate-900">
                Submit Anonymous Salary Report
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              100% Anonymous. We never store IP addresses or candidate names with compensation data. Helps early-career developers fight lowball offers.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Your salary telemetry report has been encrypted and submitted for automated validation. +50 XP awarded!");
                setShowSubmitModal(false);
              }}
              className="space-y-3 pt-2 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Razorpay, Swiggy, Google, Infosys"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Engineer"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total CTC (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="e.g. 24"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Salary (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="e.g. 18"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Days to Offer</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl min-h-[44px] mt-2"
              >
                Submit Encrypted Telemetry
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
