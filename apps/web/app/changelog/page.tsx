import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  Mail,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock,
} from "lucide-react";
import { getPlatformMetrics } from "@/lib/platform-metrics";

export const metadata: Metadata = {
  title: "Public Product Changelog — RoleNest",
  description:
    "Live development history, verification engine milestones, and platform upgrades behind RoleNest.",
  alternates: {
    canonical: "https://rolenest.in/changelog",
  },
  openGraph: {
    title: "Public Product Changelog — RoleNest",
    description:
      "Track every release, crawler enhancement, and compliance milestone across RoleNest.",
    url: "https://rolenest.in/changelog",
    siteName: "RoleNest",
    type: "website",
    images: [
      {
        url: "https://rolenest.in/icon-512.png",
        width: 512,
        height: 512,
        alt: "RoleNest Public Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public Product Changelog — RoleNest",
    description: "Real-time updates, crawl benchmarks, and features shipped across RoleNest.",
    images: ["https://rolenest.in/icon-512.png"],
    creator: "@RoleNest",
  },
};

export const revalidate = 1800; // 30 minutes ISR

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  tag: "VERIFICATION" | "COMPLIANCE" | "FEATURE" | "PERFORMANCE";
  highlights: string[];
  details: string;
}

const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v2.7.0",
    date: "October 2026",
    title: "Track with RoleNest Manifest V3 Extension & Campus Placement Command Center",
    tag: "FEATURE",
    highlights: [
      "Launched 'Track with RoleNest' Manifest V3 Chrome Extension for 1-click external job journaling",
      "Auto-extraction engine supporting LinkedIn, Greenhouse, Lever, Indeed, and Workday",
      "Deployed Institutional Campus Placement Cell (TPO) Command Center (/placement-portal/dashboard)",
      "Implemented employer paid featured job boost with automated 30-day top-of-feed placement",
      "Hardened code runner sandboxes with timeout protection and Web Worker execution bounds",
      "Enforced strict Cashfree webhook & verify order idempotency ledgers",
    ],
    details:
      "Empowered job seekers to journal any external role into their Truth Teller Kanban pipeline directly from their browser, and equipped campus placement cells with live student DevScore telemetry and NAAC accreditation reporting.",
  },
  {
    version: "v2.6.0",
    date: "October 2026",
    title: "Real-Time Telemetry, Single Database Metric Pipeline & Subdomain Unification",
    tag: "VERIFICATION",
    highlights: [
      "Wired live 24-hour verification counters and crawler timestamps directly into /jobs",
      "Unified all counter metrics to single database utility getPlatformMetrics()",
      "Isolated ProblemNest and StudyNest canonical tags and social graph assets",
      "Eliminated synthetic placeholder XP and streaks for unauthenticated visitors",
    ],
    details:
      "Replaced disconnected hardcoded counts with single-source PostgreSQL/Redis telemetry. Real-time jobs feed now presents exact 24-hour verification volume and crawler execution timestamps.",
  },
  {
    version: "v2.5.0",
    date: "October 2026",
    title: "Dual Soft-404 Expiry Watchdog & Candidate Retention Digest",
    tag: "FEATURE",
    highlights: [
      "Built soft-404 body regex analyzer catching 18+ closed portal patterns",
      "Automated TTL job archiving cron (/api/cron/jobs-ttl) with 45-day threshold",
      "Launched personalized daily candidate digest email system (/api/cron/daily-digest)",
      "Added zero-lag HTML digest templates with 1-click ATS application links",
    ],
    details:
      "Automated expired job detection beyond HTTP status codes, inspecting body contents for career portal redirection and application closed banners. Deployed scheduled daily email digests.",
  },
  {
    version: "v2.4.0",
    date: "September 2026",
    title: "India DPDP Act 2023 Compliance & Security Hardening",
    tag: "COMPLIANCE",
    highlights: [
      "Built portable data export endpoint (/api/account/export) in JSON format",
      "Added irreversible cascade deletion with 30-day nominee retention rules",
      "Enforced Cashfree webhook HMAC-SHA256 signature verification",
      "Added granular purpose-specific consent preferences in user settings",
    ],
    details:
      "Fulfilled all core provisions of India's Digital Personal Data Protection (DPDP) Act 2023, ensuring user rights over data export, nomination, and account destruction.",
  },
  {
    version: "v2.3.0",
    date: "September 2026",
    title: "Unified Brand Consolidation to RoleNest & AI Multi-Key Architecture",
    tag: "PERFORMANCE",
    highlights: [
      "Consolidated legacy naming into canonical RoleNest across entire codebase",
      "Configured multi-key Groq pool with local OCI Ollama fallback",
      "Completely purged Google AI and Gemini dependencies across all services",
      "Server-side rendered schema.org JobPosting structured JSON-LD",
    ],
    details:
      "Standardized platform branding and enhanced AI resilience using high-throughput Groq LLM clusters and dedicated self-hosted inference.",
  },
];

export default async function ChangelogPage() {
  const metrics = await getPlatformMetrics();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Product Updates &amp; Engineering Log</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Public Changelog
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Full transparency into everything we build, fix, and verify across RoleNest, ProblemNest Arena, and StudyNest Academy.
        </p>

        {/* LIVE PLATFORM METRICS SUMMARY STRIP */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Live Active Roles
            </span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {metrics.activeJobs.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Verified 24h
            </span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              {metrics.verified24hCount.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              DSA Challenges
            </span>
            <span className="text-xl font-black text-amber-600 font-mono">
              {metrics.dsaProblems} Problems
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Govt &amp; PSU Orgs
            </span>
            <span className="text-xl font-black text-indigo-600 font-mono">
              32+ Orgs
            </span>
          </div>
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
        {CHANGELOG_ENTRIES.map((entry) => (
          <div key={entry.version} className="relative flex items-start gap-6 group">
            {/* Timeline node */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border-2 border-emerald-500 shadow-xs z-10">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
            </div>

            {/* Entry content card */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    {entry.version}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      entry.tag === "VERIFICATION"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : entry.tag === "COMPLIANCE"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : entry.tag === "FEATURE"
                        ? "bg-purple-50 text-purple-800 border border-purple-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {entry.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{entry.date}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{entry.title}</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {entry.details}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-50">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Key Deliverables:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {entry.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER CALLOUT */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Have a bug report or feature recommendation?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Our engineering team reviews verified candidate and recruiter feedback daily.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 transition-colors"
          >
            Explore Jobs Feed &rarr;
          </Link>
          <Link
            href="/transparency"
            className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 transition-colors"
          >
            Transparency Wall
          </Link>
        </div>
      </div>
    </div>
  );
}
