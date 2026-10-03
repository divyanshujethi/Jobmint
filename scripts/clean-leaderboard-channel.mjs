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

  // Keep the oldest message (last item in msgs array), delete all others
  const keepMsg = msgs[msgs.length - 1];
  const toDelete = msgs.filter((m) => m.id !== keepMsg.id).map((m) => m.id);

  console.log(`Keeping message ${keepMsg.id}. Deleting ${toDelete.length} duplicates...`);
  
  for (const id of toDelete) {
    try {
      await discordFetch(`/channels/${CHANNEL_ID}/messages/${id}`, 'DELETE');
      console.log(`Deleted message ${id}`);
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.warn(`Failed to delete ${id}:`, err.message);
    }
  }

  console.log('Done! Checking remaining messages...');
  const remaining = await discordFetch(`/channels/${CHANNEL_ID}/messages?limit=10`);
  console.log(`Remaining messages in #intern-leaderboard: ${remaining.length}`);
}

run().catch(console.error);
