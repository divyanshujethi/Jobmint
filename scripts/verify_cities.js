const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

async function run() {
  const total = await sql`SELECT count(*) FROM jobs`;
  console.log('TOTAL JOBS IN DATABASE:', total[0].count);

  const cities = [
    'Chandigarh',
    'Mohali',
    'Gurugram',
    'Sonipat',
    'Panchkula',
    'Ludhiana',
    'Jalandhar',
    'Noida',
    'New Delhi',
    'Dehradun',
    'Solan',
    'Kangra',
    'Shimla',
  ];

  console.log('\n--- VERIFIED TECH JOBS BY CITY ---');
  for (const c of cities) {
    const pattern = '%' + c + '%';
    const r = await sql`SELECT count(*) FROM jobs WHERE location ILIKE ${pattern}`;
    console.log(`${c.padEnd(15)} : ${r[0].count} jobs`);
  }
  const delhiJobs = await sql`SELECT count(*) FROM jobs WHERE location ILIKE '%Delhi%'`;
  console.log(`${'Delhi (all)'.padEnd(15)} : ${delhiJobs[0].count} jobs`);
  const sampleDelhi = await sql`SELECT id, title, location FROM jobs WHERE location ILIKE '%Delhi%' LIMIT 3`;
  console.table(sampleDelhi);

  const regional = await sql`
    SELECT count(*) FROM jobs 
    WHERE location ILIKE '%Punjab%'
       OR location ILIKE '%Haryana%'
       OR location ILIKE '%Himachal%'
       OR location ILIKE '%Uttarakhand%'
       OR location ILIKE '%Delhi%'
  `;
  console.log('\nTOTAL NORTH INDIA REGIONAL JOBS:', regional[0].count);

  await sql.end();
}

run().catch(console.error);
