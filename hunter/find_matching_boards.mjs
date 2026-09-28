const candidates = [
  // Greenhouse
  { name: "Postman", type: "greenhouse", tokens: ["postmanlabs", "postman", "postmaninc"] },
  { name: "BrowserStack", type: "greenhouse", tokens: ["browserstack", "browserstackcareers", "browserstacksoftware"] },
  { name: "Hasura", type: "greenhouse", tokens: ["hasura", "hasurainc"] },
  { name: "Urban Company", type: "greenhouse", tokens: ["urbancompany", "urbanclap"] },
  { name: "Atlassian", type: "greenhouse", tokens: ["atlassian", "atlassiancareers"] },
  { name: "Uber", type: "greenhouse", tokens: ["uber", "ubercareers"] },
  { name: "Twilio", type: "greenhouse", tokens: ["twilio"] },
  { name: "GitLab", type: "greenhouse", tokens: ["gitlab"] },
  { name: "GitHub", type: "greenhouse", tokens: ["github"] },
  { name: "Stripe", type: "greenhouse", tokens: ["stripe"] },
  { name: "Coinbase", type: "greenhouse", tokens: ["coinbase"] },
  { name: "Instawork", type: "greenhouse", tokens: ["instawork"] },
  { name: "CleverTap", type: "greenhouse", tokens: ["clevertap"] },
  { name: "MoEngage", type: "greenhouse", tokens: ["moengage"] },
  { name: "Acko", type: "greenhouse", tokens: ["acko", "ackotechnology"] },
  { name: "Licious", type: "greenhouse", tokens: ["licious"] },
  { name: "Khatabook", type: "greenhouse", tokens: ["khatabook"] },
  { name: "Shiprocket", type: "greenhouse", tokens: ["shiprocket"] },
  { name: "PhysicsWallah", type: "greenhouse", tokens: ["physicswallah", "pw"] },
  { name: "LeadSquared", type: "greenhouse", tokens: ["leadsquared"] },
  { name: "Darwinbox", type: "greenhouse", tokens: ["darwinbox"] },
  { name: "Delhivery", type: "greenhouse", tokens: ["delhivery"] },
  { name: "Unacademy", type: "greenhouse", tokens: ["unacademy"] },

  // Ashby
  { name: "Hasura", type: "ashby", tokens: ["hasura"] },
  { name: "BrowserStack", type: "ashby", tokens: ["browserstack"] },
  { name: "Zepto", type: "ashby", tokens: ["zepto", "zeptonow", "kirana-kart"] },
  { name: "LlamaIndex", type: "ashby", tokens: ["llamaindex", "run-llama"] },
  { name: "Cursor", type: "ashby", tokens: ["anysphere", "cursor"] },
  { name: "MindsDB", type: "ashby", tokens: ["mindsdb"] },
  { name: "Cohere", type: "ashby", tokens: ["cohere"] },
  { name: "Scale AI", type: "ashby", tokens: ["scaleapi", "scale"] },
  { name: "Ramp", type: "ashby", tokens: ["ramp"] },
  { name: "Brex", type: "ashby", tokens: ["brex"] },
  { name: "Deel", type: "ashby", tokens: ["deel"] },
  { name: "Vercel", type: "ashby", tokens: ["vercel"] },
  { name: "Supabase", type: "ashby", tokens: ["supabase"] },

  // Lever
  { name: "Postman", type: "lever", tokens: ["postman"] },
  { name: "Swiggy", type: "lever", tokens: ["swiggy"] },
  { name: "Zepto", type: "lever", tokens: ["zepto", "zeptonow"] },
  { name: "Meesho", type: "lever", tokens: ["meesho"] },
  { name: "Zomato", type: "lever", tokens: ["zomato"] },
  { name: "InCred", type: "lever", tokens: ["incred"] },
  { name: "PocketFM", type: "lever", tokens: ["pocketfm"] },
  { name: "KukuFM", type: "lever", tokens: ["kuku-fm", "kukufm"] },
  { name: "Scaler", type: "lever", tokens: ["scaler", "interviewbit"] },
  { name: "Lenskart", type: "lever", tokens: ["lenskart"] },
  { name: "Nykaa", type: "lever", tokens: ["nykaa"] },
  { name: "Ola", type: "lever", tokens: ["olacabs", "ola"] },
  { name: "PhonePe", type: "lever", tokens: ["phonepe"] },
  { name: "Airtel", type: "lever", tokens: ["airtel"] },
  { name: "Jio", type: "lever", tokens: ["reliance-jio", "jio"] },
  { name: "Unacademy", type: "lever", tokens: ["unacademy"] }
];

async function check() {
  const matches = [];
  for (const c of candidates) {
    for (const t of c.tokens) {
      let url = "";
      if (c.type === "ashby") url = `https://api.ashbyhq.com/posting-api/job-board/${t}`;
      if (c.type === "greenhouse") url = `https://boards-api.greenhouse.io/v1/boards/${t}/jobs`;
      if (c.type === "lever") url = `https://api.lever.co/v0/postings/${t}?mode=json`;

      try {
        const res = await fetch(url, { headers: { "User-Agent": "RoleNest-Checker/1.0" } });
        if (res.ok) {
          const d = await res.json();
          const count = Array.isArray(d) ? d.length : (d.jobs ? d.jobs.length : 0);
          if (count > 0) {
            console.log(`[MATCH] ${c.name} (${c.type}): token "${t}" has ${count} jobs`);
            matches.push({ name: c.name, type: c.type, token: t, count });
            break;
          }
        }
      } catch (e) {}
    }
  }
  console.log("\n--- FOUND MATCHES ---");
  console.log(JSON.stringify(matches, null, 2));
}

check();
