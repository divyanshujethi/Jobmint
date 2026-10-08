"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

function PaymentVerificationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const planParam = searchParams.get("plan");

  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentHost, setCurrentHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.host.toLowerCase());
    }
  }, []);

  const isDonationHost = currentHost.includes("donation.") || currentHost.includes("donate.");
  const isInternshipHost = currentHost.includes("internship.") || currentHost.includes("internships.");

  const isDonation =
    isDonationHost ||
    planParam === "donation" ||
    details?.plan === "donation" ||
    Boolean(orderId && (orderId.startsWith("rn_don_") || orderId.includes("don_") || orderId.includes("donation")));

  const isInternship =
    isInternshipHost ||
    Boolean(planParam && (planParam.startsWith("bootcamp") || planParam.startsWith("internship"))) ||
    Boolean(details?.plan && (details.plan.startsWith("bootcamp") || details.plan.startsWith("internship"))) ||
    Boolean(orderId && (orderId.startsWith("rn_bootcamp_") || orderId.startsWith("rn_intern_")));

  const isFeaturedJob =
    details?.plan === "featured_job" ||
    details?.plan === "hiring_sprint" ||
    Boolean(orderId && orderId.includes("featured_job"));

  // Target destinations based on domain/context
  const successDestination = isDonation
    ? (isDonationHost ? "/?donation=success&order_id=" + encodeURIComponent(orderId || "") : "https://donation.rolenest.in/?donation=success&order_id=" + encodeURIComponent(orderId || ""))
    : isInternship
      ? "https://internship.rolenest.in/portal"
      : isFeaturedJob
        ? "https://rolenest.in/employer/jobs"
        : "https://rolenest.in/jobs";

  const successButtonText = isDonation
    ? "Return to Community Fund"
    : isInternship
      ? "Go to Student Portal & Workspace"
      : isFeaturedJob
        ? "Go to Employer Dashboard"
        : "Explore Verified Job Links";

  const cancelDestination = isDonation
    ? (isDonationHost ? "/?donation=cancelled" : "https://donation.rolenest.in/?donation=cancelled")
    : isInternship
      ? "https://internship.rolenest.in/?payment=cancelled"
      : "https://rolenest.in/pricing";

  const cancelButtonText = isDonation
    ? "Return to Donation Page"
    : isInternship
      ? "Return to Internship Programs"
      : "Return to Pricing";

  useEffect(() => {
    if (!orderId) {
      setError("No order reference provided in callback URL.");
      setLoading(false);
      return;
    }

    // Call backend verification endpoint
    fetch(`/api/payment/cashfree/verify?order_id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isPaid) {
          setIsPaid(true);
          setDetails(data);
        } else {
          setIsPaid(false);
          setDetails(data);
          setError(
            data.orderStatus === "ACTIVE"
              ? "Payment is still processing or was not completed. If funds were debited, your account will update automatically within 5 minutes."
              : "Payment was not completed."
          );
        }
      })
      .catch((err) => {
        console.error("Verification failed:", err);
        setError("Unable to confirm payment status at this moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  // Automated countdown redirect
  useEffect(() => {
    if (loading) return;

    const targetUrl = isPaid ? successDestination : cancelDestination;
    let secondsLeft = isPaid ? 3 : 4;
    setCountdown(secondsLeft);

    const timer = setInterval(() => {
      secondsLeft -= 1;
      setCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(timer);
        window.location.href = targetUrl;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isPaid, successDestination, cancelDestination]);

  return (
    <div className="flex min-h-[82vh] flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-slate-200/90 shadow-xl bg-white text-center">
        {loading ? (
          <CardContent className="py-12 space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Verifying Payment with Cashfree...</h3>
            <p className="text-xs text-slate-500">
              Please do not refresh. Confirming transaction and updating records...
            </p>
          </CardContent>
        ) : isPaid ? (
          <>
            <CardHeader className="space-y-2 pb-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm animate-in zoom-in-50">
                {isDonation ? (
                  <Heart className="h-8 w-8 text-rose-600 fill-rose-500" />
                ) : (
                  <CheckCircle2 className="h-8 w-8" />
                )}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold text-emerald-800 mx-auto">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                {isDonation
                  ? "RitualDev & RoleNest Supporter"
                  : isInternship
                    ? "Internship Admission Confirmed"
                    : "RoleNest Pro Activated"}
              </div>
              <CardTitle className="text-2xl font-black text-slate-900">
                {isDonation ? "Donation Received! Thank You ❤️" : "Payment Successful!"}
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">
                {isDonation
                  ? "Your contribution powers free developer tools and ad-free career resources for students across India."
                  : isInternship
                    ? "Your industrial internship appointment letter and college NOC have been confirmed."
                    : "Thank you for your purchase. Your account has been upgraded."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Gateway:</span>
                  <span className="font-semibold text-emerald-800">Cashfree Payments (India)</span>
                </div>
                {details?.amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Amount:</span>
                    <span className="font-bold text-slate-900">₹{details.amount}</span>
                  </div>
                )}
                {isDonation ? (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Initiative:</span>
                    <span className="font-semibold text-emerald-900">RitualDev Lab &amp; RoleNest</span>
                  </div>
                ) : details?.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Pro Valid Until:</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(details.expiresAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100 text-left">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {isDonation
                    ? "On behalf of the engineering teams at RitualDev (ritualdev.in) and RoleNest (rolenest.in), we deeply appreciate your generosity."
                    : isInternship
                      ? "Access your live day-by-day labs and verified academic credentials in the student portal."
                      : "All Pro features are now unlocked on your profile: Unlimited ATS matching, POTD streaks, and priority application tracking."}
                </span>
              </div>

              {countdown !== null && countdown > 0 && (
                <div className="text-[11px] font-medium text-slate-500 animate-pulse">
                  Redirecting in {countdown}s...
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-2">
              <a
                href={successDestination}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>{successButtonText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              {isDonation && (
                <div className="flex flex-col gap-1 pt-1">
                  <a
                    href="https://rolenest.in/jobs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-emerald-700 transition-colors"
                  >
                    Explore RoleNest Tech Careers Platform (rolenest.in) →
                  </a>
                  <a
                    href="https://ritualdev.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-emerald-700 transition-colors"
                  >
                    Visit RitualDev Lab (ritualdev.in) →
                  </a>
                </div>
              )}
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-2 pb-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
                <XCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Payment Incomplete
              </CardTitle>
              <CardDescription className="text-xs text-rose-600">
                {error || "Your transaction could not be verified."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                If the amount was deducted from your bank account or UPI app, it will be credited automatically, or you can contact support with your order reference.
              </p>
              {orderId && (
                <div className="rounded-lg bg-slate-100 p-2 font-mono text-[11px] text-slate-700">
                  Reference: {orderId}
                </div>
              )}
              {countdown !== null && countdown > 0 && (
                <div className="text-[11px] font-medium text-slate-500 animate-pulse">
                  Returning in {countdown}s...
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-2">
              <a
                href={cancelDestination}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                {cancelButtonText}
              </a>
              <a
                href="mailto:support@rolenest.in"
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                Contact Support (support@rolenest.in)
              </a>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[82vh] items-center justify-center text-xs font-mono text-slate-400">Verifying transaction...</div>}>
      <PaymentVerificationContent />
    </Suspense>
  );
}
