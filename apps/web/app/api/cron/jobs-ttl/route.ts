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

    const validSecret = process.env.CRON_SECRET || "india-truth-cron-secret-2026";
    const isAuthorized =
      secretParam === validSecret ||
      authHeader === `Bearer ${validSecret}` ||
      authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAuthorized && process.env.NODE_ENV === "production") {
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

    return NextResponse.json({
      success: true,
      data: {
        staleDaysThreshold: staleDays,
        closedDeactivated: cleanup.deactivated,
        deadPurged: cleanup.purged,
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
