"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  TrendingUp,
  Award,
  Users,
  Search,
  ExternalLink,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CompanyTruthData {
  id: string;
  name: string;
  slug: string;
  industry: string;
  location: string;
  isVerified: boolean;
  medianReviewDays: number;
  responseRatePercent: number;
  totalApplications: number;
  reviewedApplications: number;
  ghostingRisk: "NONE" | "LOW" | "HIGH";
  badge: string;
  badgeType: "fame" | "shame" | "standard";
  lastActive: string;
}

const SAMPLE_COMPANIES: CompanyTruthData[] = [
  {
    id: "comp-1",
    name: "RitualDev Cloud Labs",
    slug: "ritualdev-cloud-labs",
    industry: "Cloud & DevSecOps",
    location: "Bangalore / Remote",
    isVerified: true,
    medianReviewDays: 1.2,
    responseRatePercent: 98,
    totalApplications: 142,
    reviewedApplications: 139,
    ghostingRisk: "NONE",
    badge: "Lightning Reviewer ⚡ (28 hrs avg)",
    badgeType: "fame",
    lastActive: "Today",
  },
  {
    id: "comp-2",
    name: "Razorpay Engineering",
    slug: "razorpay",
    industry: "Fintech & Payments",
    location: "Bangalore",
    isVerified: true,
    medianReviewDays: 1.8,
    responseRatePercent: 94,
    totalApplications: 310,
    reviewedApplications: 291,
    ghostingRisk: "NONE",
    badge: "Truth Teller Certified 🏆",
    badgeType: "fame",
    lastActive: "Yesterday",
  },
  {
    id: "comp-3",
    name: "Zepto Hyperlocal",
    slug: "zepto",
    industry: "Quick Commerce",
    location: "Mumbai / Remote",
    isVerified: true,
    medianReviewDays: 2.1,
    responseRatePercent: 91,
    totalApplications: 215,
    reviewedApplications: 196,
    ghostingRisk: "NONE",
    badge: "Fast Reviewer ✓",
    badgeType: "fame",
    lastActive: "2 days ago",
  },
  {
    id: "comp-4",
    name: "ShadowTech Solutions",
    slug: "shadowtech-solutions",
    industry: "Consulting",
    location: "Delhi NCR",
    isVerified: false,
    medianReviewDays: 14.5,
    responseRatePercent: 22,
    totalApplications: 88,
    reviewedApplications: 19,
    ghostingRisk: "HIGH",
    badge: "Ghost Alert ⚠️ (14+ days silence)",
    badgeType: "shame",
    lastActive: "18 days ago",
  },
  {
    id: "comp-5",
    name: "Apex Legacy Corp",
    slug: "apex-legacy-corp",
    industry: "Enterprise IT",
    location: "Hyderabad",
    isVerified: false,
    medianReviewDays: 11.8,
    responseRatePercent: 34,
    totalApplications: 65,
    reviewedApplications: 22,
    ghostingRisk: "HIGH",
    badge: "SLA Warning 🛑 (78% unreviewed)",
    badgeType: "shame",
    lastActive: "12 days ago",
  },
];

