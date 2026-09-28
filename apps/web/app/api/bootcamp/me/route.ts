import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, bootcampEnrollments, bootcampDailySubmissions, eq, and } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        enrollments: [],
        submissions: [],
      });
    }

    const userId = session.user.id;

    // Fetch user enrollments
    const enrollments = await db
      .select()
      .from(bootcampEnrollments)
      .where(eq(bootcampEnrollments.userId, userId))
      .orderBy(bootcampEnrollments.enrolledAt);

    // Fetch user daily submissions
    const submissions = await db
      .select()
      .from(bootcampDailySubmissions)
      .where(eq(bootcampDailySubmissions.userId, userId))
      .orderBy(bootcampDailySubmissions.dayNumber);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      enrollments,
      submissions,
    });
  } catch (error: any) {
    console.error("Error fetching bootcamp user state:", error);
    return NextResponse.json(
      { error: "Internal server error fetching student records" },
      { status: 500 }
    );
  }
}
