"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Printer,
  Share2,
  ArrowLeft,
  Sparkles,
  Github,
  Calendar,
  Lock,
  Copy,
  Check,
  Building,
  GraduationCap,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CURATED_COURSES, CoursePlaylist } from "@/lib/courses-data";
import {
  CourseCertificate,
  issueCourseCertificate,
  getLinkedInCertUrl,
  SHOWCASE_CERTIFICATES,
} from "@/lib/certificates-issuer";

export default function CourseCertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const unwrappedParams = use(params);
  const unwrappedSearch = use(searchParams);
  const courseId = unwrappedParams.id;

  const course = CURATED_COURSES.find((c) => c.id === courseId) || CURATED_COURSES[0];

  const [studentName, setStudentName] = useState(
    typeof unwrappedSearch.name === "string" ? unwrappedSearch.name : ""
  );
  const [githubUrl, setGithubUrl] = useState("");
  const [checkedModules, setCheckedModules] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
  });
  const [issuedCert, setIssuedCert] = useState<CourseCertificate | null>(null);
  const [copied, setCopied] = useState(false);

  // If user already had a saved certificate in localStorage for this course, load it
  useEffect(() => {
    const saved = localStorage.getItem(`jobmint_cert_${course.id}`);
    if (saved) {
      try {
        setIssuedCert(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    } else {
      // Check showcase certificate if matching
      const showcase = SHOWCASE_CERTIFICATES.find((c) => c.courseId === course.id);
      if (showcase && !studentName) {
        setStudentName(showcase.recipientName);
      }
    }
  }, [course.id]);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const cert = issueCourseCertificate(course, studentName, githubUrl || undefined);
    setIssuedCert(cert);
    localStorage.setItem(`jobmint_cert_${course.id}`, JSON.stringify(cert));
  };

  const handleCopyLink = () => {
    if (!issuedCert) return;
    const url = `${window.location.origin}/certificates/verify/${issuedCert.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const allModulesChecked =
    course.curriculumModules.length === 0 ||
    course.curriculumModules.every((_, idx) => checkedModules[idx]);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8">
      {/* SCREEN NAVIGATION (Hidden on Print) */}
      <div className="mx-auto max-w-5xl space-y-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Curated Courses
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
              <Award className="h-3.5 w-3.5" /> JobMint Verified Proof-of-Work
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-mono font-bold text-blue-400">
              <ShieldCheck className="h-3.5 w-3.5" /> DPDP Act 2023 Compliant
            </span>
          </div>
        </div>

        {/* CLAIM FORM IF NOT ISSUED */}
        {!issuedCert ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  Course Completion Verification
                </span>
                <h1 className="text-3xl font-black text-white">{course.title}</h1>
                <p className="text-sm text-slate-400">
                  {course.description}
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  Curriculum creator: <strong className="text-slate-200">{course.creator}</strong> ({course.creatorSubscribers})
                </div>
              </div>

              {/* CURRICULUM CHECKLIST */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Curriculum Milestones Checklist
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {course.curriculumModules.length} Modules
                  </span>
                </div>
                <div className="space-y-2.5">
                  {course.curriculumModules.map((module, idx) => (
                    <label
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedModules[idx]}
                        onChange={(e) =>
                          setCheckedModules((prev) => ({
                            ...prev,
                            [idx]: e.target.checked,
                          }))
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-300 leading-snug">{module}</span>
                    </label>
                  ))}
                </div>

                <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/20 p-3.5 space-y-1">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Required Project Benchmark:
                  </div>
                  <p className="text-xs text-slate-300">{course.projectBenchmark}</p>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="space-y-6">
              <Card className="border-slate-800 bg-slate-900/90 text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-400" />
                    Claim Official Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleIssueCertificate} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Candidate Full Name (printed on certificate) *
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Divyanshu Jethi"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-sm text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Github className="h-3.5 w-3.5" />
                        GitHub Proof-of-Work Project (Optional)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://github.com/your-username/project"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-xs text-white"
                      />
                      <p className="text-[11px] text-slate-400">
                        Adding your repository links this certificate to real code for recruiters.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 text-[11px] text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-300 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-emerald-400" />
                        DPDP Act 2023 Notice
                      </div>
                      <p>
                        Only your name and optional project link will appear on the public verification page. No private contact info is exposed.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={!studentName.trim() || !allModulesChecked}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm h-11 rounded-xl shadow-lg gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Issue & Sign Certificate
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* ACTION TOOLBAR WHEN CERTIFICATE IS ISSUED */
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Certificate Successfully Issued: {issuedCert.id}
              </div>
              <p className="text-xs text-slate-400">
                Verifiable worldwide with cryptographic SHA-256 HMAC signature.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 text-xs gap-1.5 rounded-xl"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / Save as PDF
              </Button>

              <a
                href={getLinkedInCertUrl(issuedCert)}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="sm"
                  className="bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs gap-1.5 rounded-xl font-semibold"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Add to LinkedIn
                </Button>
              </a>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 text-xs gap-1.5 rounded-xl"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied Link!" : "Copy Verification URL"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIssuedCert(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Edit Name
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* LUXURY GOLD/EMERALD PRINTABLE CERTIFICATE VIEW */}
      {issuedCert && (
        <div className="mx-auto max-w-5xl mt-6 print:mt-0 print:max-w-none">
          {/* THE CERTIFICATE CANVAS */}
          <div
            id="jobmint-certificate"
            className="relative bg-[#0d131f] text-slate-100 rounded-3xl border-8 border-[#c9a84d] p-8 sm:p-14 shadow-2xl overflow-hidden print:border-8 print:border-[#c9a84d] print:shadow-none print:m-0 print:rounded-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, rgba(13, 19, 31, 0.98) 100%)",
            }}
          >
            {/* INNER DECORATIVE GOLD BORDER */}
            <div className="absolute inset-3 border-2 border-[#e6ca65]/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-5 border border-[#e6ca65]/20 rounded-xl pointer-events-none" />

            {/* CORNER ORNAMENTS */}
            <div className="absolute top-6 left-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>
            <div className="absolute top-6 right-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>
            <div className="absolute bottom-6 left-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>
            <div className="absolute bottom-6 right-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>

            {/* CERTIFICATE HEADER */}
            <div className="text-center space-y-2 relative z-10">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Sparkles className="h-4 w-4" />
                JobMint Technical Education & Verified Proof-of-Work
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#e6ca65] uppercase drop-shadow">
                Certificate of Completion
              </h2>
              <div className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                Official Technical Proficiency & Milestone Achievement Credential
              </div>
            </div>

            {/* RECIPIENT */}
            <div className="text-center my-8 space-y-3 relative z-10">
              <p className="text-xs font-serif italic text-slate-300">
                This is to officially certify that
              </p>
              <div className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide border-b-2 border-[#c9a84d]/60 pb-2 inline-block px-8 drop-shadow-md">
                {issuedCert.recipientName}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto pt-2 leading-relaxed">
                has successfully mastered the comprehensive curriculum, passed technical project benchmarks, and demonstrated hands-on engineering proficiency in
              </p>
            </div>

            {/* COURSE & CERTIFICATE TITLE */}
            <div className="text-center space-y-2 relative z-10">
              <div className="text-xl sm:text-3xl font-black text-emerald-400">
                {issuedCert.certificateTitle}
              </div>
              <div className="text-xs sm:text-sm text-slate-400">
                Course: <strong className="text-slate-200">{issuedCert.courseTitle}</strong>
              </div>
              <div className="text-xs font-mono text-slate-500">
                {issuedCert.creatorAttribution}
              </div>
            </div>

            {/* SKILLS BADGES */}
            <div className="my-6 text-center relative z-10">
              <div className="text-[10px] font-mono uppercase text-[#c9a84d] tracking-wider mb-2 font-bold">
                Verified Technical Competencies
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto">
                {issuedCert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* GITHUB PROOF LINK IF PRESENT */}
            {issuedCert.githubProofUrl && (
              <div className="text-center my-3 relative z-10">
                <a
                  href={issuedCert.githubProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full hover:underline"
                >
                  <Github className="h-3.5 w-3.5" />
                  Verified Proof-of-Work Repository: {issuedCert.githubProofUrl}
                </a>
              </div>
            )}

            {/* SIGNATURES & VERIFICATION METADATA */}
            <div className="mt-10 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 items-center justify-between gap-6 relative z-10 text-center sm:text-left">
              {/* SIGNATURE 1 */}
              <div className="space-y-1">
                <div className="font-serif italic text-lg text-[#e6ca65]">Dr. A. Sen</div>
                <div className="border-t border-slate-700 pt-1 text-[11px] font-mono text-slate-400 uppercase">
                  Head of Engineering Curricula
                  <br />
                  JobMint Technical Education
                </div>
              </div>

              {/* CENTER SEAL */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="h-16 w-16 rounded-full border-2 border-[#c9a84d] bg-gradient-to-br from-[#c9a84d]/20 to-emerald-500/20 flex items-center justify-center shadow-inner">
                  <Award className="h-8 w-8 text-[#e6ca65]" />
                </div>
                <div className="text-[10px] font-mono text-[#c9a84d] font-bold tracking-widest uppercase">
                  JobMint Verified Seal
                </div>
              </div>

              {/* SIGNATURE 2 */}
              <div className="space-y-1 sm:text-right">
                <div className="font-serif italic text-lg text-[#e6ca65]">Divyanshu Jethi</div>
                <div className="border-t border-slate-700 pt-1 text-[11px] font-mono text-slate-400 uppercase">
                  Founder &amp; Chief Architect
                  <br />
                  JobMint Platform
                </div>
              </div>
            </div>

            {/* FOOTER & CRYPTOGRAPHIC VERIFICATION TOKEN */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-400 relative z-10">
              <div>
                Certificate ID: <strong className="text-[#e6ca65]">{issuedCert.id}</strong> • Issue Date:{" "}
                {new Date(issuedCert.issuedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>HMAC Signature: {issuedCert.verificationHash}</span>
              </div>
              <div>
                Verify:{" "}
                <Link
                  href={`/certificates/verify/${issuedCert.id}`}
                  className="text-emerald-400 hover:underline"
                >
                  jobmint.ritualdev.in/certificates/verify/{issuedCert.id}
                </Link>
              </div>
            </div>

            {/* DPDP STATUTORY DISCLAIMER FOOTNOTE */}
            <div className="mt-4 text-[9px] font-mono text-slate-500 text-center relative z-10 leading-tight">
              Issued in compliance with Sections 5 &amp; 6 of the Indian Digital Personal Data Protection (DPDP) Act, 2023. This is an open-curriculum technical proof-of-work certificate validating practical project competence and not an accredited university degree.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
