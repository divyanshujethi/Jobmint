const boards = [
  // Ashby
  { name: "Zepto", type: "ashby", token: "zepto", website: "https://zeptonow.com" },
  { name: "PostHog", type: "ashby", token: "posthog", website: "https://posthog.com" },
  { name: "Linear", type: "ashby", token: "linear", website: "https://linear.app" },
  { name: "Cursor", type: "ashby", token: "anysphere", website: "https://cursor.com" },
  { name: "Appsmith", type: "ashby", token: "appsmith", website: "https://appsmith.com" },
  { name: "Vellum", type: "ashby", token: "vellum", website: "https://vellum.ai" },
  { name: "Perplexity", type: "ashby", token: "perplexity", website: "https://perplexity.ai" },
  { name: "Replit", type: "ashby", token: "replit", website: "https://replit.com" },
  { name: "ElevenLabs", type: "ashby", token: "elevenlabs", website: "https://elevenlabs.io" },
  { name: "Together AI", type: "ashby", token: "together-ai", website: "https://together.ai" },
  { name: "Modal", type: "ashby", token: "modal", website: "https://modal.com" },
  { name: "LangChain", type: "ashby", token: "langchain", website: "https://langchain.com" },

  // Greenhouse
  { name: "Swiggy", type: "greenhouse", token: "swiggy", website: "https://swiggy.com" },
  { name: "Meesho", type: "greenhouse", token: "meesho", website: "https://meesho.io" },
  { name: "Postman", type: "greenhouse", token: "postman", website: "https://postman.com" },
  { name: "BrowserStack", type: "greenhouse", token: "browserstack", website: "https://browserstack.com" },
  { name: "Hasura", type: "greenhouse", token: "hasura", website: "https://hasura.io" },
  { name: "Urban Company", type: "greenhouse", token: "urbancompany", website: "https://urbancompany.com" },
  { name: "Cars24", type: "greenhouse", token: "cars24", website: "https://cars24.com" },
  { name: "Rebel Foods", type: "greenhouse", token: "rebelfoods", website: "https://rebelfoods.com" },
  { name: "Zeta", type: "greenhouse", token: "zeta", website: "https://zeta.tech" },
  { name: "MPL", type: "greenhouse", token: "mpl", website: "https://mpl.live" },
  { name: "Atlassian", type: "greenhouse", token: "atlassian", website: "https://atlassian.com" },
  { name: "Uber", type: "greenhouse", token: "uber", website: "https://uber.com" },
  { name: "Rubrik", type: "greenhouse", token: "rubrik", website: "https://rubrik.com" },
  { name: "Cohesity", type: "greenhouse", token: "cohesity", website: "https://cohesity.com" },
  { name: "Dunzo", type: "greenhouse", token: "dunzo", website: "https://dunzo.com" },
  { name: "Rapido", type: "greenhouse", token: "rapido", website: "https://rapido.bike" },
  { name: "Spinny", type: "greenhouse", token: "spinny", website: "https://spinny.com" },
  { name: "Pratilipi", type: "greenhouse", token: "pratilipi", website: "https://pratilipi.com" },

  // Lever
  { name: "Khatabook", type: "lever", token: "khatabook", website: "https://khatabook.com" },
  { name: "Fi Money", type: "lever", token: "epi-fi", website: "https://fi.money" },
  { name: "Jupiter", type: "lever", token: "jupiter", website: "https://jupiter.money" },
  { name: "CleverTap", type: "lever", token: "clevertap", website: "https://clevertap.com" },
  { name: "MoEngage", type: "lever", token: "moengage", website: "https://moengage.com" },
  { name: "HackerRank", type: "lever", token: "hackerrank", website: "https://hackerrank.com" },
  { name: "HackerEarth", type: "lever", token: "hackerearth", website: "https://hackerearth.com" },
  { name: "Shiprocket", type: "lever", token: "shiprocket", website: "https://shiprocket.in" },
  { name: "Shadowfax", type: "lever", token: "shadowfax", website: "https://shadowfax.in" },
  { name: "Classplus", type: "lever", token: "classplus", website: "https://classplus.co" },
  { name: "Loconav", type: "lever", token: "loconav", website: "https://loconav.com" },
  { name: "Cuemath", type: "lever", token: "cuemath", website: "https://cuemath.com" },
  { name: "Zupee", type: "lever", token: "zupee", website: "https://zupee.com" },
  { name: "Bikayi", type: "lever", token: "bikayi", website: "https://bikayi.com" },
  { name: "CoinDCX", type: "lever", token: "coindcx", website: "https://coindcx.com" },
  { name: "Jar", type: "lever", token: "myjar", website: "https://myjar.app" },
  { name: "KukuFM", type: "lever", token: "kukufm", website: "https://kukufm.com" }
];

async function check() {
  const valid = [];
  for (const b of boards) {
    let url = "";
    if (b.type === "ashby") url = `https://api.ashbyhq.com/posting-api/job-board/${b.token}`;
    if (b.type === "greenhouse") url = `https://boards-api.greenhouse.io/v1/boards/${b.token}/jobs`;
    if (b.type === "lever") url = `https://api.lever.co/v0/postings/${b.token}?mode=json`;

    try {
      const res = await fetch(url, { headers: { "User-Agent": "RoleNest-Checker/1.0" } });
      if (res.ok) {
        const d = await res.json();
        const count = Array.isArray(d) ? d.length : (d.jobs ? d.jobs.length : 0);
        console.log(`[VALID] ${b.name} (${b.type}, token: ${b.token}): ${count} jobs`);
        if (count > 0) valid.push({ ...b, count });
      } else {
        console.log(`[FAIL ${res.status}] ${b.name} (${b.type})`);
      }
    } catch (e) {
      console.log(`[ERR] ${b.name}: ${e.message}`);
    }
  }
  console.log(`\n--- SUMMARY: ${valid.length} valid boards found ---`);
  console.log(JSON.stringify(valid.map(v => ({ companyName: v.name, type: v.type, token: v.token, website: v.website, count: v.count })), null, 2));
}

check();
