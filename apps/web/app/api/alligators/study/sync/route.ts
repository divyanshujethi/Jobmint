import { NextResponse } from "next/server";
import { CURATED_STUDY_RESOURCES, getResourcesForCanvasNode } from "@repo/alligators";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalResources: CURATED_STUDY_RESOURCES,
        count: CURATED_STUDY_RESOURCES.length,
        lastSyncTimestamp: new Date().toISOString(),
        resourceCost: "100% FREE",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Study Alligator failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
