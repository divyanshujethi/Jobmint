import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

export interface ReferralApplication {
  id: string;
  bountyId: string;
  companyName: string;
  roleTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateGithubUrl?: string;
  candidateResumeUrl?: string;
  devScore?: number;
  pitchNote: string;
  status: "PENDING_REVIEW" | "SUBMITTED_TO_ATS" | "INTERVIEWING" | "HIRED";
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bountyId,
      companyName,
      roleTitle,
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateGithubUrl,
      candidateResumeUrl,
      devScore,
      pitchNote,
    } = body;

    if (!bountyId || !candidateName || !candidateEmail) {
      return NextResponse.json(
        { error: "Candidate name and email are required to request an internal referral." },
        { status: 400 }
      );
    }

    const application: ReferralApplication = {
      id: `app-${Date.now()}`,
      bountyId,
      companyName: companyName || "Target Company",
      roleTitle: roleTitle || "Software Engineer",
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim().toLowerCase(),
      candidatePhone: candidatePhone || "",
      candidateGithubUrl: candidateGithubUrl || "",
      candidateResumeUrl: candidateResumeUrl || "",
      devScore: Number(devScore) || 780,
      pitchNote: (pitchNote || "").trim(),
      status: "PENDING_REVIEW",
      createdAt: new Date().toISOString(),
    };

    // Store in Redis candidate applications
    const userKey = `rolenest:referral_apps:${candidateEmail.trim().toLowerCase()}`;
    const existing = (await getCache<ReferralApplication[]>(userKey)) || [];
    existing.unshift(application);
    await setCache(userKey, existing, 90 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      message: `Your referral request for ${roleTitle} at ${companyName} has been submitted! The employee host will review your DevScore and submit your profile directly into their company ATS.`,
      application,
    });
  } catch (err: any) {
    console.error("Error submitting referral application:", err);
    return NextResponse.json({ error: err.message || "Failed to submit referral application" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ applications: [] });
    }

    const userKey = `rolenest:referral_apps:${email.trim().toLowerCase()}`;
    const applications = (await getCache<ReferralApplication[]>(userKey)) || [];
    return NextResponse.json({ applications, count: applications.length });
  } catch (err: any) {
    console.error("Error fetching applications:", err);
    return NextResponse.json({ applications: [] });
  }
}
