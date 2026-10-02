const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

async function run() {
  const total = await sql`SELECT count(*) FROM jobs`;
  console.log('TOTAL JOBS IN DATABASE:', total[0].count);

  const regionalGroups = {
    'File 1 - Punjab & Haryana': ['Chandigarh', 'Mohali', 'Gurugram', 'Sonipat', 'Panchkula', 'Ludhiana', 'Jalandhar'],
    'File 2 - Uttarakhand, Himachal, Delhi': ['Noida', 'New Delhi', 'Dehradun', 'Solan', 'Kangra', 'Shimla'],
    'File 3 - Gujarat & Rajasthan': ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'Jaipur', 'Jodhpur', 'Kota', 'Udaipur'],
    'File 4 - Uttar Pradesh & Bihar': ['Greater Noida', 'Lucknow', 'Kanpur', 'Varanasi', 'Prayagraj', 'Meerut', 'Patna', 'Darbhanga'],
    'File 5 - Madhya Pradesh & Maharashtra': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Rewa', 'Pune', 'Mumbai', 'Navi Mumbai', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad'],
    'File 6 - 7 Sisters, WB & Sikkim': ['Guwahati', 'Shillong', 'Kohima', 'Imphal', 'Agartala', 'Aizawl', 'Itanagar', 'Gangtok', 'Kolkata', 'Siliguri', 'Durgapur', 'Kharagpur'],
    'File 7 - Jharkhand, Chhattisgarh & Odisha': ['Ranchi', 'Jamshedpur', 'Deoghar', 'Bokaro', 'Dhanbad', 'Nava Raipur', 'Bhilai', 'Raipur', 'Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Balasore', 'Puri'],
  };

  console.log('\n--- VERIFIED TECH JOBS BY CITY & REGION ---');
  let allFound = 0;
  for (const [groupName, cities] of Object.entries(regionalGroups)) {
    console.log(`\n▶ ${groupName}:`);
    for (const c of cities) {
      let r;
      if (c === 'Noida') {
        r = await sql`SELECT count(*) FROM jobs WHERE location ILIKE '%Noida%' AND location NOT ILIKE '%Greater Noida%'`;
      } else if (c === 'Mumbai') {
        r = await sql`SELECT count(*) FROM jobs WHERE location ILIKE '%Mumbai%' AND location NOT ILIKE '%Navi Mumbai%'`;
      } else if (c === 'Raipur') {
        r = await sql`SELECT count(*) FROM jobs WHERE location ILIKE '%Raipur%' AND location NOT ILIKE '%Nava Raipur%'`;
      } else {
        const pattern = '%' + c + '%';
        r = await sql`SELECT count(*) FROM jobs WHERE location ILIKE ${pattern}`;
      }
      const count = Number(r[0].count);
      allFound += count;
      console.log(`  ${c.padEnd(18)} : ${count} jobs`);
    }
  }

  const verified = await sql`
    SELECT count(*) FROM jobs j 
    JOIN companies c ON j.company_id = c.id 
    WHERE c.is_verified = true
  `;
  console.log('\nTOTAL VERIFIED JOBS:', verified[0].count);
  console.log('TOTAL REGIONAL AUDITED JOBS:', allFound);

  await sql.end();
}

run().catch(console.error);
