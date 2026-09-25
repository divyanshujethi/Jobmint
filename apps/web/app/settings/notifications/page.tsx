"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ShieldCheck,
  Mail,
  Smartphone,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NotificationPreferencesPage() {
  const [inAppViewed, setInAppViewed] = useState(true);
  const [inAppGhosting, setInAppGhosting] = useState(true);
  const [pushMatches, setPushMatches] = useState(true);
  const [emailInterviews, setEmailInterviews] = useState(true);
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Notification Center
        </Link>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <Bell className="h-3.5 w-3.5 text-emerald-600" /> Quota-Safe Notifications
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Control how and when Role Nest communicates with you. High-volume alerts are delivered in-app to prevent inbox clutter.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            {/* IN-APP ALERTS */}
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                In-App Truth Teller Alerts (Unlimited & Real-Time)
              </span>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Resume Viewed Alerts
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Instant in-app notice when a recruiter opens your resume
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={inAppViewed}
                  onChange={(e) => setInAppViewed(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    7-Day Ghosting Notice
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Alerts you if an employer hasn&apos;t reviewed your submission in 7 days
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={inAppGhosting}
                  onChange={(e) => setInAppGhosting(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>

            {/* PUSH NOTIFICATIONS */}
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Mobile / Web Push (Firebase Cloud Messaging)
              </span>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    High Compatibility Matches (&ge; 90%)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Instant push alert when an opportunity matching your exact skills is posted
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pushMatches}
                  onChange={(e) => setPushMatches(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>

            {/* EMAIL NOTIFICATIONS */}
            <div className="space-y-3 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Email Delivery (Quota-Optimized)
              </span>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Interview Invitations & Offers
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Critical updates requiring your direct calendar scheduling
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailInterviews}
                  onChange={(e) => setEmailInterviews(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Weekly Job & Roadmap Digest
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Single consolidated email sent on Mondays with top matches and learning progress
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailWeeklyDigest}
                  onChange={(e) => setEmailWeeklyDigest(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold gap-2">
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" /> Preferences Saved!
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
