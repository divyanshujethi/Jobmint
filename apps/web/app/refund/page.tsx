import Link from "next/link";
import { ShieldCheck, ArrowLeft, RefreshCw, HelpCircle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Refund and Cancellation Policy — Role Nest",
  description: "Official refund and cancellation policy for Role Nest subscriptions and featured job boosts.",
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
            Last Updated: September 2026. At Role Nest, customer satisfaction and fair business practices are our core priorities.
          </p>
        </div>

        {/* Merchant of Record Callout */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 space-y-2 text-xs sm:text-sm text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-base">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            Merchant of Record Notice
          </div>
          <p className="leading-relaxed">
            Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">1. Digital Service Delivery</h2>
              <p>
                All Role Nest digital products (including Role Nest Pro candidate subscriptions and Employer Featured Job Boosts) are delivered immediately upon successful transaction completion. You will instantly receive an automated confirmation receipt containing your order reference and tax invoice via email from Paddle.com.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">2. 7-Day Money-Back Guarantee (Role Nest Pro)</h2>
              <p>
                We offer a <strong>100% money-back guarantee for first-time subscribers</strong> of Role Nest Pro. If you are not satisfied with your experience, you may request a full refund within <strong>7 days</strong> of your initial purchase date.
              </p>
              <p className="text-xs text-slate-500">
                To claim your refund, simply email us at <strong className="text-slate-700">support@rolenest.in</strong> or contact Paddle support with your order reference number. Refunds are processed back to your original payment method within 3 to 7 business days.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">3. Subscription Cancellation Policy</h2>
              <p>
                You may cancel your recurring monthly Role Nest Pro subscription at any time without fees or penalties:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                <li><strong>Self-Service:</strong> Click &quot;Manage Subscription&quot; inside your Account Settings or click the management link provided in your Paddle email receipt.</li>
                <li><strong>Timing:</strong> Cancellation takes effect at the end of your current monthly billing period. You will retain full Pro privileges until the billing cycle concludes, and you will not be billed again.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">4. Employer Featured Job Boosts</h2>
              <p>
                Featured Job Boosts are one-time 30-day promotional placements that start immediately upon purchase. Because placement and search prominence are delivered instantly upon publication, Featured Job Boosts are non-refundable once the boosted listing is live on the site. However, if you experience a technical defect or your job is unpublished within 24 hours, contact us for full credit or refund.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">5. Contact Support</h2>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <Mail className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Role Nest Customer Support</div>
                  <div className="text-slate-600">Email: <a href="mailto:support@rolenest.in" className="text-emerald-700 underline font-semibold">support@rolenest.in</a></div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Paddle Customer Support: <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">https://paddle.net</a></div>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
