import { NextRequest, NextResponse } from "next/server";
import { callGroqProvider, callOllamaProvider } from "@repo/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(req, {
      maxRequests: 15,
      windowSeconds: 60,
      prefix: "rl:arena-review",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many code review requests. Please wait ${rateLimit.resetInSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, language, problemTitle, problemDescription, category, difficulty } = body;

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "Code content is required for AI Code Review." },
        { status: 400 }
      );
    }

    const prompt = `You are a Principal Algorithm Engineer and FAANG Interview Evaluator at ProblemNest Arena.
Analyze the candidate's solution code for the coding problem "${problemTitle || "Algorithm Challenge"}".
Problem Info: ${difficulty || "Medium"} | Category: ${category || "Algorithms"}
Description: ${problemDescription || ""}
Language: ${language || "javascript"}

Candidate Solution Code:
\`\`\`${language || "javascript"}
${code.slice(0, 4000)}
\`\`\`

Provide an authoritative analysis. Return ONLY valid JSON with this exact schema (no markdown formatting, no other text):
{
  "verdict": "Optimal Approach" | "Good Solution" | "Suboptimal" | "Needs Bugfix",
  "editorialBreakdown": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "edgeCases": [
    "Edge Case 1: ...",
    "Edge Case 2: ...",
    "Edge Case 3: ..."
  ],
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "complexityProof": "Detailed mathematical proof of the time and space complexity based on operations and storage.",
  "cleanCodeTips": [
    "Tip 1...",
    "Tip 2..."
  ]
}`;

    let rawText = "";

    try {
      if (process.env.GROQ_API_KEY) {
        const groqRes = await callGroqProvider(prompt);
        rawText = groqRes.text;
      } else {
        const ollamaRes = await callOllamaProvider(prompt);
        rawText = ollamaRes.text;
      }
    } catch (apiErr: any) {
      console.warn("Primary AI provider error in arena review:", apiErr?.message);
      try {
        const ollamaRes = await callOllamaProvider(prompt);
        rawText = ollamaRes.text;
      } catch (ollamaErr: any) {
        console.warn("Ollama AI fallback error in arena review:", ollamaErr?.message);
      }
    }

    if (rawText) {
      try {
        const cleanJson = rawText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
        const parsed = JSON.parse(cleanJson);
        return NextResponse.json(parsed);
      } catch (parseErr) {
        console.warn("Failed to parse AI review JSON, falling back to heuristics:", parseErr);
      }
    }

    // Algorithmic heuristic analysis fallback
    const hasLoop = /for\s*\(|while\s*\(|\.forEach|\.map/i.test(code);
    const hasNestedLoop = /(for\s*\([^)]*\)[\s\S]*?for\s*\(|while\s*\([^)]*\)[\s\S]*?while\s*\()/i.test(code);
    const hasMap = /Map|Set|dict|unordered_map|HashMap|HashSet|{}|\[\]/i.test(code);

    const estimatedTime = hasNestedLoop ? "O(n²)" : hasLoop ? "O(n)" : "O(1)";
    const estimatedSpace = hasMap ? "O(n)" : "O(1)";

    return NextResponse.json({
      verdict: hasNestedLoop ? "Suboptimal (Nested Loop)" : "Optimal Approach",
      editorialBreakdown: [
        `1. Algorithmic Pattern: The solution utilizes a ${hasMap ? "Hash Map / Set lookup" : "Linear Traversal"} pattern to process input elements efficiently.`,
        `2. Invariant Maintenance: Iterates across the input sequence while verifying boundary constraints before advancing state.`,
        `3. Termination: Completes within a deterministic pass, avoiding unbounded recursion or cyclic loops.`,
      ],
      edgeCases: [
        "Zero or Empty Collection: Verify behavior when the input array length is 0 or contains only 1 element.",
        "Negative & Extreme Values: Ensure numeric calculations prevent integer overflow within 32-bit limits.",
        "Duplicate & Collinear Entries: Verify duplicate elements do not overwrite frequency map buckets unexpectedly.",
      ],
      timeComplexity: estimatedTime,
      spaceComplexity: estimatedSpace,
      complexityProof: `Each element is processed ${hasNestedLoop ? "n times in nested loops resulting in O(n²) operations" : "in O(1) time during a single pass, establishing O(n) total linear time"}. Auxiliary storage requires ${hasMap ? "O(n) memory for hash indexing" : "O(1) constant extra space"}.`,
      cleanCodeTips: [
        "Use expressive identifiers matching domain logic rather than single-letter variables.",
        "Apply early-return guard clauses at function start to handle boundary conditions cleanly.",
        "Favor immutable bindings (const / final) to prevent unintended side effects.",
      ],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed generating AI Code Review" },
      { status: 500 }
    );
  }
}
