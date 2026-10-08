"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@repo/shared";
import { ShieldCheck, Heart, Award, Scale, Settings2, Download, Smartphone, Mail } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  const isDonation =
    pathname?.startsWith("/donate") ||
    (typeof window !== "undefined" &&
      (window.location.hostname.includes("donation.") ||
        window.location.hostname.includes("donate.")));

  const isArena =
    pathname?.startsWith("/potd") ||
    pathname?.startsWith("/problems") ||
    (typeof window !== "undefined" &&
      (window.location.hostname.includes("problem.") ||
        window.location.hostname.includes("arena.") ||
        window.location.hostname.includes("code.")));

  if (pathname?.startsWith("/potd") || pathname?.startsWith("/problems") || pathname?.startsWith("/canvas") || isDonation || isArena) {
    return null;
  }

  const triggerPwaInstall = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("trigger-pwa-install"));
    }
  };

  const openDPDPPreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-dpdp-preferences"));
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {APP_CONFIG.tagline}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Verified &amp; Transparent
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
              <Scale className="h-4 w-4 text-blue-600" />
              🇮🇳 DPDP Act 2023 Compliant
            </div>

            {/* CASHFREE & SUPPORT CONTACT DETAILS */}
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-600" /> Support &amp; Customer Care
              </div>
              <div>
                <a href="mailto:support@rolenest.in" className="text-emerald-700 font-semibold hover:underline">
                  support@rolenest.in
                </a>
              </div>
              <div>
                <a href="mailto:contact@rolenest.in" className="text-slate-600 hover:underline text-[11px]">
                  contact@rolenest.in
                </a>
              </div>
              <div className="text-[10px] text-slate-400">Response SLA: within 24 hours</div>
            </div>
          </div>

          {/* COLUMN 2: 3 CORE PILLARS (LAUNCH SCOPE) */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
                Core Pillars
              </h3>
              <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                Launch
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/jobs" className="hover:text-emerald-600 font-bold text-slate-800 flex items-center gap-1.5">
                  💼 Verified Tech Jobs
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-emerald-600 font-bold text-slate-800 flex items-center gap-1.5">
                  ✨ Paid Tech Internships
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-emerald-600 font-bold text-emerald-800 flex items-center gap-1.5">
                  ⏱️ Application Tracker &amp; Nudges
                </Link>
              </li>
              <li>
                <Link href="/resume/builder" className="hover:text-emerald-600 font-bold text-blue-700 flex items-center gap-1.5">
                  📄 ATS Resume Builder (LaTeX)
                </Link>
              </li>
              <li>
                <Link href="/resume/assistant" className="hover:text-emerald-600 font-semibold text-purple-700 flex items-center gap-1.5">
                  🪄 AI Bullet Improver (STAR)
                </Link>
              </li>
              <li>
                <Link href="/profile/resume" className="hover:text-emerald-600 text-slate-600 flex items-center gap-1.5">
                  🔒 Candidate Resume Vault
                </Link>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={triggerPwaInstall}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1.5 rounded-lg transition-colors w-full text-left"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  Install App (PWA)
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: ROLENEST LABS & COMMUNITY (BETA) */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
                RoleNest Labs
              </h3>
              <span className="rounded bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                Beta
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://problem.rolenest.in/potd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 font-medium text-orange-700 flex items-center gap-1.5"
                >
                  ⚡ Problem of the Day (+50 XP)
                </a>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-600 font-medium text-amber-700 flex items-center gap-1.5">
                  🔥 Daily Streaks &amp; Battles
                </Link>
              </li>
              <li>
                <a
                  href="https://study.rolenest.in/study-pods"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 font-medium text-indigo-700 flex items-center gap-1.5"
                >
                  👥 Peer Study Pods &amp; Mocks
                </a>
              </li>
              <li>
                <a
                  href="https://study.rolenest.in/canvas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 font-medium text-emerald-700 flex items-center gap-1.5"
                >
                  🗺️ Visual Skill Canvas (Nodes)
                </a>
              </li>
              <li>
                <a
                  href="https://study.rolenest.in/roadmaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 font-medium text-blue-700 flex items-center gap-1.5"
                >
                  🧭 Open Career Roadmaps
                </a>
              </li>
              <li>
                <Link href="/salaries" className="hover:text-emerald-600 font-medium text-emerald-700 flex items-center gap-1.5">
                  💵 Tech Salaries &amp; CTC
                </Link>
              </li>
              <li>
                <Link href="/bounties" className="hover:text-emerald-600 font-medium text-amber-700 flex items-center gap-1.5">
                  💰 Bounty Nest™ Referrals
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-emerald-600 text-slate-500">
                  🎓 Free Course Diplomas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Employers &amp; Campuses
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/employer/jobs/new" className="hover:text-emerald-600">
                  Post an Internship
                </Link>
              </li>
              <li>
                <Link href="/employer/applicants" className="hover:text-emerald-600">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/placement-portal" className="hover:text-emerald-600 font-medium text-emerald-700">
                  Placement Cell Syndication
                </Link>
              </li>
              <li>
                <Link href="/api/feed/rss" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 flex items-center gap-1 text-amber-700">
                  Standard RSS 2.0 Feed
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-emerald-600 font-semibold text-emerald-800">
                  Verification &amp; Transparency Standard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Privacy &amp; DPDP Governance
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/privacy" className="hover:text-emerald-600 font-medium text-slate-800">
                  Privacy Policy &amp; DPDP Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy#dpdp-grievance" className="hover:text-emerald-600 text-xs text-emerald-700 font-semibold">
                  Grievance Redressal Officer (72h SLA)
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openDPDPPreferences}
                  className="hover:text-emerald-600 text-xs text-slate-600 font-medium flex items-center gap-1 text-left"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  DPDP &amp; Cookie Preferences
                </button>
              </li>
              <li>
                <Link href="/settings/account" className="hover:text-emerald-600 font-medium text-slate-700">
                  Download My Data (Sec. 11)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600 font-medium text-slate-700">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-emerald-600 font-medium text-slate-700">
                  DMCA &amp; IP Copyright Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy#gdpr-addendum" className="hover:text-emerald-600 text-xs text-slate-500 font-medium">
                  GDPR &amp; CCPA Disclosures
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-emerald-600 font-medium text-slate-700">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-emerald-600 font-medium text-slate-700">
                  Subscription Cancellation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-600 font-semibold text-emerald-800">
                  Plans &amp; Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-600 font-semibold text-rose-700 flex items-center gap-1"
                >
                  <Heart className="h-3 w-3 fill-rose-600 text-rose-600" />
                  Community Donation
                </Link>
              </li>
              <li>
                <Link href="/settings/account" className="hover:text-rose-600 font-medium text-slate-500">
                  Delete Account (DPDP Sec. 12)
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Zero Job Guarantee Disclaimer</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} <strong className="text-slate-700 font-bold">Role Nest</strong> (<a href="https://rolenest.in" className="text-emerald-700 hover:underline">rolenest.in</a>) — Engineered &amp; Maintained by <strong className="text-slate-700 font-bold">RitualDev Lab</strong> (<a href="https://ritualdev.in" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">ritualdev.in</a>).</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Payments &amp; contributions securely processed via Cashfree Payments (RBI Authorized Payment Aggregator).</p>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <p className="flex items-center gap-1.5">
              Support: <a href="mailto:support@rolenest.in" className="text-emerald-700 font-semibold underline">support@rolenest.in</a> • Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for freshers.
            </p>
            <div className="flex items-center gap-2 text-[11px]">
              <Link
                href="/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> Community Donation
              </Link>
              <span>•</span>
              <Link href="/transparency" className="text-slate-500 hover:text-emerald-700">
                Verification &amp; Transparency
              </Link>
              <span>•</span>
              <Link href="/privacy" className="text-slate-500 hover:text-emerald-700">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/dmca" className="text-slate-500 hover:text-emerald-700">
                DMCA Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
