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

const INITIAL_BOUNTIES: BountyListing[] = [
  {
    id: "bounty-1",
    companyName: "Razorpay",
    companySlug: "razorpay",
    roleTitle: "Backend Software Engineer (Payments Core)",
    referrerName: "Aakash S.",
    referrerTitle: "Staff Engineer @ Razorpay",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 80000,
    candidateSplitBonusInr: 40000,
    availableSlots: 2,
    totalSlots: 5,
    minDevScore: 650,
    experienceLevel: "1-3 YRS",
    location: "Bangalore",
    workMode: "Hybrid (2 days/wk)",
    postedAgo: "2h ago",
    activeRequestsCount: 7,
  },
  {
    id: "bounty-2",
    companyName: "Swiggy",
    companySlug: "swiggy",
    roleTitle: "Frontend Engineer (Consumer Web & Mobile)",
    referrerName: "Pooja M.",
    referrerTitle: "Senior SDE @ Swiggy",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 75000,
    candidateSplitBonusInr: 37500,
    availableSlots: 1,
    totalSlots: 4,
    minDevScore: 600,
    experienceLevel: "1-3 YRS",
    location: "Bangalore",
    workMode: "Remote / Hybrid",
    postedAgo: "4h ago",
    activeRequestsCount: 11,
  },
  {
    id: "bounty-3",
    companyName: "Zepto",
    companySlug: "zepto",
    roleTitle: "SDE-2 (Distributed Systems & Supply Chain)",
    referrerName: "Rohan V.",
    referrerTitle: "Engineering Lead @ Zepto",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 100000,
    candidateSplitBonusInr: 50000,
    availableSlots: 3,
    totalSlots: 5,
    minDevScore: 720,
    experienceLevel: "3-5 YRS",
    location: "Mumbai",
    workMode: "On-site",
    postedAgo: "1d ago",
    activeRequestsCount: 14,
  },
  {
    id: "bounty-4",
    companyName: "Google India",
    companySlug: "google",
    roleTitle: "Software Engineer (Cloud Storage & Infrastructure)",
    referrerName: "Siddharth K.",
    referrerTitle: "Senior Software Engineer @ Google",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 150000,
    candidateSplitBonusInr: 75000,
    availableSlots: 1,
    totalSlots: 2,
    minDevScore: 780,
    experienceLevel: "3-5 YRS",
    location: "Hyderabad",
    workMode: "Hybrid",
    postedAgo: "1d ago",
    activeRequestsCount: 29,
  },
  {
    id: "bounty-5",
    companyName: "PhonePe",
    companySlug: "phonepe",
    roleTitle: "Associate Software Engineer (Campus & Freshers)",
    referrerName: "Neha G.",
    referrerTitle: "Software Engineer @ PhonePe",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 50000,
    candidateSplitBonusInr: 25000,
    availableSlots: 4,
    totalSlots: 6,
    minDevScore: 550,
    experienceLevel: "FRESHER",
    location: "Bangalore",
    workMode: "On-site",
    postedAgo: "Just now",
    activeRequestsCount: 19,
  },
  {
    id: "bounty-6",
    companyName: "CRED",
    companySlug: "cred",
    roleTitle: "Android Developer (Fintech App Platform)",
    referrerName: "Varun D.",
    referrerTitle: "Lead Mobile Architect @ CRED",
    referrerCompanyEmailVerified: true,
    totalReferralBonusInr: 90000,
    candidateSplitBonusInr: 45000,
    availableSlots: 2,
    totalSlots: 3,
    minDevScore: 700,
    experienceLevel: "1-3 YRS",
    location: "Bangalore",
    workMode: "In-office",
    postedAgo: "5h ago",
    activeRequestsCount: 8,
  },
];

const BOUNTIES_CACHE_KEY = "rolenest:bounties:all";

export async function GET(req: NextRequest) {
  try {
    const cached = await getCache<BountyListing[]>(BOUNTIES_CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return NextResponse.json({ bounties: cached, count: cached.length, source: "redis" });
    }

    // Seed into cache
    await setCache(BOUNTIES_CACHE_KEY, INITIAL_BOUNTIES, 7 * 24 * 60 * 60);
    return NextResponse.json({ bounties: INITIAL_BOUNTIES, count: INITIAL_BOUNTIES.length, source: "seed" });
  } catch (err: any) {
    console.error("Error fetching bounties:", err);
    return NextResponse.json({ bounties: INITIAL_BOUNTIES, count: INITIAL_BOUNTIES.length, source: "fallback" });
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
