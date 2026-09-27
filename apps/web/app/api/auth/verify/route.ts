import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens, eq, and, gt } from "@repo/database";

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
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, normalizedEmail));

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
