import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { callGroqProvider } from "@repo/ai";

// In-memory message store with clean welcome dialogue
const podMessages: Record<string, Array<{ id: string; sender: string; text: string; role: string; timestamp: string; avatar: string }>> = {
  "ai-llm-builders-pod": [
    {
      id: "msg-welcome-ai",
      sender: "Role Nest Cohort Bot",
      role: "AI Study Coordinator",
      text: "Welcome to the AI & LLM Systems Study Pod! Ask me any questions on PyTorch, Transformers, LoRA fine-tuning, or RAG architecture, or coordinate STAR mock interviews with your cohort.",
      timestamp: "Today",
      avatar: "🤖",
    },
  ],
  "full-stack-nextjs-pod": [
    {
      id: "msg-welcome-fs",
      sender: "Role Nest Cohort Bot",
      role: "AI Study Coordinator",
      text: "Welcome to the Full-Stack Next.js 15 & PostgreSQL Pod! Post questions about Server Components, Server Actions, Drizzle ORM, or practice system design interview questions here.",
      timestamp: "Today",
      avatar: "🤖",
    },
  ],
  "data-science-analytics-pod": [
    {
      id: "msg-welcome-ds",
      sender: "Role Nest Cohort Bot",
      role: "AI Study Coordinator",
      text: "Welcome to the Data Science Pod! Coordinate your daily SQL window function practice, EDA benchmarks, and scikit-learn modeling challenges here.",
      timestamp: "Today",
      avatar: "🤖",
    },
  ],
  "mobile-react-native-pod": [
    {
      id: "msg-welcome-rn",
      sender: "Role Nest Cohort Bot",
      role: "AI Study Coordinator",
      text: "Welcome to the Mobile Development Pod! Ask about React Native Fabric architecture, Expo SDK 52, offline SQLite sync, or native device permission flows.",
      timestamp: "Today",
      avatar: "🤖",
    },
  ],
};

function getSmartFallback(podId: string, text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    return "Great to see you here! Which milestone on the roadmap are you tackling today? Feel free to ask a technical question or suggest a mock interview session.";
  }
  if (lower.includes("lora") || lower.includes("qlora") || lower.includes("quantiz")) {
    return "For LoRA and QLoRA, rank r=16 with alpha=32 on q_proj and v_proj is the gold standard for 3B-8B models. NF4 quantization preserves 96%+ perplexity while fitting comfortably in 6GB-8GB VRAM.";
  }
  if (lower.includes("rag") || lower.includes("vector") || lower.includes("embedding")) {
    return "When designing RAG systems, ensure you use hybrid retrieval (dense embeddings + BM25 keyword matching) followed by a cross-encoder reranker. That cuts retrieval hallucinations by over 40%.";
  }
  if (lower.includes("next") || lower.includes("react") || lower.includes("server action")) {
    return "In Next.js 15 App Router, keep all database queries inside Server Components or Server Actions. Use useActionState with useOptimistic on the client to give users instantaneous feedback.";
  }
  if (lower.includes("interview") || lower.includes("mock") || lower.includes("star")) {
    return "For technical STAR answers: clearly define the Situation, the exact Task, the technical Actions taken (mention specific libraries/tradeoffs), and quantify the Result (e.g. latency reduced by 30%).";
  }
  return `Great question! In production ${podId.replace(/-/g, " ")}, focus on verifiable proof-of-work. Check the Mock Interview tab to practice standard STAR questions with your cohort peers!`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = podMessages[id] || [
    {
      id: `msg-welcome-${id}`,
      sender: "Role Nest Cohort Bot",
      role: "AI Study Coordinator",
      text: `Welcome to the ${id.replace(/-/g, " ")} Study Pod! Use this room to coordinate mock interview times and discuss technical roadmap milestones.`,
      timestamp: "Today",
      avatar: "🤖",
    },
  ];

  return NextResponse.json({ messages: list });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Mandatory Session Authentication check
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to Role Nest to post messages and chat in this Study Pod." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    const finalSender = session.user.name || session.user.email?.split("@")[0] || "Candidate";
    const finalAvatar = (session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase();

    if (!podMessages[id]) {
      podMessages[id] = [];
    }

    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: finalSender,
      role: "Pod Member",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: finalAvatar,
    };

    podMessages[id].push(userMessage);

    // 2. Generate working Role Nest Cohort Bot response
    let botReplyText = "";
    try {
      if (process.env.GROQ_API_KEY) {
        const botPrompt = `You are "Role Nest Cohort Bot", an encouraging, highly knowledgeable AI study coordinator helping Indian college engineering students in the "${id}" Study Pod.
A student named ${finalSender} just wrote: "${text.trim()}".
Task: Provide a concise, high-signal technical response (2-3 short sentences max). If they asked a technical question or discussed code, answer accurately with concrete tips or STAR interview advice. If they greeted, welcome them warmly and suggest a specific topic to study today. Do not include markdown headers or conversational filler like 'Sure, here is'.`;

        const groqRes = await callGroqProvider(botPrompt, process.env.GROQ_MODEL || "llama-3.3-70b-versatile");
        if (groqRes && groqRes.text) {
          botReplyText = groqRes.text.trim();
        }
      }
    } catch (err: any) {
      console.warn("Groq failed for Cohort Bot, using smart fallback:", err.message);
    }

    if (!botReplyText) {
      botReplyText = getSmartFallback(id, text);
    }

    const botMessage = {
      id: `msg-bot-${Date.now()}`,
      sender: "Role Nest Cohort Bot",
      role: "AI Study Coordinator",
      text: botReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "🤖",
    };

    podMessages[id].push(botMessage);

    return NextResponse.json({
      success: true,
      message: userMessage,
      botResponse: botMessage,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to post message" }, { status: 500 });
  }
}
