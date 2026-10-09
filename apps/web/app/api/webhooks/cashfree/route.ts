import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrder, verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { db, users, jobs, eq, sql } from "@repo/database";

export async function POST(req: NextRequest) {
  // Set once this delivery has atomically claimed the order; released if fulfilment fails
  // so that Cashfree's retry can try again instead of the payment being silently lost.
  let claimedOrderId: string | null = null;
  try {
    const rawBodyText = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    // Cryptographic HMAC-SHA256 Signature Verification
    if (signature && timestamp) {
      const isValid = verifyCashfreeWebhookSignature({
        rawBody: rawBodyText,
        signature,
        timestamp,
      });

      if (!isValid) {
        console.error("[Cashfree Webhook Rejected]: Invalid HMAC signature or timestamp drift.");
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    } else if (process.env.NODE_ENV !== "development" && process.env.ALLOW_UNSIGNED_WEBHOOKS !== "1") {
      // Fail closed: unsigned webhooks are only accepted in local development.
      console.error("[Cashfree Webhook Rejected]: Missing webhook signature or timestamp headers.");
      return NextResponse.json({ error: "Missing required signature headers" }, { status: 401 });
    }

    let rawBody: any = {};
    try {
      rawBody = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const orderId =
      rawBody?.data?.order?.order_id ||
      rawBody?.data?.order_id ||
      rawBody?.order_id;

    // Log the order id only: the payload contains customer name, email and phone.
    console.log("[Cashfree Webhook Received]: order", orderId ?? "(none)");

    if (!orderId) {
      return NextResponse.json({ received: true, note: "No order_id detected" }, { status: 200 });
    }

    // Initialize processed_orders idempotency ledger
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS processed_orders (
        order_id VARCHAR(128) PRIMARY KEY,
        amount NUMERIC(10, 2),
        customer_email VARCHAR(255),
        plan VARCHAR(64),
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if this order was already processed
    const alreadyProcessed: any = await db.execute(sql`
      SELECT order_id FROM processed_orders WHERE order_id = ${orderId} LIMIT 1;
    `);
    const processedRows = Array.isArray(alreadyProcessed) ? alreadyProcessed : (alreadyProcessed?.rows || []);

    if (processedRows.length > 0) {
      console.log(`[Cashfree Webhook Idempotency]: Order ${orderId} has already been fulfilled. Skipping duplicate.`);
      return NextResponse.json({ received: true, duplicate: true, orderId }, { status: 200 });
    }

    // Direct server-to-server verification with Cashfree
    const order = await getCashfreeOrder(orderId);

    if (order.order_status === "PAID") {
      // Atomically claim the order. The SELECT above is only a cheap pre-check: two concurrent
      // deliveries can both pass it, but only one INSERT ... RETURNING can win.
      const claim: any = await db.execute(sql`
        INSERT INTO processed_orders (order_id, amount, customer_email, plan)
        VALUES (${order.order_id}, ${order.order_amount}, ${order.customer_details?.customer_email?.toLowerCase() || ""}, 'claimed')
        ON CONFLICT (order_id) DO NOTHING
        RETURNING order_id;
      `);
      const claimedRows = Array.isArray(claim) ? claim : (claim?.rows || []);
      if (claimedRows.length === 0) {
        console.log(`[Cashfree Webhook Idempotency]: Order ${orderId} was claimed by a concurrent delivery. Skipping.`);
        return NextResponse.json({ received: true, duplicate: true, orderId }, { status: 200 });
      }
      claimedOrderId = String(order.order_id);

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
          `);
          await db.execute(sql`
            INSERT INTO community_donations (id, order_id, amount, donor_name, donor_email, donor_phone, donor_note, gateway, status)
            VALUES (${order.order_id}, ${order.order_id}, ${order.order_amount}, ${order.customer_details?.customer_name || 'Community Supporter'}, ${customerEmail || ''}, ${order.customer_details?.customer_phone || ''}, ${order.order_note || ''}, 'cashfree', 'PAID')
            ON CONFLICT (order_id) DO UPDATE SET status = 'PAID';
          `);

          await db.execute(sql`
            UPDATE processed_orders SET plan = 'donation' WHERE order_id = ${order.order_id};
          `);
        } catch (e) {
          console.error("[Donation Webhook Save Error]:", e);
          // Rethrow so the claim is released and Cashfree retries, instead of losing the donation record.
          throw e;
        }

        return NextResponse.json({ received: true, type: "donation", amount: order.order_amount }, { status: 200 });
      }

      let durationMs = 30 * 24 * 60 * 60 * 1000;
      let isFeaturedJob = false;
      let planTier = "pro";

      if (orderId.includes("all_access_annual")) {
        durationMs = 365 * 24 * 60 * 60 * 1000;
        planTier = "super_pass";
      } else if (orderId.includes("all_access") || orderId.includes("super_pass")) {
        durationMs = 30 * 24 * 60 * 60 * 1000;
        planTier = "super_pass";
      } else if (orderId.includes("pro_annual")) {
        durationMs = 365 * 24 * 60 * 60 * 1000;
        planTier = "pro_annual";
      } else if (orderId.includes("student_semester")) {
        durationMs = 180 * 24 * 60 * 60 * 1000;
        planTier = "student";
      } else if (orderId.includes("student")) {
        durationMs = 30 * 24 * 60 * 60 * 1000;
        planTier = "student";
      } else if (orderId.includes("pro_quarterly") || orderId.includes("pro_plus")) {
        durationMs = 90 * 24 * 60 * 60 * 1000;
        planTier = "pro_plus";
      } else if (orderId.includes("codepass")) {
        durationMs = 30 * 24 * 60 * 60 * 1000;
        planTier = "codepass";
      } else if (orderId.includes("scholar")) {
        durationMs = 30 * 24 * 60 * 60 * 1000;
        planTier = "scholar";
      } else if (orderId.includes("featured_job")) {
        isFeaturedJob = true;
        planTier = "featured_job";
      } else if (orderId.includes("hiring_sprint")) {
        isFeaturedJob = true;
        planTier = "hiring_sprint";
      }

      if (isFeaturedJob) {
        const targetJobId = order.order_tags?.job_id;
        if (targetJobId) {
          try {
            const featuredExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await db
              .update(jobs)
              .set({
                isFeatured: true,
                featuredExpiresAt,
                updatedAt: new Date(),
              })
              .where(eq(jobs.id, targetJobId));
            console.log(`[Cashfree Webhook] Job ${targetJobId} promoted to Featured status until ${featuredExpiresAt.toISOString()}`);
          } catch (jobErr) {
            console.error("[Cashfree Featured Job Boost Error]:", jobErr);
          }
        }
      } else {
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
            planTier: planTier,
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

          console.log(`[Cashfree Webhook] ${planTier} membership extended/activated until ${expiresAt.toISOString()} for order ${orderId}`);
        } else {
          // Paid but no matching account: needs manual follow-up, never a silent success.
          console.error(`[Cashfree Webhook] PAID order ${orderId} (${planTier}) has no matching user. Manual reconciliation required.`);
        }
      }

      // Record successful order in idempotency ledger
      try {
        await db.execute(sql`
          UPDATE processed_orders SET plan = ${planTier} WHERE order_id = ${order.order_id};
        `);
      } catch (idempErr) {
        console.error("[Cashfree Idempotency Insert Error]:", idempErr);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[Cashfree Webhook Error]:", error);
    if (claimedOrderId) {
      try {
        await db.execute(sql`DELETE FROM processed_orders WHERE order_id = ${claimedOrderId} AND plan = 'claimed';`);
      } catch (releaseErr) {
        console.error("[Cashfree Webhook] Failed to release order claim:", releaseErr);
      }
    }
    // Do not leak internals to the caller.
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
