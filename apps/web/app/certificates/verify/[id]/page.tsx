"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  Github,
  ArrowLeft,
  Sparkles,
  Lock,
  Search,
  BookOpen,
  Printer,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { lookupCertificate, CourseCertificate } from "@/lib/certificates-issuer";

export default function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const certId = unwrappedParams.id;
  const [searchId, setSearchId] = useState("");

  const cert: CourseCertificate | null = lookupCertificate(certId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      window.location.href = `/certificates/verify/${searchId.trim().toUpperCase()}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Courses &amp; Certifications
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> JobMint Public Credential Registry
          </div>
        </div>

        {/* SEARCH BAR TO VERIFY ANY CERTIFICATE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Enter Certificate ID (e.g. JM-AI-GPT-7B29A1)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10 bg-slate-950 border-slate-800 text-sm text-white placeholder:text-slate-500 h-10 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl shrink-0"
            >
              Verify Credential
            </Button>
          </form>
        </div>

        {/* VERIFICATION RESULT */}
        {cert ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/90 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="h-48 w-48 text-emerald-400" />
            </div>

            {/* STATUS HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" /> Authenticated &amp; Valid Credential
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    Verified JobMint Certificate
                  </h1>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Certificate ID
                </span>
                <span className="font-mono text-base font-bold text-emerald-400">
                  {cert.id}
                </span>
              </div>
            </div>

            {/* CANDIDATE & CREDENTIAL DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-4 rounded-2xl bg-slate-950/60 border border-slate-800 p-5">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Issued to Candidate
                  </div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {cert.recipientName}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Credential Awarded
                  </div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {cert.certificateTitle}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Course: {cert.courseTitle}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Issuance Authority &amp; Attestation
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {cert.creatorAttribution}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl bg-slate-950/60 border border-slate-800 p-5">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Issue Date
                  </div>
                  <div className="text-sm font-mono text-white mt-0.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    {new Date(cert.issuedAt).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Cryptographic HMAC Checksum
                  </div>
                  <div className="text-xs font-mono text-slate-300 break-all bg-slate-900 border border-slate-800 rounded p-1.5 mt-1">
                    {cert.verificationHash}
                  </div>
                </div>

                {cert.githubProofUrl && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      Proof-of-Work Code Repository
                    </div>
                    <a
                      href={cert.githubProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1.5 mt-1"
                    >
                      <Github className="h-3.5 w-3.5" />
                      {cert.githubProofUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* VERIFIED SKILLS */}
            <div className="space-y-2 relative z-10">
              <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                Validated Skills &amp; Competencies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-mono text-slate-200"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* DPDP ACT PRIVACY STATEMENT */}
            <div className="rounded-2xl bg-blue-950/30 border border-blue-500/20 p-4 text-xs text-slate-300 space-y-1 relative z-10">
              <div className="font-bold text-blue-400 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Indian DPDP Act 2023 &amp; Data Minimization Compliance
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This verification page provides strictly authenticated technical achievement data. Under the Digital Personal Data Protection (DPDP) Act 2023, the student&apos;s contact details, phone numbers, and full resume are protected and withheld from public exposure.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 relative z-10">
              <Link
                href={`/courses/${cert.courseId}/certificate?name=${encodeURIComponent(cert.recipientName)}`}
              >
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-lg">
                  <Printer className="h-3.5 w-3.5" />
                  View Printable Diploma &amp; Certificate
                </Button>
              </Link>

              <Link href="/courses">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs gap-1 rounded-xl"
                >
                  Explore All JobMint Curricula
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

          </div>
        ) : (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-950/10 p-8 text-center space-y-4">
            <XCircle className="h-12 w-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">
              Certificate Not Found
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No verified certificate was found matching ID: <strong className="text-rose-400 font-mono">{certId}</strong>. Please check the ID or verify using the search bar above.
            </p>
            <Link href="/courses">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl mt-2">
                Browse Available Courses
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
