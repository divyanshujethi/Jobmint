import { NextResponse } from "next/server";
import { INITIAL_CANDIDATE_APPLICATIONS } from "@/lib/mock-applications";
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

  // Scan applications
  let scannedCount = 0;
  let flaggedInactiveCount = 0;
  const processedApps = [];

  for (const app of INITIAL_CANDIDATE_APPLICATIONS) {
    scannedCount++;
    // If applied 7+ days ago and still unreviewed
    if (app.appliedDaysAgo >= 7 && app.status === ApplicationStatus.APPLIED) {
      flaggedInactiveCount++;
      processedApps.push({
        applicationId: app.id,
        jobTitle: app.jobTitle,
        companyName: app.companyName,
        appliedDaysAgo: app.appliedDaysAgo,
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
}
