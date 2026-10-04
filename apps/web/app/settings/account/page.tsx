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
  Phone,
  Mail,
  Crown,
  Save,
  Loader2,
  Sparkles,
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

  // Profile details state
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // DPDP Section 14 Nominee state
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");
  const [nomineeSaved, setNomineeSaved] = useState(false);

  // DPDP Section 9 Age affirmation
  const [isAdultAffirmed, setIsAdultAffirmed] = useState(true);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
          setName(data.profile.name || "");
          setPhone(data.profile.phone || "");
        }
      })
      .catch((err) => console.error("Error loading profile:", err));

    const savedNominee = localStorage.getItem("rolenest_dpdp_nominee") || localStorage.getItem("jobmint_dpdp_nominee");
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
      a.download = `rolenest-dpdp-data-export-${Date.now()}.json`;
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
      "rolenest_dpdp_nominee",
      JSON.stringify({ name: nomineeName, email: nomineeEmail, updatedAt: new Date().toISOString() })
    );
    setNomineeSaved(true);
    setTimeout(() => setNomineeSaved(false), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess(false);
    setProfileError(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to save profile changes");
    } finally {
      setIsUpdatingProfile(false);
    }
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

        {/* PERSONAL PROFILE & CONTACT INFO */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                Personal Profile &amp; Contact Details
              </CardTitle>
              {profile?.isPro ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold">
                  <Crown className="h-3.5 w-3.5 fill-amber-500" />
                  Pro Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
                  Standard Account
                </span>
              )}
            </div>
            <CardDescription className="text-xs">
              Manage your personal identification and communication channels used across applications and recruiter outreach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Sharma"
                    className="text-xs h-9 bg-white"
                  />
                  <p className="text-[10px] text-slate-400">Displayed on your applications and verified certificates.</p>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      Email Address
                    </span>
                    {profile?.emailVerified ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600">Pending Verification</span>
                    )}
                  </label>
                  <Input
                    type="email"
                    disabled
                    value={profile?.email || ""}
                    className="text-xs h-9 bg-slate-100 text-slate-600 cursor-not-allowed font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Account login ID (cannot be changed).</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Phone Number (WhatsApp / SMS)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-md border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600 select-none h-9">
                      +91
                    </div>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="text-xs h-9 bg-white font-mono flex-1"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Used for interview schedules, real-time recruiter notifications, and WhatsApp updates.
                  </p>
                </div>
              </div>

              {/* Membership Status Callout */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    {profile?.isPro ? (
                      <>
                        <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span>Role Nest Pro Active</span>
                      </>
                    ) : profile?.proExpiresAt && new Date(profile.proExpiresAt) <= new Date() ? (
                      <>
                        <span className="text-amber-600 font-bold">⚠️ Pro Subscription Expired</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-slate-500" />
                        <span>Free Community Membership</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {profile?.isPro
                      ? profile?.proExpiresAt
                        ? `Valid until ${new Date(profile.proExpiresAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : "Lifetime Pro Access Active"
                      : profile?.proExpiresAt && new Date(profile.proExpiresAt) <= new Date()
                      ? `Your Pro subscription ended on ${new Date(profile.proExpiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}. Renew now to resume AI interview practice and recruiter direct messaging.`
                      : "Upgrade to Pro to unlock direct recruiter referrals, AI auto-apply, and priority ranking."}
                  </p>
                </div>
                {profile?.isPro ? (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all whitespace-nowrap"
                  >
                    <Crown className="h-3.5 w-3.5 fill-slate-950" />
                    Extend / Upgrade Plan →
                  </Link>
                ) : profile?.proExpiresAt && new Date(profile.proExpiresAt) <= new Date() ? (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
                  >
                    Renew Pro Subscription →
                  </Link>
                ) : (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    Upgrade to Pro
                  </Link>
                )}
              </div>

              {/* Feedback States */}
              {profileSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  Profile and contact details saved successfully!
                </div>
              )}
              {profileError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  {profileError}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl h-9 shadow-sm"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

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
