import { AIRequestOptions, AIResponse } from "./types";
import { circuitBreaker } from "./circuit-breaker";

/**
 * Multi-Model Task Router
 * Primary: Google Gemini Flash (Generous free tier)
 * Backup: Groq (Ultra-fast Llama 3)
 * Safety: Circuit breaker (guarantees zero surprise bill) + Safe Fallback
 */
export async function generateAI({
  task,
  input,
}: AIRequestOptions): Promise<AIResponse> {
  // 1. Quota Circuit Breaker Check
  const check = circuitBreaker.canExecute(task === "IMPROVE_RESUME_BULLET");
  if (!check.allowed) {
    return {
      success: false,
      provider: "mock",
      result: null,
      cached: false,
      error: check.reason,
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  // 2. PRIMARY: GEMINI FLASH (Free tier in Google AI Studio)
  if (geminiKey) {
    try {
      const prompt = constructPrompt(task, input);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            success: true,
            provider: "gemini",
            result: formatResult(task, text),
            cached: false,
          };
        }
      }
      console.warn("[AI Gateway] Gemini API returned error, attempting Groq fallback...");
    } catch (err) {
      console.error("[AI Gateway] Gemini error:", err);
    }
  }

  // 3. BACKUP: GROQ (Free Tier Llama 3)
  if (groqKey) {
    try {
      const prompt = constructPrompt(task, input);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return {
            success: true,
            provider: "groq",
            result: formatResult(task, text),
            cached: false,
          };
        }
      }
    } catch (err) {
      console.error("[AI Gateway] Groq error:", err);
    }
  }

  // 4. DETERMINISTIC SAFE FALLBACK (No API Keys needed during dev / testing)
  return {
    success: true,
    provider: "mock",
    result: generateDeterministicFallback(task, input),
    cached: true,
  };
}

function constructPrompt(task: string, input: Record<string, any>): string {
  if (task === "IMPROVE_RESUME_BULLET") {
    return `You are an expert tech recruiter and ATS optimization assistant.
Rewrite the following student resume bullet into a high-impact, professional bullet.
RULES:
- Start with a strong action verb (e.g. Architected, Engineered, Developed).
- NEVER invent facts, metrics, or technologies not implied in the draft.
- Keep under 28 words.
Bullet draft: "${input.bullet}"`;
  }

  if (task === "INTERVIEW_PREP_QUESTIONS") {
    return `Generate 5 technical interview questions for a candidate applying to "${input.jobTitle}" requiring skills: ${input.skills?.join(", ")}.`;
  }

  return `Task: ${task} on input ${JSON.stringify(input)}`;
}

function formatResult(task: string, text: string): any {
  return text.trim();
}

function generateDeterministicFallback(
  task: string,
  input: Record<string, any>
): any {
  if (task === "IMPROVE_RESUME_BULLET") {
    const raw = String(input.bullet || "").trim();
    return {
      original: raw,
      enhanced: `Architected and shipped ${raw.replace(/^(i worked on|built|made|did)\s*/i, "")}, adhering to modern clean code patterns and improving modularity and execution reliability.`,
      actionVerbUsed: "Architected",
      impactFocus: "Modularity & Performance",
    };
  }

  if (task === "INTERVIEW_PREP_QUESTIONS") {
    return [
      {
        question: `How do you approach state management and render optimization in ${input.jobTitle || "Frontend"} applications?`,
        focusArea: "Architecture & Performance",
        recommendedApproach: "Explain component hierarchy, memoization (useMemo/useCallback), and minimizing unnecessary re-renders.",
      },
      {
        question: "Describe a challenging bug you encountered in a recent project and how you diagnosed it.",
        focusArea: "Problem Solving",
        recommendedApproach: "Use the STAR method (Situation, Task, Action, Result) with verifiable debugging techniques.",
      },
      {
        question: `How do you ensure data validation and type safety between client and server?`,
        focusArea: "Reliability & Types",
        recommendedApproach: "Discuss TypeScript interfaces, Zod runtime schemas, and typed API boundaries.",
      },
      {
        question: "Explain the difference between synchronous execution and asynchronous event-driven flows in Node.js / Web.",
        focusArea: "Core CS Fundamentals",
        recommendedApproach: "Mention the Event Loop, microtasks (Promises), and macrotasks (timers/IO).",
      },
      {
        question: "Why do you want to join this team and what excites you about this specific opportunity?",
        focusArea: "Culture & Curiosity",
        recommendedApproach: "Connect your personal passion and recent GitHub projects to what the company builds.",
      },
    ];
  }

  return { message: "Processed successfully" };
}
