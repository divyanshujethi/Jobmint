import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowLeft, FileText, Building2, Mail, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms and Conditions",
  description: "Official terms of service, platform disclaimers, merchant of record policies, and subscription terms.",
  alternates: {
    canonical: "https://rolenest.in/terms",
  },
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
            Terms of Service &amp; User Agreement
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Last Updated: September 2026. Please read these terms carefully before accessing or using RoleNest.
          </p>
        </div>

        {/* CASHFREE PAYMENT GATEWAY MANDATORY DISCLOSURE */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 p-6 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-emerald-950 text-base">
            <CreditCard className="h-5 w-5 text-emerald-700 shrink-0" />
            Payment Processing Partner (Cashfree Payments)
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            All online payments, UPI transactions, cards, and NetBanking on RoleNest are securely processed by <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-authorized Payment Aggregator. Customer support and service inquiries are handled directly by RoleNest.
          </p>
        </div>

        {/* CRITICAL DISCLAIMER CALLOUT */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2.5 font-bold text-amber-900 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            Important Notice: No Employment or Internship Guarantee
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            <strong>RoleNest is an open, transparent discovery and proof-of-work hiring ecosystem.</strong> We provide verified listings, skill diagnostics, interactive course roadmaps, and recruiter tracking transparency.
            <strong> We DO NOT guarantee, warrant, or promise employment, internships, interview callbacks, offers, or compensation of any kind.</strong> All hiring choices, interview invitations, and final job decisions rest entirely within the independent discretion of third-party employers and companies.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Operator Identification &amp; Contact Information
              </h2>
              <p>
                RoleNest (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is operated by <strong>RitualDev Lab (Founder: Divyanshu Jethi)</strong>.
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-1.5 text-slate-700 font-mono">
                <div><strong>Platform Name:</strong> RoleNest (rolenest.in)</div>
                <div><strong>Operating Entity:</strong> RitualDev Lab (Divyanshu Jethi)</div>
                <div><strong>Registered Office / Address:</strong> Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301, India</div>
                <div><strong>Customer Support Email:</strong> support@rolenest.in</div>
                <div><strong>Corporate Inquiries:</strong> contact@rolenest.in</div>
                <div><strong>Support Response SLA:</strong> Within 24 to 48 business hours</div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                2. Acceptance of Terms
              </h2>
              <p>
                By registering, accessing, or using the RoleNest web application, API endpoints, feeds, or developer tools, you signify that you have read, understood, and agreed to be bound by these Terms, our <Link href="/privacy" className="text-emerald-700 underline font-semibold">Privacy Policy</Link>, and our <Link href="/refund" className="text-emerald-700 underline font-semibold">Refund &amp; Cancellation Policy</Link>. If you do not agree to these terms, you must discontinue use immediately.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Description of Digital Services
              </h2>
              <p>
                RoleNest operates a SaaS platform designed for software engineering students, freshers, and early-career tech professionals:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>Free Community Tier:</strong> Access to public job search, curated fresher internships with direct official application links, Problem of the Day (POTD), and visual skill canvases.</li>
                <li><strong>RoleNest Pro (Paid SaaS Subscription):</strong> Advanced ATS resume compatibility scoring, verified recruiter response telemetry, private resume vault, and priority application status tracking.</li>
                <li><strong>Employer Featured Boosts (One-Time Service):</strong> Verified employers may boost job listings for 30 days to highlight authentic openings to prospective candidates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Instant Digital Delivery Policy
              </h2>
              <p>
                All digital goods and services provided by RoleNest are delivered <strong>immediately upon successful payment authorization</strong>. No physical goods are shipped.
              </p>
              <p className="text-xs text-slate-600">
                Upon transaction completion via Cashfree Payments, your RoleNest account is instantly upgraded to Pro status, and an official transaction confirmation email containing your tax invoice and order reference number is immediately dispatched to your billing email address.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                5. Payments, Billing &amp; Taxes (Cashfree Payments)
              </h2>
              <p>
                All digital transactions are processed through <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-licensed Payment Aggregator supporting UPI (Google Pay, PhonePe, Paytm, CRED, BHIM), RuPay/Visa/Mastercard debit and credit cards, and NetBanking across all Indian banks.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>Candidate Pricing:</strong> RoleNest offers Campus Student Pass at ₹99/month (with verified student credentials), RoleNest Pro at ₹199/month or ₹1,499/year (Annual Pass). Standalone 1-on-1 Senior Staff Engineer Resume &amp; Mock Audits are available separately at ₹799/session.</li>
                <li><strong>Employer Pricing:</strong> Employer Featured Job Listings are ₹1,499 for 30 days of elevated placement.</li>
                <li><strong>Billing &amp; Access:</strong> Subscriptions grant instant access for the duration purchased (30 or 365 days). You can renew or manage your plan inside <Link href="/settings/account" className="text-emerald-700 underline font-semibold">Account Settings</Link>.</li>
                <li><strong>Taxes:</strong> All prices displayed on RoleNest are in Indian National Rupees (INR) and include all statutory taxes where applicable.</li>
                <li><strong>Payment Security:</strong> RoleNest never stores or accesses your raw card numbers, CVVs, or UPI MPINs. All payment processing takes place via Cashfree&apos;s RBI-compliant and PCI-DSS Level 1 certified infrastructure.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                6. 14-Day Refund &amp; Cancellation Policy
              </h2>
              <p>
                We stand behind the quality of RoleNest Pro. First-time subscribers are protected by our <strong>14-Day 100% Money-Back Guarantee</strong>.
              </p>
              <p className="text-xs text-slate-600">
                If you are not satisfied for any reason within 14 days of your initial purchase, you may claim a full refund by contacting <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a> with your Order ID or Payment reference number. Refunds are credited back to your original payment method (UPI account or bank card) within 3 to 7 business days via Cashfree Payments. For complete terms, see our <Link href="/refund" className="text-emerald-700 underline font-semibold">Refund &amp; Cancellation Policy</Link>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                7. Candidate Conduct &amp; Authenticity
              </h2>
              <p>
                Candidates agree to provide authentic information regarding their technical background, GitHub repositories, and resumes. Submitting fraudulent credentials, malicious code payloads, automated bots, or spam applications is grounds for permanent platform revocation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                8. Storage of Resume Data &amp; Privacy
              </h2>
              <p>
                Candidate resumes are stored securely with HMAC-SHA256 authenticated token access. We never sell, rent, or leak candidate resumes to commercial data brokers. Users retain the absolute right to delete their profile and stored resumes at any time under our <Link href="/privacy" className="text-emerald-700 underline font-semibold">Privacy Policy</Link>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                9. Public Job Listings, Aggregation &amp; Employer De-Listing
              </h2>
              <p>
                RoleNest indexes publicly accessible job opportunities and official ATS feeds (such as Greenhouse, Lever, Workday, Ashby, and BambooHR) to help candidates discover openings with direct employer application links:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>
                  <strong>Direct ATS Redirection:</strong> All application links redirect candidates directly to the employer&apos;s authoritative portal. RoleNest never acts as an unauthorized intermediary or alters application materials.
                </li>
                <li>
                  <strong>Verification Badge Transparency:</strong> A &ldquo;Verified ATS Link&rdquo; badge signifies that the application destination has been parsed and verified against an authentic, active employer career system.
                </li>
                <li>
                  <strong>Instant De-Listing SLA:</strong> Employers or authorized company representatives who wish to edit, close, or de-list a job posting or claim company pages may email <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a>. All verified de-listing requests are honored within <strong>24 business hours</strong>.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                10. Subscription Periods &amp; AI Compute Fair Use
              </h2>
              <p>
                Subscription passes (Campus Pass, RoleNest Pro, and Annual Super Pass) provide active digital features for the term selected (monthly or annual). AI-assisted generation tools (ATS scoring, STAR bullet generation, interview prep) remain subject to clearly defined per-tier generation quotas to safeguard infrastructure stability and prevent automated abuse.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                11. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, RoleNest, RitualDev Lab, and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or employment opportunities, arising out of your access to or use of the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                12. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Noida, Uttar Pradesh, India.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>Customer Inquiries: <a href="mailto:support@rolenest.in" className="text-emerald-700 font-semibold underline">support@rolenest.in</a></span>
              <div className="flex items-center gap-3">
                <Link href="/privacy" className="hover:text-emerald-600 underline">Privacy Policy</Link>
                <Link href="/refund" className="hover:text-emerald-600 underline">Refund Policy</Link>
                <Link href="/cancellation" className="hover:text-emerald-600 underline">Cancellation</Link>
                <Link href="/pricing" className="hover:text-emerald-600 underline">Pricing</Link>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}