// scripts/discord-bot-daemon.mjs
// RoleNest Official Discord Bot Daemon
// Handles:
// 1. Gateway WebSocket connection & presence
// 2. Automated Welcome messages for new members (GUILD_MEMBER_ADD)
// 3. Security Audit Logs to #admin-security-logs
// 4. Faculty Alerts to #faculty-review-logs
// 5. Slash Commands: /verify, /status, /standup, /rules, /helpdesk

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const GUILD_ID = '1554952372910952460';
const CLIENT_ID = '1554955237897408652';
const API_BASE = 'https://discord.com/api/v10';
const WEB_API_BASE = process.env.WEB_API_URL || 'https://internship.rolenest.in';

const CHANNELS = {
  WELCOME_VERIFY: '1554956723406643332',
  RULES: '1554956727122927638',
  ANNOUNCEMENTS: '1554956730742341662',
  DAILY_STANDUP: '1554956768604323986',
  HALL_OF_FAME: '1554956784282763355',
  DEV_LOUNGE: '1554956787851985007',
  ADMIN_SECURITY: '1554958481587576893',
  FACULTY_REVIEW: '1554963363472212108',
  FACULTY_LOUNGE: '1554963365338685573',
};

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
    console.error(`[Discord API Error] ${method} ${endpoint} (${res.status}): ${err}`);
    return null;
  }
  return res.json();
}

async function sendChannelMessage(channelId, payload) {
  return discordFetch(`/channels/${channelId}/messages`, 'POST', payload);
}

async function respondInteraction(interactionId, interactionToken, responseData) {
  try {
    await fetch(`${API_BASE}/interactions/${interactionId}/${interactionToken}/callback`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: responseData,
      }),
    });
  } catch (err) {
    console.error('[Interaction Callback Error]:', err);
  }
}

