const postgres = require('/opt/jobmint/app/node_modules/.pnpm/postgres@3.4.9/node_modules/postgres');
const sql = postgres('postgresql://jobmint:JobMintSecurePass2026!@localhost:5432/jobmint_prod');

async function run() {
  const tricity = await sql`
    SELECT j.id, j.title, c.name as company, j.location, j.work_mode, j.salary_or_stipend 
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.location ILIKE '%Chandigarh%' 
       OR j.location ILIKE '%Tricity%' 
       OR j.location ILIKE '%Mohali%' 
       OR j.location ILIKE '%Panchkula%'
       OR j.location ILIKE '%Dehradun%'
    ORDER BY j.created_at DESC
  `;
  console.log('=== TRICITY & DEHRADUN VERIFIED JOBS ===');
  console.log('Count:', tricity.length);
  console.table(tricity);
  await sql.end();
}

run().catch(console.error);
