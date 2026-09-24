import { NextRequest, NextResponse } from "next/server";
import { db, applications, applicationEvents, jobs, companies, candidateProfiles, users, eq, desc } from "@repo/database";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    // Query DB
    const dbApps = await db
      .select({
        id: applications.id,
        jobId: applications.jobId,
        candidateProfileId: applications.candidateProfileId,
        resumeUrl: applications.resumeUrl,
        status: applications.status,
        coverNote: applications.coverNote,
        appliedAt: applications.appliedAt,
        lastViewedAt: applications.lastViewedAt,
        lastStatusChangeAt: applications.lastStatusChangeAt,
        jobTitle: jobs.title,
        jobSlug: jobs.slug,
        jobType: jobs.jobType,
        workMode: jobs.workMode,
        salaryOrStipend: jobs.salaryOrStipend,
        location: jobs.location,
        companyName: companies.name,
        companySlug: companies.slug,
        isVerified: companies.isVerified,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .orderBy(desc(applications.appliedAt));

    const now = Date.now();
    const formatted = dbApps.map((app) => {
      const daysSinceApplied = Math.floor(
        (now - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const isGhosted = !app.lastViewedAt && daysSinceApplied >= 7;

      return {
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        jobSlug: app.jobSlug,
        companyName: app.companyName,
        companySlug: app.companySlug,
        companyLogoInitial: app.companyName.charAt(0).toUpperCase(),
        isVerifiedCompany: app.isVerified,
        appliedDateFormatted: new Date(app.appliedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: app.status,
        salaryOrStipend: app.salaryOrStipend,
        location: `${app.location} (${app.workMode})`,
        resumeViewedAtFormatted: app.lastViewedAt
          ? new Date(app.lastViewedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        daysSinceApplied,
        isGhosted,
        ghostingThresholdDays: 7,
      };
    });

    return NextResponse.json({
      applications: formatted,
      total: formatted.length,
      source: "postgresql-jobmint-prod",
    });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, resumeUrl, email, phone, coverNote } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const session = await auth();
    const candidateEmail = email || session?.user?.email || "candidate@jobmint.ritualdev.in";

    // 1. Get or create candidate user
    let userList = await db.select().from(users).where(eq(users.email, candidateEmail)).limit(1);
    let userId: string;
    if (userList.length === 0) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: candidateEmail,
          name: candidateEmail.split("@")[0],
          role: "CANDIDATE",
        })
        .returning();
      userId = newUser.id;
    } else {
      userId = userList[0].id;
    }

    // 2. Get or create candidate profile
    let profileList = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, userId))
      .limit(1);

    let profileId: string;
    if (profileList.length === 0) {
      const [newProfile] = await db
        .insert(candidateProfiles)
        .values({
          userId,
          phone: phone || null,
          resumeUrl: resumeUrl || null,
        })
        .returning();
      profileId = newProfile.id;
    } else {
      profileId = profileList[0].id;
      if (resumeUrl || phone) {
        await db
          .update(candidateProfiles)
          .set({
            resumeUrl: resumeUrl || profileList[0].resumeUrl,
            phone: phone || profileList[0].phone,
            updatedAt: new Date(),
          })
          .where(eq(candidateProfiles.id, profileId));
      }
    }

    // 3. Create application
    const [newApp] = await db
      .insert(applications)
      .values({
        jobId,
        candidateProfileId: profileId,
        resumeUrl: resumeUrl || "/uploads/resumes/default.pdf",
        status: "APPLIED",
        coverNote: coverNote || null,
        appliedAt: new Date(),
        lastStatusChangeAt: new Date(),
      })
      .returning();

    // 4. Create application event for Truth Teller
    await db.insert(applicationEvents).values({
      applicationId: newApp.id,
      eventType: "APPLIED",
      note: "Application successfully received by JobMint telemetry with Truth Teller active.",
    });

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      message: "Application recorded in PostgreSQL database with Truth Teller tracking active!",
    });
  } catch (error: any) {
    console.error("Error submitting application to DB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
