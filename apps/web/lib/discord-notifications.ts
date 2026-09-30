// apps/web/lib/discord-notifications.ts
// Live Discord Webhook & REST API notifications for RoleNest

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();
const GUILD_ID = (process.env.DISCORD_GUILD_ID || "1554952372910952460").trim();
const API_BASE = "https://discord.com/api/v10";

export const DISCORD_CHANNELS = {
  ANNOUNCEMENTS: "1554956730742341662",
  WELCOME_VERIFY: "1554956723406643332",
  DAILY_STANDUP: "1554956768604323986",
  DEVSHELF_PR: "1554956772635189270",
  HALL_OF_FAME: "1554956784282763355",
  ADMIN_SECURITY: "1554958481587576893",
  FACULTY_REVIEW_LOGS: "1554963363472212108",
  FACULTY_LOUNGE: "1554963365338685573",
} as const;

export const DISCORD_ROLES = {
  FOUNDER_ADMIN: "1554960532992434260",
  MENTOR: "1554956689709605004",
  VERIFIED_INTERN: "1554956693115248671",
  SANDBOX_COHORT: "1554956696588390492",
  AIML_SPECIALIST: "1554956703743611011",
  DATA_SCIENTIST: "1554971548329181256",
  PROMPT_ENGINEER: "1554971552833871882",
  COMPUTER_VISION: "1554971556621328388",
  FULLSTACK_ENGINEER: "1554956707166167134",
  NEXTJS_ARCHITECT: "1554961437405876238",
  CORE_BROWSER: "1554971564070543482",
  MOBILE_SYSTEMS: "1554971568663298068",
  SAAS_ARCHITECT: "1554971573062991952",
  CYBER_SECURITY: "1554956710978781213",
  REVERSE_ENGINEERING: "1554971579601920000",
  CLOUD_DEVOPS: "1554961442258685982",
  NETWORKING: "1554971585570537483",
  EDGE_CDN: "1554971590909894806",
  SERVERLESS_WASM: "1554971594768785490",
  DATABASE_STORAGE: "1554971598950236262",
  POSTGRESQL_ARCHITECT: "1554971603048206366",
  DISTRIBUTED_SYSTEMS: "1554971606659502240",
  COMPILER_VM: "1554971609872339069",
  SYSTEM_DESIGN: "1554971614007787700",
  BLOCKCHAIN_WEB3: "1554961447140724898",
  GAME_ENGINE: "1554971619489751121",
  WEBGL_MULTIPLAYER: "1554971622820286557",
  SHADERS_GRAPHICS: "1554971627580559461",
  HEALTHTECH: "1554971631624126564",
  GIT_INTERNALS: "1554971637005426719",
  PYTHON_AUTOMATION: "1554971641111379989",
  ENTERPRISE_JAVA: "1554971644928335943",
  TYPESCRIPT_V8: "1554971648401346743",
  QA_AUTOMATION: "1554971653430313023",
  SEO_PERFORMANCE: "1554971657372966974",
  DEV_TOOLING: "1554971661890228235",
} as const;

