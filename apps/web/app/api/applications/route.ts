import { NextRequest, NextResponse } from "next/server";
import { db, applications, applicationEvents, jobs, companies, candidateProfiles, users, eq, and, desc, inArray } from "@repo/database";
import { auth } from "@/auth";
import { sendEmail, applicationSubmittedTemplate } from "@repo/email";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({
        applications: [],
        total: 0,
        source: "postgresql-jobmint-prod",
      });
    }

    // Look up the user by email
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json({
        applications: [],
        total: 0,
        source: "postgresql-jobmint-prod",
      });
    }

    const currentUserId = userList[0].id;

    // Look up candidate profile
    const profileList = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, currentUserId))
      .limit(1);

    if (profileList.length === 0) {
      return NextResponse.json({
        applications: [],
        total: 0,
        source: "postgresql-jobmint-prod",
      });
    }

    const candidateProfileId = profileList[0].id;

    // Query DB applications scoped exclusively to this candidate profile
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
        source: jobs.source,
        sourceUrl: jobs.sourceUrl,
        companyName: companies.name,
        companySlug: companies.slug,
        isVerified: companies.isVerified,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.candidateProfileId, candidateProfileId))
      .orderBy(desc(applications.appliedAt));

    // Fetch application events for Truth Teller timeline (strictly scoped to candidate's own applications)
    const appIds = dbApps.map((a) => a.id);
    const allEvents =
      appIds.length > 0
        ? await db
            .select()
            .from(applicationEvents)
            .where(inArray(applicationEvents.applicationId, appIds))
        : [];
    const eventsMap = new Map<string, any[]>();
    const latestFollowUpMap = new Map<string, Date>();
    for (const ev of allEvents) {
      if (!eventsMap.has(ev.applicationId)) {
        eventsMap.set(ev.applicationId, []);
      }
      eventsMap.get(ev.applicationId)!.push({
        id: ev.id,
        eventType: ev.eventType,
        displayDate: new Date(ev.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        note: ev.note,
        createdAt: ev.createdAt,
      });

      if (ev.eventType === "FOLLOW_UP_SENT") {
        const existingDate = latestFollowUpMap.get(ev.applicationId);
        if (!existingDate || new Date(ev.createdAt).getTime() > existingDate.getTime()) {
          latestFollowUpMap.set(ev.applicationId, new Date(ev.createdAt));
        }
      }
    }

    const now = Date.now();
    const formatted = dbApps.map((app) => {
      const daysSinceApplied = Math.floor(
        (now - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const isExternal = Boolean(app.sourceUrl);
      const latestFollowUp = latestFollowUpMap.get(app.id);
      const hasFollowedUp = Boolean(latestFollowUp);

      let followUpDueDays = 0;
      let followUpStatus = "SCHEDULED";

      if (latestFollowUp) {
        const daysSinceFollowUp = Math.floor(
          (now - latestFollowUp.getTime()) / (1000 * 60 * 60 * 24)
        );
        followUpDueDays = Math.max(0, 14 - daysSinceFollowUp);
        followUpStatus = followUpDueDays > 0 ? "FOLLOW_UP_LOGGED" : "FOLLOW_UP_NOW";
      } else {
        followUpDueDays = Math.max(0, 7 - daysSinceApplied);
        followUpStatus = followUpDueDays === 0 ? "FOLLOW_UP_NOW" : "SCHEDULED";
      }

      const isGhosted = !isExternal && !app.lastViewedAt && daysSinceApplied >= 7 && !hasFollowedUp;

      const appEvents = eventsMap.get(app.id) || [
        {
          id: `ev-${app.id}-applied`,
          eventType: "APPLIED",
          displayDate: new Date(app.appliedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          note: isExternal
            ? `Logged via official company portal. Truth Teller 7-day follow-up scheduled (${followUpDueDays > 0 ? `${followUpDueDays}d remaining` : "Follow-up recommended"}).`
            : "Application submitted directly on RoleNest with Truth Teller telemetry active.",
        },
      ];

      let parsedNote = app.coverNote || "";
      let githubUrl = "";
      let demoUrl = "";
      let devScore: number | null = null;
      try {
        if (app.coverNote && app.coverNote.startsWith("{")) {
          const parsed = JSON.parse(app.coverNote);
          parsedNote = parsed.note || "";
          githubUrl = parsed.githubUrl || "";
          demoUrl = parsed.demoUrl || "";
          devScore = parsed.devScore || null;
        }
      } catch {}

      return {
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        jobSlug: app.jobSlug,
        companyName: app.companyName,
        companySlug: app.companySlug,
        companyLogoInitial: app.companyName.charAt(0).toUpperCase(),
        isVerifiedCompany: app.isVerified,
        isExternal,
        source: app.source || "EXTERNAL",
        sourceUrl: app.sourceUrl || null,
        followUpDueDays,
        followUpStatus,
        hasFollowedUp,
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
        appliedDaysAgo: daysSinceApplied,
        isGhosted,
        ghostingThresholdDays: 7,
        coverNote: parsedNote,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        devScore: devScore || null,
        events: appEvents,
      };
    });

    const { getUserPlan } = await import("@/lib/plan-limits");
    const planInfo = await getUserPlan(currentUserId);

    return NextResponse.json({
      applications: formatted,
      total: formatted.length,
      maxLimit: planInfo.limits.maxTrackedApplications,
      planTier: planInfo.planTier,
      isPro: planInfo.isPro,
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
    const { jobId, resumeUrl, email, phone, coverNote, githubUrl, demoUrl, devScore } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized: You must be signed in to submit an application." },
        { status: 401 }
      );
    }
    const candidateEmail = session.user.email;

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

    let finalCoverNote = coverNote || null;
    if (githubUrl || demoUrl || devScore) {
      finalCoverNote = JSON.stringify({
        note: coverNote || "",
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        devScore: devScore || null,
      });
    }

    // Check Active Applications Limit for current user plan
    const { getUserPlan } = await import("@/lib/plan-limits");
    const planInfo = await getUserPlan(userId);

    const existingApps = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.candidateProfileId, profileId));

    if (
      planInfo.limits.maxTrackedApplications !== Infinity &&
      existingApps.length >= planInfo.limits.maxTrackedApplications
    ) {
      return NextResponse.json(
        {
          error: `Tracking Quota Reached: Your current plan (${planInfo.planTier.toUpperCase()}) allows up to ${planInfo.limits.maxTrackedApplications} active tracked applications in your Kanban pipeline. Upgrade to RoleNest Pro (50 applications) or Annual Pass (150 applications) to track more positions.`,
          code: "TRACKING_LIMIT_REACHED",
          currentCount: existingApps.length,
          limit: planInfo.limits.maxTrackedApplications,
          upgradeUrl: "/pricing",
        },
        { status: 403 }
      );
    }

    // 3. Create application
    const [newApp] = await db
      .insert(applications)
      .values({
        jobId,
        candidateProfileId: profileId,
        resumeUrl: resumeUrl || "/uploads/resumes/default.pdf",
        status: "APPLIED",
        coverNote: finalCoverNote,
        appliedAt: new Date(),
        lastStatusChangeAt: new Date(),
      })
      .returning();

    // 4. Create application event for Truth Teller
    await db.insert(applicationEvents).values({
      applicationId: newApp.id,
      eventType: "APPLIED",
      note: "Application successfully received by RoleNest telemetry with Truth Teller active.",
    });

    // 5. Send confirmation email asynchronously via Brevo / Free Gateway
    (async () => {
      try {
        const jobDetails = await db
          .select({
            jobTitle: jobs.title,
            companyName: companies.name,
          })
          .from(jobs)
          .innerJoin(companies, eq(jobs.companyId, companies.id))
          .where(eq(jobs.id, jobId))
          .limit(1);

        if (jobDetails.length > 0 && candidateEmail) {
          const { subject, html } = applicationSubmittedTemplate(
            session.user?.name || candidateEmail.split("@")[0],
            jobDetails[0].jobTitle,
            jobDetails[0].companyName
          );
          await sendEmail({
            to: candidateEmail,
            subject,
            html,
          });
        }
      } catch (err: any) {
        console.error("[Email Application Alert Error]:", err.message || err);
      }
    })();

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

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("id");
    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
    }

    // 1. Resolve logged-in candidate profile
    const userList = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (userList.length === 0) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const profileList = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, userList[0].id))
      .limit(1);

    if (profileList.length === 0) {
      return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });
    }

    const candidateProfileId = profileList[0].id;

    // 2. Strict IDOR verification: verify target application belongs to this candidate
    const existing = await db
      .select({ id: applications.id })
      .from(applications)
      .where(
        and(
          eq(applications.id, applicationId),
          eq(applications.candidateProfileId, candidateProfileId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Forbidden: Application not found or you are not authorized to modify it." },
        { status: 403 }
      );
    }

    // 3. Delete dependent timeline events first, then delete application
    await db.delete(applicationEvents).where(eq(applicationEvents.applicationId, applicationId));
    await db.delete(applications).where(eq(applications.id, applicationId));

    return NextResponse.json({
      success: true,
      message: "Application removed from your tracking pipeline.",
    });
  } catch (error: any) {
    console.error("Error deleting application:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { id: applicationId, coverNote, resumeUrl, action, note } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
    }

    // 1. Resolve logged-in candidate profile
    const userList = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (userList.length === 0) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const profileList = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, userList[0].id))
      .limit(1);

    if (profileList.length === 0) {
      return NextResponse.json({ error: "Candidate profile not found." }, { status: 404 });
    }

    const candidateProfileId = profileList[0].id;

    // 2. Strict IDOR verification
    const existing = await db
      .select({ id: applications.id })
      .from(applications)
      .where(
        and(
          eq(applications.id, applicationId),
          eq(applications.candidateProfileId, candidateProfileId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Forbidden: Application not found or you are not authorized to modify it." },
        { status: 403 }
      );
    }

    // 3. Handle action: LOG_FOLLOW_UP
    if (action === "LOG_FOLLOW_UP") {
      await db.insert(applicationEvents).values({
        applicationId,
        eventType: "FOLLOW_UP_SENT",
        note: note || "Candidate logged follow-up recruiter outreach. Truth Teller follow-up timer snoozed (+14 days).",
      });

      await db.update(applications).set({
        lastStatusChangeAt: new Date(),
      }).where(eq(applications.id, applicationId));

      return NextResponse.json({
        success: true,
        message: "Follow-up outreach recorded in Truth Teller timeline. Follow-up reminder snoozed for 14 days.",
      });
    }

    // 4. Update candidate-accessible fields
    const updateData: Record<string, any> = {
      lastStatusChangeAt: new Date(),
    };
    if (typeof coverNote === "string") updateData.coverNote = coverNote;
    if (typeof resumeUrl === "string") updateData.resumeUrl = resumeUrl;

    await db.update(applications).set(updateData).where(eq(applications.id, applicationId));

    return NextResponse.json({
      success: true,
      message: "Application updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
