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
  /**
   * '_modal': Seamless in-page popup modal overlay without leaving rolenest.in
   * '_self': Full page redirection to Cashfree checkout
   */
  redirectTarget?: "_modal" | "_self" | "_blank";
  onSuccess?: () => void;
  onError?: (err: any) => void;
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

  // Clean up any stale checkout form
  const existingForm = document.getElementById("rn-cashfree-checkout-form");
  if (existingForm) existingForm.remove();

  const form = document.createElement("form");
  form.id = "rn-cashfree-checkout-form";
  form.method = "POST";
  form.action = checkoutUrl;
  form.target = target;
  form.style.display = "none";

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
  HTMLFormElement.prototype.submit.call(form);
}

/**
 * Initiates Cashfree checkout for UPI (GPay, PhonePe, Paytm), RuPay/Cards & NetBanking.
 * 
 * 1. Creates payment order via backend API.
 * 2. Attempts to launch seamless in-page popup modal (_modal) via Cashfree JS SDK v3.
 * 3. Gracefully falls back to direct form redirection if SDK is blocked or unavailable.
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

    const target = options.redirectTarget || "_modal";

    // 1. Try seamless in-page popup modal if SDK is loaded and target is _modal
    if (target === "_modal" && typeof window !== "undefined" && typeof window.Cashfree === "function") {
      try {
        const cashfree = window.Cashfree({ mode: env });
        await cashfree.checkout({
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_modal",
        });
        return;
      } catch (sdkErr) {
        console.warn("[Cashfree SDK Modal Error, falling back to direct redirect]:", sdkErr);
      }
    }

    // 2. Direct Native Form Submission fallback or when target is _self:
    submitCashfreeForm(data.paymentSessionId, env, target === "_blank" ? "_blank" : "_self");
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
