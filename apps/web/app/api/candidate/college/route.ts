import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, candidateProfiles, eq } from "@repo/database";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ collegeName: null });
  }
  const [profile] = await db
    .select({ collegeName: candidateProfiles.collegeName })
    .from(candidateProfiles)
    .where(eq(candidateProfiles.userId, session.user.id))
    .limit(1);

  return NextResponse.json({ collegeName: profile?.collegeName || null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collegeName } = await req.json();
  if (!collegeName || typeof collegeName !== "string") {
    return NextResponse.json({ error: "Invalid college name" }, { status: 400 });
  }

  const trimmed = collegeName.trim().slice(0, 100);

  const [existing] = await db
    .select()
    .from(candidateProfiles)
    .where(eq(candidateProfiles.userId, session.user.id))
    .limit(1);

  if (existing) {
    await db
      .update(candidateProfiles)
      .set({ collegeName: trimmed, updatedAt: new Date() })
      .where(eq(candidateProfiles.id, existing.id));
  } else {
    await db
      .insert(candidateProfiles)
      .values({
        userId: session.user.id,
        collegeName: trimmed,
      });
  }

  return NextResponse.json({ success: true, collegeName: trimmed });
}
