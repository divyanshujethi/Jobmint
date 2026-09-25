import { NextRequest, NextResponse } from "next/server";
import { db, companies, jobs, applications, applicationEvents, candidateProfiles, users, eq } from "@repo/database";
import { auth } from "@/auth";
import { sendEmail, applicationViewedTemplate, interviewInvitationTemplate } from "@repo/email";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin = (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: SuperAdmin privileges required to execute platform governance actions." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, payload } = body;

    // 1. Toggle Company Verification
    if (action === "TOGGLE_COMPANY_VERIFY") {
      const { companyId, isVerified } = payload;
      await db
        .update(companies)
        .set({
          isVerified: !isVerified,
          verifiedAt: !isVerified ? new Date() : null,
          verificationMethod: !isVerified ? "MANUAL" : null,
          updatedAt: new Date(),
        })
        .where(eq(companies.id, companyId));

      return NextResponse.json({ success: true, message: `Company verification set to ${!isVerified}` });
    }

    // 2. Toggle Job Active
    if (action === "TOGGLE_JOB_ACTIVE") {
      const { jobId, isActive } = payload;
      await db
        .update(jobs)
        .set({
          isActive: !isActive,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, jobId));

      return NextResponse.json({ success: true, message: `Job active status set to ${!isActive}` });
    }

    // 3. Simulate Recruiter Action for Truth Teller (Mark Viewed / Shortlist)
    if (action === "SIMULATE_RECRUITER_ACTION") {
      const { applicationId, eventType } = payload; // 'RESUME_VIEWED' | 'SHORTLISTED'
      const now = new Date();

      if (eventType === "RESUME_VIEWED") {
        await db
          .update(applications)
          .set({
            status: "RESUME_VIEWED",
            lastViewedAt: now,
            lastStatusChangeAt: now,
          })
          .where(eq(applications.id, applicationId));

        await db.insert(applicationEvents).values({
          applicationId,
          eventType: "RESUME_VIEWED",
          note: "Lead Engineering Manager opened and reviewed full PDF resume.",
        });
      } else if (eventType === "SHORTLISTED") {
        await db
          .update(applications)
          .set({
            status: "SHORTLISTED",
            lastStatusChangeAt: now,
          })
          .where(eq(applications.id, applicationId));

        await db.insert(applicationEvents).values({
          applicationId,
          eventType: "SHORTLISTED",
          note: "Candidate advanced to Round 1 Technical Architecture interview.",
        });
      }

      // Dispatch real email alert to candidate asynchronously
      (async () => {
        try {
          const appDetails = await db
            .select({
              candidateEmail: users.email,
              candidateName: users.name,
              jobTitle: jobs.title,
              companyName: companies.name,
            })
            .from(applications)
            .innerJoin(candidateProfiles, eq(applications.candidateProfileId, candidateProfiles.id))
            .innerJoin(users, eq(candidateProfiles.userId, users.id))
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .innerJoin(companies, eq(jobs.companyId, companies.id))
            .where(eq(applications.id, applicationId))
            .limit(1);

          if (appDetails.length > 0 && appDetails[0].candidateEmail) {
            const candidate = appDetails[0];
            if (eventType === "RESUME_VIEWED") {
              const { subject, html } = applicationViewedTemplate(
                candidate.candidateName || "Candidate",
                candidate.jobTitle,
                candidate.companyName
              );
              await sendEmail({ to: candidate.candidateEmail, subject, html });
            } else if (eventType === "SHORTLISTED") {
              const { subject, html } = interviewInvitationTemplate(
                candidate.candidateName || "Candidate",
                candidate.jobTitle,
                candidate.companyName,
                "Our hiring team was impressed with your background and has advanced you to Round 1 Technical Architecture. Check your Role Nest dashboard for scheduling details."
              );
              await sendEmail({ to: candidate.candidateEmail, subject, html });
            }
          }
        } catch (err: any) {
          console.error("[Email Notification Error in Admin Action]:", err.message || err);
        }
      })();

      return NextResponse.json({
        success: true,
        message: `Application updated with event ${eventType}. Candidate will receive real notification!`,
      });
    }

    // 4. Create New Verified Job
    if (action === "CREATE_JOB") {
      const { companyId, title, jobType, workMode, location, salaryOrStipend, description, requirements } = payload;
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

      const [newJob] = await db.insert(jobs).values({
        companyId,
        title,
        slug,
        jobType: jobType || "FULL_TIME",
        workMode: workMode || "REMOTE",
        location: location || "Remote",
        salaryOrStipend: salaryOrStipend || "Competitive",
        description: description || "Exciting opportunity at a high-growth tech company.",
        requirements: requirements || "Strong engineering fundamentals and hands-on project experience.",
        source: "DIRECT",
        isActive: true,
      }).returning();

      return NextResponse.json({ success: true, job: newJob });
    }

    // 5. Toggle Job Featured (30-day Boost)
    if (action === "TOGGLE_JOB_FEATURED") {
      const { jobId, isFeatured } = payload;
      const nextFeatured = !isFeatured;
      await db
        .update(jobs)
        .set({
          isFeatured: nextFeatured,
          featuredExpiresAt: nextFeatured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, jobId));

      return NextResponse.json({ success: true, message: `Job boost status set to ${nextFeatured}` });
    }

    // 6. Toggle User Pro Status (Candidate Pro)
    if (action === "TOGGLE_USER_PRO") {
      const { userId, isPro } = payload;
      const nextPro = !isPro;
      await db
        .update(users)
        .set({
          isPro: nextPro,
          proExpiresAt: nextPro ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return NextResponse.json({ success: true, message: `User Pro status set to ${nextPro}` });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
