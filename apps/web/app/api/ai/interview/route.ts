import { NextRequest, NextResponse } from "next/server";
import { generateAI } from "@repo/ai";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory User Authentication check
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "Authentication required: Please sign in to JobMint to use AI Mock Interviews.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email || "unknown-user";

    // 2. Rate Limiting (8 requests per 5 minutes to prevent token depletion)
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 8,
      windowSeconds: 300,
      prefix: "rl:interview",
      customKey: userId,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `AI interview rate limit reached. Please wait ${rateLimit.resetInSeconds}s before requesting new questions or feedback.`,
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

    const body = await req.json();
    const prompt = body.prompt || "";
    const role = body.role || "Software Engineer";

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt or candidate response is required." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a Principal Engineering Mock Interviewer at a top tier tech company.
Target Role: ${role}.
Evaluate the candidate's technical response, assess architectural trade-offs, edge cases, and algorithmic complexity.
Provide constructive, rigorous feedback and a follow-up probe question.`;

    const response = await generateAI({
      task: "INTERVIEW_PREP_QUESTIONS",
      input: {
        role,
        question: prompt,
        prompt,
      },
    });

    return NextResponse.json({
      success: response.success,
      result: response.result,
      provider: response.provider,
      remainingCredits: rateLimit.remaining,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate interview response." },
      { status: 500 }
    );
  }
}
