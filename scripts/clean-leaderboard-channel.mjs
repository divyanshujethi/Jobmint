// scripts/clean-leaderboard-channel.mjs
// Bulk cleans all duplicate messages in #intern-leaderboard, leaving exactly ONE clean, pinned embed

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || '').trim();
const CHANNEL_ID = '1554970288691880087';
const API_BASE = 'https://discord.com/api/v10';

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
    throw new Error(`Discord API ${method} ${endpoint} (${res.status}): ${err}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function run() {
  console.log('Fetching messages in #intern-leaderboard...');
  const msgs = await discordFetch(`/channels/${CHANNEL_ID}/messages?limit=100`);
  if (!Array.isArray(msgs) || msgs.length === 0) {
    console.log('Channel is already clean (0 messages).');
    return;
  }

  console.log(`Found ${msgs.length} messages in #intern-leaderboard.`);
  if (msgs.length <= 1) {
    console.log('Only 1 message exists. No duplicate cleanup needed.');
    return;
  }

  // Keep the oldest message (last item in msgs array), bulk delete all others
  const keepMsg = msgs[msgs.length - 1];
  const toDelete = msgs.filter((m) => m.id !== keepMsg.id).map((m) => m.id);

  console.log(`Keeping message ${keepMsg.id}. Bulk deleting ${toDelete.length} duplicates...`);
  
  // Bulk delete allows up to 100 messages at once
  while (toDelete.length > 0) {
    const chunk = toDelete.splice(0, 100);
    if (chunk.length === 1) {
      await discordFetch(`/channels/${CHANNEL_ID}/messages/${chunk[0]}`, 'DELETE');
    } else {
      await discordFetch(`/channels/${CHANNEL_ID}/messages/bulk-delete`, 'POST', {
        messages: chunk,
      });
    }
    console.log(`Deleted batch of ${chunk.length} messages.`);
  }

  console.log('Done! Checking remaining messages...');
  const remaining = await discordFetch(`/channels/${CHANNEL_ID}/messages?limit=10`);
  console.log(`Remaining messages in #intern-leaderboard: ${remaining.length}`);
}

run().catch(console.error);
