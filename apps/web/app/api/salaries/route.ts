import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/redis";
import { auth } from "@/auth";
import { db, userStreaks, eq } from "@repo/database";

export const dynamic = "force-dynamic";

interface SalaryRecord {
  id: string;
  companyName: string;
  companySlug: string;
  role: string;
  level: "FRESHER" | "SDE_1" | "SDE_2" | "STAFF";
  experienceYears: string;
  baseSalaryLpa: number;
  bonusLpa: number;
  stocksLpa: number;
  totalCtcLpa: number;
  location: string;
  verifiedSubmissions: number;
  daysToFirstReview: number;
  daysToOffer: number;
  ghostingRate: number; // percentage
  hiringStatus: "ACTIVELY_HIRING" | "MODERATE" | "FREEZE";
}

const INITIAL_SALARIES: SalaryRecord[] = [
  {
    id: "sal-1",
    companyName: "Razorpay",
    companySlug: "razorpay",
    role: "Software Development Engineer",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 22,
    bonusLpa: 3.5,
    stocksLpa: 6,
    totalCtcLpa: 31.5,
    location: "Bangalore",
    verifiedSubmissions: 38,
    daysToFirstReview: 2.1,
    daysToOffer: 14,
    ghostingRate: 1.5,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-2",
    companyName: "Google India",
    companySlug: "google",
    role: "Software Engineer (L3)",
    level: "FRESHER",
    experienceYears: "0-1 Yrs",
    baseSalaryLpa: 24,
    bonusLpa: 4,
    stocksLpa: 15,
    totalCtcLpa: 43,
    location: "Bangalore / Hyderabad",
    verifiedSubmissions: 52,
    daysToFirstReview: 4.5,
    daysToOffer: 24,
    ghostingRate: 0.8,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-3",
    companyName: "Zepto",
    companySlug: "zepto",
    role: "Backend Engineer (Go / Rust)",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 26,
    bonusLpa: 4,
    stocksLpa: 8,
    totalCtcLpa: 38,
    location: "Mumbai / Bangalore",
    verifiedSubmissions: 29,
    daysToFirstReview: 1.4,
    daysToOffer: 11,
    ghostingRate: 2.1,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-4",
    companyName: "Swiggy",
    companySlug: "swiggy",
    role: "Frontend Engineer (React / React Native)",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 20,
    bonusLpa: 3,
    stocksLpa: 5,
    totalCtcLpa: 28,
    location: "Bangalore (Remote)",
    verifiedSubmissions: 44,
    daysToFirstReview: 2.0,
    daysToOffer: 16,
    ghostingRate: 3.2,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-5",
    companyName: "CRED",
    companySlug: "cred",
    role: "Product Engineer (Backend / Infra)",
    level: "SDE_2",
    experienceYears: "3-5 Yrs",
    baseSalaryLpa: 36,
    bonusLpa: 6,
    stocksLpa: 16,
    totalCtcLpa: 58,
    location: "Bangalore",
    verifiedSubmissions: 22,
    daysToFirstReview: 1.8,
    daysToOffer: 15,
    ghostingRate: 1.9,
    hiringStatus: "MODERATE",
  },
  {
    id: "sal-6",
    companyName: "PhonePe",
    companySlug: "phonepe",
    role: "Associate Software Engineer",
    level: "FRESHER",
    experienceYears: "0-1 Yrs",
    baseSalaryLpa: 16,
    bonusLpa: 2.5,
    stocksLpa: 4,
    totalCtcLpa: 22.5,
    location: "Bangalore",
    verifiedSubmissions: 41,
    daysToFirstReview: 2.8,
    daysToOffer: 18,
    ghostingRate: 2.5,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-7",
    companyName: "Atlassian India",
    companySlug: "atlassian",
    role: "Software Engineer",
    level: "SDE_1",
    experienceYears: "1-3 Yrs",
    baseSalaryLpa: 28,
    bonusLpa: 4,
    stocksLpa: 14,
    totalCtcLpa: 46,
    location: "Remote (All India)",
    verifiedSubmissions: 31,
    daysToFirstReview: 3.2,
    daysToOffer: 21,
    ghostingRate: 0.5,
    hiringStatus: "ACTIVELY_HIRING",
  },
  {
    id: "sal-8",
    companyName: "Infosys / TCS (Digital Track)",
    companySlug: "infosys-tcs",
    role: "Digital Specialist Engineer",
    level: "FRESHER",
    experienceYears: "0-1 Yrs",
    baseSalaryLpa: 7,
    bonusLpa: 0.8,
    stocksLpa: 0,
    totalCtcLpa: 7.8,
    location: "Pan-India",
    verifiedSubmissions: 120,
    daysToFirstReview: 14.5,
    daysToOffer: 45,
    ghostingRate: 28.4,
    hiringStatus: "MODERATE",
  },
];

