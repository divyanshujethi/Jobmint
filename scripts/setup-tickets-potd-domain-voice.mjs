// scripts/setup-tickets-potd-domain-voice.mjs
// Sets up:
// 1. 🎫 Support & Mentor Desk category & #support-helpdesk with interactive Ticket button
// 2. 🧩 #daily-problem-of-the-day channel with automated rotating POTD
// 3. 🔊 Domain-based Voice Lounges covering all 30+ domains

import { getDailyPOTD } from './potd-catalog.mjs';

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
  console.log('🚀 Setting up Tickets System, Daily POTD, and Domain Voice Lounges...\n');

  const existingChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);

  // ==========================================
  // 1. SUPPORT & MENTOR DESK CATEGORY & CHANNEL
  // ==========================================
  console.log('--- 1. Setting Up Support Ticket System ---');
  let supportCat = existingChannels.find(
    (c) => c.type === 4 && (c.name.includes('SUPPORT') || c.name.includes('Support'))
  );

  if (!supportCat) {
    supportCat = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: '🎫 SUPPORT & MENTOR DESK',
      type: 4, // Category
      position: 3,
    });
    console.log(`✓ Created Category: "🎫 SUPPORT & MENTOR DESK" (${supportCat.id})`);
  } else {
    console.log(`✓ Category "🎫 SUPPORT & MENTOR DESK" already exists (${supportCat.id})`);
  }

  // Create or find #support-helpdesk
  let helpdeskChannel = existingChannels.find(
    (c) => c.name === 'support-helpdesk' || c.name === 'support-tickets'
  );

  if (!helpdeskChannel) {
    helpdeskChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: 'support-helpdesk',
      type: 0, // text
      parent_id: supportCat.id,
      topic: 'Official 1-on-1 Support Desk for RoleNest interns. Click the button to launch a private mentor session.',
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          allow: '66624', // VIEW_CHANNEL | READ_MESSAGE_HISTORY | ADD_REACTIONS
          deny: '377957124096', // DENY SEND_MESSAGES & THREADS
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
    console.log(`✓ Created #support-helpdesk (${helpdeskChannel.id})`);
  } else {
    console.log(`✓ #support-helpdesk already exists (${helpdeskChannel.id})`);
  }

  // Post the Interactive Support Desk Embed with ActionRow button
  const ticketPanelPayload = {
    embeds: [
      {
        title: '🎫 RoleNest Virtual Labs • Support & Mentor Helpdesk',
        description:
          'Need dedicated 1-on-1 assistance with your virtual internship, cloud workspace, code audit failures, or academic credit certification?\n\nClick the button below to **launch an encrypted, private ticket channel** visible only to you, Faculty Mentors, and the Academic Admin Team.',
        color: 0x6366f1,
        fields: [
          {
            name: '⚡ Typical Support Response Time',
            value: '• **Standard Queries**: < 15 minutes\n• **Code Audits & Plagiarism Inquiries**: Real-time review\n• **Live Office Hours**: Daily at 10:00 AM & 06:00 PM IST',
            inline: false,
          },
          {
            name: '📋 What to prepare before opening a ticket',
            value: '• Your registered Email / Roll Number\n• Enrolled Track & Day Milestone (e.g. Day 14 / Next.js)\n• Error stack traces, logs, or commit SHA',
            inline: false,
          },
        ],
        footer: { text: 'RoleNest AICTE Academic Advisory • 24/7 Virtual Helpdesk' },
      },
    ],
    components: [
      {
        type: 1, // ActionRow
        components: [
          {
            type: 2, // Button
            style: 1, // Primary (Blurple)
            label: 'Open Support Ticket',
            emoji: { name: '📩' },
            custom_id: 'open_support_ticket',
          },
          {
            type: 2, // Button
            style: 5, // Link
            label: 'View 30+ Tracks Catalog',
            url: 'https://internship.rolenest.in/#tracks',
          },
        ],
      },
    ],
  };

  await discordFetch(`/channels/${helpdeskChannel.id}/messages`, 'POST', ticketPanelPayload);
  console.log('✓ Posted Interactive Support Ticket Panel in #support-helpdesk');

  // ==========================================
  // 2. DAILY POTD (PROBLEM OF THE DAY) CHANNEL
  // ==========================================
  console.log('\n--- 2. Setting Up Daily Problem of the Day (POTD) ---');
  const labCatId = '1554956764997488760'; // 🛠️ LAB WORKSPACE & CODE AUDITS

  let potdChannel = existingChannels.find(
    (c) => c.name === 'daily-problem-of-the-day' || c.name === 'daily-potd'
  );

  if (!potdChannel) {
    potdChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: 'daily-problem-of-the-day',
      type: 0,
      parent_id: labCatId,
      position: 11,
      topic: 'Daily industrial coding challenge automatically updated every 24 hours. React with 💡/🚀 when solved!',
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          allow: '66624', // VIEW & REACT
          deny: '377957124096', // DENY SEND_MESSAGES
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
    console.log(`✓ Created #daily-problem-of-the-day (${potdChannel.id})`);
  } else {
    console.log(`✓ #daily-problem-of-the-day already exists (${potdChannel.id})`);
  }

  // Post Today's POTD
  const todayPOTD = getDailyPOTD();
  const potdEmbed = {
    title: `🧩 Daily Problem of the Day (POTD) • ${todayPOTD.dateString}`,
    description: `**${todayPOTD.title}**\n*Domain: ${todayPOTD.domain} | Difficulty: ${todayPOTD.difficulty}*\n\n${todayPOTD.description}`,
    color: todayPOTD.difficulty === 'Hard' ? 0xef4444 : 0x0ea5e9,
    fields: [
      {
        name: '💻 Architecture & Code Context',
        value: `\`\`\`ts\n${todayPOTD.codeSnippet}\n\`\`\``,
        inline: false,
      },
      {
        name: '🎯 Milestone Task',
        value: todayPOTD.challengeTask,
        inline: false,
      },
      {
        name: '💡 Architectural Hint',
        value: `||${todayPOTD.hint}||`, // Discord spoiler tag
        inline: false,
      },
    ],
    footer: {
      text: 'RoleNest Automated POTD Engine • React with 💡 when solved or 🚀 for discussion',
    },
    timestamp: new Date().toISOString(),
  };

  const potdMsg = await discordFetch(`/channels/${potdChannel.id}/messages`, 'POST', {
    embeds: [potdEmbed],
  });
  console.log(`✓ Posted Today's POTD (#${todayPOTD.id}: "${todayPOTD.title}")`);

  // Add initial reaction for student engagement
  try {
    await fetch(`${API_BASE}/channels/${potdChannel.id}/messages/${potdMsg.id}/reactions/💡/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    await fetch(`${API_BASE}/channels/${potdChannel.id}/messages/${potdMsg.id}/reactions/🚀/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
  } catch (e) {
    // Reactions optional
  }

  // ==========================================
  // 3. DOMAIN-BASED VOICE LOUNGES (30+ DOMAINS)
  // ==========================================
  console.log('\n--- 3. Setting Up Domain-Based Voice Lounges (30+ Domains) ---');
  const voiceCatId = '1554952374424969354'; // 🔊 AUDIO LABS & STANDUP ROOMS

  const DOMAIN_VOICE_CHANNELS = [
    { name: '🧠 Voice Lab: AI, ML & Data Science', limit: 20 },
    { name: '🌐 Voice Lab: Full-Stack & Next.js', limit: 20 },
    { name: '🛡️ Voice Lab: Cyber Security Ops', limit: 20 },
    { name: '☁️ Voice Lab: Cloud, DevOps & SRE', limit: 20 },
    { name: '💾 Voice Lab: Databases & Systems', limit: 20 },
    { name: '🎮 Voice Lab: Game Dev & Graphics', limit: 20 },
    { name: '⛓️ Voice Lab: Web3 & Blockchain', limit: 20 },
    { name: '🚀 Voice Lab: Sandbox & Tooling', limit: 20 },
  ];

  for (const vc of DOMAIN_VOICE_CHANNELS) {
    const found = existingChannels.find((c) => c.name === vc.name && c.type === 2);
    if (!found) {
      const created = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: vc.name,
        type: 2, // voice
        parent_id: voiceCatId,
        user_limit: vc.limit,
      });
      console.log(`  ✓ Created Domain Voice Room: "${vc.name}" (${created.id})`);
    } else {
      console.log(`  ✓ Domain Voice Room "${vc.name}" already exists (${found.id})`);
    }
  }

  console.log('\n✨ All Tickets, POTD, and Domain Voice Lounges setup successfully!');
}

main().catch(console.error);
