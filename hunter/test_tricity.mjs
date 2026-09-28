async function testTricity() {
  const testUrls = [
    { name: "Grazitti-Lever", url: "https://api.lever.co/v0/postings/grazitti?mode=json" },
    { name: "Grazitti-GH", url: "https://boards-api.greenhouse.io/v1/boards/grazitti/jobs" },
    { name: "Grazitti-Ashby", url: "https://api.ashbyhq.com/posting-api/job-board/grazitti" },
    { name: "NetSolutions-Lever", url: "https://api.lever.co/v0/postings/netsolutions?mode=json" },
    { name: "NetSolutions-GH", url: "https://boards-api.greenhouse.io/v1/boards/netsolutions/jobs" },
    { name: "ChicMic-Lever", url: "https://api.lever.co/v0/postings/chicmic?mode=json" },
    { name: "Evon-Lever", url: "https://api.lever.co/v0/postings/evontech?mode=json" },
    { name: "Evon-GH", url: "https://boards-api.greenhouse.io/v1/boards/evontechnologies/jobs" },
    { name: "CodeBrew-Lever", url: "https://api.lever.co/v0/postings/codebrewlabs?mode=json" },
    { name: "Jungleworks-Lever", url: "https://api.lever.co/v0/postings/jungleworks?mode=json" },
    { name: "Quark-GH", url: "https://boards-api.greenhouse.io/v1/boards/quark/jobs" },
    { name: "Quark-Lever", url: "https://api.lever.co/v0/postings/quark?mode=json" },
    { name: "Infosys-Lever", url: "https://api.lever.co/v0/postings/infosys?mode=json" },
    { name: "Naggaro-GH", url: "https://boards-api.greenhouse.io/v1/boards/nagarro/jobs" },
  ];
  for (const t of testUrls) {
    try {
      const res = await fetch(t.url, { headers: { "User-Agent": "RoleNest-Checker/1.0" } });
      console.log(t.name, res.status);
      if (res.ok) {
        const data = await res.json();
        const count = Array.isArray(data) ? data.length : (data.jobs ? data.jobs.length : 0);
        console.log("-> MATCH", t.name, count);
      }
    } catch (e) {
      console.log(t.name, "ERR", e.message);
    }
  }
}
testTricity();
