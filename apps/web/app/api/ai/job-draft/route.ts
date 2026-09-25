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
    const { prompt } = body;

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a job title or short prompt (e.g. 'Junior Full-Stack Engineer, React/Node, ₹12 LPA')." },
        { status: 400 }
      );
    }

    const aiPrompt = `
You are an expert tech recruiter and VP of Engineering drafting an attractive, zero-ghosting Job Description for top tech talent.

Prompt from employer: "${prompt}"

Generate a complete, structured job specification in valid JSON:
1. "title": standard clean role title (e.g. "Junior Full-Stack Engineer")
2. "salaryOrStipend": standard compensation string in ₹ INR (e.g. "₹10,00,000 – ₹14,00,000 / year (₹12 LPA)")
3. "selectedSkills": array of 4-6 canonical skills (e.g. ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js"])
4. "description": 2-3 paragraph overview of the role, impact, and team culture.
5. "responsibilities": 4-6 bullet points detailing day-to-day work, architecture ownership, and code quality.
6. "requirements": 4-6 bullet points covering technical background, required skills, and problem-solving mindset.
7. "interviewExpectations": 2-3 sentences outlining the zero-ghosting hiring process (e.g., Round 1: Coding sandbox, Round 2: System discussion, Final: Culture fit within 10 days).

Respond ONLY with valid JSON in this exact structure:
{
  "title": "Junior Full-Stack Engineer",
  "salaryOrStipend": "₹10,00,000 – ₹14,00,000 / year (₹12 LPA)",
  "selectedSkills": ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js"],
  "description": "We are seeking a driven Junior Full-Stack Engineer to build scalable user-facing features and resilient backend services. In this role, you will work closely with senior architects to ship clean, performant TypeScript code across our modern web stack.",
  "responsibilities": "• Design, develop, and maintain high-performance web applications using React and Next.js.\n• Build robust RESTful and async APIs using Node.js and TypeScript backed by PostgreSQL.\n• Write clean, testable code with end-to-end integration tests and peer code reviews.\n• Collaborate with product managers and designers to iterate rapidly on user feedback.",
  "requirements": "• 0-2 years of hands-on experience building web applications with modern JavaScript/TypeScript.\n• Strong grasp of React fundamentals (hooks, state management, SSR) and Node.js backend patterns.\n• Familiarity with relational databases (PostgreSQL/MySQL) and writing efficient SQL queries.\n• Passion for writing clean code and demonstrating proof-of-work through GitHub or live projects.",
  "interviewExpectations": "Our transparent hiring process consists of a 45-minute live coding challenge, followed by an architectural conversation. We guarantee a final decision within 10 business days."
}
`;

    let draft: any = null;
    const raw = await callFastLlm({
      prompt: aiPrompt,
      systemInstruction: "You are a tech recruiter. Return strictly valid JSON with no markdown wrapping.",
      temperature: 0.3,
    });

    if (raw) {
      try {
        const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        draft = JSON.parse(clean);
      } catch (e) {
        console.warn("Could not parse LLM job draft JSON:", e);
      }
    }

    if (!draft || !draft.title) {
      // Deterministic fallback
      draft = {
        title: prompt.split(",")[0]?.trim() || "Full-Stack Software Engineer",
        salaryOrStipend: "₹10,00,000 – ₹14,00,000 / year (₹12 LPA)",
        selectedSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js"],
        description: `We are looking for a skilled engineer to join our high-velocity team. You will have full ownership over core customer-facing features, contributing directly to our scalable web architecture and data pipelines.`,
        responsibilities: `• Architect and ship modular UI components and reliable backend APIs.\n• Optimize database queries and API response times for high-volume traffic.\n• Write maintainable, documented code with thorough test coverage.\n• Participate in technical design discussions and peer code reviews.`,
        requirements: `• Hands-on proficiency in modern JavaScript/TypeScript, React, and Node.js.\n• Solid understanding of relational databases and clean API design.\n• Problem-solving mindset with proven project work or verified Dev Score.\n• Strong communication skills and enthusiasm for fast-paced product delivery.`,
        interviewExpectations: `Our process consists of 2 stages: a practical coding sandbox evaluation and an engineering culture discussion. Transparent feedback provided within 7 days.`,
      };
    }

    // 2. Increment quota for free users
    if (!quota.isPro) {
      await incrementAiQuota(quota.userKey);
    }

    return NextResponse.json({
      success: true,
      draft,
      quota: {
        isPro: quota.isPro,
        remaining: quota.isPro ? 999999 : Math.max(0, quota.remaining - 1),
        limit: quota.limit,
      },
    });
  } catch (err: any) {
    console.error("Error drafting job description:", err);
    return NextResponse.json({ error: err.message || "Failed to generate job draft" }, { status: 500 });
  }
}
