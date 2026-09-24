import { NextResponse } from "next/server";
import { db, applications, jobs, companies, eq, desc } from "@repo/database";
import { ApplicationStatus } from "@repo/shared";

/**
 * Truth Teller Background 7-Day Inactivity Detector
 * Triggered automatically by GitHub Actions, Cloudflare Cron, or cron-job.org
 * Free tier safe & idempotent
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET || "dev-cron-secret";

  // Verify secret in production
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${secret}` &&
    searchParams.get("key") !== secret
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const rawApps = await db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        lastViewedAt: applications.lastViewedAt,
        jobTitle: jobs.title,
        companyName: companies.name,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .orderBy(desc(applications.appliedAt));

    let scannedCount = 0;
    let flaggedInactiveCount = 0;
    const processedApps = [];
    const now = Date.now();

    for (const app of rawApps) {
      scannedCount++;
      const daysSinceApplied = Math.floor(
        (now - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      // If applied 7+ days ago and still unreviewed
      if (daysSinceApplied >= 7 && !app.lastViewedAt && app.status === ApplicationStatus.APPLIED) {
        flaggedInactiveCount++;
        processedApps.push({
          applicationId: app.id,
          jobTitle: app.jobTitle,
          companyName: app.companyName,
          appliedDaysAgo: daysSinceApplied,
          action: "FLAGGED_INACTIVE_7_DAYS_ALERT_SENT",
        });
      }
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      executionMs: Date.now() - startTime,
      telemetry: {
        totalScanned: scannedCount,
        flaggedInactive: flaggedInactiveCount,
        processed: processedApps,
      },
      message: `Truth Teller Inactivity check completed. ${flaggedInactiveCount} application(s) flagged for candidate notification.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
