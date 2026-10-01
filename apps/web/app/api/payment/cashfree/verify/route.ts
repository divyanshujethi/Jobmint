import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCashfreeOrder } from "@/lib/cashfree";
import { db, users, jobs, eq, sql } from "@repo/database";

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

      // Handle Community Donation
      if (orderId.includes("don_") || orderId.includes("donation")) {
        try {
          await db.execute(sql`
            CREATE TABLE IF NOT EXISTS community_donations (
              id VARCHAR(64) PRIMARY KEY,
              order_id VARCHAR(128) UNIQUE NOT NULL,
              amount NUMERIC(10, 2) NOT NULL,
              donor_name VARCHAR(255),
              donor_email VARCHAR(255),
              donor_phone VARCHAR(32),
              donor_note TEXT,
              gateway VARCHAR(32) DEFAULT 'cashfree',
              status VARCHAR(32) DEFAULT 'PAID',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            INSERT INTO community_donations (id, order_id, amount, donor_name, donor_email, donor_phone, donor_note, gateway, status)
            VALUES (${order.order_id}, ${order.order_id}, ${order.order_amount}, ${order.customer_details?.customer_name || 'Community Supporter'}, ${customerEmail || ''}, ${order.customer_details?.customer_phone || ''}, ${order.order_note || ''}, 'cashfree', 'PAID')
            ON CONFLICT (order_id) DO NOTHING;
          `);
        } catch (e) {
          console.error("[Donation Save Error]:", e);
        }

        return NextResponse.json({
          success: true,
          orderStatus: order.order_status,
          isPaid: true,
          plan: "donation",
          amount: order.order_amount,
          orderId: order.order_id,
          donorName: order.customer_details.customer_name,
        });
      }

      // Determine duration based on order_id pattern
      let durationMs = 30 * 24 * 60 * 60 * 1000; // default 1 month
      let isFeaturedJob = false;
      let planName = "pro";

      if (orderId.includes("lifetime")) {
        durationMs = 100 * 365 * 24 * 60 * 60 * 1000;
        planName = "lifetime";
      } else if (orderId.includes("pro_annual")) {
        durationMs = 365 * 24 * 60 * 60 * 1000;
        planName = "pro_annual";
      } else if (orderId.includes("pro_quarterly") || orderId.includes("pro_plus")) {
        durationMs = 90 * 24 * 60 * 60 * 1000;
        planName = "pro_plus";
      } else if (orderId.includes("student_semester")) {
        durationMs = 180 * 24 * 60 * 60 * 1000;
        planName = "student";
      } else if (orderId.includes("student")) {
        durationMs = 30 * 24 * 60 * 60 * 1000;
        planName = "student";
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
            planTier: planName,
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
