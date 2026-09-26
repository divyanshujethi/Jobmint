import { NextRequest, NextResponse } from "next/server";
import { db, sql } from "@repo/database";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin = (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: SuperAdmin privileges required to execute database operations." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Empty query string provided." }, { status: 400 });
    }

    const trimmed = query.trim();

    // Prevent destructive single-line drop of critical production database
    if (/^\s*drop\s+database\b/i.test(trimmed)) {
      return NextResponse.json(
        { error: "Security Guardrail: DROP DATABASE is blocked from the web console." },
        { status: 400 }
      );
    }

    const startTime = performance.now();
    const result: any = await db.execute(sql.raw(trimmed));
    const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

    let rows: any[] = [];
    let columns: string[] = [];

    if (Array.isArray(result)) {
      rows = result;
      if (rows.length > 0 && typeof rows[0] === "object" && rows[0] !== null) {
        columns = Object.keys(rows[0]);
      }
    } else if (result?.rows) {
      rows = result.rows;
      if (rows.length > 0 && typeof rows[0] === "object" && rows[0] !== null) {
        columns = Object.keys(rows[0]);
      } else if (result?.fields) {
        columns = result.fields.map((f: any) => f.name);
      }
    }

    return NextResponse.json({
      success: true,
      columns,
      rows: rows.slice(0, 100), // Max 100 rows preview in UI for safety
      totalRowsCount: rows.length,
      durationMs,
      command: result?.command || (trimmed.split(" ")[0] || "QUERY").toUpperCase(),
    });
  } catch (error: any) {
    console.error("[SuperAdmin SQL Console Error]:", error);
    return NextResponse.json(
      { error: error?.message || "SQL Execution error occurred." },
      { status: 400 }
    );
  }
}
