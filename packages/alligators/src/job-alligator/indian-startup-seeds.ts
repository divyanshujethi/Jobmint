/**
 * RoleNest - Curated Indian Startup & Tech Company Seed Registry
 *
 * Covers 100+ high-conviction Indian technology companies across:
 * - FinTech & WealthTech
 * - SaaS, Cloud & Developer Tools
 * - Artificial Intelligence & GenAI Labs
 * - E-Commerce, Quick-Commerce & Logistics
 * - Cybersecurity & Privacy
 * - Product, Gaming & Consumer Tech
 */

export interface StartupSeed {
  name: string;
  domain: string;
  careersUrl?: string;
  knownAts?: {
    type: "greenhouse" | "lever" | "ashby" | "smartrecruiters" | "workable" | "bamboohr" | "breezy" | "recruitee" | "workday" | "custom";
    token: string;
  };
  sector: "Fintech" | "SaaS" | "DevTools" | "AI/ML" | "Ecommerce" | "Cybersecurity" | "Product" | "Logistics";
  tier: "UNICORN" | "SOONICORN" | "SERIES_A_B" | "BOOTSTRAPPED" | "PUBLIC";
  location: string;
}

export const INDIAN_STARTUP_SEEDS: StartupSeed[] = [
  // ==========================================
  // 1. Flagship Pilot Cohort (Explicitly requested)
  // ==========================================
  {
    name: "Razorpay",
    domain: "razorpay.com",
    careersUrl: "https://razorpay.com/careers/",
    knownAts: { type: "greenhouse", token: "razorpaysoftwareprivatelimited" },
    sector: "Fintech",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "CRED",
    domain: "cred.club",
    careersUrl: "https://careers.cred.club/",
    knownAts: { type: "lever", token: "cred" },
    sector: "Fintech",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Postman",
    domain: "postman.com",
    careersUrl: "https://www.postman.com/company/careers/open-positions/",
    knownAts: { type: "workday", token: "postman.wd108.myworkdayjobs.com/careers" },
    sector: "DevTools",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Meesho",
    domain: "meesho.io",
    careersUrl: "https://jobs.meesho.com/",
    knownAts: { type: "lever", token: "meesho" },
    sector: "Ecommerce",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "PhonePe",
    domain: "phonepe.com",
    careersUrl: "https://www.phonepe.com/careers/job-openings/",
    knownAts: { type: "custom", token: "phonepe" },
    sector: "Fintech",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Groww",
    domain: "groww.in",
    careersUrl: "https://groww.in/careers",
    knownAts: { type: "greenhouse", token: "groww" },
    sector: "Fintech",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Freshworks",
    domain: "freshworks.com",
    careersUrl: "https://careers.smartrecruiters.com/Freshworks",
    knownAts: { type: "smartrecruiters", token: "Freshworks" },
    sector: "SaaS",
    tier: "PUBLIC",
    location: "Chennai, India"
  },
  {
    name: "BrowserStack",
    domain: "browserstack.com",
    careersUrl: "https://www.browserstack.com/careers",
    knownAts: { type: "workday", token: "browserstack.wd3.myworkdayjobs.com/External" },
    sector: "DevTools",
    tier: "UNICORN",
    location: "Mumbai, India"
  },
  {
    name: "Sarvam AI",
    domain: "sarvam.ai",
    careersUrl: "https://sarvam.ai/careers",
    knownAts: { type: "ashby", token: "sarvam" },
    sector: "AI/ML",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },

  // ==========================================
  // 2. Artificial Intelligence & Frontier Labs
  // ==========================================
  {
    name: "Krutrim",
    domain: "krutrim.com",
    sector: "AI/ML",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Yellow.ai",
    domain: "yellow.ai",
    sector: "AI/ML",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Haptik",
    domain: "haptik.ai",
    sector: "AI/ML",
    tier: "SOONICORN",
    location: "Mumbai, India"
  },
  {
    name: "DevRev",
    domain: "devrev.ai",
    sector: "AI/ML",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Observe.ai",
    domain: "observe.ai",
    sector: "AI/ML",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Segmind",
    domain: "segmind.com",
    sector: "AI/ML",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Leena AI",
    domain: "leena.ai",
    sector: "AI/ML",
    tier: "SERIES_A_B",
    location: "Gurugram, India"
  },
  {
    name: "Gupshup",
    domain: "gupshup.io",
    sector: "AI/ML",
    tier: "UNICORN",
    location: "Mumbai, India"
  },
  {
    name: "Karya",
    domain: "karya.in",
    sector: "AI/ML",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },

  // ==========================================
  // 3. SaaS & Developer Tools
  // ==========================================
  {
    name: "Hasura",
    domain: "hasura.io",
    knownAts: { type: "lever", token: "hasura" },
    sector: "DevTools",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "SigNoz",
    domain: "signoz.io",
    knownAts: { type: "ashby", token: "signoz" },
    sector: "DevTools",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Appsmith",
    domain: "appsmith.com",
    knownAts: { type: "lever", token: "appsmith" },
    sector: "DevTools",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Hoppscotch",
    domain: "hoppscotch.com",
    sector: "DevTools",
    tier: "SERIES_A_B",
    location: "Remote, India"
  },
  {
    name: "Chargebee",
    domain: "chargebee.com",
    sector: "SaaS",
    tier: "UNICORN",
    location: "Chennai, India"
  },
  {
    name: "Kissflow",
    domain: "kissflow.com",
    sector: "SaaS",
    tier: "SOONICORN",
    location: "Chennai, India"
  },
  {
    name: "Innovaccer",
    domain: "innovaccer.com",
    sector: "SaaS",
    tier: "UNICORN",
    location: "Noida, India"
  },
  {
    name: "Mindtickle",
    domain: "mindtickle.com",
    sector: "SaaS",
    tier: "UNICORN",
    location: "Pune, India"
  },
  {
    name: "Wingify",
    domain: "wingify.com",
    sector: "SaaS",
    tier: "BOOTSTRAPPED",
    location: "Delhi, India"
  },
  {
    name: "HackerRank",
    domain: "hackerrank.com",
    sector: "DevTools",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Druva",
    domain: "druva.com",
    sector: "SaaS",
    tier: "UNICORN",
    location: "Pune, India"
  },
  {
    name: "Icertis",
    domain: "icertis.com",
    sector: "SaaS",
    tier: "UNICORN",
    location: "Pune, India"
  },
  {
    name: "Sprinto",
    domain: "sprinto.com",
    sector: "SaaS",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Acceldata",
    domain: "acceldata.io",
    knownAts: { type: "lever", token: "acceldata" },
    sector: "DevTools",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },

  // ==========================================
  // 4. FinTech & WealthTech
  // ==========================================
  {
    name: "Zerodha",
    domain: "zerodha.com",
    sector: "Fintech",
    tier: "BOOTSTRAPPED",
    location: "Bengaluru, India"
  },
  {
    name: "Slice",
    domain: "sliceit.com",
    sector: "Fintech",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Jupiter",
    domain: "jupiter.money",
    sector: "Fintech",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Fi Money",
    domain: "fi.money",
    sector: "Fintech",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Cashfree Payments",
    domain: "cashfree.com",
    sector: "Fintech",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Navi",
    domain: "navi.com",
    sector: "Fintech",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "INDmoney",
    domain: "indmoney.com",
    sector: "Fintech",
    tier: "SOONICORN",
    location: "Gurugram, India"
  },
  {
    name: "Jar",
    domain: "jar.app",
    sector: "Fintech",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Uni Cards",
    domain: "uni.cards",
    sector: "Fintech",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Decentro",
    domain: "decentro.tech",
    sector: "Fintech",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },

  // ==========================================
  // 5. Cybersecurity & Privacy
  // ==========================================
  {
    name: "Safe Security",
    domain: "safe.security",
    sector: "Cybersecurity",
    tier: "SOONICORN",
    location: "Delhi, India"
  },
  {
    name: "CloudSEK",
    domain: "cloudsek.com",
    sector: "Cybersecurity",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Privado",
    domain: "privado.ai",
    sector: "Cybersecurity",
    tier: "SERIES_A_B",
    location: "Bengaluru, India"
  },
  {
    name: "Securonix",
    domain: "securonix.com",
    sector: "Cybersecurity",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Quick Heal",
    domain: "quickheal.co.in",
    sector: "Cybersecurity",
    tier: "PUBLIC",
    location: "Pune, India"
  },

  // ==========================================
  // 6. E-Commerce, Quick-Commerce & Logistics
  // ==========================================
  {
    name: "Zepto",
    domain: "zeptonow.com",
    sector: "Ecommerce",
    tier: "UNICORN",
    location: "Mumbai, India"
  },
  {
    name: "Swiggy",
    domain: "swiggy.com",
    sector: "Ecommerce",
    tier: "PUBLIC",
    location: "Bengaluru, India"
  },
  {
    name: "Zomato",
    domain: "zomato.com",
    sector: "Ecommerce",
    tier: "PUBLIC",
    location: "Gurugram, India"
  },
  {
    name: "Blinkit",
    domain: "blinkit.com",
    sector: "Ecommerce",
    tier: "UNICORN",
    location: "Gurugram, India"
  },
  {
    name: "Urban Company",
    domain: "urbancompany.com",
    sector: "Ecommerce",
    tier: "UNICORN",
    location: "Gurugram, India"
  },
  {
    name: "Porter",
    domain: "porter.in",
    sector: "Logistics",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Delhivery",
    domain: "delhivery.com",
    sector: "Logistics",
    tier: "PUBLIC",
    location: "Gurugram, India"
  },
  {
    name: "Shadowfax",
    domain: "shadowfax.in",
    sector: "Logistics",
    tier: "SOONICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Shiprocket",
    domain: "shiprocket.in",
    sector: "Logistics",
    tier: "UNICORN",
    location: "Delhi, India"
  },
  {
    name: "Licious",
    domain: "licious.in",
    sector: "Ecommerce",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },

  // ==========================================
  // 7. Product, Mobility & Consumer Tech
  // ==========================================
  {
    name: "InMobi",
    domain: "inmobi.com",
    sector: "Product",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Dream11",
    domain: "dream11.com",
    sector: "Product",
    tier: "UNICORN",
    location: "Mumbai, India"
  },
  {
    name: "ShareChat",
    domain: "sharechat.com",
    sector: "Product",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Ather Energy",
    domain: "atherenergy.com",
    sector: "Product",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Ola",
    domain: "olacabs.com",
    sector: "Product",
    tier: "UNICORN",
    location: "Bengaluru, India"
  },
  {
    name: "Rapido",
    domain: "rapido.bike",
    sector: "Product",
    tier: "UNICORN",
    location: "Bengaluru, India"
  }
];
