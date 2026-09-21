import { NextResponse } from "next/server";
import { runJobAlligator } from "@repo/alligators";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const result = await runJobAlligator();
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Job Alligator failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
