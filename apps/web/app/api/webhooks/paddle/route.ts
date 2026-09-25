import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, users, jobs, eq } from "@repo/database";

const PADDLE_WEBHOOK_SECRET =
  process.env.PADDLE_WEBHOOK_SECRET ||
  "pdl_ntfset_01m3bwme1qf3ezpevv0aa7zevv_3LM3tMva0yjgphgQNOEKdz/mST8Erqe8";

const PRO_PRICE_ID =
  process.env.PADDLE_PRO_PRICE_ID || "pri_01m3bwpwtps09hkztpjz0d3dnd";
const FEATURED_JOB_PRICE_ID =
  process.env.PADDLE_FEATURED_JOB_PRICE_ID || "pri_01m3bwq2xvg6rnjy5ycpj811v8";

function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader || !PADDLE_WEBHOOK_SECRET) {
    return false;
  }

  try {
    const parts = signatureHeader.split(";").reduce((acc, part) => {
      const [k, ...v] = part.split("=");
      if (k && v.length) {
        acc[k.trim()] = v.join("=").trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const ts = parts.ts;
    const h1 = parts.h1;

    if (!ts || !h1) {
      return false;
    }

    const signedPayload = `${ts}:${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", PADDLE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    const h1Buffer = Buffer.from(h1, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (h1Buffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(h1Buffer, expectedBuffer);
  } catch (err) {
    console.error("[Paddle Webhook] Signature verification failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature");

    const isValid = verifyPaddleSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[Paddle Webhook] Unauthorized request or invalid signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event_type;
    const eventId = payload.event_id;
    const eventData = payload.data || {};
    const customData = eventData.custom_data || {};

    console.log(
      `[Paddle Webhook] Processing event: ${eventType} (ID: ${eventId})`
    );

    // 1. Candidate Subscription Events (Pro Plan)
    if (
      eventType === "transaction.completed" ||
      eventType === "subscription.created" ||
      eventType === "subscription.activated" ||
      eventType === "subscription.updated"
    ) {
      const isProPrice = eventData.items?.some(
        (item: any) =>
          item.price?.id === PRO_PRICE_ID ||
          item.price_id === PRO_PRICE_ID
      );
      const isProPlan = customData.plan === "pro" || isProPrice;

      if (isProPlan || customData.userId) {
        const userId = customData.userId;
        const customerEmail =
          eventData.customer?.email ||
          customData.userEmail ||
          eventData.details?.customer?.email;

        const expiresAt = eventData.current_billing_period?.ends_at
          ? new Date(eventData.current_billing_period.ends_at)
          : new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);

        if (userId) {
          await db
            .update(users)
            .set({
              isPro: true,
              proExpiresAt: expiresAt,
              paddleCustomerId: eventData.customer_id || null,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
          console.log(
            `[Paddle Webhook] Successfully activated Role Nest Pro for user ID: ${userId}`
          );
        } else if (customerEmail) {
          await db
            .update(users)
            .set({
              isPro: true,
              proExpiresAt: expiresAt,
              paddleCustomerId: eventData.customer_id || null,
              updatedAt: new Date(),
            })
            .where(eq(users.email, customerEmail.toLowerCase()));
          console.log(
            `[Paddle Webhook] Successfully activated Role Nest Pro for user email: ${customerEmail}`
          );
        }
      }

      // Check if this transaction is for Employer Featured Job Boost
      const isFeaturedJobPrice = eventData.items?.some(
        (item: any) =>
          item.price?.id === FEATURED_JOB_PRICE_ID ||
          item.price_id === FEATURED_JOB_PRICE_ID
      );

      if (isFeaturedJobPrice || customData.jobId) {
        const jobId = customData.jobId;
        if (jobId) {
          const featuredExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          );
          await db
            .update(jobs)
            .set({
              isFeatured: true,
              featuredExpiresAt,
              updatedAt: new Date(),
            })
            .where(eq(jobs.id, jobId));
          console.log(
            `[Paddle Webhook] Successfully activated Featured Job Boost for job ID: ${jobId}`
          );
        }
      }
    }

    // 2. Cancellation Events
    if (eventType === "subscription.canceled") {
      const userId = customData.userId;
      const customerEmail =
        eventData.customer?.email || customData.userEmail;

      if (userId) {
        await db
          .update(users)
          .set({
            isPro: false,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        console.log(
          `[Paddle Webhook] Role Nest Pro revoked for canceled user ID: ${userId}`
        );
      } else if (customerEmail) {
        await db
          .update(users)
          .set({
            isPro: false,
            updatedAt: new Date(),
          })
          .where(eq(users.email, customerEmail.toLowerCase()));
        console.log(
          `[Paddle Webhook] Role Nest Pro revoked for canceled user email: ${customerEmail}`
        );
      }
    }

    return NextResponse.json(
      { received: true, event: eventType, id: eventId },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Paddle Webhook] Error processing event:", err);
    return NextResponse.json(
      { error: "Webhook handler failed", details: err?.message },
      { status: 500 }
    );
  }
}
