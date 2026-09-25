"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Check,
  X,
  Settings2,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DPDPPreferences {
  essential: boolean; // Always true
  recruiterSharing: boolean;
  jobAlerts: boolean;
  analytics: boolean;
  consentedAt: string;
}

const DEFAULT_PREFERENCES: DPDPPreferences = {
  essential: true,
  recruiterSharing: true,
  jobAlerts: true,
  analytics: false,
  consentedAt: new Date().toISOString(),
};

export function DPDPConsentManager() {
  const [hasInteracted, setHasInteracted] = useState(true); // default true until checked
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<DPDPPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const saved = localStorage.getItem("jobmint_dpdp_consent");
    if (!saved) {
      setHasInteracted(false);
    } else {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        setHasInteracted(false);
      }
    }

    const handleOpenEvent = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("open-dpdp-preferences", handleOpenEvent);
    return () => window.removeEventListener("open-dpdp-preferences", handleOpenEvent);
  }, []);

  const savePreferences = (updated: DPDPPreferences) => {
    localStorage.setItem("jobmint_dpdp_consent", JSON.stringify(updated));
    setPreferences(updated);
    setHasInteracted(true);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      recruiterSharing: true,
      jobAlerts: true,
      analytics: true,
      consentedAt: new Date().toISOString(),
    });
  };

  const handleEssentialOnly = () => {
    savePreferences({
      essential: true,
      recruiterSharing: false,
      jobAlerts: false,
      analytics: false,
      consentedAt: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      ...preferences,
      essential: true,
      consentedAt: new Date().toISOString(),
    });
  };

  return (
    <>
      {/* FLOATING DPDP BANNER (Initial prompt) */}
      {!hasInteracted && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" /> 🇮🇳 India DPDP Act 2023 Compliant
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Privacy &amp; Data Principal Notice
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Role Nest operates in strict accordance with the Digital Personal Data Protection Act, 2023. We collect and process technical credentials exclusively for verified job matching, skill gap diagnostics, and proof-of-work diplomas. <strong>We do not sell personal data to advertisers.</strong>
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-3">
                <Link href="/privacy" className="text-emerald-400 hover:underline flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Read DPDP Privacy Schedule
                </Link>
                <span>•</span>
                <span>Grievance Officer SLA: 72h / 30d</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs gap-1.5 rounded-xl h-9 flex-1 md:flex-none"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Customise
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleEssentialOnly}
                className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs rounded-xl h-9 flex-1 md:flex-none"
              >
                Essential Only
              </Button>

              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-9 px-5 flex-1 md:flex-none shadow-lg"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED DPDP PREFERENCES MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    DPDP Act Consent Preferences
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sections 5 &amp; 6, Digital Personal Data Protection Act 2023
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              {/* ESSENTIAL */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-400" />
                    Essential Services &amp; Authentication
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Mandatory session management, CSRF prevention, and basic profile security. Cannot be disabled.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  Required
                </span>
              </div>

              {/* RECRUITER SHARING */}
              <label className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="space-y-1">
                  <div className="font-semibold text-white">
                    Recruiter Profile &amp; Application Visibility
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Allows verified employers to view your technical skills and resume tokens when you submit an application.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.recruiterSharing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, recruiterSharing: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              {/* JOB ALERTS */}
              <label className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="space-y-1">
                  <div className="font-semibold text-white">
                    Job Match Alerts &amp; Diagnostic Notifications
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Receive 7-day application status updates, internship postings, and skill recommendations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.jobAlerts}
                  onChange={(e) =>
                    setPreferences({ ...preferences, jobAlerts: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              {/* ANALYTICS */}
              <label className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="space-y-1">
                  <div className="font-semibold text-white">
                    Anonymized Performance Telemetry
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Helps us diagnose page load times and crawler latencies without tracking individual identity.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEssentialOnly}
                className="text-xs text-slate-400 hover:text-white"
              >
                Disable All Optional
              </Button>

              <Button
                size="sm"
                onClick={handleSaveCustom}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl px-5 h-9"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
