"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldAlert,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AccountSettingsPage() {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <User className="h-3.5 w-3.5" />
              Account Security & Data
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-2">
            Account Settings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your credentials, data portability rights, and permanent account removal.
          </p>
        </div>

        {/* DATA PORTABILITY & PRIVACY CARD */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-600" />
              Data Portability & Vault
            </CardTitle>
            <CardDescription className="text-xs">
              Your profile, uploaded resumes, and Dev Score metrics are stored under strict zero-selling privacy standards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-xs text-slate-600">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span>View Stored Resumes & ATS Cache</span>
              <Link href="/profile/resume" className="text-emerald-700 font-bold hover:underline">
                Resume Vault →
              </Link>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span>Notification & Quota Settings</span>
              <Link href="/settings/notifications" className="text-emerald-700 font-bold hover:underline">
                Preferences →
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span>Review Privacy & Data Collection</span>
              <Link href="/privacy" className="text-emerald-700 font-bold hover:underline">
                Privacy Policy →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* DANGER ZONE: DELETE ACCOUNT */}
        <Card className="border-2 border-rose-200 bg-rose-50/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <ShieldAlert className="h-4 w-4" />
              Danger Zone: Permanent Account Deletion
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              Delete Your Account
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Irreversibly deletes your account, login credentials, candidate profile, tracked applications, and uploaded resumes from our NVMe storage.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-2 text-xs text-rose-900">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                This action cannot be undone
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-rose-800">
                <li>All application histories and status updates will be purged.</li>
                <li>Your resume PDF will be permanently erased from our OCI NVMe storage.</li>
                <li>Your JobMint Dev Score verification badge will be revoked.</li>
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
              {isDeleting ? "Erasing Account Records..." : "Permanently Delete My Account & Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
