import { NextRequest, NextResponse } from "next/server";
import { crawlDailyLeetCodeProblem, crawlLatestLeetCodeProblems } from "@/lib/leetcode-crawler";
import { verifyCronOrAdminSecret } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    if (!verifyCronOrAdminSecret(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || "daily"; // "daily" or "latest"
    const limit = parseInt(body.limit || "5", 10);

    if (mode === "latest") {
      const crawled = await crawlLatestLeetCodeProblems(limit);
      return NextResponse.json({
        success: true,
        mode: "latest",
        count: crawled.length,
        problems: crawled.map((p) => ({ slug: p.slug, title: p.title, difficulty: p.difficulty })),
      });
    }

    // Default: daily
    const daily = await crawlDailyLeetCodeProblem();
    return NextResponse.json({
      success: true,
      mode: "daily",
      daily: daily ? { slug: daily.slug, title: daily.title, difficulty: daily.difficulty, date: daily.potdDate } : null,
    });
  } catch (error: any) {
    console.error("[AdminCrawlProblemsAPI] Error crawling problems:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to trigger problem crawler" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!verifyCronOrAdminSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "daily";
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  try {
    if (mode === "latest") {
      const crawled = await crawlLatestLeetCodeProblems(limit);
      return NextResponse.json({
        success: true,
        mode: "latest",
        count: crawled.length,
        problems: crawled.map((p) => ({ slug: p.slug, title: p.title, difficulty: p.difficulty })),
      });
    }

    const daily = await crawlDailyLeetCodeProblem();
    return NextResponse.json({
      success: true,
      mode: "daily",
      daily: daily ? { slug: daily.slug, title: daily.title, difficulty: daily.difficulty, date: daily.potdDate } : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to trigger problem crawler" },
      { status: 500 }
    );
  }
}