// Student Verification logic calling RoleNest backend
async function verifyStudent(credential, discordUserId) {
  try {
    const res = await fetch(`${WEB_API_BASE}/api/bootcamp/discord/verify-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrRoll: credential,
        discordUserId,
      }),
    });

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

let ws = null;
let heartbeatInterval = null;
let seq = null;

function connectGateway() {
  console.log('[Gateway] Connecting to Discord Gateway...');
  ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');

  ws.onopen = () => {
    console.log('[Gateway] WebSocket connected.');
  };

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.s) seq = msg.s;

      // Opcode 10: HELLO
      if (msg.op === 10) {
        const interval = msg.d.heartbeat_interval;
        console.log(`[Gateway] Received HELLO. Heartbeat interval: ${interval}ms`);

        if (heartbeatInterval) clearInterval(heartbeatInterval);
        heartbeatInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 1, d: seq }));
          }
        }, interval);

        // Send IDENTIFY with GUILDS (1) and GUILD_MEMBERS (2) = 3
        ws.send(
          JSON.stringify({
            op: 2,
            d: {
              token: BOT_TOKEN,
              intents: 3,
              presence: {
                status: 'online',
                activities: [
                  {
                    name: 'RoleNest Virtual Labs 🚀',
                    type: 3, // WATCHING
                  },
                ],
              },
              properties: {
                os: 'linux',
                browser: 'RoleNest-Bot',
                device: 'RoleNest-Bot',
              },
            },
          })
        );
      }

      // Opcode 11: Heartbeat ACK
      if (msg.op === 11) {
        // Heartbeat acknowledged
      }

      // Opcode 0: DISPATCH
      if (msg.op === 0) {
        await handleDispatch(msg.t, msg.d);
      }
    } catch (err) {
      console.error('[Gateway Message Error]:', err);
    }
  };

  ws.onerror = (err) => {
    console.error('[Gateway Error]:', err);
  };

  ws.onclose = (event) => {
    console.warn(`[Gateway Closed] Code: ${event.code}, Reason: ${event.reason}. Reconnecting in 5s...`);
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    setTimeout(connectGateway, 5000);
  };
}

async function handleDispatch(eventType, data) {
  // 1. Bot Ready
  if (eventType === 'READY') {
    console.log(`🚀 [RoleNest Bot] Logged in as: ${data.user.username}#${data.user.discriminator} (ID: ${data.user.id})`);
    console.log(`   Connected to ${data.guilds.length} Guild(s). Monitoring incoming events...`);
  }

  // 2. New Member Joined
  if (eventType === 'GUILD_MEMBER_ADD') {
    const member = data;
    const userId = member.user?.id;
    const username = member.user?.username || 'New Member';
    console.log(`[Event] Member Joined: ${username} (${userId})`);

    // Public Welcome in Lounge
    await sendChannelMessage(CHANNELS.DEV_LOUNGE, {
      content: `👋 Welcome <@${userId}> to **RoleNest Virtual Labs**!\n\nTo unlock your private industrial track channel, simply use the **/verify** slash command or visit [internship.rolenest.in](https://internship.rolenest.in).`,
    });

    // Admin Security Audit Log
    await sendChannelMessage(CHANNELS.ADMIN_SECURITY, {
      embeds: [
        {
          title: '📥 Member Joined Server',
          description: `Candidate <@${userId}> (\`${username}\`) joined the Discord server.`,
          color: 0x3b82f6,
          fields: [
            { name: 'User ID', value: `\`${userId}\``, inline: true },
            { name: 'Status', value: '⏳ Awaiting Role Verification', inline: true },
          ],
          footer: { text: 'RoleNest Security Monitor' },
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }

  // 3. Slash Command Interaction
  if (eventType === 'INTERACTION_CREATE' && data.type === 2) {
    const { id: interactionId, token: interactionToken, member, data: cmdData } = data;
    const cmdName = cmdData.name;
    const userId = member?.user?.id;
    const username = member?.user?.username;

    console.log(`[Slash Command] /${cmdName} invoked by ${username} (${userId})`);

    if (cmdName === 'verify') {
      const credOpt = cmdData.options?.find((o) => o.name === 'credential');
      const credential = credOpt?.value || '';

      const result = await verifyStudent(credential, userId);

      if (result.ok && result.data?.success) {
        const d = result.data;
        await respondInteraction(interactionId, interactionToken, {
          embeds: [
            {
              title: '✅ Verification Successful!',
              description: `Congratulations **${d.studentName}**! You have been successfully verified as an active RoleNest intern.`,
              color: 0x10b981,
              fields: [
                { name: '💻 Enrolled Track', value: d.trackId, inline: true },
                { name: '🏛️ Institution', value: d.collegeName || 'Engineering Affiliated', inline: true },
                { name: '📜 Offer Letter Ref', value: `\`${d.offerLetterId}\``, inline: false },
                { name: '🔓 Unlocked Channels', value: `**${d.assignedRoles?.join(', ') || 'Track Workspace'}**`, inline: false },
              ],
              footer: { text: 'RoleNest AICTE Virtual Labs' },
              timestamp: new Date().toISOString(),
            },
          ],
        });

        // Notify #faculty-review-logs
        await sendChannelMessage(CHANNELS.FACULTY_REVIEW, {
          embeds: [
            {
              title: '🎓 Student Linked Discord: Verified',
              description: `Candidate **${d.studentName}** has linked their Discord account.`,
              color: 0x6366f1,
              fields: [
                { name: 'Student', value: `<@${userId}> (${d.studentName})`, inline: true },
                { name: 'Track', value: d.trackId, inline: true },
                { name: 'College', value: d.collegeName || 'N/A', inline: false },
                { name: 'Offer Ref', value: `\`${d.offerLetterId}\``, inline: false },
              ],
              footer: { text: 'Faculty Mentor Stream' },
              timestamp: new Date().toISOString(),
            },
          ],
        });

        // Notify #admin-security-logs
        await sendChannelMessage(CHANNELS.ADMIN_SECURITY, {
          embeds: [
            {
              title: '🛡️ Role Assignment Audit',
              description: `Automated verification completed for <@${userId}>.`,
              color: 0x059669,
              fields: [
                { name: 'Discord User', value: `<@${userId}> (\`${username}\`)`, inline: true },
                { name: 'Assigned Roles', value: d.assignedRoles?.join(', ') || 'Verified Intern', inline: true },
                { name: 'Input Credential', value: `\`${credential}\``, inline: false },
              ],
              footer: { text: 'RoleNest Security Ledger' },
              timestamp: new Date().toISOString(),
            },
          ],
        });
      } else {
        const errorMsg = result.data?.error || result.error || 'Enrollment record not found. Please verify your email or roll number.';
        await respondInteraction(interactionId, interactionToken, {
          flags: 64, // EPHEMERAL
          embeds: [
            {
              title: '❌ Verification Failed',
              description: errorMsg,
              color: 0xef4444,
              fields: [
                {
                  name: '💡 Need Help?',
                  value: 'Ensure you enter the exact email or roll number used when registering on [internship.rolenest.in](https://internship.rolenest.in). If you recently enrolled, please allow up to 1 minute for database indexing.',
                },
              ],
            },
          ],
        });
      }
    } else if (cmdName === 'status') {
      const credOpt = cmdData.options?.find((o) => o.name === 'credential');
      const credential = credOpt?.value || '';

      if (!credential) {
        await respondInteraction(interactionId, interactionToken, {
          flags: 64,
          content: 'ℹ️ Please provide your registered email or roll number: `/status credential:your-email@example.com`',
        });
        return;
      }

      const result = await verifyStudent(credential, '');
      if (result.ok && result.data?.success) {
        const d = result.data;
        await respondInteraction(interactionId, interactionToken, {
          flags: 64,
          embeds: [
            {
              title: `📊 Internship Status: ${d.studentName}`,
              color: 0x0ea5e9,
              fields: [
                { name: 'Program Track', value: d.trackId, inline: true },
                { name: 'Academic Standing', value: 'Active (In Progress)', inline: true },
                { name: 'Offer Letter Ref', value: `\`${d.offerLetterId}\``, inline: false },
                { name: 'Virtual Lab Dashboard', value: `[Access Lab Workspace](${WEB_API_BASE}/internship-bootcamp/${encodeURIComponent(d.trackId)})`, inline: false },
              ],
              footer: { text: 'RoleNest Academic Status Telemetry' },
            },
          ],
        });
      } else {
        await respondInteraction(interactionId, interactionToken, {
          flags: 64,
          content: `❌ Could not find an active internship for \`${credential}\`. Please check your details.`,
        });
      }
    } else if (cmdName === 'standup') {
      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: '📋 Daily Standup & Milestone Submission Guide',
            description: 'All candidates must submit verified work daily to earn AICTE credits.',
            color: 0x3b82f6,
            fields: [
              {
                name: '1️⃣ Daily SOP & Interactive Canvas',
                value: 'Open your track on [internship.rolenest.in](https://internship.rolenest.in), download your daily SOP PDF, and complete the milestone requirements.',
              },
              {
                name: '2️⃣ In-Browser Test Runner',
                value: 'Pass the interactive code canvas test suite before pushing to GitHub.',
              },
              {
                name: '3️⃣ GitHub PR & Auditor',
                value: 'Push your commits to your GitHub repo and submit your commit/PR URL in `#daily-standup-deliverables`. The automated auditor will verify your diff and post your passing score.',
              },
            ],
            footer: { text: 'Standups evaluate daily at 10:00 AM & 06:00 PM IST' },
          },
        ],
      });
    } else if (cmdName === 'rules') {
      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: '📜 RoleNest Academic Rules & Code of Conduct',
            description: 'Governed under AICTE / UGC 4-Credit Practical Framework guidelines.',
            color: 0xf59e0b,
            fields: [
              {
                name: '🛡️ Minimum Milestone Attendance',
                value: 'You must successfully complete and pass code audits for at least **22 out of 28 Days (80% threshold)** to qualify for your Certificate & NOC.',
              },
              {
                name: '🚫 Plagiarism & Commit Bot Prohibition',
                value: 'Automated fake commit scripts or copied repositories will result in immediate disqualification and revocation of all credentials.',
              },
              {
                name: '🤝 Professional Etiquette',
                value: 'Maintain professional, respectful discourse across all discussion and voice channels.',
              },
            ],
            footer: { text: 'RoleNest Academic Council' },
          },
        ],
      });
    } else if (cmdName === 'helpdesk') {
      await respondInteraction(interactionId, interactionToken, {
        flags: 64,
        embeds: [
          {
            title: '🆘 Faculty Mentorship & Technical Support',
            description: 'Stuck on an environment issue or architectural blocker?',
            color: 0x8b5cf6,
            fields: [
              {
                name: '💬 Code Troubleshooting',
                value: 'Post your error stack traces and logs in `#code-troubleshooting`. Mentors monitor this channel continuously.',
              },
              {
                name: '🎙️ Live Voice Office Hours',
                value: 'Join the `🎙️ Mentor Standup & Office Hours` voice channel during daily standups (10:00 AM & 6:00 PM IST) for live debugging.',
              },
              {
                name: '📧 Urgent Escalation',
                value: 'Contact `divyanshujethi@gmail.com` or tag `@👑 Faculty Mentor / Lead` in `#code-troubleshooting`.',
              },
            ],
          },
        ],
      });
    }
  }
}

connectGateway();
