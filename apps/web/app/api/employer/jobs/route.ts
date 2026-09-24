import { NextRequest, NextResponse } from "next/server";
import { db, jobs, companies, jobSkills, skills, eq } from "@repo/database";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be signed in to publish opportunities on JobMint." },
        { status: 401 }
      );
    }
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

    // Resolve company
    let targetCompanyId = providedCompanyId;
    if (!targetCompanyId) {
      const allCompanies = await db.select().from(companies).limit(1);
      if (allCompanies.length > 0) {
        targetCompanyId = allCompanies[0].id;
      } else {
        const [newComp] = await db
          .insert(companies)
          .values({
            name: "JobMint Partner Tech",
            slug: "jobmint-partner-tech",
            website: "https://jobmint.ritualdev.in",
            location: "Remote",
            industry: "Software Engineering",
            isVerified: true,
          })
          .returning();
        targetCompanyId = newComp.id;
      }
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
      message: `Job '${newJob.title}' published successfully to live database.`,
    });
  } catch (error: any) {
    console.error("Error creating employer job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
