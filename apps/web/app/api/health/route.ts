import { NextResponse } from "next/server";
import { checkDatabase, checkRedis } from "@/lib/health-check";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);

  const isHealthy = database.status === "connected" && redis.status === "connected";
  const memory = process.memoryUsage();

  const body = {
    status: isHealthy ? "healthy" : "degraded",
    code: isHealthy ? 200 : 503,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    services: {
      database,
      redis,
    },
    system: {
      nodeEnv: process.env.NODE_ENV || "production",
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
      },
    },
    security: {
      firewall: "UFW active (ports 22, 80, 443 public only; internal ports 127.0.0.1)",
      backups: "Daily automated pg_dump gzip cron at 02:00 UTC (/opt/backups)",
    },
  };

  return NextResponse.json(body, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
