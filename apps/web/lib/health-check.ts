import { db, sql } from "@repo/database";
import net from "net";

export interface ServiceHealth {
  status: "connected" | "error";
  latencyMs?: number;
  error?: string;
  details?: string;
}

export async function checkDatabase(): Promise<ServiceHealth> {
  const start = performance.now();
  try {
    await db.execute(sql`SELECT 1`);
    const latencyMs = Math.round(performance.now() - start);
    return {
      status: "connected",
      latencyMs,
      details: "PostgreSQL 16 connection active",
    };
  } catch (error: any) {
    return {
      status: "error",
      error: error?.message || "Database query failed",
    };
  }
}

export async function checkRedis(): Promise<ServiceHealth> {
  return new Promise((resolve) => {
    const start = performance.now();
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    try {
      let host = "127.0.0.1";
      let port = 6379;
      let password = "";

      if (redisUrl.startsWith("redis://") || redisUrl.startsWith("rediss://")) {
        const parsed = new URL(redisUrl);
        host = parsed.hostname || "127.0.0.1";
        port = Number(parsed.port) || 6379;
        password = parsed.password ? decodeURIComponent(parsed.password) : "";
      }

      const socket = new net.Socket();
      socket.setTimeout(2500);

      const cleanup = () => {
        socket.removeAllListeners();
        socket.destroy();
      };

      socket.connect(port, host, () => {
        if (password) {
          socket.write(`AUTH ${password}\r\n`);
        }
        socket.write("PING\r\n");
      });

      let receivedPong = false;

      socket.on("data", (data) => {
        const text = data.toString();
        if (text.includes("PONG")) {
          receivedPong = true;
          const latencyMs = Math.round(performance.now() - start);
          cleanup();
          resolve({
            status: "connected",
            latencyMs,
            details: `Redis 7.2 responded on ${host}:${port}`,
          });
        } else if (text.includes("-ERR") || text.includes("-WRONGPASS") || text.includes("-NOAUTH")) {
          cleanup();
          resolve({
            status: "error",
            error: text.trim(),
          });
        }
      });

      socket.on("timeout", () => {
        cleanup();
        resolve({
          status: "error",
          error: "Redis socket timed out after 2500ms",
        });
      });

      socket.on("error", (err) => {
        cleanup();
        resolve({
          status: "error",
          error: err.message || "Failed to connect to Redis",
        });
      });

      setTimeout(() => {
        if (!receivedPong) {
          cleanup();
          resolve({
            status: "error",
            error: "Redis check reached deadline",
          });
        }
      }, 3000);
    } catch (err: any) {
      resolve({
        status: "error",
        error: err?.message || "Failed to initialize Redis health check",
      });
    }
  });
}
