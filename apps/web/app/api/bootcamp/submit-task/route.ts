import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, bootcampEnrollments, bootcampDailySubmissions, eq, and } from "@repo/database";
import { notifyDiscordTaskSubmitted } from "@/lib/discord-notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required to submit daily internship assignments." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      enrollmentId,
      dayNumber,
      dayTitle,
      githubCommitUrl,
      assignmentNotes,
      codeSnippet,
      passedCodeChallenge = false,
    } = body;

    if (!enrollmentId || !dayNumber || !githubCommitUrl) {
      return NextResponse.json(
        { error: "Missing required fields (enrollmentId, dayNumber, githubCommitUrl)." },
        { status: 400 }
      );
    }

    // Validate github url
    const normalizedGithub = githubCommitUrl.trim();
    if (!normalizedGithub.includes("github.com/")) {
      return NextResponse.json(
        { error: "Invalid GitHub repository or commit link. Must start with https://github.com/..." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify enrollment belongs to current user
    const [enrollment] = await db
      .select()
      .from(bootcampEnrollments)
      .where(
        and(
          eq(bootcampEnrollments.id, enrollmentId),
          eq(bootcampEnrollments.userId, userId)
        )
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Active enrollment record not found for this account." },
        { status: 404 }
      );
    }

    // Verify day is unlocked
    if (dayNumber > enrollment.unlockedDay) {
      return NextResponse.json(
        { error: `Day ${dayNumber} is locked. Please complete previous day assignments in chronological sequence.` },
        { status: 403 }
      );
    }

    // Check if submission already exists for this day
    const existingSubmission = await db
      .select()
      .from(bootcampDailySubmissions)
      .where(
        and(
          eq(bootcampDailySubmissions.enrollmentId, enrollmentId),
          eq(bootcampDailySubmissions.dayNumber, dayNumber)
        )
      )
      .limit(1);

    let submissionRecord;
    if (existingSubmission.length > 0) {
      const [updated] = await db
        .update(bootcampDailySubmissions)
        .set({
          dayTitle: dayTitle || existingSubmission[0].dayTitle,
          githubCommitUrl: normalizedGithub,
          assignmentNotes: assignmentNotes ? assignmentNotes.trim() : existingSubmission[0].assignmentNotes,
          codeSnippet: codeSnippet || existingSubmission[0].codeSnippet,
          passedCodeChallenge: passedCodeChallenge ?? existingSubmission[0].passedCodeChallenge,
          status: "SUBMITTED",
          updatedAt: new Date(),
        })
        .where(eq(bootcampDailySubmissions.id, existingSubmission[0].id))
        .returning();
      submissionRecord = updated;
    } else {
      const [created] = await db
        .insert(bootcampDailySubmissions)
        .values({
          enrollmentId,
          userId,
          trackId: enrollment.trackId,
          dayNumber,
          dayTitle: dayTitle || `Day ${dayNumber} Practical Lab`,
          githubCommitUrl: normalizedGithub,
          assignmentNotes: assignmentNotes ? assignmentNotes.trim() : "",
          codeSnippet: codeSnippet || "",
          passedCodeChallenge: Boolean(passedCodeChallenge),
          status: "SUBMITTED",
        })
        .returning();
      submissionRecord = created;
    }

    // Advance unlockedDay sequentially if this was the highest unlocked day
    const nextDay = Math.min(dayNumber + 1, 28);
    const updatedUnlockedDay = Math.max(enrollment.unlockedDay, nextDay);

    await db
      .update(bootcampEnrollments)
      .set({
        unlockedDay: updatedUnlockedDay,
        currentDay: Math.min(updatedUnlockedDay, 28),
        updatedAt: new Date(),
      })
      .where(eq(bootcampEnrollments.id, enrollmentId));

    // Trigger live Discord notification to #daily-standup-deliverables
    notifyDiscordTaskSubmitted({
      studentName: enrollment.studentName || session.user.name || "Engineering Intern",
      trackTitle: enrollment.trackId,
      dayNumber,
      deliverable: dayTitle || `Day ${dayNumber} Lab Deliverable`,
      githubUrl: normalizedGithub,
    }).catch((err) => console.warn("Discord standup notification error:", err));

    return NextResponse.json({
      success: true,
      submission: submissionRecord,
      unlockedDay: updatedUnlockedDay,
      message: `Day ${dayNumber} deliverable saved to audit ledger! Day ${updatedUnlockedDay} unlocked.`,
    });
  } catch (error: any) {
    console.error("Task submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit assignment." },
      { status: 500 }
    );
  }
}
