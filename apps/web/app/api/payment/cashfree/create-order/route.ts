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
  test_5: {
    name: "Role Nest Pro (10-Minute Rapid Test)",
    amount: 5,
    durationMs: 10 * 60 * 1000, // 10 minutes
    description: "10-minute instant Role Nest Pro test • Live ₹5 UPI gateway test • Auto-cancels after 10 mins",
  },
  test_10: {
    name: "Role Nest Pro (7-Day Trial Pass)",
    amount: 10,
    durationMs: 7 * 24 * 60 * 60 * 1000,
    description: "7 days full Role Nest Pro access • One-time introductory trial • Unlimited AI ATS & Verified Job Access",
  },
  test: {
    name: "Role Nest Pro (7-Day Trial Pass)",
    amount: 10,
    durationMs: 7 * 24 * 60 * 60 * 1000,
    description: "7 days full Role Nest Pro access • One-time introductory trial • Unlimited AI ATS & Verified Job Access",
  },
  pro: {
    name: "Role Nest Pro (Monthly Membership)",
    amount: 499,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "1 month of Pro access • AI ATS Resume Matcher • Direct Verified Referral Links • Ghosting Protection",
  },
  pro_quarterly: {
    name: "Role Nest Pro (Quarterly Sprint - 3 Months)",
    amount: 1199,
    durationMs: 90 * 24 * 60 * 60 * 1000,
    description: "3 months Pro sprint access • Save 20% • Priority Recruiter Visibility • Full AI Interview Suite",
  },
  pro_annual: {
    name: "Role Nest Pro (Annual Pass - 1 Year)",
    amount: 3999,
    durationMs: 365 * 24 * 60 * 60 * 1000,
    description: "1 full year Pro access • Save 33% • Lifetime Proof-of-Work Verification • 1-Click Tailored Bullets",
  },
  featured_job: {
    name: "Role Nest Featured Job Listing (30 Days)",
    amount: 7999,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "30-day top-of-feed featured job listing • Verified company badge • Direct distribution to active devs",
  },
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

    const planConfig = PLAN_CONFIGS[plan] ?? PLAN_CONFIGS.pro;
    const amount = planConfig.amount;

    // Fetch user from DB to obtain accurate profile information
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
      .where(eq(users.id, session.user.id))
      .limit(1);

    const isCurrentlyPro = Boolean(
      dbUser?.isPro &&
        (!dbUser?.proExpiresAt || new Date(dbUser.proExpiresAt) > new Date())
    );

    // If user already has an active Pro subscription and tries to buy the 7-day trial pass again, lock it!
    if ((plan === "test_10" || plan === "test") && isCurrentlyPro) {
      return NextResponse.json(
        {
          error: "The 7-day trial pass is a one-time introductory offer. You already have an active Pro membership. Please choose Monthly, Quarterly, or Annual to extend.",
          code: "TRIAL_LOCKED",
        },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const userEmail = (dbUser?.email || session.user.email).trim().toLowerCase();
    const userName = (dbUser?.name || session.user.name || "Candidate").trim();

    // Determine candidate phone:
    // 1. Explicit phone passed in checkout body
    // 2. Saved user.phone
    // 3. Saved candidate_profiles.phone
    let resolvedPhone = (phone || "").replace(/\D/g, "").slice(-10);

    if (resolvedPhone.length !== 10 && dbUser?.phone) {
      resolvedPhone = dbUser.phone.replace(/\D/g, "").slice(-10);
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

    // If still no valid 10-digit Indian phone number, ask user to provide their phone
    if (resolvedPhone.length !== 10) {
      return NextResponse.json(
        {
          error: "Please provide a valid 10-digit mobile number for Cashfree payment receipt and SMS verification.",
          code: "PHONE_REQUIRED",
        },
        { status: 400 }
      );
    }

    // If phone was supplied in checkout, persist it to user record & candidate profile for future use
    if (phone && resolvedPhone.length === 10) {
      await db
        .update(users)
        .set({ phone: resolvedPhone, updatedAt: new Date() })
        .where(eq(users.id, userId));

      const [existingProfile] = await db
        .select({ id: candidateProfiles.id })
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, userId))
        .limit(1);

      if (existingProfile) {
        await db
          .update(candidateProfiles)
          .set({ phone: resolvedPhone, updatedAt: new Date() })
          .where(eq(candidateProfiles.userId, userId));
      }
    }

    const uniqueSuffix = Date.now().toString(36);
    const orderId = `rn_${plan}_${uniqueSuffix}`;

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://rolenest.in";
    const returnUrl = `${origin}/payment/verify?order_id={order_id}`;
    const notifyUrl = `${origin}/api/webhooks/cashfree`;

    const tags: Record<string, string> = {
      plan,
      planName: planConfig.name,
      planDurationMs: String(planConfig.durationMs),
      userId,
      userEmail,
      customerPhone: resolvedPhone,
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
        customerPhone: resolvedPhone,
      },
      returnUrl,
      notifyUrl,
      orderNote: `${planConfig.name} - ${planConfig.description}`,
      orderTags: tags,
    });

    return NextResponse.json({
      success: true,
      paymentSessionId: order.payment_session_id,
      orderId: order.order_id,
      cfOrderId: order.cf_order_id,
      amount,
      plan,
      planName: planConfig.name,
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
