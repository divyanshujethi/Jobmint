"use client";

import Script from "next/script";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (options: { token: string; eventCallback?: (data: any) => void }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, any>;
          customer?: { email?: string };
          settings?: {
            displayMode?: "overlay" | "inline";
            theme?: "light" | "dark";
            locale?: string;
            successUrl?: string;
          };
        }) => void;
      };
    };
  }
}

export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "live_340547ac594032ec379e04705df";
export const PADDLE_PRO_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || "pri_01m3bwpwtps09hkztpjz0d3dnd";
export const PADDLE_FEATURED_JOB_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_FEATURED_JOB_PRICE_ID || "pri_01m3bwq2xvg6rnjy5ycpj811v8";

export function openPaddleCheckout({
  priceId,
  userId,
  userEmail,
  jobId,
  plan,
  successUrl,
}: {
  priceId: string;
  userId?: string;
  userEmail?: string;
  jobId?: string;
  plan?: string;
  successUrl?: string;
}) {
  if (typeof window === "undefined" || !window.Paddle) {
    alert("Payment system is still initializing. Please retry in 3 seconds.");
    return;
  }

  const customData: Record<string, any> = {};
  if (userId) customData.userId = userId;
  if (userEmail) customData.userEmail = userEmail;
  if (jobId) customData.jobId = jobId;
  if (plan) customData.plan = plan;

  window.Paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData,
    customer: userEmail ? { email: userEmail } : undefined,
    settings: {
      displayMode: "overlay",
      theme: "light",
      locale: "en",
      successUrl: successUrl || window.location.href,
    },
  });
}

export function PaddleProvider() {
  const onPaddleLoad = () => {
    if (window.Paddle) {
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (data: any) => {
          if (data?.name === "checkout.completed") {
            window.location.reload();
          }
        },
      });
    }
  };

  return (
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      strategy="afterInteractive"
      onLoad={onPaddleLoad}
    />
  );
}
