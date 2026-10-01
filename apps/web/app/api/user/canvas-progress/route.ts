import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, sql, userStreaks, eq } from "@repo/database";

// Ensure table exists on first execution
let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_canvas_progress (
        user_id text PRIMARY KEY,
        completed_nodes text[] NOT NULL DEFAULT '{}',
        notes jsonb DEFAULT '{}',
        updated_at timestamp DEFAULT now()
      );
    `);
    tableInitialized = true;
  } catch (err) {
    console.error("Failed to ensure user_canvas_progress table:", err);
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, completedNodes: [], notes: {} });
    }

    await ensureTable();

    const result = await db.execute(sql`
      SELECT completed_nodes, notes FROM user_canvas_progress WHERE user_id = ${session.user.id} LIMIT 1;
    `);

    const row = (result as any)?.[0] || null;
    return NextResponse.json({
      authenticated: true,
      completedNodes: row?.completed_nodes || [],
      notes: row?.notes || {},
    });
  } catch (error) {
    console.error("Error fetching canvas progress:", error);
    return NextResponse.json({ authenticated: false, completedNodes: [], notes: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to sync progress to cloud account" },
        { status: 401 }
      );
    }

    await ensureTable();

    const body = await req.json();
    const { completedNodes, nodeId, isCompleted, note } = body;

    let targetCompleted: string[] = [];

    if (Array.isArray(completedNodes)) {
      targetCompleted = Array.from(new Set(completedNodes));
    } else if (nodeId !== undefined) {
      const currentRes = await db.execute(sql`
        SELECT completed_nodes FROM user_canvas_progress WHERE user_id = ${session.user.id} LIMIT 1;
      `);
      const existing: string[] = (currentRes as any)?.[0]?.completed_nodes || [];
      const set = new Set(existing);
      if (isCompleted) {
        set.add(nodeId);
      } else {
        set.delete(nodeId);
      }
      targetCompleted = Array.from(set);
    }

    // Upsert into user_canvas_progress
    if (note && note.id) {
      await db.execute(sql`
        INSERT INTO user_canvas_progress (user_id, completed_nodes, notes, updated_at)
        VALUES (${session.user.id}, ${targetCompleted}, jsonb_build_object(${note.id}::text, ${note.text}::text), now())
        ON CONFLICT (user_id) DO UPDATE
        SET completed_nodes = ${targetCompleted},
            notes = user_canvas_progress.notes || jsonb_build_object(${note.id}::text, ${note.text}::text),
            updated_at = now();
      `);
    } else {
      await db.execute(sql`
        INSERT INTO user_canvas_progress (user_id, completed_nodes, updated_at)
        VALUES (${session.user.id}, ${targetCompleted}, now())
        ON CONFLICT (user_id) DO UPDATE
        SET completed_nodes = ${targetCompleted},
            updated_at = now();
      `);
    }

    // Award XP bonus (+25 XP) to user streak if newly completing a node
    if (isCompleted) {
      try {
        await db
          .update(userStreaks)
          .set({
            totalXp: sql`${userStreaks.totalXp} + 25`,
            updatedAt: new Date(),
          })
          .where(eq(userStreaks.userId, session.user.id));
      } catch (e) {
        // non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      completedNodes: targetCompleted,
    });
  } catch (error) {
    console.error("Error updating canvas progress:", error);
    return NextResponse.json({ error: "Failed to update canvas progress" }, { status: 500 });
  }
}
