import { NextRequest, NextResponse } from "next/server";
import { getLiveJobs } from "@/lib/db-jobs";

export async function POST(req: NextRequest) {
  try {
    const { webhookUrl, platform } = await req.json();

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json({ error: "Missing required 'webhookUrl' field" }, { status: 400 });
    }

    const trimmedUrl = webhookUrl.trim();
    const liveJobs = await getLiveJobs();
    const sampleJob = liveJobs[0] || {
      title: "Full-Stack Software Engineer",
      companyName: "ABC Technologies",
      slug: "full-stack-software-engineer-abc-tech",
      salaryOrStipend: "₹35,000 / month",
      workMode: "Remote",
      skills: ["Next.js", "TypeScript", "PostgreSQL"],
      truthTeller: { reviewRate: 91, medianFirstReviewDays: 1.9 },
    };

    const baseUrl = process.env.NEXTAUTH_URL || "https://rolenest.in";

    // Prepare rich payload based on target platform
    let payload: any = {};

    if (platform === "discord" || trimmedUrl.includes("discord.com")) {
      payload = {
        username: "Role Nest Placement Alerts",
        avatar_url: `${baseUrl}/icon-192.png`,
        embeds: [
          {
            title: `🎓 New Verified Opening: ${sampleJob.title}`,
            url: `${baseUrl}/jobs/${sampleJob.slug}`,
            description: "A new verified fresher opening has been published for your college students.",
            color: 0x10b981, // Emerald Green
            fields: [
              { name: "Company", value: sampleJob.companyName, inline: true },
              { name: "Compensation", value: sampleJob.salaryOrStipend, inline: true },
              { name: "Work Mode", value: sampleJob.workMode, inline: true },
              { name: "Required Skills", value: sampleJob.skills.slice(0, 4).join(", "), inline: false },
              { name: "Truth Teller Status", value: `${sampleJob.truthTeller.reviewRate}% Review Rate • ${sampleJob.truthTeller.medianFirstReviewDays} Days Median Review`, inline: false },
            ],
            footer: {
              text: "Role Nest College Syndication Engine • 100% Free & Transparent",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else {
      // Slack payload
      payload = {
        text: `🎓 *New Verified Opening Alert from Role Nest*:\n*${sampleJob.title}* at *${sampleJob.companyName}*\nCompensation: ${sampleJob.salaryOrStipend} | Mode: ${sampleJob.workMode}\nSkills: ${sampleJob.skills.slice(0, 4).join(", ")}\nLink: ${baseUrl}/jobs/${sampleJob.slug}`,
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