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
  AlertTriangle,
  Lock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Refund, Cancellation & Institutional Credential Invalidation Policy | RoleNest Virtual Labs",
  description:
    "Official refund terms, digital document non-refundability, and institutional credential invalidation policy for RoleNest 4-week industrial engineering internships.",
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
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Institutional Accreditation &amp; Payment Safeguard Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Refund, Cancellation &amp; Invalidation Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Effective: 2026 Batch • Legally binding terms governing industrial internship admissions, academic documents, and payment chargebacks.
        </p>
      </div>

      {/* CORE SAFEGUARD HIGHLIGHT BOX */}
      <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black block">
              Digital Academic Document Issuance Rule
            </span>
            <h2 className="text-lg font-black text-white">
              Instant Document Generation &amp; Non-Refundable Fee Notice
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Upon completing registration, an official verifiable <strong>Letter of Appointment</strong> and an institutional <strong>College No Objection Certificate (NOC)</strong> customized to your Head of Department (HOD) and College with unique cryptographic reference IDs are instantly generated and permanently logged in our academic ledger. In accordance with applicable Indian consumer and digital goods regulations, <strong>internship enrollment fees are strictly non-refundable once academic letters are issued, viewed, or downloaded</strong>.
        </p>
      </div>

      {/* POLICY CLAUSES */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* CLAUSE 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            <span>1. Non-Refundability of Issued Academic Documents</span>
          </h3>
          <p>
            The subsidized registration fee (e.g. ₹499) directly covers institutional liaison overhead, automated verification hashing, live compiler sandbox provisioning, and formal academic documentation under AICTE/UGC model credit frameworks.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400">
            <li>Once an applicant confirms enrollment and their customized <strong>Offer Letter ID</strong> (e.g., <code>RN-OFFER-2026-...</code>) and <strong>College NOC Reference ID</strong> (e.g., <code>RN-NOC-2026-...</code>) are generated in the student portal, <strong>no refunds will be granted under any circumstance</strong>.</li>
            <li>Claims such as &ldquo;my college did not accept the NOC&rdquo;, &ldquo;I enrolled by mistake&rdquo;, or &ldquo;I want an offline internship&rdquo; do not qualify for a refund, as the institutional document creation and verification records are irrevocably committed to the database.</li>
          </ul>
        </div>

        {/* CLAUSE 2 */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/10 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span>2. Immediate Credential Revocation &amp; University Invalidation</span>
          </h3>
          <p className="text-slate-200">
            Any chargeback, unauthorized payment dispute filed through UPI apps (PhonePe, Google Pay, Paytm, CRED), netbanking dispute, or unauthorized reversal will trigger <strong>immediate and permanent revocation</strong> of all credentials:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-red-200/80">
            <li>The candidate&apos;s status on both the public verification portal and student portal is immediately updated to <strong>REVOKED / CANCELLED</strong>.</li>
            <li>Both the College NOC (<code>/portal/noc/[id]</code>) and Appointment Offer Letter (<code>/portal/offer-letter/[id]</code>) are visibly stamped with a bold red warning watermark declaring the document <strong>NULL, VOID &amp; FRAUDULENT</strong>.</li>
            <li>Any college faculty, HOD, or university auditor visiting the verification QR code or URL will see a prominent notice that the student is NOT an authorized intern and that credit sanction must be withheld.</li>
          </ul>
        </div>

        {/* CLAUSE 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal-400" />
            <span>3. Digital Telemetry &amp; Chargeback Audit Defense</span>
          </h3>
          <p>
            RoleNest Virtual Labs maintains forensic telemetry to safeguard against payment fraud and illegitimate chargebacks. For every enrollment, we record:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400">
            <li>Candidate IPv4/IPv6 address, ISP hostname, and precise UTC timestamps of payment and document generation.</li>
            <li>Digital acceptance logs of the mandatory Non-Refundable Document Agreement.</li>
            <li>Candidate session history, GitHub commit links submitted, and code execution telemetry.</li>
          </ul>
          <p className="text-xs text-slate-400 pt-1">
            In the event of an unjustified payment dispute, this complete audit dossier is automatically transmitted to our payment gateway partner (Cashfree Payments) and the candidate&apos;s issuing bank, alongside a formal fraud reporting notice.
          </p>
        </div>

        {/* CLAUSE 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>4. Limited Pre-Issuance Cancellation Window</span>
          </h3>
          <p>
            A refund may ONLY be considered under the following strict condition:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
            <li>The candidate was billed due to a duplicate transaction error, OR</li>
            <li>The candidate requests cancellation within <strong>two (2) hours of payment</strong> AND has <strong>not viewed, downloaded, or shared</strong> their Appointment Offer Letter or College NOC.</li>
          </ul>
          <p className="text-xs text-slate-400 pt-1">
            Eligible duplicate transaction refunds are processed back to the original UPI/card source within 5–7 banking days via Cashfree Payments.
          </p>
        </div>

        {/* CLAUSE 5 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-400" />
            <span>5. Institutional &amp; Billing Support</span>
          </h3>
          <p>
            For verified billing anomalies or university administration queries, contact our finance and institutional liaison desk:
          </p>
          <div className="rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-300 space-y-1 border border-slate-800">
            <div>Email: <a href="mailto:internships@rolenest.in" className="text-emerald-400 hover:underline">internships@rolenest.in</a></div>
            <div>Institutional Verification: <a href="mailto:accreditation@rolenest.in" className="text-purple-400 hover:underline">accreditation@rolenest.in</a></div>
            <div>Response SLA: Within 24 business hours</div>
          </div>
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
