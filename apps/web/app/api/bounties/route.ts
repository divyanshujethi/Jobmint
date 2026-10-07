import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";
import { VERIFIED_EMPLOYEE_BOUNTIES, EmployeeHostedBounty } from "@/lib/bounties-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const dept = searchParams.get("dept") || "ALL";
    const exp = searchParams.get("exp") || "ALL";

    // Load custom-hosted bounties from Redis if any
    const customKey = "rolenest:employee_hosted_bounties";
    const customBounties = (await getCache<EmployeeHostedBounty[]>(customKey)) || [];

    let combined = [...customBounties, ...VERIFIED_EMPLOYEE_BOUNTIES];

    if (q) {
      combined = combined.filter(
        (b) =>
          b.companyName.toLowerCase().includes(q) ||
          b.roleTitle.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.keySkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (dept !== "ALL") {
      combined = combined.filter((b) => b.department === dept);
    }

    if (exp !== "ALL") {
      combined = combined.filter((b) => b.experienceLevel === exp);
    }

    const totalRewardPool = combined.reduce((acc, b) => acc + b.employeeBonusInr * b.openSlots, 0);

    return NextResponse.json({
      bounties: combined,
      count: combined.length,
      totalRewardPool,
    });
  } catch (err: any) {
    console.error("Error fetching employee bounties:", err);
    return NextResponse.json({ bounties: VERIFIED_EMPLOYEE_BOUNTIES, count: VERIFIED_EMPLOYEE_BOUNTIES.length }, { status: 500 });
  }
}

// POST endpoint for verified corporate employees to host a referral slot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      companyEmail,
      hostTitle,
      roleTitle,
      department,
      companyBonusInr,
      candidateShareInr,
      experienceLevel,
      location,
      workMode,
      keySkills,
      description,
      referralType,
    } = body;

    // Validate corporate email domain
    if (!companyEmail || !companyEmail.includes("@")) {
      return NextResponse.json({ error: "A valid corporate work email is required for verification." }, { status: 400 });
    }

    const domain = "@" + companyEmail.split("@")[1].toLowerCase();
    const publicDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com", "@icloud.com"];
    if (publicDomains.includes(domain)) {
      return NextResponse.json({ error: "Please enter your official company email (e.g., name@google.com, name@twilio.com)." }, { status: 400 });
    }

    if (!companyName || !roleTitle || !companyBonusInr) {
      return NextResponse.json({ error: "Company name, role title, and official company referral bonus are required." }, { status: 400 });
    }

    const bonus = Number(companyBonusInr);
    const candidateShare = Number(candidateShareInr) || Math.round(bonus * 0.4);

    const newSlot: EmployeeHostedBounty = {
      id: `emp-custom-${Date.now()}`,
      companyName: companyName.trim(),
      companySlug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      companyLogoInitial: companyName.charAt(0).toUpperCase(),
      roleTitle: roleTitle.trim(),
      department: department || "FullStack",
      employeeBonusInr: bonus,
      candidateRewardInr: candidateShare,
      platformFeeCutPercent: 15,
      hostEmployeeTitle: hostTitle || `Verified Employee at ${companyName}`,
      hostEmployeeDomain: domain,
      experienceLevel: experienceLevel || "1-3 YRS",
      salaryRangeCtcLpa: "Competitive (Industry Standard)",
      location: location || "Bangalore • Hybrid",
      workMode: workMode || "Hybrid",
      keySkills: Array.isArray(keySkills) ? keySkills : ["Engineering", "Problem Solving"],
      openSlots: 2,
      referralType: referralType || "INTERNAL_ATS_SUBMISSION",
      postedAgo: "Just now",
      verifiedBadge: true,
      description: description || `Internal employee referral slot hosted by verified insider at ${domain}. Candidates will be screened and submitted directly to the hiring queue.`,
    };

    const customKey = "rolenest:employee_hosted_bounties";
    const customBounties = (await getCache<EmployeeHostedBounty[]>(customKey)) || [];
    customBounties.unshift(newSlot);
    await setCache(customKey, customBounties, 90 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      message: "Referral slot hosted successfully! Candidates can now apply with their DevScore.",
      bounty: newSlot,
    });
  } catch (err: any) {
    console.error("Error hosting employee bounty:", err);
    return NextResponse.json({ error: err.message || "Failed to host referral slot" }, { status: 500 });
  }
}
