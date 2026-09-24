"use client";

import Link from "next/link";
import { APP_CONFIG } from "@repo/shared";
import { ShieldCheck, Heart, Award, Scale, Settings2, Download, Smartphone } from "lucide-react";

export function Footer() {
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
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
                J
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Candidates &amp; Learning
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={triggerPwaInstall}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors w-full text-left"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  Install JobMint App (PWA)
                </button>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-600 font-semibold text-amber-700 flex items-center gap-1.5">
                  🔥 Daily Streaks &amp; Campus Battles
                </Link>
              </li>
              <li>
                <Link href="/potd" className="hover:text-emerald-600 font-semibold text-orange-700 flex items-center gap-1.5">
                  ⚡ Problem of the Day (POTD +50 XP)
                </Link>
              </li>
              <li>
                <Link href="/resume/builder" className="hover:text-emerald-600 font-semibold text-blue-700 flex items-center gap-1.5">
                  📄 Harvard ATS Resume Builder (PDF &amp; LaTeX)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-emerald-600 font-semibold text-emerald-700">
                  Interactive Courses &amp; Playlists
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-emerald-600 font-semibold text-emerald-700">
                  🎓 Free Course Diplomas &amp; Hub
                </Link>
              </li>
              <li>
                <Link href="/certificates/verify/JM-AI-GPT-7B29A1" className="hover:text-emerald-600 text-xs text-slate-500">
                  Verify Certificate ID (Demo)
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-emerald-600">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-emerald-600">
                  Fresher Internships
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="hover:text-emerald-600">
                  Career Roadmaps (Free)
                </Link>
              </li>
              <li>
                <Link href="/canvas" className="hover:text-emerald-600 font-medium text-emerald-700">
                  Visual Skill Canvas (Node Graph)
                </Link>
              </li>
              <li>
                <Link href="/study-pods" className="hover:text-emerald-600 font-medium text-indigo-600">
                  Peer Study Pods &amp; Mocks
                </Link>
              </li>
              <li>
                <Link href="/profile/resume" className="hover:text-emerald-600 font-medium text-emerald-700">
                  Resume Vault (OCI NVMe)
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
                <Link href="/employer" className="hover:text-emerald-600">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/placement-portal" className="hover:text-emerald-600 font-medium text-emerald-700">
                  Placement Cell Syndication
                </Link>
              </li>
              <li>
                <Link href="/api/feed/rss" target="_blank" className="hover:text-emerald-600 flex items-center gap-1 text-amber-700">
                  Standard RSS 2.0 Feed
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-emerald-600">
                  Our Transparency Pledge
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
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Built for young talent in India &amp; Worldwide.</p>
          <p className="flex items-center gap-1">
            Built with transparency <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for students &amp; freshers.
          </p>
        </div>
      </div>
    </footer>
  );
}
