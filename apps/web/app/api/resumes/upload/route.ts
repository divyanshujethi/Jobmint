import { NextRequest, NextResponse } from "next/server";
import { uploadFile, validatePdfMagicBytes } from "@repo/storage";
import { checkRateLimit } from "@/lib/rate-limit";
import { auth } from "@/auth";
import { db, candidateProfiles, eq } from "@repo/database";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 15,
      windowSeconds: 300,
      prefix: "rl:upload:resume",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Upload rate limit exceeded. Please wait ${rateLimit.resetInSeconds}s before uploading another resume.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No resume file provided in request." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5 MB limit. Please compress your PDF before uploading." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validatePdfMagicBytes(buffer)) {
      return NextResponse.json(
        { error: "Security validation error: Uploaded file is not a valid PDF document." },
        { status: 400 }
      );
    }

    const result = await uploadFile({
      body: buffer,
      filename: file.name,
      contentType: "application/pdf",
    });

    const fileUrl = result.url || result.key;

    // If candidate is logged in, attach resumeUrl to their candidate profile in DB
    const session = await auth();
    if (session?.user?.id) {
      try {
        const existing = await db
          .select()
          .from(candidateProfiles)
          .where(eq(candidateProfiles.userId, session.user.id))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(candidateProfiles)
            .set({
              resumeUrl: fileUrl,
              updatedAt: new Date(),
            })
            .where(eq(candidateProfiles.id, existing[0].id));
        } else {
          await db.insert(candidateProfiles).values({
            userId: session.user.id,
            resumeUrl: fileUrl,
            headline: "Software Engineer",
            preferredRoles: ["Full Stack Developer"],
          });
        }
      } catch (dbErr) {
        console.warn("Could not auto-link resume to candidate profile:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      file: result,
      resumeUrl: fileUrl,
      filename: file.name,
      message: result.isDuplicate
        ? "Resume securely updated in your private vault."
        : "Resume uploaded successfully to your private vault.",
    });
  } catch (error: any) {
    console.error("[Resume Upload Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process resume upload." },
      { status: 500 }
    );
  }
}
