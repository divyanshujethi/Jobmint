"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_CONFIG } from "@repo/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to request password reset.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[82vh] flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200/90 shadow-xl bg-white">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl shadow-md">
            J
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Enter your registered email address to receive a secure password reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSubmitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-3 animate-in fade-in">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                If an account exists for <span className="font-semibold text-emerald-950">{email}</span>, we have delivered a password reset link to your inbox.
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-emerald-100">
                Didn&apos;t receive it? Check your spam/junk folder or wait 2 minutes.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-semibold shadow-md transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
