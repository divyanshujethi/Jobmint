import { NextRequest, NextResponse } from "next/server";
import { generateAI, circuitBreaker, AITask } from "@repo/ai";
import { auth } from "@/auth";

import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const stats = circuitBreaker.getStats();
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory User Authentication check
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "Authentication required: Please sign in to Role Nest to use AI assistance.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email || "unknown-user";

    // 2. Per-user Rate Limiting (15 requests per 10 minutes) with Upstash / Cloudflare IP support
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 15,
      windowSeconds: 600,
      prefix: "rl:ai-core",
      customKey: userId,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `AI Rate Limit Exceeded: You have reached your limit of 15 requests per 10 minutes. Please try again in ${rateLimit.resetInSeconds} seconds.`,
          rateLimitExceeded: true,
          resetInSeconds: rateLimit.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    // 3. Platform Circuit Breaker check
    const quotaCheck = circuitBreaker.canExecute(false);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: quotaCheck.reason || "Platform daily AI quota reached. Please try again later.",
          circuitBreakerActive: true,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { task, input, preferredProvider } = body as {
      task: AITask;
      input: Record<string, any>;
      preferredProvider?: any;
    };

    if (!task || !input) {
      return NextResponse.json(
        { error: "Missing required fields: 'task' and 'input'" },
        { status: 400 }
      );
    }

    const response = await generateAI({ task, input, preferredProvider });

    if (!response.success && response.error) {
      return NextResponse.json(response, { status: 429 });
    }

    return NextResponse.json({
      ...response,
      remainingQuota: rateLimit.remaining,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}
