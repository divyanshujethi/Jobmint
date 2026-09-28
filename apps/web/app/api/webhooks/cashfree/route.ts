import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrder } from "@/lib/cashfree";
import { db, users, jobs, eq, sql } from "@repo/database";

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

      // Handle Community Donation
      if (orderId.includes("don_") || orderId.includes("donation")) {
        console.log(`[Cashfree Webhook] Verified donation received: ₹${order.order_amount} for order ${orderId}`);
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
          console.error("[Donation Webhook Save Error]:", e);
        }

        return NextResponse.json({ received: true, type: "donation", amount: order.order_amount }, { status: 200 });
      }

      let durationMs = 30 * 24 * 60 * 60 * 1000;
      let isFeaturedJob = false;

      if (orderId.includes("pro_annual")) {
        durationMs = 365 * 24 * 60 * 60 * 1000;
      } else if (orderId.includes("pro_quarterly")) {
        durationMs = 90 * 24 * 60 * 60 * 1000;
      } else if (orderId.includes("featured_job")) {
        isFeaturedJob = true;
      }

      if (!isFeaturedJob) {
        let existingUser: any = null;
        if (customerId && !customerId.startsWith("guest_")) {
          const [u] = await db
            .select({ id: users.id, isPro: users.isPro, proExpiresAt: users.proExpiresAt, phone: users.phone })
            .from(users)
            .where(eq(users.id, customerId))
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

        const expiresAt = new Date(baseDate.getTime() + durationMs);

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

          console.log(`[Cashfree Webhook] Pro membership extended/activated until ${expiresAt.toISOString()} for order ${orderId}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[Cashfree Webhook Error]:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
