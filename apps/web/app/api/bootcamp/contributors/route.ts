import { NextRequest, NextResponse } from "next/server";
import { db, bootcampEnrollments, desc, or, eq } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    const list = await db
      .select({
        id: bootcampEnrollments.id,
        studentName: bootcampEnrollments.studentName,
        collegeName: bootcampEnrollments.collegeName,
        githubUsername: bootcampEnrollments.githubUsername,
        osContributionPrUrl: bootcampEnrollments.osContributionPrUrl,
        osContributionStatus: bootcampEnrollments.osContributionStatus,
        trackId: bootcampEnrollments.trackId,
        enrolledAt: bootcampEnrollments.enrolledAt,
      })
      .from(bootcampEnrollments)
      .where(
        or(
          eq(bootcampEnrollments.osContributionStatus, "SUBMITTED"),
          eq(bootcampEnrollments.osContributionStatus, "APPROVED"),
          eq(bootcampEnrollments.osContributionStatus, "FEATURED")
        )
      )
      .orderBy(desc(bootcampEnrollments.enrolledAt))
      .limit(20);

    return NextResponse.json({
      success: true,
      repository: "https://github.com/RitualDev-Lab/DevShelf",
      contributors: list,
    });
  } catch (error: any) {
    console.error("Error fetching contributors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contributors" },
      { status: 500 }
    );
  }
}
