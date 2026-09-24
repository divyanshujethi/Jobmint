import { NextRequest, NextResponse } from "next/server";
import { getLiveCertificates, crawlCertificatePrograms } from "@/lib/certificates-data";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "ALL";
    const q = searchParams.get("q") || "";

    let programs = await getLiveCertificates();

    if (category !== "ALL") {
      programs = programs.filter((p) => p.category === category);
    }

    if (q) {
      const query = q.toLowerCase();
      programs = programs.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.provider.toLowerCase().includes(query) ||
          p.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      total: programs.length,
      programs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const result = await crawlCertificatePrograms();
    return NextResponse.json({
      success: true,
      message: `Certificate Alligator crawl completed: ${result.newFound} new verified programs found.`,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Certificate crawler failed" },
      { status: 500 }
    );
  }
}

