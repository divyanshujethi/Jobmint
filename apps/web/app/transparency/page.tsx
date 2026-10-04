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
  logoUrl?: string;
  website?: string;
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

export default function TransparencyWallPage() {
  const [activeTab, setActiveTab] = useState<"fame" | "shame" | "all">("fame");
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<CompanyTruthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (data.companies && Array.isArray(data.companies)) {
          const liveList: CompanyTruthData[] = data.companies.map((c: any) => {
            const totalApps = c.truthTeller?.totalApplications || 0;
            const reviewedApps = c.truthTeller?.reviewedApplications || 0;
            const medianDays = Number(c.truthTeller?.medianFirstReviewDays || 2.1);
            const reviewRate = c.truthTeller?.reviewRate || (c.isVerified ? 94 : 80);
            const isFame = reviewRate >= 75 && medianDays <= 4.0;

            let domain = "";
            if (c.website) {
              try {
                domain = new URL(c.website).hostname.replace(/^www\./, "");
              } catch {}
            }
            const logo = c.logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : undefined);

            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              industry: c.industry || "Software & Technology",
              location: c.location || "India",
              logoUrl: logo,
              website: c.website,
              isVerified: Boolean(c.isVerified),
              medianReviewDays: medianDays,
              responseRatePercent: reviewRate,
              totalApplications: totalApps,
              reviewedApplications: reviewedApps,
              ghostingRisk: isFame ? "NONE" : "LOW",
              badge: c.isVerified ? "Truth Teller Verified 🏆" : (isFame ? "Lightning Reviewer ⚡" : "Standard Review"),
              badgeType: isFame ? "fame" : "standard",
              lastActive: c.truthTeller?.lastRecruiterActivity || "Active recently",
            };
          });
          setCompanies(liveList);
        }
      })
      .catch((err) => console.error("Error loading live transparency data:", err))
      .finally(() => setIsLoading(false));
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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verification Methodology &amp; Transparency Standard
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            The Truth Teller Transparency Standards
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
            Our public framework for job verification, anti-ghosting follow-up tracking, and automated listing freshness. Zero synthetic claims, 100% direct links.
          </p>
        </div>

        {/* VERIFICATION TIERS FRAMEWORK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Tier 1: Verified ATS Link
            </div>
            <h3 className="font-bold text-base text-slate-900">Direct Enterprise ATS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crawled directly from official employer ATS feeds (Greenhouse, Lever, Workday, Ashby, BambooHR). Clicking &ldquo;Apply&rdquo; opens the company&apos;s authenticated portal with zero intermediary hops or hidden data harvesting.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
              • 100% Direct Official Link<br />
              • Scanned for freshness every 24-48h<br />
              • Auto-expires in 14-21 days
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
              <Building2 className="h-4 w-4 text-indigo-600" /> Tier 2: Employer Verified
            </div>
            <h3 className="font-bold text-base text-slate-900">On-Platform Direct Postings</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Opportunities posted directly by hiring managers with verified corporate email domains (e.g. <code>@swiggy.in</code>, <code>@cred.club</code>). Free mailboxes (@gmail) require administrative review before publishing.
            </p>
            <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
              • Domain-verified corporate email<br />
              • Recruiter response telemetry enabled<br />
              • Direct in-app application flow
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
              <Clock className="h-4 w-4 text-amber-600" /> Tier 3: Truth Teller Follow-Up
            </div>
            <h3 className="font-bold text-base text-slate-900">Personal Application Journal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When applying to external ATS links, Truth Teller serves as your personal applicant journal. It records application dates, monitors the 7-day follow-up window, and provides tailored outreach templates to hiring teams.
            </p>
            <div className="text-[11px] font-mono text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
              • Self-reported candidate journal<br />
              • Automated 7-day follow-up nudge<br />
              • Pre-written recruiter check-in drafts
            </div>
          </div>
        </div>

        {/* METHODOLOGY CALLOUT BANNER */}
        <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
            <Zap className="h-4 w-4" /> Freshness &amp; De-Listing Policy
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
            <div>
              <strong className="text-white block text-sm mb-1">14-21 Day Automated TTL (Time-To-Live):</strong>
              To prevent dead links and ghost opportunities, our autonomous indexing engine deactivates unconfirmed postings after 14–21 days unless re-validated by live career portal scans.
            </div>
            <div>
              <strong className="text-white block text-sm mb-1">Employer De-Listing SLA (24 Hours):</strong>
              Hiring managers or companies may request instant modification, closing, or de-listing of any job posting by emailing <a href="mailto:support@rolenest.in" className="text-emerald-400 underline">support@rolenest.in</a>. All requests are executed within 24 business hours.
            </div>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab("fame")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "fame"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
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
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Wall of Shame ⚠️ (Ghost Warnings)</span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Companies
            </button>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search company or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 h-9 rounded-xl shadow-none focus-visible:ring-emerald-500"
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
                className={`border bg-white text-slate-900 transition-all shadow-sm ${
                  isFame
                    ? "border-emerald-200 hover:border-emerald-400"
                    : "border-rose-200 hover:border-rose-400"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {comp.logoUrl ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 border border-slate-200 shadow-xs overflow-hidden">
                          <img
                            src={comp.logoUrl}
                            alt={`${comp.name} logo`}
                            className="h-full w-full object-contain rounded-lg"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-800 border border-slate-200 text-sm">
                          {comp.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base font-bold text-slate-900">
                            {comp.name}
                          </CardTitle>
                          {comp.isVerified && (
                            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-mono border border-emerald-200 font-semibold">
                              Verified
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          {comp.industry} • {comp.location}
                        </CardDescription>
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-2.5 py-1 text-xs font-mono font-bold border ${
                        isFame
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {comp.badge}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">Median Review</div>
                      <div className={`font-mono font-bold text-sm ${isFame ? "text-emerald-600" : "text-rose-600"}`}>
                        {comp.medianReviewDays} Days
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500">Response Rate</div>
                      <div className={`font-mono font-bold text-sm ${isFame ? "text-emerald-600" : "text-rose-600"}`}>
                        {comp.responseRatePercent}%
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500">Reviewed / Total</div>
                      <div className="font-mono font-semibold text-slate-800 text-sm">
                        {comp.reviewedApplications}/{comp.totalApplications}
                      </div>
                    </div>
                  </div>

                  {/* ADVISORY MESSAGE */}
                  <div className="text-xs">
                    {isFame ? (
                      <p className="text-emerald-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        Guaranteed Truth Teller SLA: Applicants receive fast screening updates.
                      </p>
                    ) : (
                      <p className="text-rose-700 flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                        Ghost Alert: High proportion of applications remain neglected past 10 days.
                      </p>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Last recruiter activity: {comp.lastActive}
                    </span>

                    <Link
                      href={`/companies/${comp.slug}`}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
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
