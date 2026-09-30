// scripts/setup-auto-leaderboard.mjs
// Creates #intern-leaderboard under 🏆 HALL OF FAME & GRADUATION
// Posts the live automated Leaderboard embed with rankings, tier badges, and cohort telemetry

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const GUILD_ID = (process.env.DISCORD_GUILD_ID || '1554952372910952460').trim();
const API_BASE = 'https://discord.com/api/v10';

const EVERYONE_ROLE_ID = GUILD_ID;
const ADMIN_ROLE_ID = '1554960532992434260';
const MENTOR_ROLE_ID = '1554956689709605004';
const BOT_ROLE_ID = '1554956632830644349';

const HALL_OF_FAME_CAT_ID = '1554956780386263060';

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

const WEB_API_BASE = process.env.WEB_API_URL || 'https://internship.rolenest.in';

export async function fetchLiveLeaderboardData() {
  try {
    const res = await fetch(`${WEB_API_BASE}/api/bootcamp/leaderboard`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[Leaderboard] Failed to fetch live data:', e.message);
  }
  return { totalEnrolled: 0, totalSubmissions: 0, rankings: [] };
}

export function buildLiveLeaderboardEmbed(data = {}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const totalEnrolled = data.totalEnrolled || 0;
  const totalSubmissions = data.totalSubmissions || 0;
  const rankings = data.rankings || [];

  const fields = [
    {
      name: '📊 Live Cohort Telemetry',
      value:
        `• **Verified Interns Enrolled**: \`${totalEnrolled}\`\n` +
        `• **Verified Code Milestones Audited**: \`${totalSubmissions} Commits\`\n` +
        `• **Curriculum Tracks Active**: \`33 Industrial Engineering Specializations\`\n` +
        `• **AICTE / UGC 4-Credit Policy**: \`22 of 28 Days Required for Graduation & NOC\``,
      inline: false,
    },
  ];

  if (rankings.length === 0) {
    fields.push({
      name: '⏳ Cohort Standings (Awaiting Day 1 Submissions)',
      value:
        '*No daily milestone deliverables have been submitted for audit in this cohort yet.*\n\n' +
        'Once enrolled candidates pass the in-browser sandbox tests, push verified code commits to GitHub, and submit in `#daily-standup-deliverables`, real-time rankings and AST audit scores will appear here automatically!',
      inline: false,
    });
    fields.push({
      name: '🚀 How to Rank on the Official Honor Roll',
      value:
        '1️⃣ Download your daily engineering specification using **/sop**\n' +
        '2️⃣ Complete the architecture tasks and pass the in-browser unit tests\n' +
        '3️⃣ Submit your GitHub commit/PR in `#daily-standup-deliverables` to trigger automated AICTE code audit!',
      inline: false,
    });
  } else {
    const gold = rankings.filter((r) => r.tier === 'GOLD');
    const silver = rankings.filter((r) => r.tier === 'SILVER');
    const bronze = rankings.filter((r) => r.tier === 'BRONZE');

    if (gold.length > 0) {
      fields.push({
        name: '🥇 GOLD TIER (Audit Score >= 95% • 26+ Milestones Passed)',
        value: gold
          .map(
            (r, i) =>
              `**${i + 1}. ${r.name}** (\`${r.trackId}\`)\n• Audit Score: \`${r.auditScore}%\` | Streak: \`${r.milestonesPassed}/28 Days\` | Badge: ${r.badge}`
          )
          .join('\n'),
        inline: false,
      });
    }

    if (silver.length > 0) {
      fields.push({
        name: '🥈 SILVER TIER (Audit Score >= 85% • 23-25 Milestones Passed)',
        value: silver
          .map(
            (r, i) =>
              `**${gold.length + i + 1}. ${r.name}** (\`${r.trackId}\`)\n• Audit Score: \`${r.auditScore}%\` | Streak: \`${r.milestonesPassed}/28 Days\` | Badge: ${r.badge}`
          )
          .join('\n'),
        inline: false,
      });
    }

    if (bronze.length > 0) {
      fields.push({
        name: '🥉 BRONZE TIER (Audit Score >= 80% • On-Track for AICTE Credits)',
        value: bronze
          .map(
            (r, i) =>
              `**${gold.length + silver.length + i + 1}. ${r.name}** (\`${r.trackId}\`)\n• Audit Score: \`${r.auditScore}%\` | Streak: \`${r.milestonesPassed}/28 Days\` | Badge: ${r.badge}`
          )
          .join('\n'),
        inline: false,
      });
    }
  }

  return {
    title: `🏆 RoleNest Official Milestone & Code Quality Leaderboard`,
    description: `*Live Cohort Standings as of ${dateStr}*\nEvaluated daily via automated AST code audits, passing unit tests, and GitHub commit milestone consistency across all 33 industrial tracks.`,
    color: 0xf59e0b,
    fields,
    footer: {
      text: 'RoleNest Real Database Telemetry • Refreshes every 6 hours • Check individual standing with /myprogress',
    },
    timestamp: now.toISOString(),
  };
}

async function main() {
  console.log('🚀 Setting up #intern-leaderboard channel and live showcase...\n');

  const existingChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
  let leaderboardChannel = existingChannels.find((c) => c.name === 'intern-leaderboard');

  if (!leaderboardChannel) {
    leaderboardChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
      name: 'intern-leaderboard',
      type: 0, // text
      parent_id: HALL_OF_FAME_CAT_ID,
      position: 0, // First in Hall of Fame
      topic: 'Live auto-updating leaderboard ranking top-performing interns across all 33 tracks.',
      permission_overwrites: [
        {
          id: EVERYONE_ROLE_ID,
          type: 0,
          allow: '66624', // VIEW & REACT
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
    console.log(`✓ Created #intern-leaderboard (${leaderboardChannel.id})`);
  } else {
    console.log(`✓ #intern-leaderboard already exists (${leaderboardChannel.id})`);
  }

  // Purge any old messages to ensure zero fake data
  try {
    const oldMessages = await discordFetch(`/channels/${leaderboardChannel.id}/messages?limit=20`);
    if (Array.isArray(oldMessages)) {
      for (const m of oldMessages) {
        try {
          await discordFetch(`/channels/${leaderboardChannel.id}/messages/${m.id}`, 'DELETE');
          console.log(`  ✓ Purged old message ${m.id}`);
        } catch (delErr) {}
      }
    }
  } catch (e) {}

  // Fetch real data from database API
  const liveData = await fetchLiveLeaderboardData();
  const embed = buildLiveLeaderboardEmbed(liveData);
  const msg = await discordFetch(`/channels/${leaderboardChannel.id}/messages`, 'POST', {
    embeds: [embed],
  });
  console.log(`✓ Posted Live Leaderboard to #intern-leaderboard (Msg ID: ${msg.id})`);

  // Pin it
  try {
    await discordFetch(`/channels/${leaderboardChannel.id}/pins/${msg.id}`, 'PUT');
    console.log('✓ Pinned Live Leaderboard message');
  } catch (e) {
    console.warn('⚠️ Pin status:', e.message);
  }

  // Add celebratory reaction emojis
  try {
    await fetch(`${API_BASE}/channels/${leaderboardChannel.id}/messages/${msg.id}/reactions/🏆/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    await fetch(`${API_BASE}/channels/${leaderboardChannel.id}/messages/${msg.id}/reactions/⭐/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    await fetch(`${API_BASE}/channels/${leaderboardChannel.id}/messages/${msg.id}/reactions/🔥/@me`, {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
  } catch (e) {}

  console.log('\n✨ Auto Leaderboard setup complete!');
}

main().catch(console.error);
