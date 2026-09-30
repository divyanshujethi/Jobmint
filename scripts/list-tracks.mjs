import fs from 'fs';

const dataCode = fs.readFileSync('apps/web/lib/bootcamp-data.ts', 'utf8');
const catCode = fs.readFileSync('apps/web/lib/bootcamp-tracks-catalog.ts', 'utf8');
const allCode = dataCode + '\n' + catCode;

// Match tracks by looking for `slug: "..."` and `domain: "..."`
const trackMatches = [...allCode.matchAll(/slug:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?domain:\s*["']([^"']+)["']/g)];
const uniqueTracks = new Map();
for (const m of trackMatches) {
  if (!uniqueTracks.has(m[1])) {
    uniqueTracks.set(m[1], { slug: m[1], title: m[2], domain: m[3] });
  }
}

console.log(`Found ${uniqueTracks.size} unique internship tracks across the platform:`);
let idx = 1;
const domainGroups = new Map();
for (const [slug, t] of uniqueTracks.entries()) {
  const d = t.domain.trim();
  if (!domainGroups.has(d)) domainGroups.set(d, []);
  domainGroups.get(d).push(t);
  console.log(`${idx++}. [${slug}] ${t.title} (${d})`);
}

console.log('\n--- Domain Groups (Total ' + domainGroups.size + ' domains) ---');
for (const [dom, list] of domainGroups.entries()) {
  console.log(`• ${dom}: ${list.length} tracks`);
}
