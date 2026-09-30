// scripts/populate-all-channels.mjs
// Populates all empty Discord channels with official RoleNest industrial guides and embeds

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const API_BASE = 'https://discord.com/api/v10';

async function postEmbed(channelId, embed, pin = true) {
  const res = await fetch(`${API_BASE}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.warn(`Failed on channel ${channelId}:`, err);
    return null;
  }

  const msg = await res.json();
  if (pin && msg && msg.id) {
    try {
      await fetch(`${API_BASE}/channels/${channelId}/pins/${msg.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
    } catch {
      // Pinning might hit pin limit or permissions
    }
  }
  return msg;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Populating all RoleNest Discord channels with guides...');

  const CHANNEL_CONTENT = [
    {
      channelId: '1554956738481094718',
      name: 'ai-machine-learning',
      embed: {
        title: '🤖 Welcome to the AI & Machine Learning Engineering Lab',
        description:
          'Dedicated workspace for interns pursuing the 4-week intensive AI & Deep Learning curriculum.',
        color: 0xec4899,
        fields: [
          {
            name: '📚 Core Curriculum Highlights',
            value:
              '• **Week 1:** Vector Mathematics, NumPy Strides & Custom Cosine Engines\n• **Week 2:** Transformer Self-Attention from First Principles & Tokenization\n• **Week 3:** Vector Databases (Pinecone/Milvus), RAG & Embedding Chunking\n• **Week 4:** Local Model Quantization (GGUF), LoRA Fine-Tuning & Multi-Agent Swarms',
            inline: false,
          },
          {
            name: '💻 Lab Workspace',
            value:
              'Access Day-by-Day Python challenges and interactive architecture canvases at [internship.rolenest.in/portal](https://internship.rolenest.in/portal).',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest AI/ML Division • AICTE 4-Credit Track' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956742096453633',
      name: 'fullstack-web-dev',
      embed: {
        title: '🌐 Welcome to the Full-Stack Web Development Lab',
        description:
          'Engineering hub for enterprise full-stack development, distributed SQL/NoSQL architectures, and clean API design.',
        color: 0x06b6d4,
        fields: [
          {
            name: '🛠️ Core Tech Stack',
            value:
              '• **Frontend:** React 19, TypeScript, Tailwind CSS, Shadcn UI\n• **Backend:** Node.js, Express, Fastify, Server-Sent Events\n• **Storage:** PostgreSQL (Drizzle ORM), Redis Caching, ACID Transactions\n• **DevOps:** Docker Multi-stage Builds, Nginx Reverse Proxy & Health Probes',
            inline: false,
          },
          {
            name: '📌 Discussion Norms',
            value:
              'Share architectural trade-offs, database indexing benchmarks, and API payload schemas here.',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Web Engineering Lab' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956745627926639',
      name: 'nextjs-architects',
      embed: {
        title: '⚡ Welcome to the Next.js Architecture Lab',
        description:
          'Deep dive into modern Next.js 15 App Router, React Server Components (RSC), and edge-native deployments.',
        color: 0xffffff,
        fields: [
          {
            name: '🚀 What We Master Here',
            value:
              '• React Server Components vs Client Components boundaries\n• Server Actions with Zod validation & optimistic state\n• Incremental Static Regeneration (ISR) & dynamic `unstable_cache`\n• Edge Middleware, authentication tokens, and streaming SSR',
            inline: false,
          },
          {
            name: '💡 Pro Tip',
            value:
              'Always inspect your `.next` build traces to eliminate unwanted server-client hydration mismatches.',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Next.js Specialists' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956749864177674',
      name: 'cyber-security-ops',
      embed: {
        title: '🛡️ Welcome to the Cyber Security & SecOps Lab',
        description:
          'Defensive and offensive security engineering, vulnerability assessment, cryptography, and zero-trust architectures.',
        color: 0xef4444,
        fields: [
          {
            name: '🎯 Weekly Security Objectives',
            value:
              '• **OWASP Top 10:** SQL Injection, Cross-Site Scripting (XSS), CSRF tokens\n• **Network Audits:** Packet inspection, Wireshark, TLS handshakes & cipher suites\n• **Auth Security:** JWT replay prevention, OAuth2 PKCE, Argon2 hashing\n• **Container Hardening:** Docker rootless runtime, Seccomp profiles, Falco alerts',
            inline: false,
          },
          {
            name: '⚠️ Academic Rule',
            value:
              'All penetration tests must be conducted exclusively against designated RoleNest sandboxes.',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Security Operations Center' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956754025058344',
      name: 'cloud-sre-devops',
      embed: {
        title: '☁️ Welcome to the Cloud, SRE & DevOps Lab',
        description:
          'Production infrastructure engineering, automated CI/CD pipelines, container orchestration, and telemetry.',
        color: 0x3b82f6,
        fields: [
          {
            name: '🔧 Core Infrastructure Topics',
            value:
              '• Docker containerization & multi-stage image optimization (<50MB)\n• Kubernetes Pods, Deployments, Services, Ingress & Helm Charts\n• CI/CD with GitHub Actions: Automated linting, test runners & zero-downtime releases\n• Observability: Prometheus metrics, Grafana dashboards & OpenTelemetry tracing',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest SRE & Platform Team' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956757783290070',
      name: 'blockchain-web3',
      embed: {
        title: '⛓️ Welcome to the Blockchain & Web3 Engineering Lab',
        description:
          'Smart contract security, Ethereum Virtual Machine (EVM) opcode execution, and decentralized protocol engineering.',
        color: 0xf59e0b,
        fields: [
          {
            name: '💎 Technical Focus Areas',
            value:
              '• Solidity 0.8.x syntax, storage layouts & gas optimization techniques\n• Hardhat & Foundry testing frameworks with fuzzing\n• Reentrancy attacks, flash loan mechanics & ERC-20 / ERC-721 token standards\n• Zero-knowledge proof primitives and state rollups (zk-SNARKs)',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Web3 Research Lab' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956761457361010',
      name: 'developer-sandbox',
      embed: {
        title: '🚀 Developer Zero: Free Testing & Sandbox Cohort',
        description:
          '100% Free interactive test drive of the RoleNest virtual internship platform.',
        color: 0x8b5cf6,
        fields: [
          {
            name: '✨ What You Can Do in the Sandbox',
            value:
              '• Test instant zero-cost registration at [internship.rolenest.in/developer-sandbox](https://internship.rolenest.in/developer-sandbox)\n• Download your verifiable Appointment Offer Letter & College NOC\n• Test the in-browser compiler arena and interactive architecture canvas\n• Run live GitHub commit audits without spending a single rupee!',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Sandbox Evaluation Cohort' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956772635189270',
      name: 'devshelf-open-source-pr',
      embed: {
        title: '🌟 DevShelf Open-Source Milestone Hub',
        description:
          'Official collaboration channel for your mandatory open-source contribution to **RitualDev-Lab/DevShelf**.',
        color: 0x10b981,
        fields: [
          {
            name: '📖 Step-by-Step Contribution Guide',
            value:
              '1. Fork the repo: [github.com/RitualDev-Lab/DevShelf](https://github.com/RitualDev-Lab/DevShelf)\n2. Add a new developer tool, cheat sheet, algorithm, or architecture diagram.\n3. Open a Pull Request following conventional commit guidelines.\n4. Link your PR here for mentor review & community feedback!\n5. Once merged, your Open Source Milestone is permanently stamped on your certificate.',
            inline: false,
          },
          {
            name: '🤖 Automated Webhook',
            value:
              'New PRs and merges will automatically broadcast to this channel in real time!',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Open-Source Initiative' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956776330362992',
      name: 'code-troubleshooting',
      embed: {
        title: '🛠️ Code Troubleshooting & Peer Debugging Desk',
        description:
          'Stuck on an in-browser test case, compiler error, or Docker issue? Ask for help here!',
        color: 0x38bdf8,
        fields: [
          {
            name: '💡 How to Ask for Code Help (3 Golden Rules)',
            value:
              '1. **Format your code:** Wrap code snippets in triple backticks (```python ... ```).\n2. **Include the error output:** Paste the exact compiler or terminal traceback.\n3. **Explain what you tried:** Share the approaches you have already tested.\n\nMentors and fellow interns are here to help 24/7!',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Peer Review Desk' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956784282763355',
      name: 'certificate-hall-of-fame',
      embed: {
        title: '🏆 AICTE 4-Credit Certificate Hall of Fame',
        description:
          'Celebrating RoleNest interns who have completed all 28 daily modules, passed final capstone reviews, and earned verified AICTE academic credentials.',
        color: 0xf59e0b,
        fields: [
          {
            name: '🎖️ What Each Certificate Features',
            value:
              '• Cryptographic SHA-256 verification ledger\n• AICTE / UGC 4-Credit Practical Framework compliance stamp\n• Permanent public verification URL on `internship.rolenest.in/verify/[id]`\n• Verifiable industrial faculty mentor sign-off',
            inline: false,
          },
          {
            name: '📢 Automated Announcements',
            value:
              'Graduates will be broadcast here automatically upon course completion!',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Honors & AICTE Credential Registry' },
        timestamp: new Date().toISOString(),
      },
    },
    {
      channelId: '1554956787851985007',
      name: 'general-dev-lounge',
      embed: {
        title: '☕ General Developer Lounge & Watercooler',
        description:
          'The social heartbeat of our engineering cohort! Introduce yourself, share your mechanical keyboard setup, discuss tech podcasts, and connect with peers.',
        color: 0x6366f1,
        fields: [
          {
            name: '👋 Break the Ice',
            value:
              'Drop a message introducing:\n1. Your Name & College / University\n2. Which Track you are pursuing\n3. Your dream tech stack or company!',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest Community Hub' },
        timestamp: new Date().toISOString(),
      },
    },
  ];

  for (const item of CHANNEL_CONTENT) {
    console.log(`Populating #${item.name} (${item.channelId})...`);
    await postEmbed(item.channelId, item.embed, true);
    await sleep(400);
  }

  console.log('✅ ALL CHANNELS POPULATED WITH RICH GUIDES!');
}

main().catch(console.error);
