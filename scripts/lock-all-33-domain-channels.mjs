// scripts/lock-all-33-domain-channels.mjs
// Creates dedicated roles for all 33 tracks and applies strict role-based channel locking
// Each channel:
// - @everyone -> DENY VIEW_CHANNEL (1024)
// - Track Role -> ALLOW VIEW_CHANNEL, SEND_MESSAGES, READ_MESSAGE_HISTORY (68608)
// - Admin, Mentor, Bot -> ALLOW 68608

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const GUILD_ID = (process.env.DISCORD_GUILD_ID || '1554952372910952460').trim();
const API_BASE = 'https://discord.com/api/v10';

const EVERYONE_ROLE_ID = GUILD_ID;
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

const TRACKS_CONFIG = [
  // 1. AI & Data
  { slug: 'ai-ml', channelName: 'ai-machine-learning', roleName: '⚡ AI / ML Specialist', color: 0x8b5cf6, existingRoleId: '1554956703743611011' },
  { slug: 'data-scientist', channelName: 'data-science-modeling', roleName: '📊 Data Scientist', color: 0x06b6d4 },
  { slug: 'prompt-engineering', channelName: 'prompt-engineering-genai', roleName: '🤖 GenAI & LLM Engineer', color: 0x10b981 },
  { slug: 'computer-vision', channelName: 'computer-vision-yolo', roleName: '👁️ Computer Vision Specialist', color: 0x6366f1 },

  // 2. Web & Mobile
  { slug: 'fullstack-nextjs', channelName: 'fullstack-web-dev', roleName: '🌐 Full-Stack Engineer', color: 0x3b82f6, existingRoleId: '1554956707166167134' },
  { slug: 'nextjs', channelName: 'nextjs-architects', roleName: '⚡ Next.js Architect', color: 0x0ea5e9, existingRoleId: '1554961437405876238' },
  { slug: 'web', channelName: 'core-browser-engineering', roleName: '🖥️ Core Browser Engineer', color: 0x14b8a6 },
  { slug: 'web-mobile-dev', channelName: 'cross-platform-mobile', roleName: '📱 Mobile Systems Engineer', color: 0xa855f7 },
  { slug: 'saas', channelName: 'production-saas-arch', roleName: '🏢 SaaS Architect', color: 0xf59e0b },

  // 3. Cyber Defense
  { slug: 'cyber-security', channelName: 'cyber-security-ops', roleName: '🛡️ Cyber Security Analyst', color: 0xef4444, existingRoleId: '1554956710978781213' },
  { slug: 'reverse-engineering', channelName: 'binary-reverse-eng', roleName: '🔍 Reverse Engineering Specialist', color: 0xb91c1c },

  // 4. Cloud & Networks
  { slug: 'sre', channelName: 'cloud-sre-devops', roleName: '☁️ Cloud / DevOps Engineer', color: 0x38bdf8, existingRoleId: '1554961442258685982' },
  { slug: 'networking', channelName: 'networking-protocols', roleName: '🌐 Network Protocol Engineer', color: 0x0284c7 },
  { slug: 'cdn-architecture', channelName: 'edge-cdn-shielding', roleName: '⚡ Edge CDN Engineer', color: 0x0369a1 },
  { slug: 'edge-computing', channelName: 'serverless-wasm-edge', roleName: '🚀 Serverless WASM Engineer', color: 0x7c3aed },

  // 5. Databases & Distributed Systems
  { slug: 'database-management', channelName: 'database-storage-engines', roleName: '💾 Database Storage Engineer', color: 0x64748b },
  { slug: 'sql', channelName: 'advanced-sql-postgres', roleName: '🐘 PostgreSQL Architect', color: 0x334155 },
  { slug: 'distributed-systems', channelName: 'distributed-systems-raft', roleName: '🔄 Distributed Systems Engineer', color: 0x475569 },
  { slug: 'compiler-tooling', channelName: 'compiler-bytecode-vms', roleName: '⚙️ Compiler & VM Engineer', color: 0x78716c },
  { slug: 'system-design', channelName: 'large-scale-system-design', roleName: '🏗️ Systems Architect', color: 0xd97706 },

  // 6. 3D Graphics, Web3 & HealthTech
  { slug: 'blockchain', channelName: 'blockchain-web3', roleName: '⛓️ Blockchain / Web3 Engineer', color: 0xf59e0b, existingRoleId: '1554961447140724898' },
  { slug: 'game-development', channelName: 'game-dev-physics-3d', roleName: '🎮 3D Game Engine Developer', color: 0xec4899 },
  { slug: 'web-game-dev', channelName: 'webgl-threejs-multiplayer', roleName: '🕹️ WebGL & Multiplayer Dev', color: 0xf43f5e },
  { slug: 'graphics-engineering', channelName: 'shaders-glsl-vulkan', roleName: '🎨 Graphics & Shaders Dev', color: 0xe11d48 },
  { slug: 'health-tech', channelName: 'healthtech-fhir-protocols', roleName: '🏥 HealthTech Systems Engineer', color: 0x10b981 },

  // 7. Foundational Tools & Languages
  { slug: 'developer-sandbox', channelName: 'developer-sandbox', roleName: '🚀 Sandbox Testing Cohort', color: 0xa855f7, existingRoleId: '1554956696588390492' },
  { slug: 'git', channelName: 'git-internals-plumbing', roleName: '🐙 Git Internals Specialist', color: 0xf97316 },
  { slug: 'python-automation', channelName: 'python-automation-fullstack', roleName: '🐍 Python Automation Engineer', color: 0x22c55e },
  { slug: 'enterprise-java', channelName: 'enterprise-java-spring', roleName: '☕ Enterprise Java Engineer', color: 0xb45309 },
  { slug: 'ts-js', channelName: 'typescript-v8-internals', roleName: '📐 TypeScript & V8 Specialist', color: 0x3b82f6 },
  { slug: 'automation', channelName: 'qa-playwright-automation', roleName: '🧪 QA Automation Engineer', color: 0x84cc16 },
  { slug: 'seo', channelName: 'technical-seo-performance', roleName: '⚡ Web Performance & SEO Eng', color: 0xeab308 },
  { slug: 'developer-tooling', channelName: 'developer-cli-tooling', roleName: '🛠️ Developer Tooling Architect', color: 0x6b7280 },
];

