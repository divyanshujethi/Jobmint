import { NextRequest, NextResponse } from "next/server";
import { setCache, getCache } from "@/lib/redis";

interface AlertSubscriptionPayload {
  channel: "WHATSAPP" | "TELEGRAM";
  target: string; // Phone number with country code (+91...) or Telegram @username
  roles: string[];
  locations: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: AlertSubscriptionPayload = await req.json();
    const { channel, target, roles, locations } = body;

    if (!target || target.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid phone number (+91) or Telegram username." },
        { status: 400 }
      );
    }

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one role track for job alerts." },
        { status: 400 }
      );
    }

    const cleanTarget = target.trim();
    const subscriptionId = `alert:${channel.toLowerCase()}:${cleanTarget.replace(/[^a-zA-Z0-9_]/g, "")}`;

    // Store subscription in Redis with 1-year retention
    await setCache(
      subscriptionId,
      {
        channel,
        target: cleanTarget,
        roles,
        locations: locations || ["ALL"],
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      365 * 24 * 60 * 60
    );

    // Dynamic join links for instant access
    const whatsappCommunityUrl = "https://chat.whatsapp.com/I9ZqQJ9WbHh21RoleNestTech";
    const telegramBotUrl = "https://t.me/RoleNestAlertsBot?start=subscribe";

    return NextResponse.json({
      success: true,
      channel,
      target: cleanTarget,
      message:
        channel === "WHATSAPP"
          ? `Subscribed ${cleanTarget} to instant WhatsApp job alerts! Click below to join the priority Role Nest WhatsApp alert stream.`
          : `Subscribed ${cleanTarget} to Telegram bot alerts! Click below to start receiving real-time role notifications.`,
      actionUrl: channel === "WHATSAPP" ? whatsappCommunityUrl : telegramBotUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to register alert subscription" },
      { status: 500 }
    );
  }
}
