import Link from "next/link";
import {
  Download,
  ShieldCheck,
  Chrome,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Laptop,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Track with RoleNest — Manifest V3 Chrome Extension | RoleNest",
  description:
    "1-Click save job openings from LinkedIn, Greenhouse, Lever, Indeed, and company career portals directly to your RoleNest personal application journal.",
  alternates: {
    canonical: "https://rolenest.in/extension",
  },
};

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* HERO SECTION */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <Chrome className="h-4 w-4" /> Manifest V3 Browser Extension
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Track Any Job in 1-Click with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              RoleNest
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Stop losing job applications in spreadsheets. Save openings directly from LinkedIn, Greenhouse, Lever, Workday, and company career pages straight into your Truth Teller journal with automated 7-day follow-up countdowns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/downloads/rolenest-extension.zip"
              download="rolenest-extension.zip"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all"
            >
              <Download className="h-4 w-4" />
              Download Extension ZIP
            </a>

            <a
              href="https://github.com/divyanshujethi/Jobmint/tree/master/apps/extension"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-all"
            >
              <Chrome className="h-4 w-4 text-emerald-400" />
              View on GitHub
            </a>

            <Link
              href="/applications"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm transition-all"
            >
              Open Journal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* INTERACTIVE PREVIEW CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                ✓
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">How It Works While Browsing</h2>
                <p className="text-xs text-slate-400">Zero manual copy-pasting. Instant DOM extraction.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Manifest V3 Architecture
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
              <div className="text-emerald-400 text-xs font-mono font-bold">01. BROWSE ANY PORTAL</div>
              <h3 className="text-sm font-semibold text-white">Auto-Detect Roles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When you visit a job posting on LinkedIn, Greenhouse, Lever, Workday, or Indeed, the extension automatically extracts the title, company, location, and salary.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
              <div className="text-emerald-400 text-xs font-mono font-bold">02. ONE-CLICK CAPTURE</div>
              <h3 className="text-sm font-semibold text-white">Track with RoleNest</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click the extension icon, add optional referral notes or status (Applied / Interviewing), and tap "Track". Synced instantly to your account.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
              <div className="text-emerald-400 text-xs font-mono font-bold">03. TRUTH TELLER SHIELD</div>
              <h3 className="text-sm font-semibold text-white">7-Day Nudge Timers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your RoleNest Kanban board starts an automated 7-day follow-up countdown, providing custom email outreach drafts so you never get ghosted.
              </p>
            </div>
          </div>
        </div>

        {/* INSTALLATION STEPS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Quick Install Guide (Developer Mode)</h2>
            <p className="text-xs text-slate-400">Install in 30 seconds on Chrome, Brave, Edge, or Arc.</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs shrink-0">
                1
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">Open Extensions Manager</div>
                <div className="text-xs text-slate-400">
                  Open your browser and navigate to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono">chrome://extensions</code>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs shrink-0">
                2
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">Enable Developer Mode</div>
                <div className="text-xs text-slate-400">
                  Toggle the <strong>Developer mode</strong> switch located in the top-right corner of the Extensions page.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs shrink-0">
                3
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">Load Unpacked Extension</div>
                <div className="text-xs text-slate-400">
                  Click <strong>Load unpacked</strong> and select the <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono">apps/extension</code> directory from your cloned repo.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY & PRIVACY PROMISE */}
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6 text-center space-y-3">
          <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Strict Privacy &amp; Zero Tracking Promise</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            The RoleNest extension operates solely with active-tab permissions. It does not monitor your browsing history, run analytics trackers, or access non-job pages. Your application data belongs strictly to you.
          </p>
        </div>
      </div>
    </div>
  );
}
