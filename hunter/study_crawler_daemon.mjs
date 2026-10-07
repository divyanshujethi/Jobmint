/**
 * RoleNest Autonomous Study & Engineering Curriculum Crawler Daemon
 * Periodically crawls:
 * 1. Engineering Career Roadmaps (Refreshes curriculum, verifies live resources)
 * 2. Top-tier YouTube Video Courses & Masterclasses
 *
 * Runs every 7 days (or configurable interval) with auto-restart via PM2.
 */

const INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // Crawl every 7 days (weekly)
const LOCAL_WEB_BASE = process.env.WEB_BASE_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "india-truth-cron-secret-2026";

async function executeStudyCrawl() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [StudyCrawlerDaemon] Starting scheduled study curriculum & YouTube crawl cycle...`);

  try {
    const url = `${LOCAL_WEB_BASE}/api/cron/study-crawler?type=all&verify=true&limit=8&secret=${encodeURIComponent(CRON_SECRET)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`[${new Date().toISOString()}] [StudyCrawlerDaemon] HTTP error ${res.status}: ${res.statusText}`);
      return;
    }

    const data = await res.json();
    if (data.success && data.data) {
      const { roadmaps, youtube } = data.data;
      console.log(
        `[${new Date().toISOString()}] [StudyCrawlerDaemon] Success: Roadmaps updated: ${
          roadmaps?.totalRoadmapsUpdated ?? 0
        }, YouTube refreshed: ${youtube?.refreshedCount ?? 0} (+${youtube?.newAdditions ?? 0} new).`
      );
    } else {
      console.log(`[${new Date().toISOString()}] [StudyCrawlerDaemon] Response:`, data);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [StudyCrawlerDaemon] Crawl failed with error:`, err.message || err);
  }
}

// Initial crawl 45 seconds after process launch (allowing Next.js to start completely)
setTimeout(() => {
  executeStudyCrawl();
}, 45 * 1000);

// Recurring weekly execution
setInterval(executeStudyCrawl, INTERVAL_MS);

console.log("[StudyCrawlerDaemon] Initialized. Recurring execution configured for every 7 days (weekly).");
