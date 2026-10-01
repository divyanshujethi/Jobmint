import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserPlan } from "@/lib/plan-limits";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({
        isPro: false,
        authenticated: false,
        planTier: "free",
        aiGenerationsCount: 0,
        limits: {
          maxAiGenerations: 3,
          maxTrackedApplications: 5,
          maxMockQuestionsPerJob: 3,
          allowCustomCourses: false,
          badge: "none",
          priorityPlacement: false,
          githubDeepAudit: false,
        },
      }, { status: 200 });
    }

    const planInfo = await getUserPlan(session.user.id);

    return NextResponse.json({
      authenticated: true,
      isPro: planInfo.isPro,
      planTier: planInfo.planTier,
      proExpiresAt: planInfo.proExpiresAt,
      aiGenerationsCount: planInfo.aiGenerationsCount,
      limits: planInfo.limits,
      role: (session.user as any)?.role || "CANDIDATE",
    });
  } catch (err: any) {
    console.error("[API pro-status] Error:", err);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
