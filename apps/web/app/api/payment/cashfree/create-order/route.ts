import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCashfreeOrder } from "@/lib/cashfree";
import { db, users, candidateProfiles, eq, sql } from "@repo/database";

const PLAN_CONFIGS: Record<
  string,
  {
    name: string;
    amount: number;
    durationMs: number;
    description: string;
  }
> = {
  student: {
    name: "RoleNest Campus & Student Pass (Monthly)",
    amount: 99,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "Student Discount Pass • 15 AI Resume Scans • 10 Active Applications • Monaco POTD Solutions",
  },
  student_semester: {
    name: "RoleNest Student Semester Pass (6 Months)",
    amount: 249,
    durationMs: 180 * 24 * 60 * 60 * 1000,
    description: "6 months Student Pass • Save 58% • POTD Solutions • Student Verified Badge",
  },
  pro: {
    name: "RoleNest Pro (Monthly Membership)",
    amount: 199,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "1 month of Pro access • AI ATS Resume Matcher • Full 30-Day Course Engine • Ghosting Alerts",
  },
  pro_plus: {
    name: "RoleNest Plus (Career Accelerator - 3 Months Sprint)",
    amount: 499,
    durationMs: 90 * 24 * 60 * 60 * 1000,
    description: "3 months Pro Plus access • Save 16% • Priority Recruiter Placement • DevScore GitHub Deep Audit",
  },
  pro_quarterly: {
    name: "RoleNest Plus (Career Accelerator - 3 Months Sprint)",
    amount: 499,
    durationMs: 90 * 24 * 60 * 60 * 1000,
    description: "3 months Pro Plus access • Save 16% • Priority Recruiter Placement • DevScore GitHub Deep Audit",
  },
  pro_annual: {
    name: "RoleNest Pro (Annual Pass - 1 Year)",
    amount: 1499,
    durationMs: 365 * 24 * 60 * 60 * 1000,
    description: "1 full year Pro access • Immutable Proof-of-Work Verification • 1-Click Tailored Bullets",
  },
  mentorship_session: {
    name: "1-on-1 Senior Engineer Resume & Mock Review",
    amount: 799,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "45-min live session • Line-by-line ATS resume review • Project architecture critique • Live mock interview",
  },
  all_access_bundle: {
    name: "RoleNest All-Access Super Pass (Monthly)",
    amount: 299,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "Complete 3-in-1 ecosystem access: RoleNest Pro + ProblemNest CodePass + StudyNest Scholar (Save 25%)",
  },
  super_pass: {
    name: "RoleNest All-Access Super Pass (Monthly)",
    amount: 299,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "Complete 3-in-1 ecosystem access: RoleNest Pro + ProblemNest CodePass + StudyNest Scholar (Save 25%)",
  },
  all_access_annual: {
    name: "RoleNest All-Access Super Pass (Annual)",
    amount: 1999,
    durationMs: 365 * 24 * 60 * 60 * 1000,
    description: "1 full year ecosystem access: RoleNest Pro + ProblemNest CodePass + StudyNest Scholar",
  },
  codepass: {
    name: "ProblemNest CodePass (Monthly)",
    amount: 99,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "Full POTD Monaco Editor Solutions, 70+ Curated Problems & Testcase Hints",
  },
  scholar: {
    name: "StudyNest Scholar Pass (Monthly)",
    amount: 99,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "All 30-Day Job-to-Course Curricula & Verified Course Certificates",
  },
  featured_job: {
    name: "RoleNest Featured Job Listing (30 Days)",
    amount: 1499,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: "30-day top-of-feed featured job listing • Verified company badge • Direct distribution to active devs",
  },
  hiring_sprint: {
    name: "RoleNest Hiring Sprint Bundle (3 Featured Jobs)",
    amount: 3499,
    durationMs: 60 * 24 * 60 * 60 * 1000,
    description: "3 featured jobs boost • Direct candidate outreach • Priority applicant review dashboard",
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
      planName = "Community Support Donation (RitualDev & RoleNest)";
      orderNoteText = `RoleNest & RitualDev Contribution - ₹${finalAmount} - Backing free developer tooling & transparent tech hiring (ritualdev.in / rolenest.in)`;
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

    const hostHeader = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
    const protoHeader = req.headers.get("x-forwarded-proto") || "https";
    const originHeader = req.headers.get("origin");

    let origin = originHeader;
    if (!origin && hostHeader) {
      origin = `${protoHeader}://${hostHeader}`;
    }
    if (!origin) {
      origin = isDonation
        ? "https://donation.rolenest.in"
        : process.env.NEXTAUTH_URL || "https://rolenest.in";
    }

    // If it's a donation, guarantee returnUrl points to donation.rolenest.in
    if (isDonation && !origin.includes("donation.") && !origin.includes("donate.")) {
      origin = "https://donation.rolenest.in";
    }

    const returnUrl = `${origin}/payment/verify?order_id={order_id}${isDonation ? "&plan=donation" : ""}`;
    const notifyUrl = `https://rolenest.in/api/webhooks/cashfree`;

    // Pre-save donation into database with full donorNote (including any emojis & user formatting)
    if (isDonation) {
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
            status VARCHAR(32) DEFAULT 'PENDING',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
        await db.execute(sql`
          INSERT INTO community_donations (id, order_id, amount, donor_name, donor_email, donor_phone, donor_note, gateway, status)
          VALUES (${orderId}, ${orderId}, ${finalAmount}, ${userName}, ${userEmail}, ${resolvedPhone}, ${donorNote || ''}, 'cashfree', 'PENDING')
          ON CONFLICT (order_id) DO UPDATE SET
            donor_note = EXCLUDED.donor_note,
            donor_name = EXCLUDED.donor_name;
        `);
      } catch (dbErr) {
        console.warn("[Donation Pre-Save Warning]:", dbErr);
      }
    }

    const tags: Record<string, string> = {
      plan,
      plan_name: String(planName).slice(0, 50),
      plan_duration_ms: String(planDurationMs),
      user_id: userId,
      user_email: userEmail,
      customer_phone: resolvedPhone,
      community: "RitualDev RoleNest",
    };
    if (isDonation && donorNote) {
      const cleanNote = String(donorNote)
        .replace(/<[^>]*>/g, "")
        .replace(/[\r\n\t]+/g, " ")
        .replace(/[^\x20-\x7E]/g, "")
        .trim()
        .slice(0, 100);
      if (cleanNote) {
        tags.donor_note = cleanNote;
      }
    }
    if (jobId) {
      tags.job_id = jobId;
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
      environment: (process.env.CASHFREE_ENV || "production") as "production" | "sandbox",
    });
  } catch (error: any) {
    console.error("[Cashfree Create Order Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
