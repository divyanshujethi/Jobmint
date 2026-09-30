import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, bootcampEnrollments, bootcampDailySubmissions, desc } from "@repo/database";
import {
  getAllTrackSettings,
  getWaitlistEntries,
  ensureBootcampTables,
} from "@/lib/bootcamp-settings-db";
import { BOOTCAMP_TRACKS } from "@/lib/bootcamp-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in"
    )
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin =
      (session?.user as any)?.role === "ADMIN" ||
      (userEmail && adminEmails.includes(userEmail));

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: SuperAdmin privileges required." },
        { status: 403 }
      );
    }

    await ensureBootcampTables();

    // 1. Fetch all enrollments
    const enrollments = await db
      .select()
      .from(bootcampEnrollments)
      .orderBy(desc(bootcampEnrollments.enrolledAt));

    // 2. Fetch daily submissions
    const submissions = await db
      .select()
      .from(bootcampDailySubmissions)
      .orderBy(desc(bootcampDailySubmissions.submittedAt))
      .limit(100);

    // 3. Fetch track settings
    const trackSettings = await getAllTrackSettings();

    // 4. Fetch waitlist leads
    const waitlist = await getWaitlistEntries();

    // 5. Aggregate calculations
    const totalStudents = enrollments.length;
    const paidEnrollments = enrollments.filter((e) => e.amountPaid > 0);
    const freeTestEnrollments = enrollments.filter((e) => e.amountPaid === 0);
    const totalRevenue = paidEnrollments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
    const activeSubmissionsCount = submissions.length;

    // Track admissions breakdown
    let countOpen = 0;
    let countOpeningSoon = 0;
    let countWaitlist = 0;
    let countClosed = 0;

    BOOTCAMP_TRACKS.forEach((t) => {
      const setting = trackSettings[t.id] || trackSettings[t.slug];
      const status = setting?.admissionStatus || t.admissionStatus || "OPEN";
      if (status === "OPENING_SOON") countOpeningSoon++;
      else if (status === "WAITLIST") countWaitlist++;
      else if (status === "CLOSED") countClosed++;
      else countOpen++;
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalStudents,
        totalRevenue,
        paidCount: paidEnrollments.length,
        freeTestCount: freeTestEnrollments.length,
        totalWaitlistLeads: waitlist.length,
        submissionsCount: activeSubmissionsCount,
        tracksSummary: {
          totalTracks: BOOTCAMP_TRACKS.length,
          open: countOpen,
          openingSoon: countOpeningSoon,
          waitlist: countWaitlist,
          closed: countClosed,
        },
      },
      trackSettings,
      enrollments,
      submissions,
      waitlist,
    });
  } catch (error: any) {
    console.error("Error generating bootcamp admin stats:", error);
    return NextResponse.json(
      { error: "Failed to generate bootcamp stats", details: error.message },
      { status: 500 }
    );
  }
}
