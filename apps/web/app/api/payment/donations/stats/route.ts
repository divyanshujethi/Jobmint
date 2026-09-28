import { NextResponse } from "next/server";
import { db, sql } from "@repo/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const result = await db.execute(sql`
      SELECT 
        COALESCE(SUM(amount), 0)::text as total_amount,
        COUNT(*)::int as donor_count
      FROM community_donations
      WHERE status = 'PAID';
    `);

    const row = (result as any)?.rows?.[0] || { total_amount: "0", donor_count: 0 };
    return NextResponse.json({
      success: true,
      totalAmount: Math.round(Number(row.total_amount) || 0),
      donorCount: Number(row.donor_count) || 0,
    });
  } catch (err: any) {
    console.error("[Donation Stats Error]:", err);
    return NextResponse.json({
      success: true,
      totalAmount: 0,
      donorCount: 0,
    });
  }
}
