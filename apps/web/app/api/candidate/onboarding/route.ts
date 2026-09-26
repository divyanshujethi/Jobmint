import { NextRequest, NextResponse } from "next/server";
import { db, candidateProfiles, candidateSkills, skills, users, eq } from "@repo/database";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const {
      headline,
      location,
      experienceLevel,
      preferredRoles,
      workModes,
      selectedSkills = [],
      resumeUrl,
    } = body;

    // Determine isFresher from experienceLevel
    const isFresher = experienceLevel === "0" || experienceLevel === "fresher";

    let profileId: string | null = null;

    if (session?.user?.id) {
      const existingProfile = await db
        .select()
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, session.user.id))
        .limit(1);

      if (existingProfile.length > 0) {
        profileId = existingProfile[0].id;
        await db
          .update(candidateProfiles)
          .set({
            headline: headline || existingProfile[0].headline,
            location: location || existingProfile[0].location,
            isFresher,
            workModes: workModes || existingProfile[0].workModes,
            preferredRoles: preferredRoles || existingProfile[0].preferredRoles,
            resumeUrl: resumeUrl || existingProfile[0].resumeUrl,
            updatedAt: new Date(),
          })
          .where(eq(candidateProfiles.id, profileId));
      } else {
        const [newProfile] = await db
          .insert(candidateProfiles)
          .values({
            userId: session.user.id,
            headline: headline || "Software Developer",
            location: location || "Remote",
            isFresher,
            workModes: workModes || ["REMOTE"],
            preferredRoles: preferredRoles || ["Full Stack Developer"],
            resumeUrl: resumeUrl || null,
          })
          .returning();
        profileId = newProfile.id;
      }

      // Link candidate skills if skills table has matching skills
      if (profileId && Array.isArray(selectedSkills) && selectedSkills.length > 0) {
        for (const skillName of selectedSkills) {
          try {
            // Find or insert skill
            const existingSkill = await db
              .select()
              .from(skills)
              .where(eq(skills.name, skillName))
              .limit(1);

            let skillId: string;
            if (existingSkill.length > 0) {
              skillId = existingSkill[0].id;
            } else {
              const [insertedSkill] = await db
                .insert(skills)
                .values({
                  name: skillName,
                  slug: skillName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                  category: "General",
                })
                .returning();
              skillId = insertedSkill.id;
            }

            // Insert candidate skill association if not exists
            const existingCandidateSkill = await db
              .select()
              .from(candidateSkills)
              .where(eq(candidateSkills.profileId, profileId))
              .limit(50);

            const alreadyLinked = existingCandidateSkill.some((cs) => cs.skillId === skillId);
            if (!alreadyLinked) {
              await db.insert(candidateSkills).values({
                profileId,
                skillId,
                proficiency: "INTERMEDIATE",
              });
            }
          } catch (skillErr) {
            console.error(`Error saving skill ${skillName}:`, skillErr);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Candidate profile and skills saved successfully.",
      profileId,
    });
  } catch (error: any) {
    console.error("[Candidate Onboarding API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save candidate onboarding data." },
      { status: 500 }
    );
  }
}
