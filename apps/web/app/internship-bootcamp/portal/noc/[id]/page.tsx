import { notFound } from "next/navigation";
import Link from "next/link";
import { db, bootcampEnrollments, eq } from "@repo/database";
import { getBootcampTrackBySlug, BOOTCAMP_TRACKS } from "@/lib/bootcamp-data";
import { PrintButton } from "@/components/bootcamp/print-button";
import { ShieldCheck, GraduationCap, ArrowLeft, Award, FileText, CheckCircle2, Building2, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Official College NOC & Academic Credit Recommendation | RoleNest Virtual Labs",
  description: "Official Institutional No Objection Certificate (NOC) and AICTE/UGC Credit Approval Packet.",
};

export default async function NocLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = await params;
  const enrollmentId = unwrappedParams.id;

  let enrollment = null;

  try {
    const records = await db
      .select()
      .from(bootcampEnrollments)
      .where(eq(bootcampEnrollments.id, enrollmentId))
      .limit(1);

    if (records.length > 0) {
      enrollment = records[0];
    } else {
      const byNoc = await db
        .select()
        .from(bootcampEnrollments)
        .where(eq(bootcampEnrollments.nocLetterId, enrollmentId.toUpperCase()))
        .limit(1);
      if (byNoc.length > 0) {
        enrollment = byNoc[0];
      }
    }
  } catch (err) {
    console.error("DB error fetching NOC:", err);
  }

  // Fallback demo specimen
  if (!enrollment) {
    if (enrollmentId.toLowerCase() === "demo" || enrollmentId.startsWith("RN-NOC")) {
      enrollment = {
        id: "demo",
        studentName: "John Dao",
        studentEmail: "john.dao@example.com",
        studentPhone: "+91 98765 43210",
        collegeName: "Apex Institute of Engineering & Technology",
        degreeBranch: "B.Tech Computer Science & Engineering",
        rollNumber: "2022-CSE-1042",
        trackId: "ai-ml",
        offerLetterId: "RN-OFFER-2026-AIML-9F2B84",
        nocLetterId: enrollmentId.startsWith("RN-NOC") ? enrollmentId : "RN-NOC-2026-AIML-9F2B84",
        enrolledAt: new Date(),
        amountPaid: 499,
        status: "ACTIVE",
      } as any;
    } else {
      notFound();
    }
  }

  const track = getBootcampTrackBySlug(enrollment.trackId) || BOOTCAMP_TRACKS[0];
  const issueDateFormatted = new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isRevoked = enrollment.status === "REVOKED" || enrollment.status === "REFUNDED" || enrollment.status === "CANCELLED";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6 print:m-0 print:p-0 print:max-w-none print:w-full print:space-y-4">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* ACTION BAR (HIDDEN IN PRINT) */}
      <div className="flex items-center justify-between print:hidden border-b border-slate-800 pb-4">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-bold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Student Portal
        </Link>
        <div className="flex items-center gap-3">
          {isRevoked ? (
            <span className="rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-black text-xs px-4 py-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Document Revoked &amp; Invalidated</span>
            </span>
          ) : (
            <PrintButton label="Download / Print College NOC Letter PDF" />
          )}
        </div>
      </div>

      {/* SAMPLE SPECIMEN NOTICE IF DEMO */}
      {enrollment.id === "demo" && (
        <div className="print:hidden rounded-2xl bg-purple-500/10 border border-purple-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-200">
          <div>
            <span className="font-bold block text-purple-300">⚠️ Sample NOC Specimen (Not Enrolled)</span>
            <span>This is a demonstration preview. Complete enrollment in any industrial track to issue your official college NOC with your college name and roll number.</span>
          </div>
          <Link
            href="/#tracks"
            className="rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs px-4 py-2 shrink-0 transition-colors shadow-md"
          >
            Enroll in a Track &rarr;
          </Link>
        </div>
      )}

      {/* PRINTABLE DOCUMENT BODY */}
      <div className="rounded-3xl border border-slate-200 bg-white text-slate-900 p-8 sm:p-14 shadow-2xl space-y-6 font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:w-full relative overflow-hidden">
        
        {isRevoked && (
          <div className="rounded-2xl bg-red-600 text-white p-5 border-4 border-red-800 text-center space-y-2 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-black uppercase tracking-wider">
              <AlertTriangle className="h-5 w-5" />
              <span>OFFICIAL NOTICE: DOCUMENT REVOKED &amp; CANCELLED</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold max-w-2xl mx-auto leading-relaxed text-red-50">
              This College NOC (Ref: <strong>{enrollment.nocLetterId}</strong>) issued for <strong>{enrollment.studentName}</strong> has been officially <strong>CANCELLED, REVOKED, AND VOIDED</strong> due to payment reversal / refund / non-completion.
            </p>
            <p className="text-[11px] text-red-200 font-mono">
              VERIFICATION ALERT: University registrars, HODs, and Placement Officers verifying this reference ID are formally notified that this candidate does not hold valid AICTE industrial credits under RoleNest Virtual Labs.
            </p>
          </div>
        )}
        
        {/* LETTERHEAD */}
        <div className="print-avoid-break flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4 font-sans">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-purple-950 flex items-center justify-center text-white font-black text-xl">
              RN
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950">
                RoleNest Virtual Engineering Labs
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Academic Liaison &amp; Institutional Accreditation Cell
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                AICTE Model Internship Framework • UGC National Credit Framework (NCrF) Compliant
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right font-mono text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">NOC REF: {enrollment.nocLetterId}</div>
            <div>Date: {issueDateFormatted}</div>
            <div className="text-purple-700 font-bold">4 Credits / 160 Hours Recommended</div>
          </div>
        </div>

        {/* ADDRESSEE BLOCK */}
        <div className="print-avoid-break text-xs font-sans leading-relaxed text-slate-800 space-y-1 bg-purple-50/60 p-4 rounded-xl border border-purple-200">
          <div className="font-bold text-slate-950 text-sm">To,</div>
          <div className="font-bold text-slate-900">{enrollment.nocAddressee || "The Head of Department (HOD) / Training & Placement Officer (TPO)"}</div>
          <div>{enrollment.degreeBranch.toLowerCase().startsWith("department") ? enrollment.degreeBranch : `Department of ${enrollment.degreeBranch}`}</div>
          <div className="font-extrabold text-slate-950">{enrollment.collegeName}</div>
          {enrollment.semesterYear && (
            <div className="text-[11px] text-purple-900 font-semibold">Academic Standing: {enrollment.semesterYear}</div>
          )}
        </div>

        {/* SUBJECT */}
        <div className="font-sans text-sm font-black text-slate-950 uppercase tracking-wide border-l-4 border-purple-600 pl-3 py-1">
          Subject: Institutional No Objection Certificate (NOC) &amp; Recommendation for Grant of 4 Academic Credits (160 Hours Industrial Internship)
        </div>

        {/* BODY */}
        <div className="text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4 text-justify font-sans">
          <p>
            Respected Sir/Madam,
          </p>
          <p>
            This official communication certifies that your bonafide student, <strong>{enrollment.studentName}</strong> (Roll No: <strong>{enrollment.rollNumber}</strong>, {enrollment.semesterYear ? `${enrollment.semesterYear}, ` : ""}{enrollment.degreeBranch.toLowerCase().startsWith("department") ? enrollment.degreeBranch : `Department of ${enrollment.degreeBranch}`}), has been enrolled in the <strong>{track.title}</strong> hosted by <strong>RoleNest Virtual Engineering Labs</strong>.
          </p>
          <p>
            This virtual internship complies with the statutory norms prescribed in the <strong>AICTE Internship Policy: Guidelines &amp; Procedures</strong> and the <strong>UGC National Credit Framework (NCrF)</strong> for technical education institutions:
          </p>

          {/* COMPLIANCE CHECKLIST */}
          <div className="print-avoid-break rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50 font-sans text-xs">
            <div className="font-bold text-slate-950 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>University Academic Compliance Verification</span>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-950">• 160 Total Practical Work Hours:</span>
                <span>Divided over {track.durationWeeks} calendar weeks of structured engineering tasks, matching AICTE 4-credit workload criteria.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-950">• Rigorous GitHub Repository Telemetry:</span>
                <span>All software deliverables, unit test suites, and capstone source code are pushed daily to public version control repositories for faculty audit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-950">• Real Open Source Contribution:</span>
                <span>Students contribute to public open source infrastructure (RitualDev-Lab/DevShelf) with verified pull requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-950">• Cryptographic Ledger Authentication:</span>
                <span>Upon successful completion, an official Certificate of Industrial Internship with a SHA-256 verification hash and public ledger link will be provided.</span>
              </li>
            </ul>
          </div>

          <p>
            We formally request your esteemed institution to issue institutional approval / No Objection Certificate (NOC) and sanction <strong>4 Academic Credits</strong> towards the student&apos;s curriculum requirements for industrial training / semester internship.
          </p>
          <p>
            For any queries or faculty verification, the college administration may verify this document using Reference ID <strong>{enrollment.nocLetterId}</strong> at <strong>https://internship.rolenest.in/portal/noc/{enrollment.id}</strong> or email <strong>internships@rolenest.in</strong>.
          </p>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="print-avoid-break pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 font-sans text-xs">
          <div className="space-y-2">
            <div className="font-serif italic text-lg text-slate-900">Dr. Aryan Verma</div>
            <div className="font-bold text-slate-950">Dr. Aryan Verma, Ph.D.</div>
            <div className="text-slate-600 text-[11px]">Academic Dean &amp; Systems Education Lead</div>
            <div className="text-slate-500 text-[10px]">RoleNest Virtual Engineering Labs</div>
          </div>

          <div className="space-y-2 text-right">
            <div className="font-bold text-slate-950">Institutional Endorsement</div>
            <div className="text-slate-600 text-[11px]">Affiliated with RitualDev Lab Research Division</div>
            <div className="text-slate-500 text-[10px]">Valid for AICTE / UGC Semester Credit Allocation</div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 text-center font-mono text-[10px] text-slate-500 space-y-1 font-sans">
          <div>Document Verification Reference: {enrollment.nocLetterId} • RoleNest Academic Registry</div>
          <div className="text-purple-700 font-bold">OFFICIALLY ISSUED TO {enrollment.collegeName.toUpperCase()}</div>
        </div>

      </div>

    </div>
  );
}
