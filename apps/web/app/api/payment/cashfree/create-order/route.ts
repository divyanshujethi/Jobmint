import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCashfreeOrder } from "@/lib/cashfree";
import { db, users, candidateProfiles, eq } from "@repo/database";

const PLAN_CONFIGS: Record<
  string,
  {
    name: string;
    amount: number;
    durationMs: number;
    description: string;
  }
> = {
  pro: {
    name: "Role Nest Pro (Monthly Membership)",
    amount: 199,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "1 month of Pro access • AI ATS Resume Matcher • Full 30-Day Course Engine • Ghosting Alerts",
  },
  pro_plus: {
    name: "Role Nest Plus (Career Accelerator - 3 Months Sprint)",
    amount: 499,
    durationMs: 90 * 24 * 60 * 60 * 1000,
    description: "3 months Pro Plus access • Save 16% • Priority Recruiter Placement • DevScore GitHub Deep Audit",
  },
  pro_quarterly: {
    name: "Role Nest Plus (Career Accelerator - 3 Months Sprint)",
    amount: 499,
    durationMs: 90 * 24 * 60 * 60 * 1000,
    description: "3 months Pro Plus access • Save 16% • Priority Recruiter Placement • DevScore GitHub Deep Audit",
  },
  pro_annual: {
    name: "Role Nest Pro (Annual Pass - 1 Year)",
    amount: 1499,
    durationMs: 365 * 24 * 60 * 60 * 1000,
    description: "1 full year Pro access • Lifetime Proof-of-Work Verification • 1-Click Tailored Bullets",
  },
  featured_job: {
    name: "Role Nest Featured Job Listing (30 Days)",
    amount: 1499,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "30-day top-of-feed featured job listing • Verified company badge • Direct distribution to active devs",
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const {
      plan = "pro",
      jobId,
      phone,
      amount: customAmount,
      donorName,
      donorEmail,
      donorPhone,
      donorNote,
    } = body;

    const isDonation = plan === "donation";

    // 1. For subscription plans, user must be authenticated so we can attach Pro access
    if (!isDonation && (!session?.user?.id || !session?.user?.email)) {
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
          error: "Please sign in or create an account before proceeding with subscription.",
          code: "UNAUTHORIZED",
          redirectUrl: `/login?callbackUrl=${encodeURIComponent(callbackPath)}`,
        },
        { status: 401 }
      );
    }

    let finalAmount: number;
    let planName: string;
    let planDurationMs = 0;
    let orderNoteText: string;

    if (isDonation) {
      const parsedAmount = Math.round(Number(customAmount));
      if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 10) {
        return NextResponse.json(
          { error: "Minimum donation amount is ₹10.", code: "INVALID_AMOUNT" },
          { status: 400 }
        );
      }
      finalAmount = parsedAmount;
      planName = "Community Support Donation (RitualDev & Role Nest)";
      orderNoteText = `Role Nest & RitualDev Contribution - ₹${finalAmount} - Backing free developer tooling & transparent tech hiring (ritualdev.in / rolenest.in)`;
    } else {
      const planConfig = PLAN_CONFIGS[plan] ?? PLAN_CONFIGS.pro;
      finalAmount = planConfig.amount;
      planName = planConfig.name;
      planDurationMs = planConfig.durationMs;
      orderNoteText = `${planConfig.name} - ${planConfig.description}`;
    }

    // Resolve user details
    let userId = session?.user?.id;
    let userEmail = (session?.user?.email || donorEmail || "").trim().toLowerCase();
    let userName = (session?.user?.name || donorName || "Community Supporter").trim();
    let resolvedPhone = (phone || donorPhone || "").replace(/\D/g, "").slice(-10);

    // If logged in, fetch accurate profile from DB
    if (userId) {
      const [dbUser] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          isPro: users.isPro,
          proExpiresAt: users.proExpiresAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (dbUser) {
        if (!userEmail && dbUser.email) userEmail = dbUser.email.toLowerCase();
        if ((!userName || userName === "Community Supporter") && dbUser.name) userName = dbUser.name;
        if (resolvedPhone.length !== 10 && dbUser.phone) {
          resolvedPhone = dbUser.phone.replace(/\D/g, "").slice(-10);
        }
      }

      if (resolvedPhone.length !== 10) {
        const [candProfile] = await db
          .select({ phone: candidateProfiles.phone })
          .from(candidateProfiles)
          .where(eq(candidateProfiles.userId, userId))
          .limit(1);

        if (candProfile?.phone) {
          resolvedPhone = candProfile.phone.replace(/\D/g, "").slice(-10);
        }
      }
    } else {
      // Guest donor
      userId = `guest_${Date.now().toString(36)}`;
    }

    // Require valid 10-digit mobile number for Cashfree UPI / SMS
    if (resolvedPhone.length !== 10) {
      return NextResponse.json(
        {
          error: "Please provide a valid 10-digit mobile number for Cashfree payment receipt and SMS verification.",
          code: "PHONE_REQUIRED",
        },
        { status: 400 }
      );
    }

    // If email is missing for guest donor
    if (!userEmail || !userEmail.includes("@")) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address for transaction receipt and donor acknowledgment.",
          code: "EMAIL_REQUIRED",
        },
        { status: 400 }
      );
    }

    // If phone was supplied and user is logged in, persist phone to user record
    if (session?.user?.id && phone && resolvedPhone.length === 10) {
      await db
        .update(users)
        .set({ phone: resolvedPhone, updatedAt: new Date() })
        .where(eq(users.id, session.user.id));
    }

    const uniqueSuffix = Date.now().toString(36);
    const orderId = isDonation
      ? `rn_don_${finalAmount}_${uniqueSuffix}`
      : `rn_${plan}_${uniqueSuffix}`;

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://rolenest.in";
    const returnUrl = `${origin}/payment/verify?order_id={order_id}`;
    const notifyUrl = `${origin}/api/webhooks/cashfree`;

    const tags: Record<string, string> = {
      plan,
      planName,
      planDurationMs: String(planDurationMs),
      userId,
      userEmail,
      customerPhone: resolvedPhone,
      community: "RitualDev & Role Nest",
    };
    if (isDonation && donorNote) {
      tags.donorNote = String(donorNote).slice(0, 100);
    }
    if (jobId) {
      tags.jobId = jobId;
    }

    const order = await createCashfreeOrder({
      orderId,
      orderAmount: finalAmount,
      customerDetails: {
        customerId: userId,
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: resolvedPhone,
      },
      returnUrl,
      notifyUrl,
      orderNote: orderNoteText,
      orderTags: tags,
    });

    return NextResponse.json({
      success: true,
      paymentSessionId: order.payment_session_id,
      orderId: order.order_id,
      cfOrderId: order.cf_order_id,
      amount: finalAmount,
      plan,
      planName,
      customerPhone: resolvedPhone,
    });
  } catch (error: any) {
    console.error("[Cashfree Create Order Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
