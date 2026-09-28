import { NextRequest, NextResponse } from "next/server";
import { db, courseCertificates, eq } from "@repo/database";
import { CURATED_COURSES } from "@/lib/courses-data";
import { SHOWCASE_CERTIFICATES } from "@/lib/certificates-issuer";
import { SHOWCASE_INTERNSHIP_CERTIFICATES } from "@/lib/bootcamp-certificates";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const certId = id.toUpperCase();

    // 1. Check PostgreSQL database for real earned certificate
    const dbResults = await db
      .select()
      .from(courseCertificates)
      .where(eq(courseCertificates.id, certId))
      .limit(1);

    if (dbResults.length > 0) {
      const dbCert = dbResults[0];
      const course = CURATED_COURSES.find((c) => c.id === dbCert.courseId) || CURATED_COURSES[0];

      return NextResponse.json({
        success: true,
        certificate: {
          id: dbCert.id,
          courseId: dbCert.courseId,
          courseTitle: course.title,
          certificateTitle: course.certificateTitle,
          recipientName: dbCert.recipientName,
          issuedAt: dbCert.issuedAt.toISOString(),
          skills: course.skillsLearned,
          creatorAttribution: `Curriculum curated by ${course.creator} • Verified by Role Nest Technical Education`,
          githubProofUrl: dbCert.githubUrl || undefined,
          verificationHash: dbCert.verificationHash,
          score: dbCert.score,
          verified: true,
          status: "VERIFIED",
        },
      });
    }

    // 2. Check Showcase course certificates
    const showcase = SHOWCASE_CERTIFICATES.find((c) => c.id.toUpperCase() === certId);
    if (showcase) {
      return NextResponse.json({
        success: true,
        certificate: showcase,
      });
    }

    // 3. Check Showcase industrial internship certificates
    const internshipShowcase = SHOWCASE_INTERNSHIP_CERTIFICATES.find((c) => c.id.toUpperCase() === certId);
    if (internshipShowcase) {
      return NextResponse.json({
        success: true,
        certificate: {
          id: internshipShowcase.id,
          courseId: internshipShowcase.trackId,
          courseTitle: internshipShowcase.trackTitle,
          certificateTitle: internshipShowcase.certificateTitle,
          recipientName: internshipShowcase.recipientName,
          recipientEmail: internshipShowcase.recipientEmail,
          collegeName: internshipShowcase.collegeName,
          degreeBranch: internshipShowcase.degreeBranch,
          issuedAt: internshipShowcase.issuedAt,
          durationLabel: internshipShowcase.durationLabel,
          skills: internshipShowcase.skills,
          creatorAttribution: `Industrial Program Directed by ${internshipShowcase.mentorName} • Verified by RoleNest Technical Education`,
          githubProofUrl: internshipShowcase.githubUrl,
          verificationHash: internshipShowcase.verificationHash,
          score: internshipShowcase.score,
          grade: internshipShowcase.grade,
          verified: true,
          status: internshipShowcase.status,
          academicCredits: internshipShowcase.academicCredits,
          aicteCompliant: internshipShowcase.aicteCompliant,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Certificate not found or unverified in database." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Certificate verify error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify certificate." },
      { status: 500 }
    );
  }
}
