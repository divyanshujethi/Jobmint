import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCashfreeOrder } from "@/lib/cashfree";
import crypto from "node:crypto";

const PLAN_AMOUNTS: Record<string, number> = {
  test_10: 10,
  test: 10,
  pro: 499,
  pro_quarterly: 1199,
  pro_annual: 3999,
  featured_job: 7999,
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      const referer = req.headers.get("referer");
      let callbackPath = "/pricing";
      try {
        if (referer) {
          const refUrl = new URL(referer);
          callbackPath = refUrl.pathname + refUrl.search;
        }
      } catch {}

      return NextResponse.json(
        {
          error: "Please sign in or create an account before proceeding with payment.",
          code: "UNAUTHORIZED",
          redirectUrl: `/login?callbackUrl=${encodeURIComponent(callbackPath)}`,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { plan = "pro", jobId, phone } = body;

    const amount = PLAN_AMOUNTS[plan] ?? 499;

    // Determine customer details from authenticated session
    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name || "Role Nest Candidate";

    // Clean Indian phone number (default 9876543210 if empty)
    let cleanPhone = (phone || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      cleanPhone = "9876543210";
    }

    const uniqueSuffix = Date.now().toString(36);
    const orderId = `rn_${plan}_${uniqueSuffix}`;

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://rolenest.in";
    const returnUrl = `${origin}/payment/verify?order_id={order_id}`;
    const notifyUrl = `${origin}/api/webhooks/cashfree`;

    const tags: Record<string, string> = {
      plan,
      userId: session?.user?.id || "",
      userEmail,
    };
    if (jobId) {
      tags.jobId = jobId;
    }

    const order = await createCashfreeOrder({
      orderId,
      orderAmount: amount,
      customerDetails: {
        customerId: userId,
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: cleanPhone,
      },
      returnUrl,
      notifyUrl,
      orderNote: `Role Nest - ${plan.toUpperCase()}`,
      orderTags: tags,
    });

    return NextResponse.json({
      success: true,
      paymentSessionId: order.payment_session_id,
      orderId: order.order_id,
      cfOrderId: order.cf_order_id,
      amount,
      plan,
    });
  } catch (error: any) {
    console.error("[Cashfree Create Order Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
