import { NextRequest, NextResponse } from "next/server";
import { getCache } from "@/lib/redis";

export const dynamic = "force-dynamic";

interface BroadcastJobPayload {
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  slug: string;
  skills?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: BroadcastJobPayload = await req.json();
    const { title, companyName, location, slug, salaryMin, salaryMax } = body;

    if (!title || !companyName) {
      return NextResponse.json({ error: "Job title and company name are required" }, { status: 400 });
    }

    const jobUrl = `https://rolenest.in/jobs/${slug || "browse"}`;
    const salaryText = salaryMin && salaryMax ? `💰 ₹${salaryMin} - ₹${salaryMax} LPA` : "💰 Competitive CTC";

    const formattedTelegramMessage = `🚀 *NEW ROLE ALERT on Role Nest*\n\n💼 *${title}*\n🏢 *${companyName}*\n📍 ${location || "Remote"}\n${salaryText}\n\n⚡ *Zero-Ghosting Direct ATS Bypass:*\n🔗 [Apply Directly on Role Nest](${jobUrl})`;

    const formattedWhatsAppMessage = `🚀 *NEW TECH ROLE ON ROLE NEST*\n\n*${title}* @ *${companyName}*\n📍 ${location || "Remote"}\n${salaryText}\n\nApply with Verified DevScore:\n👉 ${jobUrl}`;

    // If TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are present, dispatch to live Telegram Channel
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID || "@RoleNestAlerts";
    let telegramDispatched = false;

    if (botToken) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: channelId,
            text: formattedTelegramMessage,
            parse_mode: "Markdown",
            disable_web_page_preview: false,
          }),
        });
        telegramDispatched = tgRes.ok;
      } catch (tgErr) {
        console.warn("Telegram dispatch notice:", tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      jobTitle: title,
      companyName,
      telegram: {
        dispatched: telegramDispatched,
        previewText: formattedTelegramMessage,
      },
      whatsapp: {
        ready: true,
        previewText: formattedWhatsAppMessage,
        communityUrl: "https://chat.whatsapp.com/I9ZqQJ9WbHh21RoleNestTech",
      },
    });
  } catch (err: any) {
    console.error("Broadcast alert error:", err);
    return NextResponse.json({ error: err.message || "Failed to broadcast alert" }, { status: 500 });
  }
}
