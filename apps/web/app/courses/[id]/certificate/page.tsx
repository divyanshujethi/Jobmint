"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Printer,
  ArrowLeft,
  Sparkles,
  Github,
  Calendar,
  Lock,
  Copy,
  Check,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  UserCheck,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CURATED_COURSES } from "@/lib/courses-data";
import { getQuizForCourse, QuizQuestion } from "@/lib/courses-quizzes";
import { CourseCertificate, getLinkedInCertUrl } from "@/lib/certificates-issuer";

export default function CourseCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;
  const course = CURATED_COURSES.find((c) => c.id === courseId) || CURATED_COURSES[0];

  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Quiz state
  const quiz = getQuizForCourse(course.id);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [githubUrl, setGithubUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Issued certificate state
  const [issuedCert, setIssuedCert] = useState<CourseCertificate | null>(null);
  const [certScore, setCertScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Check user session and existing certificate
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then(async (data) => {
        if (data && data.user) {
          setSession(data);
          // Check if this user already earned a certificate for this course
          try {
            const checkRes = await fetch("/api/certificates/claim", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ courseId: course.id, quizAnswers: {}, checkOnly: true }),
            });
            const checkData = await checkRes.json();
            if (checkData.alreadyIssued && checkData.certificate) {
              setIssuedCert(checkData.certificate);
              setCertScore(checkData.certificate.score || 100);
            }
          } catch (e) {
            // ignore
          }
        }
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, [course.id]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setErrorMsg("You must be logged in to submit this examination and receive a certificate.");
      return;
    }

    if (Object.keys(quizAnswers).length < quiz.length) {
      setErrorMsg(`Please answer all ${quiz.length} technical questions before submitting.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/certificates/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          quizAnswers,
          githubUrl: githubUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Assessment failed. An 80% passing grade is required.");
      } else if (data.certificate) {
        setIssuedCert(data.certificate);
        setCertScore(data.score || 100);
      }
    } catch {
      setErrorMsg("Network error submitting assessment.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* SCREEN NAVIGATION (Hidden on Print) */}
      <div className="mx-auto max-w-5xl space-y-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Curated Courses
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-bold text-emerald-800">
              <Award className="h-3.5 w-3.5" /> Anti-Fraud Technical Examination
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-mono font-bold text-blue-800">
              <ShieldCheck className="h-3.5 w-3.5" /> PostgreSQL Registered
            </span>
          </div>
        </div>

        {/* 1. AUTHENTICATION GATE IF NOT SIGNED IN */}
        {!authLoading && !session?.user && !issuedCert && (
          <div className="rounded-3xl border border-amber-200 bg-white p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Student Authentication Required
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              To protect the integrity of Role Nest credentials, certificates can no longer be generated with arbitrary names. <strong>You must sign in with a verified account</strong> so your official diploma is permanently registered in our database, signed with HMAC-SHA256, and verified against your real profile.
            </p>
            <div className="pt-2">
              <Link href={`/login?callbackUrl=/courses/${course.id}/certificate`}>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 h-11 rounded-xl shadow-lg gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In to Take Assessment &amp; Earn Certificate
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* 2. REAL TECHNICAL EXAMINATION FORM (WHEN LOGGED IN AND NOT ISSUED) */}
        {session?.user && !issuedCert && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Technical Competence Examination
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                {course.title}
              </h1>
              <p className="text-sm text-slate-600">
                Candidate: <strong className="text-slate-900">{session.user.name}</strong> ({session.user.email}) •{" "}
                <span className="text-emerald-400 font-semibold">Passing Threshold: 80% (4/5 Questions)</span>
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs font-semibold text-rose-300 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-200">Assessment Incomplete or Failed:</div>
                  <p className="mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitExam} className="space-y-6">
              {/* QUIZ QUESTIONS */}
              <div className="space-y-6">
                {quiz.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        <span className="text-emerald-400 font-mono mr-2">Q{qIndex + 1}.</span>
                        {q.question}
                      </h3>
                      {quizAnswers[q.id] !== undefined && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Answered
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      {q.options.map((option, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                              isSelected
                                ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-medium shadow-sm"
                                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-emerald-400 bg-emerald-500"
                                  : "border-slate-600"
                              }`}
                            >
                              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="leading-relaxed">{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* GITHUB PROOF OF WORK */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Github className="h-4 w-4 text-slate-300" />
                  GitHub Proof-of-Work Repository URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://github.com/your-username/course-capstone-project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 h-10 rounded-xl"
                />
                <p className="text-[11px] text-slate-400">
                  Submitting your actual code repository links your certificate to real source code on GitHub.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting || Object.keys(quizAnswers).length < quiz.length}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm h-12 rounded-xl shadow-xl gap-2"
                >
                  <Award className="h-4 w-4" />
                  {submitting ? "Evaluating Technical Examination..." : "Submit Examination & Issue Verified Certificate"}
                </Button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Permanently ties the certificate to <strong>{session.user.name}</strong> in PostgreSQL.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* 3. TOOLBAR WHEN CERTIFICATE IS ALREADY ISSUED */}
        {issuedCert && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Certificate Authenticated: {issuedCert.id}
              </div>
              <p className="text-xs text-slate-400">
                Registered in PostgreSQL • Score: <strong className="text-slate-900">{certScore || 100}%</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs gap-1.5 rounded-xl shadow-sm"
              >
                <Printer className="h-3.5 w-3.5" />
                Print / Save PDF
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
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs gap-1.5 rounded-xl shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Verification URL"}
              </Button>

              <Link href={`/certificates/verify/${issuedCert.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs gap-1 rounded-xl font-semibold"
                >
                  View Public Ledger
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* LUXURY GOLD/EMERALD PRINTABLE CERTIFICATE VIEW */}
      {issuedCert && (
        <div className="mx-auto max-w-5xl mt-6 print:mt-0 print:max-w-none">
          <div
            id="rolenest-certificate"
            className="relative bg-[#0d131f] text-slate-100 rounded-3xl border-8 border-[#c9a84d] p-8 sm:p-14 shadow-2xl overflow-hidden print:border-8 print:border-[#c9a84d] print:shadow-none print:m-0 print:rounded-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, rgba(13, 19, 31, 0.98) 100%)",
            }}
          >
            <div className="absolute inset-3 border-2 border-[#e6ca65]/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-5 border border-[#e6ca65]/20 rounded-xl pointer-events-none" />

            <div className="absolute top-6 left-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>
            <div className="absolute top-6 right-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>
            <div className="absolute bottom-6 left-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>
            <div className="absolute bottom-6 right-6 font-serif text-[#c9a84d] text-2xl select-none opacity-70">❖</div>

            {/* HEADER */}
            <div className="text-center space-y-2 relative z-10">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Sparkles className="h-4 w-4" />
                Role Nest Technical Education &amp; Verified Proof-of-Work
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#e6ca65] uppercase drop-shadow">
                Certificate of Completion
              </h2>
              <div className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                Official Technical Competence &amp; Engineering Milestone Credential
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
                has successfully passed the technical examination ({certScore || 100}% Score), completed practical engineering benchmarks, and demonstrated verified hands-on proficiency in
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
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* GITHUB PROOF LINK */}
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

            {/* SIGNATURES */}
            <div className="mt-10 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 items-center justify-between gap-6 relative z-10 text-center sm:text-left">
              <div className="space-y-1">
                <div className="font-serif italic text-lg text-[#e6ca65]">Sakshi Sharma</div>
                <div className="border-t border-slate-700 pt-1 text-[11px] font-mono text-slate-400 uppercase">
                  Head of Engineering Curricula<br />
                  Role Nest Technical Education
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="h-16 w-16 rounded-full border-2 border-[#c9a84d] bg-gradient-to-br from-[#c9a84d]/20 to-emerald-500/20 flex items-center justify-center shadow-inner">
                  <Award className="h-8 w-8 text-[#e6ca65]" />
                </div>
                <div className="text-[10px] font-mono text-[#c9a84d] font-bold tracking-widest uppercase">
                  Role Nest Verified Seal
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <div className="font-serif italic text-lg text-[#e6ca65]">Divyanshu Jethi</div>
                <div className="border-t border-slate-700 pt-1 text-[11px] font-mono text-slate-400 uppercase">
                  Founder &amp; Chief Architect<br />
                  Role Nest Platform
                </div>
              </div>
            </div>

            {/* FOOTER METADATA */}
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
                <span>Cryptographic HMAC Seal: <strong className="text-emerald-300 font-mono tracking-wider">{issuedCert.verificationHash}</strong></span>
              </div>
              <div>
                Verify:{" "}
                <Link
                  href={`/certificates/verify/${issuedCert.id}`}
                  className="text-emerald-400 hover:underline"
                >
                  rolenest.in/certificates/verify/{issuedCert.id}
                </Link>
              </div>
            </div>

            <div className="mt-4 text-[9px] font-mono text-slate-500 text-center relative z-10 leading-tight">
              Issued in compliance with Sections 5 &amp; 6 of the Indian Digital Personal Data Protection (DPDP) Act, 2023. Certified proof-of-work certificate under Role Nest Open Education Standards; not an accredited degree.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
