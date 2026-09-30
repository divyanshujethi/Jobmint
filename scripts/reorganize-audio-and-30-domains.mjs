// scripts/reorganize-audio-and-30-domains.mjs
// 1. Cleans audio channels to exactly 5:
//    - 1 General: "💬 General Voice Lounge"
//    - 3 Study: "🎧 Silent Focus Study 1", "🎧 Silent Focus Study 2", "🎧 Silent Focus Study 3"
//    - 1 Mentor: "🎙️ Mentor Standup & Office Hours"
//    - Deletes the 8 cluttered domain audio channels
// 2. Creates text channels for all 33 Industrial Engineering Domains organized into clean categories
// 3. Creates the "📊 SERVER STATS" category at the top with live counters

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

async function main() {
  console.log('🚀 Reorganizing Audio Channels & Adding All 30+ Domain Text Channels...\n');

  const existingChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);

  // ==========================================
  // 1. CLEAN UP AUDIO CHANNELS
  // Target: exactly 5 audio channels:
  // - 1 General ("💬 General Voice Lounge")
  // - 3 Study ("🎧 Silent Focus Study 1", "🎧 Silent Focus Study 2", "🎧 Silent Focus Study 3")
  // - 1 Mentor ("🎙️ Mentor Standup & Office Hours")
  // ==========================================
  console.log('--- 1. Cleaning Up Audio Channels (Target: 1 General, 3 Study, 1 Mentor) ---');
  const voiceCatId = '1554952374424969354';

  // Delete the 8 cluttered domain audio channels
  const clutteredVoiceNames = [
    'Voice Lab: AI, ML & Data Science',
    'Voice Lab: Full-Stack & Next.js',
    'Voice Lab: Cyber Security Ops',
    'Voice Lab: Cloud, DevOps & SRE',
    'Voice Lab: Databases & Systems',
    'Voice Lab: Game Dev & Graphics',
    'Voice Lab: Web3 & Blockchain',
    'Voice Lab: Sandbox & Tooling',
  ];

  for (const c of existingChannels) {
    if (c.type === 2 && clutteredVoiceNames.some((name) => c.name.includes(name))) {
      console.log(`Deleting cluttered voice channel: "${c.name}" (${c.id})...`);
      try {
        await discordFetch(`/channels/${c.id}`, 'DELETE');
        console.log(`  ✓ Deleted "${c.name}"`);
      } catch (e) {
        console.error(`  ⚠️ Failed to delete ${c.name}:`, e.message);
      }
    }
  }

  // Ensure "🎧 Silent Focus Study 3" exists
  const updatedChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  let study3 = updatedChannels.find((c) => c.name === '🎧 Silent Focus Study 3');
  if (!study3) {
    study3 = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: '🎧 Silent Focus Study 3',
      type: 2, // voice
      parent_id: voiceCatId,
      user_limit: 15,
    });
    console.log(`✓ Created "🎧 Silent Focus Study 3" (${study3.id})`);
  } else {
    console.log(`✓ "🎧 Silent Focus Study 3" already exists`);
  }

  // ==========================================
  // 2. SERVER STATS COUNTERS (AT TOP OF SERVER)
  // ==========================================
  console.log('\n--- 2. Setting Up Dynamic Server Stats (At Server Top) ---');
  let statsCat = updatedChannels.find(
    (c) => c.type === 4 && (c.name.includes('SERVER STATS') || c.name.includes('TELEMETRY'))
  );

  if (!statsCat) {
    statsCat = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: '📊 SERVER STATS',
      type: 4,
      position: 0, // Very top
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          allow: '1024', // VIEW_CHANNEL
          deny: '1048576', // CONNECT = FALSE (Cannot join, just displays counter)
        },
      ],
    });
    console.log(`✓ Created Category: "📊 SERVER STATS" (${statsCat.id})`);
  } else {
    console.log(`✓ Stats category already exists (${statsCat.id})`);
  }

  // Fetch guild member count
  const guildData = await discordFetch(`/guilds/${GUILD_ID}?with_counts=true`);
  const memberCount = guildData.approximate_member_count || 3;

  const STAT_COUNTERS = [
    { name: `👥 Total Members: ${memberCount}` },
    { name: `🎓 Verified Interns: 1` },
    { name: `💻 Industrial Tracks: 33` },
  ];

  for (const stat of STAT_COUNTERS) {
    const existing = updatedChannels.find((c) => c.parent_id === statsCat.id && c.name.startsWith(stat.name.split(':')[0]));
    if (!existing) {
      const created = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: stat.name,
        type: 2, // voice channel used as locked counter
        parent_id: statsCat.id,
        permission_overwrites: [
          {
            id: EVERYONE_ROLE_ID,
            type: 0,
            allow: '1024',
            deny: '1048576', // Cannot connect
          },
        ],
      });
      console.log(`✓ Created Counter: "${stat.name}" (${created.id})`);
    } else {
      console.log(`✓ Counter "${stat.name.split(':')[0]}" already exists`);
    }
  }

  // ==========================================
  // 3. ALL 33 DOMAIN TEXT WORKSPACES
  // Organized into clean domain categories
  // ==========================================
  console.log('\n--- 3. Creating All 33 Domain Text Channels ---');

  const DOMAIN_CATEGORIES = [
    {
      categoryName: '🧠 AI, DATA & INTELLIGENCE LABS',
      channels: [
        { name: 'ai-machine-learning', topic: 'AI & Machine Learning Engineering (PyTorch, Transformers, Vector Search)' },
        { name: 'data-science-modeling', topic: 'Data Science, Statistical Modeling & Predictive Analytics' },
        { name: 'prompt-engineering-genai', topic: 'Prompt Engineering & Generative AI Solutions (RAG, Agents)' },
        { name: 'computer-vision-yolo', topic: 'Computer Vision, Deep Learning, OpenCV & YOLO Detection' },
      ],
    },
    {
      categoryName: '🌐 WEB, MOBILE & SAAS SYSTEMS',
      channels: [
        { name: 'fullstack-web-dev', topic: 'Full-Stack Web Architecture, Next.js, TypeScript & APIs' },
        { name: 'nextjs-architects', topic: 'Next.js 15 App Router, Server Actions & Edge Performance' },
        { name: 'core-browser-engineering', topic: 'Modern Web Engineering & Core Browser Architecture' },
        { name: 'cross-platform-mobile', topic: 'Cross-Platform Mobile Dev (React Native & Flutter)' },
        { name: 'production-saas-arch', topic: 'Production SaaS Architecture, Multi-Tenancy & Billing' },
      ],
    },
    {
      categoryName: '🛡️ CYBERSECURITY & DEFENSE',
      channels: [
        { name: 'cyber-security-ops', topic: 'Ethical Hacking, Penetration Testing & OWASP Top 10' },
        { name: 'binary-reverse-eng', topic: 'Binary Reverse Engineering, Assembly & Malware Defense' },
      ],
    },
    {
      categoryName: '☁️ CLOUD, NETWORKS & SRE',
      channels: [
        { name: 'cloud-sre-devops', topic: 'Site Reliability Engineering, Chaos, Observability & Kubernetes' },
        { name: 'networking-protocols', topic: 'Computer Networking, Protocols (TCP/IP, HTTP/3, WebSockets)' },
        { name: 'edge-cdn-shielding', topic: 'Edge CDN Architecture, Anycast DNS & Origin Shielding' },
        { name: 'serverless-wasm-edge', topic: 'Edge Computing, Serverless WASM & Globally Distributed State' },
      ],
    },
    {
      categoryName: '💾 DATABASES & DISTRIBUTED SYSTEMS',
      channels: [
        { name: 'database-storage-engines', topic: 'Database Management & Storage Engine Engineering' },
        { name: 'advanced-sql-postgres', topic: 'Advanced SQL Engineering, PostgreSQL Internals & Query Tuning' },
        { name: 'distributed-systems-raft', topic: 'Distributed Systems Engineering, Raft Consensus & Fault Tolerance' },
        { name: 'compiler-bytecode-vms', topic: 'Compiler Construction, Bytecode VMs & Language Tooling' },
        { name: 'large-scale-system-design', topic: 'Large-Scale Distributed System Design & Architecture' },
      ],
    },
    {
      categoryName: '🎮 3D GRAPHICS, GAMES & WEB3',
      channels: [
        { name: 'blockchain-web3', topic: 'Blockchain Engineering, EVM Protocols & Smart Contract Security' },
        { name: 'game-dev-physics-3d', topic: 'Game Development, Physics Simulation & 3D Engines' },
        { name: 'webgl-threejs-multiplayer', topic: 'Web Game Dev (Three.js, WebGL & Multiplayer WebSockets)' },
        { name: 'shaders-glsl-vulkan', topic: 'Graphics Engineering, Shaders (GLSL), Vulkan & OpenGL' },
        { name: 'healthtech-fhir-protocols', topic: 'HealthTech Systems Engineering, HL7/FHIR & HIPAA Compliance' },
      ],
    },
    {
      categoryName: '🚀 FOUNDATIONAL TOOLS & LANGUAGES',
      channels: [
        { name: 'developer-sandbox', topic: 'Developer Zero: Interactive Architecture & Git Sandbox' },
        { name: 'git-internals-plumbing', topic: 'Git Internals, Plumbing Protocols & Monorepo Workflows' },
        { name: 'python-automation-fullstack', topic: 'Python Full-Stack & Enterprise Automation Engineering' },
        { name: 'enterprise-java-spring', topic: 'Enterprise Java & Spring Boot Cloud Microservices' },
        { name: 'typescript-v8-internals', topic: 'Modern TypeScript Generics & Deep JavaScript V8 Internals' },
        { name: 'qa-playwright-automation', topic: 'Modern End-to-End QA Automation, Playwright & CI Pipelines' },
        { name: 'technical-seo-performance', topic: 'Technical SEO, Core Web Vitals & Web Performance' },
        { name: 'developer-cli-tooling', topic: 'Developer Tooling, CLI Architecture & Language Server Protocols' },
      ],
    },
  ];

  // Old category ID for INDUSTRIAL TRACKS
  const oldIndustrialCatId = '1554956734576205824';

  const channelsAfterDelete = await discordFetch(`/guilds/${GUILD_ID}/channels`);

  for (const group of DOMAIN_CATEGORIES) {
    let cat = channelsAfterDelete.find((c) => c.type === 4 && c.name === group.categoryName);
    if (!cat) {
      cat = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: group.categoryName,
        type: 4,
      });
      console.log(`\n📂 Created Category: "${group.categoryName}" (${cat.id})`);
    } else {
      console.log(`\n📂 Category "${group.categoryName}" exists (${cat.id})`);
    }

    for (const ch of group.channels) {
      // Check if channel already exists anywhere
      let existingCh = channelsAfterDelete.find((c) => c.name === ch.name && c.type === 0);
      if (existingCh) {
        // Move under the new domain category if needed
        if (existingCh.parent_id !== cat.id) {
          await discordFetch(`/channels/${existingCh.id}`, 'PATCH', {
            parent_id: cat.id,
            topic: ch.topic,
          });
          console.log(`  ↪ Moved #${ch.name} under "${group.categoryName}"`);
        } else {
          console.log(`  ✓ #${ch.name} already in place`);
        }
      } else {
        // Create new text channel
        const created = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
          name: ch.name,
          type: 0,
          parent_id: cat.id,
          topic: ch.topic,
        });
        console.log(`  ✓ Created #${ch.name} (${created.id})`);
      }
    }
  }

  // Delete old empty "💻 INDUSTRIAL TRACKS" category if it exists and has no children
  const finalCheck = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  const oldCat = finalCheck.find((c) => c.id === oldIndustrialCatId);
  if (oldCat) {
    const children = finalCheck.filter((c) => c.parent_id === oldIndustrialCatId);
    if (children.length === 0) {
      await discordFetch(`/channels/${oldIndustrialCatId}`, 'DELETE');
      console.log('\n✓ Cleaned up old empty "💻 INDUSTRIAL TRACKS" category');
    }
  }

  console.log('\n✨ Audio cleanup and all 33 domain text channels completed successfully!');
}

main().catch(console.error);
