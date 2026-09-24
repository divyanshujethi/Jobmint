"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { APP_CONFIG } from "@repo/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Building2,
  ShieldCheck,
  Loader2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function EmployerLoginPage() {
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: string) => {
    setActiveProvider(provider);
    try {
      // Upon employer login, redirect to post a new job or review applicants
      await signIn(provider, { callbackUrl: "/employer/jobs/new" });
    } catch (err) {
      console.error("Recruiter sign in failed:", err);
      setActiveProvider(null);
    }
  };

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center px-4 py-12">
      <div className="mx-auto max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left column: Recruiter Value & Trust Proof */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
            <Building2 className="h-3.5 w-3.5" />
            Recruiter & Employer Portal
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Hire Verified Tech Talent with Zero Noise.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect directly with verified students, freshers, and developers. No fake resumes, no recruiter spam, and guaranteed applicant response tracking.
            </p>
          </div>

          {/* Verification Protocol Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3.5 shadow-xl backdrop-blur-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Company Verification Protocol
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Corporate Domain Matching:</strong> Sign in with your work email (@company.com) via Google Workspace or Microsoft 365 for instant verified status.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Truth Teller SLA:</strong> Verified companies commit to timely applicant updates, earning the &quot;Fast Reviewer ✓&quot; badge seen by top candidates.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Fraud Prevention Shield:</strong> Accounts created with generic email addresses (@gmail) undergo manual admin vetting before job postings go live.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              Are you a student or candidate looking for jobs?
              <span className="text-emerald-400 underline flex items-center gap-0.5">
                Candidate Login <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right column: Recruiter Sign In Card */}
        <div className="lg:col-span-6 flex justify-center">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-white shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-black text-2xl shadow-inner">
                <Building2 className="h-7 w-7 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                Recruiter Sign In
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Sign in with your verified work or corporate account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              {/* GOOGLE / WORKSPACE */}
              <button
                type="button"
                disabled={activeProvider !== null}
                onClick={() => handleOAuthSignIn("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 font-semibold text-sm text-slate-100 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                {activeProvider === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google Workspace</span>
              </button>

              {/* MICROSOFT 365 / ENTRA ID */}
              <button
                type="button"
                disabled={activeProvider !== null}
                onClick={() => handleOAuthSignIn("microsoft-entra-id")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 font-semibold text-sm text-slate-100 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                {activeProvider === "microsoft-entra-id" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                )}
                <span>Sign in with Microsoft 365</span>
              </button>

              {/* LINKEDIN */}
              <button
                type="button"
                disabled={activeProvider !== null}
                onClick={() => handleOAuthSignIn("linkedin")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600 font-semibold text-sm text-slate-100 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                {activeProvider === "linkedin" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                )}
                <span>Sign in with LinkedIn</span>
              </button>

              <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 p-3 text-[11px] text-slate-400 border border-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  By signing in, your recruiter account will automatically sync with your verified company profile.
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 text-center text-xs text-slate-500 border-t border-slate-800/80 pt-4">
              <p>
                Need assistance verifying your enterprise domain? Contact{" "}
                <a href="mailto:admin@ritualdev.in" className="text-emerald-400 underline">
                  admin@ritualdev.in
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}