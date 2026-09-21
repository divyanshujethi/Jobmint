"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rss,
  Send,
  Check,
  Copy,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { APP_CONFIG } from "@repo/shared";

export default function PlacementPortalPage() {
  const [copiedRss, setCopiedRss] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [platform, setPlatform] = useState<"discord" | "slack">("discord");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const rssFeedUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/feed/rss`
    : "http://localhost:3000/api/feed/rss";

  const copyRss = () => {
    navigator.clipboard.writeText(rssFeedUrl);
    setCopiedRss(true);
    setTimeout(() => setCopiedRss(false), 2000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/webhooks/placement/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl, platform }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch webhook");
      }

      setSendResult({ success: true, message: data.message });
    } catch (err: any) {
      setSendResult({ success: false, error: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
              <Link href="/jobs" className="hover:text-emerald-400">JobMint</Link>
              <span>/</span>
              <span className="text-neutral-200">Placement Syndication</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-emerald-400" />
              College Placement Cell Syndication Portal
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Syndicate verified fresher jobs and paid internships directly to your student community via RSS feeds, Discord bots, and Slack webhooks.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 text-emerald-400 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free Campus Tool</span>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Anti-Ghosting Campus Guarantee: </span>
            Every job syndicated through this portal is vetted for student fairness. If an employer fails to review applicant resumes within 7 days, they are automatically flagged on the Truth Teller engine.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Module 1: Public RSS Feed */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                <Rss className="w-4 h-4" />
                <span>OPTION 1: RSS 2.0 XML FEED</span>
              </div>

              <h2 className="text-lg font-bold text-white">
                Universal Live Job Feed
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect our verified RSS feed to college intranets, Telegram bots, or RSS readers like Feedly, Inoreader, or Zapier. Updates every time a new verified role is published.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 font-mono">
                  Your Public RSS Feed URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={rssFeedUrl}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-300 select-all"
                  />
                  <button
                    onClick={copyRss}
                    className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs transition-colors shrink-0"
                    title="Copy RSS Feed Link"
                  >
                    {copiedRss ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Free Telegram Bot integration tip */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  Telegram Group Setup (Takes 60 Seconds):
                </div>
                <ol className="text-neutral-400 space-y-1 list-decimal list-inside text-[11px] leading-relaxed">
                  <li>Create or open your college student Telegram group.</li>
                  <li>Add a free RSS bot like <code className="text-emerald-400">@FeedManBot</code>.</li>
                  <li>Send command: <code className="text-emerald-400">/add {rssFeedUrl}</code></li>
                  <li>Students now receive new verified openings instantly!</li>
                </ol>
              </div>
            </div>

            <a
              href="/api/feed/rss"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Raw RSS XML Feed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Module 2: Discord & Slack Webhook Dispatcher */}
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                <Send className="w-4 h-4" />
                <span>OPTION 2: DISCORD & SLACK WEBHOOKS</span>
              </div>

              <h2 className="text-lg font-bold text-white">
                Real-Time Webhook Bot
              </h2>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Send rich alerts with stipends, verified employer badges, and skills directly into your college student Discord server or Slack workspace.
              </p>

              {/* Platform selector */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform("discord")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                    platform === "discord"
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                  }`}
                >
                  Discord Webhook
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("slack")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
                    platform === "slack"
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                  }`}
                >
                  Slack Webhook
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 font-mono">
                  {platform === "discord" ? "Discord Channel Webhook URL:" : "Slack Incoming Webhook URL:"}
                </label>
                <input
                  type="url"
                  placeholder={
                    platform === "discord"
                      ? "https://discord.com/api/webhooks/..."
                      : "https://hooks.slack.com/services/..."
                  }
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {sendResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
                    sendResult.success
                      ? "bg-emerald-950/50 border-emerald-800 text-emerald-300"
                      : "bg-red-950/50 border-red-800 text-red-300"
                  }`}
                >
                  {sendResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {sendResult.success ? sendResult.message : sendResult.error}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleTestWebhook}
              disabled={sending || !webhookUrl.trim()}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching Test Embed...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Send Live Test Job Alert to {platform === "discord" ? "Discord" : "Slack"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}