import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, bootcampEnrollments, eq, and } from "@repo/database";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { enrollmentId, githubForkUrl, osContributionPrUrl } = body;

    if (!enrollmentId || !osContributionPrUrl) {
      return NextResponse.json(
        { error: "Missing required fields (enrollmentId, osContributionPrUrl)." },
        { status: 400 }
      );
    }

    const normalizedPrUrl = osContributionPrUrl.trim();
    if (!normalizedPrUrl.includes("github.com/")) {
      return NextResponse.json(
        { error: "Invalid Pull Request link. Must be a valid GitHub Pull Request URL." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify enrollment
    const [enrollment] = await db
      .select()
      .from(bootcampEnrollments)
      .where(
        and(
          eq(bootcampEnrollments.id, enrollmentId),
          eq(bootcampEnrollments.userId, userId)
        )
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found." },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(bootcampEnrollments)
      .set({
        githubForkUrl: githubForkUrl ? githubForkUrl.trim() : enrollment.githubForkUrl,
        osContributionPrUrl: normalizedPrUrl,
        osContributionStatus: "SUBMITTED",
        updatedAt: new Date(),
      })
      .where(eq(bootcampEnrollments.id, enrollmentId))
      .returning();

    return NextResponse.json({
      success: true,
      enrollment: updated,
      message: "Open Source Pull Request on DevShelf submitted successfully! Our maintainers will review and feature accepted contributions.",
    });
  } catch (error: any) {
    console.error("OS contribution submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit open source contribution." },
      { status: 500 }
    );
  }
}
