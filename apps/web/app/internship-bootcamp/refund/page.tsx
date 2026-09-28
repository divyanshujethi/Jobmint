import Link from "next/link";
import {
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Mail,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Refund & Cancellation Policy | RoleNest Internship Labs",
  description:
    "Official 7-Day Money-Back Guarantee, refund terms, and cancellation guidelines for RoleNest 3-4 week industrial internship bootcamps.",
};

export default function InternshipRefundPage() {
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
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>7-Day Student Protection Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Effective: September 2026 • Applicable to all RoleNest 3–4 Week Industrial Internship Bootcamps.
        </p>
      </div>

      {/* 7-DAY GUARANTEE HIGHLIGHT BOX */}
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black block">
              100% Risk-Free Enrollment
            </span>
            <h2 className="text-lg font-black text-white">
              7-Day Full Tuition Refund Guarantee
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          We want every engineering student to explore our live coding competition arena, study manuals, and mentorship with absolute confidence. If you determine that the program does not align with your learning goals within the first 7 days of enrollment, you are entitled to a full 100% refund.
        </p>
      </div>

      {/* POLICY CLAUSES */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* CLAUSE 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>1. Eligibility Window</span>
          </h3>
          <p>
            To qualify for a 100% refund, the refund request must be formally submitted within <strong>seven (7) calendar days</strong> from the original timestamp of course payment.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Requests initiated on or before the 7th day will be approved with zero penalty or administrative deduction.</li>
            <li>After the 7th day, tuition fees are non-refundable as server infrastructure, computing resources, and mentor review queues are permanently allocated.</li>
          </ul>
        </div>

        {/* CLAUSE 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span>2. Certificate Issuance Exception</span>
          </h3>
          <p>
            Once a student has submitted their final Capstone Project, received mentor grading, and generated an official verifiable <strong>Certificate ID</strong> registered on the public cryptographic ledger, the tuition fee becomes <strong>strictly non-refundable</strong>.
          </p>
          <p className="text-xs text-slate-400">
            This exception prevents misuse of credentials for academic credit claiming or university NOC submissions without legitimate completion.
          </p>
        </div>

        {/* CLAUSE 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-teal-400" />
            <span>3. Refund Processing &amp; Timeline</span>
          </h3>
          <p>
            All approved refunds are processed automatically through our RBI-licensed payment gateway partner, <strong>Cashfree Payments</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>Refunds are returned strictly to the original source account (UPI ID, Debit/Credit Card, or NetBanking).</li>
            <li>Typical turnaround time is <strong>5 to 7 working banking days</strong> from the date of approval.</li>
            <li>You will receive an automated Cashfree ARN (Acquirer Reference Number) tracking email once the transfer is executed.</li>
          </ul>
        </div>

        {/* CLAUSE 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" />
            <span>4. How to Request a Refund</span>
          </h3>
          <p>
            To initiate a refund, please send an email to <span className="text-emerald-400 font-mono font-bold">refunds@rolenest.in</span> with the subject line <code>"Internship Refund Request - [Your Registered Email]"</code>.
          </p>
          <p className="text-xs text-slate-400">
            Please include: (1) Your Full Legal Name, (2) Enrolled Domain Track, and (3) Cashfree Order ID or Payment Screenshot. Our finance desk responds within 24 hours.
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
          href="/terms"
          className="text-slate-400 hover:text-emerald-400 transition-colors"
        >
          View Terms of Service &rarr;
        </Link>
      </div>

    </div>
  );
}
