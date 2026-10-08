import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";
import { COMPREHENSIVE_INDIAN_SALARIES, SalaryRecord } from "@/lib/salary-data";

export const dynamic = "force-dynamic";

const SALARIES_CACHE_KEY = "rolenest:salaries:v3:all";

export async function GET(req: NextRequest) {
  try {
    const cached = await getCache<SalaryRecord[]>(SALARIES_CACHE_KEY);
    const data = cached && Array.isArray(cached) && cached.length > 0 ? cached : COMPREHENSIVE_INDIAN_SALARIES;

    if (!cached) {
      await setCache(SALARIES_CACHE_KEY, COMPREHENSIVE_INDIAN_SALARIES, 14 * 24 * 60 * 60);
    }

    const avgLpa = Math.round(data.reduce((acc, s) => acc + s.totalCtcLpa, 0) / (data.length || 1));
    const totalSubmissions = data.reduce((acc, s) => acc + (s.verifiedSubmissions || 1), 0);

    return NextResponse.json({
      salaries: data,
      stats: {
        avgLpa,
        totalBenchmarksCount: data.length,
        totalSubmissions,
      },
    });
  } catch (err: any) {
    console.error("Error fetching salaries:", err);
    return NextResponse.json({ salaries: COMPREHENSIVE_INDIAN_SALARIES, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      role,
      level,
      tier,
      roleTrack,
      totalCtcLpa,
      baseSalaryLpa,
      bonusLpa,
      stocksLpa,
      location,
      workMode,
      interviewRounds,
    } = body;

    if (!companyName || !role || !totalCtcLpa) {
      return NextResponse.json(
        { error: "Company name, role title, and total CTC (LPA) are required." },
        { status: 400 }
      );
    }

    const ctc = Number(totalCtcLpa);
    const base = Number(baseSalaryLpa) || Math.round(ctc * 0.75);
    const bonus = Number(bonusLpa) || Math.round(ctc * 0.1);
    const stocks = Number(stocksLpa) || Math.max(0, Math.round(ctc - base - bonus));

    // Calculate approx monthly in hand
    const approxMonthlyTaxFactor = base > 20 ? 0.72 : base > 10 ? 0.8 : 0.88;
    const monthlyGrossLakh = (base / 12) * approxMonthlyTaxFactor;
    const estimatedInHand = `₹${(monthlyGrossLakh * 100000).toLocaleString("en-IN", { maximumFractionDigits: 0 })} / mo`;

    const validWorkMode: "Remote" | "Hybrid" | "On-site" =
      workMode === "Remote" || workMode === "Hybrid" || workMode === "On-site" ? workMode : "Hybrid";

    const newRecord: SalaryRecord = {
      id: `sal-user-${Date.now()}`,
      companyName: companyName.trim(),
      companySlug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      tier: tier || "PRODUCT",
      role: role.trim(),
      roleTrack: roleTrack || "FULLSTACK",
      level: level || "SDE_1",
      experienceYears:
        level === "FRESHER"
          ? "0-1 Yrs"
          : level === "SDE_2"
          ? "3-5 Yrs"
          : level === "STAFF"
          ? "5+ Yrs"
          : "1-3 Yrs",
      baseSalaryLpa: base,
      bonusLpa: bonus,
      stocksLpa: stocks,
      totalCtcLpa: ctc,
      estimatedMonthlyInHand: estimatedInHand,
      location: location || "Bangalore / Remote",
      workMode: validWorkMode,
      interviewRounds: interviewRounds || "Coding Assessment + Technical Rounds + HR",
      typicalTimelineDays: 18,
      marketPercentile: ctc >= 35 ? "Top 5%" : ctc >= 20 ? "Top 15%" : "Median (50%)",
      status: "PENDING_VERIFICATION",
      submittedAt: new Date().toISOString(),
    };

    // Store in Redis pending moderation queue for admin review (spam protection)
    const pendingKey = "rolenest:salaries:pending";
    const existingPending = (await getCache<SalaryRecord[]>(pendingKey)) || [];
    existingPending.unshift(newRecord);
    await setCache(pendingKey, existingPending.slice(0, 500), 90 * 24 * 60 * 60);

    return NextResponse.json({
      success: true,
      message: "Anonymous salary submission received and forwarded to Admin Verification queue (+50 XP granted). Once reviewed for accuracy, it will be published to the public benchmarks!",
      salary: newRecord,
    });
  } catch (err: any) {
    console.error("Error submitting salary:", err);
    return NextResponse.json({ error: "Failed to record salary report" }, { status: 500 });
  }
}
