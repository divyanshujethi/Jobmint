import { CheckCircle2, Clock, AlertCircle, ArrowRight, Eye, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

export function TruthTellerPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              The Truth Teller Engine
            </span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Never wonder &quot;Did they even look at my resume?&quot;
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Real activity logs with verifiable timestamps. If a company stops reviewing, we tell you immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="w-fit gap-1 text-xs py-1">
            <Clock className="h-3.5 w-3.5" /> 7-Day Ghosting Protection
          </Badge>
          <Link href="/applications">
            <Badge className="w-fit gap-1 text-xs py-1 bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 cursor-pointer">
              View My Tracker <ArrowRight className="h-3 w-3" />
            </Badge>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Showcase 1: 1-Click Official Portal Tracking */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider font-mono">
                Verified Direct Link
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                Official Company ATS Application
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Direct to Greenhouse, Lever, Workday &amp; Careers Sites</p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              Zero Middlemen
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Apply directly at the verified employer portal — no intermediate forms</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>1-Click &quot;Track with Truth Teller&quot; records your submission timestamp</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Free Forever — no hidden application paywalls or credits</span>
            </div>
          </div>
        </div>

        {/* Feature Showcase 2: Automated 7-Day Follow-Up Alerts */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
                Candidate Follow-Up Engine
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                Automated Reminders &amp; Deadlines
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Never lose track of where and when you applied</p>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
              7-Day Smart Tracker
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3.5 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
              Smart Follow-up Countdown
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Every tracked application starts an automatic 7-day countdown with follow-up email templates and tips for connecting with hiring managers.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-[11px]">Track unlimited external roles</span>
              <Link
                href="/applications"
                className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                Open Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
