const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

const INDIAN_CITIES_REGEX = /\b(india|bengaluru|bangalore|delhi|gurgaon|gurugram|noida|hyderabad|pune|mumbai|chennai|chandigarh|mohali|panchkula|dehradun|ahmedabad|kolkata|kochi|jaipur|indore|lucknow|bhopal|coimbatore|surat|vadodara|nagpur|bhubaneswar|visakhapatnam|trivandrum|thiruvananthapuram)\b/i;

const REMOTE_REGEX = /\b(remote|worldwide|anywhere|work from home|home based - worldwide|remote - global|remote, india)\b/i;

const EXCLUDE_NON_TECH_TITLES = [
  /\baccountant\b/i,
  /\baccounts payable\b/i,
  /\baccounts receivable\b/i,
  /\bclerk\b/i,
  /\boffice administrator\b/i,
  /\boffice manager\b/i,
  /\bfinancial partnerships\b/i,
  /\bpartnerships manager\b/i,
  /\bpartner manager\b/i,
  /\bchannel partner\b/i,
  /\bartist & label\b/i,
  /\bcontent marketing\b/i,
  /\bmarketing manager\b/i,
  /\bmarketing lead\b/i,
  /\brecruiter\b/i,
  /\btalent acquisition\b/i,
  /\baccount executive\b/i,
  /\bsales representative\b/i,
  /\bbusiness development representative\b/i,
  /\blegal counsel\b/i,
  /\bparalegal\b/i,
  /\bcommunications lead\b/i,
  /\bbrand manager\b/i,
  /\bhuman resources\b/i,
  /\bpayroll\b/i,
];

async function main() {
  console.log("=== Purging Irrelevant & Foreign On-Site Jobs ===");
  const allJobs = await sql`
    SELECT id, title, location, work_mode 
    FROM jobs
  `;
  console.log(`Analyzing ${allJobs.length} jobs in database...`);

  const toDelete = [];
  const toMakeRemote = [];

  for (const j of allJobs) {
    const title = j.title || "";
    const loc = j.location || "";
    const lowerLoc = loc.toLowerCase();

    // 1. Check non-tech titles
    let isNonTech = false;
    for (const pat of EXCLUDE_NON_TECH_TITLES) {
      if (pat.test(title)) {
        isNonTech = true;
        break;
      }
    }
    if (isNonTech) {
      toDelete.push({ id: j.id, reason: `Non-tech role: ${title}` });
      continue;
    }

    // 2. Check location eligibility
    const isIndia = INDIAN_CITIES_REGEX.test(loc);
    const isRemote = REMOTE_REGEX.test(loc) || j.work_mode === 'REMOTE';

    if (!isIndia && !isRemote) {
      // Foreign on-site (e.g. New York, Toronto, San Jose, London, Paris, Stockholm)
      toDelete.push({ id: j.id, reason: `Foreign on-site: ${loc} (${title})` });
      continue;
    }

    // 3. If it says Home based - Worldwide or Remote, ensure work_mode is REMOTE
    if (REMOTE_REGEX.test(loc) && j.work_mode !== 'REMOTE') {
      toMakeRemote.push(j.id);
    }
  }

  console.log(`Identified ${toDelete.length} jobs to remove.`);
  console.log(`Identified ${toMakeRemote.length} jobs to update work_mode -> REMOTE.`);

  if (toDelete.length > 0) {
    const ids = toDelete.map(x => x.id);
    console.log("Sample deletions:", toDelete.slice(0, 10));
    await sql`DELETE FROM job_skills WHERE job_id = ANY(${ids})`;
    await sql`DELETE FROM applications WHERE job_id = ANY(${ids})`;
    const delRes = await sql`DELETE FROM jobs WHERE id = ANY(${ids})`;
    console.log(`Deleted ${delRes.count} jobs.`);
  }

  if (toMakeRemote.length > 0) {
    await sql`
      UPDATE jobs 
      SET work_mode = 'REMOTE', updated_at = NOW() 
      WHERE id = ANY(${toMakeRemote})
    `;
    console.log(`Updated ${toMakeRemote.length} jobs to REMOTE work_mode.`);
  }

  const finalCount = await sql`SELECT count(*) FROM jobs`;
  console.log(`\nVerified Clean Tech Jobs Remaining: ${finalCount[0].count}`);

  process.exit(0);
}

main().catch(console.error);
