import { NextRequest, NextResponse } from "next/server";
import { DISCORD_CHANNELS, DISCORD_ROLES, sendDiscordMessage } from "@/lib/discord-notifications";

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || (new Date().getUTCHours() < 12 ? "morning" : "evening");

    if (mode === "morning") {
      const morningEmbed = {
        title: "☀️ 10:00 AM IST Industrial Standup: Day Lab Workspaces Unlocked",
        description: `Good morning engineers! Today's practical engineering laboratories are active on [internship.rolenest.in/portal](https://internship.rolenest.in/portal).`,
        color: 0x10b981,
        fields: [
          {
            name: "🎯 Today's 4-Phase Engineering Protocol",
            value:
              "1. **Architecture Canvas:** Simulate traffic flows & wire backend nodes.\n2. **Study Guide:** Review industrial constraints & line-by-line syntax.\n3. **In-Browser Arena:** Pass automated test assertions.\n4. **GitHub Push:** Push feature branch & run our live CI auditor.",
            inline: false,
          },
          {
            name: "💬 Drop Your Standup Notes Below",
            value:
              "Share what track you are working on today and what problem you are tackling!",
            inline: false,
          },
        ],
        footer: { text: "RoleNest Virtual Labs • AICTE / UGC 4-Credit Practical Framework" },
        timestamp: new Date().toISOString(),
      };

      await sendDiscordMessage(DISCORD_CHANNELS.DAILY_STANDUP, {
        content: `<@&${DISCORD_ROLES.VERIFIED_INTERN}> <@&${DISCORD_ROLES.SANDBOX_COHORT}> ☀️ Morning Standup is live!`,
        embeds: [morningEmbed],
      });

      return NextResponse.json({ success: true, mode: "morning", deliveredTo: "#daily-standup-deliverables" });
    }

    // Evening Reminder
    const eveningEmbed = {
      title: "🌙 06:00 PM IST Evening Code Audit & Streak Check",
      description: "Wrapping up your engineering day? Don't forget to sync your deliverables before midnight!",
      color: 0x8b5cf6,
      fields: [
        {
          name: "📦 Deliverable Checklist",
          value:
            "• Public GitHub commit pushed?\n• Live auditor verified with green checkmark?\n• AICTE academic ledger updated?",
          inline: false,
        },
        {
          name: "🛠️ Need Debugging Help?",
          value:
            "Head over to <#code-troubleshooting> to peer-review test failures or discuss architectural trade-offs.",
          inline: false,
        },
      ],
      footer: { text: "RoleNest Virtual Labs • Daily Sync" },
      timestamp: new Date().toISOString(),
    };

    await sendDiscordMessage(DISCORD_CHANNELS.DAILY_STANDUP, {
      content: `<@&${DISCORD_ROLES.VERIFIED_INTERN}> 🌙 Evening code review reminder!`,
      embeds: [eveningEmbed],
    });

    return NextResponse.json({ success: true, mode: "evening", deliveredTo: "#daily-standup-deliverables" });
  } catch (error: any) {
    console.error("Discord standup cron error:", error);
    return NextResponse.json({ error: error.message || "Cron execution failed" }, { status: 500 });
  }
}
