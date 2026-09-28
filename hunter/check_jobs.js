const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

async function run() {
  const [j] = await sql`SELECT count(*) FROM jobs`;
  const [foreign] = await sql`
    SELECT count(*) FROM jobs 
    WHERE location NOT ILIKE '%India%' 
      AND location NOT ILIKE '%Remote%' 
      AND location NOT ILIKE '%Anywhere%'
      AND location NOT ILIKE '%Bengaluru%'
      AND location NOT ILIKE '%Bangalore%'
      AND location NOT ILIKE '%Delhi%'
      AND location NOT ILIKE '%Noida%'
      AND location NOT ILIKE '%Gurgaon%'
      AND location NOT ILIKE '%Gurugram%'
      AND location NOT ILIKE '%Hyderabad%'
      AND location NOT ILIKE '%Pune%'
      AND location NOT ILIKE '%Mumbai%'
      AND location NOT ILIKE '%Chennai%'
      AND location NOT ILIKE '%Chandigarh%'
      AND location NOT ILIKE '%Mohali%'
      AND location NOT ILIKE '%Panchkula%'
      AND location NOT ILIKE '%Dehradun%'
      AND location NOT ILIKE '%Kolkata%'
      AND location NOT ILIKE '%Ahmedabad%'
      AND location NOT ILIKE '%Jaipur%'
      AND location NOT ILIKE '%Indore%'
      AND location NOT ILIKE '%Kochi%'
  `;
  console.log('TOTAL JOBS:', j.count);
  console.log('FOREIGN ON-SITE JOBS:', foreign.count);
  if (parseInt(foreign.count) > 0) {
    const list = await sql`
      SELECT id, title, location, work_mode FROM jobs 
      WHERE location NOT ILIKE '%India%' 
        AND location NOT ILIKE '%Remote%' 
        AND location NOT ILIKE '%Anywhere%'
        AND location NOT ILIKE '%Bengaluru%'
        AND location NOT ILIKE '%Bangalore%'
        AND location NOT ILIKE '%Delhi%'
        AND location NOT ILIKE '%Noida%'
        AND location NOT ILIKE '%Gurgaon%'
        AND location NOT ILIKE '%Gurugram%'
        AND location NOT ILIKE '%Hyderabad%'
        AND location NOT ILIKE '%Pune%'
        AND location NOT ILIKE '%Mumbai%'
        AND location NOT ILIKE '%Chennai%'
        AND location NOT ILIKE '%Chandigarh%'
        AND location NOT ILIKE '%Mohali%'
        AND location NOT ILIKE '%Panchkula%'
        AND location NOT ILIKE '%Dehradun%'
        AND location NOT ILIKE '%Kolkata%'
        AND location NOT ILIKE '%Ahmedabad%'
        AND location NOT ILIKE '%Jaipur%'
        AND location NOT ILIKE '%Indore%'
        AND location NOT ILIKE '%Kochi%'
      LIMIT 10
    `;
    console.table(list);
  }
  await sql.end();
}

run().catch(console.error);
