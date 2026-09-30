import { NextRequest, NextResponse } from "next/server";
import { DISCORD_CHANNELS, sendDiscordMessage } from "@/lib/discord-notifications";

export async function GET() {
  return NextResponse.json({
    status: "active",
    instructions: {
      description: "GitHub Webhook Receiver for RitualDev-Lab/DevShelf",
      webhookUrl: "https://internship.rolenest.in/api/webhooks/github-devshelf",
      contentType: "application/json",
      recommendedEvents: ["Pull requests", "Pushes", "Issues"],
      targetDiscordChannel: "#devshelf-open-source-pr (ID: 1554956772635189270)",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get("x-github-event");
    const body = await req.json();

    // 1. PULL REQUEST EVENTS (Crucial for intern milestone)
    if (event === "pull_request") {
      const action = body.action; // opened, closed, reopened
      const pr = body.pull_request;
      const repo = body.repository;
      const sender = body.sender;

      if (!pr) return NextResponse.json({ received: true });

      const isMerged = action === "closed" && pr.merged;

      const embed = {
        title: isMerged
          ? `🎉 PULL REQUEST MERGED: ${repo.full_name}`
          : `🌟 New PR ${action.toUpperCase()}: #${pr.number} ${pr.title}`,
        url: pr.html_url,
        description: pr.body ? pr.body.slice(0, 200) + (pr.body.length > 200 ? "..." : "") : "No description provided.",
        color: isMerged ? 0x10b981 : 0x8b5cf6,
        fields: [
          { name: "Author", value: `[@${sender.login}](${sender.html_url})`, inline: true },
          { name: "Branch", value: `\`${pr.head.ref}\` ➔ \`${pr.base.ref}\``, inline: true },
          { name: "Changes", value: `+${pr.additions || 0} / -${pr.deletions || 0} lines (${pr.changed_files || 0} files)`, inline: true },
          {
            name: "Milestone Status",
            value: isMerged
              ? "✅ **ACCEPTED & MERGED!** This intern has completed their mandatory open-source contribution milestone."
              : "⏳ **Pending Review:** Mentors & peers, please review this PR!",
            inline: false,
          },
        ],
        footer: { text: "RoleNest Open Source Accelerator • RitualDev-Lab/DevShelf" },
        timestamp: new Date().toISOString(),
      };

      await sendDiscordMessage(DISCORD_CHANNELS.DEVSHELF_PR, { embeds: [embed] });
      return NextResponse.json({ success: true, processed: "pull_request" });
    }

    // 2. PUSH EVENTS
    if (event === "push") {
      const commits = body.commits || [];
      const repo = body.repository;
      const sender = body.sender;

      if (commits.length === 0) return NextResponse.json({ received: true });

      const commitList = commits
        .slice(0, 3)
        .map((c: any) => `• [\`${c.id.substring(0, 7)}\`](${c.url}) ${c.message.split("\n")[0]}`)
        .join("\n");

      const embed = {
        title: `🔨 Push to ${repo.full_name} (${body.ref.replace("refs/heads/", "")})`,
        url: body.compare,
        description: commitList,
        color: 0x3b82f6,
        fields: [
          { name: "Author", value: sender.login, inline: true },
          { name: "Commits", value: `${commits.length} new commit(s)`, inline: true },
        ],
        footer: { text: "RoleNest Git Watcher" },
        timestamp: new Date().toISOString(),
      };

      await sendDiscordMessage(DISCORD_CHANNELS.DEVSHELF_PR, { embeds: [embed] });
      return NextResponse.json({ success: true, processed: "push" });
    }

    return NextResponse.json({ received: true, ignoredEvent: event });
  } catch (error: any) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
