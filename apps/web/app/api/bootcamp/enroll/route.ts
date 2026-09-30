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

    const userEmail = session.user.email?.toLowerCase();
    const isAuthorizedTester = userEmail === "divyanshujethi@gmail.com";

    const cleanPrefix = (trackId || "TECH").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5);
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const offerLetterId = `RN-OFFER-2026-${cleanPrefix}-${randomHex}`;
    const nocLetterId = `RN-NOC-2026-${cleanPrefix}-${randomHex}`;

    let finalAmount = typeof amountPaid === "number" ? amountPaid : (!isNaN(Number(amountPaid)) ? Number(amountPaid) : 499);

    // ZERO RUPEE (₹0) COURSE RULE:
    // Only divyanshujethi@gmail.com is authorized to enroll for ₹0.
    if (finalAmount === 0 && !isAuthorizedTester) {
      return NextResponse.json(
        { error: "Zero Rupee (₹0) test access is reserved exclusively for authorized email: divyanshujethi@gmail.com. Please complete regular enrollment." },
        { status: 403 }
      );
    }

    if (isAuthorizedTester) {
      finalAmount = 0;
    }

    const [newEnrollment] = await db
      .insert(bootcampEnrollments)
      .values({
        userId,
        trackId,
        studentName: studentName.trim(),
        studentEmail: (userEmail || studentEmail).trim().toLowerCase(),
        studentPhone: studentPhone ? studentPhone.trim() : null,
        collegeName: collegeName.trim(),
        degreeBranch: degreeBranch.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        nocAddressee: (body.nocAddressee || "The Head of Department (HOD) / Training & Placement Officer (TPO)").trim(),
        semesterYear: (body.semesterYear || "6th Semester / 3rd Year").trim(),
        githubUsername: githubUsername ? githubUsername.trim() : null,
        offerLetterId,
        nocLetterId,
        currentDay: 1,
        unlockedDay: 1,
        status: "ACTIVE",
        paymentOrderId: paymentOrderId || (finalAmount === 0 ? "VIP_TESTER_DIVYANSHU" : `CF_SIM_${Date.now()}`),
        paymentStatus: "PAID",
        amountPaid: finalAmount,
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
