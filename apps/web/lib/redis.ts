import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null;
};

function createRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: false,
      enableOfflineQueue: false,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 100, 1000);
      },
    });

    client.on("error", (err) => {
      // Gracefully log without crashing
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Redis Cache] Connection error:", err.message);
      }
    });

    return client;
  } catch (err: any) {
    console.warn("[Redis Cache] Failed to initialize Redis:", err.message);
    return null;
  }
}

export const redis = globalForRedis.redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redisClient = redis;
}

/**
 * Get cached JSON value from Redis with sub-millisecond read latency.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Store value in Redis with automatic JSON serialization and TTL in seconds.
 */
export async function setCache(
  key: string,
  value: any,
  ttlSeconds: number = 60
): Promise<void> {
  if (!redis) return;
  try {
    const serialized = JSON.stringify(value);
    await redis.set(key, serialized, "EX", ttlSeconds);
  } catch (err) {
    // Non-blocking fail-safe
  }
}

/**
 * Invalidate cache key(s)
 */
export async function delCache(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // Non-blocking fail-safe
  }
}
