import Link from "next/link";
import { ShieldCheck, ArrowLeft, RefreshCw, Mail, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Refund and Cancellation Policy — RoleNest",
  description: "Official 14-day refund and cancellation policy for RoleNest Pro subscriptions and featured job boosts via Cashfree Payments.",
  alternates: {
    canonical: "https://rolenest.in/refund",
  },
};

export default function RefundPage() {
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
            <RefreshCw className="h-3.5 w-3.5 text-emerald-600" /> Consumer Protection &amp; Satisfaction
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Last Updated: September 2026. Transparent, fair, and customer-first cancellation and refund guidelines.
          </p>
        </div>

        {/* CASHFREE PAYMENT GATEWAY MANDATORY DISCLOSURE */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 p-6 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-emerald-950 text-base">
            <CreditCard className="h-5 w-5 text-emerald-700 shrink-0" />
            Payment Gateway Notice
          </div>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            Transactions are processed through Cashfree Payments India Pvt. Ltd. (RBI Authorized Payment Aggregator). Role Nest directly handles all candidate customer service inquiries, billing support, and refund processing.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-8 text-sm text-slate-700 leading-relaxed">
            
            {/* SECTION 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                1. 14-Day 100% Money-Back Guarantee (Role Nest Pro)
              </h2>
              <p>
                We want you to be completely satisfied with your purchase. Every first-time subscriber to <strong>Role Nest Pro</strong> is covered by our unconditional <strong>14-Day Money-Back Guarantee</strong>.
              </p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs sm:text-sm text-emerald-950 space-y-2">
                <p>
                  <strong>Eligibility:</strong> If you are not satisfied with Role Nest Pro for any reason, you may request a 100% full refund within <strong>14 calendar days</strong> from the initial purchase date. No questions asked.
                </p>
                <p>
                  <strong>How to Claim Your Refund:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700">
                  <li>Email our support desk at <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a> or <a href="mailto:contact@rolenest.in" className="text-emerald-700 underline font-semibold">contact@rolenest.in</a> with your <strong>Role Nest Order ID or Cashfree Reference ID</strong> (found in your email receipt).</li>
                  <li>Our team will verify the payment and authorize the refund back to your source account within 24 hours.</li>
                </ol>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                2. Refund Processing Timeframe &amp; Method
              </h2>
              <p>
                Once approved, refunds are initiated immediately:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Refunds are credited back to the <strong>original payment method</strong> used during checkout (UPI ID, Debit Card, Credit Card, or NetBanking).</li>
                <li>Processing times depend on your bank and UPI network, typically reflecting in your account within <strong>3 to 7 business days</strong>.</li>
                <li>You will receive an automated refund notification once Cashfree Payments completes the transfer.</li>
              </ul>
            </section>

            {/* SECTION 2.5: INTERNSHIP BOOTCAMPS */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
                3. Industrial Internship Bootcamps — 7-Day Money-Back Guarantee
              </h2>
              <p>
                All student enrollments in RoleNest 3–4 Week Industrial Internship Bootcamps (hosted at <code>internship.rolenest.in</code>) are backed by our transparent <strong>7-Day Money-Back Guarantee</strong>:
              </p>
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 text-xs sm:text-sm text-teal-950 space-y-2">
                <p>
                  <strong>Eligibility:</strong> Students may request a 100% full refund within <strong>7 calendar days</strong> of enrollment if unsatisfied with the curriculum or practical labs.
                </p>
                <p>
                  <strong>Certificate Exception:</strong> Once a student has submitted their final Capstone Project and generated an official verifiable Certificate ID registered on the public ledger, fees become non-refundable to maintain academic integrity and university trust.
                </p>
                <p>
                  <strong>Claim Process:</strong> Email <a href="mailto:refunds@rolenest.in" className="text-teal-700 underline font-semibold">refunds@rolenest.in</a> with your enrolled track and order details for instant processing within 5–7 banking days via Cashfree Payments.
                </p>
              </div>
            </section>

            {/* SECTION 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                3. Subscription Cancellation Policy
              </h2>
              <p>
                You have complete freedom to manage or cancel your subscription plan at any time:
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-700">
                <div>
                  <strong>Method 1 (Account Settings):</strong> You can review your plan status and expiry date inside your Role Nest dashboard under <Link href="/settings/account" className="text-emerald-700 underline font-semibold">Settings &gt; Account &gt; Billing</Link>.
                </div>
                <div>
                  <strong>Method 2 (Email Support):</strong> Contact us at <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a> requesting cancellation or non-renewal, and our team will process it within 24 hours.
                </div>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                  <strong>Effective Date:</strong> Upon cancellation or expiration, your Pro benefits remain active until the end of your prepaid period (30, 90, or 365 days).
                </div>
              </div>
            </section>

            {/* SECTION 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">
                4. Instant Digital Service Delivery
              </h2>
              <p>
                All digital services provided by Role Nest are delivered <strong>instantaneously upon successful payment</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                <li>Your Role Nest account is instantly upgraded to Pro status with unrestricted access to recruiter response rates, ATS resume diagnostics, and tracking tools.</li>
                <li>Your official payment receipt and tax invoice are immediately dispatched by email.</li>
                <li>Because services are 100% digital, there are no physical shipping fees, packaging costs, or delivery delays.</li>
              </ul>
            </section>

            {/* SECTION 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">
                5. Employer Featured Job Boosts
              </h2>
              <p>
                Employer Featured Job Boosts are one-time 30-day promotional placements that start immediately upon purchase. Because placement and search prominence are delivered instantly upon publication, Featured Job Boosts are non-refundable once the boosted listing is live on the site.
              </p>
              <p className="text-xs text-slate-500">
                However, if you experience a verified technical defect, billing duplicate, or your job is unpublished within 24 hours of purchase, please contact support for an immediate full refund or complimentary reposting credit.
              </p>
            </section>

            {/* SECTION 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">
                6. Customer Support Contact Information
              </h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs space-y-2 text-slate-700">
                <div><strong>Operating Business:</strong> Role Nest (RitualDev Lab / Divyanshu Jethi)</div>
                <div><strong>Registered Office / Address:</strong> Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301, India</div>
                <div><strong>Customer Support Email:</strong> <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a></div>
                <div><strong>Corporate Inquiries:</strong> <a href="mailto:contact@rolenest.in" className="text-emerald-700 underline font-semibold">contact@rolenest.in</a></div>
                <div><strong>Support SLA:</strong> Guaranteed reply within 24 to 48 business hours</div>
              </div>
            </section>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>Customer Care: <a href="mailto:support@rolenest.in" className="text-emerald-700 font-semibold underline">support@rolenest.in</a></span>
              <div className="flex items-center gap-3">
                <Link href="/terms" className="hover:text-emerald-600 underline">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-emerald-600 underline">Privacy Policy</Link>
                <Link href="/pricing" className="hover:text-emerald-600 underline">Pricing</Link>
                <Link href="/settings/account" className="hover:text-emerald-600 underline">Manage Subscription</Link>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
