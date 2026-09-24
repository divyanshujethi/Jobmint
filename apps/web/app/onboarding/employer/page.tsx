"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function EmployerOnboardingPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("Software Engineering & AI");
  const [description, setDescription] = useState("");
  const [gstin, setGstin] = useState("");
  const [corporateEmail, setCorporateEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSessionUser(data.user);
          if (data.user.email) {
            setCorporateEmail(data.user.email);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !website.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/employer/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          website,
          location,
          industry,
          description,
          gstin,
          corporateEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create company profile");
      }

      setIsVerified(data.isVerified);
      setStatusMessage(data.message);
      setIsSaved(true);

      setTimeout(() => {
        window.location.href = "/employer/jobs/new";
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save company profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="border-slate-200/90 shadow-xl bg-white">
        <CardHeader className="space-y-1 text-center sm:text-left border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            Recruiter Onboarding
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Register & Verify Your Company
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Establish your official company profile on JobMint to start publishing opportunities.
          </CardDescription>
        </CardHeader>

        {errorMessage && (
          <div className="mx-6 mt-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleComplete}>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Official Company Name *
              </label>
              <Input
                type="text"
                placeholder="e.g. Acme AI, RitualDev Technologies"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Company Website Domain *
                </label>
                <Input
                  type="url"
                  placeholder="https://acme.org"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Used to verify your corporate email domain
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Corporate Work Email
                </label>
                <Input
                  type="email"
                  placeholder="recruiter@acme.org"
                  value={corporateEmail}
                  onChange={(e) => setCorporateEmail(e.target.value)}
                />
                <span className="text-[10px] text-slate-400">
                  Instant verification when domain matches website
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Headquarters Location *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Bangalore, India or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  GSTIN / CIN / Business Reg (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 29AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Industry Sector
              </label>
              <Input
                type="text"
                placeholder="e.g. AI / Machine Learning, Cloud Infrastructure, FinTech"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Company Bio / Mission
              </label>
              <textarea
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 min-h-[80px]"
                placeholder="Tell young engineers what your engineering team builds and what impact they will have..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Verification Guarantee */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                Truth Teller & Verified Employer Guarantee
              </div>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                JobMint protects students from fake recruiters and ghosting. If your work email matches your registered company website domain, your profile is immediately verified. Free mail accounts (@gmail) require admin approval before listings go live.
              </p>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                isVerified
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}>
                {isVerified ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              disabled={isSubmitting || isSaved}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying & Creating Profile...
                </>
              ) : isSaved ? (
                <>
                  <Check className="h-5 w-5" /> Profile Created! Redirecting...
                </>
              ) : (
                <>
                  Complete Verification & Post Job <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}