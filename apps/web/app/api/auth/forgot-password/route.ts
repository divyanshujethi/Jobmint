import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens, eq } from "@repo/database";
import { sendEmail, passwordResetTemplate } from "@repo/email";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Look up user
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (userList.length > 0) {
      const user = userList[0];
      const token = crypto.randomBytes(32).toString("hex");
      const identifier = `reset:${normalizedEmail}`;
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Remove any existing pending reset token
      try {
        await db
          .delete(verificationTokens)
          .where(eq(verificationTokens.identifier, identifier));
      } catch {
        // Ignore
      }

      await db.insert(verificationTokens).values({
        identifier,
        token,
        expires,
      });

      const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://rolenest.in";
      const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}`;

      const { subject, html } = passwordResetTemplate(user.name || "Candidate", resetLink);
      const emailResult = await sendEmail({
        to: normalizedEmail,
        subject,
        html,
      });

      const atIdx = normalizedEmail.indexOf("@");
      const maskedEmail = atIdx > 1 ? `${normalizedEmail[0]}***${normalizedEmail.slice(atIdx)}` : normalizedEmail;
      console.info(`[Auth Forgot Password] Reset email sent to ${maskedEmail} via ${emailResult.provider} (Success: ${emailResult.success})`);
    }

    // Always return success to protect privacy
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email address, you will receive a password reset link shortly.",
    });
  } catch (error: any) {
    console.error("[Forgot Password Error]:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}
