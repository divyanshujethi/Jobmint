import { NextRequest, NextResponse } from "next/server";
import { db, bootcampEnrollments, eq, or } from "@repo/database";
import {
  DISCORD_ROLES,
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

      // 2. Assign Domain Specific Role
      const trackLower = (enrollment.trackId || "").toLowerCase();
      let trackRole: string | null = null;
      let trackRoleName = "";

      if (trackLower.includes("ai") || trackLower.includes("ml")) {
        trackRole = DISCORD_ROLES.AIML_SPECIALIST;
        trackRoleName = "AI / ML Specialist";
      } else if (trackLower.includes("next")) {
        trackRole = DISCORD_ROLES.NEXTJS_ARCHITECT;
        trackRoleName = "Next.js Architect";
      } else if (trackLower.includes("web") || trackLower.includes("frontend") || trackLower.includes("backend") || trackLower.includes("fullstack")) {
        trackRole = DISCORD_ROLES.FULLSTACK_ENGINEER;
        trackRoleName = "Full-Stack Engineer";
      } else if (trackLower.includes("cyber") || trackLower.includes("security")) {
        trackRole = DISCORD_ROLES.CYBER_SECURITY;
        trackRoleName = "Cyber Security Analyst";
      } else if (trackLower.includes("cloud") || trackLower.includes("sre") || trackLower.includes("devops")) {
        trackRole = DISCORD_ROLES.CLOUD_DEVOPS;
        trackRoleName = "Cloud / DevOps Engineer";
      } else if (trackLower.includes("block") || trackLower.includes("web3") || trackLower.includes("solidity")) {
        trackRole = DISCORD_ROLES.BLOCKCHAIN_WEB3;
        trackRoleName = "Blockchain / Web3 Engineer";
      }

      if (trackRole) {
        const trackSuccess = await assignDiscordStudentRole(cleanUserId, trackRole);
        if (trackSuccess) {
          assignedRoles.push(trackRoleName);
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
