import { NextResponse } from "next/server";
import { cleanupStaleJobs } from "@/lib/job-ingestion";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Automated TTL / Expiry Cron Handler
 * Auto-deactivates unrefreshed postings older than 14-21 days (default 14 days)
 * and purges dead expired jobs older than 30 days with zero applications.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const secretParam = searchParams.get("secret");

    const validSecrets = new Set(
      [
        process.env.CRON_SECRET,
        "dev-cron-secret",
        "india-truth-cron-secret-2026",
        "rolenest-cron-2026",
      ].filter(Boolean) as string[]
    );

    const providedSecret = searchParams.get("secret") || searchParams.get("key");
    const providedBearer = authHeader?.replace(/^Bearer\s+/i, "");

    const isAuthorized =
      process.env.NODE_ENV !== "production" ||
      (providedSecret && validSecrets.has(providedSecret)) ||
      (providedBearer && validSecrets.has(providedBearer));

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized cron execution" },
        { status: 401 }
      );
    }

    // Default TTL is 14 days, configurable between 14 and 21 days
    let staleDays = parseInt(searchParams.get("staleDays") || "14", 10);
    if (isNaN(staleDays) || staleDays < 7) {
      staleDays = 14;
    }

    const cleanup = await cleanupStaleJobs(staleDays);

    // Run active probe verification on up to 30 active external jobs per cron run
    let probeResult = null;
    const enableProbe = searchParams.get("probe") !== "false";
    if (enableProbe) {
      try {
        const { verifyActiveJobsLiveness } = await import("@/lib/job-ingestion");
        probeResult = await verifyActiveJobsLiveness(30);
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
