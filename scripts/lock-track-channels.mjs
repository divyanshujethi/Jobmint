// scripts/lock-track-channels.mjs
// Locks all course/track channels to only students enrolled in that specific track

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const GUILD_ID = '1554952372910952460';
const API_BASE = 'https://discord.com/api/v10';

const EVERYONE_ROLE_ID = '1554952372910952460';
const ADMIN_ROLE_ID = '1554960532992434260';
const MENTOR_ROLE_ID = '1554956689709605004';
const BOT_ROLE_ID = '1554956632830644349';

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

async function getOrCreateRole(name, color) {
  const roles = await discordFetch(`/guilds/${GUILD_ID}/roles`);
  const found = roles.find((r) => r.name.toLowerCase() === name.toLowerCase());
  if (found) return found.id;

  const created = await discordFetch(`/guilds/${GUILD_ID}/roles`, 'POST', {
    name,
    color,
    hoist: false,
  });
  console.log(`Created Role: ${name} (${created.id})`);
  return created.id;
}

async function main() {
  console.log('Setting up Role-Based Course Channel Access...');

  // 1. Get or create all specific track roles
  const aimlRoleId = '1554956703743611011'; // ⚡ AI / ML Specialist
  const fullstackRoleId = '1554956707166167134'; // 🌐 Full-Stack Engineer
  const cyberRoleId = '1554956710978781213'; // 🛡️ Cyber Security Analyst
  const sandboxRoleId = '1554956696588390492'; // 🚀 Sandbox Testing Cohort

  const nextjsRoleId = await getOrCreateRole('⚡ Next.js Architect', 0x38bdf8);
  const cloudRoleId = await getOrCreateRole('☁️ Cloud / DevOps Engineer', 0x3b82f6);
  const web3RoleId = await getOrCreateRole('⛓️ Blockchain / Web3 Engineer', 0xf59e0b);

  const TRACK_MAPPINGS = [
    {
      channelId: '1554956738481094718', // ai-machine-learning
      channelName: 'ai-machine-learning',
      roleId: aimlRoleId,
      roleName: 'AI / ML Specialist',
    },
    {
      channelId: '1554956742096453633', // fullstack-web-dev
      channelName: 'fullstack-web-dev',
      roleId: fullstackRoleId,
      roleName: 'Full-Stack Engineer',
    },
    {
      channelId: '1554956745627926639', // nextjs-architects
      channelName: 'nextjs-architects',
      roleId: nextjsRoleId,
      roleName: 'Next.js Architect',
    },
    {
      channelId: '1554956749864177674', // cyber-security-ops
      channelName: 'cyber-security-ops',
      roleId: cyberRoleId,
      roleName: 'Cyber Security Analyst',
    },
    {
      channelId: '1554956754025058344', // cloud-sre-devops
      channelName: 'cloud-sre-devops',
      roleId: cloudRoleId,
      roleName: 'Cloud / DevOps Engineer',
    },
    {
      channelId: '1554956757783290070', // blockchain-web3
      channelName: 'blockchain-web3',
      roleId: web3RoleId,
      roleName: 'Blockchain / Web3 Engineer',
    },
    {
      channelId: '1554956761457361010', // developer-sandbox
      channelName: 'developer-sandbox',
      roleId: sandboxRoleId,
      roleName: 'Sandbox Testing Cohort',
    },
  ];

  for (const track of TRACK_MAPPINGS) {
    console.log(`Locking #${track.channelName} to @${track.roleName}...`);

    // Permissions:
    // @everyone -> DENY VIEW_CHANNEL (1024)
    // trackRole -> ALLOW VIEW_CHANNEL (1024) | SEND_MESSAGES (2048) | READ_MESSAGE_HISTORY (65536) = 68608
    // ADMIN_ROLE_ID -> ALLOW 68608
    // MENTOR_ROLE_ID -> ALLOW 68608
    // BOT_ROLE_ID -> ALLOW 68608

    const permission_overwrites = [
      {
        id: EVERYONE_ROLE_ID,
        type: 0, // role
        deny: '1024',
        allow: '0',
      },
      {
        id: track.roleId,
        type: 0,
        allow: '68608',
        deny: '0',
      },
      {
        id: ADMIN_ROLE_ID,
        type: 0,
        allow: '68608',
        deny: '0',
      },
      {
        id: MENTOR_ROLE_ID,
        type: 0,
        allow: '68608',
        deny: '0',
      },
      {
        id: BOT_ROLE_ID,
        type: 0,
        allow: '68608',
        deny: '0',
      },
    ];

    await discordFetch(`/channels/${track.channelId}`, 'PATCH', {
      permission_overwrites,
    });
    console.log(`  ✓ #${track.channelName} is now PRIVATE to @${track.roleName}!`);
  }

  console.log('\n🔒 All course channels successfully locked with role-based access control!');
}

main().catch(console.error);
