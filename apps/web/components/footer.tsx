import Link from "next/link";
import { APP_CONFIG } from "@repo/shared";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
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
              Verified & Transparent
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Candidates
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
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
                <Link href="/truth-teller" className="hover:text-emerald-600">
                  Truth Teller Engine
                </Link>
              </li>
              <li>
                <Link href="/resume/assistant" className="hover:text-emerald-600 flex items-center gap-1 font-medium text-emerald-700">
                  AI Resume Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Employers
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
                <Link href="/transparency" className="hover:text-emerald-600">
                  Our Transparency Pledge
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">
              Platform & Open Source
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/admin/system" className="text-emerald-700 hover:underline font-semibold flex items-center gap-1">
                  Zero-Cost Quota Monitor
                </Link>
              </li>
              <li>
                <span className="text-slate-500">100% Free Tier Architecture</span>
              </li>
              <li>
                <span className="text-slate-500">Zero-Lock-In Standard</span>
              </li>
              <li>
                <span className="text-slate-500">Data Portability First</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Built for young talent.</p>
          <p className="flex items-center gap-1">
            Built with transparency <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for students & freshers.
          </p>
        </div>
      </div>
    </footer>
  );
}
