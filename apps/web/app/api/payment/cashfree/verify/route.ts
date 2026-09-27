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
      let durationMs = 30 * 24 * 60 * 60 * 1000; // default 1 month
      let isFeaturedJob = false;
      let planName = "pro";

      if (orderId.includes("test_5")) {
        durationMs = 10 * 60 * 1000; // 10 minutes
        planName = "test_5";
      } else if (orderId.includes("test_10") || orderId.includes("test")) {
        durationMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        planName = "test_10";
      } else if (orderId.includes("pro_annual")) {
        durationMs = 365 * 24 * 60 * 60 * 1000;
        planName = "pro_annual";
      } else if (orderId.includes("pro_quarterly")) {
        durationMs = 90 * 24 * 60 * 60 * 1000;
        planName = "pro_quarterly";
      } else if (orderId.includes("featured_job")) {
        isFeaturedJob = true;
        planName = "featured_job";
      }

      // 1. Activate Pro for the candidate with seamless extension/upgrading
      let expiresAt = new Date(Date.now() + durationMs);

      if (!isFeaturedJob) {
        const targetUserId =
          session?.user?.id ||
          (customerId && !customerId.startsWith("guest_") ? customerId : null);

        let existingUser: any = null;
        if (targetUserId) {
          const [u] = await db
            .select({ id: users.id, isPro: users.isPro, proExpiresAt: users.proExpiresAt, phone: users.phone })
            .from(users)
            .where(eq(users.id, targetUserId))
            .limit(1);
          existingUser = u;
        } else if (customerEmail) {
          const [u] = await db
            .select({ id: users.id, isPro: users.isPro, proExpiresAt: users.proExpiresAt, phone: users.phone })
            .from(users)
            .where(eq(users.email, customerEmail))
            .limit(1);
          existingUser = u;
        }

        const now = new Date();
        const baseDate =
          existingUser?.proExpiresAt && new Date(existingUser.proExpiresAt) > now
            ? new Date(existingUser.proExpiresAt)
            : now;

        expiresAt = new Date(baseDate.getTime() + durationMs);

        if (existingUser?.id) {
          const updatePayload: Record<string, any> = {
            isPro: true,
            proExpiresAt: expiresAt,
            updatedAt: new Date(),
          };

          const rawPhone = order.customer_details.customer_phone?.replace(/\D/g, "").slice(-10);
          if (rawPhone && rawPhone.length === 10 && !existingUser.phone) {
            updatePayload.phone = rawPhone;
          }

          await db
            .update(users)
            .set(updatePayload)
            .where(eq(users.id, existingUser.id));
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
