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

    // Check candidate_profiles for phone fallback if not directly on user
    let userPhone = user.phone || "";
    if (!userPhone) {
      const [profile] = await db
        .select({ phone: candidateProfiles.phone })
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, user.id))
        .limit(1);
      if (profile?.phone) {
        userPhone = profile.phone;
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name || "",
        email: user.email,
        phone: userPhone,
        role: user.role,
        isPro: Boolean(user.isPro && (!user.proExpiresAt || new Date(user.proExpiresAt) > new Date())),
        proExpiresAt: user.proExpiresAt,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
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
