import { NextRequest, NextResponse } from "next/server";
import { db, jobs, companies, companyMembers, users, jobSkills, skills, eq } from "@repo/database";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized: You must be signed in to publish opportunities on Role Nest." },
        { status: 401 }
      );
    }

    const userEmail = session.user.email.toLowerCase();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: User record not found." },
        { status: 401 }
      );
    }

    const isAdmin = currentUser.role === "ADMIN" || adminEmails.includes(userEmail);

    // Look up company memberships for the user
    const userMemberships = await db
      .select({
        companyId: companyMembers.companyId,
        role: companyMembers.role,
      })
      .from(companyMembers)
      .where(eq(companyMembers.userId, currentUser.id));

    const body = await req.json();
    const {
      title,
      companyId: providedCompanyId,
      jobType,
      workMode,
      location,
      salaryOrStipend,
      experienceYears,
      selectedSkills,
      description,
      responsibilities,
      requirements,
    } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    // Resolve and validate target company
    let targetCompanyId: string | null = null;

    if (providedCompanyId) {
      // If a companyId is explicitly provided, verify membership or SuperAdmin rights
      const isMember = userMemberships.some((m) => m.companyId === providedCompanyId);
      if (!isMember && !isAdmin) {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized to publish job opportunities on behalf of this company." },
          { status: 403 }
        );
      }
      targetCompanyId = providedCompanyId;
    } else {
      // If no companyId is provided, resolve from logged-in user's company membership
      if (userMemberships.length > 0) {
        targetCompanyId = userMemberships[0].companyId;
      } else if (isAdmin) {
        // Fallback for SuperAdmin: attribute to first registered company or create a verified partner profile
        const allCompanies = await db.select().from(companies).limit(1);
        if (allCompanies.length > 0) {
          targetCompanyId = allCompanies[0].id;
        } else {
          const [newComp] = await db
            .insert(companies)
            .values({
              name: "Role Nest Partner Tech",
              slug: "rolenest-partner-tech",
              website: "https://rolenest.in",
              location: "Remote",
              industry: "Software Engineering",
              isVerified: true,
            })
            .returning();
          targetCompanyId = newComp.id;
        }
      } else {
        // Candidate or user without company membership cannot publish unscoped jobs
        return NextResponse.json(
          {
            error: "Forbidden: Verified employer organization required. You must register your company before publishing opportunities.",
            code: "COMPANY_REGISTRATION_REQUIRED",
          },
          { status: 403 }
        );
      }
    }

    // Verify company exists
    if (!targetCompanyId) {
      return NextResponse.json(
        { error: "Company organization not found. Please register your company first." },
        { status: 400 }
      );
    }

    const [targetCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, targetCompanyId))
      .limit(1);

    if (!targetCompany) {
      return NextResponse.json({ error: "Associated company does not exist." }, { status: 404 });
    }

    const cleanSlug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

    const [newJob] = await db
      .insert(jobs)
      .values({
        companyId: targetCompanyId,
        title: title.trim(),
        slug: cleanSlug,
        jobType: jobType || "INTERNSHIP",
        workMode: workMode || "REMOTE",
        location: location || "Remote",
        salaryOrStipend: salaryOrStipend || "Competitive",
        experienceYears: experienceYears ?? 0,
        description: description || "Exciting engineering role on a fast-moving product team.",
        requirements: requirements || "Demonstrated hands-on project experience and strong problem-solving fundamentals.",
        benefits: "Competitive compensation, flexible hours, engineering mentorship",
        source: "DIRECT",
        isActive: true,
      })
      .returning();

    // Link skills
    if (selectedSkills && Array.isArray(selectedSkills)) {
      for (const skillName of selectedSkills) {
        let existingSkill = await db
          .select()
          .from(skills)
          .where(eq(skills.name, skillName))
          .limit(1);

        let skillId: string;
        if (existingSkill.length === 0) {
          const [created] = await db
            .insert(skills)
            .values({
              name: skillName,
              slug: skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              category: "TECHNICAL",
            })
            .returning();
          skillId = created.id;
        } else {
          skillId = existingSkill[0].id;
        }

        try {
          await db.insert(jobSkills).values({
            jobId: newJob.id,
            skillId,
          });
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      job: newJob,
      message: `Job '${newJob.title}' published successfully for ${targetCompany.name}.`,
    });
  } catch (error: any) {
    console.error("Error creating employer job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
