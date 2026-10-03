import { NextResponse } from "next/server";
import { runJobAlligator } from "@repo/alligators";
import { persistCrawledJobs, cleanupStaleJobs } from "@/lib/job-ingestion";

export const maxDuration = 60; // Allow sufficient time for batch crawling & persisting

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const internshipLimit = parseInt(searchParams.get("internshipLimit") || "50", 10);
    const newGradLimit = parseInt(searchParams.get("newGradLimit") || "50", 10);
    const staleDays = parseInt(searchParams.get("staleDays") || "7", 10);
    const enableDiscovery = searchParams.get("discover") === "true";

    const crawlResult = await runJobAlligator({
      internshipLimit,
      newGradLimit,
      enableDiscovery,
    });
    const ingestion = await persistCrawledJobs(crawlResult.jobs);
    const cleanup = await cleanupStaleJobs(staleDays);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ...crawlResult.stats,
          insertedToDatabase: ingestion.inserted,
          updatedInDatabase: ingestion.updated,
          skipped: ingestion.skipped,
          closedDeactivated: cleanup.deactivated,
          deadPurged: cleanup.purged,
        },
        durationMs: crawlResult.durationMs,
        ingestionSummary: ingestion,
        cleanupSummary: cleanup,
      },
    });
  } catch (err: any) {
    console.error("[Job Alligator API] Crawl & Ingest error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Job Alligator failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
