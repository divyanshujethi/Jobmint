import { NextResponse } from "next/server";
import {
  probeCompanyCareers,
  discoverStartupBoards,
  getDiscoveredBoards,
  verifyAtsBoard,
  crawlIndiaTechBoards,
} from "@repo/alligators";
import { persistCrawledJobs } from "@/lib/job-ingestion";
import { verifyCronOrAdminSecret, verifyAdminSession } from "@/lib/api-auth";

export const maxDuration = 60; // Up to 60s for network probing and validation

export async function GET(request: Request): Promise<NextResponse> {
  const isAuthorized = verifyCronOrAdminSecret(request) || (await verifyAdminSession());
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain")?.trim();
    const companyName = searchParams.get("name")?.trim();
    const maxDiscover = parseInt(searchParams.get("max") || "15", 10);

    // 1. Single Company Domain Probe
    if (domain) {
      const detected = await probeCompanyCareers(domain, companyName);
      if (!detected) {
        return NextResponse.json({
          success: false,
          message: `No public ATS board (Ashby/Greenhouse/Lever) detected for ${domain}.`,
        }, { status: 404 });
      }

      const verification = await verifyAtsBoard(detected);

      // Crawl and persist jobs from this board immediately
      const crawled = await crawlIndiaTechBoards({ maxPerCompany: 25 });
      const boardJobs = crawled.filter(
        (j) => j.companyName.toLowerCase() === detected.companyName.toLowerCase()
      );
      const ingestion = await persistCrawledJobs(boardJobs);

      return NextResponse.json({
        success: true,
        data: {
          board: detected,
          verification,
          ingestionSummary: ingestion,
          jobsFound: boardJobs.length,
        },
      });
    }

    // 2. Batch Startup Discovery
    const discovered = await discoverStartupBoards({ maxDiscover });
    const allDiscovered = getDiscoveredBoards();

    return NextResponse.json({
      success: true,
      data: {
        newlyDiscoveredCount: discovered.length,
        totalDiscoveredInPool: allDiscovered.length,
        discovered,
      },
    });
  } catch (err: any) {
    console.error("[Job Discovery API] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Discovery failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const isAuthorized = verifyCronOrAdminSecret(request) || (await verifyAdminSession());
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // empty body
    }

    const domain = body.domain?.trim();
    const name = body.name?.trim();
    const maxDiscover = body.maxDiscover || 15;

    if (domain) {
      const detected = await probeCompanyCareers(domain, name);
      if (!detected) {
        return NextResponse.json({
          success: false,
          message: `No ATS board detected for ${domain}`,
        }, { status: 404 });
      }

      const verification = await verifyAtsBoard(detected);
      return NextResponse.json({
        success: true,
        data: {
          board: detected,
          verification,
        },
      });
    }

    const discovered = await discoverStartupBoards({ maxDiscover });
    return NextResponse.json({
      success: true,
      data: {
        discoveredCount: discovered.length,
        discovered,
      },
    });
  } catch (err: any) {
    console.error("[Job Discovery API POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Discovery POST failed" },
      { status: 500 }
    );
  }
}
