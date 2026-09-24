import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Database, Trash2, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy — JobMint",
  description: "How JobMint safeguards student resumes, hashes credentials, and enables 1-click permanent account deletion.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <Lock className="h-3.5 w-3.5 text-emerald-600" /> Security & Candidate Data Rights
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Effective Date: September 2026. Zero selling of candidate data, zero intrusive tracking, 100% data portability.
          </p>
        </div>

        {/* SECURITY PILLARS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-700 text-sm">
              <EyeOff className="h-4 w-4 text-emerald-600" />
              Zero Data Selling
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never sell your email, phone number, resume, or GitHub code to data brokers or ad networks.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-blue-700 text-sm">
              <Lock className="h-4 w-4 text-blue-600" />
              Token-Gated Resumes
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your uploaded PDF resumes are stored on private NVMe storage with HMAC-SHA256 time-limited streaming tokens.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
              <Trash2 className="h-4 w-4 text-rose-600" />
              1-Click Erasure
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You own your data. Delete your account anytime and all records are permanently purged from database and disk.
            </p>
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Information We Collect
              </h2>
              <p>
                When you create an account on JobMint (via Google, GitHub, LinkedIn, or Email), we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>Your name, primary email address, and profile photo provided by your OAuth provider.</li>
                <li>Your self-reported technical skills, target roles, and location preferences.</li>
                <li>Uploaded resume files (stored privately for candidate review when you apply).</li>
                <li>Public GitHub commit metrics (only if you connect your GitHub handle to calculate your Dev Score).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                2. How We Use Candidate Information
              </h2>
              <p>
                Your information is used strictly to power your JobMint experience: matching you to verified fresher jobs, computing your skills diagnostic, showing recruiter review telemetry in your dashboard, and issuing proof-of-work completion badges.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Recruiter and Employer Access
              </h2>
              <p>
                When you click &ldquo;Apply&rdquo; for an opportunity, your candidate profile and resume token are shared exclusively with the verified recruiter representing that company. Unverified recruiters cannot browse public candidate resumes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Permanent Account and Data Deletion
              </h2>
              <p>
                Under global privacy standards (GDPR, CCPA, and Indian Digital Personal Data Protection), you have the right to be forgotten. You can trigger immediate account deletion via{" "}
                <Link href="/settings/account" className="text-emerald-700 underline font-semibold">
                  Settings &gt; Account &gt; Delete My Account
                </Link>. All user records, application histories, profile skills, and stored files are irreversibly deleted from our PostgreSQL database and NVMe storage.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                5. Contact Platform Data Officer
              </h2>
              <p>
                For questions regarding data processing or security disclosures, contact our team directly at privacy@ritualdev.in.
              </p>
            </section>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>JobMint Privacy & Encryption Standard</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/terms" className="hover:text-emerald-600 underline">Terms and Conditions</Link>
                <Link href="/settings/account" className="hover:text-emerald-600 underline">Delete Account</Link>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
