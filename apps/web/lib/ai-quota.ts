import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db, users, eq } from "@repo/database";
import { getCache, setCache } from "@/lib/redis";

export const MAX_FREE_AI_USES = 3;

export interface QuotaCheckResult {
  allowed: boolean;
  isPro: boolean;
  usageCount: number;
  remaining: number;
  limit: number;
  userKey: string;
  error?: string;
  requiresPro?: boolean;
}

/**
 * Checks if the current user or IP has remaining free AI generations or has an active Pro subscription.
 */
export async function checkAiQuota(req: NextRequest): Promise<QuotaCheckResult> {
  let userId: string | null = null;
  let isPro = false;

  try {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;

      // Check DB for Pro status
      const [userRecord] = await db
        .select({
          isPro: users.isPro,
          proExpiresAt: users.proExpiresAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userRecord) {
        const isActive =
          userRecord.isPro &&
          (!userRecord.proExpiresAt || new Date(userRecord.proExpiresAt) > new Date());
        if (isActive) {
          isPro = true;
        }
      }
    }
  } catch (err) {
    console.warn("[AI Quota] Error checking user session/DB:", err);
  }

  // If user is Pro, they get unlimited AI generations
  if (isPro) {
    return {
      allowed: true,
      isPro: true,
      usageCount: 0,
      remaining: 999999,
      limit: 999999,
      userKey: userId || "pro-user",
    };
  }

  // For free / trial users, track by user ID or IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const userKey = userId ? `user:${userId}` : `ip:${ip.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
  const quotaRedisKey = `rolenest:ai_quota:${userKey}`;

  let currentUsage = (await getCache<number>(quotaRedisKey)) || 0;

  if (currentUsage >= MAX_FREE_AI_USES) {
    return {
      allowed: false,
      isPro: false,
      usageCount: currentUsage,
      remaining: 0,
      limit: MAX_FREE_AI_USES,
      userKey,
      requiresPro: true,
      error: `Free AI Trial Exhausted: You have used your ${MAX_FREE_AI_USES} free AI generations. Upgrade to Role Nest Pro for unlimited ATS matching, cover letter generation, and JD drafting.`,
    };
  }

  return {
    allowed: true,
    isPro: false,
    usageCount: currentUsage,
    remaining: Math.max(0, MAX_FREE_AI_USES - currentUsage),
    limit: MAX_FREE_AI_USES,
    userKey,
  };
}

/**
 * Increments AI usage count after a successful generation for non-pro users.
 */
export async function incrementAiQuota(userKey: string): Promise<number> {
  try {
    const quotaRedisKey = `rolenest:ai_quota:${userKey}`;
    const currentUsage = (await getCache<number>(quotaRedisKey)) || 0;
    const newUsage = currentUsage + 1;
    // 30 days retention
    await setCache(quotaRedisKey, newUsage, 30 * 24 * 60 * 60);
    return newUsage;
  } catch (err) {
    console.warn("[AI Quota] Error incrementing usage in Redis:", err);
    return 1;
  }
}
