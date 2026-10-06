import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, candidateProfiles, registeredColleges, eq, desc } from "@repo/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    let userCollegeName: string | null = null;

    if (session?.user?.id) {
      const [profile] = await db
        .select({ collegeName: candidateProfiles.collegeName })
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, session.user.id))
        .limit(1);
      userCollegeName = profile?.collegeName || null;
    }

    // Fetch registered colleges from database
    let allColleges: any[] = [];
    try {
      allColleges = await db
        .select({
          id: registeredColleges.id,
          name: registeredColleges.name,
          location: registeredColleges.location,
          state: registeredColleges.state,
        })
        .from(registeredColleges)
        .orderBy(desc(registeredColleges.createdAt))
        .limit(100);
    } catch (e) {
      console.warn("Notice querying registered_colleges:", e);
    }

    return NextResponse.json({
      collegeName: userCollegeName,
      registeredColleges: allColleges,
    });
  } catch (err: any) {
    return NextResponse.json({ collegeName: null, registeredColleges: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to join or register your college team." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { collegeName, location, state } = body;

    if (!collegeName || typeof collegeName !== "string" || !collegeName.trim()) {
      return NextResponse.json({ error: "Please enter a valid college name." }, { status: 400 });
    }

    const trimmedName = collegeName.trim().slice(0, 120);
    const trimmedLocation = (location && typeof location === "string" ? location.trim().slice(0, 100) : "") || "India";
    const trimmedState = state && typeof state === "string" ? state.trim().slice(0, 60) : null;

    // 1. If custom college or location provided, register in registered_colleges
    try {
      await db
        .insert(registeredColleges)
        .values({
          name: trimmedName,
          location: trimmedLocation,
          state: trimmedState,
          createdByUserId: session.user.id,
        })
        .onConflictDoNothing();
    } catch (e) {
      // Ignore duplicate
    }

    // 2. Associate user's candidateProfile with this college
    const [existing] = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, session.user.id))
      .limit(1);

    if (existing) {
      await db
        .update(candidateProfiles)
        .set({ collegeName: trimmedName, updatedAt: new Date() })
        .where(eq(candidateProfiles.id, existing.id));
    } else {
      await db
        .insert(candidateProfiles)
        .values({
          userId: session.user.id,
          collegeName: trimmedName,
        });
    }

    return NextResponse.json({
      success: true,
      collegeName: trimmedName,
      location: trimmedLocation,
      message: `🎉 Successfully representing ${trimmedName}!`,
    });
  } catch (err: any) {
    console.error("Error setting user college:", err);
    return NextResponse.json({ error: "Failed to update college representation" }, { status: 500 });
  }
}
