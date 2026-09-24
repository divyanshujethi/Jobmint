import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, users, eq } from "@repo/database";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You must be logged in to delete your account." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Delete the user - PostgreSQL cascade constraints will automatically delete:
    // accounts, sessions, candidateProfiles, candidateSkills, candidateEducation, applications, applicationEvents, savedJobs
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: "Account and associated profile data have been permanently deleted.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}


