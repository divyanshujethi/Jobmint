import { NextResponse } from "next/server";
import { checkDatabase, checkRedis } from "@/lib/health-check";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);

  const isHealthy = database.status === "connected" && redis.status === "connected";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      code: isHealthy ? 200 : 503,
      timestamp: new Date().toISOString(),
      services: {
        database: database.status,
        redis: redis.status,
      },
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
