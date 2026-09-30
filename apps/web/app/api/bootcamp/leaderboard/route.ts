import { NextResponse } from "next/server";
import { db, bootcampEnrollments, bootcampDailySubmissions, desc } from "@repo/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Query real enrollments
    const enrollments = await db
      .select({
        id: bootcampEnrollments.id,
        studentName: bootcampEnrollments.studentName,
        trackId: bootcampEnrollments.trackId,
        currentDay: bootcampEnrollments.currentDay,
        unlockedDay: bootcampEnrollments.unlockedDay,
        status: bootcampEnrollments.status,
        finalScore: bootcampEnrollments.finalScore,
        enrolledAt: bootcampEnrollments.enrolledAt,
      })
      .from(bootcampEnrollments)
      .where(bootcampEnrollments.status === "ACTIVE" || bootcampEnrollments.status === "COMPLETED")
      .orderBy(desc(bootcampEnrollments.currentDay), desc(bootcampEnrollments.enrolledAt));

    // 2. Query real daily submissions
    const submissions = await db
      .select({
        id: bootcampDailySubmissions.id,
        enrollmentId: bootcampDailySubmissions.enrollmentId,
        dayNumber: bootcampDailySubmissions.dayNumber,
        passedCodeChallenge: bootcampDailySubmissions.passedCodeChallenge,
        status: bootcampDailySubmissions.status,
      })
      .from(bootcampDailySubmissions);

    const totalStudents = enrollments.length;
    const totalSubmissions = submissions.length;

    // 3. Aggregate milestone progress per student
    const studentStats = enrollments.map((e) => {
      const studentSubs = submissions.filter((s) => s.enrollmentId === e.id);
      const passedSubs = studentSubs.filter((s) => s.passedCodeChallenge || s.status === "APPROVED");
      const milestonesPassed = Math.max(passedSubs.length, (e.unlockedDay || 1) - 1, 0);

      // Mask student name for privacy (e.g., "Divyanshu J.")
      const parts = (e.studentName || "Intern").trim().split(" ");
      const maskedName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];

      // Real audit score calculation
      let auditScore = e.finalScore || 0;
      if (!auditScore) {
        if (milestonesPassed > 0) {
          auditScore = Math.min(99, 85 + Math.round((milestonesPassed / 28) * 14));
        } else {
          auditScore = 0;
        }
      }

      let tier: "GOLD" | "SILVER" | "BRONZE" = "BRONZE";
      let badge = "🚀 Rising Star";
      if (milestonesPassed >= 26 || auditScore >= 95) {
        tier = "GOLD";
        badge = "⭐ Star Contributor";
      } else if (milestonesPassed >= 23 || auditScore >= 90) {
        tier = "SILVER";
        badge = "🧠 Architecture Lead";
      }

      return {
        id: e.id,
        name: maskedName,
        trackId: e.trackId,
        milestonesPassed,
        totalMilestones: 28,
        auditScore,
        streak: milestonesPassed,
        tier,
        badge,
      };
    });

    // Filter only students who have at least started or submitted milestones
    const activeRankings = studentStats
      .filter((s) => s.milestonesPassed > 0 || s.auditScore > 0)
      .sort((a, b) => b.milestonesPassed - a.milestonesPassed || b.auditScore - a.auditScore);

    return NextResponse.json({
      success: true,
      totalEnrolled: totalStudents,
      totalSubmissions,
      rankings: activeRankings,
      cohortActive: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      {
        success: false,
        totalEnrolled: 0,
        totalSubmissions: 0,
        rankings: [],
        error: error.message || "Failed to query live leaderboard data.",
      },
      { status: 500 }
    );
  }
}
