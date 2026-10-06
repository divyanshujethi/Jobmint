import { NextRequest, NextResponse } from "next/server";
import { getDailyArenaChallenge } from "@/lib/arena-problems-service";

export async function GET(_req: NextRequest) {
  try {
    const data = await getDailyArenaChallenge();

    return NextResponse.json(
      {
        success: true,
        date: data.date,
        totalAvailable: data.totalAvailable,
        daily: data.daily,
        superHard: data.superHard,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    console.error("[ArenaPOTDAPI] Error fetching daily POTD:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}
