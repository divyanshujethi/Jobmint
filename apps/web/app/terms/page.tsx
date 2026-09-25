import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms and Conditions — Role Nest",
  description: "Official terms of service, platform disclaimers, proof-of-work guidelines, and job guarantee disclaimers.",
};

export default function TermsPage() {
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
            <FileText className="h-3.5 w-3.5 text-emerald-600" /> Legal and Platform Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Last Updated: September 2026. Please read these terms carefully before accessing or using Role Nest.
          </p>
        </div>

        {/* CRITICAL DISCLAIMER CALLOUT */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2.5 font-bold text-amber-900 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            Important Notice: No Employment or Internship Guarantee
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            <strong>Role Nest is an open, transparent discovery and proof-of-work hiring ecosystem.</strong> We provide verified listings, skill diagnostics, interactive course roadmaps, and recruiter tracking transparency.
            <strong> We DO NOT guarantee, warrant, or promise employment, internships, interview callbacks, offers, or compensation of any kind.</strong> All hiring choices, interview invitations, and final job decisions rest entirely within the independent discretion of third-party employers and companies.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By registering, accessing, or using the Role Nest web application, API endpoints, feeds, or developer tools, you signify that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy. If you do not agree to these terms, you must discontinue use immediately.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                2. Student and Candidate Roles
              </h2>
              <p>
                Role Nest offers candidate accounts free of charge. Candidates agree to provide authentic information regarding their technical background, GitHub repositories, and resumes. Submitting fraudulent credentials, malicious code payloads, automated bots, or spam applications is grounds for permanent platform revocation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Storage of Resume Data, GitHub Tokens &amp; Code Submissions
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p>
                  <strong>Resume &amp; Application Data:</strong> Uploaded resumes and ATS builder outputs are encrypted and stored on private NVMe storage. Access is strictly mediated via HMAC-SHA256 time-limited streaming URLs. We never sell, rent, or leak candidate resumes to commercial third parties.
                </p>
                <p>
                  <strong>GitHub Tokens &amp; Metadata:</strong> When performing GitHub account verification or project validation, Role Nest queries public repository metadata and commit histories. GitHub OAuth tokens are used solely for read-only verification of authentic technical authorship.
                </p>
                <p>
                  <strong>Code Submissions &amp; POTD Sandboxing:</strong> Code executed via our Problem of the Day (POTD) runner is isolated client-side using browser Web Workers and WebAssembly sandboxes. Submissions are never used to train public machine learning models.
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Courses, Certificates, and Learning Tracks
              </h2>
              <p>
                Role Nest curates third-party open educational resources (including YouTube playlists from top educators, Harvard CS50, and Forage Virtual Internships).
                Completion certificates issued directly by Role Nest verify mastery of coursework, capstone submissions, or study tracks on our platform. <strong>Role Nest certificates represent completion of learning modules and proof-of-work; they do not represent accredited university degrees or government licensing.</strong>
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Recruiter Transparency and Anti-Ghosting Metrics
              </h2>
              <p>
                To protect candidates, Role Nest calculates community response metrics (Median Response Time, Review Rate, Ghosting Alerts). Employers posting on Role Nest consent to aggregated response times being displayed to users. Role Nest reserves the right to unpublish job listings that violate transparency rules or show signs of ghost recruiting.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                5. Account Deletion and Data Portability
              </h2>
              <p>
                Users have the complete right to data portability and permanent erasure. At any time, you may request permanent deletion of your profile, stored resumes, Dev Score history, and tracked applications via the Account Settings page. Upon confirmation, data is permanently scrubbed from our PostgreSQL databases and NVMe block storage.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                6. Limitation of Liability
              </h2>
              <p>
                Under no circumstances shall Role Nest, RitualDev, or its maintainers be liable for any direct, indirect, incidental, or consequential damages resulting from job rejections, recruiter actions, third-party platform availability, or reliance on information presented on this site.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                7. Payments, Subscriptions &amp; Merchant of Record
              </h2>
              <p>
                Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
              </p>
              <p className="text-xs text-slate-600">
                Purchases of Role Nest Pro candidate subscriptions and Employer Featured Job Boosts are governed by our official <Link href="/refund" className="text-emerald-700 underline font-semibold">Refund &amp; Cancellation Policy</Link>. First-time candidate subscribers are entitled to our 7-day 100% money-back satisfaction guarantee.
              </p>
            </section>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>Questions regarding our terms? Email: admin@rolenest.in</span>
              <div className="flex items-center gap-3">
                <Link href="/privacy" className="hover:text-emerald-600 underline">Privacy Policy</Link>
                <Link href="/refund" className="hover:text-emerald-600 underline">Refund Policy</Link>
                <Link href="/pricing" className="hover:text-emerald-600 underline">Pricing</Link>
                <Link href="/settings/account" className="hover:text-emerald-600 underline">Manage / Delete Account</Link>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}