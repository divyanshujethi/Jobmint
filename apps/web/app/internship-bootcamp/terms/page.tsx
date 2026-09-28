import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  ShieldCheck,
  Scale,
  Code2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service & Code of Conduct | RoleNest Internship Labs",
  description:
    "Official Terms of Service, Student Honor Code, Intellectual Property terms, and Certificate Validity rules for RoleNest Industrial Internship Bootcamps.",
};

export default function InternshipTermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* BREADCRUMB */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to RoleNest Internship Labs
        </Link>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full mb-3">
          <Scale className="h-3.5 w-3.5" />
          <span>Student Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Terms of Service &amp; Honor Code
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Last Updated: September 2026 • Governs all enrolled students, campus cohorts, and certificate holders.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* SECTION 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <h3 className="text-base font-extrabold text-white">
            1. Nature of the Industrial Program
          </h3>
          <p>
            The RoleNest Virtual Internship &amp; Engineering Bootcamp provides applied software engineering training, algorithmic problem-solving labs, and capstone project assessment. This program is educational in nature. It is structured to help students earn academic credits in compliance with UGC/AICTE norms. As outlined in our Disclaimers, it does not guarantee job placement or employment offers.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <h3 className="text-base font-extrabold text-white">
            2. Intellectual Property (IP) Ownership
          </h3>
          <p>
            <strong>Students Retain 100% Ownership:</strong> All code, repositories, architectures, and documentation developed by students during practical labs or capstone milestones remain the sole and exclusive intellectual property of the student. RoleNest claims zero ownership rights over your project creations.
          </p>
        </div>

        {/* SECTION 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <h3 className="text-base font-extrabold text-white">
            3. Student Honor Code &amp; Academic Integrity
          </h3>
          <p>
            To maintain university credibility and employer trust in RoleNest Certificate IDs:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Students must write their own code and complete algorithmic tests honestly.</li>
            <li>Submitting completely plagiarized GitHub repositories or impersonating another student will lead to immediate cancellation of enrollment without refund.</li>
            <li>RoleNest reserves the right to cryptographically revoke or invalidate any Certificate ID found to be obtained through fraudulent representation or academic dishonesty.</li>
          </ul>
        </div>

        {/* SECTION 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <h3 className="text-base font-extrabold text-white">
            4. Certificate Verification &amp; Public Ledger
          </h3>
          <p>
            Upon successful project evaluation, students are issued an immutable Certificate ID (e.g. <code>RN-INT-2026-[TRACK]-[HEX]</code>) published on our public verification portal. By claiming the certificate, the student grants RoleNest permission to display their name, college name, degree specialization, completion grade, and capstone repository link for verification by prospective recruiters and academic faculty.
          </p>
        </div>

        {/* SECTION 5 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
          <h3 className="text-base font-extrabold text-white">
            5. Payment Terms &amp; Refund Policy
          </h3>
          <p>
            All tuition charges are processed through Cashfree Payments. All enrollment purchases are covered by our <Link href="/refund" className="text-emerald-400 underline font-bold">7-Day Money-Back Guarantee</Link>, subject to the condition that the certificate has not yet been issued.
          </p>
        </div>

      </div>

      {/* FOOTER NAVIGATION */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs">
        <Link
          href="/privacy"
          className="text-slate-400 hover:text-emerald-400 transition-colors"
        >
          &larr; View Privacy Policy &amp; Non-Guarantee Disclaimers
        </Link>
        <Link
          href="/refund"
          className="text-slate-400 hover:text-emerald-400 transition-colors"
        >
          View Refund Policy &rarr;
        </Link>
      </div>

    </div>
  );
}
