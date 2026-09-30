// scripts/register-slash-commands.mjs
// Registers Discord Slash Commands directly for the RoleNest Guild

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const CLIENT_ID = '1554955237897408652';
const GUILD_ID = '1554952372910952460';
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
