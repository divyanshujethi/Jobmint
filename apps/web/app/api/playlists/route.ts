import { NextResponse } from "next/server";
import { getAllPlaylists, getDynamicPlaylists } from "@/lib/courses-store";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const all = await getAllPlaylists();
    const dynamicOnly = await getDynamicPlaylists();

    return NextResponse.json({
      success: true,
      total: all.length,
      dynamicCount: dynamicOnly.length,
      courses: all,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}