export const TRACK_DISCORD_ROLES: Record<string, { roleId: string; roleName: string; channelName: string }> = {
  "ai-ml": { roleId: "1554956703743611011", roleName: "⚡ AI / ML Specialist", channelName: "ai-machine-learning" },
  "data-scientist": { roleId: "1554971548329181256", roleName: "📊 Data Scientist", channelName: "data-science-modeling" },
  "prompt-engineering": { roleId: "1554971552833871882", roleName: "🤖 GenAI & LLM Engineer", channelName: "prompt-engineering-genai" },
  "computer-vision": { roleId: "1554971556621328388", roleName: "👁️ Computer Vision Specialist", channelName: "computer-vision-yolo" },
  "fullstack-nextjs": { roleId: "1554956707166167134", roleName: "🌐 Full-Stack Engineer", channelName: "fullstack-web-dev" },
  "nextjs": { roleId: "1554961437405876238", roleName: "⚡ Next.js Architect", channelName: "nextjs-architects" },
  "web": { roleId: "1554971564070543482", roleName: "🖥️ Core Browser Engineer", channelName: "core-browser-engineering" },
  "web-mobile-dev": { roleId: "1554971568663298068", roleName: "📱 Mobile Systems Engineer", channelName: "cross-platform-mobile" },
  "saas": { roleId: "1554971573062991952", roleName: "🏢 SaaS Architect", channelName: "production-saas-arch" },
  "cyber-security": { roleId: "1554956710978781213", roleName: "🛡️ Cyber Security Analyst", channelName: "cyber-security-ops" },
  "reverse-engineering": { roleId: "1554971579601920000", roleName: "🔍 Reverse Engineering Specialist", channelName: "binary-reverse-eng" },
  "sre": { roleId: "1554961442258685982", roleName: "☁️ Cloud / DevOps Engineer", channelName: "cloud-sre-devops" },
  "networking": { roleId: "1554971585570537483", roleName: "🌐 Network Protocol Engineer", channelName: "networking-protocols" },
  "cdn-architecture": { roleId: "1554971590909894806", roleName: "⚡ Edge CDN Engineer", channelName: "edge-cdn-shielding" },
  "edge-computing": { roleId: "1554971594768785490", roleName: "🚀 Serverless WASM Engineer", channelName: "serverless-wasm-edge" },
  "database-management": { roleId: "1554971598950236262", roleName: "💾 Database Storage Engineer", channelName: "database-storage-engines" },
  "sql": { roleId: "1554971603048206366", roleName: "🐘 PostgreSQL Architect", channelName: "advanced-sql-postgres" },
  "distributed-systems": { roleId: "1554971606659502240", roleName: "🔄 Distributed Systems Engineer", channelName: "distributed-systems-raft" },
  "compiler-tooling": { roleId: "1554971609872339069", roleName: "⚙️ Compiler & VM Engineer", channelName: "compiler-bytecode-vms" },
  "system-design": { roleId: "1554971614007787700", roleName: "🏗️ Systems Architect", channelName: "large-scale-system-design" },
  "blockchain": { roleId: "1554961447140724898", roleName: "⛓️ Blockchain / Web3 Engineer", channelName: "blockchain-web3" },
  "game-development": { roleId: "1554971619489751121", roleName: "🎮 3D Game Engine Developer", channelName: "game-dev-physics-3d" },
  "web-game-dev": { roleId: "1554971622820286557", roleName: "🕹️ WebGL & Multiplayer Dev", channelName: "webgl-threejs-multiplayer" },
  "graphics-engineering": { roleId: "1554971627580559461", roleName: "🎨 Graphics & Shaders Dev", channelName: "shaders-glsl-vulkan" },
  "health-tech": { roleId: "1554971631624126564", roleName: "🏥 HealthTech Systems Engineer", channelName: "healthtech-fhir-protocols" },
  "developer-sandbox": { roleId: "1554956696588390492", roleName: "🚀 Sandbox Testing Cohort", channelName: "developer-sandbox" },
  "git": { roleId: "1554971637005426719", roleName: "🐙 Git Internals Specialist", channelName: "git-internals-plumbing" },
  "python-automation": { roleId: "1554971641111379989", roleName: "🐍 Python Automation Engineer", channelName: "python-automation-fullstack" },
  "enterprise-java": { roleId: "1554971644928335943", roleName: "☕ Enterprise Java Engineer", channelName: "enterprise-java-spring" },
  "ts-js": { roleId: "1554971648401346743", roleName: "📐 TypeScript & V8 Specialist", channelName: "typescript-v8-internals" },
  "automation": { roleId: "1554971653430313023", roleName: "🧪 QA Automation Engineer", channelName: "qa-playwright-automation" },
  "seo": { roleId: "1554971657372966974", roleName: "⚡ Web Performance & SEO Eng", channelName: "technical-seo-performance" },
  "developer-tooling": { roleId: "1554971661890228235", roleName: "🛠️ Developer Tooling Architect", channelName: "developer-cli-tooling" },
};


export async function sendDiscordMessage(channelId: string, payload: { content?: string; embeds?: any[] }) {
  try {
    const res = await fetch(`${API_BASE}/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`[Discord Notification] Channel ${channelId} failed (${res.status}): ${err}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Discord Notification] Network error:", error);
    return false;
  }
}

/**
 * 1. Social Proof: New Enrollment Alert
 */
export async function notifyDiscordEnrollment(params: {
  studentName: string;
  collegeName: string;
  trackTitle: string;
  amountPaid: number;
  isSandbox?: boolean;
  offerLetterId: string;
}) {
  const { studentName, collegeName, trackTitle, amountPaid, isSandbox, offerLetterId } = params;

  // Public Announcement Embed (Hype & Social Proof)
  const publicEmbed = {
    title: isSandbox ? "🚀 New Candidate Joined Free Sandbox Track!" : "🎉 New Industrial Intern Enrolled!",
    description: `Welcome **${studentName}** to the **${trackTitle}** cohort!`,
    color: isSandbox ? 0x8b5cf6 : 0x10b981,
    fields: [
      { name: "🏛️ Institution", value: collegeName || "Affiliated Engineering Institution", inline: true },
      { name: "📜 Credential Ref", value: `\`${offerLetterId}\``, inline: true },
      { name: "⭐ AICTE Framework", value: "4 Academic Credits (160 Lab Hours)", inline: true },
    ],
    footer: { text: "RoleNest Virtual Labs • Live Cohort Activity" },
    timestamp: new Date().toISOString(),
  };

  // Private Admin Log Embed (Revenue & Security Audit)
  const adminEmbed = {
    title: "🔒 Enrollment Audit Log",
    description: `New registration recorded in PostgreSQL ledger.`,
    color: isSandbox ? 0xa855f7 : 0x059669,
    fields: [
      { name: "Student", value: studentName, inline: true },
      { name: "Track", value: trackTitle, inline: true },
      { name: "Payment", value: isSandbox ? "₹0 (Free Sandbox)" : `₹${amountPaid} Paid`, inline: true },
      { name: "College", value: collegeName || "N/A", inline: false },
      { name: "Appointment Letter ID", value: `\`${offerLetterId}\``, inline: false },
    ],
    footer: { text: "RoleNest Security Telemetry" },
    timestamp: new Date().toISOString(),
  };

  await Promise.all([
    sendDiscordMessage(DISCORD_CHANNELS.ANNOUNCEMENTS, { embeds: [publicEmbed] }),
    sendDiscordMessage(DISCORD_CHANNELS.ADMIN_SECURITY, { embeds: [adminEmbed] }),
  ]);
}

