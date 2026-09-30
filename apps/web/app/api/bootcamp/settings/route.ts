import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getAllTrackSettings,
  upsertTrackSetting,
  TrackSettingRecord,
} from "@/lib/bootcamp-settings-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getAllTrackSettings();
    return NextResponse.json({
      success: true,
      settings,
      globalSetting: settings["__global__"] || null,
    });
  } catch (error: any) {
    console.error("Error fetching bootcamp settings:", error);
    return NextResponse.json(
      { error: "Failed to load admission settings", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in"
    )
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin =
      (session?.user as any)?.role === "ADMIN" ||
      (userEmail && adminEmails.includes(userEmail));

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: SuperAdmin privileges required to modify admission status." },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Check if this is a bulk/batch update (e.g. Set all tracks to 'OPENING_SOON')
    if (body.bulk && Array.isArray(body.trackIds)) {
      const results: any[] = [];
      for (const trackId of body.trackIds) {
        const updated = await upsertTrackSetting({
          trackId,
          admissionStatus: body.admissionStatus || "OPEN",
          openingDate: body.openingDate || null,
          cohortName: body.cohortName || null,
          announcement: body.announcement || null,
          maxSeats: body.maxSeats ? Number(body.maxSeats) : null,
          seatsRemaining: body.seatsRemaining ? Number(body.seatsRemaining) : null,
          isFeatured: Boolean(body.isFeatured),
        });
        results.push(updated);
      }
      return NextResponse.json({
        success: true,
        message: `Successfully updated ${results.length} tracks to ${body.admissionStatus}`,
        count: results.length,
      });
    }

    // Single track setting update
    if (!body.trackId) {
      return NextResponse.json(
        { error: "Missing required parameter: trackId" },
        { status: 400 }
      );
    }

    const updated = await upsertTrackSetting({
      trackId: body.trackId,
      admissionStatus: body.admissionStatus || "OPEN",
      openingDate: body.openingDate || null,
      cohortName: body.cohortName || null,
      announcement: body.announcement || null,
      maxSeats: body.maxSeats !== undefined ? Number(body.maxSeats) : null,
      seatsRemaining: body.seatsRemaining !== undefined ? Number(body.seatsRemaining) : null,
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json({
      success: true,
      message: `Track '${body.trackId}' admission status updated to ${body.admissionStatus}`,
      setting: updated,
    });
  } catch (error: any) {
    console.error("Error updating bootcamp settings:", error);
    return NextResponse.json(
      { error: "Failed to update admission settings", details: error.message },
      { status: 500 }
    );
  }
}
