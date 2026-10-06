import Link from "next/link";
import { GraduationCap, Github, MessageSquare, Sparkles, ExternalLink, ShieldCheck, Heart } from "lucide-react";

export function StudyFooter() {
  return (
    <footer className="w-full border-t border-indigo-950/60 bg-[#050711] text-slate-400 font-sans text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* BRAND COLUMN */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-600/30">
                <GraduationCap className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                RoleNest <span className="text-indigo-400">Study</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The zero-fluff, open-access engineering university. Master computer science, modern cloud systems, and AI architectures through guided 30-day cohorts and community study pods.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://discord.gg/rolenest"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-indigo-950 bg-indigo-950/30 px-3 py-1.5 text-slate-300 hover:text-white hover:border-indigo-800 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>Discord Study Pods</span>
              </a>
              <a
                href="https://github.com/divyanshujethi"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Open Syllabus</span>
              </a>
            </div>
          </div>

          {/* ROADMAPS COLUMN */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Career Roadmaps
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/roadmaps/ai-engineer" className="hover:text-indigo-300 transition-colors">
                  AI &amp; Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/fullstack-developer" className="hover:text-indigo-300 transition-colors">
                  Full-Stack Web Architect
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/backend-systems" className="hover:text-indigo-300 transition-colors">
                  Backend &amp; Distributed Systems
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/devops-cloud" className="hover:text-indigo-300 transition-colors">
                  DevOps &amp; Cloud Platform
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/data-analyst" className="hover:text-indigo-300 transition-colors">
                  Data Science &amp; Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* LEARNING TRACKS COLUMN */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Study Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/study" className="hover:text-indigo-300 transition-colors">
                  30-Day Intensive Cohorts
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="hover:text-indigo-300 transition-colors">
                  Zero-Fluff Video Masterclasses
                </Link>
              </li>
              <li>
                <Link href="/study#ai-generator" className="hover:text-indigo-300 transition-colors">
                  AI Syllabus Generator
                </Link>
              </li>
              <li>
                <Link href="/study-pods" className="hover:text-indigo-300 transition-colors">
                  Virtual Peer Study Pods
                </Link>
              </li>
            </ul>
          </div>

          {/* ECOSYSTEM COLUMN */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
              RoleNest Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://problem.rolenest.in/potd"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <span>Code Arena (POTD)</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://rolenest.in/jobs"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Verified Job Board</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://internship.rolenest.in"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <span>Internship Bootcamp</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://donation.rolenest.in"
                  className="hover:text-rose-300 transition-colors flex items-center gap-1"
                >
                  <span>Donate to Education</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="mt-10 pt-6 border-t border-indigo-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} RoleNest Study. 100% Free Open Educational Resource.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <span className="flex items-center gap-1 text-indigo-400/80">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              Verified Curricula
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
