import { NextResponse } from "next/server";
import { db, sql } from "@repo/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Create table if not exists (idempotent)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS community_donations (
        id VARCHAR(64) PRIMARY KEY,
        order_id VARCHAR(128) UNIQUE NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        donor_name VARCHAR(255),
        donor_email VARCHAR(255),
        donor_phone VARCHAR(32),
        donor_note TEXT,
        gateway VARCHAR(32) DEFAULT 'cashfree',
        status VARCHAR(32) DEFAULT 'PAID',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Top 20 donors by total contribution (grouped by email, anonymised if opted out)
    const result = await db.execute(sql`
      SELECT
        COALESCE(
          NULLIF(TRIM(donor_name), ''),
          'Anonymous Supporter'
        ) AS display_name,
        SUM(amount)::NUMERIC AS total_amount,
        COUNT(*)::INTEGER AS donation_count,
        MAX(created_at) AS last_donated_at,
        CASE
          WHEN LOWER(TRIM(donor_name)) IN ('anonymous', 'anonymous supporter', '')
            OR donor_name IS NULL
          THEN TRUE
          ELSE FALSE
        END AS is_anonymous
      FROM community_donations
      WHERE status = 'PAID'
      GROUP BY
        COALESCE(NULLIF(TRIM(donor_name), ''), 'Anonymous Supporter'),
        CASE
          WHEN LOWER(TRIM(donor_name)) IN ('anonymous', 'anonymous supporter', '')
            OR donor_name IS NULL
          THEN TRUE
          ELSE FALSE
        END
      ORDER BY total_amount DESC
      LIMIT 20;
    `);

    const rows = (result as any[]).map((row: any, index: number) => ({
      rank: index + 1,
      displayName: row.is_anonymous ? "Anonymous Supporter" : String(row.display_name || "Anonymous Supporter"),
      totalAmount: Number(row.total_amount || 0),
      donationCount: Number(row.donation_count || 1),
      lastDonatedAt: row.last_donated_at,
      isAnonymous: Boolean(row.is_anonymous),
    }));

    return NextResponse.json({ success: true, leaderboard: rows });
  } catch (error) {
    console.error("[Donation Leaderboard Error]:", error);
    return NextResponse.json({ success: false, leaderboard: [] }, { status: 200 });
  }
}
