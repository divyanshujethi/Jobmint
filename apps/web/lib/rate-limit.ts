import { NextRequest } from "next/server";

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

interface MemoryBucket {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryBucket>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of memoryStore.entries()) {
      if (now > bucket.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extracts client IP prioritizing Cloudflare WAF header `cf-connecting-ip`
 */
export function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0];
    if (firstIp) return firstIp.trim();
  }

  return "127.0.0.1";
}

/**
 * High-performance sliding-window rate limiter.
 * Seamlessly uses Upstash Redis REST API when configured,
 * otherwise falls back to local in-memory token-bucket.
 */
export async function checkRateLimit(
  req: NextRequest,
  options: {
    maxRequests?: number;
    windowSeconds?: number;
    prefix?: string;
    customKey?: string;
  } = {}
): Promise<RateLimitResult> {
  const maxRequests = options.maxRequests || 15;
  const windowSeconds = options.windowSeconds || 300; // 5 minutes default
  const prefix = options.prefix || "rl:ai";
  
  const ip = getClientIp(req);
  const identifier = options.customKey || ip;
  const cacheKey = `${prefix}:${identifier}`;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Upstash Redis (if configured)
  if (upstashUrl && upstashToken) {
    try {
      const pipelineUrl = `${upstashUrl.replace(/\/$/, "")}/pipeline`;
      const res = await fetch(pipelineUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", cacheKey],
          ["EXPIRE", cacheKey, windowSeconds, "NX"],
          ["TTL", cacheKey],
        ]),
      });

      if (res.ok) {
        const results = await res.json();
        const count = results[0]?.result || 1;
        const ttl = results[2]?.result > 0 ? results[2].result : windowSeconds;

        const allowed = count <= maxRequests;
        return {
          allowed,
          limit: maxRequests,
          remaining: Math.max(0, maxRequests - count),
          resetInSeconds: ttl,
        };
      }
    } catch (err) {
      console.warn("Upstash Redis rate limiter fallback to in-memory:", err);
    }
  }

  // 2. High-performance In-Memory Fallback
  const now = Date.now();
  const bucket = memoryStore.get(cacheKey);

  if (!bucket || now > bucket.resetAt) {
    memoryStore.set(cacheKey, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (bucket.count >= maxRequests) {
    const resetInSeconds = Math.ceil((bucket.resetAt - now) / 1000);
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetInSeconds,
    };
  }

  bucket.count++;
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - bucket.count,
    resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}
