import { NextResponse } from "next/server";
import { getPlatformMetrics } from "@/lib/platform-metrics";

export const dynamic = "force-dynamic";
export const revalidate = 60; // 60 seconds edge revalidation

export async function GET() {
  try {
    const metrics = await getPlatformMetrics();
    return NextResponse.json(metrics, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve platform metrics" },
      { status: 500 }
    );
  }
}
