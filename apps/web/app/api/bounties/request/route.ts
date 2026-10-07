import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

export interface FriendReferralSubmission {
  id: string;
  bountyId: string;
  companyName: string;
  roleTitle: string;
  bountyRewardInr: number;
  // Referrer info (the person getting paid the bounty)
  referrerName: string;
  referrerEmail: string;
  referrerPhone?: string;
  referrerUpi: string;
  // Friend info (the candidate being referred)
  friendName: string;
  friendEmail: string;
  friendPhone?: string;
  friendGithubUrl?: string;
  friendResumeUrl?: string;
  recommendationNote: string;
  status: "SUBMITTED" | "REVIEWING" | "INTERVIEWING" | "OFFER_EXTENDED" | "BOUNTY_PAID";
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bountyId,
      companyName,
      roleTitle,
      bountyRewardInr,
      referrerName,
      referrerEmail,
      referrerPhone,
      referrerUpi,
      friendName,
      friendEmail,
      friendPhone,
      friendGithubUrl,
      friendResumeUrl,
      recommendationNote,
    } = body;

    if (!bountyId || !friendName || !friendEmail || !referrerEmail || !referrerUpi) {
      return NextResponse.json(
        { error: "Friend's name & email, and your email & UPI ID (for payout) are required." },
        { status: 400 }
      );
    }

    const referralId = `ref-${Date.now()}`;
    const referralData: FriendReferralSubmission = {
      id: referralId,
      bountyId,
      companyName: companyName || "Partner Company",
      roleTitle: roleTitle || "Software Engineer",
      bountyRewardInr: Number(bountyRewardInr) || 25000,
      referrerName: (referrerName || "Community Member").trim(),
      referrerEmail: referrerEmail.trim().toLowerCase(),
      referrerPhone: referrerPhone || "",
      referrerUpi: referrerUpi.trim(),
      friendName: friendName.trim(),
      friendEmail: friendEmail.trim().toLowerCase(),
      friendPhone: friendPhone || "",
      friendGithubUrl: friendGithubUrl || "",
      friendResumeUrl: friendResumeUrl || "",
      recommendationNote: (recommendationNote || "").trim(),
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };

    // Store in Redis user referrals list
    const userListKey = `rolenest:user_referrals:${referrerEmail.trim().toLowerCase()}`;
    const existing = (await getCache<FriendReferralSubmission[]>(userListKey)) || [];
    existing.unshift(referralData);
    await setCache(userListKey, existing, 90 * 24 * 60 * 60);

    // Global referrals log
    const globalListKey = "rolenest:all_friend_referrals";
    const allRefs = (await getCache<FriendReferralSubmission[]>(globalListKey)) || [];
    allRefs.unshift(referralData);
    await setCache(globalListKey, allRefs.slice(0, 500), 90 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      referralId,
      message: `Referral submitted! Your friend ${friendName} has been prioritized for ${roleTitle} at ${companyName}. When they join, ₹${Number(bountyRewardInr).toLocaleString("en-IN")} will be sent directly to ${referrerUpi}!`,
      referral: referralData,
    });
  } catch (err: any) {
    console.error("Error submitting friend referral:", err);
    return NextResponse.json({ error: err.message || "Failed to submit referral" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ referrals: [] });
    }

    const userListKey = `rolenest:user_referrals:${email.trim().toLowerCase()}`;
    const referrals = (await getCache<FriendReferralSubmission[]>(userListKey)) || [];
    return NextResponse.json({ referrals, count: referrals.length });
  } catch (err: any) {
    console.error("Error getting referrals:", err);
    return NextResponse.json({ referrals: [] });
  }
}
