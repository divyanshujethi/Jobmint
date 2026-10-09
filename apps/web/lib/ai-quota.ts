import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db, users, eq } from "@repo/database";
import { getCache, setCache } from "@/lib/redis";
import { getClientIp } from "@/lib/rate-limit";

export const MAX_FREE_AI_USES = 5;

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
 * Checks if the current user or IP has remaining AI generations according to their plan tier.
 */
export async function checkAiQuota(req: NextRequest): Promise<QuotaCheckResult> {
  let userId: string | null = null;
  let isPro = false;

  try {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;

      // Check DB for plan & Pro status
      const { getUserPlan } = await import("@/lib/plan-limits");
      const plan = await getUserPlan(userId);
      isPro = plan.isPro;

      const limit = plan.limits.maxAiGenerations;
      const current = plan.aiGenerationsCount;

      if (current >= limit) {
        return {
          allowed: false,
          isPro,
          usageCount: current,
          remaining: 0,
          limit,
          userKey: userId,
          requiresPro: true,
          error: `AI Quota Reached: You have reached the limit of ${limit} AI generations on your ${plan.planTier.toUpperCase()} plan. Please upgrade at /pricing to increase your quota.`,
        };
      }

      return {
        allowed: true,
        isPro,
        usageCount: current,
        remaining: Math.max(0, limit - current),
        limit,
        userKey: userId,
      };
    }
  } catch (err) {
    console.warn("[AI Quota] Error checking user session/DB:", err);
  }

  // For free / trial users, track by user ID or IP
  // Use the same trusted-header order as the rate limiter (Cloudflare first).
  // Reading x-forwarded-for first let anyone reset their free quota by spoofing it.
  const ip = getClientIp(req);

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
      error: `Free AI Trial Exhausted: You have used your ${MAX_FREE_AI_USES} free AI generations. Upgrade your plan at /pricing to get up to 75 AI generations/month.`,
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
