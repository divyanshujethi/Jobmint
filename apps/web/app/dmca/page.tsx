import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  Mail,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "DMCA Copyright & Intellectual Property Policy — Role Nest",
  description:
    "Official Digital Millennium Copyright Act (DMCA) policy, notice-and-takedown procedure, designated copyright agent disclosures, and repeat infringer terms for Role Nest.",
  alternates: {
    canonical: "https://rolenest.in/dmca",
  },
};

export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md mb-2">
            <Scale className="h-3.5 w-3.5 text-purple-600" /> Intellectual Property Protection &amp; Safe Harbor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            DMCA Copyright &amp; IP Policy
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Governing Standards: Title II of the Digital Millennium Copyright Act (17 U.S.C. § 512) and the Indian Copyright Act, 1957. Effective: September 2026.
          </p>
        </div>

        {/* SUMMARY CALLOUT */}
        <div className="rounded-2xl border-2 border-purple-500/30 bg-purple-50/60 p-6 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-purple-950 text-base">
            <ShieldAlert className="h-5 w-5 text-purple-700 shrink-0" />
            Intermediary Safe Harbor &amp; Expedited Takedown Commitment
          </div>
          <p className="text-xs sm:text-sm text-purple-900 leading-relaxed font-medium">
            Role Nest respects the intellectual property rights of creators, employers, and software developers. In accordance with 17 U.S.C. § 512 and applicable intermediary laws, we maintain an expedited notice-and-takedown procedure to review and remove allegedly infringing user-uploaded content promptly upon receipt of a valid statutory notice.
          </p>
        </div>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-6 sm:p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            
            {/* 1. SCOPE AND INTERMEDIARY ROLE */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Scope &amp; Intermediary Status
              </h2>
              <p>
                Role Nest (operated by RitualDev Lab) functions as a technology platform and interactive career portal providing job discovery feeds, resume parsing diagnostics, whiteboard collaboration tools, and community learning roadmaps.
              </p>
              <p>
                Certain materials displayed on the platform are uploaded or submitted directly by registered users, recruiters, or aggregated from public corporate hiring feeds. We do not prescreen or actively monitor all user-generated content, but we act expeditiously to remove or disable access to materials claimed to be infringing once a formal notice is received.
              </p>
            </section>

            {/* 2. NOMINATIVE FAIR USE & TRADEMARKS */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                2. Nominative Fair Use of Company Names &amp; Logos
              </h2>
              <p>
                Company names, brand marks, and corporate logos displayed on Role Nest (e.g. in tech job postings, company profiles, or verified salary benchmarks) belong solely to their respective trademark holders.
              </p>
              <p>
                Their display on Role Nest constitutes <strong>nominative fair use</strong> strictly for descriptive, identification, and non-confusing informational purposes (identifying open engineering vacancies and industry hiring benchmarks). Display of a trademark does not imply endorsement, affiliation, or commercial sponsorship by the trademark owner.
              </p>
            </section>

            {/* 3. FILING A VALID DMCA NOTICE */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Submitting a DMCA Takedown Notice (17 U.S.C. § 512(c)(3))
              </h2>
              <p>
                If you believe your copyrighted work has been copied, displayed, or distributed on Role Nest in a manner that constitutes copyright infringement, please transmit a formal written notification containing all of the following elements to our Designated Copyright Agent:
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                  <li>
                    <strong>Identification of the Copyrighted Work:</strong> A description or link to the copyrighted work you claim has been infringed (or, if multiple works, a representative list).
                  </li>
                  <li>
                    <strong>Specific URL of Alleged Infringement:</strong> Direct web links (e.g. <code>https://rolenest.in/jobs/...</code> or <code>https://rolenest.in/whiteboard/...</code>) where the infringing material is located, sufficient for our engineering team to locate and disable the file.
                  </li>
                  <li>
                    <strong>Contact Details:</strong> Your full legal name, physical mailing address, telephone number, and official corporate email address.
                  </li>
                  <li>
                    <strong>Good Faith Statement:</strong> A statement that you have a good faith belief that the disputed use of the copyrighted material is not authorized by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    <strong>Accuracy Statement Under Penalty of Perjury:</strong> A statement that the information in your notice is accurate and, under penalty of perjury, that you are the copyright owner or authorized to act on the owner&apos;s behalf.
                  </li>
                  <li>
                    <strong>Signature:</strong> A physical or electronic signature of the copyright owner or authorized representative.
                  </li>
                </ol>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Statutory Warning:</strong> Under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that material or activity is infringing may be subject to civil liability for damages, including attorney&apos;s fees incurred by the alleged infringer or Role Nest.
                </span>
              </div>
            </section>

            {/* 4. DESIGNATED COPYRIGHT AGENT */}
            <section id="copyright-agent" className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Designated Copyright Agent Contact Details
              </h2>
              <p>
                All DMCA notices and intellectual property inquiries must be directed to our designated agent via email or postal mail:
              </p>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Designated Agent
                    </span>
                    <strong className="text-slate-900 text-sm">Role Nest Copyright Compliance Officer</strong>
                    <p className="text-slate-500">RitualDev Lab (Founder: Divyanshu Jethi)</p>
                  </div>

                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Dedicated DMCA Email
                    </span>
                    <a
                      href="mailto:copyright@rolenest.in"
                      className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5 text-sm"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      copyright@rolenest.in
                    </a>
                    <p className="text-slate-500">Cc: support@rolenest.in</p>
                  </div>

                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Response SLA
                    </span>
                    <p className="text-slate-700 font-semibold mt-0.5">
                      • Acknowledged within: <strong>24–48 Hours</strong>
                      <br />
                      • Takedown Execution: <strong>Within 72 Hours</strong>
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Postal Operating Address
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301, India
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. COUNTER-NOTIFICATION PROCEDURE */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                5. Counter-Notification Procedure (17 U.S.C. § 512(g)(3))
              </h2>
              <p>
                If your content was removed or access was disabled as a result of a DMCA takedown notice, and you believe this was done mistakenly or as a result of misidentification, you may submit a formal counter-notification to our Copyright Agent containing:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li>Identification of the material removed and the location/URL where it previously appeared.</li>
                <li>Your full name, address, telephone number, and email.</li>
                <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
                <li>A statement consenting to the jurisdiction of the federal or competent courts having jurisdiction, and that you will accept service of process from the original complainant.</li>
                <li>Your physical or electronic signature.</li>
              </ul>
              <p className="text-xs text-slate-600">
                Upon receipt of a valid counter-notice, Role Nest will forward a copy to the original claimant. If the copyright holder does not file a court action seeking an injunction within 10 to 14 business days, we may restore access to the disabled material.
              </p>
            </section>

            {/* 6. REPEAT INFRINGER POLICY */}
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                6. Repeat Infringer Policy
              </h2>
              <p>
                In compliance with 17 U.S.C. § 512(i)(1)(A), Role Nest maintains an explicit policy for the termination of user accounts of repeat copyright infringers. Users whose content is repeatedly removed pursuant to valid infringement notices face immediate account suspension, removal of repository sync access, and permanent revocation of developer tools access.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Role Nest DMCA &amp; IP Safe Harbor Compliance</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/privacy" className="hover:text-emerald-600 underline">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-emerald-600 underline">Terms of Service</Link>
                <Link href="/transparency" className="hover:text-emerald-600 underline">Transparency Standard</Link>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
