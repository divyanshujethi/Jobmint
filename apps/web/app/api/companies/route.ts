import { NextRequest, NextResponse } from "next/server";
import { getLiveCompanies } from "@/lib/db-companies";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const verified = searchParams.get("verified") === "true";
    const fast = searchParams.get("fast") === "true";

    let companies = await getLiveCompanies();

    if (q) {
      const query = q.toLowerCase();
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.industry.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query)
      );
    }

    if (verified) {
      companies = companies.filter((c) => c.isVerified);
    }

    if (fast) {
      companies = companies.filter((c) => c.truthTeller.isFastReviewer);
    }

    return NextResponse.json({
      companies,
      total: companies.length,
      source: "postgresql-jobmint-prod",
    });
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
