// scripts/setup-voice-faculty-readonly.mjs
// Restructures voice channels, creates Faculty Hub & logs, and locks broadcast channels to read-only

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const GUILD_ID = '1554952372910952460';
const API_BASE = 'https://discord.com/api/v10';

const EVERYONE_ROLE_ID = '1554952372910952460';
const ADMIN_ROLE_ID = '1554960532992434260'; // 👑 Founder / SuperAdmin
const MENTOR_ROLE_ID = '1554956689709605004'; // 👑 Faculty Mentor / Lead
const BOT_ROLE_ID = '1554956632830644349'; // RoleNest Bot

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
  console.log('🚀 Starting Voice Channels, Faculty Hub & Read-Only Permissions Setup...\n');

  // ==========================================
  // 1. RESTRUCTURE VOICE CHANNELS
  // ==========================================
  console.log('--- 1. Restructuring Voice Channels ---');
  const voiceCatId = '1554952374424969354';
  await discordFetch(`/channels/${voiceCatId}`, 'PATCH', {
    name: '🔊 AUDIO LABS & STANDUP ROOMS',
    position: 4,
  });
  console.log('✓ Updated Voice Category name to "🔊 AUDIO LABS & STANDUP ROOMS"');

  // Update Lounge -> 💬 General Voice Lounge
  await discordFetch(`/channels/1554952374424969355`, 'PATCH', {
    name: '💬 General Voice Lounge',
    user_limit: 0,
  });
  console.log('✓ Updated "💬 General Voice Lounge"');

  // Update Study Room 1 -> 🎧 Silent Focus Study 1
  await discordFetch(`/channels/1554952374705979392`, 'PATCH', {
    name: '🎧 Silent Focus Study 1',
    user_limit: 15,
  });
  console.log('✓ Updated "🎧 Silent Focus Study 1"');

  // Update Study Room 2 -> 🎧 Silent Focus Study 2
  await discordFetch(`/channels/1554952374705979393`, 'PATCH', {
    name: '🎧 Silent Focus Study 2',
    user_limit: 15,
  });
  console.log('✓ Updated "🎧 Silent Focus Study 2"');

  // Check or create "🎙️ Mentor Standup & Office Hours"
  const existingChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  let mentorStandupVoice = existingChannels.find(
    (c) => c.name.includes('Mentor Standup') || c.name.includes('mentor-standup')
  );

  if (!mentorStandupVoice) {
    mentorStandupVoice = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: '🎙️ Mentor Standup & Office Hours',
      type: 2, // voice
      parent_id: voiceCatId,
    });
    console.log(`✓ Created Voice Channel: "🎙️ Mentor Standup & Office Hours" (${mentorStandupVoice.id})`);
  } else {
    console.log(`✓ "🎙️ Mentor Standup & Office Hours" already exists (${mentorStandupVoice.id})`);
  }

  // ==========================================
  // 2. CREATE FACULTY & ADMIN DISPATCH CATEGORY & CHANNELS
  // ==========================================
  console.log('\n--- 2. Setting Up Faculty & Admin Dispatch Category ---');
  let facultyCategory = existingChannels.find(
    (c) => c.type === 4 && (c.name.includes('FACULTY') || c.name.includes('Faculty'))
  );

  if (!facultyCategory) {
    facultyCategory = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: '👑 FACULTY & ADMIN DISPATCH',
      type: 4, // category
      position: 1, // High priority near top
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          deny: '1024', // DENY VIEW_CHANNEL
          allow: '0',
        },
        {
          id: ADMIN_ROLE_ID,
          type: 0,
          allow: '68608', // VIEW, SEND, READ_HISTORY
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
    console.log(`✓ Created Category: "👑 FACULTY & ADMIN DISPATCH" (${facultyCategory.id})`);
  } else {
    console.log(`✓ Faculty Category already exists (${facultyCategory.id})`);
  }

  // Move #admin-security-logs under faculty category and lock strictly to Founder + Bot
  const adminSecLogId = '1554958481587576893';
  await discordFetch(`/channels/${adminSecLogId}`, 'PATCH', {
    parent_id: facultyCategory.id,
    permission_overwrites: [
      {
        id: EVERYONE_ROLE_ID,
        type: 0,
        deny: '1024',
        allow: '0',
      },
      {
        id: MENTOR_ROLE_ID,
        type: 0,
        deny: '1024', // Faculty mentors cannot see founder security/financial logs
        allow: '0',
      },
      {
        id: ADMIN_ROLE_ID,
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
  console.log('✓ Positioned #admin-security-logs under Faculty & Admin Category (Strict Founder Only)');

  // Create or update #faculty-review-logs
  let facultyReviewLogs = existingChannels.find((c) => c.name === 'faculty-review-logs');
  if (!facultyReviewLogs) {
    facultyReviewLogs = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: 'faculty-review-logs',
      type: 0, // text
      parent_id: facultyCategory.id,
      topic: 'Live student standups, automated code audit scores, and faculty evaluation queue.',
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          deny: '1024',
          allow: '0',
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
    console.log(`✓ Created #faculty-review-logs (${facultyReviewLogs.id})`);
  } else {
    console.log(`✓ #faculty-review-logs already exists (${facultyReviewLogs.id})`);
  }

  // Create or update #faculty-lounge
  let facultyLounge = existingChannels.find((c) => c.name === 'faculty-lounge');
  if (!facultyLounge) {
    facultyLounge = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: 'faculty-lounge',
      type: 0, // text
      parent_id: facultyCategory.id,
      topic: 'Private coordination hub for Faculty Mentors & Academic Leads.',
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          deny: '1024',
          allow: '0',
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
    console.log(`✓ Created #faculty-lounge (${facultyLounge.id})`);
  } else {
    console.log(`✓ #faculty-lounge already exists (${facultyLounge.id})`);
  }

  // Create or update private Voice War Room for Faculty & Admin
  let facultyWarRoom = existingChannels.find(
    (c) => c.type === 2 && (c.name.includes('Faculty & Admin') || c.name.includes('War Room'))
  );
  if (!facultyWarRoom) {
    facultyWarRoom = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: '🔒 Faculty & Admin War Room',
      type: 2, // voice
      parent_id: facultyCategory.id,
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          deny: '1049600', // DENY VIEW_CHANNEL (1024) | CONNECT (1048576)
          allow: '0',
        },
        {
          id: ADMIN_ROLE_ID,
          type: 0,
          allow: '3146752', // VIEW, CONNECT, SPEAK, USE_VAD
          deny: '0',
        },
        {
          id: MENTOR_ROLE_ID,
          type: 0,
          allow: '3146752',
          deny: '0',
        },
        {
          id: BOT_ROLE_ID,
          type: 0,
          allow: '3146752',
          deny: '0',
        },
      ],
    });
    console.log(`✓ Created Voice Channel: "🔒 Faculty & Admin War Room" (${facultyWarRoom.id})`);
  } else {
    console.log(`✓ Faculty War Room already exists (${facultyWarRoom.id})`);
  }

  // ==========================================
  // 3. ENFORCE READ-ONLY FOR STUDENTS ON BROADCAST CHANNELS
  // ==========================================
  console.log('\n--- 3. Enforcing Read-Only Channels for Students ---');
  // Channels where students can view & react, but CANNOT send messages:
  // - welcome-and-verify (1554956723406643332)
  // - rules-and-code-of-conduct (1554956727122927638)
  // - announcements (1554956730742341662)
  // - certificate-hall-of-fame (1554956784282763355)

  const READ_ONLY_CHANNELS = [
    { id: '1554956723406643332', name: 'welcome-and-verify' },
    { id: '1554956727122927638', name: 'rules-and-code-of-conduct' },
    { id: '1554956730742341662', name: 'announcements' },
    { id: '1554956784282763355', name: 'certificate-hall-of-fame' },
  ];

  for (const ch of READ_ONLY_CHANNELS) {
    console.log(`Locking #${ch.name} to Read-Only for students...`);
    // Overwrites:
    // @everyone: ALLOW VIEW_CHANNEL (1024) | READ_MESSAGE_HISTORY (65536) | ADD_REACTIONS (64) = 66624
    //            DENY SEND_MESSAGES (2048) | CREATE_PUBLIC_THREADS (34359738368) | CREATE_PRIVATE_THREADS (68719476736) | SEND_MESSAGES_IN_THREADS (274877906944) = 377957124096
    // ADMIN: ALLOW 68608
    // MENTOR: ALLOW 68608
    // BOT: ALLOW 68608

    await discordFetch(`/channels/${ch.id}`, 'PATCH', {
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          allow: '66624',
          deny: '377957124096',
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
    console.log(`  ✓ #${ch.name} is now strictly READ-ONLY for regular students!`);
  }

  // ==========================================
  // 4. PIN ORIENTATION GUIDE IN #faculty-lounge
  // ==========================================
  console.log('\n--- 4. Posting Initial Faculty Guide in #faculty-lounge ---');
  const facultyGuideEmbed = {
    title: '👑 Faculty Mentor & Academic Evaluation Protocol',
    description:
      'Welcome to the private **RoleNest Faculty & Admin Dispatch**. This secure environment is dedicated to coordinating mentor hours, reviewing student deliverables, and certifying 4-credit academic internships.',
    color: 0x6366f1,
    fields: [
      {
        name: '📋 Daily Evaluation Responsibilities',
        value:
          '• **Monitor Standup Submissions**: Check incoming GitHub PRs in `#daily-standup-deliverables` & `#faculty-review-logs`.\n• **Code Quality Audits**: Ensure candidate commits contain functional code, passing tests, and no plagiarized scaffolds.\n• **Office Hours**: Host live standup Q&As in `🎙️ Mentor Standup & Office Hours`.',
        inline: false,
      },
      {
        name: '🛡️ AICTE Academic Compliance Criteria',
        value:
          '• Candidates must achieve **at least 80% passing milestones (22+ of 28 Days)** to qualify for graduation.\n• Any flagged plagiarism or automated commit bots must be escalated in `#faculty-review-logs` for credential revocation.',
        inline: false,
      },
      {
        name: '🔒 Confidentiality Notice',
        value:
          'Student academic records, contact info, and internal review scores must remain strictly within this faculty enclave.',
        inline: false,
      },
    ],
    footer: { text: 'RoleNest Academic Council • Faculty Operations' },
    timestamp: new Date().toISOString(),
  };

  await discordFetch(`/channels/${facultyLounge.id}/messages`, 'POST', {
    embeds: [facultyGuideEmbed],
  });
  console.log('✓ Posted Faculty Orientation Guide to #faculty-lounge');

  console.log('\n✨ Setup completed successfully!');
}

main().catch(console.error);
