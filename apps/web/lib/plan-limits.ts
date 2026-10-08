import { db, users, eq, sql } from "@repo/database";

export interface PlanLimits {
  maxAiGenerations: number;
  maxTrackedApplications: number;
  maxMockQuestionsPerJob: number;
  allowCustomCourses: boolean;
  badge: "none" | "student" | "pro";
  priorityPlacement: boolean;
  githubDeepAudit: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxAiGenerations: 5,
    maxTrackedApplications: 5,
    maxMockQuestionsPerJob: 3,
    allowCustomCourses: false,
    badge: "none",
    priorityPlacement: false,
    githubDeepAudit: false,
  },
  student: {
    maxAiGenerations: 25,
    maxTrackedApplications: 15,
    maxMockQuestionsPerJob: 10,
    allowCustomCourses: false,
    badge: "student",
    priorityPlacement: false,
    githubDeepAudit: false,
  },
  pro: {
    maxAiGenerations: 75,
    maxTrackedApplications: 50,
    maxMockQuestionsPerJob: 25,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: false,
    githubDeepAudit: true,
  },
  plus: {
    maxAiGenerations: 100,
    maxTrackedApplications: 75,
    maxMockQuestionsPerJob: 30,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: true,
    githubDeepAudit: true,
  },
  pro_plus: {
    maxAiGenerations: 100,
    maxTrackedApplications: 75,
    maxMockQuestionsPerJob: 30,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: true,
    githubDeepAudit: true,
  },
  annual: {
    maxAiGenerations: 300,
    maxTrackedApplications: 150,
    maxMockQuestionsPerJob: 50,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: true,
    githubDeepAudit: true,
  },
  pro_annual: {
    maxAiGenerations: 300,
    maxTrackedApplications: 150,
    maxMockQuestionsPerJob: 50,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: true,
    githubDeepAudit: true,
  },
  all_access: {
    maxAiGenerations: 300,
    maxTrackedApplications: 150,
    maxMockQuestionsPerJob: 50,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: true,
    githubDeepAudit: true,
  },
  lifetime: {
    maxAiGenerations: 500,
    maxTrackedApplications: 250,
    maxMockQuestionsPerJob: 100,
    allowCustomCourses: true,
    badge: "pro",
    priorityPlacement: true,
    githubDeepAudit: true,
  },
};

let hasEnsuredColumns = false;
export async function ensurePlanColumns() {
  if (hasEnsuredColumns) return;
  try {
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_tier VARCHAR(32) DEFAULT 'free';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_generations_count INTEGER DEFAULT 0;
    `);
    hasEnsuredColumns = true;
  } catch (err) {
    console.error("Failed to ensure plan columns:", err);
  }
}

export async function getUserPlan(userIdOrEmail: string): Promise<{
  userId: string;
  isPro: boolean;
  planTier: string;
  proExpiresAt: Date | null;
  aiGenerationsCount: number;
  limits: PlanLimits;
}> {
  await ensurePlanColumns();

  const isEmail = userIdOrEmail.includes("@");
  const query = isEmail
    ? db.select().from(users).where(eq(users.email, userIdOrEmail.toLowerCase())).limit(1)
    : db.select().from(users).where(eq(users.id, userIdOrEmail)).limit(1);

  const [userRecord] = await query;

  if (!userRecord) {
    return {
      userId: userIdOrEmail,
      isPro: false,
      planTier: "free",
      proExpiresAt: null,
      aiGenerationsCount: 0,
      limits: PLAN_LIMITS.free!,
    };
  }

  const isStillActive =
    userRecord.isPro &&
    (!userRecord.proExpiresAt || new Date(userRecord.proExpiresAt) > new Date());

  const rawTier = (userRecord.planTier || "free").toLowerCase();
  const effectiveTier = isStillActive ? (rawTier !== "free" ? rawTier : "pro") : "free";

  return {
    userId: userRecord.id,
    isPro: Boolean(isStillActive),
    planTier: effectiveTier,
    proExpiresAt: userRecord.proExpiresAt,
    aiGenerationsCount: userRecord.aiGenerationsCount || 0,
    limits: PLAN_LIMITS[effectiveTier] || PLAN_LIMITS.free!,
  };
}

export async function checkAndIncrementAiQuota(userIdOrEmail: string): Promise<{
  allowed: boolean;
  error?: string;
  currentCount: number;
  limit: number;
  upgradeUrl: string;
}> {
  const planInfo = await getUserPlan(userIdOrEmail);

  if (planInfo.limits.maxAiGenerations !== Infinity && planInfo.aiGenerationsCount >= planInfo.limits.maxAiGenerations) {
    return {
      allowed: false,
      error: `AI Generation Quota Reached: Your current plan (${planInfo.planTier.toUpperCase()}) includes ${planInfo.limits.maxAiGenerations} AI generations total (ATS resume scans / JD drafts). Upgrade to Role Nest Pro for unlimited AI tailoring and gap analysis.`,
      currentCount: planInfo.aiGenerationsCount,
      limit: planInfo.limits.maxAiGenerations,
      upgradeUrl: "/pricing",
    };
  }

  // Increment usage count in database
  try {
    await db
      .update(users)
      .set({
        aiGenerationsCount: sql`COALESCE(${users.aiGenerationsCount}, 0) + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, planInfo.userId));
  } catch (err) {
    console.error("Failed to increment AI usage:", err);
  }

  return {
    allowed: true,
    currentCount: planInfo.aiGenerationsCount + 1,
    limit: planInfo.limits.maxAiGenerations,
    upgradeUrl: "/pricing",
  };
}

export async function grantFreeProDays(userId: string, daysToAdd: number = 7): Promise<{ success: boolean; proExpiresAt: Date }> {
  await ensurePlanColumns();
  const [userRecord] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userRecord) {
    throw new Error("User not found");
  }

  const now = new Date();
  const currentExpiry = userRecord.proExpiresAt ? new Date(userRecord.proExpiresAt) : null;
  const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
  const newExpiry = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  await db
    .update(users)
    .set({
      isPro: true,
      planTier: userRecord.planTier === "free" ? "pro" : userRecord.planTier,
      proExpiresAt: newExpiry,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { success: true, proExpiresAt: newExpiry };
}