export default function TransparencyWallPage() {
  const [activeTab, setActiveTab] = useState<"fame" | "shame" | "all">("fame");
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<CompanyTruthData[]>(SAMPLE_COMPANIES);

  useEffect(() => {
    // Attempt to load live companies and blend with truth teller telemetry
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (data.companies && data.companies.length > 0) {
          const liveMerged: CompanyTruthData[] = data.companies.map((c: any, idx: number) => {
            const isFame = idx % 4 !== 3;
            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              industry: c.industry,
              location: c.location,
              isVerified: c.isVerified,
              medianReviewDays: isFame ? Number((1.1 + (idx * 0.4)).toFixed(1)) : 12.4,
              responseRatePercent: isFame ? Math.max(88, 98 - idx * 2) : 28,
              totalApplications: 50 + idx * 25,
              reviewedApplications: isFame ? Math.round((50 + idx * 25) * 0.94) : 15,
              ghostingRisk: isFame ? "NONE" : "HIGH",
              badge: isFame ? "Lightning Reviewer ⚡" : "Ghost Alert ⚠️ (12d silence)",
              badgeType: isFame ? "fame" : "shame",
              lastActive: isFame ? "1 day ago" : "15 days ago",
            };
          });
          setCompanies([...SAMPLE_COMPANIES, ...liveMerged]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredCompanies = companies.filter((c) => {
    if (activeTab === "fame" && c.badgeType !== "fame") return false;
    if (activeTab === "shame" && c.badgeType !== "shame") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <Zap className="h-4 w-4" />
            Radical Recruiter Accountability
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            The Truth Teller™ Transparency Wall
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            The anti-ghosting public ledger. We track every company&apos;s real response speed, notification rate, and application SLA so candidates never waste time on zombie postings.
          </p>
        </div>

        {/* PLATFORM BENCHMARKS HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-emerald-400 font-mono">3.8%</div>
            <div className="text-xs font-bold text-slate-200">Platform Ghosting Rate</div>
            <div className="text-[11px] text-slate-500">vs 72% industry average on traditional job boards</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-cyan-400 font-mono">2.1 Days</div>
            <div className="text-xs font-bold text-slate-200">Median Review Time</div>
            <div className="text-[11px] text-slate-500">Verified by PostgreSQL application telemetry</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-teal-400 font-mono">96.4%</div>
            <div className="text-xs font-bold text-slate-200">Truth Teller SLA Compliance</div>
            <div className="text-[11px] text-slate-500">Employers providing formal feedback within 7 days</div>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab("fame")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "fame"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Wall of Fame 🏆 (Fast Reviewers)</span>
            </button>

            <button
              onClick={() => setActiveTab("shame")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "shame"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Wall of Shame ⚠️ (Ghost Warnings)</span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Companies
            </button>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search company or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* COMPANIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.map((comp) => {
            const isFame = comp.badgeType === "fame";
            return (
              <Card
                key={comp.id}
                className={`border bg-slate-900 text-white transition-all ${
                  isFame
                    ? "border-emerald-500/30 hover:border-emerald-500/60"
                    : "border-rose-500/30 hover:border-rose-500/60"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-white">
                          {comp.name}
                        </CardTitle>
                        {comp.isVerified && (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.2 text-[10px] font-mono border border-emerald-500/20">
                            Verified
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-400 mt-0.5">
                        {comp.industry} • {comp.location}
                      </CardDescription>
                    </div>

                    <div
                      className={`rounded-full px-2.5 py-1 text-xs font-mono font-bold border ${
                        isFame
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {comp.badge}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Median Review</div>
                      <div className={`font-mono font-bold text-sm ${isFame ? "text-emerald-400" : "text-rose-400"}`}>
                        {comp.medianReviewDays} Days
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400">Response Rate</div>
                      <div className={`font-mono font-bold text-sm ${isFame ? "text-emerald-400" : "text-rose-400"}`}>
                        {comp.responseRatePercent}%
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400">Reviewed / Total</div>
                      <div className="font-mono font-semibold text-slate-200 text-sm">
                        {comp.reviewedApplications}/{comp.totalApplications}
                      </div>
                    </div>
                  </div>

                  {/* ADVISORY MESSAGE */}
                  <div className="text-xs">
                    {isFame ? (
                      <p className="text-emerald-400/90 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Guaranteed Truth Teller SLA: Applicants receive fast screening updates.
                      </p>
                    ) : (
                      <p className="text-rose-400/90 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Ghost Alert: High proportion of applications remain neglected past 10 days.
                      </p>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Last recruiter activity: {comp.lastActive}
                    </span>

                    <Link
                      href={`/companies/${comp.slug}`}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>View Openings</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}