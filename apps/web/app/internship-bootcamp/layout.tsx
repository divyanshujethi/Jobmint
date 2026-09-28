import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Code2,
  BookOpen,
  FileCheck2,
  Award,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "RoleNest Virtual Internship Labs & Engineering Bootcamps | 3-4 Week Industry Programs",
  description:
    "Comprehensive 3-4 week industrial internship bootcamps across AI/ML, Cybersecurity, Prompt Engineering, Python, Enterprise Java & Full-Stack. Live in-browser code competitions, downloadable engineering guides, VIP Discord mentorship, and official college-recognized Certificate IDs.",
  keywords: [
    "Tech Internship India",
    "Paid Internship Bootcamp",
    "AI ML Internship 4 Weeks",
    "Cybersecurity Internship Certificate",
    "College Recognized Internship Certificate",
    "AICTE Internship Credits",
    "RoleNest Internship Labs",
  ],
};

export default function InternshipBootcampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border-b border-emerald-800/40 px-4 py-2 text-center text-xs font-medium text-emerald-200 flex items-center justify-center gap-2 flex-wrap">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>2026 Batch Applications Open:</strong> AICTE/UGC Credit Recommended 3-4 Week Industrial Internships with Recognized Certificate IDs.
        </span>
        <span className="hidden sm:inline text-emerald-400/50">•</span>
        <Link
          href="#tracks"
          className="text-white underline hover:text-emerald-300 font-bold inline-flex items-center gap-0.5"
        >
          View 6 Domain Tracks &rarr;
        </Link>
      </div>

      {/* DEDICATED BOOTCAMP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-white group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    RoleNest
                  </span>
                  <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    INTERNSHIP LABS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Virtual Engineering Academy &amp; Research
                </span>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link
              href="/#tracks"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              Tracks &amp; Syllabus
            </Link>
            <Link
              href="/#code-arena"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Terminal className="h-3.5 w-3.5 text-teal-400" />
              Code Competition Arena
            </Link>
            <Link
              href="/#study-material"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-400" />
              PDF Study Material
            </Link>
            <Link
              href="/#college-recognition"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-purple-400" />
              College Recognition
            </Link>
            <Link
              href="/verify/RN-INT-2026-AIML-9F2B84"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Verify Certificate ID
            </Link>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/rolenest"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/50 px-3 py-1.5 text-xs font-bold text-indigo-300 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span>VIP Discord</span>
            </a>

            <Link
              href="/portal"
              className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
            >
              Student Portal
            </Link>

            <Link
              href="/#tracks"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-4 py-1.5 text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <span>Enroll (₹499)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">{children}</main>

      {/* DEDICATED BOOTCAMP FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                RN
              </div>
              <span className="font-extrabold text-white text-sm">
                RoleNest Internship Labs
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Industrial virtual engineering bootcamps delivering real-world code deliverables, in-browser competitions, and verifiable certificate credentials.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>AICTE &amp; UGC Credit Framework Compliant</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Engineering Tracks
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/ai-ml" className="hover:text-emerald-400 transition-colors">
                  AI &amp; Machine Learning (4 Wks)
                </Link>
              </li>
              <li>
                <Link href="/cyber-security" className="hover:text-emerald-400 transition-colors">
                  Cyber Security &amp; Ethical Hacking (4 Wks)
                </Link>
              </li>
              <li>
                <Link href="/prompt-engineering" className="hover:text-emerald-400 transition-colors">
                  Prompt Engineering &amp; GenAI (3 Wks)
                </Link>
              </li>
              <li>
                <Link href="/python-automation" className="hover:text-emerald-400 transition-colors">
                  Python Full-Stack &amp; Automation (4 Wks)
                </Link>
              </li>
              <li>
                <Link href="/enterprise-java" className="hover:text-emerald-400 transition-colors">
                  Enterprise Java 21 &amp; Spring Boot 3 (4 Wks)
                </Link>
              </li>
              <li>
                <Link href="/fullstack-nextjs" className="hover:text-emerald-400 transition-colors">
                  Full-Stack Next.js 15 &amp; Cloud (4 Wks)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              College &amp; Employer Verification
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/verify/RN-INT-2026-AIML-9F2B84" className="hover:text-emerald-400 transition-colors">
                  Public Certificate Verification Ledger
                </Link>
              </li>
              <li>
                <Link href="/#college-recognition" className="hover:text-emerald-400 transition-colors">
                  University Recommendation Letter Format
                </Link>
              </li>
              <li>
                <Link href="/#college-recognition" className="hover:text-emerald-400 transition-colors">
                  AICTE / UGC 4-Credit Policy Guide
                </Link>
              </li>
              <li>
                <Link href="/#college-recognition" className="hover:text-emerald-400 transition-colors">
                  NOC &amp; College HOD Approval Packet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              VIP Discord &amp; Support
            </h4>
            <p className="text-slate-400 mb-3 text-xs">
              Daily mentor office hours, live code reviews, and student networking in our exclusive Discord server.
            </p>
            <a
              href="https://discord.gg/rolenest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-2 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Join Internship Discord (1,500+)
            </a>
            <div className="mt-3 text-[11px] text-slate-400">
              Direct Inquiries: <span className="text-slate-200 font-mono">internships@rolenest.in</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; 2026 RoleNest Virtual Internship Labs. All rights reserved. Registered Indian Technical Education &amp; Verification Platform.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy &amp; Non-Guarantee Disclaimer
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-emerald-400 transition-colors">
              7-Day Refund Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms &amp; Honor Code
            </Link>
            <span>•</span>
            <span className="font-mono text-emerald-400">SHA-256 Ledger Authenticated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
