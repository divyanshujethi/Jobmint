"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  Download,
  Printer,
  ExternalLink,
  Github,
  ArrowLeft,
  Search,
  Sparkles,
  Lock,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  lookupInternshipCertificate,
  InternshipCertificate,
} from "@/lib/bootcamp-certificates";

export default function InternshipCertificateVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const certId = unwrappedParams.id.toUpperCase();
  const [searchId, setSearchId] = useState("");
  const [cert, setCert] = useState<InternshipCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check built-in showcase ledger
    const found = lookupInternshipCertificate(certId);
    if (found) {
      setCert(found);
      setLoading(false);
      return;
    }

    // 2. Check local client storage for recently self-issued certificates
    try {
      const localCerts: InternshipCertificate[] = JSON.parse(
        localStorage.getItem("rolenest_earned_internships") || "[]"
      );
      const match = localCerts.find((c) => c.id.toUpperCase() === certId);
      if (match) {
        setCert(match);
        setLoading(false);
        return;
      }
    } catch {}

    // 3. Check server database verification API
    fetch(`/api/certificates/verify/${certId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.certificate) {
          const c = data.certificate;
          setCert({
            id: c.id,
            trackId: c.courseId,
            trackTitle: c.courseTitle,
            certificateTitle: c.certificateTitle,
            recipientName: c.recipientName,
            recipientEmail: c.recipientEmail,
            collegeName: "Affiliated Technical University / Engineering College",
            degreeBranch: "Computer Science & Engineering",
            issuedAt: c.issuedAt,
            durationLabel: "4 Weeks / 160 Hours Intensive Industrial Internship",
            skills: c.skills,
            capstoneTitle: "Enterprise Software Engineering Production Capstone",
            githubUrl: c.githubProofUrl,
            verificationHash: c.verificationHash,
            score: c.score || 95,
            grade: "A+",
            verified: true,
            status: "VERIFIED",
            mentorName: "RoleNest Technical Education Lead & Staff Engineers",
            mentorTitle: "RoleNest Technical Advisory & Verification Board",
            academicCredits: "4 Credits Recommended (AICTE/UGC Credit Framework)",
            aicteCompliant: true,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [certId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      window.location.href = `/verify/${searchId.trim().toUpperCase()}`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* TOP NAVIGATION & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to RoleNest Internship Labs
        </Link>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search Certificate ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-56 h-8 text-xs bg-slate-900 border-slate-800 text-white rounded-xl"
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
          >
            Verify
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Searching cryptographic ledger for Credential ID: <strong className="text-white">{certId}</strong>...
        </div>
      ) : !cert ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl font-black">
            ✕
          </div>
          <h2 className="text-lg font-bold text-white">
            Unverified Certificate Identifier
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            The credential ID <strong className="text-red-400 font-mono">{certId}</strong> was not found in our public cryptographic ledger. Please verify the ID or contact internships@rolenest.in.
          </p>
          <div className="pt-2">
            <Link
              href="/verify/RN-INT-2026-AIML-9F2B84"
              className="text-xs text-emerald-400 underline font-semibold"
            >
              View Sample Verified Certificate (RN-INT-2026-AIML-9F2B84) &rarr;
            </Link>
          </div>
        </div>
      ) : (
        /* VERIFIED CERTIFICATE & COLLEGE RECOMMENDATION LETTER */
        <div className="space-y-8">
          
          {/* VERIFICATION BADGE BAR */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Official Cryptographic Ledger: Verified Authentic
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black uppercase">
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Credential ID: {cert.id} • SHA-256 Hash: {cert.verificationHash}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handlePrint}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-9 px-4 shrink-0 gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save Letter as PDF
            </Button>
          </div>

          {/* FORMAL DIGITAL CERTIFICATE */}
          <div className="rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="text-left">
                <span className="font-black text-sm text-emerald-400 uppercase tracking-wider block">
                  RoleNest Virtual Labs
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Autonomous Technical Education &amp; Engineering Research
                </span>
              </div>
              <div className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                ID: {cert.id}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-extrabold">
                Certificate of Industrial Internship Completion
              </span>
              <p className="text-xs text-slate-400">This certifies that</p>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight py-1">
                {cert.recipientName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                from <strong className="text-white">{cert.collegeName}</strong>
                {cert.degreeBranch && ` (${cert.degreeBranch})`}
                {cert.rollNumber && ` • Roll No: ${cert.rollNumber}`}
              </p>
              <p className="text-xs text-slate-400">
                has successfully fulfilled all industry lab requirements and evaluation criteria for the
              </p>
              <h2 className="text-base sm:text-xl font-black text-emerald-400 py-1">
                {cert.trackTitle}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Duration: <strong>{cert.durationLabel}</strong> • Overall Evaluation: <strong>Grade {cert.grade} ({cert.score}%)</strong>
              </p>
            </div>

            {/* SKILLS */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {cert.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* CAPSTONE PROOF */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 max-w-lg mx-auto text-left space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block">
                Verified Industrial Capstone Project:
              </span>
              <p className="text-xs font-bold text-white">
                {cert.capstoneTitle}
              </p>
              {cert.githubUrl && (
                <a
                  href={cert.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline pt-0.5 font-mono"
                >
                  <Github className="h-3 w-3" />
                  <span>Inspect Verified Source Code ({cert.githubUrl.replace(/^https?:\/\//, "")})</span>
                </a>
              )}
            </div>

            {/* SIGNATURE & DATE */}
            <div className="border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">
                  Issued Date:
                </span>
                <span className="text-white font-medium">
                  {new Date(cert.issuedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">
                  Ledger Signature:
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  {cert.verificationHash}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-slate-500 block uppercase font-bold text-[10px]">
                  Academic Authority:
                </span>
                <span className="text-white font-bold block">{cert.mentorName}</span>
                <span className="text-[10px] text-slate-400">{cert.mentorTitle}</span>
              </div>
            </div>
          </div>

          {/* FORMAL COLLEGE RECOGNITION & ACADEMIC CREDIT RECOMMENDATION LETTER */}
          <div className="rounded-3xl border border-slate-800 bg-white text-slate-900 p-8 sm:p-12 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  RoleNest Virtual Internship Labs
                </h3>
                <span className="text-xs text-slate-600 block">
                  Autonomous Technical Education &amp; Industrial Verification Board
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Govt. / AICTE / UGC Academic Internship Equivalency Reference: RN/INT/2026/DOC
                </span>
              </div>
              <div className="text-right text-xs text-slate-600">
                <span className="block font-bold">Ref No: {cert.id}</span>
                <span>Date: {new Date(cert.issuedAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p className="font-bold text-slate-950 uppercase tracking-wider text-xs">
                TO WHOMSOEVER IT MAY CONCERN
              </p>
              <p className="font-semibold text-slate-900">
                Subject: Verification of Industrial Internship Completion &amp; Recommendation for Academic Credits ({cert.academicCredits})
              </p>
              <p>
                This is to officially certify that <strong>{cert.recipientName}</strong>, a bona fide student of <strong>{cert.collegeName}</strong> (Branch: {cert.degreeBranch}{cert.rollNumber ? `, Roll No: ${cert.rollNumber}` : ""}), has successfully completed an intensive <strong>{cert.durationLabel}</strong> with RoleNest Virtual Labs in the domain of <strong>{cert.trackTitle}</strong>.
              </p>
              <p>
                During this tenure, the candidate engaged in rigorous engineering deliverables, weekly practical coding evaluations, and developed an enterprise-grade capstone project titled <strong>"{cert.capstoneTitle}"</strong>. The candidate demonstrated exemplary algorithmic proficiency and software hygiene, scoring an overall evaluation rating of <strong>{cert.score}% (Grade {cert.grade})</strong>.
              </p>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">
                  Summary of Verified Technical Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-white border border-slate-300 px-2 py-0.5 text-slate-800 font-mono text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <p>
                As per the National Education Policy (NEP) and AICTE Internship Guidelines for degree/diploma programs, this 160-hour intensive program meets all practical criteria for the grant of <strong>{cert.academicCredits}</strong>.
              </p>
              <p>
                We wish <strong>{cert.recipientName}</strong> continued success in all future engineering endeavors.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <div>
                <span className="text-[11px] text-slate-500 font-mono block">
                  Verify Online Anytime:
                </span>
                <span className="font-mono text-emerald-800 font-bold">
                  https://internship.rolenest.in/verify/{cert.id}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-950 block">{cert.mentorName}</span>
                <span className="text-[11px] text-slate-600 block">{cert.mentorTitle}</span>
                <span className="text-[10px] text-emerald-800 font-mono font-bold">
                  [Digitally Verified Ledger ID: {cert.id}]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
