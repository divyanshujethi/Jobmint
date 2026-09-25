import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, users, eq } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ isPro: false, authenticated: false }, { status: 200 });
    }

    const [userRecord] = await db
      .select({
        id: users.id,
        isPro: users.isPro,
        proExpiresAt: users.proExpiresAt,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json({ isPro: false, authenticated: true }, { status: 200 });
    }

    const isStillActive =
      userRecord.isPro &&
      (!userRecord.proExpiresAt || new Date(userRecord.proExpiresAt) > new Date());

    return NextResponse.json({
      authenticated: true,
      isPro: Boolean(isStillActive),
      proExpiresAt: userRecord.proExpiresAt,
      role: userRecord.role,
    });
  } catch (err: any) {
    console.error("[API pro-status] Error:", err);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
