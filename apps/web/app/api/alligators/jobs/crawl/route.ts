import { NextResponse } from "next/server";
import {
  runJobAlligator,
  crawlInternshalaOpportunities,
  crawlNaukriIndia,
  crawlFounditIndia,
  RawCrawledJob,
} from "@repo/alligators";
import { persistCrawledJobs, cleanupStaleJobs } from "@/lib/job-ingestion";
import { invalidateJobsCache } from "@/lib/db-jobs";
import { verifyCronOrAdminSecret } from "@/lib/api-auth";

export const maxDuration = 60; // Allow sufficient time for batch crawling & persisting

export async function GET(request: Request): Promise<NextResponse> {
  if (!verifyCronOrAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const crawler = (searchParams.get("crawler") || searchParams.get("target") || "all").toLowerCase();
    const rawStaleDays = parseInt(searchParams.get("staleDays") || "14", 10);
    // Securely clamp staleDays between 7 and 60 days to prevent malicious or accidental wiping of catalog
    const staleDays = isNaN(rawStaleDays) ? 14 : Math.min(60, Math.max(7, rawStaleDays));

    let jobsToPersist: RawCrawledJob[] = [];
    let crawlStats: any = {};

    if (crawler === "internshala" || crawler === "internship") {
      const limit = parseInt(searchParams.get("limit") || "1000", 10);
      jobsToPersist = await crawlInternshalaOpportunities({ limit });
      crawlStats = { accepted: jobsToPersist.length, totalCrawled: jobsToPersist.length, rejectedGhostJobs: 0 };
    } else if (crawler === "naukri" || crawler === "foundit" || crawler === "linkedin") {
      return NextResponse.json({
        success: false,
        message: `Crawler '${crawler}' has been permanently decommissioned to guarantee authentic zero-consultancy direct ATS jobs.`,
      }, { status: 410 });
    } else {
      const internshipLimit = parseInt(searchParams.get("internshipLimit") || "50", 10);
      const newGradLimit = parseInt(searchParams.get("newGradLimit") || "50", 10);
      const adzunaPages = parseInt(searchParams.get("adzunaPages") || "10", 10);
      const founditLimit = parseInt(searchParams.get("founditLimit") || "2000", 10);
      const founditStartIndex = parseInt(searchParams.get("founditStartIndex") || "0", 10);
      const founditSitemapCount = parseInt(searchParams.get("founditSitemapCount") || "4", 10);
      const enableDiscovery = searchParams.get("discover") === "true";

      const crawlResult = await runJobAlligator({
        internshipLimit,
        newGradLimit,
        enableDiscovery,
        adzunaPages,
        founditLimit,
        founditStartIndex,
        founditSitemapCount,
      });
      jobsToPersist = crawlResult.jobs;
      crawlStats = crawlResult.stats;
    }

    const ingestion = await persistCrawledJobs(jobsToPersist);
    const cleanup = await cleanupStaleJobs(staleDays);
    await invalidateJobsCache();

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ...crawlStats,
          insertedToDatabase: ingestion.inserted,
          updatedInDatabase: ingestion.updated,
          skipped: ingestion.skipped,
          closedDeactivated: cleanup.deactivated,
          deadPurged: cleanup.purged,
        },
        crawlerTarget: crawler,
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
