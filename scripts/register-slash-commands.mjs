// scripts/register-slash-commands.mjs
// Registers Discord Slash Commands directly for the RoleNest Guild

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const CLIENT_ID = (process.env.DISCORD_CLIENT_ID || '1554955237897408652').trim();
const GUILD_ID = (process.env.DISCORD_GUILD_ID || '1554952372910952460').trim();
const API_BASE = 'https://discord.com/api/v10';

const COMMANDS = [
  {
    name: 'verify',
    description: 'Verify your student enrollment & unlock your private industrial track channel',
    options: [
      {
        name: 'credential',
        description: 'Your registered Email, College Roll Number, or Appointment Letter Ref (e.g. RN-AP-2026-...)',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'status',
    description: 'Check your active internship progress, current milestone day, and credit status',
    options: [
      {
        name: 'credential',
        description: 'Optional: Your registered Email or Roll Number',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'standup',
    description: 'View daily standup deliverable instructions and SOP links',
  },
  {
    name: 'rules',
    description: 'View official RoleNest AICTE academic regulations & code of conduct',
  },
  {
    name: 'helpdesk',
    description: 'Request assistance from Faculty Mentors or report a technical lab blocker',
  },
  {
    name: 'potd',
    description: 'Fetch today\'s Problem of the Day (POTD) challenge across industrial domains',
  },
  {
    name: 'ticket',
    description: 'Launch a private 1-on-1 support ticket session with Faculty Mentors',
  },
  {
    name: 'tracks',
    description: 'Explore all 30+ industrial tracks across AI, Next.js, Cyber, Cloud, and Systems',
  },
  {
    name: 'sop',
    description: 'Retrieve the Daily SOP (Standard Operating Procedure) & task blueprint for any day (1-28)',
    options: [
      {
        name: 'day',
        description: 'The day number (1 to 28) you need the SOP blueprint for',
        type: 4, // INTEGER
        required: false,
        min_value: 1,
        max_value: 28,
      },
    ],
  },
  {
    name: 'audit',
    description: 'Run automated AICTE code audit verification on a GitHub repository or commit',
    options: [
      {
        name: 'github_url',
        description: 'GitHub repository or commit/PR URL to audit',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'certificate',
    description: 'Look up and verify an issued AICTE Internship Certificate or digital transcript',
    options: [
      {
        name: 'certificate_id',
        description: 'Certificate ID (e.g. RN-CERT-2026-...) or Offer Ref',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'leaderboard',
    description: 'View top performing interns and code audit honor roll across cohorts',
  },
  {
    name: 'ask',
    description: 'Ask AI Coding Mentor for instant debugging, code fixes, and architecture guidance',
    options: [
      {
        name: 'query',
        description: 'Describe the bug, error stack trace, or architectural question',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'myprogress',
    description: 'View your visual milestone progress bar, audit scores, and graduation status',
    options: [
      {
        name: 'credential',
        description: 'Optional: Candidate Email or Roll Number (defaults to linked account)',
        type: 3,
        required: false,
      },
    ],
  },
];

async function main() {
  console.log(`Registering ${COMMANDS.length} Slash Commands for Guild ${GUILD_ID}...`);

  const res = await fetch(`${API_BASE}/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands`, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(COMMANDS),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to register commands (${res.status}): ${err}`);
  }

  const registered = await res.json();
  console.log(`✓ Successfully registered ${registered.length} Slash Commands:`);
  for (const cmd of registered) {
    console.log(`  - /${cmd.name}: ${cmd.description} (ID: ${cmd.id})`);
  }
}

main().catch(console.error);
