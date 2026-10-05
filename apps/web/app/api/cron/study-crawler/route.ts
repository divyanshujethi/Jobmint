import { NextResponse } from "next/server";
import { crawlYouTubePlaylist, SEED_STUDY_PLAYLISTS } from "@repo/alligators";
import { saveDynamicPlaylist, getDynamicPlaylists } from "@/lib/courses-store";
import { CoursePlaylist } from "@/lib/courses-data";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Automated Scheduled Study Crawler Cron Handler
 * Periodically health-checks and refreshes curated seed YouTube playlists,
 * updating video counts, metadata, and curriculum chapters into Redis.
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

    const limitParam = parseInt(searchParams.get("limit") || "4", 10);
    const batchLimit = isNaN(limitParam) || limitParam <= 0 ? 4 : Math.min(limitParam, SEED_STUDY_PLAYLISTS.length);

    // Pick a rotating window or top batch of seed playlists
    const offsetParam = parseInt(searchParams.get("offset") || "0", 10);
    const offset = isNaN(offsetParam) ? 0 : offsetParam % SEED_STUDY_PLAYLISTS.length;

    const targetSeeds: typeof SEED_STUDY_PLAYLISTS = [];
    for (let i = 0; i < batchLimit; i++) {
      targetSeeds.push(SEED_STUDY_PLAYLISTS[(offset + i) % SEED_STUDY_PLAYLISTS.length]);
    }

    const existingDynamic = await getDynamicPlaylists();
    const existingIds = new Set(existingDynamic.map((c) => c.id));

    const refreshed: any[] = [];
    const errors: { name: string; error: string }[] = [];
    let newAdditions = 0;

    for (const seed of targetSeeds) {
      try {
        const crawled = await crawlYouTubePlaylist(seed.url, {
          category: seed.category,
        });

        if (!existingIds.has(crawled.id)) {
          newAdditions++;
        }

        await saveDynamicPlaylist(crawled as unknown as CoursePlaylist);
        refreshed.push({
          id: crawled.id,
          title: crawled.title,
          creator: crawled.creator,
          totalVideos: crawled.totalVideos,
          duration: crawled.duration,
          category: crawled.category,
        });
      } catch (err: any) {
        errors.push({
          name: seed.name,
          error: err.message || "Failed to crawl playlist",
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        batchLimit,
        offset,
        refreshedCount: refreshed.length,
        newAdditions,
        refreshed,
        errors,
      },
    });
  } catch (err: any) {
    console.error("[Study Crawler Cron] Execution error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute study crawler cron" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
