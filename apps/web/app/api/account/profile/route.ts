import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, users, candidateProfiles, eq } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isPro: users.isPro,
        proExpiresAt: users.proExpiresAt,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check candidate_profiles for resume, phone, headline, github
    let userPhone = user.phone || "";
    const [profile] = await db
      .select({
        phone: candidateProfiles.phone,
        resumeUrl: candidateProfiles.resumeUrl,
        headline: candidateProfiles.headline,
        bio: candidateProfiles.bio,
        collegeName: candidateProfiles.collegeName,
        githubUrl: candidateProfiles.githubUrl,
        linkedinUrl: candidateProfiles.linkedinUrl,
        portfolioUrl: candidateProfiles.portfolioUrl,
      })
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, user.id))
      .limit(1);

    if (profile?.phone && !userPhone) {
      userPhone = profile.phone;
    }

    const hasResume = Boolean(profile?.resumeUrl && profile.resumeUrl.trim().length > 0);
    const hasPhone = Boolean(userPhone && userPhone.replace(/\D/g, "").length >= 10);
    const hasHeadlineOrBio = Boolean(
      (profile?.headline && profile.headline.trim().length > 0) ||
      (profile?.bio && profile.bio.trim().length > 0)
    );
    const hasSocialOrGithub = Boolean(
      (profile?.githubUrl && profile.githubUrl.trim().length > 0) ||
      (profile?.linkedinUrl && profile.linkedinUrl.trim().length > 0)
    );

    let completionPercent = 25; // Registered
    const missingFields: string[] = [];

    if (hasPhone) {
      completionPercent += 25;
    } else {
      missingFields.push("Mobile Number");
    }

    if (hasResume) {
      completionPercent += 30;
    } else {
      missingFields.push("Resume / CV");
    }

    if (hasHeadlineOrBio) {
      completionPercent += 10;
    } else {
      missingFields.push("About / Headline");
    }

    if (hasSocialOrGithub) {
      completionPercent += 10;
    } else {
      missingFields.push("GitHub / LinkedIn");
    }

    const isStillActive = Boolean(
      user.isPro && (!user.proExpiresAt || new Date(user.proExpiresAt) > new Date())
    );

    // If subscription has expired, update database record to reflect free tier
    if (user.isPro && user.proExpiresAt && new Date(user.proExpiresAt) <= new Date()) {
      await db
        .update(users)
        .set({ isPro: false, updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name || "",
        email: user.email,
        phone: userPhone,
        role: user.role,
        isPro: isStillActive,
        proExpiresAt: user.proExpiresAt,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        hasResume,
        hasPhone,
        resumeUrl: profile?.resumeUrl || null,
        headline: profile?.headline || "",
        bio: profile?.bio || "",
        collegeName: profile?.collegeName || "",
        githubUrl: profile?.githubUrl || "",
        linkedinUrl: profile?.linkedinUrl || "",
        portfolioUrl: profile?.portfolioUrl || "",
        completionPercent,
        missingFields,
      },
    });
  } catch (error: any) {
    console.error("[Account Profile GET Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone } = body;

    const trimmedName = typeof name === "string" ? name.trim() : undefined;
    const cleanPhone = typeof phone === "string" ? phone.replace(/\D/g, "").slice(-10) : undefined;

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (trimmedName !== undefined) updateFields.name = trimmedName;
    if (cleanPhone !== undefined) updateFields.phone = cleanPhone;

    const [updatedUser] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, session.user.id))
      .returning();

    // Also sync phone to candidateProfiles if present
    if (cleanPhone !== undefined) {
      const [existingProfile] = await db
        .select({ id: candidateProfiles.id })
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, session.user.id))
        .limit(1);

      if (existingProfile) {
        await db
          .update(candidateProfiles)
          .set({ phone: cleanPhone, updatedAt: new Date() })
          .where(eq(candidateProfiles.id, existingProfile.id));
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error: any) {
    console.error("[Account Profile PATCH Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
