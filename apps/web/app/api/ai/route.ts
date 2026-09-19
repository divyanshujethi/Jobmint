import { NextRequest, NextResponse } from "next/server";
import { generateAI, circuitBreaker, AITask } from "@repo/ai";

export async function GET() {
  const stats = circuitBreaker.getStats();
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task, input } = body as { task: AITask; input: Record<string, any> };

    if (!task || !input) {
      return NextResponse.json(
        { error: "Missing required fields: 'task' and 'input'" },
        { status: 400 }
      );
    }

    const response = await generateAI({ task, input });

    if (!response.success && response.error) {
      return NextResponse.json(response, { status: 429 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}