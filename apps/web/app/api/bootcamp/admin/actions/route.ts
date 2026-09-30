import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, bootcampEnrollments, eq } from "@repo/database";
import { notifyDiscordSecurityAlert, notifyDiscordCertificateIssued } from "@/lib/discord-notifications";

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
        { error: "Forbidden: SuperAdmin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, enrollmentId, dayNumber, status, certificateId, finalGrade, finalScore } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: "Missing enrollmentId" }, { status: 400 });
    }

    if (action === "unlock_day") {
      const targetDay = Number(dayNumber) || 1;
      await db
        .update(bootcampEnrollments)
        .set({
          unlockedDay: targetDay,
          currentDay: targetDay,
          updatedAt: new Date(),
        })
        .where(eq(bootcampEnrollments.id, enrollmentId));

      return NextResponse.json({
        success: true,
        message: `Unlocked up to Day ${targetDay} for student`,
      });
    }

    if (action === "unlock_all") {
      await db
        .update(bootcampEnrollments)
        .set({
          unlockedDay: 28,
          currentDay: 28,
          updatedAt: new Date(),
        })
        .where(eq(bootcampEnrollments.id, enrollmentId));

      return NextResponse.json({
        success: true,
        message: "Unlocked all 28 Days for testing/evaluation",
      });
    }

    if (action === "certify") {
      const certId = certificateId || `RN-INT-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const [updated] = await db
        .update(bootcampEnrollments)
        .set({
          status: "COMPLETED",
          certificateId: certId,
          finalGrade: finalGrade || "A+",
          finalScore: Number(finalScore) || 98,
          updatedAt: new Date(),
        })
        .where(eq(bootcampEnrollments.id, enrollmentId))
        .returning();

      if (updated) {
        notifyDiscordCertificateIssued({
          studentName: updated.studentName,
          trackTitle: updated.trackId,
          certificateId: certId,
          verificationUrl: `https://internship.rolenest.in/verify/${certId}`,
          grade: updated.finalGrade || "A+",
        }).catch((err) => console.warn("Discord cert alert error:", err));
      }

      return NextResponse.json({
        success: true,
        message: `Student certified successfully with Certificate ID: ${certId}`,
        certificateId: certId,
      });
    }

    if (action === "update_status") {
      const [updated] = await db
        .update(bootcampEnrollments)
        .set({
          status: status || "ACTIVE",
          updatedAt: new Date(),
        })
        .where(eq(bootcampEnrollments.id, enrollmentId))
        .returning();

      if (updated && (status === "REVOKED" || status === "REFUNDED")) {
        notifyDiscordSecurityAlert({
          type: status === "REFUNDED" ? "CHARGEBACK" : "REVOCATION",
          studentName: updated.studentName,
          rollNumber: updated.rollNumber || "N/A",
          reason: `Admin status update to ${status} via dashboard.`,
          enrollmentId: updated.id,
        }).catch((err) => console.warn("Discord security alert error:", err));
      }

      return NextResponse.json({
        success: true,
        message: `Updated enrollment status to ${status}`,
      });
    }

    if (action === "delete_enrollment") {
      await db
        .delete(bootcampEnrollments)
        .where(eq(bootcampEnrollments.id, enrollmentId));

      return NextResponse.json({
        success: true,
        message: "Enrollment deleted successfully",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error executing bootcamp admin action:", error);
    return NextResponse.json(
      { error: "Failed to perform admin action", details: error.message },
      { status: 500 }
    );
  }
}
