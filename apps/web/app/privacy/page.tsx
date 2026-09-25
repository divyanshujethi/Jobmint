import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Database,
  Trash2,
  EyeOff,
  FileCheck,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Scale,
  Mail,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "DPDP Act 2023 & Privacy Policy — JobMint",
  description:
    "Comprehensive Privacy Policy & Statutory Compliance with the Indian Digital Personal Data Protection (DPDP) Act, 2023 and GDPR.",
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
            <Scale className="h-3.5 w-3.5 text-emerald-600" /> 🇮🇳 DPDP Act 2023 &amp; Global Privacy Standards
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Privacy Policy &amp; DPDP Statutory Disclosures
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Governing Body: Ministry of Electronics and Information Technology (MeitY), Government of India. Effective: September 2026.
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
              We never sell your email, phone, resume, or GitHub code to commercial brokers, spammers, or ad networks.
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
              Under DPDP Sec. 12 &amp; GDPR Art. 17, purge your account anytime and all database records are irreversibly wiped.
            </p>
          </div>
        </div>

        {/* DPDP ACT STATUTORY SUMMARY BANNER */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/60 p-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-base">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            Statutory Notice under Section 5 of the Digital Personal Data Protection Act, 2023
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            This notice accompanies the collection of personal data by <strong>JobMint (RitualDev Technologies)</strong>, acting as a Data Fiduciary under the DPDP Act 2023. As a Data Principal (candidate or employer), you are entitled to unambiguous notice, granular consent controls, free data export, and swift grievance redressal through our designated Data Protection Officer.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            
            {/* SECTION 1 */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Itemised Personal Data We Collect (DPDP Sec. 5(1))
              </h2>
              <p>
                When you access JobMint as a student, fresher, or recruiter, we collect only strictly necessary data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <strong>Identity &amp; Authentication</strong>: Full Name, email address, and profile picture (retrieved via authenticated OAuth providers Google, GitHub, or LinkedIn).
                </li>
                <li>
                  <strong>Candidate Profile</strong>: Technical skills, target roles, preferred work locations, and educational history.
                </li>
                <li>
                  <strong>Proof-of-Work &amp; GitHub Tokens</strong>: When authenticating via GitHub or verifying project ownership, we store read-only public repo metadata (commits, PRs, languages) to compute your tamper-proof Dev Score. We never request write permissions or access private repositories without explicit consent.
                </li>
                <li>
                  <strong>Resume Files &amp; Extracted Data</strong>: Uploaded PDF/DOCX resumes and ATS builder data are encrypted on private NVMe storage with HMAC-SHA256 authenticated streaming tokens. Resumes are NEVER shared with third-party data brokers, ad networks, or scrapers.
                </li>
                <li>
                  <strong>Code Submissions &amp; Sandboxing</strong>: Daily Coding Problems (POTD) and Monaco code runs are executed in client-side Web Worker sandboxes. Your code submissions are evaluated locally and are never harvested to train commercial AI systems.
                </li>
                <li>
                  <strong>Course Completion Data</strong>: Course milestones, completion timestamps, and generated cryptographic certificate hashes.
                </li>
              </ul>
            </section>

            {/* SECTION 2 */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                2. Specified Purpose of Processing (DPDP Sec. 5(1)(a))
              </h2>
              <p>
                Your personal data is processed solely for explicit, lawful purposes:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Matching your skill profile to verified fresher job and internship postings.</li>
                <li>Conducting automated skill diagnostic tests and gap-to-offer roadmaps.</li>
                <li>Delivering your application securely to the hiring manager when you click &ldquo;Apply&rdquo;.</li>
                <li>Issuing cryptographic proof-of-work completion diplomas for JobMint curricula.</li>
                <li>Sending 7-day transparent application status alerts (Anti-Ghosting Wall).</li>
              </ol>
            </section>

            {/* SECTION 3 */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Consent Architecture &amp; Right to Withdraw (DPDP Sec. 6)
              </h2>
              <p>
                Consent on JobMint is free, specific, informed, unconditional, and unambiguous. You have the statutory right to withdraw your consent at any time with equal ease. You can modify your consent preferences regarding recruiter visibility, alerts, and analytics via our on-screen DPDP Consent Manager or in Account Settings.
              </p>
            </section>

            {/* SECTION 4 */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Data Principal Rights (DPDP Sections 11, 12, 13 &amp; 14)
              </h2>
              <div className="space-y-3 pt-1">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    Right to Access &amp; Data Portability (Section 11)
                  </div>
                  <p className="text-xs text-slate-600">
                    You can request a summary of your personal data processed by JobMint. You can instantly download a complete JSON export of your profile, applications, and certificates via{" "}
                    <Link href="/settings/account" className="text-emerald-700 underline font-semibold">
                      Settings &gt; Account &gt; Download My Data
                    </Link>.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Trash2 className="h-4 w-4 text-rose-600" />
                    Right to Correction and Erasure (Section 12)
                  </div>
                  <p className="text-xs text-slate-600">
                    You have the right to correct inaccurate data or completely erase your personal data once the purpose of processing is fulfilled. 1-click permanent erasure is accessible at{" "}
                    <Link href="/settings/account" className="text-rose-700 underline font-semibold">
                      Settings &gt; Account &gt; Delete My Account
                    </Link>.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Right to Nominate (Section 14)
                  </div>
                  <p className="text-xs text-slate-600">
                    Under Section 14 of the DPDP Act 2023, you can nominate an individual who shall exercise your Data Principal rights in the event of death or incapacity. You can register your nominee in Account Settings.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5 */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                5. Protection of Children and Minors (DPDP Sec. 9)
              </h2>
              <p>
                JobMint is an engineering career platform intended for adults, college students, and aspiring software professionals. We do not engage in targeted advertising directed at children, nor do we track behavior or process personal data of individuals under 18 years without verifiable parental/guardian consent.
              </p>
            </section>

            {/* SECTION 6: GRIEVANCE REDRESSAL OFFICER */}
            <section id="dpdp-grievance" className="space-y-3 pt-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                6. Grievance Redressal Officer &amp; Statutory SLA (DPDP Sec. 13)
              </h2>
              <p>
                In compliance with Section 13 of the Digital Personal Data Protection Act, 2023, JobMint has appointed a designated Grievance Redressal Officer to address complaints, data rights requests, and security disclosures.
              </p>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Designated Officer
                    </span>
                    <strong className="text-slate-900 text-sm">Mr. Divyanshu Jethi</strong>
                    <p className="text-slate-500">Data Protection &amp; Grievance Redressal Officer</p>
                  </div>

                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Official Grievance Email
                    </span>
                    <a
                      href="mailto:grievance@ritualdev.in"
                      className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5 text-sm"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      grievance@ritualdev.in
                    </a>
                    <p className="text-slate-500">Cc: privacy@ritualdev.in</p>
                  </div>

                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Statutory Resolution Timeline
                    </span>
                    <p className="text-slate-700 font-semibold mt-0.5">
                      • Acknowledged within: <strong>72 Hours</strong>
                      <br />
                      • Final Resolution within: <strong>30 Days</strong>
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Escalation Authority
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Under Section 13(3), if a grievance is not addressed within 30 days, the Data Principal may file a complaint with the <strong>Data Protection Board of India (DPBI)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7 */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                7. Technical Safeguards &amp; Breach Protocol (DPDP Sec. 8(5) &amp; 8(6))
              </h2>
              <p>
                We maintain state-of-the-art organizational and technical measures: AES-256 and HMAC-SHA256 encryption, role-based database permissions, NVMe private token gating, and automated threat logs. In the unlikely event of a personal data breach, JobMint will notify the <strong>Data Protection Board of India</strong> and affected Data Principals in the prescribed statutory format.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>JobMint DPDP Act 2023 &amp; MeitY Governance Standard</span>
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
