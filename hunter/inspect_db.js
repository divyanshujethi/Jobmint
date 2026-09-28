const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

async function main() {
  const jobsCount = await sql`SELECT count(*) FROM jobs`;
  const companiesCount = await sql`SELECT count(*) FROM companies`;
  
  console.log('=== Database Summary ===');
  console.log('Total Jobs in DB:', jobsCount[0].count);
  console.log('Total Companies in DB:', companiesCount[0].count);

  const sampleCompanies = await sql`SELECT id, name, logo_url, website, location FROM companies ORDER BY name ASC LIMIT 25`;
  console.log('\n=== Sample 25 Companies in DB ===');
  console.table(sampleCompanies);

  const indianCompanies = await sql`
    SELECT id, name, logo_url, website, location 
    FROM companies 
    WHERE location ILIKE '%India%' 
       OR location ILIKE '%Bengaluru%' 
       OR location ILIKE '%Bangalore%' 
       OR location ILIKE '%Noida%' 
       OR location ILIKE '%Gurgaon%' 
       OR location ILIKE '%Hyderabad%'
       OR location ILIKE '%Pune%'
       OR location ILIKE '%Mumbai%'
       OR name ILIKE '%Razorpay%'
       OR name ILIKE '%Paytm%'
       OR name ILIKE '%Groww%'
       OR name ILIKE '%CRED%'
       OR name ILIKE '%Swiggy%'
       OR name ILIKE '%Zomato%'
       OR name ILIKE '%Flipkart%'
       OR name ILIKE '%InMobi%'
    ORDER BY name ASC 
    LIMIT 30
  `;
  console.log('\n=== Indian Companies in DB ===');
  console.table(indianCompanies);

  const indianJobs = await sql`
    SELECT j.id, j.title, c.name as company, j.location, j.source, j.created_at 
    FROM jobs j 
    LEFT JOIN companies c ON j.company_id = c.id 
    WHERE j.location ILIKE '%India%' 
       OR j.location ILIKE '%Bengaluru%' 
       OR j.location ILIKE '%Bangalore%' 
       OR j.location ILIKE '%Noida%' 
       OR j.location ILIKE '%Gurgaon%' 
       OR j.location ILIKE '%Hyderabad%'
       OR j.location ILIKE '%Pune%'
       OR j.location ILIKE '%Mumbai%'
    ORDER BY j.created_at DESC 
    LIMIT 20
  `;
  console.log('\n=== Recent 20 Indian Jobs in DB ===');
  console.table(indianJobs);

  try {
    const truthCount = await sql`SELECT count(*) FROM truth_teller_telemetry`;
    console.log('\n=== Truth Teller Telemetry Count ===', truthCount[0].count);
  } catch (e) {
    console.log('\n=== Truth Teller Telemetry Table missing or error ===', e.message);
  }

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
