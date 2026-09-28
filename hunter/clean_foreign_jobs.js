const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

async function main() {
  const locs = await sql`
    SELECT location, work_mode, count(*) as c 
    FROM jobs 
    GROUP BY location, work_mode 
    ORDER BY c DESC 
    LIMIT 50
  `;
  console.log("=== Top Locations in DB ===");
  console.table(locs);

  // Check if any on-site non-Indian locations still exist
  const nonIndianOnsite = await sql`
    SELECT j.id, c.name, j.title, j.location, j.work_mode
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.work_mode != 'REMOTE'
      AND j.location NOT ILIKE '%India%'
      AND j.location NOT ILIKE '%Bengaluru%'
      AND j.location NOT ILIKE '%Bangalore%'
      AND j.location NOT ILIKE '%Gurgaon%'
      AND j.location NOT ILIKE '%Gurugram%'
      AND j.location NOT ILIKE '%Noida%'
      AND j.location NOT ILIKE '%Delhi%'
      AND j.location NOT ILIKE '%Hyderabad%'
      AND j.location NOT ILIKE '%Pune%'
      AND j.location NOT ILIKE '%Mumbai%'
      AND j.location NOT ILIKE '%Chennai%'
      AND j.location NOT ILIKE '%Chandigarh%'
      AND j.location NOT ILIKE '%Mohali%'
      AND j.location NOT ILIKE '%Panchkula%'
      AND j.location NOT ILIKE '%Dehradun%'
      AND j.location NOT ILIKE '%Ahmedabad%'
      AND j.location NOT ILIKE '%Kolkata%'
      AND j.location NOT ILIKE '%Kochi%'
      AND j.location NOT ILIKE '%Jaipur%'
      AND j.location NOT ILIKE '%Indore%'
    LIMIT 30
  `;
  console.log(`\nNon-Indian Onsite Jobs remaining: ${nonIndianOnsite.length}`);
  if (nonIndianOnsite.length > 0) {
    console.table(nonIndianOnsite);
    const ids = nonIndianOnsite.map(x => x.id);
    await sql`DELETE FROM job_skills WHERE job_id = ANY(${ids})`;
    await sql`DELETE FROM applications WHERE job_id = ANY(${ids})`;
    await sql`DELETE FROM jobs WHERE id = ANY(${ids})`;
    console.log(`Deleted ${ids.length} more foreign on-site jobs.`);
  }

  process.exit(0);
}

main().catch(console.error);
