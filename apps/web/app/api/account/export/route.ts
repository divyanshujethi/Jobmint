import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, users, candidateProfiles, candidateSkills, candidateEducation, candidateExperience, candidateProjects, applications, eq } from "@repo/database";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to export your data." }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user core record
    const userRecord = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json({ error: "User record not found." }, { status: 404 });
    }

    // Fetch candidate profile & related records
    const profile = await db.select().from(candidateProfiles).where(eq(candidateProfiles.userId, userId)).limit(1);
    
    let skillsList: any[] = [];
    let educationList: any[] = [];
    let experienceList: any[] = [];
    let projectsList: any[] = [];

    if (profile.length > 0) {
      const profileId = profile[0].id;
      skillsList = await db.select().from(candidateSkills).where(eq(candidateSkills.profileId, profileId));
      educationList = await db.select().from(candidateEducation).where(eq(candidateEducation.profileId, profileId));
      experienceList = await db.select().from(candidateExperience).where(eq(candidateExperience.profileId, profileId));
      projectsList = await db.select().from(candidateProjects).where(eq(candidateProjects.profileId, profileId));
    }

    // Fetch applications
    let userApps: any[] = [];
    if (profile.length > 0) {
      userApps = await db.select().from(applications).where(eq(applications.candidateProfileId, profile[0].id));
    }

    const exportPayload = {
      dpdpComplianceNotice: {
        act: "Digital Personal Data Protection Act, 2023 (DPDP Act, India)",
        statutorySection: "Section 11: Right to Access Information About Personal Data",
        dataFiduciary: "JobMint / RitualDev Technologies",
        exportGeneratedAt: new Date().toISOString(),
        grievanceRedressalOfficerEmail: "grievance@ritualdev.in",
      },
      account: {
        id: userRecord[0].id,
        name: userRecord[0].name,
        email: userRecord[0].email,
        role: userRecord[0].role,
        createdAt: userRecord[0].createdAt,
        updatedAt: userRecord[0].updatedAt,
      },
      candidateProfile: profile[0] || null,
      skills: skillsList,
      education: educationList,
      experience: experienceList,
      projects: projectsList,
      jobApplications: userApps,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="jobmint-dpdp-data-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error("DPDP Data Export Error:", error);
    return NextResponse.json({ error: "Failed to generate data export." }, { status: 500 });
  }
}
