import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// In-memory message store with seeded peer dialogue
const podMessages: Record<string, Array<{ id: string; sender: string; text: string; role: string; timestamp: string; avatar: string }>> = {
  "ai-llm-builders-pod": [
    {
      id: "msg-1",
      sender: "Aarav Patel",
      role: "ML Engineer (IIT Delhi)",
      text: "Hey everyone! Working through Chapter 4 of Fast.ai. Anyone tested quantizing the Qwen 2.5 7B model using bitsandbytes?",
      timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "A",
    },
    {
      id: "msg-2",
      sender: "Priya Nair",
      role: "AI Researcher (BITS Pilani)",
      text: "Yes! 4-bit NF4 quantization preserves 96%+ perplexity while fitting inside 6GB VRAM. I have a Colab notebook ready if anyone wants it.",
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "P",
    },
  ],
  "fullstack-nextjs-pod": [
    {
      id: "msg-1",
      sender: "Rahul Verma",
      role: "Fullstack Dev (NIT Trichy)",
      text: "Who has implemented server actions with optimistic UI in Next.js 15? Ran into an edge case with useActionState.",
      timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "R",
    },
  ],
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = podMessages[id] || [
    {
      id: "msg-welcome",
      sender: "JobMint Cohort Bot",
      role: "Study Pod Coordinator",
      text: `Welcome to the ${id} Study Pod! Use this room to coordinate mock interview times and discuss technical roadmap milestones.`,
      timestamp: "Today",
      avatar: "J",
    },
  ];

  return NextResponse.json({ messages: list });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, senderName } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    const session = await auth();
    const finalSender = session?.user?.name || senderName || "Anonymous Learner";
    const finalAvatar = (session?.user?.name?.[0] || senderName?.[0] || "U").toUpperCase();

    if (!podMessages[id]) {
      podMessages[id] = [];
    }

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: finalSender,
      role: "Pod Member",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: finalAvatar,
    };

    podMessages[id].push(newMessage);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
