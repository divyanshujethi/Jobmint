import { NextRequest, NextResponse } from "next/server";
import { generateAI, circuitBreaker, AITask } from "@repo/ai";
import { auth } from "@/auth";

// Sliding window in-memory rate limiter
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const userBuckets = new Map<string, RateLimitBucket>();
const MAX_REQUESTS_PER_WINDOW = 15;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const bucket = userBuckets.get(userId);

  if (!bucket || now > bucket.resetAt) {
    userBuckets.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetInSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetInSeconds = Math.ceil((bucket.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  bucket.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - bucket.count,
    resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

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
          error: "Authentication required: Please sign in to JobMint to use AI assistance.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email || "unknown-user";

    // 2. Per-user Rate Limiting (15 requests per 10 minutes)
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `AI Rate Limit Exceeded: You have reached your limit of ${MAX_REQUESTS_PER_WINDOW} requests per 10 minutes. Please try again in ${rateLimit.resetInSeconds} seconds.`,
          rateLimitExceeded: true,
          resetInSeconds: rateLimit.resetInSeconds,
        },
        { status: 429 }
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
