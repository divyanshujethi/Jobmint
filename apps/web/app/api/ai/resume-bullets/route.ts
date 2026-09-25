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
          error: "Authentication required: Please sign in to Role Nest to use the ATS Resume Bullet Assistant.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email || "unknown-user";

    // 2. Cloudflare IP & User Token Rate Limiting (10 requests per 5 minutes)
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 10,
      windowSeconds: 300,
      prefix: "rl:resume-bullets",
      customKey: userId,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${rateLimit.resetInSeconds}s before generating more resume bullets.`,
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
    const prompt = body.prompt || body.bullet || "";

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt or draft bullet point is required." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert ATS Resume Optimization Engine for Software Engineers in 2026.
Transform the user's rough achievement into high-impact, quantified STAR (Situation-Task-Action-Result) format bullets.
Use strong active verbs (Architected, Spearheaded, Accelerated, Engineered).
Return exactly 3 optimized variations in JSON format:
{
  "bullets": [
    "Variation 1...",
    "Variation 2...",
    "Variation 3..."
  ],
  "atsScore": 92,
  "keyKeywords": ["TypeScript", "Distributed Systems", "Latency"]
}`;

    const response = await generateAI({
      task: "IMPROVE_RESUME_BULLET",
      input: {
        bullet: prompt,
        prompt: prompt,
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
      { error: err.message || "Failed to generate resume bullets." },
      { status: 500 }
    );
  }
}
