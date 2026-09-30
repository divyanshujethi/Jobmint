// scripts/post-bot-manual.mjs
// Posts and pins the official Slash Commands Cheat Sheet in #welcome-and-verify and #general-dev-lounge

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const API_BASE = 'https://discord.com/api/v10';

const CHANNELS = {
  WELCOME_VERIFY: '1554956723406643332',
  DEV_LOUNGE: '1554956787851985007',
};

async function discordFetch(endpoint, method = 'GET', body = null) {
  const headers = {
    Authorization: `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord API ${method} ${endpoint} failed (${res.status}): ${err}`);
  }
  return res.json();
}

async function main() {
  console.log('Posting Slash Commands Manual to Discord channels...');

  const manualEmbed = {
    title: '⚡ Official RoleNest Bot Slash Commands Guide',
    description:
      'All candidates, mentors, and administrators can trigger our automated Virtual Labs tooling directly within Discord by typing `/` followed by the command name:',
    color: 0x6366f1,
    fields: [
      {
        name: '🔑 Onboarding & Credential Verification',
        value:
          '• **/verify `credential:<email_or_roll>`** — Link your enrollment, claim your role, and unlock your private track workspace.\n• **/status `[credential]`** — Check active internship standing, milestone streak, and credit status.\n• **/certificate `certificate_id:<id>`** — Cryptographically verify an issued AICTE certificate or digital transcript.',
        inline: false,
      },
      {
        name: '💻 Daily Standup & Lab Execution',
        value:
          '• **/sop `[day:1-28]`** — Fetch the daily Standard Operating Procedure (SOP) PDF blueprint, task checklist, and test suite requirements.\n• **/standup** — View daily standup evaluation schedule (10 AM & 6 PM IST) and PR submission guide.\n• **/audit `github_url:<url>`** — Run live commit linting, unit test checks, and anti-plagiarism verification.',
        inline: false,
      },
      {
        name: '🧩 Coding Practice & Academic Resources',
        value:
          '• **/potd** — Pull today’s industrial Problem of the Day challenge across algorithms, systems, and security.\n• **/tracks** — Browse all 30+ industrial tracks across AI, Next.js, Cloud, Cyber, and Systems.\n• **/rules** — Review official AICTE 4-credit academic regulations & code of conduct.\n• **/leaderboard** — View top-performing intern rankings and honors honor roll.',
        inline: false,
      },
      {
        name: '🆘 1-on-1 Faculty Mentorship',
        value:
          '• **/ticket** or **/helpdesk** — Launch an encrypted, private support channel with Faculty Mentors.\n• You can also head over to <#1554965055945187438> and click **Open Support Ticket** anytime.',
        inline: false,
      },
    ],
    footer: { text: 'RoleNest Virtual Labs • Discord Bot v2.0 • AICTE Practical Framework' },
    timestamp: new Date().toISOString(),
  };

  // Post to #welcome-and-verify
  const msg1 = await discordFetch(`/channels/${CHANNELS.WELCOME_VERIFY}/messages`, 'POST', {
    embeds: [manualEmbed],
  });
  console.log(`✓ Posted Slash Commands Manual to #welcome-and-verify (Msg ID: ${msg1.id})`);

  // Pin in #welcome-and-verify
  try {
    await discordFetch(`/channels/${CHANNELS.WELCOME_VERIFY}/pins/${msg1.id}`, 'PUT');
    console.log('  ✓ Pinned message in #welcome-and-verify');
  } catch (e) {
    console.warn('  ⚠️ Could not pin message (may already have max pins):', e.message);
  }

  // Post to #general-dev-lounge
  const msg2 = await discordFetch(`/channels/${CHANNELS.DEV_LOUNGE}/messages`, 'POST', {
    embeds: [manualEmbed],
  });
  console.log(`✓ Posted Slash Commands Manual to #general-dev-lounge (Msg ID: ${msg2.id})`);
}

main().catch(console.error);
