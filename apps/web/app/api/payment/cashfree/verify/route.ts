import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCashfreeOrder } from "@/lib/cashfree";
import { db, users, jobs, eq } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "order_id query parameter is required" }, { status: 400 });
    }

    const order = await getCashfreeOrder(orderId);
    const isPaid = order.order_status === "PAID";

    if (isPaid) {
      const session = await auth();
      const customerEmail = order.customer_details.customer_email?.toLowerCase();
      const customerId = order.customer_details.customer_id;

      // Determine duration based on order_id pattern
      let durationDays = 30; // default 1 month
      let isFeaturedJob = false;
      let planName = "pro";

      if (orderId.includes("pro_annual")) {
        durationDays = 365;
        planName = "pro_annual";
      } else if (orderId.includes("pro_quarterly")) {
        durationDays = 90;
        planName = "pro_quarterly";
      } else if (orderId.includes("featured_job")) {
        isFeaturedJob = true;
        planName = "featured_job";
      }

      const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

      // 1. Activate Pro for the candidate
      if (!isFeaturedJob) {
        if (session?.user?.id) {
          await db
            .update(users)
            .set({
              isPro: true,
              proExpiresAt: expiresAt,
              updatedAt: new Date(),
            })
            .where(eq(users.id, session.user.id));
        } else if (customerId && !customerId.startsWith("guest_")) {
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
      }

      return NextResponse.json({
        success: true,
        orderStatus: order.order_status,
        isPaid: true,
        plan: planName,
        amount: order.order_amount,
        orderId: order.order_id,
        expiresAt,
      });
    }

    return NextResponse.json({
      success: false,
      orderStatus: order.order_status,
      isPaid: false,
      orderId: order.order_id,
    });
  } catch (error: any) {
    console.error("[Cashfree Verify Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify Cashfree order" },
      { status: 500 }
    );
  }
}
