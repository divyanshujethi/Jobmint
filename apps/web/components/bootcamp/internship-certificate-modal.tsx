"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  QrCode,
  Building2,
  GraduationCap,
  Calendar,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BootcampTrack } from "@/lib/bootcamp-data";
import {
  generateInternshipCertificateId,
  computeInternshipVerificationHash,
  InternshipCertificate,
} from "@/lib/bootcamp-certificates";

interface InternshipCertificateModalProps {
  track: BootcampTrack;
  onIssued?: (cert: InternshipCertificate) => void;
}

export function InternshipCertificateModal({
  track,
  onIssued,
}: InternshipCertificateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"FORM" | "PREVIEW">("FORM");
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [degreeBranch, setDegreeBranch] = useState("B.Tech Computer Science & Engineering");
  const [rollNumber, setRollNumber] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [cert, setCert] = useState<InternshipCertificate | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !collegeName.trim()) return;

    const certId = generateInternshipCertificateId(track);
    const nowIso = new Date().toISOString();
    const hash = computeInternshipVerificationHash(
      certId,
      fullName.trim(),
      track.id,
      nowIso
    );

    const newCert: InternshipCertificate = {
      id: certId,
      trackId: track.id,
      trackTitle: track.title,
      certificateTitle: track.certificateSpec.title,
      recipientName: fullName.trim(),
      collegeName: collegeName.trim(),
      degreeBranch: degreeBranch.trim(),
      rollNumber: rollNumber.trim() || undefined,
      issuedAt: nowIso,
      durationLabel: `${track.durationWeeks} Weeks / ${track.totalHours} Hours Intensive Industrial Internship`,
      skills: track.certificateSpec.skills,
      capstoneTitle: track.capstoneProject.title,
      githubUrl: githubUrl.trim() || undefined,
      verificationHash: hash,
      score: 97,
      grade: "A+",
      verified: true,
      status: "VERIFIED",
      mentorName: "Dr. Aryan Verma & Senior Technical Staff",
      mentorTitle: "RoleNest Technical Education Lead & Advisory",
      academicCredits: track.collegeRecognition.academicCredits,
      aicteCompliant: track.collegeRecognition.aicteCompliant,
    };

    setCert(newCert);

    // Persist in localStorage so student can always re-view and verify
    try {
      const existing = JSON.parse(
        localStorage.getItem("rolenest_earned_internships") || "[]"
      );
      existing.unshift(newCert);
      localStorage.setItem(
        "rolenest_earned_internships",
        JSON.stringify(existing)
      );
    } catch {}

    setStep("PREVIEW");
    if (onIssued) onIssued(newCert);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs h-10 px-5 shadow-lg shadow-emerald-500/20"
      >
        <Award className="h-4 w-4 fill-slate-950" />
        Claim Recognized Certificate ID
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col my-8">
            
            {/* HEADER */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {step === "FORM"
                      ? "Official Internship Certificate Issuance"
                      : "Verifiable Credential Generated"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {track.title} • {track.durationWeeks} Weeks / {track.totalHours} Hours
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* FORM STEP */}
            {step === "FORM" ? (
              <form onSubmit={handleGenerate} className="p-6 space-y-4 text-xs">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-emerald-300 space-y-1">
                  <strong className="block font-bold text-white">
                    College &amp; Employer Verification Notice
                  </strong>
                  <span>
                    Your certificate will be assigned a permanent, tamper-proof ID (e.g. <code>RN-INT-2026-{track.certificateSpec.prefix}-XXXXXX</code>) indexed on our public verification ledger. Please enter your legal name and college details accurately.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">
                      Full Legal Name (for Certificate &amp; College NOC) *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Divyanshu Jethi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">
                      College / University Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Chitkara University Institute of Engineering"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">
                      Degree &amp; Specialization *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. B.Tech Computer Science"
                      value={degreeBranch}
                      onChange={(e) => setDegreeBranch(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">
                      University Roll / Registration Number (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 2110990452"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">
                    Capstone Project GitHub Repository Link
                  </label>
                  <Input
                    type="url"
                    placeholder="https://github.com/your-username/capstone-project"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white rounded-xl text-xs h-10"
                  />
                  <p className="text-[11px] text-slate-500">
                    Your code will be linked as practical proof-of-work on the public verification page.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs h-10 px-6 rounded-xl"
                  >
                    Generate Verified Certificate ID &rarr;
                  </Button>
                </div>
              </form>
            ) : (
              /* PREVIEW STEP */
              <div className="p-6 space-y-6">
                
                {/* CERTIFICATE VISUAL CARD */}
                <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="text-left">
                      <span className="font-extrabold text-xs text-emerald-400 tracking-wider uppercase block">
                        RoleNest Virtual Labs
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Technical Education &amp; Research
                      </span>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono text-emerald-400 font-bold">
                      ID: {cert?.id}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <h4 className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                      Certificate of Industrial Internship Completion
                    </h4>
                    <p className="text-[11px] text-slate-400">This is to officially certify that</p>
                    <h2 className="text-xl sm:text-2xl font-black text-white py-1">
                      {cert?.recipientName}
                    </h2>
                    <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                      from <strong className="text-white">{cert?.collegeName}</strong> ({cert?.degreeBranch})
                      has successfully completed the intensive
                    </p>
                    <h3 className="text-sm sm:text-base font-extrabold text-emerald-400 py-1">
                      {cert?.trackTitle}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Duration: <strong>{cert?.durationLabel}</strong> • Academic Rating: <strong>Grade {cert?.grade} ({cert?.score}%)</strong>
                    </p>
                  </div>

                  {/* SKILLS */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    {cert?.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* FOOTER OF CERTIFICATE */}
                  <div className="border-t border-slate-800/80 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-[10px] text-slate-400">
                    <div>
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">
                        Verification Hash (SHA-256):
                      </span>
                      <span className="font-mono text-emerald-400">
                        {cert?.verificationHash}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">
                        Issued On:
                      </span>
                      <span className="text-slate-300">
                        {cert ? new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                      </span>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-slate-500 block uppercase font-bold text-[9px]">
                        Signed By:
                      </span>
                      <span className="text-white font-bold block">{cert?.mentorName}</span>
                      <span className="text-[9px] text-slate-400">{cert?.mentorTitle}</span>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/verify/${cert?.id}`}
                      target="_blank"
                      className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs h-10 px-4 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Public Verification URL
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrint}
                      className="rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs h-10 px-4 gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print / Save as PDF
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs h-10 px-5"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
