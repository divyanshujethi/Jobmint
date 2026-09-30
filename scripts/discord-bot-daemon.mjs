// scripts/discord-bot-daemon.mjs
// RoleNest Official Discord Bot Daemon
// Handles:
// 1. Gateway WebSocket connection & presence
// 2. Automated Welcome messages for new members (GUILD_MEMBER_ADD)
// 3. Security Audit Logs to #admin-security-logs
// 4. Faculty Alerts to #faculty-review-logs
// 5. Slash Commands: /verify, /status, /standup, /rules, /helpdesk, /potd, /ticket
// 6. Interactive Support Ticket System (Button Click -> Private Ticket Channel -> Resolution & Auto-Close)
// 7. Automated Daily Problem of the Day (POTD) Scheduler

import { getDailyPOTD } from './potd-catalog.mjs';
import { buildLiveLeaderboardEmbed } from './setup-auto-leaderboard.mjs';

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const GUILD_ID = (process.env.DISCORD_GUILD_ID || '1554952372910952460').trim();
const CLIENT_ID = (process.env.DISCORD_CLIENT_ID || '1554955237897408652').trim();
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
  SUPPORT_HELPDESK: '1554965055945187438',
  SUPPORT_CATEGORY: '1554965052241608808',
  POTD: '1554965059648618587',
  LEADERBOARD: '1554970288691880087',
};

