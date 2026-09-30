// scripts/setup-server-guide-and-faqs.mjs
// Sets up:
// 1. #start-here-handbook in 📌 WELCOME & COMPLIANCE
// 2. Comprehensive Candidate Roadmap & Server Directory Guide
// 3. Interactive Instant FAQ Dropdown Select Menu
// 4. Interactive Self-Assign Tech Stack Roles Panel & creates roles

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const GUILD_ID = (process.env.DISCORD_GUILD_ID || '1554952372910952460').trim();
const API_BASE = 'https://discord.com/api/v10';
const WEB_API_BASE = process.env.WEB_API_URL || 'https://internship.rolenest.in';

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

async function getOrCreateRole(name, color) {
  const roles = await discordFetch(`/guilds/${GUILD_ID}/roles`);
  const found = roles.find((r) => r.name.toLowerCase() === name.toLowerCase());
  if (found) return found.id;

  const created = await discordFetch(`/guilds/${GUILD_ID}/roles`, 'POST', {
    name,
    color,
    hoist: false,
    mentionable: true,
  });
  console.log(`Created Role: ${name} (${created.id})`);
  return created.id;
}

async function main() {
  console.log('🚀 Setting up Comprehensive Server Guide & Interactive Knowledge Desk...\n');

  // 1. Create or ensure vanity tech stack roles
  console.log('--- 1. Creating Self-Assignable Tech Stack Roles ---');
  const pythonRoleId = await getOrCreateRole('🐍 Python Developer', 0x3b82f6);
  const tsRoleId = await getOrCreateRole('⚛️ TypeScript / React', 0x38bdf8);
  const devopsRoleId = await getOrCreateRole('☁️ DevOps & Cloud', 0x06b6d4);
  const secRoleId = await getOrCreateRole('🛡️ Security Researcher', 0xef4444);
  const aimlRoleId = await getOrCreateRole('🧠 AI / ML Researcher', 0x8b5cf6);

  // 2. Find 📌 WELCOME & COMPLIANCE Category
  const channels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  const welcomeCat = channels.find(
    (c) => c.type === 4 && (c.name.includes('WELCOME') || c.name.includes('Welcome'))
  );

  if (!welcomeCat) throw new Error('Welcome category not found');

  // 3. Create #start-here-handbook
  let guideChannel = channels.find((c) => c.name === 'start-here-handbook');
  if (!guideChannel) {
    guideChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: 'start-here-handbook',
      type: 0,
      parent_id: welcomeCat.id,
      position: 0, // Very top of welcome category
      topic: 'Official Intern Onboarding Handbook, Server Navigation Map, Interactive FAQs & Tech Roles.',
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          allow: '66624', // VIEW & READ & REACT
          deny: '377957124096', // DENY SEND
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
      ],
    });
    console.log(`✓ Created #start-here-handbook (${guideChannel.id})`);
  } else {
    console.log(`✓ #start-here-handbook already exists (${guideChannel.id})`);
  }

  // 4. Post Embed 1: The Candidate Journey & Server Capabilities
  console.log('\n--- 2. Posting Server Capabilities & Candidate Roadmap ---');
  const roadmapEmbed = {
    title: '🗺️ The Complete Candidate Roadmap • RoleNest Virtual Labs',
    description:
      'Welcome to **RoleNest**, an AICTE-aligned industrial virtual incubator simulating real-world engineering cohorts. This server is your digital campus for daily deliverables, mentor reviews, and peer collaboration.',
    color: 0x6366f1,
    fields: [
      {
        name: '1️⃣ Step 1: Verify & Claim Track Access',
        value:
          'Run **/verify `credential:<your_email_or_roll>`** to claim your **`🎓 AICTE Verified Intern`** credential and automatically unlock your private domain workspace.',
        inline: false,
      },
      {
        name: '2️⃣ Step 2: Daily Lab Execution (Days 1 to 28)',
        value:
          '• **SOP Download**: Use **/sop `day:<N>`** or visit your dashboard to download your daily SOP PDF.\n• **In-Browser Test Arena**: Validate test cases on the interactive canvas.\n• **GitHub Commit**: Push commits to your repository and submit in `#daily-standup-deliverables`.\n• **Live Auditor**: The automated bot checks your diff and records your score.',
        inline: false,
      },
      {
        name: '3️⃣ Step 3: Mentor Standups & Office Hours',
        value:
          'Join `🎙️ Mentor Standup & Office Hours` daily at **10:00 AM IST** (morning sync) and **06:00 PM IST** (evening recap) for live code reviews and debugging.',
        inline: false,
      },
      {
        name: '4️⃣ Step 4: Graduation, Hall of Fame & Academic Credits',
        value:
          'Achieve **>= 80% passing milestones (22+ Days)** to graduate. Your cryptographically verifiable Certificate, Official College NOC Letter, and 4-Credit Transcript will be announced in `#certificate-hall-of-fame`.',
        inline: false,
      },
    ],
    footer: { text: 'RoleNest AICTE Academic Advisory • 4 Academic Credits (160 Lab Hours)' },
  };

  await discordFetch(`/channels/${guideChannel.id}/messages`, 'POST', {
    embeds: [roadmapEmbed],
  });
  console.log('✓ Posted Roadmap Embed');

  // 5. Post Embed 2: Channel Directory & Navigation
  const directoryEmbed = {
    title: '🧭 RoleNest Campus Navigation Directory',
    description: 'Here is where to go for every aspect of your internship:',
    color: 0x0ea5e9,
    fields: [
      {
        name: '📌 Welcome & Compliance',
        value:
          '• `#welcome-and-verify` — Community welcome stream & verification prompt.\n• `#rules-and-code-of-conduct` — AICTE compliance terms & anti-plagiarism rules.\n• `#announcements` — Official university circulars & cohort updates.',
        inline: false,
      },
      {
        name: '🛠️ Lab Workspaces & Deliverables',
        value:
          '• `#daily-standup-deliverables` — Submit GitHub PR links for automated audit evaluation.\n• `#daily-problem-of-the-day` — Daily industrial coding challenge updated every 24 hours.\n• `#devshelf-open-source-pr` — Showcase open-source PRs and capstone projects.\n• `#code-troubleshooting` — Post bug stack traces for peer & AI assistance (`/ask`).',
        inline: false,
      },
      {
        name: '🔊 Audio Labs & Silent Study',
        value:
          '• `💬 General Voice Lounge` — Open voice lounge for networking.\n• `🎧 Silent Focus Study 1, 2, 3` — 24/7 quiet study rooms for focused coding.\n• `🎙️ Mentor Standup & Office Hours` — Live mentor Q&A and architecture teardowns.',
        inline: false,
      },
      {
        name: '🎫 Support & Helpdesk',
        value:
          '• `#support-helpdesk` — Click **Open Support Ticket** to launch a private mentor channel.',
        inline: false,
      },
    ],
    footer: { text: 'Type /tracks to browse all 33 industrial engineering domains' },
  };

  await discordFetch(`/channels/${guideChannel.id}/messages`, 'POST', {
    embeds: [directoryEmbed],
  });
  console.log('✓ Posted Directory Embed');

  // 6. Post Embed 3: Interactive FAQ Select Menu (Dropdown)
  console.log('\n--- 3. Posting Interactive FAQ Select Menu ---');
  const faqPanelPayload = {
    embeds: [
      {
        title: '❓ Instant Academic & Platform FAQ Desk',
        description:
          'Have a question about your AICTE credits, code audits, college approvals, or daily milestones?\n\n**Select a topic from the dropdown below** to receive an immediate official explanation:',
        color: 0x10b981,
        footer: { text: 'RoleNest Automated Knowledge Base • Instant Answers' },
      },
    ],
    components: [
      {
        type: 1, // ActionRow
        components: [
          {
            type: 3, // String Select Menu
            custom_id: 'faq_select_menu',
            placeholder: '🔍 Select a Question to View Instant Answer...',
            options: [
              {
                label: 'AICTE / UGC 4-Credit Policy & University Recognition',
                value: 'faq_credits',
                description: 'How to submit credentials to your college HOD / placement cell',
                emoji: { name: '📜' },
              },
              {
                label: '80% Passing Criteria & Daily Standup Deadlines',
                value: 'faq_attendance',
                description: 'What happens if you miss a day or need an extension',
                emoji: { name: '⏰' },
              },
              {
                label: 'Automated GitHub Commit Auditor & Plagiarism Rules',
                value: 'faq_audit',
                description: 'How our CI/CD runner scores your code and checks authenticity',
                emoji: { name: '🛡️' },
              },
              {
                label: 'Downloading College NOC Letter & Appointment Order',
                value: 'faq_noc',
                description: 'Accessing digitally signed administrative documentation',
                emoji: { name: '📄' },
              },
              {
                label: '1-on-1 Faculty Mentor Office Hours & Helpdesk',
                value: 'faq_mentors',
                description: 'How and when to connect live with lead faculty architects',
                emoji: { name: '🎙️' },
              },
              {
                label: 'Academic Refund & Credential Invalidation Safeguards',
                value: 'faq_refund',
                description: 'Understanding certification permanence and integrity terms',
                emoji: { name: '⚖️' },
              },
            ],
          },
        ],
      },
    ],
  };

  await discordFetch(`/channels/${guideChannel.id}/messages`, 'POST', faqPanelPayload);
  console.log('✓ Posted Interactive FAQ Dropdown Menu');

  // 7. Post Embed 4: Self-Assign Tech Stack Roles (Interactive Buttons)
  console.log('\n--- 4. Posting Self-Assignable Tech Stack Badges ---');
  const rolesPanelPayload = {
    embeds: [
      {
        title: '🎨 Customize Your Profile: Tech Stack Badges',
        description:
          'Select your primary technology interests below to claim your developer badge and connect with peer engineers:\n\n*(Clicking a button toggles the role on or off)*',
        color: 0xf59e0b,
        fields: [
          { name: '🐍 Python Developer', value: 'Backend, FastAPIs, Automation & Data', inline: true },
          { name: '⚛️ TypeScript / React', value: 'Modern Web, Next.js 15 & UI/UX', inline: true },
          { name: '☁️ DevOps & Cloud', value: 'Docker, Kubernetes, CI/CD & SRE', inline: true },
          { name: '🛡️ Security Researcher', value: 'InfoSec, Penetration Testing & Defense', inline: true },
          { name: '🧠 AI / ML Researcher', value: 'PyTorch, Transformers & Vector Search', inline: true },
        ],
        footer: { text: 'Your badges will be displayed alongside your name on Discord' },
      },
    ],
    components: [
      {
        type: 1, // ActionRow
        components: [
          {
            type: 2,
            style: 2, // Secondary (Gray)
            label: 'Python Developer',
            emoji: { name: '🐍' },
            custom_id: 'toggle_role_python',
          },
          {
            type: 2,
            style: 2,
            label: 'TypeScript / React',
            emoji: { name: '⚛️' },
            custom_id: 'toggle_role_typescript',
          },
          {
            type: 2,
            style: 2,
            label: 'DevOps & Cloud',
            emoji: { name: '☁️' },
            custom_id: 'toggle_role_devops',
          },
          {
            type: 2,
            style: 2,
            label: 'Security Researcher',
            emoji: { name: '🛡️' },
            custom_id: 'toggle_role_security',
          },
          {
            type: 2,
            style: 2,
            label: 'AI / ML Researcher',
            emoji: { name: '🧠' },
            custom_id: 'toggle_role_aiml',
          },
        ],
      },
    ],
  };

  await discordFetch(`/channels/${guideChannel.id}/messages`, 'POST', rolesPanelPayload);
  console.log('✓ Posted Tech Stack Self-Assignment Buttons');

  console.log('\n✨ Server Guide, FAQs, and Tech Roles setup completed successfully!');
}

main().catch(console.error);
