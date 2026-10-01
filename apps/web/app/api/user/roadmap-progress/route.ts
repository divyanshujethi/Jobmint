import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, sql, userStreaks, eq } from "@repo/database";

let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_roadmap_progress (
        user_id text NOT NULL,
        roadmap_slug text NOT NULL,
        completed_milestones text[] NOT NULL DEFAULT '{}',
        updated_at timestamp DEFAULT now(),
        PRIMARY KEY (user_id, roadmap_slug)
      );
    `);
    tableInitialized = true;
  } catch (err) {
    console.error("Failed to ensure user_roadmap_progress table:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, completedMilestones: [] });
    }

    await ensureTable();

    if (slug) {
      const result = await db.execute(sql`
        SELECT completed_milestones FROM user_roadmap_progress
        WHERE user_id = ${session.user.id} AND roadmap_slug = ${slug}
        LIMIT 1;
      `);
      const row = (result as any)?.[0] || null;
      return NextResponse.json({
        authenticated: true,
        completedMilestones: row?.completed_milestones || [],
      });
    }

    // All roadmaps
    const result = await db.execute(sql`
      SELECT roadmap_slug, completed_milestones FROM user_roadmap_progress
      WHERE user_id = ${session.user.id};
    `);
    return NextResponse.json({
      authenticated: true,
      progress: result || [],
    });
  } catch (error) {
    console.error("Error fetching roadmap progress:", error);
    return NextResponse.json({ authenticated: false, completedMilestones: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to sync roadmap progress" },
        { status: 401 }
      );
    }

    await ensureTable();

    const body = await req.json();
    const { slug, completedMilestones, milestoneId, isCompleted } = body;

    if (!slug) {
      return NextResponse.json({ error: "Missing roadmap slug" }, { status: 400 });
    }

    let targetMilestones: string[] = [];

    if (Array.isArray(completedMilestones)) {
      targetMilestones = Array.from(new Set(completedMilestones));
    } else if (milestoneId) {
      const currentRes = await db.execute(sql`
        SELECT completed_milestones FROM user_roadmap_progress
        WHERE user_id = ${session.user.id} AND roadmap_slug = ${slug}
        LIMIT 1;
      `);
      const existing: string[] = (currentRes as any)?.[0]?.completed_milestones || [];
      const set = new Set(existing);
      if (isCompleted) {
        set.add(milestoneId);
      } else {
        set.delete(milestoneId);
      }
      targetMilestones = Array.from(set);
    }

    await db.execute(sql`
      INSERT INTO user_roadmap_progress (user_id, roadmap_slug, completed_milestones, updated_at)
      VALUES (${session.user.id}, ${slug}, ${targetMilestones}, now())
      ON CONFLICT (user_id, roadmap_slug) DO UPDATE
      SET completed_milestones = ${targetMilestones},
          updated_at = now();
    `);

    // Award +30 XP to streak if completing a milestone
    if (isCompleted) {
      try {
        await db
          .update(userStreaks)
          .set({
            totalXp: sql`${userStreaks.totalXp} + 30`,
            updatedAt: new Date(),
          })
          .where(eq(userStreaks.userId, session.user.id));
      } catch (e) {
        // non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      completedMilestones: targetMilestones,
    });
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
    return NextResponse.json({ error: "Failed to update roadmap progress" }, { status: 500 });
  }
}
