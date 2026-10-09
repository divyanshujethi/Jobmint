import { NextRequest, NextResponse } from "next/server";
import {
  db,
  users,
  candidateProfiles,
  companies,
  jobs,
  applications,
  applicationEvents,
  eq,
  sql,
} from "@repo/database";
import { auth } from "@/auth";
import { JobSource, JobType, WorkMode, ApplicationStatus } from "@repo/shared";
import { getUserPlan } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    let userEmail = session?.user?.email?.toLowerCase();

    // Check optional header fallback for direct API token / email
    if (!userEmail) {
      const headerEmail = req.headers.get("x-user-email");
      if (headerEmail && headerEmail.includes("@")) {
        userEmail = headerEmail.trim().toLowerCase();
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        {
          error: "Please sign in to your RoleNest account to sync jobs to your personal application journal.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, companyName, location, salary, status = "APPLIED", notes, sourceUrl } = body;

    if (!title || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields: title and companyName are required." },
        { status: 400 }
      );
    }

    // 1. Resolve User
    let [dbUser] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
    if (!dbUser) {
      const [created] = await db
        .insert(users)
        .values({
          email: userEmail,
          name: session?.user?.name || userEmail.split("@")[0],
          role: "CANDIDATE",
        })
        .returning();
      dbUser = created;
    }

    // 2. Resolve Candidate Profile
    let [profile] = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, dbUser.id))
      .limit(1);

    if (!profile) {
      const [createdProfile] = await db
        .insert(candidateProfiles)
        .values({
          userId: dbUser.id,
        })
        .returning();
      profile = createdProfile;
    }

    // 3. Quota check
    const planInfo = await getUserPlan(dbUser.id);
    const existingApps = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.candidateProfileId, profile.id));

    if (
      planInfo.limits.maxTrackedApplications !== Infinity &&
      existingApps.length >= planInfo.limits.maxTrackedApplications
    ) {
      return NextResponse.json(
        {
          error: `Tracking Quota Reached: Your current plan (${planInfo.planTier.toUpperCase()}) allows up to ${planInfo.limits.maxTrackedApplications} active tracked applications. Upgrade to RoleNest Pro for 50 or Annual Pass for 150 tracked applications.`,
          code: "TRACKING_LIMIT_REACHED",
          currentCount: existingApps.length,
          limit: planInfo.limits.maxTrackedApplications,
          upgradeUrl: "https://rolenest.in/pricing",
        },
        { status: 403 }
      );
    }

    // 4. Resolve Company (find or create)
    const cleanCompany = companyName.trim();
    const companySlug = cleanCompany.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    let [targetCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.slug, companySlug))
      .limit(1);

    if (!targetCompany) {
      let resolvedWebsite = "https://rolenest.in";
      try {
        if (sourceUrl) resolvedWebsite = new URL(sourceUrl).origin;
      } catch {}

      const [newComp] = await db
        .insert(companies)
        .values({
          name: cleanCompany,
          slug: companySlug || `company-${Date.now().toString(36)}`,
          website: resolvedWebsite,
          location: location || "Remote",
          industry: "Technology",
          isVerified: false,
        })
        .onConflictDoNothing()
        .returning();

      if (newComp) {
        targetCompany = newComp;
      } else {
        const [reloaded] = await db
          .select()
          .from(companies)
          .where(eq(companies.slug, companySlug))
          .limit(1);
        targetCompany = reloaded;
      }
    }

    // 5. Resolve or create Job record
    const cleanTitle = title.trim();
    const jobSlug = `${companySlug}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)}-${Date.now().toString(36)}`;

    const [createdJob] = await db
      .insert(jobs)
      .values({
        companyId: targetCompany.id,
        title: cleanTitle,
        slug: jobSlug,
        jobType: JobType.FULL_TIME,
        workMode: (location || "").toLowerCase().includes("remote") ? WorkMode.REMOTE : WorkMode.ON_SITE,
        location: location || "Remote",
        salaryOrStipend: salary || "Competitive",
        description: `Tracked externally from ${sourceUrl ? new URL(sourceUrl).hostname : "job portal"} via RoleNest Chrome Extension.`,
        requirements: "Tracked directly from official company posting.",
        source: JobSource.EXTERNAL,
        sourceUrl: sourceUrl || null,
        isActive: true,
      })
      .returning();

    // 6. Create Application record
    const parsedStatus = Object.values(ApplicationStatus).includes(status as any)
      ? status
      : ApplicationStatus.APPLIED;

    const [newApp] = await db
      .insert(applications)
      .values({
        jobId: createdJob.id,
        candidateProfileId: profile.id,
        resumeUrl: profile.resumeUrl || "/uploads/resumes/default.pdf",
        status: parsedStatus,
        coverNote: notes || "Tracked via RoleNest Chrome Extension.",
        appliedAt: new Date(),
        lastStatusChangeAt: new Date(),
      })
      .returning();

    // 7. Create Truth Teller timeline event
    await db.insert(applicationEvents).values({
      applicationId: newApp.id,
      eventType: parsedStatus,
      note: `Application tracked from ${sourceUrl ? new URL(sourceUrl).hostname : "portal"} via RoleNest Chrome Extension. Truth Teller 7-day follow-up countdown initiated.`,
    });

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      jobTitle: cleanTitle,
      companyName: cleanCompany,
      redirectUrl: "https://rolenest.in/applications",
      message: "Job successfully logged into your RoleNest application journal!",
    });
  } catch (error: any) {
    console.error("[Extension Track API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to track job" }, { status: 500 });
  }
}
