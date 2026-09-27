import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrder } from "@/lib/cashfree";
import { db, users, jobs, eq } from "@repo/database";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    console.log("[Cashfree Webhook Received]:", JSON.stringify(rawBody));

    const orderId =
      rawBody?.data?.order?.order_id ||
      rawBody?.data?.order_id ||
      rawBody?.order_id;

    if (!orderId) {
      return NextResponse.json({ received: true, note: "No order_id detected" }, { status: 200 });
    }

    // Direct server-to-server verification with Cashfree
    const order = await getCashfreeOrder(orderId);

    if (order.order_status === "PAID") {
      const customerEmail = order.customer_details.customer_email?.toLowerCase();
      const customerId = order.customer_details.customer_id;

      let durationDays = 30;
      let isFeaturedJob = false;

      if (orderId.includes("pro_annual")) {
        durationDays = 365;
      } else if (orderId.includes("pro_quarterly")) {
        durationDays = 90;
      } else if (orderId.includes("featured_job")) {
        isFeaturedJob = true;
      }

      const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

      if (!isFeaturedJob) {
        if (customerId && !customerId.startsWith("guest_")) {
          await db
            .update(users)
            .set({
              isPro: true,
              proExpiresAt: expiresAt,
              updatedAt: new Date(),
            })
            .where(eq(users.id, customerId));
        } else if (customerEmail) {
          await db
            .update(users)
            .set({
              isPro: true,
              proExpiresAt: expiresAt,
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail));
        }
        console.log(`[Cashfree Webhook] Pro membership activated for order ${orderId}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[Cashfree Webhook Error]:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