/**
 * 2. Daily Standup: Task & GitHub Deliverable Submission Alert
 */
export async function notifyDiscordTaskSubmitted(params: {
  studentName: string;
  trackTitle: string;
  dayNumber: number;
  deliverable: string;
  commitSha?: string;
  additions?: number;
  deletions?: number;
  auditScore?: number;
  githubUrl: string;
}) {
  const { studentName, trackTitle, dayNumber, deliverable, commitSha, additions = 0, deletions = 0, auditScore = 95, githubUrl } = params;

  const embed = {
    title: `✅ Day ${dayNumber} Milestone Verified: ${studentName}`,
    description: `Successfully passed in-browser tests and pushed verified code for **${trackTitle}**!`,
    color: 0x06b6d4,
    fields: [
      { name: "📦 Deliverable", value: `\`${deliverable}\``, inline: true },
      { name: "🛡️ Audit Score", value: `${auditScore}/100 (Pass)`, inline: true },
      { name: "📊 Code Diff", value: `+${additions} / -${deletions} lines`, inline: true },
      { name: "🔗 GitHub Link", value: `[View Commit](${githubUrl})`, inline: false },
    ],
    footer: { text: `Day ${dayNumber}/28 Progress • RoleNest Virtual Labs` },
    timestamp: new Date().toISOString(),
  };

  await Promise.all([
    sendDiscordMessage(DISCORD_CHANNELS.DAILY_STANDUP, { embeds: [embed] }),
    sendDiscordMessage(DISCORD_CHANNELS.FACULTY_REVIEW_LOGS, { embeds: [embed] }),
  ]);
}

/**
 * 3. Hall of Fame: Certificate Graduation Alert
 */
export async function notifyDiscordCertificateIssued(params: {
  studentName: string;
  trackTitle: string;
  certificateId: string;
  verificationUrl: string;
  grade?: string;
}) {
  const { studentName, trackTitle, certificateId, verificationUrl, grade = "A+" } = params;

  const embed = {
    title: `🏆 CONGRATULATIONS: ${studentName} Graduated!`,
    description: `Official AICTE 4-Credit Industrial Internship Certificate Issued for **${trackTitle}**!`,
    color: 0xf59e0b,
    fields: [
      { name: "🎓 Graduate", value: studentName, inline: true },
      { name: "⭐ Final Grade", value: grade, inline: true },
      { name: "📜 Credential ID", value: `\`${certificateId}\``, inline: true },
      { name: "🔍 Public Verification Ledger", value: `[Verify Certificate on RoleNest](${verificationUrl})`, inline: false },
    ],
    footer: { text: "AICTE / UGC 4-Credit Practical Framework • RoleNest Honors" },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(DISCORD_CHANNELS.HALL_OF_FAME, { embeds: [embed] });
}

/**
 * 4. Admin Security Alert: Revocation or Chargeback Log
 */
export async function notifyDiscordSecurityAlert(params: {
  type: "REVOCATION" | "CHARGEBACK" | "FRAUD_ATTEMPT";
  studentName: string;
  rollNumber: string;
  reason: string;
  enrollmentId: string;
}) {
  const { type, studentName, rollNumber, reason, enrollmentId } = params;

  const embed = {
    title: `⛔ SECURITY NOTICE: Enrollment Status Set to ${type}`,
    description: `A credential invalidation event occurred on the industrial portal.`,
    color: 0xdc2626,
    fields: [
      { name: "Student Name", value: studentName, inline: true },
      { name: "Roll Number", value: rollNumber || "N/A", inline: true },
      { name: "Enrollment ID", value: `\`${enrollmentId}\``, inline: false },
      { name: "Revocation Reason", value: reason, inline: false },
      { name: "Action Taken", value: "Offer Letter, College NOC & Certificate watermarked with VOID / REVOKED notice.", inline: false },
    ],
    footer: { text: "RoleNest Internal Security Stream" },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(DISCORD_CHANNELS.ADMIN_SECURITY, { embeds: [embed] });
}

/**
 * 5. Automated Student Role Assignment via Discord API
 */
export async function assignDiscordStudentRole(discordUserId: string, roleId: string) {
  try {
    const res = await fetch(`${API_BASE}/guilds/${GUILD_ID}/members/${discordUserId}/roles/${roleId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });
    return res.ok;
  } catch (error) {
    console.error("[Discord Role Assignment] Error:", error);
    return false;
  }
}
