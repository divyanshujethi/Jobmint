"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { APP_CONFIG, UserRole } from "@repo/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, Building, ShieldCheck, Loader2, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<string>(UserRole.CANDIDATE);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const handleOAuthSignUp = async (provider: string) => {
    if (!agreedToTerms) {
      setConsentError("Please agree to the Terms of Service & Privacy Policy to create your account.");
      return;
    }
    setConsentError(null);
    setActiveProvider(provider);
    const callbackUrl = role === UserRole.EMPLOYER ? "/onboarding/employer" : "/onboarding/candidate";
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      console.error("Sign up failed:", err);
      setActiveProvider(null);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200/80 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl shadow-md">
            J
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Join {APP_CONFIG.name}
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Create your account in seconds with your verified profile
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* ROLE TOGGLE */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole(UserRole.CANDIDATE)}
              className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                role === UserRole.CANDIDATE
                  ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-sm ring-1 ring-emerald-600"
                  : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
              }`}
            >
              <GraduationCap className="h-5 w-5 mb-1.5 text-emerald-600" />
              <span className="text-xs font-bold">Candidate / Student</span>
              <span className="text-[10px] text-slate-500">Find jobs & roadmaps</span>
            </button>

            <button
              type="button"
              onClick={() => setRole(UserRole.EMPLOYER)}
              className={`flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                role === UserRole.EMPLOYER
                  ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-sm ring-1 ring-emerald-600"
                  : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
              }`}
            >
              <Building className="h-5 w-5 mb-1.5 text-emerald-600" />
              <span className="text-xs font-bold">Employer / Company</span>
              <span className="text-[10px] text-slate-500">Hire young talent</span>
            </button>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400 font-semibold">
                Sign up with
              </span>
            </div>
          </div>

          {/* CONSENT CHECKBOX (DPDP ACT 2023 COMPLIANT) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1.5 transition-all">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="consent-checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked) setConsentError(null);
                }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0 accent-emerald-600"
              />
              <label htmlFor="consent-checkbox" className="text-xs text-slate-700 cursor-pointer select-none leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700">
                  Privacy Policy
                </Link>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  🇮🇳 DPDP Act 2023 Compliant: Right to Erasure, Zero Data Selling, Token-Gated Resumes.
                </span>
              </label>
            </div>
            {consentError && (
              <p className="text-[11px] font-semibold text-rose-600 pl-6 animate-pulse">
                {consentError}
              </p>
            )}
          </div>

          {/* OAUTH PROVIDERS */}
          <div className="space-y-2.5">
            {/* GOOGLE */}
            <button
              type="button"
              disabled={activeProvider !== null}
              onClick={() => handleOAuthSignUp("google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm text-slate-700 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              {activeProvider === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
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
              <span>Continue with Google</span>
            </button>

            {/* GITHUB */}
            <button
              type="button"
              disabled={activeProvider !== null}
              onClick={() => handleOAuthSignUp("github")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm text-slate-700 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              {activeProvider === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              ) : (
                <svg className="h-4 w-4 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>Continue with GitHub</span>
            </button>

            {/* LINKEDIN */}
            <button
              type="button"
              disabled={activeProvider !== null}
              onClick={() => handleOAuthSignUp("linkedin")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm text-slate-700 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              {activeProvider === "linkedin" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              ) : (
                <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              )}
              <span>Continue with LinkedIn</span>
            </button>

            {/* MICROSOFT */}
            <button
              type="button"
              disabled={activeProvider !== null}
              onClick={() => handleOAuthSignUp("microsoft-entra-id")}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm text-slate-700 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              {activeProvider === "microsoft-entra-id" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              )}
              <span>Continue with Microsoft</span>
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-emerald-50/60 p-3 text-[11px] text-emerald-800 border border-emerald-100">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              100% Free Forever. Your verified identity helps fast-track your applications and eliminates spam recruiters.
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
