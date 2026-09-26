import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowLeft, FileText, Building2, Mail, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms and Conditions — Role Nest",
  description: "Official terms of service, platform disclaimers, merchant of record policies, and subscription terms.",
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
            Last Updated: September 2026. Please read these terms carefully before accessing or using Role Nest.
          </p>
        </div>

        {/* PADDLE MERCHANT OF RECORD MANDATORY DISCLOSURE */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 p-6 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-emerald-950 text-base">
            <CreditCard className="h-5 w-5 text-emerald-700 shrink-0" />
            Merchant of Record Disclosure
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
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
          <CardContent className="p-6 sm:p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Operator Identification &amp; Contact Information
              </h2>
              <p>
                Role Nest (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is operated by <strong>RitualDev Lab (Founder: Divyanshu Jethi)</strong>.
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-1.5 text-slate-700 font-mono">
                <div><strong>Platform Name:</strong> Role Nest (rolenest.in)</div>
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
                By registering, accessing, or using the Role Nest web application, API endpoints, feeds, or developer tools, you signify that you have read, understood, and agreed to be bound by these Terms, our <Link href="/privacy" className="text-emerald-700 underline font-semibold">Privacy Policy</Link>, and our <Link href="/refund" className="text-emerald-700 underline font-semibold">Refund &amp; Cancellation Policy</Link>. If you do not agree to these terms, you must discontinue use immediately.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Description of Digital Services
              </h2>
              <p>
                Role Nest operates a SaaS platform designed for software engineering students, freshers, and early-career tech professionals:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>Free Community Tier:</strong> Access to public job search, curated fresher internships with direct official application links, Problem of the Day (POTD), and visual skill canvases.</li>
                <li><strong>Role Nest Pro (Paid SaaS Subscription):</strong> Advanced ATS resume compatibility scoring, verified recruiter response telemetry, private resume vault, and priority application status tracking.</li>
                <li><strong>Employer Featured Boosts (One-Time Service):</strong> Verified employers may boost job listings for 30 days to highlight authentic openings to prospective candidates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                4. Instant Digital Delivery Policy
              </h2>
              <p>
                All digital goods and services provided by Role Nest are delivered <strong>immediately upon successful payment authorization</strong>. No physical goods are shipped.
              </p>
              <p className="text-xs text-slate-600">
                Upon transaction completion via Paddle.com, your Role Nest account is instantly upgraded to Pro status, and an official transaction confirmation email containing your tax invoice and order reference number is immediately dispatched to your billing email address by Paddle.com.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                5. Payments, Recurring Billing &amp; Taxes (Paddle.com)
              </h2>
              <p>
                Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle handles all customer service inquiries and returns related to payments.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>Pricing:</strong> Role Nest Pro is offered at ₹499/month (or equivalent currency displayed at checkout).</li>
                <li><strong>Recurring Billing:</strong> Subscriptions auto-renew monthly until cancelled. You may cancel at any time with 1-click via the self-service link in your Paddle receipt or in <Link href="/settings/account" className="text-emerald-700 underline font-semibold">Account Settings</Link>.</li>
                <li><strong>Taxes:</strong> All applicable Goods and Services Tax (GST), Value Added Tax (VAT), and sales taxes are calculated and collected by Paddle.com as Merchant of Record at checkout based on your geographic location.</li>
                <li><strong>Payment Security:</strong> Role Nest never collects, stores, or accesses your credit card, debit card, or UPI banking credentials. All payment processing conforms to strict PCI-DSS Level 1 certification managed by Paddle.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                6. 14-Day Refund &amp; Cancellation Policy
              </h2>
              <p>
                We stand behind the quality of Role Nest Pro. First-time subscribers are protected by our <strong>14-Day 100% Money-Back Guarantee</strong>.
              </p>
              <p className="text-xs text-slate-600">
                If you are not satisfied for any reason within 14 days of your initial purchase, you may claim a full refund by contacting <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a> with your Paddle Order ID, or by contacting Paddle directly at <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">https://paddle.net</a>. Refunds are credited back to your original payment method within 3 to 7 business days. For complete terms, see our <Link href="/refund" className="text-emerald-700 underline font-semibold">Refund &amp; Cancellation Policy</Link>.
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
                9. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, Role Nest, RitualDev Lab, and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or employment opportunities, arising out of your access to or use of the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                10. Governing Law &amp; Dispute Resolution
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