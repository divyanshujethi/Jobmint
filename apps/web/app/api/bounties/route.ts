import { NextRequest, NextResponse } from "next/server";
import { getLiveJobs, getTotalActiveJobsCount } from "@/lib/db-jobs";
import { getCache, setCache } from "@/lib/redis";
import { FriendReferralBounty, convertRealJobToBounty } from "@/lib/bounties-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const dept = searchParams.get("dept") || "ALL";
    const exp = searchParams.get("exp") || "ALL";

    // Fetch real live jobs directly from PostgreSQL
    const [realJobs, totalCatalog] = await Promise.all([
      getLiveJobs({ limit: 120, jobType: "ALL" }),
      getTotalActiveJobsCount("ALL"),
    ]);

    let bounties: FriendReferralBounty[] = realJobs.map(convertRealJobToBounty);

    // Apply filters
    if (q) {
      bounties = bounties.filter(
        (b) =>
          b.companyName.toLowerCase().includes(q) ||
          b.roleTitle.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.keySkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (dept !== "ALL") {
      bounties = bounties.filter((b) => b.department === dept);
    }

    if (exp !== "ALL") {
      bounties = bounties.filter((b) => b.experienceLevel === exp);
    }

    const totalPoolInr = bounties.reduce((sum, b) => sum + b.bountyRewardInr * b.openPositions, 0);

    return NextResponse.json({
      bounties,
      count: bounties.length,
      totalCatalog,
      totalPoolInr,
    });
  } catch (err: any) {
    console.error("Error fetching live bounties:", err);
    return NextResponse.json({ bounties: [], count: 0, totalPoolInr: 0, error: err.message }, { status: 500 });
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
      id: `bounty-custom-${Date.now()}`,
      jobId: `custom-${Date.now()}`,
      jobSlug: roleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      companyName: companyName.trim(),
      companySlug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      companyLogoInitial: companyName.charAt(0).toUpperCase(),
      roleTitle: roleTitle.trim(),
      department: department || "FullStack",
      bountyRewardInr: Number(bountyRewardInr) || 25000,
      salaryRangeCtcLpa: salaryRangeCtcLpa || "Competitive (Industry Standard)",
      experienceLevel: experienceLevel || "1-3 YRS",
      location: location || "Bangalore / Remote",
      workMode: workMode || "Hybrid",
      keySkills: Array.isArray(keySkills) ? keySkills : ["Engineering", "Problem Solving"],
      hiringUrgency: "HIGH",
      openPositions: Number(openPositions) || 1,
      description: description || "Active engineering opening verified through official hiring pipeline.",
      postedAgo: "Just now",
      totalReferralsSubmitted: 0,
    };

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
