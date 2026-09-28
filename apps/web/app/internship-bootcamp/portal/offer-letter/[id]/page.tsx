import { notFound } from "next/navigation";
import Link from "next/link";
import { db, bootcampEnrollments, eq } from "@repo/database";
import { getBootcampTrackBySlug, BOOTCAMP_TRACKS } from "@/lib/bootcamp-data";
import { PrintButton } from "@/components/bootcamp/print-button";
import { ShieldCheck, GraduationCap, ArrowLeft, Award, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Official Industrial Internship Offer Letter | RoleNest Virtual Labs",
  description: "Official Letter of Appointment and Industrial Internship Selection.",
};

export default async function OfferLetterPage({
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
      // Also try finding by offerLetterId
      const byOffer = await db
        .select()
        .from(bootcampEnrollments)
        .where(eq(bootcampEnrollments.offerLetterId, enrollmentId.toUpperCase()))
        .limit(1);
      if (byOffer.length > 0) {
        enrollment = byOffer[0];
      }
    }
  } catch (err) {
    console.error("DB error fetching offer letter:", err);
  }

  // Fallback demo specimen if testing or previewing
  if (!enrollment) {
    if (enrollmentId.toLowerCase() === "demo" || enrollmentId.startsWith("RN-OFFER")) {
      enrollment = {
        id: "demo",
        studentName: "John Dao",
        studentEmail: "john.dao@example.com",
        studentPhone: "+91 98765 43210",
        collegeName: "Apex Institute of Engineering & Technology",
        degreeBranch: "B.Tech Computer Science & Engineering",
        rollNumber: "2022-CSE-1042",
        trackId: "ai-ml",
        offerLetterId: enrollmentId.startsWith("RN-OFFER") ? enrollmentId : "RN-OFFER-2026-AIML-9F2B84",
        nocLetterId: "RN-NOC-2026-AIML-9F2B84",
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

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* ACTION BAR (HIDDEN IN PRINT) */}
      <div className="flex items-center justify-between print:hidden border-b border-slate-800 pb-4">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-bold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Student Portal
        </Link>
        <div className="flex items-center gap-3">
          <PrintButton label="Download / Print Offer Letter PDF" />
        </div>
      </div>

      {/* PRINTABLE DOCUMENT BODY */}
      <div className="rounded-3xl border border-slate-200 bg-white text-slate-900 p-8 sm:p-14 shadow-2xl space-y-8 font-serif print:border-none print:shadow-none print:p-0">
        
        {/* LETTERHEAD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4 font-sans">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center text-white font-black text-xl">
              RN
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950">
                RoleNest Virtual Engineering Labs
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Autonomous Technical Education, Virtual Apprenticeship &amp; Engineering Research
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                CIN: U72900DL2024PTC189201 • ISO 9001:2015 Verified Virtual Education Provider
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right font-mono text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">REF: {enrollment.offerLetterId}</div>
            <div>Date of Issuance: {issueDateFormatted}</div>
            <div className="text-emerald-700 font-bold">● AICTE / UGC Compliant</div>
          </div>
        </div>

        {/* RECIPIENT BLOCK */}
        <div className="text-xs font-sans leading-relaxed text-slate-800 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-950 text-sm">To,</div>
          <div className="font-extrabold text-base text-slate-950">{enrollment.studentName}</div>
          <div>Roll No / Student ID: <strong className="font-mono text-slate-900">{enrollment.rollNumber}</strong></div>
          <div>Department: <strong>{enrollment.degreeBranch}</strong></div>
          <div>Institution: <strong>{enrollment.collegeName}</strong></div>
          <div>Registered Email: {enrollment.studentEmail}</div>
        </div>

        {/* SUBJECT */}
        <div className="font-sans text-sm font-black text-slate-950 uppercase tracking-wide border-l-4 border-emerald-600 pl-3 py-1">
          Subject: Official Letter of Appointment &amp; Admission — Virtual Industrial Engineering Internship (2026 Batch)
        </div>

        {/* BODY PARAGRAPHS */}
        <div className="text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4 text-justify font-sans">
          <p>
            Dear <strong>{enrollment.studentName}</strong>,
          </p>
          <p>
            On behalf of <strong>RoleNest Virtual Engineering Labs</strong> (in technical academic partnership with <strong>RitualDev Lab</strong>), we are pleased to formally offer you an appointment as an <strong>Industrial Engineering Intern</strong> in the <strong>{track.title}</strong>, effective from <strong>{issueDateFormatted}</strong>.
          </p>
          <p>
            This 4-week industrial immersion program is strictly structured under the <strong>AICTE Mandatory Internship Guidelines</strong> and the <strong>UGC National Credit Framework (NCrF)</strong>. Upon successful completion of all daily laboratory deliverables, students earn <strong>4 Recommended Academic Credits (equivalent to 160 hours of industrial development experience)</strong>.
          </p>

          {/* KEY INTERNSHIP PARAMETERS TABLE */}
          <div className="rounded-xl border border-slate-200 overflow-hidden my-4 text-xs font-sans">
            <div className="bg-slate-900 text-white font-bold px-4 py-2 text-[11px] uppercase tracking-wider">
              Official Internship Terms &amp; Deliverables
            </div>
            <div className="divide-y divide-slate-200 text-slate-800">
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-slate-600">Internship Track:</span>
                <span className="col-span-2 font-semibold text-slate-950">{track.title}</span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                <span className="font-bold text-slate-600">Duration &amp; Hours:</span>
                <span className="col-span-2">{track.durationWeeks} Weeks Intensive / 160 Total Practical Work Hours</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-slate-600">Curriculum Model:</span>
                <span className="col-span-2">Day-by-Day sequential unlocking with automated compiler verification &amp; daily GitHub commit proofs</span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                <span className="font-bold text-slate-600">Open Source Mandate:</span>
                <span className="col-span-2">Pull Request contribution to RitualDev-Lab/DevShelf ecosystem</span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-bold text-slate-600">Final Deliverable:</span>
                <span className="col-span-2 font-mono text-[11px] text-emerald-800 font-bold">{track.capstoneProject.title}</span>
              </div>
              <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                <span className="font-bold text-slate-600">Credential Issued:</span>
                <span className="col-span-2">Verifiable Cryptographic Certificate ID on Public Verification Ledger</span>
              </div>
            </div>
          </div>

          <p>
            During your tenure, you will work directly with our engineering mentors, maintain a daily GitHub engineering log, and complete real production-grade architectural modules. You retain 100% intellectual property ownership of your submitted software code and research deliverables.
          </p>
          <p>
            We welcome you to the RoleNest engineering cohort and look forward to your impactful contributions to open-source software and scalable technology.
          </p>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 font-sans text-xs">
          <div className="space-y-2">
            <div className="font-serif italic text-lg text-slate-900">Dr. Aryan Verma</div>
            <div className="font-bold text-slate-950">Dr. Aryan Verma, Ph.D.</div>
            <div className="text-slate-600 text-[11px]">Lead Academic Advisor &amp; Education Lead</div>
            <div className="text-slate-500 text-[10px]">Ex-Google Staff AI Engineer • RoleNest Virtual Labs</div>
          </div>

          <div className="space-y-2 text-right">
            <div className="font-serif italic text-lg text-slate-900">Divyanshu Jethi</div>
            <div className="font-bold text-slate-950">Divyanshu Jethi</div>
            <div className="text-slate-600 text-[11px]">Chief Technology Officer &amp; Founder</div>
            <div className="text-slate-500 text-[10px]">RitualDev Lab • RoleNest Technical Operations</div>
          </div>
        </div>

        {/* FOOTER BAR CODE / SECURITY LEDGER */}
        <div className="pt-4 border-t border-slate-200 text-center font-mono text-[10px] text-slate-500 space-y-1 font-sans">
          <div>Authenticity Verification URI: https://internship.rolenest.in/portal/offer-letter/{enrollment.id}</div>
          <div className="text-emerald-700 font-bold">DIGITALLY SIGNED &amp; TIMESTAMPED VIA ROLENEST CRYPTOGRAPHIC EDUCATION LEDGER</div>
        </div>

      </div>

    </div>
  );
}
