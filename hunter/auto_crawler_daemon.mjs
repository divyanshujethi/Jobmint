/**
 * Autonomous RoleNest Daily Job Crawler Daemon
 * Periodically crawls Greenhouse, Lever, and Ashby boards for tech jobs in India.
 * Managed by PM2 with auto-restart on system reboot.
 */

const INTERVAL_MS = 6 * 60 * 60 * 1000; // Crawl every 6 hours (4 times daily)
const CRAWL_URL = "http://localhost:3000/api/alligators/jobs/crawl";

async function executeCrawl() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [AutoCrawler] Starting scheduled crawl cycle...`);

  try {
    const res = await fetch(CRAWL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: "india-truth-cron-secret-2026" }),
    });

    if (!res.ok) {
      console.error(`[${new Date().toISOString()}] [AutoCrawler] HTTP error ${res.status}: ${res.statusText}`);
      return;
    }

    const data = await res.json();
    if (data.success && data.data?.stats) {
      const { totalCrawled, accepted, insertedToDatabase, updatedInDatabase, closedDeactivated, deadPurged } = data.data.stats;
      console.log(
        `[${new Date().toISOString()}] [AutoCrawler] Success: ${totalCrawled} crawled, ${accepted} accepted, +${insertedToDatabase} new, ~${updatedInDatabase} refreshed, -${closedDeactivated || 0} closed deactivated, -${deadPurged || 0} purged.`
      );
    } else {
      console.log(`[${new Date().toISOString()}] [AutoCrawler] Response:`, data);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [AutoCrawler] Crawl failed with error:`, err.message || err);
  }
}

// Initial crawl check 30 seconds after startup (allows Next.js server to stabilize)
setTimeout(() => {
  executeCrawl();
}, 30 * 1000);

// Recurring cycle every 6 hours
setInterval(executeCrawl, INTERVAL_MS);

console.log("[AutoCrawler Daemon] Initialized. Running every 6 hours.");
