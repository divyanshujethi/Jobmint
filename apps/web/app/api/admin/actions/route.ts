import { NextRequest, NextResponse } from "next/server";
import { db, companies, jobs, applications, applicationEvents, eq } from "@repo/database";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
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

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
