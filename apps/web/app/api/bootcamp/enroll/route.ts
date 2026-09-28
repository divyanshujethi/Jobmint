import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/auth";
import { db, bootcampEnrollments, eq, and } from "@repo/database";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required. Please log in or create an account to enroll in an industrial bootcamp." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      trackId,
      studentName,
      studentPhone,
      collegeName,
      degreeBranch,
      rollNumber,
      githubUsername,
      paymentOrderId,
      amountPaid = 499,
    } = body;

    if (!trackId || !studentName || !collegeName || !degreeBranch || !rollNumber) {
      return NextResponse.json(
        { error: "Missing required academic verification details (Name, College, Branch, Roll No)." },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const studentEmail = session.user.email || body.studentEmail || "student@college.edu";

    // Check if user is already enrolled in this track
    const existing = await db
      .select()
      .from(bootcampEnrollments)
      .where(
        and(
          eq(bootcampEnrollments.userId, userId),
          eq(bootcampEnrollments.trackId, trackId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        enrollment: existing[0],
      });
    }

    // Generate unique verifiable Offer Letter ID and NOC Letter ID
    const cleanPrefix = (trackId || "TECH").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5);
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const offerLetterId = `RN-OFFER-2026-${cleanPrefix}-${randomHex}`;
    const nocLetterId = `RN-NOC-2026-${cleanPrefix}-${randomHex}`;

    const [newEnrollment] = await db
      .insert(bootcampEnrollments)
      .values({
        userId,
        trackId,
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim().toLowerCase(),
        studentPhone: studentPhone ? studentPhone.trim() : null,
        collegeName: collegeName.trim(),
        degreeBranch: degreeBranch.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        githubUsername: githubUsername ? githubUsername.trim() : null,
        offerLetterId,
        nocLetterId,
        currentDay: 1,
        unlockedDay: 1,
        status: "ACTIVE",
        paymentOrderId: paymentOrderId || `CF_SIM_${Date.now()}`,
        paymentStatus: "PAID",
        amountPaid: Number(amountPaid) || 499,
      })
      .returning();

    return NextResponse.json({
      success: true,
      alreadyEnrolled: false,
      enrollment: newEnrollment,
    });
  } catch (error: any) {
    console.error("Bootcamp enrollment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete bootcamp registration." },
      { status: 500 }
    );
  }
}