async function main() {
  console.log('🔒 Starting Role-Based Channel Locking for all 33 Industrial Tracks...\n');

  // Fetch current roles
  const existingRoles = await discordFetch(`/guilds/${GUILD_ID}/roles`);
  console.log(`Found ${existingRoles.length} existing roles in Discord.`);

  // Fetch all channels
  const channels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  console.log(`Found ${channels.length} channels in Discord.\n`);

  const roleMap = {};

  for (const track of TRACKS_CONFIG) {
    let roleId = track.existingRoleId;

    if (!roleId) {
      // Find role by name
      const found = existingRoles.find(
        (r) => r.name.toLowerCase() === track.roleName.toLowerCase() || r.name.includes(track.channelName)
      );
      if (found) {
        roleId = found.id;
      } else {
        // Create role
        const createdRole = await discordFetch(`/guilds/${GUILD_ID}/roles`, 'POST', {
          name: track.roleName,
          color: track.color || 0x3b82f6,
          hoist: false,
          mentionable: true,
        });
        roleId = createdRole.id;
        console.log(`✨ Created Role: "${track.roleName}" (${roleId})`);
      }
    }

    roleMap[track.slug] = {
      roleId,
      roleName: track.roleName,
      channelName: track.channelName,
    };

    // Find the channel
    const ch = channels.find((c) => c.name === track.channelName && c.type === 0);
    if (!ch) {
      console.warn(`⚠️ Channel not found: #${track.channelName}`);
      continue;
    }

    console.log(`🔒 Applying strict lock on #${track.channelName} -> Role: "${track.roleName}" (${roleId})...`);

    const permission_overwrites = [
      {
        id: EVERYONE_ROLE_ID,
        type: 0, // role
        deny: '1024', // DENY VIEW_CHANNEL
        allow: '0',
      },
      {
        id: roleId,
        type: 0,
        allow: '68608', // VIEW_CHANNEL | SEND_MESSAGES | READ_MESSAGE_HISTORY
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

    await discordFetch(`/channels/${ch.id}`, 'PATCH', {
      permission_overwrites,
    });
    console.log(`  ✓ #${track.channelName} is now LOCKED 🔒 to @${track.roleName}!`);
  }

  console.log('\n=========================================');
  console.log('✅ ALL 33 DOMAIN CHANNELS LOCKED BY ROLE!');
  console.log('=========================================\n');

  // Print generated JSON map for copying into web app
  console.log('const TRACK_DISCORD_ROLE_MAP =', JSON.stringify(roleMap, null, 2));
}

main().catch(console.error);
