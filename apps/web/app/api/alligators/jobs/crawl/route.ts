import { NextResponse } from "next/server";
import {
  runJobAlligator,
  crawlInternshalaOpportunities,
  crawlNaukriIndia,
  crawlLinkedInGuestJobs,
  crawlFounditIndia,
  RawCrawledJob,
} from "@repo/alligators";
import { persistCrawledJobs, cleanupStaleJobs } from "@/lib/job-ingestion";
import { invalidateJobsCache } from "@/lib/db-jobs";

export const maxDuration = 60; // Allow sufficient time for batch crawling & persisting

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const crawler = (searchParams.get("crawler") || searchParams.get("target") || "all").toLowerCase();
    const staleDays = parseInt(searchParams.get("staleDays") || "14", 10);

    let jobsToPersist: RawCrawledJob[] = [];
    let crawlStats: any = {};

    if (crawler === "internshala" || crawler === "internship") {
      const limit = parseInt(searchParams.get("limit") || "1000", 10);
      jobsToPersist = await crawlInternshalaOpportunities({ limit });
      crawlStats = { accepted: jobsToPersist.length, totalCrawled: jobsToPersist.length, rejectedGhostJobs: 0 };
    } else if (crawler === "naukri") {
      const limit = parseInt(searchParams.get("limit") || "1500", 10);
      jobsToPersist = await crawlNaukriIndia({ limit, maxSitemaps: 3 });
      crawlStats = { accepted: jobsToPersist.length, totalCrawled: jobsToPersist.length, rejectedGhostJobs: 0 };
    } else if (crawler === "linkedin") {
      const limit = parseInt(searchParams.get("limit") || "300", 10);
      jobsToPersist = await crawlLinkedInGuestJobs({ totalLimit: limit });
      crawlStats = { accepted: jobsToPersist.length, totalCrawled: jobsToPersist.length, rejectedGhostJobs: 0 };
    } else if (crawler === "foundit") {
      const limit = parseInt(searchParams.get("limit") || "2000", 10);
      jobsToPersist = await crawlFounditIndia({ limit, sitemapIndexCount: 2 });
      crawlStats = { accepted: jobsToPersist.length, totalCrawled: jobsToPersist.length, rejectedGhostJobs: 0 };
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
