import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

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
      devScore,
      portfolioUrl,
      githubUrl,
      pitch,
    } = body;

    if (!bountyId || !candidateName || !candidateEmail) {
      return NextResponse.json(
        { error: "Candidate name, email, and bounty identifier are required." },
        { status: 400 }
      );
    }

    if (!pitch || pitch.trim().length < 20) {
      return NextResponse.json(
        { error: "Please write a concise 2-3 sentence pitch explaining why you are a strong match for this role." },
        { status: 400 }
      );
    }

    const requestId = `bounty_req:${bountyId}:${Date.now()}`;
    const requestData = {
      id: requestId,
      bountyId,
      companyName,
      roleTitle,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      candidatePhone: candidatePhone || "",
      devScore: Number(devScore) || 680,
      portfolioUrl: portfolioUrl || "",
      githubUrl: githubUrl || "",
      pitch: pitch.trim(),
      status: "PENDING_INSIDER_REVIEW",
      createdAt: new Date().toISOString(),
    };

    // Store in Redis request list for this bounty
    const listKey = `rolenest:bounty_requests:${bountyId}`;
    const existingRequests = (await getCache<any[]>(listKey)) || [];
    existingRequests.unshift(requestData);
    await setCache(listKey, existingRequests, 30 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      requestId,
      message: `Your referral application for ${roleTitle} at ${companyName} has been directly dispatched to the verified employee!`,
      request: requestData,
    });
  } catch (err: any) {
    console.error("Error submitting referral request:", err);
    return NextResponse.json({ error: err.message || "Failed to submit referral request" }, { status: 500 });
  }
}
