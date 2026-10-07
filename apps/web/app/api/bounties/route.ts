import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";
import { INITIAL_FRIEND_BOUNTIES, FriendReferralBounty } from "@/lib/bounties-data";

export const dynamic = "force-dynamic";

const FRIEND_BOUNTIES_CACHE_KEY = "rolenest:friend_bounties:v2";

export async function GET(req: NextRequest) {
  try {
    const cached = await getCache<FriendReferralBounty[]>(FRIEND_BOUNTIES_CACHE_KEY);
    const bounties = cached && Array.isArray(cached) && cached.length > 0 ? cached : INITIAL_FRIEND_BOUNTIES;

    if (!cached) {
      await setCache(FRIEND_BOUNTIES_CACHE_KEY, INITIAL_FRIEND_BOUNTIES, 14 * 24 * 60 * 60);
    }

    const totalPoolInr = bounties.reduce((sum, b) => sum + b.bountyRewardInr * b.openPositions, 0);

    return NextResponse.json({
      bounties,
      count: bounties.length,
      totalPoolInr,
    });
  } catch (err: any) {
    console.error("Error fetching friend bounties:", err);
    return NextResponse.json({ bounties: INITIAL_FRIEND_BOUNTIES, count: INITIAL_FRIEND_BOUNTIES.length }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      roleTitle,
      department,
      bountyRewardInr,
      salaryRangeCtcLpa,
      experienceLevel,
      location,
      workMode,
      keySkills,
      description,
      openPositions,
    } = body;

    if (!companyName || !roleTitle || !bountyRewardInr) {
      return NextResponse.json(
        { error: "Company name, role title, and bounty reward (INR) are required." },
        { status: 400 }
      );
    }

    const newBounty: FriendReferralBounty = {
      id: `bounty-${Date.now()}`,
      companyName: companyName.trim(),
      companySlug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      roleTitle: roleTitle.trim(),
      department: department || "FullStack",
      bountyRewardInr: Number(bountyRewardInr) || 25000,
      salaryRangeCtcLpa: salaryRangeCtcLpa || "₹18 – ₹28 LPA",
      experienceLevel: experienceLevel || "1-3 YRS",
      location: location || "Bangalore",
      workMode: workMode || "Hybrid",
      keySkills: Array.isArray(keySkills) ? keySkills : ["React", "Node.js", "TypeScript"],
      hiringUrgency: "HIGH",
      openPositions: Number(openPositions) || 2,
      description: description || "Exciting engineering opportunity with competitive market compensation.",
      postedAgo: "Just now",
      totalReferralsSubmitted: 0,
    };

    const cached = await getCache<FriendReferralBounty[]>(FRIEND_BOUNTIES_CACHE_KEY);
    const current = cached && Array.isArray(cached) ? cached : INITIAL_FRIEND_BOUNTIES;
    const updated = [newBounty, ...current];
    await setCache(FRIEND_BOUNTIES_CACHE_KEY, updated, 14 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      message: "Referral bounty role listed successfully!",
      bounty: newBounty,
    });
  } catch (err: any) {
    console.error("Error creating friend bounty:", err);
    return NextResponse.json({ error: "Failed to create bounty listing" }, { status: 500 });
  }
}
