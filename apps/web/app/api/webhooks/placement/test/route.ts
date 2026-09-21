import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { webhookUrl, platform } = await req.json();

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json({ error: "Missing required 'webhookUrl' field" }, { status: 400 });
    }

    const trimmedUrl = webhookUrl.trim();

    // Prepare rich payload based on target platform
    let payload: any = {};

    if (platform === "discord" || trimmedUrl.includes("discord.com")) {
      payload = {
        username: "JobMint Placement Alerts",
        avatar_url: "https://jobmint.dev/icon-192.png",
        embeds: [
          {
            title: "🎓 New Verified Opening: Frontend Developer Intern",
            url: "https://jobmint.dev/jobs/frontend-developer-intern-abc-tech",
            description: "A new verified fresher opening has been published for your college students.",
            color: 0x10b981, // Emerald Green
            fields: [
              { name: "Company", value: "ABC Technologies", inline: true },
              { name: "Stipend", value: "₹25,000 / month", inline: true },
              { name: "Work Mode", value: "Remote", inline: true },
              { name: "Required Skills", value: "React, TypeScript, Tailwind CSS", inline: false },
              { name: "Truth Teller Status", value: "88% Review Rate • 2.1 Days Median Review", inline: false },
            ],
            footer: {
              text: "JobMint College Syndication Engine • 100% Free & Transparent",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else {
      // Slack payload
      payload = {
        text: "🎓 *New Verified Opening Alert from JobMint*:\n*Frontend Developer Intern* at *ABC Technologies*\nStipend: ₹25,000/month | Mode: Remote\nSkills: React, TypeScript, Tailwind CSS\nLink: https://jobmint.dev/jobs/frontend-developer-intern-abc-tech",
      };
    }

    const res = await fetch(trimmedUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Webhook endpoint returned HTTP ${res.status}: ${errorText.substring(0, 100)}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test alert dispatched to ${platform || "channel"} successfully!`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to dispatch test webhook" },
      { status: 500 }
    );
  }
}