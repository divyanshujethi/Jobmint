import { AIRequestOptions, AIResponse, AIProviderName } from "./types";
import { circuitBreaker } from "./circuit-breaker";
import { callGroqProvider } from "./providers/groq-provider";
import { callCloudflareWorkersAI } from "./providers/cloudflare-provider";
import { callOllamaProvider } from "./providers/ollama-provider";
import { callGeminiProvider } from "./providers/gemini-provider";

/**
 * 4-Tier Llama 3.2 AI Cascade Router
 * Tier 1: Groq (Llama 3.3 70B - 300 tok/sec, 14.4k/day free)
 * Tier 2: Cloudflare Workers AI (Llama 3.2 3B - Edge GPU)
 * Tier 3: OCI Always Free VM (Llama 3.2 3B - Self-Hosted Ollama, 0 limits)
 * Tier 4: Gemini 1.5/2.0 Flash (Generous free tier)
 * Tier 5: Deterministic ATS Engine (Offline / 0-cost safety net)
 */
export async function generateAI({
  task,
  input,
  preferredProvider,
}: AIRequestOptions): Promise<AIResponse> {
  // 1. Quota Circuit Breaker Check
  const check = circuitBreaker.canExecute(task === "IMPROVE_RESUME_BULLET");
  if (!check.allowed) {
    return {
      success: false,
      provider: "deterministic",
      modelUsed: "none",
      tier: 4,
      latencyMs: 0,
      result: null,
      cached: false,
      error: check.reason,
    };
  }

  const prompt = constructPrompt(task, input);
  const attemptedProviders: string[] = [];

  // TIER 1: GROQ
  if (!preferredProvider || preferredProvider === "groq-llama-3.3") {
    if (process.env.GROQ_API_KEY) {
      attemptedProviders.push("Groq (Qwen/Llama)");
      try {
        const res = await callGroqProvider(prompt);
        return {
          success: true,
          provider: "groq-llama-3.3",
          modelUsed: res.modelUsed,
          tier: 1,
          latencyMs: res.latencyMs,
          result: formatResult(task, res.text),
          cached: false,
          providerChainAttempted: attemptedProviders,
        };
      } catch (err: any) {
        console.warn(`[AI Cascade] Tier 1 Groq failed: ${err.message}. Falling to Tier 2...`);
      }
    }
  }

  // TIER 2: GEMINI FLASH (Google AI Studio)
  if (!preferredProvider || preferredProvider === "gemini-flash") {
    if (process.env.GEMINI_API_KEY) {
      attemptedProviders.push("Google Gemini Flash");
      try {
        const res = await callGeminiProvider(prompt);
        return {
          success: true,
          provider: "gemini-flash",
          modelUsed: res.modelUsed,
          tier: 2,
          latencyMs: res.latencyMs,
          result: formatResult(task, res.text),
          cached: false,
          providerChainAttempted: attemptedProviders,
        };
      } catch (err: any) {
        console.warn(`[AI Cascade] Tier 2 Gemini failed: ${err.message}. Falling to Tier 3...`);
      }
    }
  }

  // TIER 3: OCI ALWAYS FREE VM (Self-Hosted Llama 3.2 3B via Ollama)
  if (!preferredProvider || preferredProvider === "oci-ollama-llama-3.2") {
    attemptedProviders.push("OCI VM Self-Hosted (Llama 3.2 3B)");
    try {
      const res = await callOllamaProvider(prompt);
      return {
        success: true,
        provider: "oci-ollama-llama-3.2",
        modelUsed: res.modelUsed,
        tier: 3,
        latencyMs: res.latencyMs,
        result: formatResult(task, res.text),
        cached: false,
        providerChainAttempted: attemptedProviders,
      };
    } catch (err: any) {
      console.warn(`[AI Cascade] Tier 3 OCI Ollama failed: ${err.message}. Falling to Tier 4...`);
    }
  }

  // TIER 4: CLOUDFLARE WORKERS AI
  if (!preferredProvider || preferredProvider === "cloudflare-llama-3.2") {
    if ((process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID) && process.env.CLOUDFLARE_API_TOKEN) {
      attemptedProviders.push("Cloudflare Workers AI (Llama 3.2 3B)");
      try {
        const res = await callCloudflareWorkersAI(prompt);
        return {
          success: true,
          provider: "cloudflare-llama-3.2",
          modelUsed: res.modelUsed,
          tier: 4,
          latencyMs: res.latencyMs,
          result: formatResult(task, res.text),
          cached: false,
          providerChainAttempted: attemptedProviders,
        };
      } catch (err: any) {
        console.warn(`[AI Cascade] Tier 4 Cloudflare failed: ${err.message}. Falling to Deterministic...`);
      }
    }
  }

  // TIER 5: DETERMINISTIC SAFE FALLBACK (Offline & Testing Engine)
  attemptedProviders.push("Deterministic Rule-Based Engine");
  return {
    success: true,
    provider: "deterministic",
    modelUsed: "Rule-Based-STAR-Taxonomy",
    tier: 5,
    latencyMs: 2,
    result: generateDeterministicFallback(task, input),
    cached: true,
    providerChainAttempted: attemptedProviders,
  };
}

function constructPrompt(task: string, input: Record<string, any>): string {
  if (task === "IMPROVE_RESUME_BULLET") {
    return `Rewrite the following student resume bullet into a high-impact, professional bullet for tech recruiters.
RULES:
1. Start with a strong action verb (e.g. Architected, Engineered, Spearheaded, Optimized).
2. Follow the STAR framework (Action taken + Technical implementation + Measurable outcome/impact).
3. Do NOT invent facts or metrics not implied in the draft.
4. Keep under 28 words. Output ONLY the refined bullet point.

Bullet draft: "${input.bullet}"`;
  }

  if (task === "INTERVIEW_PREP_QUESTIONS") {
    return `Generate 5 technical interview questions for a candidate applying to "${input.jobTitle || "Software Engineer"}" requiring skills: ${input.skills?.join(", ") || "General CS"}. Return structured questions with key evaluation criteria.`;
  }

  return `Task: ${task} on input ${JSON.stringify(input)}`;
}

function formatResult(task: string, text: string): any {
  if (task === "IMPROVE_RESUME_BULLET") {
    const clean = text.replace(/^["'\s*•-]+|["'\s]+$/g, "").trim();
    const firstWord = clean.split(" ")[0] || "Engineered";
    return {
      original: "",
      enhanced: clean,
      actionVerbUsed: firstWord,
      impactFocus: "Technical Execution & Business Impact",
    };
  }

  return text.trim();
}

function generateDeterministicFallback(
  task: string,
  input: Record<string, any>
): any {
  if (task === "IMPROVE_RESUME_BULLET") {
    const raw = String(input.bullet || "").trim();
    const stripped = raw.replace(/^(i worked on|built|made|did|helped with)\s*/i, "");
    return {
      original: raw,
      enhanced: `Architected and delivered ${stripped}, implementing robust design patterns, reducing latency, and ensuring continuous production reliability.`,
      actionVerbUsed: "Architected",
      impactFocus: "Modularity & Execution Reliability",
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
        question: "How do you ensure data validation and type safety between client and server?",
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