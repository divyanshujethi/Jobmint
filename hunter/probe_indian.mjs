const probes = [
  // Lever
  { name: "Urban Company", type: "lever", tokens: ["urbancompany", "urbanclap"] },
  { name: "Dream11", type: "lever", tokens: ["dream11", "dreamsports"] },
  { name: "Games24x7", type: "lever", tokens: ["games24x7"] },
  { name: "MPL", type: "lever", tokens: ["mpl", "mobilepremierleague"] },
  { name: "Rapido", type: "lever", tokens: ["rapido"] },
  { name: "Ather Energy", type: "lever", tokens: ["atherenergy", "ather"] },
  { name: "Ola", type: "lever", tokens: ["ola", "olacabs", "olaelectric"] },
  { name: "Delhivery", type: "lever", tokens: ["delhivery"] },
  { name: "Shadowfax", type: "lever", tokens: ["shadowfax", "shadowfax-technologies"] },
  { name: "Shiprocket", type: "lever", tokens: ["shiprocket", "bigfootretail"] },
  { name: "CleverTap", type: "lever", tokens: ["clevertap", "wizrocket"] },
  { name: "MoEngage", type: "lever", tokens: ["moengage"] },
  { name: "BrowserStack", type: "lever", tokens: ["browserstack"] },
  { name: "Postman", type: "lever", tokens: ["postman", "postmanlabs"] },
  { name: "Hasura", type: "lever", tokens: ["hasura"] },
  { name: "HackerRank", type: "lever", tokens: ["hackerrank"] },
  { name: "CoinSwitch", type: "lever", tokens: ["coinswitch", "coinswitchkuber"] },
  { name: "CoinDCX", type: "lever", tokens: ["coindcx", "nebulisio"] },
  { name: "Dukaan", type: "lever", tokens: ["dukaan", "mydukaan"] },
  { name: "Jar", type: "lever", tokens: ["jar", "myjar"] },
  { name: "Jupiter", type: "lever", tokens: ["jupiter", "amica-financial"] },
  { name: "Fi Money", type: "lever", tokens: ["fi", "epifi", "epi-fi"] },
  { name: "INDmoney", type: "lever", tokens: ["indmoney", "finzoom"] },
  { name: "PayU", type: "lever", tokens: ["payu", "payuindia"] },
  { name: "Pine Labs", type: "lever", tokens: ["pinelabs"] },
  { name: "BharatPe", type: "lever", tokens: ["bharatpe", "resilient"] },
  { name: "PhonePe", type: "lever", tokens: ["phonepe"] },
  { name: "Zepto", type: "lever", tokens: ["zepto", "zeptonow", "kiranakart"] },
  { name: "Blinkit", type: "lever", tokens: ["blinkit", "grofers"] },
  { name: "Khatabook", type: "lever", tokens: ["khatabook", "kyte"] },
  { name: "Spinny", type: "lever", tokens: ["spinny"] },
  { name: "Apna", type: "lever", tokens: ["apna", "apnaco"] },
  { name: "Pratilipi", type: "lever", tokens: ["pratilipi"] },

  // Greenhouse
  { name: "Urban Company", type: "greenhouse", tokens: ["urbancompany", "urbanclap"] },
  { name: "Dream11", type: "greenhouse", tokens: ["dream11", "dreamsports"] },
  { name: "Games24x7", type: "greenhouse", tokens: ["games24x7"] },
  { name: "MPL", type: "greenhouse", tokens: ["mpl", "mobilepremierleague"] },
  { name: "Rapido", type: "greenhouse", tokens: ["rapido"] },
  { name: "Ather Energy", type: "greenhouse", tokens: ["atherenergy", "ather"] },
  { name: "Ola", type: "greenhouse", tokens: ["ola", "olacabs", "olaelectric"] },
  { name: "Delhivery", type: "greenhouse", tokens: ["delhivery"] },
  { name: "Shadowfax", type: "greenhouse", tokens: ["shadowfax"] },
  { name: "Shiprocket", type: "greenhouse", tokens: ["shiprocket"] },
  { name: "CleverTap", type: "greenhouse", tokens: ["clevertap"] },
  { name: "MoEngage", type: "greenhouse", tokens: ["moengage"] },
  { name: "BrowserStack", type: "greenhouse", tokens: ["browserstack"] },
  { name: "Hasura", type: "greenhouse", tokens: ["hasura"] },
  { name: "CoinSwitch", type: "greenhouse", tokens: ["coinswitch", "coinswitchkuber"] },
  { name: "CoinDCX", type: "greenhouse", tokens: ["coindcx"] },
  { name: "Dukaan", type: "greenhouse", tokens: ["dukaan", "mydukaan"] },
  { name: "INDmoney", type: "greenhouse", tokens: ["indmoney"] },
  { name: "PayU", type: "greenhouse", tokens: ["payu"] },
  { name: "Pine Labs", type: "greenhouse", tokens: ["pinelabs"] },
  { name: "BharatPe", type: "greenhouse", tokens: ["bharatpe"] },
  { name: "PhonePe", type: "greenhouse", tokens: ["phonepe"] },
  { name: "Zepto", type: "greenhouse", tokens: ["zepto", "zeptonow"] },
  { name: "Blinkit", type: "greenhouse", tokens: ["blinkit", "grofers"] },
  { name: "Spinny", type: "greenhouse", tokens: ["spinny"] },
  { name: "Apna", type: "greenhouse", tokens: ["apna", "apnaco"] },
  { name: "Pratilipi", type: "greenhouse", tokens: ["pratilipi"] },

  // Ashby
  { name: "Urban Company", type: "ashby", tokens: ["urbancompany"] },
  { name: "Ather Energy", type: "ashby", tokens: ["atherenergy"] },
  { name: "CoinSwitch", type: "ashby", tokens: ["coinswitch"] },
  { name: "CoinDCX", type: "ashby", tokens: ["coindcx"] },
  { name: "Dukaan", type: "ashby", tokens: ["dukaan"] },
  { name: "INDmoney", type: "ashby", tokens: ["indmoney"] },
  { name: "Pine Labs", type: "ashby", tokens: ["pinelabs"] },
  { name: "BharatPe", type: "ashby", tokens: ["bharatpe"] },
  { name: "PhonePe", type: "ashby", tokens: ["phonepe"] },
  { name: "Zepto", type: "ashby", tokens: ["zepto"] },
  { name: "Blinkit", type: "ashby", tokens: ["blinkit"] },
  { name: "Spinny", type: "ashby", tokens: ["spinny"] },
  { name: "Apna", type: "ashby", tokens: ["apna"] },
  { name: "Khatabook", type: "ashby", tokens: ["khatabook"] },
  { name: "CleverTap", type: "ashby", tokens: ["clevertap"] },
  { name: "MoEngage", type: "ashby", tokens: ["moengage"] },
  { name: "BrowserStack", type: "ashby", tokens: ["browserstack"] },
  { name: "Hasura", type: "ashby", tokens: ["hasura"] },
  { name: "Postman", type: "ashby", tokens: ["postman"] },
  { name: "Zomato", type: "ashby", tokens: ["zomato"] },
  { name: "Swiggy", type: "ashby", tokens: ["swiggy"] }
];

async function check() {
  const matches = [];
  for (const c of probes) {
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
            console.log(`[FOUND!] ${c.name} (${c.type}): token "${t}" has ${count} jobs`);
            matches.push({ name: c.name, type: c.type, token: t, count });
            break;
          }
        }
      } catch (e) {}
    }
  }
  console.log("\n--- FOUND INDIAN MATCHES ---");
  console.log(JSON.stringify(matches, null, 2));
}

check();
