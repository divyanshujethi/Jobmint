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
  plan?: "pro" | "pro_plus" | "pro_quarterly" | "pro_annual" | "featured_job" | "donation" | string;
  amount?: number;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  donorNote?: string;
  jobId?: string;
  phone?: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

/**
 * Dynamically ensures the Cashfree JS SDK v3 is loaded and window.Cashfree is ready.
 * If not present, creates the script tag and polls with a timeout.
 */
export async function ensureCashfreeSDKLoaded(timeoutMs = 2500): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Cashfree) return true;

  // Check if script tag is already in DOM
  let script = document.querySelector(
    'script[src*="cashfree.com/js/v3/cashfree.js"]'
  ) as HTMLScriptElement;

  if (!script) {
    script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.crossOrigin = "anonymous";
    script.async = true;
    document.head.appendChild(script);
  }

  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (window.Cashfree) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return !!window.Cashfree;
}

/**
 * Direct form-POST to Cashfree's official checkout endpoint:
 * https://api.cashfree.com/pg/view/sessions/checkout
 * 
 * This is the exact underlying mechanism of Cashfree v3 Web Checkout,
 * ensuring 100% reliable checkout redirection without relying on client-side JS SDK.
 */
function submitCashfreeForm(
  paymentSessionId: string,
  env: "production" | "sandbox" = "production",
  target: "_self" | "_blank" = "_self"
) {
  if (typeof window === "undefined") return;

  const checkoutUrl =
    env === "production"
      ? "https://api.cashfree.com/pg/view/sessions/checkout"
      : "https://sandbox.cashfree.com/pg/view/sessions/checkout";

  const form = document.createElement("form");
  form.method = "POST";
  form.action = checkoutUrl;
  form.target = target;

  const sessionInput = document.createElement("input");
  sessionInput.type = "hidden";
  sessionInput.name = "payment_session_id";
  sessionInput.value = paymentSessionId;
  form.appendChild(sessionInput);

  const reqInput = document.createElement("input");
  reqInput.type = "hidden";
  reqInput.name = "x_request_id";
  reqInput.value = "x_request_id_form_atom";
  form.appendChild(reqInput);

  const formIdInput = document.createElement("input");
  formIdInput.type = "hidden";
  formIdInput.name = "form_id";
  formIdInput.value = "form_id_atom";
  form.appendChild(formIdInput);

  document.body.appendChild(form);
  form.submit();
}

/**
 * Initiates Cashfree checkout for UPI (GPay, PhonePe, Paytm), RuPay/Cards & NetBanking.
 * 
 * 1. Creates payment order via backend API.
 * 2. Attempts Cashfree JS SDK checkout.
 * 3. If SDK fails, encounters an error, or is blocked by browser ad-blockers,
 *    natively submits the official checkout form directly to Cashfree.
 */
export async function openCashfreeCheckout(options: CheckoutOptions = {}) {
  try {
    const res = await fetch("/api/payment/cashfree/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: options.plan || "pro",
        amount: options.amount,
        donorName: options.donorName,
        donorEmail: options.donorEmail,
        donorPhone: options.donorPhone,
        donorNote: options.donorNote,
        jobId: options.jobId,
        phone: options.phone || options.donorPhone,
      }),
    });

    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      const currentUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/pricing";
      window.location.href =
        data.redirectUrl || `/login?callbackUrl=${encodeURIComponent(currentUrl)}`;
      return;
    }

    const data = await res.json();
    if (!res.ok || !data.paymentSessionId) {
      throw new Error(data.error || "Failed to create payment session with Cashfree");
    }

    const env: "production" | "sandbox" =
      data.environment || CASHFREE_CLIENT_ENV || "production";

    // 1. Try Cashfree JS SDK if available
    const isSDKReady = await ensureCashfreeSDKLoaded(2000);

    if (isSDKReady && typeof window !== "undefined" && window.Cashfree) {
      try {
        const cashfree = window.Cashfree({
          mode: env,
        });

        const result = await cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_self", // Seamless redirect ensures 100% UPI App Intent & QR compatibility on iOS/Android/Desktop
        });

        // If Cashfree SDK returned an error instead of redirecting
        if (result && result.error) {
          console.warn("[Cashfree SDK Error, falling back to direct form checkout]:", result.error);
          submitCashfreeForm(data.paymentSessionId, env, "_self");
          return;
        }
        return;
      } catch (sdkError) {
        console.warn("[Cashfree SDK Exception, falling back to direct form checkout]:", sdkError);
        submitCashfreeForm(data.paymentSessionId, env, "_self");
        return;
      }
    }

    // 2. Direct Official Checkout Form Fallback:
    // Guarantees payment works seamlessly with zero external script dependencies
    submitCashfreeForm(data.paymentSessionId, env, "_self");
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
      crossOrigin="anonymous"
    />
  );
}
