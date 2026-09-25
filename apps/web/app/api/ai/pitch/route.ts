import { NextRequest, NextResponse } from "next/server";
import { checkAiQuota, incrementAiQuota } from "@/lib/ai-quota";
import { callFastLlm } from "@/lib/ai-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Quota Check
    const quota = await checkAiQuota(req);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: quota.error,
          requiresPro: true,
          limitReached: true,
          remaining: 0,
          limit: quota.limit,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { jobTitle, companyName, requiredSkills, candidateSkills, candidateSummary, devScore } = body;

    const role = jobTitle || "Software Engineer";
    const company = companyName || "the engineering team";
    const skillsText = Array.isArray(requiredSkills) && requiredSkills.length > 0
      ? requiredSkills.join(", ")
      : "React, TypeScript, Node.js, Cloud APIs";

    const prompt = `
You are a career strategist writing a personalized, high-converting 3-paragraph introduction note from a candidate to a recruiter or engineering manager.

Job Title: ${role}
Company: ${company}
Target Tech Stack: ${skillsText}
Candidate Profile:
- Skills: ${Array.isArray(candidateSkills) && candidateSkills.length > 0 ? candidateSkills.join(", ") : "Full-stack developer"}
- Dev Score: ${devScore ? `${devScore}/1000 Verified on Role Nest` : "Top-tier coder"}
- Summary: ${candidateSummary || "Hands-on builder with strong CS fundamentals"}

Instructions:
1. Paragraph 1: Enthusiastic opening acknowledging why ${company}'s products/engineering stand out, explicitly stating applying for ${role}.
2. Paragraph 2: Core proof-of-work: highlight how the candidate's experience in ${skillsText} directly solves high-throughput, product-first engineering challenges.
3. Paragraph 3: Professional closing: mention availability for a fast technical conversation, zero-ghosting readiness, and eagerness to ship value.
Keep it punchy, authentic, human, and strictly 3 concise paragraphs. No generic boilerplate phrases like "I am writing to express my enthusiasm".

Return strictly the 3 paragraphs formatted with clean line breaks.
`;

    let pitch = await callFastLlm({
      prompt,
      systemInstruction: "You are an elite Silicon Valley / Indian Tech recruiter writing a hyper-effective candidate cover pitch. Return only the pitch text.",
      temperature: 0.4,
    });

    if (!pitch || pitch.length < 50) {
      // Deterministic high-quality fallback
      pitch = `I have been closely following ${company}'s engineering pace and high-scale architecture, and I am excited to apply for the ${role} opening. Having built and shipped production web services with ${skillsText}, I know how critical reliability and clean code patterns are to your team.

In my recent technical work, I focused heavily on scalable full-stack development, optimizing state management, database schema design, and asynchronous API integration. With a verified Dev Score on Role Nest, my focus is always on delivering measurable proof-of-work rather than resume buzzwords.

I would love to connect for a quick technical sync to discuss how my hands-on background with ${skillsText} can immediately accelerate ${company}'s upcoming roadmap. Thank you for your time, and I look forward to speaking soon.`;
    }

    // 2. Increment quota for free users
    if (!quota.isPro) {
      await incrementAiQuota(quota.userKey);
    }

    return NextResponse.json({
      success: true,
      pitch,
      quota: {
        isPro: quota.isPro,
        remaining: quota.isPro ? 999999 : Math.max(0, quota.remaining - 1),
        limit: quota.limit,
      },
    });
  } catch (err: any) {
    console.error("Error generating pitch:", err);
    return NextResponse.json({ error: err.message || "Failed to generate personalized pitch" }, { status: 500 });
  }
}
