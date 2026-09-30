import { NextRequest, NextResponse } from "next/server";
import { db, bootcampEnrollments, eq, or } from "@repo/database";
import {
  DISCORD_ROLES,
  TRACK_DISCORD_ROLES,
  DISCORD_CHANNELS,
  assignDiscordStudentRole,
  sendDiscordMessage,
} from "@/lib/discord-notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrRoll, discordUserId } = body;

    if (!emailOrRoll || typeof emailOrRoll !== "string") {
      return NextResponse.json(
        { error: "Please enter your enrolled email, roll number, or Offer Letter ID." },
        { status: 400 }
      );
    }

    const cleaned = emailOrRoll.trim().toLowerCase();

    // Query active enrollment in DB
    const enrollments = await db
      .select()
      .from(bootcampEnrollments)
      .where(
        or(
          eq(bootcampEnrollments.studentEmail, cleaned),
          eq(bootcampEnrollments.rollNumber, cleaned.toUpperCase()),
          eq(bootcampEnrollments.offerLetterId, cleaned.toUpperCase())
        )
      )
      .limit(1);

    if (enrollments.length === 0) {
      return NextResponse.json(
        {
          error: "No active internship enrollment found with this email, roll number, or Offer Letter ID. Please check your spelling or register at internship.rolenest.in.",
        },
        { status: 404 }
      );
    }

    const enrollment = enrollments[0];

    if (enrollment.status === "REVOKED" || enrollment.status === "REFUNDED") {
      return NextResponse.json(
        {
          error: `Enrollment status is ${enrollment.status}. Discord verified student roles cannot be issued to revoked credentials.`,
        },
        { status: 403 }
      );
    }

    let assignedRoles: string[] = [];

    // If discordUserId is provided, call Discord REST API to assign roles
    if (discordUserId && /^\d{17,20}$/.test(discordUserId.trim())) {
      const cleanUserId = discordUserId.trim();

      // 1. Assign AICTE Verified Intern or Sandbox Cohort
      const baseRole =
        enrollment.amountPaid === 0
          ? DISCORD_ROLES.SANDBOX_COHORT
          : DISCORD_ROLES.VERIFIED_INTERN;

      const baseSuccess = await assignDiscordStudentRole(cleanUserId, baseRole);
      if (baseSuccess) {
        assignedRoles.push(enrollment.amountPaid === 0 ? "Sandbox Testing Cohort" : "AICTE Verified Intern");
      }

      // 2. Assign Domain Specific Role across all 33 Industrial Tracks
      const trackId = enrollment.trackId || "";
      const trackLower = trackId.toLowerCase().trim();
      let matchedConfig = TRACK_DISCORD_ROLES[trackId] || TRACK_DISCORD_ROLES[trackLower];

      if (!matchedConfig) {
        for (const [key, cfg] of Object.entries(TRACK_DISCORD_ROLES)) {
          if (
            trackLower.includes(key) ||
            key.includes(trackLower) ||
            trackLower.includes(cfg.channelName) ||
            trackLower.includes(cfg.roleName.toLowerCase().replace(/[^a-z0-9]/g, ""))
          ) {
            matchedConfig = cfg;
            break;
          }
        }
      }

      if (matchedConfig) {
        const trackSuccess = await assignDiscordStudentRole(cleanUserId, matchedConfig.roleId);
        if (trackSuccess) {
          assignedRoles.push(matchedConfig.roleName);
        }
      }

      // Send verification announcement to #welcome-and-verify
      await sendDiscordMessage(DISCORD_CHANNELS.WELCOME_VERIFY, {
        content: `🎉 <@${cleanUserId}> has been verified! Enrolled in **${enrollment.trackId}** (${enrollment.collegeName}). Granted roles: **${assignedRoles.join(", ") || "Verified Intern"}**!`,
      });
    }

    return NextResponse.json({
      success: true,
      studentName: enrollment.studentName,
      trackId: enrollment.trackId,
      collegeName: enrollment.collegeName,
      offerLetterId: enrollment.offerLetterId,
      status: enrollment.status,
      assignedRoles,
      message: `Verified successfully for ${enrollment.studentName}! Roles assigned: ${assignedRoles.join(", ") || "Verified"}`,
    });
  } catch (error: any) {
    console.error("Discord verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete Discord student verification." },
      { status: 500 }
    );
  }
}
