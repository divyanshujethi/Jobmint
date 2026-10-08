import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens, userStreaks, eq, and, gt } from "@repo/database";
import { grantFreeProDays } from "@/lib/plan-limits";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const origin = process.env.NEXTAUTH_URL || "https://rolenest.in";

  if (!token || !email) {
    return NextResponse.redirect(`${origin}/login?error=invalid_token`);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const identifier = `verify:${normalizedEmail}`;

  try {
    const existingTokens = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token),
          gt(verificationTokens.expires, new Date())
        )
      )
      .limit(1);

    if (existingTokens.length === 0) {
      return NextResponse.redirect(`${origin}/login?error=expired_token`);
    }

    // Mark email as verified
    const [updatedUser] = await db
      .update(users)
      .set({
        emailVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, normalizedEmail))
      .returning();

    // Check if referee was referred by an existing user
    if (updatedUser) {
      try {
        const refCookie = req.cookies.get("jm_referral")?.value;
        if (refCookie) {
          const [referrer] = await db
            .select()
            .from(userStreaks)
            .where(eq(userStreaks.referralCode, refCookie))
            .limit(1);

          if (referrer && referrer.userId !== updatedUser.id) {
            // Grant 7 Days Free Pro to both referrer and referee
            await Promise.all([
              grantFreeProDays(referrer.userId, 7),
              grantFreeProDays(updatedUser.id, 7),
            ]);

            // Update referrer streak stats
            const updatedBadges = [...(referrer.unlockedBadges || [])];
            if (!updatedBadges.includes("COMMUNITY_CHAMPION")) {
              updatedBadges.push("COMMUNITY_CHAMPION");
            }
            await db
              .update(userStreaks)
              .set({
                referralCount: (referrer.referralCount || 0) + 1,
                totalXp: (referrer.totalXp || 0) + 100,
                streakFreezes: (referrer.streakFreezes || 0) + 1,
                unlockedBadges: updatedBadges,
                updatedAt: new Date(),
              })
              .where(eq(userStreaks.id, referrer.id));
          }
        }
      } catch (refErr) {
        console.error("[Auth Verify Referral Attribution Error]:", refErr);
      }
    }

    // Cleanup consumed token
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token)
        )
      );

    return NextResponse.redirect(`${origin}/login?verified=1`);
  } catch (error) {
    console.error("[Auth Verify Error]:", error);
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }
}
