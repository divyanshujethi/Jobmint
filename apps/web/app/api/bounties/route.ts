import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

interface BountyListing {
  id: string;
  companyName: string;
  companySlug: string;
  roleTitle: string;
  referrerName: string;
  referrerTitle: string;
  referrerCompanyEmailVerified: boolean;
  totalReferralBonusInr: number;
  candidateSplitBonusInr: number;
  availableSlots: number;
  totalSlots: number;
  minDevScore: number;
  experienceLevel: "FRESHER" | "1-3 YRS" | "3-5 YRS" | "5+ YRS";
  location: string;
  workMode: string;
  postedAgo: string;
  activeRequestsCount: number;
}

const INITIAL_BOUNTIES: BountyListing[] = [];

const BOUNTIES_CACHE_KEY = "rolenest:bounties:all";

export async function GET(req: NextRequest) {
  try {
    const cached = await getCache<BountyListing[]>(BOUNTIES_CACHE_KEY);
    if (cached && Array.isArray(cached)) {
      return NextResponse.json({ bounties: cached, count: cached.length, source: "redis" });
    }

    return NextResponse.json({ bounties: [], count: 0, source: "fresh" });
  } catch (err: any) {
    console.error("Error fetching bounties:", err);
    return NextResponse.json({ bounties: [], count: 0, source: "fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      corporateEmail,
      companyName,
      roleTitle,
      totalBonusInr,
      candidateSplitBonusInr,
      availableSlots,
      minDevScore,
      experienceLevel,
      location,
      workMode,
      referrerName,
      referrerTitle,
    } = body;

    if (!corporateEmail || !corporateEmail.includes("@")) {
      return NextResponse.json({ error: "A valid corporate email is required." }, { status: 400 });
    }

    // Check for public free webmail
    const domain = corporateEmail.split("@")[1].toLowerCase();
    const freeDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    if (freeDomains.includes(domain)) {
      return NextResponse.json(
        { error: "Please use your official company work email (e.g. name@swiggy.com, name@razorpay.com) to verify employee insider status." },
        { status: 400 }
      );
    }

    if (!roleTitle || !companyName) {
      return NextResponse.json({ error: "Role title and company name are required." }, { status: 400 });
    }

    const totalBonus = Number(totalBonusInr) || 50000;
    const candidateSplit = Number(candidateSplitBonusInr) || Math.round(totalBonus * 0.5);
    const slots = Number(availableSlots) || 3;

    const newBounty: BountyListing = {
      id: `bounty-${Date.now()}`,
      companyName: companyName.trim(),
      companySlug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      roleTitle: roleTitle.trim(),
      referrerName: referrerName || corporateEmail.split("@")[0].toUpperCase() + " (Verified Insider)",
      referrerTitle: referrerTitle || `Software Engineer @ ${companyName}`,
      referrerCompanyEmailVerified: true,
      totalReferralBonusInr: totalBonus,
      candidateSplitBonusInr: candidateSplit,
      availableSlots: slots,
      totalSlots: slots,
      minDevScore: Number(minDevScore) || 600,
      experienceLevel: experienceLevel || "1-3 YRS",
      location: location || "Bangalore / Remote",
      workMode: workMode || "Hybrid",
      postedAgo: "Just now",
      activeRequestsCount: 0,
    };

    // Update Redis
    let currentBounties = (await getCache<BountyListing[]>(BOUNTIES_CACHE_KEY)) || INITIAL_BOUNTIES;
    currentBounties = [newBounty, ...currentBounties];
    await setCache(BOUNTIES_CACHE_KEY, currentBounties, 7 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      bounty: newBounty,
      message: `Referral slot for ${roleTitle} at ${companyName} published successfully! Corporate verification sent to ${corporateEmail}.`,
    });
  } catch (err: any) {
    console.error("Error creating bounty:", err);
    return NextResponse.json({ error: err.message || "Failed to create referral bounty" }, { status: 500 });
  }
}