const SALARIES_CACHE_KEY = "rolenest:salaries:all";

export async function GET(req: NextRequest) {
  try {
    const cached = await getCache<SalaryRecord[]>(SALARIES_CACHE_KEY);
    const data = cached && Array.isArray(cached) && cached.length > 0 ? cached : INITIAL_SALARIES;

    if (!cached) {
      await setCache(SALARIES_CACHE_KEY, INITIAL_SALARIES, 7 * 24 * 60 * 60);
    }

    const avgLpa = Math.round(data.reduce((acc, s) => acc + s.totalCtcLpa, 0) / (data.length || 1));
    const avgDays = Math.round(data.reduce((acc, s) => acc + s.daysToOffer, 0) / (data.length || 1));
    const totalSubmissions = data.reduce((acc, s) => acc + s.verifiedSubmissions, 0);

    return NextResponse.json({
      salaries: data,
      stats: {
        avgLpa,
        avgDaysToOffer: avgDays,
        totalSubmissions,
        verifiedCompaniesCount: data.length,
      },
    });
  } catch (err: any) {
    console.error("Error fetching salaries:", err);
    return NextResponse.json({ salaries: INITIAL_SALARIES, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      role,
      level,
      totalCtcLpa,
      baseSalaryLpa,
      bonusLpa,
      stocksLpa,
      daysToOffer,
      location,
    } = body;

    if (!companyName || !role || !totalCtcLpa) {
      return NextResponse.json(
        { error: "Company name, role, and total CTC (LPA) are required." },
        { status: 400 }
      );
    }

    const ctc = Number(totalCtcLpa);
    const base = Number(baseSalaryLpa) || Math.round(ctc * 0.7);
    const bonus = Number(bonusLpa) || Math.round(ctc * 0.1);
    const stocks = Number(stocksLpa) || Math.max(0, Math.round(ctc - base - bonus));

    const newRecord: SalaryRecord = {
      id: `sal-${Date.now()}`,
      companyName: companyName.trim(),
      companySlug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      role: role.trim(),
      level: level || "SDE_1",
      experienceYears: level === "FRESHER" ? "0-1 Yrs" : level === "SDE_2" ? "3-5 Yrs" : "1-3 Yrs",
      baseSalaryLpa: base,
      bonusLpa: bonus,
      stocksLpa: stocks,
      totalCtcLpa: ctc,
      location: location || "Bangalore / Remote",
      verifiedSubmissions: 1,
      daysToFirstReview: 2.0,
      daysToOffer: Number(daysToOffer) || 16,
      ghostingRate: 1.2,
      hiringStatus: "ACTIVELY_HIRING",
    };

    // Update Redis
    let current = (await getCache<SalaryRecord[]>(SALARIES_CACHE_KEY)) || INITIAL_SALARIES;
    // Check if company already exists to increment submissions or add new
    const existingIndex = current.findIndex(
      (c) => c.companyName.toLowerCase() === newRecord.companyName.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      const updatedSubmissions = existing.verifiedSubmissions + 1;
      const updatedCtc = Math.round(((existing.totalCtcLpa * existing.verifiedSubmissions) + ctc) / updatedSubmissions * 10) / 10;
      current[existingIndex] = {
        ...existing,
        verifiedSubmissions: updatedSubmissions,
        totalCtcLpa: updatedCtc,
      };
    } else {
      current = [newRecord, ...current];
    }

    await setCache(SALARIES_CACHE_KEY, current, 7 * 24 * 60 * 60);

    // If user is authenticated, award +50 XP for contributing to Truth Teller transparency
    let awardedXp = false;
    try {
      const session = await auth();
      if (session?.user?.id) {
        const userId = session.user.id;
        const streakRecord = await db.query.userStreaks.findFirst({
          where: eq(userStreaks.userId, userId),
        });
        if (streakRecord) {
          await db
            .update(userStreaks)
            .set({ totalXp: streakRecord.totalXp + 50 })
            .where(eq(userStreaks.userId, userId));
          awardedXp = true;
        }
      }
    } catch (e) {
      console.warn("Could not award streak XP for salary submission:", e);
    }

    return NextResponse.json({
      success: true,
      record: newRecord,
      awardedXp,
      message: `Anonymous compensation telemetry for ${companyName} submitted successfully! ${awardedXp ? "+50 XP awarded to your profile." : ""}`,
    });
  } catch (err: any) {
    console.error("Error submitting salary:", err);
    return NextResponse.json({ error: err.message || "Failed to submit salary report" }, { status: 500 });
  }
}
