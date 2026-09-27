"use client";

import Script from "next/script";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "production" | "sandbox" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_modal" | "_self" | "_blank";
        returnUrl?: string;
      }) => Promise<any>;
    };
  }
}

export const CASHFREE_CLIENT_ENV =
  (process.env.NEXT_PUBLIC_CASHFREE_ENV as "production" | "sandbox") || "production";

export interface CheckoutOptions {
  plan?: "pro" | "pro_quarterly" | "pro_annual" | "featured_job";
  jobId?: string;
  phone?: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

/**
 * Initiates Cashfree checkout for UPI (GPay, PhonePe, Paytm), RuPay/Cards & NetBanking
 */
export async function openCashfreeCheckout(options: CheckoutOptions = {}) {
  try {
    const res = await fetch("/api/payment/cashfree/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: options.plan || "pro",
        jobId: options.jobId,
        phone: options.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.paymentSessionId) {
      throw new Error(data.error || "Failed to create payment session with Cashfree");
    }

    if (typeof window === "undefined" || !window.Cashfree) {
      // Fallback: If script not yet loaded, redirect to return URL or warn
      alert("Payment gateway is initializing. Please click again in 2 seconds.");
      return;
    }

    const cashfree = window.Cashfree({
      mode: CASHFREE_CLIENT_ENV,
    });

    await cashfree.checkout({
      paymentSessionId: data.paymentSessionId,
      redirectTarget: "_self", // Seamless redirect ensures 100% UPI App Intent & QR compatibility on iOS/Android/Desktop
    });
  } catch (error: any) {
    console.error("[Cashfree Checkout Error]:", error);
    if (options.onError) {
      options.onError(error);
    } else {
      alert(error.message || "Failed to launch payment checkout. Please try again.");
    }
  }
}

export function CashfreeProvider() {
  return (
    <Script
      src="https://sdk.cashfree.com/js/v3/cashfree.js"
      strategy="afterInteractive"
    />
  );
}
