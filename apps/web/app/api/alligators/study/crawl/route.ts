import { NextResponse } from "next/server";
import { runStudyCrawler } from "@/lib/study-crawler";
import { CURATED_COURSES } from "@/lib/courses-data";

export const maxDuration = 30;

export async function GET(): Promise<NextResponse> {
  try {
    const crawlerResult = await runStudyCrawler();

    return NextResponse.json({
      success: true,
      data: {
        totalPlaylists: CURATED_COURSES.length,
        verifiedPlaylists: CURATED_COURSES.map((c) => ({
          id: c.id,
          title: c.title,
          creator: c.creator,
          category: c.category,
          totalVideos: c.totalVideos,
          duration: c.duration,
          youtubeUrl: c.youtubeUrl,
          githubRepos: c.recommendedGithubRepos.length,
        })),
        crawlerStats: crawlerResult,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to crawl study content" },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  return GET();
}
