import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  Scale,
  CreditCard,
  Building2,
  Lock,
  FileCheck2,
  HelpCircle,
  GraduationCap,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy, Employment Disclaimer & Academic Disclosures | RoleNest Internship Labs",
  description:
    "Official Privacy Policy, Employment Non-Guarantee Disclaimer, AICTE/UGC Credit disclosures, Cashfree payment processing terms, and DPDP Act 2023 compliance for RoleNest Virtual Internship Labs.",
};

export default function InternshipPrivacyPage() {
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
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
          <Scale className="h-3.5 w-3.5 text-emerald-400" />
          <span>Statutory Disclosures &amp; Student Privacy Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Privacy Policy &amp; Mandatory Disclosures
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Effective Date: September 2026 • Governing: Digital Personal Data Protection (DPDP) Act 2023, UGC/AICTE Internship Guidelines, and RBI Payment Aggregator Norms.
        </p>
      </div>

      {/* CRITICAL LEGAL DISCLAIMER: NO JOB GUARANTEE */}
      <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black block">
              Mandatory Statutory Disclaimer
            </span>
            <h2 className="text-lg font-black text-white">
              Strict Non-Guarantee of Employment or Placement
            </h2>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>1. Training &amp; Academic Credit Nature:</strong> The RoleNest Virtual Internship &amp; Engineering Bootcamp is an autonomous technical education, practical software engineering, and applied research program designed to fulfill university degree credit criteria and teach modern industry workflows.
          </p>
          <p>
            <strong>2. No Offer of Employment:</strong> Enrollment in, participation in, or successful completion of this bootcamp and receipt of an Internship Certificate ID <strong>DOES NOT</strong> constitute an offer of permanent employment, full-time hiring guarantee, placement promise, or contractual employment with RoleNest, its subsidiaries, or any partner companies.
          </p>
          <p>
            <strong>3. Discretion of Independent Employers:</strong> RoleNest facilitates student portfolios, verified code deliverables, and technical showcase ledgers. All interview shortlisting and job offers remain entirely at the sole discretion of independent prospective employers based on individual candidate merit, live technical interviews, and market requirements. RoleNest does not sell job placements.
          </p>
        </div>
      </div>

      {/* CASHFREE PAYMENT GATEWAY & SECURE BILLING DISCLOSURES */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-white text-base">
          <CreditCard className="h-5 w-5 text-emerald-400" />
          <span>Payment Processing &amp; Billing Security</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          All program enrollment fees (including discounted student tuition of ₹499) are processed securely through <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-licensed and regulated Payment Aggregator.
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
          <li>RoleNest never stores or logs debit/credit card numbers, CVVs, or NetBanking credentials on its servers.</li>
          <li>All transaction data is transmitted over bank-grade 256-bit TLS encrypted tunnels compliant with PCI-DSS Level 1.</li>
          <li>Instant electronic GST invoices and tax receipts are issued to the student's registered email upon successful enrollment.</li>
        </ul>
      </div>

      {/* REFUND & CANCELLATION POLICY */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-white text-base">
            <FileCheck2 className="h-5 w-5 text-teal-400" />
            <span>7-Day Student Satisfaction &amp; Refund Policy</span>
          </div>
          <Link
            href="/refund"
            className="text-xs text-emerald-400 hover:underline font-bold"
          >
            Detailed Refund Policy &rarr;
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          We want every student to learn with total confidence. We maintain a transparent 7-Day Money-Back Guarantee:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400">
          <li>
            <strong className="text-white">Full Refund Window:</strong> If a student is unsatisfied with the curriculum or practical labs before completing Week 1, they may submit a refund request within 7 calendar days of enrollment.
          </li>
          <li>
            <strong className="text-white">Non-Refundable Milestones:</strong> Once a student submits their final capstone project or receives an official verified Certificate ID ledger registration, the tuition fee becomes non-refundable, as cryptographic ledger registration and faculty mentor assessment resources are irreversibly committed.
          </li>
          <li>
            <strong className="text-white">Process:</strong> Refund requests can be initiated by writing to <span className="text-emerald-400 font-mono">refunds@rolenest.in</span> with the order reference. Approved refunds are credited back to the original source payment method within 5–7 business days.
          </li>
        </ul>
      </div>

      {/* AICTE / UGC ACADEMIC CREDITS DISCLOSURE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-white text-base">
          <GraduationCap className="h-5 w-5 text-purple-400" />
          <span>Academic Credit Equivalency &amp; University Recognition</span>
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            RoleNest curricula are mapped to the <strong>AICTE Internship Policy</strong> and the <strong>National Credit Framework (NCrF)</strong> under the National Education Policy (NEP 2020), which recommends 1 credit per 30–40 hours of structured industrial lab internship work.
          </p>
          <p className="text-slate-400 text-xs">
            While RoleNest provides formal verifiable letters of recommendation, complete syllabus breakdowns, and certified assessment reports, the final award of semester credits is subject to the specific rules and academic council approval of the student's affiliated university or college.
          </p>
        </div>
      </div>

      {/* DPDP ACT 2023 & STUDENT DATA PROTECTION */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
        <div className="flex items-center gap-2.5 font-bold text-white text-base">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>Student Data Privacy &amp; Cryptographic Ledger Security</span>
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Under the Indian Digital Personal Data Protection (DPDP) Act 2023:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>We collect student educational details (name, university, roll number, GitHub repository) solely for issuing authentic credentials and verifying college lab records.</li>
            <li>We never sell or rent student contact numbers or personal information to third-party telemarketers or external coaching institutes.</li>
            <li>Students retain the right to request deletion or modification of their personal profile by emailing <span className="text-emerald-400 font-mono">privacy@rolenest.in</span>.</li>
          </ul>
        </div>
      </div>

      {/* CONTACT & GRIEVANCE OFFICER */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-white block">
            Grievance Redressal &amp; Student Support Officer
          </span>
          <p className="text-slate-400 text-[11px]">
            RoleNest Technical Education &amp; Verification Board • Bengaluru, Karnataka, India
          </p>
          <span className="text-emerald-400 font-mono block">
            grievance@rolenest.in • internships@rolenest.in
          </span>
        </div>

        <Link
          href="/"
          className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Return to Programs</span>
          <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
        </Link>
      </div>

    </div>
  );
}
