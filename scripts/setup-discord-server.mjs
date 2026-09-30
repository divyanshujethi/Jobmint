// scripts/setup-discord-server.mjs
// Automated Discord Server Builder for RoleNest Virtual Labs

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const GUILD_ID = process.env.DISCORD_GUILD_ID || '1554952372910952460';
const API_BASE = 'https://discord.com/api/v10';

async function discordFetch(endpoint, method = 'GET', body = null) {
  const headers = {
    Authorization: `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'RoleNest-Server-Architect/1.0',
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Discord API ${method} ${endpoint} failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 RoleNest Discord Server Architect Started...');
  console.log(`Checking connection to Guild ID: ${GUILD_ID}...`);

  let guild;
  try {
    guild = await discordFetch(`/guilds/${GUILD_ID}`);
    console.log(`✅ Connected to Guild: "${guild.name}" (ID: ${guild.id})`);
  } catch (err) {
    console.error('❌ Could not connect to guild:', err.message);
    console.log('\n⚠️ ACTION REQUIRED:');
    console.log('You must authorize the bot first using this URL:');
    console.log(`https://discord.com/oauth2/authorize?client_id=1554955237897408652&permissions=8&integration_type=0&scope=bot`);
    console.log('Open that link in your browser, pick your server, and click Authorize. Then run this script again!');
    process.exit(1);
  }

  // 1. Fetch existing channels & categories
  const existingChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  console.log(`Found ${existingChannels.length} existing channels.`);

  // 2. Setup Roles
  console.log('Creating / verifying official roles...');
  const existingRoles = await discordFetch(`/guilds/${GUILD_ID}/roles`);

  const rolesToCreate = [
    { name: '👑 Faculty Mentor / Lead', color: 0x10b981, hoist: true },
    { name: '🎓 AICTE Verified Intern', color: 0x3b82f6, hoist: true },
    { name: '🚀 Sandbox Testing Cohort', color: 0x8b5cf6, hoist: true },
    { name: '🤖 RoleNest Bot', color: 0x14b8a6, hoist: false },
    { name: '⚡ AI / ML Specialist', color: 0xec4899, hoist: false },
    { name: '🌐 Full-Stack Engineer', color: 0x06b6d4, hoist: false },
    { name: '🛡️ Cyber Security Analyst', color: 0xef4444, hoist: false },
  ];

  for (const roleDef of rolesToCreate) {
    const alreadyExists = existingRoles.some((r) => r.name === roleDef.name);
    if (!alreadyExists) {
      try {
        await discordFetch(`/guilds/${GUILD_ID}/roles`, 'POST', roleDef);
        console.log(`  ✓ Created role: ${roleDef.name}`);
        await sleep(350);
      } catch (err) {
        console.warn(`  ⚠️ Could not create role ${roleDef.name}:`, err.message);
      }
    } else {
      console.log(`  • Role already exists: ${roleDef.name}`);
    }
  }

  // 3. Category & Channel Structure
  const ARCHITECTURE = [
    {
      category: '📌 WELCOME & COMPLIANCE',
      channels: [
        {
          name: 'welcome-and-verify',
          topic: 'Welcome to RoleNest Virtual Labs. Verify your student account & access your Offer Letter.',
        },
        {
          name: 'rules-and-code-of-conduct',
          topic: 'AICTE academic integrity, anti-plagiarism standards, and community guidelines.',
        },
        {
          name: 'announcements',
          topic: 'Official RoleNest updates, cohort deadlines, and guest lecture sessions.',
        },
      ],
    },
    {
      category: '💻 INDUSTRIAL TRACKS',
      channels: [
        {
          name: 'ai-machine-learning',
          topic: 'AI/ML Engineering cohort: PyTorch, Vector Search, LLM Agents & Model fine-tuning.',
        },
        {
          name: 'fullstack-web-dev',
          topic: 'Full-stack engineering: React, Next.js, Node.js, distributed databases & API design.',
        },
        {
          name: 'nextjs-architects',
          topic: 'Next.js App Router, SSR/SSG caching, Server Actions & edge deployment.',
        },
        {
          name: 'cyber-security-ops',
          topic: 'Security engineering: Penetration testing, OWASP Top 10, zero-trust & auth audit.',
        },
        {
          name: 'cloud-sre-devops',
          topic: 'Site Reliability Engineering: Docker, Kubernetes, Prometheus, CI/CD & incident response.',
        },
        {
          name: 'blockchain-web3',
          topic: 'Decentralized systems: Smart contracts, Solidity, EVM internals & zero-knowledge proofs.',
        },
        {
          name: 'developer-sandbox',
          topic: 'Zero-cost sandbox track for instant onboarding, Git plumbing & testing platform verification.',
        },
      ],
    },
    {
      category: '🛠️ LAB WORKSPACE & CODE AUDITS',
      channels: [
        {
          name: 'daily-standup-deliverables',
          topic: 'Share your daily GitHub commit hashes, line diffs, and progress screenshots.',
        },
        {
          name: 'devshelf-open-source-pr',
          topic: 'Collaborate on open-source contributions to RitualDev-Lab/DevShelf repository.',
        },
        {
          name: 'code-troubleshooting',
          topic: 'Peer review and debugging help for in-browser coding challenges and local setup.',
        },
      ],
    },
    {
      category: '🏆 HALL OF FAME & GRADUATION',
      channels: [
        {
          name: 'certificate-hall-of-fame',
          topic: 'Verified graduates receiving AICTE 4-Credit recommendations and graduation honors.',
        },
        {
          name: 'general-dev-lounge',
          topic: 'Hang out, share dev setups, tech news, and career opportunities.',
        },
      ],
    },
  ];

  let welcomeChannelId = null;

  for (const group of ARCHITECTURE) {
    console.log(`\nSetting up Category: "${group.category}"...`);
    let categoryChannel = existingChannels.find(
      (c) => c.type === 4 && c.name.toLowerCase() === group.category.toLowerCase()
    );

    if (!categoryChannel) {
      categoryChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: group.category,
        type: 4, // 4 = GUILD_CATEGORY
      });
      console.log(`  ✓ Created Category: ${group.category} (ID: ${categoryChannel.id})`);
      await sleep(400);
    } else {
      console.log(`  • Found existing Category: ${group.category}`);
    }

    for (const ch of group.channels) {
      let textChannel = existingChannels.find(
        (c) => c.type === 0 && c.name.toLowerCase() === ch.name.toLowerCase()
      );

      if (!textChannel) {
        textChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
          name: ch.name,
          type: 0, // 0 = GUILD_TEXT
          parent_id: categoryChannel.id,
          topic: ch.topic,
        });
        console.log(`    ✓ Created Channel: #${ch.name}`);
        await sleep(350);
      } else {
        console.log(`    • Channel already exists: #${ch.name}`);
      }

      if (ch.name === 'welcome-and-verify') {
        welcomeChannelId = textChannel.id;
      }
    }
  }

  // 4. Post Welcome Embed in #welcome-and-verify if created
  if (welcomeChannelId) {
    console.log('\nPosting official welcome embed to #welcome-and-verify...');
    const welcomeEmbed = {
      title: '🚀 Welcome to RoleNest Virtual Engineering Labs!',
      description:
        'Official Discord headquarters for RoleNest Industrial Internships & AICTE 4-Credit Practical Programs.',
      color: 0x10b981,
      fields: [
        {
          name: '🎓 1. Access Your Student Dashboard',
          value:
            'Log into [internship.rolenest.in/portal](https://internship.rolenest.in/portal) to view your enrolled track, daily curriculum, and live progress.',
          inline: false,
        },
        {
          name: '📄 2. Official Documents & College NOC',
          value:
            'Download your verifiable **Appointment Offer Letter** and **College NOC** directly from your student portal. Submit your NOC to your HOD/TPO for academic credit sanction.',
          inline: false,
        },
        {
          name: '💻 3. Daily Day-by-Day Workspace',
          value:
            'Complete daily interactive architecture diagrams, in-browser code arenas, and push your commits to GitHub. Our live CI/CD auditor verifies your commits every day.',
          inline: false,
        },
        {
          name: '🌟 4. Open Source Milestone',
          value:
            'All interns contribute at least one verified pull request to [RitualDev-Lab/DevShelf](https://github.com/RitualDev-Lab/DevShelf) before graduation.',
          inline: false,
        },
        {
          name: '🛡️ 5. Rules & Code of Conduct',
          value:
            'Respect your peers, write clean code, and follow the guidelines in <#rules-and-code-of-conduct>.',
          inline: false,
        },
      ],
      footer: {
        text: 'RoleNest Virtual Labs • AICTE / UGC 4-Credit Practical Framework',
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await discordFetch(`/channels/${welcomeChannelId}/messages`, 'POST', {
        embeds: [welcomeEmbed],
      });
      console.log('✅ Welcome embed posted successfully!');
    } catch (err) {
      console.warn('⚠️ Could not post welcome embed:', err.message);
    }
  }

  console.log('\n🎉 ALL DONE! RoleNest Discord Server Architecture is fully configured and ready!');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
