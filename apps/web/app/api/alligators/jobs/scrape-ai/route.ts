import { NextResponse } from "next/server";
import { scrapeCustomCareerWithAI } from "@repo/alligators";
import { persistCrawledJobs } from "@/lib/job-ingestion";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // 60s max for AI web scraping & DB ingestion

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rateLimit = await checkRateLimit(request as any, {
      maxRequests: 6,
      windowSeconds: 60,
      prefix: "rl:ai:scraper",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `AI Scraper rate limit exceeded. Please wait ${rateLimit.resetInSeconds}s before making another request.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const url = body.url?.trim();
    const companyName = body.companyName?.trim();
    const companyWebsite = body.companyWebsite?.trim();
    const model = body.model?.trim();

    if (!url || !companyName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: url and companyName" },
        { status: 400 }
      );
    }

    const jobs = await scrapeCustomCareerWithAI({
      url,
      companyName,
      companyWebsite,
      model,
    });

    const ingestion = await persistCrawledJobs(jobs);

    return NextResponse.json({
      success: true,
      data: {
        companyName,
        url,
        extractedCount: jobs.length,
        jobs,
        ingestionSummary: ingestion,
      },
    });
  } catch (err: any) {
    console.error("[AI Career Scraper API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "AI Career Scraping failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const rateLimit = await checkRateLimit(request as any, {
      maxRequests: 6,
      windowSeconds: 60,
      prefix: "rl:ai:scraper:get",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `AI Scraper rate limit exceeded. Please wait ${rateLimit.resetInSeconds}s before making another request.`,
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url")?.trim();
    const companyName = searchParams.get("name")?.trim();
    const companyWebsite = searchParams.get("website")?.trim();
    const model = searchParams.get("model")?.trim() || undefined;

    if (!url || !companyName) {
      return NextResponse.json(
        {
          success: false,
          error: "Provide query params: ?url=https://company.com/careers&name=CompanyName",
        },
        { status: 400 }
      );
    }

    const jobs = await scrapeCustomCareerWithAI({
      url,
      companyName,
      companyWebsite,
      model,
    });

    const ingestion = await persistCrawledJobs(jobs);

    return NextResponse.json({
      success: true,
      data: {
        companyName,
        url,
        extractedCount: jobs.length,
        jobs,
        ingestionSummary: ingestion,
      },
    });
  } catch (err: any) {
    console.error("[AI Career Scraper API GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "AI Career Scraping failed" },
      { status: 500 }
    );
  }
}
