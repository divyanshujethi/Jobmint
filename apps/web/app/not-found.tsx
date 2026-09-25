import Link from "next/link";
import {
  Compass,
  Briefcase,
  FileText,
  Code2,
  BookOpen,
  Sparkles,
  Terminal,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 — Page Not Found | Role Nest",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50/50">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
        {/* Animated Badge & Hero 404 */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-mono font-bold text-emerald-800 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LOST IN THE NEST • HTTP 404</span>
          </div>

          <div className="relative inline-block">
            <div className="text-8xl sm:text-9xl font-black tracking-tighter text-slate-900 select-none">
              4<span className="text-emerald-600">0</span>4
            </div>
            <div className="absolute -top-3 -right-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl rotate-12">
              <Compass className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Looks like this page flew the coop.
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The link you followed might be broken, the opportunity expired, or the URL changed. Don&apos;t worry — your streak, DevScore, and application data are completely safe.
          </p>
        </div>

        {/* Developer Terminal Diagnostic Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left font-mono text-xs text-slate-300 shadow-xl max-w-lg mx-auto overflow-hidden">
          <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-800/80 text-slate-400">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-300">system_diagnostic.sh</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500/80" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
            </div>
          </div>
          <div className="space-y-1 text-[11px]">
            <p className="text-slate-400">
              <span className="text-emerald-400">$</span> rolenest status --target path
            </p>
            <p className="text-amber-400">
              [!] 404_PAGE_UNRESOLVED: Resource does not exist on cluster
            </p>
            <p className="text-slate-400">
              [✓] Verified DevScore Engine: <span className="text-emerald-400">ONLINE</span>
            </p>
            <p className="text-slate-400">
              [✓] 7-Day Ghosting Shield: <span className="text-emerald-400">ACTIVE</span>
            </p>
            <p className="text-emerald-300 pt-1 font-semibold">
              Recommendation: Reroute candidate to active opportunities below ↴
            </p>
          </div>
        </div>

        {/* Quick Jump Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
          <Link
            href="/jobs"
            className="group rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Verified Jobs
              </div>
              <div className="text-[11px] text-slate-500">
                Ghost-free roles &amp; review rates
              </div>
            </div>
          </Link>

          <Link
            href="/resume/builder"
            className="group rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                ATS Resume Builder
              </div>
              <div className="text-[11px] text-slate-500">
                1-Click Harvard / Stanford PDF
              </div>
            </div>
          </Link>

          <Link
            href="/potd"
            className="group rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-orange-400 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                Problem of the Day
              </div>
              <div className="text-[11px] text-slate-500">
                Earn +50 XP &amp; save streak
              </div>
            </div>
          </Link>

          <Link
            href="/roadmaps"
            className="group rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-purple-400 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Free Roadmaps
              </div>
              <div className="text-[11px] text-slate-500">
                Skill trees from zero to hired
              </div>
            </div>
          </Link>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 px-6 rounded-xl gap-2 shadow-sm w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              variant="outline"
              className="border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs h-11 px-6 rounded-xl gap-2 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Explore All Openings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
