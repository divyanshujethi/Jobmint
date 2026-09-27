import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens, eq } from "@repo/database";
import { sendEmail, candidateWelcomeConfirmationTemplate } from "@repo/email";
import { hashPassword } from "@/lib/password";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    const passwordHash = hashPassword(password);
    const displayName = name?.trim() || normalizedEmail.split("@")[0];
    const userRole = role === "EMPLOYER" ? "EMPLOYER" : "CANDIDATE";

    let userId: string;

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.passwordHash) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
      // User was previously created via OAuth or application submission without password
      await db
        .update(users)
        .set({
          passwordHash,
          name: existing.name || displayName,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
      userId = existing.id;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          name: displayName,
          passwordHash,
          role: userRole,
          emailVerified: null,
        })
        .returning();
      userId = newUser.id;
    }

    // Generate secure one-time verification token
    const token = crypto.randomBytes(32).toString("hex");
    const identifier = `verify:${normalizedEmail}`;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Remove any previous pending verification token for this email
    try {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, identifier));
    } catch {
      // Ignore if table/record clean
    }

    await db.insert(verificationTokens).values({
      identifier,
      token,
      expires,
    });

    // Determine host for confirmation link
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://rolenest.in";
    const confirmUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}`;

    // Send confirmation email via Resend
    const { subject, html } = candidateWelcomeConfirmationTemplate(displayName, confirmUrl);
    const emailResult = await sendEmail({
      to: normalizedEmail,
      subject,
      html,
    });

    console.info(`[Auth Register] Verification email sent to ${normalizedEmail} via ${emailResult.provider} (Success: ${emailResult.success})`);

    return NextResponse.json({
      success: true,
      message: "Account created successfully! We sent a confirmation link to your email address.",
      provider: emailResult.provider,
    });
  } catch (error: any) {
    console.error("[Auth Register Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
