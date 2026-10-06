import { NextRequest, NextResponse } from "next/server";
import { getMergedArenaProblems, getArenaProblemBySlug } from "@/lib/arena-problems-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");
    const company = searchParams.get("company");
    const search = searchParams.get("search")?.toLowerCase();

    // 1. Single problem lookup
    if (slug) {
      const problem = await getArenaProblemBySlug(slug);
      if (!problem) {
        return NextResponse.json(
          { success: false, error: `Problem with slug "${slug}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, problem },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    // 2. Filtered list lookup
    let problems = await getMergedArenaProblems();

    if (difficulty && difficulty !== "All") {
      problems = problems.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (category && category !== "All") {
      problems = problems.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (company && company !== "All") {
      problems = problems.filter((p) =>
        p.companies?.some((c) => c.toLowerCase() === company.toLowerCase())
      );
    }

    if (search) {
      problems = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.slug.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: problems.length,
        problems,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("[ArenaProblemsAPI] Error fetching problems:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch problems" },
      { status: 500 }
    );
  }
}
