import { NextResponse } from "next/server";
import { cleanupStaleJobs } from "@/lib/job-ingestion";
import { verifyCronOrAdminSecret } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Automated TTL / Expiry Cron Handler
 * Auto-deactivates unrefreshed postings older than 14-21 days (default 14 days)
 * and purges dead expired jobs older than 30 days with zero applications.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!verifyCronOrAdminSecret(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized cron execution" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    // Default TTL is 14 days, configurable between 14 and 21 days
    let staleDays = parseInt(searchParams.get("staleDays") || "14", 10);
    if (isNaN(staleDays) || staleDays < 7) {
      staleDays = 14;
    }

    const cleanup = await cleanupStaleJobs(staleDays);

    // Run active probe verification on external jobs per cron run
    let probeResult = null;
    const enableProbe = searchParams.get("probe") !== "false";
    const probeLimit = Math.min(parseInt(searchParams.get("probeLimit") || "2", 10), 10);
    if (enableProbe) {
      try {
        const { verifyActiveJobsLiveness } = await import("@/lib/job-ingestion");
        probeResult = await verifyActiveJobsLiveness(probeLimit);
      } catch (err: any) {
        console.warn("[Cron Jobs TTL] Active probe error:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        staleDaysThreshold: staleDays,
        closedDeactivated: cleanup.deactivated,
        deadPurged: cleanup.purged,
        activeProbe: probeResult,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[Cron Jobs TTL] Cleanup error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute TTL cleanup" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
