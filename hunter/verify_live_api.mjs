async function verify() {
  const res = await fetch("https://rolenest.in/api/jobs");
  if (!res.ok) {
    console.error("HTTP error:", res.status);
    return;
  }
  const data = await res.json();
  const jobs = data.jobs || [];
  console.log("Total jobs returned by API:", jobs.length);

  const tricityJobs = jobs.filter(j => 
    j.location.toLowerCase().includes("chandigarh") || 
    j.location.toLowerCase().includes("dehradun") ||
    j.location.toLowerCase().includes("mohali")
  );
  console.log("Tricity & Dehradun jobs returned:", tricityJobs.length);
  console.table(tricityJobs.map(j => ({ title: j.title, company: j.companyName, location: j.location, workMode: j.workMode, stipend: j.salaryOrStipend })));

  const foreignJobs = jobs.filter(j => {
    const loc = j.location.toLowerCase();
    const mode = (j.workMode || "").toUpperCase();
    const isIndia = loc.includes("india") || loc.includes("bengaluru") || loc.includes("bangalore") ||
      loc.includes("delhi") || loc.includes("noida") || loc.includes("gurgaon") || loc.includes("gurugram") ||
      loc.includes("hyderabad") || loc.includes("pune") || loc.includes("mumbai") || loc.includes("chennai") ||
      loc.includes("chandigarh") || loc.includes("mohali") || loc.includes("panchkula") || loc.includes("dehradun") ||
      loc.includes("ahmedabad") || loc.includes("kolkata") || loc.includes("lucknow") || loc.includes("surat");
    const isRemote = mode.includes("REMOTE") || loc.includes("remote") || loc.includes("anywhere") || loc.includes("worldwide");
    return !isIndia && !isRemote;
  });

  console.log("\nForeign on-site jobs count:", foreignJobs.length);
  if (foreignJobs.length > 0) {
    console.table(foreignJobs.map(j => ({ title: j.title, company: j.companyName, location: j.location })));
  }
}

verify().catch(console.error);