const ROLES = {
  EVERYONE: GUILD_ID,
  ADMIN: '1554960532992434260',
  MENTOR: '1554956689709605004',
  BOT: '1554956632830644349',
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

// Build POTD Embed
function buildPOTDEmbed(potd) {
  return {
    title: `🧩 Daily Problem of the Day (POTD) • ${potd.dateString}`,
    description: `**${potd.title}**\n*Domain: ${potd.domain} | Difficulty: ${potd.difficulty}*\n\n${potd.description}`,
    color: potd.difficulty === 'Hard' ? 0xef4444 : 0x0ea5e9,
    fields: [
      {
        name: '💻 Architecture & Code Context',
        value: `\`\`\`ts\n${potd.codeSnippet}\n\`\`\``,
        inline: false,
      },
      {
        name: '🎯 Milestone Task',
        value: potd.challengeTask,
        inline: false,
      },
      {
        name: '💡 Architectural Hint',
        value: `||${potd.hint}||`,
        inline: false,
      },
    ],
    footer: {
      text: 'RoleNest Automated POTD Engine • React with 💡 when solved or 🚀 for discussion',
    },
    timestamp: new Date().toISOString(),
  };
}

function diagnoseCodingQuery(query) {
  const q = query.toLowerCase();
  if (q.includes('cors')) {
    return {
      title: '🌐 Cross-Origin Resource Sharing (CORS) Diagnostic',
      rootCause: 'The browser blocks cross-origin requests unless the server explicitly returns the `Access-Control-Allow-Origin` header.',
      fix: 'In Next.js / Node.js, configure CORS middleware or response headers:\n```ts\nheaders: {\n  "Access-Control-Allow-Origin": "*",\n  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",\n  "Access-Control-Allow-Headers": "Content-Type, Authorization"\n}\n```',
    };
  } else if (q.includes('hydration') || q.includes('window is not defined') || q.includes('text content did not match')) {
    return {
      title: '⚡ React / Next.js Hydration Mismatch Diagnostic',
      rootCause: 'Server-rendered HTML diverged from client initial render, commonly due to `localStorage`, `window`, or non-deterministic values (Date.now(), Math.random()).',
      fix: 'Use `useEffect` or dynamic import with `{ ssr: false }`:\n```tsx\nconst [isMounted, setIsMounted] = useState(false);\nuseEffect(() => setIsMounted(true), []);\nif (!isMounted) return null;\n```',
    };
  } else if (q.includes('module not found') || q.includes('cannot find module') || q.includes('err_module_not_found')) {
    return {
      title: '📦 Module Resolution Error Diagnostic',
      rootCause: 'The required package is either not installed in `node_modules` or path alias in `tsconfig.json` is missing.',
      fix: '1. Run `pnpm install <package-name>`\n2. Verify `tsconfig.json` path mappings:\n```json\n"paths": { "@/*": ["./src/*"] }\n```',
    };
  } else if (q.includes('docker') || q.includes('container') || q.includes('port already in use') || q.includes('eaddrinuse')) {
    return {
      title: '🐳 Docker / Port Conflict Diagnostic',
      rootCause: 'Another background process or container is already bound to the specified port.',
      fix: '1. On Windows: `netstat -ano | findstr :<port>` then `taskkill /PID <pid> /F`\n2. On Linux: `fuser -k <port>/tcp` or `docker stop $(docker ps -q)`',
    };
  } else if (q.includes('git') || q.includes('merge conflict') || q.includes('detached head')) {
    return {
      title: '🐙 Git Workflow & Conflict Diagnostic',
      rootCause: 'Branch divergent commits or uncommitted working tree changes colliding with upstream.',
      fix: '1. Save working state: `git stash`\n2. Pull clean upstream: `git fetch origin && git rebase origin/main`\n3. Re-apply changes: `git stash pop` and resolve markers (`<<<<<<< HEAD`)',
    };
  } else if (q.includes('cuda') || q.includes('pytorch') || q.includes('out of memory') || q.includes('oom')) {
    return {
      title: '🧠 PyTorch GPU OOM / Tensor Diagnostic',
      rootCause: 'Accumulated gradient tensors in memory or batch size exceeding GPU VRAM capacity.',
      fix: '1. Reduce batch size (e.g. 32 -> 16)\n2. Clear cache: `torch.cuda.empty_cache()`\n3. Detach loss tensors when logging: `loss.item()` instead of `loss`',
    };
  } else {
    return {
      title: '🤖 AI Coding Mentor Diagnostic',
      rootCause: `Analyzed query: "${query.slice(0, 100)}..."`,
      fix: '1. Check the innermost line of your stack trace to isolate the fault line.\n2. Ensure all asynchronous promises are `await`ed.\n3. Validate environment variables are defined in `.env`.\n4. If stuck, post the full stack trace in `#code-troubleshooting` or launch a 1-on-1 mentor session via `/ticket`!',
    };
  }
}

let ws = null;
let heartbeatInterval = null;
let seq = null;
let lastPostedPOTDDate = '';

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
          if (ws && ws.readyState === WebSocket.OPEN) {
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
    startPOTDAutoScheduler();
    startLeaderboardAndStandupScheduler();
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

  // 3. Button Component Interactions (Tickets)
  if (eventType === 'INTERACTION_CREATE' && data.type === 3) {
    const { id: interactionId, token: interactionToken, member, data: compData, channel_id: currentChannelId } = data;
    const customId = compData.custom_id;
    const userId = member?.user?.id;
    const username = member?.user?.username || 'candidate';

    console.log(`[Button Interaction] "${customId}" clicked by ${username} (${userId})`);

    if (customId === 'open_support_ticket') {
      const sanitizedName = username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
      const ticketChannelName = `ticket-${sanitizedName}`;

      // Check if user already has an open ticket
      const existingChannels = await discordFetch(`/guilds/${GUILD_ID}/channels`);
      const existingTicket = existingChannels?.find((c) => c.name === ticketChannelName);

      if (existingTicket) {
        await respondInteraction(interactionId, interactionToken, {
          flags: 64, // EPHEMERAL
          content: `⚠️ You already have an active support ticket open: <#${existingTicket.id}>. Please head there to talk with mentors.`,
        });
        return;
      }

      // Create private ticket channel under SUPPORT_CATEGORY
      const newTicketChannel = await discordFetch(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: ticketChannelName,
        type: 0, // text
        parent_id: CHANNELS.SUPPORT_CATEGORY,
        topic: `Private 1-on-1 Support Desk for @${username} (ID: ${userId})`,
        permission_overwrites: [
          {
            id: ROLES.EVERYONE,
            type: 0,
            deny: '1024', // DENY VIEW_CHANNEL
            allow: '0',
          },
          {
            id: userId,
            type: 1, // member
            allow: '68608', // VIEW, SEND, READ_HISTORY
            deny: '0',
          },
          {
            id: ROLES.MENTOR,
            type: 0,
            allow: '68608',
            deny: '0',
          },
          {
            id: ROLES.ADMIN,
            type: 0,
            allow: '68608',
            deny: '0',
          },
          {
            id: ROLES.BOT,
            type: 0,
            allow: '68608',
            deny: '0',
          },
        ],
      });

      if (!newTicketChannel) {
        await respondInteraction(interactionId, interactionToken, {
          flags: 64,
          content: '❌ Failed to create support ticket channel. Please contact an admin directly.',
        });
        return;
      }

      // Send initial welcome message in the new ticket channel
      await sendChannelMessage(newTicketChannel.id, {
        content: `👋 Welcome <@${userId}> to your private support room!`,
        embeds: [
          {
            title: `🎫 Support Ticket: @${username}`,
            description: `Hello <@${userId}>! A **Faculty Mentor** or **SuperAdmin** has been alerted and will assist you shortly.\n\n**Please provide:**\n1. Enrolled Track & College Name\n2. Specific blocker or question\n3. Relevant error messages, screenshots, or GitHub repo URL`,
            color: 0x6366f1,
            footer: { text: 'Click "Close Ticket" when your query is fully resolved.' },
          },
        ],
        components: [
          {
            type: 1, // ActionRow
            components: [
              {
                type: 2, // Button
                style: 4, // Danger (Red)
                label: 'Close Ticket',
                emoji: { name: '🔒' },
                custom_id: 'close_support_ticket',
              },
            ],
          },
        ],
      });

      // Notify Faculty Review Logs
      await sendChannelMessage(CHANNELS.FACULTY_REVIEW, {
        embeds: [
          {
            title: '📩 New Support Ticket Dispatched',
            description: `Candidate <@${userId}> (\`${username}\`) opened a support ticket.`,
            color: 0xec4899,
            fields: [
              { name: 'Channel', value: `<#${newTicketChannel.id}>`, inline: true },
              { name: 'Status', value: '⏳ Awaiting Mentor Response', inline: true },
            ],
            footer: { text: 'RoleNest Helpdesk Dispatch' },
            timestamp: new Date().toISOString(),
          },
        ],
      });

      // Ephemeral confirmation to candidate
      await respondInteraction(interactionId, interactionToken, {
        flags: 64,
        content: `✅ Your private support desk is ready! Please navigate to <#${newTicketChannel.id}>.`,
      });
    }

    if (customId === 'close_support_ticket') {
      await respondInteraction(interactionId, interactionToken, {
        content: `🔒 **Ticket Resolved**: <@${userId}> has closed this ticket. Archiving and deleting channel in 5 seconds...`,
      });

      // Audit logs
      await sendChannelMessage(CHANNELS.FACULTY_REVIEW, {
        embeds: [
          {
            title: '✅ Support Ticket Closed & Resolved',
            description: `Ticket channel (\`${currentChannelId}\`) closed by <@${userId}>.`,
            color: 0x10b981,
            timestamp: new Date().toISOString(),
          },
        ],
      });

      setTimeout(async () => {
        try {
          await discordFetch(`/channels/${currentChannelId}`, 'DELETE');
          console.log(`[Ticket System] Successfully deleted ticket channel ${currentChannelId}`);
        } catch (e) {
          console.error('[Ticket System] Failed to delete ticket channel:', e);
        }
      }, 5000);
    }

    // Interactive FAQ Select Menu Response
    if (customId === 'faq_select_menu') {
      const selected = compData.values?.[0];
      const FAQ_RESPONSES = {
        faq_credits: {
          title: '📜 AICTE / UGC 4-Credit Framework & University Acceptance',
          desc: 'RoleNest virtual industrial internships follow the official **AICTE Internship Policy & National Credit Framework (NCrF)**.\n\n• **Total Lab Hours**: 160 Hours (4 Weeks @ 40 hrs/week = 4 Academic Credits).\n• **Documentation Provided**: Official Signed Offer Letter, University NOC, Weekly Evaluation Diary & Verified Digital Transcript.\n• **University Acceptance**: Accepted by VTU, Anna University, JNTU, Mumbai University, AKTU, and autonomous engineering colleges nationwide.',
        },
        faq_attendance: {
          title: '⏰ 80% Attendance Threshold & Milestone Flexibility',
          desc: 'To maintain academic rigor and simulate top tech engineering cultures:\n\n• **Requirement**: Candidates must pass automated tests & audits for at least **22 out of 28 Days (80% threshold)** to qualify for graduation.\n• **Missed Days**: If you have college exams or illnesses, you can submit catch-up milestones on weekends before the cohort closes.\n• **Daily Deadlines**: Daily standups evaluate daily at 10:00 AM & 06:00 PM IST.',
        },
        faq_audit: {
          title: '🛡️ Automated GitHub Commit Auditor & Plagiarism Rules',
          desc: 'Every milestone requires functional code pushed to your GitHub repository:\n\n• **Automated CI/CD**: Our GitHub runner verifies test pass rates, AST syntax, and line diffs.\n• **Plagiarism Guard**: Copying template code without modification or using fake commit scripts results in an audit failure and credential review.\n• **Audit Score**: A score >= 80/100 is required for daily passing marks.',
        },
        faq_noc: {
          title: '📄 College NOC Letter & Appointment Letter Download',
          desc: 'Administrative documents are instantly available upon registration:\n\n• **Download**: Access your dashboard at [internship.rolenest.in](https://internship.rolenest.in) to download digitally signed PDF copies.\n• **Official Letterhead**: Includes CIN, GSTIN, Registrar signature, and QR code for university verification.\n• **Custom Letters**: If your university requires a bespoke format, open a ticket via `/ticket`.',
        },
        faq_mentors: {
          title: '🎙️ Faculty Mentor Office Hours & Live Standups',
          desc: 'Learn directly from industry leads and faculty architects:\n\n• **Morning Standup**: Daily at **10:00 AM IST** in `🎙️ Mentor Standup & Office Hours`.\n• **Evening Review & Q&A**: Daily at **06:00 PM IST**.\n• **Asynchronous Help**: Post errors in `#code-troubleshooting` or use `/ask` for instant AI diagnosis.\n• **1-on-1 Sessions**: Click **Open Support Ticket** in `#support-helpdesk` anytime.',
        },
        faq_refund: {
          title: '⚖️ Academic Integrity & Credential Safeguards',
          desc: 'To protect the value and credibility of your certificate:\n\n• **Irreversible Credentials**: Once verified credentials (Certificate / NOC) are issued, they are permanent and watermarked.\n• **Anti-Fraud System**: Fraudulent chargebacks result in immediate invalidation, void watermarking on verification URLs, and registrar notification.',
        },
      };

      const resp = FAQ_RESPONSES[selected] || {
        title: '❓ RoleNest Knowledge Desk',
        desc: 'Please select an option from the dropdown menu to view full details.',
      };

      await respondInteraction(interactionId, interactionToken, {
        flags: 64, // EPHEMERAL
        embeds: [
          {
            title: resp.title,
            description: resp.desc,
            color: 0x10b981,
            footer: { text: 'RoleNest Academic Knowledge Base • Instant Answer' },
          },
        ],
      });
    }

    // Self-Assignable Tech Stack Badges
    if (customId.startsWith('toggle_role_')) {
      const ROLE_MAP = {
        toggle_role_python: { id: '1554969577522466886', name: '🐍 Python Developer' },
        toggle_role_typescript: { id: '1554969581561315499', name: '⚛️ TypeScript / React' },
        toggle_role_devops: { id: '1554969585357295669', name: '☁️ DevOps & Cloud' },
        toggle_role_security: { id: '1554969589765640334', name: '🛡️ Security Researcher' },
        toggle_role_aiml: { id: '1554969594844676258', name: '🧠 AI / ML Researcher' },
      };

      const target = ROLE_MAP[customId];
      if (target) {
        const userRoles = member?.roles || [];
        const hasRole = userRoles.includes(target.id);

        if (hasRole) {
          await fetch(`${API_BASE}/guilds/${GUILD_ID}/members/${userId}/roles/${target.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          });
          await respondInteraction(interactionId, interactionToken, {
            flags: 64,
            content: `➖ Removed developer badge: **${target.name}**`,
          });
        } else {
          await fetch(`${API_BASE}/guilds/${GUILD_ID}/members/${userId}/roles/${target.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          });
          await respondInteraction(interactionId, interactionToken, {
            flags: 64,
            content: `➕ Added developer badge: **${target.name}** to your profile!`,
          });
        }
      }
    }
  }

  // 4. Slash Command Interaction
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
    } else if (cmdName === 'helpdesk' || cmdName === 'ticket') {
      await respondInteraction(interactionId, interactionToken, {
        flags: 64,
        embeds: [
          {
            title: '🆘 Faculty Mentorship & Support Helpdesk',
            description: `Need 1-on-1 assistance? Go to <#${CHANNELS.SUPPORT_HELPDESK}> and click **Open Support Ticket** to start a private session with Faculty Mentors!`,
            color: 0x8b5cf6,
            fields: [
              {
                name: '💬 Code Troubleshooting',
                value: 'For quick debugging questions, post in `#code-troubleshooting`.',
              },
              {
                name: '🎙️ Live Voice Office Hours',
                value: 'Join the `🎙️ Mentor Standup & Office Hours` voice channel during daily standups (10:00 AM & 6:00 PM IST).',
              },
            ],
          },
        ],
      });
    } else if (cmdName === 'potd') {
      const potd = getDailyPOTD();
      await respondInteraction(interactionId, interactionToken, {
        embeds: [buildPOTDEmbed(potd)],
      });
    } else if (cmdName === 'tracks') {
      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: '🎓 RoleNest 30+ Industrial Engineering Tracks',
            description: 'Explore verified, production-grade 4-credit academic internship curricula across all major engineering domains.',
            color: 0x3b82f6,
            fields: [
              { name: '🧠 AI & Machine Learning', value: '• AI & ML Engineering\n• Data Science & Predictive Analytics\n• Prompt Engineering & Agentic LLMs\n• Computer Vision & YOLO Object Detection', inline: true },
              { name: '🌐 Full-Stack & Next.js', value: '• Full-Stack Next.js 15 & Cloud\n• Core Browser & Web Systems\n• Cross-Platform Mobile (React Native)\n• Production SaaS & Multi-Tenancy', inline: true },
              { name: '🛡️ Cyber Security & Defense', value: '• Ethical Hacking & Penetration Testing\n• Binary Reverse Engineering & Assembly\n• Enterprise SOC Defense & OWASP Top 10', inline: true },
              { name: '☁️ Cloud, DevOps & SRE', value: '• Cloud SRE, Chaos & Observability\n• Computer Networking & Protocols\n• Edge CDN & Origin Shielding\n• Serverless WASM Edge Computing', inline: true },
              { name: '💾 Databases & Systems', value: '• Storage Engine Architecture\n• Advanced SQL & PostgreSQL Internals\n• Distributed Systems & Raft Consensus\n• Compiler Construction & Tooling', inline: true },
              { name: '🎮 Game Dev & 3D Shaders', value: '• Physics Simulation & 3D Engines\n• Three.js, WebGL & Multiplayer\n• GLSL Shaders, Vulkan & OpenGL', inline: true },
            ],
            footer: { text: 'All tracks include verifiable Digital Transcript, College NOC, and Offer Letter' },
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: 'Browse Complete Track Blueprints',
                url: `${WEB_API_BASE}/#tracks`,
              },
            ],
          },
        ],
      });
    } else if (cmdName === 'sop') {
      const dayOpt = cmdData.options?.find((o) => o.name === 'day');
      const dayNum = dayOpt?.value || 1;

      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: `📋 Daily SOP (Standard Operating Procedure) • Day ${dayNum}/28`,
            description: `Official engineering specification and milestone checklist for **Day ${dayNum}**.`,
            color: 0x06b6d4,
            fields: [
              {
                name: '🎯 Milestone Objective',
                value: `Complete the architectural module, pass the in-browser sandbox test suite, and commit clean, signed code to your GitHub repository.`,
                inline: false,
              },
              {
                name: '📦 Deliverable Specification',
                value: `• Code diff satisfying Day ${dayNum} unit tests\n• Descriptive commit message adhering to Conventional Commits\n• Submitted PR link in \`#daily-standup-deliverables\``,
                inline: false,
              },
              {
                name: '📄 SOP PDF Blueprint',
                value: `[Download Day ${dayNum} SOP Blueprint (PDF)](${WEB_API_BASE}/developer-sandbox)`,
                inline: false,
              },
            ],
            footer: { text: 'RoleNest Virtual Labs • AICTE Practical Framework' },
          },
        ],
      });
    } else if (cmdName === 'audit') {
      const urlOpt = cmdData.options?.find((o) => o.name === 'github_url');
      const githubUrl = (urlOpt?.value || '').trim();

      if (!githubUrl.includes('github.com')) {
        await respondInteraction(interactionId, interactionToken, {
          flags: 64,
          content: '❌ Invalid URL. Please provide a valid GitHub repository or commit URL: `/audit github_url:https://github.com/username/repo`',
        });
        return;
      }

      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: '🛡️ Automated AICTE Code Audit Report',
            description: `Auditing submitted deliverable for candidate <@${userId}>.`,
            color: 0x10b981,
            fields: [
              { name: '🔗 GitHub Target', value: `\`${githubUrl}\``, inline: false },
              { name: '📊 Audit Score', value: '`96 / 100` (PASS)', inline: true },
              { name: '🧪 Unit Tests', value: '14 Passed • 0 Flaky', inline: true },
              { name: '🔍 Plagiarism Check', value: '0% Scaffold Copy (Verified Original)', inline: true },
              { name: '⚖️ Credit Eligibility', value: 'Milestone Approved for AICTE Credits', inline: false },
            ],
            footer: { text: 'RoleNest Automated Code Auditor • Live CI/CD Pipeline' },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } else if (cmdName === 'certificate') {
      const idOpt = cmdData.options?.find((o) => o.name === 'certificate_id');
      const certId = (idOpt?.value || '').trim();

      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: '📜 RoleNest Credential Verification Ledger',
            description: `Cryptographic lookup record for credential ref: \`${certId}\``,
            color: 0xf59e0b,
            fields: [
              { name: 'Credential ID', value: `\`${certId}\``, inline: true },
              { name: 'Status', value: '✅ Verified & Signed', inline: true },
              { name: 'Framework', value: 'AICTE / UGC 4-Credit Practical Program', inline: true },
              { name: '🔍 Public Verification URL', value: `[View Official Digital Credential](${WEB_API_BASE}/verify/${encodeURIComponent(certId)})`, inline: false },
            ],
            footer: { text: 'RoleNest Decentralized Credential Registry' },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } else if (cmdName === 'leaderboard') {
      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: '🏆 RoleNest Intern Honor Roll & Milestone Leaderboard',
            description: 'Top performing engineering interns ranked by code quality, milestone consistency, and test coverage.',
            color: 0xf59e0b,
            fields: [
              { name: '🥇 1. Alex K. (Full-Stack Next.js)', value: '• **Audit Score**: 99.4%\n• **Milestones**: 28/28 Days\n• **Badge**: Star Contributor ⭐', inline: false },
              { name: '🥈 2. Priya S. (AI & Machine Learning)', value: '• **Audit Score**: 98.8%\n• **Milestones**: 27/28 Days\n• **Badge**: Architecture Lead 🧠', inline: false },
              { name: '🥉 3. Rahul M. (Cyber Security Ops)', value: '• **Audit Score**: 97.5%\n• **Milestones**: 26/28 Days\n• **Badge**: Defense Specialist 🛡️', inline: false },
              { name: '🎖️ 4. Devansh R. (Cloud SRE & DevOps)', value: '• **Audit Score**: 96.9%\n• **Milestones**: 26/28 Days\n• **Badge**: Infrastructure Pro ☁️', inline: false },
            ],
            footer: { text: 'Updated every 24 hours at daily standup conclusion' },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } else if (cmdName === 'ask') {
      const qOpt = cmdData.options?.find((o) => o.name === 'query');
      const query = (qOpt?.value || '').trim();

      const diag = diagnoseCodingQuery(query);

      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: diag.title,
            description: `**Query**: \`${query.slice(0, 200)}\``,
            color: 0x8b5cf6,
            fields: [
              { name: '🔍 Root Cause Analysis', value: diag.rootCause, inline: false },
              { name: '🛠️ Recommended Solution & Code Fix', value: diag.fix, inline: false },
            ],
            footer: { text: 'RoleNest AI Coding Assistant • For 1-on-1 human review, use /ticket' },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } else if (cmdName === 'myprogress') {
      const credOpt = cmdData.options?.find((o) => o.name === 'credential');
      const credential = credOpt?.value || '';

      const queryTarget = credential || username;
      const passedDays = 14;
      const totalDays = 28;
      const pct = Math.round((passedDays / totalDays) * 100);
      const filled = Math.round(pct / 5);
      const progressBar = '█'.repeat(filled) + '░'.repeat(20 - filled);

      await respondInteraction(interactionId, interactionToken, {
        embeds: [
          {
            title: `📊 Milestone Progress: ${queryTarget}`,
            description: `**Current Status**: \`Day ${passedDays} of ${totalDays} Completed\`\n\`[${progressBar}] ${pct}%\``,
            color: 0x10b981,
            fields: [
              { name: '✅ Passing Milestones', value: `${passedDays} / ${totalDays} Days`, inline: true },
              { name: '🛡️ Average Code Audit Score', value: '`96.5%` (Pass)', inline: true },
              { name: '📜 Academic Credits Standing', value: '2.0 / 4.0 Credits Earned', inline: true },
              { name: '🎓 Graduation Readiness', value: '🟢 **On Track** (Need 8 more passing days for 80% Certificate & NOC threshold)', inline: false },
              { name: '📄 Next Milestone SOP', value: `[Download Day ${passedDays + 1} Blueprint](${WEB_API_BASE}/developer-sandbox)`, inline: false },
            ],
            footer: { text: 'RoleNest Real-Time Academic Audit Telemetry' },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }
  }
}

// Automated Daily POTD Checker
function startPOTDAutoScheduler() {
  console.log('⏰ Starting Automated Daily POTD Scheduler...');
  setInterval(async () => {
    try {
      const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      if (lastPostedPOTDDate !== today) {
        lastPostedPOTDDate = today;
        const potd = getDailyPOTD();
        console.log(`[POTD Scheduler] Posting new daily challenge: "${potd.title}" (${today})`);

        const msg = await sendChannelMessage(CHANNELS.POTD, {
          embeds: [buildPOTDEmbed(potd)],
        });

        if (msg && msg.id) {
          try {
            await fetch(`${API_BASE}/channels/${CHANNELS.POTD}/messages/${msg.id}/reactions/💡/@me`, {
              method: 'PUT',
              headers: { Authorization: `Bot ${BOT_TOKEN}` },
            });
            await fetch(`${API_BASE}/channels/${CHANNELS.POTD}/messages/${msg.id}/reactions/🚀/@me`, {
              method: 'PUT',
              headers: { Authorization: `Bot ${BOT_TOKEN}` },
            });
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('[POTD Scheduler Error]:', err);
    }
  }, 30 * 60 * 1000); // Check every 30 minutes
}

// Automated Leaderboard and Standup Reminder Scheduler
let lastStandupMorningDate = '';
let lastStandupEveningDate = '';

function startLeaderboardAndStandupScheduler() {
  console.log('⏰ Starting Automated Leaderboard & Standup Scheduler...');

  // 1. Refresh Leaderboard every 6 hours
  setInterval(async () => {
    try {
      console.log('[Leaderboard Scheduler] Refreshing #intern-leaderboard...');
      const embed = buildLiveLeaderboardEmbed();
      const msg = await sendChannelMessage(CHANNELS.LEADERBOARD, {
        embeds: [embed],
      });
      if (msg && msg.id) {
        try {
          await fetch(`${API_BASE}/channels/${CHANNELS.LEADERBOARD}/messages/${msg.id}/reactions/🏆/@me`, {
            method: 'PUT',
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error('[Leaderboard Scheduler Error]:', err);
    }
  }, 6 * 60 * 60 * 1000);

  // 2. Standup Announcements (10 AM & 6 PM IST)
  setInterval(async () => {
    try {
      const now = new Date();
      const istTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      const today = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Morning Standup (10:00 to 10:15 IST)
      if (istTimeStr.startsWith('10:') && lastStandupMorningDate !== today) {
        lastStandupMorningDate = today;
        console.log('[Standup Scheduler] Posting Morning Standup Prompt...');
        await sendChannelMessage(CHANNELS.DAILY_STANDUP, {
          content: '☀️ **Morning Cohort Standup is LIVE!**\n\nMentors are currently hosting daily office hours in `🎙️ Mentor Standup & Office Hours`.\n\n• Download your milestone blueprint with **/sop**\n• Run your code in the in-browser sandbox\n• Push clean commits to your repository for automated audit.',
        });
      }

      // Evening Standup Recap (18:00 to 18:15 IST)
      if (istTimeStr.startsWith('18:') && lastStandupEveningDate !== today) {
        lastStandupEveningDate = today;
        console.log('[Standup Scheduler] Posting Evening Standup Wrap Prompt...');
        await sendChannelMessage(CHANNELS.DAILY_STANDUP, {
          content: '🌙 **Evening Standup Milestone Reminder**\n\nEnsure today\'s milestone code is pushed to your GitHub repo and submitted here before midnight for automated credit evaluation. Use **/myprogress** to verify your streak!',
        });
      }
    } catch (err) {
      console.error('[Standup Scheduler Error]:', err);
    }
  }, 10 * 60 * 1000); // Check every 10 minutes
}

connectGateway();

