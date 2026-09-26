"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShieldAlert,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  HardDrive,
  Download,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AccountSettingsPage() {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // DPDP Section 14 Nominee state
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");
  const [nomineeSaved, setNomineeSaved] = useState(false);

  // DPDP Section 9 Age affirmation
  const [isAdultAffirmed, setIsAdultAffirmed] = useState(true);

  useEffect(() => {
    const savedNominee = localStorage.getItem("jobmint_dpdp_nominee");
    if (savedNominee) {
      try {
        const parsed = JSON.parse(savedNominee);
        setNomineeName(parsed.name || "");
        setNomineeEmail(parsed.email || "");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) {
        throw new Error("Export request failed. Ensure you are signed in.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jobmint-dpdp-data-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to download personal data archive.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveNominee = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "jobmint_dpdp_nominee",
      JSON.stringify({ name: nomineeName, email: nomineeEmail, updatedAt: new Date().toISOString() })
    );
    setNomineeSaved(true);
    setTimeout(() => setNomineeSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") {
      setError("Please type 'DELETE MY ACCOUNT' exactly to confirm permanent deletion.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        localStorage.clear();
        window.location.href = "/api/auth/signout?callbackUrl=/";
      } else {
        setError(data.error || "Failed to delete account. Please try again.");
      }
    } catch {
      setError("Network error attempting to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              🇮🇳 India DPDP Act 2023 &amp; Data Principal Portal
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-2">
            Account &amp; Data Rights
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Exercise your statutory rights under Sections 11, 12, and 14 of the Indian Digital Personal Data Protection Act, 2023.
          </p>
        </div>

        {/* 1. DATA PORTABILITY & ACCESS (DPDP SECTION 11) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-600" />
              Right to Access &amp; Data Portability (Section 11)
            </CardTitle>
            <CardDescription className="text-xs">
              Under DPDP Section 11 and GDPR Article 15, you have the right to obtain a full machine-readable copy of your personal data processed by Role Nest.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-xs text-slate-600">
            <p className="text-slate-600">
              Your export includes: Account credentials, candidate profile, skills, education, job applications history, and proof-of-work certificate completion records.
            </p>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleExportData}
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl h-9 shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                {isExporting ? "Generating JSON Export..." : "Download My Data (JSON)"}
              </Button>

              {exportSuccess && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Data archive downloaded!
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>View Saved Resumes in Vault:</span>
              <Link href="/profile/resume" className="text-emerald-700 font-bold hover:underline">
                Resume Vault →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 2. DPDP SECTION 14: NOMINEE DESIGNATION */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Right to Nominate (DPDP Section 14)
            </CardTitle>
            <CardDescription className="text-xs">
              You have the right to nominate an individual who shall exercise your Data Principal rights under the DPDP Act in the event of death or incapacity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveNominee} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nominee Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Legal Guardian or Next of Kin"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nominee Contact Email
                  </label>
                  <Input
                    type="email"
                    placeholder="nominee@domain.com"
                    value={nomineeEmail}
                    onChange={(e) => setNomineeEmail(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  {nomineeSaved && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Nominee details updated under Sec. 14.
                    </span>
                  )}
                </span>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-slate-300 font-semibold h-8"
                >
                  Save Nominee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 3. DANGER ZONE: RIGHT TO ERASURE (DPDP SECTION 12) */}
        <Card className="border-2 border-rose-200 bg-rose-50/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <ShieldAlert className="h-4 w-4" />
              Right to Erasure (DPDP Act Sec. 12 &amp; GDPR Art. 17)
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              Delete My Account &amp; Resume Data
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Permanently and irreversibly deletes your account, login credentials, candidate profile, tracked applications, and uploaded resume files from our secure storage.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-2 text-xs text-rose-900">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                This action is immediate and non-reversible
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-rose-800">
                <li>All application histories and status updates will be permanently purged.</li>
                <li>Your resume files will be permanently erased from our cloud storage vault.</li>
                <li>All profile records, skills, and account credentials will be wiped from PostgreSQL.</li>
              </ul>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-300 bg-rose-100 p-3 text-xs font-semibold text-rose-900">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Type <span className="font-mono text-rose-700 select-all font-black">DELETE MY ACCOUNT</span> to confirm:
              </label>
              <Input
                type="text"
                placeholder="DELETE MY ACCOUNT"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="font-mono text-xs border-rose-300 focus-visible:ring-rose-400"
              />
            </div>

            <Button
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE MY ACCOUNT" || isDeleting}
              variant="danger"
              className="w-full font-bold gap-2 text-xs h-10 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Erasing Account & Resume Files..." : "Delete My Account & Resume Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
