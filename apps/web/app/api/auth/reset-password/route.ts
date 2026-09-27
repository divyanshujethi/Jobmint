import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens, eq, and, gt } from "@repo/database";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const identifier = `reset:${normalizedEmail}`;

    // Verify token validity and expiration
    const validTokens = await db
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

    if (validTokens.length === 0) {
      return NextResponse.json(
        { error: "This password reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const passwordHash = hashPassword(password);
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.email, normalizedEmail));

    // Delete token
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token)
        )
      );

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset! You can now sign in with your new password.",
    });
  } catch (error: any) {
    console.error("[Reset Password Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resetting your password." },
      { status: 500 }
    );
  }
}
