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
        <Badge variant="warning" className="w-fit gap-1 text-xs py-1">
          <Clock className="h-3.5 w-3.5" /> 7-Day Ghosting Protection
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Application 1: Active & Shortlisted */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800">
                ABC Technologies
              </span>
              <h4 className="text-base font-bold text-slate-900">
                Frontend Developer Intern
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Remote • ₹25,000/month</p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              🔥 94% Match
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Applied — <strong>Sep 14, 10:24 AM</strong></span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <Eye className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Resume Viewed — <strong>Sep 15, 02:10 PM (by Lead Eng.)</strong></span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-800 font-medium">
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Shortlisted for Technical Round — <strong>Sep 17</strong></span>
            </div>
          </div>
        </div>

        {/* Sample Application 2: Inactive for 7 days (Truth Teller Alert!) */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700">
                XYZ Innovations
              </span>
              <h4 className="text-base font-bold text-slate-900">
                AI / Python Intern
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Bangalore • Hybrid</p>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
              88% Match
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-white p-3.5 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              Truth Teller Inactivity Alert
            </div>
            <p className="text-slate-600 leading-relaxed">
              Applied <strong>8 days ago</strong>. The employer has not viewed your application. Their median response time is usually 3 days.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="font-semibold text-slate-800">14 similar active jobs found</span>
              <Link
                href="/jobs?query=python+ai"
                className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                Apply Now <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
