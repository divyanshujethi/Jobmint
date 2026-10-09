import { NextResponse } from "next/server";
import { crawlYouTubePlaylist, SEED_STUDY_PLAYLISTS } from "@repo/alligators";
import { getAllPlaylists, getDynamicPlaylists, saveDynamicPlaylist } from "@/lib/courses-store";
import { CURATED_COURSES, CoursePlaylist } from "@/lib/courses-data";
import { verifyCronOrAdminSecret, verifyAdminSession } from "@/lib/api-auth";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const all = await getAllPlaylists();
    const dynamicPlaylists = await getDynamicPlaylists();

    return NextResponse.json({
      success: true,
      data: {
        totalPlaylists: all.length,
        curatedCount: CURATED_COURSES.length,
        dynamicCount: dynamicPlaylists.length,
        recentDynamic: dynamicPlaylists.slice(0, 10).map((c) => ({
          id: c.id,
          title: c.title,
          creator: c.creator,
          category: c.category,
          totalVideos: c.totalVideos,
          duration: c.duration,
          youtubeUrl: c.youtubeUrl,
          skills: c.skillsLearned,
        })),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch study crawler stats" },
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
      const text = await request.text();
      if (text && text.trim()) {
        body = JSON.parse(text);
      }
    } catch {
      // Body may be empty
    }

    const targetUrl = body.playlistUrl || body.playlistId || body.url;

    // 1. Single Playlist On-Demand Ingestion
    if (targetUrl) {
      const crawled = await crawlYouTubePlaylist(targetUrl, {
        category: body.category,
        subcategory: body.subcategory,
        difficulty: body.difficulty,
      });

      // Save to Redis and fallback file
      await saveDynamicPlaylist(crawled as unknown as CoursePlaylist);

      return NextResponse.json({
        success: true,
        data: {
          course: crawled,
          message: `Successfully crawled "${crawled.title}" by ${crawled.creator} (${crawled.totalVideos} videos, ${crawled.skillsLearned.length} skills detected). Added to /playlists!`,
        },
      });
    }

    // 2. Batch Sync Seeds
    if (body.mode === "seed_sync") {
      const ingested: any[] = [];
      const errors: string[] = [];

      const targetList = typeof body.limit === "number" ? SEED_STUDY_PLAYLISTS.slice(0, body.limit) : SEED_STUDY_PLAYLISTS;
      for (const seed of targetList) {
        try {
          const crawled = await crawlYouTubePlaylist(seed.url, { category: seed.category });
          await saveDynamicPlaylist(crawled as unknown as CoursePlaylist);
          ingested.push(crawled);
        } catch (e: any) {
          errors.push(`${seed.name}: ${e.message}`);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          syncedCount: ingested.length,
          ingested: ingested.map((i) => ({ id: i.id, title: i.title, creator: i.creator, videos: i.totalVideos })),
          errors,
        },
      });
    }

    // 3. Fallback: Return current status
    return GET();
  } catch (err: any) {
    console.error("[Study Crawler API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to crawl YouTube playlist" },
      { status: 500 }
    );
  }
}
