import { NextResponse } from "next/server";
import { runJobAlligator } from "@repo/alligators";
import { persistCrawledJobs } from "@/lib/job-ingestion";

export const maxDuration = 60; // Allow sufficient time for batch crawling & persisting

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const internshipLimit = parseInt(searchParams.get("internshipLimit") || "50", 10);
    const newGradLimit = parseInt(searchParams.get("newGradLimit") || "50", 10);

    const crawlResult = await runJobAlligator({ internshipLimit, newGradLimit });
    const ingestion = await persistCrawledJobs(crawlResult.jobs);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ...crawlResult.stats,
          insertedToDatabase: ingestion.inserted,
          updatedInDatabase: ingestion.updated,
          skipped: ingestion.skipped,
        },
        durationMs: crawlResult.durationMs,
        ingestionSummary: ingestion,
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
