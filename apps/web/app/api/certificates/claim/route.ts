import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, courseCertificates, eq, and } from "@repo/database";
import { CURATED_COURSES } from "@/lib/courses-data";
import { getQuizForCourse } from "@/lib/courses-quizzes";
import { generateCertificateId, computeVerificationHash } from "@/lib/certificates-issuer";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id || !session.user.name) {
      return NextResponse.json(
        {
          error: "Authentication Required: You must be logged in with a verified account to earn a certified JobMint diploma.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { courseId, quizAnswers, githubUrl } = body;

    const course = CURATED_COURSES.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ error: "Invalid course identifier." }, { status: 404 });
    }

    // Check if user already earned a certificate for this course
    const existing = await db
      .select()
      .from(courseCertificates)
      .where(
        and(
          eq(courseCertificates.userId, session.user.id),
          eq(courseCertificates.courseId, courseId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const cert = existing[0];
      return NextResponse.json({
        success: true,
        alreadyIssued: true,
        certificate: {
          id: cert.id,
          courseId: cert.courseId,
          courseTitle: course.title,
          certificateTitle: course.certificateTitle,
          recipientName: cert.recipientName,
          recipientEmail: cert.recipientEmail,
          issuedAt: cert.issuedAt.toISOString(),
          skills: course.skillsLearned,
          creatorAttribution: `Curriculum curated by ${course.creator} • Verified by JobMint Technical Education`,
          githubProofUrl: cert.githubUrl || undefined,
          verificationHash: cert.verificationHash,
          score: cert.score,
          verified: true,
          status: "VERIFIED",
        },
      });
    }

    // Evaluate technical quiz
    const quiz = getQuizForCourse(courseId);
    let correctCount = 0;

    quiz.forEach((q) => {
      const selectedIndex = quizAnswers?.[q.id];
      if (selectedIndex === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / quiz.length) * 100);

    // Enforce 80% passing threshold
    if (scorePercent < 80) {
      return NextResponse.json(
        {
          error: `Assessment Failed: You scored ${correctCount}/${quiz.length} (${scorePercent}%). An 80% passing grade is strictly required to earn this certificate. Please review the curriculum and retake the test.`,
          score: scorePercent,
          correctCount,
          totalQuestions: quiz.length,
          passed: false,
        },
        { status: 400 }
      );
    }

    // Issue authentic certificate tied to verified user
    const certId = generateCertificateId(courseId);
    const issuedAt = new Date();
    const verificationHash = computeVerificationHash(
      certId,
      session.user.name,
      courseId,
      issuedAt.toISOString()
    );

    await db.insert(courseCertificates).values({
      id: certId,
      userId: session.user.id,
      courseId,
      recipientName: session.user.name,
      recipientEmail: session.user.email || "student@jobmint.ritualdev.in",
      score: scorePercent,
      githubUrl: githubUrl?.trim() || null,
      verificationHash,
      issuedAt,
    });

    return NextResponse.json({
      success: true,
      passed: true,
      score: scorePercent,
      certificate: {
        id: certId,
        courseId,
        courseTitle: course.title,
        certificateTitle: course.certificateTitle,
        recipientName: session.user.name,
        recipientEmail: session.user.email,
        issuedAt: issuedAt.toISOString(),
        skills: course.skillsLearned,
        creatorAttribution: `Curriculum curated by ${course.creator} • Verified by JobMint Technical Education`,
        githubProofUrl: githubUrl?.trim() || undefined,
        verificationHash,
        score: scorePercent,
        verified: true,
        status: "VERIFIED",
      },
    });
  } catch (error) {
    console.error("Certificate claim error:", error);
    return NextResponse.json({ error: "Failed to process certificate claim." }, { status: 500 });
  }
}
